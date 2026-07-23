import { Shelf } from "../Shelf";
import "./BookShelf.css";

export default function BookShelf() {
  const books = [
    {
      title: "El señor de los anillos: La comunidad del anillo",
      pages: 330,
    },
    {
      title: "Tokyo Ghoul Tomo 12",
      pages: 230,
    },
    {
      title: "El mito de Sísifo",
      pages: 354,
    },
    {
      title: "1984",
      pages: 354,
    },
    {
      title: "El idiota",
      pages: 354,
    },
    {
      title: "Estimado señor M.",
      pages: 354,
    },
  ];

  const maxBooksPerShelf = 3;

  const distributeBooks = (books, maxLength) => {
    const result = [];
    let i = 0;

    while (i < books.length) {
      result.push(books.slice(i, i + maxLength));
      i += maxLength;
    }

    return result;
  };

  const shelves = distributeBooks(books, maxBooksPerShelf);

  return (
    <div className="bookShelf">
      {shelves.map((shelfBooks, index) => (
        <Shelf key={index} books={shelfBooks} />
      ))}
    </div>
  );
}
