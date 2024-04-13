/*
This page redirects to /user/[slug]. TODO could probably just be a Next.js configuration item.
*/

"use client";

// redirect the user to their user page if they get redirected to /user

import { useEffect, useState } from "react";
import createClient from "@/utils/supabase/client";
import ErrorAlert from "@/app/error/error";

export default function DefaultUserPage() {
  const [errorMessage, setError] = useState(null);

  // fetch user data from supabase if it exists
  // redirects user to their user page or tells them to log in and redirects to home page
  useEffect(() => {
    const supabase = createClient();

    const fetchData = async () => {
      try {
        // Get current user's information from Supabase
        const { data: currentUser, error } = await supabase.auth.getUser();

        if (error) {
          setError("You must log in to view your user data.");
        }

        // gets the Spotify id of the user from supabase
        supabase
          .from("profiles")
          .select("username")
          .eq("id", currentUser.user.id)
          .then(({ data, error2 }) => {
            if (error2) {
              setError("You must log in to view your user data.");
            }

            // console.log(data);

            if (data && data.length > 0) {
              // Concatenate paramValue with currentUser's ID
              const redirectURL = `/user/${data[0].username}`;

              // console.log(redirectURL);

              // Redirect to the generated URL
              window.location.href = redirectURL;
            }
          });
      } catch (error) {
        setError("You must log in to view your user data.");
      }
    };

    fetchData();

    // Cleanup function if necessary
    return () => {
      // Cleanup code if needed
    };
  }, []); // Empty dependency array ensures useEffect runs only once

  return (
    <>
      {errorMessage && (
        <ErrorAlert Title="Error: " Message={errorMessage} RedirectTo="/" />
      )}
      <div />
    </>
  );
}
