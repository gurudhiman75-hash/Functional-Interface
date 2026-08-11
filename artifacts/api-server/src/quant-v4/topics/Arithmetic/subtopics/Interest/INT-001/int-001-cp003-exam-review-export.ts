import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  INT_CP003_QL_IDS,
  generateIntCp003ExamQuestion,
  type IntCp003ExamQuestion,
  type IntCp003QlId,
} from "./cp003-exam-runtime";

function stable(value: unknown): unknown {
  return JSON.parse(JSON.stringify(value, (_key, item) => typeof item === "bigint" ? item.toString() : item));
}

function shuffle<T>(items: readonly T[], seed: string): T[] {
  const output = [...items];
  let state = 2166136261;
  for (const character of seed) {
    state ^= character.charCodeAt(0);
    state = Math.imul(state, 16777619);
  }
  for (let index = output.length - 1; index > 0; index -= 1) {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    const target = (state >>> 0) % (index + 1);
    [output[index], output[target]] = [output[target]!, output[index]!];
  }
  return output;
}

function addGlobalCounts(
  question: IntCp003ExamQuestion,
  positionCounts: number[],
  rateCounts: Map<string, number>,
  representationCounts: Map<string, number>,
): void {
  positionCounts[question.correctIndex]! += 1;
  rateCounts.set(question.rateProfileId, (rateCounts.get(question.rateProfileId) ?? 0) + 1);
  const representation = question.presentation.representation;
  representationCounts.set(representation, (representationCounts.get(representation) ?? 0) + 1);
}

function candidateScore(
  candidate: IntCp003ExamQuestion,
  selected: readonly IntCp003ExamQuestion[],
  positionCounts: readonly number[],
  rateCounts: ReadonlyMap<string, number>,
  representationCounts: ReadonlyMap<string, number>,
  target: "PROSE" | "STRUCTURED",
): number {
  let score = 0;
  if (!selected.some((question) => question.normalizedTemplateKey === candidate.normalizedTemplateKey)) score += 40;
  if (!selected.some((question) => question.rateProfileId === candidate.rateProfileId)) score += 14;
  if (!selected.some((question) => question.difficulty === candidate.difficulty)) score += 4;
  score += Math.max(0, 14 - positionCounts[candidate.correctIndex]!) * 2;
  score += Math.max(0, 5 - (rateCounts.get(candidate.rateProfileId) ?? 0)) * 2;

  if (target === "PROSE") {
    score += candidate.presentation.representation === "STANDARD_PROSE" ? 50 : -1000;
  } else {
    const representation = candidate.presentation.representation;
    score += representation !== "STANDARD_PROSE" ? 50 : -1000;
    score += Math.max(0, 4 - (representationCounts.get(representation) ?? 0)) * 8;
  }
  return score;
}

function chooseQuestion(
  candidates: readonly IntCp003ExamQuestion[],
  selected: readonly IntCp003ExamQuestion[],
  positionCounts: readonly number[],
  rateCounts: ReadonlyMap<string, number>,
  representationCounts: ReadonlyMap<string, number>,
  target: "PROSE" | "STRUCTURED",
): IntCp003ExamQuestion {
  let best: IntCp003ExamQuestion | undefined;
  let bestScore = Number.NEGATIVE_INFINITY;
  for (const candidate of candidates) {
    const isProse = candidate.presentation.representation === "STANDARD_PROSE";
    if ((target === "PROSE") !== isProse) continue;
    if (selected.some((question) => question.numericFamilyKey === candidate.numericFamilyKey)) continue;
    if (selected.some((question) => question.mathematicalFingerprint === candidate.mathematicalFingerprint)) continue;
    if (target === "PROSE" && selected.some((question) => question.normalizedTemplateKey === candidate.normalizedTemplateKey)) continue;
    const score = candidateScore(candidate, selected, positionCounts, rateCounts, representationCounts, target);
    if (score > bestScore) {
      best = candidate;
      bestScore = score;
    }
  }
  if (!best) throw new Error(`could not select a ${target.toLowerCase()} review question`);
  return best;
}

