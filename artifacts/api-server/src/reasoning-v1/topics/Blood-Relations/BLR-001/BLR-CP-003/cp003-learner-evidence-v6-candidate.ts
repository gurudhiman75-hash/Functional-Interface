import { solveRelationFromGraph } from "../foundation/graph-closure";
import { stableHash } from "../foundation/prng";
import { relationLabel } from "../foundation/relation-ontology";
import type { BlrRelationId } from "../foundation/types";
import {
  buildBlrCp003CompetitiveRawContexts,
  type BlrCp003CompetitiveRawContext,
} from "./cp003-competitive-exam-gate";
import { generateBlrCp003MaritalGroup } from "./cp003-marital-generator";
import type { BlrCp003ProvisionalNewAuthority } from "./cp003-merge-split-audit";
import {
  buildBlrCp003SvgFamilyTree,
  type BlrCp003SvgFamilyTreeDiagram,
} from "./cp003-svg-family-tree";
import {
  generateBlrCp003TeacherReviewRecords,
  type BlrCp003TeacherOptionAnalysis,
  type BlrCp003TeacherReviewRecord,
} from "./cp003-teacher-editorial";

export const BLR_CP003_LEARNER_EVIDENCE_V6_CANDIDATE_VERSION =
  "BLR_CP003_LEARNER_EVIDENCE_V6_CANDIDATE_V1" as const;

export type BlrCp003V6CandidateAuthority = Exclude<
  BlrCp003ProvisionalNewAuthority,
  "IDENTIFY_PERSON_BY_EXACT_LINEAGE"
>;

export type BlrCp003V6AnswerType =
  | "GENDER_LABEL"
  | "UNORDERED_PERSON_PAIR"
  | "PERSON_NAME_SET"
  | "MARITAL_STATUS_LABEL"
  | "PERSON_NAME";

export interface BlrCp003V6CandidateOption {
  text: string;
  semanticKey: string;
  isCorrect: boolean;
}

export interface BlrCp003V6EvidencePath {
  subjectId: string;
  referenceId: string;
  relationId: BlrRelationId;
  personIds: readonly string[];
  distance: number;
}

export interface BlrCp003V6CandidateRecord {
  packageId: "BLR-001";
  checkpointId: "BLR-CP-003";
  permanentQlId: null;
  prototypeOnly: true;
  reviewOnly: true;
  publiclyPublishable: false;
  questionStudioVisible: false;
  questionBankEligible: false;
  mockTestEligible: false;
  locale: "en-IN";
  provisionalAuthority: BlrCp003V6CandidateAuthority;
  prototypeId: string;
  scenarioId: string;
  topologyId: string;
  seed: number;
  itemId: string;
  sharedPrompt: string;
  stem: string;
  answerType: BlrCp003V6AnswerType;
  answerSemanticKey: string;
  options: readonly BlrCp003V6CandidateOption[];
  correctIndex: number;
  evidencePaths: readonly BlrCp003V6EvidencePath[];
  proceduralLogic: BlrCp003SvgFamilyTreeDiagram;
  editorial: {
    coreConcept: readonly string[];
    stepByStepSolution: readonly string[];
    optionAnalysis: readonly BlrCp003TeacherOptionAnalysis[];
    conclusion: string;
    examShortcut: string;
    commonTraps: readonly string[];
  };
  metadata: {
    runtimeVersion: "blr-cp003-learner-evidence-v6-candidate-v1";
    competitiveCandidate: true;
    humanReviewApproved: false;
    compositeAnswerPremiseRepeated: false;
    minimumEvidenceDistance: number;
    uniqueAnswer: true;
    optionSemanticsUnique: true;
    nativeSvgFamilyTree: true;
    asciiFallbackRetained: true;
    semanticFingerprint: string;
  };
}

