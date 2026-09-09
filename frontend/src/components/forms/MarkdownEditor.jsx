import { useEffect, useRef, useState } from "react";
import {
  ArrowClockwise,
  ArrowCounterClockwise,
  LinkSimple,
  ListBullets,
  ListNumbers,
  Quotes,
  TextB,
  TextHTwo,
  TextItalic,
} from "@phosphor-icons/react";

import { applyMarkdownFormat } from "@/lib/markdown";

const actions = [
  { format: "bold", label: "Negrita", Icon: TextB },
  { format: "italic", label: "Cursiva", Icon: TextItalic },
  { format: "heading", label: "Encabezado", Icon: TextHTwo },
  { format: "unordered-list", label: "Lista con viñetas", Icon: ListBullets },
  { format: "ordered-list", label: "Lista numerada", Icon: ListNumbers },
  { format: "blockquote", label: "Cita", Icon: Quotes },
  { format: "link", label: "Enlace", Icon: LinkSimple },
];

const actionGroups = [actions.slice(0, 3), actions.slice(3, 7)];
const toolButtonClassName = "grid size-10 place-items-center rounded-sm text-muted-foreground transition hover:bg-card hover:text-foreground focus-visible:bg-card focus-visible:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-45 sm:size-9";

export function MarkdownEditor({ id, value = "", onChange, disabled = false, placeholder = "", "aria-describedby": ariaDescribedBy }) {
  const textareaRef = useRef(null);
  const [history, setHistory] = useState([value]);
  const [historyIndex, setHistoryIndex] = useState(0);

  useEffect(() => {
    if (history[historyIndex] !== value) {
      setHistory([value]);
      setHistoryIndex(0);
    }
  }, [history, historyIndex, value]);

  const restoreSelection = (start, end) => {
    window.requestAnimationFrame(() => {
      textareaRef.current?.focus();
      textareaRef.current?.setSelectionRange(start, end);
    });
  };

  const commit = (nextValue, selectionStart, selectionEnd) => {
    const nextHistory = [...history.slice(0, historyIndex + 1), nextValue].slice(-100);
    setHistory(nextHistory);
    setHistoryIndex(nextHistory.length - 1);
    onChange(nextValue);
    if (selectionStart !== undefined) restoreSelection(selectionStart, selectionEnd);
  };

  const format = (formatName) => {
    const textarea = textareaRef.current;
    const result = applyMarkdownFormat(value, textarea?.selectionStart, textarea?.selectionEnd, formatName);
    commit(result.value, result.selectionStart, result.selectionEnd);
  };

  const moveHistory = (nextIndex) => {
    const nextValue = history[nextIndex];
    setHistoryIndex(nextIndex);
    onChange(nextValue);
    restoreSelection(nextValue.length, nextValue.length);
  };

  return (
    <div className="mt-2 overflow-hidden rounded-md border border-input bg-background transition focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/20">
      <div role="toolbar" aria-label="Formato de comentarios" className="flex flex-wrap items-center gap-1 border-b border-border bg-secondary/55 p-2">
        {actionGroups.map((group, groupIndex) => (
          <div key={groupIndex} role="group" aria-label={groupIndex === 0 ? "Estilo de texto" : "Bloques y enlaces"} className="flex items-center gap-1">
            {group.map(({ format: formatName, label, Icon }) => (
              <button key={formatName} type="button" disabled={disabled} title={label} aria-label={label} aria-keyshortcuts={formatName === "bold" ? "Control+B Meta+B" : formatName === "italic" ? "Control+I Meta+I" : undefined} onClick={() => format(formatName)} className={toolButtonClassName}>
                <Icon aria-hidden="true" className="size-4" weight="bold" />
              </button>
            ))}
          </div>
        ))}
        <span aria-hidden="true" className="mx-1 my-1 h-7 w-px bg-border" />
        <button type="button" disabled={disabled || historyIndex === 0} title="Deshacer" aria-label="Deshacer" onClick={() => moveHistory(historyIndex - 1)} className={toolButtonClassName}>
          <ArrowCounterClockwise aria-hidden="true" className="size-4" />
        </button>
        <button type="button" disabled={disabled || historyIndex >= history.length - 1} title="Rehacer" aria-label="Rehacer" onClick={() => moveHistory(historyIndex + 1)} className={toolButtonClassName}>
          <ArrowClockwise aria-hidden="true" className="size-4" />
        </button>
      </div>
      <textarea
        ref={textareaRef}
        id={id}
        aria-describedby={ariaDescribedBy}
        value={value}
        disabled={disabled}
        placeholder={placeholder}
        onChange={(event) => commit(event.target.value)}
        onKeyDown={(event) => {
          if (!(event.ctrlKey || event.metaKey) || event.altKey) return;
          if (event.key.toLowerCase() === "b" || event.key.toLowerCase() === "i") {
            event.preventDefault();
            format(event.key.toLowerCase() === "b" ? "bold" : "italic");
          }
        }}
        className="pinky-scrollbar h-56 min-h-48 max-h-[28rem] w-full resize-y overflow-x-hidden overflow-y-auto bg-transparent px-4 py-4 text-sm leading-7 text-foreground outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-60"
      />
    </div>
  );
}
