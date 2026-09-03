import { randomBytes } from 'node:crypto'

import type { Payload } from 'payload'

import { formatOrderNumber } from '@/lib/order-number'
import { siteOrigin } from '@/lib/site-url'

const TOKEN_BYTES = 16

export function createDepositReceiptToken(): string {
  return randomBytes(TOKEN_BYTES).toString('base64url')
}

/** Short public path — domain lives in the SMS.ir template. */
export function depositReceiptPath(token: string): string {
  return `/r/${token}`
}

export function depositReceiptUrl(token: string): string {
  return `${siteOrigin()}${depositReceiptPath(token)}`
}

export async function findOrderByDepositToken(payload: Payload, token: string) {
  const trimmed = token.trim()
  if (!trimmed) return null
  const { docs } = await payload.find({
    collection: 'orders',
    where: { depositReceiptToken: { equals: trimmed } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })
  return docs[0] ?? null
}

export function depositReceiptReady(order: {
  depositAmount?: number | null
  lastDepositSms?: { ok?: boolean | null } | null
}): boolean {
  if (order.depositAmount != null && order.depositAmount >= 1) return true
  return order.lastDepositSms?.ok === true
}

export function orderReceiptTitle(orderId: number): string {
  return `شماره ${formatOrderNumber(orderId)}`
}
