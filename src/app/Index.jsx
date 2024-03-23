"use client";

import { useEffect, useState } from "react";

import IndexContent from "@/components/svg-art/index_content";
import createClient from "@/utils/supabase/client";
import { loginWithSpotify } from "./login/actions";

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
    })().catch((err) => {
      console.error(err); // TODO display error message to user
    });
  }, []);

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <IndexContent />
    </div>
  );
}
