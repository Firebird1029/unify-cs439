/*
Default error page that displays a red box that says an error occurred.
*/

"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ErrorAlert from "@/app/error/error";

function SuspendedErrorAlert() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  return <ErrorAlert Title={"Error"} Message={error || "An error occured."} />;
}

export default function ErrorPage() {
  return (
    <Suspense>
      <SuspendedErrorAlert />
    </Suspense>
  );
}
