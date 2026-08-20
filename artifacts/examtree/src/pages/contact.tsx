import { useMemo, useState } from "react";
import { Mail, MessageCircle, Send } from "lucide-react";
import { PublicCard, PublicPage, usePageMeta } from "@/components/PublicPage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const SUPPORT_EMAIL = "support@examtree.in";

export default function Contact() {
  usePageMeta("Contact Us", "Contact ExamTree for support, billing, content reports, or partnership questions.");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState("Mock test access");
  const [message, setMessage] = useState("");

  const mailtoHref = useMemo(() => {
    const subject = `ExamTree support: ${category}`;
    const body = [
      `Name: ${name || "Not provided"}`,
      `Reply email: ${email || "Not provided"}`,
      `Issue category: ${category}`,
      "",
      message || "Please describe the issue here.",
    ].join("\n");
    return `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }, [category, email, message, name]);

  return (
    <PublicPage
      eyebrow="Contact & support"
      title="Tell us what you need help with."
      description="Prepare a structured support email for account, payment, content, translation, or technical issues."
    >
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <form className="rounded-2xl border border-slate-200 bg-white p-5" onSubmit={(event) => event.preventDefault()}>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="support-name">Name</Label>
              <Input id="support-name" className="mt-1 rounded-md bg-white" placeholder="Your name" value={name} onChange={(event) => setName(event.target.value)} />
            </div>
            <div>
              <Label htmlFor="support-email">Email</Label>
              <Input id="support-email" className="mt-1 rounded-md bg-white" placeholder="you@example.com" type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
            </div>
          </div>
          <div className="mt-4">
            <Label htmlFor="support-category">Issue category</Label>
            <select id="support-category" className="mt-1 h-11 w-full rounded-md border border-slate-200 bg-white px-3 text-sm" value={category} onChange={(event) => setCategory(event.target.value)}>
              <option>Mock test access</option>
              <option>Payment or refund</option>
              <option>Wrong answer or ambiguity</option>
              <option>Punjabi / Hindi translation issue</option>
              <option>Technical support</option>
            </select>
          </div>
          <div className="mt-4">
            <Label htmlFor="support-message">Message</Label>
            <Textarea id="support-message" className="mt-1 min-h-32 rounded-md bg-white" placeholder="Share test name, question ID, or issue details." value={message} onChange={(event) => setMessage(event.target.value)} />
          </div>
          <p id="support-email-note" className="mt-4 text-sm leading-6 text-slate-600">
            This opens your email app with these details filled in. Nothing is uploaded to ExamTree until you review and send the email.
          </p>
          <Button asChild className="mt-4 rounded-md bg-[#1e1b4b] text-white hover:bg-indigo-950">
            <a href={mailtoHref} data-testid="contact-email-handoff" aria-describedby="support-email-note">
              <Send className="mr-2 h-4 w-4" />
              Open email request
            </a>
          </Button>
        </form>
        <div className="space-y-4">
          <PublicCard title="Support email">
            <div className="flex items-center gap-2 font-semibold text-slate-950">
              <Mail className="h-4 w-4 text-teal-600" />
              <a className="underline-offset-4 hover:underline" href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>
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
