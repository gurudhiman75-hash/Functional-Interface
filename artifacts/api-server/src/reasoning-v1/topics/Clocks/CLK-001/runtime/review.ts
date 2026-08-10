import {
  CLOCK_CHECKPOINTS,
  CLOCK_DESIGN_AUTHORITY,
  CLOCK_TASK_CATALOG,
  type ClockTaskId,
} from "./catalog";
import { CLOCK_SOURCE_CANDIDATE_POLICY } from "./catalog-governance";
import {
  CLOCK_EFFECTIVE_CANDIDATE_DISPOSITION,
  effectiveClockDispositionSummary,
} from "./exam-natural-governance";
import { generateClockQuestion } from "./generator";
import type {
  ClockLocale,
  ClockMediaAsset,
  ClockQuestion,
} from "./types";

export interface ClockReviewBundle {
  schemaVersion: "CLK_REVIEW_V2_REMEDIATION";
  designAuthority: typeof CLOCK_DESIGN_AUTHORITY;
  candidatePolicy: typeof CLOCK_SOURCE_CANDIDATE_POLICY;
  generatedAtPolicy: "DETERMINISTIC_NO_RUNTIME_TIMESTAMP";
  reviewScope: "ALL_SOURCE_CANDIDATES" | "PROVISIONAL_AUTHORITY_ANCHORS";
  questionCount: number;
  checkpointCount: number;
  sourceCandidateCount: number;
  selectedCandidateCount: number;
  localeCounts: Readonly<Record<ClockLocale, number>>;
  dispositionCounts: ReturnType<typeof effectiveClockDispositionSummary>;
  questions: readonly ClockQuestion[];
}

