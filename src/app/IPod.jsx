/**
 * Takes children to display on its screen.
 * <Ipod>Contents</Ipod>
 */
import PropTypes from "prop-types";

export default function Ipod({ children }) {
  return (
    <svg
      className="w-[100%] h-[100%]"
      width="648"
      height="878"
      viewBox="0 0 648 878"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g filter="url(#filter0_d_157_54)">
        <rect
          x="11"
          y="2"
          width="626"
          height="895"
          rx="50.8681"
          fill="url(#paint0_linear_157_54)"
        />
      </g>
      <g id="screen">
        <rect
          x="99.5"
          y="87.5"
          width="444"
          height="277"
          rx="12.5"
          fill="#1F1F1F"
          stroke="black"
          strokeWidth="5"
        />
        {/* add in children as foreign object */}
        <foreignObject x="99.5" y="87.5" width="444" height="277">
          <div xmlns="http://www.w3.org/1999/xhtml">{children}</div>
        </foreignObject>
      </g>
      <path
        d="M536.076 627.295C536.076 745.586 442.458 841.458 327 841.458C211.542 841.458 117.924 745.586 117.924 627.295C117.924 509.005 211.542 413.132 327 413.132C442.458 413.132 536.076 509.005 536.076 627.295Z"
        fill="url(#paint1_radial_157_54)"
        stroke="black"
      />
      <path
        d="M429.771 627.295C429.771 685.758 383.285 733.118 325.983 733.118C268.68 733.118 222.195 685.758 222.195 627.295C222.195 568.833 268.68 521.472 325.983 521.472C383.285 521.472 429.771 568.833 429.771 627.295Z"
        fill="url(#paint2_radial_157_54)"
        stroke="#939393"
        strokeWidth="2"
      />
      <g filter="url(#filter1_i_157_54)">
        <rect
          x="312"
          y="790"
          width="10"
          height="30"
          transform="rotate(-90 312 790)"
          fill="#D3D3D3"
        />
      </g>
      <g filter="url(#filter2_i_157_54)">
        <rect x="322" y="445" width="10" height="30" fill="#D3D3D3" />
        <rect
          x="312"
          y="465"
          width="10"
          height="30"
          transform="rotate(-90 312 465)"
          fill="#D3D3D3"
        />
      </g>
      <g filter="url(#filter3_i_157_54)">
        <path
          d="M499.318 629.221L476.486 642.403L476.486 616.039L499.318 629.221Z"
          fill="#D3D3D3"
        />
        <path
          d="M478.443 629.221L455.611 642.403L455.611 616.039L478.443 629.221Z"
          fill="#D3D3D3"
        />
        <rect
          x="499.318"
          y="615.74"
          width="8.69792"
          height="26.0938"
          fill="#D3D3D3"
        />
      </g>
      <g filter="url(#filter4_i_157_54)">
        <path
          d="M152.698 629.221L175.53 616.039L175.53 642.403L152.698 629.221Z"
          fill="#D3D3D3"
        />
        <path
          d="M173.573 629.221L196.405 616.039L196.405 642.403L173.573 629.221Z"
          fill="#D3D3D3"
        />
        <rect
          x="152.698"
          y="642.703"
          width="8.69792"
          height="26.0938"
          transform="rotate(180 152.698 642.703)"
          fill="#D3D3D3"
        />
      </g>
      {/* this next part is just paper texture stuff(?) using feComposite */}
      <defs>
        <filter
          id="filter0_d_157_54"
          x="0.861112"
          y="0"
          width="646.278"
          height="915.278"
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
          <feMorphology
            radius="2"
            operator="dilate"
            in="SourceAlpha"
            result="effect1_dropShadow_157_54"
          />
          <feOffset dy="8.13889" />
          <feGaussianBlur stdDeviation="4.06944" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.36 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_157_54"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_157_54"
            result="shape"
          />
        </filter>
        <filter
          id="filter1_i_157_54"
          x="312"
          y="780"
          width="30"
          height="14"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="4" />
          <feGaussianBlur stdDeviation="2" />
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
          />
          <feBlend
            mode="normal"
            in2="shape"
            result="effect1_innerShadow_157_54"
          />
        </filter>
        <filter
          id="filter2_i_157_54"
          x="312"
          y="445"
          width="30"
          height="34"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="4" />
          <feGaussianBlur stdDeviation="2" />
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
          />
          <feBlend
            mode="normal"
            in2="shape"
            result="effect1_innerShadow_157_54"
          />
        </filter>
        <filter
          id="filter3_i_157_54"
          x="455.611"
          y="615.74"
          width="52.4049"
          height="30.6639"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="4" />
          <feGaussianBlur stdDeviation="2" />
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
          />
          <feBlend
            mode="normal"
            in2="shape"
            result="effect1_innerShadow_157_54"
          />
        </filter>
        <filter
          id="filter4_i_157_54"
          x="144"
          y="616.039"
          width="52.4049"
          height="30.6639"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="4" />
          <feGaussianBlur stdDeviation="2" />
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
          />
          <feBlend
            mode="normal"
            in2="shape"
            result="effect1_innerShadow_157_54"
          />
        </filter>
        <linearGradient
          id="paint0_linear_157_54"
          x1="11"
          y1="553"
          x2="637"
          y2="551.5"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#E0E0E0" />
          <stop offset="0.085" stopColor="#F7F7F7" />
          <stop offset="0.5" stopColor="#F8F8F8" />
          <stop offset="0.895" stopColor="#F3F3F3" />
          <stop offset="1" stopColor="#D9D9D9" />
        </linearGradient>
        <radialGradient
          id="paint1_radial_157_54"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(327 627.295) rotate(90) scale(214.663 209.576)"
        >
          <stop offset="0.42" stopColor="#D3D3D3" />
          <stop offset="0.57" stopColor="#FDFDFD" />
          <stop offset="0.845" stopColor="white" />
          <stop offset="1" stopColor="#E5E5E5" />
        </radialGradient>
        <radialGradient
          id="paint2_radial_157_54"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(325.983 627.295) rotate(90) scale(106.823 104.788)"
        >
          <stop offset="0.66" stopColor="white" />
          <stop offset="1" stopColor="#ECECEC" />
        </radialGradient>
      </defs>
    </svg>
  );
}
Ipod.propTypes = {
  children: PropTypes.node.isRequired,
};
