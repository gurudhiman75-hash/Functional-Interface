import { ArrowRight, BookOpen, GraduationCap, Landmark, Layers3, Sparkles } from "lucide-react";
import { Link } from "wouter";
import type { ExamCollection } from "@/lib/exam-collections";
import "@/styles/exam-collections.css";

export function ExamCollectionBanner({ collection, heading = false }: { collection: ExamCollection; heading?: boolean }) {
  const isPunjab = collection.slug === "punjab-government";
  const headline = isPunjab ? "ਪੰਜਾਬ ਦੀਆਂ ਸਰਕਾਰੀ ਨੌਕਰੀਆਂ" : collection.headline;
  const description = isPunjab ? "ਪੰਜਾਬ ਦੀਆਂ ਭਰਤੀ ਪ੍ਰੀਖਿਆਵਾਂ ਦੀ ਤਿਆਰੀ ਇੱਕੋ ਥਾਂ।" : collection.description;
  const action = isPunjab ? "ਪ੍ਰੀਖਿਆਵਾਂ ਵੇਖੋ" : heading ? "Browse exam routes" : "Explore Exams";
  const Illustration = collection.theme === "emerald" ? Landmark : collection.theme === "copper" ? BookOpen : collection.theme === "navy" ? GraduationCap : Layers3;
  const content = <>    <div className="collection-banner-copy">
      <span className="collection-banner-label"><Sparkles size={13} /> {collection.title}</span>
      {heading ? <h1 lang={isPunjab ? "pa" : undefined}>{headline}</h1> : <h3 lang={isPunjab ? "pa" : undefined}>{headline}</h3>}
      <p lang={isPunjab ? "pa" : undefined}>{description}</p>
      <div className="collection-banner-chips">{(isPunjab ? ["PSSSB", "Punjab Police", "PPSC", "PSPCL"] : collection.examples).map((name) => <span key={name}>{name}</span>)}</div>
      {heading ? <a className="collection-banner-link" href="#collection-exams" lang={isPunjab ? "pa" : undefined}>{action} <ArrowRight size={17} /></a> : <span className="collection-banner-link" lang={isPunjab ? "pa" : undefined}>{action} <ArrowRight size={17} /></span>}
    </div>
    {isPunjab ? <><div className="collection-punjab-art" aria-hidden="true"><img src={`${import.meta.env.BASE_URL}images/collections/punjab-bhangra.webp`} alt="" width="720" height="720" loading="lazy" /></div><span className="collection-phulkari" aria-hidden="true" /></> : <div className="collection-banner-art" aria-hidden="true"><span className="collection-art-orbit" /><span className="collection-art-orbit second" /><Illustration strokeWidth={1.2} /><span className="collection-art-badge"><BookOpen size={18} /></span></div>}
  </>;
  const className = `exam-collection-banner theme-${collection.theme}${isPunjab ? " collection-punjab" : ""}`;
  return heading ? <section className={className}>{content}</section> : <Link href={`/collections/${collection.slug}`} className={className} data-testid={`collection-${collection.slug}`}>{content}</Link>;
}
