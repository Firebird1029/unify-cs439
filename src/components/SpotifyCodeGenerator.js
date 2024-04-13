/* eslint-disable no-bitwise */

/* 
Old functions to create an svg graphic of the spotify code for a given uri
Uses scannables.scdn.co which is the backend site spotify uses to generate the spotify codes
Spotify codes can be scanned in spotify to open the page for a song, album, user, or artist
*/

import axios from "axios";

// take a string and convert it to an integer hash
function hashCode(str) {
  let hash = 0;
  if (str.length === 0) return hash;

  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32-bit integer
  }

  return hash;
}

// uses a seed to get a random pastel color
function getColorFromSeed(seed) {
  const baseColor = Math.floor(seed * 16777215).toString(16); // Generate a random base color

  // Convert the base color to RGB
  const rgb = parseInt(baseColor, 16);
  const r = (rgb >> 16) & 255;
  const g = (rgb >> 8) & 255;
  const b = rgb & 255;

  // Adjust the brightness and saturation for a pastel effect
  const colorR = Math.floor((r + 255) / 2);
  const colorG = Math.floor((g + 255) / 2);
  const colorB = Math.floor((b + 255) / 2);

  // Convert the pastel color back to hex
  const pastelColor = ((colorR << 16) | (colorG << 8) | colorB)
    .toString(16)
    .padStart(6, "0");

  return `#${pastelColor}`;
}

// function to modify the svg returned by spotify to remove background
const modifySvg = (svgString) => {
  // console.log(uri);
  // console.log(hashCode(uri));
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgString, "image/svg+xml");

  // change everything that is white (background) to transparent
  const whiteRectangles = doc.querySelectorAll('rect[fill="#ffffff"]');
  whiteRectangles.forEach((rect) => {
    rect.setAttribute("fill", "none");
  });

  // Convert the modified DOM back to string
  const serializer = new XMLSerializer();
  const modifiedSvgString = serializer.serializeToString(doc);

  return modifiedSvgString;
};

export default async function GetSpotifyCode(SpotifyURL) {
  const format = "svg";
  const backgroundColor = "FFFFFF"; // Math.floor(Math.random()*16777215).toString(16);
  const textColor = "black";
  const imageWidth = "400";

  const URIRegex = /\/([^/]+)\/([^?]+)/; /// \/([^\/?]+)\?/;
  const URIString = SpotifyURL.match(URIRegex)[2].split("/")[1];

  const type = SpotifyURL.match(URIRegex)[2].split("/")[0];

  // console.log(`${type}`);

  // console.log(`${URIString}`);

  const FullURI = `spotify:${type}:${URIString}`;

  const url = `https://scannables.scdn.co/uri/plain/${format}/${backgroundColor}/${textColor}/${imageWidth}/${FullURI}`;

  try {
    // console.log(`${url}`);

    // console.log("Start image creation");

    const response = await axios.get(url, { responseType: "arraybuffer" });

    const svgString = new TextDecoder("utf-8").decode(
      new Uint8Array(response.data),
    );

    return svgString;
  } catch (error) {
    // console.error(`Error saving Spotify code: ${error.message}`);
  }

  // console.log("Created image");
  return null;
}

export { hashCode, getColorFromSeed, modifySvg, GetSpotifyCode };
