/*
Route user gets redirected to after signing in with Spotify
*/

import { NextResponse } from "next/server";

import createClient from "@/utils/supabase/server";
import { getSpotifyData } from "@/spotify";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  const redirectTo = request.nextUrl.clone();
  redirectTo.searchParams.delete("code");

  if (code) {
    const supabase = createClient();

    // logs the user in using supabase using the code that gets issued when returning from spotify
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      // TODO display error message to user error.message
      redirectTo.pathname = "/error";
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
      // TODO display error message to user e
      redirectTo.pathname = "/error";
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
      // TODO display error message to user dbError.message
      redirectTo.pathname = "/error";
      return NextResponse.redirect(redirectTo);
    }

    // once finished, redirect user to account page
    redirectTo.pathname = `/user/${spotifyUserData.userProfile.id}`;
    return NextResponse.redirect(redirectTo);
  }

  redirectTo.pathname = "/";
  return NextResponse.redirect(redirectTo);
}
