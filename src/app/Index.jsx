"use client";

import { useEffect } from "react";

import IndexContent from "@/components/svg-art/index_content";
import createClient from "@/utils/supabase/client";

export default function HomePage() {
  const supabase = createClient();

  // check if user is already logged in
  useEffect(() => {
    (async () => {
      // console.log("use effect running");
      const {
        data: { user },
      } = await supabase.auth.getUser();
      // console.log("user: ", user);
      if (user) {
        // already logged in
        // router.replace("/account");
        // console.log("user is logged in");
      } else {
        // console.log("user is not logged in");
      }
    })().catch(() => {
      // TODO display error message to user
    });
  }, []);

  return <IndexContent />;
}
