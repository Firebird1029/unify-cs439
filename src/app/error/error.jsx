/*
Error alert message that is used on other pages to display an error.
Can have title, message, and option to redirect the user when they click the x button on the error.
*/

"use client";

import React from "react";
import PropTypes from "prop-types";

function ErrorAlert({ Title, Message, RedirectTo = null }) {
  const handleClose = () => {
    if (RedirectTo) {
      // Redirect to the specified page on close of alert
      window.location.href = RedirectTo;
    }
  };

  return (
    <div
      className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 m-4 rounded relative"
      role="alert"
    >
      <h2 className="font-bold">{Title}</h2>
      <span className="block sm:inline">{Message}</span>
      {RedirectTo && (
        <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
          <svg
            className="fill-current h-6 w-6 text-red-500 cursor-pointer"
            role="button"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            onClick={handleClose} // Call handleClose function on click
          >
            <title>Close</title>
            {/* This path is just the x icon in the alert */}
            <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
          </svg>
        </span>
      )}
    </div>
  );
}

ErrorAlert.propTypes = {
  Title: PropTypes.string.isRequired,
  Message: PropTypes.string.isRequired,
  RedirectTo: PropTypes.string,
};

export default ErrorAlert;
