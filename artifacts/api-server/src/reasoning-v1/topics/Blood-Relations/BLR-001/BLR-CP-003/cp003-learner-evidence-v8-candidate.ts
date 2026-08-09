import { stableHash } from "../foundation/prng";
import type { BlrRelationId } from "../foundation/types";
import {
  generateBlrCp003LearnerEvidenceV6Candidates,
  type BlrCp003V6CandidateAuthority,
  type BlrCp003V6CandidateOption,
  type BlrCp003V6CandidateRecord,
  type BlrCp003V6EvidencePath,
} from "./cp003-learner-evidence-v6-candidate";
import {
  BLR_CP003_V8_AUTHORITY_AUDIT_VERSION,
  blrCp003V8RetainedAuthorities,
  type BlrCp003V8RetainedAuthority,
} from "./cp003-v8-authenticity-authority-audit";

export const BLR_CP003_LEARNER_EVIDENCE_V8_CANDIDATE_VERSION =
  "BLR_CP003_LEARNER_EVIDENCE_V8_CANDIDATE_V1" as const;

export const BLR_CP003_V8_FULL_BANK_SEEDS: readonly number[] = Array.from(
  { length: 26 },
  (_, index) => index,
);

export type BlrCp003V8AnswerType =
  | "UNORDERED_PERSON_PAIR"
  | "PERSON_NAME_SET"
  | "PERSON_NAME";

export interface BlrCp003V8SolutionPhase {
  title:
    | "Phase 1 — Map generation levels"
    | "Phase 2 — Connect family branches"
    | "Phase 3 — Trace the required relation"
    | "Phase 4 — Verify the options";
  points: readonly string[];
}

export interface BlrCp003V8PassageAudit {
  clueOrderStrategy: "DISJOINT_NON_TOPOLOGICAL";
  indirectAnchorCount: number;
  generationTransitionCount: number;
  sentenceCount: number;
  directEdgeSentenceCount: number;
  stackedLinearChain: false;
}

type V6Base = Omit<
  BlrCp003V6CandidateRecord,
  | "provisionalAuthority"
  | "prototypeId"
  | "itemId"
  | "sharedPrompt"
  | "stem"
  | "answerType"
  | "answerSemanticKey"
  | "options"
  | "correctIndex"
  | "evidencePaths"
  | "editorial"
  | "metadata"
>;

export type BlrCp003V8CandidateRecord = V6Base & {
  provisionalAuthority: BlrCp003V8RetainedAuthority;
  sourceAuthority:
    | BlrCp003V6CandidateAuthority
    | "SYNTHESIZED_FROM_SHARED_GRAPH";
  prototypeId: string;
  itemId: string;
  sharedPrompt: string;
  stem: string;
  answerType: BlrCp003V8AnswerType;
  answerSemanticKey: string;
  options: readonly BlrCp003V6CandidateOption[];
  correctIndex: number;
  evidencePaths: readonly BlrCp003V6EvidencePath[];
  editorial: BlrCp003V6CandidateRecord["editorial"] & {
    solutionPhases: readonly BlrCp003V8SolutionPhase[];
  };
  metadata: Omit<
    BlrCp003V6CandidateRecord["metadata"],
    "runtimeVersion" | "semanticFingerprint"
  > & {
    runtimeVersion: "blr-cp003-learner-evidence-v8-candidate-v1";
    remediationVersion: typeof BLR_CP003_LEARNER_EVIDENCE_V8_CANDIDATE_VERSION;
    authorityAuditVersion: typeof BLR_CP003_V8_AUTHORITY_AUDIT_VERSION;
    authenticExamStem: true;
    nameBasedOptions: true;
    phaseStructuredExplanation: true;
    passageAudit: BlrCp003V8PassageAudit;
    sourceAuthorityDispositionApplied: true;
    semanticFingerprint: string;
  };
};

type OptionEntry = {
  text: string;
  semanticKey: string;
  correct: boolean;
};

type PassageProfile = {
  text: string;
  audit: BlrCp003V8PassageAudit;
};

type BuildInput = {
  source: BlrCp003V6CandidateRecord;
  authority: BlrCp003V8RetainedAuthority;
  sourceAuthority: BlrCp003V8CandidateRecord["sourceAuthority"];
  prototypeId: string;
  itemSuffix: string;
  prompt: PassageProfile;
  stem: string;
  answerType: BlrCp003V8AnswerType;
  answerSemanticKey: string;
  optionEntries: readonly OptionEntry[];
  optionShift: number;
  evidencePaths: readonly BlrCp003V6EvidencePath[];
  coreConcept: readonly string[];
  phases: readonly BlrCp003V8SolutionPhase[];
  optionReasons: Readonly<Record<string, string>>;
  conclusion: string;
  shortcut: string;
  traps: readonly string[];
};

const MARITAL_SCENARIO = "BLR-CP003-SCN-EXPLICIT-UNMARRIED-BRANCH";
const COUSIN_SCENARIO = "BLR-CP003-SCN-TWO-COUPLE-COUSIN-BRANCH";

