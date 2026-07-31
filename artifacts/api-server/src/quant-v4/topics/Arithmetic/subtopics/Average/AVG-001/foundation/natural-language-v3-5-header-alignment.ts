import {
  applyAvg001NaturalLanguageV35Review,
  AVG_001_NATURAL_LANGUAGE_V3_5_REVIEW,
} from "./natural-language-v3-5-review";
import type { Avg001Language, Avg001QuestionPackage, Avg001ValidationCheck } from "./types";

export const AVG_001_NATURAL_LANGUAGE_V3_5_HEADER_ALIGNMENT =
  "AVG-001 natural teacher-language manual-review candidate v3.5 header-aligned";

const HEADER_POLICY = {
  en: [
    "📌 Key rule:",
    "📝 Step-by-step solution:",
    "⚡ Exam speed shortcut:",
    "⚠️ Why the other options are wrong:",
  ],
  hi: [
    "📌 मुख्य बात:",
    "📝 हल:",
    "⚡ तेज़ तरीका:",
    "⚠️ दूसरे विकल्प क्यों गलत हैं:",
  ],
  pa: [
    "📌 ਮੁੱਖ ਗੱਲ:",
    "📝 ਹੱਲ:",
    "⚡ ਤੇਜ਼ ਤਰੀਕਾ:",
    "⚠️ ਬਾਕੀ ਵਿਕਲਪ ਕਿਉਂ ਗਲਤ ਹਨ:",
  ],
} as const;

const BARE_LABELS = {
  en: ["Key rule:", "Step-by-step solution:", "Exam speed shortcut:", "Why the other options are wrong:"],
  hi: ["मुख्य बात:", "हल:", "तेज़ तरीका:", "दूसरे विकल्प क्यों गलत हैं:"],
  pa: ["ਮੁੱਖ ਗੱਲ:", "ਹੱਲ:", "ਤੇਜ਼ ਤਰੀਕਾ:", "ਬਾਕੀ ਵਿਕਲਪ ਕਿਉਂ ਗਲਤ ਹਨ:"],
} as const;

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function alignLine(line: string, index: number, language: Avg001Language) {
  const label = BARE_LABELS[language][index]!;
  const prefix = HEADER_POLICY[language][index]!;
  const withoutFullPrefix = line.replace(prefix, "").trim();
  const withoutLeadingEmoji = withoutFullPrefix.replace(/^[📌📝⚡⚠️]\uFE0F?\s*/u, "");
  const body = withoutLeadingEmoji.replace(new RegExp(`^${escapeRegex(label)}\\s*`), "").trim();
  return `${prefix} ${body}`.trim();
}

function headersMatchPolicy(pkg: Avg001QuestionPackage) {
  const expected = HEADER_POLICY[pkg.language];
  return expected.every((prefix, index) => pkg.explanation.lines[index]?.startsWith(prefix));
}

function refreshValidation(pkg: Avg001QuestionPackage) {
  const checks: Avg001ValidationCheck[] = pkg.validation.checks.filter(
    (check) => check.name !== "avg001-natural-language-v3-5-header-alignment",
  );
  checks.push({
    name: "avg001-natural-language-v3-5-header-alignment",
    passed: pkg.explanation.lines.length === 4 && headersMatchPolicy(pkg),
    message:
      "V3.5 starts every explanation section with the same four visual badges and localized labels in English, Hindi and Punjabi",
  });
  return { valid: checks.every((check) => check.passed), checks };
}

/**
 * Presentation-only alignment over the validated V3.5 learner package.
 * It may move or add the four section headers, but must not change the
 * question stem, options, answer, calculations, reasoning body or math.
 */
export function applyAvg001NaturalLanguageV35HeaderAlignment(
  source: Avg001QuestionPackage,
): Avg001QuestionPackage {
  const v35 = applyAvg001NaturalLanguageV35Review(source);
  const explanation = {
    lines: v35.explanation.lines.map((line, index) => alignLine(line, index, v35.language)),
  };
  const revised: Avg001QuestionPackage = {
    ...v35,
    explanation,
    traceability: {
      ...v35.traceability,
      naturalLanguageV35HeaderAlignment: AVG_001_NATURAL_LANGUAGE_V3_5_HEADER_ALIGNMENT,
      naturalLanguageV35BaseCandidate: AVG_001_NATURAL_LANGUAGE_V3_5_REVIEW,
      editorialStatus: "PENDING_PRODUCT_REVIEW",
      publiclyPublishable: false,
    },
  };
  return { ...revised, validation: refreshValidation(revised) };
}
