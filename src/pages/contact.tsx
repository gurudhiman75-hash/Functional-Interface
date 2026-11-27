import { Spinner } from "@/components/ui/spinner";
import "@/styles/form-feedback-motion.css";
import "@/styles/learner-overlay-motion.css";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "wouter";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle2, CreditCard, FileText, Languages, LifeBuoy, Mail, Monitor, Plus, Send, ShieldCheck, UserRound, X } from "lucide-react";
import { usePageMeta } from "@/components/PublicPage";
import { API_BASE_URL } from "@/lib/api";
import { getFirebaseAuth } from "@/lib/firebase";
import { HelpQuestions, SupportLanguageSelector, useSupportLanguage } from "@/features/support/HelpContent";
import { SUPPORT_CATEGORIES } from "@/features/support/content";

const SUPPORT_EMAIL = "support@examtree.in";
type SupportTicket = { id: string; category: string; message: string; status: string; publicReply: string; createdAt: string; updatedAt: string };
type FormError = "nameError" | "emailError" | "messageError" | "sendError";
const topicIcons = [UserRound, BookOpen, CreditCard, Languages, Monitor];

export default function Contact() {
  const { language, setLanguage, copy: t } = useSupportLanguage();
  usePageMeta(t.title, t.subtitle);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState<string>(SUPPORT_CATEGORIES[0]);
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState("");
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [sending, setSending] = useState(false);
  const sendingRef = useRef(false);
  const [error, setError] = useState<FormError | null>(null);
  const [receivedId, setReceivedId] = useState("");
  const [tickets, setTickets] = useState<SupportTicket[] | null>(null);
  const [trackingBusy, setTrackingBusy] = useState(false);
  const [trackingError, setTrackingError] = useState<"trackingHint" | "verify" | "trackError" | null>(null);
  const detailsRef = useRef<HTMLInputElement>(null);
  const continueRef = useRef<HTMLButtonElement>(null);
  const newRequestRef = useRef<HTMLButtonElement>(null);
  const trackingRef = useRef(false);

  // Switching language or closing/reopening the dialog does not discard a draft.
  useEffect(() => {
    if (open && step === 2 && !receivedId) detailsRef.current?.focus();
  }, [open, step, receivedId]);

  async function loadMyRequests() {
    if (trackingRef.current) return;
    trackingRef.current = true;
    setTrackingBusy(true);
    setTrackingError(null);
    setTickets(null);
    try {
      const auth = getFirebaseAuth();
      await auth?.authStateReady();
      const user = auth?.currentUser;
      if (!user) { setTrackingError("trackingHint"); return; }
      if (!user.emailVerified) { setTrackingError("verify"); return; }
      const token = await user.getIdToken();
      const response = await fetch(`${API_BASE_URL}/support/tickets/mine`, {
        headers: { Authorization: `Bearer ${token}` }, cache: "no-store",
      });
      const body = await response.json().catch(() => ({})) as { tickets?: SupportTicket[] };
      if (!response.ok || !Array.isArray(body.tickets)) throw new Error("Support history unavailable");
      // Do not reveal a previous account's history if auth changed during the fetch.
      if (auth?.currentUser?.uid === user.uid) setTickets(body.tickets);
    } catch { setTrackingError("trackError"); }
    finally { trackingRef.current = false; setTrackingBusy(false); }
  }

  async function submitTicket(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sendingRef.current) return;
    if (name.trim().length < 2) { setError("nameError"); detailsRef.current?.focus(); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) { setError("emailError"); document.getElementById("support-email")?.focus(); return; }
    if (message.trim().length < 12) { setError("messageError"); document.getElementById("support-message")?.focus(); return; }
    sendingRef.current = true;
    setSending(true); setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/support/tickets`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), category, message: message.trim(), website }),
      });
      const body = await response.json().catch(() => ({})) as { id?: string };
      if (!response.ok || typeof body.id !== "string" || !body.id) throw new Error("Support submission unavailable");
      setReceivedId(body.id); setMessage(""); setTickets(null);
    } catch { setError("sendError"); }
    finally { sendingRef.current = false; setSending(false); }
  }

  const mailtoHref = useMemo(() => {
    const subject = `ExamTree support: ${category}`;
    const body = [`Name: ${name || "Not provided"}`, `Reply email: ${email || "Not provided"}`, `Issue category: ${category}`, `Help language: ${language}`, "", message || "Please describe the issue here."].join("\n");
    return `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }, [category, email, message, name, language]);

  function openRequest() { setReceivedId(""); setError(null); setStep(1); setOpen(true); }
  const categoryLabel = (value: string) => {
    const index = SUPPORT_CATEGORIES.findIndex(item => item === value);
    return index < 0 ? value : t.categoryLabels[index];
  };
  const statusLabel = (value: string) => Object.hasOwn(t.status, value) ? t.status[value as keyof typeof t.status] : t.status.unknown;

  return <div className="support-page" lang={language}>
    <div className="support-topline"><span className="support-eyebrow">{t.eyebrow}</span><SupportLanguageSelector language={language} onChange={setLanguage} /></div>
    <header className="support-hero">
      <div><h1>{t.title}</h1><p>{t.subtitle}</p><div className="support-actions">
        <button ref={newRequestRef} type="button" className="support-button support-button-gold" onClick={openRequest}><Plus size={18} aria-hidden="true" />{t.newRequest}</button>
        <a className="support-button" href="#help-questions"><BookOpen size={18} aria-hidden="true" />{t.browse}</a>
      </div></div>
      <div className="support-hero-icon" aria-hidden="true"><LifeBuoy size={52} strokeWidth={1.2} /></div>
    </header>
    <div className="support-columns">
      <div className="min-w-0">
        <section className="support-panel" aria-labelledby="support-requests-title" aria-busy={trackingBusy}>
          <div className="support-section-heading"><FileText size={20} aria-hidden="true" /><h2 id="support-requests-title">{t.requests}</h2></div>
          <p className="support-muted">{t.requestsHint}</p>
          {tickets === null && !trackingError && <div className="support-empty"><FileText size={26} aria-hidden="true" /><p className="support-muted">{t.trackingHint}</p></div>}
          <button type="button" className="support-button mt-4" disabled={trackingBusy} onClick={() => void loadMyRequests()}>{trackingBusy ? t.loading : tickets === null ? t.load : t.refresh}</button>
          {trackingError && <div className="support-notice" role="alert">{t[trackingError]}{trackingError === "trackingHint" && <><br /><Link href="/login/student" className="support-inline-link">{t.signIn}<ArrowRight size={16} aria-hidden="true" /></Link></>}</div>}
          {tickets && <div aria-label={t.requests}>
            <p className="support-muted mt-4">{tickets.length ? t.original : t.empty}</p>
            {tickets.map(ticket => <article key={ticket.id} className="support-ticket">
              <div className="support-ticket-head"><h3>{categoryLabel(ticket.category)}</h3><span className="support-status" data-status={ticket.status}>{statusLabel(ticket.status)}</span></div>
              <p className="support-muted mt-1">{t.ticket}: <bdi>{ticket.id}</bdi></p>
              <p className="support-ticket-message" dir="auto">{ticket.message}</p>
              {ticket.publicReply && <div className="support-reply"><strong>{t.reply}</strong><p dir="auto">{ticket.publicReply}</p></div>}
            </article>)}
          </div>}
        </section>
        <HelpQuestions language={language} />
      </div>
      <aside className="support-sidebar">
        <section className="support-panel" aria-labelledby="support-topics-title"><h2 id="support-topics-title" className="mb-3">{t.topics}</h2>
          {t.topicLabels.map((label, index) => { const Icon = topicIcons[index]; return <div className="support-topic-row" key={index}><Icon size={19} aria-hidden="true" /><div><strong>{label}</strong><p>{t.topicDescriptions[index]}</p></div></div>; })}
        </section>
        <section className="support-panel support-email-panel"><Mail size={24} aria-hidden="true" /><h2>{t.emailTitle}</h2><p className="support-muted">{t.emailHint}</p><a href={`mailto:${SUPPORT_EMAIL}`} className="support-inline-link">{SUPPORT_EMAIL}</a></section>
        <details className="support-business"><summary>{t.business}</summary><p>{t.brand}: ExamTree</p><p>{t.legal}: Baljit Kaur</p></details>
      </aside>
    </div>
    <DialogPrimitive.Root open={open} onOpenChange={value => { if (!sendingRef.current) setOpen(value); }}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay data-et-motion="learner" data-et-surface="overlay" className="fixed inset-0 z-50 bg-slate-950/55 backdrop-blur-sm" />
        <DialogPrimitive.Content data-et-motion="learner" data-et-surface="dialog" lang={language} className="support-dialog fixed left-1/2 top-1/2 z-50 max-h-[90dvh] w-[calc(100%-24px)] max-w-xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl sm:p-7" onCloseAutoFocus={event => { event.preventDefault(); newRequestRef.current?.focus(); }}>
          <SupportLanguageSelector language={language} onChange={setLanguage} />
          <DialogPrimitive.Close aria-label={t.close} disabled={sending} className="absolute right-2 top-2 flex h-11 w-11 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"><X size={20} aria-hidden="true" /></DialogPrimitive.Close>
          <DialogPrimitive.Title className="mt-5 text-xl font-bold leading-relaxed">{t.formTitle}</DialogPrimitive.Title>
          <DialogPrimitive.Description className="support-muted mt-1">{t.formHint}</DialogPrimitive.Description>
          {receivedId ? <div className="support-success" role="status"><CheckCircle2 size={44} aria-hidden="true" /><p>{t.received}<br /><strong>{receivedId}</strong></p><DialogPrimitive.Close className="support-button support-button-navy">{t.done}</DialogPrimitive.Close></div> : <>
            <div className="support-stepper"><span aria-current={step === 1 ? "step" : undefined}><b>1</b>{t.issueStep}</span><span aria-hidden="true">→</span><span aria-current={step === 2 ? "step" : undefined}><b>2</b>{t.detailsStep}</span></div>
            {step === 1 ? <div><fieldset><legend className="text-sm font-semibold">{t.choose}</legend><div className="support-categories">
              {SUPPORT_CATEGORIES.map((value, index) => <label key={value}><input type="radio" name="support-category" value={value} checked={category === value} onChange={() => setCategory(value)} />{t.categoryLabels[index]}</label>)}
            </div></fieldset><button ref={continueRef} type="button" className="support-button support-button-navy w-full" onClick={() => setStep(2)}>{t.next}<ArrowRight size={17} aria-hidden="true" /></button></div> : <form onSubmit={submitTicket} noValidate>
              <fieldset disabled={sending} className="support-form-fields">
                <div className="grid gap-4 sm:grid-cols-2"><div><label htmlFor="support-name">{t.name}</label><input ref={detailsRef} id="support-name" autoComplete="name" maxLength={120} required placeholder={t.namePlaceholder} value={name} onChange={event => setName(event.target.value)} aria-invalid={error === "nameError"} aria-describedby={error === "nameError" ? "support-form-error" : undefined} /></div>
                <div><label htmlFor="support-email">{t.email}</label><input id="support-email" type="email" autoComplete="email" maxLength={254} required placeholder="you@example.com" value={email} onChange={event => setEmail(event.target.value)} aria-invalid={error === "emailError"} aria-describedby={error === "emailError" ? "support-form-error" : undefined} /></div></div>
                <div><label htmlFor="support-category">{t.category}</label><select id="support-category" value={category} onChange={event => setCategory(event.target.value)}>{SUPPORT_CATEGORIES.map((value, index) => <option key={value} value={value}>{t.categoryLabels[index]}</option>)}</select></div>
                <div><label htmlFor="support-message">{t.message}</label><textarea id="support-message" required maxLength={5000} placeholder={t.messagePlaceholder} value={message} onChange={event => setMessage(event.target.value)} aria-invalid={error === "messageError"} aria-describedby={error === "messageError" ? "support-form-error support-email-note" : "support-email-note"} /></div>
                <div aria-hidden="true" className="absolute -left-[10000px]"><label htmlFor="support-website">Website</label><input id="support-website" tabIndex={-1} autoComplete="off" value={website} onChange={event => setWebsite(event.target.value)} /></div>
                <p className="support-form-hint">{t.detailsHint}</p>
                <p id="support-email-note" className="support-muted flex gap-2"><ShieldCheck size={18} className="shrink-0" aria-hidden="true" />{t.privacy}</p>
              </fieldset>
              {error && <p id="support-form-error" role="alert" className="support-notice">{t[error]}{error === "sendError" && <span className="mt-2 block">{t.fallback}</span>}</p>}
              <div className="mt-5 flex flex-wrap gap-3"><button type="button" className="support-button" disabled={sending} onClick={() => { setStep(1); setError(null); requestAnimationFrame(() => continueRef.current?.focus()); }}><ArrowLeft size={17} aria-hidden="true" />{t.back}</button><button type="submit" className="support-button support-button-navy flex-1" aria-busy={sending} disabled={sending}>{sending ? <Spinner aria-hidden="true" /> : <Send size={17} aria-hidden="true" />}{sending ? t.sending : t.submit}</button></div>
              <a className="support-inline-link mt-3" href={mailtoHref} data-testid="contact-email-handoff"><Mail size={17} aria-hidden="true" />{t.emailAction}</a>
            </form>}
          </>}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  </div>;
}
