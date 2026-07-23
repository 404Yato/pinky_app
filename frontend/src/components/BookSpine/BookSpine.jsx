import "./BookSpine.css";

export default function BookSpine({ book }) {
  return (
    <div className="bookSpine">
      <p>{book.title}</p>
    </div>
  );
}
