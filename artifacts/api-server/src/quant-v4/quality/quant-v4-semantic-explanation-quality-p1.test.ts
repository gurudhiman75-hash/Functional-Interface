import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import {
  EXPLANATION_COHERENCE_POLICY_VERSION,
  FORBIDDEN_PHRASES,
  validateExplanationPipeline,
  type ExplanationEvidence,
  type ExplanationRenderer,
} from "../common/explanation-engine";
import { generateQuestion } from "../generation-engine";
import {
  assessExplanationQuality,
  hasQuestionSpecificEvidence,
  type ExplanationQualitySample,
} from "./semantic-explanation-quality";

const DIAGNOSTICS_PATH = resolve(
  process.cwd(),
  "tmp/quant-v4-semantic-explanation-p1-diagnostics.json",
);

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function batchItems(batch: any): any[] {
  if (Array.isArray(batch?.questions) && batch.questions.length) return batch.questions;
  if (Array.isArray(batch?.questionPackages) && batch.questionPackages.length) {
    return batch.questionPackages;
  }
  return [];
}

function itemStem(item: any): string {
  return String(item?.text ?? item?.stem ?? "").trim();
}

function itemExplanation(item: any): string {
  if (typeof item?.explanation === "string") return item.explanation.trim();
  if (Array.isArray(item?.explanation?.lines)) {
    return item.explanation.lines.join("\n\n").trim();
  }
  if (Array.isArray(item?.packageExplanation?.lines)) {
    return item.packageExplanation.lines.join("\n\n").trim();
  }
  return "";
}

function itemQuestionKey(item: any, packageId: string, index: number): string {
  return String(
    item?.questionLanguageId ??
      item?.metadata?.questionLanguageId ??
      item?.traceability?.questionLanguageId ??
      item?.questionId ??
      `${packageId}:item-${index + 1}`,
  );
}

function itemAnswer(item: any): string | number | undefined {
  if (typeof item?.answer === "string" || typeof item?.answer === "number") {
    return item.answer;
  }
  const canonical = item?.canonicalAnswer;
  if (typeof canonical?.display === "string" || typeof canonical?.display === "number") {
    return canonical.display;
  }
  if (typeof canonical?.value === "string" || typeof canonical?.value === "number") {
    return canonical.value;
  }
  return undefined;
}

function itemOptions(item: any): string[] {
  return Array.isArray(item?.options)
    ? item.options.map((option: unknown) => String(option ?? ""))
    : [];
}

