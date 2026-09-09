import { useMemo } from "react";

import { useLibrary } from "@/context/LibraryContext";
import { queryBookCollection } from "@/lib/bookQueries";

export function useBooks(query) {
  const { books: loadedBooks, status, error, retry } = useLibrary();

  const filteredBooks = useMemo(
    () => (status === "success" ? queryBookCollection(loadedBooks, query) : []),
    [loadedBooks, query, status],
  );

  return { books: filteredBooks, status, error, retry };
}
