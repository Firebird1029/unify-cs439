/*
Route that the user gets sent to after clicking the link from the Supabase confirmation email.
It validates the one-time password (OTP) from the link, then redirects the user accordingly.
If the OTP is valid, it redirects to a specified or default path. if not, it sends the user to an error page.
*/

// https://supabase.com/docs/guides/auth/server-side/nextjs

import { NextResponse } from "next/server";

import createClient from "@/utils/supabase/server";

export async function GET(request) {
  // get search params from current url
  const { searchParams } = new URL(request.url);
  const tokenHash = searchParams.get("token_hash"); // get the token hash from URL
  const type = searchParams.get("type"); // get the type of request from URL
  const next = searchParams.get("next") ?? "/"; // get the redirect path or use default

  const redirectTo = request.nextUrl.clone(); // clone the request URL for modification
  redirectTo.pathname = next; // set the redirect pathname
  redirectTo.searchParams.delete("token_hash"); // remove token_hash from URL
  redirectTo.searchParams.delete("type"); // remove type from URL

  if (tokenHash && type) {
    const supabase = createClient(); // create a new Supabase client

    // try to verify the OTP
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash: tokenHash,
    });
    if (!error) {
      // remove the 'next' parameter if no error
      redirectTo.searchParams.delete("next");
      return NextResponse.redirect(redirectTo);
    }
    // set error message in URL if there's an error
    redirectTo.searchParams.set("error", error.message);
  }

  // return the user to an error page with some instructions
  redirectTo.pathname = "/error";
  return NextResponse.redirect(redirectTo);
}
