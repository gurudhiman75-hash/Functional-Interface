import fs from "node:fs";

const root = "artifacts/api-server/src/quant-v4/topics/Probability";

function replaceOnce(value, from, to, label) {
  if (value.includes(to)) return value;
  if (!value.includes(from)) throw new Error(`Could not apply ${label}.`);
  return value.replace(from, to);
}

// Keep the familiar exam word "bag" as बैग/ਬੈਗ instead of पात्र/थैला.
{
  const path = `${root}/shared/native-student-facing-renderer.ts`;
  let value = fs.readFileSync(path, "utf8");
  value = value.replace('language === "hi" ? "bag" : "ਬੈਗ"', 'language === "hi" ? "बैग" : "ਬੈਗ"');
  value = value.replaceAll("Section A", "सेक्शन A").replaceAll("Section B", "सेक्शन B");
  value = value.replaceAll("Sections", "सेक्शन");
  value = value.replaceAll("सेक्शन A ਅਤੇ सेक्शन B", "ਸੈਕਸ਼ਨ A ਅਤੇ ਸੈਕਸ਼ਨ B");
  value = value.replaceAll("ਦੋਵੇਂ सेक्शन", "ਦੋਵੇਂ ਸੈਕਸ਼ਨ");

  const eventInsert = [
    '  const normalized = value.trim().toLowerCase();',
    '  const greater = normalized.match(/^an integer greater than (\\d+)$/u);',
    '  const less = normalized.match(/^an integer less than (\\d+)$/u);',
    '  const notExceeding = normalized.match(/^an integer not exceeding (\\d+)$/u);',
    '  const divisible = normalized.match(/^an integer divisible by (\\d+)$/u);',
    '  if (greater) return language === "hi" ? `${greater[1]} से बड़ा पूर्णांक` : `${greater[1]} ਤੋਂ ਵੱਡਾ ਪੂਰਨ ਅੰਕ`;',
    '  if (less) return language === "hi" ? `${less[1]} से छोटा पूर्णांक` : `${less[1]} ਤੋਂ ਛੋਟਾ ਪੂਰਨ ਅੰਕ`;',
    '  if (notExceeding) return language === "hi" ? `${notExceeding[1]} से अधिक न होने वाला पूर्णांक` : `${notExceeding[1]} ਤੋਂ ਵੱਧ ਨਾ ਹੋਣ ਵਾਲਾ ਪੂਰਨ ਅੰਕ`;',
    '  if (divisible) return language === "hi" ? `${divisible[1]} से विभाज्य पूर्णांक` : `${divisible[1]} ਨਾਲ ਭਾਗਯੋਗ ਪੂਰਨ ਅੰਕ`;',
    '  if (/^an? even integer$/u.test(normalized)) return language === "hi" ? "सम पूर्णांक" : "ਜੋੜੀ ਪੂਰਨ ਅੰਕ";',
    '  if (/^an? odd integer$/u.test(normalized)) return language === "hi" ? "विषम पूर्णांक" : "ਬੇਜੋੜ ਪੂਰਨ ਅੰਕ";',
    '  if (/^an? prime integer$/u.test(normalized)) return language === "hi" ? "अभाज्य पूर्णांक" : "ਅਭਾਜ ਪੂਰਨ ਅੰਕ";',
    '  if (/^an? composite integer$/u.test(normalized)) return language === "hi" ? "संयोज्य पूर्णांक" : "ਸੰਯੁਕਤ ਪੂਰਨ ਅੰਕ";',
    '  const hi: Record<string, string> = {',
  ].join("\n");

  value = replaceOnce(
    value,
    '  const normalized = value.trim().toLowerCase();\n  const hi: Record<string, string> = {',
    eventInsert,
    "dynamic event-label localization",
  );

  value = value.replace(
    'case "findCoinPatternProbability": return `एक निष्पक्ष सिक्के को ${num(source, "tosses")} बार उछाला जाता है। क्रम ${text(source, "pattern")} प्राप्त होने की प्रायिकता क्या है?`;',
    'case "findCoinPatternProbability": { const pattern = [...text(source, "pattern")].map((token) => token === "H" ? "चित" : "पट").join("-"); return `एक निष्पक्ष सिक्के को ${num(source, "tosses")} बार उछाला जाता है। क्रम ${pattern} प्राप्त होने की प्रायिकता क्या है?`; }',
  );
  value = value.replace(
    'case "findCoinPatternProbability": return `ਇੱਕ ਨਿਰਪੱਖ ਸਿੱਕੇ ਨੂੰ ${num(source, "tosses")} ਵਾਰ ਉਛਾਲਿਆ ਜਾਂਦਾ ਹੈ। ਕ੍ਰਮ ${text(source, "pattern")} ਪ੍ਰਾਪਤ ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?`;',
    'case "findCoinPatternProbability": { const pattern = [...text(source, "pattern")].map((token) => token === "H" ? "ਚਿੱਤ" : "ਪੱਟ").join("-"); return `ਇੱਕ ਨਿਰਪੱਖ ਸਿੱਕੇ ਨੂੰ ${num(source, "tosses")} ਵਾਰ ਉਛਾਲਿਆ ਜਾਂਦਾ ਹੈ। ਕ੍ਰਮ ${pattern} ਪ੍ਰਾਪਤ ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ?`; }',
  );

  value = value.replace(
    'case "findReverseConditionalCount": return `${num(source, "restrictedTotal")} शॉर्टलिस्ट किए गए अभ्यर्थियों में से यादृच्छिक रूप से चुने गए अभ्यर्थी के ${text(source, "targetLabel", "certified")} होने की प्रायिकता ${frac(num(source, "favourable"), num(source, "restrictedTotal", 1))} है। ऐसे कितने अभ्यर्थी हैं?`;',
    'case "findReverseConditionalCount": { const status = text(source, "targetLabel", "certified") === "certified" ? "प्रमाणित" : "शॉर्टलिस्ट"; return `${num(source, "restrictedTotal")} शॉर्टलिस्ट किए गए अभ्यर्थियों में से यादृच्छिक रूप से चुने गए अभ्यर्थी के ${status} होने की प्रायिकता ${frac(num(source, "favourable"), num(source, "restrictedTotal", 1))} है। ऐसे कितने अभ्यर्थी हैं?`; }',
  );
  value = value.replace(
    'case "findReverseConditionalCount": return `${num(source, "restrictedTotal")} ਸ਼ਾਰਟਲਿਸਟ ਕੀਤੇ ਉਮੀਦਵਾਰਾਂ ਵਿੱਚੋਂ ਬੇਤਰਤੀਬੀ ਨਾਲ ਚੁਣੇ ਉਮੀਦਵਾਰ ਦੇ ${text(source, "targetLabel", "certified")} ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ ${frac(num(source, "favourable"), num(source, "restrictedTotal", 1))} ਹੈ। ਅਜਿਹੇ ਕਿੰਨੇ ਉਮੀਦਵਾਰ ਹਨ?`;',
    'case "findReverseConditionalCount": { const status = text(source, "targetLabel", "certified") === "certified" ? "ਪ੍ਰਮਾਣਿਤ" : "ਸ਼ਾਰਟਲਿਸਟ"; return `${num(source, "restrictedTotal")} ਸ਼ਾਰਟਲਿਸਟ ਕੀਤੇ ਉਮੀਦਵਾਰਾਂ ਵਿੱਚੋਂ ਬੇਤਰਤੀਬੀ ਨਾਲ ਚੁਣੇ ਉਮੀਦਵਾਰ ਦੇ ${status} ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ ${frac(num(source, "favourable"), num(source, "restrictedTotal", 1))} ਹੈ। ਅਜਿਹੇ ਕਿੰਨੇ ਉਮੀਦਵਾਰ ਹਨ?`; }',
  );
  fs.writeFileSync(path, value);
}

