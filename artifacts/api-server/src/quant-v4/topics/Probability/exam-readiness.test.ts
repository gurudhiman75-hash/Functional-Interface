import { listPrb001QuestionEntries, runPrb001Pipeline } from "./PRB-001";
import { listPrb002QuestionEntries, runPrb002Pipeline } from "./PRB-002";
import { BANKING_MAINS_PROBABILITY_CHALLENGE_BANK } from "./banking-mains-challenge-bank";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

interface MockPolicy {
  eligible: boolean;
  familyId: string;
  maxPerMock: number;
  effectiveDifficulty: string;
}

function mockPolicyOf(question: { parameters: Record<string, unknown> }): MockPolicy {
  return question.parameters.mockPolicy as MockPolicy;
}

const badStem = /\b[A-Z]+(?:_[A-Z]+)+\b|\btyped event\b|\bwhen applicable\b|\busing target\b|\b(?:objective|outcome-based|event-based|selection-based|counting-based|multi-stage|classical|structured)\s+(?:problem|question|exercise|scenario|task|item|drill|case|example|experiment|setup|model)\b/i;
const badExplanation = /typed event|independent check|permitted range|generated parameter|review trail|publication|validator|renderer|fingerprint/i;

let questions = 0;
let explanationWords = 0;
let fourOptionQuestions = 0;
let fiveOptionQuestions = 0;
let learningOnlyQuestions = 0;

for (const entry of listPrb001QuestionEntries()) {
  const question = runPrb001Pipeline(entry.cpId as any, {
    questionLanguageId: entry.qlId,
    seed: `editorial:${entry.qlId}`,
  });
  assert(question.validation.valid, `${entry.qlId}: ${question.validation.checks.filter((item) => !item.passed).map((item) => item.name).join(", ")}`);
  assert(!badStem.test(question.stem), `${entry.qlId}: artificial stem language`);
  assert(!badExplanation.test(question.explanation.lines.join(" ")), `${entry.qlId}: QA language leaked into explanation`);
  assert(question.explanation.wordCount <= 220, `${entry.qlId}: explanation is too long`);
  const mockPolicy = mockPolicyOf(question);
  assert(mockPolicy.familyId.length > 0, `${entry.qlId}: missing mock family`);
  assert(mockPolicy.maxPerMock === 1, `${entry.qlId}: mock family limit must be one`);
  if (!mockPolicy.eligible) learningOnlyQuestions += 1;
  questions += 1;
  explanationWords += question.explanation.wordCount;
  if (question.options.length === 4) fourOptionQuestions += 1;
  else if (question.options.length === 5) fiveOptionQuestions += 1;
}

for (const entry of listPrb002QuestionEntries()) {
  const question = runPrb002Pipeline(entry.cpId as any, {
    questionLanguageId: entry.qlId,
    seed: `editorial:${entry.qlId}`,
  });
  assert(question.validation.valid, `${entry.qlId}: ${question.validation.checks.filter((item) => !item.passed).map((item) => item.name).join(", ")}`);
  assert(!badStem.test(question.stem), `${entry.qlId}: artificial stem language`);
  assert(!badExplanation.test(question.explanation.lines.join(" ")), `${entry.qlId}: QA language leaked into explanation`);
  assert(question.explanation.wordCount <= 220, `${entry.qlId}: explanation is too long`);
  const mockPolicy = mockPolicyOf(question);
  assert(mockPolicy.eligible, `${entry.qlId}: PRB-002 questions must remain mock eligible`);
  assert(mockPolicy.familyId.length > 0, `${entry.qlId}: missing mock family`);
  assert(mockPolicy.maxPerMock === 1, `${entry.qlId}: mock family limit must be one`);
  questions += 1;
  explanationWords += question.explanation.wordCount;
  if (question.options.length === 4) fourOptionQuestions += 1;
  else if (question.options.length === 5) fiveOptionQuestions += 1;
}

assert(learningOnlyQuestions === 2, "Exactly Q4 and Q10 must be learning-only certainty diagnostics");
const q4 = runPrb001Pipeline("PRB-CP-001", { questionLanguageId: "PRB-QL-004", seed: "editorial:PRB-QL-004" });
const q10 = runPrb001Pipeline("PRB-CP-001", { questionLanguageId: "PRB-QL-010", seed: "editorial:PRB-QL-010" });
assert(!mockPolicyOf(q4).eligible && !mockPolicyOf(q10).eligible, "Q4 and Q10 must be excluded from scored mocks");

