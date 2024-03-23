"use server";

import { redirect } from "next/navigation";
import AccountForm from "./account-form";
import createClient from "@/utils/supabase/server";

export default async function Account() {
  const supabase = createClient();

  // Ensure user is logged in
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) {
    redirect("/login");
  }

  return <AccountForm user={user} />;
}
