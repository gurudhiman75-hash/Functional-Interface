import type { CanonicalConclusion, SylLocale } from "../foundation/types";
import { analyzeScenario } from "./analysis";
import {
  generateBankingPossibilityEditorialQuestionV6,
  type BankingPossibilityEditorialQuestionV6,
} from "./banking-possibility-editorial-v6";
import { scenariosForGroup } from "./scenarios";
import { assignTerms } from "./term-assignment";

export type BankingPossibilityEditorialQuestionV7 = BankingPossibilityEditorialQuestionV6;

function premiseLead(locale: SylLocale, count: number): string {
  const numbers = Array.from({ length: count }, (_, index) => String(index + 1));
  if (locale === "hi-IN") return count === 1 ? "कथन 1 को पढ़ें" : `कथन ${numbers.join(" और ")} को साथ पढ़ें`;
  if (locale === "pa-IN") return count === 1 ? "ਕਥਨ 1 ਨੂੰ ਪੜ੍ਹੋ" : `ਕਥਨ ${numbers.join(" ਅਤੇ ")} ਨੂੰ ਇਕੱਠੇ ਪੜ੍ਹੋ`;
  return count === 1 ? "Read Statement 1" : `Read Statements ${numbers.join(" and ")} together`;
}

function safeContradictedAll(
  locale: SylLocale,
  conclusionLabel: "I" | "II",
  subject: string,
  predicate: string,
  statementCount: number,
): string {
  const lead = premiseLead(locale, statementCount);
  if (locale === "hi-IN") {
    return `${conclusionLabel}: ${lead}। कथनों का पालन करते हुए “${subject}” वर्ग को पूरी तरह “${predicate}” वर्ग के अंदर नहीं रखा जा सकता। इसलिए “सभी ${subject} ${predicate} हैं” कथनों के अनुरूप निश्चित निष्कर्ष नहीं है और निष्कर्ष ${conclusionLabel} अनुसरण नहीं करता।`;
  }
  if (locale === "pa-IN") {
    return `${conclusionLabel}: ${lead}। ਕਥਨਾਂ ਦੀ ਪਾਲਣਾ ਕਰਦੇ ਹੋਏ “${subject}” ਵਰਗ ਨੂੰ ਪੂਰੀ ਤਰ੍ਹਾਂ “${predicate}” ਵਰਗ ਦੇ ਅੰਦਰ ਨਹੀਂ ਰੱਖਿਆ ਜਾ ਸਕਦਾ। ਇਸ ਲਈ “ਸਾਰੇ ${subject} ${predicate} ਹਨ” ਕਥਨਾਂ ਅਨੁਸਾਰ ਪੱਕਾ ਨਤੀਜਾ ਨਹੀਂ ਹੈ ਅਤੇ ਨਤੀਜਾ ${conclusionLabel} ਸਹੀ ਨਹੀਂ ਹੈ।`;
  }
  return `${conclusionLabel}: ${lead}. The whole “${subject}” class cannot be placed inside the “${predicate}” class without violating the statements. Therefore “all ${subject} are ${predicate}” is not a valid definite conclusion and Conclusion ${conclusionLabel} does not follow.`;
}

