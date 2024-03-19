"use client";

import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import createClient from "@/utils/supabase/client";

export default function UserPage({ params: { slug } }) {
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // find user by username (given as URL slug) in DB
    supabase
      .from("profiles")
      .select("spotify_data")
      .eq("username", slug)
      .then(({ data, error }) => {
        if (error) {
          // TODO
          console.error(error); // TODO display error message to user
        }

        if (data && data.length > 0) {
          setUserData(data[0].spotify_data);
        }

        setLoading(false);
      });
  }, []);
  return (
    <div>
      <h1>User Page</h1>
      {!loading && userData && <div>{JSON.stringify(userData)}</div>}
      {!loading && !userData && <div>User not found!</div>}
    </div>
  );
}

UserPage.propTypes = {
  params: PropTypes.shape({
    slug: PropTypes.string.isRequired,
  }).isRequired,
};