function rotate<T>(values: readonly T[], shift: number): T[] {
  const offset = ((shift % values.length) + values.length) % values.length;
  return [...values.slice(offset), ...values.slice(0, offset)];
}

function makeOptions(
  entries: readonly OptionEntry[],
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
    throw new Error("Invalid BLR-CP-003 V8 option set.");
  }
  return { options, correctIndex };
}

function optionLabel(index: number): "A" | "B" | "C" | "D" {
  return String.fromCharCode(65 + index) as "A" | "B" | "C" | "D";
}

const CORRECT_VOICES = [
  (label: string, reason: string) => `Option ${label} is correct: ${reason}`,
  (label: string, reason: string) => `The family map supports Option ${label}. ${reason}`,
  (label: string, reason: string) => `Choose Option ${label} because ${reason}`,
  (label: string, reason: string) => `Option ${label} matches every clue. ${reason}`,
] as const;

const INCORRECT_VOICES = [
  (label: string, reason: string) => `Option ${label} is incorrect because ${reason}`,
  (label: string, reason: string) => `Reject Option ${label}: ${reason}`,
  (label: string, reason: string) => `Option ${label} fails the relation check. ${reason}`,
  (label: string, reason: string) => `Option ${label} does not fit the completed family map; ${reason}`,
] as const;

function analyseOptions(
  options: readonly BlrCp003V6CandidateOption[],
  reasons: Readonly<Record<string, string>>,
  seed: number,
): BlrCp003V6CandidateRecord["editorial"]["optionAnalysis"] {
  return options.map((option, index) => {
    const label = optionLabel(index);
    const reason = reasons[option.semanticKey];
    if (!reason) {
      throw new Error(`Missing V8 option reason for ${option.semanticKey}.`);
    }
    const voice = option.isCorrect
      ? CORRECT_VOICES[(seed + index) % CORRECT_VOICES.length]!
      : INCORRECT_VOICES[(seed * 2 + index) % INCORRECT_VOICES.length]!;
    return {
      optionLabel: label,
      optionText: option.text,
      isCorrect: option.isCorrect,
      explanation: voice(label, reason),
    };
  });
}

function personLabel(
  record: BlrCp003V6CandidateRecord,
  personId: string,
): string {
  return (
    record.proceduralLogic.nodes.find((node) => node.id === personId)?.label ??
    personId
  );
}

function names(
  record: BlrCp003V6CandidateRecord,
): Readonly<Record<string, string>> {
  return Object.fromEntries(
    record.proceduralLogic.nodes.map((node) => [node.id, node.label]),
  );
}

function maritalPassage(
  source: BlrCp003V6CandidateRecord,
): PassageProfile {
  const n = names(source);
  const variants = [
    `${n.G}'s mother ${n.F} is ${n.B}'s daughter-in-law. ${n.H} is the only son of ${n.D}. ${n.A} and ${n.B} are married and have three children. ${n.C} and ${n.E} are their sons, while ${n.D} is their daughter. ${n.G} is ${n.C}'s daughter, and ${n.E} is unmarried.`,
    `${n.H} is the son of ${n.D}, the only daughter of ${n.A}. ${n.F}, ${n.B}'s daughter-in-law, has one daughter, ${n.G}. ${n.A} is married to ${n.B}. Their sons are ${n.C} and ${n.E}. ${n.C} is ${n.G}'s father, whereas ${n.E} is unmarried.`,
    `${n.G} is the daughter of ${n.C} and ${n.F}. ${n.F} is a daughter-in-law of ${n.B}. ${n.H}'s mother ${n.D} is ${n.C}'s sister. ${n.A} and ${n.B} are married. ${n.E}, another son of ${n.A} and ${n.B}, is unmarried.`,
    `The family has three generations. ${n.E} is unmarried. ${n.G}'s father ${n.C} and ${n.H}'s mother ${n.D} are two children of ${n.A} and ${n.B}. ${n.A} and ${n.B} are married. ${n.F} is ${n.G}'s mother and ${n.B}'s daughter-in-law, while ${n.E} is the other son of ${n.A} and ${n.B}.`,
  ] as const;
  return {
    text: `Study the following information about a three-generation family.\n\n${variants[source.seed % variants.length]!}`,
    audit: {
      clueOrderStrategy: "DISJOINT_NON_TOPOLOGICAL",
      indirectAnchorCount: 2,
      generationTransitionCount: 3,
      sentenceCount: 5,
      directEdgeSentenceCount: 2,
      stackedLinearChain: false,
    },
  };
}

