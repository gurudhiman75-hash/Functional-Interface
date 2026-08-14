import { hash } from "./cp003-exam-model";
import {
  INT_CP005_QL_IDS,
  INT_CP005_REGISTRY,
  INT_CP005_SOURCE_SATURATION,
  generateIntCp005Question,
  verifyIntCp005Answer,
  type IntCp005Locale,
  type IntCp005QlId,
  type IntCp005Question,
} from "./cp005-variable-growth-decay-runtime";

export const INT_CP005_RUNTIME_VERSION_V2 = "INT-CP-005-VARIABLE-GROWTH-DECAY-v2" as const;
export { INT_CP005_QL_IDS, INT_CP005_SOURCE_SATURATION, verifyIntCp005Answer };
export type { IntCp005Locale, IntCp005QlId };

export type IntCp005QuestionV2 = Omit<IntCp005Question, "runtimeVersion" | "representation" | "presentation"> & {
  readonly runtimeVersion: typeof INT_CP005_RUNTIME_VERSION_V2;
  readonly representation: "STANDARD_PROSE" | "COMPARISON_TABLE";
  readonly presentation: Readonly<{
    markdown: string;
    prompt: string;
    table?: Readonly<{ headers: readonly string[]; rows: readonly (readonly string[])[] }>;
  }>;
};

export const INT_CP005_REGISTRY_V2 = Object.freeze(INT_CP005_REGISTRY.map((entry) => Object.freeze({
  ...entry,
  answerSemantic: entry.qlId === "INT-QL-086" || entry.qlId === "INT-QL-088"
    ? "CONTEXT_VALUE"
    : entry.answerSemantic,
})));

function deepFreeze<T>(value: T, seen = new WeakSet<object>()): T {
  if (typeof value !== "object" || value === null) return value;
  const objectValue = value as object;
  if (seen.has(objectValue)) return value;
  seen.add(objectValue);
  for (const key of Reflect.ownKeys(objectValue)) deepFreeze((objectValue as Record<PropertyKey, unknown>)[key], seen);
  return Object.freeze(value);
}

function sourceQuestion(qlId: IntCp005QlId, seed: string, locale: IntCp005Locale): IntCp005Question {
  for (let attempt = 0; attempt < 12; attempt += 1) {
    const sourceSeed = attempt === 0 ? seed : `${seed}:reverse-decay-safe:${attempt}`;
    try {
      return generateIntCp005Question(qlId, sourceSeed, locale);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      // V1 contains one known distractor-only singularity when the linearised
      // depreciation rates total 100%. The mathematical state itself is valid.
      // Until V1 is historical-only, V2 deterministically resamples only that case.
      if (qlId !== "INT-QL-091" || !/zero|denominator|division/iu.test(message)) throw error;
    }
  }
  throw new Error(`${qlId}/${seed}/${locale}: could not construct a safe reverse-depreciation review state`);
}

function variant(seed: string): number {
  return (hash(`${seed}:cp005-v2-surface`) >>> 0) % 4;
}

function replaceOne(source: string, search: string, replacements: readonly string[], index: number): string {
  if (!source.includes(search)) return source;
  return source.replace(search, replacements[index % replacements.length]!);
}

