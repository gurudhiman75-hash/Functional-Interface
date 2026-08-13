import {
  SAP_CP010_CATALOGUE,
  SAP_CP010_POLICY,
  SAP_CP010_PROTOTYPE_IDS,
  generateSapCp010 as generateRelease,
  type SapCp010Package,
  type SapCp010PrototypeId,
} from "./release-runtime";

export { SAP_CP010_CATALOGUE, SAP_CP010_POLICY, SAP_CP010_PROTOTYPE_IDS };
export type { SapCp010Package, SapCp010PrototypeId };

function fmt(value: number, places = 3): string {
  return value.toFixed(places).replace(/\.0+$/, "").replace(/(\.\d*?)0+$/, "$1");
}

function plain(text: string): string {
  return text
    .replace(/certified nearest-integer benchmarks/gi, "the stated nearest-integer rule")
    .replace(/special-form estimates/gi, "root and power estimates")
    .replace(/special forms/gi, "root and power values")
    .replace(/nearest-integer bands/gi, "ranges that round to the stated integers")
    .replace(/nearest-integer band of its benchmark/gi, "range that rounds to its stated integer")
    .replace(/nearest-integer band/gi, "range that rounds to the stated integer")
    .replace(/\bradicand\b/gi, "number under the root");
}

function polish(base: SapCp010Package, tag: string): SapCp010Package {
  const options = Object.freeze(base.options.map((option) => Object.freeze({
    ...option,
    analysis: plain(option.analysis),
  })));
  const concept = plain(base.explanation.coreConcept);
  const steps = Object.freeze(base.explanation.steps.map(plain));
  const verification = Object.freeze(base.explanation.verification.map(plain));
  const stem = plain(base.stem);
  const visible = `${stem} ${base.canonicalAnswer} ${options.map((o) => o.value).join(" ")} ${concept} ${steps.join(" ")} ${verification.join(" ")} ${options.map((o) => o.analysis).join(" ")}`;
  const errors = [...base.validation.errors];
  if (/\bradicand\b|certified nearest|special-form|nearest-integer band/i.test(visible)) errors.push("Technical learner wording leaked.");
  if (/oracle|runtime|prototype|canonical|internal|guard|machine policy/i.test(visible)) errors.push("Internal wording leaked.");
  const payload = JSON.stringify({
    prototypeId: base.prototypeId,
    stem,
    answer: base.canonicalAnswer,
    data: base.oracle.data,
    concept,
    steps,
    verification,
    optionAnalysis: options.map((o) => o.analysis),
    learnerLanguage: tag,
  });
  return Object.freeze({
    ...base,
    stem,
    options,
    explanation: Object.freeze({
      coreConcept: concept,
      steps,
      finalAnswer: base.explanation.finalAnswer,
      verification,
    }),
    canonicalPayloadKey: payload,
    generationIdentity: `${base.generationIdentity}:student-v1:${tag}:${payload}`,
    validation: Object.freeze({ ok: errors.length === 0, errors: Object.freeze(errors) }),
  });
}

function wrongBenchmark(seed: number): SapCp010Package {
  const mode = 16;
  const base = generateRelease(SAP_CP010_PROTOTYPE_IDS[mode]!, seed);
  const d = base.oracle.data;
  const n = Number(d.n);
  const correctRoot = Number(d.correctRoot);
  const wrongRoot = Number(d.wrongRoot);
  const midpoint = correctRoot + 0.5;
  const midpointSquare = midpoint ** 2;
  const concept = "Compare the nearby perfect squares and use the integer that is actually nearest to the square root.";
  const steps = Object.freeze([
    `${correctRoot}² = ${correctRoot ** 2} and ${wrongRoot}² = ${wrongRoot ** 2}.`,
    `${fmt(midpoint, 1)}² = ${fmt(midpointSquare, 2)}. Since ${n} < ${fmt(midpointSquare, 2)}, √${n} < ${fmt(midpoint, 1)} and is nearer to ${correctRoot}.`,
  ]);
  const verification = Object.freeze(["The midpoint between the two consecutive integers confirms the nearer estimate."]);
  const visible = `${base.stem} ${base.canonicalAnswer} ${concept} ${steps.join(" ")} ${verification.join(" ")}`;
  const errors = [...base.validation.errors];
  if (/oracle|runtime|prototype|canonical|internal|guard|machine policy/i.test(visible)) errors.push("Internal wording leaked.");
  const payload = JSON.stringify({
    prototypeId: base.prototypeId,
    stem: base.stem,
    answer: base.canonicalAnswer,
    data: base.oracle.data,
    concept,
    steps,
    verification,
    learnerLanguage: "wrong-benchmark-midpoint",
  });
  return Object.freeze({
    ...base,
    explanation: Object.freeze({
      coreConcept: concept,
      steps,
      finalAnswer: base.explanation.finalAnswer,
      verification,
    }),
    canonicalPayloadKey: payload,
    generationIdentity: `${base.generationIdentity}:student-v1:wrong-benchmark-midpoint:${payload}`,
    validation: Object.freeze({ ok: errors.length === 0, errors: Object.freeze(errors) }),
  });
}

export function generateSapCp010(prototypeId: SapCp010PrototypeId, seed: number): SapCp010Package {
  const base = prototypeId === SAP_CP010_PROTOTYPE_IDS[16]
    ? wrongBenchmark(seed)
    : generateRelease(prototypeId, seed);
  return polish(base, prototypeId === SAP_CP010_PROTOTYPE_IDS[16] ? "plain-plus-midpoint" : "plain-language");
}

export function generateSapCp010Sweep(seedsPerMode = 100): readonly SapCp010Package[] {
  return Object.freeze(SAP_CP010_PROTOTYPE_IDS.flatMap((prototypeId) =>
    Array.from({ length: seedsPerMode }, (_, index) => generateSapCp010(prototypeId, index + 1)),
  ));
}
