import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { generateQuestion } from "../generation-engine";

const DIAGNOSTICS_PATH = resolve(
  process.cwd(),
  "tmp/quant-v4-stem-naturalness-fatigue-p1-diagnostics.json",
);

const SYNTHETIC_WRAPPER_PATTERNS = [
  /\b(?:note|notice|record|register|report|brief|schedule)\s+(?:says|shows|states|records|lists|mentions)\b/i,
  /\b(?:a|the)\s+(?:recovery|labour|factory|household|warehouse|route|survey)\s+(?:note|notice|record|register|report|brief|schedule)\b/i,
  /\baccording to (?:a|the) (?:note|notice|record|register|report|brief|schedule)\b/i,
  /\bscenario (?:says|states|shows)\b/i,
];

const META_WORDING_PATTERNS = [
  /\bquestion asks\b/i,
  /\bgiven information\b/i,
  /\babove information\b/i,
  /\bprovided information\b/i,
  /\bthe data states\b/i,
  /\bthe statement says\b/i,
];

type StemSample = {
  packageId: string;
  questionKey: string;
  stem: string;
};

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

function itemQuestionKey(item: any, packageId: string, index: number): string {
  return String(
    item?.questionLanguageId ??
      item?.metadata?.questionLanguageId ??
      item?.traceability?.questionLanguageId ??
      item?.questionId ??
      `${packageId}:item-${index + 1}`,
  );
}

function normalize(text: string) {
  return text
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[–—−]/g, "-")
    .replace(/\s+/g, " ")
    .trim();
}

function skeleton(text: string) {
  return normalize(text)
    .replace(/₹|\brs\.?\b|\binr\b/g, "<money>")
    .replace(/\b\d+(?:\.\d+)?\b/g, "<n>")
    .replace(/\s+/g, " ");
}

function openingKey(text: string, words = 4) {
  return normalize(text)
    .replace(/[^a-z0-9%]+/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, words)
    .join(" ");
}

