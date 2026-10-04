import { useMemo, useState } from "react";
import { Mail, Send } from "lucide-react";
import { PublicPage, usePageMeta } from "@/components/PublicPage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const SUPPORT_EMAIL = "support@examtree.in";

export default function ReportQuestion() {
  usePageMeta("Report Question", "Report wrong answers, ambiguity, typos, translation issues, or rendering problems on ExamTree.");
  const [questionRef, setQuestionRef] = useState("");
  const [issueType, setIssueType] = useState("Wrong answer");
  const [details, setDetails] = useState("");

  const mailtoHref = useMemo(() => {
    const subject = `ExamTree question report: ${issueType}`;
    const body = [
      `Question ID or test: ${questionRef || "Not provided"}`,
      `Issue type: ${issueType}`,
      "",
      details || "Please describe the question issue here.",
    ].join("\n");
    return `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }, [details, issueType, questionRef]);

  return (
    <PublicPage
      eyebrow="Question QA"
      title="Report a question issue."
      description="Prepare a structured email for wrong answers, ambiguity, typos, translation issues, or rendering problems."
    >
      <form className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 lg:grid-cols-2" onSubmit={(event) => event.preventDefault()}>
        <div>
          <Label htmlFor="report-question-ref">Question ID or test name</Label>
          <Input id="report-question-ref" className="mt-1 rounded-md bg-white" placeholder="Example: SSC_CGL_Q102 or Mock Test 4" value={questionRef} onChange={(event) => setQuestionRef(event.target.value)} />
        </div>
        <div>
          <Label htmlFor="report-issue-type">Issue type</Label>
          <select id="report-issue-type" className="mt-1 h-11 w-full rounded-md border border-slate-200 bg-white px-3 text-sm" value={issueType} onChange={(event) => setIssueType(event.target.value)}>
            <option>Wrong answer</option>
            <option>Ambiguity</option>
            <option>Typo</option>
            <option>Translation issue</option>
            <option>Rendering issue</option>
          </select>
        </div>
        <div className="lg:col-span-2">
          <Label htmlFor="report-details">Details</Label>
          <Textarea id="report-details" className="mt-1 min-h-32 rounded-md bg-white" placeholder="Describe what looks incorrect and include the correct answer or context if known." value={details} onChange={(event) => setDetails(event.target.value)} />
        </div>
        <div className="lg:col-span-2">
          <p id="report-email-note" className="text-sm leading-6 text-slate-600">
            This opens your email app with the report filled in. Nothing is submitted to ExamTree until you review and send the email.
          </p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button asChild className="rounded-md bg-[#1e1b4b] text-white hover:bg-indigo-950">
              <a href={mailtoHref} data-testid="report-email-handoff" aria-describedby="report-email-note">
                <Send className="mr-2 h-4 w-4" />
                Open email report
              </a>
            </Button>
            <a className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-indigo-800 underline-offset-4 hover:underline" href={`mailto:${SUPPORT_EMAIL}`}>
              <Mail className="h-4 w-4" />
              Email support directly
            </a>
          </div>
        </div>
      </form>
    </PublicPage>
  );
}
