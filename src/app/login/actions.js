// https://supabase.com/docs/guides/getting-started/tutorials/with-nextjs

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import createClient from "@/utils/supabase/server";

const baseURL = process.env.NEXT_PUBLIC_VERCEL_URL
  ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
  : "http://localhost:3000";

export async function login(formData) {
  const supabase = createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    // TODO display error message to user error.message
    redirect("/error");
  }

  revalidatePath("/", "layout");
  redirect("/account");
}

export async function signup(formData) {
  const supabase = createClient();

  const data = {
    email: formData.get("email"),
    password: formData.get("password"),
    options: {
      emailRedirectTo: `${baseURL}/auth/confirm`,
      data: {
        display_name: "New User",
      },
    },
  };

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    // TODO display error message to user error.message
    redirect("/error");
  }

  revalidatePath("/", "layout");
  redirect("/account");
}

export async function loginWithSpotify() {
  const supabase = createClient();

  // TODO does this even get triggered? add console logs to check
  // https://supabase.com/docs/reference/javascript/auth-signinwithoauth?example=sign-in-with-scopes
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

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "spotify",
    options: {
      redirectTo: process.env.NEXT_PUBLIC_REDIRECT_URI,
      emailRedirectTo: `${baseURL}/auth/confirm`,
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
