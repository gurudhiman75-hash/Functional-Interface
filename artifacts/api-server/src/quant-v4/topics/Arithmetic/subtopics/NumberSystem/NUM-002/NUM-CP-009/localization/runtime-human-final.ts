import type { NumCp009PermanentQlId } from "../permanent-allocation.ts";
import { generateNumCp009Localized } from "./runtime.ts";
import type { NumCp009LocalizedLanguage, NumCp009LocalizedPackage } from "./types.ts";

function polishHindi(value: string): string {
  return value
    .replaceAll("परस्पर सहभाज्य नहीं हैं", "परस्पर अभाज्य नहीं हैं")
    .replaceAll("सहभाज्य चक्र", "परस्पर-अभाज्य चक्र")
    .replaceAll("सहभाज्य चक्र वाला शॉर्टकट", "परस्पर-अभाज्य चक्र वाला छोटा तरीका")
    .replaceAll("परस्पर सहभाज्यता", "परस्पर अभाज्यता")
    .replaceAll("चक्र-शॉर्टकट", "चक्र वाला छोटा तरीका")
    .replaceAll("शॉर्टकट", "छोटा तरीका")
    .replaceAll("संक्रिया-चिह्न से जोड़िए", "दी गई संक्रिया लागू कीजिए")
    .replaceAll("घात-वर्ग समुच्चय", "घात के वर्गों का समुच्चय")
    .replaceAll("बचे हुए पद", "शेष पद")
    .replaceAll("बचे हुए", "शेष")
    .replaceAll("घटाकर फिर", "लेकर फिर");
}

function polishPunjabi(value: string): string {
  return value
    .replaceAll("ਆਪਸ ਵਿੱਚ ਸਹਭਾਜੀ ਨਹੀਂ ਹਨ", "ਆਪਸ ਵਿੱਚ ਪਰਸਪਰ ਅਭਾਜ ਨਹੀਂ ਹਨ")
    .replaceAll("ਸਹਭਾਜੀ ਚੱਕਰ", "ਪਰਸਪਰ-ਅਭਾਜ ਚੱਕਰ")
    .replaceAll("ਸਹਭਾਜੀ ਚੱਕਰ ਵਾਲਾ ਛੋਟਾ ਰਸਤਾ", "ਪਰਸਪਰ-ਅਭਾਜ ਚੱਕਰ ਵਾਲਾ ਛੋਟਾ ਤਰੀਕਾ")
    .replaceAll("ਆਪਸੀ ਸਹਭਾਜਤਾ", "ਪਰਸਪਰ ਅਭਾਜਤਾ")
    .replaceAll("ਛੋਟਾ ਰਸਤਾ", "ਛੋਟਾ ਤਰੀਕਾ")
    .replaceAll("ਘਾਤ-ਵਰਗ ਸਮੂਹ", "ਘਾਤ ਦੇ ਵਰਗਾਂ ਦਾ ਸਮੂਹ")
    .replaceAll("ਬਚੇ ਪਦ", "ਬਾਕੀ ਪਦ")
    .replaceAll("ਬਚੇ ਹੋਏ ਪਦ", "ਬਾਕੀ ਪਦ");
}

function polish(value: string, language: NumCp009LocalizedLanguage): string {
  return language === "hi" ? polishHindi(value) : polishPunjabi(value);
}

export function generateNumCp009LocalizedHumanFinal(
  qlId: NumCp009PermanentQlId,
  seed: number,
  language: NumCp009LocalizedLanguage,
): NumCp009LocalizedPackage {
  const q = generateNumCp009Localized(qlId, seed, language);
  return Object.freeze({
    ...q,
    stem: polish(q.stem, language),
    options: q.options,
    canonicalAnswer: q.canonicalAnswer,
    verifierAnswer: q.verifierAnswer,
    explanation: Object.freeze({
      coreConcept: polish(q.explanation.coreConcept, language),
      strategy: polish(q.explanation.strategy, language),
      steps: Object.freeze(q.explanation.steps.map((step) => polish(step, language))),
      finalAnswer: polish(q.explanation.finalAnswer, language),
    }),
    lifecycle: Object.freeze({
      ...q.lifecycle,
      reviewStatus: "MULTILINGUAL_FROZEN" as const,
      localizationStatus: "HI_PA_FROZEN" as const,
    }),
  }) as NumCp009LocalizedPackage;
}
