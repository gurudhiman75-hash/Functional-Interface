import fs from "node:fs";
import path from "node:path";
import {
  brotliCompressSync,
  brotliDecompressSync,
  constants,
} from "node:zlib";

const root = path.resolve(
  "artifacts/api-server/src/quant-v4/topics/Arithmetic/subtopics/ProfitAndLoss/PNL-001",
);
const cp = path.join(root, "CP-002");
const foundation = path.join(root, "foundation");

function read(file) {
  return fs.readFileSync(file, "utf8");
}

function write(file, value) {
  fs.writeFileSync(file, value);
}

function readJson(file) {
  return JSON.parse(read(file));
}

function writeJson(file, value) {
  write(file, `${JSON.stringify(value, null, 2)}\n`);
}

function replaceOnce(file, oldValue, newValue) {
  const source = read(file);
  const first = source.indexOf(oldValue);
  if (first < 0) {
    throw new Error(`Anchor not found in ${file}: ${oldValue.slice(0, 120)}`);
  }
  if (source.indexOf(oldValue, first + oldValue.length) >= 0) {
    throw new Error(`Anchor is not unique in ${file}: ${oldValue.slice(0, 120)}`);
  }
  write(file, source.replace(oldValue, newValue));
}

const registryPath = path.join(cp, "task-registry.library.json");
const registry = readJson(registryPath);
registry.entries["PNL-QL-070"].requiredVariables = [
  "statementOne",
  "statementTwo",
];
writeJson(registryPath, registry);

const languageTemplates = {
  en: "The discount needed to achieve a stated target result is to be determined. Statement I: {statementOne} Statement II: {statementTwo} Decide whether either statement alone or both together are sufficient.",
  hi: "लक्षित परिणाम के लिए आवश्यक छूट ज्ञात करनी है। कथन I: {statementOne} कथन II: {statementTwo} तय कीजिए कि कोई एक कथन पर्याप्त है या दोनों को साथ लेना आवश्यक है।",
  pa: "ਟੀਚੇ ਵਾਲੇ ਨਤੀਜੇ ਲਈ ਲੋੜੀਂਦੀ ਛੂਟ ਪਤਾ ਕਰਨੀ ਹੈ। ਕਥਨ I: {statementOne} ਕਥਨ II: {statementTwo} ਫੈਸਲਾ ਕਰੋ ਕਿ ਕੋਈ ਇੱਕ ਕਥਨ ਕਾਫ਼ੀ ਹੈ ਜਾਂ ਦੋਵੇਂ ਇਕੱਠੇ ਲੋੜੀਂਦੇ ਹਨ।",
};
for (const [language, template] of Object.entries(languageTemplates)) {
  const file = path.join(cp, `question-language.${language}.json`);
  const library = readJson(file);
  library.entries["PNL-QL-070"].template = template;
  writeJson(file, library);
}

