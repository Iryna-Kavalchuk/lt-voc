import { useState, useImperativeHandle, forwardRef } from "react";

export interface CollapsibleSectionHandle {
  expand: () => void;
}

interface Props {
  id: string;
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const CollapsibleSection = forwardRef<CollapsibleSectionHandle, Props>(
  ({ id, title, children, defaultOpen = true }, ref) => {
    const [open, setOpen] = useState(defaultOpen);

    useImperativeHandle(ref, () => ({
      expand: () => setOpen(true),
    }));

    return (
      <section
        id={id}
        className={`rules-section ${open ? "rules-section--open" : "rules-section--closed"}`}
      >
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
);

CollapsibleSection.displayName = "CollapsibleSection";
export default CollapsibleSection;
