import { PGK_001_CP020_FACTS, PGK_001_CP020_SOURCE_IDS } from "./pgk-001-cp020-facts";
import { PGK_001_CP020_QL133 } from "./pgk-001-cp020-ql133";
import { PGK_001_CP020_QL134 } from "./pgk-001-cp020-ql134";
import { PGK_001_CP020_QL135 } from "./pgk-001-cp020-ql135";
import { PGK_001_CP020_QL136 } from "./pgk-001-cp020-ql136";
import { PGK_001_CP020_QL137 } from "./pgk-001-cp020-ql137";
import { PGK_001_CP020_QL138 } from "./pgk-001-cp020-ql138";
import { PGK_001_CP020_QL139 } from "./pgk-001-cp020-ql139";

const QLS = [
  ["PGK-001-QL-133", PGK_001_CP020_QL133],
  ["PGK-001-QL-134", PGK_001_CP020_QL134],
  ["PGK-001-QL-135", PGK_001_CP020_QL135],
  ["PGK-001-QL-136", PGK_001_CP020_QL136],
  ["PGK-001-QL-137", PGK_001_CP020_QL137],
  ["PGK-001-QL-138", PGK_001_CP020_QL138],
  ["PGK-001-QL-139", PGK_001_CP020_QL139],
] as const;

const PROVENANCE_BY_QL: Readonly<Record<string, readonly string[]>> = Object.freeze({
  "PGK-001-QL-133": ["population-total","population-male","population-female","decadal-growth","density"],
  "PGK-001-QL-134": ["sex-ratio-total","sex-ratio-rural","sex-ratio-urban","child-sex-ratio-total","child-sex-ratio-rural","child-sex-ratio-urban"],
  "PGK-001-QL-135": ["literacy-total","literacy-male","literacy-female","literacy-rural","literacy-urban","literacy-definition"],
  "PGK-001-QL-136": ["rural-population","urban-population","rural-share","urban-share","literacy-rural","literacy-urban","sex-ratio-rural","sex-ratio-urban"],
  "PGK-001-QL-137": ["sc-population","sc-share","urban-share","literacy-total","decadal-growth"],
  "PGK-001-QL-138": ["district-population-high","district-population-low","district-sex-ratio-high","district-sex-ratio-low","district-literacy-high","district-literacy-low","district-density-high","district-density-low"],
  "PGK-001-QL-139": ["population-total","sex-ratio-total","child-sex-ratio-total","literacy-total","literacy-male","literacy-female","literacy-rural","literacy-urban","rural-share","urban-share","sc-share","district-sex-ratio-high","district-sex-ratio-low","district-literacy-high","district-literacy-low","district-density-high","district-density-low"],
});

function provenanceForQl(qlId: string) {
  const factIds = PROVENANCE_BY_QL[qlId] ?? [];
  const factSet = new Set(factIds);
  const sourceKeys = (PGK_001_CP020_FACTS as readonly { id: string; sourceKeys: readonly string[] }[])
    .filter((fact) => factSet.has(fact.id))
    .flatMap((fact) => fact.sourceKeys);
  const sourceIds = [...new Set(sourceKeys.map((key) => PGK_001_CP020_SOURCE_IDS[key as keyof typeof PGK_001_CP020_SOURCE_IDS]))];
  return Object.freeze({ factIds: Object.freeze([...factIds]), sourceIds: Object.freeze(sourceIds) });
}

export const PGK_001_CP020_REVIEW_BATCH_V1 = Object.freeze(
  QLS.flatMap(([qlId, payloads]) => payloads.map((payload, index) => Object.freeze({
    id: `${qlId}-R${String(index + 1).padStart(2, "0")}`,
    qlId,
    ...payload,
    ...provenanceForQl(qlId),
    reviewOnly: true as const,
    runtimeRegistered: false as const,
  })))
);

const BANNED = [
  "associated with",
  "closely associated",
  "linked with",
  "closely linked",
  "known for",
  "formed the framework",
  "according to the source",
  "school history",
  "the correct answer is",
  "the correct option",
  "the other options",
  "this question tests",
  "review batch",
  "generator",
  "20-district geography",
];

export function auditPgk001Cp020ReviewBatchV1() {
  const questions = PGK_001_CP020_REVIEW_BATCH_V1;
  const errors: string[] = [];

  if (questions.length !== 42) errors.push(`Expected 42 questions, found ${questions.length}`);

  for (const [qlId] of QLS) {
    const count = questions.filter((q) => q.qlId === qlId).length;
    if (count !== 6) errors.push(`${qlId}: expected 6 questions, found ${count}`);
  }

  for (const q of questions) {
    if (q.options.length !== 4 || new Set(q.options).size !== 4) errors.push(`${q.id}: options must be four unique values`);
    if (!q.options.includes(q.answer as never)) errors.push(`${q.id}: answer is not present in options`);
    if (!q.reviewOnly || q.runtimeRegistered) errors.push(`${q.id}: invalid lifecycle flags`);

    const learner = `${q.stem}\n${q.explanation}`.toLowerCase();
    for (const term of BANNED) if (learner.includes(term)) errors.push(`${q.id}: banned wording '${term}'`);

    const sentenceCount = q.explanation.split(/[.!?]+/).map((s) => s.trim()).filter(Boolean).length;
    if (sentenceCount < 2 || sentenceCount > 3) errors.push(`${q.id}: explanation should contain 2-3 short sentences`);

    const stemLooksNumeric = /\b(population|density|ratio|literacy|share|percentage|percent|growth)\b/i.test(q.stem);
    if (stemLooksNumeric && !/2011|2001-2011/i.test(q.stem) && !q.qlId.endsWith("139")) {
      errors.push(`${q.id}: numeric demographic stem should identify the Census 2011 snapshot`);
    }
  }

  return Object.freeze({ ok: errors.length === 0, errors: Object.freeze(errors) });
}
