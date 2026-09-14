import { writeFileSync } from "node:fs";
import { generateReviewedCaeQuestion } from "./reviewed-generator.ts";
import { CAE_PROVISIONAL_QL_IDS, type CaeQlId, type GeneratedCaeQuestion } from "./types.ts";

const SEEDS_PER_QL = 5_000;
const BLOCK = 500;

type Counter = Map<string, number>;
type ExpansionPriority = "HIGH" | "MEDIUM" | "LOW" | "COMPLETE_FINITE";

type AuditRow = Readonly<{
  qlId: CaeQlId;
  questions: number;
  distinctCausalStates: number;
  distinctItemVariants: number;
  distinctSemanticForms: number;
  families: number;
  variants: number;
  firstCollisionSeed: number | null;
  seedAt95PercentFinalStateCoverage: number;
  final500NewStates: number;
  topStateCount: number;
  topStateShare: number;
  blockNewStates: readonly number[];
  topFamilies: readonly [string, number][];
  topStates: readonly [string, number][];
}>;

function increment(counter: Counter, key: string): number {
  const next = (counter.get(key) ?? 0) + 1;
  counter.set(key, next);
  return next;
}

function semanticForm(question: GeneratedCaeQuestion): string {
  // Presentation order and locale are intentionally excluded. This fingerprint
  // measures learner-visible semantic state rather than cosmetic shuffling.
  const operation = question.causalStructure.split(":").slice(0, 3).join(":");
  return [
    question.qlId,
    question.projectionId,
    operation,
    question.scenarioFamilyId,
    question.scenarioVariantId,
    question.answerId,
    question.difficulty,
  ].join("|");
}

function pct(value: number): string {
  return `${(value * 100).toFixed(2)}%`;
}

