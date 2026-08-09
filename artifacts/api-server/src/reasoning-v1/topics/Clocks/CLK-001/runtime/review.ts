import {
  CLOCK_CHECKPOINTS,
  CLOCK_DESIGN_AUTHORITY,
  CLOCK_TASK_CATALOG,
} from "./catalog";
import { CLOCK_SOURCE_CANDIDATE_POLICY } from "./catalog-governance";
import { generateClockQuestion } from "./generator";
import type { ClockLocale, ClockQuestion } from "./types";

export interface ClockReviewBundle {
  schemaVersion: "CLK_REVIEW_V2_REMEDIATION";
  designAuthority: typeof CLOCK_DESIGN_AUTHORITY;
  candidatePolicy: typeof CLOCK_SOURCE_CANDIDATE_POLICY;
  generatedAtPolicy: "DETERMINISTIC_NO_RUNTIME_TIMESTAMP";
  questionCount: number;
  checkpointCount: number;
  sourceCandidateCount: number;
  localeCounts: Readonly<Record<ClockLocale, number>>;
  questions: readonly ClockQuestion[];
}

export function buildClockEndToEndReview(input: {
  seedPrefix?: string;
  locales?: readonly ClockLocale[];
  questionsPerTaskPerLocale?: number;
} = {}): ClockReviewBundle {
  const seedPrefix = input.seedPrefix ?? "CLK-REMEDIATION-REVIEW";
  const locales = input.locales ?? (["en-IN"] as const);
  if (locales.some((locale) => locale !== "en-IN")) {
    throw new Error(
      "CLK-001 Hindi and Punjabi review generation is blocked until the corrected English authorities pass human freeze.",
    );
  }
  const questionsPerTaskPerLocale = input.questionsPerTaskPerLocale ?? 1;
  if (!Number.isInteger(questionsPerTaskPerLocale) || questionsPerTaskPerLocale < 1) {
    throw new Error("Review questions per source candidate must be a positive integer.");
  }
  const questions: ClockQuestion[] = [];
  for (const locale of locales) {
    for (let repeat = 0; repeat < questionsPerTaskPerLocale; repeat += 1) {
      for (let taskIndex = 0; taskIndex < CLOCK_TASK_CATALOG.length; taskIndex += 1) {
        const [taskId] = CLOCK_TASK_CATALOG[taskIndex]!;
        questions.push(generateClockQuestion({
          taskId,
          seed: `${seedPrefix}-${locale}-${repeat}-${taskIndex}`,
          locale,
          correctOptionIndex: ((taskIndex + repeat) % 4) as 0 | 1 | 2 | 3,
        }));
      }
    }
  }
  const localeCounts = {
    "en-IN": questions.filter((question) => question.locale === "en-IN").length,
    "hi-IN": 0,
    "pa-IN": 0,
  } as const;
  return {
    schemaVersion: "CLK_REVIEW_V2_REMEDIATION",
    designAuthority: CLOCK_DESIGN_AUTHORITY,
    candidatePolicy: CLOCK_SOURCE_CANDIDATE_POLICY,
    generatedAtPolicy: "DETERMINISTIC_NO_RUNTIME_TIMESTAMP",
    questionCount: questions.length,
    checkpointCount: CLOCK_CHECKPOINTS.length,
    sourceCandidateCount: CLOCK_TASK_CATALOG.length,
    localeCounts,
    questions,
  };
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function safeGeneratedRichText(value: string): string {
  if (/<script|foreignObject|javascript:|on\w+\s*=/i.test(value)) {
    throw new Error("Unsafe content found in generated CLK review text.");
  }
  if (value.includes("<svg")) {
    return value;
  }
  return escapeHtml(value);
}

export function renderClockReviewHtml(bundle: ClockReviewBundle): string {
  const checkpointSections = CLOCK_CHECKPOINTS.map((checkpoint) => {
    const questions = bundle.questions.filter((question) => question.checkpointCode === checkpoint.code);
    return `<section class="checkpoint" id="${checkpoint.code}"><header class="checkpoint-header"><h2>${checkpoint.code} — ${escapeHtml(checkpoint.title)}</h2><p>${questions.length} source-candidate review questions</p></header>${questions.map((question) => {
      const options = question.options.map((option, index) => `<li class="${option.isCorrect ? "correct" : ""}"><span class="label">${String.fromCharCode(65 + index)}.</span><div class="option-value">${safeGeneratedRichText(option.display)}</div><details><summary>Method evidence</summary><p><code>${escapeHtml(option.reasonCode)}</code> — ${escapeHtml(option.reason)}</p></details></li>`).join("");
      const working = question.explanation.working.map((step) => `<li>${escapeHtml(step)}</li>`).join("");
      return `<article class="question" lang="${question.locale}" data-task="${question.taskId}" data-fingerprint="${question.fingerprint}"><header><div><h3>${question.taskId}</h3><p>${question.locale} · ${question.difficulty} · seed ${escapeHtml(question.seed)}</p></div><span class="status">SOURCE CANDIDATE</span></header><div class="stem">${safeGeneratedRichText(question.stem)}</div><ol class="options">${options}</ol><section class="answer"><h4>Answer and explanation</h4><p><strong>Correct option:</strong> ${String.fromCharCode(65 + question.correctOptionIndex)} — ${safeGeneratedRichText(question.answer.display)}</p><p><strong>Given:</strong> ${escapeHtml(question.explanation.given)}</p><p><strong>Rule:</strong> ${escapeHtml(question.explanation.rule)}</p><ol>${working}</ol><p><strong>Validity:</strong> ${escapeHtml(question.explanation.validityCheck)}</p><p><strong>Closest trap:</strong> ${escapeHtml(question.explanation.closestTrap)}</p><p><strong>Answer:</strong> ${escapeHtml(question.explanation.answer)}</p></section><details class="metadata"><summary>Solver, contract and lifecycle evidence</summary><pre>${escapeHtml(JSON.stringify({ scenario: question.scenario, solveTrace: question.solveTrace, lifecycle: question.lifecycle, fingerprint: question.fingerprint }, null, 2))}</pre></details><fieldset><legend>Human review</legend><label><input type="checkbox"> Visible givens match scenario</label><label><input type="checkbox"> Answer satisfies the exact query contract</label><label><input type="checkbox"> Exam-natural stem</label><label><input type="checkbox"> Options plausible and misconception-owned</label><label><input type="checkbox"> Explanation clear and question-specific</label><label><input type="checkbox"> Candidate disposition: merge / split / retain / reject</label><textarea rows="3" placeholder="Reviewer notes"></textarea></fieldset></article>`;
    }).join("")}</section>`;
  }).join("");

  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>CLK-001 Remediation Review V2</title><style>body{font-family:system-ui,sans-serif;margin:0;background:#f3f5f7;color:#151719}main{max-width:1100px;margin:auto;padding:24px}.hero,.checkpoint-header,.question{background:white;border:1px solid #d8dde3;border-radius:12px;padding:18px;margin:0 0 18px}.question>header{display:flex;justify-content:space-between;gap:12px}.status{font-size:12px;font-weight:700}.stem{font-size:18px;line-height:1.55;margin:16px 0}.options{list-style:none;padding:0;display:grid;gap:10px}.options li{border:1px solid #d8dde3;border-radius:9px;padding:12px;display:grid;grid-template-columns:30px 1fr;gap:8px}.options li.correct{border-width:2px}.options details{grid-column:2}.answer{border-top:1px solid #d8dde3;margin-top:16px;padding-top:12px}.metadata pre{white-space:pre-wrap;overflow-wrap:anywhere}.question svg,.option-value svg{max-width:220px;display:block;margin:10px auto}fieldset{display:grid;gap:8px;margin-top:14px}textarea{width:100%}code{overflow-wrap:anywhere}</style></head><body><main><section class="hero"><h1>CLK-001 — Corrective English Review V2</h1><p><strong>Sole design authority:</strong> ${escapeHtml(bundle.designAuthority.file)}</p><p><strong>Authority SHA-256:</strong> <code>${bundle.designAuthority.sha256}</code></p><p>${bundle.questionCount} questions · ${bundle.sourceCandidateCount} source-audit candidate rows · ${bundle.checkpointCount} provisional checkpoints</p><p><strong>Important:</strong> candidate row count has no product meaning. These are not permanent authorities or QLs.</p><p>Hindi and Punjabi generation is blocked until corrected English content passes source saturation and human freeze.</p><p>Lifecycle remains locked: no permanent QLs, Question Studio registration, Question Bank writes, test eligibility or publication.</p></section>${checkpointSections}</main></body></html>`;
}
