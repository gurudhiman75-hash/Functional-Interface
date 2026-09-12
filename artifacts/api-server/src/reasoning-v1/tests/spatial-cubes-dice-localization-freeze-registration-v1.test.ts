import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

import {
  CND_001_STUDENT_SOLUTION_LOCALIZATION_FREEZE_AUTHORITY_V1,
} from "../foundation/spatial/cubes-dice-student-solution-localization-freeze-v1";
import {
  CND_001_QUESTION_STUDIO_REVIEW_ONLY_REGISTRATION_AUTHORITY_V1,
  generateCubesDiceQuestionStudioRegisteredBatchV1,
  generateCubesDiceQuestionStudioRegisteredV1,
  type CubesDiceRegisteredQuestionV1,
} from "../foundation/spatial/cubes-dice-question-studio-registered-runtime-v1";
import type { CubesDiceQuestionStudioQlIdV2 } from "../foundation/spatial/cubes-dice-question-studio-seeded-runtime-v2";

const QLS = Object.freeze(["SPA-QL-043", "SPA-QL-044", "SPA-QL-045", "SPA-QL-046", "SPA-QL-047"] as const satisfies readonly CubesDiceQuestionStudioQlIdV2[]);
const LANGUAGES = Object.freeze(["en", "hi", "pa"] as const);
const REVIEW_LANGUAGES = Object.freeze(["hi", "pa"] as const);

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function solutionSurface(question: CubesDiceRegisteredQuestionV1): string {
  return [
    question.stem,
    question.solution.logicRule,
    ...question.solution.steps,
    question.solution.note ?? "",
    question.solution.answerLine,
    ...question.solution.tables.flatMap((entry) => [entry.title, ...entry.headers, ...entry.rows.flat()]),
  ].join(" ");
}

function validateLanguageSurface(question: CubesDiceRegisteredQuestionV1) {
  const surface = solutionSurface(question);
  assert(question.lifecycle.reviewOnly, `${question.seed}: CND must remain review-only.`);
  assert(question.lifecycle.questionStudioDiscoverable, `${question.seed}: CND must be discoverable after registration.`);
  assert(question.lifecycle.registrationStatus === "REGISTERED_REVIEW_ONLY", `${question.seed}: registration status mismatch.`);
  assert(!question.lifecycle.persistenceAllowed, `${question.seed}: persistence must remain disabled.`);
  assert(!question.lifecycle.questionBankWritable, `${question.seed}: Question Bank writes must remain disabled.`);
  assert(!question.lifecycle.testEligible, `${question.seed}: test eligibility must remain disabled.`);
  assert(!question.lifecycle.publiclyPublishable, `${question.seed}: public publication must remain disabled.`);
  assert(!question.lifecycle.automaticStudentPublication, `${question.seed}: automatic publication must remain disabled.`);
  assert(question.solution.tables.length >= 1, `${question.seed}: V4 solution requires at least one worked table.`);
  assert(question.solution.steps.length >= 1, `${question.seed}: V4 solution requires explicit working.`);
  assert(question.solution.answerLine.includes(String(question.canonicalAnswer)), `${question.seed}: final answer line must contain the canonical answer.`);
  const lower = surface.toLowerCase();
  for (const forbidden of ["solver-attested", "occupied-voxel", "height matrix", "renderer authority", "runtime proof"]) {
    assert(!lower.includes(forbidden), `${question.seed}: leaked engine term '${forbidden}'.`);
  }
  if (question.language === "hi") {
    assert(/[\u0900-\u097F]/.test(surface), `${question.seed}: Hindi surface lacks Devanagari.`);
    assert(!surface.includes("सीमाबद्ध घनाभ"), `${question.seed}: rejected literal Hindi wording survived freeze.`);
  }
  if (question.language === "pa") {
    assert(/[\u0A00-\u0A7F]/.test(surface), `${question.seed}: Punjabi surface lacks Gurmukhi.`);
    assert(!surface.includes("ਹਰੀਜ਼ਾਂਟਲ"), `${question.seed}: rejected Punjabi transliteration survived freeze.`);
    assert(!surface.includes("ਸੀਮਾਬੱਧ ਘਣਾਭ"), `${question.seed}: rejected literal Punjabi wording survived freeze.`);
  }
}

function parityCorpus() {
  let cases = 0;
  for (const qlId of QLS) {
    for (let seedIndex = 0; seedIndex < 8; seedIndex += 1) {
      const seed = `cnd-l10n-freeze:${qlId}:${seedIndex}`;
      const generated = LANGUAGES.map((language) => generateCubesDiceQuestionStudioRegisteredV1({ seed, qlId, language }));
      const english = generated[0]!;
      for (const question of generated) {
        validateLanguageSurface(question);
        assert(question.contentFingerprint === english.contentFingerprint, `${seed}: language changed canonical fingerprint.`);
        assert(JSON.stringify(question.options) === JSON.stringify(english.options), `${seed}: language changed option order or values.`);
        assert(question.correctIndex === english.correctIndex, `${seed}: language changed correct option index.`);
        assert(question.canonicalAnswer === english.canonicalAnswer, `${seed}: language changed canonical answer.`);
        assert(question.stimulusSvgs[0] === english.stimulusSvgs[0], `${seed}: language changed SVG stimulus.`);
        cases += 1;
      }
    }
  }
  return cases;
}

