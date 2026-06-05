import { useState, useRef, useEffect } from "react";

interface Props {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export default function CollapsibleSection({ title, children, defaultOpen = true }: Props) {
  const [open, setOpen] = useState(defaultOpen);
  const bodyRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<string>(defaultOpen ? "auto" : "0px");

  // When opening: set explicit px height so CSS transition plays, then switch to "auto"
  // When closing: snapshot current px height first, then animate to 0
  useEffect(() => {
    const el = bodyRef.current;
    if (!el) return;

    if (open) {
      // measure natural height
      const scrollH = el.scrollHeight;
      setHeight(`${scrollH}px`);
      // after transition ends, free it to "auto" so content reflows correctly
      const onEnd = () => setHeight("auto");
      el.addEventListener("transitionend", onEnd, { once: true });
    } else {
      // snapshot current height before collapsing
      const scrollH = el.scrollHeight;
      setHeight(`${scrollH}px`);
      // force a reflow so the browser registers the starting height
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      el.offsetHeight;
      requestAnimationFrame(() => setHeight("0px"));
    }
  }, [open]);

  return (
    <section className={`rules-section ${open ? "rules-section--open" : "rules-section--closed"}`}>
      <button
        className="rules-section-header"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <h1 className="rules-section-title">{title}</h1>
        <span className={`rules-section-chevron ${open ? "rules-section-chevron--open" : ""}`}>
          ▾
        </span>
      </button>

      <div
        ref={bodyRef}
        className="rules-section-body"
        style={{ height, overflow: open && height === "auto" ? "visible" : "hidden" }}
      >
        <div className="rules-section-body-inner">
          {children}
        </div>
      </div>
    </section>
  );
}
