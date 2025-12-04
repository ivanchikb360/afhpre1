import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  // Get env vars - they're replaced at build time by Next.js
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Always create the client - let Supabase handle errors if vars are missing
  // This way it works even if env vars weren't set at build time but are set in Vercel
  return createBrowserClient(supabaseUrl || "", supabaseAnonKey || "");
}
