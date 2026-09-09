const clampSelection = (value, position) => Math.max(0, Math.min(Number(position) || 0, value.length));

function selection(value, start, end) {
  const selectionStart = clampSelection(value, start);
  const selectionEnd = Math.max(selectionStart, clampSelection(value, end));
  return { selectionStart, selectionEnd, text: value.slice(selectionStart, selectionEnd) };
}

function wrap(value, start, end, before, after, placeholder) {
  const selected = selection(value, start, end);
  const content = selected.text || placeholder;
  const nextValue = `${value.slice(0, selected.selectionStart)}${before}${content}${after}${value.slice(selected.selectionEnd)}`;
  const contentStart = selected.selectionStart + before.length;
  return {
    value: nextValue,
    selectionStart: contentStart,
    selectionEnd: contentStart + content.length,
  };
}

function prefixLines(value, start, end, prefixForLine, placeholder) {
  const selected = selection(value, start, end);
  const lineStart = value.lastIndexOf("\n", selected.selectionStart - 1) + 1;
  const lineEndIndex = value.indexOf("\n", selected.selectionEnd);
  const lineEnd = lineEndIndex === -1 ? value.length : lineEndIndex;
  const content = value.slice(lineStart, lineEnd) || placeholder;
  const transformed = content.split("\n").map((line, index) => `${prefixForLine(index)}${line}`).join("\n");
  return {
    value: `${value.slice(0, lineStart)}${transformed}${value.slice(lineEnd)}`,
    selectionStart: lineStart,
    selectionEnd: lineStart + transformed.length,
  };
}

export function applyMarkdownFormat(value = "", start = 0, end = start, format) {
  switch (format) {
    case "bold": return wrap(value, start, end, "**", "**", "texto");
    case "italic": return wrap(value, start, end, "*", "*", "texto");
    case "heading": return prefixLines(value, start, end, () => "## ", "Título");
    case "unordered-list": return prefixLines(value, start, end, () => "- ", "Elemento");
    case "ordered-list": return prefixLines(value, start, end, (index) => `${index + 1}. `, "Elemento");
    case "blockquote": return prefixLines(value, start, end, () => "> ", "Fragmento");
    case "link": return wrap(value, start, end, "[", "](https://)", "texto del enlace");
    default: return { value, selectionStart: start, selectionEnd: end };
  }
}
