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
  generateBlrCp003TeacherReviewV3Records,
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

const MARITAL_SCENARIO =
  "BLR-CP003-SCN-EXPLICIT-UNMARRIED-BRANCH" as const;
const COUSIN_SCENARIO =
  "BLR-CP003-SCN-TWO-COUPLE-COUSIN-BRANCH" as const;

function optionLabel(index: number): "A" | "B" | "C" | "D" {
  return String.fromCharCode(65 + index) as "A" | "B" | "C" | "D";
}

function rotate<T>(values: readonly T[], shift: number): T[] {
  const offset = ((shift % values.length) + values.length) % values.length;
  return [...values.slice(offset), ...values.slice(0, offset)];
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

function assertCompositePropositionNotRepeated(
  prompt: string,
  proposition: string,
): void {
  const statements = new Set(
    prompt
      .split(/[.\n]+/)
      .map(normalise)
      .filter(Boolean),
  );
  if (statements.has(normalise(proposition))) {
    throw new Error(`CP-003 V6 candidate repeats its composite answer: ${proposition}`);
  }
}

function contextFor(
  contexts: ReadonlyMap<string, BlrCp003CompetitiveRawContext>,
  scenarioId: string,
  seed: number,
): BlrCp003CompetitiveRawContext {
  const context = [...contexts.values()].find(
    (entry) => entry.scenarioId === scenarioId && entry.seed === seed,
  );
  if (!context) {
    throw new Error(`Missing CP-003 V6 context for ${scenarioId}/${seed}.`);
  }
  return context;
}

function baseReviewFor(
  records: readonly BlrCp003TeacherReviewRecord[],
  scenarioId: string,
  seed: number,
): BlrCp003TeacherReviewRecord {
  const record = records.find(
    (entry) => entry.scenarioId === scenarioId && entry.seed === seed,
  );
  if (!record) {
    throw new Error(`Missing CP-003 V6 visual base for ${scenarioId}/${seed}.`);
  }
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
      `Invalid CP-003 V6 evidence ${subjectId}->${referenceId}: ${solved.relationId}/${solved.path.steps.length}.`,
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

function candidateOptions(
  entries: readonly { text: string; semanticKey: string; correct: boolean }[],
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
    new Set(options.map((entry) => entry.semanticKey)).size !== 4 ||
    new Set(options.map((entry) => entry.text)).size !== 4
  ) {
    throw new Error("Invalid CP-003 V6 option set.");
  }
  return { options, correctIndex };
}

function optionAnalysis(
  options: readonly BlrCp003V6CandidateOption[],
  explanations: Readonly<Record<string, string>>,
): BlrCp003TeacherOptionAnalysis[] {
  return options.map((option, index) => {
    const label = optionLabel(index);
    return {
      optionLabel: label,
      optionText: option.text,
      isCorrect: option.isCorrect,
      explanation: option.isCorrect
        ? `✅ Option ${label} is correct. ${explanations[option.semanticKey]}`
        : `⚠️ Don't fall for Option ${label}! ${explanations[option.semanticKey]}`,
    };
  });
}

function buildCandidate(input: {
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
  stepByStepSolution: readonly string[];
  optionAnalysis: readonly BlrCp003TeacherOptionAnalysis[];
  conclusion: string;
  examShortcut: string;
  commonTraps: readonly string[];
}): BlrCp003V6CandidateRecord {
  assertCompositePropositionNotRepeated(
    input.context.sharedPrompt,
    input.compositeProposition,
  );
  const primaryPath = input.evidencePaths[0];
  if (!primaryPath) throw new Error("CP-003 V6 candidate requires evidence.");
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
    itemId: `${input.context.scenarioId}-V6-${input.itemSuffix}`,
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
      stepByStepSolution: input.stepByStepSolution,
      optionAnalysis: input.optionAnalysis,
      conclusion: input.conclusion,
      examShortcut: input.examShortcut,
      commonTraps: input.commonTraps,
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
        input.context.scenarioId,
        input.context.seed,
        input.itemSuffix,
        input.stem,
        input.answerSemanticKey,
        ...input.options.flatMap((entry) => [
          entry.semanticKey,
          entry.text,
          entry.isCorrect,
        ]),
        ...input.evidencePaths.flatMap((entry) => [
          entry.relationId,
          ...entry.personIds,
        ]),
      ]),
    },
  };
}

