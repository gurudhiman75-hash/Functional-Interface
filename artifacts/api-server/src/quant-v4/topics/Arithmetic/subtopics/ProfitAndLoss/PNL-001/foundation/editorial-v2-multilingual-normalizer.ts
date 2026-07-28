import type { QuestionStemBlock, StructuredEditorialEntry } from "./editorial-content";
import type { EditorialLibraryFile } from "./editorial-library";
import { compactEditorialEntry } from "./editorial-v2-exam-stems";
import { localizeEditorialLatex } from "./editorial-v2-native-latex";
import type { NativeEditorialLanguage } from "./editorial-v2-native-stems";
import { buildAllMultilingualEditorialLibraries } from "./editorial-v2-multilingual-builder";

type NativeFact = Readonly<{ hi: string; pa: string }>;

const NATIVE_FACTS: Readonly<Record<string, NativeFact>> = {
  "PNL-QL-047": {
    hi: "वस्तु का वास्तविक क्रय मूल्य ₹{costPrice} है।",
    pa: "ਵਸਤੂ ਦਾ ਅਸਲ ਲਾਗਤ ਮੁੱਲ ₹{costPrice} ਹੈ।",
  },
  "PNL-QL-050": {
    hi: "वस्तु का क्रय मूल्य ₹{costPrice} है।",
    pa: "ਵਸਤੂ ਦਾ ਲਾਗਤ ਮੁੱਲ ₹{costPrice} ਹੈ।",
  },
  "PNL-QL-070": {
    hi: "वस्तु का क्रय मूल्य ₹{costPrice}, अंकित मूल्य ₹{markedPrice} और लक्षित लाभ दर {targetRatePercent}% है।",
    pa: "ਵਸਤੂ ਦਾ ਲਾਗਤ ਮੁੱਲ ₹{costPrice}, ਅੰਕਿਤ ਮੁੱਲ ₹{markedPrice} ਅਤੇ ਟੀਚਾ ਲਾਭ ਦਰ {targetRatePercent}% ਹੈ।",
  },
  "PNL-QL-072": {
    hi: "दोनों वस्तुएँ ₹{commonSellingPrice} के समान विक्रय मूल्य पर बेची जाती हैं।",
    pa: "ਦੋਵੇਂ ਵਸਤੂਆਂ ₹{commonSellingPrice} ਦੇ ਇੱਕੋ ਵਿਕਰੀ ਮੁੱਲ 'ਤੇ ਵੇਚੀਆਂ ਜਾਂਦੀਆਂ ਹਨ।",
  },
  "PNL-QL-073": {
    hi: "दोनों वस्तुओं का समान क्रय मूल्य ₹{commonCostPrice} है।",
    pa: "ਦੋਵੇਂ ਵਸਤੂਆਂ ਦਾ ਇੱਕੋ ਲਾਗਤ ਮੁੱਲ ₹{commonCostPrice} ਹੈ।",
  },
  "PNL-QL-074": {
    hi: "बिक्री के बाद {unsoldQuantity} इकाइयाँ बचती हैं और प्रत्येक से ₹{unsoldRecoveryPerUnit} की वसूली होती है।",
    pa: "ਵਿਕਰੀ ਤੋਂ ਬਾਅਦ {unsoldQuantity} ਇਕਾਈਆਂ ਬਚਦੀਆਂ ਹਨ ਅਤੇ ਹਰ ਇਕਾਈ ਤੋਂ ₹{unsoldRecoveryPerUnit} ਦੀ ਵਸੂਲੀ ਹੁੰਦੀ ਹੈ।",
  },
  "PNL-QL-075": {
    hi: "पूरे स्टॉक पर लक्ष्य {targetRatePercent}% {targetDirection} है।",
    pa: "ਪੂਰੇ ਸਟਾਕ ਲਈ ਟੀਚਾ {targetRatePercent}% {targetDirection} ਹੈ।",
  },
  "PNL-QL-076": {
    hi: "भुगतान की गई प्रत्येक इकाई का क्रय मूल्य ₹{unitCostPrice} है।",
    pa: "ਭੁਗਤਾਨ ਕੀਤੀ ਹਰ ਇਕਾਈ ਦਾ ਲਾਗਤ ਮੁੱਲ ₹{unitCostPrice} ਹੈ।",
  },
  "PNL-QL-078": {
    hi: "अज्ञात समूह की प्रति इकाई लागत ₹{unknownUnitCostPrice} है और उसकी दिशा {unknownDirection} है।",
    pa: "ਅਣਜਾਣ ਸਮੂਹ ਦੀ ਪ੍ਰਤੀ ਇਕਾਈ ਲਾਗਤ ₹{unknownUnitCostPrice} ਹੈ ਅਤੇ ਉਸ ਦੀ ਦਿਸ਼ਾ {unknownDirection} ਹੈ।",
  },
  "PNL-QL-079": {
    hi: "अतिरिक्त समूह की प्रति इकाई लागत ₹{unknownUnitCostPrice} है।",
    pa: "ਵਾਧੂ ਸਮੂਹ ਦੀ ਪ੍ਰਤੀ ਇਕਾਈ ਲਾਗਤ ₹{unknownUnitCostPrice} ਹੈ।",
  },
  "PNL-QL-081": {
    hi: "पूरे स्टॉक के लिए अपेक्षित परिणाम {targetRatePercent}% {targetDirection} है।",
    pa: "ਪੂਰੇ ਸਟਾਕ ਲਈ ਲੋੜੀਂਦਾ ਨਤੀਜਾ {targetRatePercent}% {targetDirection} ਹੈ।",
  },
  "PNL-QL-082": {
    hi: "अच्छी स्थिति वाली {goodQuantity} इकाइयाँ निर्धारित मूल्य पर बेची जाती हैं।",
    pa: "ਚੰਗੀ ਹਾਲਤ ਵਾਲੀਆਂ {goodQuantity} ਇਕਾਈਆਂ ਨਿਰਧਾਰਤ ਮੁੱਲ 'ਤੇ ਵੇਚੀਆਂ ਜਾਂਦੀਆਂ ਹਨ।",
  },
  "PNL-QL-084": {
    hi: "पहली वस्तु {knownRatePercent}% {knownDirection} पर और दूसरी वस्तु अज्ञात {unknownDirection} दर पर बेची जाती है; संयुक्त लक्ष्य {targetRatePercent}% {targetDirection} है।",
    pa: "ਪਹਿਲੀ ਵਸਤੂ {knownRatePercent}% {knownDirection} 'ਤੇ ਅਤੇ ਦੂਜੀ ਵਸਤੂ ਅਣਜਾਣ {unknownDirection} ਦਰ 'ਤੇ ਵੇਚੀ ਜਾਂਦੀ ਹੈ; ਸੰਯੁਕਤ ਟੀਚਾ {targetRatePercent}% {targetDirection} ਹੈ।",
  },
  "PNL-QL-094": {
    hi: "अच्छी स्थिति वाली {goodQuantity} इकाइयाँ ₹{goodUnitSellingPrice} प्रति इकाई पर बेची जाती हैं।",
    pa: "ਚੰਗੀ ਹਾਲਤ ਵਾਲੀਆਂ {goodQuantity} ਇਕਾਈਆਂ ₹{goodUnitSellingPrice} ਪ੍ਰਤੀ ਇਕਾਈ 'ਤੇ ਵੇਚੀਆਂ ਜਾਂਦੀਆਂ ਹਨ।",
  },
};

