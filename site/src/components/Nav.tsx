import React, { useEffect, useState } from "react";

const links = [
  { href: "#how", label: "How it works" },
  { href: "#platform", label: "Platform" },
  { href: "#roles", label: "Roles" },
  { href: "#use-cases", label: "Use cases" },
  { href: "#research", label: "Research" },
];

export const Nav: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`nav ${scrolled ? "nav--scrolled" : ""}`}>
      <div className="container nav-inner">
        <a className="nav-brand" href="#top" aria-label="Plenum home">
          <span className="nav-word">Plenum</span>
          <span className="nav-dot">.</span>
        </a>
        <nav className="nav-links" aria-label="Primary">
          {links.map((l) => (
            <a key={l.href} href={l.href}>
              {l.label}
            </a>
          ))}
        </nav>
        <a
          className="nav-link-ext"
          href="https://github.com/Seth-arc/Plenum"
          target="_blank"
          rel="noreferrer"
        >
          GitHub
        </a>
      </div>
    </header>
  );
};
