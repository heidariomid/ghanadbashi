import type { CollectionBeforeOperationHook, Where } from 'payload'

import { toLatinDigits } from '@/lib/format'
import { parseOrderNumberTerm } from '@/lib/order-number'

/**
 * Payload list search calls beforeOperation with `read` (not `find`).
 * The box uses `like` on text fields, so integer `id` and Persian digits
 * never match unless we rewrite the where.
 */
export const expandOrderSearch: CollectionBeforeOperationHook = ({ args, operation, req }) => {
  if (operation !== 'read' && operation !== 'count') return args
  if (!hasWhere(args)) return args

  const query = req.query as { search?: unknown } | undefined
  if (typeof query?.search === 'string') {
    query.search = toLatinDigits(query.search)
  }

  const where = args.where
  if (!where) return args

  const terms = collectSearchTerms(where)
  if (typeof query?.search === 'string' && query.search.trim()) {
    terms.add(query.search)
  }

  const withoutVirtual = stripOrderNumberField(latinizeWhereDigits(where)) as Where
  const orderIds = [...terms]
    .map(parseOrderNumberTerm)
    .filter((id): id is number => id != null)

  if (orderIds.length === 0) {
    return { ...args, where: withoutVirtual }
  }

  let next = withoutVirtual
  for (const id of orderIds) {
    next = addIdEquals(next, id)
  }

  return { ...args, where: next }
}

/** Any admin list `like` / `contains` — Persian and English digits both match. */
export const latinizeListSearch: CollectionBeforeOperationHook = ({ args, operation, req }) => {
  if (operation !== 'read' && operation !== 'count') return args
  if (!hasWhere(args)) return args

  const query = req.query as { search?: unknown } | undefined
  if (typeof query?.search === 'string') {
    query.search = toLatinDigits(query.search)
  }

  const where = args.where
  if (!where) return args
  return { ...args, where: latinizeWhereDigits(where) as Where }
}

function hasWhere(args: object): args is { where?: Where } {
  return 'where' in args
}

function latinizeWhereDigits(node: unknown): unknown {
  if (Array.isArray(node)) return node.map(latinizeWhereDigits)
  if (!isRecord(node)) return node

  const next: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(node)) {
    if (isRecord(value) && isConstraint(value)) {
      next[key] = latinizeConstraint(value)
    } else {
      next[key] = latinizeWhereDigits(value)
    }
  }
  return next
}

function latinizeConstraint(value: Record<string, unknown>): Record<string, unknown> {
  const next = { ...value }
  for (const op of ['like', 'contains', 'equals'] as const) {
    if (typeof next[op] === 'string') next[op] = toLatinDigits(next[op])
  }
  return next
}

function stripOrderNumberField(node: unknown): unknown {
  if (Array.isArray(node)) {
    return node
      .map(stripOrderNumberField)
      .filter((item) => item != null && !isEmptyOr(item))
  }
  if (!isRecord(node)) return node

  if ('orderNumber' in node && Object.keys(node).length === 1) return null

  const next: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(node)) {
    if (key === 'orderNumber') continue
    next[key] = stripOrderNumberField(value)
  }
  if (Array.isArray(next.or)) {
    next.or = next.or.filter((item) => item != null && !isEmptyOr(item))
  }
  if (Array.isArray(next.and)) {
    next.and = next.and.filter((item) => item != null && !isEmptyOr(item))
  }
  return next
}

function isEmptyOr(node: unknown): boolean {
  return isRecord(node) && Array.isArray(node.or) && node.or.length === 0
}

function collectSearchTerms(node: unknown, terms = new Set<string>()): Set<string> {
  if (Array.isArray(node)) {
    for (const item of node) collectSearchTerms(item, terms)
    return terms
  }

  if (!isRecord(node)) return terms

  for (const [key, value] of Object.entries(node)) {
    if (key === 'customerName' || key === 'phone' || key === 'orderNumber') {
      const term = readLike(value)
      if (term) terms.add(term)
    }
    collectSearchTerms(value, terms)
  }

  return terms
}

function addIdEquals(where: Where, id: number): Where {
  const idClause: Where = { id: { equals: id } }

  if (Array.isArray(where.or)) {
    return { ...where, or: [...where.or, idClause] }
  }

  if (Array.isArray(where.and)) {
    let replaced = false
    const nextAnd = where.and.map((clause) => {
      if (replaced || !isSearchOr(clause)) return clause
      replaced = true
      return { ...clause, or: [...(clause.or ?? []), idClause] }
    })
    if (replaced) return { ...where, and: nextAnd }
    return { ...where, and: [...where.and, { or: [idClause] }] }
  }

  if (Object.keys(where).length === 0) return idClause
  return { and: [where, { or: [idClause] }] }
}

function isSearchOr(clause: unknown): clause is Where & { or: Where[] } {
  if (!isRecord(clause) || !Array.isArray(clause.or)) return false
  return clause.or.some(
    (item) =>
      isRecord(item) &&
      ('customerName' in item || 'phone' in item || 'id' in item),
  )
}

function readLike(value: unknown): string | null {
  if (!isRecord(value)) return null
  const raw = value.like ?? value.contains ?? value.equals
  return typeof raw === 'string' && raw.trim() ? raw : null
}

function isConstraint(value: Record<string, unknown>): boolean {
  return ['like', 'contains', 'equals'].some((op) => op in value)
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}
