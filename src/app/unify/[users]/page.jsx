"use client";

import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import createClient from "@/utils/supabase/client";
import { UnifyContent } from "./UnifyContent";
import ErrorAlert from "@/app/error/error";

export default function UnifyPage({ params: { users } }) {
  // console.log(users);

  const [user1, user2] = users.split("%26");

  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [user1Data, setUser1Data] = useState(null);
  const [user2Data, setUser2Data] = useState(null);
  const [errorMessage, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!users.includes("%26")) {
          // console.log("user: ", users);

          // Get current user's information from Supabase
          const { data: currentUser, error } = await supabase.auth.getUser();

          if (error) {
            setError("You must log in to unify.");
          }

          // console.log(currentUser);

          // console.log("id: ", currentUser.user.id);

          supabase
            .from("profiles")
            .select("username")
            .eq("id", currentUser.user.id)
            .then(({ data, error2 }) => {
              if (error2) {
                setError("You must log in to unify.");
              }

              // console.log(data);

              if (data && data.length > 0) {
                // Concatenate paramValue with currentUser's ID
                const redirectURL = `${users}&${data[0].username}`;

                // console.log(redirectURL);

                // Redirect to the generated URL
                window.location.href = redirectURL;
              }
            });
        }
      } catch (error) {
        setError("Could not fetch data.");
      }
    };

    fetchData();

    // Cleanup function if necessary
    return () => {
      // Cleanup code if needed
    };
  }, []); // Empty dependency array ensures useEffect runs only once

  useEffect(() => {
    // find user by username (given as URL slug) in DB
    supabase
      .from("profiles")
      .select("spotify_data")
      .eq("username", user1)
      .then(({ data, error }) => {
        // console.log(data, error);
        if (error) {
          setError("User not found.");
        }

        if (data && data.length > 0) {
          setUser1Data(data[0].spotify_data);
          setLoading(false);
        } else {
          setLoading(true);
          setError("User not found.");
        }
      });
  }, []);

  useEffect(() => {
    // find user by username (given as URL slug) in DB
    supabase
      .from("profiles")
      .select("spotify_data")
      .eq("username", user2)
      .then(({ data, error }) => {
        // console.log(data, error);
        if (error) {
          setError("User not found.");
        }

        if (data && data.length > 0) {
          setUser2Data(data[0].spotify_data);
          setLoading(false);
        } else {
          setLoading(true);
          if (users.includes("%26")) {
            setError("User not found.");
          }
        }

        // console.log(loading, user1Data, user2Data);
      });
  }, []);

  return (
    <>
      <div>
        {!loading && user1Data && user2Data && (
          <div>
            <UnifyContent user1Data={user1Data} user2Data={user2Data} />
          </div>
        )}
      </div>
      {errorMessage && loading && (
        <ErrorAlert Title="Error: " Message={errorMessage} RedirectTo="/" />
      )}
      <div />
    </>
  );
}

UnifyPage.propTypes = {
  params: PropTypes.shape({
    users: PropTypes.string.isRequired,
  }).isRequired,
};
