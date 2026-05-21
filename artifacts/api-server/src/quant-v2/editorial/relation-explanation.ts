import type {
  CanonicalPercentageProblem,
} from "../canonical/percentage-types";
import { roundClean } from "../utils/math-utils";

type RelationLanguage = "en" | "hi" | "pa";

const ENTITIES = ["A", "B", "C", "D"] as const;

function n(value: number | undefined) {
  if (typeof value !== "number") {
    return "";
  }
  const rounded = roundClean(value, 2);
  return Number.isInteger(rounded)
    ? String(rounded)
    : String(rounded).replace(/0+$/u, "").replace(/\.$/u, "");
}

function relationWord(language: RelationLanguage, direction: number | undefined) {
  if (language === "hi") {
    return direction === 0 ? "कम" : "अधिक";
  }
  if (language === "pa") {
    return direction === 0 ? "ਘੱਟ" : "ਵੱਧ";
  }
  return direction === 0 ? "less" : "more";
}

function finalWord(language: RelationLanguage, value: number) {
  if (language === "hi") {
    return value < 0 ? "कम" : "अधिक";
  }
  if (language === "pa") {
    return value < 0 ? "ਘੱਟ" : "ਵੱਧ";
  }
  return value < 0 ? "less" : "more";
}

function income(language: RelationLanguage) {
  if (language === "hi") return "की आय";
  if (language === "pa") return "ਦੀ ਆਮਦਨ";
  return "'s income";
}

function assumeLine(language: RelationLanguage, baseEntity: string) {
  if (language === "hi") {
    return `मान लें ${baseEntity} की आय = 100।`;
  }
  if (language === "pa") {
    return `ਮੰਨ ਲਓ ${baseEntity} ਦੀ ਆਮਦਨ = 100।`;
  }
  return `Assume ${baseEntity}'s income = 100.`;
}

function relationLine(input: {
  language: RelationLanguage;
  subject: string;
  base: string;
  percent: number;
  direction: number | undefined;
  baseValue: number;
  value: number;
}) {
  const multiplier = input.direction === 0
    ? 100 - input.percent
    : 100 + input.percent;
  const expression = `${n(input.baseValue)} x ${n(multiplier)} / 100`;
  if (input.language === "hi") {
    return `${input.subject}, ${input.base} से ${n(input.percent)}% ${relationWord(input.language, input.direction)} है, इसलिए ${input.subject} = ${expression} = ${n(input.value)}।`;
  }
  if (input.language === "pa") {
    return `${input.subject}, ${input.base} ਨਾਲੋਂ ${n(input.percent)}% ${relationWord(input.language, input.direction)} ਹੈ, ਇਸ ਲਈ ${input.subject} = ${expression} = ${n(input.value)}।`;
  }
  return `Since ${input.subject} is ${n(input.percent)}% ${relationWord(input.language, input.direction)} than ${input.base}, ${input.subject} = ${expression} = ${n(input.value)}.`;
}

function compareLine(input: {
  language: RelationLanguage;
  baseEntity: string;
  value: number;
}) {
  const answer = Math.abs(input.value);
  if (input.language === "hi") {
    return `${input.baseEntity} = 100 की तुलना में A ${n(answer)}% ${finalWord(input.language, input.value)} है।`;
  }
  if (input.language === "pa") {
    return `${input.baseEntity} = 100 ਨਾਲ ਤੁਲਨਾ ਕਰਨ ਤੇ A ${n(answer)}% ${finalWord(input.language, input.value)} ਹੈ।`;
  }
  return `Compared with ${input.baseEntity} = 100, A is ${n(answer)}% ${finalWord(input.language, input.value)}.`;
}

export function renderRelationalPercentageExplanation(
  problem: CanonicalPercentageProblem,
  language: RelationLanguage,
) {
  const v = problem.variables;
  const relationCount = Math.max(1, Math.trunc(v.relationCount ?? 1));
  const baseEntity = ENTITIES[Math.min(relationCount, ENTITIES.length - 1)]!;
  const values: Record<string, number> = {
    [baseEntity]: 100,
  };
  const lines = [assumeLine(language, baseEntity)];

  for (let index = relationCount; index >= 1; index -= 1) {
    const subject = ENTITIES[index - 1]!;
    const base = ENTITIES[index]!;
    const percent = Number(v[`relation${index}Percent`] ?? 0);
    const direction = Number(v[`relation${index}Direction`] ?? 1);
    const baseValue = values[base] ?? 100;
    const value = roundClean(
      baseValue * (direction === 0 ? 100 - percent : 100 + percent) / 100,
      2,
    );
    values[subject] = value;
    lines.push(relationLine({
      language,
      subject,
      base,
      percent,
      direction,
      baseValue,
      value,
    }));
  }

  lines.push(compareLine({
    language,
    baseEntity,
    value: problem.answer,
  }));

  return lines.join("\n");
}
