import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import { focusedCollections } from "@/config/collections";
import { DEFAULT_BOOK_QUERY } from "@/constants/books";
import { createSharedRequest, removeBookFromCollection, updateCollectionQueryState, upsertBookInCollection } from "@/lib/libraryCache";
import { getBooks } from "@/services/api/books";

const LibraryContext = createContext(null);
const loadLibraryOnce = createSharedRequest(getBooks);

function createInitialQueries() {
  return {
    library: { ...DEFAULT_BOOK_QUERY },
    ...Object.fromEntries(
      Object.values(focusedCollections).map((collection) => [
        collection.id,
        { ...DEFAULT_BOOK_QUERY, ...collection.query },
      ]),
    ),
  };
}

export function LibraryProvider({ children }) {
  const [books, setBooks] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);
  const [requestVersion, setRequestVersion] = useState(0);
  const [collectionQueries, setCollectionQueries] = useState(createInitialQueries);

  useEffect(() => {
    let active = true;
    setStatus("loading");
    setError(null);

    loadLibraryOnce()
      .then((loadedBooks) => {
        if (!active) return;
        setBooks(loadedBooks);
        setStatus("success");
      })
      .catch((loadError) => {
        if (!active) return;
        setBooks([]);
        setError(loadError);
        setStatus("error");
      });

    return () => {
      active = false;
    };
  }, [requestVersion]);

  const retry = useCallback(() => setRequestVersion((version) => version + 1), []);
  const upsertBook = useCallback((book) => setBooks((current) => upsertBookInCollection(current, book)), []);
  const removeBook = useCallback((bookId) => setBooks((current) => removeBookFromCollection(current, bookId)), []);
  const setCollectionQuery = useCallback((collectionId, update) => {
    setCollectionQueries((current) => updateCollectionQueryState(current, collectionId, update));
  }, []);

  const value = useMemo(() => ({
    books,
    status,
    error,
    retry,
    upsertBook,
    removeBook,
    collectionQueries,
    setCollectionQuery,
  }), [books, collectionQueries, error, removeBook, retry, setCollectionQuery, status, upsertBook]);

  return <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>;
}

export function useLibrary() {
  const library = useContext(LibraryContext);
  if (!library) throw new Error("useLibrary must be used within LibraryProvider");
  return library;
}
