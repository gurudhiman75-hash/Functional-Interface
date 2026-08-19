import { strict as assert } from "node:assert";
import { createHash } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

import { generateCircularCaselet } from "../cp003/generator.ts";
import { generateOutwardCaselet } from "../cp004/generator.ts";
import { generateSeaCp001Caselet } from "../generation/caselet-assembler.ts";

const EXISTING_APPROVED_ENGLISH_FINGERPRINT = "e3a4bdcd5c3afb656bed4a695e50f2f4218e45907647e23d8c733feffb59ca22";
const TARGET_BLUEPRINTS = ["SEA-PBA-001", "SEA-PBA-011", "SEA-PBA-014"] as const;
const CASELETS_PER_BLUEPRINT = 20;

type ReviewOption = {
  readonly display: string;
  readonly isCorrect: boolean;
  readonly explanation: string;
};

type ReviewChild = {
  readonly questionOrder: number;
  readonly queryContractId: string;
  readonly text: string;
  readonly options: readonly ReviewOption[];
  readonly answerIndex: number;
  readonly explanation: string;
};

type ReviewCaselet = {
  readonly caseletId: string;
  readonly blueprintAuthorityId: string;
  readonly checkpointId: string;
  readonly seed: string;
  readonly setupText: string;
  readonly clueTexts: readonly string[];
  readonly sharedExplanation: string;
  readonly diagramText?: string;
  readonly diagram?: { readonly text: string };
  readonly solverOracleAgreement: { readonly passed: boolean };
  readonly solutionClassCount: number;
  readonly children: readonly ReviewChild[];
};

function generate(blueprint: typeof TARGET_BLUEPRINTS[number], index: number): ReviewCaselet {
  const seed = `SEA001-STRUCTURAL-HARDENING-EN-REVIEW:${blueprint}:${String(index + 1).padStart(2, "0")}`;
  if (blueprint === "SEA-PBA-001") {
    return generateSeaCp001Caselet({ blueprintId: blueprint, seed }) as unknown as ReviewCaselet;
  }
  if (blueprint === "SEA-PBA-011") {
    return generateCircularCaselet(seed, blueprint) as unknown as ReviewCaselet;
  }
  return generateOutwardCaselet(seed, blueprint) as unknown as ReviewCaselet;
}

