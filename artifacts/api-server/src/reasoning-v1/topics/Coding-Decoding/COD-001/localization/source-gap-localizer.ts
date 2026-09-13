type SourceGapLocale = "hi-IN" | "pa-IN";

type SourceGapRuleId =
  | "ALPHABETICAL_ASCENDING_SORT"
  | "INDEXED_SHIFT_THEN_REVERSE"
  | "REVERSE_THEN_UNIFORM_SHIFT"
  | "MIXED_CLASS_CODE";

interface EvidenceRow {
  readonly source: string;
  readonly code: string;
}

interface QuestionLike {
  qlId?: string;
  permanentQlId?: string | null;
  checkpointId: string;
  ruleId?: string;
  seed: number;
  locale: string;
  stem: string;
  structuredPrompt: unknown;
  options: readonly unknown[];
  correctIndex: number;
  explanation: unknown;
  metadata?: Readonly<Record<string, unknown>>;
  [key: string]: unknown;
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? value as Record<string, unknown> : {};
}

function promptOf(question: QuestionLike): {
  evidence: readonly EvidenceRow[];
  targetWord: string;
  targetCode: string;
} {
  const prompt = asRecord(question.structuredPrompt);
  const evidence = Array.isArray(prompt.evidence)
    ? prompt.evidence.map((row) => {
        const record = asRecord(row);
        return { source: String(record.source ?? ""), code: String(record.code ?? "") };
      })
    : [];
  return {
    evidence,
    targetWord: String(prompt.targetWord ?? ""),
    targetCode: String(prompt.targetCode ?? ""),
  };
}

function shiftLetter(letter: string, amount: number): string {
  const rank = letter.charCodeAt(0) - 65;
  const normalized = ((rank + amount) % 26 + 26) % 26;
  return String.fromCharCode(65 + normalized);
}

function indexedContext(seed: number): { baseShift: 1 | 2; direction: 1 | -1 } {
  return {
    baseShift: seed % 2 === 0 ? 1 : 2,
    direction: seed % 4 < 2 ? -1 : 1,
  };
}

function uniformShift(seed: number): -2 | -1 | 1 | 2 {
  const shifts = [-2, -1, 1, 2] as const;
  return shifts[Math.abs(seed) % shifts.length]!;
}

function mixedVariant(seed: number): "VOWEL_INDEX_CONSONANT_PREVIOUS" | "REVERSE_VOWEL_INDEX_CONSONANT_OPPOSITE" {
  return seed % 2 === 0
    ? "VOWEL_INDEX_CONSONANT_PREVIOUS"
    : "REVERSE_VOWEL_INDEX_CONSONANT_OPPOSITE";
}

function oppositeLetter(letter: string): string {
  return String.fromCharCode(90 - (letter.charCodeAt(0) - 65));
}

function mixedToken(letter: string, seed: number): string {
  const vowels = "AEIOU";
  const vowelIndex = vowels.indexOf(letter);
  const variant = mixedVariant(seed);
  if (vowelIndex >= 0) {
    return variant === "VOWEL_INDEX_CONSONANT_PREVIOUS"
      ? String(vowelIndex + 1)
      : String(5 - vowelIndex);
  }
  return variant === "VOWEL_INDEX_CONSONANT_PREVIOUS"
    ? shiftLetter(letter, -1)
    : oppositeLetter(letter);
}

function hiDirection(amount: number): string {
  return amount > 0 ? "आगे" : "पीछे";
}

function paDirection(amount: number): string {
  return amount > 0 ? "ਅੱਗੇ" : "ਪਿੱਛੇ";
}

