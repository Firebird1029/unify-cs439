/*
this function manages the user session in a Next.js application by interacting with Supabase's server-side features
it captures the incoming request, creates a server client for Supabase with custom cookie handling, and returns a response with potentially updated cookies
use this link to refer to how server side authentication in next.js works with supabase: https://supabase.com/docs/guides/auth/server-side/nextjs
*/

import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

// define the updateSession function that will handle the session updates
export default async function updateSession(request) {
  // create a NextResponse object that contains the request headers
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // create a supabase client using environment variables for URL and anon key
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      // define methods to handle cookies
      cookies: {
        // get a cookie's value by its name
        get(name) {
          return request.cookies.get(name)?.value;
        },
        // set a cookie with name, value, and options
        set(name, value, options) {
          request.cookies.set({
            name,
            value,
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          // set the cookie in the response object as well
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        // remove a cookie by name and options by setting its value to empty
        remove(name, options) {
          request.cookies.set({
            name,
            value: "",
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          // set the removed cookie in the response object as well
          response.cookies.set({
            name,
            value: "",
            ...options,
          });
        },
      },
    },
  );

  // retrieve user information with supabase auth
  await supabase.auth.getUser();

  // return the modified response object
  return response;
}
