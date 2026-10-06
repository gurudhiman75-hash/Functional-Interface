import { ArrowRight, BookOpen, GraduationCap, Landmark, Layers3, Sparkles } from "lucide-react";
import { Link } from "wouter";
import type { ExamCollection } from "@/lib/exam-collections";
import "@/styles/exam-collections.css";

export function ExamCollectionBanner({ collection, heading = false }: { collection: ExamCollection; heading?: boolean }) {
  const Illustration = collection.theme === "emerald" ? Landmark : collection.theme === "copper" ? BookOpen : collection.theme === "navy" ? GraduationCap : Layers3;
  const content = <>    <div className="collection-banner-copy">
      <span className="collection-banner-label"><Sparkles size={13} /> {collection.title}</span>
      {heading ? <h1>{collection.headline}</h1> : <h3>{collection.headline}</h3>}
      <p>{collection.description}</p>
      <div className="collection-banner-chips">{collection.examples.map((name) => <span key={name}>{name}</span>)}</div>
      {heading ? <a className="collection-banner-link" href="#collection-exams">Browse exam routes <ArrowRight size={17} /></a> : <span className="collection-banner-link">Explore Exams <ArrowRight size={17} /></span>}
    </div>
    <div className="collection-banner-art" aria-hidden="true"><span className="collection-art-orbit" /><span className="collection-art-orbit second" /><Illustration strokeWidth={1.2} /><span className="collection-art-badge"><BookOpen size={18} /></span></div>
  </>;
  return heading ? <section className={`exam-collection-banner theme-${collection.theme}`}>{content}</section> : <Link href={`/collections/${collection.slug}`} className={`exam-collection-banner theme-${collection.theme}`} data-testid={`collection-${collection.slug}`}>{content}</Link>;
}
