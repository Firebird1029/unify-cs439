/*
this function sets up a client to interact with the Supabase database from the browser.
it uses environment variables for the Supabase URL and the anonymous access key.
https://supabase.com/docs/guides/auth/server-side/nextjs
*/

import { createBrowserClient } from "@supabase/ssr";

export default function createClient() {
  // create a client for browser-based interactions with Supabase
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL, // get the Supabase URL from environment variables
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, // get the Supabase anonymous key from environment variables
  );
}