function genderCandidate(
  context: BlrCp003CompetitiveRawContext,
  baseReview: BlrCp003TeacherReviewRecord,
): BlrCp003V6CandidateRecord {
  const targetName = context.personNames.E!;
  const referenceName = context.personNames.G!;
  const path = evidencePath(context, "E", "G", "UNCLE");
  const target = context.reconstructedFamily.persons.find(
    (person) => person.personId === "E",
  );
  if (target?.gender !== "MALE") {
    throw new Error("CP-003 V6 gender target is not independently male.");
  }
  const { options, correctIndex } = candidateOptions(
    [
      { text: "Male", semanticKey: "GENDER:MALE", correct: true },
      { text: "Female", semanticKey: "GENDER:FEMALE", correct: false },
      {
        text: "Cannot be determined",
        semanticKey: "GENDER:UNKNOWN",
        correct: false,
      },
      {
        text: "The passage is contradictory",
        semanticKey: "GENDER:CONTRADICTORY",
        correct: false,
      },
    ],
    context.seed,
  );
  const explanations = {
    "GENDER:MALE": `${targetName} is ${referenceName}'s paternal uncle and is established as male by the family clues.`,
    "GENDER:FEMALE": `${targetName} is not female; the passage establishes him as a son in the parent generation.`,
    "GENDER:UNKNOWN": `The target must first be identified as ${targetName}; the clues then establish his gender, so it is determinable.`,
    "GENDER:CONTRADICTORY": "The family graph contains no conflicting gender facts for the target member.",
  } as const;
  return buildCandidate({
    context,
    baseReview,
    authority: "DETERMINE_MEMBER_GENDER",
    prototypeId: "BLR-CP003-PROT-SHARED-GENDER",
    itemSuffix: "RELATION-QUALIFIED-GENDER",
    stem: `What is the gender of ${referenceName}'s paternal uncle?`,
    answerType: "GENDER_LABEL",
    answerSemanticKey: "GENDER:MALE",
    options,
    correctIndex,
    evidencePaths: [path],
    compositeProposition: `${targetName}, the paternal uncle of ${referenceName}, is male.`,
    coreConcept: [
      "First identify the relation-qualified target from the shared family, then read only gender evidence attached to that target.",
      "A name never proves gender; the relation clues must establish it.",
    ],
    stepByStepSolution: [
      `${context.personNames.C} is the father of ${referenceName}.`,
      `${targetName} and ${context.personNames.C} are brothers because both are sons of ${context.personNames.A}.`,
      `${targetName} is therefore the paternal uncle of ${referenceName}.`,
      `${targetName} is established as male, so the required gender is Male.`,
    ],
    optionAnalysis: optionAnalysis(options, explanations),
    conclusion: `The gender of ${referenceName}'s paternal uncle is Male.`,
    examShortcut: `Find ${referenceName}'s father, move sideways to his brother, and then read that member's proved gender.`,
    commonTraps: [
      "⚠️ Do not answer from the spelling of a name.",
      "⚠️ Do not stop after finding the uncle; the question asks for the uncle's gender label.",
    ],
  });
}

