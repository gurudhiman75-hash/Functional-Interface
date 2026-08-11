import type { CanonicalConclusion, SylLocale, TermId } from "../foundation/types";
import { generateBankingPossibilityEditorialQuestionV6 } from "./banking-possibility-editorial-v6";
import {
  generateBankingPossibilityEditorialQuestionV7,
  type BankingPossibilityEditorialQuestionV7,
} from "./banking-possibility-editorial-v7";

export type BankingPossibilityEditorialQuestionV8 = BankingPossibilityEditorialQuestionV7;

interface DiagramWitness {
  inside: ReadonlySet<TermId>;
  outside: ReadonlySet<TermId>;
}

function witnesses(svg: string): readonly DiagramWitness[] {
  return [...svg.matchAll(/<g data-witness="decisive"[^>]*data-inside="([^"]*)"[^>]*data-outside="([^"]*)"/gu)]
    .map((match) => ({
      inside: new Set(match[1].split(",").filter(Boolean)),
      outside: new Set(match[2].split(",").filter(Boolean)),
    }));
}

function witnessSatisfies(entry: DiagramWitness, conclusion: CanonicalConclusion): boolean {
  if (conclusion.form === "SOME") {
    return entry.inside.has(conclusion.subject) && entry.inside.has(conclusion.predicate);
  }
  if (conclusion.form === "SOME_NOT") {
    return entry.inside.has(conclusion.subject) && entry.outside.has(conclusion.predicate);
  }
  return false;
}

function oppositeExistential(conclusion: CanonicalConclusion): CanonicalConclusion | null {
  if (conclusion.form === "ALL") return { ...conclusion, form: "SOME_NOT" };
  if (conclusion.form === "NO") return { ...conclusion, form: "SOME" };
  return null;
}

function cleanEnglish(line: string, locale: SylLocale): string {
  if (locale !== "en-IN") return line;
  return line
    .replace(". the part of the ", ". The part of the ")
    .replace(". the shared region of the ", ". The shared region of the ")
    .replace(/an “([^”]+)” × cannot lie outside “([^”]+)”/gu, "a witness for the “$1” class cannot lie outside the “$2” class");
}

export function generateBankingPossibilityEditorialQuestionV8(
  seed: number,
  locale: SylLocale,
): BankingPossibilityEditorialQuestionV8 {
  const v7 = generateBankingPossibilityEditorialQuestionV7(seed, locale);
  const v6 = generateBankingPossibilityEditorialQuestionV6(seed, locale);
  const diagramWitnesses = witnesses(v7.diagram.svg);

  const explanation = v7.explanation.map((line, index) => {
    const record = v7.conclusions[index];
    if (record.mode !== "DEFINITE" || record.classification !== "CONTRADICTED") {
      return line;
    }
    const opposite = oppositeExistential(record.canonicalConclusion);
    if (!opposite) return line;
    const visible = diagramWitnesses.some((entry) => witnessSatisfies(entry, opposite));
    if (!visible) return line;
    // V6's contradicted ALL/NO explanation is witness-based. Reuse it only when
    // the actual V4 learner SVG contains the decisive opposite witness.
    return cleanEnglish(v6.explanation[index], locale);
  }) as [string, string];

  return { ...v7, explanation };
}
