import { BASE_SCENES_V4, SEMANTIC_DOMAINS_V4 } from "../chapters/error-spotting/ENG-001/CP001/cp001-semantic-catalog-v4";
import { COLLECTIVE_MEMBER_V4, COLLECTIVE_UNIT_V4, INTERVENING_SCENES_V4, PAIR_SCENES_V4 } from "../chapters/error-spotting/ENG-001/CP001/cp001-structural-catalog-v4";
import {
  buildEng001Cp001CandidateV4,
  CP001_V4_CANONICAL_VARIANT_CAPACITY,
  CP001_V4_CATALOG_METRICS,
  rulesForDifficultyV4,
  semanticDomainOfV4,
} from "../chapters/error-spotting/ENG-001/CP001/cp001-patterns-v4";
import { generateEng001Cp001QuestionV4 } from "../chapters/error-spotting/ENG-001/CP001/eng-001-cp001-v4";
import {
  validateEng001Cp001CandidateV4,
  validateEng001Cp001QuestionV4,
} from "../chapters/error-spotting/ENG-001/CP001/eng-001-cp001-v4-validator";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function stable(value: unknown): string {
  return JSON.stringify(value);
}

// Catalog scale is a hard production gate. These are complete semantic scenes,
// not simple noun substitutions inside one sentence frame.
assert(BASE_SCENES_V4.length >= 640, `V4 has only ${BASE_SCENES_V4.length} complete semantic scenes.`);
assert(SEMANTIC_DOMAINS_V4.length >= 20, `V4 has only ${SEMANTIC_DOMAINS_V4.length} semantic domains.`);
assert(PAIR_SCENES_V4.length >= 80, `V4 has only ${PAIR_SCENES_V4.length} pair scenes.`);
assert(INTERVENING_SCENES_V4.length >= 80, `V4 has only ${INTERVENING_SCENES_V4.length} intervening scenes.`);
assert(COLLECTIVE_UNIT_V4.length >= 12, `V4 has only ${COLLECTIVE_UNIT_V4.length} unit-reading collective scenes.`);
assert(COLLECTIVE_MEMBER_V4.length >= 12, `V4 has only ${COLLECTIVE_MEMBER_V4.length} member-reading collective scenes.`);
assert(CP001_V4_CANONICAL_VARIANT_CAPACITY.total >= 13_000, `V4 canonical capacity is only ${CP001_V4_CANONICAL_VARIANT_CAPACITY.total}.`);
assert(CP001_V4_CATALOG_METRICS.semanticScenes === BASE_SCENES_V4.length, "Catalog metric drift for semantic scenes.");

const sceneIds = new Set<string>();
const baseSurfaces = new Set<string>();
const domainCounts = new Map<string, number>();
for (const scene of BASE_SCENES_V4) {
  assert(!sceneIds.has(scene.id), `Duplicate V4 semantic scene id: ${scene.id}`);
  sceneIds.add(scene.id);
  const surface = `The ${scene.singular} ${scene.singularVerb} ${scene.segment3} ${scene.segment4}`.replace(/\s+/g, " ").trim();
  assert(!baseSurfaces.has(surface), `Duplicate V4 base semantic surface: ${surface}`);
  baseSurfaces.add(surface);
  domainCounts.set(scene.domain, (domainCounts.get(scene.domain) ?? 0) + 1);
  assert(scene.modifiers.length >= 2, `${scene.id} does not have two modifier choices.`);
}
for (const domain of SEMANTIC_DOMAINS_V4) {
  assert((domainCounts.get(domain) ?? 0) >= 32, `${domain} has only ${domainCounts.get(domain) ?? 0} base scenes.`);
}

