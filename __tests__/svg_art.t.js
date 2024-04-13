import React from "react";
import { render } from "@testing-library/react";

import ShareCassette from "@/components/ShareCassette";
import ShareUnify from "@/components/ShareUnify";

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