function sha256(value: unknown): string {
  return createHash("sha256").update(JSON.stringify(value)).digest("hex");
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function learnerProjection(caselet: ReviewCaselet) {
  return {
    blueprintAuthorityId: caselet.blueprintAuthorityId,
    setupText: caselet.setupText,
    clueTexts: caselet.clueTexts,
    diagramText: caselet.diagramText ?? caselet.diagram?.text ?? "",
    sharedExplanation: caselet.sharedExplanation,
    children: caselet.children.map((child) => ({
      questionOrder: child.questionOrder,
      queryContractId: child.queryContractId,
      text: child.text,
      options: child.options.map((option) => ({
        display: option.display,
        isCorrect: option.isCorrect,
        explanation: option.explanation,
      })),
      answerIndex: child.answerIndex,
      explanation: child.explanation,
    })),
  };
}

function assertLearnerSurface(caselet: ReviewCaselet): void {
  assert.equal(caselet.solutionClassCount, 1, `${caselet.caseletId}: non-unique solution`);
  assert.equal(caselet.solverOracleAgreement.passed, true, `${caselet.caseletId}: solver/oracle disagreement`);
  assert(caselet.setupText.trim().length > 20, `${caselet.caseletId}: thin setup`);
  assert(caselet.clueTexts.length >= 3, `${caselet.caseletId}: thin clue set`);
  assert(caselet.sharedExplanation.trim().length > 40, `${caselet.caseletId}: thin shared explanation`);
  assert((caselet.diagramText ?? caselet.diagram?.text ?? "").trim().length > 0, `${caselet.caseletId}: missing diagram text`);
  assert(caselet.children.length >= 3 && caselet.children.length <= 5, `${caselet.caseletId}: invalid child count`);

  const learnerSurface = [
    caselet.setupText,
    ...caselet.clueTexts,
    caselet.sharedExplanation,
    ...caselet.children.flatMap((child) => [
      child.text,
      child.explanation,
      ...child.options.flatMap((option) => [option.display, option.explanation]),
    ]),
  ].join("\n");
  assert.doesNotMatch(
    learnerSurface,
    /solver|oracle|canonical(?:isation|ization)?|fingerprint|blueprint|PBA-|constraint id|semantic class|internal anchor/i,
    `${caselet.caseletId}: internal implementation language leaked`,
  );

  for (const child of caselet.children) {
    assert(child.text.trim().length > 5, `${caselet.caseletId}/Q${child.questionOrder}: missing stem`);
    assert.equal(child.options.length, 4, `${caselet.caseletId}/Q${child.questionOrder}: option count`);
    assert.equal(child.options.filter((option) => option.isCorrect).length, 1, `${caselet.caseletId}/Q${child.questionOrder}: correct-option count`);
    assert.equal(child.options[child.answerIndex]?.isCorrect, true, `${caselet.caseletId}/Q${child.questionOrder}: answer index mismatch`);
    assert(child.explanation.trim().length > 10, `${caselet.caseletId}/Q${child.questionOrder}: missing explanation`);
    assert.equal(new Set(child.options.map((option) => option.display)).size, 4, `${caselet.caseletId}/Q${child.questionOrder}: duplicate option display`);
    for (const option of child.options) {
      assert(option.explanation.trim().length > 5, `${caselet.caseletId}/Q${child.questionOrder}: missing option rationale`);
    }
  }
}

function renderHtml(caselets: readonly ReviewCaselet[], fingerprint: string): string {
  const cards = caselets.map((caselet, index) => {
    const diagram = caselet.diagramText ?? caselet.diagram?.text ?? "";
    const questions = caselet.children.map((child) => {
      const options = child.options.map((option, optionIndex) => `
        <li class="${option.isCorrect ? "correct" : ""}">
          <strong>${String.fromCharCode(65 + optionIndex)}.</strong> ${escapeHtml(option.display)}
          ${option.isCorrect ? " <span class=\"badge\">Correct</span>" : ""}
          <div class="rationale">${escapeHtml(option.explanation)}</div>
        </li>`).join("");
      return `<section class="question">
        <h4>Q${child.questionOrder} · ${escapeHtml(child.queryContractId)}</h4>
        <p>${escapeHtml(child.text)}</p>
        <ol class="options">${options}</ol>
        <details open><summary>Question explanation</summary><pre>${escapeHtml(child.explanation)}</pre></details>
      </section>`;
    }).join("");

    return `<article class="caselet">
      <h2>${index + 1}. ${escapeHtml(caselet.blueprintAuthorityId)} · ${escapeHtml(caselet.caseletId)}</h2>
      <p class="seed">Seed: ${escapeHtml(caselet.seed)}</p>
      <h3>Setup</h3><p>${escapeHtml(caselet.setupText)}</p>
      <h3>Clues</h3><ol>${caselet.clueTexts.map((clue) => `<li>${escapeHtml(clue)}</li>`).join("")}</ol>
      <h3>Diagram / final arrangement</h3><pre>${escapeHtml(diagram)}</pre>
      <details open><summary>Shared teaching explanation</summary><pre>${escapeHtml(caselet.sharedExplanation)}</pre></details>
      ${questions}
    </article>`;
  }).join("\n");

  return `<!doctype html><html><head><meta charset="utf-8"><title>SEA-001 Structural Hardening English Review</title>
  <style>
    body{font-family:system-ui,sans-serif;max-width:1100px;margin:0 auto;padding:24px;line-height:1.5;background:#fff;color:#111}
    header{border-bottom:2px solid #111;margin-bottom:28px}.caselet{border:1px solid #bbb;border-radius:10px;padding:20px;margin:24px 0;break-inside:avoid}
    .question{border-top:1px solid #ddd;padding-top:12px;margin-top:16px}.options{list-style:none;padding:0}.options li{padding:8px 10px;margin:6px 0;border:1px solid #ddd;border-radius:6px}
    .options li.correct{border-width:2px}.badge{font-size:.8rem;border:1px solid #111;border-radius:10px;padding:1px 7px}.rationale{margin-top:5px;font-size:.92rem}.seed{font-size:.8rem;color:#444}
    pre{white-space:pre-wrap;font-family:inherit;background:#f7f7f7;padding:10px;border-radius:6px}summary{font-weight:700;cursor:pointer}
  </style></head><body>
  <header><h1>SEA-001 Structural Hardening · English Review Candidate</h1>
  <p><strong>60 caselets:</strong> 20 each from SEA-PBA-001, SEA-PBA-011 and SEA-PBA-014.</p>
  <p><strong>Candidate SHA-256:</strong> <code>${fingerprint}</code></p>
  <p>This is a replacement review candidate only. It does not replace the currently approved/frozen English authority.</p></header>
  ${cards}
  </body></html>`;
}

const outputDir = process.argv[2] ?? "/tmp/sea001-structural-hardening-review";
const caselets = TARGET_BLUEPRINTS.flatMap((blueprint) =>
  Array.from({ length: CASELETS_PER_BLUEPRINT }, (_, index) => generate(blueprint, index)),
);

for (const caselet of caselets) assertLearnerSurface(caselet);
assert.equal(caselets.length, 60);
assert.equal(new Set(caselets.map((caselet) => caselet.caseletId)).size, 60, "duplicate caselet IDs");
assert.deepEqual(
  Object.fromEntries(TARGET_BLUEPRINTS.map((blueprint) => [blueprint, caselets.filter((caselet) => caselet.blueprintAuthorityId === blueprint).length])),
  { "SEA-PBA-001": 20, "SEA-PBA-011": 20, "SEA-PBA-014": 20 },
);

const projection = caselets.map(learnerProjection);
const candidateFingerprint = sha256(projection);
assert.notEqual(candidateFingerprint, EXISTING_APPROVED_ENGLISH_FINGERPRINT, "replacement candidate unexpectedly equals old approved authority");

const manifest = {
  candidateId: "SEA001_STRUCTURAL_REALNESS_ENGLISH_REVIEW_CANDIDATE_V1",
  generatedAtPolicy: "DETERMINISTIC_SEEDS_NO_WALL_CLOCK_IN_FINGERPRINT",
  blueprintCoverage: { "SEA-PBA-001": 20, "SEA-PBA-011": 20, "SEA-PBA-014": 20 },
  caseletCount: caselets.length,
  childQuestionCount: caselets.reduce((sum, caselet) => sum + caselet.children.length, 0),
  candidateFingerprint,
  existingApprovedFingerprint: EXISTING_APPROVED_ENGLISH_FINGERPRINT,
  approvalStatus: "PENDING_HUMAN_REVIEW",
  replacesApprovedAuthority: false,
  productActivationAuthorized: false,
};

await mkdir(outputDir, { recursive: true });
await writeFile(`${outputDir}/manifest.json`, `${JSON.stringify(manifest, null, 2)}\n`);
await writeFile(`${outputDir}/review-corpus.json`, `${JSON.stringify(projection, null, 2)}\n`);
await writeFile(`${outputDir}/review.html`, renderHtml(caselets, candidateFingerprint));

console.log("PASS_SEA001_STRUCTURAL_HARDENING_ENGLISH_REVIEW_EXPORT");
console.log("SEA001_REVIEW_MANIFEST", JSON.stringify(manifest));
console.log("SEA001_REVIEW_OUTPUT", outputDir);
