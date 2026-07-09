export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="px-6 sm:px-10 lg:px-16 py-10 border-t border-line">
      <div className="mx-auto w-full max-w-6xl flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between text-sm text-muted">
        <span>© {year} Daniel Freak</span>
        <span>Built with Vite, React &amp; Tailwind</span>
      </div>
    </footer>
  );
}
