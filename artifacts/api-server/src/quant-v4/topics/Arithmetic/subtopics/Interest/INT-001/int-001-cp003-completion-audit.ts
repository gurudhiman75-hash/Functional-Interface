import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  INT_CP003_FINAL_REGISTRY,
  INT_CP003_LEGACY_FAMILIES,
  INT_CP003_QL_IDS,
  generateIntCp003Question,
  verifyIntCp003Option,
} from "./int-001-cp003-final-runtime";

function stable(value: unknown): string {
  return JSON.stringify(value, (_key, item) => typeof item === "bigint" ? item.toString() : item);
}

const answerPositions = [0, 0, 0, 0];
const difficulties = new Set<string>();
const representations = new Set<string>();
const semantics = new Set<string>();
const stemsByQl = new Map<string, Set<string>>();
const fingerprintsByQl = new Map<string, Set<string>>();
let questionCount = 0;
let deterministicChecks = 0;
let structuralChecks = 0;
let independentOptionChecks = 0;
let wrongOptionRejections = 0;
let explanationChecks = 0;
let lifecycleChecks = 0;
let frozenObjectChecks = 0;

for (const qlId of INT_CP003_QL_IDS) {
  const stems = new Set<string>();
  const fingerprints = new Set<string>();
  for (let index = 0; index < 100; index += 1) {
    const seed = `int-cp003-completion:${qlId}:${index}`;
    const first = generateIntCp003Question(qlId, seed);
    const second = generateIntCp003Question(qlId, seed);
    if (stable(first) !== stable(second)) throw new Error(`${qlId}/${index}: deterministic replay failed.`);
    deterministicChecks += 1;
    questionCount += 1;
    if (!first.validation.ok) throw new Error(`${qlId}/${index}: ${first.validation.errors.join(" | ")}`);
    if (first.options.length !== 4 || new Set(first.options).size !== 4) throw new Error(`${qlId}/${index}: invalid options.`);
    if (first.optionAudit.length !== 4 || first.explanation.trapAnalysis.length !== 3) throw new Error(`${qlId}/${index}: incomplete option audit.`);
    if (first.optionAudit.some((option) => option.misconceptionId === "OFFSET")) throw new Error(`${qlId}/${index}: generic fallback distractor reached the final runtime.`);
    if (first.explanation.workedSteps.length < 4) throw new Error(`${qlId}/${index}: incomplete worked explanation.`);
    structuralChecks += 10;
    explanationChecks += 6;

    const accepted = first.optionAudit.map((option) => verifyIntCp003Option(qlId, seed, option.value));
    independentOptionChecks += accepted.length;
    wrongOptionRejections += accepted.filter((acceptedValue, optionIndex) => optionIndex !== first.correctIndex && !acceptedValue).length;
    if (accepted.filter(Boolean).length !== 1 || !accepted[first.correctIndex]) throw new Error(`${qlId}/${index}: verifier ownership failed.`);

    if (
      first.enabled
      || first.questionStudioDiscoverable
      || first.publiclyPublishable
      || first.questionBankStatus !== "NOT_STORED"
      || first.testEligibility !== "INELIGIBLE"
      || first.stagingStatus !== "NOT_STAGED"
      || first.registrationStatus !== "NOT_REGISTERED"
    ) throw new Error(`${qlId}/${index}: lifecycle boundary failed.`);
    lifecycleChecks += 7;

    if (!Object.isFrozen(first) || !Object.isFrozen(first.options) || !Object.isFrozen(first.optionAudit) || !Object.isFrozen(first.explanation)) {
      throw new Error(`${qlId}/${index}: generated package is not deeply frozen.`);
    }
    frozenObjectChecks += 4;

    const learnerText = [
      first.stem,
      ...first.options,
      first.explanation.mainRule,
      ...first.explanation.workedSteps,
      first.explanation.examShortcut,
      first.explanation.verification,
      first.explanation.conclusion,
      ...first.explanation.trapAnalysis.map((trap) => trap.explanation),
    ].join("\n");
    if (/INT-QL-|INT-CP003|prototype|effectiveSeed|generationAttempts/iu.test(learnerText)) {
      throw new Error(`${qlId}/${index}: learner-facing internal identity leak.`);
    }
    if (/\p{Cc}/u.test(learnerText.replace(/\n/gu, ""))) throw new Error(`${qlId}/${index}: control-character leak.`);

    answerPositions[first.correctIndex] += 1;
    difficulties.add(first.difficulty);
    representations.add(first.representation);
    semantics.add(first.answerSemantic);
    stems.add(first.stem);
    fingerprints.add(first.mathematicalFingerprint);
  }
  if (stems.size < 25) throw new Error(`${qlId}: insufficient stem diversity ${stems.size}/25.`);
  if (fingerprints.size < 12) throw new Error(`${qlId}: insufficient exact-state diversity ${fingerprints.size}/12.`);
  stemsByQl.set(qlId, stems);
  fingerprintsByQl.set(qlId, fingerprints);
}

