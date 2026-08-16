import { useEffect, useMemo, useState } from 'react';

import {
  createSapReviewRun,
  getSapReviewPackage,
  getSapReviewStatus,
  previewSapReview,
  type SapReviewDifficulty,
  type SapReviewExamProfile,
  type SapReviewPackage,
  type SapReviewQuestion,
  type SapReviewStatus,
} from '@/features/question-studio/simplification-review-api';

function messageOf(error: unknown) {
  return error instanceof Error ? error.message : 'Unexpected error.';
}

export function QuestionStudioSimplificationReviewPanel() {
  const [pkg, setPkg] = useState<SapReviewPackage | null>(null);
  const [status, setStatus] = useState<SapReviewStatus | null>(null);
  const [checkpointId, setCheckpointId] = useState('');
  const [qlId, setQlId] = useState('');
  const [difficulty, setDifficulty] = useState<SapReviewDifficulty | ''>('');
  const [examProfile, setExamProfile] = useState<SapReviewExamProfile>('SSC');
  const [count, setCount] = useState(5);
  const [seed, setSeed] = useState('sap-studio-review');
  const [questions, setQuestions] = useState<SapReviewQuestion[]>([]);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    Promise.all([getSapReviewPackage(), getSapReviewStatus()])
      .then(([packageResponse, statusResponse]) => {
        if (!active) return;
        setPkg(packageResponse.package);
        setStatus(statusResponse);
      })
      .catch((value) => active && setError(messageOf(value)));
    return () => { active = false; };
  }, []);

  const qls = useMemo(() => {
    if (!pkg) return [];
    return checkpointId ? pkg.qls.filter((entry) => entry.checkpointId === checkpointId) : pkg.qls;
  }, [pkg, checkpointId]);

  const input = () => ({
    count,
    seed,
    checkpointId: checkpointId || undefined,
    qlId: qlId || undefined,
    difficulty: difficulty || undefined,
    examProfile,
  });

  async function preview() {
    setBusy(true);
    setError('');
    setNotice('');
    try {
      const response = await previewSapReview(input());
      setQuestions(response.questions);
      setNotice(`Previewed ${response.questions.length} frozen SAP question${response.questions.length === 1 ? '' : 's'}.`);
    } catch (value) {
      setError(messageOf(value));
    } finally {
      setBusy(false);
    }
  }

  async function createRun() {
    setBusy(true);
    setError('');
    setNotice('');
    try {
      const response = await createSapReviewRun(input());
      setNotice(`Created review run ${response.publicCode} with ${response.itemCount} unreviewed item${response.itemCount === 1 ? '' : 's'}.`);
      setStatus(await getSapReviewStatus());
    } catch (value) {
      setError(messageOf(value));
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Simplification &amp; Approximation</h2>
          <p className="mt-1 text-sm text-slate-600">
            Frozen SAP QL001–211 · 12 checkpoints · English · Question Studio review queue only.
          </p>
        </div>
        <div className="text-right text-xs text-slate-500">
          <div>{status ? `${status.generationItemCount} generated · ${status.approvedItemCount} approved` : 'Loading status…'}</div>
          <div className="mt-1">Bank write OFF · Test/Public OFF</div>
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-3 lg:grid-cols-6">
        <label className="text-xs font-medium text-slate-700">
          Exam profile
          <select className="mt-1 w-full rounded-md border border-slate-300 px-2 py-2 text-sm" value={examProfile} onChange={(event) => setExamProfile(event.target.value as SapReviewExamProfile)}>
            {(pkg?.supportedExamProfiles ?? ['SSC', 'BANKING', 'RAILWAY', 'PUNJAB_STATE']).map((value) => <option key={value}>{value}</option>)}
          </select>
        </label>
        <label className="text-xs font-medium text-slate-700">
          Checkpoint
          <select className="mt-1 w-full rounded-md border border-slate-300 px-2 py-2 text-sm" value={checkpointId} onChange={(event) => { setCheckpointId(event.target.value); setQlId(''); }}>
            <option value="">All CPs</option>
            {(pkg?.checkpoints ?? []).map((value) => <option key={value}>{value}</option>)}
          </select>
        </label>
        <label className="text-xs font-medium text-slate-700">
          Permanent QL
          <select className="mt-1 w-full rounded-md border border-slate-300 px-2 py-2 text-sm" value={qlId} onChange={(event) => setQlId(event.target.value)}>
            <option value="">Default mix</option>
            {qls.map((entry) => <option key={entry.qlId} value={entry.qlId}>{entry.qlId} — {entry.title}{entry.specialist ? ' [specialist]' : ''}</option>)}
          </select>
        </label>
        <label className="text-xs font-medium text-slate-700">
          Difficulty
          <select className="mt-1 w-full rounded-md border border-slate-300 px-2 py-2 text-sm" value={difficulty} onChange={(event) => setDifficulty(event.target.value as SapReviewDifficulty | '')}>
            <option value="">Any</option>
            {(pkg?.supportedDifficulties ?? ['EASY', 'MEDIUM', 'HARD']).map((value) => <option key={value}>{value}</option>)}
          </select>
        </label>
        <label className="text-xs font-medium text-slate-700">
          Count
          <input className="mt-1 w-full rounded-md border border-slate-300 px-2 py-2 text-sm" type="number" min={1} max={50} value={count} onChange={(event) => setCount(Math.max(1, Math.min(50, Number(event.target.value) || 1)))} />
        </label>
        <label className="text-xs font-medium text-slate-700">
          Seed
          <input className="mt-1 w-full rounded-md border border-slate-300 px-2 py-2 text-sm" value={seed} onChange={(event) => setSeed(event.target.value)} />
        </label>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" disabled={busy || !pkg} onClick={preview} className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-800 disabled:opacity-50">Preview</button>
        <button type="button" disabled={busy || !pkg} onClick={createRun} className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50">Create review run</button>
      </div>

      {error ? <p className="mt-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
      {notice ? <p className="mt-3 rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-800">{notice}</p> : null}

      {questions.length ? (
        <div className="mt-5 space-y-4">
          {questions.map((question, questionIndex) => (
            <article key={question.questionId} className="rounded-lg border border-slate-200 p-4">
              <div className="flex flex-wrap gap-2 text-xs text-slate-500">
                <span>Q{questionIndex + 1}</span><span>{question.qlId}</span><span>{question.checkpointId}</span><span>{question.difficultyBand}</span><span>{question.examProfile}</span>
              </div>
              <p className="mt-2 whitespace-pre-wrap text-sm font-medium text-slate-900">{question.stem}</p>
              <ol className="mt-3 grid gap-2 md:grid-cols-2">
                {question.options.map((option, index) => (
                  <li key={`${question.questionId}-${index}`} className={`rounded-md border px-3 py-2 text-sm ${index === question.correctIndex ? 'border-emerald-300 bg-emerald-50' : 'border-slate-200'}`}>
                    {String.fromCharCode(65 + index)}. {option}
                  </li>
                ))}
              </ol>
              <div className="mt-3 text-sm text-slate-700">
                <strong>Answer:</strong> {question.answer}
                {question.explanation.steps.length ? <ol className="mt-2 list-decimal space-y-1 pl-5">{question.explanation.steps.map((step, index) => <li key={index}>{step}</li>)}</ol> : null}
              </div>
            </article>
          ))}
        </div>
      ) : null}
    </section>
  );
}
