import { deterministicIndex, rotate } from "./foundation/prng";
import { generateIntCp001Prototype } from "./foundation/cp001-pipeline";
import { formatDurationYears } from "./foundation/cp001-presentation";
import {
  addRational,
  rational,
  subtractRational,
} from "./foundation/rational";
import type { IntCp001PrototypeId, Rational } from "./foundation/types";
import { generateIntCp001Wave2Prototype } from "./gap-wave-02/pipeline";
import type { IntCp001Wave2PrototypeId } from "./gap-wave-02/types";
import { generateIntCp001RobustClosurePrototype } from "./final-closure/final-closure-robust";
import type { IntCp001ClosurePrototypeId } from "./final-closure/final-closure";
import {
  getIntCp001FinalRegistryEntry,
  INT_CP001_RELEASE_ID,
  type IntCp001FinalQlId,
  type IntCp001SourceAdapter,
} from "./cp001-final-registry";

interface CommonSourceItem {
  stem: string;
  options: string[];
  optionAudit: Array<{ text: string; misconceptionId: string; result: { semantic: string; value: unknown } }>;
  correctIndex: number;
  explanation: {
    notice: string;
    relation: string;
    steps: string[];
    verification: string;
    conclusion: string;
    commonTrap: string;
  };
  reasoningGraph: unknown;
  solution: { semantic: string; value: unknown };
  validation: { ok: boolean; errors: string[]; matchingCandidates?: string[] };
  difficulty: "Easy" | "Medium" | "Hard";
  difficultyEvidence: string[];
  mathematicalFingerprint: string;
  parameters: unknown;
  taskDirection: string;
  answerSemantic: string;
}

interface ClosureTimelineParameters {
  hiddenState: {
    earlierTimeYears: Rational;
    laterTimeYears: Rational;
  };
}

function generateSource(adapter: IntCp001SourceAdapter, seed: string): CommonSourceItem {
  switch (adapter.kind) {
    case "FOUNDATION":
      return generateIntCp001Prototype(adapter.prototypeId as IntCp001PrototypeId, seed) as unknown as CommonSourceItem;
    case "WAVE2":
      return generateIntCp001Wave2Prototype(adapter.prototypeId as IntCp001Wave2PrototypeId, seed) as unknown as CommonSourceItem;
    case "CLOSURE":
      return generateIntCp001RobustClosurePrototype(adapter.prototypeId as IntCp001ClosurePrototypeId, seed) as unknown as CommonSourceItem;
  }
}

function exactResultKey(result: { semantic: string; value: unknown }): string {
  return JSON.stringify(result, (_key, item) => typeof item === "bigint" ? item.toString() : item);
}

function normaliseSourceOptionOwnership(source: CommonSourceItem): CommonSourceItem {
  const solutionKey = exactResultKey(source.solution);
  const matchingIndices = source.optionAudit
    .map((option, index) => exactResultKey(option.result) === solutionKey ? index : -1)
    .filter((index) => index >= 0);

  const currentOwnershipIsValid =
    source.correctIndex >= 0
    && source.correctIndex < source.optionAudit.length
    && source.optionAudit[source.correctIndex]?.misconceptionId === "CORRECT"
    && matchingIndices.includes(source.correctIndex);
  if (currentOwnershipIsValid || matchingIndices.length !== 1) return source;

  const repairedCorrectIndex = matchingIndices[0]!;
  const optionAudit = source.optionAudit.map((option, index) => ({
    ...option,
    misconceptionId: index === repairedCorrectIndex
      ? "CORRECT"
      : option.misconceptionId === "CORRECT"
        ? "SOURCE_CORRECT_LABEL_REASSIGNED"
        : option.misconceptionId,
  }));
  const repairableMessages = new Set([
    "Correct index is invalid.",
    "Conclusion does not state the displayed answer.",
  ]);
  const remainingErrors = source.validation.errors.filter((error) => !repairableMessages.has(error));

  return {
    ...source,
    optionAudit,
    correctIndex: repairedCorrectIndex,
    validation: {
      ...source.validation,
      ok: remainingErrors.length === 0,
      errors: remainingErrors,
    },
  };
}

