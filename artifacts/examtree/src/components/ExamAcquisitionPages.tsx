import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { CheckCircle2, ChevronDown, Loader2 } from "lucide-react";

import MathText from "@/components/MathText";
import { CheckList, PublicCard, PublicPage, usePageMeta } from "@/components/PublicPage";
import { apiRequest } from "@/lib/api";
import {
  examHubHref,
  examPreparationHref,
  examSyllabusHref,
  findPracticeTopic,
  getExamAcquisitionConfig,
  practiceTopicHref,
} from "@/lib/seo-practice";

type PublicPracticeQuestion = {
  id: string;
  topicSlug: string;
  language: string;
  difficulty: string;
  text: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
};

type PublicPracticeResponse = {
  examSlug: string;
  topicSlug: string;
  language: string;
  count: number;
  questions: PublicPracticeQuestion[];
};

function requireConfig(examSlug: string) {
  const config = getExamAcquisitionConfig(examSlug);
  if (!config) throw new Error("Unknown exam acquisition config: " + examSlug);
  return config;
}

export function ExamHubPage({ examSlug }: { examSlug: string }) {
  const config = requireConfig(examSlug);
  usePageMeta(config.meta.hubTitle, config.meta.hubDescription, { canonicalPath: examHubHref(examSlug) });

  return (
    <PublicPage eyebrow={config.name} title={config.hub.title} description={config.hub.description}>
      <div className="grid gap-4 md:grid-cols-3">
        <PublicCard title="Preparation guide">
          {config.hub.preparationSummary}
          <Link href={examPreparationHref(examSlug)} className="mt-3 block font-semibold text-indigo-700 hover:underline">How to prepare for {config.name}</Link>
        </PublicCard>
        <PublicCard title="Syllabus & pattern">
          {config.hub.syllabusSummary}
          <Link href={examSyllabusHref(examSlug)} className="mt-3 block font-semibold text-indigo-700 hover:underline">{config.name} syllabus</Link>
        </PublicCard>
        <PublicCard title="Mock tests">
          {config.hub.mockSummary}
          <Link href={config.categoryHref} className="mt-3 block font-semibold text-indigo-700 hover:underline">Browse {config.name} mock tests</Link>
        </PublicCard>
      </div>

      <section className="mt-8">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-950">Free {config.name} practice questions</h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">Open a topic, solve the visible questions without starting a full mock, then reveal the answer and explanation when you are ready.</p>
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {config.topics.map((topic) => (
            <Link key={topic.slug} href={practiceTopicHref(topic.slug, examSlug)} className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-indigo-600">{topic.subject}</p>
              <h3 className="mt-2 text-lg font-semibold text-slate-950">{topic.name} Questions</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{topic.summary}</p>
            </Link>
          ))}
        </div>
      </section>
    </PublicPage>
  );
}

export function ExamPreparationPage({ examSlug }: { examSlug: string }) {
  const config = requireConfig(examSlug);
  usePageMeta(config.meta.preparationTitle, config.meta.preparationDescription, { canonicalPath: examPreparationHref(examSlug) });

  return (
    <PublicPage eyebrow={config.preparation.eyebrow} title={config.preparation.title} description={config.preparation.description}>
      <div className="grid gap-4 lg:grid-cols-3">
        {config.preparation.cards.map((card) => <PublicCard key={card.title} title={card.title}>{card.text}</PublicCard>)}
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="text-xl font-semibold text-slate-950">A workable weekly cycle</h2>
        <div className="mt-4 text-sm leading-7 text-slate-600"><CheckList items={config.preparation.weeklyCycle} /></div>
      </div>

      <section className="mt-8">
        <h2 className="text-xl font-semibold text-slate-950">Start with free topic practice</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {config.topics.map((topic) => (
            <Link key={topic.slug} href={practiceTopicHref(topic.slug, examSlug)} className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm font-semibold text-slate-800 hover:border-indigo-300 hover:bg-white">
              {topic.name} questions
            </Link>
          ))}
        </div>
      </section>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link href={examSyllabusHref(examSlug)} className="rounded-xl bg-[#1e1b4b] px-4 py-3 text-sm font-semibold text-white">View {config.name} syllabus</Link>
        <Link href={config.categoryHref} className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800">Browse {config.name} mock tests</Link>
      </div>
    </PublicPage>
  );
}

