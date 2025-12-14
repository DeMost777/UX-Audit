# Fix: Email Confirmation Issue

## Problem

After signing up, you can't sign in because Supabase requires email confirmation by default.

## Solution Options

### Option 1: Disable Email Confirmation (Recommended for Development)

1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/yrcschdxvruqpxcjqtnk
2. Navigate to: **Authentication** → **Providers** → **Email**
3. Find **"Confirm email"** setting
4. **Turn OFF** "Confirm email" toggle
5. Click **Save**

Now users can sign in immediately after signup without email confirmation.

### Option 2: Keep Email Confirmation (Production)

If you want to keep email confirmation enabled:

1. Users will receive a confirmation email after signup
2. They must click the link in the email to confirm their account
3. Only then can they sign in

**To configure email templates:**
- Go to: **Authentication** → **Email Templates**
- Customize the confirmation email

### Option 3: Auto-Confirm Users (Development Only)

You can also auto-confirm users in your code (NOT recommended for production):

```typescript
// In signup page, after signUp:
if (data.user && !data.user.email_confirmed_at) {
  // Auto-confirm (only for development)
  await supabase.auth.admin.updateUserById(data.user.id, {
    email_confirm: true
  })
}
```

**⚠️ Warning**: This requires service role key and should only be used in development.

## Current Behavior

After the fix:
- Signup page shows a message if email confirmation is required
- Signin page shows a helpful error message if account isn't confirmed
- Users are guided to check their email

## Recommended Setup

For **development/testing**: Disable email confirmation (Option 1)
For **production**: Keep email confirmation enabled (Option 2)

## Check Your Supabase Settings

1. Go to: https://supabase.com/dashboard/project/yrcschdxvruqpxcjqtnk/auth/providers
2. Check the **Email** provider settings
3. Look for **"Confirm email"** toggle

## Testing

After disabling email confirmation:
1. Sign up with a new account
2. You should be able to sign in immediately
3. No email confirmation needed

---

**Quick Fix**: The easiest solution is to disable email confirmation in Supabase settings for now.

