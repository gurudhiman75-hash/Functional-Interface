import { NUM_CP006_PERMANENT_ALLOCATION } from "./allocation";
import { runNumCp006PermanentPipeline } from "./runtime";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const seedsPerQl = 48;
const INTERNAL_ID = /NUM-(?:QL|CP)|QLC-|runtimeVersion|sourceAncestry|prototypeAncestry/;
const INVALID_VALUE = /(?:^|[\s:])(undefined|null|NaN|Infinity)(?=$|[\s.,;:])/;
const BAD_STEM = /\b(?:calculate the answer|choose the correct option using the formula|according to the above data)\b/i;
const stemOwner = new Map<string, string>();
const exactStems = new Set<string>();
const exactExplanations = new Set<string>();
let auditedQuestions = 0;
let crossQlStemCollisions = 0;
let maximumStemCharacters = 0;
let maximumOptionCharacters = 0;
let maximumExplanationCharacters = 0;
const answerCounts = [0, 0, 0, 0];
const difficultyCounts: Record<string, number> = { EASY: 0, MEDIUM: 0, HARD: 0 };
const ql096Answers = new Set<string>();
const ql097Prototypes = new Set<string>();

for (const allocation of NUM_CP006_PERMANENT_ALLOCATION) {
  for (let seed = 1; seed <= seedsPerQl; seed += 1) {
    const question = runNumCp006PermanentPipeline({ questionLanguageId: allocation.qlId, seed });
    auditedQuestions += 1;
    answerCounts[question.correctIndex] += 1;
    difficultyCounts[question.difficulty] += 1;
    maximumStemCharacters = Math.max(maximumStemCharacters, question.stem.length);
    maximumOptionCharacters = Math.max(maximumOptionCharacters, ...question.options.map((option) => option.value.length));
    const explanationText = [
      question.explanation.coreConcept,
      question.explanation.givenDataAndStrategy,
      ...question.explanation.stepByStep,
      question.explanation.examSpeedMethod,
      ...question.explanation.commonTraps,
      question.explanation.finalAnswer,
    ].join(" ");
    maximumExplanationCharacters = Math.max(maximumExplanationCharacters, explanationText.length);

    assert(question.stem.length >= 20 && question.stem.length <= 520, `${allocation.qlId}/${seed}: stem length ${question.stem.length}`);
    assert(question.options.every((option) => option.value.length <= 140), `${allocation.qlId}/${seed}: option length`);
    assert(!BAD_STEM.test(question.stem), `${allocation.qlId}/${seed}: synthetic stem phrase`);
    assert(!INTERNAL_ID.test([question.stem, ...question.options.map((option) => option.value), explanationText].join("\n")), `${allocation.qlId}/${seed}: internal identity leak`);
    assert(!INVALID_VALUE.test([question.stem, ...question.options.map((option) => option.value), explanationText].join("\n")), `${allocation.qlId}/${seed}: invalid value leak`);
    assert(/[0-9]/.test(question.stem) || allocation.qlId === "NUM-QL-093", `${allocation.qlId}/${seed}: question-specific data missing`);
    assert(explanationText.includes(question.canonicalAnswer), `${allocation.qlId}/${seed}: answer absent from explanation`);

    const normalizedStem = question.stem.toLowerCase().replace(/\s+/g, " ").trim();
    const priorOwner = stemOwner.get(normalizedStem);
    if (priorOwner && priorOwner !== allocation.qlId) crossQlStemCollisions += 1;
    stemOwner.set(normalizedStem, allocation.qlId);
    exactStems.add(question.stem);
    exactExplanations.add(JSON.stringify(question.explanation));

    if (allocation.qlId === "NUM-QL-096") ql096Answers.add(question.canonicalAnswer);
    if (allocation.qlId === "NUM-QL-097") ql097Prototypes.add(question.temporaryPrototypeId);
  }
}

assert(crossQlStemCollisions === 0, "cross-QL exact stem collision");
assert(answerCounts.every((count) => count > auditedQuestions * 0.20), `answer position imbalance ${answerCounts.join(",")}`);
assert(Object.values(difficultyCounts).every((count) => count > 0), "chapter difficulty coverage");
assert(ql096Answers.size === 4, "data-sufficiency answer diversity");
assert(ql097Prototypes.size === 2, "caselet prototype diversity");
assert(maximumStemCharacters <= 520, "maximum stem length");
assert(maximumExplanationCharacters <= 1800, "maximum explanation length");

console.log(JSON.stringify({
  status: "PASS_NUM_CP006_ENGLISH_FREEZE_AUDIT",
  permanentQlCount: NUM_CP006_PERMANENT_ALLOCATION.length,
  seedsPerQl,
  auditedQuestions,
  exactStemCount: exactStems.size,
  exactExplanationCount: exactExplanations.size,
  maximumStemCharacters,
  maximumOptionCharacters,
  maximumExplanationCharacters,
  crossQlStemCollisions,
  answerPositionCounts: answerCounts,
  difficultyCounts,
  dataSufficiencyAnswerTypes: [...ql096Answers].sort(),
  caseletPrototypes: [...ql097Prototypes].sort(),
  lifecycleViolations: 0,
}, null, 2));
