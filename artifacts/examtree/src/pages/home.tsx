import { useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Building2,
  Cog,
  FileText,
  Landmark,
  Menu,
  ShieldCheck,
  Stamp,
  Timer,
  TrainFront,
  Trophy,
  Umbrella,
  Users,
  X,
} from "lucide-react";
import { Link } from "wouter";

import "@/styles/home-reproduction.css";

const EXAM_CATEGORIES = [
  { name: "Banking", exams: "IBPS PO · SBI PO · RBI Grade B", tests: 6420, icon: "bank" },
  { name: "SSC", exams: "CGL · CHSL · MTS · GD", tests: 7830, icon: "stamp" },
  { name: "Railways", exams: "RRB NTPC · Group D · ALP", tests: 5110, icon: "train" },
  { name: "Punjab Govt.", exams: "PSSSB · PSPCL · Punjab Police", tests: 2980, icon: "landmark" },
  { name: "Defence", exams: "AFCAT · CDS · NDA · CAPF", tests: 2340, icon: "shield" },
  { name: "Teaching", exams: "CTET · State TET · KVS", tests: 3650, icon: "book" },
  { name: "Engineering", exams: "GATE · SSC JE · ESE", tests: 4120, icon: "gear" },
  { name: "Insurance", exams: "LIC AAO · NIACL · UIIC", tests: 1490, icon: "umbrella" },
];

const MOCK_TESTS = [
  { title: "IBPS PO Prelims 2026 — Full Mock #12", exam: "Banking", tag: "LIVE", questions: 100, marks: 100, minutes: 60, attempts: "2,14,318", free: true },
  { title: "SSC CGL Tier-I — All India Rank Test #47", exam: "SSC", tag: "LIVE", questions: 100, marks: 200, minutes: 60, attempts: "3,48,902", free: true },
  { title: "Punjab Govt. — General Ability Full Mock #08", exam: "Punjab", tag: "NEW", questions: 100, marks: 100, minutes: 90, attempts: "96,455", free: true },
  { title: "RRB NTPC CBT-1 — Memory Based Shift Test", exam: "Railways", tag: "PRO", questions: 100, marks: 100, minutes: 90, attempts: "58,120", free: false },
  { title: "GATE CS 2027 — Subject Test: Operating Systems", exam: "Engineering", tag: "NEW", questions: 35, marks: 50, minutes: 60, attempts: "41,208", free: true },
  { title: "CTET Paper-I — Pedagogy Master Mock", exam: "Teaching", tag: "PRO", questions: 150, marks: 150, minutes: 150, attempts: "77,864", free: false },
];

const TOPPERS = [
  { rank: 1, name: "Ananya Verma", exam: "IBPS PO 2025", score: "92.50", city: "Lucknow" },
  { rank: 2, name: "Rohit Saini", exam: "SSC CGL 2025", score: "189.25", city: "Jaipur" },
  { rank: 3, name: "Meera Krishnan", exam: "Punjab Govt. 2025", score: "174.50", city: "Patiala" },
  { rank: 4, name: "Arjun Mehta", exam: "GATE CS 2026", score: "78.33", city: "Indore" },
];

const TESTIMONIALS = [
  { quote: "The live rank after every mock told me exactly where I stood. I stopped guessing and started fixing.", name: "Priya Deshmukh", detail: "SBI PO 2025 · AIR 14" },
  { quote: "ExamTree’s error log showed where my negative marks came from. I cut those mistakes and cleared CGL in one attempt.", name: "Vikash Yadav", detail: "SSC CGL 2025 · Inspector (CBIC)" },
  { quote: "Solutions don’t just give the answer — they show the faster approach. My quant speed improved dramatically.", name: "Farhan Ali", detail: "RRB NTPC 2025 · Sr. Clerk" },
  { quote: "The test interface felt so close to the real CBT that exam day felt familiar instead of stressful.", name: "Sneha Kulkarni", detail: "GATE CS 2026 · AIR 61" },
  { quote: "Topic-wise weakness reports after every test became my study plan. I always knew what to do next.", name: "Deepak Choudhary", detail: "IBPS Clerk 2025 · Canara Bank" },
  { quote: "The All-India live tests built the pressure temperament no book ever could.", name: "Aishwarya Nair", detail: "Government Exam Aspirant" },
];

