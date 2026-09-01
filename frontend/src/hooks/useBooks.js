import { useCallback, useEffect, useState } from "react";

import { getBooks } from "@/services/mock/books";

export function useBooks(query) {
  const [books, setBooks] = useState([]);
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
        const result = await getBooks(query);
        if (!active) return;
        setBooks(result);
        setStatus("success");
      } catch (loadError) {
        if (!active) return;
        setBooks([]);
        setError(loadError);
        setStatus("error");
      }
    }

    loadBooks();
    return () => {
      active = false;
    };
  }, [query, requestVersion]);

  return { books, status, error, retry };
}
