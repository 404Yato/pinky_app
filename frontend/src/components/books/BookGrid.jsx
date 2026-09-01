import { BookCard } from "@/components/books/BookCard";

export function BookGrid({ books, onSelectBook }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 xl:grid-cols-4 xl:gap-6">
      {books.map((book) => <BookCard key={book.id} book={book} onSelect={onSelectBook} />)}
    </div>
  );
}
