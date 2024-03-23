import { NextResponse } from "next/server";

import createClient from "@/utils/supabase/server";
import { getSpotifyData } from "@/spotify";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  const redirectTo = request.nextUrl.clone();
  redirectTo.searchParams.delete("code");

  // console.log("code: ", code);

  if (code) {
    const supabase = createClient();

    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.log(error.message); // TODO display error message to user
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
      console.error(e); // TODO display error message to user
      redirectTo.pathname = "/error";
      return NextResponse.redirect(redirectTo);
    }

    // console.log("spotify user data: ", spotifyUserData);

    // console.log("username: ", spotifyUserData.userProfile.id);

    // update DB with Spotify username + Spotify data
    const { dbError } = await supabase
      .from("profiles")
      .update({
        username: spotifyUserData.userProfile.id,
        spotify_data: spotifyUserData,
      })
      .eq("id", data.user.id);

    if (dbError) {
      console.log(dbError.message); // TODO display error message to user
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
