import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  generateMalCp005ExamReadyV2Question,
  cp005ExamReadyV2Stable,
  selectMalCp005ExamSetForDeliveryV2,
  verifyMalCp005ExamReadyV2Question,
} from "./foundation/cp005-exam-ready-v2-runtime";
import {
  MAL_CP005_DISCOVERY_PROTOTYPE_IDS,
  type MalCp005DiscoveryPrototypeId,
} from "./foundation/cp005-types";
import type { MalCp005ExamReadyQuestionV2 } from "./foundation/cp005-exam-ready-v2-types";

function fail(message: string): never {
  throw new Error(message);
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) fail(message);
}

function decodeDirective(directive: string): unknown {
  const match = directive.match(
    /^\[\[EXAMTREE_ALLIGATION_SVG_V1:([A-Za-z0-9_-]+)\]\]$/u,
  );
  assert(match, "Alligation directive has the wrong format.");
  return JSON.parse(Buffer.from(match[1]!, "base64url").toString("utf8"));
}

const seedsPerPrototype = 500;
let generated = 0;
let deterministic = 0;
let independent = 0;
let reselections = 0;
let svgCrosses = 0;
const answerPositions = [0, 0, 0, 0];
const stateKeys = new Set<string>();
const siblingStateKeys = new Set<string>();
const stems = new Set<string>();
const answers = new Set<string>();
const statesByPrototype = new Map<string, Set<string>>();
const contextsByPrototype = new Map<string, Set<string>>();
const questionsByPrototype = new Map<
  MalCp005DiscoveryPrototypeId,
  MalCp005ExamReadyQuestionV2[]
>();

for (const prototypeId of MAL_CP005_DISCOVERY_PROTOTYPE_IDS) {
  const prototypeStates = new Set<string>();
  const prototypeContexts = new Set<string>();
  const prototypeQuestions: MalCp005ExamReadyQuestionV2[] = [];
  statesByPrototype.set(prototypeId, prototypeStates);
  contextsByPrototype.set(prototypeId, prototypeContexts);
  questionsByPrototype.set(prototypeId, prototypeQuestions);

  for (let index = 0; index < seedsPerPrototype; index += 1) {
    const seed = `cp005-exam-ready-v2:${prototypeId}:${index}`;
    const first = generateMalCp005ExamReadyV2Question(prototypeId, seed);
    const second = generateMalCp005ExamReadyV2Question(prototypeId, seed);
    assert(
      cp005ExamReadyV2Stable(first) === cp005ExamReadyV2Stable(second),
      `${prototypeId}/${seed}: generation is not deterministic.`,
    );
    deterministic += 1;
    const verification = verifyMalCp005ExamReadyV2Question(first);
    assert(
      verification.ok,
      `${prototypeId}/${seed}: ${verification.errors.join("; ")}`,
    );
    independent += 1;
    assert(first.permanentQlId === null, "Permanent QL leaked into V2 review.");
    assert(first.runtimeMode === "REVIEW_ONLY", "V2 runtime mode changed.");
    assert(first.reviewStatus === "PENDING_PRODUCT_REVIEW", "Review status changed.");
    assert(first.questionStudioDiscoverable, "Review preview should remain discoverable.");
    assert(
      !first.active &&
        !first.publiclyPublishable &&
        !first.questionBankWritable &&
        !first.testEligible,
      "A delivery flag became enabled.",
    );
    assert(first.difficulty !== ("Hard" as never), "Prototype algebra remains mislabelled Hard.");
    assert(first.numberProvenance.hiddenStateKeys.length === 0, "Hidden number authority remains.");
    assert(first.explanation.visibleLines.length <= 3, "Default explanation is crowded.");
    assert(!/\b1 litres\b/iu.test(cp005ExamReadyV2Stable(first)), "Singular litre grammar regressed.");
    assert(
      first.options.every((option) => !/\/(?:6|7|9|11|12|13|14|15|16|17|18|19|20)(?:\D|$)/u.test(option)),
      `${first.questionId}: awkward option denominator escaped.`,
    );
    const alternative = first.explanation.optionalHelp.alternativeMethod;
    const expectedAlligation =
      prototypeId ===
        "MAL-CP005-PROT-FREE-BLEND-RATIO-FROM-COST-SELLING-RATE-AND-TARGET-PROFIT" ||
      prototypeId ===
        "MAL-CP005-PROT-CHEAPER-IMPURITY-RATIO-FROM-TARGET-PROFIT";
    assert(Boolean(alternative) === expectedAlligation, "Selective alligation policy changed.");
    if (alternative) {
      const payload = decodeDirective(alternative.directive) as Record<string, unknown>;
      assert(payload.kind === "cross" && payload.version === 1, "Alligation payload is not a V1 cross.");
      if (
        prototypeId ===
        "MAL-CP005-PROT-FREE-BLEND-RATIO-FROM-COST-SELLING-RATE-AND-TARGET-PROFIT"
      ) {
        const lower = payload.lower as Record<string, unknown>;
        assert(lower.value === "₹0 per litre" || lower.value === "₹0 per kg", "Free adulterant is not shown at zero cost in the SVG payload.");
      }
      svgCrosses += 1;
    }
    if (first.selectionAttempt > 0) reselections += 1;
    answerPositions[first.correctIndex] += 1;
    generated += 1;
    stateKeys.add(first.stateKey);
    siblingStateKeys.add(first.siblingStateKey);
    stems.add(first.stem);
    answers.add(first.answer);
    prototypeStates.add(first.stateKey);
    const contextMatch = first.stem.match(/milk|juice|syrup|tea|coffee|oil|ghee|rice|wheat|pulses/iu);
    if (contextMatch) prototypeContexts.add(contextMatch[0]!.toLowerCase());
    prototypeQuestions.push(first);
  }
}

