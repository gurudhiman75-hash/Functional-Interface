import type { SylLocale } from "../foundation/types";
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
    return `${conclusionLabel}: ${lead}। कथनों का पालन करते हुए “${subject}” वर्ग को पूरी तरह “${predicate}” वर्ग के अंदर नहीं रखा जा सकता। इसलिए “सभी ${subject} ${predicate} हैं” निश्चित रूप से सत्य नहीं हो सकता और निष्कर्ष ${conclusionLabel} अनुसरण नहीं करता।`;
  }
  if (locale === "pa-IN") {
    return `${conclusionLabel}: ${lead}। ਕਥਨਾਂ ਦੀ ਪਾਲਣਾ ਕਰਦੇ ਹੋਏ “${subject}” ਵਰਗ ਨੂੰ ਪੂਰੀ ਤਰ੍ਹਾਂ “${predicate}” ਵਰਗ ਦੇ ਅੰਦਰ ਨਹੀਂ ਰੱਖਿਆ ਜਾ ਸਕਦਾ। ਇਸ ਲਈ “ਸਾਰੇ ${subject} ${predicate} ਹਨ” ਪੱਕੇ ਤੌਰ ਤੇ ਸੱਚ ਨਹੀਂ ਹੋ ਸਕਦਾ ਅਤੇ ਨਤੀਜਾ ${conclusionLabel} ਸਹੀ ਨਹੀਂ ਹੈ।`;
  }
  return `${conclusionLabel}: ${lead}. The whole “${subject}” class cannot be placed inside the “${predicate}” class without violating the statements. Therefore “all ${subject} are ${predicate}” conflicts with the premise arrangement and Conclusion ${conclusionLabel} does not follow.`;
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
    const conclusion = question.conclusions[index];
    if (conclusion.mode === "DEFINITE" && conclusion.classification === "CONTRADICTED" && conclusion.canonicalConclusion.form === "ALL") {
      const subject = assignment[conclusion.canonicalConclusion.subject].labels[locale];
      const predicate = assignment[conclusion.canonicalConclusion.predicate].labels[locale];
      return safeContradictedAll(locale, index === 0 ? "I" : "II", subject, predicate, question.statements.length);
    }
    return cleanLine(line, locale);
  }) as [string, string];

  return { ...question, explanation };
}
