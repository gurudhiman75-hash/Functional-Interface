import { stableHash } from "../foundation/prng";
import type { BlrCp003V6CandidateOption } from "./cp003-learner-evidence-v6-candidate";
import {
  generateBlrCp003V9Wave01StructuralStagingApprovedRecords,
  type BlrCp003V9Wave01StructuralStagingApprovedRecord,
} from "./cp003-v9-wave01-structural-staging-approved";

export const BLR_CP003_V10_TASK_CONTRACT_GAP_WAVE_02_VERSION =
  "BLR_CP003_V10_TASK_CONTRACT_GAP_WAVE_02_V1" as const;

export type BlrCp003V10Authority =
  | "IDENTIFY_MEMBER_BY_EXCLUSION"
  | "IDENTIFY_MEMBER_WITH_UNDETERMINED_MARITAL_STATUS";

export type BlrCp003V10TaskContract =
  | "NEGATIVE_RELATION_EXCLUSION"
  | "OPEN_WORLD_STATUS_BOUNDARY";

export type BlrCp003V10Record = Omit<
  BlrCp003V9Wave01StructuralStagingApprovedRecord,
  "provisionalAuthority" | "sourceAuthority" | "prototypeId" | "prototypeFamily" | "itemId" | "stem" | "answerSemanticKey" | "options" | "correctIndex" | "editorial" | "metadata"
> & {
  provisionalAuthority: BlrCp003V10Authority;
  sourceAuthority: "TASK_CONTRACT_GAP_WAVE_02";
  prototypeId: string;
  prototypeFamily: BlrCp003V10TaskContract;
  itemId: string;
  stem: string;
  answerSemanticKey: string;
  options: readonly BlrCp003V6CandidateOption[];
  correctIndex: number;
  editorial: BlrCp003V9Wave01StructuralStagingApprovedRecord["editorial"];
  metadata: Omit<
    BlrCp003V9Wave01StructuralStagingApprovedRecord["metadata"],
    | "structuralStagingApprovalVersion"
    | "approvalScope"
    | "approvedReviewVersion"
    | "approvalDate"
    | "approvedBy"
    | "humanReviewApproved"
    | "wave01StructuralStagingApproved"
    | "semanticFingerprint"
  > & {
    taskGapWaveVersion: typeof BLR_CP003_V10_TASK_CONTRACT_GAP_WAVE_02_VERSION;
    taskContract: BlrCp003V10TaskContract;
    humanReviewApproved: false;
    wave01StructuralStagingApproved: false;
    taskWave02StructuralStagingApproved: false;
    structuralSaturationApproved: false;
    productionStagingApproved: false;
    negativeClueCount: number;
    openWorldBoundaryApplied: boolean;
    silenceDoesNotImplyUnmarried: true;
    contentDerivedFromApprovedWave01Graph: true;
    semanticFingerprint: string;
  };
};

type PersonOption = { id: string; correct: boolean };

type ContractConfig = {
  topologyId: BlrCp003V9Wave01StructuralStagingApprovedRecord["topologyId"];
  sourcePrototypeId: string;
  exclusion: {
    prototypeId: string;
    stem: (n: Readonly<Record<string, string>>) => string;
    answerId: string;
    options: readonly PersonOption[];
    concept: string;
    trace: (n: Readonly<Record<string, string>>) => readonly string[];
    reasons: (n: Readonly<Record<string, string>>) => Readonly<Record<string, string>>;
  };
  unknown: {
    prototypeId: string;
    stem: (n: Readonly<Record<string, string>>) => string;
    answerId: string;
    options: readonly PersonOption[];
    concept: string;
    trace: (n: Readonly<Record<string, string>>) => readonly string[];
    reasons: (n: Readonly<Record<string, string>>) => Readonly<Record<string, string>>;
  };
};

