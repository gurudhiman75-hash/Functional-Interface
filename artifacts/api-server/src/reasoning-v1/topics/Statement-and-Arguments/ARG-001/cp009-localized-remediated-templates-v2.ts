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

function patchHindi(template: ArgCp004LocalizedTemplate): ArgCp004LocalizedTemplate {
  switch (template.id) {
    case "ARG-CP003-QL001-T08":
      return Object.freeze({
        ...template,
        arguments: replaceArguments(
          template,
          "हाँ। {a} पर {b} छापने से {d} के दौरान {c} से जुड़ी हर समस्या तुरंत हल होने की गारंटी मिल जाएगी।",
        ),
      });

    case "ARG-CP003-QL005-T01":
      return Object.freeze({
        ...template,
        dimensions: replaceDimension(template, 3, [
          "आवेदन जमा करने",
          "सरकारी शुल्क चुकाने",
          "सेवा अनुरोध ट्रैक करने",
          "आधिकारिक जानकारी प्राप्त करने",
        ]),
        arguments: replaceArguments(
          template,
          "हाँ। {b} की मदद से {c} के लिए {a} के माध्यम से {d} में आने वाली अनावश्यक बाधाएँ कम हो सकती हैं।",
          "नहीं। क्योंकि {c} अन्य उपयोगकर्ताओं से कम संख्या में हैं, इसलिए {b} तय करते समय उनकी {a} के माध्यम से {d} की जरूरत पर विचार करना जरूरी नहीं।",
        ),
      });

    case "ARG-CP003-QL006-T04":
      return Object.freeze({
        ...template,
        dimensions: replaceDimension(template, 3, [
          "प्रभावित केंद्र की जाँच",
          "प्रमाण और दायरे का सत्यापन",
          "प्रभावित सत्रों का पृथक्करण",
          "अनुपातिक सुधार प्रक्रिया",
        ]),
      });

    default:
      return template;
  }
}

function patchPunjabi(template: ArgCp004LocalizedTemplate): ArgCp004LocalizedTemplate {
  switch (template.id) {
    case "ARG-CP003-QL001-T08":
      return Object.freeze({
        ...template,
        arguments: replaceArguments(
          template,
          "ਹਾਂ। {a} ਉੱਤੇ {b} ਛਾਪਣ ਨਾਲ {d} ਦੌਰਾਨ {c} ਨਾਲ ਜੁੜੀ ਹਰ ਸਮੱਸਿਆ ਤੁਰੰਤ ਹੱਲ ਹੋਣ ਦੀ ਗਾਰੰਟੀ ਮਿਲ ਜਾਵੇਗੀ।",
        ),
      });

    case "ARG-CP003-QL005-T01":
      return Object.freeze({
        ...template,
        dimensions: replaceDimension(template, 3, [
          "ਅਰਜ਼ੀਆਂ ਜਮ੍ਹਾਂ ਕਰਨ",
          "ਸਰਕਾਰੀ ਫੀਸਾਂ ਭਰਨ",
          "ਸੇਵਾ ਬੇਨਤੀਆਂ ਟ੍ਰੈਕ ਕਰਨ",
          "ਅਧਿਕਾਰਤ ਜਾਣਕਾਰੀ ਲੈਣ",
        ]),
        arguments: replaceArguments(
          template,
          "ਹਾਂ। {b} ਦੀ ਮਦਦ ਨਾਲ {c} ਲਈ {a} ਰਾਹੀਂ {d} ਵਿੱਚ ਆਉਣ ਵਾਲੀਆਂ ਬੇਲੋੜੀਆਂ ਰੁਕਾਵਟਾਂ ਘੱਟ ਹੋ ਸਕਦੀਆਂ ਹਨ।",
          "ਨਹੀਂ। ਕਿਉਂਕਿ {c} ਹੋਰ ਵਰਤੋਂਕਾਰਾਂ ਨਾਲੋਂ ਘੱਟ ਹਨ, ਇਸ ਲਈ {b} ਬਾਰੇ ਫੈਸਲਾ ਕਰਦੇ ਸਮੇਂ ਉਹਨਾਂ ਦੀ {a} ਰਾਹੀਂ {d} ਦੀ ਲੋੜ ਨੂੰ ਵਿਚਾਰਨਾ ਜ਼ਰੂਰੀ ਨਹੀਂ।",
        ),
      });

    case "ARG-CP003-QL006-T04":
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

    default:
      return template;
  }
}

function patchV2(locale: ArgCp004LocalizedLocale, template: ArgCp004LocalizedTemplate): ArgCp004LocalizedTemplate {
  return locale === "hi-IN" ? patchHindi(template) : patchPunjabi(template);
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