function localizedStem(locale: SourceGapLocale, targetWord: string): string {
  if (locale === "hi-IN") {
    return `दिए गए उदाहरणों में एक ही कूट नियम का प्रयोग किया गया है। उसी नियम से ${targetWord} का कूट ज्ञात कीजिए।`;
  }
  return `ਦਿੱਤੀਆਂ ਉਦਾਹਰਨਾਂ ਵਿੱਚ ਇੱਕੋ ਕੋਡ ਨਿਯਮ ਵਰਤਿਆ ਗਿਆ ਹੈ। ਉਸੇ ਨਿਯਮ ਨਾਲ ${targetWord} ਦਾ ਕੋਡ ਪਤਾ ਕਰੋ।`;
}

function ruleAndWorking(
  locale: SourceGapLocale,
  ruleId: SourceGapRuleId,
  seed: number,
  targetWord: string,
  targetCode: string,
): { ruleStatement: string; targetApplication: readonly string[]; conclusion: string } {
  if (locale === "hi-IN") {
    if (ruleId === "ALPHABETICAL_ASCENDING_SORT") {
      return {
        ruleStatement: "अक्षरों को अंग्रेज़ी वर्णमाला में A से Z के क्रम में लगाएँ।",
        targetApplication: [
          `${targetWord} के अक्षरों को A से Z क्रम में रखने पर ${targetCode} बनता है।`,
        ],
        conclusion: `अतः ${targetWord} का कूट ${targetCode} है।`,
      };
    }
    if (ruleId === "INDEXED_SHIFT_THEN_REVERSE") {
      const { baseShift, direction } = indexedContext(seed);
      const shifted = [...targetWord]
        .map((letter, index) => shiftLetter(letter, direction * (baseShift + index)))
        .join("");
      return {
        ruleStatement: `पहले अक्षर को ${baseShift} स्थान ${hiDirection(direction)} ले जाएँ और हर अगले अक्षर पर चाल 1 स्थान बढ़ाएँ। फिर बने अक्षर-क्रम को उलट दें।`,
        targetApplication: [
          `${targetWord} पर बढ़ती चाल लगाने से ${shifted} बनता है।`,
          `अब ${shifted} का क्रम उलटने पर ${targetCode} मिलता है।`,
        ],
        conclusion: `अतः ${targetWord} का कूट ${targetCode} है।`,
      };
    }
    if (ruleId === "REVERSE_THEN_UNIFORM_SHIFT") {
      const shift = uniformShift(seed);
      const reversed = [...targetWord].reverse().join("");
      return {
        ruleStatement: `पहले शब्द के अक्षर उलटें। फिर हर अक्षर को वर्णमाला में ${Math.abs(shift)} स्थान ${hiDirection(shift)} ले जाएँ।`,
        targetApplication: [
          `${targetWord} को उलटने पर ${reversed} मिलता है।`,
          `${reversed} के हर अक्षर को ${Math.abs(shift)} स्थान ${hiDirection(shift)} ले जाने पर ${targetCode} बनता है।`,
        ],
        conclusion: `अतः ${targetWord} का कूट ${targetCode} है।`,
      };
    }
    const mapping = [...targetWord].map((letter) => `${letter}→${mixedToken(letter, seed)}`).join(", ");
    if (mixedVariant(seed) === "VOWEL_INDEX_CONSONANT_PREVIOUS") {
      return {
        ruleStatement: "स्वरों के लिए A=1, E=2, I=3, O=4, U=5 लें। हर व्यंजन के स्थान पर उससे ठीक पहले वाला वर्णमाला अक्षर लिखें।",
        targetApplication: [`${targetWord} में नियम अक्षर-दर-अक्षर लगाएँ: ${mapping}.`, `इन चिन्हों को उसी क्रम में जोड़ने पर ${targetCode} बनता है।`],
        conclusion: `अतः ${targetWord} का कूट ${targetCode} है।`,
      };
    }
    return {
      ruleStatement: "स्वरों के लिए A=5, E=4, I=3, O=2, U=1 लें। हर व्यंजन के स्थान पर उसका विपरीत वर्णमाला अक्षर लिखें, जैसे A↔Z और B↔Y।",
      targetApplication: [`${targetWord} में नियम अक्षर-दर-अक्षर लगाएँ: ${mapping}.`, `इन चिन्हों को उसी क्रम में जोड़ने पर ${targetCode} बनता है।`],
      conclusion: `अतः ${targetWord} का कूट ${targetCode} है।`,
    };
  }

  if (ruleId === "ALPHABETICAL_ASCENDING_SORT") {
    return {
      ruleStatement: "ਅੱਖਰਾਂ ਨੂੰ ਅੰਗਰੇਜ਼ੀ ਵਰਣਮਾਲਾ ਦੇ A ਤੋਂ Z ਕ੍ਰਮ ਵਿੱਚ ਲਗਾਓ।",
      targetApplication: [`${targetWord} ਦੇ ਅੱਖਰਾਂ ਨੂੰ A ਤੋਂ Z ਕ੍ਰਮ ਵਿੱਚ ਲਗਾਉਣ ਨਾਲ ${targetCode} ਬਣਦਾ ਹੈ।`],
      conclusion: `ਇਸ ਲਈ ${targetWord} ਦਾ ਕੋਡ ${targetCode} ਹੈ।`,
    };
  }
  if (ruleId === "INDEXED_SHIFT_THEN_REVERSE") {
    const { baseShift, direction } = indexedContext(seed);
    const shifted = [...targetWord]
      .map((letter, index) => shiftLetter(letter, direction * (baseShift + index)))
      .join("");
    return {
      ruleStatement: `ਪਹਿਲੇ ਅੱਖਰ ਨੂੰ ${baseShift} ਥਾਂ ${paDirection(direction)} ਲਿਜਾਓ ਅਤੇ ਹਰ ਅਗਲੇ ਅੱਖਰ ਲਈ ਚਾਲ 1 ਥਾਂ ਵਧਾਓ। ਫਿਰ ਬਣੇ ਅੱਖਰ-ਕ੍ਰਮ ਨੂੰ ਉਲਟ ਦਿਓ।`,
      targetApplication: [
        `${targetWord} ਉੱਤੇ ਵਧਦੀ ਚਾਲ ਲਗਾਉਣ ਨਾਲ ${shifted} ਬਣਦਾ ਹੈ।`,
        `ਹੁਣ ${shifted} ਦਾ ਕ੍ਰਮ ਉਲਟਣ ਨਾਲ ${targetCode} ਮਿਲਦਾ ਹੈ।`,
      ],
      conclusion: `ਇਸ ਲਈ ${targetWord} ਦਾ ਕੋਡ ${targetCode} ਹੈ।`,
    };
  }
  if (ruleId === "REVERSE_THEN_UNIFORM_SHIFT") {
    const shift = uniformShift(seed);
    const reversed = [...targetWord].reverse().join("");
    return {
      ruleStatement: `ਪਹਿਲਾਂ ਸ਼ਬਦ ਦੇ ਅੱਖਰ ਉਲਟੋ। ਫਿਰ ਹਰ ਅੱਖਰ ਨੂੰ ਵਰਣਮਾਲਾ ਵਿੱਚ ${Math.abs(shift)} ਥਾਂ ${paDirection(shift)} ਲਿਜਾਓ।`,
      targetApplication: [
        `${targetWord} ਨੂੰ ਉਲਟਣ ਨਾਲ ${reversed} ਮਿਲਦਾ ਹੈ।`,
        `${reversed} ਦੇ ਹਰ ਅੱਖਰ ਨੂੰ ${Math.abs(shift)} ਥਾਂ ${paDirection(shift)} ਲਿਜਾਣ ਨਾਲ ${targetCode} ਬਣਦਾ ਹੈ।`,
      ],
      conclusion: `ਇਸ ਲਈ ${targetWord} ਦਾ ਕੋਡ ${targetCode} ਹੈ।`,
    };
  }
  const mapping = [...targetWord].map((letter) => `${letter}→${mixedToken(letter, seed)}`).join(", ");
  if (mixedVariant(seed) === "VOWEL_INDEX_CONSONANT_PREVIOUS") {
    return {
      ruleStatement: "ਸਵਰਾਂ ਲਈ A=1, E=2, I=3, O=4, U=5 ਲਵੋ। ਹਰ ਵਿਆੰਜਨ ਦੀ ਥਾਂ ਉਸ ਤੋਂ ਤੁਰੰਤ ਪਹਿਲਾਂ ਵਾਲਾ ਵਰਣਮਾਲਾ ਅੱਖਰ ਲਿਖੋ।",
      targetApplication: [`${targetWord} ਉੱਤੇ ਨਿਯਮ ਅੱਖਰ-ਅੱਖਰ ਲਗਾਓ: ${mapping}.`, `ਇਨ੍ਹਾਂ ਚਿੰਨ੍ਹਾਂ ਨੂੰ ਉਸੇ ਕ੍ਰਮ ਵਿੱਚ ਜੋੜਨ ਨਾਲ ${targetCode} ਬਣਦਾ ਹੈ।`],
      conclusion: `ਇਸ ਲਈ ${targetWord} ਦਾ ਕੋਡ ${targetCode} ਹੈ।`,
    };
  }
  return {
    ruleStatement: "ਸਵਰਾਂ ਲਈ A=5, E=4, I=3, O=2, U=1 ਲਵੋ। ਹਰ ਵਿਆੰਜਨ ਦੀ ਥਾਂ ਉਸ ਦਾ ਉਲਟ ਵਰਣਮਾਲਾ ਅੱਖਰ ਲਿਖੋ, ਜਿਵੇਂ A↔Z ਅਤੇ B↔Y।",
    targetApplication: [`${targetWord} ਉੱਤੇ ਨਿਯਮ ਅੱਖਰ-ਅੱਖਰ ਲਗਾਓ: ${mapping}.`, `ਇਨ੍ਹਾਂ ਚਿੰਨ੍ਹਾਂ ਨੂੰ ਉਸੇ ਕ੍ਰਮ ਵਿੱਚ ਜੋੜਨ ਨਾਲ ${targetCode} ਬਣਦਾ ਹੈ।`],
    conclusion: `ਇਸ ਲਈ ${targetWord} ਦਾ ਕੋਡ ${targetCode} ਹੈ।`,
  };
}