function qlNumber(qlId: string): number {
  const value = Number(qlId.split("-").at(-1));
  return Number.isFinite(value) ? value : 1;
}

function contextualConceptNote(
  language: NativeEditorialLanguage,
  qlId: string,
  contextFamily: string,
): string {
  const sector = contextFamily.split(":").at(-1) ?? (language === "hi" ? "व्यापार" : "ਵਪਾਰ");
  const index = qlNumber(qlId) % 5;
  if (language === "hi") {
    const notes = [
      `इस ${sector} संदर्भ में प्रतिशत का आधार शुरू से अंत तक स्पष्ट रखना जरूरी है।`,
      `${sector} के इस उदाहरण में बीच की राशि अलग लिखने से बदलता आधार साफ दिखाई देता है।`,
      `इस ${sector} स्थिति में अंतिम उत्तर से पहले राशि, इकाई और लाभ-हानि की दिशा जाँचें।`,
      `${sector} के इस प्रश्न में दिए गए व्यावसायिक क्रम को उसी क्रम में पढ़ना सबसे सुरक्षित है।`,
      `इस ${sector} उदाहरण में हर गणना को उसके वास्तविक व्यावसायिक अर्थ से जोड़कर देखें।`,
    ];
    return notes[index];
  }
  const notes = [
    `ਇਸ ${sector} ਸੰਦਰਭ ਵਿੱਚ ਪ੍ਰਤੀਸ਼ਤ ਦਾ ਆਧਾਰ ਸ਼ੁਰੂ ਤੋਂ ਅੰਤ ਤੱਕ ਸਪਸ਼ਟ ਰੱਖਣਾ ਜ਼ਰੂਰੀ ਹੈ।`,
    `${sector} ਦੇ ਇਸ ਉਦਾਹਰਨ ਵਿੱਚ ਵਿਚਕਾਰਲੀ ਰਕਮ ਵੱਖ ਲਿਖਣ ਨਾਲ ਬਦਲਦਾ ਆਧਾਰ ਸਾਫ਼ ਦਿਖਦਾ ਹੈ।`,
    `ਇਸ ${sector} ਸਥਿਤੀ ਵਿੱਚ ਅੰਤਿਮ ਉੱਤਰ ਤੋਂ ਪਹਿਲਾਂ ਰਕਮ, ਇਕਾਈ ਅਤੇ ਲਾਭ-ਹਾਨੀ ਦੀ ਦਿਸ਼ਾ ਜਾਂਚੋ।`,
    `${sector} ਦੇ ਇਸ ਪ੍ਰਸ਼ਨ ਵਿੱਚ ਦਿੱਤਾ ਵਪਾਰਕ ਕ੍ਰਮ ਉਸੇ ਕ੍ਰਮ ਵਿੱਚ ਪੜ੍ਹਣਾ ਸਭ ਤੋਂ ਸੁਰੱਖਿਅਤ ਹੈ।`,
    `ਇਸ ${sector} ਉਦਾਹਰਨ ਵਿੱਚ ਹਰ ਗਣਨਾ ਨੂੰ ਉਸ ਦੇ ਅਸਲ ਵਪਾਰਕ ਅਰਥ ਨਾਲ ਜੋੜ ਕੇ ਵੇਖੋ।`,
  ];
  return notes[index];
}

