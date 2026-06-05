import { useState } from "react";

interface Props {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export default function CollapsibleSection({ title, children, defaultOpen = true }: Props) {
  const [open, setOpen] = useState(defaultOpen);

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

      <div className={`rules-section-body ${open ? "rules-section-body--open" : ""}`}>
        <div className="rules-section-body-inner">
          {children}
        </div>
      </div>
    </section>
  );
}
