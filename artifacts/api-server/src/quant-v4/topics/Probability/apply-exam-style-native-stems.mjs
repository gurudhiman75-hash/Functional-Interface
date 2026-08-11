import fs from "node:fs";

const root = "artifacts/api-server/src/quant-v4/topics/Probability";

function replaceOnce(value, from, to, label) {
  if (value.includes(to)) return value;
  if (!value.includes(from)) throw new Error(`Could not apply ${label}.`);
  return value.replace(from, to);
}

// Keep the familiar exam word 'bag' as बैग in Hindi rather than पात्र/थैला.
{
  const path = `${root}/shared/native-student-facing-renderer.ts`;
  let value = fs.readFileSync(path, "utf8");
  value = value.replace('language === "hi" ? "bag" : "ਬੈਗ"', 'language === "hi" ? "बैग" : "ਬੈਗ"');
  value = value.replaceAll("Section A", "सेक्शन A").replaceAll("Section B", "सेक्शन B");
  value = value.replaceAll("Sections", "सेक्शन");
  value = value.replaceAll("सेक्शन A ਅਤੇ सेक्शन B", "ਸੈਕਸ਼ਨ A ਅਤੇ ਸੈਕਸ਼ਨ B");
  value = value.replaceAll("ਦੋਵੇਂ सेक्शन", "ਦੋਵੇਂ ਸੈਕਸ਼ਨ");

  value = replaceOnce(
    value,
    '  const normalized = value.trim().toLowerCase();\n  const hi: Record<string, string> = {',
    `  const normalized = value.trim().toLowerCase();\n  const greater = normalized.match(/^an integer greater than (\\d+)$/u);\n  const less = normalized.match(/^an integer less than (\\d+)$/u);\n  const notExceeding = normalized.match(/^an integer not exceeding (\\d+)$/u);\n  const divisible = normalized.match(/^an integer divisible by (\\d+)$/u);\n  if (greater) return language === "hi" ? \\`\\${greater[1]} से बड़ा पूर्णांक\\` : \\`\\${greater[1]} ਤੋਂ ਵੱਡਾ ਪੂਰਨ ਅੰਕ\\`;\n  if (less) return language === "hi" ? \\`\\${less[1]} से छोटा पूर्णांक\\` : \\`\\${less[1]} ਤੋਂ ਛੋਟਾ ਪੂਰਨ ਅੰਕ\\`;\n  if (notExceeding) return language === "hi" ? \\`\\${notExceeding[1]} से अधिक न होने वाला पूर्णांक\\` : \\`\\${notExceeding[1]} ਤੋਂ ਵੱਧ ਨਾ ਹੋਣ ਵਾਲਾ ਪੂਰਨ ਅੰਕ\\`;\n  if (divisible) return language === "hi" ? \\`\\${divisible[1]} से विभाज्य पूर्णांक\\` : \\`\\${divisible[1]} ਨਾਲ ਭਾਗਯੋਗ ਪੂਰਨ ਅੰਕ\\`;\n  if (/^an? even integer$/u.test(normalized)) return language === "hi" ? "सम पूर्णांक" : "ਜੋੜੀ ਪੂਰਨ ਅੰਕ";\n  if (/^an? odd integer$/u.test(normalized)) return language === "hi" ? "विषम पूर्णांक" : "ਬੇਜੋੜ ਪੂਰਨ ਅੰਕ";\n  if (/^an? prime integer$/u.test(normalized)) return language === "hi" ? "अभाज्य पूर्णांक" : "ਅਭਾਜ ਪੂਰਨ ਅੰਕ";\n  if (/^an? composite integer$/u.test(normalized)) return language === "hi" ? "संयोज्य पूर्णांक" : "ਸੰਯੁਕਤ ਪੂਰਨ ਅੰਕ";\n  const hi: Record<string, string> = {`,
    "dynamic event-label localization",
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

// Make the shared terminology and visual review surface use बैग, not थैला/पात्र.
{
  const path = `${root}/native-language-primitives.ts`;
  let value = fs.readFileSync(path, "utf8");
  value = value.replace('BAG: pair("थैला", "ਥੈਲਾ")', 'BAG: pair("बैग", "ਬੈਗ")');
  fs.writeFileSync(path, value);
}

{
  const path = `${root}/multilingual-runtime.ts`;
  let value = fs.readFileSync(path, "utf8");

  value = replaceOnce(
    value,
    'import { renderProbabilityMathText } from "./shared/math-text";',
    'import { renderProbabilityMathText } from "./shared/math-text";\nimport { renderNativeStudentFacingStem } from "./shared/native-student-facing-renderer";',
    "native renderer import",
  );

  const start = value.indexOf("function renderNativeStem(");
  const end = value.indexOf("function localizedEquation", start);
  if (start < 0 || end < 0) throw new Error("Could not find renderNativeStem block.");
  const replacement = `function renderNativeStem(\n  source: ProbabilityQuestion,\n  language: ProbabilityNativeLanguage,\n): string {\n  const stem = renderProbabilityMathText(renderNativeStudentFacingStem(source, language));\n  assertProbabilityNativeTextValid(stem, language);\n  return stem;\n}\n\n`;
  value = value.slice(0, start) + replacement + value.slice(end);
  value = value.replace('const { editorial, localizeBinding } = resolveNativeEditorial(source, language);', 'const { editorial } = resolveNativeEditorial(source, language);');
  value = value.replace('const stem = renderNativeStem(source, language, editorial, localizeBinding);', 'const stem = renderNativeStem(source, language);');
  value = value.replace('title = language === "hi" ? "थैले में गेंदों की संरचना" : "ਥੈਲੇ ਵਿੱਚ ਗੇਂਦਾਂ ਦੀ ਬਣਤਰ";', 'title = language === "hi" ? "बैग में गेंदों की संरचना" : "ਬੈਗ ਵਿੱਚ ਗੇਂਦਾਂ ਦੀ ਬਣਤਰ";');

  fs.writeFileSync(path, value);
}

console.log("Applied scenario-aware, exam-style Hindi/Punjabi Probability stem renderer.");