const CONFIGS: readonly ContractConfig[] = [
  {
    topologyId: "MULTI_MARRIED_SIBLING_IN_LAW",
    sourcePrototypeId: "BLR-CP003-PROT-V9-THREE-CHILDREN-IN-LAW-SET",
    exclusion: {
      prototypeId: "BLR-CP003-PROT-V10-NOT-CHILD-IN-LAW",
      stem: (n) => `Who is a child of ${n.A} and ${n.B}, but not their child-in-law?`,
      answerId: "C",
      options: [
        { id: "C", correct: true },
        { id: "F", correct: false },
        { id: "G", correct: false },
        { id: "H", correct: false },
      ],
      concept: "A negative condition must exclude every spouse-of-child candidate before selecting a birth child.",
      trace: (n) => [
        `${n.F}, ${n.G} and ${n.H} are spouses of the top couple's children.`,
        `${n.C} is their own child, so ${n.C} satisfies the stated exclusion.`,
      ],
      reasons: (n) => ({
        C: `${n.C} is a birth child of ${n.A} and ${n.B}, not a child-in-law.`,
        F: `${n.F} is married to ${n.C} and is therefore a child-in-law.`,
        G: `${n.G} is married to ${n.D} and is therefore a child-in-law.`,
        H: `${n.H} is married to ${n.E} and is therefore a child-in-law.`,
      }),
    },
    unknown: {
      prototypeId: "BLR-CP003-PROT-V10-UNDETERMINED-MARITAL-STATUS-MULTI",
      stem: (n) => `Whose marital status cannot be determined from the given information?`,
      answerId: "I",
      options: [
        { id: "I", correct: true },
        { id: "L", correct: false },
        { id: "C", correct: false },
        { id: "D", correct: false },
      ],
      concept: "In an open-world passage, absence of a spouse statement means unknown, not unmarried.",
      trace: (n) => [
        `${n.C} and ${n.D} have explicit spouses, while ${n.L} is explicitly unmarried.`,
        `No marital-status statement is made about ${n.I}; the only valid conclusion is undetermined.`,
      ],
      reasons: (n) => ({
        I: `The passage gives no spouse or unmarried statement for ${n.I}.`,
        L: `${n.L} is explicitly described as unmarried.`,
        C: `${n.C} is explicitly married to ${n.F}.`,
        D: `${n.D} is explicitly married to ${n.G}.`,
      }),
    },
  },
  {
    topologyId: "MATERNAL_PATERNAL_DUAL_BRANCH",
    sourcePrototypeId: "BLR-CP003-PROT-V9-FOUR-GRANDPARENT-SET",
    exclusion: {
      prototypeId: "BLR-CP003-PROT-V10-PARENT-NOT-GRANDPARENT",
      stem: (n) => `Who is a parent of ${n.I}, but not a grandparent of ${n.I}?`,
      answerId: "C",
      options: [
        { id: "C", correct: true },
        { id: "A", correct: false },
        { id: "B", correct: false },
        { id: "F", correct: false },
      ],
      concept: "The positive role and the negative role must both be tested against the same reference person.",
      trace: (n) => [
        `${n.C} is directly a parent of ${n.I}.`,
        `${n.A}, ${n.B} and ${n.F} are one generation higher and are grandparents.`,
      ],
      reasons: (n) => ({
        C: `${n.C} is ${n.I}'s father, not a grandparent.`,
        A: `${n.A} is a paternal grandparent of ${n.I}.`,
        B: `${n.B} is a paternal grandparent of ${n.I}.`,
        F: `${n.F} is a maternal grandparent of ${n.I}.`,
      }),
    },
    unknown: {
      prototypeId: "BLR-CP003-PROT-V10-UNDETERMINED-MARITAL-STATUS-DUAL",
      stem: () => "Whose marital status is not established by any statement in the passage?",
      answerId: "I",
      options: [
        { id: "I", correct: true },
        { id: "C", correct: false },
        { id: "D", correct: false },
        { id: "H", correct: false },
      ],
      concept: "A family graph may establish parentage without establishing the child's marital status.",
      trace: (n) => [
        `${n.C}, ${n.D} and ${n.H} are each connected to an explicit spouse.`,
        `${n.I} appears as a child, but the passage makes no marital-status claim about ${n.I}.`,
      ],
      reasons: (n) => ({
        I: `No statement identifies ${n.I} as married or unmarried.`,
        C: `${n.C} is explicitly married to ${n.E}.`,
        D: `${n.D} is explicitly married to ${n.L}.`,
        H: `${n.H} is explicitly married to ${n.N}.`,
      }),
    },
  },
  {
    topologyId: "FOUR_GENERATION_ASYMMETRIC_LINEAGE",
    sourcePrototypeId: "BLR-CP003-PROT-V9-GREAT-GRANDPARENT-PAIR",
    exclusion: {
      prototypeId: "BLR-CP003-PROT-V10-GRANDPARENT-NOT-GREAT-GRANDPARENT",
      stem: (n) => `Who is a grandparent of ${n.G}, but not a great-grandparent of ${n.G}?`,
      answerId: "C",
      options: [
        { id: "C", correct: true },
        { id: "A", correct: false },
        { id: "B", correct: false },
        { id: "E", correct: false },
      ],
      concept: "Generation exclusion requires exact depth counting rather than choosing any ancestor.",
      trace: (n) => [
        `${n.C} is two parent links above ${n.G}, so ${n.C} is a grandparent.`,
        `${n.A} and ${n.B} are three links above, while ${n.E} is only one link above.`,
      ],
      reasons: (n) => ({
        C: `${n.C} is a grandparent of ${n.G} and is not at great-grandparent depth.`,
        A: `${n.A} is a great-grandparent of ${n.G}.`,
        B: `${n.B} is a great-grandparent of ${n.G}.`,
        E: `${n.E} is a parent of ${n.G}, not a grandparent.`,
      }),
    },
    unknown: {
      prototypeId: "BLR-CP003-PROT-V10-UNDETERMINED-MARITAL-STATUS-FOUR-GEN",
      stem: () => "For which person does the passage leave marital status undetermined?",
      answerId: "G",
      options: [
        { id: "G", correct: true },
        { id: "A", correct: false },
        { id: "C", correct: false },
        { id: "E", correct: false },
      ],
      concept: "Being present in the youngest generation does not itself prove unmarried status.",
      trace: (n) => [
        `${n.A}, ${n.C} and ${n.E} each have an explicitly stated spouse.`,
        `The passage gives no spouse or unmarried statement for ${n.G}.`,
      ],
      reasons: (n) => ({
        G: `${n.G}'s marital status is not stated.`,
        A: `${n.A} is explicitly married to ${n.B}.`,
        C: `${n.C} is explicitly married to ${n.D}.`,
        E: `${n.E} is explicitly married to ${n.F}.`,
      }),
    },
  },
] as const;

