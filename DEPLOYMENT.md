# Deployment & Environment Variables Guide

## How Environment Variables Work

### Local Development (`.env.local`)

- `.env.local` is for **your local machine only**
- It's **never committed to git** (already in `.gitignore`)
- You fill it with your Supabase credentials
- Next.js automatically loads it when you run `npm run dev`

### Production Deployment

When you deploy to production (Vercel, Netlify, Railway, etc.), you **don't upload the `.env.local` file**. Instead, you configure environment variables **in your hosting platform's dashboard**.

## How It Works: The Same Code, Different Sources

Your code reads from `process.env.NEXT_PUBLIC_SUPABASE_URL` - this works the same way everywhere:

- **Local**: Reads from `.env.local` file
- **Production**: Reads from your hosting platform's environment variables

The code doesn't know the difference - it just reads from `process.env`!

## Deployment Platforms

### Vercel (Recommended for Next.js)

1. **Push your code to GitHub/GitLab**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push
   ```

2. **Import project to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your repository

3. **Add Environment Variables**
   - In Vercel dashboard → Your Project → **Settings** → **Environment Variables**
   - Add each variable:
     - `NEXT_PUBLIC_SUPABASE_URL` = `https://your-project.supabase.co`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `your-anon-key`
     - `SUPABASE_SERVICE_ROLE_KEY` = `your-service-role-key`
     - `TWILIO_ACCOUNT_SID` = `your-twilio-sid` (if using SMS)
     - `TWILIO_AUTH_TOKEN` = `your-twilio-token`
     - `TWILIO_PHONE_NUMBER` = `+1234567890`

4. **Deploy**
   - Click "Deploy"
   - Vercel automatically builds and deploys
   - Your app now uses the environment variables you set!

### Netlify

1. **Push code to Git**
2. **Import to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - "Add new site" → "Import an existing project"
3. **Add Environment Variables**
   - Site settings → **Environment variables**
   - Add all your variables
4. **Deploy**

### Railway / Render / Other Platforms

Same process:
1. Connect your Git repository
2. Find "Environment Variables" or "Config" section
3. Add your Supabase credentials
4. Deploy

## Security: Why This Works

✅ **Safe**: Your `.env.local` stays on your computer (never in git)  
✅ **Secure**: Production env vars are encrypted and stored securely by the platform  
✅ **Flexible**: Different values for dev/staging/production  
✅ **Easy**: Set once, works forever (until you change them)

## Important Notes

### `NEXT_PUBLIC_` Prefix

Variables with `NEXT_PUBLIC_` prefix are:
- ✅ Available in the browser (client-side code)
- ✅ Safe to expose (like your Supabase anon key)
- ⚠️ Visible in browser dev tools (that's okay for anon keys)

Variables WITHOUT `NEXT_PUBLIC_` prefix are:
- ✅ Only available server-side (API routes)
- ✅ Never exposed to browser
- 🔒 Use for secrets like `SUPABASE_SERVICE_ROLE_KEY`

### Example Setup

**Local (`.env.local`):**
```bash
NEXT_PUBLIC_SUPABASE_URL=https://dev-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=dev-anon-key
SUPABASE_SERVICE_ROLE_KEY=dev-service-key
```

**Production (Vercel Dashboard):**
```
NEXT_PUBLIC_SUPABASE_URL=https://prod-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=prod-anon-key
SUPABASE_SERVICE_ROLE_KEY=prod-service-key
```

Same code, different values!

## Quick Checklist for Deployment

- [ ] Code pushed to Git (GitHub/GitLab)
- [ ] `.env.local` is NOT committed (check `.gitignore`)
- [ ] Supabase project created and table set up
- [ ] Environment variables added to hosting platform
- [ ] Deploy and test!

## Troubleshooting Production

**"Supabase not configured" error in production:**
- Check that env vars are set in your platform's dashboard
- Make sure variable names match exactly (case-sensitive!)
- Redeploy after adding env vars (some platforms require this)

**"Cannot read property of undefined":**
- Verify `NEXT_PUBLIC_` prefix is on variables used in client components
- Check that all required variables are set

**Data not saving:**
- Verify `SUPABASE_SERVICE_ROLE_KEY` is set (not just anon key)
- Check Supabase dashboard → Table Editor to see if data is arriving
- Check server logs in your hosting platform

## Summary

**Local Development:**
- Use `.env.local` file on your computer
- Never commit it to git

**Production:**
- Set environment variables in your hosting platform's dashboard
- Same variable names, different values
- Code works the same way!

Your code is **environment-agnostic** - it just reads from `process.env` and works everywhere! 🚀

