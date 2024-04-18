/*
Layout stuff for application setting Koulen as default font
*/

import PropTypes from "prop-types";
import "./globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { koulen } from "@/fonts";

// this defines metadata with a title and an empty description
export const metadata = {
  title: "Unify",
  description: "",
};

// this function wraps its children components with HTML structure.
// it sets the language of the document to english and applies a custom font class to the body.
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={koulen.className}>{children}</body>
    </html>
  );
}

RootLayout.propTypes = {
  children: PropTypes.node.isRequired,
};