function cousinPassage(
  source: BlrCp003V6CandidateRecord,
): PassageProfile {
  const n = names(source);
  const variants = [
    `${n.F} is the only daughter of ${n.C} and ${n.E}. ${n.E} is ${n.A}'s son-in-law. ${n.G}, ${n.B}'s daughter-in-law, has one son, ${n.H}. ${n.D} is ${n.G}'s husband. ${n.A} and ${n.B} are married and have exactly two children, ${n.C} and ${n.D}.`,
    `${n.H}'s mother ${n.G} is ${n.B}'s daughter-in-law. ${n.F} is the daughter of ${n.E} and ${n.C}. ${n.A} is married to ${n.B}. ${n.C} and ${n.D} are their only children. ${n.E} is ${n.C}'s husband, while ${n.D} is ${n.G}'s husband.`,
    `${n.E}, the son-in-law of ${n.A}, has one daughter, ${n.F}. ${n.H} is the only son of ${n.G}, who is ${n.B}'s daughter-in-law. ${n.A} and ${n.B} are married. Their daughter is ${n.C} and their son is ${n.D}. ${n.C} is ${n.F}'s mother, and ${n.D} is ${n.H}'s father.`,
    `The two youngest members are ${n.F} and ${n.H}. ${n.F}'s mother ${n.C} and ${n.H}'s father ${n.D} are the only children of ${n.A} and ${n.B}. ${n.A} is married to ${n.B}. ${n.E} is ${n.A}'s son-in-law, and ${n.G} is ${n.B}'s daughter-in-law.`,
  ] as const;
  return {
    text: `Study the following information and answer the questions based on it.\n\n${variants[source.seed % variants.length]!}`,
    audit: {
      clueOrderStrategy: "DISJOINT_NON_TOPOLOGICAL",
      indirectAnchorCount: 2,
      generationTransitionCount: 3,
      sentenceCount: source.seed % 4 === 3 ? 4 : 5,
      directEdgeSentenceCount: 2,
      stackedLinearChain: false,
    },
  };
}

function buildEvidenceWalk(
  paths: readonly BlrCp003V6EvidencePath[],
): string[] {
  const first = paths[0];
  if (!first) {
    throw new Error("V8 candidate requires at least one evidence path.");
  }
  const walk = [...first.personIds];
  for (const path of paths.slice(1)) {
    if (path.referenceId !== first.referenceId) {
      throw new Error("V8 multi-path evidence must share one reference member.");
    }
    const reversed = [...path.personIds].reverse();
    if (walk.at(-1) !== reversed[0]) {
      throw new Error("V8 evidence paths cannot form a connected visual walk.");
    }
    walk.push(...reversed.slice(1));
  }
  return walk;
}

function diagramWithEvidence(
  source: BlrCp003V6CandidateRecord,
  evidencePaths: readonly BlrCp003V6EvidencePath[],
  answerText: string,
): BlrCp003V6CandidateRecord["proceduralLogic"] {
  const first = evidencePaths[0];
  if (!first) {
    throw new Error("V8 diagram requires evidence.");
  }
  const pathPersonIds = buildEvidenceWalk(evidencePaths);
  const generationCount = new Set(
    source.proceduralLogic.nodes.map((node) => node.generation),
  ).size;
  const descriptions = evidencePaths.map((path) =>
    path.personIds
      .map((personId) => personLabel(source, personId))
      .join(" to "),
  );
  return {
    ...source.proceduralLogic,
    query: {
      subjectId: first.subjectId,
      referenceId: first.referenceId,
      answerLabel: answerText,
      pathPersonIds,
    },
    accessibleSummary: `Family tree with ${source.proceduralLogic.nodes.length} people across ${generationCount} generations. The highlighted evidence paths are ${descriptions.join(" and ")}.`,
  };
}

function generationPoints(
  source: BlrCp003V6CandidateRecord,
): string[] {
  const groups = new Map<number, string[]>();
  for (const node of source.proceduralLogic.nodes) {
    const group = groups.get(node.generation) ?? [];
    group.push(node.label);
    groups.set(node.generation, group);
  }
  return [...groups.entries()]
    .sort(([left], [right]) => right - left)
    .map(([generation, labels]) => {
      const prefix =
        generation > 0
          ? `Generation +${generation}`
          : `Generation ${generation}`;
      return `${prefix}: ${labels.sort((a, b) => a.localeCompare(b, "en-IN")).join(", ")}.`;
    });
}

function phases(
  source: BlrCp003V6CandidateRecord,
  branchPoints: readonly string[],
  tracePoints: readonly string[],
  optionPoints: readonly string[],
): readonly BlrCp003V8SolutionPhase[] {
  return [
    {
      title: "Phase 1 — Map generation levels",
      points: generationPoints(source),
    },
    {
      title: "Phase 2 — Connect family branches",
      points: branchPoints,
    },
    {
      title: "Phase 3 — Trace the required relation",
      points: tracePoints,
    },
    {
      title: "Phase 4 — Verify the options",
      points: optionPoints,
    },
  ];
}

function flattenPhases(
  solutionPhases: readonly BlrCp003V8SolutionPhase[],
): string[] {
  return solutionPhases.flatMap((phase) =>
    phase.points.map((point) => `${phase.title}: ${point}`),
  );
}

