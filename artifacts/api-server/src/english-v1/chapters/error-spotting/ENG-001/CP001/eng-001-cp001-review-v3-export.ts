import type { Eng001QlId, EnglishDifficulty, GrammarRuleId } from "../../../../core/types";
import { buildEng001Cp001CandidateV3, semanticDomainOf } from "./cp001-patterns-v3";
import { generateEng001Cp001QuestionV3 } from "./eng-001-cp001-v3";

interface ReviewSpec {
  difficulty: EnglishDifficulty;
  qlId: Eng001QlId;
  ruleId: GrammarRuleId;
}

const REVIEW_SPECS: readonly ReviewSpec[] = [
  { difficulty: "easy", qlId: "ENG-001-QL001", ruleId: "GR-SVA-001" },
  { difficulty: "easy", qlId: "ENG-001-QL001", ruleId: "GR-SVA-001" },
  { difficulty: "easy", qlId: "ENG-001-QL001", ruleId: "GR-SVA-001" },
  { difficulty: "easy", qlId: "ENG-001-QL001", ruleId: "GR-SVA-002" },
  { difficulty: "easy", qlId: "ENG-001-QL002", ruleId: "GR-SVA-002" },
  { difficulty: "easy", qlId: "ENG-001-QL007", ruleId: "GR-SVA-002" },
  { difficulty: "easy", qlId: "ENG-001-QL001", ruleId: "GR-SVA-003" },
  { difficulty: "easy", qlId: "ENG-001-QL002", ruleId: "GR-SVA-003" },
  { difficulty: "easy", qlId: "ENG-001-QL007", ruleId: "GR-SVA-003" },

  { difficulty: "medium", qlId: "ENG-001-QL001", ruleId: "GR-SVA-001" },
  { difficulty: "medium", qlId: "ENG-001-QL001", ruleId: "GR-SVA-004" },
  { difficulty: "medium", qlId: "ENG-001-QL001", ruleId: "GR-SVA-005" },
  { difficulty: "medium", qlId: "ENG-001-QL002", ruleId: "GR-SVA-006" },
  { difficulty: "medium", qlId: "ENG-001-QL001", ruleId: "GR-SVA-007" },
  { difficulty: "medium", qlId: "ENG-001-QL001", ruleId: "GR-SVA-008" },
  { difficulty: "medium", qlId: "ENG-001-QL001", ruleId: "GR-SVA-009" },
  { difficulty: "medium", qlId: "ENG-001-QL001", ruleId: "GR-SVA-010" },
  { difficulty: "medium", qlId: "ENG-001-QL007", ruleId: "GR-SVA-005" },

  { difficulty: "hard", qlId: "ENG-001-QL001", ruleId: "GR-SVA-004" },
  { difficulty: "hard", qlId: "ENG-001-QL001", ruleId: "GR-SVA-005" },
  { difficulty: "hard", qlId: "ENG-001-QL002", ruleId: "GR-SVA-006" },
  { difficulty: "hard", qlId: "ENG-001-QL001", ruleId: "GR-SVA-007" },
  { difficulty: "hard", qlId: "ENG-001-QL001", ruleId: "GR-SVA-008" },
  { difficulty: "hard", qlId: "ENG-001-QL001", ruleId: "GR-SVA-009" },
  { difficulty: "hard", qlId: "ENG-001-QL001", ruleId: "GR-SVA-010" },
  { difficulty: "hard", qlId: "ENG-001-QL007", ruleId: "GR-SVA-006" },
  { difficulty: "hard", qlId: "ENG-001-QL007", ruleId: "GR-SVA-010" },
] as const;

function candidateFor(spec: ReviewSpec, seed: string) {
  return buildEng001Cp001CandidateV3({
    ruleId: spec.ruleId,
    difficulty: spec.difficulty,
    seed: `${seed}:${spec.ruleId}`,
  });
}

function chooseBalancedSeed(spec: ReviewSpec, index: number, usedDomains: Set<string>, usedSurfaces: Set<string>): string {
  let fallback: string | null = null;
  for (let attempt = 0; attempt < 600; attempt += 1) {
    const seed = `review-v3:${spec.difficulty}:${index}:${attempt}`;
    const candidate = candidateFor(spec, seed);
    const domain = semanticDomainOf(candidate) ?? "unknown";
    const surface = candidate.correctSegments.join(" ");
    if (usedSurfaces.has(surface)) continue;
    fallback ??= seed;
    if (!usedDomains.has(domain)) return seed;
  }
  if (fallback) return fallback;
  throw new Error(`Could not find a distinct review seed for ${spec.difficulty} ${spec.ruleId}`);
}

export function buildEng001Cp001ReviewV3Markdown(): string {
  const lines: string[] = [
    "# ENG-001-CP001 — Subject–Verb Agreement Review V3",
    "",
    "Status: `REVIEW_READY_V3__SEMANTICALLY_DIVERSE__NOT_QUESTION_STUDIO_REGISTERED`",
    "",
    "This review set is generated from the V3 semantic-bundle engine. The review exporter actively avoids repeating a semantic domain within each difficulty section while unused domains remain available.",
    "",
    "Review focus: unrelated real-exam-style contexts, natural sentence construction, answer uniqueness, difficulty separation, No-error quality, and explanation clarity.",
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
      const domain = semanticDomainOf(candidate) ?? "unknown";
      const surface = candidate.correctSegments.join(" ");
      usedDomains.add(domain);
      usedSurfaces.add(surface);
      const question = generateEng001Cp001QuestionV3({ seed, difficulty, qlId: spec.qlId, ruleId: spec.ruleId });
      lines.push(`### ${questionNumber}. ${spec.qlId} · ${spec.ruleId} · ${domain}`, "", question.stem, "");
      question.segments.forEach((segment, index) => lines.push(`${String.fromCharCode(65 + index)}. ${segment}  `));
      if (question.options.includes("No error")) lines.push(`${String.fromCharCode(65 + question.segments.length)}. No error`);
      lines.push("", `**Answer:** ${question.options[question.correctOptionIndex]}`, "", `**Explanation:** ${question.explanation}`, "", `Seed: \`${seed}\``, "");
    }
    lines.push("---", "");
  }

  lines.push(
    "## V3 diversity gates",
    "",
    "- Review questions within a difficulty section use different semantic domains while unused domains remain available.",
    "- Complete semantic bundles keep noun, action, object and context coherent; random cross-domain word substitution is not used.",
    "- Standard generic contexts are used; local city/place names are excluded.",
    "- Structural difficulty remains independent of obscure vocabulary.",
    "- Question Studio/publication registration remains blocked until this V3 review is approved.",
    "",
  );
  return lines.join("\n");
}