function endingKey(text: string, words = 5) {
  return normalize(text)
    .replace(/[^a-z0-9%]+/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .slice(-words)
    .join(" ");
}

function wordCount(text: string) {
  return normalize(text).split(/\s+/).filter(Boolean).length;
}

function persistDiagnostics(payload: Record<string, unknown>) {
  mkdirSync(dirname(DIAGNOSTICS_PATH), { recursive: true });
  writeFileSync(DIAGNOSTICS_PATH, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  console.error(`QUANT_V4_STEM_FATIGUE_DIAGNOSTICS=${JSON.stringify(payload)}`);
}

function topClusters(samples: readonly StemSample[], keyFn: (stem: string) => string) {
  const map = new Map<string, { questions: Set<string>; examples: StemSample[] }>();
  for (const sample of samples) {
    const key = keyFn(sample.stem);
    const entry = map.get(key) ?? { questions: new Set<string>(), examples: [] };
    entry.questions.add(sample.questionKey);
    if (entry.examples.length < 5) entry.examples.push(sample);
    map.set(key, entry);
  }
  return [...map.entries()]
    .map(([key, entry]) => ({
      key,
      count: entry.questions.size,
      questions: [...entry.questions].slice(0, 15),
      examples: entry.examples,
    }))
    .sort((left, right) => right.count - left.count);
}

function analysePackage(packageId: string, samples: readonly StemSample[]) {
  const exact = topClusters(samples, normalize).filter((entry) => entry.count > 1);
  const skeletons = topClusters(samples, skeleton);
  const openings = topClusters(samples, (stem) => openingKey(stem, 4));
  const endings = topClusters(samples, (stem) => endingKey(stem, 5));

  const synthetic = samples.filter((sample) =>
    SYNTHETIC_WRAPPER_PATTERNS.some((pattern) => pattern.test(sample.stem)),
  );
  const meta = samples.filter((sample) =>
    META_WORDING_PATTERNS.some((pattern) => pattern.test(sample.stem)),
  );
  const veryLong = samples.filter((sample) => wordCount(sample.stem) > 55);
  const veryShort = samples.filter((sample) => wordCount(sample.stem) < 5);

  const largestSkeleton = skeletons[0]?.count ?? 0;
  const largestOpening = openings[0]?.count ?? 0;
  const largestEnding = endings[0]?.count ?? 0;

  const violations: string[] = [];
  if (exact.length > 0) violations.push(`exact_stem_duplicate_clusters=${exact.length}`);
  if (largestSkeleton > 12) {
    violations.push(`largest_normalized_stem_skeleton=${largestSkeleton}>12`);
  }
  if (largestOpening > 30) {
    violations.push(`largest_four_word_opening_cluster=${largestOpening}>30`);
  }
  if (synthetic.length > 8) {
    violations.push(`synthetic_context_wrappers=${synthetic.length}>8`);
  }
  if (meta.length > 0) violations.push(`meta_wording=${meta.length}>0`);

  return {
    packageId,
    sampleCount: samples.length,
    exactStemDuplicateClusters: exact.length,
    largestNormalizedSkeletonCluster: largestSkeleton,
    largestFourWordOpeningCluster: largestOpening,
    largestFiveWordEndingCluster: largestEnding,
    syntheticContextWrapperCount: synthetic.length,
    metaWordingCount: meta.length,
    veryLongStemCount: veryLong.length,
    veryShortStemCount: veryShort.length,
    violations,
    topExactDuplicates: exact.slice(0, 10),
    topSkeletonClusters: skeletons.slice(0, 10),
    topOpeningClusters: openings.slice(0, 10),
    topEndingClusters: endings.slice(0, 10),
    syntheticContextExamples: synthetic.slice(0, 20),
    metaWordingExamples: meta.slice(0, 20),
    veryLongExamples: veryLong.slice(0, 10),
  };
}

async function main() {
  const packageIds = ["PCT-001", "PCT-002", "RAP-001"] as const;
  const allSamples: StemSample[] = [];
  const packageReports = [];

  for (const packageId of packageIds) {
    const batch = await generateQuestion({
      packageId,
      count: 100,
      language: "en",
      seed: `quant-v4:stem-naturalness-fatigue-p1:${packageId}`,
    } as any);
    const items = batchItems(batch);
    assert(items.length === 100, `${packageId} returned ${items.length}; expected 100.`);

    const samples = items.map((item, index) => {
      const stem = itemStem(item);
      assert(stem.length > 0, `${packageId} item ${index + 1} has no stem.`);
      return {
        packageId,
        questionKey: itemQuestionKey(item, packageId, index),
        stem,
      } satisfies StemSample;
    });

    allSamples.push(...samples);
    packageReports.push(analysePackage(packageId, samples));
  }

  const violations = packageReports.flatMap((report) =>
    report.violations.map((violation) => `${report.packageId}:${violation}`),
  );
  const passed = violations.length === 0;
  const result = {
    status: passed
      ? "PASS_QUANT_V4_STEM_NATURALNESS_FATIGUE_P1"
      : "FAIL_QUANT_V4_STEM_NATURALNESS_FATIGUE_P1",
    runtimeQuestions: allSamples.length,
    packages: packageIds,
    policy: {
      exactDuplicates: "not allowed across distinct QLs in the sampled batch",
      normalizedSkeletonCeiling: 12,
      fourWordOpeningCeiling: 30,
      syntheticWrapperCeilingPer100: 8,
      metaWordingCeiling: 0,
      longAndShortStemCounts: "diagnostic only",
      intent: "a 100-question package batch should continue to read like an examiner, not a template generator",
    },
    violations,
    packageReports,
  };

  persistDiagnostics(result);
  console.log(JSON.stringify(result));
  if (!passed) process.exitCode = 1;
}

main().catch((error) => {
  const err = error instanceof Error ? error : new Error(String(error));
  persistDiagnostics({
    status: "FAIL_QUANT_V4_STEM_NATURALNESS_FATIGUE_P1",
    message: err.message,
    stack: err.stack ?? null,
  });
  process.exitCode = 1;
});