function pairCandidate(
  context: BlrCp003CompetitiveRawContext,
  baseReview: BlrCp003TeacherReviewRecord,
): BlrCp003V6CandidateRecord {
  const correctPair = [context.personNames.F!, context.personNames.H!] as const;
  const pairText = (left: string, right: string) => `${left} and ${right}`;
  const { options, correctIndex } = candidateOptions(
    [
      {
        text: pairText(...correctPair),
        semanticKey: "PAIR:F:H",
        correct: true,
      },
      {
        text: pairText(context.personNames.C!, context.personNames.D!),
        semanticKey: "PAIR:C:D",
        correct: false,
      },
      {
        text: pairText(context.personNames.C!, context.personNames.F!),
        semanticKey: "PAIR:C:F",
        correct: false,
      },
      {
        text: pairText(context.personNames.A!, context.personNames.B!),
        semanticKey: "PAIR:A:B",
        correct: false,
      },
    ],
    context.seed + 1,
  );
  const path = evidencePath(context, "F", "H", "COUSIN");
  const explanations = {
    "PAIR:F:H": `${correctPair[0]} and ${correctPair[1]} are cousins because their parents are siblings.`,
    "PAIR:C:D": `${context.personNames.C} and ${context.personNames.D} are siblings, not cousins.`,
    "PAIR:C:F": `${context.personNames.C} is a parent of ${context.personNames.F}; this is a parent-child pair.`,
    "PAIR:A:B": `${context.personNames.A} and ${context.personNames.B} are a married couple, not cousins.`,
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
    evidencePaths: [path],
    compositeProposition: `${correctPair[0]} and ${correctPair[1]} are cousins.`,
    coreConcept: [
      "For an unordered pair, the two names form one answer regardless of display order.",
      "Cousins are children of siblings, so the proof must cross the parent generation before returning to the child generation.",
    ],
    stepByStepSolution: [
      `${context.personNames.C} and ${context.personNames.D} are siblings because both are children of ${context.personNames.A}.`,
      `${correctPair[0]} is the child of ${context.personNames.C}.`,
      `${correctPair[1]} is the child of ${context.personNames.D}.`,
      `Therefore, ${correctPair[0]} and ${correctPair[1]} are cousins.`,
    ],
    optionAnalysis: optionAnalysis(options, explanations),
    conclusion: `${pairText(...correctPair)} is the cousin pair.`,
    examShortcut: "For each option, move up one generation from both names. If those two parents are siblings, the pair consists of cousins.",
    commonTraps: [
      "⚠️ Same-generation members are not automatically cousins.",
      "⚠️ Pair order is irrelevant; test the connection between the two members.",
    ],
  });
}

function memberSetCandidate(
  context: BlrCp003CompetitiveRawContext,
  baseReview: BlrCp003TeacherReviewRecord,
): BlrCp003V6CandidateRecord {
  const referenceName = context.personNames.G!;
  const auntName = context.personNames.D!;
  const uncleName = context.personNames.E!;
  const correctText = `${auntName} and ${uncleName}`;
  const { options, correctIndex } = candidateOptions(
    [
      {
        text: correctText,
        semanticKey: "PERSON_SET:D:E",
        correct: true,
      },
      { text: `${auntName} only`, semanticKey: "PERSON_SET:D", correct: false },
      { text: `${uncleName} only`, semanticKey: "PERSON_SET:E", correct: false },
      {
        text: `${context.personNames.C}, ${auntName} and ${uncleName}`,
        semanticKey: "PERSON_SET:C:D:E",
        correct: false,
      },
    ],
    context.seed + 2,
  );
  const auntPath = evidencePath(context, "D", "G", "AUNT");
  const unclePath = evidencePath(context, "E", "G", "UNCLE");
  const explanations = {
    "PERSON_SET:D:E": `${auntName} and ${uncleName} are both siblings of ${referenceName}'s father, so the set is complete.`,
    "PERSON_SET:D": `${auntName} qualifies, but the option omits ${uncleName}.`,
    "PERSON_SET:E": `${uncleName} qualifies, but the option omits ${auntName}.`,
    "PERSON_SET:C:D:E": `${context.personNames.C} is ${referenceName}'s father, not a paternal uncle or aunt, so this option adds an extra member.`,
  } as const;
  return buildCandidate({
    context,
    baseReview,
    authority: "IDENTIFY_ALL_MEMBERS_BY_RELATION",
    prototypeId: "BLR-CP003-PROT-SHARED-MEMBER-SET",
    itemSuffix: "DERIVED-PATERNAL-UNCLE-AUNT-SET",
    stem: `Which option lists all the paternal uncles and aunts of ${referenceName}?`,
    answerType: "PERSON_NAME_SET",
    answerSemanticKey: "PERSON_SET:D:E",
    options,
    correctIndex,
    evidencePaths: [auntPath, unclePath],
    compositeProposition: `${auntName} and ${uncleName} are all the paternal uncles and aunts of ${referenceName}.`,
    coreConcept: [
      "A set answer is correct only when every qualifying member is included and no non-qualifying member is added.",
      "Paternal uncles and aunts are the brothers and sisters of the father.",
    ],
    stepByStepSolution: [
      `${context.personNames.C} is the father of ${referenceName}.`,
      `${auntName} and ${uncleName} are siblings of ${context.personNames.C}.`,
      `${auntName} is therefore the paternal aunt and ${uncleName} the paternal uncle of ${referenceName}.`,
      `The complete set is ${correctText}.`,
    ],
    optionAnalysis: optionAnalysis(options, explanations),
    conclusion: `${correctText} is the complete required set.`,
    examShortcut: `Find ${referenceName}'s father, list every sibling of that father, and reject options with either an omission or an extra name.`,
    commonTraps: [
      "⚠️ A partly correct set is still wrong.",
      "⚠️ Do not include the father himself among his own siblings for this answer.",
    ],
  });
}

