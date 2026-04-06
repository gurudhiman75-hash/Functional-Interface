import { useState, useEffect, useCallback } from "react";
import { useLocation, useParams } from "wouter";
import { Flag, ChevronLeft, ChevronRight, Clock, X, CheckCircle, AlertCircle } from "lucide-react";
import { getUser, addAttempt } from "@/lib/storage";
import { sampleQuestions, allTests } from "@/lib/data";
import { Button } from "@/components/ui/button";

type AnswerState = number | null;
type FlagState = boolean;

function formatTime(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return [h, m, s].map((v) => String(v).padStart(2, "0")).join(":");
}

function getPaletteStyle(answered: boolean, flagged: boolean, current: boolean) {
  if (current) return "bg-primary text-primary-foreground ring-2 ring-primary ring-offset-1";
  if (flagged) return "bg-amber-100 text-amber-800 border border-amber-300 dark:bg-amber-900/30 dark:text-amber-400";
  if (answered) return "bg-emerald-100 text-emerald-800 border border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400";
  return "bg-muted text-muted-foreground border border-border hover:bg-accent hover:text-accent-foreground";
}

export default function Test() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const user = getUser();

  const test = allTests.find((t) => t.id === id) ?? allTests[0];
  const questions = sampleQuestions;
  const totalTime = test.duration * 60;

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<AnswerState[]>(Array(questions.length).fill(null));
  const [flags, setFlags] = useState<FlagState[]>(Array(questions.length).fill(false));
  const [timeLeft, setTimeLeft] = useState(totalTime);
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  useEffect(() => {
    if (!user) setLocation("/login");
  }, [user, setLocation]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(interval);
          handleSubmit();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = useCallback(() => {
    const correct = answers.filter((a, i) => a === questions[i].correct).length;
    const wrong = answers.filter((a, i) => a !== null && a !== questions[i].correct).length;
    const unanswered = answers.filter((a) => a === null).length;
    const score = Math.round((correct / questions.length) * 100);
    const timeSpent = Math.round((totalTime - timeLeft) / 60);

    addAttempt({
      testId: test.id,
      testName: test.name,
      category: test.category,
      score,
      correct,
      wrong,
      unanswered,
      totalQuestions: questions.length,
      timeSpent,
      date: new Date().toLocaleDateString("en-CA"),
    });

    setLocation("/result");
  }, [answers, questions, timeLeft, totalTime, test, setLocation]);

  const q = questions[current];
  const answered = answers.filter((a) => a !== null).length;
  const flagged = flags.filter(Boolean).length;
  const isLowTime = timeLeft < 300;

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-40 bg-card border-b border-border shadow-sm px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between h-14 gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
              <span className="text-xs font-bold text-primary">Q</span>
            </div>
            <h1 className="font-semibold text-foreground text-sm truncate hidden sm:block" data-testid="test-title">{test.name}</h1>
          </div>

          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-mono font-bold ${isLowTime ? "bg-red-50 text-red-600 dark:bg-red-900/20 animate-pulse" : "bg-muted text-foreground"}`} data-testid="timer">
              <Clock className={`w-3.5 h-3.5 ${isLowTime ? "text-red-600" : "text-muted-foreground"}`} />
              {formatTime(timeLeft)}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSubmitModal(true)}
              className="text-xs"
              data-testid="btn-exit"
            >
              <X className="w-3.5 h-3.5 mr-1" /> Exit
            </Button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="hidden lg:flex flex-col w-64 bg-card border-r border-border p-4 overflow-y-auto shrink-0">
          <div className="mb-4">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Questions</h3>
            <div className="grid grid-cols-5 gap-1.5">
              {questions.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`w-10 h-10 text-xs font-semibold rounded-lg transition-all ${getPaletteStyle(answers[i] !== null, flags[i], i === current)}`}
                  data-testid={`palette-q-${i + 1}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2 mt-2 border-t border-border pt-3">
            {[
              { label: "Answered", count: answered, color: "bg-emerald-500" },
              { label: "Flagged", count: flagged, color: "bg-amber-500" },
              { label: "Not Visited", count: answers.filter((a) => a === null).length - flags.filter((f, i) => f && answers[i] === null).length, color: "bg-muted" },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <div className={`w-2.5 h-2.5 rounded-sm ${item.color}`} />
                  <span className="text-muted-foreground">{item.label}</span>
                </div>
                <span className="font-semibold text-foreground">{item.count}</span>
              </div>
            ))}
          </div>

          <Button className="mt-auto w-full" onClick={() => setShowSubmitModal(true)} data-testid="btn-submit-sidebar">
            Submit Test
          </Button>
        </aside>

        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground" data-testid="question-number">
                  Question <span className="font-bold text-foreground">{current + 1}</span> of {questions.length}
                </span>
                <span className="text-xs px-2 py-0.5 bg-accent text-accent-foreground rounded-md font-medium">{q.section}</span>
              </div>
              <button
                onClick={() => {
                  const f = [...flags];
                  f[current] = !f[current];
                  setFlags(f);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${flags[current] ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30" : "bg-muted text-muted-foreground hover:bg-amber-50 hover:text-amber-700"}`}
                data-testid="btn-flag"
              >
                <Flag className="w-3.5 h-3.5" />
                {flags[current] ? "Flagged" : "Flag"}
              </button>
            </div>

            <div className="bg-card border border-border rounded-xl p-6 shadow-sm mb-4">
              <p className="text-base font-medium text-foreground leading-relaxed" data-testid="question-text">
                {q.text}
              </p>
            </div>

            <div className="space-y-2.5 mb-6">
              {q.options.map((opt, i) => {
                const selected = answers[current] === i;
                return (
                  <button
                    key={i}
                    onClick={() => {
                      const a = [...answers];
                      a[current] = i;
                      setAnswers(a);
                    }}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center gap-3 group ${
                      selected
                        ? "border-primary bg-primary/5 text-foreground"
                        : "border-border bg-card hover:border-primary/50 hover:bg-muted/40 text-foreground"
                    }`}
                    data-testid={`option-${i}`}
                  >
                    <span className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${selected ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground group-hover:border-primary/50"}`}>
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span className="text-sm leading-relaxed">{opt}</span>
                    {selected && <CheckCircle className="w-4 h-4 text-primary ml-auto shrink-0" />}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-border">
              <Button
                variant="outline"
                onClick={() => { if (current > 0) { setCurrent(current - 1); window.scrollTo(0, 0); } }}
                disabled={current === 0}
                data-testid="btn-prev"
              >
                <ChevronLeft className="w-4 h-4 mr-1" /> Previous
              </Button>

              <div className="flex gap-2 lg:hidden">
                <Button variant="outline" size="sm" onClick={() => setShowSubmitModal(true)} className="text-destructive border-destructive/30">
                  Submit
                </Button>
              </div>

              <Button
                onClick={() => {
                  if (current < questions.length - 1) { setCurrent(current + 1); window.scrollTo(0, 0); }
                  else setShowSubmitModal(true);
                }}
                data-testid="btn-next"
              >
                {current === questions.length - 1 ? "Review & Submit" : "Next"}
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </main>
      </div>

      {showSubmitModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 animate-fadeIn" data-testid="submit-modal">
          <div className="bg-card border border-border rounded-2xl p-6 max-w-sm w-full shadow-xl animate-fadeInUp">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/20 rounded-xl flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h3 className="font-bold text-foreground">Submit Test?</h3>
                <p className="text-xs text-muted-foreground">This action cannot be undone</p>
              </div>
            </div>
            <div className="bg-muted rounded-lg p-3 mb-5 grid grid-cols-3 gap-2 text-center text-xs">
              <div>
                <p className="text-emerald-600 font-bold text-base">{answered}</p>
                <p className="text-muted-foreground">Answered</p>
              </div>
              <div>
                <p className="text-red-600 font-bold text-base">{answers.filter((a) => a === null).length}</p>
                <p className="text-muted-foreground">Unanswered</p>
              </div>
              <div>
                <p className="text-amber-600 font-bold text-base">{flagged}</p>
                <p className="text-muted-foreground">Flagged</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowSubmitModal(false)} className="flex-1" data-testid="btn-cancel-submit">
                Continue Test
              </Button>
              <Button onClick={handleSubmit} className="flex-1" data-testid="btn-confirm-submit">
                Submit
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