type CandidateInput = {
  context: BlrCp003CompetitiveRawContext;
  baseReview: BlrCp003TeacherReviewRecord;
  authority: BlrCp003V6CandidateAuthority;
  prototypeId: string;
  itemSuffix: string;
  stem: string;
  answerType: BlrCp003V6AnswerType;
  answerSemanticKey: string;
  options: readonly BlrCp003V6CandidateOption[];
  correctIndex: number;
  evidencePaths: readonly BlrCp003V6EvidencePath[];
  compositeProposition: string;
  coreConcept: readonly string[];
  steps: readonly string[];
  optionAnalysis: readonly BlrCp003TeacherOptionAnalysis[];
  conclusion: string;
  shortcut: string;
  traps: readonly string[];
};

const MARITAL_SCENARIO = "BLR-CP003-SCN-EXPLICIT-UNMARRIED-BRANCH";
const COUSIN_SCENARIO = "BLR-CP003-SCN-TWO-COUPLE-COUSIN-BRANCH";

function optionLabel(index: number): "A" | "B" | "C" | "D" {
  return String.fromCharCode(65 + index) as "A" | "B" | "C" | "D";
}

function rotate<T>(values: readonly T[], shift: number): T[] {
  const offset = ((shift % values.length) + values.length) % values.length;
  return [...values.slice(offset), ...values.slice(0, offset)];
}

function makeOptions(
  entries: readonly {
    text: string;
    semanticKey: string;
    correct: boolean;
  }[],
  shift: number,
): { options: BlrCp003V6CandidateOption[]; correctIndex: number } {
  const options = rotate(entries, shift).map((entry) => ({
    text: entry.text,
    semanticKey: entry.semanticKey,
    isCorrect: entry.correct,
  }));
  const correctIndex = options.findIndex((entry) => entry.isCorrect);
  if (
    options.length !== 4 ||
    correctIndex < 0 ||
    options.filter((entry) => entry.isCorrect).length !== 1 ||
    new Set(options.map((entry) => entry.text)).size !== 4 ||
    new Set(options.map((entry) => entry.semanticKey)).size !== 4
  ) {
    throw new Error("Invalid CP-003 V6 option set.");
  }
  return { options, correctIndex };
}

function analyseOptions(
  options: readonly BlrCp003V6CandidateOption[],
  reasons: Readonly<Record<string, string>>,
): BlrCp003TeacherOptionAnalysis[] {
  return options.map((option, index) => {
    const label = optionLabel(index);
    const reason = reasons[option.semanticKey];
    if (!reason) throw new Error(`Missing V6 option reason for ${option.semanticKey}.`);
    return {
      optionLabel: label,
      optionText: option.text,
      isCorrect: option.isCorrect,
      explanation: option.isCorrect
        ? `✅ Option ${label} is correct. ${reason}`
        : `⚠️ Don't fall for Option ${label}! ${reason}`,
    };
  });
}

function contextFor(
  contexts: ReadonlyMap<string, BlrCp003CompetitiveRawContext>,
  scenarioId: string,
  seed: number,
): BlrCp003CompetitiveRawContext {
  const context = [...contexts.values()].find(
    (entry) => entry.scenarioId === scenarioId && entry.seed === seed,
  );
  if (!context) throw new Error(`Missing V6 context for ${scenarioId}/${seed}.`);
  return context;
}

function reviewFor(
  records: readonly BlrCp003TeacherReviewRecord[],
  scenarioId: string,
  seed: number,
): BlrCp003TeacherReviewRecord {
  const record = records.find(
    (entry) => entry.scenarioId === scenarioId && entry.seed === seed,
  );
  if (!record) throw new Error(`Missing V6 visual base for ${scenarioId}/${seed}.`);
  return record;
}

function evidencePath(
  context: BlrCp003CompetitiveRawContext,
  subjectId: string,
  referenceId: string,
  expectedRelationId: BlrRelationId,
): BlrCp003V6EvidencePath {
  const solved = solveRelationFromGraph(
    context.reconstructedFamily,
    subjectId,
    referenceId,
  );
  if (solved.relationId !== expectedRelationId || solved.path.steps.length < 2) {
    throw new Error(
      `Invalid V6 evidence ${subjectId}->${referenceId}: ${solved.relationId}/${solved.path.steps.length}.`,
    );
  }
  return {
    subjectId,
    referenceId,
    relationId: solved.relationId,
    personIds: solved.path.personIds,
    distance: solved.path.steps.length,
  };
}

