import { PGK_001_CP025_FACTS } from "./pgk-001-cp025-facts";
import { PGK_001_CP025_QL168 } from "./pgk-001-cp025-ql168";
import { PGK_001_CP025_QL169 } from "./pgk-001-cp025-ql169";
import { PGK_001_CP025_QL170 } from "./pgk-001-cp025-ql170";
import { PGK_001_CP025_QL171 } from "./pgk-001-cp025-ql171";
import { PGK_001_CP025_QL172 } from "./pgk-001-cp025-ql172";
import { PGK_001_CP025_QL173 } from "./pgk-001-cp025-ql173";
import { PGK_001_CP025_QL174 } from "./pgk-001-cp025-ql174";

const QLS = [
  ["PGK-001-QL-168", PGK_001_CP025_QL168],
  ["PGK-001-QL-169", PGK_001_CP025_QL169],
  ["PGK-001-QL-170", PGK_001_CP025_QL170],
  ["PGK-001-QL-171", PGK_001_CP025_QL171],
  ["PGK-001-QL-172", PGK_001_CP025_QL172],
  ["PGK-001-QL-173", PGK_001_CP025_QL173],
  ["PGK-001-QL-174", PGK_001_CP025_QL174],
] as const;

const PROVENANCE_BY_QL: Readonly<Record<string, readonly string[]>> = Object.freeze({
  "PGK-001-QL-168": ["milkha-flying-sikh","milkha-three-olympics","milkha-title-ayub","milkha-rome-1960"],
  "PGK-001-QL-169": ["balbir-three-golds","balbir-1956-captain","balbir-1952-final-five"],
  "PGK-001-QL-170": ["ajit-pal-1975","ajit-pal-final-pakistan","ajit-pal-world-cup-medals","ajit-pal-sansarpur"],
  "PGK-001-QL-171": ["pargat-olympic-captain","pargat-mithapur","manpreet-tokyo","manpreet-mithapur"],
  "PGK-001-QL-172": ["randhawa-athletics","randhawa-1962","randhawa-tokyo-1964","randhawa-arjuna-1961","randhawa-padma-2005"],
  "PGK-001-QL-173": ["maharaja-ranjit-award","paramjeet-2006","paramjeet-athletics","paramjeet-400-record-1998"],
  "PGK-001-QL-174": ["milkha-rome-1960","ajit-pal-1975","randhawa-1962","pargat-olympic-captain","pargat-mithapur","manpreet-tokyo","manpreet-mithapur","randhawa-tokyo-1964","randhawa-arjuna-1961","paramjeet-2006","balbir-1956-captain"],
});

function provenanceForQl(qlId: string) {
  const factIds = PROVENANCE_BY_QL[qlId] ?? [];
  const factSet = new Set(factIds);
  const sourceIds = [...new Set(
    PGK_001_CP025_FACTS
      .filter((fact) => factSet.has(fact.id))
      .flatMap((fact) => [...fact.sourceIds]),
  )];
  return Object.freeze({ factIds: Object.freeze([...factIds]), sourceIds: Object.freeze(sourceIds) });
}

export const PGK_001_CP025_REVIEW_BATCH_V1 = Object.freeze(
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
  "associated with", "closely associated", "linked with", "closely linked",
  "the correct answer is", "the correct option", "the other options",
  "this question tests", "review batch", "generator",
];

export function auditPgk001Cp025ReviewBatchV1() {
  const questions = PGK_001_CP025_REVIEW_BATCH_V1;
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
    if (sentenceCount < 1 || sentenceCount > 3) errors.push(`${q.id}: explanation should contain 1-3 short sentences`);
  }
  return Object.freeze({ ok: errors.length === 0, errors: Object.freeze(errors) });
}
