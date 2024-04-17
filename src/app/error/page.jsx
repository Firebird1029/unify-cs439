/*
Default error page that displays a red box that says an error occurred.
*/

"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ErrorAlert from "@/app/error/error";

function SuspendedErrorAlert() {
  // get error message from search params
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  // use errorAlert to display the error message from the search params
  return <ErrorAlert Title={"Error"} Message={error || "An error occured."} />;
}

export default function ErrorPage() {
  return (
    <Suspense>
      <SuspendedErrorAlert />
    </Suspense>
  );
}