export function localizeCodSourceGapQuestion(question: QuestionLike, locale: SourceGapLocale): QuestionLike {
  const ruleId = question.ruleId as SourceGapRuleId;
  if (![
    "ALPHABETICAL_ASCENDING_SORT",
    "INDEXED_SHIFT_THEN_REVERSE",
    "REVERSE_THEN_UNIFORM_SHIFT",
    "MIXED_CLASS_CODE",
  ].includes(ruleId)) {
    throw new Error(`Unsupported COD-001 source-gap rule '${question.ruleId ?? ""}'`);
  }

  const prompt = promptOf(question);
  if (prompt.evidence.length !== 2 || !prompt.targetWord || !prompt.targetCode) {
    throw new Error(`${question.qlId ?? question.permanentQlId ?? "COD source-gap"} has incomplete source-gap prompt data`);
  }

  const localized = ruleAndWorking(locale, ruleId, question.seed, prompt.targetWord, prompt.targetCode);
  const sourceLabel = locale === "hi-IN" ? "उदाहरण" : "ਉਦਾਹਰਨ";

  return {
    ...question,
    locale,
    stem: localizedStem(locale, prompt.targetWord),
    explanation: {
      ruleStatement: localized.ruleStatement,
      sourceDemonstration: prompt.evidence.map((row) => `${sourceLabel}: ${row.source} → ${row.code}`),
      targetApplication: localized.targetApplication,
      conclusion: localized.conclusion,
    },
    metadata: {
      ...question.metadata,
      maturity: "MULTILINGUAL_RUNTIME_PROOF",
      localizationVersion: "cod-001-source-gap-localization-v1",
      sourceLocale: "en-IN",
    },
  };
}