function normaliseTemporalTimeOptions(
  source: CommonSourceItem,
  adapter: IntCp001SourceAdapter,
): CommonSourceItem {
  if (adapter.prototypeId !== "INT-CP001-CLOSE-PROT-TIME-FROM-TWO-AMOUNT-RATIO") return source;

  const parameters = source.parameters as ClosureTimelineParameters;
  const earlier = parameters.hiddenState.earlierTimeYears;
  const later = parameters.hiddenState.laterTimeYears;
  const candidates: CommonSourceItem["optionAudit"] = [];
  const seen = new Set<string>();
  const addCandidate = (value: Rational, misconceptionId: string): void => {
    if (value.numerator <= 0n || value.denominator > 2n) return;
    const text = formatDurationYears(value);
    if (seen.has(text)) return;
    seen.add(text);
    candidates.push({
      text,
      misconceptionId,
      result: { semantic: source.solution.semantic, value },
    });
  };

  addCandidate(source.solution.value as Rational, "CORRECT");
  addCandidate(subtractRational(later, earlier), "REPORTED_TIME_GAP");
  addCandidate(earlier, "RETURNED_KNOWN_TIME");
  addCandidate(addRational(earlier, rational(1)), "ADDED_ONE_YEAR_TO_KNOWN_TIME");
  addCandidate(subtractRational(later, rational(1)), "REMOVED_ONE_YEAR_FROM_LATER_TIME");
  for (const fallback of [
    rational(1, 2), rational(1), rational(3, 2), rational(2), rational(5, 2),
    rational(3), rational(7, 2), rational(4), rational(5), rational(6),
  ]) {
    addCandidate(fallback, "ADMISSIBLE_TIME_FROM_WRONG_RELATION");
  }

  if (candidates.length < 4) return source;
  const optionAudit = candidates.slice(0, 4);
  const correctText = optionAudit[0]!.text;
  return {
    ...source,
    options: optionAudit.map((option) => option.text),
    optionAudit,
    correctIndex: 0,
    explanation: {
      ...source.explanation,
      conclusion: `Therefore, the later time is ${correctText}.`,
    },
  };
}

