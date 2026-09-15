import {
  generateClsCp007LocalizedClusterQuestion,
  generateClsCp007LocalizedPairQuestion,
  type ClsCp007LocalizedLocale,
} from "./cp007-localized-runtime";
import type { ClsCp007PrototypeId } from "./types";

function simplifyHindi(value: string): string {
  return value
    .replaceAll("क्रमिक अंतर के परिमाण", "क्रमिक अंतर के +/− चिह्न हटाने पर")
    .replaceAll("अंतर के परिमाण", "अंतर के +/− चिह्न हटाने पर")
    .replaceAll("घटाया हुआ अंतर-अनुपात", "अंतर का सरल अनुपात")
    .replaceAll("घटाया अनुपात", "सरल अनुपात")
    .replaceAll("वह अक्षर-समूह चुनिए जिसका आंतरिक वर्णक्रम बाकी से अलग है।", "वह अक्षर-समूह चुनिए जिसमें अक्षरों का क्रम बाकी से अलग है।")
    .replaceAll("कौन-सा पूरा अक्षर-समूह समान वर्णमाला संबंध का पालन नहीं करता?", "कौन-सा अक्षर-समूह बाकी समूहों वाले नियम का पालन नहीं करता?")
    .replaceAll("बाकी जोड़ियों में दायाँ समूह बाएँ समूह से समान वर्णमाला संबंध से बना है।", "बाकी जोड़ियों में दायाँ समूह बाएँ समूह से एक ही अक्षर नियम से बना है।")
    .replaceAll("अंतर-समानता क्रम", "अंतर की बनावट")
    .replaceAll("समानता क्रम", "अंतर की बनावट")
    .replaceAll("दोहराव क्रम", "अक्षरों के दोहराव का क्रम")
    .replaceAll("वर्णमाला स्थानों का योग", "अक्षरों के स्थानों का योग")
    .replaceAll("वर्णमाला में विपरीत स्थानों पर", "वर्णमाला में एक-दूसरे के उल्टे स्थानों पर")
    .replaceAll("हर संबंधित जोड़ी का योग 27 नहीं है।", "कम-से-कम एक संबंधित जोड़ी का योग 27 नहीं है।");
}

