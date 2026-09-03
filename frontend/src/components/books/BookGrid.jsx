import { BookCard } from "@/components/books/BookCard";

export function BookGrid({ books, onSelectBook }) {
  return (
    <div className="@container">
      <div className="grid grid-cols-1 gap-4 @min-[22rem]:grid-cols-2 @min-[36rem]:grid-cols-3 @min-[52rem]:grid-cols-4 sm:gap-5 xl:gap-6">
        {books.map((book) => <BookCard key={book.id} book={book} onSelect={onSelectBook} />)}
      </div>
    </div>
  );
}
