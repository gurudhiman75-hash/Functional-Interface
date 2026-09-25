import { PGK_001_CP024_FACTS } from "./pgk-001-cp024-facts";
import { PGK_001_CP024_QL161 } from "./pgk-001-cp024-ql161";
import { PGK_001_CP024_QL162 } from "./pgk-001-cp024-ql162";
import { PGK_001_CP024_QL163 } from "./pgk-001-cp024-ql163";
import { PGK_001_CP024_QL164 } from "./pgk-001-cp024-ql164";
import { PGK_001_CP024_QL165 } from "./pgk-001-cp024-ql165";
import { PGK_001_CP024_QL166 } from "./pgk-001-cp024-ql166";
import { PGK_001_CP024_QL167 } from "./pgk-001-cp024-ql167";

const QLS = [
  ["PGK-001-QL-161", PGK_001_CP024_QL161],
  ["PGK-001-QL-162", PGK_001_CP024_QL162],
  ["PGK-001-QL-163", PGK_001_CP024_QL163],
  ["PGK-001-QL-164", PGK_001_CP024_QL164],
  ["PGK-001-QL-165", PGK_001_CP024_QL165],
  ["PGK-001-QL-166", PGK_001_CP024_QL166],
  ["PGK-001-QL-167", PGK_001_CP024_QL167],
] as const;

const PROVENANCE_BY_QL: Readonly<Record<string, readonly string[]>> = Object.freeze({
  "PGK-001-QL-161": ["hola-anandpur","keshgarh-khalsa-1699","virasat-anandpur"],
  "PGK-001-QL-162": ["maghi-muktsar","forty-mukte","muktsar-name"],
  "PGK-001-QL-163": ["shaheedi-fatehgarh","shaheedi-december","fatehgarh-bhora"],
  "PGK-001-QL-164": ["baisakhi-harvest","baisakhi-khalsa","harballabh-jalandhar","harballabh-1875","baba-sodal-jalandhar","kila-raipur"],
  "PGK-001-QL-165": ["harmandir-amritsar","jallianwala-amritsar","gobindgarh-amritsar","ram-tirath-amritsar"],
  "PGK-001-QL-166": ["qila-mubarak-patiala","qila-mubarak-1763","sheesh-mahal-patiala","moti-bagh-patiala","virasat-anandpur","virasat-open-2011","virasat-architect"],
  "PGK-001-QL-167": ["hola-anandpur","keshgarh-khalsa-1699","virasat-anandpur","virasat-open-2011","maghi-muktsar","shaheedi-fatehgarh","baisakhi-harvest","baisakhi-khalsa","harballabh-jalandhar","harballabh-1875","kila-raipur","harmandir-amritsar","jallianwala-amritsar","gobindgarh-amritsar","qila-mubarak-patiala","qila-mubarak-1763","sheesh-mahal-patiala"],
});

function provenanceForQl(qlId: string) {
  const factIds = PROVENANCE_BY_QL[qlId] ?? [];
  const factSet = new Set(factIds);
  const sourceIds = [...new Set(
    PGK_001_CP024_FACTS
      .filter((fact) => factSet.has(fact.id))
      .flatMap((fact) => [...fact.sourceIds]),
  )];
  return Object.freeze({ factIds: Object.freeze([...factIds]), sourceIds: Object.freeze(sourceIds) });
}

export const PGK_001_CP024_REVIEW_BATCH_V1 = Object.freeze(
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
  "according to",
  "school history",
  "the correct answer is",
  "the correct option",
  "the other options",
  "this question tests",
  "review batch",
  "generator",
  "cp024",
  "traditionally",
  "mainly",
  "generally",
  "commonly",
  "widely",
  "usually",
  "best described",
];

export function auditPgk001Cp024ReviewBatchV1() {
  const questions = PGK_001_CP024_REVIEW_BATCH_V1;
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
  }

  return Object.freeze({ ok: errors.length === 0, errors: Object.freeze(errors) });
}
