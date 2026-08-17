export type SapE1R2Profile = "SSC" | "BANK";
export type SapE1R2Checkpoint = "SAP-CP-004" | "SAP-CP-005" | "SAP-CP-010";
export type SapE1R2Difficulty = "EASY" | "MEDIUM" | "HARD";

export interface SapE1R2Option {
  readonly value: string;
  readonly isCorrect: boolean;
  readonly misconceptionId: string | null;
  readonly analysis: string;
}

export interface SapE1R2Package {
  readonly profile: SapE1R2Profile;
  readonly checkpointId: SapE1R2Checkpoint;
  readonly structureId: string;
  readonly seed: number;
  readonly difficulty: SapE1R2Difficulty;
  readonly decisionCount: number;
  readonly stem: string;
  readonly canonicalAnswer: string;
  readonly options: readonly SapE1R2Option[];
  readonly correctIndex: number;
  readonly explanation: {
    readonly coreConcept: string;
    readonly steps: readonly string[];
    readonly finalAnswer: string;
  };
  readonly oracle: { readonly kind: string; readonly data: Readonly<Record<string, number | string>> };
  readonly generationIdentity: string;
  readonly canonicalPayloadKey: string;
  readonly lifecycle: {
    readonly permanentQlId: null;
    readonly contentStatus: "E1_R2_PROVISIONAL_REVIEW_CANDIDATE";
    readonly active: false;
    readonly questionStudioDiscoverable: false;
    readonly questionBankWritable: false;
    readonly testEligible: false;
    readonly publiclyPublishable: false;
  };
  readonly validation: { readonly ok: boolean; readonly errors: readonly string[] };
}

export const SAP_E1_R2_INACTIVE = Object.freeze({
  permanentQlId: null,
  contentStatus: "E1_R2_PROVISIONAL_REVIEW_CANDIDATE" as const,
  active: false as const,
  questionStudioDiscoverable: false as const,
  questionBankWritable: false as const,
  testEligible: false as const,
  publiclyPublishable: false as const,
});

export function e1r2Math(expr: string): string { return `\\( ${expr} \\)`; }
export function squareRoot(n: number | string): string { return `\\sqrt{${n}}`; }
export function cubeRoot(n: number | string): string { return `\\sqrt[3]{${n}}`; }

function fixed(value: number, places: number): string {
  return value.toFixed(places).replace(/\.0+$/, "").replace(/(\.\d*?)0+$/, "$1");
}

export function decimalNear(base: number, hundredthsOffset: number): string {
  return fixed(base + hundredthsOffset / 100, 2);
}

export function numericOptions(answer: number, correctIndex: number, step = 1, places = 0): readonly SapE1R2Option[] {
  const answerText = fixed(answer, places);
  const deltas = [-step, step, 2 * step, -2 * step, 3 * step, -3 * step];
  const wrong: string[] = [];
  for (const delta of deltas) {
    const value = fixed(answer + delta, places);
    if (value !== answerText && !wrong.includes(value)) wrong.push(value);
    if (wrong.length === 3) break;
  }
  const options: SapE1R2Option[] = [];
  let wi = 0;
  for (let pos = 0; pos < 4; pos += 1) {
    if (pos === correctIndex) options.push(Object.freeze({ value: answerText, isCorrect: true, misconceptionId: null, analysis: "Correct." }));
    else {
      const value = wrong[wi++]!;
      options.push(Object.freeze({ value, isCorrect: false, misconceptionId: "NEARBY_EXAM_DISTRACTOR", analysis: "This is a nearby result produced by a plausible rounding or arithmetic slip." }));
    }
  }
  return Object.freeze(options);
}

export function validateR2(args: { stem: string; answer: string; options: readonly SapE1R2Option[]; correctIndex: number; decisionCount: number; steps: readonly string[] }): readonly string[] {
  const errors: string[] = [];
  if (args.decisionCount < 2) errors.push("Production question must require at least two mathematical decisions.");
  if (args.options.length !== 4 || new Set(args.options.map(o => o.value)).size !== 4) errors.push("Four distinct options are required.");
  if (args.options.filter(o => o.isCorrect).length !== 1) errors.push("Exactly one correct option is required.");
  if (args.options[args.correctIndex]?.value !== args.answer) errors.push("Correct option is not answer-bound.");
  if (args.steps.length < 2 || args.steps.length > 3) errors.push("Explanation must contain 2-3 short steps.");
  if (/For estimation, take|Using cancellation|Round the required numbers|using suitable approximation/i.test(args.stem)) errors.push("Stem leaks the solving method.");
  if (/oracle|runtime|prototype|canonical|machine policy|learner route/i.test(args.stem)) errors.push("Internal wording leaked into stem.");
  if (/[√∛∜]/.test(args.stem)) errors.push("Raw Unicode radical leaked into stem.");
  return Object.freeze(errors);
}

export function packageR2(args: Omit<SapE1R2Package, "generationIdentity" | "canonicalPayloadKey" | "lifecycle" | "validation">): SapE1R2Package {
  const errors = validateR2({ stem: args.stem, answer: args.canonicalAnswer, options: args.options, correctIndex: args.correctIndex, decisionCount: args.decisionCount, steps: args.explanation.steps });
  const data = args.oracle.data;
  const payload = JSON.stringify({ profile: args.profile, checkpointId: args.checkpointId, structureId: args.structureId, seed: args.seed, stem: args.stem, answer: args.canonicalAnswer, data });
  return Object.freeze({
    ...args,
    generationIdentity: `${args.profile}:${args.checkpointId}:${args.structureId}:${args.seed}:${payload}`,
    canonicalPayloadKey: payload,
    lifecycle: SAP_E1_R2_INACTIVE,
    validation: Object.freeze({ ok: errors.length === 0, errors }),
  });
}
