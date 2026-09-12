import type { Eng001QlId, EnglishDifficulty, GrammarRuleId } from "../../../../core/types";
import { CP001_V4_CANONICAL_VARIANT_CAPACITY, CP001_V4_CATALOG_METRICS, buildEng001Cp001CandidateV4, semanticDomainOfV4 } from "./cp001-patterns-v4";
import { generateEng001Cp001QuestionV4 } from "./eng-001-cp001-v4";

interface ReviewSpec {
  difficulty: EnglishDifficulty;
  qlId: Eng001QlId;
  ruleId: GrammarRuleId;
}

const EASY_SPECS: readonly ReviewSpec[] = [
  { difficulty: "easy", qlId: "ENG-001-QL001", ruleId: "GR-SVA-001" },
  { difficulty: "easy", qlId: "ENG-001-QL001", ruleId: "GR-SVA-002" },
  { difficulty: "easy", qlId: "ENG-001-QL001", ruleId: "GR-SVA-003" },
  { difficulty: "easy", qlId: "ENG-001-QL002", ruleId: "GR-SVA-001" },
  { difficulty: "easy", qlId: "ENG-001-QL002", ruleId: "GR-SVA-002" },
  { difficulty: "easy", qlId: "ENG-001-QL002", ruleId: "GR-SVA-003" },
  { difficulty: "easy", qlId: "ENG-001-QL007", ruleId: "GR-SVA-002" },
  { difficulty: "easy", qlId: "ENG-001-QL007", ruleId: "GR-SVA-003" },
  { difficulty: "easy", qlId: "ENG-001-QL001", ruleId: "GR-SVA-001" },
  { difficulty: "easy", qlId: "ENG-001-QL001", ruleId: "GR-SVA-002" },
  { difficulty: "easy", qlId: "ENG-001-QL001", ruleId: "GR-SVA-003" },
  { difficulty: "easy", qlId: "ENG-001-QL002", ruleId: "GR-SVA-001" },
  { difficulty: "easy", qlId: "ENG-001-QL002", ruleId: "GR-SVA-002" },
  { difficulty: "easy", qlId: "ENG-001-QL002", ruleId: "GR-SVA-003" },
  { difficulty: "easy", qlId: "ENG-001-QL007", ruleId: "GR-SVA-002" },
  { difficulty: "easy", qlId: "ENG-001-QL007", ruleId: "GR-SVA-003" },
  { difficulty: "easy", qlId: "ENG-001-QL001", ruleId: "GR-SVA-001" },
  { difficulty: "easy", qlId: "ENG-001-QL001", ruleId: "GR-SVA-002" },
  { difficulty: "easy", qlId: "ENG-001-QL001", ruleId: "GR-SVA-003" },
  { difficulty: "easy", qlId: "ENG-001-QL007", ruleId: "GR-SVA-002" },
] as const;

const MEDIUM_SPECS: readonly ReviewSpec[] = [
  { difficulty: "medium", qlId: "ENG-001-QL001", ruleId: "GR-SVA-007" },
  { difficulty: "medium", qlId: "ENG-001-QL002", ruleId: "GR-SVA-005" },
  { difficulty: "medium", qlId: "ENG-001-QL001", ruleId: "GR-SVA-006" },
  { difficulty: "medium", qlId: "ENG-001-QL007", ruleId: "GR-SVA-010" },
  { difficulty: "medium", qlId: "ENG-001-QL001", ruleId: "GR-SVA-002" },
  { difficulty: "medium", qlId: "ENG-001-QL001", ruleId: "GR-SVA-003" },
  { difficulty: "medium", qlId: "ENG-001-QL002", ruleId: "GR-SVA-004" },
  { difficulty: "medium", qlId: "ENG-001-QL007", ruleId: "GR-SVA-008" },
  { difficulty: "medium", qlId: "ENG-001-QL001", ruleId: "GR-SVA-009" },
  { difficulty: "medium", qlId: "ENG-001-QL001", ruleId: "GR-SVA-010" },
  { difficulty: "medium", qlId: "ENG-001-QL002", ruleId: "GR-SVA-005" },
  { difficulty: "medium", qlId: "ENG-001-QL002", ruleId: "GR-SVA-006" },
  { difficulty: "medium", qlId: "ENG-001-QL007", ruleId: "GR-SVA-002" },
  { difficulty: "medium", qlId: "ENG-001-QL001", ruleId: "GR-SVA-003" },
  { difficulty: "medium", qlId: "ENG-001-QL001", ruleId: "GR-SVA-004" },
  { difficulty: "medium", qlId: "ENG-001-QL007", ruleId: "GR-SVA-005" },
  { difficulty: "medium", qlId: "ENG-001-QL001", ruleId: "GR-SVA-008" },
  { difficulty: "medium", qlId: "ENG-001-QL002", ruleId: "GR-SVA-009" },
  { difficulty: "medium", qlId: "ENG-001-QL001", ruleId: "GR-SVA-010" },
  { difficulty: "medium", qlId: "ENG-001-QL007", ruleId: "GR-SVA-006" },
] as const;

