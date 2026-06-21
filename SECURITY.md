# Security Policy – Aura Beauty OS

Adhering to high-quality software engineering standards, we prioritize securing user credentials and data. Review our security guidelines and policy below.

---

## 🔒 Supported Versions

Only the active main release receives security updates:

| Version | Supported |
|---|---|
| `v2.x` | Yes (Active) |
| `v1.x` | No (Unsupported) |

---

## 🛡️ Reporting a Vulnerability

Do not open public GitHub issues for security weaknesses. Please email reports directly to: `security@aura.io`.

We acknowledge receipt of reports within **48 hours** and provide detailed resolutions or timeline schedules within **7 days**.

---

## ⚠️ Client-side Persistence Safety (LocalStorage)

Aura operates as a decentralized mock client app, storing password credentials inside the browser's `localStorage` (`AURA_USERS_DB` key).

- **Warning**: LocalStorage values are stored as plain JSON strings and are accessible to any scripts executing on the same domain context.
- **Production recommendation**: When upgrading to full cloud databases, replace local storage user profiles with secure cookie sessions (`HttpOnly`, `Secure`, `SameSite=Strict` flags) and hash credentials on servers using standard cryptographic algorithms (e.g. bcrypt/Argon2).