function fingerprint(
  record: Omit<BlrCp003V8CandidateRecord, "metadata">,
): string {
  return stableHash([
    BLR_CP003_LEARNER_EVIDENCE_V8_CANDIDATE_VERSION,
    record.provisionalAuthority,
    record.sourceAuthority,
    record.itemId,
    record.sharedPrompt,
    record.stem,
    record.answerSemanticKey,
    ...record.options.flatMap((option) => [
      option.semanticKey,
      option.text,
      option.isCorrect,
    ]),
    ...record.evidencePaths.flatMap((path) => [
      path.relationId,
      ...path.personIds,
    ]),
    ...(record.proceduralLogic.query?.pathPersonIds ?? []),
    ...record.editorial.solutionPhases.flatMap((phase) => [
      phase.title,
      ...phase.points,
    ]),
    ...record.editorial.optionAnalysis.map((entry) => entry.explanation),
    record.editorial.conclusion,
    record.editorial.examShortcut,
  ]);
}

function buildRecord(input: BuildInput): BlrCp003V8CandidateRecord {
  const { options, correctIndex } = makeOptions(
    input.optionEntries,
    input.optionShift,
  );
  const correctAnswer = options[correctIndex]!.text;
  const solutionPhases = input.phases;
  const withoutMetadata: Omit<BlrCp003V8CandidateRecord, "metadata"> = {
    packageId: input.source.packageId,
    checkpointId: input.source.checkpointId,
    permanentQlId: null,
    prototypeOnly: true,
    reviewOnly: true,
    publiclyPublishable: false,
    questionStudioVisible: false,
    questionBankEligible: false,
    mockTestEligible: false,
    locale: "en-IN",
    scenarioId: input.source.scenarioId,
    topologyId: input.source.topologyId,
    seed: input.source.seed,
    proceduralLogic: diagramWithEvidence(
      input.source,
      input.evidencePaths,
      correctAnswer,
    ),
    provisionalAuthority: input.authority,
    sourceAuthority: input.sourceAuthority,
    prototypeId: input.prototypeId,
    itemId: `${input.source.scenarioId}-S${input.source.seed}-V8-${input.itemSuffix}`,
    sharedPrompt: input.prompt.text,
    stem: input.stem,
    answerType: input.answerType,
    answerSemanticKey: input.answerSemanticKey,
    options,
    correctIndex,
    evidencePaths: input.evidencePaths,
    editorial: {
      coreConcept: input.coreConcept,
      stepByStepSolution: flattenPhases(solutionPhases),
      optionAnalysis: analyseOptions(
        options,
        input.optionReasons,
        input.source.seed,
      ),
      conclusion: input.conclusion,
      examShortcut: input.shortcut,
      commonTraps: input.traps,
      solutionPhases,
    },
  };
  return {
    ...withoutMetadata,
    metadata: {
      ...input.source.metadata,
      runtimeVersion: "blr-cp003-learner-evidence-v8-candidate-v1",
      remediationVersion: BLR_CP003_LEARNER_EVIDENCE_V8_CANDIDATE_VERSION,
      authorityAuditVersion: BLR_CP003_V8_AUTHORITY_AUDIT_VERSION,
      authenticExamStem: true,
      nameBasedOptions: true,
      phaseStructuredExplanation: true,
      passageAudit: input.prompt.audit,
      sourceAuthorityDispositionApplied: true,
      semanticFingerprint: fingerprint(withoutMetadata),
    },
  };
}

function evidencePath(
  subjectId: string,
  referenceId: string,
  relationId: BlrRelationId,
  personIds: readonly string[],
): BlrCp003V6EvidencePath {
  return {
    subjectId,
    referenceId,
    relationId,
    personIds,
    distance: personIds.length - 1,
  };
}

function maritalBrotherPair(
  source: BlrCp003V6CandidateRecord,
): BlrCp003V8CandidateRecord {
  const n = names(source);
  const stems = [
    "Which of the following pairs consists of brothers?",
    "Select the pair in which both members are brothers.",
    "In which option are the two people brothers?",
    "Which pair represents two sons of the same parents?",
  ] as const;
  const p = phases(
    source,
    [
      `${n.A} and ${n.B} form the top-generation couple.`,
      `${n.C}, ${n.D} and ${n.E} are their three children.`,
      `${n.G} belongs to ${n.C}'s branch, while ${n.H} belongs to ${n.D}'s branch.`,
    ],
    [
      `${n.C} and ${n.E} are both sons of ${n.A} and ${n.B}.`,
      `They are therefore brothers.`,
    ],
    [
      `The remaining options are spouse or parent-child pairs.`,
      `${n.C} and ${n.E} is the only pair satisfying the brother relation.`,
    ],
  );
  return buildRecord({
    source,
    authority: "SELECT_UNORDERED_FAMILY_PAIR",
    sourceAuthority: "SYNTHESIZED_FROM_SHARED_GRAPH",
    prototypeId: "BLR-CP003-PROT-V8-BROTHER-PAIR",
    itemSuffix: "BROTHER-PAIR",
    prompt: maritalPassage(source),
    stem: stems[source.seed % stems.length]!,
    answerType: "UNORDERED_PERSON_PAIR",
    answerSemanticKey: "PAIR:C:E",
    optionEntries: [
      { text: `${n.C} and ${n.E}`, semanticKey: "PAIR:C:E", correct: true },
      { text: `${n.D} and ${n.H}`, semanticKey: "PAIR:D:H", correct: false },
      { text: `${n.C} and ${n.F}`, semanticKey: "PAIR:C:F", correct: false },
      { text: `${n.A} and ${n.B}`, semanticKey: "PAIR:A:B", correct: false },
    ],
    optionShift: source.seed,
    evidencePaths: [evidencePath("C", "E", "BROTHER", ["C", "A", "E"])],
    coreConcept: [
      "A pair question is solved by testing the relation between both named members.",
      "Two male children of the same parents are brothers.",
    ],
    phases: p,
    optionReasons: {
      "PAIR:C:E": `${n.C} and ${n.E} are sons of the same parents.`,
      "PAIR:D:H": `${n.D} is the mother of ${n.H}; this is a parent-child pair.`,
      "PAIR:C:F": `${n.C} and ${n.F} are spouses.`,
      "PAIR:A:B": `${n.A} and ${n.B} are spouses.`,
    },
    conclusion: `${n.C} and ${n.E} are brothers.`,
    shortcut: "First eliminate spouse and parent-child pairs; then confirm which two male members share the same parents.",
    traps: [
      "Do not treat every same-generation pair as siblings.",
      "Do not confuse a spouse pair with a sibling pair.",
    ],
  });
}

