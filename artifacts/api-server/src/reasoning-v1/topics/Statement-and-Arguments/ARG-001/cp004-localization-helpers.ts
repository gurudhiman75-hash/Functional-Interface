import { argCp003Base4Digits } from "./cp003-saturation-helpers.ts";
import type { ArgCp004LocalizedTemplate, RenderedArgCp004LocalizedTemplate } from "./cp004-localization-types.ts";

function fill(template: string, values: readonly [string, string, string, string]): string {
  return template
    .replaceAll("{a}", values[0])
    .replaceAll("{b}", values[1])
    .replaceAll("{c}", values[2])
    .replaceAll("{d}", values[3]);
}

export function renderArgCp004LocalizedTemplate(
  template: ArgCp004LocalizedTemplate,
  variantIndex: number,
): RenderedArgCp004LocalizedTemplate {
  const digits = argCp003Base4Digits(variantIndex);
  const values = [
    template.dimensions[0][digits[0]],
    template.dimensions[1][digits[1]],
    template.dimensions[2][digits[2]],
    template.dimensions[3][digits[3]],
  ] as const;

  const renderArgument = (argument: ArgCp004LocalizedTemplate["arguments"][number]) => Object.freeze({
    text: fill(argument.text, values),
    explanation: fill(argument.explanation, values),
  });

  return Object.freeze({
    templateId: template.id,
    qlId: template.qlId,
    locale: template.locale,
    variantIndex: ((Math.trunc(variantIndex) % 256) + 256) % 256,
    variantKey: digits.join(""),
    statement: fill(template.statement, values),
    arguments: [renderArgument(template.arguments[0]), renderArgument(template.arguments[1])] as const,
  });
}

export function assertArgCp004LocalizedTemplateContract(template: ArgCp004LocalizedTemplate): void {
  for (const dimension of template.dimensions) {
    if (dimension.length !== 4 || new Set(dimension).size !== 4) {
      throw new Error(`${template.id}/${template.locale}: each localized dimension must contain four distinct values`);
    }
  }

  const surfaces = new Set<string>();
  for (let variant = 0; variant < 256; variant += 1) {
    const rendered = renderArgCp004LocalizedTemplate(template, variant);
    const key = `${rendered.statement}\n${rendered.arguments[0].text}\n${rendered.arguments[1].text}`;
    if (/\{[abcd]\}/.test(key)) {
      throw new Error(`${template.id}/${template.locale}: unresolved placeholder at variant ${variant}`);
    }
    if (surfaces.has(key)) {
      throw new Error(`${template.id}/${template.locale}: duplicate learner surface at variant ${variant}`);
    }
    surfaces.add(key);
  }
  if (surfaces.size !== 256) {
    throw new Error(`${template.id}/${template.locale}: expected 256 distinct localized surfaces`);
  }
}
