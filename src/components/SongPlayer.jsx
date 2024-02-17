import React, { useRef, useState, useEffect } from "react";

function SongPlayer({ song, token }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    const audioElement = audioRef.current;

    if (isPlaying) {
      audioElement.pause();
    } else {
      audioElement.play();
    }

    setIsPlaying(!isPlaying);
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
    </div>
  );
}

export default SongPlayer;
