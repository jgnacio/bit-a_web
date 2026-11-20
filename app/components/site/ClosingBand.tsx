import { getTranslations } from "next-intl/server";

import { PrimaryCta } from "@/app/components/ui/Actions";
import { Waveform } from "@/app/components/ui/Motifs";
import { ROUTES } from "@/content/routes";

interface ClosingBandProps {
  locale: string;
  /** A question in the page's own words. Defaults to the studio-wide one. */
  title?: string;
  body?: string;
}

/**
 * The pink band that closes a page: one question, one sentence and the single
 * contact action, with the house waveform beside it.
 */
export async function ClosingBand({ locale, title, body }: ClosingBandProps) {
  const t = await getTranslations({ locale, namespace: "Common" });

  return (
    <section className="band closing" data-surface="signal" aria-labelledby="closing-title">
      <div className="wrap split" style={{ "--col-min": "420px" } as React.CSSProperties}>
        <div className="stack" style={{ "--stack-gap": "28px" } as React.CSSProperties}>
          <h2 id="closing-title" className="display display--xl closing__title">
            {title ?? t("closing.title")}
          </h2>
          <p className="lead closing__body">{body ?? t("closing.body")}</p>
          <PrimaryCta href={ROUTES.contact} theme="light">
            {t("cta")}
          </PrimaryCta>
        </div>
        <Waveform className="closing__wave" />
      </div>
    </section>
  );
}
