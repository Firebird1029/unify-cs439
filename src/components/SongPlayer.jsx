import React, { useRef, useState } from "react";
import PropTypes from "prop-types";

import toImg from "react-svg-to-image";
import * as htmlToImage from "html-to-image";
import { Canvg } from "canvg";
import GetSpotifyCode from "./SpotifyCodeGenerator";

function SongPlayer({ song, token }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const addSongToQueue = () => {
    // Use fetch for making HTTP requests
    fetch(`http://localhost:5000/addSongToQueue?token=${token}&uri=${song.id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to add song to queue");
        }
        // Handle success if needed
      })
      .catch((error) => {
        console.error("Error adding song to queue:", error);
      });
  };

  const togglePlay = () => {
    const audioElement = audioRef.current;

    if (isPlaying) {
      audioElement.pause();
    } else {
      audioElement.play();
    }

    setIsPlaying(!isPlaying);
  };

  // Function to handle sharing
  const shareSong = async () => {
    console.log("sharing song");

    // Use Web Share API to share the default image
    const svgString = await GetSpotifyCode(song.external_urls.spotify);
    console.log(svgString);

    const img = new Image();

    // Set the source of the image
    img.src = `data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`;

    // Wait for the image to load
    img.onload = () => {
      // Create a canvas element
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;

      // Draw the image on the canvas
      canvas.getContext("2d")?.drawImage(img, 0, 0);

      // Convert canvas to blob
      canvas.toBlob((blob) => {
        console.log(blob);

        if (navigator.share) {
          console.log("Web share API supported");
          navigator
            .share({
              title: "Check out this song!",
              text: `Listen to ${song.name}`,
              url: song.external_urls.spotify,
              files: [
                new File([blob], "file.png", {
                  type: blob.type,
                }),
              ],
            })
            .then(() => console.log("Shared successfully"))
            .catch((error) => console.error("Error sharing:", error));
        } else {
          console.log("Web Share API not supported");
        }
      }, "image/png");
    };
  };

  return (
    <div
      key={song.id}
      style={{ marginBottom: "10px", display: "flex", alignItems: "center" }}
    >
      <button
        type="button"
        onClick={togglePlay}
        style={{ cursor: "pointer", marginRight: "10px" }}
      >
        {isPlaying ? "⏸" : "▶️"}
      </button>
      <div>{song.name}</div>
      <audio ref={audioRef} src={song.preview_url}>
        <track kind="captions" />
      </audio>
      <button type="button" onClick={shareSong}>
        Share
      </button>
    </div>
  );
}

SongPlayer.propTypes = {
  song: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    preview_url: PropTypes.string.isRequired,
  }).isRequired,
};

export default SongPlayer;