if (INT_CP003_FINAL_REGISTRY.length !== 14) throw new Error("INT-CP-003 permanent registry must contain 14 discovered authorities.");
if (INT_CP003_QL_IDS[0] !== "INT-QL-053" || INT_CP003_QL_IDS.at(-1) !== "INT-QL-066") throw new Error("INT-CP-003 QL range is not contiguous.");
if (new Set(INT_CP003_FINAL_REGISTRY.map((entry) => entry.solveContract)).size !== 14) throw new Error("Solve-contract IDs are not unique.");
const ownedLegacy = new Set(INT_CP003_FINAL_REGISTRY.flatMap((entry) => entry.legacyFamilies));
for (const family of INT_CP003_LEGACY_FAMILIES) {
  if (!ownedLegacy.has(family)) throw new Error(`Unowned CP-003 legacy family: ${family}`);
}
if (ownedLegacy.size !== INT_CP003_LEGACY_FAMILIES.length) throw new Error("Legacy family ownership contains duplicates or unknown entries.");
if (answerPositions.some((count) => count === 0)) throw new Error(`Missing answer position: ${answerPositions.join("/")}`);
if (["Easy", "Medium", "Hard"].some((difficulty) => !difficulties.has(difficulty))) throw new Error("Difficulty coverage incomplete.");
if (["NARRATIVE", "TABLE", "BALANCE_LEDGER", "GROWTH_FACTOR_CARD"].some((representation) => !representations.has(representation))) throw new Error("Representation coverage incomplete.");
if (["MONEY", "PRINCIPAL", "RATE_PERCENT", "TIME_YEARS"].some((semantic) => !semantics.has(semantic))) throw new Error("Answer-semantic coverage incomplete.");

const outputDirectory = join(process.cwd(), "dist", "quant-v4", "int-cp003-annual-compound-completion");
mkdirSync(outputDirectory, { recursive: true });
const summary = {
  releaseCandidateId: "INT-CP-003-EN-v1-candidate",
  status: "FINAL_ENGLISH_REVIEW_CANDIDATE",
  qlRange: "INT-QL-053..INT-QL-066",
  qlCount: INT_CP003_QL_IDS.length,
  legacyFamiliesOwned: INT_CP003_LEGACY_FAMILIES.length,
  openMeaningfulOwnedGaps: 0,
  questionCount,
  deterministicChecks,
  structuralChecks,
  independentOptionChecks,
  wrongOptionRejections,
  explanationChecks,
  lifecycleChecks,
  frozenObjectChecks,
  answerPositions,
  difficulties: [...difficulties].sort(),
  representations: [...representations].sort(),
  answerSemantics: [...semantics].sort(),
  diversityByQl: Object.fromEntries(INT_CP003_QL_IDS.map((qlId) => [qlId, {
    stems: stemsByQl.get(qlId)!.size,
    fingerprints: fingerprintsByQl.get(qlId)!.size,
  }])),
  disposition: {
    mergedAsParameters: [
      "two-year and three-year closed forms into annual amount/interest",
      "doubling and general amount multiple into exact rate/time factor inverses",
      "specific-year and nth-year wording into one yearly-interest authority",
      "narrative, table, balance ledger and growth-factor card as representations",
    ],
    reassigned: [
      "SI-versus-CI differences to INT-CP-006",
      "sub-annual frequency and broken periods to INT-CP-004",
      "variable rates and growth/decay applications to INT-CP-005",
      "cash flows and instalments to INT-CP-008/009",
    ],
    rejected: [
      "floating logarithm or root inversion",
      "unstated compounding frequency",
      "fractional annual periods without an explicit convention",
      "context-only QL multiplication",
    ],
  },
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
writeFileSync(join(outputDirectory, "int-cp003-completion-summary.json"), `${JSON.stringify(summary, null, 2)}\n`);
writeFileSync(join(outputDirectory, "int-cp003-final-registry.json"), `${JSON.stringify(INT_CP003_FINAL_REGISTRY, null, 2)}\n`);
console.log(JSON.stringify(summary, null, 2));
console.log("PASS_INT_CP003_ANNUAL_COMPOUND_COMPLETION");
