import type {
  CubesDiceStudentSolutionTableV1,
  CubesDiceStudentSolutionV1,
  CubesDiceStudentSolutionLanguageV1,
} from "./cubes-dice-student-solution-v1";
import { CND_001_STUDENT_SOLUTION_V4_AUTHORITY_V1 } from "./cubes-dice-student-solution-v1";

export const CND_001_STUDENT_SOLUTION_LOCALIZATION_FREEZE_AUTHORITY_V1 = Object.freeze({
  authorityId: "CND-001-STUDENT-SOLUTION-LOCALIZATION-FREEZE-V1" as const,
  chapterCode: "CND-001" as const,
  sourceSolutionAuthorityId: CND_001_STUDENT_SOLUTION_V4_AUTHORITY_V1.authorityId,
  permanentQlIds: CND_001_STUDENT_SOLUTION_V4_AUTHORITY_V1.permanentQlIds,
  languages: Object.freeze(["en", "hi", "pa"] as const),
  reviewBasis: "DIRECT_EDITORIAL_REVIEW_PLUS_STRUCTURAL_SEMANTIC_PARITY" as const,
  userAuthorizedProceed: true,
  languageReviewStatus: Object.freeze({
    en: "PRODUCT_OWNER_APPROVED" as const,
    hi: "EDITORIAL_REVIEW_PASSED_AND_FROZEN" as const,
    pa: "EDITORIAL_REVIEW_PASSED_AND_FROZEN" as const,
  }),
  editorialCorrections: Object.freeze([
    "REMOVE_LITERAL_OR_TRANSLITERATED_PROJECTION_LANGUAGE",
    "PREFER_NATURAL_EXAM_COACHING_TERMS",
    "PRESERVE_ALL_CANONICAL_FACTS_OPTIONS_AND_ANSWERS",
  ] as const),
  semanticParity: "RULE_TABLE_WORKING_ANSWER_FACTS_EXACT" as const,
  frozen: true,
  questionStudioReviewOnlyRegistrationAuthorized: true,
  persistenceAuthorized: false,
  questionBankWritesAuthorized: false,
  testEligibilityAuthorized: false,
  publicPublicationAuthorized: false,
  automaticStudentPublication: false,
  nextGate: "CND_001_QUESTION_STUDIO_REVIEW_ONLY_REGISTRATION_V1" as const,
});