export function ExamSyllabusPage({ examSlug }: { examSlug: string }) {
  const config = requireConfig(examSlug);
  usePageMeta(config.meta.syllabusTitle, config.meta.syllabusDescription, { canonicalPath: examSyllabusHref(examSlug) });

  return (
    <PublicPage eyebrow={config.syllabus.eyebrow} title={config.syllabus.title} description={config.syllabus.description}>
      <div className="grid gap-4 md:grid-cols-2">
        {config.syllabus.sections.map((section) => <PublicCard key={section.title} title={section.title}>{section.summary}</PublicCard>)}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        {config.syllabus.patternCards.map((card) => <PublicCard key={card.title} title={card.title}>{card.text}</PublicCard>)}
      </div>

      <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-950">
        {config.syllabus.verificationNote} <a href={config.officialUrl} target="_blank" rel="noreferrer" className="font-semibold underline">{config.officialLabel}</a>.
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link href={examPreparationHref(examSlug)} className="rounded-xl bg-[#1e1b4b] px-4 py-3 text-sm font-semibold text-white">How to prepare</Link>
        <Link href={examHubHref(examSlug)} className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800">{config.name} hub</Link>
      </div>
    </PublicPage>
  );
}

function QuestionCard({ question, index }: { question: PublicPracticeQuestion; index: number }) {
  const [revealed, setRevealed] = useState(false);
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.04)] sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-indigo-600">Question {index + 1}</p>
        {question.difficulty ? <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">{question.difficulty}</span> : null}
      </div>
      <MathText content={question.text} className="mt-4 text-base font-semibold leading-7 text-slate-950" />
      <div className="mt-5 grid gap-2.5">
        {question.options.map((option, optionIndex) => {
          const isCorrect = revealed && optionIndex === question.correctOptionIndex;
          return (
            <div key={question.id + "-" + optionIndex} className={"rounded-xl border px-4 py-3 text-sm leading-6 " + (isCorrect ? "border-emerald-300 bg-emerald-50 text-emerald-950" : "border-slate-200 bg-slate-50 text-slate-700")}>
              <div className="flex gap-3">
                <span className="font-bold text-slate-500">{String.fromCharCode(65 + optionIndex)}.</span>
                <MathText content={option} className="min-w-0 flex-1" />
                {isCorrect ? <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" aria-label="Correct answer" /> : null}
              </div>
            </div>
          );
        })}
      </div>

      <button type="button" onClick={() => setRevealed((value) => !value)} className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-800 hover:bg-indigo-100" aria-expanded={revealed}>
        {revealed ? "Hide answer" : "Show answer & explanation"}
        <ChevronDown className={"h-4 w-4 transition " + (revealed ? "rotate-180" : "")} />
      </button>

      {revealed ? (
        <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
          <p className="text-sm font-bold text-emerald-950">Correct answer: {String.fromCharCode(65 + question.correctOptionIndex)}</p>
          {question.explanation ? <MathText content={question.explanation} className="mt-2 text-sm leading-7 text-emerald-950/85" /> : <p className="mt-2 text-sm text-emerald-900/80">The approved answer is shown above.</p>}
        </div>
      ) : null}
    </article>
  );
}

