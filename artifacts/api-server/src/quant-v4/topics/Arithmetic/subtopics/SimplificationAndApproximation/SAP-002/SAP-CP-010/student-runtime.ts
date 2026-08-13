import {
  SAP_CP010_CATALOGUE,
  SAP_CP010_POLICY,
  SAP_CP010_PROTOTYPE_IDS,
  generateSapCp010 as generateRelease,
  type SapCp010Option,
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
    .replace(/Each radicand remains inside the nearest-integer band of its benchmark\./gi, "Each chosen integer is the nearest whole-number estimate of its square root.")
    .replace(/The wrong options lie outside the nearest-integer band for root (\d+)\./gi, "The other choices have square roots nearer to a different integer than $1.")
    .replace(/A benchmark must be appropriate for the radicand, not merely perfect\./gi, "A perfect square must also be close to the number under the root; being perfect alone is not enough.")
    .replace(/This benchmark is farther from the root\./gi, "This integer estimate is farther from the root.")
    .replace(/certified nearest-integer benchmarks/gi, "the stated nearest-integer rule")
    .replace(/special-form estimates/gi, "root and power estimates")
    .replace(/special forms/gi, "root and power values")
    .replace(/exact cube benchmarks/gi, "nearby perfect cubes")
    .replace(/benchmark powers/gi, "nearby exact powers")
    .replace(/nearest cube-root benchmark/gi, "nearest cube-root estimate")
    .replace(/nearest integer benchmark/gi, "nearest integer estimate")
    .replace(/nearest benchmark/gi, "nearest integer estimate")
    .replace(/root benchmark/gi, "integer root estimate")
    .replace(/nearest-integer bands/gi, "ranges that round to the stated integers")
    .replace(/nearest-integer band of its benchmark/gi, "range that rounds to its stated integer")
    .replace(/nearest-integer band/gi, "range that rounds to the stated integer")
    .replace(/\bradicand\b/gi, "number under the root")
    .replace(/\^2/g, "²")
    .replace(/\^3/g, "³")
    .replace(/\^4/g, "⁴");
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
    generationIdentity: `${base.generationIdentity}:student-v2:${tag}:${payload}`,
    validation: Object.freeze({ ok: errors.length === 0, errors: Object.freeze(errors) }),
  });
}

function nearestOption(seed: number): SapCp010Package {
  const mode = 14;
  const base = generateRelease(SAP_CP010_PROTOTYPE_IDS[mode]!, seed);
  const d = base.oracle.data;
  if (d.kind !== "ROOT") return base;
  const n = Number(d.n);
  const k = Number(d.k);
  const midpoint = k + 0.5;
  const midpointSquare = midpoint ** 2;
  const steps = Object.freeze([
    `${k}² = ${k ** 2} and ${k + 1}² = ${(k + 1) ** 2}, so √${n} lies between ${k} and ${k + 1}.`,
    `${fmt(midpoint, 1)}² = ${fmt(midpointSquare, 2)}. Since ${n} < ${fmt(midpointSquare, 2)}, √${n} is below ${fmt(midpoint, 1)} and is nearer to ${k}.`,
  ]);
  const verification = Object.freeze(["The midpoint between the two consecutive integers confirms the nearest option."]);
  const payload = JSON.stringify({
    prototypeId: base.prototypeId,
    stem: base.stem,
    answer: base.canonicalAnswer,
    data: base.oracle.data,
    concept: "Use nearby perfect squares, then check the midpoint between the two possible integers.",
    steps,
    verification,
    learnerLanguage: "nearest-option-midpoint",
  });
  return Object.freeze({
    ...base,
    explanation: Object.freeze({
      coreConcept: "Use nearby perfect squares, then check the midpoint between the two possible integers.",
      steps,
      finalAnswer: base.explanation.finalAnswer,
      verification,
    }),
    canonicalPayloadKey: payload,
    generationIdentity: `${base.generationIdentity}:student-v2:nearest-option-midpoint:${payload}`,
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
  const answer = `Use ${correctRoot}, because ${correctRoot}² = ${correctRoot ** 2} is the nearer perfect square.`;
  const options = Object.freeze(base.options.map((option): SapCp010Option => {
    if (option.isCorrect) return Object.freeze({ ...option, value: answer });
    return option;
  }));
  const concept = "Compare the nearby perfect squares and use the integer that is actually nearest to the square root.";
  const steps = Object.freeze([
    `${correctRoot}² = ${correctRoot ** 2} and ${wrongRoot}² = ${wrongRoot ** 2}.`,
    `${fmt(midpoint, 1)}² = ${fmt(midpointSquare, 2)}. Since ${n} < ${fmt(midpointSquare, 2)}, √${n} < ${fmt(midpoint, 1)} and is nearer to ${correctRoot}.`,
  ]);
  const verification = Object.freeze(["The midpoint between the two consecutive integers confirms the nearer estimate."]);
  const visible = `${base.stem} ${answer} ${options.map((o) => o.value).join(" ")} ${concept} ${steps.join(" ")} ${verification.join(" ")}`;
  const errors = [...base.validation.errors];
  if (options[base.correctIndex]?.value !== answer) errors.push("Correct diagnosis option mismatch.");
  if (/oracle|runtime|prototype|canonical|internal|guard|machine policy/i.test(visible)) errors.push("Internal wording leaked.");
  const payload = JSON.stringify({
    prototypeId: base.prototypeId,
    stem: base.stem,
    answer,
    data: base.oracle.data,
    concept,
    steps,
    verification,
    learnerLanguage: "wrong-benchmark-midpoint",
  });
  return Object.freeze({
    ...base,
    canonicalAnswer: answer,
    options,
    explanation: Object.freeze({
      coreConcept: concept,
      steps,
      finalAnswer: `Answer: ${answer}.`,
      verification,
    }),
    canonicalPayloadKey: payload,
    generationIdentity: `${base.generationIdentity}:student-v2:wrong-benchmark-midpoint:${payload}`,
    validation: Object.freeze({ ok: errors.length === 0, errors: Object.freeze(errors) }),
  });
}

export function generateSapCp010(prototypeId: SapCp010PrototypeId, seed: number): SapCp010Package {
  const base = prototypeId === SAP_CP010_PROTOTYPE_IDS[14]
    ? nearestOption(seed)
    : prototypeId === SAP_CP010_PROTOTYPE_IDS[16]
      ? wrongBenchmark(seed)
      : generateRelease(prototypeId, seed);
  return polish(
    base,
    prototypeId === SAP_CP010_PROTOTYPE_IDS[14]
      ? "plain-plus-nearest-option-midpoint"
      : prototypeId === SAP_CP010_PROTOTYPE_IDS[16]
        ? "plain-plus-diagnosis-midpoint"
        : "plain-language",
  );
}

export function generateSapCp010Sweep(seedsPerMode = 100): readonly SapCp010Package[] {
  return Object.freeze(SAP_CP010_PROTOTYPE_IDS.flatMap((prototypeId) =>
    Array.from({ length: seedsPerMode }, (_, index) => generateSapCp010(prototypeId, index + 1)),
  ));
}
