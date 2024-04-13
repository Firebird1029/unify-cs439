/*
default error page using the error alert popup from /app/error/error
just displays a red box that says an error occured
*/

"use client";

import ErrorAlert from "@/app/error/error";

export default function ErrorPage() {
  return <ErrorAlert Title={""} Message={"An error occured."} />;
}
