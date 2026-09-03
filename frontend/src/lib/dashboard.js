import { READING_STATUS } from "../constants/books.js";

const byNewest = (first, second) => {
  const difference = Date.parse(second.createdAt) - Date.parse(first.createdAt);
  return Number.isNaN(difference) ? second.id - first.id : difference || second.id - first.id;
};

export function getLibraryStats(books) {
  return books.reduce(
    (stats, book) => {
      stats.total += 1;
      if (book.favorite) stats.favorites += 1;
      if (book.readingStatus === READING_STATUS.READ) stats.read += 1;
      if (book.readingStatus === READING_STATUS.READING) stats.reading += 1;
      if (book.readingStatus === READING_STATUS.PENDING) stats.pending += 1;
      return stats;
    },
    { total: 0, read: 0, reading: 0, pending: 0, favorites: 0 },
  );
}

export function getDashboardSections(books, limit = 4) {
  const newest = [...books].sort(byNewest);

  return {
    recent: newest.slice(0, limit),
    reading: newest.filter((book) => book.readingStatus === READING_STATUS.READING).slice(0, limit),
    favorites: newest.filter((book) => book.favorite).slice(0, limit),
  };
}

export function getReadingProgress(books) {
  const stats = getLibraryStats(books);
  const percentage = (count) => (stats.total === 0 ? 0 : Math.round((count / stats.total) * 100));

  return [
    { status: READING_STATUS.READ, count: stats.read, percentage: percentage(stats.read) },
    { status: READING_STATUS.READING, count: stats.reading, percentage: percentage(stats.reading) },
    { status: READING_STATUS.PENDING, count: stats.pending, percentage: percentage(stats.pending) },
  ];
}