function selectForQl(
  qlId: IntCp003QlId,
  globalPositionCounts: number[],
  globalRateCounts: Map<string, number>,
  globalRepresentationCounts: Map<string, number>,
): IntCp003ExamQuestion[] {
  const candidates = Array.from(
    { length: 280 },
    (_value, index) => generateIntCp003ExamQuestion(qlId, `int-cp003-editorial-review:${qlId}:${index}`),
  );
  const selected: IntCp003ExamQuestion[] = [];

  for (let count = 0; count < 3; count += 1) {
    const prose = chooseQuestion(
      candidates,
      selected,
      globalPositionCounts,
      globalRateCounts,
      globalRepresentationCounts,
      "PROSE",
    );
    selected.push(prose);
    addGlobalCounts(prose, globalPositionCounts, globalRateCounts, globalRepresentationCounts);
  }

  const structured = chooseQuestion(
    candidates,
    selected,
    globalPositionCounts,
    globalRateCounts,
    globalRepresentationCounts,
    "STRUCTURED",
  );
  selected.push(structured);
  addGlobalCounts(structured, globalPositionCounts, globalRateCounts, globalRepresentationCounts);

  const proseQuestions = selected.filter((question) => question.presentation.representation === "STANDARD_PROSE");
  if (proseQuestions.length !== 3) throw new Error(`${qlId}: expected exactly three prose review questions`);
  if (new Set(proseQuestions.map((question) => question.normalizedTemplateKey)).size !== 3) {
    throw new Error(`${qlId}: prose review questions do not have three distinct stem structures`);
  }
  return selected;
}

const positionCounts = [0, 0, 0, 0];
const rateCounts = new Map<string, number>();
const representationCounts = new Map<string, number>();
let selected = INT_CP003_QL_IDS.flatMap((qlId) => selectForQl(
  qlId,
  positionCounts,
  rateCounts,
  representationCounts,
));

function acceptableOrder(rows: readonly IntCp003ExamQuestion[]): boolean {
  let run = 1;
  let maximumRun = 1;
  for (let index = 1; index < rows.length; index += 1) {
    run = rows[index]!.correctIndex === rows[index - 1]!.correctIndex ? run + 1 : 1;
    maximumRun = Math.max(maximumRun, run);
  }
  if (maximumRun > 3) return false;
  for (let index = 0; index + 11 < rows.length; index += 1) {
    const block = rows.slice(index, index + 4).map((question) => question.correctIndex).join("");
    if (
      block === rows.slice(index + 4, index + 8).map((question) => question.correctIndex).join("")
      && block === rows.slice(index + 8, index + 12).map((question) => question.correctIndex).join("")
    ) return false;
  }
  return true;
}

for (let attempt = 0; attempt < 100; attempt += 1) {
  const ordered = shuffle(selected, `cp003-editorial-review-order:${attempt}`);
  if (acceptableOrder(ordered)) {
    selected = ordered;
    break;
  }
  if (attempt === 99) throw new Error("could not remove answer-position pattern");
}

const qlCounts = new Map<string, number>();
const proseCountsByQl = new Map<string, number>();
const templatesByQl = new Map<string, Set<string>>();
const ratesByRepresentation = new Map<string, Set<string>>();
const difficultyCounts = new Map<string, number>();
const finalPositionCounts = [0, 0, 0, 0];

for (const question of selected) {
  qlCounts.set(question.qlId, (qlCounts.get(question.qlId) ?? 0) + 1);
  if (question.presentation.representation === "STANDARD_PROSE") {
    proseCountsByQl.set(question.qlId, (proseCountsByQl.get(question.qlId) ?? 0) + 1);
  }
  if (!templatesByQl.has(question.qlId)) templatesByQl.set(question.qlId, new Set());
  templatesByQl.get(question.qlId)!.add(question.normalizedTemplateKey);
  const representation = question.presentation.representation;
  if (!ratesByRepresentation.has(representation)) ratesByRepresentation.set(representation, new Set());
  ratesByRepresentation.get(representation)!.add(question.rateProfileId);
  difficultyCounts.set(question.difficulty, (difficultyCounts.get(question.difficulty) ?? 0) + 1);
  finalPositionCounts[question.correctIndex]! += 1;
}

if ([...qlCounts.values()].some((count) => count !== 4) || qlCounts.size !== 14) throw new Error("review QL stratification failed");
if ([...proseCountsByQl.values()].some((count) => count !== 3) || proseCountsByQl.size !== 14) throw new Error("review prose-first stratification failed");
if ([...templatesByQl.values()].some((set) => set.size < 4)) throw new Error("review complete-template diversity failed");
if (rateCounts.size < 12) throw new Error(`review rate coverage ${rateCounts.size}/12`);
if (representationCounts.size !== 6) throw new Error(`review representation coverage ${representationCounts.size}/6`);
if ((representationCounts.get("STANDARD_PROSE") ?? 0) !== 42) throw new Error("review must contain exactly 42 prose questions");
if (selected.filter((question) => question.presentation.representation !== "STANDARD_PROSE").length !== 14) {
  throw new Error("review must contain exactly 14 structured questions");
}
for (const [representation, count] of representationCounts) {
  if (representation !== "STANDARD_PROSE" && count < 2) throw new Error(`${representation}: structured representation under-sampled`);
}
if ((ratesByRepresentation.get("STANDARD_PROSE")?.size ?? 0) < 12) throw new Error("prose questions do not cover enough rates");
if (finalPositionCounts.some((count) => count < 10 || count > 18)) throw new Error(`review answer-position balance ${finalPositionCounts.join("/")}`);
const easy = difficultyCounts.get("Easy") ?? 0;
const medium = difficultyCounts.get("Medium") ?? 0;
const hard = difficultyCounts.get("Hard") ?? 0;
if (easy < 1 || medium < 24 || hard < 8) throw new Error(`review calibrated difficulty profile ${easy}/${medium}/${hard}`);

