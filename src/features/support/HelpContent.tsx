import { useEffect, useId, useState } from "react";
import { ChevronDown, Search, X } from "lucide-react";
import { SUPPORT_LANGUAGE_KEY, SUPPORT_LANGUAGES, supportCopy, type SupportLanguage } from "./content";
import "./support.css";

export function useSupportLanguage() {
  const [language, setLanguage] = useState<SupportLanguage>(() => {
    try {
      const stored = window.localStorage.getItem(SUPPORT_LANGUAGE_KEY);
      return SUPPORT_LANGUAGES.find(value => value === stored) ?? "en";
    } catch { return "en"; }
  });
  useEffect(() => {
    try { window.localStorage.setItem(SUPPORT_LANGUAGE_KEY, language); } catch { /* Help still works without storage. */ }
  }, [language]);
  return { language, setLanguage, copy: supportCopy[language] };
}

export function SupportLanguageSelector({ language, onChange }: { language: SupportLanguage; onChange: (language: SupportLanguage) => void }) {
  return <div role="group" aria-label={supportCopy[language].language} className="support-language">
    {SUPPORT_LANGUAGES.map((value, i) => <button key={value} type="button" lang={value} aria-pressed={language === value} onClick={() => onChange(value)}>{["English", "ਪੰਜਾਬੀ", "हिन्दी"][i]}</button>)}
  </div>;
}

export function HelpQuestions({ language }: { language: SupportLanguage }) {
  const t = supportCopy[language];
  const searchId = useId();
  const [search, setSearch] = useState("");
  const [topic, setTopic] = useState<number | null>(null);
  const query = search.trim().toLocaleLowerCase();
  const filtered = t.faqs.map((faq, index) => ({ ...faq, index })).filter(faq => (topic === null || faq.topic === topic) && (!query || `${faq.question} ${faq.answer} ${t.topicLabels[faq.topic]}`.toLocaleLowerCase().includes(query)));

  return <section id="help-questions" className="support-panel scroll-mt-24" aria-labelledby="help-questions-title">
    <div className="support-section-heading"><h2 id="help-questions-title">{t.questions}</h2><span aria-hidden="true" className="support-count">{t.faqs.length}</span></div>
    <div className="support-search">
      <Search size={19} aria-hidden="true" /><label htmlFor={searchId} className="sr-only">{t.search}</label>
      <input id={searchId} type="search" value={search} onChange={event => setSearch(event.target.value)} placeholder={t.search} />
      {search && <button type="button" aria-label={t.clear} onClick={() => setSearch("")}><X size={18} aria-hidden="true" /></button>}
    </div>
    <div role="group" aria-label={t.topics} className="support-topic-filters">
      <button type="button" aria-pressed={topic === null} onClick={() => setTopic(null)}>{t.all}</button>
      {t.topicLabels.map((label, index) => <button type="button" key={index} aria-pressed={topic === index} onClick={() => setTopic(index)}>{label}</button>)}
    </div>
    <div className="support-faqs" key={`${language}-${topic}-${search}`}>
      {filtered.map(faq => <details key={faq.index} className="support-faq"><summary>{faq.question}<ChevronDown size={18} aria-hidden="true" /></summary><p>{faq.answer}</p></details>)}
    </div>
    {filtered.length === 0 && <p role="status" className="support-muted py-5">{t.noResults}</p>}
  </section>;
}
