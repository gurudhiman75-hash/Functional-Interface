import type {
  QuestionStemBlock,
  StructuredEditorialEntry,
  StructuredQuestionStem,
} from "./editorial-content";

export type EditorialStemLanguage = "en" | "hi" | "pa";

const SYNTHETIC_LEAD_PATTERNS: Readonly<Record<EditorialStemLanguage, readonly RegExp[]>> = {
  en: [
    /^During this .+? decision, the following information is available\.\s*/u,
    /^Consider this .+? situation\.\s*/u,
    /^The following commercial records are available for this .+? setting\.\s*/u,
    /^Use the following information from an? .+? setting\.\s*/u,
    /^This .+? transaction is described below\.\s*/u,
  ],
  hi: [
    /^.+? से जुड़े एक व्यावहारिक प्रश्न में निम्न जानकारी दी गई है।\s*/u,
    /^.+? के एक वास्तविक व्यावसायिक रिकॉर्ड पर विचार कीजिए।\s*/u,
    /^.+? की मूल्य-निर्धारण स्थिति नीचे दी गई है।\s*/u,
    /^निम्न विवरण .+? से जुड़े एक लेन-देन का है।\s*/u,
    /^.+? के दिए गए आंकड़ों का उपयोग कीजिए।\s*/u,
  ],
  pa: [
    /^.+? ਨਾਲ ਜੁੜੇ ਇੱਕ ਵਿਆਵਹਾਰਿਕ ਪ੍ਰਸ਼ਨ ਵਿੱਚ ਹੇਠਾਂ ਦਿੱਤੀ ਜਾਣਕਾਰੀ ਵਰਤੋ।\s*/u,
    /^.+? ਦੇ ਇੱਕ ਅਸਲ ਵਪਾਰਕ ਰਿਕਾਰਡ ਬਾਰੇ ਵਿਚਾਰ ਕਰੋ।\s*/u,
    /^.+? ਦੀ ਕੀਮਤ-ਨਿਰਧਾਰਨ ਸਥਿਤੀ ਹੇਠਾਂ ਦਿੱਤੀ ਹੈ।\s*/u,
    /^ਹੇਠਾਂ ਦਿੱਤਾ ਵੇਰਵਾ .+? ਨਾਲ ਜੁੜੇ ਇੱਕ ਲੈਣ-ਦੇਣ ਦਾ ਹੈ।\s*/u,
    /^.+? ਦੇ ਦਿੱਤੇ ਅੰਕੜਿਆਂ ਦੀ ਵਰਤੋਂ ਕਰੋ।\s*/u,
  ],
};

export function stripSyntheticStemLead(
  language: EditorialStemLanguage,
  value: string,
): string {
  let output = value.trim();
  for (const pattern of SYNTHETIC_LEAD_PATTERNS[language]) {
    output = output.replace(pattern, "").trim();
  }
  return output;
}

export function hasSyntheticStemLead(
  language: EditorialStemLanguage,
  value: string,
): boolean {
  const normalized = value.trim();
  return SYNTHETIC_LEAD_PATTERNS[language].some((pattern) => pattern.test(normalized));
}

export function compactEditorialStem(
  language: EditorialStemLanguage,
  stem: StructuredQuestionStem,
): StructuredQuestionStem {
  const blocks = stem.blocks
    .map((block): QuestionStemBlock => {
      if (block.type !== "paragraph") return block;
      return { ...block, content: stripSyntheticStemLead(language, block.content) };
    })
    .filter((block) => block.type !== "paragraph" || block.content.trim().length > 0);

  return { ...stem, blocks };
}

export function compactEditorialEntry(
  language: EditorialStemLanguage,
  entry: StructuredEditorialEntry,
): StructuredEditorialEntry {
  return { ...entry, stem: compactEditorialStem(language, entry.stem) };
}
