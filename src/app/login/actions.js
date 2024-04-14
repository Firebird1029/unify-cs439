/*
Action to log user in with Spotify using Supabase's signInWithOAuth functionality.
This gets called from the index page when a user clicks on the "log in with spotify"/"get data" button.
The general flow is to redirect the user to spotify, which will then redirect them back to /auth/callback after they sign in using Spotify.
Documentation on how to use Supabase with Next.js: https://supabase.com/docs/guides/getting-started/tutorials/with-nextjs.
*/

"use server";

import { redirect } from "next/navigation";

import createClient from "@/utils/supabase/server";

// figure out the baseURL of the application based on if it is running locally in dev env or deployed on vercel
const baseURL = process.env.NEXT_PUBLIC_VERCEL_URL
  ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
  : `http://${process.env.NEXT_PUBLIC_FRONTEND_URL}`;

// function to log user in with spotify
export default async function loginWithSpotify() {
  const supabase = createClient();

  // redirect to spotify so the user can log in, then redirect back to /auth/callback
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "spotify",
    options: {
      // redirects to /auth/callback after going through the Spotify login process
      redirectTo: process.env.NEXT_PUBLIC_REDIRECT_URI,
      // this is the redirect URL in the email verification that the user gets from Supabase
      emailRedirectTo: `${baseURL}/auth/confirm`,
      // set the permissions the app needs to get the user data
      scopes:
        "user-read-private user-read-email user-library-read user-follow-read user-top-read user-modify-playback-state",
    },
  });

  if (error) {
    redirect(`/error?message=${error.message}`);
  } else {
    redirect(data.url);
  }
}
