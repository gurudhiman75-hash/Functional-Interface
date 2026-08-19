import {
  ALG_PERMANENT_ALLOCATION,
  generateAlgPermanentEnglishReviewV2,
  getAlgPermanentPrototypeIds,
} from "../permanent";

function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(message);
}

const forbiddenInternalTokens = [
  "UNVERIFIED_DRAFT",
  "candidateId",
  "permanentQlId",
  "sourceStatus",
  "solveMode",
  "PERMANENT_IDENTITY_ENGLISH_CANDIDATE",
];

const obviousFormattingDefects: Array<[RegExp, string]> = [
  [/(^|\W)-?1x²\b/g, "raw ±1x² coefficient"],
  [/(^|\W)-?1x\b/g, "raw ±1x coefficient"],
  [/\+\s*-/g, "plus followed by negative sign"],
  [/\(x - -[0-9]/g, "double-negative factor"],
  [/-?[0-9]+\/1 [+-] √/g, "integer surd rendered as n/1"],
  [/Hence k = ([^.,;]+), giving k = \1\./g, "duplicated k result"],
  [/hence x = ([^ .]+) and x = \1\. Therefore x = \1\./g, "duplicated absolute-value root"],
  [/≥ ([+-]?[0-9]+\/[0-9]+) = \1\./g, "duplicated rational bound"],
  [/\bNaN\b/g, "NaN"],
];

const failures: string[] = [];
function review(condition: boolean, message: string): void {
  if (!condition) failures.push(message);
}

let reviewed = 0;
let reviewCoordinateSamples = 0;
for (let allocationIndex = 0; allocationIndex < ALG_PERMANENT_ALLOCATION.length; allocationIndex += 1) {
  const allocation = ALG_PERMANENT_ALLOCATION[allocationIndex]!;
  const variants = getAlgPermanentPrototypeIds(allocation.qlId);
  for (let variantIndex = 0; variantIndex < variants.length; variantIndex += 1) {
    const seeds = [...Array.from({ length: 12 }, (_, index) => index + 1), 101 + allocationIndex * 17 + variantIndex * 7];
    for (let seedIndex = 0; seedIndex < seeds.length; seedIndex += 1) {
      const seed = seeds[seedIndex]!;
      const item = generateAlgPermanentEnglishReviewV2(allocation.qlId, seed, variantIndex);
      reviewed += 1;
      if (seedIndex === 12) reviewCoordinateSamples += 1;
      const question = item.question.trim();
      const explanation = item.explanation.trim();
      const combined = `${question}\n${explanation}`;
      const prefix = `${allocation.qlId}/${item.prototypeId}/seed-${seed}`;

      review(question.length >= 12, `${prefix}: question too short`);
      review(explanation.length >= 35, `${prefix}: explanation too short`);
      review(/[A-Za-z]/.test(question), `${prefix}: question has no readable English text`);
      review(/[A-Za-z]/.test(explanation), `${prefix}: explanation has no readable English prose`);
      review(question !== explanation, `${prefix}: explanation merely repeats question`);
      review(explanation.split(/\s+/).length >= 7, `${prefix}: explanation is too formula-only`);

      for (const token of forbiddenInternalTokens) {
        review(!combined.includes(token), `${prefix}: leaked internal token ${token}`);
      }
      for (const [pattern, label] of obviousFormattingDefects) {
        pattern.lastIndex = 0;
        review(!pattern.test(combined), `${prefix}: ${label}`);
      }

      if (["ALG-CP014-CAND-004", "ALG-CP014-CAND-005", "ALG-CP014-CAND-006", "ALG-CP014-CAND-007", "ALG-CP014-CAND-008"].includes(item.prototypeId)) {
        review(question.includes("I. "), `${prefix}: Statement I missing from learner question`);
        review(question.includes("II. "), `${prefix}: Statement II missing from learner question`);
      }

      review(!item.englishImplementationFrozen, `${allocation.qlId}: editorial audit must not imply English freeze`);
      review(!item.active && !item.questionStudioDiscoverable, `${allocation.qlId}: editorial audit leaked downstream lifecycle`);
    }
  }
}

assert(reviewed === 1417, `Expected 1,417 V2 editorial samples, reviewed ${reviewed}`);
assert(reviewCoordinateSamples === 109, `Expected 109 all-variant review-coordinate samples, got ${reviewCoordinateSamples}`);
if (failures.length > 0) {
  const uniqueFailures = [...new Set(failures)];
  const shown = uniqueFailures.slice(0, 200);
  throw new Error(
    `Algebra permanent English V2 editorial audit found ${uniqueFailures.length} violation(s):\n${shown.join("\n")}` +
    (uniqueFailures.length > shown.length ? `\n...and ${uniqueFailures.length - shown.length} more` : ""),
  );
}

console.log(`Algebra permanent English editorial audit V3 passed for ${reviewed} generated samples across 43 permanent QLs and 109 mapped variants`);