function replacementsFor(language: CubesDiceStudentSolutionLanguageV1): readonly (readonly [string, string])[] {
  if (language === "hi") {
    return Object.freeze([
      ["दो पास-पास वाले फलक", "दो सटे हुए फलक"],
      ["चार पास वाले फलक", "चार सटे हुए फलक"],
      ["इसके चारों पास वाले फलक", "इससे सटे हुए चारों फलक"],
      ["दो स्थान की दूरी पर", "क्रम में बीच का एक फलक छोड़कर"],
      ["यदि N घन अलग-अलग हों तो कुल 6N फलक होंगे। हर फलक-से-फलक संपर्क 2 फलक छिपाता है", "यदि N घनों को अलग मानें, तो उनके कुल 6N फलक होंगे। जब दो घन पूरे फलक पर जुड़े हों, तो उस जोड़ पर 2 फलक अंदर छिप जाते हैं"],
      ["हर साझा संपर्क पर दो फलक छिपते हैं, एक नहीं।", "हर पूरे फलक वाले जोड़ पर दो फलक अंदर होते हैं, एक नहीं।"],
      ["हर गैर-खाली ऊर्ध्व स्तंभ एक वर्ग देता है।", "जिस आधार-स्थान पर घनों का स्तंभ मौजूद है, वह ऊपर से एक वर्ग देता है।"],
      ["सामने से एक ही क्षैतिज स्थान पर पीछे के घन एक-दूसरे को ढकते हैं। इसलिए हर पट्टी में केवल अधिकतम ऊँचाई लें।", "सामने से देखने पर एक ही स्थान के पीछे पड़े घन एक-दूसरे पर आ जाते हैं। इसलिए प्रत्येक खड़ी पट्टी में केवल सबसे अधिक ऊँचाई गिनी जाती है।"],
      ["दाएँ से चौड़ाई की दिशा में पड़े घन एक-दूसरे को ढकते हैं। हर गहराई पट्टी में अधिकतम ऊँचाई लें।", "दाएँ से देखने पर चौड़ाई की दिशा में एक-दूसरे के पीछे पड़े घन एक ही स्थान पर आ जाते हैं। इसलिए हर गहराई वाली पट्टी में सबसे अधिक ऊँचाई गिनें।"],
      ["जोड़ने वाले घन", "आवश्यक अतिरिक्त घन"],
    ] as const);
  }
  if (language === "pa") {
    return Object.freeze([
      ["ਦੋ ਨਾਲ-ਨਾਲ ਵਾਲੇ ਫਲਕ", "ਦੋ ਇਕ-ਦੂਜੇ ਨਾਲ ਲੱਗਦੇ ਫਲਕ"],
      ["ਚਾਰ ਨਾਲ ਵਾਲੇ ਫਲਕ", "ਚਾਰ ਲੱਗਦੇ ਫਲਕ"],
      ["ਇਸਦੇ ਚਾਰ ਨਾਲ ਵਾਲੇ ਫਲਕ", "ਇਸ ਨਾਲ ਲੱਗਦੇ ਚਾਰੇ ਫਲਕ"],
      ["ਦੋ ਥਾਵਾਂ ਦੀ ਦੂਰੀ ਤੇ", "ਕ੍ਰਮ ਵਿੱਚ ਵਿਚਕਾਰ ਇੱਕ ਫਲਕ ਛੱਡ ਕੇ"],
      ["ਜੇ N ਘਣ ਵੱਖਰੇ ਹੋਣ ਤਾਂ ਕੁੱਲ 6N ਫਲਕ ਹੁੰਦੇ ਹਨ। ਹਰ ਫਲਕ-ਨਾਲ-ਫਲਕ ਸੰਪਰਕ 2 ਫਲਕ ਲੁਕਾਂਦਾ ਹੈ", "ਜੇ N ਘਣਾਂ ਨੂੰ ਵੱਖਰਾ ਮੰਨੀਏ, ਤਾਂ ਉਨ੍ਹਾਂ ਦੇ ਕੁੱਲ 6N ਫਲਕ ਹੁੰਦੇ ਹਨ। ਜਦੋਂ ਦੋ ਘਣ ਪੂਰੇ ਫਲਕ ਨਾਲ ਜੁੜੇ ਹੋਣ, ਤਾਂ ਉਸ ਜੋੜ ਉੱਤੇ 2 ਫਲਕ ਅੰਦਰ ਲੁਕ ਜਾਂਦੇ ਹਨ"],
      ["ਹਰ ਸਾਂਝੇ ਸੰਪਰਕ ਨਾਲ ਦੋ ਫਲਕ ਲੁਕਦੇ ਹਨ, ਇੱਕ ਨਹੀਂ।", "ਹਰ ਪੂਰੇ ਫਲਕ ਵਾਲੇ ਜੋੜ ਉੱਤੇ ਦੋ ਫਲਕ ਅੰਦਰ ਹੁੰਦੇ ਹਨ, ਇੱਕ ਨਹੀਂ।"],
      ["ਹਰ ਗੈਰ-ਖਾਲੀ ਖੜ੍ਹਾ ਸਤੰਭ ਇੱਕ ਵਰਗ ਦਿੰਦਾ ਹੈ।", "ਜਿਸ ਅਧਾਰ-ਥਾਂ ਉੱਤੇ ਘਣਾਂ ਦਾ ਸਤੰਭ ਮੌਜੂਦ ਹੈ, ਉਹ ਉੱਪਰੋਂ ਇੱਕ ਵਰਗ ਦਿੰਦਾ ਹੈ।"],
      ["ਸਾਹਮਣੇ ਤੋਂ ਇੱਕੋ ਹਰੀਜ਼ਾਂਟਲ ਥਾਂ ਤੇ ਪਿੱਛੇ ਵਾਲੇ ਘਣ ਇਕ-ਦੂਜੇ ਉੱਤੇ ਆ ਜਾਂਦੇ ਹਨ। ਇਸ ਲਈ ਹਰ ਪੱਟੀ ਵਿੱਚ ਕੇਵਲ ਵੱਧ ਤੋਂ ਵੱਧ ਉਚਾਈ ਲਵੋ।", "ਸਾਹਮਣੇ ਤੋਂ ਵੇਖਣ ਤੇ ਇੱਕੋ ਥਾਂ ਦੇ ਪਿੱਛੇ ਪਏ ਘਣ ਇਕ-ਦੂਜੇ ਉੱਤੇ ਆ ਜਾਂਦੇ ਹਨ। ਇਸ ਲਈ ਹਰ ਖੜ੍ਹੀ ਪੱਟੀ ਵਿੱਚ ਸਿਰਫ਼ ਸਭ ਤੋਂ ਵੱਡੀ ਉਚਾਈ ਗਿਣੀ ਜਾਂਦੀ ਹੈ।"],
      ["ਸੱਜੇ ਪਾਸੇ ਤੋਂ ਚੌੜਾਈ ਦੀ ਦਿਸ਼ਾ ਵਾਲੇ ਘਣ ਇਕ-ਦੂਜੇ ਉੱਤੇ ਆ ਜਾਂਦੇ ਹਨ। ਹਰ ਡੂੰਘਾਈ ਪੱਟੀ ਵਿੱਚ ਵੱਧ ਤੋਂ ਵੱਧ ਉਚਾਈ ਲਵੋ।", "ਸੱਜੇ ਪਾਸੇ ਤੋਂ ਵੇਖਣ ਤੇ ਚੌੜਾਈ ਵੱਲ ਇਕ-ਦੂਜੇ ਦੇ ਪਿੱਛੇ ਪਏ ਘਣ ਇੱਕੋ ਥਾਂ ਉੱਤੇ ਆ ਜਾਂਦੇ ਹਨ। ਹਰ ਡੂੰਘਾਈ ਵਾਲੀ ਪੱਟੀ ਲਈ ਸਭ ਤੋਂ ਵੱਡੀ ਉਚਾਈ ਗਿਣੋ।"],
      ["ਜੋੜਣ ਵਾਲੇ ਘਣ", "ਲੋੜੀਂਦੇ ਵਾਧੂ ਘਣ"],
    ] as const);
  }
  return Object.freeze([] as const);
}

