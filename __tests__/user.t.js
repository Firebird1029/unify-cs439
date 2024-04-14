import React from "react";
import PropTypes from "prop-types";
import { render, waitFor } from "@testing-library/react";
import UserPage from "@/app/user/[slug]/page";
import createClient from "@/utils/supabase/client";

jest.mock("../src/utils/supabase/client", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock(
  "../src/app/user/[slug]/UserContent",
  () =>
    function Test() {
      return <div>UserContent Component</div>;
    },
);

function Test2({ Title, Message }) {
  return (
    <div>
      {Title}
      {Message}
    </div>
  );
}
Test2.propTypes = {
  Message: PropTypes.string.isRequired,
  Title: PropTypes.string.isRequired,
};
jest.mock("../src/app/error/error", () =>
  Test2({ Title: "Title", Message: "Message" }),
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
