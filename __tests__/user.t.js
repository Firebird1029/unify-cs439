/* eslint-disable react/jsx-filename-extension */

import React from "react";
import { render, waitFor } from "@testing-library/react";
import UserPage from "@/app/user/[slug]/page";
import createClient from "@/utils/supabase/client";

jest.mock("../src/utils/supabase/client", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock(
  "../src/components/svg-art/user_content",
  () =>
    function () {
      return <div>UserContent Component</div>;
    },
);
jest.mock(
  "../src/app/error/error",
  () =>
    function ({ Title, Message }) {
      return (
        <div>
          {Title}
          {Message}
        </div>
      );
    },
);

global.navigator.share = jest.fn();

HTMLCanvasElement.prototype.getContext = jest.fn(() => ({
  drawImage: jest.fn(),
  fillText: jest.fn(),
  clearRect: jest.fn(),
  toBlob: jest.fn((callback) => callback("blob")),
}));

beforeEach(() => {
  createClient.mockImplementation(() => ({
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockResolvedValue({
      data: [{ spotify_data: { username: "user1" } }],
      error: null,
    }),
  }));
});

it("fetches user data successfully and renders UserContent", async () => {
  const { findByText } = render(<UserPage params={{ slug: "userSlug" }} />);
  await waitFor(() => {
    expect(findByText("UserContent Component")).toBeTruthy();
  });
});
