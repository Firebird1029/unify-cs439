/*
 * SVG Boombox
 * Requires userData (profile img, top artist)
 * and takes the sharecassette function from parent
 */

import PropTypes from "prop-types";
import getPersonality from "@/shared/GetPersonality";

export default function Boombox({ userData, shareCassetteFunc }) {
  // handle case where user does not have profile pciture
  const profilePictureURL =
    userData?.userProfile?.images[1]?.url ||
    "https://upload.wikimedia.org/wikipedia/commons/a/af/Default_avatar_profile.jpg";

  // handle case where top album does not have album image
  const albumPictureURL =
    userData?.topArtists[0]?.images[1]?.url ||
    "https://upload.wikimedia.org/wikipedia/commons/a/af/Default_avatar_profile.jpg";

  const userColors = getPersonality(userData).colors;

  return (
    <svg
      width="90%"
      height="90%"
      viewBox="0 0 883 488"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="841.289"
        y="175.727"
        width="41.366"
        height="63.7037"
        rx="5.79124"
        fill="#636363"
      />
      <rect
        x="841.289"
        y="270.041"
        width="41.366"
        height="29.7835"
        rx="5.79124"
        fill="#636363"
      />
      <rect
        x="129.792"
        y="71.4844"
        width="62.0491"
        height="37.2294"
        rx="8.27321"
        fill="#636363"
      />
      <rect
        x="205.906"
        y="71.4839"
        width="62.0491"
        height="37.2294"
        rx="8.27321"
        fill="#636363"
      />
      <rect
        x="687.407"
        y="71.4839"
        width="22.3377"
        height="37.2294"
        rx="8.27321"
        fill="#636363"
      />
      <rect
        x="723.809"
        y="71.4839"
        width="22.3377"
        height="37.2294"
        rx="8.27321"
        fill="#636363"
      />
      <mask id="path-7-inside-1_203_505" fill="white">
        <rect
          x="55.334"
          y="0.334961"
          width="751.207"
          height="162.982"
          rx="16.5464"
        />
      </mask>
      <rect
        x="55.334"
        y="0.334961"
        width="751.207"
        height="162.982"
        rx="16.5464"
        stroke="url(#paint0_linear_203_505)"
        strokeWidth="66.1857"
        mask="url(#path-7-inside-1_203_505)"
      />
      <rect
        x="0.730469"
        y="82.2393"
        width="859.586"
        height="405.387"
        rx="20.683"
        fill="url(#paint1_linear_203_505)"
      />
      <g
        id="shareButton"
        filter="url(#filter0_d_203_505)"
        className="cursor-pointer"
      >
        <foreignObject x="309.321" y="339.536" width="249.851" height="73.6315">
          <button
            type="button"
            onClick={() => shareCassetteFunc(userData)}
            className="rounded-lg h-full w-full bg-[#ECECEC] font-koulen text-4xl"
          >
            Share Cassette
          </button>
        </foreignObject>
      </g>
      <g filter="url(#filter1_d_203_505)">
        <rect
          x="13.9673"
          y="98.7856"
          width="827.321"
          height="91.0053"
          rx="28.9562"
          fill="#ECECEC"
        />
        <foreignObject x="13.9673" y="98.7856" width="827.321" height="91.0053">
          <div className="flex flex-row justify-center items-center h-full">
            <p className="text-6xl font-koulen">
              @ {userData.userProfile.display_name}
            </p>
          </div>
        </foreignObject>
      </g>
      <circle cx="159.162" cy="332.504" r="114.584" fill="#5E5E5E" />
      <circle cx="159.844" cy="332.907" r="103.732" fill="black" />
      <circle cx="159.844" cy="332.907" r="103.732" fill="black" />
      <circle cx="709.331" cy="332.504" r="114.584" fill="#5E5E5E" />
      <rect
        x="345.559"
        y="218.726"
        width="163.01"
        height="79.4149"
        rx="14.0645"
        fill="#ECECEC"
      />
      <path
        d="M383.613 277.15C381.921 277.15 380.355 276.712 378.915 275.835C377.474 274.958 376.323 273.784 375.462 272.312C374.616 270.824 374.193 269.203 374.193 267.449L374.287 243.396C374.287 243.271 374.35 243.208 374.475 243.208H379.878C380.003 243.208 380.066 243.271 380.066 243.396V267.449C380.066 268.53 380.41 269.454 381.099 270.221C381.788 270.973 382.626 271.349 383.613 271.349C384.646 271.349 385.508 270.973 386.197 270.221C386.886 269.454 387.23 268.53 387.23 267.449V243.396C387.23 243.271 387.293 243.208 387.418 243.208H392.821C392.946 243.208 393.009 243.271 393.009 243.396L393.102 267.449C393.102 269.219 392.68 270.847 391.834 272.335C390.973 273.807 389.83 274.982 388.405 275.859C386.98 276.72 385.382 277.15 383.613 277.15ZM402.122 276.681H397.307C397.057 276.681 396.931 276.571 396.931 276.352L396.884 243.584C396.884 243.333 397.01 243.208 397.26 243.208H401.606L409.733 262.164L409.498 243.584C409.498 243.333 409.639 243.208 409.921 243.208H414.689C414.877 243.208 414.971 243.333 414.971 243.584L415.018 276.399C415.018 276.587 414.94 276.681 414.783 276.681H410.555L402.216 258.97L402.569 276.305C402.569 276.555 402.42 276.681 402.122 276.681ZM424.884 276.681H419.434C419.278 276.681 419.199 276.602 419.199 276.446L419.246 243.396C419.246 243.271 419.309 243.208 419.434 243.208H424.837C424.962 243.208 425.025 243.271 425.025 243.396L425.072 276.446C425.072 276.602 425.009 276.681 424.884 276.681ZM434.937 276.681H429.488C429.363 276.681 429.3 276.618 429.3 276.493V271.043C429.3 270.918 429.363 270.855 429.488 270.855H434.937C435.063 270.855 435.125 270.918 435.125 271.043V276.493C435.125 276.618 435.063 276.681 434.937 276.681ZM444.709 276.681H439.307C439.15 276.681 439.072 276.602 439.072 276.446L439.166 243.396C439.166 243.271 439.228 243.208 439.354 243.208H454.763C454.919 243.208 454.998 243.271 454.998 243.396V248.822C454.998 248.947 454.935 249.01 454.81 249.01H444.944V256.48H454.81C454.935 256.48 454.998 256.558 454.998 256.715L455.045 262.164C455.045 262.289 454.966 262.352 454.81 262.352H444.944V276.446C444.944 276.602 444.866 276.681 444.709 276.681ZM469.35 276.681H463.83C463.72 276.681 463.665 276.618 463.665 276.493L463.712 262.822L457.276 243.396C457.245 243.271 457.292 243.208 457.417 243.208H462.773C462.929 243.208 463.023 243.271 463.055 243.396L466.601 256.339L470.219 243.396C470.25 243.271 470.328 243.208 470.454 243.208H475.856C475.982 243.208 476.029 243.271 475.997 243.396L469.491 262.634L469.538 276.493C469.538 276.618 469.475 276.681 469.35 276.681ZM483.162 267.825H479.873C479.732 267.825 479.654 267.747 479.638 267.59L478.628 256.527V243.443C478.628 243.286 478.691 243.208 478.816 243.208H484.219C484.375 243.208 484.454 243.286 484.454 243.443L484.407 256.527L483.397 267.59C483.381 267.747 483.303 267.825 483.162 267.825ZM484.219 276.681H478.816C478.691 276.681 478.628 276.602 478.628 276.446V271.208C478.628 271.067 478.691 270.996 478.816 270.996H484.219C484.344 270.996 484.407 271.067 484.407 271.208V276.446C484.407 276.602 484.344 276.681 484.219 276.681Z"
        fill="black"
      />
      {/* Boombox left and right speaker */}
      <circle cx="160" cy="333" r="103" fill="#D9D9D9" />
      <foreignObject x="57" y="230" width="206" height="206">
        <div
          className="rounded-full"
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            overflow: "hidden",
          }}
        >
          <img
            className="rounded-full shadow-inner"
            alt="User Top Artist"
            src={albumPictureURL}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </div>
      </foreignObject>
      <circle cx="709" cy="332" r="103" fill={userColors.light} />
      <foreignObject x="606" y="229" width="206" height="206">
        <div
          className="rounded-full"
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            overflow: "hidden",
          }}
        >
          <img
            className="rounded-full shadow-inner"
            alt="User Top Artist"
            src={profilePictureURL}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </div>
      </foreignObject>
      {/* End of boombox left/right speaker */}
      <defs>
        <filter
          id="filter0_d_203_505"
          x="305.321"
          y="339.536"
          width="257.851"
          height="81.6313"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="4" />
          <feGaussianBlur stdDeviation="2" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_203_505"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_203_505"
            result="shape"
          />
        </filter>
        <filter
          id="filter1_d_203_505"
          x="9.96729"
          y="98.7856"
          width="835.321"
          height="99.0054"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="4" />
          <feGaussianBlur stdDeviation="2" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_203_505"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_203_505"
            result="shape"
          />
        </filter>
        <linearGradient
          id="paint0_linear_203_505"
          x1="377.639"
          y1="-22.3157"
          x2="377.639"
          y2="107.246"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#5E5E5E" />
          <stop offset="1" stopColor="#C4C4C4" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_203_505"
          x1="430.524"
          y1="82.2393"
          x2="430.524"
          y2="487.626"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.39" stopColor="#B0B0B0" />
          <stop offset="1" stopColor="#4A4A4A" />
        </linearGradient>
      </defs>
    </svg>
  );
}

Boombox.propTypes = {
  userData: PropTypes.shape({
    topArtists: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        images: PropTypes.arrayOf(
          PropTypes.shape({
            url: PropTypes.string.isRequired,
          }),
        ).isRequired,
      }),
    ),
    userProfile: PropTypes.shape({
      display_name: PropTypes.string.isRequired,
      images: PropTypes.arrayOf(
        PropTypes.shape({
          url: PropTypes.string.isRequired,
        }),
      ).isRequired,
    }),
  }).isRequired,
  shareCassetteFunc: PropTypes.func.isRequired,
};
