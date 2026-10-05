const LINKS = ["Privacy", "Terms", "Help"] as const;

export function ChatFooter() {
  return (
    <footer className="hidden h-12 items-center text-[13px] text-[#475569] lg:flex">
      <span>© 2026 Bridgeway</span>
      {LINKS.map((l) => (
        <span key={l} className="flex items-center">
          <span aria-hidden className="mx-2">·</span>
          <a href="#" onClick={(e) => e.preventDefault()} className="hover:underline focus-visible:outline-2 focus-visible:outline-[#3F4FA0]">{l}</a>
        </span>
      ))}
    </footer>
  );
}
