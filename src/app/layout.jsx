import PropTypes from "prop-types";
import "./globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { koulen } from "@/fonts";

export const metadata = {
  title: "Unify",
  description: "",
};
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