function buildClockReviewForTaskIds(input: {
  taskIds: readonly ClockTaskId[];
  reviewScope: ClockReviewBundle["reviewScope"];
  seedPrefix: string;
  locales: readonly ClockLocale[];
  questionsPerTaskPerLocale: number;
}): ClockReviewBundle {
  if (input.locales.some((locale) => locale !== "en-IN")) {
    throw new Error(
      "CLK-001 Hindi and Punjabi review generation is blocked until the corrected English authorities pass human freeze.",
    );
  }
  if (!Number.isInteger(input.questionsPerTaskPerLocale) || input.questionsPerTaskPerLocale < 1) {
    throw new Error("Review questions per source candidate must be a positive integer.");
  }

  const questions: ClockQuestion[] = [];
  for (const locale of input.locales) {
    for (let repeat = 0; repeat < input.questionsPerTaskPerLocale; repeat += 1) {
      for (let taskIndex = 0; taskIndex < input.taskIds.length; taskIndex += 1) {
        const taskId = input.taskIds[taskIndex]!;
        questions.push(generateClockQuestion({
          taskId,
          seed: `${input.seedPrefix}-${locale}-${repeat}-${taskIndex}`,
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
    reviewScope: input.reviewScope,
    questionCount: questions.length,
    checkpointCount: CLOCK_CHECKPOINTS.length,
    sourceCandidateCount: CLOCK_TASK_CATALOG.length,
    selectedCandidateCount: input.taskIds.length,
    localeCounts,
    dispositionCounts: effectiveClockDispositionSummary(),
    questions,
  };
}

export function buildClockEndToEndReview(input: {
  seedPrefix?: string;
  locales?: readonly ClockLocale[];
  questionsPerTaskPerLocale?: number;
} = {}): ClockReviewBundle {
  return buildClockReviewForTaskIds({
    taskIds: CLOCK_TASK_CATALOG.map(([taskId]) => taskId),
    reviewScope: "ALL_SOURCE_CANDIDATES",
    seedPrefix: input.seedPrefix ?? "CLK-REMEDIATION-REVIEW",
    locales: input.locales ?? (["en-IN"] as const),
    questionsPerTaskPerLocale: input.questionsPerTaskPerLocale ?? 1,
  });
}

export function buildClockAuthorityAnchorReview(input: {
  seedPrefix?: string;
  locales?: readonly ClockLocale[];
  questionsPerAnchorPerLocale?: number;
} = {}): ClockReviewBundle {
  const anchorIds = CLOCK_TASK_CATALOG
    .map(([taskId]) => taskId)
    .filter((taskId) =>
      CLOCK_EFFECTIVE_CANDIDATE_DISPOSITION[taskId].disposition === "PROVISIONAL_AUTHORITY_ANCHOR",
    );
  return buildClockReviewForTaskIds({
    taskIds: anchorIds,
    reviewScope: "PROVISIONAL_AUTHORITY_ANCHORS",
    seedPrefix: input.seedPrefix ?? "CLK-AUTHORITY-ANCHOR-REVIEW",
    locales: input.locales ?? (["en-IN"] as const),
    questionsPerTaskPerLocale: input.questionsPerAnchorPerLocale ?? 1,
  });
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function assertSafeSvg(asset: ClockMediaAsset): void {
  if (!asset.svg.startsWith("<svg ")) {
    throw new Error(`Clock media ${asset.id} is not an SVG root.`);
  }
  if (/<script|foreignObject|javascript:|on\w+\s*=/i.test(asset.svg)) {
    throw new Error(`Unsafe SVG content found in Clock media ${asset.id}.`);
  }
  if (!asset.ariaLabel.trim()) {
    throw new Error(`Clock media ${asset.id} has no accessibility label.`);
  }
}

function renderAsset(asset: ClockMediaAsset, className: string): string {
  assertSafeSvg(asset);
  return `<figure class="${className}" data-media-id="${escapeHtml(asset.id)}" data-semantic-key="${escapeHtml(asset.semanticKey)}">${asset.svg}<figcaption>${escapeHtml(asset.ariaLabel)}</figcaption></figure>`;
}

function renderPromptMedia(question: ClockQuestion): string {
  return question.media?.prompt
    ? renderAsset(question.media.prompt, "prompt-media")
    : "";
}

function renderOptionValue(question: ClockQuestion, semanticKey: string, fallback: string): string {
  const media = question.media?.options?.find((entry) => entry.semanticKey === semanticKey);
  if (media) {
    return renderAsset(media.asset, "option-media");
  }
  return `<div class="option-value">${escapeHtml(fallback)}</div>`;
}

function dispositionLabel(question: ClockQuestion): string {
  switch (question.discoveryAudit.candidateDisposition) {
    case "PROVISIONAL_AUTHORITY_ANCHOR": return "AUTHORITY ANCHOR";
    case "MERGE_AS_QUERY_OR_RENDERER_VARIANT": return "MERGE VARIANT";
    case "HOLD_FOR_ADVANCED_SOURCE_CONFIRMATION": return "ADVANCED HOLD";
    case "INTERNAL_VERIFICATION_ONLY": return "INTERNAL VERIFY";
  }
}

export function renderClockReviewHtml(bundle: ClockReviewBundle): string {
  const checkpointSections = CLOCK_CHECKPOINTS.map((checkpoint) => {
    const questions = bundle.questions.filter((question) => question.checkpointCode === checkpoint.code);
    if (questions.length === 0) return "";
    const cards = questions.map((question) => {
      const options = question.options.map((option, index) => `
        <li class="${option.isCorrect ? "correct" : ""}">
          <span class="label">${String.fromCharCode(65 + index)}.</span>
          ${renderOptionValue(question, option.semanticKey, option.display)}
          <details><summary>Method evidence</summary><p><code>${escapeHtml(option.reasonCode)}</code> — ${escapeHtml(option.reason)}</p></details>
        </li>`).join("");
      const working = question.explanation.working
        .map((step) => `<li>${escapeHtml(step)}</li>`)
        .join("");
      const mediaEvidence = question.media
        ? {
            prompt: question.media.prompt
              ? {
                  id: question.media.prompt.id,
                  semanticKey: question.media.prompt.semanticKey,
                  fingerprint: question.media.prompt.fingerprint,
                  ariaLabel: question.media.prompt.ariaLabel,
                }
              : null,
            options: question.media.options?.map((entry) => ({
              id: entry.asset.id,
              semanticKey: entry.semanticKey,
              fingerprint: entry.asset.fingerprint,
              ariaLabel: entry.asset.ariaLabel,
            })) ?? [],
          }
        : null;

      return `<article class="question" lang="${question.locale}" data-task="${question.taskId}" data-fingerprint="${question.fingerprint}" data-disposition="${question.discoveryAudit.candidateDisposition}">
        <header><div><h3>${question.taskId}</h3><p>${question.locale} · ${question.difficulty} · cluster ${escapeHtml(question.discoveryAudit.semanticCluster)} · seed ${escapeHtml(question.seed)}</p></div><span class="status">${dispositionLabel(question)}</span></header>
        <p class="audit"><strong>Source evidence:</strong> ${escapeHtml(question.discoveryAudit.sourceEvidenceLevel)} · <strong>Disposition:</strong> ${escapeHtml(question.discoveryAudit.candidateDisposition)}</p>
        <div class="stem">${escapeHtml(question.stem)}</div>
        ${renderPromptMedia(question)}
        <ol class="options">${options}</ol>
        <section class="answer">
          <h4>Answer and explanation</h4>
          <p><strong>Correct option:</strong> ${String.fromCharCode(65 + question.correctOptionIndex)} — ${escapeHtml(question.answer.display)}</p>
          <p><strong>Given:</strong> ${escapeHtml(question.explanation.given)}</p>
          <p><strong>Rule:</strong> ${escapeHtml(question.explanation.rule)}</p>
          <ol>${working}</ol>
          <p><strong>Validity:</strong> ${escapeHtml(question.explanation.validityCheck)}</p>
          <p><strong>Closest trap:</strong> ${escapeHtml(question.explanation.closestTrap)}</p>
          <p><strong>Answer:</strong> ${escapeHtml(question.explanation.answer)}</p>
        </section>
        <details class="metadata"><summary>Solver, source, media, contract and lifecycle evidence</summary><pre>${escapeHtml(JSON.stringify({
          scenario: question.scenario,
          discoveryAudit: question.discoveryAudit,
          media: mediaEvidence,
          solveTrace: question.solveTrace,
          lifecycle: question.lifecycle,
          fingerprint: question.fingerprint,
        }, null, 2))}</pre></details>
        <fieldset><legend>Human review</legend>
          <label><input type="checkbox"> Source evidence and candidate disposition approved</label>
          <label><input type="checkbox"> Visible givens match scenario</label>
          <label><input type="checkbox"> Answer satisfies the exact query contract</label>
          <label><input type="checkbox"> Diagram and option media are readable and non-revealing</label>
          <label><input type="checkbox"> Exam-natural stem and value pool</label>
          <label><input type="checkbox"> Options plausible and misconception-owned</label>
          <label><input type="checkbox"> Explanation clear and question-specific</label>
          <label><input type="checkbox"> Final disposition: merge / split / retain / reject / hold</label>
          <textarea rows="3" placeholder="Reviewer notes"></textarea>
        </fieldset>
      </article>`;
    }).join("");

    return `<section class="checkpoint" id="${checkpoint.code}"><header class="checkpoint-header"><h2>${checkpoint.code} — ${escapeHtml(checkpoint.title)}</h2><p>${questions.length} selected review questions</p></header>${cards}</section>`;
  }).join("");

  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>CLK-001 Remediation Review V2</title><style>
    body{font-family:system-ui,sans-serif;margin:0;background:#f3f5f7;color:#151719}
    main{max-width:1100px;margin:auto;padding:24px}
    .hero,.checkpoint-header,.question{background:white;border:1px solid #d8dde3;border-radius:12px;padding:18px;margin:0 0 18px}
    .question>header{display:flex;justify-content:space-between;gap:12px}
    .status{font-size:12px;font-weight:700}
    .audit{font-size:13px}
    .stem{font-size:18px;line-height:1.55;margin:16px 0}
    .prompt-media,.option-media{margin:12px 0;text-align:center}
    .prompt-media svg,.option-media svg{width:min(100%,260px);height:auto;display:block;margin:auto}
    figcaption{font-size:12px;margin-top:6px}
    .options{list-style:none;padding:0;display:grid;gap:10px}
    .options li{border:1px solid #d8dde3;border-radius:9px;padding:12px;display:grid;grid-template-columns:30px 1fr;gap:8px}
    .options li.correct{border-width:2px}
    .options details{grid-column:2}
    .answer{border-top:1px solid #d8dde3;margin-top:16px;padding-top:12px}
    .metadata pre{white-space:pre-wrap;overflow-wrap:anywhere}
    fieldset{display:grid;gap:8px;margin-top:14px}
    textarea{width:100%}
    code{overflow-wrap:anywhere}
  </style></head><body><main>
    <section class="hero"><h1>CLK-001 — Corrective English Review V2</h1>
      <p><strong>Sole design authority:</strong> ${escapeHtml(bundle.designAuthority.file)}</p>
      <p><strong>Authority SHA-256:</strong> <code>${bundle.designAuthority.sha256}</code></p>
      <p><strong>Review scope:</strong> ${escapeHtml(bundle.reviewScope)} · ${bundle.questionCount} questions from ${bundle.selectedCandidateCount} selected rows out of ${bundle.sourceCandidateCount} source-audit candidates.</p>
      <p><strong>Current effective dispositions:</strong> ${escapeHtml(JSON.stringify(bundle.dispositionCounts))}</p>
      <p><strong>Important:</strong> candidate row count and provisional anchor count have no frozen product meaning. These are not permanent QLs.</p>
      <p>Hindi and Punjabi generation is blocked until corrected English content passes source saturation and human freeze.</p>
      <p>Lifecycle remains locked: no permanent QLs, Question Studio registration, Question Bank writes, test eligibility or publication.</p>
    </section>${checkpointSections}
  </main></body></html>`;
}
