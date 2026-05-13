import { Mail, MessageCircle, Send } from "lucide-react";
import { PublicCard, PublicPage, usePageMeta } from "@/components/PublicPage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function Contact() {
  usePageMeta("Contact Us", "Contact ExamTree for support, billing, content reports, or partnership questions.");

  return (
    <PublicPage
      eyebrow="Contact & support"
      title="Tell us what you need help with."
      description="Use this lightweight support form for account, payment, content, translation, or technical issues."
    >
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <form className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label>Name</Label>
              <Input className="mt-1 rounded-md bg-white" placeholder="Your name" />
            </div>
            <div>
              <Label>Email</Label>
              <Input className="mt-1 rounded-md bg-white" placeholder="you@example.com" type="email" />
            </div>
          </div>
          <div className="mt-4">
            <Label>Issue category</Label>
            <select className="mt-1 h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm">
              <option>Mock test access</option>
              <option>Payment or refund</option>
              <option>Wrong answer or ambiguity</option>
              <option>Punjabi / Hindi translation issue</option>
              <option>Technical support</option>
            </select>
          </div>
          <div className="mt-4">
            <Label>Message</Label>
            <Textarea className="mt-1 min-h-32 rounded-md bg-white" placeholder="Share test name, question ID, or issue details." />
          </div>
          <Button type="button" className="mt-5 rounded-md bg-[#1e1b4b] text-white hover:bg-indigo-950">
            <Send className="mr-2 h-4 w-4" />
            Send request
          </Button>
        </form>
        <div className="space-y-4">
          <PublicCard title="Support email">
            <div className="flex items-center gap-2 font-semibold text-slate-950">
              <Mail className="h-4 w-4 text-teal-600" />
              support@examtree.in
            </div>
            <p className="mt-2">Typical response time: 24-48 working hours. Include screenshots for rendering or payment issues.</p>
          </PublicCard>
          <PublicCard title="Future channels">
            <div className="flex items-center gap-2 font-semibold text-slate-950">
              <MessageCircle className="h-4 w-4 text-indigo-700" />
              WhatsApp, Telegram, and Discord support are planned.
            </div>
          </PublicCard>
        </div>
      </div>
    </PublicPage>
  );
}