function polishEnglish(source: IntCp005Question, seed: string): string {
  let text = source.presentation.prompt;
  const v = variant(seed);

  if (source.qlId === "INT-QL-086") {
    if (source.mathematicalState.context === "INVESTMENT") {
      text = replaceOne(text, "is invested for", ["is invested for", "is deposited for", "is kept on compound interest for", "is placed in an investment scheme for"], v);
      text = replaceOne(text, "What amount will be received at the end?", ["What amount will be received at the end?", "What will be the maturity amount?", "What amount will it grow to by the end of the term?", "What will the investment be worth at maturity?"], v);
    } else if (source.mathematicalState.context === "POPULATION") {
      text = replaceOne(text, "A town has a population of", ["A town has a population of", "A municipality has a population of", "A district town has a population of", "An urban area has a population of"], v);
    } else if (source.mathematicalState.context === "SALARY") {
      text = replaceOne(text, "An employee's annual salary is", ["An employee's annual salary is", "A bank employee's annual salary is", "An office employee's annual salary is", "A staff member's annual salary is"], v);
    } else if (source.mathematicalState.context === "PRODUCTION") {
      text = replaceOne(text, "A plant can produce", ["A plant can produce", "A factory can produce", "A manufacturing unit can produce", "An industrial unit can produce"], v);
    }
  }

  const neutralLeads: Partial<Record<IntCp005QlId, readonly string[]>> = {
    "INT-QL-087": ["", "The annual rate changes during the investment period. ", "Different annual rates apply over the term. ", "The deposit does not carry one fixed annual rate throughout. "],
    "INT-QL-088": ["", "The value has grown under different yearly rates. ", "Successive annual rates apply to this record. ", "The observed final value comes after a changing annual rate. "],
    "INT-QL-089": ["", "One yearly rate is missing from the investment record. ", "The three-year rate schedule has one unknown entry. ", "A yearly rate is to be recovered from the final amount. "],
    "INT-QL-090": ["", "Depreciation is charged year by year on the remaining value. ", "The asset has different depreciation rates over the period. ", "The recorded value is reduced at the stated rate each year. "],
    "INT-QL-091": ["", "The asset has already passed through several yearly depreciation rates. ", "The current value is observed after successive depreciation. ", "Different annual depreciation rates led to the present value. "],
  };
  const lead = neutralLeads[source.qlId]?.[v] ?? "";
  text = `${lead}${text}`;

  if (source.qlId === "INT-QL-094") {
    text = text.replace(/(\d[\d,]*) people people migrate/gu, "$1 people migrate");
  }
  return text;
}

function polishHindi(source: IntCp005Question, seed: string): string {
  let text = source.presentation.prompt;
  const v = variant(seed);

  if (source.qlId === "INT-QL-086") {
    if (source.mathematicalState.context === "INVESTMENT") {
      text = replaceOne(text, "को", ["को", "की राशि को", "की जमा राशि को", "के निवेश को"], v);
      text = replaceOne(text, "अंत में कितनी राशि मिलेगी?", ["अंत में कितनी राशि मिलेगी?", "परिपक्वता पर राशि कितनी होगी?", "अवधि के अंत में निवेश का मूल्य कितना होगा?", "अंतिम राशि कितनी बनेगी?"], v);
    } else if (source.mathematicalState.context === "POPULATION") {
      text = replaceOne(text, "एक नगर की जनसंख्या", ["एक नगर की जनसंख्या", "एक शहर की जनसंख्या", "एक कस्बे की जनसंख्या", "एक नगरपालिका क्षेत्र की जनसंख्या"], v);
    } else if (source.mathematicalState.context === "SALARY") {
      text = replaceOne(text, "एक कर्मचारी का वार्षिक वेतन", ["एक कर्मचारी का वार्षिक वेतन", "एक बैंक कर्मचारी का वार्षिक वेतन", "एक कार्यालय कर्मचारी का वार्षिक वेतन", "एक स्टाफ सदस्य का वार्षिक वेतन"], v);
    } else if (source.mathematicalState.context === "PRODUCTION") {
      text = replaceOne(text, "एक संयंत्र की वार्षिक उत्पादन क्षमता", ["एक संयंत्र की वार्षिक उत्पादन क्षमता", "एक कारखाने की वार्षिक उत्पादन क्षमता", "एक विनिर्माण इकाई की वार्षिक उत्पादन क्षमता", "एक औद्योगिक इकाई की वार्षिक उत्पादन क्षमता"], v);
    }
  }

  const leads: Partial<Record<IntCp005QlId, readonly string[]>> = {
    "INT-QL-087": ["", "निवेश अवधि में वार्षिक दर बदलती रहती है। ", "अलग-अलग वर्षों में अलग दरें लागू होती हैं। ", "पूरी अवधि में एक ही वार्षिक दर लागू नहीं है। "],
    "INT-QL-088": ["", "यह अंतिम मूल्य अलग-अलग वार्षिक दरों के बाद प्राप्त हुआ है। ", "इस राशि पर क्रमशः अलग वार्षिक दरें लागू हुई हैं। ", "दी गई अंतिम राशि बदलती वार्षिक दरों के बाद की है। "],
    "INT-QL-089": ["", "निवेश अभिलेख में एक वर्ष की दर लुप्त है। ", "तीन-वर्षीय दर-सारणी में एक प्रविष्टि अज्ञात है। ", "अंतिम राशि से एक वर्ष की दर निकालनी है। "],
    "INT-QL-090": ["", "मूल्यह्रास हर वर्ष बचे हुए मूल्य पर लागू होता है। ", "अलग-अलग वर्षों में अलग मूल्यह्रास दरें लागू हुई हैं। ", "संपत्ति का मूल्य दी गई वार्षिक दरों से क्रमशः घटता है। "],
    "INT-QL-091": ["", "वर्तमान मूल्य कई वार्षिक मूल्यह्रास चरणों के बाद का है। ", "संपत्ति पर क्रमशः अलग मूल्यह्रास दरें लागू हुई थीं। ", "दिया गया मूल्य लगातार वार्षिक मूल्यह्रास के बाद प्राप्त हुआ है। "],
  };
  text = `${leads[source.qlId]?.[v] ?? ""}${text}`;

  if (source.qlId === "INT-QL-092") {
    text = text.replace(/इसके मूल्य में क्रमशः (.+?) होता है।/u, "इसके मूल्य में बदलाव इस प्रकार होता है: $1।");
  }
  return text;
}