const outputDirectory = join(process.cwd(), "dist", "quant-v4", "int-cp003-exam-readiness-review-pack");
mkdirSync(outputDirectory, { recursive: true });

const cleanReview: string[] = [
  "# INT-CP-003 — Questions and Explanations Review",
  "",
];
selected.forEach((question, index) => {
  cleanReview.push(`## Question ${index + 1}`, "", question.presentation.markdown, "");
  question.options.forEach((option, optionIndex) => {
    cleanReview.push(`${String.fromCharCode(65 + optionIndex)}. ${option.text}`);
  });
  cleanReview.push(
    "",
    `**Answer:** ${String.fromCharCode(65 + question.correctIndex)}. ${question.correctAnswer}`,
    "",
    "### Explanation",
    "",
    question.explanation.keyIdea,
    "",
    ...question.explanation.steps.map((step, stepIndex) => `${stepIndex + 1}. ${step}`),
    "",
    question.explanation.finalAnswer,
    "",
  );
  if (question.explanation.shortcut) {
    cleanReview.push(
      `**Quick method — ${question.explanation.shortcut.title}**`,
      ...question.explanation.shortcut.steps.map((step) => `- ${step}`),
      "",
    );
  }
  if (question.explanation.commonMistake) {
    cleanReview.push("**Common mistake:**", question.explanation.commonMistake, "");
  }
  if (question.explanation.verification) {
    cleanReview.push(
      `**Check — ${question.explanation.verification.method}**`,
      ...question.explanation.verification.steps.map((step) => `- ${step}`),
      "",
    );
  }
  cleanReview.push("---", "");
});

writeFileSync(
  join(outputDirectory, "INT-CP-003-Questions-and-Explanations-Review-V3.md"),
  `${cleanReview.join("\n")}\n`,
);
writeFileSync(
  join(outputDirectory, "int-cp003-56-exam-readiness-data.json"),
  `${JSON.stringify(stable(selected), null, 2)}\n`,
);

const summary = {
  status: "EDITORIAL_DIVERSITY_REVIEW_CANDIDATE",
  questions: selected.length,
  qls: qlCounts.size,
  samplesPerQl: 4,
  proseQuestions: representationCounts.get("STANDARD_PROSE") ?? 0,
  structuredQuestions: selected.filter((question) => question.presentation.representation !== "STANDARD_PROSE").length,
  prosePerQl: 3,
  structuredPerQl: 1,
  distinctMathematicalStates: new Set(selected.map((question) => question.mathematicalFingerprint)).size,
  distinctNumericFamilies: new Set(selected.map((question) => question.numericFamilyKey)).size,
  normalizedTemplatesByQl: Object.fromEntries([...templatesByQl].map(([qlId, set]) => [qlId, set.size])),
  rateCounts: Object.fromEntries(rateCounts),
  rateCoverage: rateCounts.size,
  representationCounts: Object.fromEntries(representationCounts),
  representationCoverage: representationCounts.size,
  difficultyCounts: Object.fromEntries(difficultyCounts),
  answerPositions: finalPositionCounts,
  lifecycle: {
    approvalStatus: "WITHDRAWN_PENDING_REAUDIT",
    enabled: false,
    stagingStatus: "NOT_STAGED",
    registrationStatus: "NOT_REGISTERED",
    questionStudioDiscoverable: false,
    questionBankStatus: "NOT_STORED",
    testEligibility: "INELIGIBLE",
    publiclyPublishable: false,
  },
};
writeFileSync(
  join(outputDirectory, "int-cp003-exam-readiness-review-summary.json"),
  `${JSON.stringify(summary, null, 2)}\n`,
);
console.log(JSON.stringify(summary, null, 2));
console.log("PASS_INT_CP003_EDITORIAL_DIVERSITY_REVIEW_EXPORT");
