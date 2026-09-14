import { generateDi010FrequencyPolygonSet, DI010_TASK_KINDS } from "./frequency-polygon-set";
import type { Di010ExamProfile, Di010QuestionSet } from "./types";

export function buildDi010ReviewSets(): readonly Di010QuestionSet[] {
  const profiles: readonly Di010ExamProfile[] = ["SSC_CGL_TIER_I", "SSC_CGL_TIER_II"];
  const candidates: Di010QuestionSet[] = [];
  for (let index = 0; index < 80; index += 1) {
    const profile = profiles[index % profiles.length]!;
    candidates.push(generateDi010FrequencyPolygonSet({ seed: `DI010-REVIEW-${String(index + 1).padStart(3, "0")}`, examProfile: profile }));
  }

  const selected: Di010QuestionSet[] = [];
  const covered = new Set<string>();
  const profileCounts = new Map<Di010ExamProfile, number>(profiles.map((profile) => [profile, 0]));
  const used = new Set<string>();
  while ((covered.size < DI010_TASK_KINDS.length || profiles.some((profile) => (profileCounts.get(profile) ?? 0) < 2)) && selected.length < 8) {
    let best: Di010QuestionSet | undefined;
    let bestScore = -1;
    for (const candidate of candidates) {
      if (used.has(candidate.setId)) continue;
      const newKinds = candidate.questions.filter((question) => !covered.has(question.kind)).length;
      const profileNeed = (profileCounts.get(candidate.examProfile) ?? 0) < 2 ? 1 : 0;
      const score = newKinds * 100 + profileNeed * 10;
      if (score > bestScore) { best = candidate; bestScore = score; }
    }
    if (!best) break;
    selected.push(best);
    used.add(best.setId);
    best.questions.forEach((question) => covered.add(question.kind));
    profileCounts.set(best.examProfile, (profileCounts.get(best.examProfile) ?? 0) + 1);
  }
  if (covered.size !== DI010_TASK_KINDS.length) throw new Error(`DI-010 review selection covered only ${covered.size}/${DI010_TASK_KINDS.length} task families.`);
  if (profiles.some((profile) => (profileCounts.get(profile) ?? 0) < 2)) throw new Error("DI-010 review selection did not include at least two sets per exam profile.");
  return selected;
}

export function formatDi010WorkingTable(table: { headers: readonly string[]; rows: readonly (readonly string[])[] }) {
  const header = `| ${table.headers.join(" | ")} |`;
  const divider = `| ${table.headers.map(() => "---").join(" | ")} |`;
  const rows = table.rows.map((row) => `| ${row.join(" | ")} |`);
  return [header, divider, ...rows].join("\n");
}
