/*
This page loads the two user's data to display the Unify content.
It is designed to redirect a user from the link that gets generated from the user page
to bring them to the Unify page with them and the other user, or show the data for the
two users if two were given in the url, separated by an '&'.
*/

"use client";

import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useRouter } from "next/navigation";
import createClient from "@/utils/supabase/client";
import { UnifyContent } from "./UnifyContent";
import ErrorAlert from "@/app/error/error";

export default function UnifyPage({ params: { users } }) {
  // split the slug (users) on & (gets replaced as %26 automatically) to get user1 and user2 usernames
  const [user1, user2] = users.split("%26");

  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [user1Data, setUser1Data] = useState(null);
  const [user2Data, setUser2Data] = useState(null);
  const [errorMessage, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!users.includes("%26")) {
          // if only one user is provided

          // Get current user's information from Supabase
          const { data: currentUser, error } = await supabase.auth.getUser();

          if (error) {
            // give error if the user is not logged in
            setError("You must log in to unify.");
          }

          // get the spotify id of the current user from the database
          supabase
            .from("profiles")
            .select("username")
            .eq("id", currentUser.user.id)
            .then(({ data, error2 }) => {
              if (error2) {
                setError("You must log in to unify.");
              }

              if (data && data.length > 0) {
                // Concatenate paramValue with currentUser's ID
                const redirectURL = `${users}&${data[0].username}`;

                // Redirect to the generated URL
                router.replace(redirectURL);
              }
            });
        }

        if (user1 === user2) {
          // if the two users are the same, you cannot unify the same user, so redirect to logged in user content
          router.replace(`/user/${user1}`);
        }
      } catch (error) {
        setError("Could not fetch data.");
      }
    };

    fetchData();
  }, []); // Empty dependency array ensures useEffect runs only once

  useEffect(() => {
    // find first user by username (given as URL slug) in DB
    supabase
      .from("profiles")
      .select("spotify_data")
      .eq("username", user1)
      .then(({ data, error }) => {
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
    if (users.includes("%26") && user1 !== user2) {
      // find second user by username (given as URL slug) in DB
      supabase
        .from("profiles")
        .select("spotify_data")
        .eq("username", user2)
        .then(({ data, error }) => {
          if (error) {
            setError("User not found.");
          }

          if (data && data.length > 0) {
            setUser2Data(data[0].spotify_data);
            setLoading(false);
          } else {
            setLoading(true);
          }
        });
    }
  }, []);

  // content of page with UnifyContent or error message
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
