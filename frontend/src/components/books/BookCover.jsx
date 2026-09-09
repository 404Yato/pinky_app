import { useState } from "react";
import { BookOpenText } from "@phosphor-icons/react";

const coverStyles = [
  "from-[#68432b] to-[#7a4f34] text-[#fffaf2]",
  "from-[#5f493a] to-[#765a45] text-[#fffaf2]",
  "from-[#70472f] to-[#8b5e3c] text-[#fffaf2]",
  "from-[#4f5545] to-[#626650] text-[#fffaf2]",
  "from-[#59404a] to-[#8b6471] text-[#fffaf2]",
];

export function BookCover({ book }) {
  const [failedUrl, setFailedUrl] = useState(null);

  const coverUrl = book.details?.cover_url;
  const author = book.details?.author;

  if (coverUrl && failedUrl !== coverUrl) {
    return (
      <img
        src={coverUrl}
        alt={`Portada de ${book.name}`}
        onError={() => setFailedUrl(coverUrl)}
        className="h-full w-full object-cover"
      />
    );
  }

  const style = coverStyles[book.id % coverStyles.length];

  return (
    <div
      role="img"
      aria-label={`Portada ilustrativa de ${book.name}`}
      className={`relative flex h-full w-full flex-col justify-between overflow-hidden bg-gradient-to-br p-4 ${style}`}
    >
      <span className="absolute inset-y-0 left-3 w-px bg-white/20" aria-hidden="true" />
      <BookOpenText aria-hidden="true" className="ml-auto size-5 opacity-70" weight="duotone" />
      <div className="relative border-y border-white/25 py-3 text-center">
        <p className="font-heading text-base font-semibold leading-snug [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:4] sm:text-lg">
          {book.name}
        </p>
        {author && <p className="mt-2 text-[0.65rem] font-medium uppercase tracking-[0.12em] opacity-80">{author}</p>}
      </div>
      <span className="text-center text-[0.6rem] font-semibold uppercase tracking-[0.18em] opacity-65">Pinky</span>
    </div>
  );
}