const HARD_SPECS: readonly ReviewSpec[] = [
  { difficulty: "hard", qlId: "ENG-001-QL001", ruleId: "GR-SVA-007" },
  { difficulty: "hard", qlId: "ENG-001-QL002", ruleId: "GR-SVA-005" },
  { difficulty: "hard", qlId: "ENG-001-QL001", ruleId: "GR-SVA-006" },
  { difficulty: "hard", qlId: "ENG-001-QL007", ruleId: "GR-SVA-010" },
  { difficulty: "hard", qlId: "ENG-001-QL001", ruleId: "GR-SVA-004" },
  { difficulty: "hard", qlId: "ENG-001-QL001", ruleId: "GR-SVA-008" },
  { difficulty: "hard", qlId: "ENG-001-QL001", ruleId: "GR-SVA-009" },
  { difficulty: "hard", qlId: "ENG-001-QL002", ruleId: "GR-SVA-006" },
  { difficulty: "hard", qlId: "ENG-001-QL007", ruleId: "GR-SVA-005" },
  { difficulty: "hard", qlId: "ENG-001-QL001", ruleId: "GR-SVA-010" },
  { difficulty: "hard", qlId: "ENG-001-QL002", ruleId: "GR-SVA-004" },
  { difficulty: "hard", qlId: "ENG-001-QL001", ruleId: "GR-SVA-008" },
  { difficulty: "hard", qlId: "ENG-001-QL007", ruleId: "GR-SVA-009" },
  { difficulty: "hard", qlId: "ENG-001-QL001", ruleId: "GR-SVA-005" },
  { difficulty: "hard", qlId: "ENG-001-QL002", ruleId: "GR-SVA-006" },
  { difficulty: "hard", qlId: "ENG-001-QL007", ruleId: "GR-SVA-008" },
  { difficulty: "hard", qlId: "ENG-001-QL001", ruleId: "GR-SVA-010" },
  { difficulty: "hard", qlId: "ENG-001-QL002", ruleId: "GR-SVA-004" },
  { difficulty: "hard", qlId: "ENG-001-QL001", ruleId: "GR-SVA-009" },
  { difficulty: "hard", qlId: "ENG-001-QL007", ruleId: "GR-SVA-006" },
] as const;

const REVIEW_SPECS = [...EASY_SPECS, ...MEDIUM_SPECS, ...HARD_SPECS] as const;

function candidateFor(spec: ReviewSpec, seed: string) {
  return buildEng001Cp001CandidateV4({
    ruleId: spec.ruleId,
    difficulty: spec.difficulty,
    seed: `${seed}:${spec.ruleId}`,
  });
}

function chooseBalancedSeed(
  spec: ReviewSpec,
  index: number,
  usedDomains: Set<string>,
  usedSurfaces: Set<string>,
): string {
  let fallback: string | null = null;
  for (let attempt = 0; attempt < 4_000; attempt += 1) {
    const seed = `review-v4:${spec.difficulty}:${index}:${attempt}`;
    const candidate = candidateFor(spec, seed);
    const domain = semanticDomainOfV4(candidate) ?? "unknown";
    const surface = candidate.correctSegments.join(" ").replace(/\s+/g, " ").trim();
    if (usedSurfaces.has(surface)) continue;
    fallback ??= seed;
    if (!usedDomains.has(domain)) return seed;
  }
  if (fallback) return fallback;
  throw new Error(`Could not find a distinct review seed for ${spec.difficulty} ${spec.ruleId}`);
}

