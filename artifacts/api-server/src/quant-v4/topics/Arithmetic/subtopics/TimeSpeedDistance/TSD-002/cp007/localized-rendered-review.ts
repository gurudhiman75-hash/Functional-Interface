import { TSD_CP007_FROZEN_ENGLISH_REGISTRY } from "./english-freeze-registry";
import { renderCp007EnglishReviewSamples } from "./english-rendered-sample-runtime";
import {
  TSD_CP007_EFFECTIVE_HINDI_LOCALIZATION,
  TSD_CP007_EFFECTIVE_PUNJABI_LOCALIZATION,
} from "./localization-effective";
import type { TsdCp007Locale, TsdCp007LocalizedQlSpec } from "./localization-authoring";

export interface TsdCp007RenderedLocalizedQuestion {
  readonly locale: TsdCp007Locale;
  readonly qlId: `TSD-QL-${string}`;
  readonly familyId: string;
  readonly difficulty: string;
  readonly stem: string;
  readonly sourceEnglishStem: string;
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function extractBindings(template: string, rendered: string): Readonly<Record<string, string>> {
  const keys: string[] = [];
  let pattern = "^";
  let cursor = 0;

  for (const match of template.matchAll(/\{([^}]+)\}/g)) {
    const index = match.index ?? 0;
    pattern += escapeRegex(template.slice(cursor, index));
    pattern += "([\\s\\S]+?)";
    keys.push(match[1]!);
    cursor = index + match[0].length;
  }

  pattern += escapeRegex(template.slice(cursor)) + "$";
  const values = new RegExp(pattern).exec(rendered);
  if (!values) throw new Error(`Unable to recover deterministic bindings from frozen English stem: ${template}`);

  const bindings: Record<string, string> = {};
  for (let index = 0; index < keys.length; index += 1) {
    const key = keys[index]!;
    const value = values[index + 1]!;
    if (bindings[key] !== undefined && bindings[key] !== value) throw new Error(`${key}: repeated placeholder resolved inconsistently`);
    bindings[key] = value;
  }
  return Object.freeze(bindings);
}

function localizedObject(locale: TsdCp007Locale, value: string): string {
  const map: Record<TsdCp007Locale, Readonly<Record<string, string>>> = {
    "hi-IN": Object.freeze({ platform: "प्लेटफॉर्म", bridge: "पुल", tunnel: "सुरंग", "fixed section": "निश्चित खंड" }),
    "pa-IN": Object.freeze({ platform: "ਪਲੇਟਫਾਰਮ", bridge: "ਪੁਲ", tunnel: "ਸੁਰੰਗ", "fixed section": "ਨਿਰਧਾਰਤ ਹਿੱਸਾ" }),
  };
  return map[locale][value] ?? value;
}

function localizeTimelineEvent(locale: TsdCp007Locale, value: string): string {
  if (value === "the engine passes the fixed marker") {
    return locale === "hi-IN" ? "इंजन स्थिर चिन्ह को पार करता है" : "ਇੰਜਣ ਨਿਰਧਾਰਤ ਨਿਸ਼ਾਨ ਨੂੰ ਪਾਰ ਕਰਦਾ ਹੈ";
  }
  if (value === "the rear passes the same fixed marker") {
    return locale === "hi-IN" ? "ट्रेन का पिछला सिरा उसी स्थिर चिन्ह को पार करता है" : "ਟ੍ਰੇਨ ਦਾ ਪਿਛਲਾ ਸਿਰਾ ਉਸੇ ਨਿਰਧਾਰਤ ਨਿਸ਼ਾਨ ਨੂੰ ਪਾਰ ਕਰਦਾ ਹੈ";
  }

  const object = ["platform", "bridge", "tunnel", "fixed section"].find((candidate) => value.includes(candidate));
  const localized = localizedObject(locale, object ?? "fixed section");
  if (value.startsWith("the front enters the ")) {
    return locale === "hi-IN" ? `ट्रेन का अगला सिरा ${localized} में प्रवेश करता है` : `ਟ੍ਰੇਨ ਦਾ ਅਗਲਾ ਸਿਰਾ ${localized} ਵਿੱਚ ਦਾਖਲ ਹੁੰਦਾ ਹੈ`;
  }
  if (value.startsWith("the rear leaves the far end of the ")) {
    return locale === "hi-IN" ? `ट्रेन का पिछला सिरा ${localized} के दूसरे छोर से बाहर निकलता है` : `ਟ੍ਰੇਨ ਦਾ ਪਿਛਲਾ ਸਿਰਾ ${localized} ਦੇ ਦੂਜੇ ਸਿਰੇ ਤੋਂ ਬਾਹਰ ਨਿਕਲਦਾ ਹੈ`;
  }
  if (value.startsWith("the rear enters the ")) {
    return locale === "hi-IN" ? `ट्रेन का पिछला सिरा ${localized} में प्रवेश करता है` : `ਟ੍ਰੇਨ ਦਾ ਪਿਛਲਾ ਸਿਰਾ ${localized} ਵਿੱਚ ਦਾਖਲ ਹੁੰਦਾ ਹੈ`;
  }
  if (value.startsWith("the front reaches the far end of the ")) {
    return locale === "hi-IN" ? `ट्रेन का अगला सिरा ${localized} के दूसरे छोर तक पहुंचता है` : `ਟ੍ਰੇਨ ਦਾ ਅਗਲਾ ਸਿਰਾ ${localized} ਦੇ ਦੂਜੇ ਸਿਰੇ ਤੱਕ ਪਹੁੰਚਦਾ ਹੈ`;
  }
  return value;
}

