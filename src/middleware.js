/*
this function acts as the middleware for supabase in the next.js application
it updates the session for incoming requests and returns the response from the updateSession utility
*/

// https://supabase.com/docs/guides/auth/server-side/nextjs

import updateSession from "@/utils/supabase/middleware";

export async function middleware(request) {
  // call updateSession with the incoming request and wait for the result
  const res = await updateSession(request);
  // return the result to the caller
  return res;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
