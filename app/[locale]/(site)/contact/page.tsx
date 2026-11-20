import { ArrowDown, ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { BookingEmbed } from "@/app/components/studio/BookingEmbed";
import { FactList } from "@/app/components/studio/FactList";
import { NumberedList } from "@/app/components/studio/NumberedList";
import { ArrowLink, PrimaryCta } from "@/app/components/ui/Actions";
import { Dotted, SectionHead } from "@/app/components/ui/Text";
import { ROUTES } from "@/content/routes";
import { CONTACT } from "@/content/site";
import { pageMetadata } from "@/lib/seo";

type Params = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Contact.meta" });
  return pageMetadata({ locale, path: ROUTES.contact, title: t("title"), description: t("description") });
}

const BRIEF = ["1", "2", "3", "4"] as const;

/** The address, allowed to wrap after the "@" on narrow screens rather than mid-word. */
const [EMAIL_USER, EMAIL_DOMAIN] = CONTACT.email.split("@");
const emailText = (
  <>
    {EMAIL_USER}@<wbr />
    {EMAIL_DOMAIN}
  </>
);

/**
 * The contact page is itself the contact action, so it has no closing band.
 * There is no form: email, WhatsApp and a booked call are the three ways in.
 */
export default async function ContactPage({ params }: Params) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "Contact" });
  const tCommon = await getTranslations({ locale, namespace: "Common" });

  const mailto = `mailto:${CONTACT.email}?subject=${encodeURIComponent(t("channels.email.subject"))}`;
  const whatsapp = `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(t("channels.whatsapp.message"))}`;
  const calendar = `https://cal.com/bit-a/${CONTACT.calEvent}`;

  return (
    <>
      <div className="wrap page-head contact-head">
        <span className="label label--subtle">{t("label")}</span>
        <h1 className="display display--lg" style={{ maxWidth: "13ch" }}>
          <Dotted>{t("title")}</Dotted>
        </h1>
        <p className="lead">{t("lead")}</p>
      </div>

      <div className="wrap">
        <ul className="contact-channels">
          <li className="contact-channel contact-channel--primary">
            <div className="contact-channel__text">
              <h2 id="contact-email-title" className="title title--md">
                {t("channels.email.title")}
              </h2>
              <p className="muted">{t("channels.email.text")}</p>
            </div>
            <p className="contact-channel__value">{emailText}</p>
            <div className="contact-channel__action">
              <PrimaryCta href={mailto} size="md">
                {t("channels.email.action")}
              </PrimaryCta>
            </div>
          </li>

          <li className="contact-channel">
            <div className="contact-channel__text">
              <h2 id="contact-whatsapp-title" className="title title--md">
                {t("channels.whatsapp.title")}
              </h2>
              <p className="muted">{t("channels.whatsapp.text")}</p>
            </div>
            <p className="contact-channel__value">{CONTACT.whatsappDisplay}</p>
            <div className="contact-channel__action">
              <a href={whatsapp} className="btn btn--ghost" target="_blank" rel="noopener noreferrer">
                {t("channels.whatsapp.action")}
                <span className="visually-hidden"> {tCommon("newTab")}</span>
                <ArrowUpRight aria-hidden="true" strokeWidth={2.4} className="contact-channel__icon" />
              </a>
            </div>
          </li>

          <li className="contact-channel">
            <div className="contact-channel__text">
              <h2 id="contact-call-title" className="title title--md">
                {t("channels.call.title")}
              </h2>
              <p className="muted">{t("channels.call.text")}</p>
            </div>
            <div className="contact-channel__action">
              <a href="#agenda" className="btn btn--ghost">
                {t("channels.call.action")}
                <ArrowDown aria-hidden="true" strokeWidth={2.4} className="contact-channel__icon" />
              </a>
            </div>
          </li>
        </ul>
      </div>

      <section className="wrap section contact-brief" aria-labelledby="contact-brief-title">
        <SectionHead id="contact-brief-title" label={t("brief.label")} title={t("brief.title")} measure={14} />
        <NumberedList
          layout="rows"
          reveal
          items={BRIEF.map((item) => ({ key: item, text: t(`brief.items.${item}`) }))}
        />
      </section>

      <section id="agenda" className="section contact-booking" data-surface="sunken" aria-labelledby="contact-booking-title">
        <div className="wrap">
          <SectionHead id="contact-booking-title" label={t("booking.label")} title={t("booking.title")} />
          <BookingEmbed event={CONTACT.calEvent} loadingLabel={t("booking.loading")} />
          <div className="contact-booking__fallback">
            <p className="muted small">{t("booking.fallback")}</p>
            <ArrowLink href={calendar} direction="external" externalHint={tCommon("newTab")}>
              {t("booking.open")}
            </ArrowLink>
          </div>
        </div>
      </section>

      <section className="wrap section contact-info" aria-labelledby="contact-info-title">
        <h2 id="contact-info-title" className="label label--subtle contact-info__title">
          {t("info.label")}
        </h2>
        <FactList
          facts={[
            { key: "location", term: t("info.location"), value: CONTACT.city },
            {
              key: "phone",
              term: t("info.phone"),
              value: (
                <a href={`tel:${CONTACT.phone}`} className="text-link">
                  {CONTACT.phoneDisplay}
                </a>
              ),
            },
            {
              key: "email",
              term: t("info.email"),
              value: (
                <a href={`mailto:${CONTACT.email}`} className="text-link contact-info__email">
                  {emailText}
                </a>
              ),
            },
          ]}
        />
      </section>
    </>
  );
}
