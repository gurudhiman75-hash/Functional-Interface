import type { ArgCp004LocalizedLocale, ArgCp004LocalizedTemplate } from "./cp004-localization-types.ts";
import {
  ARG_CP009_LOCALIZED_TEMPLATES_BY_LOCALE as ARG_CP009_LOCALIZED_TEMPLATES_BY_LOCALE_V1,
} from "./cp009-localized-remediated-templates.ts";
import { ARG_QL_IDS, type ArgQlId } from "./types.ts";

export const ARG_CP009_LOCALIZATION_AUTHORITY_V2 = "ARG_CP009_TRILINGUAL_EDITORIAL_REMEDIATION_V2" as const;

function replaceArguments(
  template: ArgCp004LocalizedTemplate,
  firstText?: string,
  secondText?: string,
): ArgCp004LocalizedTemplate["arguments"] {
  return Object.freeze([
    Object.freeze({ ...template.arguments[0], ...(firstText === undefined ? {} : { text: firstText }) }),
    Object.freeze({ ...template.arguments[1], ...(secondText === undefined ? {} : { text: secondText }) }),
  ]) as ArgCp004LocalizedTemplate["arguments"];
}

function replaceDimension(
  template: ArgCp004LocalizedTemplate,
  index: 0 | 1 | 2 | 3,
  values: readonly [string, string, string, string],
): ArgCp004LocalizedTemplate["dimensions"] {
  const dimensions = [
    template.dimensions[0],
    template.dimensions[1],
    template.dimensions[2],
    template.dimensions[3],
  ] as [readonly string[], readonly string[], readonly string[], readonly string[]];
  dimensions[index] = Object.freeze([...values]);
  return Object.freeze(dimensions) as ArgCp004LocalizedTemplate["dimensions"];
}

function patchV2(locale: ArgCp004LocalizedLocale, template: ArgCp004LocalizedTemplate): ArgCp004LocalizedTemplate {
  if (template.id !== "ARG-CP003-QL006-T04") return template;

  if (locale === "hi-IN") {
    return Object.freeze({
      ...template,
      dimensions: replaceDimension(template, 3, [
        "प्रभावित केंद्र की जाँच",
        "प्रमाण और दायरे का सत्यापन",
        "प्रभावित सत्रों का पृथक्करण",
        "अनुपातिक सुधार प्रक्रिया",
      ]),
    });
  }

  return Object.freeze({
    ...template,
    dimensions: replaceDimension(template, 3, [
      "ਪ੍ਰਭਾਵਿਤ ਕੇਂਦਰ ਦੀ ਜਾਂਚ",
      "ਸਬੂਤ ਅਤੇ ਦਾਇਰੇ ਦੀ ਤਸਦੀਕ",
      "ਪ੍ਰਭਾਵਿਤ ਸੈਸ਼ਨਾਂ ਦੀ ਵੱਖਰੀ ਪਛਾਣ",
      "ਅਨੁਪਾਤਿਕ ਸੁਧਾਰ ਪ੍ਰਕਿਰਿਆ",
    ]),
    arguments: replaceArguments(
      template,
      undefined,
      "ਨਹੀਂ। ਅਥਾਰਟੀ ਨੂੰ ਜਾਂ ਹਰ {a} ਅਣਡਿੱਠੀ ਕਰਨੀ ਪਵੇਗੀ ਜਾਂ {b} ਸਦਾ ਲਈ ਬੰਦ ਕਰਨਾ ਪਵੇਗਾ; {d} ਬਾਰੇ ਵਿਚਾਰ ਨਹੀਂ ਕੀਤਾ ਜਾ ਸਕਦਾ।",
    ),
  });
}

function buildLocale(locale: ArgCp004LocalizedLocale): Readonly<Record<ArgQlId, readonly ArgCp004LocalizedTemplate[]>> {
  return Object.freeze(
    ARG_QL_IDS.reduce<Record<ArgQlId, readonly ArgCp004LocalizedTemplate[]>>((result, qlId) => {
      result[qlId] = Object.freeze(
        ARG_CP009_LOCALIZED_TEMPLATES_BY_LOCALE_V1[locale][qlId].map((template) => patchV2(locale, template)),
      );
      return result;
    }, {} as Record<ArgQlId, readonly ArgCp004LocalizedTemplate[]>),
  );
}

export const ARG_CP009_LOCALIZED_TEMPLATES_BY_LOCALE_V2 = Object.freeze({
  "hi-IN": buildLocale("hi-IN"),
  "pa-IN": buildLocale("pa-IN"),
});

export function getArgCp009LocalizedTemplateV2(input: {
  readonly locale: ArgCp004LocalizedLocale;
  readonly qlId: ArgQlId;
  readonly templateId: string;
}): ArgCp004LocalizedTemplate {
  const found = ARG_CP009_LOCALIZED_TEMPLATES_BY_LOCALE_V2[input.locale][input.qlId]
    .find((template) => template.id === input.templateId);
  if (!found) throw new Error(`${input.locale}/${input.qlId}: missing CP009 V2 localized template ${input.templateId}`);
  return found;
}
