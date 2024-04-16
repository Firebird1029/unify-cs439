import PropTypes from "prop-types";

export default function CDCase({
  title,
  ranking,
  userColors,
  xOffset,
  yOffset,
}) {
  let titleSize = "text-4xl";
  if (title.length > 14 && title.length < 17) {
    titleSize = "text-3xl";
  } else if (title.length >= 17) {
    titleSize = "text-2xl";
  }
  return (
    <g
      transform={`translate(${xOffset},${yOffset})`}
      width="100%"
      height="auto"
      fill="none"
    >
      <rect
        x="24"
        y="17"
        width="42"
        height="39"
        rx="10"
        fill={userColors.light}
      />
      <rect
        x="352"
        y="17"
        width="13"
        height="39"
        rx="6.5"
        fill={userColors.light}
      />
      <path
        d="M75.2229 21.4596C73.8995 20.2198 74.7769 18 76.5903 18H341.625C343.317 18 344.244 19.9709 343.166 21.2748L331.936 34.8492C330.663 36.388 330.72 38.6298 332.07 40.1019L342.654 51.6485C343.83 52.9313 342.92 55 341.18 55H77.1952C75.3316 55 74.4808 52.6758 75.9039 51.4727L88.9541 40.4397C90.7814 38.8948 90.8526 36.1019 89.1063 34.4659L75.2229 21.4596Z"
        stroke={userColors.light}
        strokeWidth="2"
      />
      <path d="M98 28H320.5" stroke={userColors.light} />
      <path d="M98 37H320.5" stroke={userColors.light} />
      <path d="M98 45H320.5" stroke={userColors.light} />
      <rect width="384" height="73" rx="20" fill={userColors.dark} />
      <path
        d="M353 19C353.944 17.741 355.426 17 357 17H360C362.761 17 365 19.2386 365 22V51C365 53.7614 362.761 56 360 56H356.923C355.393 56 353.947 55.2993 352.999 54.0982L341.884 40.02C340.479 38.2397 340.448 35.7364 341.809 33.9218L353 19Z"
        fill={userColors.light}
      />
      <path
        d="M75.2229 21.4596C73.8995 20.2198 74.7769 18 76.5903 18H341.625C343.317 18 344.244 19.9709 343.166 21.2748L331.936 34.8492C330.663 36.388 330.72 38.6298 332.07 40.1019L342.654 51.6485C343.83 52.9313 342.92 55 341.18 55H77.1952C75.3316 55 74.4808 52.6758 75.9039 51.4727L88.9541 40.4397C90.7814 38.8948 90.8526 36.1019 89.1063 34.4659L75.2229 21.4596Z"
        stroke={userColors.light}
        strokeWidth="2"
      />
      <path d="M98 28H320.5" stroke={userColors.light} />
      <path d="M98 37H320.5" stroke={userColors.light} />
      <path d="M98 45H320.5" stroke={userColors.light} />
      <rect x="24" y="17" width="42" height="39" rx="10" fill="white" />
      {/* Title Text */}
      <foreignObject x="90.5" y="17.5" width="240" height="38">
        <div
          className={`h-full flex flex-col justify-center items-center text-white ${titleSize}`}
        >
          {title.length > 19 ? `${title.slice(0, 19)}...` : title}
        </div>
      </foreignObject>
      {/* Ranking Text */}
      <foreignObject x="30.5" y="17.5" width="30" height="38">
        <div
          style={{ color: userColors.dark }}
          className="flex flex-row justify-center items-center text-4xl"
        >
          {ranking}.
        </div>
      </foreignObject>
    </g>
  );
}

CDCase.propTypes = {
  yOffset: PropTypes.number,
  xOffset: PropTypes.number,
  userColors: PropTypes.shape({
    dark: PropTypes.string,
    light: PropTypes.string,
  }),
  dark: PropTypes.string,
  light: PropTypes.string,
  ranking: PropTypes.number,
  title: PropTypes.string.isRequired,
};
