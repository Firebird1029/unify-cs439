"use client";

import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import createClient from "@/utils/supabase/client";
import UnifyContent from "@/components/UnifyContent";

export default function UnifyPage({ params: { users } }) {
  // console.log(users);

  const [user1, user2] = users.split("%26");

  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [user1Data, setUser1Data] = useState(null);
  const [user2Data, setUser2Data] = useState(null);

  useEffect(() => {
    // find user by username (given as URL slug) in DB
    supabase
      .from("profiles")
      .select("spotify_data")
      .eq("username", user1)
      .then(({ data, error }) => {
        if (error) {
          // TODO
          console.error(error); // TODO display error message to user
        }

        if (data && data.length > 0) {
          setUser1Data(data[0].spotify_data);
        }

        setLoading(false);
      });
  }, []);

  useEffect(() => {
    // find user by username (given as URL slug) in DB
    supabase
      .from("profiles")
      .select("spotify_data")
      .eq("username", user2)
      .then(({ data, error }) => {
        if (error) {
          // TODO
          console.error(error); // TODO display error message to user
        }

        if (data && data.length > 0) {
          setUser2Data(data[0].spotify_data);
        }

        setLoading(false);
      });
  }, []);

  return (
    <div>
      {!loading && user1Data && user2Data && (
        <div>
          <UnifyContent user1Data={user1Data} user2Data={user2Data} />
        </div>
      )}
      {!loading && (!user1Data || !user2Data) && <div>User not found!</div>}
    </div>
  );
}

UnifyPage.propTypes = {
  params: PropTypes.shape({
    users: PropTypes.string.isRequired,
  }).isRequired,
};
