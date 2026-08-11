import {
  CP003_STEM_FAMILIES,
  INT_CP003_AUTHORITY_VERSION,
  INT_CP003_QL_IDS,
  INT_CP003_RATE_LIBRARY,
  INT_CP003_SOLVER_VERSION,
  INT_CP003_VERIFIER_VERSION,
  canonicalAnswer,
  generateCp003QuestionContract,
  getIntCp003RegistryEntry,
  verifyAnswer,
  type IntCp003QlId,
} from "./cp003-exam-model";
import {
  INT_CP003_EXAM_GENERATOR_VERSION,
  generateIntCp003ExamQuestion,
  normalizePresentationTemplate,
  type IntCp003ExamQuestion,
} from "./cp003-exam-runtime";
import { presentationFor } from "./cp003-exam-presentation";
import { rateMath, resolve } from "./cp003-exam-support";

function stable(value: unknown): string {
  return JSON.stringify(value, (_key, item) => typeof item === "bigint" ? item.toString() : item);
}

const EXPECTED_STATE_KEYS: Readonly<Record<IntCp003QlId, readonly string[]>> = Object.freeze({
  "INT-QL-053": ["principal", "ratePercent", "years"],
  "INT-QL-054": ["principal", "ratePercent", "years"],
  "INT-QL-055": ["amount", "ratePercent", "years"],
  "INT-QL-056": ["compoundInterest", "ratePercent", "years"],
  "INT-QL-057": ["principal", "amount", "years"],
  "INT-QL-058": ["principal", "amount", "ratePercent"],
  "INT-QL-059": ["principal", "ratePercent", "targetYear"],
  "INT-QL-060": ["nthYearInterest", "ratePercent", "targetYear"],
  "INT-QL-061": ["principal", "nthYearInterest", "targetYear"],
  "INT-QL-062": ["currentAmount", "ratePercent", "currentYear"],
  "INT-QL-063": ["openingAmount", "closingAmount", "yearNumber"],
  "INT-QL-064": ["amountAtYear", "nextYearAmount", "yearNumber"],
  "INT-QL-065": ["principal", "ratePercent", "earlierYear", "laterYear"],
  "INT-QL-066": ["earlierYearInterest", "ratePercent", "earlierYear", "laterYear"],
});

const rateProfiles = new Map(INT_CP003_RATE_LIBRARY.map((profile) => [profile.id, profile]));
const rateCounts = new Map<string, number>();
const representationCounts = new Map<string, number>();
const contextCounts = new Map<string, number>();
const difficultyCounts = new Map<string, number>();
const answerPositions = [0, 0, 0, 0];
const templatesByQl = new Map<IntCp003QlId, Set<string>>();
const fingerprints = new Set<string>();
const numericFamilies = new Set<string>();
const representationRates = new Map<string, Set<string>>();
const rateRepresentations = new Map<string, Set<string>>();
const keyIdeaCounts = new Map<string, number>();
const positionSequence: number[] = [];
let questionCount = 0;
let deterministicChecks = 0;
let optionChecks = 0;
let stateKeyChecks = 0;
let representationChecks = 0;
let explanationChecks = 0;
let lifecycleChecks = 0;
let authorityChecks = 0;
let independentVerifierChecks = 0;
let contextPolicyChecks = 0;
let stemFamilyChecks = 0;
let shortcutCount = 0;
let verificationCount = 0;