const editorialEntries = {
  en: {
    stem: {
      contextFamily: "target-discount data sufficiency",
      blocks: [
        {
          type: "paragraph",
          content:
            "The discount needed to achieve a stated target result is to be determined.",
        },
        {
          type: "data_sufficiency",
          question: "Can the required discount be determined uniquely?",
          statements: ["{statementOne}", "{statementTwo}"],
          answerScheme: "STANDARD_TWO_STATEMENT",
        },
      ],
      prompt:
        "Decide whether either statement alone or both together are sufficient.",
    },
    explanation: {
      opening: "Test each statement independently before combining the information.",
      concept:
        "Statement I can determine the target selling price from cost price and the target result, but discount also needs marked price. Statement II supplies marked price but cannot determine the target selling price. Together they determine the discount uniquely.",
      steps: [
        {
          title: "Check Statement I alone",
          body: "Cost price and the target profit or loss fix the target selling price, but marked price is still unknown.",
        },
        {
          title: "Check Statement II alone",
          body: "Marked price is known, but the selling price required for the target result is still unknown.",
        },
        {
          title: "Combine both statements",
          body: "Use Statement I to find target selling price, then compare it with the marked price from Statement II to calculate the discount percentage.",
          equationLatex: "d=\\frac{M-S_{target}}{M}\\times100",
        },
      ],
      conclusion:
        "Neither statement alone is sufficient; both statements together are required.",
      commonTrap:
        "Do not use information from Statement II while testing Statement I, or vice versa.",
    },
    difficulty: "Hard",
    difficultyRationale:
      "The two statements must be tested independently before their linked price bases can be combined.",
  },
  hi: {
    stem: {
      contextFamily: "hi:PNL-CP-002:70:डेटा पर्याप्तता",
      blocks: [
        {
          type: "paragraph",
          content: "लक्षित परिणाम के लिए आवश्यक छूट ज्ञात करनी है।",
        },
        {
          type: "data_sufficiency",
          question: "क्या आवश्यक छूट को निश्चित रूप से ज्ञात किया जा सकता है?",
          statements: ["{statementOne}", "{statementTwo}"],
          answerScheme: "STANDARD_TWO_STATEMENT",
        },
      ],
      prompt:
        "तय कीजिए कि कोई एक कथन पर्याप्त है या दोनों को साथ लेना आवश्यक है।",
    },
    explanation: {
      opening:
        "पहले दोनों कथनों को अलग-अलग जाँचें, फिर जरूरत होने पर उन्हें साथ लें।",
      concept:
        "कथन I से क्रय मूल्य और लक्षित परिणाम के आधार पर आवश्यक विक्रय मूल्य निकल सकता है, लेकिन छूट के लिए अंकित मूल्य भी चाहिए। कथन II केवल अंकित मूल्य देता है। दोनों साथ होने पर छूट एकमात्र रूप से निकलती है।",
      steps: [
        {
          title: "केवल कथन I जाँचें",
          body: "लक्षित विक्रय मूल्य निकल जाता है, पर अंकित मूल्य न होने से छूट नहीं निकलती।",
        },
        {
          title: "केवल कथन II जाँचें",
          body: "अंकित मूल्य मिल जाता है, पर लक्षित विक्रय मूल्य ज्ञात नहीं होता।",
        },
        {
          title: "दोनों कथन मिलाएँ",
          body: "कथन I से लक्षित विक्रय मूल्य निकालकर उसे कथन II के अंकित मूल्य से तुलना करें।",
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
      "दोनों कथनों की स्वतंत्र पर्याप्तता जाँचने के बाद ही जुड़े मूल्य-आधार मिलते हैं।",
  },
  pa: {
    stem: {
      contextFamily: "pa:PNL-CP-002:70:ਡਾਟਾ ਪਰਯਾਪਤਾ",
      blocks: [
        {
          type: "paragraph",
          content: "ਟੀਚੇ ਵਾਲੇ ਨਤੀਜੇ ਲਈ ਲੋੜੀਂਦੀ ਛੂਟ ਪਤਾ ਕਰਨੀ ਹੈ।",
        },
        {
          type: "data_sufficiency",
          question: "ਕੀ ਲੋੜੀਂਦੀ ਛੂਟ ਨੂੰ ਪੱਕੇ ਤੌਰ 'ਤੇ ਕੱਢਿਆ ਜਾ ਸਕਦਾ ਹੈ?",
          statements: ["{statementOne}", "{statementTwo}"],
          answerScheme: "STANDARD_TWO_STATEMENT",
        },
      ],
      prompt:
        "ਫੈਸਲਾ ਕਰੋ ਕਿ ਕੋਈ ਇੱਕ ਕਥਨ ਕਾਫ਼ੀ ਹੈ ਜਾਂ ਦੋਵੇਂ ਇਕੱਠੇ ਲੋੜੀਂਦੇ ਹਨ।",
    },
    explanation: {
      opening:
        "ਪਹਿਲਾਂ ਦੋਵੇਂ ਕਥਨਾਂ ਨੂੰ ਵੱਖ-ਵੱਖ ਜਾਂਚੋ, ਫਿਰ ਲੋੜ ਪੈਣ 'ਤੇ ਇਕੱਠੇ ਵਰਤੋ।",
      concept:
        "ਕਥਨ I ਲਾਗਤ ਮੁੱਲ ਅਤੇ ਟੀਚੇ ਵਾਲੇ ਨਤੀਜੇ ਤੋਂ ਲੋੜੀਂਦਾ ਵਿਕਰੀ ਮੁੱਲ ਦਿੰਦਾ ਹੈ, ਪਰ ਛੂਟ ਲਈ ਅੰਕਿਤ ਮੁੱਲ ਵੀ ਚਾਹੀਦਾ ਹੈ। ਕਥਨ II ਸਿਰਫ਼ ਅੰਕਿਤ ਮੁੱਲ ਦਿੰਦਾ ਹੈ। ਦੋਵੇਂ ਮਿਲ ਕੇ ਛੂਟ ਨੂੰ ਇਕੋ ਤਰੀਕੇ ਨਾਲ ਨਿਰਧਾਰਤ ਕਰਦੇ ਹਨ।",
      steps: [
        {
          title: "ਕੇਵਲ ਕਥਨ I ਜਾਂਚੋ",
          body: "ਟੀਚੇ ਵਾਲਾ ਵਿਕਰੀ ਮੁੱਲ ਨਿਕਲ ਜਾਂਦਾ ਹੈ, ਪਰ ਅੰਕਿਤ ਮੁੱਲ ਤੋਂ ਬਿਨਾਂ ਛੂਟ ਨਹੀਂ ਨਿਕਲਦੀ।",
        },
        {
          title: "ਕੇਵਲ ਕਥਨ II ਜਾਂਚੋ",
          body: "ਅੰਕਿਤ ਮੁੱਲ ਮਿਲ ਜਾਂਦਾ ਹੈ, ਪਰ ਟੀਚੇ ਵਾਲਾ ਵਿਕਰੀ ਮੁੱਲ ਪਤਾ ਨਹੀਂ ਹੁੰਦਾ।",
        },
        {
          title: "ਦੋਵੇਂ ਕਥਨ ਮਿਲਾਓ",
          body: "ਕਥਨ I ਤੋਂ ਟੀਚੇ ਵਾਲਾ ਵਿਕਰੀ ਮੁੱਲ ਕੱਢ ਕੇ ਉਸ ਦੀ ਕਥਨ II ਦੇ ਅੰਕਿਤ ਮੁੱਲ ਨਾਲ ਤੁਲਨਾ ਕਰੋ।",
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
      "ਦੋਵੇਂ ਕਥਨਾਂ ਦੀ ਵੱਖਰੀ ਪਰਯਾਪਤਾ ਜਾਂਚਣ ਤੋਂ ਬਾਅਦ ਹੀ ਜੁੜੇ ਮੁੱਲ-ਆਧਾਰ ਮਿਲਦੇ ਹਨ।",
  },
};
for (const [language, entry] of Object.entries(editorialEntries)) {
  const file = path.join(cp, `editorial-content.${language}.json`);
  const library = readJson(file);
  library.entries["PNL-QL-070"] = entry;
  writeJson(file, library);
}

replaceOnce(
  path.join(foundation, "editorial-v2-legacy-builder.ts"),
  '{ type: "paragraph", content: `A product costs ₹{costPrice}, is marked at ₹{markedPrice}, and must earn a target profit of {targetRatePercent}%.` },',
  '{ type: "paragraph", content: "The discount needed to achieve a stated target result is to be determined." },',
);

const normalizerPath = path.join(
  foundation,
  "editorial-v2-multilingual-normalizer.ts",
);
replaceOnce(
  normalizerPath,
  `  "PNL-QL-070": {\n    hi: "वस्तु का क्रय मूल्य ₹{costPrice}, अंकित मूल्य ₹{markedPrice} और लक्षित लाभ दर {targetRatePercent}% है।",\n    pa: "ਵਸਤੂ ਦਾ ਲਾਗਤ ਮੁੱਲ ₹{costPrice}, ਅੰਕਿਤ ਮੁੱਲ ₹{markedPrice} ਅਤੇ ਟੀਚਾ ਲਾਭ ਦਰ {targetRatePercent}% ਹੈ।",\n  },\n`,
  "",
);
replaceOnce(
  normalizerPath,
  '  if (qlId === "PNL-QL-087") {',
  `  if (qlId === "PNL-QL-070") {\n    return [\n      {\n        type: "paragraph",\n        content:\n          language === "hi"\n            ? "लक्षित परिणाम के लिए आवश्यक छूट ज्ञात करनी है।"\n            : "ਟੀਚੇ ਵਾਲੇ ਨਤੀਜੇ ਲਈ ਲੋੜੀਂਦੀ ਛੂਟ ਪਤਾ ਕਰਨੀ ਹੈ।",\n      },\n      {\n        type: "data_sufficiency",\n        question:\n          language === "hi"\n            ? "क्या आवश्यक छूट को निश्चित रूप से ज्ञात किया जा सकता है?"\n            : "ਕੀ ਲੋੜੀਂਦੀ ਛੂਟ ਨੂੰ ਪੱਕੇ ਤੌਰ 'ਤੇ ਕੱਢਿਆ ਜਾ ਸਕਦਾ ਹੈ?",\n        statements: ["{statementOne}", "{statementTwo}"],\n        answerScheme: "STANDARD_TWO_STATEMENT",\n      },\n    ];\n  }\n\n  if (qlId === "PNL-QL-087") {`,
);

const dynamicPath = path.join(cp, "cp002-dynamic-runtime.ts");
replaceOnce(
  dynamicPath,
  'statementOne: `The target selling price is ${formatMoney(targetSellingPrice)}.`,\n                statementTwo: `The required reduction from marked price is ${formatMoney(discountAmount)}.`,',
  'statementOne: `The cost price is ${formatMoney(costPrice)}, and the target result is ${formatRational(targetRatePercent)}% ${scenario.direction.toLowerCase()}.`,\n                statementTwo: `The marked price is ${formatMoney(scenarioMarkedPrice)}.`,',
);
replaceOnce(
  dynamicPath,
  'return { kind: "TEXT", value: "Either statement alone is sufficient" };',
  'return { kind: "TEXT", value: "Both statements together are required" };',
);

const dynamicTestPath = path.join(cp, "cp002-dynamic-runtime.test.ts");
replaceOnce(
  dynamicTestPath,
  'for (const difficulty of ["Easy", "Medium", "Hard"] as const) {',
  `const ql070 = runPnlCp002DynamicPipeline({\n  questionLanguageId: "PNL-QL-070",\n  language: "en",\n  seed: "pnl-ql070-data-sufficiency-regression",\n});\nconst ql070Marker = ql070.stem.match(/Statement\\s+(?:I|1)\\b/i);\nassert.ok(ql070Marker?.index, "QL-070 must separate Statement I from the lead.");\nconst ql070Lead = ql070.stem.slice(0, ql070Marker.index);\nassert.doesNotMatch(\n  ql070Lead,\n  /₹\\s*[\\d,]+|\\b\\d+(?:\\.\\d+)?%/,\n  "QL-070 lead must not reveal cost, marked price, or target rate.",\n);\nassert.match(ql070.stem, /Statement\\s+(?:I|1)[\\s\\S]*cost price/i);\nassert.match(ql070.stem, /Statement\\s+(?:II|2)[\\s\\S]*marked price/i);\nassert.equal(ql070.answer, "Both statements together are required");\n\nfor (const difficulty of ["Easy", "Medium", "Hard"] as const) {`,
);

const integrationTestPath = path.join(root, "question-studio-integration.test.ts");
replaceOnce(
  integrationTestPath,
  "const ql092 = await generateQuestion({",
  `const ql070Canonical = await generateQuestion({\n  packageId: "PNL-001",\n  canonicalProblemId: "PNL-CP-002",\n  questionLanguageId: "PNL-QL-070",\n  seed: "pnl-ql070-canonical-regression",\n});\nconst ql070CanonicalPackage = ql070Canonical.questionPackages[0]!;\nconst ql070CanonicalMarker = ql070CanonicalPackage.stem.match(\n  /Statement\\s+(?:I|1)\\b/i,\n);\nassert.ok(\n  ql070CanonicalMarker?.index,\n  "Canonical QL-070 must separate Statement I from the lead.",\n);\nassert.doesNotMatch(\n  ql070CanonicalPackage.stem.slice(0, ql070CanonicalMarker.index),\n  /₹\\s*[\\d,]+|\\b\\d+(?:\\.\\d+)?%/,\n  "Canonical QL-070 lead must be insufficient by itself.",\n);\nassert.equal(\n  ql070CanonicalPackage.answer,\n  "Both statements together are required",\n);\nassert.equal(\n  ql070CanonicalPackage.options[ql070CanonicalPackage.correctIndex],\n  ql070CanonicalPackage.answer,\n);\n\nconst ql092 = await generateQuestion({`,
);

const auditPath = path.join(root, "pnl-001-english-editorial-audit.ts");
replaceOnce(
  auditPath,
  `const editorialFindings: Finding[] = [\n  {\n    code: "KNOWN-DS-LEAD-LEAKAGE",\n    severity: "BLOCKER",\n    scope: "PNL-QL-070",\n    message:\n      "Known issue #262: the data-sufficiency lead currently supplies enough commercial values before the statements. The lead alone must become insufficient.",\n  },\n];`,
  "const editorialFindings: Finding[] = [];",
);
replaceOnce(
  auditPath,
  `  const prose = proseWithoutMath(visible);\n\n  if (!pkg.validation.valid) {`,
  `  const prose = proseWithoutMath(visible);\n\n  if (qlId === "PNL-QL-070") {\n    const statementMarker = pkg.stem.match(/Statement\\s+(?:I|1)\\b/i);\n    const lead =\n      statementMarker?.index === undefined\n        ? pkg.stem\n        : pkg.stem.slice(0, statementMarker.index);\n    if (\n      statementMarker?.index === undefined ||\n      /₹\\s*[\\d,]+|\\b\\d+(?:\\.\\d+)?%/.test(lead)\n    ) {\n      editorialFindings.push({\n        code: "DS-LEAD-LEAKAGE",\n        severity: "BLOCKER",\n        scope,\n        message:\n          "The data-sufficiency lead must remain insufficient until the statements are evaluated.",\n      });\n    }\n  }\n\n  if (!pkg.validation.valid) {`,
);

const chunkPaths = Array.from({ length: 7 }, (_, index) =>
  path.join(root, `question-studio-review.library.chunk-${index}.ts`),
);
const encoded = chunkPaths
  .map((chunkPath) => {
    const source = read(chunkPath);
    const match = source.match(/^export default ("[\s\S]*");\s*$/);
    if (!match) throw new Error(`Invalid canonical chunk: ${chunkPath}`);
    return JSON.parse(match[1]);
  })
  .join("");
const canonicalLibrary = JSON.parse(
  brotliDecompressSync(Buffer.from(encoded, "base64")).toString("utf8"),
);
const canonical = canonicalLibrary.entries["PNL-QL-070"];
if (!canonical) throw new Error("PNL-QL-070 canonical review entry is missing.");
canonical.stem = [
  "The discount needed to achieve a stated target result is to be determined.",
  "",
  "**Statement I:** The cost price is ₹4,000, and the target result is a profit of 20%.",
  "",
  "**Statement II:** The marked price is ₹6,000.",
  "",
  "Decide whether either statement alone or both together are sufficient.",
].join("\n");
canonical.options = [
  "Statement 1 alone is sufficient",
  "Statement 2 alone is sufficient",
  "Either statement alone is sufficient",
  "Both statements together are required",
];
canonical.correctIndex = 3;
canonical.answer = "Both statements together are required";
canonical.explanation = [
  "Check the two statements independently.",
  "",
  "Statement I gives a cost price of ₹4,000 and a target profit of 20%, so the target selling price is ₹4,800. Marked price is still unknown, so the discount cannot be found.",
  "",
  "Statement II gives a marked price of ₹6,000, but it does not give the target selling price. It is also insufficient alone.",
  "",
  "Together, the required discount is (₹6,000 − ₹4,800) ÷ ₹6,000 × 100 = 20%.",
  "",
  "**Final answer:** Both statements together are required.",
].join("\n");
const compressed = brotliCompressSync(
  Buffer.from(JSON.stringify(canonicalLibrary)),
  {
    params: {
      [constants.BROTLI_PARAM_QUALITY]: 11,
      [constants.BROTLI_PARAM_MODE]: constants.BROTLI_MODE_TEXT,
    },
  },
).toString("base64");
const chunkSize = Math.ceil(compressed.length / chunkPaths.length);
chunkPaths.forEach((chunkPath, index) => {
  const value = compressed.slice(index * chunkSize, (index + 1) * chunkSize);
  write(chunkPath, `export default ${JSON.stringify(value)};\n`);
});

write(
  path.join(root, "PNL-001-QL070-DATA-SUFFICIENCY-FIX.md"),
  `# PNL-001 QL-070 Data-Sufficiency Correction\n\n## Corrected contract\n\n- The lead states only the decision target and contains no cost price, marked price or target rate.\n- Statement I supplies cost price and the target profit/loss condition.\n- Statement II supplies marked price.\n- Neither statement alone is sufficient; both together determine the discount.\n\n## Updated surfaces\n\nEnglish, Hindi and Punjabi Editorial V2 sources, legacy and multilingual builders, CP-002 dynamic generation, canonical review data, Question Studio integration, editorial audit and permanent regressions.\n\n## Safety boundary\n\nRuntime publication status remains unchanged: dynamic candidates are unreviewed, not stored, test-ineligible and non-public; canonical review remains review-only.\n`,
);

console.log(
  JSON.stringify(
    {
      status: "PATCHED",
      qlId: "PNL-QL-070",
      answer: "Both statements together are required",
      languages: ["en", "hi", "pa"],
    },
    null,
    2,
  ),
);
