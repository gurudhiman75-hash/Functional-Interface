import {
  SAP_CP010_CATALOGUE,
  SAP_CP010_POLICY,
  SAP_CP010_PROTOTYPE_IDS,
  generateSapCp010 as generateStudent,
  type SapCp010Option,
  type SapCp010Package,
  type SapCp010PrototypeId,
} from "./student-runtime";

export { SAP_CP010_CATALOGUE, SAP_CP010_POLICY, SAP_CP010_PROTOTYPE_IDS };
export type { SapCp010Package, SapCp010PrototypeId };

function wrong(value: string, misconceptionId: string, analysis: string): SapCp010Option {
  return Object.freeze({ value, isCorrect: false, misconceptionId, analysis });
}

function intervalQuestion(prototypeId: SapCp010PrototypeId, seed: number): SapCp010Package {
  const base = generateStudent(prototypeId, seed);
  const mode = SAP_CP010_PROTOTYPE_IDS.indexOf(prototypeId);
  const d = base.oracle.data;
  const lower = Number(d.lower);
  const upper = Number(d.upper);
  const n = Number(d.n);
  const symbol = mode === 0 ? `√${n}` : mode === 1 ? `∛${n}` : `∜${n}`;
  const answer = base.canonicalAnswer;
  const wrongs: readonly SapCp010Option[] = Object.freeze([
    wrong(`${lower - 1} < ${symbol} < ${lower}`, "INTERVAL_ONE_LOW", "This interval is one integer too low."),
    wrong(`${upper} < ${symbol} < ${upper + 1}`, "INTERVAL_ONE_HIGH", "This interval is one integer too high."),
    wrong(`${upper + 1} < ${symbol} < ${upper + 2}`, "INTERVAL_TWO_HIGH", "This interval is two integers too high."),
  ]);
  const correct: SapCp010Option = Object.freeze({ value: answer, isCorrect: true, misconceptionId: null, analysis: "Correct." });
  const options = [...wrongs];
  options.splice(base.correctIndex, 0, correct);
  const frozenOptions = Object.freeze(options);
  const errors = [...base.validation.errors];
  if (frozenOptions.length !== 4 || new Set(frozenOptions.map((o) => o.value)).size !== 4) errors.push("Four distinct interval options required.");
  if (frozenOptions[base.correctIndex]?.value !== answer) errors.push("Correct interval option mismatch.");
  const payload = JSON.stringify({
    prototypeId,
    stem: base.stem,
    answer,
    data: base.oracle.data,
    options: frozenOptions.map((o) => o.value),
    reviewReadyPresentation: "all-consecutive-root-interval-options",
  });
  return Object.freeze({
    ...base,
    options: frozenOptions,
    canonicalPayloadKey: payload,
    generationIdentity: `${base.generationIdentity}:review-ready-v1:interval-options:${payload}`,
    validation: Object.freeze({ ok: errors.length === 0, errors: Object.freeze(errors) }),
  });
}

export function generateSapCp010(prototypeId: SapCp010PrototypeId, seed: number): SapCp010Package {
  const mode = SAP_CP010_PROTOTYPE_IDS.indexOf(prototypeId);
  if (mode >= 0 && mode <= 2) return intervalQuestion(prototypeId, seed);
  return generateStudent(prototypeId, seed);
}

export function generateSapCp010Sweep(seedsPerMode = 100): readonly SapCp010Package[] {
  return Object.freeze(SAP_CP010_PROTOTYPE_IDS.flatMap((prototypeId) =>
    Array.from({ length: seedsPerMode }, (_, index) => generateSapCp010(prototypeId, index + 1)),
  ));
}
