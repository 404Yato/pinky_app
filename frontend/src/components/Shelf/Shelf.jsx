import { BookSpine } from "../BookSpine";
import "./Shelf.css";

export default function Shelf({ books }) {
  const length = 3;

  return (
    <div className="shelf">
      {books.map((book) => (
        <div key={book.title} className="bookPlace">
          <BookSpine book={book} />
        </div>
      ))}
    </div>
  );
}
