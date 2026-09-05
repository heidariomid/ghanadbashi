import { resolveBakerNotificationPhone } from '@/lib/baker-notification'
import { publicOrderNumber } from '@/lib/order-number'
import { parametersForTemplate, parseTemplateId, sendSms } from '@/lib/sms'

/** Tell the baker a customer uploaded a deposit receipt — never blocks the upload. */
export async function notifyBakerDepositReceiptUploaded(
  orderId: number,
  customerName: string,
): Promise<void> {
  const templateId = parseTemplateId(process.env.SMSIR_TEMPLATE_DEPOSIT_RECEIVED)
  const mobile = await resolveBakerNotificationPhone()
  await sendSms({
    mobile,
    templateId,
    parameters: templateId
      ? parametersForTemplate(templateId, {
          ORDER: String(publicOrderNumber(orderId)),
          NAME: customerName.trim() || 'مشتری',
        })
      : {},
  })
}