function polishPunjabi(source: IntCp005Question, seed: string): string {
  let text = source.presentation.prompt;
  const v = variant(seed);

  if (source.qlId === "INT-QL-086") {
    text = text.replace(/ਇਸ ਵਿੱਚ (.+?) ਹੁੰਦਾ ਹੈ।/u, "ਇਸ ਵਿੱਚ $1 ਵਾਧਾ ਹੁੰਦਾ ਹੈ।");
    if (source.mathematicalState.context === "INVESTMENT") {
      text = replaceOne(text, "ਨੂੰ", ["ਨੂੰ", "ਦੀ ਰਕਮ ਨੂੰ", "ਦੀ ਜਮ੍ਹਾਂ ਰਕਮ ਨੂੰ", "ਦੇ ਨਿਵੇਸ਼ ਨੂੰ"], v);
      text = replaceOne(text, "ਅੰਤ ਵਿੱਚ ਕਿੰਨੀ ਰਕਮ ਮਿਲੇਗੀ?", ["ਅੰਤ ਵਿੱਚ ਕਿੰਨੀ ਰਕਮ ਮਿਲੇਗੀ?", "ਮਿਆਦ ਪੂਰੀ ਹੋਣ 'ਤੇ ਰਕਮ ਕਿੰਨੀ ਹੋਵੇਗੀ?", "ਮਿਆਦ ਦੇ ਅੰਤ ਵਿੱਚ ਨਿਵੇਸ਼ ਦਾ ਮੁੱਲ ਕਿੰਨਾ ਹੋਵੇਗਾ?", "ਅੰਤਿਮ ਰਕਮ ਕਿੰਨੀ ਬਣੇਗੀ?"], v);
    } else if (source.mathematicalState.context === "POPULATION") {
      text = replaceOne(text, "ਇੱਕ ਸ਼ਹਿਰ ਦੀ ਆਬਾਦੀ", ["ਇੱਕ ਸ਼ਹਿਰ ਦੀ ਆਬਾਦੀ", "ਇੱਕ ਨਗਰ ਦੀ ਆਬਾਦੀ", "ਇੱਕ ਕਸਬੇ ਦੀ ਆਬਾਦੀ", "ਇੱਕ ਨਗਰਪਾਲਿਕਾ ਖੇਤਰ ਦੀ ਆਬਾਦੀ"], v);
    } else if (source.mathematicalState.context === "SALARY") {
      text = replaceOne(text, "ਇੱਕ ਕਰਮਚਾਰੀ ਦੀ ਸਾਲਾਨਾ ਤਨਖਾਹ", ["ਇੱਕ ਕਰਮਚਾਰੀ ਦੀ ਸਾਲਾਨਾ ਤਨਖਾਹ", "ਇੱਕ ਬੈਂਕ ਕਰਮਚਾਰੀ ਦੀ ਸਾਲਾਨਾ ਤਨਖਾਹ", "ਇੱਕ ਦਫ਼ਤਰੀ ਕਰਮਚਾਰੀ ਦੀ ਸਾਲਾਨਾ ਤਨਖਾਹ", "ਇੱਕ ਸਟਾਫ਼ ਮੈਂਬਰ ਦੀ ਸਾਲਾਨਾ ਤਨਖਾਹ"], v);
    } else if (source.mathematicalState.context === "PRODUCTION") {
      text = replaceOne(text, "ਇੱਕ ਪਲਾਂਟ ਦੀ ਸਾਲਾਨਾ ਉਤਪਾਦਨ ਸਮਰੱਥਾ", ["ਇੱਕ ਪਲਾਂਟ ਦੀ ਸਾਲਾਨਾ ਉਤਪਾਦਨ ਸਮਰੱਥਾ", "ਇੱਕ ਫੈਕਟਰੀ ਦੀ ਸਾਲਾਨਾ ਉਤਪਾਦਨ ਸਮਰੱਥਾ", "ਇੱਕ ਨਿਰਮਾਣ ਇਕਾਈ ਦੀ ਸਾਲਾਨਾ ਉਤਪਾਦਨ ਸਮਰੱਥਾ", "ਇੱਕ ਉਦਯੋਗਿਕ ਇਕਾਈ ਦੀ ਸਾਲਾਨਾ ਉਤਪਾਦਨ ਸਮਰੱਥਾ"], v);
    }
  }

  const leads: Partial<Record<IntCp005QlId, readonly string[]>> = {
    "INT-QL-087": ["", "ਨਿਵੇਸ਼ ਦੀ ਮਿਆਦ ਦੌਰਾਨ ਸਾਲਾਨਾ ਦਰ ਬਦਲਦੀ ਰਹਿੰਦੀ ਹੈ। ", "ਵੱਖ-ਵੱਖ ਸਾਲਾਂ ਵਿੱਚ ਵੱਖ ਦਰਾਂ ਲਾਗੂ ਹੁੰਦੀਆਂ ਹਨ। ", "ਪੂਰੀ ਮਿਆਦ ਦੌਰਾਨ ਇੱਕੋ ਸਾਲਾਨਾ ਦਰ ਲਾਗੂ ਨਹੀਂ ਹੁੰਦੀ। "],
    "INT-QL-088": ["", "ਇਹ ਅੰਤਿਮ ਮੁੱਲ ਵੱਖ-ਵੱਖ ਸਾਲਾਨਾ ਦਰਾਂ ਤੋਂ ਬਾਅਦ ਮਿਲਿਆ ਹੈ। ", "ਇਸ ਰਕਮ ਉੱਤੇ ਕ੍ਰਮਵਾਰ ਵੱਖ ਸਾਲਾਨਾ ਦਰਾਂ ਲਾਗੂ ਹੋਈਆਂ ਹਨ। ", "ਦਿੱਤੀ ਅੰਤਿਮ ਰਕਮ ਬਦਲਦੀਆਂ ਸਾਲਾਨਾ ਦਰਾਂ ਤੋਂ ਬਾਅਦ ਦੀ ਹੈ। "],
    "INT-QL-089": ["", "ਨਿਵੇਸ਼ ਰਿਕਾਰਡ ਵਿੱਚ ਇੱਕ ਸਾਲ ਦੀ ਦਰ ਗੁੰਮ ਹੈ। ", "ਤਿੰਨ ਸਾਲਾਂ ਦੀ ਦਰ-ਸਾਰਣੀ ਵਿੱਚ ਇੱਕ ਦਰ ਅਣਜਾਣ ਹੈ। ", "ਅੰਤਿਮ ਰਕਮ ਤੋਂ ਇੱਕ ਸਾਲ ਦੀ ਦਰ ਕੱਢਣੀ ਹੈ। "],
    "INT-QL-090": ["", "ਮੁੱਲ ਘਟਾਅ ਹਰ ਸਾਲ ਬਚੇ ਹੋਏ ਮੁੱਲ ਉੱਤੇ ਲਾਗੂ ਹੁੰਦਾ ਹੈ। ", "ਵੱਖ-ਵੱਖ ਸਾਲਾਂ ਵਿੱਚ ਵੱਖ ਮੁੱਲ ਘਟਾਅ ਦਰਾਂ ਲਾਗੂ ਹੋਈਆਂ ਹਨ। ", "ਸੰਪਤੀ ਦਾ ਮੁੱਲ ਦਿੱਤੀਆਂ ਸਾਲਾਨਾ ਦਰਾਂ ਨਾਲ ਕ੍ਰਮਵਾਰ ਘਟਦਾ ਹੈ। "],
    "INT-QL-091": ["", "ਮੌਜੂਦਾ ਮੁੱਲ ਕਈ ਸਾਲਾਨਾ ਮੁੱਲ ਘਟਾਅ ਪੜਾਵਾਂ ਤੋਂ ਬਾਅਦ ਦਾ ਹੈ। ", "ਸੰਪਤੀ ਉੱਤੇ ਕ੍ਰਮਵਾਰ ਵੱਖ ਮੁੱਲ ਘਟਾਅ ਦਰਾਂ ਲਾਗੂ ਹੋਈਆਂ ਸਨ। ", "ਦਿੱਤਾ ਮੁੱਲ ਲਗਾਤਾਰ ਸਾਲਾਨਾ ਮੁੱਲ ਘਟਾਅ ਤੋਂ ਬਾਅਦ ਮਿਲਿਆ ਹੈ। "],
  };
  text = `${leads[source.qlId]?.[v] ?? ""}${text}`;

  if (source.qlId === "INT-QL-092") {
    text = text.replace(/ਇਸ ਦੇ ਮੁੱਲ ਵਿੱਚ ਕ੍ਰਮਵਾਰ (.+?) ਹੁੰਦਾ ਹੈ।/u, "ਇਸ ਦੇ ਮੁੱਲ ਵਿੱਚ ਬਦਲਾਅ ਇਸ ਤਰ੍ਹਾਂ ਹੁੰਦਾ ਹੈ: $1।");
  }
  return text;
}

