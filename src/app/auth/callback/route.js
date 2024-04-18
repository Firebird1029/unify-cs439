/*
Route that the user gets redirected to after signing in with Spotify.
*/

import { NextResponse } from "next/server";

import createClient from "@/utils/supabase/server";
import { getSpotifyData } from "@/spotify";

export async function GET(request) {
  // get code from current url's searchParams
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  // redirect and delete code from search params
  const redirectTo = request.nextUrl.clone();
  redirectTo.searchParams.delete("code");

  // run if the function gets a code back from supabase (used during PKCE oauth flow)
  if (code) {
    // create supabase client
    const supabase = createClient();

    // logs the user in using supabase using the code that gets issued when returning from spotify
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      // redirect to error page
      redirectTo.pathname = "/error";
      redirectTo.searchParams.set("message", error.message);
      return NextResponse.redirect(redirectTo);
    }

    // authenticate user so that user is now logged in
    await supabase.auth.setSession({
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
    });

    // call Spotify API to get user data & store it in Supabase DB
    let spotifyUserData;
    try {
      spotifyUserData = await getSpotifyData(data.session.provider_token);
    } catch (e) {
      // redirect to error page
      redirectTo.pathname = "/error";
      redirectTo.searchParams.set("message", e.message || e);
      return NextResponse.redirect(redirectTo);
    }

    // update DB with Spotify username + Spotify data
    const { dbError } = await supabase
      .from("profiles")
      .update({
        username: spotifyUserData.userProfile.id,
        spotify_data: spotifyUserData,
      })
      .eq("id", data.user.id);

    if (dbError) {
      // redirect to error page
      redirectTo.pathname = "/error";
      redirectTo.searchParams.set("message", dbError.message || dbError);
      return NextResponse.redirect(redirectTo);
    }

    // once finished, redirect user to account page
    redirectTo.pathname = `/user/${spotifyUserData.userProfile.id}`;
    return NextResponse.redirect(redirectTo);
  }

  // redirect to home page of app
  redirectTo.pathname = "/";
  return NextResponse.redirect(redirectTo);
}
