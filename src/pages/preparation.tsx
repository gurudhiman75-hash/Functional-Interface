import { useEffect, useState } from "react";
import { useLocation, useSearch } from "wouter";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { BookOpen, FileText, Landmark, UsersRound, TrainFront, ShieldCheck, Ellipsis, Check, ArrowRight } from "lucide-react";
import { getUser } from "@/lib/storage";
import { PREPARATION_CATEGORIES, getPreparationPreferences, savePreparationPreferences, preparationDestination } from "@/lib/preparation";
import "@/styles/preparation.css";

const icons = [FileText, Landmark, UsersRound, TrainFront, ShieldCheck, Ellipsis];
export default function PreparationPage() {
  const user = getUser();
  const [, navigate] = useLocation();
  const params = new URLSearchParams(useSearch());
  const editing = params.get("edit") === "1";
  const destination = editing ? "/profile" : preparationDestination(params.get("next"));
  const client = useQueryClient();
  const [selected, setSelected] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const preferences = useQuery({ queryKey: ["preparation-preferences", user?.id], queryFn: getPreparationPreferences, enabled: !!user && user.role !== "admin", retry: false });
  useEffect(() => {
    if (!user) navigate("/login/student");
    else if (user.role === "admin") navigate("/dashboard");
  }, [user?.id, user?.role, navigate]);
  useEffect(() => {
    if (!preferences.data) return;
    if (preferences.data.onboardingCompleted && !editing) navigate(destination);
    else setSelected(preferences.data.categories);
  }, [preferences.data, editing, destination, navigate]);
  async function finish(skip = false) {
    setSaving(true); setError("");
    try {
      const saved = await savePreparationPreferences(skip ? [] : selected);
      client.setQueryData(["preparation-preferences", user?.id], saved);
      navigate(destination);
    } catch { setError("We couldn't save your choices. Please try again."); }
    finally { setSaving(false); }
  }
  const ready = !!preferences.data && !preferences.isError;
  const canContinueWithoutSaving = !editing && preferences.isError;
  return <main className="preparation-screen" id="main-content">
    <section className="preparation-card" aria-labelledby="preparation-heading">
      <a className="preparation-brand" href="/">Exam<span>tree</span></a>
      <div className="preparation-book" aria-hidden="true"><BookOpen /></div>
      <h1 id="preparation-heading">What are you preparing for?</h1>
      <p className="preparation-subtitle">Choose one or more exam categories</p>
      {preferences.isLoading && <p role="status">Loading your choices…</p>}
      {preferences.isError && <div role="alert"><p>We couldn't load your choices. You can retry, or continue without saving and choose your exams from your profile later.</p><button type="button" onClick={() => void preferences.refetch()}>Try again</button></div>}
      <div className="preparation-grid" role="group" aria-label="Exam categories">
        {PREPARATION_CATEGORIES.map((category, index) => {
          const Icon = icons[index]; const active = selected.includes(category.id);
          return <button key={category.id} type="button" aria-pressed={active} disabled={!ready || saving} className={`preparation-tile ${active ? "selected" : ""}`} onClick={() => setSelected(current => active ? current.filter(id => id !== category.id) : [...current, category.id])}>
            {active && <Check className="preparation-check" aria-hidden="true" />}<Icon aria-hidden="true" /><span>{category.label}</span>
          </button>;
        })}
      </div>
      {error && <p role="alert" className="preparation-error">{error}</p>}
      <button className="preparation-continue" type="button" disabled={!ready || saving || selected.length === 0} onClick={() => finish()}>{saving ? "Saving…" : editing ? "Save choices" : "Continue"}<ArrowRight aria-hidden="true" /></button>
      <button className="preparation-skip" type="button" disabled={saving || (!ready && !canContinueWithoutSaving && !editing)} onClick={() => editing ? navigate("/profile") : canContinueWithoutSaving ? navigate(destination) : void finish(true)}>{editing ? "Cancel" : canContinueWithoutSaving ? "Continue without saving" : "Skip for now"}</button>
      <p className="preparation-note">You can update these in your profile anytime.</p>
    </section>
  </main>;
}