function paternalRelativeSet(
  source: BlrCp003V6CandidateRecord,
): BlrCp003V8CandidateRecord {
  const n = names(source);
  const stems = [
    `Which option lists every paternal uncle and aunt of ${n.G}?`,
    `Which option gives the complete set of ${n.G}'s father's siblings?`,
    `Select the option containing all paternal uncles and aunts of ${n.G}.`,
    `Which option contains every sibling of ${n.G}'s father and no extra member?`,
  ] as const;
  const p = phases(
    source,
    [
      `${n.C} is ${n.G}'s father.`,
      `${n.D} and ${n.E} are the other children of ${n.A} and ${n.B}.`,
    ],
    [
      `${n.D} is the sister of ${n.C}, so she is ${n.G}'s paternal aunt.`,
      `${n.E} is the brother of ${n.C}, so he is ${n.G}'s paternal uncle.`,
    ],
    [
      `A complete-set answer must include both ${n.D} and ${n.E}.`,
      `Options omitting one member or adding ${n.C} are incorrect.`,
    ],
  );
  return buildRecord({
    source,
    authority: "IDENTIFY_ALL_MEMBERS_BY_RELATION",
    sourceAuthority: "IDENTIFY_ALL_MEMBERS_BY_RELATION",
    prototypeId: "BLR-CP003-PROT-V8-PATERNAL-RELATIVE-SET",
    itemSuffix: "PATERNAL-RELATIVE-SET",
    prompt: maritalPassage(source),
    stem: stems[source.seed % stems.length]!,
    answerType: "PERSON_NAME_SET",
    answerSemanticKey: "PERSON_SET:D:E",
    optionEntries: [
      { text: `${n.D} and ${n.E}`, semanticKey: "PERSON_SET:D:E", correct: true },
      { text: `${n.D} only`, semanticKey: "PERSON_SET:D", correct: false },
      { text: `${n.E} only`, semanticKey: "PERSON_SET:E", correct: false },
      {
        text: `${n.C}, ${n.D} and ${n.E}`,
        semanticKey: "PERSON_SET:C:D:E",
        correct: false,
      },
    ],
    optionShift: source.seed + 1,
    evidencePaths: source.evidencePaths,
    coreConcept: [
      "Complete-set questions require every qualifying member and no extra member.",
      "Paternal uncles and aunts are the siblings of the father.",
    ],
    phases: p,
    optionReasons: {
      "PERSON_SET:D:E": `${n.D} and ${n.E} are exactly the two siblings of ${n.G}'s father.`,
      "PERSON_SET:D": `${n.E}, the paternal uncle, is missing.`,
      "PERSON_SET:E": `${n.D}, the paternal aunt, is missing.`,
      "PERSON_SET:C:D:E": `${n.C} is ${n.G}'s father, not one of the father's siblings.`,
    },
    conclusion: `The complete set is ${n.D} and ${n.E}.`,
    shortcut: `Locate ${n.G}'s father, list that person's siblings, and reject every option with an omission or extra name.`,
    traps: [
      "A partly correct set is still incorrect.",
      "The father himself must not be included among his siblings.",
    ],
  });
}

