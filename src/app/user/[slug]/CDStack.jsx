/*
Generates an SVG stack of CD cases
Params:
- topList: The ranking to be displayed through the stack
- userColors: color scheme
 */
import CDCase from "@/app/user/[slug]/CDCase";

export default function CDStack({ topList, userColors }) {
  console.log(topList);
  return (
    // note that the viewbox height is set dependent on the number
    // of CDs in the stack
    <svg width="100%" height="100%" viewBox={`0 0 500 ${80 * topList.length}`}>
      {topList.map((val, rank) => {
        const xOffset = Math.floor(Math.random() * 80);
        const yOffset = rank * 80;
        return (
          <CDCase
            title={val}
            ranking={rank + 1}
            userColors={userColors}
            yOffset={yOffset}
            xOffset={xOffset}
          />
        );
      })}
    </svg>
  );
}
