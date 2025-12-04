import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  // Get env vars - they're replaced at build time by Next.js
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Check if env vars are available - if not, return safe mock
  if (!supabaseUrl || !supabaseAnonKey) {
    return {
      from: () => ({
        select: () => ({
          order: () => Promise.resolve({ data: [], error: null }),
        }),
      }),
      auth: {
        getSession: () =>
          Promise.resolve({ data: { session: null }, error: null }),
        signOut: () => Promise.resolve({ error: null }),
        signInWithPassword: () =>
          Promise.resolve({
            data: { user: null, session: null },
            error: {
              message:
                "Supabase environment variables are not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in Vercel and rebuild.",
            },
          }),
      },
    } as any;
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
