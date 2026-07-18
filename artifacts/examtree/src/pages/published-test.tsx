import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Clock3, FileText, ListChecks } from "lucide-react";
import { useLocation, useParams } from "wouter";

import { Button } from "@/components/ui/button";
import { getPublishedTest } from "@/lib/published-tests";

export default function PublishedTest() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const testQuery = useQuery({
    queryKey: ["published-test", id],
    queryFn: () => getPublishedTest(id),
    enabled: Boolean(id),
  });

  if (testQuery.isLoading) {
    return <div className="mx-auto max-w-5xl animate-pulse space-y-5 py-6"><div className="h-36 rounded-2xl bg-muted" /><div className="h-80 rounded-2xl bg-muted" /></div>;
  }

  if (!testQuery.data) {
    return (
      <div className="mx-auto max-w-xl py-16 text-center">
        <h1 className="text-xl font-semibold">Published mock test unavailable</h1>
        <p className="mt-2 text-sm text-muted-foreground">{testQuery.error instanceof Error ? testQuery.error.message : "Try refreshing the tests page."}</p>
        <Button className="mt-5" variant="outline" onClick={() => setLocation("/tests")}>Back to tests</Button>
      </div>
    );
  }

  const { test, sections } = testQuery.data;
  const questionCount = sections.reduce((count, section) => count + section.questions.length, 0);
  const durationMinutes = Math.max(1, Math.ceil(test.durationSeconds / 60));

  return (
    <div className="mx-auto max-w-5xl space-y-6 py-4">
      <Button variant="ghost" className="gap-2" onClick={() => setLocation("/tests")}><ArrowLeft className="h-4 w-4" />Back to tests</Button>
      <section className="rounded-2xl border bg-card p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Live mock test · {test.examFamilyName}</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">{test.title}</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">{test.description || `${test.examName} published mock test.`}</p>
        <div className="mt-5 flex flex-wrap gap-3 text-sm">
          <span className="inline-flex items-center gap-2 rounded-lg border px-3 py-2"><Clock3 className="h-4 w-4 text-primary" />{durationMinutes} minutes</span>
          <span className="inline-flex items-center gap-2 rounded-lg border px-3 py-2"><ListChecks className="h-4 w-4 text-primary" />{questionCount} questions</span>
          <span className="inline-flex items-center gap-2 rounded-lg border px-3 py-2"><FileText className="h-4 w-4 text-primary" />{test.totalMarks} marks</span>
        </div>
      </section>

      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        This live mock is available for review. Timed attempts and scoring will be enabled when the new assessment submission service is available.
      </div>

      {sections.map((section) => (
        <section key={section.id} className="rounded-2xl border bg-card p-6 shadow-sm">
          <h2 className="text-xl font-semibold">{section.name}</h2>
          <div className="mt-5 space-y-5">
            {section.questions.map((question, index) => (
              <article key={question.questionVersionId} className="rounded-xl border bg-background p-5">
                <p className="text-sm font-medium leading-6">{index + 1}. {question.stem}</p>
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  {question.options.map((option) => <div key={option.id} className="rounded-lg border px-3 py-2 text-sm"><span className="mr-2 font-semibold text-primary">{option.key}.</span>{option.text}</div>)}
                </div>
              </article>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
