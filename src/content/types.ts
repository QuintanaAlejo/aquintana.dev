export type Locale = "es" | "en";

export type SectionKey = "now" | "experience" | "projects" | "education" | "contact";

export type NavSection = { key: SectionKey; id: string; label: string; num: string };

export type Dictionary = {
  locale: Locale;
  ogLocale: string;
  path: "/" | "/en";
  meta: { title: string; description: string; ogAlt: string };
  /** Web version of the CV for this language (file in /public) and the name it downloads with. */
  cv: { href: string; filename: string };
  homeId: string;
  sections: NavSection[];
  nav: {
    home: string;
    backToTop: string;
    sections: string;
    language: string;
    theme: string;
    light: string;
    dark: string;
    otherLocale: { code: string; name: string; path: "/" | "/en"; lang: Locale };
    currentCode: string;
  };
  hero: {
    eyebrow: string;
    titleA: string;
    titleB: string;
    lead: string;
    talk: string;
    cv: string;
    portraitAlt: string;
  };
  ticker: string[];
  now: {
    title: string;
    techintAlt: string;
    fepsaAlt: string;
    org: string;
    role: string;
    text: string;
    journeyLabel: string;
    journey: { when: string; what: string }[];
    graAlt: string;
    graOrg: string;
    graRole: string;
    zondasAlt: string;
    zondasOrg: string;
    zondasRole: string;
  };
  experience: {
    title: string;
    intro: string;
    items: { code: string; title: string; text: string; tags: string[] }[];
  };
  projects: {
    title: string;
    gra: { eyebrow: string; title: string; text: string; link: string; shotAlt: string };
    zondas: { eyebrow: string; title: string; text: string; link: string; shotAlt: string };
  };
  education: {
    title: string;
    photoAlt: string;
    degreeLabel: string;
    degree: string;
    degreeMeta: string;
    items: { label: string; title: string; text: string }[];
  };
  contact: {
    title: string;
    text: string;
    channels: string;
    emailSub: string;
    cv: string;
    form: {
      to: string;
      newMessage: string;
      name: string;
      namePh: string;
      email: string;
      emailPh: string;
      message: string;
      messagePh: string;
      errName: string;
      errEmailEmpty: string;
      errEmailFormat: string;
      errMessage: string;
      note: string;
      send: string;
      sending: string;
      sentTitle: string;
      sentText: string;
      again: string;
      failed: string;
      honeypot: string;
      subject: string;
    };
  };
  footer: { name: string; top: string };
  notFound: { title: string; text: string; back: string };
};
