import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useId } from "react";

import { BorderBeam } from "../../../../../components/effects/BorderBeam";
import type { Copy } from "../../_content/copy";
import { TOKENS } from "../../_content/tokens";

/** Ink closing section: a big question, one call to action, one round sticker. */
export function Closing({ copy }: { copy: Copy["closing"] }) {
  return (
    <section className="pg-closing" aria-labelledby="pg-closing-title">
      <div className="pg-closing__inner">
        <h2 id="pg-closing-title" className="pg-closing__title">
          {copy.title}
        </h2>
        <p className="pg-closing__body">{copy.body}</p>

        <BorderBeam palette="plasma" theme="dark" strength={1}>
          <Link href={copy.cta.href} className="pg-btn pg-btn--paper">
            {copy.cta.label}
            <ArrowRight aria-hidden="true" size={18} strokeWidth={2.4} />
          </Link>
        </BorderBeam>
      </div>

      <RoundSticker text={copy.sticker} />
    </section>
  );
}

const STICKER_RADIUS = 72;

/** Text running around a circle. Decorative: the same offer is in the body copy. */
function RoundSticker({ text }: { text: string }) {
  const pathId = `${useId()}-ring`;
  const circumference = 2 * Math.PI * STICKER_RADIUS;
  const r = STICKER_RADIUS;

  return (
    <svg className="pg-round-sticker" viewBox="0 0 200 200" aria-hidden="true" focusable="false">
      <circle cx="100" cy="100" r="98" fill={TOKENS.lime} />
      <defs>
        <path
          id={pathId}
          d={`M100 100m-${r} 0a${r} ${r} 0 1 1 ${2 * r} 0a${r} ${r} 0 1 1 ${-2 * r} 0`}
        />
      </defs>
      <text className="pg-round-sticker__text" fill={TOKENS.ink}>
        <textPath href={`#${pathId}`} textLength={circumference - 2} lengthAdjust="spacing">
          {text}
        </textPath>
      </text>
      <path
        d="M100 76c2.4 14.8 9.2 21.6 24 24-14.8 2.4-21.6 9.2-24 24-2.4-14.8-9.2-21.6-24-24 14.8-2.4 21.6-9.2 24-24Z"
        fill={TOKENS.ink}
      />
    </svg>
  );
}