function names(record: BlrCp003V9Wave01StructuralStagingApprovedRecord): Readonly<Record<string, string>> {
  return Object.fromEntries(record.proceduralLogic.nodes.map((node) => [node.id, node.label]));
}

function rotate<T>(values: readonly T[], shift: number): T[] {
  const offset = ((shift % values.length) + values.length) % values.length;
  return [...values.slice(offset), ...values.slice(0, offset)];
}

function buildOptions(
  entries: readonly PersonOption[],
  n: Readonly<Record<string, string>>,
  shift: number,
): { options: BlrCp003V6CandidateOption[]; correctIndex: number } {
  const options = rotate(entries, shift).map((entry) => ({
    text: n[entry.id]!,
    semanticKey: `PERSON:${entry.id}`,
    isCorrect: entry.correct,
  }));
  const correctIndex = options.findIndex((option) => option.isCorrect);
  if (options.length !== 4 || correctIndex < 0 || new Set(options.map((o) => o.text)).size !== 4) {
    throw new Error("Invalid V10 task-contract option set.");
  }
  return { options, correctIndex };
}

function optionAnalysis(
  options: readonly BlrCp003V6CandidateOption[],
  reasons: Readonly<Record<string, string>>,
): BlrCp003V9Wave01StructuralStagingApprovedRecord["editorial"]["optionAnalysis"] {
  return options.map((option, index) => ({
    optionLabel: String.fromCharCode(65 + index) as "A" | "B" | "C" | "D",
    optionText: option.text,
    isCorrect: option.isCorrect,
    explanation: `${option.isCorrect ? "Correct" : "Incorrect"}: ${reasons[option.semanticKey.split(":")[1]!]}`,
  }));
}