// Candidate-level deterministic grammar/mutation validation across all rules.
for (const difficulty of ["easy", "medium", "hard"] as const) {
  for (const ruleId of rulesForDifficultyV4(difficulty)) {
    for (let index = 0; index < 240; index += 1) {
      const seed = `v4-candidate:${difficulty}:${ruleId}:${index}`;
      const first = buildEng001Cp001CandidateV4({ ruleId, difficulty, seed });
      const second = buildEng001Cp001CandidateV4({ ruleId, difficulty, seed });
      assert(stable(first) === stable(second), `Non-deterministic candidate for ${seed}`);
      const validation = validateEng001Cp001CandidateV4(first);
      assert(validation.ok, `${first.candidateId}: ${validation.issues.map((entry) => entry.message).join(" | ")}`);
      assert(Boolean(semanticDomainOfV4(first)), `${first.candidateId} lacks a valid domain.`);
    }
  }
}

// Question-shape, answer, explanation and no-error contracts.
for (const qlId of ["ENG-001-QL001", "ENG-001-QL002", "ENG-001-QL007"] as const) {
  for (const difficulty of ["easy", "medium", "hard"] as const) {
    for (let index = 0; index < 500; index += 1) {
      const input = { qlId, difficulty, seed: `v4-question:${qlId}:${difficulty}:${index}` } as const;
      const first = generateEng001Cp001QuestionV4(input);
      const second = generateEng001Cp001QuestionV4(input);
      assert(stable(first) === stable(second), `Non-deterministic question for ${input.seed}`);
      const validation = validateEng001Cp001QuestionV4(first);
      assert(validation.ok, `${first.questionId}: ${validation.issues.map((entry) => entry.message).join(" | ")}`);
      assert(first.segments.every((segment) => segment.trim().length > 0), `${first.questionId} has an empty visible segment.`);
      if (qlId === "ENG-001-QL002") assert(first.segments.length === 3, `${first.questionId} must have three segments.`);
      if (qlId === "ENG-001-QL007") assert(first.options[first.correctOptionIndex] === "No error", `${first.questionId} must key No error.`);
    }
  }
}

// Large-sample observed diversity gate. This is intentionally lower than the
// theoretical capacity, because hashes need not visit every canonical variant.
const minimumObserved = { easy: 2_000, medium: 3_500, hard: 2_500 } as const;
for (const difficulty of ["easy", "medium", "hard"] as const) {
  const surfaces = new Set<string>();
  const candidateIds = new Set<string>();
  const counts = new Map<string, number>();
  const sampleSize = 20_000;
  for (let index = 0; index < sampleSize; index += 1) {
    const question = generateEng001Cp001QuestionV4({
      difficulty,
      qlId: "ENG-001-QL001",
      seed: `v4-variety:${difficulty}:${index}`,
    });
    surfaces.add(question.correctedSentence);
    candidateIds.add(question.metadata.candidateId);
    const candidate = buildEng001Cp001CandidateV4({
      difficulty,
      ruleId: question.metadata.ruleId,
      seed: `${question.metadata.seed}:${question.metadata.ruleId}`,
    });
    const domain = semanticDomainOfV4(candidate);
    assert(Boolean(domain), `${question.questionId} lost its semantic domain.`);
    counts.set(domain!, (counts.get(domain!) ?? 0) + 1);
  }
  assert(surfaces.size >= minimumObserved[difficulty], `${difficulty} exposes only ${surfaces.size} observed surfaces.`);
  assert(candidateIds.size >= minimumObserved[difficulty], `${difficulty} exposes only ${candidateIds.size} observed candidate fingerprints.`);
  assert(counts.size === SEMANTIC_DOMAINS_V4.length, `${difficulty} reaches only ${counts.size}/${SEMANTIC_DOMAINS_V4.length} domains.`);
  for (const [domain, count] of counts) {
    const share = count / sampleSize;
    assert(share <= 0.10, `${difficulty}/${domain} dominates the sample at ${(share * 100).toFixed(1)}%.`);
  }
}

let rejected = false;
try {
  generateEng001Cp001QuestionV4({
    difficulty: "easy",
    qlId: "ENG-001-QL007",
    ruleId: "GR-SVA-001",
    seed: "v4-no-error-basic",
  });
} catch (error) {
  rejected = String(error).includes("not admitted");
}
assert(rejected, "Basic direct agreement must remain excluded from the calibrated No-error pool.");

console.log("ENG-001-CP001 V4 production-scale diversity tests passed.");
