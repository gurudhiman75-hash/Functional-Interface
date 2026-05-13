import { Send } from "lucide-react";
import { PublicPage, usePageMeta } from "@/components/PublicPage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function ReportQuestion() {
  usePageMeta("Report Question", "Report wrong answers, ambiguity, typos, translation issues, or rendering problems on ExamTree.");

  return (
    <PublicPage
      eyebrow="Question QA"
      title="Report a question issue."
      description="Help us improve generated, ingested, PYQ, and multilingual content through structured student feedback."
    >
      <form className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 lg:grid-cols-2">
        <div>
          <Label>Question ID or test name</Label>
          <Input className="mt-1 rounded-md bg-white" placeholder="Example: SSC_CGL_Q102 or Mock Test 4" />
        </div>
        <div>
          <Label>Issue type</Label>
          <select className="mt-1 h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm">
            <option>Wrong answer</option>
            <option>Ambiguity</option>
            <option>Typo</option>
            <option>Translation issue</option>
            <option>Rendering issue</option>
          </select>
        </div>
        <div className="lg:col-span-2">
          <Label>Details</Label>
          <Textarea className="mt-1 min-h-32 rounded-md bg-white" placeholder="Describe what looks incorrect and attach context if available." />
        </div>
        <div className="lg:col-span-2">
          <Button type="button" className="rounded-md bg-[#1e1b4b] text-white hover:bg-indigo-950">
            <Send className="mr-2 h-4 w-4" />
            Submit report
          </Button>
        </div>
      </form>
    </PublicPage>
  );
}