function assertQuestion(question: IntCp003ExamQuestion, index: number): void {
  const prefix = `${question.qlId}/${index}`;
  const registryEntry = getIntCp003RegistryEntry(question.qlId);
  const rateProfile = rateProfiles.get(question.rateProfileId);
  if (!rateProfile) throw new Error(`${prefix}: unknown rate profile ${question.rateProfileId}`);

  if (question.permanentQlId !== question.qlId) throw new Error(`${prefix}: permanent QL identity mismatch`);
  if (question.solveContract !== registryEntry.solveContract) throw new Error(`${prefix}: solve-contract lineage mismatch`);
  if (question.answerSemantic !== registryEntry.answerSemantic) throw new Error(`${prefix}: answer-semantic lineage mismatch`);
  if (question.authorityVersion !== INT_CP003_AUTHORITY_VERSION) throw new Error(`${prefix}: authority version mismatch`);
  if (question.generatorVersion !== INT_CP003_EXAM_GENERATOR_VERSION) throw new Error(`${prefix}: generator version mismatch`);
  if (question.solverVersion !== INT_CP003_SOLVER_VERSION) throw new Error(`${prefix}: solver version mismatch`);
  if (question.verifierVersion !== INT_CP003_VERIFIER_VERSION) throw new Error(`${prefix}: verifier version mismatch`);
  authorityChecks += 7;

  const canonical = canonicalAnswer(question.mathematicalState);
  if (!verifyAnswer(question.mathematicalState, canonical)) throw new Error(`${prefix}: canonical answer failed independent relation verification`);
  if (!verifyAnswer(question.mathematicalState, question.solution)) throw new Error(`${prefix}: packaged solution failed independent relation verification`);
  independentVerifierChecks += 2;

  const keys = Object.keys(question.mathematicalState).filter((key) => key !== "qlId").sort();
  const expected = [...EXPECTED_STATE_KEYS[question.qlId]].sort();
  if (keys.join("|") !== expected.join("|")) throw new Error(`${prefix}: irrelevant or missing mathematical-state fields ${keys.join(",")}`);
  stateKeyChecks += keys.length;
  const fingerprintKeys = question.mathematicalFingerprint.split("|").slice(1, -1).map((part) => part.split("=")[0]).sort();
  if (fingerprintKeys.join("|") !== expected.join("|")) throw new Error(`${prefix}: fingerprint contains irrelevant fields`);
  stateKeyChecks += fingerprintKeys.length;

  if (question.options.length !== 4 || new Set(question.options.map((option) => option.text)).size !== 4) throw new Error(`${prefix}: invalid options`);
  if (question.options.filter((option) => option.isCorrect).length !== 1 || !question.options[question.correctIndex]?.isCorrect) throw new Error(`${prefix}: correct option ownership`);
  if (question.answerSemantic === "RATE_PERCENT" && question.options.some((option) => option.text !== rateMath(option.value))) throw new Error(`${prefix}: percentage option is not rendered from its exact value`);
  const independentlyAcceptedOptions = question.options.map((option) => verifyAnswer(question.mathematicalState, option.value));
  if (independentlyAcceptedOptions.filter(Boolean).length !== 1 || !independentlyAcceptedOptions[question.correctIndex]) throw new Error(`${prefix}: independent verifier does not own exactly the displayed correct option`);
  independentVerifierChecks += independentlyAcceptedOptions.length;
  for (const option of question.options) {
    if (!option.calculation || !option.studentFeedback || !option.misconceptionId) throw new Error(`${prefix}: incomplete option diagnosis`);
    if (!option.isCorrect && option.misconceptionId === "CORRECT") throw new Error(`${prefix}: wrong option tagged correct`);
    optionChecks += 1;
  }

  if (!rateProfile.allowedQlIds.includes(question.qlId)) throw new Error(`${prefix}: rate is not eligible for the QL`);
  if (!rateProfile.allowedContexts.includes(question.contextClass)) throw new Error(`${prefix}: rate/context policy violation`);
  if (question.presentation.representation === "BANK_STATEMENT" && question.contextClass !== "BANK_DEPOSIT") throw new Error(`${prefix}: bank statement lacks bank-deposit context`);
  if (!CP003_STEM_FAMILIES[question.qlId].includes(question.presentation.stemFamilyId)) throw new Error(`${prefix}: undeclared stem family ${question.presentation.stemFamilyId}`);
  contextPolicyChecks += 3;
  stemFamilyChecks += 1;

  const markdown = question.presentation.markdown;
  if (question.presentation.representation !== "STANDARD_PROSE") {
    if (!question.presentation.table || !markdown.includes("| ---")) throw new Error(`${prefix}: metadata-only representation`);
  }
  if (question.presentation.representation === "STANDARD_PROSE" && question.presentation.table) throw new Error(`${prefix}: prose unexpectedly carries a table`);
  representationChecks += 1;

  const learnerText = [
    markdown,
    question.explanation.keyIdea,
    ...question.explanation.steps,
    question.explanation.finalAnswer,
    question.explanation.shortcut?.title ?? "",
    ...(question.explanation.shortcut?.steps ?? []),
    question.explanation.commonMistake ?? "",
    question.explanation.verification?.method ?? "",
    ...(question.explanation.verification?.steps ?? []),
  ].join("\n");
  if (/bounded|canonical|verifier|mathematical state|generation seed/iu.test(learnerText)) throw new Error(`${prefix}: engineering terminology leak`);
  if (/\p{Cc}/u.test(learnerText.replace(/\n/gu, ""))) throw new Error(`${prefix}: control-character leak`);
  if (/₹\d{3},\d{3}(?:\D|$)/u.test(learnerText) || /₹\d{1,3},\d{3},\d{3}/u.test(learnerText)) throw new Error(`${prefix}: western currency grouping`);
  if (question.explanation.steps.length < 2 || question.explanation.depths.foundation.steps.length < 2) throw new Error(`${prefix}: underdeveloped explanation`);
  if (!question.explanation.finalAnswer.includes(question.correctAnswer)) throw new Error(`${prefix}: final answer mismatch`);
  if (question.difficulty === "Easy" && question.difficultyProfile.score > 2) throw new Error(`${prefix}: Easy label exceeds the calibrated score ceiling`);
  explanationChecks += 6;
  if (question.explanation.shortcut) shortcutCount += 1;
  if (question.explanation.verification) verificationCount += 1;

  if (question.qlId === "INT-QL-061") {
    const explicitSubstitution = question.explanation.steps.some((step) => /\\times/u.test(step) && /matching the given interest/iu.test(step));
    if (!explicitSubstitution) throw new Error(`${prefix}: inverse-rate option check lacks explicit nth-year substitution`);
  }

  if (question.qlId === "INT-QL-065") {
    if ("amount" in question.mathematicalState || "amountAtYear" in question.mathematicalState) throw new Error(`${prefix}: QL-065 gives away derived amounts`);
    if (!/(difference|subtract|later year)/iu.test(question.explanation.keyIdea)) throw new Error(`${prefix}: QL-065 explanation lost CI relationship`);
  }

  if (question.enabled || question.questionStudioDiscoverable || question.publiclyPublishable || question.stagingStatus !== "NOT_STAGED" || question.registrationStatus !== "NOT_REGISTERED" || question.questionBankStatus !== "NOT_STORED" || question.testEligibility !== "INELIGIBLE") throw new Error(`${prefix}: lifecycle lock failure`);
  lifecycleChecks += 7;
}

