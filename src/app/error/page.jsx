/*
Default error page that displays a red box that says an error occurred.
*/

"use client";

import { useSearchParams } from "next/navigation";
import ErrorAlert from "@/app/error/error";

export default function ErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  return <ErrorAlert Title={"Error"} Message={error || "An error occured."} />;
}
