import { StudentProfileAvatar } from "@/components/StudentProfileAvatar";
import type { TestSection } from "@/lib/data";
export type SscQuestionStatus = "NOT_VISITED" | "NOT_ANSWERED" | "ANSWERED" | "MARKED" | "ANSWERED_MARKED";
export function SscCbtHeader({ name, candidate, time, scale, onZoom, onTextSizeChange, onInstructions, onSymbols, onPaper, onPause }: {
  name: string; candidate: string; time: string; scale: number; onZoom: (delta: number) => void; onTextSizeChange: (size: number) => void;
  onInstructions: () => void; onSymbols: () => void; onPaper: () => void; onPause: () => void;
}) {
  return <><header className="ssc-cbt-header">
    <div className="ssc-cbt-brand"><strong>Examtree</strong><h1>{name}</h1></div>
    <div className="ssc-cbt-zoom" aria-label="Question text size"><label>Text Size: <select aria-label="Text Size" value={scale} onChange={event => onTextSizeChange(Number(event.target.value))}>{[[80,"Small"],[100,"Medium"],[125,"Large"],[150,"Extra Large"],[200,"200%"]].map(([value,label]) => <option key={value} value={value}>{label}</option>)}{![80,100,125,150,200].includes(scale) && <option value={scale}>Custom ({scale}%)</option>}</select></label><div className="ssc-cbt-zoom-steps"><button type="button" disabled={scale >= 200} onClick={() => onZoom(10)}>Zoom (+)</button><button type="button" disabled={scale <= 80} onClick={() => onZoom(-10)}>Zoom (−)</button><output aria-live="polite">{scale}%</output></div></div>
    <div className="ssc-cbt-heading"><strong>EXAMTREE ONLINE MOCK TEST</strong><p>Candidate Name: {candidate}</p></div>
    <div className="ssc-cbt-clock">Time Left<strong>{time}</strong></div>
    <StudentProfileAvatar className="ssc-cbt-avatar" fallback={<span aria-hidden="true">👤</span>} />
  </header><nav className="ssc-cbt-tools" aria-label="Exam tools"><button type="button" onClick={onSymbols}>SYMBOLS</button><button type="button" onClick={onInstructions}>INSTRUCTIONS</button><button type="button" onClick={onPaper}>QUESTION PAPER</button><button type="button" onClick={onPause}>Pause &amp; Exit</button><span>Examtree · SSC CBT-style practice interface</span></nav></>;
}
export function SscCbtSidebar({ sections, active, locked, restricted, currentQuestion, getStatus, onNavigate, onNext }: {
  sections: TestSection[]; active: number; locked: number[]; restricted: boolean; currentQuestion: number;
  getStatus: (question: { id: number }) => SscQuestionStatus;
  onNavigate: (section: number, question: number) => void; onNext?: () => void;
}) {
  const section = sections[active];
  const answered = section.questions.filter(question => ["ANSWERED", "ANSWERED_MARKED"].includes(getStatus(question))).length;
  return <aside className="ssc-cbt-sidebar" aria-label="Question palette">
    <div className="ssc-cbt-parts" aria-label="Sections">{sections.map((part, index) => <button type="button" key={part.id} title={part.name} aria-label={`Switch to ${part.name}`} aria-current={index === active ? "true" : undefined} disabled={restricted && index !== active} onClick={() => onNavigate(index, 0)} data-testid={`section-tab-${part.id}`}>PART-{index < 26 ? String.fromCharCode(65 + index) : index + 1}{locked.includes(index) ? " 🔒" : ""}</button>)}</div>
    <h2>{section.name}</h2>
    <div className="ssc-cbt-question-grid">{section.questions.map((question, index) => <button type="button" key={question.id} className={`ssc-status-${getStatus(question).toLowerCase()}`} aria-label={`Question ${index + 1}, ${getStatus(question).replace(/_/g, " ").toLowerCase()}`} aria-current={index === currentQuestion ? "step" : undefined} onClick={() => onNavigate(active, index)}>{index + 1}</button>)}</div>
    <div className="ssc-cbt-analysis"><h3>PART-{active < 26 ? String.fromCharCode(65 + active) : active + 1} Analysis</h3><dl><div><dt>Answered</dt><dd>{answered}</dd></div><div><dt>Not Answered</dt><dd>{section.questions.length - answered}</dd></div></dl></div>
    {onNext && active < sections.length - 1 && <button type="button" className="ssc-cbt-next-section" onClick={onNext}>Jump to Next Section</button>}
    <details className="ssc-cbt-legend" id="ssc-cbt-symbols"><summary>Symbols</summary><ul><li><i className="ssc-status-answered" />Answered</li><li><i className="ssc-status-not_answered" />Not answered</li><li><i className="ssc-status-not_visited" />Not visited</li><li><i className="ssc-status-marked" />Marked for review</li><li><i className="ssc-status-answered_marked" />Answered &amp; marked</li></ul></details>
  </aside>;
}

export function SscCbtActions({ flagged, answered, submitting, onReview, onSave, onSubmit, onClear, onNextWrong }: {
  flagged: boolean; answered: number; submitting: boolean; onReview: () => void; onSave: () => void;
  onSubmit: () => void; onClear: () => void; onNextWrong?: () => void;
}) {
  return <div className="tcs-ion-actions" aria-label="Question actions">
    <div className="ssc-cbt-primary-actions"><button type="button" onClick={onReview}>{flagged ? "Unmark Review" : "Mark for Review"}</button><button type="button" onClick={onSave}>Save &amp; Next</button><button type="button" disabled={submitting} onClick={onSubmit}>Submit test</button></div>
    <div className="ssc-cbt-secondary-actions"><button type="button" onClick={onClear}>Clear Response</button>{onNextWrong && <button type="button" onClick={onNextWrong}>Next Wrong Question</button>}</div>
    <span className="ssc-cbt-total">Total Questions answered: <b>{answered}</b></span>
  </div>;
}
