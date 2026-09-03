import type { CollectionBeforeChangeHook } from 'payload'

const FROZEN = [
  'items',
  'galleryItems',
  'productNote',
  'otherQuantity',
  'customerName',
  'phone',
  'deliveryDate',
  'notes',
  'sampleImage',
  'depositReceipt',
  'depositReceiptToken',
  'depositReceiptAt',
] as const

/**
 * Status and SMS notes are the only fields the baker changes. A save that
 * omits the read-only arrays would otherwise wipe what the customer ordered.
 */
const KEEP_IF_OMITTED = ['depositAmount', 'lastDepositSms'] as const

export const preserveSubmittedOrder: CollectionBeforeChangeHook = ({
  data,
  originalDoc,
  operation,
  context,
}) => {
  if (context.skipPreserve) return data
  if (operation !== 'update' || !originalDoc) return data
  const next = { ...data }
  for (const key of FROZEN) {
    next[key] = originalDoc[key]
  }
  for (const key of KEEP_IF_OMITTED) {
    if (next[key] === undefined) next[key] = originalDoc[key]
  }
  return next
}