function identifyUnmarriedRelative(
  source: BlrCp003V6CandidateRecord,
): BlrCp003V8CandidateRecord {
  const n = names(source);
  const stems = [
    `Who is the unmarried paternal uncle of ${n.G}?`,
    `Which person is both unmarried and a paternal uncle of ${n.G}?`,
    `Select ${n.G}'s paternal uncle who is explicitly unmarried.`,
    `Who satisfies both conditions: unmarried and paternal uncle of ${n.G}?`,
  ] as const;
  const p = phases(
    source,
    [
      `${n.C} is ${n.G}'s father.`,
      `${n.D} and ${n.E} are siblings of ${n.C}.`,
    ],
    [
      `${n.E} is male and is therefore the paternal uncle of ${n.G}.`,
      `The passage explicitly states that ${n.E} is unmarried.`,
    ],
    [
      `${n.E} alone satisfies both the kinship and status conditions.`,
      `The other names fail either the relation condition or the marital-status condition.`,
    ],
  );
  return buildRecord({
    source,
    authority: "IDENTIFY_MEMBER_BY_MARITAL_STATUS",
    sourceAuthority: "IDENTIFY_MEMBER_BY_MARITAL_STATUS",
    prototypeId: "BLR-CP003-PROT-V8-IDENTIFY-UNMARRIED-RELATIVE",
    itemSuffix: "IDENTIFY-UNMARRIED-PATERNAL-UNCLE",
    prompt: maritalPassage(source),
    stem: stems[source.seed % stems.length]!,
    answerType: "PERSON_NAME",
    answerSemanticKey: "PERSON:E",
    optionEntries: [
      { text: n.E, semanticKey: "PERSON:E", correct: true },
      { text: n.C, semanticKey: "PERSON:C", correct: false },
      { text: n.D, semanticKey: "PERSON:D", correct: false },
      { text: n.A, semanticKey: "PERSON:A", correct: false },
    ],
    optionShift: source.seed + 2,
    evidencePaths: source.evidencePaths,
    coreConcept: [
      "A composite person-identification question must satisfy every stated condition.",
      "Use the explicit marital-status clue only after resolving the kinship relation.",
    ],
    phases: p,
    optionReasons: {
      "PERSON:E": `${n.E} is ${n.G}'s paternal uncle and is explicitly unmarried.`,
      "PERSON:C": `${n.C} is ${n.G}'s father and is married to ${n.F}.`,
      "PERSON:D": `${n.D} is a paternal aunt, not a paternal uncle.`,
      "PERSON:A": `${n.A} is a grandparent, not a paternal uncle.`,
    },
    conclusion: `${n.E} is the unmarried paternal uncle of ${n.G}.`,
    shortcut: "Filter the options twice: retain only paternal uncles, then apply the explicit unmarried condition.",
    traps: [
      "Matching only the relation is insufficient.",
      "Do not infer unmarried status merely because a spouse is not mentioned.",
    ],
  });
}

function cousinPair(
  source: BlrCp003V6CandidateRecord,
): BlrCp003V8CandidateRecord {
  const n = names(source);
  const stems = [
    "Which of the following pairs consists of cousins?",
    "Select the pair whose members are cousins.",
    "In which option are the two people cousins?",
    "Which pair belongs to the youngest generation and has sibling parents?",
  ] as const;
  const distractorVariants: readonly (readonly OptionEntry[])[] = [
    [
      { text: `${n.C} and ${n.D}`, semanticKey: "PAIR:C:D", correct: false },
      { text: `${n.C} and ${n.F}`, semanticKey: "PAIR:C:F", correct: false },
      { text: `${n.A} and ${n.B}`, semanticKey: "PAIR:A:B", correct: false },
    ],
    [
      { text: `${n.D} and ${n.H}`, semanticKey: "PAIR:D:H", correct: false },
      { text: `${n.C} and ${n.E}`, semanticKey: "PAIR:C:E", correct: false },
      { text: `${n.A} and ${n.C}`, semanticKey: "PAIR:A:C", correct: false },
    ],
    [
      { text: `${n.C} and ${n.D}`, semanticKey: "PAIR:C:D", correct: false },
      { text: `${n.D} and ${n.G}`, semanticKey: "PAIR:D:G", correct: false },
      { text: `${n.B} and ${n.D}`, semanticKey: "PAIR:B:D", correct: false },
    ],
  ];
  const distractors =
    distractorVariants[source.seed % distractorVariants.length]!;
  const p = phases(
    source,
    [
      `${n.C} and ${n.D} are the two children of ${n.A} and ${n.B}.`,
      `${n.F} belongs to ${n.C}'s branch, while ${n.H} belongs to ${n.D}'s branch.`,
    ],
    [
      `${n.C} and ${n.D} are siblings.`,
      `Their children ${n.F} and ${n.H} are therefore cousins.`,
    ],
    [
      `The distractors represent sibling, spouse or parent-child relations.`,
      `${n.F} and ${n.H} is the only cousin pair.`,
    ],
  );
  const reasons: Record<string, string> = {
    "PAIR:F:H": `${n.F} and ${n.H} are children of siblings.`,
    "PAIR:C:D": `${n.C} and ${n.D} are siblings, not cousins.`,
    "PAIR:C:F": `${n.C} is the parent of ${n.F}.`,
    "PAIR:A:B": `${n.A} and ${n.B} are spouses.`,
    "PAIR:D:H": `${n.D} is the parent of ${n.H}.`,
    "PAIR:C:E": `${n.C} and ${n.E} are spouses.`,
    "PAIR:A:C": `${n.A} is a parent of ${n.C}.`,
    "PAIR:D:G": `${n.D} and ${n.G} are spouses.`,
    "PAIR:B:D": `${n.B} is a parent of ${n.D}.`,
  };
  return buildRecord({
    source,
    authority: "SELECT_UNORDERED_FAMILY_PAIR",
    sourceAuthority: "SELECT_UNORDERED_FAMILY_PAIR",
    prototypeId: "BLR-CP003-PROT-V8-COUSIN-PAIR",
    itemSuffix: "COUSIN-PAIR",
    prompt: cousinPassage(source),
    stem: stems[source.seed % stems.length]!,
    answerType: "UNORDERED_PERSON_PAIR",
    answerSemanticKey: "PAIR:F:H",
    optionEntries: [
      { text: `${n.F} and ${n.H}`, semanticKey: "PAIR:F:H", correct: true },
      ...distractors,
    ],
    optionShift: source.seed + 3,
    evidencePaths: source.evidencePaths,
    coreConcept: [
      "Cousins are children of siblings.",
      "A correct pair must be checked through both parental branches.",
    ],
    phases: p,
    optionReasons: reasons,
    conclusion: `${n.F} and ${n.H} are cousins.`,
    shortcut: "Move one generation upward from both names; if those two parents are siblings, the pair consists of cousins.",
    traps: [
      "Same-generation members are not automatically cousins.",
      "Do not confuse a parent-child pair with a cousin pair.",
    ],
  });
}