for (const qlId of INT_CP003_QL_IDS) {
  const declaredFamilies = CP003_STEM_FAMILIES[qlId];
  const familyContract = generateCp003QuestionContract(qlId, `int-cp003-family-alias:${qlId}`);
  const familyResolved = resolve(familyContract.mathematicalState);
  const familySignatures = new Set<string>();
  for (const stemFamilyId of declaredFamilies) {
    const forcedContract = Object.freeze({
      ...familyContract,
      presentation: Object.freeze({ ...familyContract.presentation, representation: "STANDARD_PROSE" as const, stemFamilyId }),
    });
    const rendered = presentationFor(forcedContract, familyResolved);
    familySignatures.add(normalizePresentationTemplate(rendered.prompt));
  }
  if (familySignatures.size !== declaredFamilies.length) throw new Error(`${qlId}: declared stem families alias to ${familySignatures.size}/${declaredFamilies.length} prose signatures`);
  stemFamilyChecks += declaredFamilies.length;

  const templates = new Set<string>();
  for (let index = 0; index < 100; index += 1) {
    const seed = `int-cp003-exam-readiness:${qlId}:${index}`;
    const first = generateIntCp003ExamQuestion(qlId, seed);
    const second = generateIntCp003ExamQuestion(qlId, seed);
    if (stable(first) !== stable(second)) throw new Error(`${qlId}/${index}: deterministic replay failed`);
    deterministicChecks += 1;
    questionCount += 1;
    assertQuestion(first, index);
    rateCounts.set(first.rateProfileId, (rateCounts.get(first.rateProfileId) ?? 0) + 1);
    representationCounts.set(first.presentation.representation, (representationCounts.get(first.presentation.representation) ?? 0) + 1);
    contextCounts.set(first.contextClass, (contextCounts.get(first.contextClass) ?? 0) + 1);
    difficultyCounts.set(first.difficulty, (difficultyCounts.get(first.difficulty) ?? 0) + 1);
    answerPositions[first.correctIndex] += 1;
    positionSequence.push(first.correctIndex);
    templates.add(first.normalizedTemplateKey);
    fingerprints.add(first.mathematicalFingerprint);
    numericFamilies.add(first.numericFamilyKey);
    if (!representationRates.has(first.presentation.representation)) representationRates.set(first.presentation.representation, new Set());
    representationRates.get(first.presentation.representation)!.add(first.rateProfileId);
    if (!rateRepresentations.has(first.rateProfileId)) rateRepresentations.set(first.rateProfileId, new Set());
    rateRepresentations.get(first.rateProfileId)!.add(first.presentation.representation);
    keyIdeaCounts.set(first.explanation.keyIdea, (keyIdeaCounts.get(first.explanation.keyIdea) ?? 0) + 1);
  }
  if (templates.size < 3) throw new Error(`${qlId}: normalized template diversity ${templates.size}/3`);
  templatesByQl.set(qlId, templates);
}

