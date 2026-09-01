import { argCp003Base4Digits, answerClassFromCp003Strengths } from "./cp003-saturation-helpers.ts";
import type { ArgCp003Template } from "./cp003-saturation-types.ts";
import type { ArgCp009Template, RenderedArgCp009Template } from "./cp009-remediation-types.ts";

function positiveModulo(value: number, divisor: number): number {
  const integer = Number.isFinite(value) ? Math.trunc(value) : 0;
  return ((integer % divisor) + divisor) % divisor;
}

function fill(template: string, values: readonly [string, string, string, string]): string {
  return template
    .replaceAll("{a}", values[0])
    .replaceAll("{b}", values[1])
    .replaceAll("{c}", values[2])
    .replaceAll("{d}", values[3]);
}

export function renderArgCp009Template(template: ArgCp009Template, variantIndex: number): RenderedArgCp009Template {
  if (template.dimensions.some((dimension) => dimension.length !== 4)) {
    throw new Error(`${template.id}: CP009 base dimensions must remain four-way`);
  }

  const digits = argCp003Base4Digits(variantIndex);
  const values: [string, string, string, string] = [
    template.dimensions[0][digits[0]]!,
    template.dimensions[1][digits[1]]!,
    template.dimensions[2][digits[2]]!,
    template.dimensions[3][digits[3]]!,
  ];

  const occupied = new Set<number>();
  for (const correlated of template.correlatedPairs ?? []) {
    const [left, right] = correlated.dimensions;
    if (left === right) throw new Error(`${template.id}: correlated dimensions must be distinct`);
    if (occupied.has(left) || occupied.has(right)) {
      throw new Error(`${template.id}: a dimension cannot belong to more than one correlated pair`);
    }
    if (correlated.values.length !== 16) {
      throw new Error(`${template.id}: correlated pair ${left}/${right} must contain exactly sixteen curated values`);
    }
    occupied.add(left);
    occupied.add(right);
    const pairIndex = digits[left] * 4 + digits[right];
    const selected = correlated.values[pairIndex]!;
    values[left] = selected[0];
    values[right] = selected[1];
  }

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
    remediationAuthority: template.remediationAuthority,
  });
}

export function assertArgCp009TemplateContract(template: ArgCp009Template): void {
  const derived = answerClassFromCp003Strengths(template.arguments[0].strength, template.arguments[1].strength);
  if (derived !== template.answerClass) {
    throw new Error(`${template.id}: answer class ${template.answerClass} disagrees with argument strengths (${derived})`);
  }

  const surfaces = new Set<string>();
  for (let variant = 0; variant < 256; variant += 1) {
    const rendered = renderArgCp009Template(template, variant);
    const key = `${rendered.statement}\n${rendered.arguments[0].text}\n${rendered.arguments[1].text}`;
    if (/\{[abcd]\}/.test(key)) throw new Error(`${template.id}: unresolved placeholder at variant ${variant}`);
    if (surfaces.has(key)) throw new Error(`${template.id}: duplicate learner surface at variant ${variant}`);
    surfaces.add(key);
  }
  if (surfaces.size !== 256) throw new Error(`${template.id}: expected 256 distinct remediated surfaces`);
}
