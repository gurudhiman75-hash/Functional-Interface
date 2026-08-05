import { getMenCp011FoundationPrototypeIds } from "./registry";
import {
  generateMenCp011FoundationPrototype,
  type MenCp011ExamReadyPackage,
} from "./runtime";
import type { MenCp011PrototypeId } from "./types";

export interface MenCp011BatchAudit {
  recordCount: number;
  exactStemCount: number;
  exactQuestionOptionCount: number;
  normalizedStemGroupCount: number;
  maximumNormalizedStemRepetition: number;
  uniquePhysicalStateCount: number;
  answerPositionCounts: Record<"A" | "B" | "C" | "D", number>;
  answerPositionSequences: Record<MenCp011PrototypeId, string>;
  blockers: string[];
  publicationEligible: false;
}

export interface MenCp011ReviewBatch {
  records: MenCp011ExamReadyPackage[];
  audit: MenCp011BatchAudit;
}

const TARGET_POSITION_PLANS: readonly (readonly number[])[] = [
  [0, 1, 2, 3, 0, 2, 1, 3, 2, 3, 0, 1],
  [1, 3, 0, 2, 2, 0, 3, 1, 3, 1, 2, 0],
  [2, 0, 3, 1, 3, 1, 2, 0, 0, 2, 1, 3],
  [3, 2, 1, 0, 1, 3, 0, 2, 2, 0, 3, 1],
] as const;

function normalizedStem(stem: string) {
  return stem
    .toLowerCase()
    .replace(/\$[^$]+\$/g, "<value>")
    .replace(/\s+/g, " ")
    .trim();
}

function physicalStateKey(question: MenCp011ExamReadyPackage) {
  const state = question.state;
  return [
    state.outerRadius,
    state.innerRadius,
    state.height,
    state.thickness,
  ].join("|");
}

function questionOptionKey(question: MenCp011ExamReadyPackage) {
  return [
    question.stem,
    ...question.options.map((option) => option.display),
  ].join("\n");
}

function duplicateCount(values: readonly string[]) {
  return values.length - new Set(values).size;
}

export function auditMenCp011ReviewBatch(
  records: readonly MenCp011ExamReadyPackage[],
): MenCp011BatchAudit {
  const exactStems = records.map((question) => question.stem);
  const exactQuestionOptions = records.map(questionOptionKey);
  const normalized = records.map((question) => normalizedStem(question.stem));
  const normalizedCounts = new Map<string, number>();
  for (const key of normalized) {
    normalizedCounts.set(key, (normalizedCounts.get(key) ?? 0) + 1);
  }
  const stateKeys = records.map(physicalStateKey);
  const answerPositionCounts = { A: 0, B: 0, C: 0, D: 0 };
  for (const question of records) {
    const label = question.options[question.correctIndex]!.label;
    answerPositionCounts[label] += 1;
  }
  const answerPositionSequences = Object.fromEntries(
    getMenCp011FoundationPrototypeIds().map((prototypeId) => [
      prototypeId,
      records
        .filter((question) => question.prototypeId === prototypeId)
        .map((question) => question.options[question.correctIndex]!.label)
        .join(""),
    ]),
  ) as Record<MenCp011PrototypeId, string>;
  const blockers = [
    "INSUFFICIENT_PHYSICAL_STATE_DIVERSITY",
    "CHAPTER_COVERAGE_INCOMPLETE",
    "PERMANENT_QLS_UNALLOCATED",
    "MANUAL_ENGLISH_REVIEW_PENDING",
  ];

  return {
    recordCount: records.length,
    exactStemCount: new Set(exactStems).size,
    exactQuestionOptionCount: new Set(exactQuestionOptions).size,
    normalizedStemGroupCount: normalizedCounts.size,
    maximumNormalizedStemRepetition: Math.max(...normalizedCounts.values()),
    uniquePhysicalStateCount: new Set(stateKeys).size,
    answerPositionCounts,
    answerPositionSequences,
    blockers,
    publicationEligible: false,
  };
}

export function generateMenCp011ReviewBatch(
  seedNamespace = "men-cp011-exam-readiness-wave01",
  recordsPerPrototype = 12,
): MenCp011ReviewBatch {
  if (recordsPerPrototype !== 12) {
    throw new Error("The current MEN-CP-011 review batch authority requires exactly 12 records per prototype.");
  }

  const prototypeIds = getMenCp011FoundationPrototypeIds();
  const records: MenCp011ExamReadyPackage[] = [];
  const usedExactStems = new Set<string>();
  const usedQuestionOptions = new Set<string>();
  const normalizedCounts = new Map<string, number>();
  const stateCountsByPrototype = new Map<MenCp011PrototypeId, Map<string, number>>();

  prototypeIds.forEach((prototypeId, prototypeIndex) => {
    const stateCounts = new Map<string, number>();
    stateCountsByPrototype.set(prototypeId, stateCounts);
    const targetPlan = TARGET_POSITION_PLANS[prototypeIndex]!;

    for (let sampleIndex = 0; sampleIndex < recordsPerPrototype; sampleIndex += 1) {
      const targetCorrectIndex = targetPlan[sampleIndex]!;
      let accepted: MenCp011ExamReadyPackage | null = null;

      for (let attempt = 0; attempt < 4096; attempt += 1) {
        const seed = `${seedNamespace}:${prototypeId}:${sampleIndex + 1}:candidate-${attempt}`;
        const candidate = generateMenCp011FoundationPrototype(prototypeId, seed);
        const stemKey = candidate.stem;
        const optionKey = questionOptionKey(candidate);
        const normalizedKey = normalizedStem(candidate.stem);
        const stateKey = physicalStateKey(candidate);

        if (candidate.correctIndex !== targetCorrectIndex) continue;
        if (usedExactStems.has(stemKey)) continue;
        if (usedQuestionOptions.has(optionKey)) continue;
        if ((normalizedCounts.get(normalizedKey) ?? 0) >= 3) continue;
        if ((stateCounts.get(stateKey) ?? 0) >= 2) continue;

        accepted = candidate;
        usedExactStems.add(stemKey);
        usedQuestionOptions.add(optionKey);
        normalizedCounts.set(normalizedKey, (normalizedCounts.get(normalizedKey) ?? 0) + 1);
        stateCounts.set(stateKey, (stateCounts.get(stateKey) ?? 0) + 1);
        break;
      }

      if (!accepted) {
        throw new Error(
          `Unable to construct a duplicate-safe MEN-CP-011 review record for ${prototypeId} sample ${sampleIndex + 1}.`,
        );
      }
      records.push(accepted);
    }
  });

  const audit = auditMenCp011ReviewBatch(records);
  if (duplicateCount(records.map((question) => question.stem)) !== 0) {
    throw new Error("The MEN-CP-011 review batch contains an exact duplicate stem.");
  }
  if (duplicateCount(records.map(questionOptionKey)) !== 0) {
    throw new Error("The MEN-CP-011 review batch contains an exact duplicate stem-and-option package.");
  }
  if (audit.maximumNormalizedStemRepetition > 3) {
    throw new Error("A normalized MEN-CP-011 stem skeleton appears more than three times.");
  }
  if (new Set(Object.values(audit.answerPositionSequences)).size !== prototypeIds.length) {
    throw new Error("MEN-CP-011 prototypes may not share the same answer-position sequence.");
  }
  if (!Object.values(audit.answerPositionCounts).every((count) => count === 12)) {
    throw new Error("The 48-record MEN-CP-011 review batch must balance A, B, C and D exactly.");
  }

  return { records, audit };
}
