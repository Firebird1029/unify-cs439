export default function PaperTitle({ children }) {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 380 220"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <filter id="roughpaper">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.027"
          result="noise"
          numOctaves="8"
        />

        <feDiffuseLighting in="noise" lightingColor="white" surfaceScale="10">
          <feDistantLight azimuth="130" elevation="100" />
        </feDiffuseLighting>
        <feComposite
          in="turb"
          operator="arithmetic"
          k1="0"
          k2="0.5"
          k3="0.1"
          result="result1"
        />
        <feComposite
          operator="in"
          in="result1"
          in2="SourceGraphic"
          result="finalFilter"
        />
        <feBlend mode="multiply" in="finalFilter" in2="SourceGraphic" />
      </filter>
      <path
        d="M0 69.633L24.5566 29.9388V14.8012L56.1774 0H86.1162H166.177L210.245 7.737L274.495 0H311.498H337.064L342.446 21.8654L358.257 35.9939L373.058 49.1131L362.63 58.8685V77.37L379.449 108.318L364.312 155.749L379.449 173.242L362.63 198.135L328.318 212.263H315.871L311.498 220L303.761 206.881L274.495 220L237.492 206.881L191.07 212.263L134.557 206.881L92.1712 220L67.6147 206.881H16.4832L24.5566 182.324L8.74618 151.376L16.4832 130.183V99.5718L0 69.633Z"
        fill="white"
        filter="url(#roughpaper)"
      />
      <foreignObject x="0" y="0" width="380" height="220">
        <div className="w-full h-full flex justify-center items-center">
          <div className="font-koulen w-[80%] text-center text-7xl">
            {children}
          </div>
        </div>
      </foreignObject>
    </svg>
  );
}
