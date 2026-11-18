"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import type { Dictionary, Locale, SectionKey } from "@/content/types";
import { getDictionary } from "@/content";
import { EMAIL, GRA_URL, LINKEDIN_URL, ZONDAS_URL } from "@/lib/site";
import retrato from "@/assets/fotos/retrato.jpg";
import charla from "@/assets/fotos/charla.jpg";
import graWeb from "@/assets/proyectos/gra-web.jpg";
import zondasWeb from "@/assets/proyectos/zondas-web.jpg";
import techint from "@/assets/logos/techint.svg";
import fepsa from "@/assets/logos/fepsa.png";
import gra from "@/assets/logos/gra.png";
import { ContactForm } from "./ContactForm";
import { Dock } from "./Dock";
import { Reveal } from "./Reveal";
import { Rw } from "./Rewrite";
import { Typewriter } from "./Typewriter";
import { ArrowDown, ArrowRight, ArrowUpRight, Download, FileDoc, Mail, Person, ZondasMark } from "./icons";

function SectionLabel({ num, label }: { num: string; label: string }) {
  return (
    <span className="label">
      <span className="mark" aria-hidden="true" />
      <Rw>{`${num} / ${label}`}</Rw>
    </span>
  );
}

type SiteProps = {
  /** Language of the route that was requested (/ or /en). */
  initialLocale: Locale;
  /** Whether each language's CV PDF exists in /public (checked on the server). */
  cv: Record<Locale, boolean>;
};

/**
 * The whole page. Switching language happens in place: the URL changes with
 * history.replaceState (no reload), and every text on screen rewrites itself.
 * Each URL is still server-rendered in its own language for search engines
 * and shared links.
 */