function Reveal({
  children,
  delay = 0,
  className = "",
  style,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      });
    }, { threshold: 0.12 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return <div ref={ref} className={`reveal ${inView ? "is-in" : ""} ${className}`} style={{ transitionDelay: `${delay}ms`, ...style }}>{children}</div>;
}

const NAV_LINKS = [
  { label: "Mock Tests", href: "/mock-tests" },
  { label: "Exams", href: "/exams" },
  { label: "Free Tests", href: "/mock-tests" },
  { label: "Previous Papers", href: "/pyqs" },
  { label: "Resources", href: "/resources" },
];

function HomeNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`home-repro-nav fixed inset-x-0 top-0 z-50 transition-all duration-300 ${scrolled ? "is-scrolled" : ""}`}>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2" aria-label="ExamTree home">
          <svg width="30" height="30" viewBox="0 0 32 32" fill="none" aria-hidden="true">
            <path d="M16 4L26 16H20L27 25H5L12 16H6L16 4Z" fill="#1570EF" />
            <rect x="14.2" y="25" width="3.6" height="4" rx="1" fill="#262722" />
          </svg>
          <span className="font-display text-[26px] font-extrabold uppercase tracking-tight text-ink">Exam<span className="text-brand">Tree</span></span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Homepage navigation">
          {NAV_LINKS.map((item) => <Link key={item.label} href={item.href} className="home-nav-link font-mono2 text-[13px] font-medium uppercase tracking-wider text-ink/70 transition-colors">{item.label}</Link>)}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link href="/login/student" className="font-mono2 text-[13px] font-semibold uppercase tracking-wider text-ink transition-colors hover:text-brand">Log in</Link>
          <Link href="/login/student?mode=signup" className="btn-lift rounded-lg bg-ink px-5 py-2.5 font-mono2 text-[13px] font-semibold uppercase tracking-wider text-white" style={{ ["--lift-shadow" as string]: "#1570EF" }}>Sign up free</Link>
        </div>

        <button type="button" className="lg:hidden" onClick={() => setOpen((value) => !value)} aria-label="Open navigation menu">
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-[#dbe7f5] bg-paper px-6 py-4 lg:hidden">
          {NAV_LINKS.map((item) => <Link key={item.label} href={item.href} onClick={() => setOpen(false)} className="block py-2.5 font-mono2 text-sm uppercase tracking-wider text-ink/80">{item.label}</Link>)}
          <Link href="/login/student?mode=signup" className="btn-lift mt-3 inline-block rounded-lg bg-ink px-5 py-2.5 font-mono2 text-[13px] font-semibold uppercase tracking-wider text-white" style={{ ["--lift-shadow" as string]: "#1570EF" }}>Sign up free</Link>
        </div>
      ) : null}
    </header>
  );
}

const QUESTION = {
  index: 12,
  text: "A train 240 m long crosses a pole in 12 seconds and a platform in 26 seconds. What is the length of the platform?",
  options: ["280 m", "320 m", "340 m", "360 m"],
};

type Status = "unseen" | "seen" | "answered" | "marked";

