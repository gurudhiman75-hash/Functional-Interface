export type SapE1CheckpointId = "SAP-CP-004" | "SAP-CP-005" | "SAP-CP-007" | "SAP-CP-010";
export type SapE1PackageId = "SAP-001" | "SAP-002";
export type SapE1Difficulty = "EASY" | "MEDIUM" | "HARD";

export interface SapE1Option {
  readonly value: string;
  readonly isCorrect: boolean;
  readonly misconceptionId: string | null;
  readonly analysis: string;
}

export interface SapE1WrongSpec {
  readonly value: string;
  readonly misconceptionId: string;
  readonly analysis: string;
}

export interface SapE1CandidatePackage {
  readonly packageId: SapE1PackageId;
  readonly checkpointId: SapE1CheckpointId;
  readonly candidateId: string;
  readonly candidateStatus: "E1_PROVISIONAL_UNALLOCATED";
  readonly sourceDisposition: string;
  readonly seed: number;
  readonly locale: "en-IN";
  readonly difficulty: SapE1Difficulty;
  readonly stem: string;
  readonly canonicalAnswer: string;
  readonly options: readonly SapE1Option[];
  readonly correctIndex: number;
  readonly explanation: {
    readonly coreConcept: string;
    readonly steps: readonly string[];
    readonly finalAnswer: string;
    readonly verification: readonly string[];
  };
  readonly oracle: { readonly kind: string; readonly data: Readonly<Record<string, number | string>> };
  readonly canonicalPayloadKey: string;
  readonly generationIdentity: string;
  readonly lifecycle: {
    readonly permanentQlId: null;
    readonly contentStatus: "E1_PROVISIONAL_REVIEW_CANDIDATE";
    readonly active: false;
    readonly questionStudioDiscoverable: false;
    readonly questionBankWritable: false;
    readonly testEligible: false;
    readonly publiclyPublishable: false;
  };
  readonly validation: { readonly ok: boolean; readonly errors: readonly string[] };
}

export const SAP_E1_INACTIVE_LIFECYCLE = Object.freeze({
  permanentQlId: null,
  contentStatus: "E1_PROVISIONAL_REVIEW_CANDIDATE" as const,
  active: false as const,
  questionStudioDiscoverable: false as const,
  questionBankWritable: false as const,
  testEligible: false as const,
  publiclyPublishable: false as const,
});

export function sapE1Options(answer: string, wrongSpecs: readonly SapE1WrongSpec[], correctIndex: number): readonly SapE1Option[] {
  const seen = new Set<string>([answer]);
  const wrong: SapE1WrongSpec[] = [];
  for (const spec of wrongSpecs) {
    if (seen.has(spec.value)) continue;
    seen.add(spec.value);
    wrong.push(spec);
  }
  let fallback = 1;
  while (wrong.length < 3) {
    const value = /^-?\d+$/.test(answer) ? String(Number(answer) + fallback) : `Alternative ${fallback}`;
    if (!seen.has(value)) {
      seen.add(value);
      wrong.push({ value, misconceptionId: "NEARBY_FINAL_SLIP", analysis: "This option reflects a small final arithmetic slip after the intended method." });
    }
    fallback += 1;
  }
  const out: SapE1Option[] = [];
  let wi = 0;
  for (let position = 0; position < 4; position += 1) {
    if (position === correctIndex) out.push(Object.freeze({ value: answer, isCorrect: true, misconceptionId: null, analysis: "Correct." }));
    else {
      const item = wrong[wi++]!;
      out.push(Object.freeze({ value: item.value, isCorrect: false, misconceptionId: item.misconceptionId, analysis: item.analysis }));
    }
  }
  return Object.freeze(out);
}

export function sapE1BaseValidation(args: { stem: string; answer: string; options: readonly SapE1Option[]; correctIndex: number; steps: readonly string[] }): readonly string[] {
  const errors: string[] = [];
  if (args.options.length !== 4 || new Set(args.options.map((o) => o.value)).size !== 4) errors.push("Four distinct options are required.");
  if (args.options.filter((o) => o.isCorrect).length !== 1) errors.push("Exactly one correct option is required.");
  if (args.options[args.correctIndex]?.value !== args.answer) errors.push("Correct option is not answer-bound.");
  if (args.steps.length < 2 || args.steps.length > 3) errors.push("Student explanation must contain 2-3 short steps.");
  return Object.freeze(errors);
}

export function sapE1Math(expr: string): string { return `\\( ${expr} \\)`; }
