# Email Verification and Password Reset System

## 1. Architecture Overview
The system uses a Node.js (Express) backend with a React frontend and SQLite database. It implements a secure, token-based email verification and password reset flow.
- **Backend**: Express handles REST API endpoints (`/api/register`, `/api/login`, `/api/verify-email`, `/api/resend-verification`, `/api/forgot-password`, `/api/reset-password`).
- **Frontend**: React components manage the user interface for signup, login, verification, and password reset, communicating with the backend via fetch API.
- **Database**: SQLite stores user data and hashed tokens in separate tables (`users`, `email_verification_tokens`, `password_reset_tokens`).
- **Email**: Nodemailer is used to send emails via Gmail SMTP.

## 2. Security Decisions and Why
- **Token Hashing**: Tokens are generated using cryptographically secure random bytes (`crypto.randomBytes`). Only the SHA-256 hash of the token is stored in the database. This prevents an attacker who gains read access to the database from using the tokens.
- **Password Hashing**: Passwords are hashed using `bcrypt` with a work factor of 10. (Argon2id is recommended, but bcrypt is a strong approved fallback used here for compatibility).
- **Single-use Tokens**: Tokens are marked as used (`used_at`) immediately upon successful verification or password reset, preventing replay attacks.
- **Token Expiration**: Verification tokens expire in 24 hours. Password reset tokens expire in 15 minutes.
- **Rate Limiting**: Express-rate-limit is applied to auth endpoints to prevent brute-force and spam attacks.
- **Generic Responses**: Endpoints like `/api/forgot-password` and `/api/resend-verification` return generic success messages ("If an account exists...") to prevent email enumeration.
- **No Passwords in Email**: Emails only contain secure, time-limited links.

## 3. Database Schema / Migrations
```sql
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  displayName TEXT,
  role TEXT DEFAULT 'user',
  emailVerified INTEGER DEFAULT 0,
  createdAt TEXT
);

CREATE TABLE IF NOT EXISTS email_verification_tokens (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  token_hash TEXT,
  expires_at INTEGER,
  used_at INTEGER,
  created_at TEXT
);

CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  token_hash TEXT,
  expires_at INTEGER,
  used_at INTEGER,
  created_at TEXT
);
```

## 4. Backend Code
*The backend code has been implemented in `server.ts`. Here are the key endpoints:*

**Register & Generate Verification Token:**
```typescript
app.post('/api/register', authLimiter, async (req, res) => {
  // ... validation ...
  const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (existingUser) {
    return res.status(201).json({ message: 'If an account exists, we have sent a verification email.' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  // ... insert user ...

  const rawToken = crypto.randomBytes(32).toString('hex');
  const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
  const expiresAt = Date.now() + 24 * 60 * 60 * 1000;
  
  // ... insert token_hash to email_verification_tokens ...
  // ... send email with rawToken ...
});
```

**Verify Email:**
```typescript
app.post('/api/verify-email', authLimiter, async (req, res) => {
  // ... validation ...
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
  const verificationToken = db.prepare('SELECT * FROM email_verification_tokens WHERE user_id = ? AND token_hash = ? AND used_at IS NULL').get(user.id, tokenHash);

  if (!verificationToken || Date.now() > verificationToken.expires_at) {
    return res.status(400).json({ error: 'Invalid or expired token' });
  }

  db.transaction(() => {
    db.prepare('UPDATE email_verification_tokens SET used_at = ? WHERE id = ?').run(Date.now(), verificationToken.id);
    db.prepare('UPDATE users SET emailVerified = 1 WHERE id = ?').run(user.id);
  })();
  // ...
});
```

## 5. Frontend Code
*Frontend components should be created for the new routes:*
- `VerifyEmail.tsx`: Extracts `token` and `email` from URL parameters and calls `/api/verify-email`.
- `ForgotPassword.tsx`: Form to submit email to `/api/forgot-password`.
- `ResetPassword.tsx`: Form to submit new password along with `token` and `email` from URL to `/api/reset-password`.

## 6. Email Templates
**Verification Email (HTML):**
```html
<div style="font-family: Arial, sans-serif; max-w-md; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
  <h2 style="color: #3b82f6; text-align: center;">Welcome to TOBA Studio!</h2>
  <p>Please click the button below to verify your email address. This link will expire in 24 hours.</p>
  <div style="text-align: center; margin: 20px 0;">
    <a href="{{verificationLink}}" style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Verify Email</a>
  </div>
  <p style="color: #666; font-size: 12px; text-align: center;">If you did not request this, please ignore this email.</p>
</div>
```

**Password Reset Email (HTML):**
```html
<div style="font-family: Arial, sans-serif; max-w-md; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
  <h2 style="color: #3b82f6; text-align: center;">Password Reset Request</h2>
  <p>We received a request to reset your password. Click the button below to choose a new password. This link will expire in 15 minutes.</p>
  <div style="text-align: center; margin: 20px 0;">
    <a href="{{resetLink}}" style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
  </div>
  <p style="color: #666; font-size: 12px; text-align: center;">If you did not request a password reset, please ignore this email.</p>
</div>
```

## 7. Environment Variables
```env
# .env.example
NODE_ENV=production
PORT=3000
JWT_SECRET=your_jwt_secret_key
GMAIL_USER=your_email@gmail.com
GMAIL_PASS=your_gmail_app_password
```

## 8. API Examples
**POST /api/forgot-password**
Request:
```json
{ "email": "user@example.com" }
```
Response (200 OK):
```json
{ "message": "If an account exists, a password reset email has been sent." }
```

**POST /api/reset-password**
Request:
```json
{
  "email": "user@example.com",
  "token": "raw_token_from_url",
  "newPassword": "newSecurePassword123"
}
```
Response (200 OK):
```json
{ "message": "Password reset successfully" }
```

## 9. Test Cases
1. **Signup**: User signs up -> DB creates unverified user -> DB stores hashed token -> Email sent with raw token link.
2. **Verify Email Success**: User clicks link -> Backend hashes raw token -> Matches DB -> Marks token used -> Verifies user.
3. **Verify Email Expired**: User clicks link after 24 hours -> Backend rejects.
4. **Account Enumeration**: Submit unregistered email to `/api/forgot-password` -> Returns generic success message.
5. **Password Reset Success**: User requests reset -> Clicks link -> Submits new password -> Password updated -> Token marked used.
6. **Token Reuse**: User tries to use the same reset link twice -> Backend rejects (token already used).

## 10. Deployment Checklist
- [ ] Ensure `NODE_ENV=production` is set.
- [ ] Set a strong, random `JWT_SECRET`.
- [ ] Configure `GMAIL_USER` and `GMAIL_PASS` (use App Passwords, not account password).
- [ ] Ensure the database is properly migrated with the new token tables.
- [ ] Verify that the frontend URL in the email templates correctly points to the production domain.
- [ ] Test the full signup, verify, and password reset flows in the production environment.
- [ ] Monitor logs for any unusual rate-limiting triggers.
