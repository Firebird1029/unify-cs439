import PropTypes from "prop-types";
import { Koulen, Homemade_Apple as HomemadeApple } from "next/font/google";
import "./globals.css";
import "bootstrap/dist/css/bootstrap.min.css";

const koulen = Koulen({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-koulen",
});

export const homemadeApple = HomemadeApple({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-homemade-apple",
});

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