export function ExamTopicQuestionsPage({ examSlug, topicSlug }: { examSlug: string; topicSlug: string | undefined }) {
  const config = requireConfig(examSlug);
  const topic = findPracticeTopic(examSlug, topicSlug);

  usePageMeta(
    topic ? topic.name + " Questions for " + config.name + " – Free Practice" : config.name + " Free Practice Questions",
    topic ? "Solve free " + topic.name + " questions for " + config.name + " with answers and explanations. Practice continuously before moving to timed mock tests." : "Free " + config.name + " topic-wise practice questions with answers and explanations.",
    topic ? { canonicalPath: practiceTopicHref(topic.slug, examSlug) } : { robots: "noindex,follow" },
  );

  const query = useQuery({
    queryKey: ["public-practice", examSlug, topic?.slug],
    queryFn: () => apiRequest<PublicPracticeResponse>("/public/practice/" + encodeURIComponent(examSlug) + "/" + encodeURIComponent(topic!.slug) + "?limit=10"),
    enabled: Boolean(topic),
    retry: 1,
    staleTime: 5 * 60_000,
  });

  if (!topic) {
    return (
      <PublicPage eyebrow={config.name + " practice"} title="Practice topic not found" description={"Choose one of the published " + config.name + " practice topics."}>
        <Link href={examHubHref(examSlug)} className="font-semibold text-indigo-700 hover:underline">Return to {config.name} preparation</Link>
      </PublicPage>
    );
  }

  const otherTopics = config.topics.filter((item) => item.slug !== topic.slug).slice(0, 5);

  return (
    <PublicPage eyebrow={topic.subject + " · Free practice"} title={topic.name + " Questions for " + config.name} description={topic.summary + " Reveal each answer only after attempting the question, and use the explanation to review mistakes."}>
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
        <section>
          <div className="mb-5 rounded-2xl border border-indigo-100 bg-indigo-50 p-5">
            <h2 className="font-semibold text-indigo-950">How to use this page</h2>
            <p className="mt-2 text-sm leading-6 text-indigo-900/80">{topic.preparationTip} These are free sample questions from ExamTree&apos;s published practice content; use full mock tests when you are ready for timed exam simulation.</p>
          </div>

          {query.isLoading ? (
            <div className="flex min-h-56 items-center justify-center rounded-2xl border border-slate-200 bg-white text-sm text-slate-600"><Loader2 className="mr-2 h-5 w-5 animate-spin" />Loading published questions…</div>
          ) : query.error ? (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-950">This topic&apos;s public sample set is temporarily unavailable. You can still continue with mock tests or another free topic.</div>
          ) : query.data?.questions.length ? (
            <div className="space-y-5">{query.data.questions.map((question, index) => <QuestionCard key={question.id} question={question} index={index} />)}</div>
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm leading-6 text-slate-700">No public sample questions are published for this topic yet. The page will begin serving questions automatically when matching approved questions are published.</div>
          )}

          <div className="mt-6 rounded-2xl bg-[#1e1b4b] p-6 text-white">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-indigo-200">Next step</p>
            <h2 className="mt-2 text-xl font-semibold">Move from free practice to timed {config.name} mocks</h2>
            <p className="mt-2 text-sm leading-6 text-indigo-100">Use topic practice to fix concepts, then test speed and accuracy under exam-like timing.</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link href={config.categoryHref} className="rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-[#1e1b4b]">Browse {config.name} tests</Link>
              <Link href={examPreparationHref(examSlug)} className="rounded-xl border border-white/25 px-4 py-2.5 text-sm font-semibold text-white">Preparation guide</Link>
            </div>
          </div>
        </section>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="font-semibold text-slate-950">More {config.name} topics</h2>
            <div className="mt-3 space-y-2">
              {otherTopics.map((item) => <Link key={item.slug} href={practiceTopicHref(item.slug, examSlug)} className="block rounded-lg bg-slate-50 px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-800">{item.name} questions</Link>)}
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm leading-6 text-slate-600">
            <h2 className="font-semibold text-slate-950">Related pages</h2>
            <Link href={examSyllabusHref(examSlug)} className="mt-3 block font-semibold text-indigo-700 hover:underline">{config.name} syllabus</Link>
            <Link href={examPreparationHref(examSlug)} className="mt-2 block font-semibold text-indigo-700 hover:underline">How to prepare for {config.name}</Link>
            <Link href={examHubHref(examSlug)} className="mt-2 block font-semibold text-indigo-700 hover:underline">{config.name} preparation hub</Link>
          </div>
        </aside>
      </div>
    </PublicPage>
  );
}
