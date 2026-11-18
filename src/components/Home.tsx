import { existsSync } from "node:fs";
import { join } from "node:path";
import Image from "next/image";
import type { Dictionary, SectionKey } from "@/content/types";
import { getDictionary, otherLocale } from "@/content";
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
import { Typewriter } from "./Typewriter";
import { ArrowDown, ArrowRight, ArrowUpRight, Download, FileDoc, Mail, Person, ZondasMark } from "./icons";

function SectionLabel({ num, label, className = "label" }: { num: string; label: string; className?: string }) {
  return (
    <span className={className}>
      <span className="mark" aria-hidden="true" />
      {num} / {label}
    </span>
  );
}

// Each language links its own CV. The buttons only render if that PDF is in
// /public (checked at build time). To update a CV, replace the file and redeploy.
const cvExists = (href: string) => existsSync(join(process.cwd(), "public", href));

export function Home({ t }: { t: Dictionary }) {
  const hasCv = cvExists(t.cv.href);
  const alt = getDictionary(otherLocale(t.locale));
  const s = Object.fromEntries(t.sections.map((x) => [x.key, x])) as Record<SectionKey, Dictionary["sections"][number]>;
  const altIds = Object.fromEntries(alt.sections.map((x) => [x.key, x.id])) as Record<SectionKey, string>;

  return (
    <>
      <a className="skip-link" href={`#${s.now.id}`}>
        {t.locale === "es" ? "Saltar al contenido" : "Skip to content"}
      </a>

      <Dock homeId={t.homeId} sections={t.sections} nav={t.nav} altHomeId={alt.homeId} altIds={altIds} />
      <Reveal />

      {/* Inicio */}
      <div className="hero-shell">
        <header id={t.homeId} className="hero wrap">
          <div className="hero-inner">
            <div className="hero-text">
              <span className="label enter">
                <span className="mark" aria-hidden="true" />
                {t.hero.eyebrow}
              </span>
              <Typewriter a={t.hero.titleA} b={t.hero.titleB} />
              <p className="hero-lead enter enter-3">{t.hero.lead}</p>
              <div className="hero-ctas enter enter-4">
                <a href={`#${s.contact.id}`} className="btn btn-ink lift">
                  {t.hero.talk}
                  <ArrowRight />
                </a>
                {hasCv && (
                  <a href={t.cv.href} download={t.cv.filename} className="btn btn-glass lift">
                    <Download />
                    {t.hero.cv}
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
                    sizes="(max-width: 440px) calc(100vw - 64px), 376px"
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
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>

      <main className="main wrap">
        {/* 01 Hoy */}
        <section id={s.now.id} className="section rv" aria-labelledby={`${s.now.id}-t`}>
          <div className="section-head">
            <SectionLabel num={s.now.num} label={s.now.label} />
            <h2 id={`${s.now.id}-t`} className="h2" style={{ maxWidth: "18ch" }}>
              {t.now.title}
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
                <span className="label">{t.now.org}</span>
                <h3 className="h3" style={{ fontSize: "clamp(22px, 2.2vw, 30px)" }}>
                  {t.now.role}
                </h3>
                <p className="muted" style={{ maxWidth: "54ch" }}>
                  {t.now.text}
                </p>
              </div>
              <div className="stack-12">
                <span className="label">{t.now.journeyLabel}</span>
                <ol className="journey">
                  {t.now.journey.map((j, i) => {
                    const last = i === t.now.journey.length - 1;
                    return (
                      <li key={j.what}>
                        <div className="journey-rail" aria-hidden="true">
                          <span className={`journey-dot${last ? " is-now" : ""}`} />
                          {!last && <span className="journey-line" />}
                        </div>
                        <span className="journey-when">{j.when || "\u00a0"}</span>
                        <span className="journey-what">{j.what}</span>
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
                  <span className="label">{t.now.graOrg}</span>
                  <h3 className="h3" style={{ fontSize: 22 }}>
                    {t.now.graRole}
                  </h3>
                </div>
              </article>
              <article className="now-card glass">
                <span className="tile" style={{ width: 56, height: 56, borderRadius: 18, color: "#10484B" }}>
                  <ZondasMark label={t.now.zondasAlt} />
                </span>
                <div className="stack-6">
                  <span className="label">{t.now.zondasOrg}</span>
                  <h3 className="h3" style={{ fontSize: 22 }}>
                    {t.now.zondasRole}
                  </h3>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* 02 Experiencia */}
        <section id={s.experience.id} className="section rv" aria-labelledby={`${s.experience.id}-t`}>
          <div className="exp-head">
            <div className="section-head">
              <SectionLabel num={s.experience.num} label={s.experience.label} />
              <h2 id={`${s.experience.id}-t`} className="h2">
                {t.experience.title}
              </h2>
            </div>
            <p className="muted exp-intro">{t.experience.intro}</p>
          </div>

          <div className="exp-list glass stag">
            {t.experience.items.map((it) => (
              <article key={it.code} className="exp-item">
                <span className="exp-code" aria-hidden="true">
                  {it.code}
                </span>
                <h3 className="h3 exp-title">{it.title}</h3>
                <div className="exp-body">
                  <p className="muted">{it.text}</p>
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
        <section id={s.projects.id} className="section rv" aria-labelledby={`${s.projects.id}-t`}>
          <div className="section-head">
            <SectionLabel num={s.projects.num} label={s.projects.label} />
            <h2 id={`${s.projects.id}-t`} className="h2">
              {t.projects.title}
            </h2>
          </div>

          <article className="proj glass">
            <div className="proj-shot">
              <Image src={graWeb} alt={t.projects.gra.shotAlt} sizes="(max-width: 900px) 100vw, 700px" />
            </div>
            <div className="proj-body">
              <div className="stack">
                <span className="label">{t.projects.gra.eyebrow}</span>
                <h3 className="h3 proj-title">{t.projects.gra.title}</h3>
                <p className="muted">{t.projects.gra.text}</p>
              </div>
              <a href={GRA_URL} target="_blank" rel="noopener" className="btn btn-line go">
                {t.projects.gra.link}
                <ArrowUpRight size={16} />
              </a>
            </div>
          </article>

          <article className="proj is-reverse glass">
            <div className="proj-body">
              <div className="stack">
                <span className="label">{t.projects.zondas.eyebrow}</span>
                <h3 className="h3 proj-title">{t.projects.zondas.title}</h3>
                <p className="muted">{t.projects.zondas.text}</p>
              </div>
              <a href={ZONDAS_URL} target="_blank" rel="noopener" className="btn btn-line go">
                {t.projects.zondas.link}
                <ArrowUpRight size={16} />
              </a>
            </div>
            <div className="proj-shot">
              <Image src={zondasWeb} alt={t.projects.zondas.shotAlt} sizes="(max-width: 900px) 100vw, 700px" />
            </div>
          </article>
        </section>

        {/* 04 Formación */}
        <section id={s.education.id} className="section rv" aria-labelledby={`${s.education.id}-t`}>
          <div className="section-head">
            <SectionLabel num={s.education.num} label={s.education.label} />
            <h2 id={`${s.education.id}-t`} className="h2">
              {t.education.title}
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
                  <span className="label">{t.education.degreeLabel}</span>
                  <h3 className="h3">{t.education.degree}</h3>
                </div>
                <p className="muted" style={{ fontSize: 15 }}>
                  {t.education.degreeMeta}
                </p>
              </article>
              <div className="edu-list glass stag">
                {t.education.items.map((it) => (
                  <div key={it.title} className="edu-row">
                    <span className="label">{it.label}</span>
                    <div>
                      <h4>{it.title}</h4>
                      <p className="muted">{it.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 05 Contacto */}
        <section id={s.contact.id} className="section contact rv" aria-labelledby={`${s.contact.id}-t`}>
          <div className="contact-glow breathe deco" aria-hidden="true" />

          <div className="contact-side">
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <SectionLabel num={s.contact.num} label={s.contact.label} />
              <h2 id={`${s.contact.id}-t`} className="contact-title">
                {t.contact.title}
              </h2>
              <p className="inv-muted" style={{ margin: 0, maxWidth: "40ch" }}>
                {t.contact.text}
              </p>
            </div>
            <nav aria-label={t.contact.channels} className="channels">
              <a href={`mailto:${EMAIL}`} className="chan">
                <span className="chan-ico">
                  <Mail />
                </span>
                <span className="chan-text">
                  <span>Email</span>
                  <span>{t.contact.emailSub}</span>
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
                    <span>{t.contact.cv}</span>
                    <span>PDF</span>
                  </span>
                  <ArrowDown className="arrow-d" />
                </a>
              )}
            </nav>
          </div>

          <ContactForm copy={t.contact.form} idPrefix={`cf-${t.locale}`} />
        </section>

        <footer className="footer">
          <span>{t.footer.name}</span>
          <a href={`#${t.homeId}`}>{t.footer.top}</a>
        </footer>
      </main>
    </>
  );
}
