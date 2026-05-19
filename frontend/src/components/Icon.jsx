const icons = {
  menu: (
    <>
      <path d="M4 6h16" />
      <path d="M4 12h16" />
      <path d="M4 18h16" />
    </>
  ),
  inventory: (
    <>
      <path d="M5 8.5 12 4l7 4.5v7L12 20l-7-4.5z" />
      <path d="m5 8.5 7 4.5 7-4.5" />
      <path d="M12 13v7" />
    </>
  ),
  profile: (
    <>
      <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
      <path d="M4.5 20a7.5 7.5 0 0 1 15 0" />
    </>
  ),
  book: (
    <>
      <path d="M6 4h9a3 3 0 0 1 3 3v13H8a3 3 0 0 0-3 3V6a2 2 0 0 1 2-2z" />
      <path d="M8 18h10" />
    </>
  ),
  archive: (
    <>
      <path d="M4 7h16" />
      <path d="M6 7v13h12V7" />
      <path d="M9 11h6" />
      <path d="M5 4h14v3H5z" />
    </>
  ),
  heart: (
    <>
      <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" />
    </>
  ),
};

export function Icon({ name, size = 20 }) {
  return (
    <svg
      aria-hidden="true"
      className="icon"
      fill="none"
      height={size}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.9"
      viewBox="0 0 24 24"
      width={size}
    >
      {icons[name]}
    </svg>
  );
}
