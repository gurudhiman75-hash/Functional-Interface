import { generateDi009HistogramSet } from "./histogram-set";
import type { Di009QuestionSet, Di009TaskKind } from "./types";

const ALL_TASKS: readonly Di009TaskKind[] = [
  "DIRECT_CLASS_FREQUENCY",
  "TOTAL_FREQUENCY",
  "COMBINED_RANGE_TOTAL",
  "ABOVE_BOUNDARY_TOTAL",
  "BELOW_BOUNDARY_TOTAL",
  "RANGE_RATIO",
  "CLASS_SHARE_OF_TOTAL",
  "FREQUENCY_DIFFERENCE_BETWEEN_CLASSES",
  "MODAL_CLASS_IDENTIFICATION",
  "MEDIAN_CLASS_IDENTIFICATION",
  "KTH_OBSERVATION_CLASS",
  "APPROX_GROUPED_MEAN_FROM_HISTOGRAM",
  "APPROX_GROUPED_MODE_FROM_HISTOGRAM",
];

export function selectDi009V2ReviewSets(): Di009QuestionSet[] {
  const candidates: Di009QuestionSet[] = [];
  for (let index = 1; index <= 80; index += 1) {
    const profile = index % 2 === 0 ? "SSC_CGL_TIER_II" as const : "SSC_CGL_TIER_I" as const;
    candidates.push(generateDi009HistogramSet({ seed: `DI-009-V2-REVIEW-${index}`, examProfile: profile }));
  }

  const selected: Di009QuestionSet[] = [];
  const uncovered = new Set<Di009TaskKind>(ALL_TASKS);
  const profileCounts = new Map<string, number>([["SSC_CGL_TIER_I", 0], ["SSC_CGL_TIER_II", 0]]);

  while ((uncovered.size > 0 || [...profileCounts.values()].some((count) => count < 2)) && selected.length < 7) {
    const remaining = candidates.filter((candidate) => !selected.includes(candidate));
    remaining.sort((a, b) => {
      const score = (set: Di009QuestionSet) => {
        const newTasks = set.questions.filter((question) => uncovered.has(question.kind)).length * 10;
        const profileBonus = profileCounts.get(set.examProfile)! < 2 ? 4 : 0;
        const classCountBonus = selected.some((item) => item.stimulus.bins.length === set.stimulus.bins.length) ? 0 : 1;
        const shapeBonus = selected.some((item) => item.stimulus.shape === set.stimulus.shape) ? 0 : 2;
        return newTasks + profileBonus + classCountBonus + shapeBonus;
      };
      return score(b) - score(a);
    });
    const next = remaining[0];
    if (!next) break;
    selected.push(next);
    profileCounts.set(next.examProfile, profileCounts.get(next.examProfile)! + 1);
    next.questions.forEach((question) => uncovered.delete(question.kind));
  }

  if (uncovered.size > 0) throw new Error(`DI-009 V2 review selection missed: ${[...uncovered].join(", ")}`);
  if ([...profileCounts.values()].some((count) => count < 2)) throw new Error("DI-009 V2 review selection did not represent both SSC profiles at least twice.");
  return selected;
}

export function markdownTable(headers: readonly string[], rows: readonly (readonly string[])[]) {
  const line = (cells: readonly string[]) => `| ${cells.join(" | ")} |`;
  return [line(headers), line(headers.map(() => "---")), ...rows.map(line)].join("\n");
}

export function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