function taskDiversity() {
  const stack = generateCubesDiceQuestionStudioRegisteredBatchV1({ seed: "cnd-stack-task-diversity", language: "hi", count: 24, qlId: "SPA-QL-046" });
  const projection = generateCubesDiceQuestionStudioRegisteredBatchV1({ seed: "cnd-projection-task-diversity", language: "pa", count: 24, qlId: "SPA-QL-047" });
  const stackTasks = new Set(stack.map((entry) => entry.taskKind));
  const projectionTasks = new Set(projection.map((entry) => entry.taskKind));
  assert(stackTasks.has("STACK_TOTAL_CUBES") && stackTasks.has("STACK_EXPOSED_FACES") && stackTasks.has("STACK_MISSING_TO_COMPLETE_CUBOID"), "QL-046 does not expose all three approved solve modes.");
  assert(projectionTasks.has("ORTHOGRAPHIC_TOP_CELL_COUNT") && projectionTasks.has("ORTHOGRAPHIC_FRONT_CELL_COUNT") && projectionTasks.has("ORTHOGRAPHIC_RIGHT_CELL_COUNT"), "QL-047 does not expose all three approved projection modes.");
  return { stackTasks: [...stackTasks].sort(), projectionTasks: [...projectionTasks].sort() };
}

function routeAndUiRegistration() {
  const registry = readFileSync(resolve(process.cwd(), "src/routes/admin-question-studio-registry.ts"), "utf8");
  assert(registry.includes("adminQuestionStudioCubesDiceRouter"), "CND route is not mounted in the canonical Question Studio registry.");
  const route = readFileSync(resolve(process.cwd(), "src/routes/admin-question-studio-cubes-dice.ts"), "utf8");
  assert(route.includes("/reasoning/spatial/cubes-dice/package"), "CND package endpoint missing.");
  assert(route.includes("/reasoning/spatial/cubes-dice/preview"), "CND preview endpoint missing.");
  assert(route.includes("REGISTERED_REVIEW_ONLY"), "CND route lost review-only registration status.");
  assert(route.includes("persistenceAllowed: false"), "CND route lost persistence lock.");
  const panel = readFileSync(resolve(process.cwd(), "../admin-app/src/pages/content/QuestionStudioCubesDiceReviewPanel.tsx"), "utf8");
  assert(panel.includes("Registered review-only"), "CND admin panel does not expose registration state.");
  assert(!panel.includes("createCubesDiceReviewRun"), "CND admin panel unexpectedly exposes a persistence action.");
  const operations = readFileSync(resolve(process.cwd(), "../admin-app/src/pages/content/QuestionStudioOperationsPage.tsx"), "utf8");
  assert(operations.includes("QuestionStudioCubesDiceReviewPanel"), "CND panel is not mounted on Question Studio Operations page.");
}

