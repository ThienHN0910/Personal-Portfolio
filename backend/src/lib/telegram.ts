export interface ContactNotificationPayload {
  name: string
  email: string
  subject: string
  message: string
  createdAt?: Date | string
}

export async function sendTelegramNotification(payload: ContactNotificationPayload): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID

  if (!token || !chatId) {
    // Silent no-op if env vars are not configured yet
    return false
  }

  try {
    const text = [
      `📬 *New Portfolio Inquiry Received*`,
      ``,
      `👤 *Sender:* ${escapeMarkdown(payload.name)}`,
      `📧 *Email:* ${escapeMarkdown(payload.email)}`,
      `📝 *Subject:* ${escapeMarkdown(payload.subject)}`,
      ``,
      `💬 *Message:*`,
      `${escapeMarkdown(payload.message)}`,
      ``,
      `⏱ _Received on ${new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}_`,
    ].join('\n')

    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'Markdown',
      }),
    })

    const data = (await response.json()) as { ok: boolean; description?: string }
    if (!data.ok) {
      console.warn('[Telegram] Failed to dispatch notification:', data.description)
      return false
    }

    return true
  } catch (error) {
    console.error('[Telegram] Error sending notification:', error)
    return false
  }
}

function escapeMarkdown(text: string): string {
  return text.replace(/[_*[\]()~`>#+-=|{}.!]/g, '\\$&')
}
