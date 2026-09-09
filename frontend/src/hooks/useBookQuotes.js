import { useCallback, useEffect, useState } from "react";

import { createBookQuote, deleteBookQuote, getBookQuotes, updateBookQuote } from "@/services/api/bookQuotes";

export function useBookQuotes(bookId) {
  const [quotes, setQuotes] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);
  const [requestVersion, setRequestVersion] = useState(0);

  const retry = useCallback(() => setRequestVersion((version) => version + 1), []);

  useEffect(() => {
    let active = true;
    setStatus("loading");
    setError(null);
    getBookQuotes(bookId)
      .then((result) => {
        if (!active) return;
        setQuotes(result);
        setStatus("success");
      })
      .catch((loadError) => {
        if (!active) return;
        setError(loadError);
        setStatus("error");
      });
    return () => { active = false; };
  }, [bookId, requestVersion]);

  const createQuote = useCallback(async (values) => {
    const quote = await createBookQuote(bookId, values);
    setQuotes((current) => [...current, quote]);
    return quote;
  }, [bookId]);

  const updateQuote = useCallback(async (quoteId, values) => {
    const quote = await updateBookQuote(bookId, quoteId, values);
    setQuotes((current) => current.map((item) => item.id === quote.id ? quote : item));
    return quote;
  }, [bookId]);

  const removeQuote = useCallback(async (quoteId) => {
    await deleteBookQuote(bookId, quoteId);
    setQuotes((current) => current.filter((item) => item.id !== quoteId));
  }, [bookId]);

  return { quotes, status, error, retry, createQuote, updateQuote, removeQuote };
}
