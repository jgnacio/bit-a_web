import type { CSSProperties, ReactNode } from "react";

export interface Fact {
  key: string;
  term: string;
  value: ReactNode;
}

/** Quiet tiles of plain facts: a mono term over its value. */
export function FactList({ facts, reveal = false }: { facts: readonly Fact[]; reveal?: boolean }) {
  return (
    <dl className="grid-auto studio-facts" style={{ "--col-min": "240px", "--grid-gap": "12px" } as CSSProperties}>
      {facts.map((fact, index) => (
        <div
          key={fact.key}
          className={["tile studio-facts__item", reveal ? "reveal" : ""].filter(Boolean).join(" ")}
          style={reveal ? ({ "--reveal-i": index } as CSSProperties) : undefined}
        >
          <dt className="label label--subtle">{fact.term}</dt>
          <dd className="studio-facts__value">{fact.value}</dd>
        </div>
      ))}
    </dl>
  );
}
