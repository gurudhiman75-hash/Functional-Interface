import {
  getCodTranslationalLanguagePack,
  type CodTranslatedLocale,
} from "./translational-language-pack";

interface QuestionLike {
  qlId?: string;
  permanentQlId?: string | null;
  checkpointId: string;
  ruleId?: string;
  ruleContext?: Readonly<Record<string, unknown>>;
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

function optionValue(option: unknown): string {
  if (typeof option === "string") return option;
  const record = asRecord(option);
  const value = record.value ?? record.answer ?? record.text ?? record.label;
  if (typeof value === "string" || typeof value === "number") return String(value);
  const members = record.members ?? record.tokens ?? record.words;
  if (Array.isArray(members)) return members.map(String).join(" ");
  return JSON.stringify(option);
}

function numberValue(record: Record<string, unknown>, key: string, fallback = 0): number {
  const value = record[key];
  return typeof value === "number" ? value : fallback;
}

function direction(locale: CodTranslatedLocale, signed: number): string {
  if (locale === "hi-IN") return signed >= 0 ? "आगे" : "पीछे";
  return signed >= 0 ? "ਅੱਗੇ" : "ਪਿੱਛੇ";
}

function side(locale: CodTranslatedLocale, value: unknown): string {
  if (locale === "hi-IN") return value === "RIGHT" ? "दाईं ओर" : "बाईं ओर";
  return value === "RIGHT" ? "ਸੱਜੇ ਪਾਸੇ" : "ਖੱਬੇ ਪਾਸੇ";
}

function describeRule(question: QuestionLike, locale: CodTranslatedLocale): string {
  const id = question.ruleId ?? "";
  const context = asRecord(question.ruleContext);
  const metadata = asRecord(question.metadata);
  const n = (key: string, fallback = 0) => numberValue(context, key, numberValue(metadata, key, fallback));

  if (locale === "hi-IN") {
    switch (id) {
      case "DIRECT_LETTER_TO_LETTER_MAP": return "हर मूल अक्षर को दी गई स्थिर मैपिंग के उसके कोड अक्षर से बदलें।";
      case "DIRECT_LETTER_TO_DIGIT_MAP": return "हर मूल अक्षर को दी गई स्थिर मैपिंग के उसके कोड अंक से बदलें।";
      case "DIRECT_LETTER_TO_SYMBOL_MAP": return "हर मूल अक्षर को दी गई स्थिर मैपिंग के उसके कोड चिन्ह से बदलें।";
      case "DIRECT_PARTIAL_MAPPING_INFERENCE": return "साझा अक्षरों वाले उदाहरणों से स्थिर मैपिंग पूरी करें और फिर लक्ष्य को बदलें।";
      case "A1Z26_SEQUENCE_CODE": return "A=1, B=2, …, Z=26 के अनुसार हर अक्षर का क्रमांक उसी क्रम में लिखें।";
      case "Z1A26_SEQUENCE_CODE": return "Z=1, Y=2, …, A=26 की उलटी वर्णमाला गिनती लिखें।";
      case "RANK_PLUS_CONSTANT_SEQUENCE": return `हर अक्षर के A=1 से Z=26 वाले क्रमांक में ${n("constant")} जोड़ें।`;
      case "RANK_MINUS_CONSTANT_SEQUENCE": return `हर अक्षर के A=1 से Z=26 वाले क्रमांक में से ${n("constant")} घटाएँ।`;
      case "SUM_OF_FORWARD_RANKS": return "सभी अक्षरों के A=1 से Z=26 क्रमांकों का योग लें।";
      case "SUM_PLUS_WORD_LENGTH": return "अक्षर-क्रमांकों के योग में शब्द के अक्षरों की संख्या जोड़ें।";
      case "SUM_MINUS_WORD_LENGTH": return "अक्षर-क्रमांकों के योग में से शब्द के अक्षरों की संख्या घटाएँ।";
      case "POSITION_WEIGHTED_SUM": return "हर अक्षर के क्रमांक को उसकी स्थान-संख्या से गुणा करके सभी परिणाम जोड़ें।";
      case "ODD_EVEN_POSITION_DIFFERENCE": return "विषम स्थानों के क्रमांकों का योग और सम स्थानों का योग अलग निकालकर उनका अंतर लें।";
      case "UNIFORM_CYCLIC_SHIFT": {
        const shift = n("shift");
        return `हर अक्षर को वर्णमाला में ${Math.abs(shift)} स्थान ${direction(locale, shift)} ले जाएँ; सीमा पार होने पर चक्र जारी रखें।`;
      }
      case "OPPOSITE_ALPHABET_MAP": return "हर अक्षर को उसके विपरीत वर्णमाला अक्षर से बदलें: A↔Z, B↔Y आदि।";
      case "INCREMENTAL_FORWARD_SHIFT": return `पहले अक्षर को ${n("baseShift", 1)} स्थान आगे ले जाएँ और हर अगले स्थान पर चाल एक बढ़ाएँ।`;
      case "INCREMENTAL_BACKWARD_SHIFT": return `पहले अक्षर को ${n("baseShift", 1)} स्थान पीछे ले जाएँ और हर अगले स्थान पर चाल एक बढ़ाएँ।`;
      case "ALTERNATING_SIGNED_SHIFT": return `अक्षरों को बारी-बारी ${n("magnitude", 1)} स्थान आगे और पीछे ले जाएँ।`;
      case "ODD_EVEN_POSITION_SHIFT": return `विषम स्थानों पर ${Math.abs(n("oddShift"))} स्थान ${direction(locale, n("oddShift"))} और सम स्थानों पर ${Math.abs(n("evenShift"))} स्थान ${direction(locale, n("evenShift"))} चलें।`;
      case "VOWEL_CONSONANT_CLASS_SHIFT": return `स्वरों को ${Math.abs(n("vowelShift"))} स्थान ${direction(locale, n("vowelShift"))} और व्यंजनों को ${Math.abs(n("consonantShift"))} स्थान ${direction(locale, n("consonantShift"))} ले जाएँ।`;
      case "ENDPOINT_INTERIOR_SHIFT": return `पहले व अंतिम अक्षर को ${Math.abs(n("endpointShift"))} स्थान ${direction(locale, n("endpointShift"))} तथा बीच के अक्षरों को ${Math.abs(n("interiorShift"))} स्थान ${direction(locale, n("interiorShift"))} ले जाएँ।`;
      case "REVERSE_SEQUENCE": return "अक्षरों का क्रम पूरी तरह उलट दें।";
      case "CYCLIC_POSITION_ROTATION": return `पूरे अक्षर-क्रम को ${n("amount", 1)} स्थान ${side(locale, context.direction)} घुमाएँ।`;
      case "HALF_SWAP": return "शब्द के दोनों बराबर भागों की जगह आपस में बदलें।";
      case "ODD_THEN_EVEN_EXTRACTION": return "पहले विषम स्थानों के अक्षर और फिर सम स्थानों के अक्षर लिखें।";
      case "EVEN_THEN_ODD_EXTRACTION": return "पहले सम स्थानों के अक्षर और फिर विषम स्थानों के अक्षर लिखें।";
      case "OUTER_INNER_INTERLEAVING": return `बाहरी और भीतरी अक्षर बारी-बारी लें, शुरुआत ${side(locale, context.startSide)} से करें।`;
      case "REVERSE_THEN_INDEXED_SHIFT": return "पहले अक्षर-क्रम उलटें, फिर स्थान के अनुसार बढ़ती वर्णमाला चाल लगाएँ।";
      case "PAIR_SWAP_THEN_ALTERNATING_SHIFT": return "पहले पास-पास के अक्षरों की जोड़ियाँ बदलें, फिर आगे-पीछे की बारी-बारी चाल लगाएँ।";
      case "HALF_SWAP_THEN_ODD_EVEN_SHIFT": return "पहले दोनों आधे भाग बदलें, फिर विषम और सम स्थानों पर अलग चाल लगाएँ।";
      case "ROTATE_THEN_CLASS_SHIFT": return "पहले अक्षर-क्रम घुमाएँ, फिर स्वर और व्यंजन के अनुसार अलग चाल लगाएँ।";
      case "OPPOSITE_MAP_WITH_POSITION_PERMUTATION": return "पहले विपरीत वर्णमाला अक्षर लें और फिर तय स्थान-क्रम के अनुसार उन्हें सजाएँ।";
      case "TRANSFORM_THEN_RANK_SEQUENCE": return "पहले तय अक्षर-परिवर्तन करें, फिर बने अक्षरों के वर्णमाला क्रमांक लिखें।";
      case "UNIFORM_MODULAR_DIGIT_TRANSLATION": return `हर अंक में अलग-अलग ${n("shift")} जोड़ें और 9 के बाद 0 से फिर शुरू करें।`;
      default:
        if (question.checkpointId === "COD-CP-010") return "पहले तालिका से मूल कोड बनाएं; फिर पहले और अंतिम चिन्ह की श्रेणी से एकमात्र लागू शर्त चुनकर उसका परिवर्तन करें।";
        return "दिए गए सभी उदाहरणों से मेल खाने वाला एक ही कोड नियम पहचानकर उसे लक्ष्य पर लगाएँ।";
    }
  }

  switch (id) {
    case "DIRECT_LETTER_TO_LETTER_MAP": return "ਹਰ ਮੂਲ ਅੱਖਰ ਨੂੰ ਦਿੱਤੀ ਪੱਕੀ ਮੈਪਿੰਗ ਵਾਲੇ ਕੋਡ ਅੱਖਰ ਨਾਲ ਬਦਲੋ।";
    case "DIRECT_LETTER_TO_DIGIT_MAP": return "ਹਰ ਮੂਲ ਅੱਖਰ ਨੂੰ ਦਿੱਤੀ ਪੱਕੀ ਮੈਪਿੰਗ ਵਾਲੇ ਕੋਡ ਅੰਕ ਨਾਲ ਬਦਲੋ।";
    case "DIRECT_LETTER_TO_SYMBOL_MAP": return "ਹਰ ਮੂਲ ਅੱਖਰ ਨੂੰ ਦਿੱਤੀ ਪੱਕੀ ਮੈਪਿੰਗ ਵਾਲੇ ਕੋਡ ਨਿਸ਼ਾਨ ਨਾਲ ਬਦਲੋ।";
    case "DIRECT_PARTIAL_MAPPING_INFERENCE": return "ਸਾਂਝੇ ਅੱਖਰਾਂ ਵਾਲੀਆਂ ਉਦਾਹਰਨਾਂ ਤੋਂ ਪੱਕੀ ਮੈਪਿੰਗ ਪੂਰੀ ਕਰੋ ਅਤੇ ਫਿਰ ਨਿਸ਼ਾਨੇ ਨੂੰ ਬਦਲੋ।";
    case "A1Z26_SEQUENCE_CODE": return "A=1, B=2, …, Z=26 ਮੁਤਾਬਕ ਹਰ ਅੱਖਰ ਦਾ ਨੰਬਰ ਉਸੇ ਕ੍ਰਮ ਵਿੱਚ ਲਿਖੋ।";
    case "Z1A26_SEQUENCE_CODE": return "Z=1, Y=2, …, A=26 ਵਾਲੀ ਉਲਟੀ ਵਰਣਮਾਲਾ ਗਿਣਤੀ ਲਿਖੋ।";
    case "RANK_PLUS_CONSTANT_SEQUENCE": return `ਹਰ ਅੱਖਰ ਦੇ A=1 ਤੋਂ Z=26 ਵਾਲੇ ਨੰਬਰ ਵਿੱਚ ${n("constant")} ਜੋੜੋ।`;
    case "RANK_MINUS_CONSTANT_SEQUENCE": return `ਹਰ ਅੱਖਰ ਦੇ A=1 ਤੋਂ Z=26 ਵਾਲੇ ਨੰਬਰ ਵਿੱਚੋਂ ${n("constant")} ਘਟਾਓ।`;
    case "SUM_OF_FORWARD_RANKS": return "ਸਾਰੇ ਅੱਖਰਾਂ ਦੇ A=1 ਤੋਂ Z=26 ਵਾਲੇ ਨੰਬਰ ਜੋੜੋ।";
    case "SUM_PLUS_WORD_LENGTH": return "ਅੱਖਰਾਂ ਦੇ ਨੰਬਰਾਂ ਦੇ ਜੋੜ ਵਿੱਚ ਸ਼ਬਦ ਦੇ ਅੱਖਰਾਂ ਦੀ ਗਿਣਤੀ ਜੋੜੋ।";
    case "SUM_MINUS_WORD_LENGTH": return "ਅੱਖਰਾਂ ਦੇ ਨੰਬਰਾਂ ਦੇ ਜੋੜ ਵਿੱਚੋਂ ਸ਼ਬਦ ਦੇ ਅੱਖਰਾਂ ਦੀ ਗਿਣਤੀ ਘਟਾਓ।";
    case "POSITION_WEIGHTED_SUM": return "ਹਰ ਅੱਖਰ ਦੇ ਨੰਬਰ ਨੂੰ ਉਸ ਦੀ ਥਾਂ ਦੇ ਨੰਬਰ ਨਾਲ ਗੁਣਾ ਕਰਕੇ ਸਾਰੇ ਨਤੀਜੇ ਜੋੜੋ।";
    case "ODD_EVEN_POSITION_DIFFERENCE": return "ਟਾਂਕ ਥਾਵਾਂ ਦੇ ਨੰਬਰਾਂ ਦਾ ਜੋੜ ਅਤੇ ਜੋੜੀਆਂ ਥਾਵਾਂ ਦਾ ਜੋੜ ਵੱਖ ਕੱਢ ਕੇ ਉਨ੍ਹਾਂ ਦਾ ਫਰਕ ਲਵੋ।";
    case "UNIFORM_CYCLIC_SHIFT": {
      const shift = n("shift");
      return `ਹਰ ਅੱਖਰ ਨੂੰ ਵਰਣਮਾਲਾ ਵਿੱਚ ${Math.abs(shift)} ਥਾਂ ${direction(locale, shift)} ਲਿਜਾਓ; ਅੰਤ ਪਾਰ ਹੋਣ ਉੱਤੇ ਚੱਕਰ ਜਾਰੀ ਰੱਖੋ।`;
    }
    case "OPPOSITE_ALPHABET_MAP": return "ਹਰ ਅੱਖਰ ਨੂੰ ਵਰਣਮਾਲਾ ਦੇ ਉਲਟ ਅੱਖਰ ਨਾਲ ਬਦਲੋ: A↔Z, B↔Y ਆਦਿ।";
    case "INCREMENTAL_FORWARD_SHIFT": return `ਪਹਿਲੇ ਅੱਖਰ ਨੂੰ ${n("baseShift", 1)} ਥਾਂ ਅੱਗੇ ਲਿਜਾਓ ਅਤੇ ਹਰ ਅਗਲੀ ਥਾਂ ਉੱਤੇ ਚਾਲ ਇੱਕ ਵਧਾਓ।`;
    case "INCREMENTAL_BACKWARD_SHIFT": return `ਪਹਿਲੇ ਅੱਖਰ ਨੂੰ ${n("baseShift", 1)} ਥਾਂ ਪਿੱਛੇ ਲਿਜਾਓ ਅਤੇ ਹਰ ਅਗਲੀ ਥਾਂ ਉੱਤੇ ਚਾਲ ਇੱਕ ਵਧਾਓ।`;
    case "ALTERNATING_SIGNED_SHIFT": return `ਅੱਖਰਾਂ ਨੂੰ ਵਾਰੀ-ਵਾਰੀ ${n("magnitude", 1)} ਥਾਂ ਅੱਗੇ ਅਤੇ ਪਿੱਛੇ ਲਿਜਾਓ।`;
    case "ODD_EVEN_POSITION_SHIFT": return `ਟਾਂਕ ਥਾਵਾਂ ਉੱਤੇ ${Math.abs(n("oddShift"))} ਥਾਂ ${direction(locale, n("oddShift"))} ਅਤੇ ਜੋੜੀਆਂ ਥਾਵਾਂ ਉੱਤੇ ${Math.abs(n("evenShift"))} ਥਾਂ ${direction(locale, n("evenShift"))} ਜਾਓ।`;
    case "VOWEL_CONSONANT_CLASS_SHIFT": return `ਸਵਰਾਂ ਨੂੰ ${Math.abs(n("vowelShift"))} ਥਾਂ ${direction(locale, n("vowelShift"))} ਅਤੇ ਵਿਅੰਜਨਾਂ ਨੂੰ ${Math.abs(n("consonantShift"))} ਥਾਂ ${direction(locale, n("consonantShift"))} ਲਿਜਾਓ।`;
    case "ENDPOINT_INTERIOR_SHIFT": return `ਪਹਿਲੇ ਤੇ ਆਖਰੀ ਅੱਖਰ ਨੂੰ ${Math.abs(n("endpointShift"))} ਥਾਂ ${direction(locale, n("endpointShift"))} ਅਤੇ ਵਿਚਕਾਰਲੇ ਅੱਖਰਾਂ ਨੂੰ ${Math.abs(n("interiorShift"))} ਥਾਂ ${direction(locale, n("interiorShift"))} ਲਿਜਾਓ।`;
    case "REVERSE_SEQUENCE": return "ਅੱਖਰਾਂ ਦਾ ਕ੍ਰਮ ਪੂਰੀ ਤਰ੍ਹਾਂ ਉਲਟ ਦਿਓ।";
    case "CYCLIC_POSITION_ROTATION": return `ਪੂਰੀ ਅੱਖਰ-ਲੜੀ ਨੂੰ ${n("amount", 1)} ਥਾਂ ${side(locale, context.direction)} ਘੁਮਾਓ।`;
    case "HALF_SWAP": return "ਸ਼ਬਦ ਦੇ ਦੋਵੇਂ ਬਰਾਬਰ ਹਿੱਸਿਆਂ ਦੀ ਥਾਂ ਆਪਸ ਵਿੱਚ ਬਦਲੋ।";
    case "ODD_THEN_EVEN_EXTRACTION": return "ਪਹਿਲਾਂ ਟਾਂਕ ਥਾਵਾਂ ਦੇ ਅੱਖਰ ਅਤੇ ਫਿਰ ਜੋੜੀਆਂ ਥਾਵਾਂ ਦੇ ਅੱਖਰ ਲਿਖੋ।";
    case "EVEN_THEN_ODD_EXTRACTION": return "ਪਹਿਲਾਂ ਜੋੜੀਆਂ ਥਾਵਾਂ ਦੇ ਅੱਖਰ ਅਤੇ ਫਿਰ ਟਾਂਕ ਥਾਵਾਂ ਦੇ ਅੱਖਰ ਲਿਖੋ।";
    case "OUTER_INNER_INTERLEAVING": return `ਬਾਹਰਲੇ ਅਤੇ ਅੰਦਰਲੇ ਅੱਖਰ ਵਾਰੀ-ਵਾਰੀ ਲਵੋ; ਸ਼ੁਰੂਆਤ ${side(locale, context.startSide)} ਤੋਂ ਕਰੋ।`;
    case "REVERSE_THEN_INDEXED_SHIFT": return "ਪਹਿਲਾਂ ਅੱਖਰ-ਲੜੀ ਉਲਟੋ, ਫਿਰ ਥਾਂ ਮੁਤਾਬਕ ਵਧਦੀ ਵਰਣਮਾਲਾ ਚਾਲ ਲਗਾਓ।";
    case "PAIR_SWAP_THEN_ALTERNATING_SHIFT": return "ਪਹਿਲਾਂ ਨਾਲ-ਨਾਲ ਅੱਖਰਾਂ ਦੀਆਂ ਜੋੜੀਆਂ ਬਦਲੋ, ਫਿਰ ਅੱਗੇ-ਪਿੱਛੇ ਦੀ ਵਾਰੀ-ਵਾਰੀ ਚਾਲ ਲਗਾਓ।";
    case "HALF_SWAP_THEN_ODD_EVEN_SHIFT": return "ਪਹਿਲਾਂ ਦੋਵੇਂ ਅੱਧੇ ਹਿੱਸੇ ਬਦਲੋ, ਫਿਰ ਟਾਂਕ ਅਤੇ ਜੋੜੀਆਂ ਥਾਵਾਂ ਉੱਤੇ ਵੱਖ ਚਾਲ ਲਗਾਓ।";
    case "ROTATE_THEN_CLASS_SHIFT": return "ਪਹਿਲਾਂ ਅੱਖਰ-ਲੜੀ ਘੁਮਾਓ, ਫਿਰ ਸਵਰ ਅਤੇ ਵਿਅੰਜਨ ਮੁਤਾਬਕ ਵੱਖ ਚਾਲ ਲਗਾਓ।";
    case "OPPOSITE_MAP_WITH_POSITION_PERMUTATION": return "ਪਹਿਲਾਂ ਵਰਣਮਾਲਾ ਦੇ ਉਲਟ ਅੱਖਰ ਲਵੋ ਅਤੇ ਫਿਰ ਤੈਅ ਥਾਂ-ਕ੍ਰਮ ਮੁਤਾਬਕ ਸਜਾਓ।";
    case "TRANSFORM_THEN_RANK_SEQUENCE": return "ਪਹਿਲਾਂ ਤੈਅ ਅੱਖਰ-ਬਦਲਾਅ ਕਰੋ, ਫਿਰ ਬਣੇ ਅੱਖਰਾਂ ਦੇ ਵਰਣਮਾਲਾ ਨੰਬਰ ਲਿਖੋ।";
    case "UNIFORM_MODULAR_DIGIT_TRANSLATION": return `ਹਰ ਅੰਕ ਵਿੱਚ ਵੱਖ-ਵੱਖ ${n("shift")} ਜੋੜੋ ਅਤੇ 9 ਤੋਂ ਬਾਅਦ 0 ਤੋਂ ਮੁੜ ਸ਼ੁਰੂ ਕਰੋ।`;
    default:
      if (question.checkpointId === "COD-CP-010") return "ਪਹਿਲਾਂ ਸਾਰਣੀ ਤੋਂ ਮੁੱਢਲਾ ਕੋਡ ਬਣਾਓ; ਫਿਰ ਪਹਿਲੇ ਅਤੇ ਆਖਰੀ ਨਿਸ਼ਾਨ ਦੀ ਕਿਸਮ ਤੋਂ ਇਕੱਲੀ ਲਾਗੂ ਸ਼ਰਤ ਚੁਣ ਕੇ ਉਸ ਦਾ ਬਦਲਾਅ ਕਰੋ।";
      return "ਸਾਰੀਆਂ ਦਿੱਤੀਆਂ ਉਦਾਹਰਨਾਂ ਨਾਲ ਮੇਲ ਖਾਂਦਾ ਇੱਕੋ ਕੋਡ ਨਿਯਮ ਪਛਾਣ ਕੇ ਉਸ ਨੂੰ ਨਿਸ਼ਾਨੇ ਉੱਤੇ ਲਗਾਓ।";
  }
}

function evidencePairs(prompt: Record<string, unknown>): readonly { source: string; code: string }[] {
  const evidence = Array.isArray(prompt.evidence) ? prompt.evidence : [];
  return evidence.flatMap((entry) => {
    const record = asRecord(entry);
    const source = record.source ?? record.word;
    const code = record.code;
    return typeof source === "string" && typeof code === "string" ? [{ source, code }] : [];
  });
}

function localizeConditionPrompt(prompt: Record<string, unknown>, locale: CodTranslatedLocale): Record<string, unknown> {
  const pack = getCodTranslationalLanguagePack(locale);
  const conditions = Array.isArray(prompt.conditions)
    ? prompt.conditions.map((condition) => {
      const record = asRecord(condition);
      const first = pack.className(String(record.firstClass ?? ""));
      const last = pack.className(String(record.lastClass ?? ""));
      return { ...record, description: pack.conditionDescription(first, last) };
    })
    : prompt.conditions;
  return { ...prompt, conditions };
}

export function localizeCodTranslationalQuestion<T extends QuestionLike>(
  english: T,
  locale: CodTranslatedLocale,
): T {
  const pack = getCodTranslationalLanguagePack(locale);
  const prompt = asRecord(english.structuredPrompt);
  const taskKind = String(prompt.taskKind ?? "ENCODE_TARGET");
  const style = Math.abs(english.seed) % 3;
  const pairs = evidencePairs(prompt);
  const evidence = pairs.map(({ source, code }) => pack.evidencePair(source, code)).join(pack.evidenceJoin);
  const answer = optionValue(english.options[english.correctIndex]);
  const target = String(prompt.target ?? prompt.targetWord ?? prompt.targetSource ?? prompt.sourceDisplay ?? "");
  const encoded = String(prompt.encodedTarget ?? prompt.targetCode ?? "");
  const displayed = String(prompt.displayedTargetCode ?? "");
  const missingSource = String(prompt.missingSource ?? "");
  const rule = describeRule(english, locale);

  let stem: string;
  if (english.checkpointId === "COD-CP-010") {
    stem = pack.conditionStem(String(prompt.sourceDisplay ?? ""), style);
  } else if (taskKind === "DECODE_TARGET") {
    stem = pack.decodeStem(evidence, encoded, style);
  } else if (taskKind.includes("RECOVER_MISSING")) {
    stem = displayed
      ? pack.missingStem(evidence, displayed, style)
      : pack.tableMissingStem(evidence, missingSource, style);
  } else {
    stem = pack.encodeStem(evidence, target, style);
  }

  const sourceDemonstration = pairs.slice(0, 2).map(({ source, code }, index) =>
    pack.sourceConfirmation(source, code, style + index));
  if (sourceDemonstration.length === 0 && english.checkpointId === "COD-CP-010") {
    const mappingRows = Array.isArray(prompt.mappingRows) ? prompt.mappingRows : [];
    const preview = mappingRows.slice(0, 3).map((row) => {
      const record = asRecord(row);
      return `${record.sourceToken}→${record.codeToken}`;
    }).join(", ");
    sourceDemonstration.push(locale === "hi-IN"
      ? `तालिका की मैपिंग ${preview} सहित हर स्रोत चिन्ह का मूल कोड तय करती है।`
      : `ਸਾਰਣੀ ਦੀ ਮੈਪਿੰਗ ${preview} ਸਮੇਤ ਹਰ ਮੂਲ ਨਿਸ਼ਾਨ ਦਾ ਮੁੱਢਲਾ ਕੋਡ ਤੈਅ ਕਰਦੀ ਹੈ।`);
  }

  let targetApplication: readonly string[];
  if (english.checkpointId === "COD-CP-010") {
    const metadata = asRecord(english.metadata);
    const first = pack.className(String(metadata.endpointSignature ?? "").split("_")[0] ?? "");
    const last = pack.className(String(metadata.endpointSignature ?? "").split("_").at(-1) ?? "");
    targetApplication = pack.conditionApplication(String(metadata.baseCode ?? ""), first, last, answer);
  } else if (taskKind.includes("RECOVER_MISSING")) {
    targetApplication = [pack.missingApplication(displayed || missingSource, answer, style)];
  } else {
    targetApplication = [pack.targetApplication(taskKind === "DECODE_TARGET" ? encoded : target, answer, style)];
  }

  const wrong = english.options.find((_, index) => index !== english.correctIndex);
  const localizedPrompt = english.checkpointId === "COD-CP-010"
    ? localizeConditionPrompt(prompt, locale)
    : prompt;

  return {
    ...english,
    locale,
    stem,
    structuredPrompt: localizedPrompt,
    explanation: {
      referenceAid: pack.referenceAid,
      quickMethod: pack.quickMethod(rule),
      ruleStatement: rule,
      sourceDemonstration,
      targetApplication,
      conclusion: pack.conclusion(answer, style),
      commonTrapAlert: pack.trap(optionValue(wrong)),
    },
    metadata: {
      ...asRecord(english.metadata),
      localizationVersion: "cod-001-translational-localization-v1",
      sourceLocale: "en-IN",
    },
  } as T;
}
