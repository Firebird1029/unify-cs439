import React from "react";
import { render } from "@testing-library/react";
import RootLayout from "../src/app/layout";

describe("RootLayout", () => {
  test("RootLayout test", () => {
    render(
      <RootLayout>
        <div>Test</div>
      </RootLayout>,
    );
  });
});
