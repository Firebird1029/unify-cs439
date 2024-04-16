import PropTypes from "prop-types";

export default function PhotoGallery({ imageLinks }) {
  return (
    <div className="h-full w-full grid grid-cols-3 gap-3 place-items-center">
      {imageLinks.map((link) => (
        <img className="rounded-lg" src={link} alt="Artist" />
      ))}
    </div>
  );
}

PhotoGallery.propTypes = {
  imageLinks: PropTypes.arrayOf(PropTypes.string).isRequired,
};
