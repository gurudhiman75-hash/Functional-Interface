import { listQuantV4Packages } from "../../../../../generation-engine";
import { generateIntCp002Wave02Question } from "./cp002-wave02-runtime";
import {
  INT_CP002_WAVE02_PROTOTYPE_IDS,
  type IntCp002Wave02Question,
} from "./cp002-wave02-types";
import { verifyIntCp002Wave02Candidate } from "./cp002-wave02-verifier";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function stable(value: unknown): string {
  return JSON.stringify(value, (_key, item) => typeof item === "bigint" ? item.toString() : item);
}

function learnerText(question: IntCp002Wave02Question): string {
  return [
    question.stem,
    ...question.options,
    question.explanation.mainRule,
    ...question.explanation.workedSteps,
    question.explanation.examShortcut,
    question.explanation.verification,
    question.explanation.conclusion,
    ...question.explanation.trapAnalysis.map((item) => item.explanation),
  ].join("\n");
}

const registryBeforePackages = listQuantV4Packages();
const registryBefore = stable(registryBeforePackages);
assert(
  !registryBeforePackages.some((item) => String(item.packageId) === "INT-001"),
  "INT-001 was centrally registered before Wave 2 audit",
);

const answerPositions = [0, 0, 0, 0];
const prototypeCoverage = new Set<string>();
const semanticCoverage = new Set<string>();
const difficultyCoverage = new Set<string>();
const stemsByPrototype = new Map<string, Set<string>>();
let questions = 0;
let deterministicChecks = 0;
let structuralChecks = 0;
let independentOptionChecks = 0;
let wrongOptionRejections = 0;
let explanationChecks = 0;
let mathIntegrityChecks = 0;
let lifecycleChecks = 0;
let recoveredSeeds = 0;
let maximumGenerationAttempts = 0;

