import type {
  QuestionStudioEngineAdapter,
  QuestionStudioGenerationRequest,
  QuestionStudioGenerationResult,
} from "../engine-types";
import { cls001QuestionStudioAdapter } from "./reasoning-v1-cls001-adapter";

function standardizeHindi(value: string): string {
  return value
    .replaceAll("निम्नलिखित में से विषम संख्या चुनिए।", "निम्नलिखित में से अलग संख्या चुनिए।")
    .replace(/(\d+) में अंकों में सम और विषम दोनों प्रकार हैं/g, "$1 में सम और विषम दोनों प्रकार के अंक हैं")
    .replace(/(\d+), (किसी पूर्ण (?:वर्ग|घन) से 1 (?:कम|अधिक) है)/g, "$1 $2")
    .replace(
      /, इसलिए यह त्रिभुजीय है, इसलिए यह बाकी संख्याओं से अलग है।/g,
      ", अतः यह त्रिभुजीय है और बाकी संख्याओं से अलग है।",
    );
}

function standardizePunjabi(value: string): string {
  return value
    .replaceAll("ਜੁੜੀ ਸੰਖਿਆ", "ਜਿਸਤ ਸੰਖਿਆ")
    .replaceAll("ਸਾਰੇ ਅੰਕ ਜੁੜੇ ਹਨ", "ਸਾਰੇ ਅੰਕ ਜਿਸਤ ਹਨ")
    .replaceAll("ਅੰਕਾਂ ਵਿੱਚ ਜੁੜੇ ਅਤੇ ਟਾਂਕ", "ਅੰਕਾਂ ਵਿੱਚ ਜਿਸਤ ਅਤੇ ਟਾਂਕ")
    .replaceAll(" ਜੁੜੀ ਸੰਖਿਆ ਹੈ", " ਜਿਸਤ ਸੰਖਿਆ ਹੈ")
    .replace(/(\d+) ਵਿੱਚ ਅੰਕਾਂ ਵਿੱਚ ਜਿਸਤ ਅਤੇ ਟਾਂਕ ਦੋਵੇਂ ਕਿਸਮਾਂ ਹਨ/g, "$1 ਵਿੱਚ ਜਿਸਤ ਅਤੇ ਟਾਂਕ ਦੋਵੇਂ ਕਿਸਮਾਂ ਦੇ ਅੰਕ ਹਨ")
    .replace(/(\d+), (ਕਿਸੇ ਪੂਰਨ (?:ਵਰਗ|ਘਣ) ਤੋਂ 1 (?:ਘੱਟ|ਵੱਧ) ਹੈ)/g, "$1 $2")
    .replace(
      /, ਇਸ ਲਈ ਇਹ ਤਿਕੋਣੀ ਹੈ, ਇਸ ਲਈ ਇਹ ਬਾਕੀ ਸੰਖਿਆਵਾਂ ਤੋਂ ਵੱਖਰੀ ਹੈ।/g,
      ", ਇਸ ਕਰਕੇ ਇਹ ਤਿਕੋਣੀ ਹੈ ਅਤੇ ਬਾਕੀ ਸੰਖਿਆਵਾਂ ਤੋਂ ਵੱਖਰੀ ਹੈ।",
    );
}

function transformDeep(value: unknown, transform: (text: string) => string): unknown {
  if (typeof value === "string") return transform(value);
  if (Array.isArray(value)) return value.map((item) => transformDeep(item, transform));
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .map(([key, item]) => [key, transformDeep(item, transform)]),
    );
  }
  return value;
}

export const cls001QuestionStudioAdapterV2: QuestionStudioEngineAdapter = {
  engineId: "reasoning-v1",

  listPackages() {
    return cls001QuestionStudioAdapter.listPackages();
  },

  async generate(request: QuestionStudioGenerationRequest): Promise<QuestionStudioGenerationResult> {
    const result = await cls001QuestionStudioAdapter.generate(request);
    const language = request.language ?? "en";
    if (language === "en") return result;
    const transform = language === "hi" ? standardizeHindi : standardizePunjabi;
    return {
      ...result,
      questions: result.questions.map((question) => {
        if (question.cpId !== "CLS-CP-004") return question;
        return transformDeep(question, transform) as Record<string, unknown>;
      }),
    };
  },
};
