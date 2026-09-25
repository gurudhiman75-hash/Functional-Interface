import { PGK_001_CP021_FACTS, PGK_001_CP021_SOURCE_IDS } from "./pgk-001-cp021-facts";
import { PGK_001_CP021_QL140 } from "./pgk-001-cp021-ql140";
import { PGK_001_CP021_QL141 } from "./pgk-001-cp021-ql141";
import { PGK_001_CP021_QL142 } from "./pgk-001-cp021-ql142";
import { PGK_001_CP021_QL143 } from "./pgk-001-cp021-ql143";
import { PGK_001_CP021_QL144 } from "./pgk-001-cp021-ql144";
import { PGK_001_CP021_QL145 } from "./pgk-001-cp021-ql145";
import { PGK_001_CP021_QL146 } from "./pgk-001-cp021-ql146";

const QLS = [
  ["PGK-001-QL-140", PGK_001_CP021_QL140],
  ["PGK-001-QL-141", PGK_001_CP021_QL141],
  ["PGK-001-QL-142", PGK_001_CP021_QL142],
  ["PGK-001-QL-143", PGK_001_CP021_QL143],
  ["PGK-001-QL-144", PGK_001_CP021_QL144],
  ["PGK-001-QL-145", PGK_001_CP021_QL145],
  ["PGK-001-QL-146", PGK_001_CP021_QL146],
] as const;

const PROVENANCE_BY_QL: Readonly<Record<string, readonly string[]>> = Object.freeze({
  "PGK-001-QL-140": ["official-language-punjabi","official-language-gurmukhi"],
  "PGK-001-QL-141": ["gurmukhi-guru-angad","gurmukhi-khadur"],
  "PGK-001-QL-142": ["painti-35","vowel-bearers","additional-consonants","nukta"],
  "PGK-001-QL-143": ["matra-kanna","matra-sihari","matra-bihari","matra-aunkar","matra-dulainkar","matra-lavan","matra-dulavan","matra-hora","matra-kanaura"],
  "PGK-001-QL-144": ["bindi","tippi","addak","nukta"],
  "PGK-001-QL-145": ["punjabi-tonal","gurmukhi-tone","gurmukhi-direction","gurmukhi-digits"],
  "PGK-001-QL-146": ["painti-35","vowel-bearers","additional-consonants","nukta","punjabi-tonal","gurmukhi-tone","gurmukhi-direction","gurmukhi-digits"],
});

function provenanceForQl(qlId: string) {
  const factIds = PROVENANCE_BY_QL[qlId] ?? [];
  const factSet = new Set(factIds);
  const sourceKeys = (PGK_001_CP021_FACTS as readonly { id: string; sourceKeys: readonly string[] }[])
    .filter((fact) => factSet.has(fact.id))
    .flatMap((fact) => fact.sourceKeys);
  const sourceIds = [...new Set(sourceKeys.map((key) => PGK_001_CP021_SOURCE_IDS[key as keyof typeof PGK_001_CP021_SOURCE_IDS]))];
  return Object.freeze({ factIds: Object.freeze([...factIds]), sourceIds: Object.freeze(sourceIds) });
}

export const PGK_001_CP021_REVIEW_BATCH_V1 = Object.freeze(
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
  "source:",
  "unicode",
  "punjabi university",
  "government of punjab",
  "the correct answer is",
  "the correct option",
  "the other options",
  "this question tests",
  "review batch",
  "generator",
  "invented the gurmukhi",
];

export function auditPgk001Cp021ReviewBatchV1() {
  const questions = PGK_001_CP021_REVIEW_BATCH_V1;
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
