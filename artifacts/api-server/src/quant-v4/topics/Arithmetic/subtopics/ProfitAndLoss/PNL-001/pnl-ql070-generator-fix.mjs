import fs from "node:fs";
import path from "node:path";

const root = path.resolve(
  "artifacts/api-server/src/quant-v4/topics/Arithmetic/subtopics/ProfitAndLoss/PNL-001",
);
const foundation = path.join(root, "foundation");

function read(file) {
  return fs.readFileSync(file, "utf8");
}

function write(file, value) {
  fs.writeFileSync(file, value);
}

function replaceOnce(file, oldValue, newValue) {
  const source = read(file);
  const first = source.indexOf(oldValue);
  if (first < 0) {
    throw new Error(`Anchor not found in ${file}: ${oldValue.slice(0, 140)}`);
  }
  if (source.indexOf(oldValue, first + oldValue.length) >= 0) {
    throw new Error(`Anchor is not unique in ${file}: ${oldValue.slice(0, 140)}`);
  }
  write(file, source.replace(oldValue, newValue));
}

const legacyBuilder = path.join(foundation, "editorial-v2-legacy-builder.ts");
replaceOnce(
  legacyBuilder,
  'question: "Is the required discount uniquely determinable?",',
  'question: "Can the required discount be determined uniquely?",',
);
replaceOnce(
  legacyBuilder,
  `function buildExplanation(cpId: string, solveMode: string) {\n  if (cpId === "PNL-CP-001") return buildCp001Explanation(solveMode);\n  if (cpId === "PNL-CP-002") return buildCp002Explanation(solveMode);\n  return buildCp003Explanation(solveMode);\n}`,
  `function buildExplanation(cpId: string, solveMode: string, qlId: string) {\n  if (qlId === "PNL-QL-070") {\n    return {\n      opening:\n        "Test each statement independently before combining the information.",\n      concept:\n        "Statement I can determine the target selling price from cost price and the target result, but discount also needs marked price. Statement II supplies marked price but cannot determine the target selling price. Together they determine the discount uniquely.",\n      steps: [\n        {\n          title: "Check Statement I alone",\n          body:\n            "Cost price and the target profit or loss fix the target selling price, but marked price is still unknown.",\n        },\n        {\n          title: "Check Statement II alone",\n          body:\n            "Marked price is known, but the selling price required for the target result is still unknown.",\n        },\n        {\n          title: "Combine both statements",\n          body:\n            "Use Statement I to find target selling price, then compare it with the marked price from Statement II to calculate the discount percentage.",\n          equationLatex: "d=\\\\frac{M-S_{target}}{M}\\\\times100",\n        },\n      ],\n      conclusion:\n        "Neither statement alone is sufficient; both statements together are required.",\n      commonTrap:\n        "Do not use information from Statement II while testing Statement I, or vice versa.",\n    };\n  }\n  if (cpId === "PNL-CP-001") return buildCp001Explanation(solveMode);\n  if (cpId === "PNL-CP-002") return buildCp002Explanation(solveMode);\n  return buildCp003Explanation(solveMode);\n}`,
);
replaceOnce(
  legacyBuilder,
  "explanation: buildExplanation(registry.cpId, registryEntry.solveMode),",
  "explanation: buildExplanation(registry.cpId, registryEntry.solveMode, qlId),",
);
replaceOnce(
  legacyBuilder,
  `difficultyRationale: legacyDifficultyRationale(\n        difficulty,\n        registryEntry.solveMode,\n      ),`,
  `difficultyRationale:\n        qlId === "PNL-QL-070"\n          ? "The two statements must be tested independently before their linked price bases can be combined."\n          : legacyDifficultyRationale(difficulty, registryEntry.solveMode),`,
);

