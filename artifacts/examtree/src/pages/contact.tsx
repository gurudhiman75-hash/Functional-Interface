import { useMemo, useState } from "react";
import { Mail, Send, ShieldCheck } from "lucide-react";
import { PublicCard, PublicPage, usePageMeta } from "@/components/PublicPage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { API_BASE_URL } from "@/lib/api";

const SUPPORT_EMAIL = "support@examtree.in";

export default function Contact() {
  usePageMeta("Contact Us", "Contact ExamTree for support, billing, content reports, or partnership questions.");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState("Mock test access");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState("");
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{type:"success"|"error";message:string}|null>(null);
  const [fallback, setFallback] = useState(false);

  const submitTicket = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (sending) return;
    if (name.trim().length < 2) {
      setResult({ type: "error", message: "Please enter your name (at least 2 characters)." });
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setResult({ type: "error", message: "Please enter a valid email address." });
      return;
    }
    if (message.trim().length < 12) {
      setResult({ type: "error", message: "Please describe your issue in at least 12 characters." });
      return;
    }
    setSending(true); setResult(null); setFallback(false);
    try {
      const response = await fetch(`${API_BASE_URL}/support/tickets`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, category, message, website }),
      });
      const body = await response.json().catch(() => ({})) as {id?:string;error?:string};
      if (!response.ok || !body.id) throw new Error(body.error || "Unable to submit your request.");
      setResult({type:"success", message:`Your request was received. Ticket ID: ${body.id}`});
      setMessage("");
    } catch (error) {
      setFallback(true);
      setResult({type:"error",message:error instanceof Error?error.message:"Support request unavailable. Please email us."});
    } finally { setSending(false); }
  };

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
      description="Submit a support request, or contact our team directly by email."
    >
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <form className="rounded-2xl border border-slate-200 bg-white p-5" onSubmit={submitTicket}>
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
          <div aria-hidden="true" className="absolute -left-[10000px]"><Label htmlFor="support-website">Website</Label><Input id="support-website" tabIndex={-1} autoComplete="off" value={website} onChange={(event)=>setWebsite(event.target.value)}/></div>
          <p id="support-email-note" className="mt-4 text-sm leading-6 text-slate-600">Your request is stored securely for our support team. Never include passwords, OTPs or payment PINs.</p>
          <p className="mt-2 text-sm text-slate-600">Enter your name, a valid email, and at least 12 characters describing your issue.</p>
          <Button type="submit" disabled={sending} className="mt-4 rounded-md bg-[#1e1b4b] text-white hover:bg-indigo-950"><Send className="mr-2 h-4 w-4" />{sending ? "Submitting…" : "Submit support request"}</Button>
          {result && <p role={result.type==="error"?"alert":"status"} className={`mt-3 text-sm ${result.type==="success"?"text-green-700":"text-red-700"}`}>{result.message}</p>}
          {fallback && <p className="mt-2 text-sm">If direct submission is unavailable, <a className="font-semibold underline" href={mailtoHref} data-testid="contact-email-handoff">open an email request</a> instead. Sending the email is required; no ticket was created.</p>}
          {!fallback && <p className="mt-2 text-sm"><a className="inline-flex min-h-11 items-center rounded-md px-3 underline" href={mailtoHref} data-testid="contact-email-handoff">Prefer email? Open your email app</a></p>}
        </form>
        <div className="space-y-4">
          <PublicCard title="Business information">
            <p><strong>Website / brand:</strong> ExamTree</p>
            <p className="mt-1"><strong>Legal business name:</strong> Baljit Kaur</p>
          </PublicCard>
          <PublicCard title="Support email">
            <div className="flex items-center gap-2 font-semibold text-slate-950">
              <Mail className="h-4 w-4 text-teal-600" />
              <a className="underline-offset-4 hover:underline" href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>
            </div>
            <p className="mt-2">Include screenshots for rendering or payment issues when they help explain the problem, after redacting sensitive information.</p>
          </PublicCard>
          <PublicCard title="What to include">
            <div className="flex items-center gap-2 font-semibold text-slate-950">
              <ShieldCheck className="h-4 w-4 text-indigo-700" />
              Share only the details needed to identify the issue.
            </div>
            <p className="mt-2">For payments include the provider reference, date, and amount. Never send passwords, OTPs, UPI PINs, full card numbers, or CVV codes.</p>
          </PublicCard>
        </div>
      </div>
    </PublicPage>
  );
}