const q81 = runPrb002Pipeline("PRB-CP-006", { questionLanguageId: "PRB-QL-506", seed: "editorial:PRB-QL-506" });
const q82 = runPrb002Pipeline("PRB-CP-006", { questionLanguageId: "PRB-QL-507", seed: "editorial:PRB-QL-507" });
assert(q81.explanation.lines.join(" ").includes("P\\!\\left(red-red\\right)"), "Q81 must calculate red-red explicitly");
assert(q81.explanation.lines.join(" ").includes("P\\!\\left(blue-blue\\right)"), "Q81 must calculate blue-blue explicitly");
assert(q82.explanation.lines.join(" ").includes("P\\!\\left(red-blue\\right)"), "Q82 must calculate red-blue explicitly");
assert(q82.explanation.lines.join(" ").includes("P\\!\\left(blue-red\\right)"), "Q82 must calculate blue-red explicitly");

const q115 = runPrb002Pipeline("PRB-CP-008", { questionLanguageId: "PRB-QL-705", seed: "editorial:PRB-QL-705" });
const q116 = runPrb002Pipeline("PRB-CP-008", { questionLanguageId: "PRB-QL-706", seed: "editorial:PRB-QL-706" });
const q118 = runPrb002Pipeline("PRB-CP-008", { questionLanguageId: "PRB-QL-708", seed: "editorial:PRB-QL-708" });
const q127 = runPrb002Pipeline("PRB-CP-009", { questionLanguageId: "PRB-QL-802", seed: "editorial:PRB-QL-802" });
assert(q115.explanation.lines.join(" ").includes("symmetry at the first post"), "Q115 must use the correct symmetry method");
assert(q116.explanation.lines.join(" ").includes("7P3"), "Q116 must expand the remaining-position permutation");
assert(!q118.stem.includes("The probability that"), "Q118 must not reveal the answer through a supplied probability");
assert(q118.explanation.lines.join(" ").includes("asks for a count"), "Q118 must distinguish count from probability");
assert(q127.stem.includes("cricket") && q127.stem.includes("football"), "Q127 must name both games in the stem");
assert(mockPolicyOf(q115).effectiveDifficulty === "Medium", "Routine position symmetry must not be treated as genuine hard mock material");

const challengeIds = new Set<string>();
const challengeFamilies = new Set<string>();
for (const question of BANKING_MAINS_PROBABILITY_CHALLENGE_BANK) {
  assert(question.options.length === 5, `${question.id}: banking mains question must have five options`);
  assert(question.options[question.correctIndex] === question.answer, `${question.id}: answer must match the keyed option`);
  assert(question.explanation.length >= 4, `${question.id}: explanation is not sufficiently worked`);
  assert(question.difficulty === "Hard", `${question.id}: challenge question must be hard`);
  assert(!challengeIds.has(question.id), `${question.id}: duplicate challenge id`);
  assert(!challengeFamilies.has(question.familyId), `${question.id}: duplicate challenge family`);
  challengeIds.add(question.id);
  challengeFamilies.add(question.familyId);
}
assert(BANKING_MAINS_PROBABILITY_CHALLENGE_BANK.length === 10, "Banking mains challenge pool must contain ten questions");

const ssc = runPrb001Pipeline("PRB-CP-001", { examProfile: "SSC_CGL_CHSL", seed: "profile:ssc" });
const bank = runPrb001Pipeline("PRB-CP-001", { examProfile: "BANKING_PRELIMS", seed: "profile:bank" });
const jso = runPrb002Pipeline("PRB-CP-007", { examProfile: "SSC_CGL_JSO", seed: "profile:jso" });
const bankMains = runPrb002Pipeline("PRB-CP-007", { examProfile: "BANKING_MAINS", seed: "profile:bank-mains" });
assert(ssc.options.length === 4, "SSC profile must have four options");
assert(bank.options.length === 5, "Banking profile must have five options");
assert(jso.options.length === 4, "SSC JSO profile must have four options");
assert(bankMains.options.length === 5, "Banking mains profile must have five options");

console.log(JSON.stringify({
  questions,
  averageExplanationWords: Math.round((explanationWords / questions) * 10) / 10,
  fourOptionQuestions,
  fiveOptionQuestions,
  learningOnlyQuestions,
  bankingMainsChallengeQuestions: BANKING_MAINS_PROBABILITY_CHALLENGE_BANK.length,
  profiles: {
    ssc: ssc.examProfile,
    bank: bank.examProfile,
    jso: jso.examProfile,
    bankMains: bankMains.examProfile,
  },
}));