for (const prototypeId of INT_CP002_WAVE02_PROTOTYPE_IDS) {
  const stems = new Set<string>();
  stemsByPrototype.set(prototypeId, stems);
  for (let index = 1; index <= 100; index += 1) {
    const seed = `int-cp002-wave02-audit:${prototypeId}:${index}`;
    const question = generateIntCp002Wave02Question({ prototypeId, seed });
    const replay = generateIntCp002Wave02Question({ prototypeId, seed });
    assert(stable(question) === stable(replay), `${prototypeId}/${index}: deterministic replay drift`);
    deterministicChecks += 1;

    assert(question.prototypeId === prototypeId, `${prototypeId}/${index}: identity drift`);
    assert(question.permanentQlId === null, `${prototypeId}/${index}: permanent QL allocated prematurely`);
    assert(question.frozenSolveContractId === null, `${prototypeId}/${index}: solve contract frozen prematurely`);
    assert(question.validation.ok, `${prototypeId}/${index}: runtime validation failed: ${question.validation.errors.join("; ")}`);
    assert(question.options.length === 4 && new Set(question.options).size === 4, `${prototypeId}/${index}: options not distinct`);
    assert(question.optionAudit.length === 4, `${prototypeId}/${index}: option audit mismatch`);
    assert(question.optionAudit.filter((item) => item.misconceptionId === "CORRECT").length === 1, `${prototypeId}/${index}: correct option ownership mismatch`);
    assert(question.optionAudit[question.correctIndex]?.misconceptionId === "CORRECT", `${prototypeId}/${index}: correct index mismatch`);
    assert(question.explanation.trapAnalysis.length === 3, `${prototypeId}/${index}: wrong-option analysis incomplete`);
    structuralChecks += 8;

    let accepted = 0;
    question.optionAudit.forEach((option) => {
      const verifies = verifyIntCp002Wave02Candidate(question, option.value);
      if (verifies) accepted += 1;
      if (option.misconceptionId === "CORRECT") {
        assert(verifies, `${prototypeId}/${index}: correct option failed independent verification`);
      } else {
        assert(!verifies, `${prototypeId}/${index}: wrong option ${option.misconceptionId} passed independent verification`);
        wrongOptionRejections += 1;
      }
      independentOptionChecks += 1;
    });
    assert(accepted === 1, `${prototypeId}/${index}: verifier accepted ${accepted} options`);

    assert(question.explanation.workedSteps.length >= 4, `${prototypeId}/${index}: fewer than four worked steps`);
    assert(question.explanation.workedSteps.every((step) => /\d/u.test(step)), `${prototypeId}/${index}: step lacks numerical substitution`);
    assert(question.explanation.workedSteps.some((step) => step.includes("=")), `${prototypeId}/${index}: no visible arithmetic equality`);
    assert(/\d/u.test(question.explanation.verification), `${prototypeId}/${index}: numerical verification missing`);
    assert(question.explanation.conclusion.includes(question.options[question.correctIndex]!), `${prototypeId}/${index}: conclusion omits final answer`);
    explanationChecks += 5;

    const text = learnerText(question);
    assert(!/[\u0000-\u0008\u0009\u000B\u000C\u000E-\u001F]/u.test(text), `${prototypeId}/${index}: control character in learner text`);
    assert(!/(^|[^\\])(?:frac\{|times\b|text\{|Delta\b)/u.test(text.match(/\$\$[\s\S]*?\$\$|\$[^$]+\$/gu)?.join("\n") ?? ""), `${prototypeId}/${index}: bare TeX command`);
    assert(!/<sub>Trace:|INT-QL-|INT-CP002-W02-|requestedSeed|effectiveSeed|generationAttempts|FIND_/u.test(text), `${prototypeId}/${index}: internal metadata leaked`);
    assert(!/\[object Object\]/u.test(text), `${prototypeId}/${index}: malformed object leaked`);
    const displayCount = (text.match(/\$\$/gu) ?? []).length;
    assert(displayCount % 2 === 0, `${prototypeId}/${index}: unbalanced display math`);
    mathIntegrityChecks += 5;

    assert(question.enabled === false, `${prototypeId}/${index}: enabled prematurely`);
    assert(question.stagingStatus === "NOT_STAGED", `${prototypeId}/${index}: staging drift`);
    assert(question.registrationStatus === "NOT_REGISTERED", `${prototypeId}/${index}: registration drift`);
    assert(question.questionStudioDiscoverable === false, `${prototypeId}/${index}: discoverability drift`);
    assert(question.questionBankStatus === "NOT_STORED", `${prototypeId}/${index}: storage drift`);
    assert(question.testEligibility === "INELIGIBLE", `${prototypeId}/${index}: test eligibility drift`);
    assert(question.publiclyPublishable === false, `${prototypeId}/${index}: publication drift`);
    lifecycleChecks += 7;

    assert(question.generationAttempts >= 1 && question.generationAttempts <= 32, `${prototypeId}/${index}: retry count out of range`);
    if (question.generationAttempts > 1) recoveredSeeds += 1;
    maximumGenerationAttempts = Math.max(maximumGenerationAttempts, question.generationAttempts);
    answerPositions[question.correctIndex] += 1;
    prototypeCoverage.add(prototypeId);
    semanticCoverage.add(question.answerSemantic);
    difficultyCoverage.add(question.difficulty);
    stems.add(question.stem);
    questions += 1;
  }
}

for (const prototypeId of INT_CP002_WAVE02_PROTOTYPE_IDS) {
  const count = stemsByPrototype.get(prototypeId)?.size ?? 0;
  assert(count >= 25, `${prototypeId}: insufficient stem diversity (${count}/100)`);
}
assert(prototypeCoverage.size === INT_CP002_WAVE02_PROTOTYPE_IDS.length, "Wave 2 prototype coverage incomplete");
assert(semanticCoverage.size === 4, `Wave 2 answer-semantic coverage incomplete: ${[...semanticCoverage].join(",")}`);
assert(difficultyCoverage.has("Medium") && difficultyCoverage.has("Hard"), "Wave 2 difficulty coverage incomplete");
assert(answerPositions.every((count) => count > 0), `Wave 2 answer-position coverage incomplete: ${answerPositions.join(",")}`);
assert(maximumGenerationAttempts <= 32, "Wave 2 retry ceiling exceeded");

const registryAfterPackages = listQuantV4Packages();
const registryAfter = stable(registryAfterPackages);
assert(registryAfter === registryBefore, "Central Quant V4 registry changed during Wave 2 audit");
assert(!registryAfterPackages.some((item) => String(item.packageId) === "INT-001"), "Wave 2 introduced INT-001 into the central registry");

console.log(JSON.stringify({
  packageId: "INT-001",
  canonicalProblemId: "INT-CP-002",
  auditId: "INT-CP-002-WAVE02-INVERSE-SATURATION",
  provisionalPrototypeCount: INT_CP002_WAVE02_PROTOTYPE_IDS.length,
  permanentQlCount: 0,
  frozenSolveContractCount: 0,
  questions,
  deterministicChecks,
  structuralChecks,
  independentOptionChecks,
  wrongOptionRejections,
  explanationChecks,
  mathIntegrityChecks,
  lifecycleChecks,
  recoveredSeeds,
  maximumGenerationAttempts,
  answerPositions,
  prototypeCoverage: [...prototypeCoverage],
  semanticCoverage: [...semanticCoverage],
  difficultyCoverage: [...difficultyCoverage],
  distinctStemsByPrototype: Object.fromEntries(
    [...stemsByPrototype.entries()].map(([prototypeId, stems]) => [prototypeId, stems.size]),
  ),
  registryChecks: 3,
  enabled: false,
  stagingStatus: "NOT_STAGED",
  registrationStatus: "NOT_REGISTERED",
  questionStudioDiscoverable: false,
  questionBankStatus: "NOT_STORED",
  testEligibility: "INELIGIBLE",
  publiclyPublishable: false,
}, null, 2));
console.log("PASS_INT_CP002_WAVE02_INVERSE_SATURATION");
