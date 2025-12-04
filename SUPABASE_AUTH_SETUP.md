# Enable Email/Password Authentication in Supabase

The error "Email logins are disabled" means email/password authentication is turned off in your Supabase project.

## Quick Fix: Enable Email/Password Auth

1. **Go to Supabase Dashboard**
   - Visit: https://supabase.com/dashboard
   - Select your project

2. **Navigate to Authentication Settings**
   - Click **"Authentication"** in the left sidebar
   - Click **"Providers"** (or go directly to: Authentication → Providers)

3. **Enable Email Provider**
   - Find **"Email"** in the list of providers
   - Toggle it **ON** (enable it)
   - The toggle should turn green/blue when enabled

4. **Configure Email Settings (Optional)**
   - You can customize:
     - **Confirm email**: Require email confirmation before login (recommended: OFF for admin users)
     - **Secure email change**: Require confirmation for email changes
     - **Email templates**: Customize the emails sent

5. **Save Settings**
   - Changes are saved automatically

## For Admin Users (Recommended Settings)

Since this is an admin dashboard, you probably want:

- ✅ **Email provider**: Enabled
- ✅ **Confirm email**: **Disabled** (so you can log in immediately)
- ✅ **Secure email change**: Optional (your choice)

## Verify It's Working

After enabling:

1. Try logging in again at `/admin/login`
2. If you still see the error, wait a few seconds for changes to propagate
3. Check that your user exists in: Authentication → Users

## Create Admin User (If Needed)

If you don't have a user yet:

1. Go to: **Authentication** → **Users**
2. Click **"Add user"** → **"Create new user"**
3. Enter:
   - **Email**: Your admin email
   - **Password**: Create a strong password
   - ✅ **Auto Confirm User**: Check this box (so you can log in immediately)
4. Click **"Create user"**

## Direct Links

- **Supabase Dashboard**: https://supabase.com/dashboard
- **Authentication Providers**: https://supabase.com/dashboard/project/_/auth/providers
- **Users Management**: https://supabase.com/dashboard/project/_/auth/users

## Troubleshooting

**Still seeing "Email logins are disabled"?**
- Make sure you're looking at the correct Supabase project
- Refresh the page after enabling
- Check that the Email provider toggle is actually ON (green/blue)

**"User not found" or "Invalid credentials"?**
- Verify the user exists in Authentication → Users
- Check that "Auto Confirm User" was checked when creating the user
- Try resetting the password if needed

After enabling email authentication, your login should work! 🎉

