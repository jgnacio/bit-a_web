import type { Metadata } from "next";
import type { CSSProperties } from "react";

import { BorderBeam } from "../../../components/effects/BorderBeam";
import { MorphLines } from "../_components/MorphLines";
import "../lab.css";

export const metadata: Metadata = {
  title: "Lab — Minimal hero",
  robots: { index: false, follow: false },
};

const HEADLINE = "We build digital legends.";

/** Splits the headline into words of characters, indexed across the whole line. */
function RevealText({ text }: { text: string }) {
  let index = 0;
  return (
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {text.split(" ").map((word, w) => (
          <span key={w}>
            {w > 0 && " "}
            <span className="lab-reveal__word">
              {Array.from(word).map((char, c) => (
                <span
                  key={c}
                  className="lab-reveal__char"
                  style={{ "--i": index++ } as CSSProperties}
                >
                  {char}
                </span>
              ))}
            </span>
          </span>
        ))}
      </span>
    </>
  );
}

export default function LabPage() {
  return (
    <main className="min-h-screen bg-[#F4F6FD] text-[#06134A]">
      <section className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 pt-32 pb-20 md:px-10">
        <p className="mb-6 text-sm font-medium tracking-wide">
          <MorphLines text="Bit-A — Digital studio" base={0} ink="#0B40FF" />
        </p>

        <h1 className="max-w-4xl text-[clamp(3rem,8vw,6.5rem)] leading-[0.95] font-extrabold tracking-[-0.04em]">
          <RevealText text={HEADLINE} />
        </h1>

        <p className="mt-8 max-w-xl text-lg leading-relaxed">
          <MorphLines
            text="Branding and technology for brands that want to stand out. Fast sites, clear stories, measurable results."
            base={650}
            ink="#3B4466"
          />
        </p>

        <div className="mt-12 flex flex-wrap items-center gap-6">
          <div className="lab-morph-pill" style={{ "--delay": "1300ms" } as CSSProperties}>
            <BorderBeam palette="plasma" theme="light" strength={0.9}>
              <a
                href="#"
                className="inline-flex items-center rounded-full bg-[#FCFDFF] px-7 py-3.5 text-base font-semibold text-[#06134A]"
              >
                Start a project
              </a>
            </BorderBeam>
          </div>
          <a
            href="#"
            className="lab-morph-wipe text-base font-medium text-[#3B4466] hover:text-[#06134A]"
            style={{ "--delay": "1650ms" } as CSSProperties}
          >
            See our work →
          </a>
        </div>
      </section>
    </main>
  );
}