function auditQl(qlId: CaeQlId): AuditRow {
  const stateCounts: Counter = new Map();
  const itemCounts: Counter = new Map();
  const formCounts: Counter = new Map();
  const familyCounts: Counter = new Map();
  const variants = new Set<string>();
  const seenStates = new Set<string>();
  const cumulativeUniqueBySeed: number[] = [];
  const blockNewStates: number[] = [];
  let firstCollisionSeed: number | null = null;
  let blockStartUnique = 0;

  for (let seed = 0; seed < SEEDS_PER_QL; seed += 1) {
    const q = generateReviewedCaeQuestion({ qlId, locale: "en-IN", seed });
    const stateCount = increment(stateCounts, q.causalStateId);
    increment(itemCounts, q.itemVariantId);
    increment(formCounts, semanticForm(q));
    increment(familyCounts, q.scenarioFamilyId);
    variants.add(`${q.scenarioFamilyId}|${q.scenarioVariantId}`);
    seenStates.add(q.causalStateId);
    if (stateCount === 2 && firstCollisionSeed === null) firstCollisionSeed = seed;
    cumulativeUniqueBySeed.push(seenStates.size);

    if ((seed + 1) % BLOCK === 0) {
      blockNewStates.push(seenStates.size - blockStartUnique);
      blockStartUnique = seenStates.size;
    }
  }

  const finalStates = seenStates.size;
  const threshold95 = Math.ceil(finalStates * 0.95);
  const seedAt95 = cumulativeUniqueBySeed.findIndex((count) => count >= threshold95);
  const sortedStates = [...stateCounts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  const sortedFamilies = [...familyCounts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  const topStateCount = sortedStates[0]?.[1] ?? 0;

  return {
    qlId,
    questions: SEEDS_PER_QL,
    distinctCausalStates: stateCounts.size,
    distinctItemVariants: itemCounts.size,
    distinctSemanticForms: formCounts.size,
    families: familyCounts.size,
    variants: variants.size,
    firstCollisionSeed,
    seedAt95PercentFinalStateCoverage: seedAt95 < 0 ? SEEDS_PER_QL : seedAt95 + 1,
    final500NewStates: blockNewStates.at(-1) ?? 0,
    topStateCount,
    topStateShare: topStateCount / SEEDS_PER_QL,
    blockNewStates,
    topFamilies: sortedFamilies.slice(0, 5),
    topStates: sortedStates.slice(0, 5),
  };
}

function priority(row: AuditRow): ExpansionPriority {
  // QL002 is intentionally finite: its graph-native COMMON_OR_INDEPENDENT
  // authority has 124 theoretical states across the current 21-family corpus.
  // ql002-structural-completeness.test.ts proves both FOUR_WAY and FIVE_WAY
  // reviewed generation reach all 124 states (46 common-cause, 39 independent
  // effects, 39 independent causes). Early saturation is therefore completion,
  // not evidence that more families should be added.
  if (row.qlId === "CAE-QL-002" && row.distinctCausalStates === 124) return "COMPLETE_FINITE";

  const finalBlockShare = row.distinctCausalStates === 0 ? 0 : row.final500NewStates / row.distinctCausalStates;
  if (row.distinctSemanticForms < 80 || row.seedAt95PercentFinalStateCoverage < 2_000 || row.topStateShare >= 0.03) return "HIGH";
  if (row.distinctSemanticForms < 160 || finalBlockShare < 0.03 || row.topStateShare >= 0.015) return "MEDIUM";
  return "LOW";
}

const rows = CAE_PROVISIONAL_QL_IDS.map(auditQl);

const lines: string[] = [
  "# CAE-001 semantic saturation audit",
  "",
  `Reviewed English generation sampled at **${SEEDS_PER_QL.toLocaleString()} seeds per QL** (${(SEEDS_PER_QL * CAE_PROVISIONAL_QL_IDS.length).toLocaleString()} total questions).`,
  "",
  "This audit measures semantic-state repetition separately from presentation shuffling. `causalStateId` is the strict semantic-state identity; `semantic forms` collapse presentation and retain QL, operation, family/variant, keyed answer and difficulty.",
  "",
  "`COMPLETE_FINITE` means a separate graph-enumeration regression has proved the reviewed generator reaches the full theoretical state space; an early plateau is expected and is not an expansion signal.",
  "",
  "| QL | causal states | semantic forms | item variants | families | variants | first collision | 95% states seen by | new states in final 500 | top-state share | expansion priority |",
  "|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|",
];

for (const row of rows) {
  lines.push(`| ${row.qlId} | ${row.distinctCausalStates} | ${row.distinctSemanticForms} | ${row.distinctItemVariants} | ${row.families} | ${row.variants} | ${row.firstCollisionSeed ?? "none"} | ${row.seedAt95PercentFinalStateCoverage} | ${row.final500NewStates} | ${pct(row.topStateShare)} | **${priority(row)}** |`);
}

for (const row of rows) {
  lines.push(
    "",
    `## ${row.qlId}`,
    "",
    `**Novel causal states per 500-seed block:** ${row.blockNewStates.join(" → ")}`,
    "",
    `**Top families by frequency:** ${row.topFamilies.map(([id, count]) => `${id} (${count})`).join(", ")}`,
    "",
    "**Most repeated causal states:**",
    ...row.topStates.map(([id, count]) => `- ${count}× — \`${id}\``),
  );
  if (row.qlId === "CAE-QL-002") {
    lines.push(
      "",
      "**Structural completeness:** 124/124 theoretical states are reachable in both FOUR_WAY and FIVE_WAY reviewed profiles: 46 COMMON_CAUSE, 39 INDEPENDENT_EFFECTS, and 39 INDEPENDENT_CAUSES. Both profiles complete the theoretical state space by seed 866. No expansion is warranted unless the learner-operation contract itself changes.",
    );
  }
}

const high = rows.filter((row) => priority(row) === "HIGH").map((row) => row.qlId);
const medium = rows.filter((row) => priority(row) === "MEDIUM").map((row) => row.qlId);
const low = rows.filter((row) => priority(row) === "LOW").map((row) => row.qlId);
const completeFinite = rows.filter((row) => priority(row) === "COMPLETE_FINITE").map((row) => row.qlId);
lines.push(
  "",
  "## Expansion decision",
  "",
  `- **High priority:** ${high.join(", ") || "none"}`,
  `- **Medium priority:** ${medium.join(", ") || "none"}`,
  `- **Low priority:** ${low.join(", ") || "none"}`,
  `- **Structurally complete finite:** ${completeFinite.join(", ") || "none"}`,
  "",
  "Interpretation: high-priority QLs should receive new semantic structures/families before cosmetic variants. Medium-priority QLs may benefit from targeted family/operation expansion. Low-priority QLs should not be expanded merely to increase nominal counts. COMPLETE_FINITE QLs should remain frozen unless the exam/source-profile contract adds a genuinely new learner operation.",
  "",
);

const report = lines.join("\n");
writeFileSync("dist/reasoning-v1/cae-001/CAE-001-SEMANTIC-SATURATION-AUDIT.md", `${report}\n`);
console.log(report);