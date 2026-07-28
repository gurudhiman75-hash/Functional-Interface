import { applyAvg001Cp005EditorialV2FinalCandidate } from "./cp005-editorial-v2-final";
import type { Avg001QuestionPackage, Avg001ValidationCheck } from "./types";

export const AVG_001_CP005_EDITORIAL_V2_APPROVED =
  "AVG-CP-005 editorial v2 singular-unit grammar guard v1";

function singularize(text: string) {
  return text
    .replace(/\b(1(?:\.0+)?) marks\b/g, "$1 mark")
    .replace(/\b(1(?:\.0+)?) years\b/g, "$1 year")
    .replace(/\b(1(?:\.0+)?) runs\b/g, "$1 run")
    .replace(/\b(1(?:\.0+)?) units\b/g, "$1 unit");
}

function refreshValidation(pkg: Avg001QuestionPackage) {
  const replaced = new Set(["cp005-v2-unit-grammar"]);
  const checks: Avg001ValidationCheck[] = pkg.validation.checks.filter((check) => !replaced.has(check.name));
  const text = `${pkg.stem}\n${pkg.options.join("\n")}\n${pkg.explanation.lines.join("\n")}`;
  checks.push({
    name: "cp005-v2-unit-grammar",
    passed: !/\b1(?:\.0+)? (?:marks|years|runs|units)\b/.test(text),
    message: "Singular CP-005 quantities use singular unit nouns",
  });
  return { valid: checks.every((check) => check.passed), checks };
}

export function applyAvg001Cp005EditorialV2ApprovedCandidate(
  pkg: Avg001QuestionPackage,
): Avg001QuestionPackage {
  const candidate = applyAvg001Cp005EditorialV2FinalCandidate(pkg);
  if (candidate.canonicalProblemId !== "AVG-CP-005" || candidate.language !== "en") return candidate;
  const options = candidate.options.map(singularize);
  const answer = options[candidate.correctIndex]!;
  const revised: Avg001QuestionPackage = {
    ...candidate,
    stem: singularize(candidate.stem),
    options,
    answer,
    solver: { ...candidate.solver, answer },
    independentVerification: { ...candidate.independentVerification, displayAnswer: answer },
    explanation: { lines: candidate.explanation.lines.map(singularize) },
    traceability: {
      ...candidate.traceability,
      cp005EditorialV2Approved: AVG_001_CP005_EDITORIAL_V2_APPROVED,
    },
  };
  return { ...revised, validation: refreshValidation(revised) };
}