function localizeEquations(
  language: NativeEditorialLanguage,
  blocks: readonly QuestionStemBlock[],
): readonly QuestionStemBlock[] {
  return blocks.map((block): QuestionStemBlock => {
    if (block.type !== "equation") return block;
    return { ...block, latex: localizeEditorialLatex(language, block.latex) ?? block.latex };
  });
}

function normalizeBlocks(
  language: NativeEditorialLanguage,
  qlId: string,
  entry: StructuredEditorialEntry,
): readonly QuestionStemBlock[] {
  if (qlId === "PNL-QL-035") {
    return [{
      type: "paragraph",
      content: language === "hi"
        ? "एक सामुदायिक आपूर्तिकर्ता ने स्कूल-डेस्क सेट ₹{costPrice} में खरीदा और ₹{sellingPrice} में बेच दिया।"
        : "ਇੱਕ ਕਮਿਊਨਿਟੀ ਸਪਲਾਇਰ ਨੇ ਸਕੂਲ-ਡੈਸਕ ਸੈੱਟ ₹{costPrice} ਵਿੱਚ ਖਰੀਦਿਆ ਅਤੇ ₹{sellingPrice} ਵਿੱਚ ਵੇਚ ਦਿੱਤਾ।",
    }];
  }

  if (qlId === "PNL-QL-087") {
    return [{
      type: "paragraph",
      content: language === "hi"
        ? "स्टॉक की कुल लागत ₹{totalCostPrice} है और व्यापारी उससे {recoveredFraction} भाग वसूल करता है।"
        : "ਸਟਾਕ ਦੀ ਕੁੱਲ ਲਾਗਤ ₹{totalCostPrice} ਹੈ ਅਤੇ ਵਪਾਰੀ ਇਸ ਦਾ {recoveredFraction} ਹਿੱਸਾ ਵਸੂਲ ਕਰਦਾ ਹੈ।",
    }];
  }

  const blocks = [...localizeEquations(language, entry.stem.blocks)];
  const fact = NATIVE_FACTS[qlId];
  if (fact) blocks.push({ type: "paragraph", content: fact[language] });
  return blocks;
}

function normalizeEntry(
  language: NativeEditorialLanguage,
  qlId: string,
  entry: StructuredEditorialEntry,
): StructuredEditorialEntry {
  return compactEditorialEntry(language, {
    ...entry,
    stem: { ...entry.stem, blocks: normalizeBlocks(language, qlId, entry) },
    explanation: {
      ...entry.explanation,
      concept: `${entry.explanation.concept} ${contextualConceptNote(language, qlId, entry.stem.contextFamily)}`,
      steps: entry.explanation.steps.map((step) => ({
        ...step,
        equationLatex: localizeEditorialLatex(language, step.equationLatex),
      })),
      finalAnswerLatex: localizeEditorialLatex(language, entry.explanation.finalAnswerLatex),
    },
  });
}

function normalizeLibrary(library: EditorialLibraryFile): EditorialLibraryFile {
  const language = library.language as NativeEditorialLanguage;
  return {
    ...library,
    entries: Object.fromEntries(
      Object.entries(library.entries).map(([qlId, entry]) => [qlId, normalizeEntry(language, qlId, entry)]),
    ),
  };
}

export function buildAllNormalizedMultilingualEditorialLibraries(): readonly EditorialLibraryFile[] {
  return buildAllMultilingualEditorialLibraries().map(normalizeLibrary);
}
