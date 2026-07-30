import type {
  QuestionStemBlock,
  StructuredEditorialEntry,
} from "./editorial-content";
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
  const sector =
    contextFamily.split(":").at(-1) ?? (language === "hi" ? "व्यापार" : "ਵਪਾਰ");
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
    return {
      ...block,
      latex: localizeEditorialLatex(language, block.latex) ?? block.latex,
    };
  });
}

function normalizeBlocks(
  language: NativeEditorialLanguage,
  qlId: string,
  entry: StructuredEditorialEntry,
): readonly QuestionStemBlock[] {
  if (qlId === "PNL-QL-035") {
    return [
      {
        type: "paragraph",
        content:
          language === "hi"
            ? "एक सामुदायिक आपूर्तिकर्ता ने स्कूल-डेस्क सेट ₹{costPrice} में खरीदा और ₹{sellingPrice} में बेच दिया।"
            : "ਇੱਕ ਕਮਿਊਨਿਟੀ ਸਪਲਾਇਰ ਨੇ ਸਕੂਲ-ਡੈਸਕ ਸੈੱਟ ₹{costPrice} ਵਿੱਚ ਖਰੀਦਿਆ ਅਤੇ ₹{sellingPrice} ਵਿੱਚ ਵੇਚ ਦਿੱਤਾ।",
      },
    ];
  }

  if (qlId === "PNL-QL-070") {
    return [
      {
        type: "paragraph",
        content:
          language === "hi"
            ? "लक्षित परिणाम के लिए आवश्यक छूट ज्ञात करनी है।"
            : "ਟੀਚੇ ਵਾਲੇ ਨਤੀਜੇ ਲਈ ਲੋੜੀਂਦੀ ਛੂਟ ਪਤਾ ਕਰਨੀ ਹੈ।",
      },
      {
        type: "data_sufficiency",
        question:
          language === "hi"
            ? "क्या आवश्यक छूट को निश्चित रूप से ज्ञात किया जा सकता है?"
            : "ਕੀ ਲੋੜੀਂਦੀ ਛੂਟ ਨੂੰ ਪੱਕੇ ਤੌਰ 'ਤੇ ਕੱਢਿਆ ਜਾ ਸਕਦਾ ਹੈ?",
        statements: ["{statementOne}", "{statementTwo}"],
        answerScheme: "STANDARD_TWO_STATEMENT",
      },
    ];
  }

  if (qlId === "PNL-QL-092") {
    return [
      {
        type: "paragraph",
        content:
          language === "hi"
            ? "माल का एक भाग पहले ही बेचा जा चुका है और पूरे माल के लिए लक्ष्य {targetRatePercent}% {targetDirection} है।"
            : "ਮਾਲ ਦਾ ਇੱਕ ਹਿੱਸਾ ਪਹਿਲਾਂ ਹੀ ਵੇਚਿਆ ਜਾ ਚੁੱਕਾ ਹੈ ਅਤੇ ਪੂਰੇ ਮਾਲ ਲਈ ਟੀਚਾ {targetRatePercent}% {targetDirection} ਹੈ।",
      },
      {
        type: "data_sufficiency",
        question:
          language === "hi"
            ? "क्या दिए गए कथनों से शेष प्रत्येक वस्तु का आवश्यक विक्रय मूल्य निश्चित रूप से ज्ञात किया जा सकता है?"
            : "ਕੀ ਦਿੱਤੇ ਕਥਨਾਂ ਤੋਂ ਬਾਕੀ ਹਰ ਵਸਤੂ ਦਾ ਲੋੜੀਂਦਾ ਵਿਕਰੀ ਮੁੱਲ ਪੱਕੇ ਤੌਰ 'ਤੇ ਕੱਢਿਆ ਜਾ ਸਕਦਾ ਹੈ?",
        statements: ["{statementOne}", "{statementTwo}"],
        answerScheme: "STANDARD_TWO_STATEMENT",
      },
    ];
  }

  if (qlId === "PNL-QL-087") {
    return [
      {
        type: "paragraph",
        content:
          language === "hi"
            ? "स्टॉक की कुल लागत ₹{totalCostPrice} है और व्यापारी उससे {recoveredFraction} भाग वसूल करता है।"
            : "ਸਟਾਕ ਦੀ ਕੁੱਲ ਲਾਗਤ ₹{totalCostPrice} ਹੈ ਅਤੇ ਵਪਾਰੀ ਇਸ ਦਾ {recoveredFraction} ਹਿੱਸਾ ਵਸੂਲ ਕਰਦਾ ਹੈ।",
      },
    ];
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
  if (qlId === "PNL-QL-070") {
    return language === "hi"
      ? {
          stem: {
            contextFamily: "hi:PNL-CP-002:70:कथनों की पर्याप्त जानकारी",
            blocks: [
              {
                type: "paragraph",
                content:
                  "मांगे गए लाभ या हानि के लिए आवश्यक छूट ज्ञात करनी है।",
              },
              {
                type: "data_sufficiency",
                question:
                  "क्या दिए गए कथनों से आवश्यक छूट निश्चित रूप से ज्ञात की जा सकती है?",
                statements: ["{statementOne}", "{statementTwo}"],
                answerScheme: "STANDARD_TWO_STATEMENT",
              },
            ],
            prompt:
              "तय कीजिए कि कोई एक कथन पर्याप्त है या दोनों कथनों को साथ लेना आवश्यक है।",
          },
          explanation: {
            opening:
              "पहले दोनों कथनों को अलग-अलग जाँचें, फिर जरूरत होने पर उन्हें साथ लें।",
            concept:
              "कथन I से क्रय मूल्य और मांगे गए लाभ या हानि के आधार पर आवश्यक विक्रय मूल्य निकलता है, लेकिन छूट के लिए अंकित मूल्य भी चाहिए। कथन II केवल अंकित मूल्य देता है। इसलिए दोनों कथनों को साथ लेने पर ही छूट निश्चित रूप से निकलती है।",
            steps: [
              {
                title: "केवल कथन I जाँचें",
                body: "आवश्यक विक्रय मूल्य निकल जाता है, पर अंकित मूल्य न होने से छूट नहीं निकलती।",
              },
              {
                title: "केवल कथन II जाँचें",
                body: "अंकित मूल्य मिल जाता है, पर आवश्यक विक्रय मूल्य ज्ञात नहीं होता।",
              },
              {
                title: "दोनों कथन मिलाएँ",
                body: "कथन I से आवश्यक विक्रय मूल्य निकालकर उसकी कथन II के अंकित मूल्य से तुलना करें।",
                equationLatex: "d=\\frac{M-S_{target}}{M}\\times100",
              },
            ],
            conclusion:
              "कोई भी कथन अकेला पर्याप्त नहीं है; दोनों कथन साथ आवश्यक हैं।",
            commonTrap:
              "किसी एक कथन की जाँच करते समय दूसरे कथन की जानकारी उपयोग न करें।",
          },
          difficulty: "Hard",
          difficultyRationale:
            "पहले हर कथन को अलग जाँचना पड़ता है; दोनों मिलने पर ही सारी आवश्यक जानकारी मिलती है।",
        }
      : {
          stem: {
            contextFamily: "pa:PNL-CP-002:70:ਕਥਨਾਂ ਵਿੱਚ ਕਾਫ਼ੀ ਜਾਣਕਾਰੀ",
            blocks: [
              {
                type: "paragraph",
                content: "ਮੰਗੇ ਗਏ ਨਫ਼ੇ ਜਾਂ ਘਾਟੇ ਲਈ ਲੋੜੀਂਦੀ ਛੂਟ ਪਤਾ ਕਰਨੀ ਹੈ।",
              },
              {
                type: "data_sufficiency",
                question:
                  "ਕੀ ਦਿੱਤੇ ਕਥਨਾਂ ਤੋਂ ਲੋੜੀਂਦੀ ਛੂਟ ਪੱਕੇ ਤੌਰ 'ਤੇ ਕੱਢੀ ਜਾ ਸਕਦੀ ਹੈ?",
                statements: ["{statementOne}", "{statementTwo}"],
                answerScheme: "STANDARD_TWO_STATEMENT",
              },
            ],
            prompt:
              "ਦੱਸੋ ਕਿ ਕੋਈ ਇੱਕ ਕਥਨ ਕਾਫ਼ੀ ਹੈ ਜਾਂ ਦੋਵੇਂ ਕਥਨ ਇਕੱਠੇ ਲੋੜੀਂਦੇ ਹਨ।",
          },
          explanation: {
            opening:
              "ਪਹਿਲਾਂ ਦੋਵੇਂ ਕਥਨਾਂ ਨੂੰ ਵੱਖ-ਵੱਖ ਜਾਂਚੋ, ਫਿਰ ਲੋੜ ਪੈਣ 'ਤੇ ਇਕੱਠੇ ਵਰਤੋ।",
            concept:
              "ਕਥਨ I ਤੋਂ ਲਾਗਤ ਮੁੱਲ ਅਤੇ ਮੰਗੇ ਗਏ ਨਫ਼ੇ ਜਾਂ ਘਾਟੇ ਦੇ ਆਧਾਰ 'ਤੇ ਲੋੜੀਂਦਾ ਵਿਕਰੀ ਮੁੱਲ ਨਿਕਲਦਾ ਹੈ, ਪਰ ਛੂਟ ਕੱਢਣ ਲਈ ਅੰਕਿਤ ਮੁੱਲ ਵੀ ਚਾਹੀਦਾ ਹੈ। ਕਥਨ II ਸਿਰਫ਼ ਅੰਕਿਤ ਮੁੱਲ ਦਿੰਦਾ ਹੈ। ਇਸ ਲਈ ਦੋਵੇਂ ਕਥਨ ਮਿਲਾ ਕੇ ਹੀ ਛੂਟ ਪੱਕੇ ਤੌਰ 'ਤੇ ਨਿਕਲਦੀ ਹੈ।",
            steps: [
              {
                title: "ਕੇਵਲ ਕਥਨ I ਜਾਂਚੋ",
                body: "ਲੋੜੀਂਦਾ ਵਿਕਰੀ ਮੁੱਲ ਨਿਕਲ ਜਾਂਦਾ ਹੈ, ਪਰ ਅੰਕਿਤ ਮੁੱਲ ਤੋਂ ਬਿਨਾਂ ਛੂਟ ਨਹੀਂ ਨਿਕਲਦੀ।",
              },
              {
                title: "ਕੇਵਲ ਕਥਨ II ਜਾਂਚੋ",
                body: "ਅੰਕਿਤ ਮੁੱਲ ਮਿਲ ਜਾਂਦਾ ਹੈ, ਪਰ ਲੋੜੀਂਦਾ ਵਿਕਰੀ ਮੁੱਲ ਪਤਾ ਨਹੀਂ ਹੁੰਦਾ।",
              },
              {
                title: "ਦੋਵੇਂ ਕਥਨ ਮਿਲਾਓ",
                body: "ਕਥਨ I ਤੋਂ ਲੋੜੀਂਦਾ ਵਿਕਰੀ ਮੁੱਲ ਕੱਢ ਕੇ ਉਸ ਦੀ ਕਥਨ II ਦੇ ਅੰਕਿਤ ਮੁੱਲ ਨਾਲ ਤੁਲਨਾ ਕਰੋ।",
                equationLatex: "d=\\frac{M-S_{target}}{M}\\times100",
              },
            ],
            conclusion:
              "ਕੋਈ ਵੀ ਕਥਨ ਇਕੱਲਾ ਕਾਫ਼ੀ ਨਹੀਂ; ਦੋਵੇਂ ਕਥਨ ਇਕੱਠੇ ਲੋੜੀਂਦੇ ਹਨ।",
            commonTrap:
              "ਇੱਕ ਕਥਨ ਦੀ ਜਾਂਚ ਕਰਦੇ ਸਮੇਂ ਦੂਜੇ ਕਥਨ ਦੀ ਜਾਣਕਾਰੀ ਨਾ ਵਰਤੋ।",
          },
          difficulty: "Hard",
          difficultyRationale:
            "ਪਹਿਲਾਂ ਹਰ ਕਥਨ ਨੂੰ ਵੱਖਰਾ ਜਾਂਚਣਾ ਪੈਂਦਾ ਹੈ; ਦੋਵੇਂ ਮਿਲਣ 'ਤੇ ਹੀ ਸਾਰੀ ਲੋੜੀਂਦੀ ਜਾਣਕਾਰੀ ਮਿਲਦੀ ਹੈ।",
        };
  }

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
      finalAnswerLatex: localizeEditorialLatex(
        language,
        entry.explanation.finalAnswerLatex,
      ),
    },
  });
}

function normalizeLibrary(library: EditorialLibraryFile): EditorialLibraryFile {
  const language = library.language as NativeEditorialLanguage;
  return {
    ...library,
    entries: Object.fromEntries(
      Object.entries(library.entries).map(([qlId, entry]) => [
        qlId,
        normalizeEntry(language, qlId, entry),
      ]),
    ),
  };
}

export function buildAllNormalizedMultilingualEditorialLibraries(): readonly EditorialLibraryFile[] {
  return buildAllMultilingualEditorialLibraries().map(normalizeLibrary);
}
