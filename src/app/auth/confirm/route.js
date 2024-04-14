/*
Route that the user gets sent to after clicking the link from the Supabase confirmation email.
*/

// https://supabase.com/docs/guides/auth/server-side/nextjs

import { NextResponse } from "next/server";

import createClient from "@/utils/supabase/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type");
  const next = searchParams.get("next") ?? "/";

  const redirectTo = request.nextUrl.clone();
  redirectTo.pathname = next;
  redirectTo.searchParams.delete("token_hash");
  redirectTo.searchParams.delete("type");

  if (tokenHash && type) {
    const supabase = createClient();

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash: tokenHash,
    });
    if (!error) {
      redirectTo.searchParams.delete("next");
      return NextResponse.redirect(redirectTo);
    }
    redirectTo.searchParams.set("error", error.message);
  }

  // return the user to an error page with some instructions
  redirectTo.pathname = "/error";
  return NextResponse.redirect(redirectTo);
}
