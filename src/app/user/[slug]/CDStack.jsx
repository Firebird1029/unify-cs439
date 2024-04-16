import CDCase from "@/app/user/[slug]/CDCase";

export default function CDStack({ topArtists, userColors }) {
  console.log(topArtists);
  return (
    // note that the viewbox height is set dependent on the number
    // of CDs in the stack
    <svg
      width="100%"
      height="100%"
      viewBox={`0 0 500 ${80 * topArtists.length}`}
    >
      {topArtists.map((artist, rank) => {
        const xOffset = Math.floor(Math.random() * 80);
        const yOffset = rank * 80;
        return (
          <CDCase
            title={artist.name}
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
