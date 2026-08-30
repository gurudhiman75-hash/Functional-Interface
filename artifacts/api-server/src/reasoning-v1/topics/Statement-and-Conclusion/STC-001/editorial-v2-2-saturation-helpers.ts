import type { StcLocale } from "./types.ts";
import type { RenderedStcV22Template, StcV22Template, StcV22TriText } from "./editorial-v2-2-saturation-types.ts";

export const tri = (en: string, hi: string, pa: string): StcV22TriText => Object.freeze({
  "en-IN": en,
  "hi-IN": hi,
  "pa-IN": pa,
});

function positiveModulo(value: number, divisor: number): number {
  const integer = Number.isFinite(value) ? Math.trunc(value) : 0;
  return ((integer % divisor) + divisor) % divisor;
}

export function base4Digits(variantIndex: number): readonly [number, number, number, number] {
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

export function renderStcV22Template(
  template: StcV22Template,
  locale: StcLocale,
  variantIndex: number,
): RenderedStcV22Template {
  for (const dimension of template.dimensions) {
    if (dimension.length !== 4) throw new Error(`${template.id}: every saturation dimension must contain exactly four values`);
  }
  const digits = base4Digits(variantIndex);
  const values = [
    template.dimensions[0][digits[0]]![locale],
    template.dimensions[1][digits[1]]![locale],
    template.dimensions[2][digits[2]]![locale],
    template.dimensions[3][digits[3]]![locale],
  ] as const;
  const statement = fill(template.statement[locale], values);
  const firstConclusion = fill(template.conclusions[0][locale], values);
  const secondConclusion = fill(template.conclusions[1][locale], values);
  const firstExplanation = fill(template.explanation[0][locale], values);
  const secondExplanation = fill(template.explanation[1][locale], values);

  return Object.freeze({
    templateId: template.id,
    qlId: template.qlId,
    surfaceArchetype: template.surfaceArchetype,
    difficulty: template.difficulty,
    answerClass: template.answerClass,
    variantIndex: positiveModulo(variantIndex, 256),
    variantKey: digits.join(""),
    statement,
    conclusions: [firstConclusion, secondConclusion] as const,
    explanation: [firstExplanation, secondExplanation] as const,
  });
}

export function assertStcV22TemplateContract(template: StcV22Template): void {
  if (template.dimensions.some((dimension) => dimension.length !== 4)) {
    throw new Error(`${template.id}: requires four four-way dimensions`);
  }
  for (const locale of ["en-IN", "hi-IN", "pa-IN"] as const) {
    for (let variantIndex = 0; variantIndex < 256; variantIndex += 1) {
      const rendered = renderStcV22Template(template, locale, variantIndex);
      if (!rendered.statement.trim() || rendered.conclusions.some((entry) => !entry.trim())) {
        throw new Error(`${template.id}/${locale}/${variantIndex}: empty learner surface`);
      }
    }
  }
}
