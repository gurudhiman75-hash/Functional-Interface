import fs from "node:fs";
import path from "node:path";

const root = path.resolve(
  "artifacts/api-server/src/quant-v4/topics/Arithmetic/subtopics/ProfitAndLoss/PNL-001",
);

function replaceOnce(file, oldValue, newValue) {
  const source = fs.readFileSync(file, "utf8");
  const first = source.indexOf(oldValue);
  if (first < 0) throw new Error(`Anchor not found in ${file}: ${oldValue}`);
  if (source.indexOf(oldValue, first + oldValue.length) >= 0) {
    throw new Error(`Anchor is not unique in ${file}: ${oldValue}`);
  }
  fs.writeFileSync(file, source.replace(oldValue, newValue));
}

const templates = {
  en: [
    '"PNL-QL-092": {"template":"A part of a stock has already been sold. Determine whether the two statements are sufficient to find the price at which each remaining article must be sold.","difficulty":"Hard"}',
    '"PNL-QL-092": {"template":"A part of a stock has already been sold. The required overall result is {targetRatePercent}% {targetDirection}. Determine whether the two statements are sufficient to find the price at which each remaining article must be sold.","difficulty":"Hard"}',
  ],
  hi: [
    '"PNL-QL-092":{"template":"माल का एक भाग पहले ही बेचा जा चुका है। जाँचिए कि शेष प्रत्येक वस्तु का आवश्यक विक्रय मूल्य ज्ञात करने के लिए दोनों कथन पर्याप्त हैं या नहीं।","difficulty":"Hard"}',
    '"PNL-QL-092":{"template":"माल का एक भाग पहले ही बेचा जा चुका है और पूरे माल के लिए लक्ष्य {targetRatePercent}% {targetDirection} है। जाँचिए कि शेष प्रत्येक वस्तु का आवश्यक विक्रय मूल्य ज्ञात करने के लिए दोनों कथन पर्याप्त हैं या नहीं।","difficulty":"Hard"}',
  ],
  pa: [
    '"PNL-QL-092":{"template":"ਮਾਲ ਦਾ ਇੱਕ ਹਿੱਸਾ ਪਹਿਲਾਂ ਹੀ ਵੇਚਿਆ ਜਾ ਚੁੱਕਾ ਹੈ। ਜਾਂਚੋ ਕਿ ਬਾਕੀ ਹਰ ਵਸਤੂ ਦਾ ਲੋੜੀਂਦਾ ਵਿਕਰੀ ਮੁੱਲ ਪਤਾ ਕਰਨ ਲਈ ਦੋਵੇਂ ਕਥਨ ਕਾਫ਼ੀ ਹਨ ਜਾਂ ਨਹੀਂ।","difficulty":"Hard"}',
    '"PNL-QL-092":{"template":"ਮਾਲ ਦਾ ਇੱਕ ਹਿੱਸਾ ਪਹਿਲਾਂ ਹੀ ਵੇਚਿਆ ਜਾ ਚੁੱਕਾ ਹੈ ਅਤੇ ਪੂਰੇ ਮਾਲ ਲਈ ਟੀਚਾ {targetRatePercent}% {targetDirection} ਹੈ। ਜਾਂਚੋ ਕਿ ਬਾਕੀ ਹਰ ਵਸਤੂ ਦਾ ਲੋੜੀਂਦਾ ਵਿਕਰੀ ਮੁੱਲ ਪਤਾ ਕਰਨ ਲਈ ਦੋਵੇਂ ਕਥਨ ਕਾਫ਼ੀ ਹਨ ਜਾਂ ਨਹੀਂ।","difficulty":"Hard"}',
  ],
};
for (const [language, [oldValue, newValue]] of Object.entries(templates)) {
  replaceOnce(
    path.join(root, `CP-003/question-language.${language}.json`),
    oldValue,
    newValue,
  );
}

const normalizer = path.join(
  root,
  "foundation/editorial-v2-multilingual-normalizer.ts",
);
replaceOnce(
  normalizer,
  `  if (qlId === "PNL-QL-087") {`,
  `  if (qlId === "PNL-QL-092") {\n    return [\n      {\n        type: "paragraph",\n        content:\n          language === "hi"\n            ? "माल का एक भाग पहले ही बेचा जा चुका है और पूरे माल के लिए लक्ष्य {targetRatePercent}% {targetDirection} है।"\n            : "ਮਾਲ ਦਾ ਇੱਕ ਹਿੱਸਾ ਪਹਿਲਾਂ ਹੀ ਵੇਚਿਆ ਜਾ ਚੁੱਕਾ ਹੈ ਅਤੇ ਪੂਰੇ ਮਾਲ ਲਈ ਟੀਚਾ {targetRatePercent}% {targetDirection} ਹੈ।",\n      },\n      {\n        type: "data_sufficiency",\n        question:\n          language === "hi"\n            ? "क्या दिए गए कथनों से शेष प्रत्येक वस्तु का आवश्यक विक्रय मूल्य निश्चित रूप से ज्ञात किया जा सकता है?"\n            : "ਕੀ ਦਿੱਤੇ ਕਥਨਾਂ ਤੋਂ ਬਾਕੀ ਹਰ ਵਸਤੂ ਦਾ ਲੋੜੀਂਦਾ ਵਿਕਰੀ ਮੁੱਲ ਪੱਕੇ ਤੌਰ 'ਤੇ ਕੱਢਿਆ ਜਾ ਸਕਦਾ ਹੈ?",\n        statements: ["{statementOne}", "{statementTwo}"],\n        answerScheme: "STANDARD_TWO_STATEMENT",\n      },\n    ];\n  }\n\n  if (qlId === "PNL-QL-087") {`,
);

console.log(
  JSON.stringify(
    {
      status: "PATCHED",
      qlId: "PNL-QL-092",
      languages: ["en", "hi", "pa"],
      requiredVariables: [
        "statementOne",
        "statementTwo",
        "targetDirection",
        "targetRatePercent",
      ],
    },
    null,
    2,
  ),
);