function escapeHtml(value: unknown): string {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function solutionHtml(question: CubesDiceRegisteredQuestionV1) {
  const tables = question.solution.tables.map((table) => {
    const head = table.headers.map((cell) => `<th>${escapeHtml(cell)}</th>`).join("");
    const rows = table.rows.map((row, index) => `<tr class="${table.emphasizedRowIndexes.includes(index) ? "em" : ""}">${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join("")}</tr>`).join("");
    return `<div class="table-title">${escapeHtml(table.title)}</div><table><thead><tr>${head}</tr></thead><tbody>${rows}</tbody></table>`;
  }).join("");
  return `<section class="solution"><h4>Detailed solution</h4><p class="logic"><strong>Logic / Rule:</strong> ${escapeHtml(question.solution.logicRule)}</p>${tables}<ol>${question.solution.steps.map((step) => `<li>${escapeHtml(step)}</li>`).join("")}</ol>${question.solution.note ? `<p class="note">${escapeHtml(question.solution.note)}</p>` : ""}<p class="answer">${escapeHtml(question.solution.answerLine)}</p></section>`;
}

function writeReviewPack() {
  const questions: CubesDiceRegisteredQuestionV1[] = [];
  for (const qlId of QLS) {
    for (const language of REVIEW_LANGUAGES) {
      questions.push(generateCubesDiceQuestionStudioRegisteredV1({ seed: `cnd-direct-l10n-review:${qlId}`, qlId, language }));
    }
  }
  const cards = questions.map((question) => `<article><div class="meta">${question.qlId} · ${question.language.toUpperCase()} · ${escapeHtml(question.taskKind)} · ${question.difficultyBand}</div><h3>${escapeHtml(question.stem)}</h3><div class="diagram">${question.stimulusSvgs[0]}</div><div class="options">${question.options.map((option, index) => `<div class="option ${index === question.correctIndex ? "correct" : ""}"><strong>${question.optionLabels[index]}.</strong> ${escapeHtml(option)}</div>`).join("")}</div>${solutionHtml(question)}</article>`).join("");
  const html = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>CND-001 Hindi Punjabi Solution Review</title><style>body{margin:0;background:#f5f6f8;color:#17191d;font-family:Arial,sans-serif}.wrap{max-width:960px;margin:auto;padding:20px 12px 60px}header,article{background:#fff;border:1px solid #dfe3e8;border-radius:9px;padding:18px;margin-bottom:14px}h1{font-size:23px;margin:0 0 8px}.meta{font-size:11px;color:#68707b;margin-bottom:8px}h3{font-size:17px;line-height:1.55}.diagram{display:flex;justify-content:center;min-height:210px;padding:12px;border:1px solid #edf0f2}.diagram svg{max-width:330px;width:80%;height:auto}.options{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:12px 0}.option{border:1px solid #dfe3e8;border-radius:6px;padding:9px}.correct{border-color:#9ca3af;font-weight:700}.solution{border-top:2px solid #e5e7eb;padding-top:12px}.logic{background:#f7f8fa;border-left:3px solid #606874;padding:10px;line-height:1.55}.table-title{font-weight:700;font-size:13px;margin:10px 0 5px}table{border-collapse:collapse;width:100%;font-size:13px}th,td{border:1px solid #d9dde2;padding:7px;text-align:left}.em{font-weight:700;background:#f3f4f6}li{line-height:1.55;margin:4px}.note{font-size:13px;background:#f7f8fa;padding:8px}.answer{font-weight:800;border-top:1px solid #e5e7eb;padding-top:10px}@media(max-width:600px){.options{grid-template-columns:1fr}}</style></head><body><main class="wrap"><header><h1>CND-001 — Hindi/Punjabi Detailed Solution Review</h1><p>10 direct review surfaces: all five permanent QLs in Hindi and Punjabi. Review-only registration; no persistence, Question Bank, tests or publication.</p></header>${cards}</main></body></html>`;
  const output = resolve(process.cwd(), "dist/reasoning-v1/spatial/cnd-001-hi-pa-solution-review-v1.html");
  mkdirSync(dirname(output), { recursive: true });
  writeFileSync(output, html, "utf8");
  return { output, questions: questions.length };
}

assert(CND_001_STUDENT_SOLUTION_LOCALIZATION_FREEZE_AUTHORITY_V1.frozen, "CND localization freeze authority must be frozen.");
assert(CND_001_STUDENT_SOLUTION_LOCALIZATION_FREEZE_AUTHORITY_V1.languageReviewStatus.hi === "EDITORIAL_REVIEW_PASSED_AND_FROZEN", "Hindi solution review is not frozen.");
assert(CND_001_STUDENT_SOLUTION_LOCALIZATION_FREEZE_AUTHORITY_V1.languageReviewStatus.pa === "EDITORIAL_REVIEW_PASSED_AND_FROZEN", "Punjabi solution review is not frozen.");
assert(CND_001_QUESTION_STUDIO_REVIEW_ONLY_REGISTRATION_AUTHORITY_V1.questionStudioDiscoverable, "CND registration must be discoverable.");
assert(!CND_001_QUESTION_STUDIO_REVIEW_ONLY_REGISTRATION_AUTHORITY_V1.persistenceAllowed, "CND registration must remain non-persistent.");

const parityCases = parityCorpus();
const diversity = taskDiversity();
routeAndUiRegistration();
const review = writeReviewPack();
const evidence = Object.freeze({
  status: "PASS_CND_001_LOCALIZATION_FREEZE_AND_REVIEW_ONLY_REGISTRATION_V1",
  authorityId: CND_001_QUESTION_STUDIO_REVIEW_ONLY_REGISTRATION_AUTHORITY_V1.authorityId,
  localizationFreezeAuthorityId: CND_001_STUDENT_SOLUTION_LOCALIZATION_FREEZE_AUTHORITY_V1.authorityId,
  permanentQlIds: QLS,
  languages: LANGUAGES,
  parityCases,
  directLocalizedReviewSurfaces: review.questions,
  diversity,
  lifecycle: {
    questionStudioDiscoverable: true,
    registrationStatus: "REGISTERED_REVIEW_ONLY",
    persistenceAllowed: false,
    questionBankWritable: false,
    testEligible: false,
    publiclyPublishable: false,
    automaticStudentPublication: false,
  },
  nextGate: CND_001_QUESTION_STUDIO_REVIEW_ONLY_REGISTRATION_AUTHORITY_V1.nextGate,
});
const evidencePath = resolve(process.cwd(), "dist/reasoning-v1/spatial/cnd-001-localization-freeze-registration-v1-evidence.json");
writeFileSync(evidencePath, `${JSON.stringify(evidence, null, 2)}\n`, "utf8");
console.log(JSON.stringify(evidence));
