import { QCP_CATALOG_PATTERNS, QCP_CATALOG_EXCLUSIONS } from "./catalog-schema";
import { generateQcp001Question } from "./engine";
import { independentlyVerifyQcp001Question } from "./independent-verifier";
const assert = (ok: unknown, message: string) => {
  if (!ok) throw Error(message);
};
const expected = [
  [[5], [4]],
  [[49], [49]],
  [[5 / 14], [5 / 14, 8 / 7]],
  [[576], [480]],
  [[60000], [175000 / 3]],
  [[1 / 38], [39 / 95]],
  [[37.5], [40]],
  [[900], [900]],
  [
    [-5 * Math.sqrt(3), 4 * Math.sqrt(3)],
    [-5 * Math.sqrt(2), -2 * Math.sqrt(2)],
  ],
  [[28000], [27500]],
  [[88], [82.5]],
  [[140], [1250 / 9]],
  [[450 / 7], [750 / 11]],
  [[40], [42]],
  [[10], [11]],
  [[144], [144]],
  [[16000], [20000]],
  [[62.5], [62.5]],
  [[7], [6]],
  [[18], [20]],
] as const;
const relations = [
  ">",
  "=",
  "≤",
  ">",
  ">",
  "<",
  "<",
  "=",
  "?",
  ">",
  ">",
  ">",
  "<",
  "<",
  "<",
  "=",
  "<",
  "=",
  ">",
  "<",
];
const symbol: Record<string, string> = {
  QUANTITY_I_GREATER: ">",
  QUANTITY_I_LESS: "<",
  QUANTITY_I_LESS_OR_EQUAL: "≤",
  QUANTITY_I_GREATER_OR_EQUAL: "≥",
};
export function auditQcpSourceCatalog() {
  let packages = 0,
    replays = 0,
    negativeCases = 0,
    canonicalCases = 0;
  const examples = [];
  for (const [i, pattern] of QCP_CATALOG_PATTERNS.entries()) {
    const canonical = generateQcp001Question({
      sourceMode: "SOURCE_CATALOG",
      sourcePattern: pattern,
      sourceScale: 1,
    });
    for (const [j, o] of [
      canonical.quantityI,
      canonical.quantityII,
    ].entries()) {
      assert(
        o.values.length === expected[i]![j]!.length,
        `${pattern}: root count`,
      );
      o.values.forEach((v, t) =>
        assert(
          Math.abs(v - expected[i]![j]![t]!) < 1e-9,
          `${pattern}: known answer`,
        ),
      );
    }
    const relation =
      symbol[canonical.answerClass] ??
      (canonical.answerEvidenceMode === "EXACT_EQUALITY" ? "=" : "?");
    assert(relation === relations[i], `${pattern}: adjudicated class`);
    canonicalCases++;
    examples.push({
      pattern,
      quantityI: canonical.quantityI,
      quantityII: canonical.quantityII,
      answerClass: canonical.answerClass,
    });
    for (let scale = 1; scale <= (pattern === "BA24-02" ? 2 : 3); scale++)
      for (const examProfile of ["BANKING_PRELIMS", "BANKING_MAINS"] as const)
        for (const language of ["en", "hi", "pa"] as const)
          for (let seed = 1; seed <= 20; seed++) {
            const input = {
              sourceMode: "SOURCE_CATALOG" as const,
              sourcePattern: pattern,
              sourceScale: scale,
              examProfile,
              language,
              seed: `QCP-CATALOG:${seed}`,
            };
            const q = generateQcp001Question(input);
            assert(
              q.validation.valid && independentlyVerifyQcp001Question(q).valid,
              `${pattern}/${scale}/${language}: verification`,
            );
            assert(
              q.traceability.contractVersion === "QCP-001-BANKING-RELATION-V5",
              "Contract",
            );
            assert(
              !/BA24|BA22|SOURCE_CATALOG|QCP-001/.test(
                q.stem + JSON.stringify(q.explanation),
              ),
              "Learner leakage",
            );
            if (seed === 1) {
              assert(
                JSON.stringify(q) ===
                  JSON.stringify(generateQcp001Question(input)),
                "Replay",
              );
              replays++;
            }
            packages++;
          }
    const mutate = (fn: (q: any) => void) => {
      const q = structuredClone(canonical);
      fn(q);
      assert(
        !independentlyVerifyQcp001Question(q).valid,
        `${pattern}: accepted corruption`,
      );
      negativeCases++;
    };
    mutate((q) => (q.quantityI.states[0].scale = 0));
    mutate((q) => (q.quantityI.states[0].rootIndex = 9));
    mutate((q) => (q.quantityI.states[0].quantity = "II"));
    mutate((q) => (q.quantityI.states[0].pattern = "BA24-05"));
    mutate((q) => (q.quantityI.sourcePackageId = "TSD-002"));
    mutate(
      (q) => (q.traceability.contractVersion = "QCP-001-BANKING-RELATION-V4"),
    );
    mutate((q) => (q.traceability.sourceTruthOwners = ["RAP-001"]));
    mutate((q) => (q.quantityI.prompt += " altered"));
    mutate((q) => (q.quantityI.values[0] += 1));
    mutate((q) => (q.stem += " altered"));
    if (canonical.quantityI.states.length === 2)
      mutate((q) => {
        q.quantityI.states.pop();
        q.quantityI.values.pop();
      });
    if (canonical.quantityII.states.length === 2)
      mutate((q) => {
        q.quantityII.states.pop();
        q.quantityII.values.pop();
      });
    const invalid = (overrides: object) => {
      let rejected = false;
      try {
        generateQcp001Question({
          sourceMode: "SOURCE_CATALOG",
          sourcePattern: pattern,
          ...overrides,
        });
      } catch {
        rejected = true;
      }
      assert(rejected, "Invalid request accepted");
      negativeCases++;
    };
    invalid({ sourceScale: 0 });
    invalid({ sourceScale: 4 });
    invalid({ sourceScale: 1.5 });
    invalid({ sourceScale: null });
    invalid({ sourcePattern: null });
  }
  for (const excluded of Object.keys(QCP_CATALOG_EXCLUSIONS)) {
    let rejected = false;
    try {
      generateQcp001Question({
        sourceMode: "SOURCE_CATALOG",
        sourcePattern: excluded as any,
      });
    } catch {
      rejected = true;
    }
    assert(rejected, "Excluded source admitted");
    negativeCases++;
  }
  const a = generateQcp001Question({
    sourceMode: "SOURCE_CATALOG",
    sourcePattern: "BA24-01",
    sourceScale: 1,
    seed: "identity",
  });
  const b = generateQcp001Question({
    sourceMode: "SOURCE_CATALOG",
    sourcePattern: "BA24-04",
    sourceScale: 1,
    seed: "identity",
  });
  const c = generateQcp001Question({
    sourceMode: "SOURCE_CATALOG",
    sourcePattern: "BA24-04",
    sourceScale: 2,
    seed: "identity",
  });
  assert(
    new Set([a.questionId, b.questionId, c.questionId]).size === 3,
    "Catalogue identity collision",
  );
  return {
    catalogPackages: packages,
    canonicalCases,
    scaleVariants: 59,
    deterministicReplays: replays,
    negativeCases,
    admittedPatterns: QCP_CATALOG_PATTERNS.length,
    excludedSources: QCP_CATALOG_EXCLUSIONS,
    corpusCoverage: "20_ADMITTED_PATTERNS_5_FINAL_EXCLUSIONS",
    allPublisherCoverageCertified: false,
    liveApprovalDeferred: true,
    examples,
  };
}
