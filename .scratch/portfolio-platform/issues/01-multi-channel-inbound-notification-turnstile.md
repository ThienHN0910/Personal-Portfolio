# 01: Multi-Channel Inbound Notification & Turnstile Anti-Spam Pipeline

**What to build:** An end-to-end inbound communication system where prospective clients and collaborators submit messages through a public contact form protected by frictionless Cloudflare Turnstile CAPTCHA. Submissions are verified, persisted to MongoDB, and immediately dispatch a formatted Markdown notification card via Telegram Bot Webhook to the portfolio owner's private chat.

**Blocked by:** None (can start immediately)

**Status:** ready-for-agent

- [ ] Visitor can submit a name, email, subject, and message through the contact form
- [ ] Form submission is rejected if Cloudflare Turnstile verification fails or required fields are missing
- [ ] Valid messages are saved to MongoDB with an unread queue limit of 20 items to prevent database flooding
- [ ] Successful submission triggers an asynchronous, non-blocking Telegram Bot notification containing the sender's name, email, subject, message body, and timestamp
- [ ] If the Telegram Bot service fails or credentials are not configured, the message is still saved to MongoDB and the user receives a successful response without error