{
  const path = `${root}/native-language-primitives.ts`;
  let value = fs.readFileSync(path, "utf8");
  value = value.replace('BAG: pair("थैला", "ਥੈਲਾ")', 'BAG: pair("बैग", "ਬੈਗ")');
  fs.writeFileSync(path, value);
}

// Normalize the editable explanation renderer before TypeScript compilation.
// Keep exactly one shared conditional-mode predicate if an interrupted edit duplicated it.
{
  const path = `${root}/shared/native-final-explanation-renderer.ts`;
  let value = fs.readFileSync(path, "utf8");
  const block = `function isConditionalMode(source: ProbabilityQuestion): boolean {\n  return [\n    "findConditionalProbabilityByCounting",\n    "findConditionalCardProbability",\n    "findConditionalNumberProbability",\n    "findConditionalUrnProbability",\n    "findReverseConditionalCount",\n    "findConditionalFromTwoWayTable",\n  ].includes(source.solveMode);\n}\n\n`;
  const first = value.indexOf(block);
  if (first >= 0) {
    const second = value.indexOf(block, first + block.length);
    if (second >= 0) value = value.slice(0, second) + value.slice(second + block.length);
  }
  fs.writeFileSync(path, value);
}

{
  const path = `${root}/multilingual-runtime.ts`;
  let value = fs.readFileSync(path, "utf8");

  value = replaceOnce(
    value,
    'import { renderProbabilityMathText } from "./shared/math-text";',
    'import { renderProbabilityMathText } from "./shared/math-text";\nimport { polishNativeExplanationLines, polishNativeVisual } from "./shared/native-final-explanation-renderer";',
    "native explanation renderer import",
  );
  value = replaceOnce(
    value,
    'import { renderProbabilityMathText } from "./shared/math-text";',
    'import { renderProbabilityMathText } from "./shared/math-text";\nimport { renderNativeStudentFacingStem } from "./shared/native-student-facing-renderer";',
    "native stem renderer import",
  );
  value = value.replace(
    'from "./shared/native-student-facing-renderer";',
    'from "./shared/native-exam-style-bridge";',
  );

  const start = value.indexOf("function renderNativeStem(");
  const end = value.indexOf("function localizedEquation", start);
  if (start < 0 || end < 0) throw new Error("Could not find renderNativeStem block.");
  const replacement = `function renderNativeStem(\n  source: ProbabilityQuestion,\n  language: ProbabilityNativeLanguage,\n): string {\n  const stem = renderProbabilityMathText(renderNativeStudentFacingStem(source, language));\n  assertProbabilityNativeTextValid(stem, language);\n  return stem;\n}\n\n`;
  value = value.slice(0, start) + replacement + value.slice(end);
  value = value.replace('const { editorial, localizeBinding } = resolveNativeEditorial(source, language);', 'const { editorial } = resolveNativeEditorial(source, language);');
  value = value.replace('const stem = renderNativeStem(source, language, editorial, localizeBinding);', 'const stem = renderNativeStem(source, language);');
  value = value.replace('title = language === "hi" ? "थैले में गेंदों की संरचना" : "ਥੈਲੇ ਵਿੱਚ ਗੇਂਦਾਂ ਦੀ ਬਣਤਰ";', 'title = language === "hi" ? "बैग में गेंदों की संरचना" : "ਬੈਗ ਵਿੱਚ ਗੇਂਦਾਂ ਦੀ ਬਣਤਰ";');

  value = replaceOnce(
    value,
    '  const lines = [',
    '  const lines = polishNativeExplanationLines(source, language, [',
    "native explanation line polishing",
  );
  value = replaceOnce(
    value,
    '  ].map(renderProbabilityMathText);\n\n  for (const line of lines)',
    '  ].map(renderProbabilityMathText));\n\n  for (const line of lines)',
    "native explanation line polishing close",
  );
  value = replaceOnce(
    value,
    '  const visuals = source.explanation.visuals.map((visual) =>\n    localizeNativeVisual(visual, source, language, editorial.eventWording));',
    '  const visuals = source.explanation.visuals.map((visual) =>\n    polishNativeVisual(source, language, localizeNativeVisual(visual, source, language, editorial.eventWording)));',
    "native visual context polishing",
  );

  fs.writeFileSync(path, value);
}

console.log("Applied context-preserving, exam-style Hindi/Punjabi Probability stems, explanations and visuals.");
