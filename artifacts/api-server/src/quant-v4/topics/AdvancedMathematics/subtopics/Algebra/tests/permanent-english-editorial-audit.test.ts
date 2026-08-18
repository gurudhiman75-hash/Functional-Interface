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
  [/\bundefined\b/g, "undefined"],
];

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

      assert(question.length >= 12, `${allocation.qlId}/${item.prototypeId}/seed-${seed}: question too short`);
      assert(explanation.length >= 35, `${allocation.qlId}/${item.prototypeId}/seed-${seed}: explanation too short`);
      assert(/[A-Za-z]/.test(question), `${allocation.qlId}/${item.prototypeId}/seed-${seed}: question has no readable English text`);
      assert(/[A-Za-z]/.test(explanation), `${allocation.qlId}/${item.prototypeId}/seed-${seed}: explanation has no readable English prose`);
      assert(question !== explanation, `${allocation.qlId}/${item.prototypeId}/seed-${seed}: explanation merely repeats question`);
      assert(explanation.split(/\s+/).length >= 7, `${allocation.qlId}/${item.prototypeId}/seed-${seed}: explanation is too formula-only`);

      for (const token of forbiddenInternalTokens) {
        assert(!combined.includes(token), `${allocation.qlId}/${item.prototypeId}/seed-${seed}: leaked internal token ${token}`);
      }
      for (const [pattern, label] of obviousFormattingDefects) {
        pattern.lastIndex = 0;
        assert(!pattern.test(combined), `${allocation.qlId}/${item.prototypeId}/seed-${seed}: ${label}`);
      }

      assert(!item.englishImplementationFrozen, `${allocation.qlId}: editorial audit must not imply English freeze`);
      assert(!item.active && !item.questionStudioDiscoverable, `${allocation.qlId}: editorial audit leaked downstream lifecycle`);
    }
  }
}

assert(reviewed === 1260, `Expected 1,260 permanent-English editorial samples, reviewed ${reviewed}`);
console.log(`Algebra permanent English editorial audit passed for ${reviewed} generated samples across 40 permanent QLs and 105 mapped variants`);