function polishedPrompt(source: IntCp005Question, seed: string, locale: IntCp005Locale): string {
  if (locale === "en-IN") return polishEnglish(source, seed);
  if (locale === "hi-IN") return polishHindi(source, seed);
  return polishPunjabi(source, seed);
}

function presentationV2(source: IntCp005Question, seed: string, locale: IntCp005Locale): IntCp005QuestionV2["presentation"] & { representation: IntCp005QuestionV2["representation"] } {
  const prompt = polishedPrompt(source, seed, locale);

  // V1 rate cards duplicated the same rate schedule in both the table and prose.
  // Until a compact table-specific lead is designed, normal variable-rate items
  // stay as exam prose. The two-plan table materially aids comparison and remains.
  if (source.qlId !== "INT-QL-095") {
    return deepFreeze({ representation: "STANDARD_PROSE" as const, prompt, markdown: prompt });
  }

  const table = source.presentation.table;
  if (!table) return deepFreeze({ representation: "STANDARD_PROSE" as const, prompt, markdown: prompt });
  const lead = locale === "en-IN"
    ? "The same principal is invested for three years under the two plans shown below."
    : locale === "hi-IN"
      ? "समान मूलधन को तीन वर्षों के लिए नीचे दी गई दो योजनाओं में निवेश किया जाता है।"
      : "ਇੱਕੋ ਮੂਲਧਨ ਨੂੰ ਤਿੰਨ ਸਾਲਾਂ ਲਈ ਹੇਠਾਂ ਦਿੱਤੀਆਂ ਦੋ ਯੋਜਨਾਵਾਂ ਵਿੱਚ ਨਿਵੇਸ਼ ਕੀਤਾ ਜਾਂਦਾ ਹੈ।";
  const tableMarkdown = [
    `| ${table.headers.join(" | ")} |`,
    `| ${table.headers.map(() => "---").join(" | ")} |`,
    ...table.rows.map((row) => `| ${row.join(" | ")} |`),
  ].join("\n");
  const finalPrompt = locale === "en-IN"
    ? "By how much do the final amounts differ?"
    : locale === "hi-IN"
      ? "अंतिम राशियों में कितना अंतर होगा?"
      : "ਅੰਤਿਮ ਰਕਮਾਂ ਵਿੱਚ ਕਿੰਨਾ ਅੰਤਰ ਹੋਵੇਗਾ?";
  return deepFreeze({ representation: "COMPARISON_TABLE" as const, prompt: finalPrompt, markdown: `${lead}\n\n${tableMarkdown}\n\n${finalPrompt}`, table });
}

export function generateIntCp005QuestionV2(
  qlId: IntCp005QlId,
  seed: string,
  locale: IntCp005Locale = "en-IN",
): IntCp005QuestionV2 {
  const source = sourceQuestion(qlId, seed, locale);
  const presentation = presentationV2(source, seed, locale);
  return deepFreeze({
    ...source,
    runtimeVersion: INT_CP005_RUNTIME_VERSION_V2,
    seed,
    representation: presentation.representation,
    presentation: {
      markdown: presentation.markdown,
      prompt: presentation.prompt,
      ...(presentation.table ? { table: presentation.table } : {}),
    },
  });
}