function derive(
  source: BlrCp003V9Wave01StructuralStagingApprovedRecord,
  config: ContractConfig,
  kind: "exclusion" | "unknown",
): BlrCp003V10Record {
  const contract = config[kind];
  const n = names(source);
  const built = buildOptions(contract.options, n, source.seed + (kind === "unknown" ? 1 : 0));
  const answerSemanticKey = `PERSON:${contract.answerId}`;
  const reasons = contract.reasons(n);
  const taskContract: BlrCp003V10TaskContract =
    kind === "exclusion" ? "NEGATIVE_RELATION_EXCLUSION" : "OPEN_WORLD_STATUS_BOUNDARY";
  const stem = contract.stem(n);
  const trace = contract.trace(n);
  const conclusion = `${n[contract.answerId]} is the only option satisfying the complete task contract.`;
  return {
    ...source,
    provisionalAuthority:
      kind === "exclusion"
        ? "IDENTIFY_MEMBER_BY_EXCLUSION"
        : "IDENTIFY_MEMBER_WITH_UNDETERMINED_MARITAL_STATUS",
    sourceAuthority: "TASK_CONTRACT_GAP_WAVE_02",
    prototypeId: contract.prototypeId,
    prototypeFamily: taskContract,
    itemId: `BLR-CP003-V10-${source.topologyId}-${source.seed}-${kind.toUpperCase()}`,
    stem,
    answerType: "PERSON_NAME",
    answerSemanticKey,
    options: built.options,
    correctIndex: built.correctIndex,
    editorial: {
      coreConcept: [contract.concept, "Apply every positive, negative and information-boundary condition before selecting an option."],
      stepByStepSolution: [...trace, conclusion],
      optionAnalysis: optionAnalysis(built.options, reasons),
      conclusion,
      examShortcut:
        kind === "exclusion"
          ? "Mark the positive relation first, then cross out anyone who also matches the forbidden relation."
          : "Separate explicit facts from silence: no spouse statement means unknown, not unmarried.",
      commonTraps:
        kind === "exclusion"
          ? ["Ignoring the word 'not' changes the solve contract.", "Do not stop after matching only the positive relation."]
          : ["Do not convert missing information into an unmarried claim.", "A child or young-generation member is not automatically unmarried."],
      solutionPhases: [
        { title: "1. Parse the full condition", points: [contract.concept] },
        { title: "2. Establish the family facts", points: [trace[0]!] },
        { title: "3. Apply exclusion or boundary", points: [trace[1]!] },
        { title: "4. Confirm the option", points: [conclusion] },
      ],
    },
    metadata: {
      ...source.metadata,
      taskGapWaveVersion: BLR_CP003_V10_TASK_CONTRACT_GAP_WAVE_02_VERSION,
      taskContract,
      humanReviewApproved: false,
      wave01StructuralStagingApproved: false,
      taskWave02StructuralStagingApproved: false,
      structuralSaturationApproved: false,
      productionStagingApproved: false,
      negativeClueCount: kind === "exclusion" ? 1 : 0,
      openWorldBoundaryApplied: kind === "unknown",
      silenceDoesNotImplyUnmarried: true,
      contentDerivedFromApprovedWave01Graph: true,
      semanticFingerprint: stableHash([
        source.metadata.semanticFingerprint,
        BLR_CP003_V10_TASK_CONTRACT_GAP_WAVE_02_VERSION,
        contract.prototypeId,
        stem,
        answerSemanticKey,
      ]),
    },
  };
}

export function generateBlrCp003V10TaskContractGapWave02(): readonly BlrCp003V10Record[] {
  const approved = generateBlrCp003V9Wave01StructuralStagingApprovedRecords();
  const records: BlrCp003V10Record[] = [];
  for (const config of CONFIGS) {
    const sources = approved.filter(
      (record) =>
        record.topologyId === config.topologyId &&
        record.prototypeId === config.sourcePrototypeId,
    );
    if (sources.length !== 8) {
      throw new Error(`Expected eight V10 sources for ${config.topologyId}, received ${sources.length}.`);
    }
    for (const source of sources) {
      records.push(derive(source, config, "exclusion"));
      records.push(derive(source, config, "unknown"));
    }
  }
  const fingerprints = new Set(records.map((record) => record.metadata.semanticFingerprint));
  if (records.length !== 48 || fingerprints.size !== records.length) {
    throw new Error("Invalid V10 task-contract wave inventory.");
  }
  return records;
}
