import type {
  ArgAnswerClass,
  ArgArgumentAuthority,
  ArgStrength,
} from "./types.ts";

const DISQUALIFYING_RELEVANCE = new Set(["INDIRECT", "IRRELEVANT"] as const);
const DISQUALIFYING_MATERIALITY = new Set(["MINOR", "TRIVIAL"] as const);
const DISQUALIFYING_SUPPORT = new Set(["ASSERTED", "FALLACIOUS"] as const);
const DISQUALIFYING_SCOPE = new Set(["OVERBROAD", "ABSOLUTE_UNJUSTIFIED"] as const);
const DISQUALIFYING_STAKEHOLDER = new Set(["WEAK", "PREJUDICIAL"] as const);

export function classifyArgStrength(argument: ArgArgumentAuthority): ArgStrength {
  if (argument.issueMatch !== "EXACT") return "WEAK";
  if (DISQUALIFYING_RELEVANCE.has(argument.relevance as "INDIRECT" | "IRRELEVANT")) return "WEAK";
  if (DISQUALIFYING_MATERIALITY.has(argument.materiality as "MINOR" | "TRIVIAL")) return "WEAK";
  if (DISQUALIFYING_SUPPORT.has(argument.support as "ASSERTED" | "FALLACIOUS")) return "WEAK";
  if (argument.feasibility === "IMPRACTICAL") return "WEAK";
  if (DISQUALIFYING_SCOPE.has(argument.scope as "OVERBROAD" | "ABSOLUTE_UNJUSTIFIED")) return "WEAK";
  if (DISQUALIFYING_STAKEHOLDER.has(argument.stakeholderLegitimacy as "WEAK" | "PREJUDICIAL")) return "WEAK";
  if (argument.weaknessDefects.length > 0) return "WEAK";
  return "STRONG";
}

export function answerClassFromStrengths(
  first: ArgStrength,
  second: ArgStrength,
): ArgAnswerClass {
  if (first === "STRONG" && second === "STRONG") return "BOTH";
  if (first === "STRONG") return "ONLY_I";
  if (second === "STRONG") return "ONLY_II";
  return "NEITHER";
}

export function answerClassForArguments(
  argumentsPair: readonly [ArgArgumentAuthority, ArgArgumentAuthority],
): ArgAnswerClass {
  return answerClassFromStrengths(
    classifyArgStrength(argumentsPair[0]),
    classifyArgStrength(argumentsPair[1]),
  );
}

export function assertArgumentAuthorityConsistent(argument: ArgArgumentAuthority): void {
  const actual = classifyArgStrength(argument);
  if (actual !== argument.expectedStrength) {
    throw new Error(
      `${argument.id}: authority expects ${argument.expectedStrength} but classifier produced ${actual}`,
    );
  }

  if (argument.expectedStrength === "STRONG" && argument.weaknessDefects.length > 0) {
    throw new Error(`${argument.id}: strong authority cannot carry weakness defects`);
  }

  if (argument.expectedStrength === "WEAK" && argument.weaknessDefects.length === 0) {
    throw new Error(`${argument.id}: weak authority must name at least one explicit weakness defect`);
  }
}
