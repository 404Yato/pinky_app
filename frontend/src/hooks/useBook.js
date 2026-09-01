import { useCallback, useEffect, useState } from "react";

import { getBook } from "@/services/mock/books";

export function useBook(bookId, { enabled = true } = {}) {
  const [book, setBook] = useState(null);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);
  const [requestVersion, setRequestVersion] = useState(0);

  const retry = useCallback(() => setRequestVersion((version) => version + 1), []);

  useEffect(() => {
    let active = true;

    if (!enabled) {
      setBook(null);
      setError(null);
      setStatus("success");
      return () => {
        active = false;
      };
    }

    async function loadBook() {
      setStatus("loading");
      setError(null);

      try {
        const result = await getBook(bookId);
        if (!active) return;
        setBook(result);
        setStatus("success");
      } catch (loadError) {
        if (!active) return;
        setBook(null);
        setError(loadError);
        setStatus(loadError.code === "BOOK_NOT_FOUND" ? "not-found" : "error");
      }
    }

    loadBook();
    return () => {
      active = false;
    };
  }, [bookId, enabled, requestVersion]);

  return { book, setBook, status, error, retry };
}
