# Supabase Setup Guide

Follow these steps to connect your Supabase database to this project.

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click **"New Project"**
3. Fill in:
   - **Name**: Your project name (e.g., "AFH Prelander")
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose closest to your users
4. Click **"Create new project"** (takes 1-2 minutes)

## Step 2: Get Your Supabase Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. You'll need these values:
   - **Project URL** (under "Project URL")
   - **anon/public key** (under "Project API keys" → "anon public")
   - **service_role key** (under "Project API keys" → "service_role" - click "Reveal")

⚠️ **Important**: Keep your `service_role` key secret! It has admin access.

## Step 3: Create the Database Table

1. In Supabase dashboard, go to **SQL Editor** (left sidebar)
2. Click **"New query"**
3. Copy and paste the entire contents of `supabase-setup.sql` into the editor
4. Click **"Run"** (or press Cmd/Ctrl + Enter)
5. You should see "Success. No rows returned"

This creates:

- The `leads` table with all required columns
- Indexes for performance
- Row Level Security (RLS) policies

## Step 4: Set Up Environment Variables

1. Create a `.env.local` file in the root of your project (same level as `package.json`)

2. Add your Supabase credentials:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

**Example:**

```bash
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

3. Save the file

⚠️ **Important**:

- Never commit `.env.local` to git (it's already in `.gitignore`)
- The `NEXT_PUBLIC_` prefix makes variables available in the browser
- Restart your dev server after adding env variables

## Step 5: Create an Admin User (Optional - for admin dashboard)

If you want to use the admin dashboard with authentication:

1. In Supabase dashboard, go to **Authentication** → **Users**
2. Click **"Add user"** → **"Create new user"**
3. Enter:
   - **Email**: Your admin email
   - **Password**: Create a strong password
   - **Auto Confirm User**: ✅ Check this box
4. Click **"Create user"**

You'll use this email/password to log into `/admin`

## Step 6: Test the Connection

1. Restart your dev server:

   ```bash
   npm run dev
   ```

2. Test the prelander:

   - Go to `http://localhost:3000`
   - Fill out the quiz
   - Submit the form
   - Check your Supabase dashboard → **Table Editor** → **leads** table
   - You should see the new lead!

3. Test the admin dashboard:
   - Go to `http://localhost:3000/admin`
   - You should see your leads (or empty state if none yet)

## Troubleshooting

### "Supabase not configured" error

- Make sure `.env.local` exists and has all three variables
- Restart your dev server after creating `.env.local`
- Check that variable names match exactly (including `NEXT_PUBLIC_` prefix)

### "Row Level Security policy violation"

- Make sure you ran the SQL script from `supabase-setup.sql`
- Check that RLS policies were created (SQL Editor → check for policies)

### Admin dashboard shows empty

- Check that leads are being saved (Table Editor → leads)
- Check browser console for errors
- Verify your `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are correct

### API route fails to save

- Check server logs for errors
- Verify `SUPABASE_SERVICE_ROLE_KEY` is correct (not the anon key!)
- Make sure the `leads` table exists and has the correct schema

## Next Steps

Once Supabase is connected:

- ✅ Leads will be saved to the database automatically
- ✅ Admin dashboard will show all submissions
- ✅ You can query leads via Supabase dashboard or API
- ✅ Set up SMS notifications (see README.md for Twilio setup)

## Security Notes

- **Service Role Key**: Has full database access. Only use server-side (API routes)
- **Anon Key**: Safe for client-side use. Limited by RLS policies
- **RLS Policies**: Currently allows authenticated users to read, service role to insert
- Consider adding more restrictive policies for production