export function buildEng001Cp001ReviewV4Markdown(): string {
  const lines: string[] = [
    "# ENG-001-CP001 — Subject–Verb Agreement Review V4",
    "",
    "Status: `FINAL_HUMAN_REVIEW_CANDIDATE__CI_GREEN__NOT_QUESTION_STUDIO_REGISTERED`",
    "",
    `Catalog scale: ${CP001_V4_CATALOG_METRICS.semanticScenes} complete semantic scenes across ${CP001_V4_CATALOG_METRICS.semanticDomains} unrelated domains; conservative canonical candidate capacity before QL/stem multiplication: ${CP001_V4_CANONICAL_VARIANT_CAPACITY.total}.`,
    "",
    "This review slice is generated by the V4 engine. Each difficulty section targets one question from every semantic domain before any domain is reused.",
    "",
    "Review focus: natural exam-like sentences, semantic independence, one defensible error, difficulty separation, calibrated No-error cases, and concise question-specific explanations.",
    "",
  ];

  let questionNumber = 0;
  for (const difficulty of ["easy", "medium", "hard"] as const) {
    lines.push(`## ${difficulty[0].toUpperCase()}${difficulty.slice(1)}`, "");
    const usedDomains = new Set<string>();
    const usedSurfaces = new Set<string>();
    const specs = REVIEW_SPECS.filter((spec) => spec.difficulty === difficulty);
    for (const [localIndex, spec] of specs.entries()) {
      questionNumber += 1;
      const seed = chooseBalancedSeed(spec, localIndex, usedDomains, usedSurfaces);
      const candidate = candidateFor(spec, seed);
      const domain = semanticDomainOfV4(candidate) ?? "unknown";
      const surface = candidate.correctSegments.join(" ").replace(/\s+/g, " ").trim();
      usedDomains.add(domain);
      usedSurfaces.add(surface);
      const question = generateEng001Cp001QuestionV4({ seed, difficulty, qlId: spec.qlId, ruleId: spec.ruleId });
      lines.push(`### ${questionNumber}. ${spec.qlId} · ${spec.ruleId} · ${domain}`, "", question.stem, "");
      question.segments.forEach((segment, index) => lines.push(`${String.fromCharCode(65 + index)}. ${segment}  `));
      if (question.options.includes("No error")) lines.push(`${String.fromCharCode(65 + question.segments.length)}. No error`);
      lines.push("", `**Answer:** ${question.options[question.correctOptionIndex]}`, "", `**Explanation:** ${question.explanation}`, "", `Seed: \`${seed}\``, "");
    }
    lines.push(`Domains represented in this section: ${usedDomains.size}.`, "", "---", "");
  }

  lines.push(
    "## V4 production-scale diversity gates",
    "",
    `- Complete semantic scenes: ${CP001_V4_CATALOG_METRICS.semanticScenes}.`,
    `- Semantic domains: ${CP001_V4_CATALOG_METRICS.semanticDomains}.`,
    `- Conservative canonical candidate variants before QL/stem multiplication: ${CP001_V4_CANONICAL_VARIANT_CAPACITY.total}.`,
    "- A semantic scene contains its own subject, verb pair, object/complement and context; simple noun replacement is not counted as a new semantic scene.",
    "- Additive, proximity, collective and intervening structures have dedicated structural catalogs rather than recycling one office/recruitment template.",
    "- Each difficulty review section attempts to cover all 20 semantic domains before a domain repeats.",
    "- Standard generic contexts are used; local city/place names are excluded.",
    "- Hard difficulty comes from agreement structure and dependency distance, not obscure vocabulary.",
    "- Question Studio/publication registration remains blocked until V4 is reviewed and approved.",
    "",
  );
  return lines.join("\n");
}