assert(generated === 6000, `Expected 6,000 generated questions, received ${generated}.`);
assert(deterministic === 6000, "Determinism count changed.");
assert(independent === 6000, "Independent verification count changed.");
assert(svgCrosses === 1000, `Expected 1,000 responsive SVG crosses, received ${svgCrosses}.`);
assert(
  [...statesByPrototype.values()].every((states) => states.size >= 250),
  `A prototype has insufficient state diversity: ${JSON.stringify(
    Object.fromEntries([...statesByPrototype].map(([key, value]) => [key, value.size])),
  )}`,
);
assert(stateKeys.size >= 3600, `Chapter state diversity is too low: ${stateKeys.size}.`);
assert(stems.size >= 3500, `Stem diversity is too low: ${stems.size}.`);
assert(answers.size >= 120, `Answer diversity is too low: ${answers.size}.`);
assert(
  answerPositions.every((count) => count >= 1300),
  `Answer positions are imbalanced: ${answerPositions.join(", ")}.`,
);
assert(
  [...contextsByPrototype.entries()].every(([prototypeId, contexts]) =>
    prototypeId.includes("CHEAPER") ? contexts.size >= 6 : contexts.size >= 3,
  ),
  `Context diversity is insufficient: ${JSON.stringify(
    Object.fromEntries([...contextsByPrototype].map(([key, value]) => [key, value.size])),
  )}`,
);

// Prove that sibling or inverse questions from the same underlying state cannot coexist.
let siblingCollisionProofs = 0;
for (let index = 0; index < 300; index += 1) {
  const sharedSeed = `cp005-sibling-proof:${index}`;
  const family = MAL_CP005_DISCOVERY_PROTOTYPE_IDS.slice(0, 6).map((prototypeId) =>
    generateMalCp005ExamReadyV2Question(prototypeId, sharedSeed),
  );
  const selection = selectMalCp005ExamSetForDeliveryV2(family);
  if (selection.rejected.length > 0) {
    siblingCollisionProofs += selection.rejected.length;
    assert(
      new Set(selection.accepted.map((question) => question.siblingStateKey)).size ===
        selection.accepted.length,
      "Accepted exam set still contains sibling-state collisions.",
    );
  }
}
assert(siblingCollisionProofs >= 100, "Sibling-state exclusion was not exercised sufficiently.");

// Build a 100-question human-review set with exact 25/25/25/25 answer positions,
// no repeated state and no sibling-state collision.
const review: MalCp005ExamReadyQuestionV2[] = [];
const reviewStateKeys = new Set<string>();
const reviewSiblingKeys = new Set<string>();
const reviewAnswerPositions = [0, 0, 0, 0];
const quotaByPrototype = new Map<MalCp005DiscoveryPrototypeId, number>();
MAL_CP005_DISCOVERY_PROTOTYPE_IDS.forEach((prototypeId, index) =>
  quotaByPrototype.set(prototypeId, index < 4 ? 9 : 8),
);
for (const prototypeId of MAL_CP005_DISCOVERY_PROTOTYPE_IDS) {
  const target = quotaByPrototype.get(prototypeId)!;
  let accepted = 0;
  for (let index = 0; accepted < target && index < 20000; index += 1) {
    const desiredPosition = review.length % 4;
    const candidate = generateMalCp005ExamReadyV2Question(
      prototypeId,
      `cp005-v2-review:${prototypeId}:${index}`,
    );
    if (candidate.correctIndex !== desiredPosition) continue;
    if (reviewStateKeys.has(candidate.stateKey)) continue;
    if (reviewSiblingKeys.has(candidate.siblingStateKey)) continue;
    review.push(candidate);
    reviewStateKeys.add(candidate.stateKey);
    reviewSiblingKeys.add(candidate.siblingStateKey);
    reviewAnswerPositions[candidate.correctIndex] += 1;
    accepted += 1;
  }
  assert(accepted === target, `${prototypeId}: could not fill the review quota.`);
}
assert(review.length === 100, `Expected 100 review questions, received ${review.length}.`);
assert(
  reviewAnswerPositions.every((count) => count === 25),
  `Review answer positions are not 25/25/25/25: ${reviewAnswerPositions.join(", ")}.`,
);
assert(new Set(review.map((question) => question.stateKey)).size === 100, "Review states repeat.");
assert(new Set(review.map((question) => question.siblingStateKey)).size === 100, "Review siblings repeat.");