function localizeEndpointConvention(locale: TsdCp007Locale, value: string): string {
  const excluded = /excluded|not included/.test(value);
  const subject = value.includes("pole") ? "pole" : value.includes("pillar") ? "pillar" : value.includes("post") ? "post" : "point";

  if (locale === "hi-IN") {
    const noun = subject === "pole" ? "खंभा" : subject === "pillar" ? "स्तंभ" : subject === "post" ? "पोस्ट" : "बिंदु";
    return excluded ? `शुरुआती ${noun} को गणना में शामिल नहीं किया गया है` : `शुरुआती ${noun} को गणना में शामिल किया गया है`;
  }

  const noun = subject === "pole" ? "ਖੰਭਾ" : subject === "pillar" ? "ਥੰਮ੍ਹ" : subject === "post" ? "ਪੋਸਟ" : "ਬਿੰਦੂ";
  return excluded ? `ਸ਼ੁਰੂਆਤੀ ${noun} ਨੂੰ ਗਿਣਤੀ ਵਿੱਚ ਸ਼ਾਮਲ ਨਹੀਂ ਕੀਤਾ ਗਿਆ ਹੈ` : `ਸ਼ੁਰੂਆਤੀ ${noun} ਨੂੰ ਗਿਣਤੀ ਵਿੱਚ ਸ਼ਾਮਲ ਕੀਤਾ ਗਿਆ ਹੈ`;
}

function localizedBindings(locale: TsdCp007Locale, bindings: Readonly<Record<string, string>>): Readonly<Record<string, string>> {
  const result = { ...bindings };
  if (result.objectName) result.objectName = localizedObject(locale, result.objectName);
  if (result.knownEvent) result.knownEvent = localizeTimelineEvent(locale, result.knownEvent);
  if (result.targetEvent) result.targetEvent = localizeTimelineEvent(locale, result.targetEvent);
  if (result.endpointConvention) result.endpointConvention = localizeEndpointConvention(locale, result.endpointConvention);
  return Object.freeze(result);
}

function render(template: string, bindings: Readonly<Record<string, string>>): string {
  return template.replace(/\{([^}]+)\}/g, (_match, key: string) => {
    const value = bindings[key];
    if (value === undefined) throw new Error(`${key}: localized review binding is missing`);
    return value;
  });
}

function registryFor(locale: TsdCp007Locale): readonly TsdCp007LocalizedQlSpec[] {
  return locale === "hi-IN" ? TSD_CP007_EFFECTIVE_HINDI_LOCALIZATION : TSD_CP007_EFFECTIVE_PUNJABI_LOCALIZATION;
}

export function renderCp007LocalizedReviewQuestions(): readonly TsdCp007RenderedLocalizedQuestion[] {
  const englishSamples = new Map(renderCp007EnglishReviewSamples().map((sample) => [sample.familyId, sample] as const));
  const frozenEnglishFamilies = new Map(
    TSD_CP007_FROZEN_ENGLISH_REGISTRY.flatMap((ql) => ql.stemFamilies.map((family) => [family.familyId, family] as const)),
  );
  const output: TsdCp007RenderedLocalizedQuestion[] = [];

  for (const locale of ["hi-IN", "pa-IN"] as const) {
    for (const ql of registryFor(locale)) {
      for (const family of ql.stemFamilies) {
        const englishSample = englishSamples.get(family.familyId);
        const englishFamily = frozenEnglishFamilies.get(family.familyId);
        if (!englishSample || !englishFamily) throw new Error(`${locale}/${family.familyId}: frozen English sample missing`);

        const bindings = localizedBindings(locale, extractBindings(englishFamily.stem, englishSample.stem));
        output.push(Object.freeze({
          locale,
          qlId: ql.qlId,
          familyId: family.familyId,
          difficulty: family.difficulty,
          stem: render(family.stem, bindings),
          sourceEnglishStem: englishSample.stem,
        }));
      }
    }
  }

  return Object.freeze(output);
}
