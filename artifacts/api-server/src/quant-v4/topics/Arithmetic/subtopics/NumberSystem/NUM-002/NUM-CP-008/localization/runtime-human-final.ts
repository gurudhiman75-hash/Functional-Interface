import { generateNumCp008Localized } from "./runtime.ts";
import type { NumCp008LocalizedLanguage, NumCp008LocalizedPackage } from "./types.ts";
import type { NumCp008PermanentQlId } from "../permanent-runtime.ts";

function polishHindi(value: string): string {
  return value
    .replaceAll("परिणाम को मॉड्यूलो m में घटाइए", "परिणाम का मॉड्यूलो m में अवशेष लीजिए")
    .replaceAll("आधार घटाएँ", "पहले आधार का अवशेष लें")
    .replaceAll("क्रमिक वर्गीकरण", "बार-बार वर्ग करके")
    .replaceAll("घटे हुए समीकरण", "सरल किए हुए समीकरण")
    .replace(/को (\d+) से घटाने पर अवशेष/gu, "को $1 से भाग देने पर शेष")
    .replace(/को (\d+) से घटाने पर/gu, "को $1 के मॉड्यूलो में लेने पर")
    .replaceAll("अवशेष क्रम", "अवशेषों का क्रम");
}

function polishPunjabi(value: string): string {
  return value
    .replaceAll("ਨਤੀਜੇ ਨੂੰ ਮਾਡਿਊਲੋ m ਵਿੱਚ ਘਟਾਓ", "ਨਤੀਜੇ ਦਾ ਮਾਡਿਊਲੋ m ਵਿੱਚ ਅਵਸ਼ੇਸ਼ ਲਓ")
    .replaceAll("ਆਧਾਰ ਨੂੰ ਪਹਿਲਾਂ ਘਟਾਓ", "ਪਹਿਲਾਂ ਆਧਾਰ ਦਾ ਅਵਸ਼ੇਸ਼ ਲਓ")
    .replaceAll("ਘਟੇ ਸਮੀਕਰਨ", "ਸਰਲ ਕੀਤੇ ਸਮੀਕਰਨ")
    .replace(/ਨੂੰ (\d+) ਨਾਲ ਘਟਾਉਣ ਤੇ ਅਵਸ਼ੇਸ਼/gu, "ਨੂੰ $1 ਨਾਲ ਭਾਗ ਦੇਣ ਤੇ ਬਾਕੀ")
    .replace(/ਨੂੰ (\d+) ਨਾਲ ਘਟਾਉਣ ਤੇ/gu, "ਨੂੰ ਮਾਡਿਊਲੋ $1 ਵਿੱਚ ਲੈਣ ਤੇ")
    .replaceAll("ਅਵਸ਼ੇਸ਼ ਲੜੀ", "ਅਵਸ਼ੇਸ਼ਾਂ ਦੀ ਲੜੀ");
}

function polish(value: string, language: NumCp008LocalizedLanguage): string {
  return language === "hi" ? polishHindi(value) : polishPunjabi(value);
}

export function generateNumCp008LocalizedHumanFinal(
  qlId: NumCp008PermanentQlId,
  seed: number,
  language: NumCp008LocalizedLanguage,
): NumCp008LocalizedPackage {
  const q = generateNumCp008Localized(qlId, seed, language);
  return Object.freeze({
    ...q,
    stem: polish(q.stem, language),
    options: Object.freeze(q.options.map((option) => Object.freeze({ ...option, value: polish(option.value, language) }))),
    canonicalAnswer: polish(q.canonicalAnswer, language),
    verifierAnswer: polish(q.verifierAnswer, language),
    explanation: Object.freeze({
      coreConcept: polish(q.explanation.coreConcept, language),
      strategy: polish(q.explanation.strategy, language),
      steps: Object.freeze(q.explanation.steps.map((step) => polish(step, language))),
      finalAnswer: polish(q.explanation.finalAnswer, language),
    }),
  }) as NumCp008LocalizedPackage;
}