export function Site({ initialLocale, cv }: SiteProps) {
  const [locale, setLocale] = useState<Locale>(initialLocale);
  const t = getDictionary(locale);
  const s = Object.fromEntries(t.sections.map((x) => [x.key, x])) as Record<SectionKey, Dictionary["sections"][number]>;
  const hasCv = cv[locale];

  const switchLocale = useCallback(
    (next: Locale) => {
      if (next === locale) return;
      const from = getDictionary(locale);
      const to = getDictionary(next);
      // Keep the section anchor, translated (#proyectos ⇄ #projects).
      const current = decodeURIComponent(window.location.hash.slice(1));
      const key = from.sections.find((x) => x.id === current)?.key;
      const hash = key ? `#${to.sections.find((x) => x.key === key)?.id}` : "";
      window.history.replaceState(null, "", `${to.path}${hash}`);
      setLocale(next);
    },
    [locale],
  );

  // Keep the document in sync with the language on screen.
  useEffect(() => {
    document.documentElement.lang = locale;
    document.title = t.meta.title;
    document.querySelector('meta[name="description"]')?.setAttribute("content", t.meta.description);
  }, [locale, t]);

  return (
    <>
      <a className="skip-link" href={`#${s.now.id}`}>
        {locale === "es" ? "Saltar al contenido" : "Skip to content"}
      </a>

      <Dock t={t} onSwitchLocale={switchLocale} />
      <Reveal />

      {/* Inicio */}
      <div className="hero-shell">
        <header id={t.homeId} className="hero wrap">
          <div className="hero-inner">
            <div className="hero-text">
              <span className="label enter">
                <span className="mark" aria-hidden="true" />
                <Rw>{t.hero.eyebrow}</Rw>
              </span>
              <Typewriter a={t.hero.titleA} b={t.hero.titleB} />
              <p className="hero-lead enter enter-3">
                <Rw>{t.hero.lead}</Rw>
              </p>
              <div className="hero-ctas enter enter-4">
                <a href={`#${s.contact.id}`} className="btn btn-ink lift">
                  <Rw>{t.hero.talk}</Rw>
                  <ArrowRight />
                </a>
                {hasCv && (
                  <a href={t.cv.href} download={t.cv.filename} className="btn btn-glass lift">
                    <Download />
                    <Rw>{t.hero.cv}</Rw>
                  </a>
                )}
              </div>
            </div>

            <div id="hero-photo" className="hero-photo enter enter-2">
              <div className="hero-glow breathe" aria-hidden="true" />
              <div className="hero-frame">
                <div id="hero-foto" className="hero-foto">
                  <Image
                    src={retrato}
                    alt={t.hero.portraitAlt}
                    sizes="(max-width: 720px) 84px, (max-width: 1023px) 296px, 376px"
                    preload
                    placeholder="blur"
                  />
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="ticker" aria-hidden="true">
          <div className="ticker-track">
            {[...t.ticker, ...t.ticker].map((label, i) => (
              <span key={i} className="ticker-item">
                <Rw>{label}</Rw>
              </span>
            ))}
          </div>
        </div>
      </div>

      <main className="main wrap">
        {/* 01 Hoy */}
        <section id={s.now.id} className="section rv" aria-labelledby="sec-now">
          <div className="section-head">
            <SectionLabel num={s.now.num} label={s.now.label} />
            <h2 id="sec-now" className="h2" style={{ maxWidth: "18ch" }}>
              <Rw>{t.now.title}</Rw>
            </h2>
          </div>

          <div className="now-grid">
            <article className="now-main glass">
              <div className="now-logos">
                <span className="tile" style={{ width: 64, height: 64, borderRadius: 20 }}>
                  <Image src={techint} alt={t.now.techintAlt} style={{ height: 44, width: "auto" }} />
                </span>
                <span className="tile" style={{ height: 64, padding: "0 18px", borderRadius: 20 }}>
                  <Image src={fepsa} alt={t.now.fepsaAlt} sizes="120px" style={{ height: 28, width: "auto" }} />
                </span>
              </div>
              <div className="stack-12">
                <span className="label">
                  <Rw>{t.now.org}</Rw>
                </span>
                <h3 className="h3" style={{ fontSize: "clamp(22px, 2.2vw, 30px)" }}>
                  <Rw>{t.now.role}</Rw>
                </h3>
                <p className="muted" style={{ maxWidth: "54ch" }}>
                  <Rw>{t.now.text}</Rw>
                </p>
              </div>
              <div className="stack-12">
                <span className="label">
                  <Rw>{t.now.journeyLabel}</Rw>
                </span>
                <ol className="journey">
                  {t.now.journey.map((j, i) => {
                    const last = i === t.now.journey.length - 1;
                    return (
                      <li key={i}>
                        <div className="journey-rail" aria-hidden="true">
                          <span className={`journey-dot${last ? " is-now" : ""}`} />
                          {!last && <span className="journey-line" />}
                        </div>
                        <span className="journey-when">
                          <Rw>{j.when || " "}</Rw>
                        </span>
                        <span className="journey-what">
                          <Rw>{j.what}</Rw>
                        </span>
                      </li>
                    );
                  })}
                </ol>
              </div>
            </article>

            <div className="now-side stag">
              <article className="now-card glass">
                <span className="tile" style={{ width: 56, height: 56, borderRadius: 18 }}>
                  <Image src={gra} alt={t.now.graAlt} sizes="38px" style={{ width: 38, height: "auto" }} />
                </span>
                <div className="stack-6">
                  <span className="label">
                    <Rw>{t.now.graOrg}</Rw>
                  </span>
                  <h3 className="h3" style={{ fontSize: 22 }}>
                    <Rw>{t.now.graRole}</Rw>
                  </h3>
                </div>
              </article>
              <article className="now-card glass">
                <span className="tile" style={{ width: 56, height: 56, borderRadius: 18, color: "#10484B" }}>
                  <ZondasMark label={t.now.zondasAlt} />
                </span>
                <div className="stack-6">
                  <span className="label">
                    <Rw>{t.now.zondasOrg}</Rw>
                  </span>
                  <h3 className="h3" style={{ fontSize: 22 }}>
                    <Rw>{t.now.zondasRole}</Rw>
                  </h3>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* 02 Experiencia */}
        <section id={s.experience.id} className="section rv" aria-labelledby="sec-experience">
          <div className="exp-head">
            <div className="section-head">
              <SectionLabel num={s.experience.num} label={s.experience.label} />
              <h2 id="sec-experience" className="h2">
                <Rw>{t.experience.title}</Rw>
              </h2>
            </div>
            <p className="muted exp-intro">
              <Rw>{t.experience.intro}</Rw>
            </p>
          </div>

          <div className="exp-list glass stag">
            {t.experience.items.map((it) => (
              <article key={it.code} className="exp-item">
                <span className="exp-code" aria-hidden="true">
                  {it.code}
                </span>
                <h3 className="h3 exp-title">
                  <Rw>{it.title}</Rw>
                </h3>
                <div className="exp-body">
                  <p className="muted">
                    <Rw>{it.text}</Rw>
                  </p>
                  <ul className="tags">
                    {it.tags.map((tag) => (
                      <li key={tag} className="tag">
                        {tag}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* 03 Proyectos */}
        <section id={s.projects.id} className="section rv" aria-labelledby="sec-projects">
          <div className="section-head">
            <SectionLabel num={s.projects.num} label={s.projects.label} />
            <h2 id="sec-projects" className="h2">
              <Rw>{t.projects.title}</Rw>
            </h2>
          </div>

          <article className="proj glass">
            <div className="proj-shot">
              <Image src={graWeb} alt={t.projects.gra.shotAlt} sizes="(max-width: 900px) 100vw, 700px" />
            </div>
            <div className="proj-body">
              <div className="stack">
                <span className="label">
                  <Rw>{t.projects.gra.eyebrow}</Rw>
                </span>
                <h3 className="h3 proj-title">{t.projects.gra.title}</h3>
                <p className="muted">
                  <Rw>{t.projects.gra.text}</Rw>
                </p>
              </div>
              <a href={GRA_URL} target="_blank" rel="noopener" className="btn btn-line go">
                <Rw>{t.projects.gra.link}</Rw>
                <ArrowUpRight size={16} />
              </a>
            </div>
          </article>

          <article className="proj is-reverse glass">
            <div className="proj-body">
              <div className="stack">
                <span className="label">
                  <Rw>{t.projects.zondas.eyebrow}</Rw>
                </span>
                <h3 className="h3 proj-title">{t.projects.zondas.title}</h3>
                <p className="muted">
                  <Rw>{t.projects.zondas.text}</Rw>
                </p>
              </div>
              <a href={ZONDAS_URL} target="_blank" rel="noopener" className="btn btn-line go">
                <Rw>{t.projects.zondas.link}</Rw>
                <ArrowUpRight size={16} />
              </a>
            </div>
            <div className="proj-shot">
              <Image src={zondasWeb} alt={t.projects.zondas.shotAlt} sizes="(max-width: 900px) 100vw, 700px" />
            </div>
          </article>
        </section>

        {/* 04 Formación */}
        <section id={s.education.id} className="section rv" aria-labelledby="sec-education">
          <div className="section-head">
            <SectionLabel num={s.education.num} label={s.education.label} />
            <h2 id="sec-education" className="h2">
              <Rw>{t.education.title}</Rw>
            </h2>
          </div>

          <div className="edu-grid">
            <div className="edu-photo">
              <Image
                src={charla}
                alt={t.education.photoAlt}
                fill
                sizes="(max-width: 900px) 100vw, 560px"
                placeholder="blur"
              />
            </div>
            <div className="edu-side">
              <article className="edu-degree glass">
                <div className="stack-6" style={{ gap: 4, minWidth: 0 }}>
                  <span className="label">
                    <Rw>{t.education.degreeLabel}</Rw>
                  </span>
                  <h3 className="h3">
                    <Rw>{t.education.degree}</Rw>
                  </h3>
                </div>
                <p className="muted" style={{ fontSize: 15 }}>
                  <Rw>{t.education.degreeMeta}</Rw>
                </p>
              </article>
              <div className="edu-list glass stag">
                {t.education.items.map((it, i) => (
                  <div key={i} className="edu-row">
                    <span className="label">
                      <Rw>{it.label}</Rw>
                    </span>
                    <div>
                      <h4>
                        <Rw>{it.title}</Rw>
                      </h4>
                      <p className="muted">
                        <Rw>{it.text}</Rw>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 05 Contacto */}
        <section id={s.contact.id} className="section contact rv" aria-labelledby="sec-contact">
          <div className="contact-glow breathe deco" aria-hidden="true" />

          <div className="contact-side">
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <SectionLabel num={s.contact.num} label={s.contact.label} />
              <h2 id="sec-contact" className="contact-title">
                <Rw>{t.contact.title}</Rw>
              </h2>
              <p className="inv-muted" style={{ margin: 0, maxWidth: "40ch" }}>
                <Rw>{t.contact.text}</Rw>
              </p>
            </div>
            <nav aria-label={t.contact.channels} className="channels">
              <a href={`mailto:${EMAIL}`} className="chan">
                <span className="chan-ico">
                  <Mail />
                </span>
                <span className="chan-text">
                  <span>Email</span>
                  <span>
                    <Rw>{t.contact.emailSub}</Rw>
                  </span>
                </span>
                <ArrowUpRight className="arrow" />
              </a>
              <a href={LINKEDIN_URL} target="_blank" rel="noopener" className="chan">
                <span className="chan-ico">
                  <Person />
                </span>
                <span className="chan-text">
                  <span>LinkedIn</span>
                  <span>/in/quintanaalejo</span>
                </span>
                <ArrowUpRight className="arrow" />
              </a>
              {hasCv && (
                <a href={t.cv.href} download={t.cv.filename} className="chan">
                  <span className="chan-ico">
                    <FileDoc />
                  </span>
                  <span className="chan-text">
                    <span>
                      <Rw>{t.contact.cv}</Rw>
                    </span>
                    <span>PDF</span>
                  </span>
                  <ArrowDown className="arrow-d" />
                </a>
              )}
            </nav>
          </div>

          <ContactForm copy={t.contact.form} idPrefix="cf" />
        </section>

        <footer className="footer">
          <span>{t.footer.name}</span>
          <a href={`#${t.homeId}`}>
            <Rw>{t.footer.top}</Rw>
          </a>
        </footer>
      </main>
    </>
  );
}
