import CDCase from "@/app/user/[slug]/CDCase";

export default function CDStack({ topArtists, userColors }) {
  console.log(topArtists);
  const offsets = ["1", "4", "32", "64"];
  return (
    <svg width="100%" height="100%">
      <foreignObject x="0" y="0" width="300px" height="1000px">
        {topArtists.map((artist, rank) => {
          const offset = `ml-${offsets[Math.round(Math.random() * offsets.length)]}`;
          return (
            <div className={`w-[80%] mb-2 ${offset}`}>
              <CDCase
                title={artist.name}
                ranking={rank + 1}
                userColors={userColors}
              />
            </div>
          );
        })}
      </foreignObject>
    </svg>
  );
}
