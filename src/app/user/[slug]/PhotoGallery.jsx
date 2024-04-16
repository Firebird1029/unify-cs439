export default function PhotoGallery({ imageLinks }) {
  return (
    <div className="h-full w-full grid grid-cols-3 gap-3 place-items-center">
      {imageLinks.map((link) => {
        return <img className="rounded-lg" src={link} alt="Artist" />;
      })}
    </div>
  );
}
