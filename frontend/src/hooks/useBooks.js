import { useCallback, useEffect, useMemo, useState } from "react";

import { queryBookCollection } from "@/lib/bookQueries";
import { getBooks } from "@/services/api/books";

export function useBooks(query) {
  const [loadedBooks, setLoadedBooks] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);
  const [requestVersion, setRequestVersion] = useState(0);

  const retry = useCallback(() => setRequestVersion((version) => version + 1), []);

  useEffect(() => {
    let active = true;

    async function loadBooks() {
      setStatus("loading");
      setError(null);

      try {
        const result = await getBooks();
        if (!active) return;
        setLoadedBooks(result);
        setStatus("success");
      } catch (loadError) {
        if (!active) return;
        setLoadedBooks([]);
        setError(loadError);
        setStatus("error");
      }
    }

    loadBooks();
    return () => {
      active = false;
    };
  }, [requestVersion]);

  const filteredBooks = useMemo(
    () => (status === "success" ? queryBookCollection(loadedBooks, query) : []),
    [loadedBooks, query, status],
  );

  return { books: filteredBooks, status, error, retry };
}
