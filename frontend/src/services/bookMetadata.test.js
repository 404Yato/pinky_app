import assert from "node:assert/strict";
import test from "node:test";

import { getBookMetadataByISBN } from "./bookMetadata.js";

const originalFetch = globalThis.fetch;
test.afterEach(() => {
  globalThis.fetch = originalFetch;
});

test("maps an exact Open Library edition to Pinky metadata", async () => {
  const requests = [];
  globalThis.fetch = async (url) => {
    requests.push(url);
    if (url.includes("/authors/")) {
      return new Response(JSON.stringify({ name: "Gabriel García Márquez" }));
    }
    return new Response(JSON.stringify({
      title: "Cien años de soledad",
      authors: [{ key: "/authors/OL27363A" }],
      publishers: ["Cátedra"],
      publish_date: "1984",
      number_of_pages: 493,
      covers: [1047469],
    }));
  };

  const metadata = await getBookMetadataByISBN("978-84-376-0494-7");

  assert.equal(requests[0], "https://openlibrary.org/isbn/9788437604947.json");
  assert.deepEqual(metadata, {
    isbn: "9788437604947",
    title: "Cien años de soledad",
    author: "Gabriel García Márquez",
    description: null,
    publisher: "Cátedra",
    publicationYear: 1984,
    pages: 493,
    coverUrl: "https://covers.openlibrary.org/b/id/1047469-L.jpg?default=false",
  });
});

test("reports missing editions and tolerates missing optional metadata", async () => {
  globalThis.fetch = async () => new Response(null, { status: 404 });
  await assert.rejects(() => getBookMetadataByISBN("9788437604947"), { code: "NOT_FOUND" });

  globalThis.fetch = async () => new Response(JSON.stringify({ title: "Libro sin ficha completa" }));
  const metadata = await getBookMetadataByISBN("9788437604947");
  assert.equal(metadata.title, "Libro sin ficha completa");
  assert.equal(metadata.pages, null);
  assert.equal(metadata.coverUrl, null);
});

test("rejects invalid ISBNs without making a request", async () => {
  let called = false;
  globalThis.fetch = async () => {
    called = true;
    return new Response();
  };

  await assert.rejects(() => getBookMetadataByISBN("9788437604948"), { code: "INVALID_ISBN" });
  assert.equal(called, false);
});
