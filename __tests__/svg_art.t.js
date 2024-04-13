/* eslint-disable react/jsx-filename-extension */

import React from "react";
import { render } from "@testing-library/react";

import ShareCassette from "@/components/svg-art/share_cassette";
import ShareUnify from "@/components/svg-art/share_unify";

describe("ShareCassette", () => {
  it("should import SVG content as a module", () => {
    const { asFragment } = render(<ShareCassette />);
    expect(asFragment()).toMatchSnapshot();
  });
});

describe("ShareUnify", () => {
  it("should import SVG content as a module", () => {
    const { asFragment } = render(<ShareUnify />);
    expect(asFragment()).toMatchSnapshot();
  });
});