function normaliseFinalStem(stem: string): string {
  let result = stem.trim();
  result = result.replace(
    /^For (.+) earns (.+)\. The amount at a later time is (\d+:\d+) of the amount after (.+)\. Find that later time\.$/u,
    "$1 earns $2. The later amount and the amount after $4 are in the ratio $3. What is the later time?",
  );
  result = result.replace(/^For ([A-Z][\p{L}-]*'s .+?) earns /u, "$1 earns ");
  result = result.replace(
    /\. Find the amount at the end of ([^.]+)\.$/u,
    ". What is the amount at the end of $1?",
  );
  result = result.replace(/\. Find that later time\.$/u, ". What is the later time?");
  result = result.replace(/\. Determine the ([^.]+)\.$/u, ". What is the $1?");
  if (result && /^\p{Ll}/u.test(result)) result = `${result[0]!.toUpperCase()}${result.slice(1)}`;
  return result;
}

export interface IntCp001FinalGeneratedQuestion {
  packageId: "INT-001";
  canonicalProblemId: "INT-CP-001";
  qlId: IntCp001FinalQlId;
  permanentQlId: IntCp001FinalQlId;
  questionLanguageId: string;
  releaseId: typeof INT_CP001_RELEASE_ID;
  language: "en";
  maturity: "FROZEN_ENGLISH_CONTRACT";
  seed: string;
  solveContract: string;
  topology: string;
  taskDirection: string;
  answerSemantic: string;
  difficulty: "Easy" | "Medium" | "Hard";
  difficultyEvidence: string[];
  stem: string;
  options: string[];
  optionAudit: CommonSourceItem["optionAudit"];
  correctIndex: number;
  explanation: CommonSourceItem["explanation"];
  reasoningGraph: unknown;
  solution: CommonSourceItem["solution"];
  mathematicalFingerprint: string;
  validation: CommonSourceItem["validation"];
  internalProvenance: {
    sourceKind: IntCp001SourceAdapter["kind"];
    sourcePrototypeId: string;
    representation: IntCp001SourceAdapter["representation"];
    answerUnit: IntCp001SourceAdapter["answerUnit"];
    sourceParameters: unknown;
  };
  reviewStatus: "FROZEN_ENGLISH_CONTRACT";
  questionBankStatus: "NOT_STORED";
  testEligibility: "INELIGIBLE";
  publiclyPublishable: false;
  questionStudioDiscoverable: false;
}

export function generateIntCp001FinalQuestion(
  qlId: IntCp001FinalQlId,
  seed: string,
): IntCp001FinalGeneratedQuestion {
  const entry = getIntCp001FinalRegistryEntry(qlId);
  const adapterIndex = deterministicIndex(`${qlId}:${seed}:representation-adapter`, entry.sourceAdapters.length);
  const adapter = entry.sourceAdapters[adapterIndex]!;
  const sourceSeed = `${qlId}:${adapter.representation ?? "DEFAULT"}:${adapter.answerUnit ?? "DEFAULT"}:${seed}`;
  const ownedSource = normaliseSourceOptionOwnership(generateSource(adapter, sourceSeed));
  const source = normaliseTemporalTimeOptions(ownedSource, adapter);
  const stem = normaliseFinalStem(source.stem);

  const desiredCorrectIndex = deterministicIndex(`${qlId}:${seed}:final-answer-position`, 4);
  const rotationOffset = source.correctIndex - desiredCorrectIndex;
  const options = rotate(source.options, rotationOffset);
  const optionAudit = rotate(source.optionAudit, rotationOffset);
  const correctIndex = desiredCorrectIndex;
  const errors = [...source.validation.errors];

  if (!source.validation.ok) errors.push("Source prototype validation failed.");
  if (options.length !== 4 || new Set(options).size !== 4) errors.push("Permanent package must contain four unique options.");
  if (correctIndex < 0 || correctIndex > 3) errors.push("Permanent package correct index is invalid.");
  if (optionAudit[correctIndex]?.misconceptionId !== "CORRECT") {
    errors.push("Permanent QL-owned rotation did not place the correct option at the requested index.");
  }
  if (!source.explanation.conclusion.includes(options[correctIndex]!)) {
    errors.push("Permanent package conclusion does not state the displayed correct option.");
  }

  const learnerText = [
    stem,
    ...options,
    source.explanation.notice,
    source.explanation.relation,
    ...source.explanation.steps,
    source.explanation.verification,
    source.explanation.conclusion,
    source.explanation.commonTrap,
  ].join(" ");
  if (/INT-CP|INT-QL|PROT-|discoveryWaveId|prototypeId/iu.test(learnerText)) {
    errors.push("Learner-facing text leaks an internal identity.");
  }

  return {
    packageId: "INT-001",
    canonicalProblemId: "INT-CP-001",
    qlId,
    permanentQlId: qlId,
    questionLanguageId: `${qlId}:en`,
    releaseId: INT_CP001_RELEASE_ID,
    language: "en",
    maturity: "FROZEN_ENGLISH_CONTRACT",
    seed,
    solveContract: entry.solveContract,
    topology: entry.topology,
    taskDirection: entry.taskDirection,
    answerSemantic: entry.answerSemantic,
    difficulty: source.difficulty,
    difficultyEvidence: source.difficultyEvidence,
    stem,
    options,
    optionAudit,
    correctIndex,
    explanation: source.explanation,
    reasoningGraph: source.reasoningGraph,
    solution: source.solution,
    mathematicalFingerprint: `${qlId}::${source.mathematicalFingerprint}`,
    validation: {
      ok: errors.length === 0,
      errors,
      matchingCandidates: source.validation.matchingCandidates,
    },
    internalProvenance: {
      sourceKind: adapter.kind,
      sourcePrototypeId: adapter.prototypeId,
      representation: adapter.representation,
      answerUnit: adapter.answerUnit,
      sourceParameters: source.parameters,
    },
    reviewStatus: "FROZEN_ENGLISH_CONTRACT",
    questionBankStatus: "NOT_STORED",
    testEligibility: "INELIGIBLE",
    publiclyPublishable: false,
    questionStudioDiscoverable: false,
  };
}