function normalizeExact(text: string) {
  return String(text ?? "")
    .normalize("NFKC")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

function persistDiagnostics(payload: Record<string, unknown>) {
  mkdirSync(dirname(DIAGNOSTICS_PATH), { recursive: true });
  writeFileSync(DIAGNOSTICS_PATH, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  console.error(`QUANT_V4_SEMANTIC_DIAGNOSTICS=${JSON.stringify(payload)}`);
}

function assertConciseCoherenceContract() {
  const evidence: ExplanationEvidence = {
    variables: { rate: 25, base: 80 },
    derivedValues: { result: 20 },
    entities: {},
    answer: 20,
  };
  const renderer: ExplanationRenderer = {
    render: () => [
      {
        stepId: "working",
        type: "SIMPLIFICATION",
        narrative: "25% of 80 is",
        mathLatex: "\\frac{25}{100}\\times 80=20",
      },
      {
        stepId: "answer",
        type: "CONCLUSION",
        narrative: "Hence, the required value is 20.",
      },
    ],
  };

  const steps = validateExplanationPipeline(evidence, renderer);
  assert(steps.length === 2, "Coherence V2 must accept a complete concise two-step solution.");
  assert(
    !steps.some((step) => step.type === "FORMULA" || step.type === "SUBSTITUTION"),
    "The concise-policy regression must prove FORMULA and SUBSTITUTION slots are not compulsory.",
  );
}

async function collectRuntimeCorpus() {
  const packages = ["PCT-001", "PCT-002", "RAP-001"] as const;
  const samples: ExplanationQualitySample[] = [];

  for (const packageId of packages) {
    const batch = await generateQuestion({
      packageId,
      count: 100,
      language: "en",
      seed: `quant-v4:semantic-explanation-p1:${packageId}`,
    } as any);
    const items = batchItems(batch);
    assert(items.length === 100, `${packageId} returned ${items.length} items; expected 100.`);

    items.forEach((item, index) => {
      const stem = itemStem(item);
      const explanation = itemExplanation(item);
      assert(stem.length > 0, `${packageId} item ${index + 1} has no learner stem.`);
      assert(explanation.length > 0, `${packageId} item ${index + 1} has no learner explanation.`);

      const lowerExplanation = explanation.toLowerCase();
      for (const phrase of FORBIDDEN_PHRASES) {
        assert(
          !lowerExplanation.includes(phrase.toLowerCase()),
          `${packageId} item ${index + 1} contains forbidden boilerplate '${phrase}'.\n${explanation}`,
        );
      }

      const sample: ExplanationQualitySample = {
        packageId,
        questionKey: itemQuestionKey(item, packageId, index),
        stem,
        explanation,
        answer: itemAnswer(item),
        options: itemOptions(item),
      };
      const assessment = assessExplanationQuality(sample);
      assert(
        hasQuestionSpecificEvidence(assessment),
        `${packageId} ${sample.questionKey} explanation does not visibly depend on the actual question evidence.\nASSESSMENT: ${JSON.stringify(assessment)}\nSTEM: ${stem}\nANSWER: ${String(sample.answer ?? "<unresolved>")}\nEXPLANATION: ${explanation}`,
      );
      assert(
        assessment.optionalSectionIssues.length === 0,
        `${packageId} ${sample.questionKey} has optional shortcut/trap padding: ${assessment.optionalSectionIssues.join("; ")}\nASSESSMENT: ${JSON.stringify(assessment)}\nSTEM: ${stem}\nEXPLANATION: ${explanation}`,
      );
      samples.push(sample);
    });
  }

  return samples;
}

function auditClusters(samples: readonly ExplanationQualitySample[]) {
  const semantic = new Map<string, { questions: Set<string>; examples: ExplanationQualitySample[] }>();
  const structural = new Map<string, number>();
  const exact = new Map<string, { questions: Set<string>; examples: ExplanationQualitySample[] }>();

  for (const sample of samples) {
    const assessment = assessExplanationQuality(sample);
    const semanticKey = `${sample.packageId}\u0000${assessment.semanticSignature}`;
    const exactKey = `${sample.packageId}\u0000${normalizeExact(sample.explanation)}`;

    const semanticEntry = semantic.get(semanticKey) ?? { questions: new Set<string>(), examples: [] };
    semanticEntry.questions.add(sample.questionKey);
    if (semanticEntry.examples.length < 3) semanticEntry.examples.push(sample);
    semantic.set(semanticKey, semanticEntry);

    const exactEntry = exact.get(exactKey) ?? { questions: new Set<string>(), examples: [] };
    exactEntry.questions.add(sample.questionKey);
    if (exactEntry.examples.length < 3) exactEntry.examples.push(sample);
    exact.set(exactKey, exactEntry);

    const structuralKey = `${sample.packageId}\u0000${assessment.structuralSignature}`;
    structural.set(structuralKey, (structural.get(structuralKey) ?? 0) + 1);
  }

  const exactCrossQuestion = [...exact.entries()]
    .map(([signature, entry]) => ({
      signature,
      count: entry.questions.size,
      questions: [...entry.questions].slice(0, 10),
      examples: entry.examples,
    }))
    .filter((entry) => entry.count > 1)
    .sort((left, right) => right.count - left.count);
  assert(
    exactCrossQuestion.length === 0,
    `Exact learner explanations are duplicated across distinct question identities: ${JSON.stringify(exactCrossQuestion.slice(0, 5))}`,
  );

  const semanticClusters = [...semantic.entries()]
    .map(([signature, entry]) => ({
      signature,
      count: entry.questions.size,
      questions: [...entry.questions].slice(0, 10),
      examples: entry.examples,
    }))
    .sort((left, right) => right.count - left.count);
  const largestSemanticCluster = semanticClusters[0]?.count ?? 0;

  // This is deliberately a cross-question ceiling, not an exact-string metric.
  // A generic wrapper applied across a large family will fail even when values differ.
  assert(
    largestSemanticCluster <= 16,
    `Semantic explanation wrapper is reused across ${largestSemanticCluster} distinct question identities; ceiling is 16. Largest clusters: ${JSON.stringify(semanticClusters.slice(0, 5))}`,
  );

  const structuralClusters = [...structural.entries()]
    .map(([signature, count]) => ({ signature, count }))
    .sort((left, right) => right.count - left.count);

  return {
    exactCrossQuestionDuplicateClusters: exactCrossQuestion.length,
    largestSemanticCrossQuestionCluster: largestSemanticCluster,
    largestStructuralCluster: structuralClusters[0]?.count ?? 0,
    semanticClusterCount: semanticClusters.length,
    structuralClusterCount: structuralClusters.length,
  };
}

async function main() {
  assert(
    EXPLANATION_COHERENCE_POLICY_VERSION === "QUANT_V4_EXPLANATION_COHERENCE_V2",
    "Wrong Quant V4 explanation policy version.",
  );
  assertConciseCoherenceContract();

  const samples = await collectRuntimeCorpus();
  const clusters = auditClusters(samples);
  const result = {
    status: "PASS_QUANT_V4_SEMANTIC_EXPLANATION_QUALITY_P1",
    policy: EXPLANATION_COHERENCE_POLICY_VERSION,
    runtimeQuestions: samples.length,
    packages: [...new Set(samples.map((sample) => sample.packageId))],
    ...clusters,
    rule: "simple coherent working; shortcut/trap optional and evidence-bound",
  };
  persistDiagnostics(result);
  console.log(JSON.stringify(result));
}

main().catch((error) => {
  const err = error instanceof Error ? error : new Error(String(error));
  persistDiagnostics({
    status: "FAIL_QUANT_V4_SEMANTIC_EXPLANATION_QUALITY_P1",
    policy: EXPLANATION_COHERENCE_POLICY_VERSION,
    message: err.message,
    stack: err.stack ?? null,
  });
  process.exitCode = 1;
});
