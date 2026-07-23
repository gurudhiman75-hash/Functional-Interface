import type { Avg001QuestionPackage } from "./types";

function cleanEquation(line: string) {
  return line
    .replaceAll("$$", "")
    .replaceAll(",;", ";")
    .replaceAll(";quad", ";")
    .replace(/\s+/g, " ")
    .trim();
}

export function applyAvg001Cp006ExplanationPolish(pkg: Avg001QuestionPackage): Avg001QuestionPackage {
  if (pkg.canonicalProblemId !== "AVG-CP-006") return pkg;
  const equations = pkg.explanation.lines.filter((line) => /\$\$/.test(line));
  const prose = pkg.explanation.lines.filter((line) => !/\$\$/.test(line));
  if (equations.length !== 3 || prose.length < 2) return pkg;
  const combined = `$$${cleanEquation(equations[0]!)}; ${cleanEquation(equations[1]!)}$$`;
  return {
    ...pkg,
    explanation: {
      lines: [
        prose[0]!,
        "Use the group totals and member counts together; directly averaging the three group averages would be wrong.",
        combined,
        equations[2]!,
        prose.at(-1)!,
      ],
    },
  };
}
