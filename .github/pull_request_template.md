# Security Audit Fixes — Critical & High Severity

## Summary
Hardens the Express API and admin frontend by addressing critical and high severity vulnerabilities identified during the security audit.

### Backend (`server/`)
- **Helmet** — adds secure HTTP headers (X-Content-Type-Options, X-Frame-Options, Strict-Transport-Security, etc.).
- **Rate limiting** — `express-rate-limit` throttles `/api/auth` to 20 requests / 15 min to mitigate brute-force and credential stuffing.
- **MongoDB query injection** — `express-mongo-sanitize` strips `$` and `.` keys from user input with a warning log on sanitize.
- **Body size limits** — `express.json` and `express.urlencoded` capped at 10 KB to reject oversized payloads.
- **CORS hardening** — WebSocket `origin` pinned to `FRONTEND_URL` instead of `*`; `Vary: Origin` header added.
- **JWT secret validation** — `server/controls/auth/index.js` and `server/middlewares/auth_middleware/index.js` now throw a fatal error at boot if `JWT_TOKEN` is unset, preventing silent fallback to a weak default.
- **Mass assignment fix** — `user_role` is no longer destructured from `req.body` during registration, blocking privilege escalation via role spoofing.
- **File upload hardening** — `multer` now generates a randomized filename (no `originalname` trust), whitelist-filters extensions to images only, and caps file size to 5 MB.
- **Error response sanitization** — `ApiResponse.error` no longer leaks internal `data` payloads in production (`NODE_ENV !== 'development'`).

### Frontend (`admin/src/`)
- **Admin route guard** — new `ProtectedAdmin` component decodes the JWT from the `token` cookie and blocks non-admin users from reaching the `/admin` layout, closing a client-side authorization bypass.

## Files Changed
- `server/app.js`
- `server/controls/auth/index.js`
- `server/middlewares/auth_middleware/index.js`
- `server/middlewares/file_handle/index.js`
- `server/utils/api_response.js`
- `server/package.json` / `server/package-lock.json` (new deps: helmet, express-rate-limit, express-mongo-sanitize)
- `admin/src/App.jsx`

## Test Plan
- [ ] Boot server without `JWT_TOKEN` set — should crash with fatal error.
- [ ] Register a new user — confirm `user_role` from body is ignored and defaults to non-admin.
- [ ] Upload a file with a non-image extension — should be rejected.
- [ ] Upload a file larger than 5 MB — should be rejected.
- [ ] Send a NoSQL injection payload (`{ "email": {"$gt": ""} }`) — confirm key is sanitized.
- [ ] Hit `/api/auth/login` 25 times within 15 minutes from one IP — confirm 429 returned.
- [ ] Open admin panel with a non-admin token — should redirect to `/login`.
- [ ] Verify response headers via `curl -I` — expect `X-Content-Type-Options: nosniff`, `X-Frame-Options`, etc.
- [ ] Confirm production error responses no longer include internal stack/data payloads.

## References
- OWASP API Security Top 10 (2023): API6:2023 (Mass Assignment), API4:2023 (Unrestricted Resource Consumption), API7:2023 (Server-Side Request Forgery — file handling), API8:2023 (Security Misconfiguration — headers/CORS).