const outputDirectory = resolve(process.cwd(), "dist/quant-v4");
mkdirSync(outputDirectory, { recursive: true });
const jsonPath = resolve(outputDirectory, "mal-cp005-exam-ready-v2-review.json");
const markdownPath = resolve(outputDirectory, "MAL-CP-005-EXAM-READY-V2-100Q-REVIEW.md");

writeFileSync(
  jsonPath,
  `${JSON.stringify(
    {
      status: "PASS_MAL_CP005_EXAM_READY_REVIEW_V2",
      runtimeId: "MAL-CP005-EN-EXAM-READY-REVIEW-V2",
      permanentQlCount: 0,
      reviewStatus: "PENDING_PRODUCT_REVIEW",
      generated,
      deterministic,
      independent,
      reselections,
      svgCrosses,
      distinctStateKeys: stateKeys.size,
      distinctSiblingStateKeys: siblingStateKeys.size,
      distinctStems: stems.size,
      distinctAnswers: answers.size,
      answerPositions,
      siblingCollisionProofs,
      reviewAnswerPositions,
      review,
    },
    (_key, value) => (typeof value === "bigint" ? value.toString() : value),
    2,
  )}\n`,
  "utf8",
);

const markdown: string[] = [
  "# MAL-CP-005 — Exam-Ready English V2 100-Question Review",
  "",
  "> Review-only candidate. No permanent QLs, Question Bank writes, tests or public delivery are enabled.",
  "",
  `Generated proof questions: **${generated}**`,
  `Distinct states: **${stateKeys.size}**`,
  `Responsive alligation SVG crosses: **${svgCrosses}**`,
  `Review answer positions: **${reviewAnswerPositions.join("/")}**`,
  "",
];
for (const [index, question] of review.entries()) {
  markdown.push(
    `## ${index + 1}. ${question.prototypeId}`,
    "",
    question.stem,
    "",
    ...question.options.map(
      (option, optionIndex) =>
        `${String.fromCharCode(65 + optionIndex)}. ${option}${
          optionIndex === question.correctIndex ? " **✓**" : ""
        }`,
    ),
    "",
    `**Answer:** ${question.answer}`,
    "",
    "**Solution**",
    ...question.explanation.visibleLines.map((line) => `- ${line}`),
    "",
    `**Common mistake:** ${question.explanation.optionalHelp.commonMistake}`,
    "",
  );
  if (question.explanation.optionalHelp.verification) {
    markdown.push(
      "**Verification**",
      ...question.explanation.optionalHelp.verification.map((line) => `- ${line}`),
      "",
    );
  }
  if (question.explanation.optionalHelp.alternativeMethod) {
    const alternative = question.explanation.optionalHelp.alternativeMethod;
    markdown.push(
      `**${alternative.title}**`,
      "",
      alternative.directive,
      "",
      `${alternative.ratioLabel}: **${alternative.ratio}**`,
      "",
    );
  }
  markdown.push("---", "");
}
writeFileSync(markdownPath, `${markdown.join("\n")}\n`, "utf8");

console.log(
  JSON.stringify(
    {
      status: "PASS_MAL_CP005_EXAM_READY_REVIEW_V2",
      generated,
      deterministic,
      independent,
      reselections,
      svgCrosses,
      distinctStateKeys: stateKeys.size,
      distinctSiblingStateKeys: siblingStateKeys.size,
      distinctStems: stems.size,
      distinctAnswers: answers.size,
      answerPositions,
      siblingCollisionProofs,
      reviewCount: review.length,
      reviewAnswerPositions,
    },
    null,
    2,
  ),
);
