import PropTypes from "prop-types";

export default function PhotoMarquee({ imageLinks }) {
  return (
    <div
      style={{ width: `${imageLinks.length * 40}%`, maxWidth: "100vw" }}
      className="relative flex overflow-x-hidden"
    >
      <div className="py-12 animate-marquee whitespace-nowrap">
        {imageLinks.map((link) => (
          <img
            key={link}
            className="mx-8 inline-block rounded-lg w-[10%] md:w-[7%] h-auto object-cover"
            src={link}
            alt="Artist"
          />
        ))}
      </div>
      {/* <div className="absolute top-0 py-12 animate-marquee2 whitespace-nowrap">
        {imageLinks.map((link) => (
          <img
            key={link}
            className="mx-4 inline-block rounded-lg w-[10%] h-auto object-cover"
            src={link}
            alt="Artist"
          />
        ))}
      </div> */}
    </div>
  );
}

PhotoMarquee.propTypes = {
  imageLinks: PropTypes.arrayOf(PropTypes.string).isRequired,
};
