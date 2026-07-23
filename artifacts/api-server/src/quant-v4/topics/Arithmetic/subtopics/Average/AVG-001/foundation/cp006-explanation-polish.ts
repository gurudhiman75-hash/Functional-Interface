import type { Avg001QuestionPackage } from "./types";

export function applyAvg001Cp006ExplanationPolish(pkg: Avg001QuestionPackage): Avg001QuestionPackage {
  if (pkg.canonicalProblemId !== "AVG-CP-006") return pkg;
  const equations = pkg.explanation.lines.filter((line) => /\$\$/.test(line));
  const prose = pkg.explanation.lines.filter((line) => !/\$\$/.test(line));
  if (equations.length !== 3 || prose.length < 2) return pkg;
  const combined = `$$${equations[0]!.replaceAll("$$", "")};\quad ${equations[1]!.replaceAll("$$", "")}$$`;
  return {
    ...pkg,
    explanation: {
      lines: [
        prose[0]!,
        "Use the group totals and member counts together; a simple mean of the group averages would be wrong.",
        combined,
        equations[2]!,
        prose.at(-1)!,
      ],
    },
  };
}
