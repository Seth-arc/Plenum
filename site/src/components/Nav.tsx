import React, { useEffect, useRef, useState } from "react";

const links = [
  { href: "#how", label: "How it works" },
  { href: "#platform", label: "Platform" },
  { href: "#roles", label: "Roles" },
  { href: "#use-cases", label: "Use cases" },
  { href: "#research", label: "Research" },
];

export const Nav: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("");
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Highlight the section currently in view.
  useEffect(() => {
    const ids = links.map((l) => l.href.slice(1));
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (sections.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(`#${visible.target.id}`);
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: [0, 0.25, 0.5, 1] }
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  // Close the mobile panel on Escape or when the viewport grows past mobile.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onResize = () => window.innerWidth > 980 && setOpen(false);
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  return (
    <header className={`nav ${scrolled || open ? "nav--scrolled" : ""}`}>
      <div className="container nav-inner">
        <a className="nav-brand" href="#top" aria-label="Plenum home">
          <span className="nav-word">Plenum</span>
          <span className="nav-dot">.</span>
        </a>

        <nav className="nav-links" aria-label="Primary">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className={active === l.href ? "is-active" : undefined}
              aria-current={active === l.href ? "true" : undefined}
            >
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

        <button
          type="button"
          className={`nav-toggle ${open ? "is-open" : ""}`}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="nav-mobile-panel"
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      <div
        id="nav-mobile-panel"
        ref={panelRef}
        className={`nav-mobile ${open ? "is-open" : ""}`}
        hidden={!open}
      >
        <nav className="nav-mobile-links" aria-label="Mobile">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className={active === l.href ? "is-active" : undefined}
              aria-current={active === l.href ? "true" : undefined}
              onClick={() => setOpen(false)}
            >
              {l.label}
            </a>
          ))}
          <a
            className="nav-mobile-ext"
            href="https://github.com/Seth-arc/Plenum"
            target="_blank"
            rel="noreferrer"
            onClick={() => setOpen(false)}
          >
            GitHub
          </a>
        </nav>
      </div>
    </header>
  );
};
