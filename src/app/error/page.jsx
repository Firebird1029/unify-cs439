/*
Default error page that displays a red box that says an error occurred.
*/

"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ErrorAlert from "@/app/error/error";

export default function ErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  return (
    <Suspense>
      <ErrorAlert Title={"Error"} Message={error || "An error occured."} />
    </Suspense>
  );
}