function inLawSet(
  source: BlrCp003V6CandidateRecord,
): BlrCp003V8CandidateRecord {
  const n = names(source);
  const stems = [
    `Which option lists the son-in-law and daughter-in-law of ${n.A} and ${n.B}?`,
    `Which option gives the complete set of children-in-law of ${n.A} and ${n.B}?`,
    `Select the option containing both in-law children of the top-generation couple.`,
    `Which option names every person married to a child of ${n.A} and ${n.B}?`,
  ] as const;
  const evidencePaths = [
    evidencePath("E", "A", "SON_IN_LAW", ["E", "C", "A"]),
    evidencePath("G", "A", "DAUGHTER_IN_LAW", ["G", "D", "A"]),
  ] as const;
  const p = phases(
    source,
    [
      `${n.C} and ${n.D} are the children of ${n.A} and ${n.B}.`,
      `${n.E} is married to ${n.C}, and ${n.G} is married to ${n.D}.`,
    ],
    [
      `${n.E} is the son-in-law of ${n.A} and ${n.B}.`,
      `${n.G} is the daughter-in-law of ${n.A} and ${n.B}.`,
    ],
    [
      `A complete answer must contain both ${n.E} and ${n.G}.`,
      `Single-name options are incomplete, while the four-name option adds the couple's own children.`,
    ],
  );
  return buildRecord({
    source,
    authority: "IDENTIFY_ALL_MEMBERS_BY_RELATION",
    sourceAuthority: "SYNTHESIZED_FROM_SHARED_GRAPH",
    prototypeId: "BLR-CP003-PROT-V8-IN-LAW-SET",
    itemSuffix: "IN-LAW-SET",
    prompt: cousinPassage(source),
    stem: stems[source.seed % stems.length]!,
    answerType: "PERSON_NAME_SET",
    answerSemanticKey: "PERSON_SET:E:G",
    optionEntries: [
      { text: `${n.E} and ${n.G}`, semanticKey: "PERSON_SET:E:G", correct: true },
      { text: `${n.E} only`, semanticKey: "PERSON_SET:E", correct: false },
      { text: `${n.G} only`, semanticKey: "PERSON_SET:G", correct: false },
      {
        text: `${n.C}, ${n.D}, ${n.E} and ${n.G}`,
        semanticKey: "PERSON_SET:C:D:E:G",
        correct: false,
      },
    ],
    optionShift: source.seed + 2,
    evidencePaths,
    coreConcept: [
      "Children-in-law are the spouses of a person's children.",
      "Complete-set options must include both branches and exclude the couple's own children.",
    ],
    phases: p,
    optionReasons: {
      "PERSON_SET:E:G": `${n.E} and ${n.G} are married to the two children of ${n.A} and ${n.B}.`,
      "PERSON_SET:E": `${n.G}, the daughter-in-law, is missing.`,
      "PERSON_SET:G": `${n.E}, the son-in-law, is missing.`,
      "PERSON_SET:C:D:E:G": `${n.C} and ${n.D} are the couple's children, not children-in-law.`,
    },
    conclusion: `${n.E} and ${n.G} form the complete in-law set.`,
    shortcut: `Find the children of ${n.A} and ${n.B}, then take only their spouses.`,
    traps: [
      "Do not include the couple's own son or daughter.",
      "A one-name answer is incomplete when both branches contain a spouse.",
    ],
  });
}

function recordFor(
  records: readonly BlrCp003V6CandidateRecord[],
  scenarioId: string,
  seed: number,
  authority: BlrCp003V6CandidateAuthority,
): BlrCp003V6CandidateRecord {
  const record = records.find(
    (entry) =>
      entry.scenarioId === scenarioId &&
      entry.seed === seed &&
      entry.provisionalAuthority === authority,
  );
  if (!record) {
    throw new Error(
      `Missing V8 source record for ${scenarioId}/${seed}/${authority}.`,
    );
  }
  return record;
}

