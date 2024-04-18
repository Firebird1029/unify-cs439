/*
this function sets up a client to interact with the Supabase database from the server
it uses env variables for the Supabase URL and the anon access key, and handles cookies to manage session
https://supabase.com/docs/guides/auth/server-side/nextjs 
*/

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export default function createClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL, // get the Supabase URL from environment variables
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, // get the Supabase anonymous key from environment variables
    {
      cookies: {
        // define how to get a cookie
        get(name) {
          return cookieStore.get(name)?.value; // return the cookie's value if it exists
        },
        // set a cookie with the given options
        set(name, value, options) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
        // define how to remove a cookie
        remove(name, options) {
          try {
            cookieStore.set({ name, value: "", ...options });
          } catch (error) {
            // The `delete` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    },
  );
}