function simplifyPunjabi(value: string): string {
  return value
    .replaceAll("ਲੜੀਵਾਰ ਅੰਤਰਾਂ ਦੇ ਪਰਿਮਾਣ", "ਲੜੀਵਾਰ ਅੰਤਰਾਂ ਦੇ +/− ਨਿਸ਼ਾਨ ਹਟਾਉਣ ਤੇ")
    .replaceAll("ਅੰਤਰਾਂ ਦੇ ਪਰਿਮਾਣ", "ਅੰਤਰਾਂ ਦੇ +/− ਨਿਸ਼ਾਨ ਹਟਾਉਣ ਤੇ")
    .replaceAll("ਘਟਾਇਆ ਹੋਇਆ ਅੰਤਰ-ਅਨੁਪਾਤ", "ਅੰਤਰਾਂ ਦਾ ਸਰਲ ਅਨੁਪਾਤ")
    .replaceAll("ਘਟਾਇਆ ਅਨੁਪਾਤ", "ਸਰਲ ਅਨੁਪਾਤ")
    .replaceAll("ਉਹ ਅੱਖਰ-ਸਮੂਹ ਚੁਣੋ ਜਿਸ ਦਾ ਅੰਦਰੂਨੀ ਵਰਣ-ਕ੍ਰਮ ਬਾਕੀਆਂ ਤੋਂ ਵੱਖਰਾ ਹੈ।", "ਉਹ ਅੱਖਰ-ਸਮੂਹ ਚੁਣੋ ਜਿਸ ਵਿੱਚ ਅੱਖਰਾਂ ਦਾ ਕ੍ਰਮ ਬਾਕੀਆਂ ਤੋਂ ਵੱਖਰਾ ਹੈ।")
    .replaceAll("ਕਿਹੜਾ ਪੂਰਾ ਅੱਖਰ-ਸਮੂਹ ਸਾਂਝੇ ਵਰਣਮਾਲਾ ਸੰਬੰਧ ਦੀ ਪਾਲਣਾ ਨਹੀਂ ਕਰਦਾ?", "ਕਿਹੜਾ ਅੱਖਰ-ਸਮੂਹ ਬਾਕੀ ਸਮੂਹਾਂ ਵਾਲੇ ਨਿਯਮ ਦੀ ਪਾਲਣਾ ਨਹੀਂ ਕਰਦਾ?")
    .replaceAll("ਬਾਕੀ ਜੋੜੀਆਂ ਵਿੱਚ ਸੱਜਾ ਸਮੂਹ ਖੱਬੇ ਸਮੂਹ ਤੋਂ ਇੱਕੋ ਵਰਣਮਾਲਾ ਸੰਬੰਧ ਨਾਲ ਬਣਿਆ ਹੈ।", "ਬਾਕੀ ਜੋੜੀਆਂ ਵਿੱਚ ਸੱਜਾ ਸਮੂਹ ਖੱਬੇ ਸਮੂਹ ਤੋਂ ਇੱਕੋ ਅੱਖਰ ਨਿਯਮ ਨਾਲ ਬਣਿਆ ਹੈ।")
    .replaceAll("ਅੰਤਰ-ਸਮਾਨਤਾ ਕ੍ਰਮ", "ਅੰਤਰਾਂ ਦੀ ਬਣਤਰ")
    .replaceAll("ਸਮਾਨਤਾ ਕ੍ਰਮ", "ਅੰਤਰਾਂ ਦੀ ਬਣਤਰ")
    .replaceAll("ਦੁਹਰਾਵ ਕ੍ਰਮ", "ਅੱਖਰਾਂ ਦੀ ਦੁਹਰਾਈ ਦਾ ਕ੍ਰਮ")
    .replaceAll("ਵਰਣਮਾਲਾ ਸਥਾਨਾਂ ਦਾ ਜੋੜ", "ਅੱਖਰਾਂ ਦੇ ਸਥਾਨਾਂ ਦਾ ਜੋੜ")
    .replaceAll("ਵਿਰੋਧੀ", "ਉਲਟ")
    .replaceAll("ਹਰ ਸੰਬੰਧਿਤ ਜੋੜੀ ਦਾ ਜੋੜ 27 ਨਹੀਂ ਹੈ।", "ਘੱਟੋ-ਘੱਟ ਇੱਕ ਸੰਬੰਧਿਤ ਜੋੜੀ ਦਾ ਜੋੜ 27 ਨਹੀਂ ਹੈ।");
}

function transform(locale: ClsCp007LocalizedLocale, value: string): string {
  return locale === "hi-IN" ? simplifyHindi(value) : simplifyPunjabi(value);
}

function editorialize<T extends {
  readonly stem: string;
  readonly evidenceByOption: readonly string[];
  readonly explanation: {
    readonly coreConcept: readonly string[];
    readonly stepByStep: readonly string[];
    readonly examSpeedShortcut: readonly string[];
    readonly commonTrapWarning: readonly string[];
  };
  readonly metadata: Record<string, unknown>;
}>(question: T, locale: ClsCp007LocalizedLocale) {
  const map = (value: string) => transform(locale, value);
  return {
    ...question,
    stem: map(question.stem),
    evidenceByOption: question.evidenceByOption.map(map),
    explanation: {
      coreConcept: question.explanation.coreConcept.map(map),
      stepByStep: question.explanation.stepByStep.map(map),
      examSpeedShortcut: [] as readonly string[],
      commonTrapWarning: [] as readonly string[],
    },
    metadata: {
      ...question.metadata,
      runtimeVersion: "cls-cp007-multilingual-review-v2" as const,
      editorialVersion: "simple-native-language-v2" as const,
    },
  };
}

export function generateClsCp007LocalizedClusterQuestionV2(
  locale: ClsCp007LocalizedLocale,
  prototypeId: ClsCp007PrototypeId,
  seed: number,
  optionCount: 4 | 5 = 4,
) {
  return editorialize(
    generateClsCp007LocalizedClusterQuestion(locale, prototypeId, seed, optionCount),
    locale,
  );
}

export function generateClsCp007LocalizedPairQuestionV2(
  locale: ClsCp007LocalizedLocale,
  seed: number,
  optionCount: 4 | 5 = 4,
) {
  return editorialize(generateClsCp007LocalizedPairQuestion(locale, seed, optionCount), locale);
}
