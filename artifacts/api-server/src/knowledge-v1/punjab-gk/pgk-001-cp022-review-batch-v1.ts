import { PGK_001_CP022_FACTS } from "./pgk-001-cp022-facts";
import { PGK_001_CP022_QL147 } from "./pgk-001-cp022-ql147";
import { PGK_001_CP022_QL148 } from "./pgk-001-cp022-ql148";
import { PGK_001_CP022_QL149 } from "./pgk-001-cp022-ql149";
import { PGK_001_CP022_QL150 } from "./pgk-001-cp022-ql150";
import { PGK_001_CP022_QL151 } from "./pgk-001-cp022-ql151";
import { PGK_001_CP022_QL152 } from "./pgk-001-cp022-ql152";
import { PGK_001_CP022_QL153 } from "./pgk-001-cp022-ql153";

const QLS = [
  ["PGK-001-QL-147", PGK_001_CP022_QL147],
  ["PGK-001-QL-148", PGK_001_CP022_QL148],
  ["PGK-001-QL-149", PGK_001_CP022_QL149],
  ["PGK-001-QL-150", PGK_001_CP022_QL150],
  ["PGK-001-QL-151", PGK_001_CP022_QL151],
  ["PGK-001-QL-152", PGK_001_CP022_QL152],
  ["PGK-001-QL-153", PGK_001_CP022_QL153],
] as const;

const PROVENANCE_BY_QL: Readonly<Record<string, readonly string[]>> = Object.freeze({
  "PGK-001-QL-147": ["baba-farid-early-punjabi-poet","bulleh-shah-kafi","classical-sufi-poets"],
  "PGK-001-QL-148": ["waris-shah-heer","heer-qissa"],
  "PGK-001-QL-149": ["bhai-vir-singh-sundari","bhai-vir-singh-rana-surat-singh","bhai-vir-singh-sahitya-1955"],
  "PGK-001-QL-150": ["nanak-singh-novelist","nanak-singh-ik-miyan-do-talwaran","nanak-singh-chitta-lahu"],
  "PGK-001-QL-151": ["amrita-pritam-pinjar","amrita-pritam-warish-shah-poem","amrita-pritam-sunehure-1956","amrita-pritam-jnanpith-1981"],
  "PGK-001-QL-152": ["shiv-kumar-loona","shiv-kumar-sahitya-1967","gurdial-singh-marhi-da-deeva","gurdial-singh-adh-chanani-raat","gurdial-singh-jnanpith-1999"],
  "PGK-001-QL-153": ["mohan-singh-wadda-vela","balwant-gargi-rangmanch","kulwant-singh-virk-naven-lok","dalip-kaur-tiwana-eho-hamara-jiwana","bhai-vir-singh-sahitya-1955","amrita-pritam-sunehure-1956","nanak-singh-ik-miyan-do-talwaran","shiv-kumar-sahitya-1967","waris-shah-heer","bhai-vir-singh-sundari","amrita-pritam-pinjar","shiv-kumar-loona"],
});

function provenanceForQl(qlId: string) {
  const factIds = PROVENANCE_BY_QL[qlId] ?? [];
  const factSet = new Set(factIds);
  const sourceIds = [...new Set(
    PGK_001_CP022_FACTS
      .filter((fact) => factSet.has(fact.id))
      .flatMap((fact) => [...fact.sourceIds]),
  )];
  return Object.freeze({ factIds: Object.freeze([...factIds]), sourceIds: Object.freeze(sourceIds) });
}

export const PGK_001_CP022_REVIEW_BATCH_V1 = Object.freeze(
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
];

export function auditPgk001Cp022ReviewBatchV1() {
  const questions = PGK_001_CP022_REVIEW_BATCH_V1;
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