function safeUndeterminedUniversal(
  locale: SylLocale,
  conclusionLabel: "I" | "II",
  conclusion: CanonicalConclusion,
  subject: string,
  predicate: string,
  statementCount: number,
): string {
  const lead = premiseLead(locale, statementCount);
  if (locale === "hi-IN") {
    if (conclusion.form === "ALL") {
      return `${conclusionLabel}: ${lead}। कथन “${subject}” वर्ग को “${predicate}” वर्ग के अंदर रखना अनिवार्य नहीं करते। एक वैध व्यवस्था में पूरा “${subject}” वर्ग अंदर हो सकता है और दूसरी में उसका कुछ भाग बाहर हो सकता है; इसलिए निष्कर्ष ${conclusionLabel} निश्चित रूप से अनुसरण नहीं करता।`;
    }
    return `${conclusionLabel}: ${lead}। कथन “${subject}” और “${predicate}” वर्गों को पूरी तरह अलग रखना अनिवार्य नहीं करते। वे एक वैध व्यवस्था में अलग और दूसरी में ओवरलैप कर सकते हैं; इसलिए निष्कर्ष ${conclusionLabel} निश्चित रूप से अनुसरण नहीं करता।`;
  }
  if (locale === "pa-IN") {
    if (conclusion.form === "ALL") {
      return `${conclusionLabel}: ${lead}। ਕਥਨ “${subject}” ਵਰਗ ਨੂੰ “${predicate}” ਵਰਗ ਦੇ ਅੰਦਰ ਰੱਖਣਾ ਲਾਜ਼ਮੀ ਨਹੀਂ ਕਰਦੇ। ਇੱਕ ਵੈਧ ਬਣਤਰ ਵਿੱਚ ਪੂਰਾ “${subject}” ਵਰਗ ਅੰਦਰ ਹੋ ਸਕਦਾ ਹੈ ਅਤੇ ਦੂਜੀ ਵਿੱਚ ਉਸ ਦਾ ਕੁਝ ਹਿੱਸਾ ਬਾਹਰ ਹੋ ਸਕਦਾ ਹੈ; ਇਸ ਲਈ ਨਤੀਜਾ ${conclusionLabel} ਪੱਕੇ ਤੌਰ ਤੇ ਸਹੀ ਨਹੀਂ ਹੈ।`;
    }
    return `${conclusionLabel}: ${lead}। ਕਥਨ “${subject}” ਅਤੇ “${predicate}” ਵਰਗਾਂ ਨੂੰ ਪੂਰੀ ਤਰ੍ਹਾਂ ਵੱਖ ਰੱਖਣਾ ਲਾਜ਼ਮੀ ਨਹੀਂ ਕਰਦੇ। ਇੱਕ ਵੈਧ ਬਣਤਰ ਵਿੱਚ ਉਹ ਵੱਖ ਅਤੇ ਦੂਜੀ ਵਿੱਚ ਓਵਰਲੈਪ ਕਰ ਸਕਦੇ ਹਨ; ਇਸ ਲਈ ਨਤੀਜਾ ${conclusionLabel} ਪੱਕੇ ਤੌਰ ਤੇ ਸਹੀ ਨਹੀਂ ਹੈ।`;
  }
  if (conclusion.form === "ALL") {
    return `${conclusionLabel}: ${lead}. The statements do not force the whole “${subject}” class inside the “${predicate}” class. One valid arrangement can show full containment and another can leave part of “${subject}” outside “${predicate}”, so Conclusion ${conclusionLabel} is not definite and does not follow.`;
  }
  return `${conclusionLabel}: ${lead}. The statements do not force the “${subject}” and “${predicate}” classes to be disjoint. One valid arrangement can separate them and another can let them overlap, so Conclusion ${conclusionLabel} is not definite and does not follow.`;
}

function cleanLine(line: string, locale: SylLocale): string {
  if (locale !== "en-IN") return line;
  return line
    .replace(". the part of the ", ". The part of the ")
    .replace(". the shared region of the ", ". The shared region of the ")
    .replace(/an “([^”]+)” × cannot lie outside “([^”]+)”/gu, "a witness for the “$1” class cannot lie outside the “$2” class");
}

export function generateBankingPossibilityEditorialQuestionV7(
  seed: number,
  locale: SylLocale,
): BankingPossibilityEditorialQuestionV7 {
  const question = generateBankingPossibilityEditorialQuestionV6(seed, locale);
  const scenario = scenariosForGroup(question.scenarioGroup).find((entry) => entry.scenarioId === question.scenarioId);
  if (!scenario) throw new Error(`${question.scenarioId}: missing scenario for editorial V7.`);
  const analysis = analyzeScenario(scenario);
  const assignment = assignTerms("SYL-QL-005", seed, analysis.termOrder);

  const explanation = question.explanation.map((line, index) => {
    const record = question.conclusions[index];
    const subject = assignment[record.canonicalConclusion.subject].labels[locale];
    const predicate = assignment[record.canonicalConclusion.predicate].labels[locale];
    const conclusionLabel = index === 0 ? "I" : "II";

    if (record.mode === "DEFINITE" && record.classification === "CONTRADICTED" && record.canonicalConclusion.form === "ALL") {
      return safeContradictedAll(locale, conclusionLabel, subject, predicate, question.statements.length);
    }
    if (
      record.mode === "DEFINITE"
      && record.classification === "UNDETERMINED"
      && (record.canonicalConclusion.form === "ALL" || record.canonicalConclusion.form === "NO")
    ) {
      return safeUndeterminedUniversal(
        locale,
        conclusionLabel,
        record.canonicalConclusion,
        subject,
        predicate,
        question.statements.length,
      );
    }
    return cleanLine(line, locale);
  }) as [string, string];

  return { ...question, explanation };
}
