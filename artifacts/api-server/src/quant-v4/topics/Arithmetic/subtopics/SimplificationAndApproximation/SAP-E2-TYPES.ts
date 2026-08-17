export type SapE2Profile = "SSC" | "BANK";
export type SapE2Checkpoint = "SAP-CP-011" | "SAP-CP-012";
export type SapE2Difficulty = "EASY" | "MEDIUM" | "HARD";

export interface SapE2Option {
  readonly value: string;
  readonly isCorrect: boolean;
  readonly misconceptionId: string | null;
  readonly analysis: string;
}

export interface SapE2Package {
  readonly profile: SapE2Profile;
  readonly checkpointId: SapE2Checkpoint;
  readonly structureId: string;
  readonly seed: number;
  readonly difficulty: SapE2Difficulty;
  readonly decisionCount: number;
  readonly stem: string;
  readonly canonicalAnswer: string;
  readonly options: readonly SapE2Option[];
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
    readonly contentStatus: "E2_PROVISIONAL_REVIEW_CANDIDATE";
    readonly active: false;
    readonly questionStudioDiscoverable: false;
    readonly questionBankWritable: false;
    readonly testEligible: false;
    readonly publiclyPublishable: false;
  };
  readonly validation: { readonly ok: boolean; readonly errors: readonly string[] };
}

export const SAP_E2_INACTIVE = Object.freeze({
  permanentQlId: null,
  contentStatus: "E2_PROVISIONAL_REVIEW_CANDIDATE" as const,
  active: false as const,
  questionStudioDiscoverable: false as const,
  questionBankWritable: false as const,
  testEligible: false as const,
  publiclyPublishable: false as const,
});

export function e2Math(expr: string): string { return `\\( ${expr} \\)`; }
export function squareRoot(value: number | string): string { return `\\sqrt{${value}}`; }
export function cubeRoot(value: number | string): string { return `\\sqrt[3]{${value}}`; }

export function halfUp(value: number, places = 0): number {
  const scale = 10 ** places;
  return Math.floor(value * scale + 0.5 + 1e-10) / scale;
}

export function fmt(value: number, places = 2): string {
  return halfUp(value, places).toFixed(places).replace(/\.0+$/, "").replace(/(\.\d*?)0+$/, "$1");
}

export function optionSet(correct: string, correctIndex: number, wrong: readonly { value: string; id: string; analysis: string }[]): readonly SapE2Option[] {
  const distinct = wrong.filter((item, index, arr) => item.value !== correct && arr.findIndex(x => x.value === item.value) === index);
  if (distinct.length < 3) throw new Error(`Need three distinct distractors for ${correct}.`);
  const out: SapE2Option[] = [];
  let wi = 0;
  for (let i = 0; i < 4; i += 1) {
    if (i === correctIndex) out.push(Object.freeze({ value: correct, isCorrect: true, misconceptionId: null, analysis: "Correct." }));
    else {
      const d = distinct[wi++]!;
      out.push(Object.freeze({ value: d.value, isCorrect: false, misconceptionId: d.id, analysis: d.analysis }));
    }
  }
  return Object.freeze(out);
}

export function nearbyNumericOptions(answer: number, correctIndex: number, step = 1, places = 0): readonly SapE2Option[] {
  const correct = fmt(answer, places);
  const deltas = [-step, step, 2 * step, -2 * step, 3 * step, -3 * step];
  const wrong: { value: string; id: string; analysis: string }[] = [];
  for (const d of deltas) {
    const value = fmt(answer + d, places);
    if (value !== correct && !wrong.some(x => x.value === value)) wrong.push({ value, id: "NEARBY_RESULT", analysis: "A nearby value from an arithmetic or approximation slip." });
    if (wrong.length === 3) break;
  }
  return optionSet(correct, correctIndex, wrong);
}

function validate(args: { stem: string; answer: string; options: readonly SapE2Option[]; correctIndex: number; decisionCount: number; steps: readonly string[] }): readonly string[] {
  const errors: string[] = [];
  if (args.decisionCount < 2) errors.push("Production item must require at least two mathematical decisions.");
  if (args.options.length !== 4 || new Set(args.options.map(x => x.value)).size !== 4) errors.push("Four distinct options are required.");
  if (args.options.filter(x => x.isCorrect).length !== 1) errors.push("Exactly one correct option is required.");
  if (args.options[args.correctIndex]?.value !== args.answer) errors.push("Correct option is not answer-bound.");
  if (args.steps.length < 2 || args.steps.length > 3) errors.push("Explanation must contain 2-3 short steps.");
  if (/For estimation, take|Using cancellation|Round the required numbers|using suitable approximation/i.test(args.stem)) errors.push("Stem leaks the solving method.");
  if (/oracle|runtime|prototype|canonical|machine policy|learner route|certified gap/i.test(args.stem)) errors.push("Internal wording leaked into stem.");
  if (/[√∛∜]/.test(args.stem)) errors.push("Raw Unicode radical leaked into stem.");
  return Object.freeze(errors);
}

export function packageE2(args: Omit<SapE2Package, "generationIdentity" | "canonicalPayloadKey" | "lifecycle" | "validation">): SapE2Package {
  const errors = validate({ stem: args.stem, answer: args.canonicalAnswer, options: args.options, correctIndex: args.correctIndex, decisionCount: args.decisionCount, steps: args.explanation.steps });
  const payload = JSON.stringify({ profile: args.profile, checkpointId: args.checkpointId, structureId: args.structureId, seed: args.seed, stem: args.stem, answer: args.canonicalAnswer, data: args.oracle.data });
  return Object.freeze({
    ...args,
    generationIdentity: `${args.profile}:${args.checkpointId}:${args.structureId}:${args.seed}:${payload}`,
    canonicalPayloadKey: payload,
    lifecycle: SAP_E2_INACTIVE,
    validation: Object.freeze({ ok: errors.length === 0, errors }),
  });
}
