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
    console.error(error.message); // TODO display error message to user
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
    console.error(error.message); // TODO display error message to user
    redirect("/error");
  }

  revalidatePath("/", "layout");
  redirect("/account");
}
