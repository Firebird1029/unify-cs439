/*
Generates an SVG stack of CD cases
Params:
- topList: The ranking to be displayed through the stack
- userColors: color scheme
 */
import PropTypes from "prop-types";
import CDCase from "@/shared/CDCase";

export default function CDStack({ topList, userColors }) {
  return (
    // note that the viewbox height is set dependent on the number
    // of CDs in the stack
    <svg width="100%" height="100%" viewBox={`0 0 500 ${80 * topList.length}`}>
      {topList.map((val, rank) => {
        const xOffset = Math.floor(Math.random() * 80);
        const yOffset = rank * 80;
        return (
          <CDCase
            title={val.name}
            ranking={rank + 1}
            userColors={userColors}
            yOffset={yOffset}
            xOffset={xOffset}
            key={val.id}
          />
        );
      })}
    </svg>
  );
}

CDStack.propTypes = {
  userColors: PropTypes.shape({
    dark: PropTypes.string.isRequired,
    light: PropTypes.string.isRequired,
  }).isRequired,
  topList: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }),
  ).isRequired,
};
