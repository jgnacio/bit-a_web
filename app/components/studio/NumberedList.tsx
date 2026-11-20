import type { CSSProperties } from "react";

export interface NumberedItem {
  key: string;
  title?: string;
  text: string;
}

interface NumberedListProps {
  items: readonly NumberedItem[];
  /** "steps" lays the items out in columns; "rows" stacks them. */
  layout?: "steps" | "rows";
  /** Heading level of the item titles, so the outline never skips a level. */
  headingLevel?: 3 | 4;
  /** Stagger the entrance of each item. Leave off above the fold. */
  reveal?: boolean;
}

/**
 * An ordered list with mono numbers (01, 02, 03). The list is numbered for
 * assistive technology by the <ol> itself, so the visible number is hidden
 * from it rather than read twice.
 */
export function NumberedList({ items, layout = "steps", headingLevel = 3, reveal = false }: NumberedListProps) {
  const Heading = headingLevel === 3 ? "h3" : "h4";

  return (
    <ol className={`studio-numbered studio-numbered--${layout}`}>
      {items.map((item, index) => (
        <li
          key={item.key}
          className={["studio-numbered__item", reveal ? "reveal" : ""].filter(Boolean).join(" ")}
          style={reveal ? ({ "--reveal-i": index } as CSSProperties) : undefined}
        >
          <span className="label studio-numbered__index" aria-hidden="true">
            {String(index + 1).padStart(2, "0")}
          </span>
          <div className="studio-numbered__body">
            {item.title && <Heading className="title title--sm">{item.title}</Heading>}
            <p className={item.title ? "muted" : "studio-numbered__text"}>{item.text}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
