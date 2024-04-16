import React from "react";
import { render } from "@testing-library/react";

import ShareCassette from "@/app/user/[slug]/ShareCassette";
import ShareUnify from "@/app/unify/[users]/ShareUnify";

import userData from "./userData.json";

describe("ShareCassette", () => {
  it("should import SVG content as a module", () => {
    const { asFragment } = render(<ShareCassette userData={userData} />);
    expect(asFragment()).toMatchSnapshot();
  });
});

describe("ShareUnify", () => {
  it("should import SVG content as a module", () => {
    const { asFragment } = render(
      <ShareUnify user1Data={userData} user2Data={userData} />,
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
