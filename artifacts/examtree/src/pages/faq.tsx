import { Link } from "wouter";
import { ArrowRight, LifeBuoy } from "lucide-react";
import { usePageMeta } from "@/components/PublicPage";
import { HelpQuestions, SupportLanguageSelector, useSupportLanguage } from "@/features/support/HelpContent";

export default function FAQ() {
  const { language, setLanguage, copy: t } = useSupportLanguage();
  usePageMeta(t.questions, t.faqSubtitle);
  return <div className="support-page" lang={language}>
    <div className="support-topline"><span className="support-eyebrow">{t.eyebrow}</span><SupportLanguageSelector language={language} onChange={setLanguage} /></div>
    <header className="support-hero"><div><h1>{t.faqTitle}</h1><p>{t.faqSubtitle}</p></div><div className="support-hero-icon" aria-hidden="true"><LifeBuoy size={48} strokeWidth={1.2} /></div></header>
    <HelpQuestions language={language} />
    <div className="support-panel support-email-panel flex flex-wrap items-center justify-between gap-4"><div><h2>{t.emailTitle}</h2><p className="support-muted">{t.emailHint}</p></div><Link href="/contact" className="support-button support-button-navy">{t.title}<ArrowRight size={17} aria-hidden="true" /></Link></div>
  </div>;
}
