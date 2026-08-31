import type { ArgAnswerClass } from "./types.ts";
import type { ArgCp003Template, RenderedArgCp003Template } from "./cp003-saturation-types.ts";

function positiveModulo(value: number, divisor: number): number {
  const integer = Number.isFinite(value) ? Math.trunc(value) : 0;
  return ((integer % divisor) + divisor) % divisor;
}

export function argCp003Base4Digits(variantIndex: number): readonly [number, number, number, number] {
  let value = positiveModulo(variantIndex, 256);
  const d0 = value & 3;
  value >>>= 2;
  const d1 = value & 3;
  value >>>= 2;
  const d2 = value & 3;
  value >>>= 2;
  const d3 = value & 3;
  return [d0, d1, d2, d3] as const;
}

function fill(template: string, values: readonly [string, string, string, string]): string {
  return template
    .replaceAll("{a}", values[0])
    .replaceAll("{b}", values[1])
    .replaceAll("{c}", values[2])
    .replaceAll("{d}", values[3]);
}

export function renderArgCp003Template(template: ArgCp003Template, variantIndex: number): RenderedArgCp003Template {
  for (const dimension of template.dimensions) {
    if (dimension.length !== 4) throw new Error(`${template.id}: every saturation dimension must contain exactly four values`);
  }

  const digits = argCp003Base4Digits(variantIndex);
  const values = [
    template.dimensions[0][digits[0]]!,
    template.dimensions[1][digits[1]]!,
    template.dimensions[2][digits[2]]!,
    template.dimensions[3][digits[3]]!,
  ] as const;

  const renderArgument = (argument: ArgCp003Template["arguments"][number]) => Object.freeze({
    stance: argument.stance,
    strength: argument.strength,
    ...(argument.weaknessDefect ? { weaknessDefect: argument.weaknessDefect } : {}),
    text: fill(argument.text, values),
    explanation: fill(argument.explanation, values),
  });

  return Object.freeze({
    templateId: template.id,
    qlId: template.qlId,
    archetype: template.archetype,
    difficulty: template.difficulty,
    answerClass: template.answerClass,
    variantIndex: positiveModulo(variantIndex, 256),
    variantKey: digits.join(""),
    statement: fill(template.statement, values),
    arguments: [renderArgument(template.arguments[0]), renderArgument(template.arguments[1])] as const,
  });
}

export function answerClassFromCp003Strengths(first: "STRONG" | "WEAK", second: "STRONG" | "WEAK"): ArgAnswerClass {
  if (first === "STRONG" && second === "STRONG") return "BOTH";
  if (first === "STRONG") return "ONLY_I";
  if (second === "STRONG") return "ONLY_II";
  return "NEITHER";
}

export function reverseArgAnswerClass(answerClass: ArgAnswerClass): ArgAnswerClass {
  if (answerClass === "ONLY_I") return "ONLY_II";
  if (answerClass === "ONLY_II") return "ONLY_I";
  return answerClass;
}

export function assertArgCp003TemplateContract(template: ArgCp003Template): void {
  if (template.dimensions.some((dimension) => dimension.length !== 4)) {
    throw new Error(`${template.id}: requires four four-way semantic dimensions`);
  }
  const derived = answerClassFromCp003Strengths(template.arguments[0].strength, template.arguments[1].strength);
  if (derived !== template.answerClass) {
    throw new Error(`${template.id}: answer class ${template.answerClass} disagrees with argument strengths (${derived})`);
  }
  for (const argument of template.arguments) {
    if (argument.strength === "STRONG" && argument.weaknessDefect) {
      throw new Error(`${template.id}: strong argument cannot carry weakness defect ${argument.weaknessDefect}`);
    }
    if (argument.strength === "WEAK" && !argument.weaknessDefect) {
      throw new Error(`${template.id}: weak argument must carry an explicit weakness defect`);
    }
  }
  const surfaces = new Set<string>();
  for (let variant = 0; variant < 256; variant += 1) {
    const rendered = renderArgCp003Template(template, variant);
    const key = `${rendered.statement}\n${rendered.arguments[0].text}\n${rendered.arguments[1].text}`;
    if (surfaces.has(key)) throw new Error(`${template.id}: duplicate learner surface at variant ${variant}`);
    surfaces.add(key);
    if (/\{[abcd]\}/.test(key)) throw new Error(`${template.id}: unresolved placeholder at variant ${variant}`);
  }
  if (surfaces.size !== 256) throw new Error(`${template.id}: expected 256 distinct rendered surfaces`);
}