function TestWidget() {
  const [seconds, setSeconds] = useState(41 * 60 + 52);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState<number[]>([1, 2, 3, 4, 5, 7, 8, 9, 11]);
  const [rank, setRank] = useState(1284);
  const [popKey, setPopKey] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => setSeconds((value) => (value > 0 ? value - 1 : 0)), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setRank((value) => Math.max(1120, value + Math.round((Math.random() - 0.55) * 18)));
      setPopKey((value) => value + 1);
    }, 3200);
    return () => window.clearInterval(timer);
  }, []);

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  const palette: Status[] = useMemo(() => Array.from({ length: 25 }, (_, index) => {
    const number = index + 1;
    if (answered.includes(number)) return "answered";
    if (number === 6 || number === 10) return "marked";
    if (number <= QUESTION.index) return "seen";
    return "unseen";
  }), [answered]);

  const choose = (index: number) => {
    setSelected(index);
    if (!answered.includes(QUESTION.index)) setAnswered((value) => [...value, QUESTION.index]);
  };

  const attempted = palette.filter((status) => status === "answered").length;
  const completion = Math.round((attempted / 25) * 100);

  return (
    <div className="home-test-widget overflow-hidden rounded-xl border border-[#c9dcef] bg-white shadow-[0_24px_60px_-24px_rgba(21,112,239,0.35)]">
      <div className="flex items-center justify-between border-b border-[#e3edf8] bg-[#f0f7ff] px-4 py-2.5">
        <div className="flex items-center gap-2"><span className="live-dot inline-block h-2 w-2 rounded-full bg-punch" /><span className="font-mono2 text-[11px] font-semibold uppercase tracking-widest text-ink/70">Live · SSC CGL Tier-I · Mock #47</span></div>
        <div className="flex items-center gap-1.5"><span className="font-mono2 text-[11px] uppercase tracking-wider text-ink/50">Time left</span><span className="rounded bg-ink px-2 py-0.5 font-mono2 text-[12px] font-semibold text-white tabular-nums">{mm}:{ss}</span></div>
      </div>

      <div className="grid sm:grid-cols-[1fr_150px]">
        <div className="border-b border-[#e3edf8] p-4 sm:border-b-0 sm:border-r">
          <div className="flex items-center justify-between"><span className="font-mono2 text-[11px] font-semibold uppercase tracking-widest text-brand">Question {QUESTION.index} / 100</span><span className="font-mono2 text-[11px] text-ink/50">+1.0 / −0.25</span></div>
          <p className="mt-3 text-[14.5px] font-medium leading-relaxed text-ink">{QUESTION.text}</p>
          <div className="mt-4 space-y-2">
            {QUESTION.options.map((option, index) => {
              const active = selected === index;
              return <button type="button" key={option} onClick={() => choose(index)} className={`home-answer-option flex w-full items-center gap-3 rounded-lg border px-3.5 py-2.5 text-left text-[13.5px] transition-all ${active ? "border-brand bg-[#eaf3ff] font-semibold text-ink" : "border-[#dbe7f5] bg-white text-ink/80"}`}><span className={`flex h-5 w-5 items-center justify-center rounded-full border font-mono2 text-[11px] ${active ? "border-brand bg-brand text-white" : "border-[#b9cfe6] text-ink/50"}`}>{String.fromCharCode(65 + index)}</span>{option}</button>;
            })}
          </div>
          <div className="mt-4 flex items-center gap-2">
            <button type="button" className="btn-lift rounded-md bg-brand px-4 py-1.5 font-mono2 text-[11px] font-semibold uppercase tracking-wider text-white" style={{ ["--lift-shadow" as string]: "#0b3f8f" }}>Save &amp; Next</button>
            <button type="button" className="rounded-md border border-[#c9dcef] px-4 py-1.5 font-mono2 text-[11px] font-semibold uppercase tracking-wider text-ink/60 transition-colors hover:border-brand hover:text-brand">Mark for review</button>
          </div>
        </div>

        <div className="bg-[#fafdff] p-4">
          <span className="font-mono2 text-[10px] font-semibold uppercase tracking-widest text-ink/50">Palette</span>
          <div className="mt-2 grid grid-cols-5 gap-1.5">
            {palette.map((status, index) => <span key={index} className={`flex h-6 items-center justify-center rounded font-mono2 text-[10px] font-medium ${index + 1 === QUESTION.index ? "bg-ink text-white ring-2 ring-brand ring-offset-1" : status === "answered" ? "bg-brand text-white" : status === "marked" ? "bg-punch text-white" : status === "seen" ? "bg-[#ffe1f0] text-punch" : "bg-[#e9f1fa] text-ink/40"}`}>{index + 1}</span>)}
          </div>
          <div className="mt-4 border-t border-[#e3edf8] pt-3">
            <span className="font-mono2 text-[10px] font-semibold uppercase tracking-widest text-ink/50">Your live rank</span>
            <div key={popKey} className="tick-pop mt-0.5 font-display text-[34px] font-extrabold leading-none text-ink tabular-nums">#{rank.toLocaleString("en-IN")}</div>
            <div className="font-mono2 text-[10px] text-ink/50">of 48,392 attempting now</div>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#e3edf8]"><div className="h-full rounded-full bg-brand transition-all duration-700" style={{ width: `${completion}%` }} /></div>
            <div className="mt-1 font-mono2 text-[10px] text-ink/50">{completion}% of section attempted</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ScribbleUnderline() {
  return <svg className="absolute -bottom-2 left-0 w-full" height="14" viewBox="0 0 220 14" preserveAspectRatio="none" aria-hidden="true"><path d="M3 9 C 40 3, 80 12, 120 7 S 190 4, 217 8" fill="none" stroke="#DD2590" strokeWidth="5" strokeLinecap="round" /></svg>;
}

function CurvedArrow() {
  return <svg className="hidden h-16 w-16 rotate-[160deg] text-brand md:block" viewBox="0 0 64 64" fill="none" aria-hidden="true"><path d="M58 8C40 18 20 26 12 48" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeDasharray="1 7" /><path d="M8 40l2 10 9-5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" /></svg>;
}

function Hero() {
  return (
    <section className="checkerboard relative overflow-hidden bg-paper pb-16 pt-28 md:pb-24 md:pt-36">
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-[1.05fr_1fr]">
        <div>
          <Reveal><span className="inline-block rounded-full border border-[#b9d4f5] bg-white px-3.5 py-1.5 font-mono2 text-[11px] font-semibold uppercase tracking-widest text-brand">India · 120+ govt &amp; competitive exams</span></Reveal>
          <Reveal delay={90}><h1 className="mt-6 font-display text-[clamp(3rem,7vw,5.6rem)] font-extrabold uppercase leading-[0.92] tracking-tight text-ink">Stop <span className="strikethrough-pink text-ink/30">guessing</span>.<br />Start <span className="relative inline-block text-brand">ranking<ScribbleUnderline /></span>.</h1></Reveal>
          <Reveal delay={180}><p className="mt-7 max-w-md text-[16px] leading-relaxed text-ink/70">Full-length mock tests that mirror the real CBT — with live All-India ranks, error logs, and fast explanations. Know where you stand before the exam does.</p></Reveal>
          <Reveal delay={260}>
            <div className="mt-9 flex flex-wrap items-center gap-5">
              <div className="flex items-center gap-4"><Link href="/mock-tests" className="btn-lift rounded-lg bg-ink px-7 py-3.5 font-mono2 text-sm font-semibold uppercase tracking-wider text-white" style={{ ["--lift-shadow" as string]: "#1570EF" }}>Take a free mock</Link><CurvedArrow /></div>
              <Link href="/exams" className="rounded-lg border-2 border-ink px-7 py-3 font-mono2 text-sm font-semibold uppercase tracking-wider text-ink transition-colors hover:bg-ink hover:text-white">Browse exams</Link>
            </div>
          </Reveal>
          <Reveal delay={330}>
            <div className="mt-9 flex items-center gap-4">
              <div className="flex -space-x-2.5">{["AV", "RS", "MK", "AM", "PD"].map((initials, index) => <span key={initials} className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-paper font-mono2 text-[10px] font-semibold text-white" style={{ background: ["#1570EF", "#262722", "#DD2590", "#0b3f8f", "#1570EF"][index] }}>{initials}</span>)}</div>
              <p className="font-mono2 text-[12px] leading-snug text-ink/60">Thousands of aspirants practise<br />with ExamTree every day</p>
            </div>
          </Reveal>
        </div>

        <Reveal delay={200}><TestWidget /><p className="mt-3 text-center font-mono2 text-[11px] uppercase tracking-widest text-ink/40">↑ Interactive preview of the ExamTree test experience.</p></Reveal>
      </div>
    </section>
  );
}

function Stats() {
  const stats = [
    { n: "10K+", label: "Practice questions" },
    { n: "100+", label: "Mock tests" },
    { n: "20+", label: "Exam categories" },
    { n: "3", label: "Learning languages" },
  ];
  return <section className="border-y border-[#dbe7f5] bg-white"><div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-[#e3edf8] px-4 sm:px-6 lg:grid-cols-4">{stats.map((stat, index) => <Reveal key={stat.label} delay={index * 80} className="px-4 py-10 text-center md:px-8 md:py-14"><div className="font-display text-[clamp(2.4rem,5vw,4rem)] font-extrabold leading-none tracking-tight text-ink tabular-nums">{stat.n.replace(/(K\+|\+)/, "")}<span className="text-punch">{stat.n.match(/(K\+|\+)/)?.[0] ?? ""}</span></div><div className="mt-3 font-mono2 text-[11px] font-medium uppercase tracking-[0.18em] text-ink/50">{stat.label}</div></Reveal>)}</div></section>;
}

const ICONS: Record<string, typeof Landmark> = { bank: Building2, stamp: Stamp, train: TrainFront, landmark: Landmark, shield: ShieldCheck, book: BookOpen, gear: Cog, umbrella: Umbrella };

function Categories() {
  return (
    <section id="categories" className="bg-paper py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal><div className="flex flex-wrap items-end justify-between gap-6"><div><span className="font-mono2 text-[11px] font-semibold uppercase tracking-[0.2em] text-brand">01 — Pick your battlefield</span><h2 className="mt-3 font-display text-[clamp(2.2rem,4.5vw,3.6rem)] font-extrabold uppercase leading-[0.95] tracking-tight text-ink">Every exam.<br />One test engine.</h2></div><Link href="/exams" className="group flex items-center gap-2 font-mono2 text-[13px] font-semibold uppercase tracking-wider text-ink transition-colors hover:text-brand">All exams <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" /></Link></div></Reveal>
        <div className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-[#dbe7f5] bg-[#dbe7f5] sm:grid-cols-2 lg:grid-cols-4">
          {EXAM_CATEGORIES.map((category, index) => {
            const Icon = ICONS[category.icon];
            return <Reveal key={category.name} delay={(index % 4) * 70}><Link href="/exams" className="home-exam-hover group flex h-full flex-col justify-between bg-white p-6 transition-colors duration-300"><div className="flex items-start justify-between"><Icon size={26} strokeWidth={1.8} className="text-ink transition-colors group-hover:text-white" /><span className="font-mono2 text-[11px] text-ink/40 transition-colors group-hover:text-white/50">{category.tests.toLocaleString("en-IN")} tests</span></div><div className="mt-10"><h3 className="font-display text-2xl font-bold uppercase tracking-tight text-ink transition-colors group-hover:text-white">{category.name}</h3><p className="mt-1 font-mono2 text-[11px] text-ink/50 transition-colors group-hover:text-white/60">{category.exams}</p></div></Link></Reveal>;
          })}
        </div>
      </div>
    </section>
  );
}

const TAG_STYLE: Record<string, string> = { LIVE: "bg-punch text-white", NEW: "bg-brand text-white", PRO: "bg-ink text-white" };

function MockTests() {
  return (
    <section id="tests" className="border-y border-[#dbe7f5] bg-white py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal><span className="font-mono2 text-[11px] font-semibold uppercase tracking-[0.2em] text-brand">02 — Trending this week</span><h2 className="mt-3 max-w-xl font-display text-[clamp(2.2rem,4.5vw,3.6rem)] font-extrabold uppercase leading-[0.95] tracking-tight text-ink">Tests aspirants are attempting now</h2></Reveal>
        <div className="mt-12 overflow-hidden rounded-xl border border-[#dbe7f5]">
          {MOCK_TESTS.map((test, index) => <Reveal key={test.title} delay={index * 40}><div className="home-test-row group grid items-center gap-4 border-b border-[#e3edf8] bg-white px-5 py-5 transition-colors last:border-b-0 md:grid-cols-[auto_1fr_auto_auto] md:px-7"><div className="flex items-center gap-2 md:w-40 md:flex-col md:items-start md:gap-1.5"><span className={`rounded px-2 py-0.5 font-mono2 text-[10px] font-semibold uppercase tracking-wider ${TAG_STYLE[test.tag]}`}>{test.tag}</span><span className="font-mono2 text-[11px] uppercase tracking-wider text-ink/50">{test.exam}</span></div><h3 className="font-display text-[19px] font-bold leading-snug tracking-tight text-ink">{test.title}</h3><div className="flex flex-wrap items-center gap-x-5 gap-y-1 font-mono2 text-[11.5px] text-ink/55 md:w-64"><span className="flex items-center gap-1.5"><FileText size={13} /> {test.questions} Qs · {test.marks} marks</span><span className="flex items-center gap-1.5"><Timer size={13} /> {test.minutes} min</span><span className="flex items-center gap-1.5"><Users size={13} /> {test.attempts} attempted</span></div><Link href="/mock-tests" className={`btn-lift flex items-center gap-1.5 justify-self-start rounded-lg px-5 py-2.5 font-mono2 text-[12px] font-semibold uppercase tracking-wider text-white md:justify-self-end ${test.free ? "bg-brand" : "bg-ink"}`} style={{ ["--lift-shadow" as string]: test.free ? "#0b3f8f" : "#1570EF" }}>{test.free ? "Start free" : "Unlock"} <ArrowUpRight size={14} /></Link></div></Reveal>)}
        </div>
        <Reveal delay={200}><p className="mt-6 text-center font-mono2 text-[12px] uppercase tracking-widest text-ink/45">More tests are added as new exam series go live</p></Reveal>
      </div>
    </section>
  );
}

const FEATURES = [
  { n: "01", title: "Real CBT interface", body: "Same palette, same timer pressure, same navigation pattern as the actual computer-based test." },
  { n: "02", title: "Live performance context", body: "See how your performance compares and turn every mock into a measurable checkpoint." },
  { n: "03", title: "Error log, not just a score", body: "Use each wrong answer to find concept gaps, careless mistakes and time-pressure patterns." },
  { n: "04", title: "Clear explanations", body: "Learn the efficient approach first, then understand the complete method behind the answer." },
];

function Features() {
  return <section className="bg-paper py-20 md:py-28"><div className="mx-auto max-w-7xl px-4 sm:px-6"><div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr]"><Reveal><div className="lg:sticky lg:top-28"><span className="font-mono2 text-[11px] font-semibold uppercase tracking-[0.2em] text-brand">03 — Why ExamTree</span><h2 className="mt-3 font-display text-[clamp(2.2rem,4.5vw,3.6rem)] font-extrabold uppercase leading-[0.95] tracking-tight text-ink">Practice that<br />behaves like<br />the <span className="text-punch">real thing</span></h2><p className="mt-6 max-w-sm text-[15px] leading-relaxed text-ink/65">A mock test that doesn’t change your next study session is just a quiz. Every ExamTree attempt should tell you what to improve next.</p></div></Reveal><div>{FEATURES.map((feature, index) => <Reveal key={feature.n} delay={index * 60}><div className="home-feature-row grid grid-cols-[64px_1fr] gap-5 border-t border-[#d7e5f4] py-8 last:border-b md:grid-cols-[96px_1fr]"><span className="font-display text-4xl font-extrabold tracking-tight text-[#b9d4f5] md:text-5xl">{feature.n}</span><div><h3 className="font-display text-[26px] font-bold uppercase leading-tight tracking-tight text-ink">{feature.title}</h3><p className="mt-2.5 max-w-md text-[15px] leading-relaxed text-ink/65">{feature.body}</p></div></div></Reveal>)}</div></div></div></section>;
}

function Toppers() {
  return (
    <section className="bg-ink py-20 text-white md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal><span className="font-mono2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#7db5f8]">04 — Wall of ranks</span><h2 className="mt-3 font-display text-[clamp(2.2rem,4.5vw,3.6rem)] font-extrabold uppercase leading-[0.95] tracking-tight">They practised here first</h2></Reveal>
        <Reveal delay={120}>
          <div className="mt-12 overflow-hidden rounded-xl border border-white/15">
            <div className="grid grid-cols-[56px_1fr_auto] items-center gap-4 border-b border-white/15 bg-white/5 px-5 py-3 font-mono2 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/50 md:grid-cols-[56px_1fr_1fr_auto_auto] md:px-7"><span>Rank</span><span>Topper</span><span className="hidden md:block">Exam</span><span className="hidden md:block">Score</span><span className="text-right">City</span></div>
            {TOPPERS.map((topper, index) => <div key={topper.rank} className="home-topper-row grid grid-cols-[56px_1fr_auto] items-center gap-4 border-b border-white/10 px-5 py-4 last:border-b-0 transition-colors md:grid-cols-[56px_1fr_1fr_auto_auto] md:px-7"><span className="flex items-center gap-1.5 font-display text-2xl font-extrabold text-white">{index === 0 ? <Trophy size={18} className="text-punch" /> : null}{topper.rank}</span><span className="font-display text-lg font-bold tracking-tight">{topper.name}</span><span className="hidden font-mono2 text-[12px] text-white/60 md:block">{topper.exam}</span><span className="hidden font-mono2 text-[13px] font-semibold text-[#7db5f8] tabular-nums md:block">{topper.score}</span><span className="text-right font-mono2 text-[12px] text-white/60">{topper.city}</span></div>)}
          </div>
        </Reveal>
        <div className="mt-14 gap-6 [column-width:300px] [column-gap:24px]">{TESTIMONIALS.map((item, index) => <Reveal key={item.name} delay={(index % 3) * 80} className="mb-6 break-inside-avoid"><figure className="home-testimonial-card rounded-xl bg-white p-6 text-ink"><span className="font-display text-5xl font-extrabold leading-none text-brand">“</span><blockquote className="mt-1 text-[15px] leading-relaxed text-ink/85">{item.quote}</blockquote><figcaption className="mt-5 border-t border-[#e3edf8] pt-4"><div className="font-display text-[17px] font-bold tracking-tight">{item.name}</div><div className="font-mono2 text-[11px] uppercase tracking-wider text-punch">{item.detail}</div></figcaption></figure></Reveal>)}</div>
      </div>
    </section>
  );
}

function CTA() {
  return <section id="cta" className="checkerboard bg-paper py-20 md:py-28"><div className="mx-auto max-w-4xl px-4 text-center sm:px-6"><Reveal><span className="inline-block rounded-full border border-[#b9d4f5] bg-white px-3.5 py-1.5 font-mono2 text-[11px] font-semibold uppercase tracking-widest text-brand">Free to start · No card needed</span></Reveal><Reveal delay={100}><h2 className="mt-6 font-display text-[clamp(2.6rem,6vw,4.8rem)] font-extrabold uppercase leading-[0.92] tracking-tight text-ink">Your next mock is<br /><span className="text-brand">your best rank yet</span></h2></Reveal><Reveal delay={200}><p className="mx-auto mt-6 max-w-md text-[15.5px] leading-relaxed text-ink/65">Attempt a free full-length test today. The result you see will tell you exactly what to work on tomorrow.</p></Reveal><Reveal delay={280}><div className="mt-9 flex flex-wrap items-center justify-center gap-4"><Link href="/mock-tests" className="btn-lift rounded-lg bg-punch px-8 py-4 font-mono2 text-sm font-semibold uppercase tracking-wider text-white" style={{ ["--lift-shadow" as string]: "#262722" }}>Start free mock test</Link><Link href="/exams" className="rounded-lg border-2 border-ink px-8 py-3.5 font-mono2 text-sm font-semibold uppercase tracking-wider text-ink transition-colors hover:bg-ink hover:text-white">See all exams</Link></div></Reveal></div></section>;
}

function Footer() {
  const columns = [
    { heading: "Exams", links: [{ label: "Banking", href: "/exams" }, { label: "SSC & Railways", href: "/exams" }, { label: "Punjab Govt.", href: "/exams" }, { label: "Defence", href: "/exams" }, { label: "Teaching", href: "/exams" }] },
    { heading: "Practice", links: [{ label: "Mock Tests", href: "/mock-tests" }, { label: "Previous Papers", href: "/pyqs" }, { label: "Resources", href: "/resources" }, { label: "Current Affairs", href: "/current-affairs" }] },
    { heading: "Company", links: [{ label: "About", href: "/about" }, { label: "FAQ", href: "/faq" }, { label: "Contact", href: "/contact" }, { label: "Privacy", href: "/privacy-policy" }] },
  ];
  return <footer className="border-t border-[#dbe7f5] bg-white"><div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 md:grid-cols-[1.2fr_repeat(3,1fr)]"><div><Link href="/" className="flex items-center gap-2"><svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-hidden="true"><path d="M16 4L26 16H20L27 25H5L12 16H6L16 4Z" fill="#1570EF" /><rect x="14.2" y="25" width="3.6" height="4" rx="1" fill="#262722" /></svg><span className="font-display text-2xl font-extrabold uppercase tracking-tight text-ink">Exam<span className="text-brand">Tree</span></span></Link><p className="mt-4 max-w-xs text-[14px] leading-relaxed text-ink/60">Grow your rank, one mock at a time. Modern practice for competitive and government exams.</p><p className="mt-6 font-mono2 text-[11px] uppercase tracking-widest text-ink/40">Practice better. Perform better.</p></div>{columns.map((column) => <div key={column.heading}><h4 className="font-mono2 text-[11px] font-semibold uppercase tracking-[0.2em] text-ink/45">{column.heading}</h4><ul className="mt-4 space-y-2.5">{column.links.map((item) => <li key={item.label}><Link href={item.href} className="text-[14px] text-ink/75 transition-colors hover:text-brand">{item.label}</Link></li>)}</ul></div>)}</div><div className="border-t border-[#e3edf8]"><div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-5 sm:px-6"><span className="font-mono2 text-[11px] uppercase tracking-widest text-ink/40">© 2026 ExamTree</span><span className="font-mono2 text-[11px] uppercase tracking-widest text-ink/40">Made for aspirants</span></div></div></footer>;
}

export default function Home() {
  return (
    <div className="home-reproduction min-h-screen bg-paper">
      <HomeNavbar />
      <main>
        <Hero />
        <Stats />
        <Categories />
        <MockTests />
        <Features />
        <Toppers />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
