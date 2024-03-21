/* eslint-disable jsx-a11y/label-has-associated-control */
// https://supabase.com/docs/guides/getting-started/tutorials/with-nextjs
// TODO style this page

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import createClient from "@/utils/supabase/client";
import { loginWithSpotify } from "./actions";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);

  // check if user is already logged in
  useEffect(() => {
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        // already logged in
        router.replace("/account");
      } else {
        setLoading(false);
      }
    })().catch((err) => {
      console.error(err); // TODO display error message to user
      router.push("/error");
    });
  }, []);

  return (
    !loading && (
      <div>
        <p>
          <button type="button" onClick={() => loginWithSpotify()}>
            Login with Spotify
          </button>
        </p>
      </div>
    )
  );
}