function maritalStatusCandidate(
  context: BlrCp003CompetitiveRawContext,
  baseReview: BlrCp003TeacherReviewRecord,
): BlrCp003V6CandidateRecord {
  const targetName = context.personNames.E!;
  const referenceName = context.personNames.G!;
  const path = evidencePath(context, "E", "G", "UNCLE");
  const maritalGroup = generateBlrCp003MaritalGroup(context.seed);
  const statusFact = maritalGroup.maritalFacts.find(
    (entry) => entry.personId === "E",
  );
  if (statusFact?.status !== "UNMARRIED") {
    throw new Error("CP-003 V6 marital target lacks explicit unmarried evidence.");
  }
  const { options, correctIndex } = candidateOptions(
    [
      { text: "Unmarried", semanticKey: "STATUS:UNMARRIED", correct: true },
      { text: "Married", semanticKey: "STATUS:MARRIED", correct: false },
      {
        text: "Cannot be determined",
        semanticKey: "STATUS:UNKNOWN",
        correct: false,
      },
      {
        text: "The passage is contradictory",
        semanticKey: "STATUS:CONTRADICTORY",
        correct: false,
      },
    ],
    context.seed + 3,
  );
  const explanations = {
    "STATUS:UNMARRIED": `${targetName} is ${referenceName}'s paternal uncle, and the passage explicitly states that ${targetName} is unmarried.`,
    "STATUS:MARRIED": `No spouse edge or married fact is attached to ${targetName}; the explicit status says unmarried.`,
    "STATUS:UNKNOWN": `The target and the status are both established: ${targetName} is the uncle and has an explicit unmarried fact.`,
    "STATUS:CONTRADICTORY": "The status evidence is consistent and contains no married/unmarried conflict.",
  } as const;
  return buildCandidate({
    context,
    baseReview,
    authority: "DETERMINE_MEMBER_MARITAL_STATUS",
    prototypeId: "BLR-CP003-PROT-SHARED-MARITAL-STATUS",
    itemSuffix: "RELATION-QUALIFIED-MARITAL-STATUS",
    stem: `What is the marital status of ${referenceName}'s paternal uncle?`,
    answerType: "MARITAL_STATUS_LABEL",
    answerSemanticKey: "STATUS:UNMARRIED",
    options,
    correctIndex,
    evidencePaths: [path],
    compositeProposition: `${targetName}, the paternal uncle of ${referenceName}, is unmarried.`,
    coreConcept: [
      "First identify the relation-qualified member; then evaluate only valid marital-status evidence for that member.",
      "Unmarried status requires an explicit fact. Missing spouse information alone is never enough.",
    ],
    stepByStepSolution: [
      `${context.personNames.C} is the father of ${referenceName}.`,
      `${targetName} is the brother of ${context.personNames.C}, so ${targetName} is ${referenceName}'s paternal uncle.`,
      `The passage explicitly states that ${targetName} is unmarried.`,
      "Therefore, the required marital status is Unmarried.",
    ],
    optionAnalysis: optionAnalysis(options, explanations),
    conclusion: `${referenceName}'s paternal uncle is unmarried.`,
    examShortcut: "Resolve the relation-qualified target first; then look for a spouse edge or an explicit status fact attached to that exact person.",
    commonTraps: [
      "⚠️ Do not use the status of another family member.",
      "⚠️ Absence of a shown spouse is not proof of unmarried status.",
    ],
  });
}

