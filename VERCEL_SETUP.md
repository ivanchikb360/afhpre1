# Vercel Environment Variables Setup

Your project is deployed but not connecting to Supabase because environment variables aren't set in Vercel.

## Quick Fix: Add Environment Variables to Vercel

### Step 1: Get Your Values from `.env.local`

Check your local `.env.local` file for these values:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `TWILIO_ACCOUNT_SID` (if using SMS)
- `TWILIO_AUTH_TOKEN` (if using SMS)
- `TWILIO_PHONE_NUMBER` (if using SMS)

### Step 2: Add to Vercel Dashboard

1. **Go to your Vercel project**

   - Visit: https://vercel.com/dashboard
   - Click on your project

2. **Navigate to Settings**

   - Click **"Settings"** tab (top navigation)
   - Click **"Environment Variables"** (left sidebar)

3. **Add Each Variable**
   For each variable, click **"Add New"** and enter:

   **Supabase Variables:**

   - **Key**: `NEXT_PUBLIC_SUPABASE_URL`
     **Value**: `https://your-project-id.supabase.co` (from your `.env.local`)
     **Environment**: Select all (Production, Preview, Development)

   - **Key**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     **Value**: `your-anon-key-here` (from your `.env.local`)
     **Environment**: Select all

   - **Key**: `SUPABASE_SERVICE_ROLE_KEY`
     **Value**: `your-service-role-key-here` (from your `.env.local`)
     **Environment**: Select all

   **Twilio Variables (if using SMS):**

   - **Key**: `TWILIO_ACCOUNT_SID`
     **Value**: `ACxxxxxxxxxxxxx` (from your `.env.local`)
     **Environment**: Select all

   - **Key**: `TWILIO_AUTH_TOKEN`
     **Value**: `your-auth-token` (from your `.env.local`)
     **Environment**: Select all

   - **Key**: `TWILIO_PHONE_NUMBER`
     **Value**: `+18445247702` (from your `.env.local`)
     **Environment**: Select all

4. **Save Each Variable**
   - Click **"Save"** after adding each one

### Step 3: Redeploy

After adding all variables:

1. Go to **"Deployments"** tab
2. Click the **"⋯"** (three dots) on your latest deployment
3. Click **"Redeploy"**
   - OR push a new commit to trigger a new deployment

**Important**: Vercel needs to rebuild with the new environment variables!

## Quick Copy-Paste Guide

If you want to copy values directly:

1. Open your `.env.local` file locally
2. Copy each value
3. Paste into Vercel dashboard

**Example:**

```
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Verify It's Working

After redeploying:

1. Submit a test lead on your live site
2. Check Supabase dashboard → **Table Editor** → **leads** table
3. You should see the new lead!

## Troubleshooting

### "Still not connecting after adding variables"

- ✅ Did you **redeploy** after adding variables? (Required!)
- ✅ Are variable names **exact matches**? (Case-sensitive!)
- ✅ Did you select **all environments** (Production, Preview, Development)?
- ✅ Check Vercel deployment logs for errors

### "How do I check if variables are set?"

1. Go to Vercel → Your Project → Settings → Environment Variables
2. You should see all your variables listed
3. Values are hidden (showing as `•••••`) for security

### "Variables are set but still not working"

- Check Vercel deployment logs: **Deployments** → Click deployment → **Build Logs**
- Look for errors about missing environment variables
- Make sure you redeployed AFTER adding the variables

## Direct Links

- **Vercel Dashboard**: https://vercel.com/dashboard
- **Environment Variables**: https://vercel.com/dashboard → Your Project → Settings → Environment Variables

## Summary

**The Problem**: `.env.local` only works locally. Vercel needs environment variables set in its dashboard.

**The Solution**:

1. Copy values from `.env.local`
2. Add them to Vercel → Settings → Environment Variables
3. Redeploy

That's it! Your production site will now connect to Supabase. 🚀
