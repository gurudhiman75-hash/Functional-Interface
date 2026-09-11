import { buildEng001Cp001CandidateV4, semanticDomainOfV4 } from "../chapters/error-spotting/ENG-001/CP001/cp001-patterns-v4";
import { generateEng001Cp001QuestionV4 } from "../chapters/error-spotting/ENG-001/CP001/eng-001-cp001-v4";

for (const difficulty of ["easy", "medium", "hard"] as const) {
  const surfaces = new Set<string>();
  const candidates = new Set<string>();
  const domains = new Map<string, number>();
  const perRule = new Map<string, Set<string>>();
  const sampleSize = 20_000;

  for (let index = 0; index < sampleSize; index += 1) {
    const question = generateEng001Cp001QuestionV4({
      difficulty,
      qlId: "ENG-001-QL001",
      seed: `v4-variety:${difficulty}:${index}`,
    });
    surfaces.add(question.correctedSentence);
    candidates.add(question.metadata.candidateId);
    const set = perRule.get(question.metadata.ruleId) ?? new Set<string>();
    set.add(question.metadata.candidateId);
    perRule.set(question.metadata.ruleId, set);
    const candidate = buildEng001Cp001CandidateV4({
      difficulty,
      ruleId: question.metadata.ruleId,
      seed: `${question.metadata.seed}:${question.metadata.ruleId}`,
    });
    const domain = semanticDomainOfV4(candidate) ?? "unknown";
    domains.set(domain, (domains.get(domain) ?? 0) + 1);
  }

  const domainSummary = [...domains.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([domain, count]) => `${domain}:${count}(${(count / sampleSize * 100).toFixed(1)}%)`)
    .join(", ");
  const ruleSummary = [...perRule.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([rule, values]) => `${rule}:${values.size}`)
    .join(", ");

  console.log(`[V4-DIAGNOSTIC] ${difficulty}: surfaces=${surfaces.size}, candidates=${candidates.size}, domains=${domains.size}`);
  console.log(`[V4-DIAGNOSTIC] ${difficulty} rules: ${ruleSummary}`);
  console.log(`[V4-DIAGNOSTIC] ${difficulty} domain share: ${domainSummary}`);
}
