# 0005. Multi-Channel Contact Notification via Nodemailer and Telegram Bot

## Context
When visitors submit messages via `/contact`, relying exclusively on email notifications carries a risk of delivery delays, spam filtering, or unread emails when the engineer is away from their inbox.

## Decision
We implement a multi-channel inbound pipeline: upon receiving a valid contact form payload, the backend:
1. Persists the message record to MongoDB.
2. Dispatches an email via Nodemailer SMTP.
3. Fires an asynchronous Telegram Bot API request (`https://api.telegram.org/bot<TOKEN>/sendMessage`) with Markdown-formatted message details directly to the engineer's private chat ID.

## Consequences
- Guarantees immediate, zero-latency push notifications directly to the engineer's mobile device via Telegram.
- Failure of either external notification channel (Email or Telegram) does not block database insertion or fail the user response.
- Requires two environment variables on the backend: `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID`.
