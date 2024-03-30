"use client";

import { useEffect, useState } from "react";
import createClient from "@/utils/supabase/client";
import ErrorAlert from "@/app/error/error";

export default function DefaultUserPage() {
  const [errorMessage, setError] = useState(null);

  useEffect(() => {
    const supabase = createClient();

    const fetchData = async () => {
      try {
        // Get current user's information from Supabase
        const { data: currentUser, error } = await supabase.auth.getUser();

        if (error) {
          setError("You must log in to view your user data.");
        }

        // console.log(currentUser);

        // console.log("id: ", currentUser.user.id);

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
