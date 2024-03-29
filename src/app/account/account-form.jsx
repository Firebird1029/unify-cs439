/* eslint-disable jsx-a11y/label-has-associated-control */

// https://supabase.com/docs/guides/auth/server-side/nextjs
// TODO page needs styling

"use client";

import { useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";
import createClient from "@/utils/supabase/client";

export default function AccountForm({ user }) {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [fullname, setFullname] = useState(null);
  const [username, setUsername] = useState(null);
  const [website, setWebsite] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);

  const getProfile = useCallback(async () => {
    try {
      setLoading(true);

      const { data, error, status } = await supabase
        .from("profiles")
        .select(`full_name, username, website, avatar_url`)
        .eq("id", user.id)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setFullname(data.full_name);
        setUsername(data.username);
        setWebsite(data.website);
        setAvatarUrl(data.avatar_url);
      }
    } catch (error) {
      // TODO display error message to user
    } finally {
      setLoading(false);
    }
  }, [user, supabase]);

  useEffect(() => {
    getProfile();
  }, [user, getProfile]);

  async function updateProfile({ username_, website_, avatarUrl_ }) {
    try {
      setLoading(true);

      const { error } = await supabase.from("profiles").upsert({
        id: user.id,
        full_name: fullname,
        username_,
        website_,
        avatarUrl_,
        updated_at: new Date().toISOString(),
      });
      if (error) throw error;
      // TODO alert("Profile updated!");
    } catch (error) {
      // TODO alert("Error updating the data!");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="form-widget">
      <div>
        <label htmlFor="email">Email</label>
        <input id="email" type="text" value={user.email} disabled />
      </div>
      <div>
        <label htmlFor="fullName">Full Name</label>
        <input
          id="fullName"
          type="text"
          value={fullname || ""}
          onChange={(e) => setFullname(e.target.value)}
          disabled={loading}
        />
      </div>
      <div>
        <label htmlFor="username">Username</label>
        <input
          id="username"
          type="text"
          value={username || ""}
          onChange={(e) => setUsername(e.target.value)}
          disabled={loading}
        />
      </div>
      <div>
        <label htmlFor="website">Website</label>
        <input
          id="website"
          type="url"
          value={website || ""}
          onChange={(e) => setWebsite(e.target.value)}
          disabled={loading}
        />
      </div>

      <div>
        <button
          type="button"
          className="button primary block"
          onClick={() =>
            updateProfile({
              fullname,
              username,
              website,
              avatar_url: avatarUrl,
            })
          }
          disabled={loading}
        >
          {loading ? "Loading ..." : "Update"}
        </button>
      </div>

      <div>
        <form action="/auth/signout" method="post">
          <button className="button block" type="submit">
            Sign out
          </button>
        </form>
      </div>
    </div>
  );
}

AccountForm.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string,
    email: PropTypes.string,
  }).isRequired,
};
