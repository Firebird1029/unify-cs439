import PropTypes from "prop-types";
import "@/app/globals.css";

function GeneralCassette({ userData }) {
  const topGenreEntry = Object.entries(userData.topGenres).sort(
    (a, b) => b[1] - a[1],
  )[0]; // Sort genres by frequency and select the first one
  // Extract genre and frequency
  const topGenre = topGenreEntry ? topGenreEntry[0] : "Nothing";

  return (
    <svg
      width="380"
      height="241"
      viewBox="0 0 380 241"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="380" height="241" fill="" />
      <rect x="41" y="41" width="310" height="120" rx="8" fill="#FF5555" />
      <rect x="60" y="101" width="15" height="23" fill="#B469FF" />
      <path d="M75 101H90V124H75V101Z" fill="#FFD569" />
      <path d="M75 101H90V124H75V101Z" fill="#FFD569" />
      <path d="M90 101H105V124H90V101Z" fill="#69FFAE" />
      <path d="M90 101H105V124H90V101Z" fill="#69FFAE" />
      <path d="M105 101H120V124H105V101Z" fill="#FF7B69" />
      <path d="M105 101H120V124H105V101Z" fill="#FF7B69" />
      <rect x="270" y="101" width="15" height="23" fill="#69E4FF" />
      <path d="M285 101H300V124H285V101Z" fill="#6993FF" />
      <path d="M285 101H300V124H285V101Z" fill="#6993FF" />
      <path d="M300 101H315V124H300V101Z" fill="#69FFAE" />
      <path d="M300 101H315V124H300V101Z" fill="#69FFAE" />
      <path d="M315 101H330V124H315V101Z" fill="#F693C2" />
      <path d="M315 101H330V124H315V101Z" fill="#F693C2" />
      <rect x="41" y="61" width="310" height="40" fill="#FFC8AA" />
      <text
        fill="black"
        xmlSpace="preserve"
        style={{
          whiteSpace: "pre",
          fontFamily: "Koulen",
          fontSize: "12px",
          letterSpacing: "0em",
        }}
      >
        <tspan x="69" y="78.8086">
          Side{" "}
        </tspan>
      </text>
      <text
        fill="black"
        xmlSpace="preserve"
        style={{
          whiteSpace: "pre",
          fontFamily: "Calligraffitti",
          fontSize: "14px",
          letterSpacing: "0em",
        }}
      >
        <tspan x="172.845" y="74.5908">
          @{userData.userProfile.display_name}
        </tspan>
      </text>
      <text
        fill="black"
        xmlSpace="preserve"
        style={{
          whiteSpace: "pre",
          fontFamily: "Koulen",
          fontSize: "40px",
          letterSpacing: "0em",
        }}
      >
        <tspan x="90" y="96.6953">
          B
        </tspan>
      </text>
      <text
        fill="#FFC8AA"
        xmlSpace="preserve"
        style={{
          whiteSpace: "pre",
          fontFamily: "Koulen",
          fontSize: "20px",
          letterSpacing: "0em",
        }}
      >
        <tspan x="103.285" y="151.348">
          Listen to {topGenre} much?{" "}
        </tspan>
      </text>
      <path d="M114 79.5H320" stroke="black" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M56 33C47.7157 33 41 39.7157 41 48V194C41 202.284 47.7157 209 56 209H336C344.284 209 351 202.284 351 194V48C351 39.7157 344.284 33 336 33H56ZM71 54C65.4772 54 61 58.4772 61 64V150C61 155.523 65.4771 160 71 160H320C325.523 160 330 155.523 330 150V64C330 58.4772 325.523 54 320 54H71Z"
        fill="#161616"
      />
      <rect x="117" y="81" width="158" height="49" rx="8" fill="#161616" />
      <circle cx="146" cy="105" r="15" fill="#D9D9D9" />
      <circle cx="245" cy="105" r="15" fill="#D9D9D9" />
      <rect x="169" y="91" width="53" height="28" fill="#D9D9D9" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M222 91.0082V118.992C214.223 118.737 208 112.57 208 105C208 97.4296 214.223 91.2626 222 91.0082Z"
        fill="#5E5E5E"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M182 91H169V119H182V118.984C189.777 118.729 196 112.562 196 104.992C196 97.4214 189.777 91.2544 182 91Z"
        fill="#5E5E5E"
      />
      <path
        d="M104.684 208.5L114.866 176.5H275.66L288.266 208.5H104.684Z"
        fill="black"
        stroke="#5E5E5E"
        strokeLinejoin="bevel"
      />
      <path
        d="M136.535 193.915C138.422 196.639 138.665 199.739 137.076 200.84C135.487 201.941 132.669 200.626 130.781 197.902C128.894 195.178 128.652 192.078 130.241 190.977C131.83 189.876 134.648 191.191 136.535 193.915Z"
        fill="#D9D9D9"
      />
      <path
        d="M256.417 193.932C254.53 196.655 254.288 199.756 255.877 200.857C257.466 201.958 260.284 200.642 262.171 197.919C264.058 195.195 264.3 192.094 262.712 190.993C261.123 189.893 258.305 191.208 256.417 193.932Z"
        fill="#D9D9D9"
      />
      <path
        d="M197.854 181.288C199.112 183.104 198.66 185.596 196.844 186.854C195.029 188.112 192.537 187.66 191.278 185.844C190.02 184.029 190.472 181.537 192.288 180.278C194.104 179.02 196.596 179.472 197.854 181.288Z"
        fill="#5E5E5E"
      />
      <path d="M197 186L192 181" stroke="#161616" />
      <path d="M192 186L197 181" stroke="#161616" />
    </svg>
  );
}
export default GeneralCassette;

GeneralCassette.propTypes = {
  userData: PropTypes.shape({
    userProfile: PropTypes.shape({
      display_name: PropTypes.string,
    }),
    topArtists: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
      }),
    ),
    topSongs: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
      }),
    ),
    featuresData: PropTypes.arrayOf(PropTypes.shape()),
    topGenres: PropTypes.shape(), // TODO ???
  }).isRequired,
};
