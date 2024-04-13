/*
Default error page that displays a red box that says an error occurred.
*/

"use client";

import ErrorAlert from "@/app/error/error";

export default function ErrorPage() {
  return <ErrorAlert Title={""} Message={"An error occured."} />;
}