function learnerText(record: BlrCp003V8CandidateRecord): string {
  return [
    record.sharedPrompt,
    record.stem,
    ...record.options.map((option) => option.text),
    ...record.editorial.coreConcept,
    ...record.editorial.stepByStepSolution,
    ...record.editorial.optionAnalysis.map((entry) => entry.explanation),
    record.editorial.conclusion,
    record.editorial.examShortcut,
    ...record.editorial.commonTraps,
  ].join(" ");
}

function pairKey(left: string, right: string): string {
  return [left, right].sort().join("::");
}

function assertVisualEvidence(record: BlrCp003V8CandidateRecord): void {
  const ids = record.proceduralLogic.query?.pathPersonIds ?? [];
  const nodes = new Set(ids);
  const pairs = new Set(
    ids.slice(0, -1).map((personId, index) =>
      pairKey(personId, ids[index + 1]!),
    ),
  );
  for (const path of record.evidencePaths) {
    for (const personId of path.personIds) {
      if (!nodes.has(personId)) {
        throw new Error(`V8 visual evidence omits ${personId} in ${record.itemId}.`);
      }
    }
    for (let index = 0; index < path.personIds.length - 1; index += 1) {
      const key = pairKey(
        path.personIds[index]!,
        path.personIds[index + 1]!,
      );
      if (!pairs.has(key)) {
        throw new Error(`V8 visual evidence omits ${key} in ${record.itemId}.`);
      }
    }
  }
}

function assertAuthenticity(record: BlrCp003V8CandidateRecord): void {
  const text = learnerText(record);
  if (
    /\b(?:The passage is contradictory|Divorced|Cannot be determined)\b/i.test(
      text,
    )
  ) {
    throw new Error(`V8 retained a meta distractor in ${record.itemId}.`);
  }
  if (/Don't fall for Option/i.test(text)) {
    throw new Error(`V8 retained canned option-analysis voice in ${record.itemId}.`);
  }
  if (
    record.metadata.passageAudit.indirectAnchorCount < 2 ||
    record.metadata.passageAudit.stackedLinearChain ||
    record.metadata.passageAudit.clueOrderStrategy !==
      "DISJOINT_NON_TOPOLOGICAL"
  ) {
    throw new Error(`V8 passage audit failed for ${record.itemId}.`);
  }
  if (record.editorial.solutionPhases.length !== 4) {
    throw new Error(`V8 solution phases are incomplete for ${record.itemId}.`);
  }
  assertVisualEvidence(record);
}

export function generateBlrCp003LearnerEvidenceV8Candidates(
  seeds: readonly number[] = BLR_CP003_V8_FULL_BANK_SEEDS,
): readonly BlrCp003V8CandidateRecord[] {
  const sourceRecords = generateBlrCp003LearnerEvidenceV6Candidates(seeds);
  const records: BlrCp003V8CandidateRecord[] = [];

  for (const seed of seeds) {
    const maritalSetSource = recordFor(
      sourceRecords,
      MARITAL_SCENARIO,
      seed,
      "IDENTIFY_ALL_MEMBERS_BY_RELATION",
    );
    const maritalStatusSource = recordFor(
      sourceRecords,
      MARITAL_SCENARIO,
      seed,
      "IDENTIFY_MEMBER_BY_MARITAL_STATUS",
    );
    const cousinSource = recordFor(
      sourceRecords,
      COUSIN_SCENARIO,
      seed,
      "SELECT_UNORDERED_FAMILY_PAIR",
    );

    records.push(
      maritalBrotherPair(maritalSetSource),
      paternalRelativeSet(maritalSetSource),
      identifyUnmarriedRelative(maritalStatusSource),
      cousinPair(cousinSource),
      inLawSet(cousinSource),
    );
  }

  const itemIds = new Set<string>();
  const fingerprints = new Set<string>();
  for (const record of records) {
    if (itemIds.has(record.itemId)) {
      throw new Error(`Duplicate V8 item ID ${record.itemId}.`);
    }
    if (fingerprints.has(record.metadata.semanticFingerprint)) {
      throw new Error(
        `Duplicate V8 fingerprint ${record.metadata.semanticFingerprint}.`,
      );
    }
    itemIds.add(record.itemId);
    fingerprints.add(record.metadata.semanticFingerprint);
    assertAuthenticity(record);
  }
  return records;
}

export function blrCp003V8CandidateAuthorityCounts(
  records: readonly BlrCp003V8CandidateRecord[] =
    generateBlrCp003LearnerEvidenceV8Candidates(),
): Readonly<Record<BlrCp003V8RetainedAuthority, number>> {
  const counts = Object.fromEntries(
    blrCp003V8RetainedAuthorities().map((authority) => [authority, 0]),
  ) as Record<BlrCp003V8RetainedAuthority, number>;
  for (const record of records) {
    counts[record.provisionalAuthority] += 1;
  }
  return counts;
}

export function blrCp003V8VisualPairs(
  record: BlrCp003V8CandidateRecord,
): ReadonlySet<string> {
  const ids = record.proceduralLogic.query?.pathPersonIds ?? [];
  return new Set(
    ids.slice(0, -1).map((personId, index) =>
      pairKey(personId, ids[index + 1]!),
    ),
  );
}
