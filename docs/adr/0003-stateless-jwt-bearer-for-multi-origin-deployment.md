# 0003. Stateless JWT Bearer Authentication for Multi-Origin Deployment

## Context
The application frontend (`thienhn0910.vercel.app`) and backend (`thienhn0910be.vercel.app`) are hosted on distinct subdomains on Vercel. Using `HttpOnly` cookies across different origins introduces complex CORS configuration, Third-Party Cookie blocking on Safari (ITP) and modern Chromium browsers, and preflight cookie stripping.

## Decision
We authenticate administrative requests using stateless JSON Web Tokens (JWT) stored in client `localStorage` and sent via standard `Authorization: Bearer <token>` HTTP request headers.

## Consequences
- Completely eliminates cross-origin cookie rejection and CORS credentials mismatch issues on Vercel.
- The backend remains completely stateless, enabling zero-config horizontal scaling on serverless functions.
- Token lifetime is strictly enforced by JWT expiration, and public APIs remain completely unauthenticated.
