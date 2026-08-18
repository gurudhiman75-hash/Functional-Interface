import {
  ALG_PERMANENT_ALLOCATION,
  generateAlgPermanentEnglishCandidate,
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
  [/\b-?1x²\b/g, "raw ±1x² coefficient"],
  [/\b-?1x\b/g, "raw ±1x coefficient"],
  [/\+\s*-/g, "plus followed by negative sign"],
  [/\bNaN\b/g, "NaN"],
];

const failures: string[] = [];
function review(condition: boolean, message: string): void {
  if (!condition) failures.push(message);
}

let reviewed = 0;
for (const allocation of ALG_PERMANENT_ALLOCATION) {
  const variants = getAlgPermanentPrototypeIds(allocation.qlId);
  for (let variantIndex = 0; variantIndex < variants.length; variantIndex += 1) {
    for (let seed = 1; seed <= 12; seed += 1) {
      const item = generateAlgPermanentEnglishCandidate(allocation.qlId, seed, variantIndex);
      reviewed += 1;
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

      review(!item.englishImplementationFrozen, `${allocation.qlId}: editorial audit must not imply English freeze`);
      review(!item.active && !item.questionStudioDiscoverable, `${allocation.qlId}: editorial audit leaked downstream lifecycle`);
    }
  }
}

assert(reviewed === 1308, `Expected 1,308 permanent-English editorial samples, reviewed ${reviewed}`);
if (failures.length > 0) {
  const uniqueFailures = [...new Set(failures)];
  const shown = uniqueFailures.slice(0, 200);
  throw new Error(
    `Algebra permanent English editorial audit found ${uniqueFailures.length} violation(s):\n${shown.join("\n")}` +
    (uniqueFailures.length > shown.length ? `\n...and ${uniqueFailures.length - shown.length} more` : ""),
  );
}

console.log(`Algebra permanent English editorial audit V2 passed for ${reviewed} generated samples across 43 permanent QLs and 109 mapped variants`);