const normalizer = path.join(
  foundation,
  "editorial-v2-multilingual-normalizer.ts",
);
replaceOnce(
  normalizer,
  `function normalizeEntry(\n  language: NativeEditorialLanguage,\n  qlId: string,\n  entry: StructuredEditorialEntry,\n): StructuredEditorialEntry {\n  return compactEditorialEntry(language, {`,
  `function normalizeEntry(\n  language: NativeEditorialLanguage,\n  qlId: string,\n  entry: StructuredEditorialEntry,\n): StructuredEditorialEntry {\n  if (qlId === "PNL-QL-070") {\n    return language === "hi"\n      ? {\n          stem: {\n            contextFamily: "hi:PNL-CP-002:70:कथनों की पर्याप्त जानकारी",\n            blocks: [\n              {\n                type: "paragraph",\n                content:\n                  "मांगे गए लाभ या हानि के लिए आवश्यक छूट ज्ञात करनी है।",\n              },\n              {\n                type: "data_sufficiency",\n                question:\n                  "क्या दिए गए कथनों से आवश्यक छूट निश्चित रूप से ज्ञात की जा सकती है?",\n                statements: ["{statementOne}", "{statementTwo}"],\n                answerScheme: "STANDARD_TWO_STATEMENT",\n              },\n            ],\n            prompt:\n              "तय कीजिए कि कोई एक कथन पर्याप्त है या दोनों कथनों को साथ लेना आवश्यक है।",\n          },\n          explanation: {\n            opening:\n              "पहले दोनों कथनों को अलग-अलग जाँचें, फिर जरूरत होने पर उन्हें साथ लें।",\n            concept:\n              "कथन I से क्रय मूल्य और मांगे गए लाभ या हानि के आधार पर आवश्यक विक्रय मूल्य निकलता है, लेकिन छूट के लिए अंकित मूल्य भी चाहिए। कथन II केवल अंकित मूल्य देता है। इसलिए दोनों कथनों को साथ लेने पर ही छूट निश्चित रूप से निकलती है।",\n            steps: [\n              {\n                title: "केवल कथन I जाँचें",\n                body:\n                  "आवश्यक विक्रय मूल्य निकल जाता है, पर अंकित मूल्य न होने से छूट नहीं निकलती।",\n              },\n              {\n                title: "केवल कथन II जाँचें",\n                body:\n                  "अंकित मूल्य मिल जाता है, पर आवश्यक विक्रय मूल्य ज्ञात नहीं होता।",\n              },\n              {\n                title: "दोनों कथन मिलाएँ",\n                body:\n                  "कथन I से आवश्यक विक्रय मूल्य निकालकर उसकी कथन II के अंकित मूल्य से तुलना करें।",\n                equationLatex: "d=\\\\frac{M-S_{target}}{M}\\\\times100",\n              },\n            ],\n            conclusion:\n              "कोई भी कथन अकेला पर्याप्त नहीं है; दोनों कथन साथ आवश्यक हैं।",\n            commonTrap:\n              "किसी एक कथन की जाँच करते समय दूसरे कथन की जानकारी उपयोग न करें।",\n          },\n          difficulty: "Hard",\n          difficultyRationale:\n            "पहले हर कथन को अलग जाँचना पड़ता है; दोनों मिलने पर ही सारी आवश्यक जानकारी मिलती है।",\n        }\n      : {\n          stem: {\n            contextFamily: "pa:PNL-CP-002:70:ਕਥਨਾਂ ਵਿੱਚ ਕਾਫ਼ੀ ਜਾਣਕਾਰੀ",\n            blocks: [\n              {\n                type: "paragraph",\n                content:\n                  "ਮੰਗੇ ਗਏ ਨਫ਼ੇ ਜਾਂ ਘਾਟੇ ਲਈ ਲੋੜੀਂਦੀ ਛੂਟ ਪਤਾ ਕਰਨੀ ਹੈ।",\n              },\n              {\n                type: "data_sufficiency",\n                question:\n                  "ਕੀ ਦਿੱਤੇ ਕਥਨਾਂ ਤੋਂ ਲੋੜੀਂਦੀ ਛੂਟ ਪੱਕੇ ਤੌਰ 'ਤੇ ਕੱਢੀ ਜਾ ਸਕਦੀ ਹੈ?",\n                statements: ["{statementOne}", "{statementTwo}"],\n                answerScheme: "STANDARD_TWO_STATEMENT",\n              },\n            ],\n            prompt:\n              "ਦੱਸੋ ਕਿ ਕੋਈ ਇੱਕ ਕਥਨ ਕਾਫ਼ੀ ਹੈ ਜਾਂ ਦੋਵੇਂ ਕਥਨ ਇਕੱਠੇ ਲੋੜੀਂਦੇ ਹਨ।",\n          },\n          explanation: {\n            opening:\n              "ਪਹਿਲਾਂ ਦੋਵੇਂ ਕਥਨਾਂ ਨੂੰ ਵੱਖ-ਵੱਖ ਜਾਂਚੋ, ਫਿਰ ਲੋੜ ਪੈਣ 'ਤੇ ਇਕੱਠੇ ਵਰਤੋ।",\n            concept:\n              "ਕਥਨ I ਤੋਂ ਲਾਗਤ ਮੁੱਲ ਅਤੇ ਮੰਗੇ ਗਏ ਨਫ਼ੇ ਜਾਂ ਘਾਟੇ ਦੇ ਆਧਾਰ 'ਤੇ ਲੋੜੀਂਦਾ ਵਿਕਰੀ ਮੁੱਲ ਨਿਕਲਦਾ ਹੈ, ਪਰ ਛੂਟ ਕੱਢਣ ਲਈ ਅੰਕਿਤ ਮੁੱਲ ਵੀ ਚਾਹੀਦਾ ਹੈ। ਕਥਨ II ਸਿਰਫ਼ ਅੰਕਿਤ ਮੁੱਲ ਦਿੰਦਾ ਹੈ। ਇਸ ਲਈ ਦੋਵੇਂ ਕਥਨ ਮਿਲਾ ਕੇ ਹੀ ਛੂਟ ਪੱਕੇ ਤੌਰ 'ਤੇ ਨਿਕਲਦੀ ਹੈ।",\n            steps: [\n              {\n                title: "ਕੇਵਲ ਕਥਨ I ਜਾਂਚੋ",\n                body:\n                  "ਲੋੜੀਂਦਾ ਵਿਕਰੀ ਮੁੱਲ ਨਿਕਲ ਜਾਂਦਾ ਹੈ, ਪਰ ਅੰਕਿਤ ਮੁੱਲ ਤੋਂ ਬਿਨਾਂ ਛੂਟ ਨਹੀਂ ਨਿਕਲਦੀ।",\n              },\n              {\n                title: "ਕੇਵਲ ਕਥਨ II ਜਾਂਚੋ",\n                body:\n                  "ਅੰਕਿਤ ਮੁੱਲ ਮਿਲ ਜਾਂਦਾ ਹੈ, ਪਰ ਲੋੜੀਂਦਾ ਵਿਕਰੀ ਮੁੱਲ ਪਤਾ ਨਹੀਂ ਹੁੰਦਾ।",\n              },\n              {\n                title: "ਦੋਵੇਂ ਕਥਨ ਮਿਲਾਓ",\n                body:\n                  "ਕਥਨ I ਤੋਂ ਲੋੜੀਂਦਾ ਵਿਕਰੀ ਮੁੱਲ ਕੱਢ ਕੇ ਉਸ ਦੀ ਕਥਨ II ਦੇ ਅੰਕਿਤ ਮੁੱਲ ਨਾਲ ਤੁਲਨਾ ਕਰੋ।",\n                equationLatex: "d=\\\\frac{M-S_{target}}{M}\\\\times100",\n              },\n            ],\n            conclusion:\n              "ਕੋਈ ਵੀ ਕਥਨ ਇਕੱਲਾ ਕਾਫ਼ੀ ਨਹੀਂ; ਦੋਵੇਂ ਕਥਨ ਇਕੱਠੇ ਲੋੜੀਂਦੇ ਹਨ।",\n            commonTrap:\n              "ਇੱਕ ਕਥਨ ਦੀ ਜਾਂਚ ਕਰਦੇ ਸਮੇਂ ਦੂਜੇ ਕਥਨ ਦੀ ਜਾਣਕਾਰੀ ਨਾ ਵਰਤੋ।",\n          },\n          difficulty: "Hard",\n          difficultyRationale:\n            "ਪਹਿਲਾਂ ਹਰ ਕਥਨ ਨੂੰ ਵੱਖਰਾ ਜਾਂਚਣਾ ਪੈਂਦਾ ਹੈ; ਦੋਵੇਂ ਮਿਲਣ 'ਤੇ ਹੀ ਸਾਰੀ ਲੋੜੀਂਦੀ ਜਾਣਕਾਰੀ ਮਿਲਦੀ ਹੈ।",\n        };\n  }\n\n  return compactEditorialEntry(language, {`,
);

console.log(
  JSON.stringify(
    {
      status: "GENERATOR_PATCHED",
      qlId: "PNL-QL-070",
      englishAuthority: "QL_SPECIFIC_LEGACY_BUILDER",
      nativeAuthority: "QL_SPECIFIC_MULTILINGUAL_NORMALIZER",
    },
    null,
    2,
  ),
);