function normalise(text: string): string {
  return text
    .toLocaleLowerCase("en-IN")
    .replace(/[’']/g, "")
    .replace(/[–—-]/g, " ")
    .replace(/\b(the|a|an)\b/g, " ")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function assertCompositeNotRepeated(prompt: string, proposition: string): void {
  const statements = new Set(
    prompt
      .split(/[.\n]+/)
      .map(normalise)
      .filter(Boolean),
  );
  if (statements.has(normalise(proposition))) {
    throw new Error(`V6 composite answer repeats a premise: ${proposition}`);
  }
}

function buildCandidate(input: CandidateInput): BlrCp003V6CandidateRecord {
  assertCompositeNotRepeated(input.context.sharedPrompt, input.compositeProposition);
  const primaryPath = input.evidencePaths[0];
  if (!primaryPath) throw new Error("V6 candidate requires evidence.");
  const proceduralLogic = buildBlrCp003SvgFamilyTree(
    input.context,
    input.baseReview,
    {
      subjectId: primaryPath.subjectId,
      referenceId: primaryPath.referenceId,
      answerLabel: input.options[input.correctIndex]!.text,
    },
  );
  const minimumEvidenceDistance = Math.min(
    ...input.evidencePaths.map((entry) => entry.distance),
  );
  const itemId = `${input.context.scenarioId}-S${input.context.seed}-V6-${input.itemSuffix}`;

  return {
    packageId: "BLR-001",
    checkpointId: "BLR-CP-003",
    permanentQlId: null,
    prototypeOnly: true,
    reviewOnly: true,
    publiclyPublishable: false,
    questionStudioVisible: false,
    questionBankEligible: false,
    mockTestEligible: false,
    locale: "en-IN",
    provisionalAuthority: input.authority,
    prototypeId: input.prototypeId,
    scenarioId: input.context.scenarioId,
    topologyId: input.baseReview.topologyId,
    seed: input.context.seed,
    itemId,
    sharedPrompt: input.context.sharedPrompt,
    stem: input.stem,
    answerType: input.answerType,
    answerSemanticKey: input.answerSemanticKey,
    options: input.options,
    correctIndex: input.correctIndex,
    evidencePaths: input.evidencePaths,
    proceduralLogic,
    editorial: {
      coreConcept: input.coreConcept,
      stepByStepSolution: input.steps,
      optionAnalysis: input.optionAnalysis,
      conclusion: input.conclusion,
      examShortcut: input.shortcut,
      commonTraps: input.traps,
    },
    metadata: {
      runtimeVersion: "blr-cp003-learner-evidence-v6-candidate-v1",
      competitiveCandidate: true,
      humanReviewApproved: false,
      compositeAnswerPremiseRepeated: false,
      minimumEvidenceDistance,
      uniqueAnswer: true,
      optionSemanticsUnique: true,
      nativeSvgFamilyTree: true,
      asciiFallbackRetained: true,
      semanticFingerprint: stableHash([
        BLR_CP003_LEARNER_EVIDENCE_V6_CANDIDATE_VERSION,
        input.authority,
        itemId,
        input.stem,
        input.answerSemanticKey,
        ...input.options.flatMap((option) => [
          option.semanticKey,
          option.text,
          option.isCorrect,
        ]),
        ...input.evidencePaths.flatMap((path) => [
          path.relationId,
          ...path.personIds,
        ]),
      ]),
    },
  };
}

function genderCandidate(
  context: BlrCp003CompetitiveRawContext,
  baseReview: BlrCp003TeacherReviewRecord,
): BlrCp003V6CandidateRecord {
  const target = context.personNames.E!;
  const reference = context.personNames.G!;
  const targetPerson = context.reconstructedFamily.persons.find(
    (person) => person.personId === "E",
  );
  if (targetPerson?.gender !== "MALE") throw new Error("V6 gender target drifted.");
  const { options, correctIndex } = makeOptions(
    [
      { text: "Male", semanticKey: "GENDER:MALE", correct: true },
      { text: "Female", semanticKey: "GENDER:FEMALE", correct: false },
      { text: "Cannot be determined", semanticKey: "GENDER:UNKNOWN", correct: false },
      { text: "The passage is contradictory", semanticKey: "GENDER:CONTRADICTORY", correct: false },
    ],
    context.seed,
  );
  const reasons = {
    "GENDER:MALE": `${target} is ${reference}'s paternal uncle and the family clues establish him as male.`,
    "GENDER:FEMALE": `${target} is established as a son, not a female member.`,
    "GENDER:UNKNOWN": `The relation path identifies ${target}, and the clues fix his gender.`,
    "GENDER:CONTRADICTORY": "No conflicting gender fact exists for the target member.",
  } as const;
  return buildCandidate({
    context,
    baseReview,
    authority: "DETERMINE_MEMBER_GENDER",
    prototypeId: "BLR-CP003-PROT-SHARED-GENDER",
    itemSuffix: "RELATION-QUALIFIED-GENDER",
    stem: `What is the gender of ${reference}'s paternal uncle?`,
    answerType: "GENDER_LABEL",
    answerSemanticKey: "GENDER:MALE",
    options,
    correctIndex,
    evidencePaths: [evidencePath(context, "E", "G", "UNCLE")],
    compositeProposition: `${target}, the paternal uncle of ${reference}, is male.`,
    coreConcept: [
      "Identify the relation-qualified target before reading that person's gender evidence.",
      "A name alone never establishes gender.",
    ],
    steps: [
      `${context.personNames.C} is the father of ${reference}.`,
      `${target} and ${context.personNames.C} are brothers because both are sons of ${context.personNames.A}.`,
      `${target} is therefore the paternal uncle of ${reference}.`,
      `${target} is male, so the required answer is Male.`,
    ],
    optionAnalysis: analyseOptions(options, reasons),
    conclusion: `The gender of ${reference}'s paternal uncle is Male.`,
    shortcut: `Find ${reference}'s father, move to his brother, and then read that member's proved gender.`,
    traps: [
      "⚠️ Do not infer gender from a name.",
      "⚠️ Do not stop after identifying the uncle; return the uncle's gender label.",
    ],
  });
}

function pairCandidate(
  context: BlrCp003CompetitiveRawContext,
  baseReview: BlrCp003TeacherReviewRecord,
): BlrCp003V6CandidateRecord {
  const f = context.personNames.F!;
  const h = context.personNames.H!;
  const c = context.personNames.C!;
  const d = context.personNames.D!;
  const a = context.personNames.A!;
  const b = context.personNames.B!;
  const { options, correctIndex } = makeOptions(
    [
      { text: `${f} and ${h}`, semanticKey: "PAIR:F:H", correct: true },
      { text: `${c} and ${d}`, semanticKey: "PAIR:C:D", correct: false },
      { text: `${c} and ${f}`, semanticKey: "PAIR:C:F", correct: false },
      { text: `${a} and ${b}`, semanticKey: "PAIR:A:B", correct: false },
    ],
    context.seed + 1,
  );
  const reasons = {
    "PAIR:F:H": `${f} and ${h} are cousins because their parents are siblings.`,
    "PAIR:C:D": `${c} and ${d} are siblings, not cousins.`,
    "PAIR:C:F": `${c} is a parent of ${f}.`,
    "PAIR:A:B": `${a} and ${b} are spouses.`,
  } as const;
  return buildCandidate({
    context,
    baseReview,
    authority: "SELECT_UNORDERED_FAMILY_PAIR",
    prototypeId: "BLR-CP003-PROT-SHARED-DERIVED-UNORDERED-PAIR-V6",
    itemSuffix: "DERIVED-COUSIN-PAIR",
    stem: "Which of the following unordered pairs consists of cousins?",
    answerType: "UNORDERED_PERSON_PAIR",
    answerSemanticKey: "PAIR:F:H",
    options,
    correctIndex,
    evidencePaths: [evidencePath(context, "F", "H", "COUSIN")],
    compositeProposition: `${f} and ${h} are cousins.`,
    coreConcept: [
      "An unordered pair remains the same whichever name is written first.",
      "Cousins are children of siblings.",
    ],
    steps: [
      `${c} and ${d} are siblings because both are children of ${a}.`,
      `${f} is the child of ${c}.`,
      `${h} is the child of ${d}.`,
      `Therefore, ${f} and ${h} are cousins.`,
    ],
    optionAnalysis: analyseOptions(options, reasons),
    conclusion: `${f} and ${h} form the required cousin pair.`,
    shortcut: "Move one generation upward from both names; if those parents are siblings, the pair consists of cousins.",
    traps: [
      "⚠️ Same-generation members are not automatically cousins.",
      "⚠️ Pair order is irrelevant; test the family connection.",
    ],
  });
}

function memberSetCandidate(
  context: BlrCp003CompetitiveRawContext,
  baseReview: BlrCp003TeacherReviewRecord,
): BlrCp003V6CandidateRecord {
  const reference = context.personNames.G!;
  const aunt = context.personNames.D!;
  const uncle = context.personNames.E!;
  const father = context.personNames.C!;
  const { options, correctIndex } = makeOptions(
    [
      { text: `${aunt} and ${uncle}`, semanticKey: "PERSON_SET:D:E", correct: true },
      { text: `${aunt} only`, semanticKey: "PERSON_SET:D", correct: false },
      { text: `${uncle} only`, semanticKey: "PERSON_SET:E", correct: false },
      { text: `${father}, ${aunt} and ${uncle}`, semanticKey: "PERSON_SET:C:D:E", correct: false },
    ],
    context.seed + 2,
  );
  const reasons = {
    "PERSON_SET:D:E": `${aunt} and ${uncle} are both siblings of ${reference}'s father.`,
    "PERSON_SET:D": `This option omits ${uncle}.`,
    "PERSON_SET:E": `This option omits ${aunt}.`,
    "PERSON_SET:C:D:E": `${father} is the father, not a paternal uncle or aunt.`,
  } as const;
  return buildCandidate({
    context,
    baseReview,
    authority: "IDENTIFY_ALL_MEMBERS_BY_RELATION",
    prototypeId: "BLR-CP003-PROT-SHARED-MEMBER-SET",
    itemSuffix: "DERIVED-PATERNAL-UNCLE-AUNT-SET",
    stem: `Which option lists all the paternal uncles and aunts of ${reference}?`,
    answerType: "PERSON_NAME_SET",
    answerSemanticKey: "PERSON_SET:D:E",
    options,
    correctIndex,
    evidencePaths: [
      evidencePath(context, "D", "G", "AUNT"),
      evidencePath(context, "E", "G", "UNCLE"),
    ],
    compositeProposition: `${aunt} and ${uncle} are all the paternal uncles and aunts of ${reference}.`,
    coreConcept: [
      "A set answer must include every qualifying member and no extra member.",
      "Paternal uncles and aunts are the father's siblings.",
    ],
    steps: [
      `${father} is the father of ${reference}.`,
      `${aunt} and ${uncle} are siblings of ${father}.`,
      `${aunt} is the paternal aunt and ${uncle} the paternal uncle.`,
      `The complete set is ${aunt} and ${uncle}.`,
    ],
    optionAnalysis: analyseOptions(options, reasons),
    conclusion: `${aunt} and ${uncle} form the complete required set.`,
    shortcut: `Find ${reference}'s father, list all of that father's siblings, and reject omissions or extra names.`,
    traps: [
      "⚠️ A partly correct set is still wrong.",
      "⚠️ Do not include the father himself in the sibling set.",
    ],
  });
}

function assertExplicitUnmarried(seed: number): void {
  const fact = generateBlrCp003MaritalGroup(seed).maritalFacts.find(
    (entry) => entry.personId === "E",
  );
  if (fact?.status !== "UNMARRIED") {
    throw new Error("V6 marital evidence for E is not explicitly unmarried.");
  }
}

function maritalStatusCandidate(
  context: BlrCp003CompetitiveRawContext,
  baseReview: BlrCp003TeacherReviewRecord,
): BlrCp003V6CandidateRecord {
  assertExplicitUnmarried(context.seed);
  const target = context.personNames.E!;
  const reference = context.personNames.G!;
  const { options, correctIndex } = makeOptions(
    [
      { text: "Unmarried", semanticKey: "STATUS:UNMARRIED", correct: true },
      { text: "Married", semanticKey: "STATUS:MARRIED", correct: false },
      { text: "Cannot be determined", semanticKey: "STATUS:UNKNOWN", correct: false },
      { text: "The passage is contradictory", semanticKey: "STATUS:CONTRADICTORY", correct: false },
    ],
    context.seed + 3,
  );
  const reasons = {
    "STATUS:UNMARRIED": `${target} is ${reference}'s paternal uncle and is explicitly unmarried.`,
    "STATUS:MARRIED": `No married fact applies to ${target}; the explicit fact says unmarried.`,
    "STATUS:UNKNOWN": `Both the target identity and status are established.`,
    "STATUS:CONTRADICTORY": "The marital evidence is consistent.",
  } as const;
  return buildCandidate({
    context,
    baseReview,
    authority: "DETERMINE_MEMBER_MARITAL_STATUS",
    prototypeId: "BLR-CP003-PROT-SHARED-MARITAL-STATUS",
    itemSuffix: "RELATION-QUALIFIED-MARITAL-STATUS",
    stem: `What is the marital status of ${reference}'s paternal uncle?`,
    answerType: "MARITAL_STATUS_LABEL",
    answerSemanticKey: "STATUS:UNMARRIED",
    options,
    correctIndex,
    evidencePaths: [evidencePath(context, "E", "G", "UNCLE")],
    compositeProposition: `${target}, the paternal uncle of ${reference}, is unmarried.`,
    coreConcept: [
      "Identify the relation-qualified target before checking marital evidence.",
      "Unmarried status requires an explicit fact.",
    ],
    steps: [
      `${context.personNames.C} is the father of ${reference}.`,
      `${target} is the brother of ${context.personNames.C}.`,
      `${target} is therefore ${reference}'s paternal uncle.`,
      `The passage explicitly states that ${target} is unmarried.`,
    ],
    optionAnalysis: analyseOptions(options, reasons),
    conclusion: `${reference}'s paternal uncle is explicitly unmarried.`,
    shortcut: "Resolve the target first, then look for a spouse edge or an explicit status fact attached to that person.",
    traps: [
      "⚠️ Do not use another member's marital status.",
      "⚠️ Missing spouse information does not prove unmarried status.",
    ],
  });
}

function identifyByStatusCandidate(
  context: BlrCp003CompetitiveRawContext,
  baseReview: BlrCp003TeacherReviewRecord,
): BlrCp003V6CandidateRecord {
  assertExplicitUnmarried(context.seed);
  const target = context.personNames.E!;
  const reference = context.personNames.G!;
  const { options, correctIndex } = makeOptions(
    [
      { text: target, semanticKey: "PERSON:E", correct: true },
      { text: context.personNames.C!, semanticKey: "PERSON:C", correct: false },
      { text: context.personNames.D!, semanticKey: "PERSON:D", correct: false },
      { text: context.personNames.A!, semanticKey: "PERSON:A", correct: false },
    ],
    context.seed,
  );
  const reasons = {
    "PERSON:E": `${target} is the male sibling of ${reference}'s father and is explicitly unmarried.`,
    "PERSON:C": `${context.personNames.C} is the married father of ${reference}.`,
    "PERSON:D": `${context.personNames.D} is a paternal aunt, not the paternal uncle.`,
    "PERSON:A": `${context.personNames.A} is a married grandfather, not the requested uncle.`,
  } as const;
  return buildCandidate({
    context,
    baseReview,
    authority: "IDENTIFY_MEMBER_BY_MARITAL_STATUS",
    prototypeId: "BLR-CP003-PROT-SHARED-IDENTIFY-BY-MARITAL-STATUS",
    itemSuffix: "IDENTIFY-UNMARRIED-PATERNAL-UNCLE",
    stem: `Who is the unmarried paternal uncle of ${reference}?`,
    answerType: "PERSON_NAME",
    answerSemanticKey: "PERSON:E",
    options,
    correctIndex,
    evidencePaths: [evidencePath(context, "E", "G", "UNCLE")],
    compositeProposition: `${target} is the unmarried paternal uncle of ${reference}.`,
    coreConcept: [
      "The answer must satisfy both the kinship relation and the status condition.",
      "A candidate failing either condition is wrong.",
    ],
    steps: [
      `${context.personNames.C} is the father of ${reference}.`,
      `${target} is the brother of ${context.personNames.C}.`,
      `${target} is therefore the paternal uncle of ${reference}.`,
      `${target} is explicitly unmarried, so he alone satisfies both conditions.`,
    ],
    optionAnalysis: analyseOptions(options, reasons),
    conclusion: `${target} is the unmarried paternal uncle of ${reference}.`,
    shortcut: "Filter twice: keep only paternal uncles, then apply the explicit marital-status condition.",
    traps: [
      "⚠️ Matching only the relation is insufficient.",
      "⚠️ Matching only the marital status is insufficient.",
    ],
  });
}

export function generateBlrCp003LearnerEvidenceV6Candidates(
  seeds: readonly number[] = [0, 1, 2, 3],
): readonly BlrCp003V6CandidateRecord[] {
  const contexts = buildBlrCp003CompetitiveRawContexts(seeds);
  const reviews = generateBlrCp003TeacherReviewRecords(seeds);
  const records: BlrCp003V6CandidateRecord[] = [];

  for (const seed of seeds) {
    const maritalContext = contextFor(contexts, MARITAL_SCENARIO, seed);
    const maritalReview = reviewFor(reviews, MARITAL_SCENARIO, seed);
    const cousinContext = contextFor(contexts, COUSIN_SCENARIO, seed);
    const cousinReview = reviewFor(reviews, COUSIN_SCENARIO, seed);
    records.push(
      genderCandidate(maritalContext, maritalReview),
      pairCandidate(cousinContext, cousinReview),
      memberSetCandidate(maritalContext, maritalReview),
      maritalStatusCandidate(maritalContext, maritalReview),
      identifyByStatusCandidate(maritalContext, maritalReview),
    );
  }
  return records;
}

export function blrCp003V6CandidateAuthorityCounts(
  records: readonly BlrCp003V6CandidateRecord[] =
    generateBlrCp003LearnerEvidenceV6Candidates(),
): Readonly<Record<BlrCp003V6CandidateAuthority, number>> {
  const counts = Object.fromEntries(
    [
      "DETERMINE_MEMBER_GENDER",
      "SELECT_UNORDERED_FAMILY_PAIR",
      "IDENTIFY_ALL_MEMBERS_BY_RELATION",
      "DETERMINE_MEMBER_MARITAL_STATUS",
      "IDENTIFY_MEMBER_BY_MARITAL_STATUS",
    ].map((authority) => [authority, 0]),
  ) as Record<BlrCp003V6CandidateAuthority, number>;
  for (const record of records) counts[record.provisionalAuthority] += 1;
  return counts;
}

export function relationLabelForV6Evidence(
  path: BlrCp003V6EvidencePath,
): string {
  return relationLabel(path.relationId);
}
