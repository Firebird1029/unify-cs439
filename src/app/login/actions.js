/*
Action to log user in with Spotify using supabase's signInWithOAuth functionality
This gets called from the index page when a user clicks on the "log in with spotify"/"get data" button
The general flow is to redirect the user to spotify, which will then redirect them back to /auth/callback after they sign in using Spotify
refer to this documentation on how to use supabase with nextJs: https://supabase.com/docs/guides/getting-started/tutorials/with-nextjs
*/

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import createClient from "@/utils/supabase/server";

// figure out the baseURL of the application based on if it is running locally in dev env or deployed on vercel
const baseURL = process.env.NEXT_PUBLIC_VERCEL_URL
  ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
  : "http://localhost:3000";

// function to log user in with spotify
export default async function loginWithSpotify() {
  const supabase = createClient();

  const isBrowser = typeof window !== "undefined";

  // TODO does this even get triggered? add console logs to check
  // (i dont think so??)
  // https://supabase.com/docs/reference/javascript/auth-signinwithoauth?example=sign-in-with-scopes
  if (isBrowser) {
    supabase.auth.onAuthStateChange((event, session) => {
      if (session && session.provider_token) {
        window.localStorage.setItem(
          "oauth_provider_token",
          session.provider_token,
        );
      }
      if (session && session.provider_refresh_token) {
        window.localStorage.setItem(
          "oauth_provider_refresh_token",
          session.provider_refresh_token,
        );
      }
      if (event === "SIGNED_OUT") {
        window.localStorage.removeItem("oauth_provider_token");
        window.localStorage.removeItem("oauth_provider_refresh_token");
      }
    });
  }

  // redirect to spotify so the user can log in, then redirect back to /auth/callback
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "spotify",
    options: {
      // redirects to /auth/callback after going through the spotify login process
      // this will ger/refresh the user data if they are already logged in,
      // or redirect the user back to the home page to get their data if they are not logged in
      redirectTo: process.env.NEXT_PUBLIC_REDIRECT_URI,
      // this is the url the email verification that the user gets from supabase will redirect them to
      emailRedirectTo: `${baseURL}/auth/confirm`,
      // set the permissions the app needs to get the user data
      scopes:
        "user-read-private user-read-email user-library-read user-follow-read user-top-read user-modify-playback-state",
    },
  });

  if (error) {
    // TODO display error message to user error.message
    redirect("/error");
  } else {
    redirect(data.url);
  }
}
