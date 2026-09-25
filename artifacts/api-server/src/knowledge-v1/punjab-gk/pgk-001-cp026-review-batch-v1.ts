import { PGK_001_CP026_FACTS } from "./pgk-001-cp026-facts";
import { PGK_001_CP026_QL175 } from "./pgk-001-cp026-ql175";
import { PGK_001_CP026_QL176 } from "./pgk-001-cp026-ql176";
import { PGK_001_CP026_QL177 } from "./pgk-001-cp026-ql177";
import { PGK_001_CP026_QL178 } from "./pgk-001-cp026-ql178";
import { PGK_001_CP026_QL179 } from "./pgk-001-cp026-ql179";
import { PGK_001_CP026_QL180 } from "./pgk-001-cp026-ql180";
import { PGK_001_CP026_QL181 } from "./pgk-001-cp026-ql181";
import { PGK_001_CP026_QL182 } from "./pgk-001-cp026-ql182";

const QLS = [
  ["PGK-001-QL-175", PGK_001_CP026_QL175],
  ["PGK-001-QL-176", PGK_001_CP026_QL176],
  ["PGK-001-QL-177", PGK_001_CP026_QL177],
  ["PGK-001-QL-178", PGK_001_CP026_QL178],
  ["PGK-001-QL-179", PGK_001_CP026_QL179],
  ["PGK-001-QL-180", PGK_001_CP026_QL180],
  ["PGK-001-QL-181", PGK_001_CP026_QL181],
  ["PGK-001-QL-182", PGK_001_CP026_QL182],
] as const;

const PROVENANCE_BY_QL: Readonly<Record<string, readonly string[]>> = Object.freeze({
  "PGK-001-QL-175": ["amritsar-harmandir-jallianwala","tarn-taran-goindwal","gurdaspur-kalanaur","pathankot-ranjit-sagar"],
  "PGK-001-QL-176": ["jalandhar-sports-goods","kapurthala-science-city","kapurthala-sultanpur-jagatjit","hoshiarpur-wood-inlay","sbs-khatkar-kalan"],
  "PGK-001-QL-177": ["ludhiana-pau-bicycles","moga-food-processing","barnala-textile-combine","sangrur-sunam","malerkotla-princely"],
  "PGK-001-QL-178": ["patiala-nis-qila","patiala-old-moti-bagh","fatehgarh-mandi-gobindgarh","sas-iiser","rupnagar-harappan"],
  "PGK-001-QL-179": ["bathinda-qila-damdama","mansa-cotton","faridkot-baba-farid","ferozepur-hussainiwala","fazilka-abohar","muktsar-chali-mukte"],
  "PGK-001-QL-180": ["jalandhar-sports-goods","ludhiana-pau-bicycles","fatehgarh-mandi-gobindgarh","moga-food-processing","barnala-textile-combine","sas-iiser","kapurthala-science-city"],
  "PGK-001-QL-181": ["amritsar-harmandir-jallianwala","harike-confluence-multidistrict","gurdaspur-kalanaur","gurdaspur-dera-baba-nanak","kapurthala-sultanpur-jagatjit","rupnagar-harappan","ferozepur-hussainiwala","muktsar-mukta-minar"],
  "PGK-001-QL-182": ["pathankot-ranjit-sagar","hoshiarpur-wood-inlay","sangrur-sunam","mansa-cotton","sbs-khatkar-kalan","kapurthala-science-city","jalandhar-sports-goods","patiala-nis-qila","fatehgarh-mandi-gobindgarh","sas-iiser","rupnagar-harappan","bathinda-qila-damdama","faridkot-baba-farid","ferozepur-hussainiwala","fazilka-abohar","barnala-textile-combine","moga-food-processing","malerkotla-princely","amritsar-harmandir-jallianwala","gurdaspur-kalanaur","ludhiana-pau-bicycles","muktsar-chali-mukte"],
});

function provenanceForQl(qlId: string) {
  const factIds = PROVENANCE_BY_QL[qlId] ?? [];
  const factSet = new Set(factIds);
  const sourceIds = [...new Set(
    PGK_001_CP026_FACTS
      .filter((fact) => factSet.has(fact.id))
      .flatMap((fact) => [...fact.sourceIds]),
  )];
  return Object.freeze({ factIds: Object.freeze([...factIds]), sourceIds: Object.freeze(sourceIds) });
}

export const PGK_001_CP026_REVIEW_BATCH_V1 = Object.freeze(
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

export function auditPgk001Cp026ReviewBatchV1() {
  const questions = PGK_001_CP026_REVIEW_BATCH_V1;
  const errors: string[] = [];
  if (questions.length !== 48) errors.push(`Expected 48 questions, found ${questions.length}`);
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