if (rateCounts.size !== INT_CP003_RATE_LIBRARY.length) throw new Error(`rate coverage ${rateCounts.size}/${INT_CP003_RATE_LIBRARY.length}`);
if (representationCounts.size !== 6) throw new Error(`representation coverage ${representationCounts.size}/6`);
if (contextCounts.size !== 4) throw new Error(`context coverage ${contextCounts.size}/4`);
for (const [representation, rates] of representationRates) {
  const minimum = representation === "BANK_STATEMENT" ? 6 : 10;
  if (rates.size < minimum) throw new Error(`${representation}: rate independence ${rates.size}/${minimum}`);
}
if ([...rateRepresentations.values()].some((representations) => representations.size < 2)) throw new Error("rate remains correlated with too few representations");
if (answerPositions.some((count) => count < 280 || count > 420)) throw new Error(`answer-position imbalance ${answerPositions.join("/")}`);
let maximumRun = 1;
let currentRun = 1;
for (let index = 1; index < positionSequence.length; index += 1) {
  if (positionSequence[index] === positionSequence[index - 1]) currentRun += 1;
  else currentRun = 1;
  maximumRun = Math.max(maximumRun, currentRun);
}
if (maximumRun > 8) throw new Error(`answer-position run too long: ${maximumRun}`);
let repeatedCycle = false;
for (let index = 0; index + 15 < positionSequence.length; index += 1) {
  const block = positionSequence.slice(index, index + 4).join("");
  if (block === positionSequence.slice(index + 4, index + 8).join("") && block === positionSequence.slice(index + 8, index + 12).join("") && block === positionSequence.slice(index + 12, index + 16).join("")) {
    repeatedCycle = true;
    break;
  }
}
if (repeatedCycle) throw new Error("fixed answer-position cycle detected");
if (!["Easy", "Medium", "Hard"].every((label) => difficultyCounts.has(label))) throw new Error("difficulty bands incomplete");
if (numericFamilies.size < 800) throw new Error(`numeric-family diversity ${numericFamilies.size}/800`);
if (fingerprints.size < 1000) throw new Error(`mathematical-state diversity ${fingerprints.size}/1000`);
if (shortcutCount >= questionCount * 0.6) throw new Error("shortcut section is still near-universal");
if (verificationCount >= questionCount * 0.4) throw new Error("verification section is still near-universal");
if (Math.max(...keyIdeaCounts.values()) > questionCount * 0.1) throw new Error("one generic key idea dominates the chapter");

const summary = {
  status: "SECOND_REMEDIATION_REVIEW_CANDIDATE",
  authorityVersion: INT_CP003_AUTHORITY_VERSION,
  generatorVersion: INT_CP003_EXAM_GENERATOR_VERSION,
  solverVersion: INT_CP003_SOLVER_VERSION,
  verifierVersion: INT_CP003_VERIFIER_VERSION,
  questionCount,
  deterministicChecks,
  authorityChecks,
  independentVerifierChecks,
  stateKeyChecks,
  optionChecks,
  representationChecks,
  contextPolicyChecks,
  stemFamilyChecks,
  explanationChecks,
  lifecycleChecks,
  rateCounts: Object.fromEntries(rateCounts),
  representationCounts: Object.fromEntries(representationCounts),
  contextCounts: Object.fromEntries(contextCounts),
  difficultyCounts: Object.fromEntries(difficultyCounts),
  answerPositions,
  maximumAnswerPositionRun: maximumRun,
  rateCoverage: rateCounts.size,
  representationCoverage: representationCounts.size,
  contextCoverage: contextCounts.size,
  numericFamilyCount: numericFamilies.size,
  mathematicalFingerprintCount: fingerprints.size,
  normalizedTemplatesByQl: Object.fromEntries([...templatesByQl].map(([qlId, set]) => [qlId, set.size])),
  declaredStemFamiliesByQl: Object.fromEntries(INT_CP003_QL_IDS.map((qlId) => [qlId, CP003_STEM_FAMILIES[qlId].length])),
  shortcutCount,
  verificationCount,
  lifecycle: {
    enabled: false,
    stagingStatus: "NOT_STAGED",
    registrationStatus: "NOT_REGISTERED",
    questionStudioDiscoverable: false,
    questionBankStatus: "NOT_STORED",
    testEligibility: "INELIGIBLE",
    publiclyPublishable: false,
  },
};
console.log(JSON.stringify(summary, null, 2));
console.log("PASS_INT_CP003_EXAM_READINESS_REMEDIATION");
