/*
Defining fonts for use in react code
*/

// using google fonts in next
import { Koulen, Homemade_Apple as HomemadeApple } from "next/font/google";

// Koulen is used for the majority of the text
export const koulen = Koulen({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-koulen",
});

// using HomemadeApple (cursive font) for some minor details
export const homemadeApple = HomemadeApple({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-homemade-apple",
});
