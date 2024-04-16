// Combines vinyl graphic and pie chart to form genre pie chart graphic.

import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { ResponsivePie } from "@nivo/pie";
import "@/app/globals.css";

/* 
Function that actually builds the Vinyl Circle overlay. It takes a width (ie a radius) 
and a centreColor, and builds the correctly-sized svg overlay. 
This is then overlaid onto the pie chart. Note that the first svg builds the many 
circular lines across the pie chart, the second the 'color' portion in the middle, 
and the third a thicker barrier between the color portion and the chart itself.
*/

export function VinylCircle({ centerCircleColor = "#1d40af", width = 0 }) {
  const newWidth = Math.min((width - 280) / 2, 160);
  const radii = [];
  if (newWidth > 0) {
    for (let i = newWidth - 1; i > 10; i -= 3) {
      radii.push(i);
    }
  }

  return (
    <svg width="400" height="400" data-testid="VinylCircle">
      {radii.map((radius) => (
        <circle
          key={radius}
          r={radius}
          cx="200"
          cy="200"
          fill="none"
          stroke="black"
          strokeWidth="1.35"
        />
      ))}
      <circle
        r={Math.round(newWidth * 0.15625)}
        cx="200"
        cy="200"
        fill="none"
        stroke={centerCircleColor}
        strokeWidth={Math.round(newWidth * 0.2)}
      />
      <circle
        r={Math.round(newWidth * 0.275)}
        cx="200"
        cy="200"
        fill="none"
        stroke="black"
        strokeWidth={Math.round(newWidth * 0.05)}
      />
    </svg>
  );
}

VinylCircle.propTypes = {
  centerCircleColor: PropTypes.string,
  width: PropTypes.number,
};

/* Builds nivo pie chart, and overlays the SVG above on top of it */

export default function GenrePieChart({ data, centerCircleColor = "#1d40af" }) {
  const [divWidth, setDivWidth] = useState(0);
  const divRef = useRef(null);

  // Effect hook for setting and updating div width
  // Allows for the vinyl 'overlay' to dynamically scale
  useEffect(() => {
    const updateWidth = () => {
      if (divRef.current) {
        setDivWidth(divRef.current.offsetWidth);
      }
    };

    // Add resize event listener
    window.addEventListener("resize", updateWidth);
    updateWidth();

    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  return (
    <div
      ref={divRef}
      style={{ height: 440, position: "relative" }}
      data-testid="GenrePieChart"
    >
      <ResponsivePie
        data={data}
        margin={{ top: 70, right: 140, bottom: 50, left: 140 }}
        innerRadius={0.3}
        keys={["value"]}
        colors={["#444444", "#888888", "#cccccc", "#444444", "#cccccc"]}
        arcLinkLabelsTextColor="#333333"
        arcLinkLabelsThickness={2}
        arcLinkLabelsColor={{ from: "color" }}
        enableArcLabels={false}
        arcLabelsTextColor={{ from: "color", modifiers: [["darker", 2]] }}
        isInteractive={false}
        animate={false}
        legends={[]}
        theme={{
          text: {
            fontSize: 25,
            fill: "#333333",
            outlineWidth: 0,
            outlineColor: "transparent",
            fontFamily: "var(--font-koulen)",
          },
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 20,
          right: 0,
          bottom: 0,
          left: Math.min(0, divWidth - 400),
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        <VinylCircle centerCircleColor={centerCircleColor} width={divWidth} />
      </div>
    </div>
  );
}

GenrePieChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired,
    }),
  ).isRequired,
  centerCircleColor: PropTypes.string,
};
