"use client";

import { useState, type FormEvent } from "react";
import type { Dictionary } from "@/content/types";
import { WEB3FORMS_KEY } from "@/lib/site";
import { ArrowRight, Check, Spinner } from "./icons";

type Copy = Dictionary["contact"]["form"];
type Field = "name" | "email" | "message";
type Errors = Partial<Record<Field, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const TIMEOUT_MS = 10000;

export function ContactForm({ copy, idPrefix }: { copy: Copy; idPrefix: string }) {
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "failed">("idle");
  const [len, setLen] = useState(0);

  const id = (f: string) => `${idPrefix}-${f}`;

  const clear = (f: Field) => () => {
    if (errors[f]) setErrors((e) => ({ ...e, [f]: undefined }));
    if (status === "failed") setStatus("idle");
  };

  async function onSubmit(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    if (status === "sending") return;
    const form = ev.currentTarget;
    const data = new FormData(form);
    const val = (k: string) => String(data.get(k) ?? "").trim();
    const name = val("name");
    const email = val("email");
    const message = val("message");

    const next: Errors = {};
    if (!name) next.name = copy.errName;
    if (!email) next.email = copy.errEmailEmpty;
    else if (!EMAIL_RE.test(email)) next.email = copy.errEmailFormat;
    if (!message) next.message = copy.errMessage;
    if (next.name || next.email || next.message) {
      setErrors(next);
      const first = next.name ? "name" : next.email ? "email" : "message";
      document.getElementById(id(first))?.focus();
      return;
    }
    setErrors({});

    // Honeypot: people never see this field, bots fill it. Pretend it worked.
    if (val("website")) {
      setStatus("sent");
      return;
    }

    setStatus("sending");
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: copy.subject,
          from_name: "aquintana.dev",
          name,
          email,
          message,
          botcheck: false,
        }),
        signal: ctrl.signal,
      });
      const json = (await res.json().catch(() => null)) as { success?: boolean } | null;
      if (!res.ok || !json?.success) throw new Error("Send failed");
      setStatus("sent");
      setLen(0);
    } catch {
      // Keep everything the visitor typed; only show the error.
      setStatus("failed");
    } finally {
      clearTimeout(timer);
    }
  }

  const sending = status === "sending";

  return (
    <form className="form" noValidate onSubmit={onSubmit}>
      <div className="form-head">
        <span className="form-avatar" aria-hidden="true">
          AQ
        </span>
        <span style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", lineHeight: 1.3 }}>
          <span className="label">{copy.to}</span>
          <span style={{ fontWeight: 500 }}>Alejo Quintana</span>
        </span>
        <span className="label">{copy.newMessage}</span>
      </div>

      {status === "sent" ? (
        <div role="status" className="sent">
          <span className="sent-check" aria-hidden="true">
            <Check size={26} />
          </span>
          <h3 className="h3">{copy.sentTitle}</h3>
          <p className="inv-muted" style={{ margin: 0, maxWidth: "36ch" }}>
            {copy.sentText}
          </p>
          <button type="button" className="btn-ghost-inv" onClick={() => setStatus("idle")}>
            {copy.again}
          </button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div className={`field${errors.name ? " is-bad" : ""}`}>
            <label htmlFor={id("name")} className="label">
              {copy.name}
            </label>
            <div className="field-col">
              <input
                id={id("name")}
                name="name"
                type="text"
                autoComplete="name"
                placeholder={copy.namePh}
                maxLength={120}
                onChange={clear("name")}
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? id("name-err") : undefined}
              />
              {errors.name && (
                <span id={id("name-err")} className="field-err">
                  {errors.name}
                </span>
              )}
            </div>
          </div>

          <div className={`field${errors.email ? " is-bad" : ""}`}>
            <label htmlFor={id("email")} className="label">
              {copy.email}
            </label>
            <div className="field-col">
              <input
                id={id("email")}
                name="email"
                type="email"
                autoComplete="email"
                inputMode="email"
                placeholder={copy.emailPh}
                maxLength={200}
                onChange={clear("email")}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? id("email-err") : undefined}
              />
              {errors.email && (
                <span id={id("email-err")} className="field-err">
                  {errors.email}
                </span>
              )}
            </div>
          </div>

          <div className={`field is-area${errors.message ? " is-bad" : ""}`}>
            <label htmlFor={id("message")} className="label">
              {copy.message}
            </label>
            <textarea
              id={id("message")}
              name="message"
              rows={5}
              maxLength={1000}
              placeholder={copy.messagePh}
              onChange={(e) => {
                setLen(e.target.value.length);
                if (e.target.value.trim()) clear("message")();
              }}
              aria-invalid={!!errors.message}
              aria-describedby={errors.message ? id("message-err") : undefined}
            />
            <div className="area-foot">
              {errors.message && (
                <span id={id("message-err")} className="field-err">
                  {errors.message}
                </span>
              )}
              <span className="counter" aria-hidden="true">
                {len} / 1000
              </span>
            </div>
          </div>

          <div className="hp" aria-hidden="true">
            <label htmlFor={id("website")}>{copy.honeypot}</label>
            <input id={id("website")} name="website" type="text" tabIndex={-1} autoComplete="off" />
          </div>

          <div className="form-foot">
            <span className="form-note">{copy.note}</span>
            <button type="submit" className="send" disabled={sending} aria-busy={sending}>
              {sending ? copy.sending : copy.send}
              {sending ? <Spinner className="spin" /> : <ArrowRight />}
            </button>
          </div>
          <p role="alert" className="form-fail" hidden={status !== "failed"}>
            {status === "failed" ? copy.failed : ""}
          </p>
        </div>
      )}
    </form>
  );
}