function identifyByMaritalStatusCandidate(
  context: BlrCp003CompetitiveRawContext,
  baseReview: BlrCp003TeacherReviewRecord,
): BlrCp003V6CandidateRecord {
  const targetName = context.personNames.E!;
  const referenceName = context.personNames.G!;
  const path = evidencePath(context, "E", "G", "UNCLE");
  const maritalGroup = generateBlrCp003MaritalGroup(context.seed);
  const statusFact = maritalGroup.maritalFacts.find(
    (entry) => entry.personId === "E",
  );
  if (statusFact?.status !== "UNMARRIED") {
    throw new Error("CP-003 V6 identify-by-status target lacks explicit evidence.");
  }
  const { options, correctIndex } = candidateOptions(
    [
      { text: targetName, semanticKey: "PERSON:E", correct: true },
      { text: context.personNames.C!, semanticKey: "PERSON:C", correct: false },
      { text: context.personNames.D!, semanticKey: "PERSON:D", correct: false },
      { text: context.personNames.A!, semanticKey: "PERSON:A", correct: false },
    ],
    context.seed,
  );
  const explanations = {
    "PERSON:E": `${targetName} is the male sibling of ${referenceName}'s father and is explicitly unmarried.`,
    "PERSON:C": `${context.personNames.C} is ${referenceName}'s father and is married, so neither condition matches.`,
    "PERSON:D": `${context.personNames.D} is a paternal aunt, not a paternal uncle, and no unmarried fact qualifies her.`,
    "PERSON:A": `${context.personNames.A} is ${referenceName}'s grandfather and is married, not the requested unmarried uncle.`,
  } as const;
  return buildCandidate({
    context,
    baseReview,
    authority: "IDENTIFY_MEMBER_BY_MARITAL_STATUS",
    prototypeId: "BLR-CP003-PROT-SHARED-IDENTIFY-BY-MARITAL-STATUS",
    itemSuffix: "IDENTIFY-UNMARRIED-PATERNAL-UNCLE",
    stem: `Who is the unmarried paternal uncle of ${referenceName}?`,
    answerType: "PERSON_NAME",
    answerSemanticKey: "PERSON:E",
    options,
    correctIndex,
    evidencePaths: [path],
    compositeProposition: `${targetName} is the unmarried paternal uncle of ${referenceName}.`,
    coreConcept: [
      "The answer must satisfy both the kinship relation and the marital-status predicate.",
      "A candidate failing either condition must be rejected.",
    ],
    stepByStepSolution: [
      `${context.personNames.C} is the father of ${referenceName}.`,
      `${targetName} is the brother of ${context.personNames.C}, making ${targetName} the paternal uncle.`,
      `The passage explicitly marks ${targetName} as unmarried.`,
      `Therefore, ${targetName} alone satisfies both conditions.`,
    ],
    optionAnalysis: optionAnalysis(options, explanations),
    conclusion: `${targetName} is the unmarried paternal uncle of ${referenceName}.`,
    examShortcut: "Filter twice: first keep only paternal uncles, then apply the explicit marital-status condition.",
    commonTraps: [
      "⚠️ A person matching only the relation is not enough.",
      "⚠️ A person matching only the status is not enough.",
    ],
  });
}

export function generateBlrCp003LearnerEvidenceV6Candidates(
  seeds: readonly number[] = [0, 1, 2, 3],
): readonly BlrCp003V6CandidateRecord[] {
  const contexts = buildBlrCp003CompetitiveRawContexts(seeds);
  const baseReviews = generateBlrCp003TeacherReviewV3Records(seeds);
  const records: BlrCp003V6CandidateRecord[] = [];

  for (const seed of seeds) {
    const maritalContext = contextFor(contexts, MARITAL_SCENARIO, seed);
    const maritalBase = baseReviewFor(baseReviews, MARITAL_SCENARIO, seed);
    const cousinContext = contextFor(contexts, COUSIN_SCENARIO, seed);
    const cousinBase = baseReviewFor(baseReviews, COUSIN_SCENARIO, seed);

    records.push(
      genderCandidate(maritalContext, maritalBase),
      pairCandidate(cousinContext, cousinBase),
      memberSetCandidate(maritalContext, maritalBase),
      maritalStatusCandidate(maritalContext, maritalBase),
      identifyByMaritalStatusCandidate(maritalContext, maritalBase),
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