function polishText(language: CubesDiceStudentSolutionLanguageV1, value: string): string {
  let output = value;
  for (const [from, to] of replacementsFor(language)) output = output.replaceAll(from, to);
  return output;
}

function polishTable(language: CubesDiceStudentSolutionLanguageV1, source: CubesDiceStudentSolutionTableV1): CubesDiceStudentSolutionTableV1 {
  return Object.freeze({
    ...source,
    title: polishText(language, source.title),
    headers: Object.freeze(source.headers.map((value) => polishText(language, value))),
    rows: Object.freeze(source.rows.map((row) => Object.freeze(row.map((value) => polishText(language, value))))),
    emphasizedRowIndexes: Object.freeze([...source.emphasizedRowIndexes]),
  });
}

export function polishCubesDiceStudentSolutionLocalizationV1(source: CubesDiceStudentSolutionV1): CubesDiceStudentSolutionV1 {
  if (source.language === "en") return source;
  const language = source.language;
  return Object.freeze({
    ...source,
    logicRule: polishText(language, source.logicRule),
    tables: Object.freeze(source.tables.map((value) => polishTable(language, value))),
    steps: Object.freeze(source.steps.map((value) => polishText(language, value))),
    note: source.note === null ? null : polishText(language, source.note),
    answerLine: polishText(language, source.answerLine),
  });
}

export function polishCubesDiceLocalizedStemV1(language: CubesDiceStudentSolutionLanguageV1, stem: string): string {
  if (language === "hi") {
    return stem
      .replaceAll("सीमाबद्ध घनाभ", "सबसे छोटा घेरने वाला घनाभ")
      .replaceAll("इकाई-वर्ग स्थान", "इकाई वर्ग");
  }
  if (language === "pa") {
    return stem
      .replaceAll("ਸੀਮਾਬੱਧ ਘਣਾਭ", "ਸਭ ਤੋਂ ਛੋਟਾ ਘੇਰਨ ਵਾਲਾ ਘਣਾਭ")
      .replaceAll("ਇਕਾਈ-ਵਰਗ ਖਾਣੇ", "ਇਕਾਈ ਵਰਗ");
  }
  return stem;
}
