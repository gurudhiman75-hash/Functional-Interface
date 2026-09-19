import { generatePolCp001ReviewBatchV1 } from "./constitutional-history/pol-cp001-review-generator-v1";
import { generatePolCp002ReviewBatchV2 } from "./constituent-assembly/pol-cp002-review-generator-v2";
import { generatePolCp003ReviewBatchV3 } from "./preamble-union-citizenship/pol-cp003-review-generator-v3";
import { generatePolCp004ReviewBatchV3 } from "./fundamental-rights/pol-cp004-review-generator-v3";
import { generatePolCp005ReviewBatchV3 } from "./directive-principles-duties/pol-cp005-review-generator-v3";
import { generatePolCp006ReviewBatchV3 } from "./amendments-basic-structure-schedules/pol-cp006-review-generator-v3";
import { generatePolCp007ReviewBatchV7 } from "./president/pol-cp007-review-generator-v7";
import { generatePolCp008ReviewBatchV7 } from "./vice-president/pol-cp008-review-generator-v7";
import { generatePolCp009ReviewBatchV1 } from "./prime-minister-union-council/pol-cp009-review-generator-v1";
import { generatePolCp010ReviewBatchV1 } from "./parliament-structure-officers/pol-cp010-review-generator-v1";
import { generatePolCp011ReviewBatchV2 } from "./parliament-procedure-finance/pol-cp011-review-generator-v2";
import { generatePolCp012ReviewBatchV3 } from "./supreme-court/pol-cp012-review-generator-v3";
import { generatePolCp013ReviewBatchV2 } from "./high-courts-subordinate-judiciary-writs/pol-cp013-review-generator-v2";
import { generatePolCp014ReviewBatchV2 } from "./governor/pol-cp014-review-generator-v2";
import { generatePolCp015ReviewBatchV1 } from "./chief-minister-state-council/pol-cp015-review-generator-v1";
import { generatePolCp016ReviewBatchV2 } from "./state-legislature/pol-cp016-review-generator-v2";
import { generatePolCp017ReviewBatchV2 } from "./centre-state-relations/pol-cp017-review-generator-v2";
import { generatePolCp018ReviewBatchV1 } from "./emergency-provisions/pol-cp018-review-generator-v1";
import { generatePolCp019ReviewBatchV1 } from "./panchayati-raj/pol-cp019-review-generator-v1";
import { generatePolCp020ReviewBatchV1 } from "./municipalities/pol-cp020-review-generator-v1";
import { generatePolCp021ReviewBatchV1 } from "./elections-representation-anti-defection/pol-cp021-review-candidate-v1";
import { generatePolCp022ReviewBatchV2 } from "./constitutional-bodies/pol-cp022-review-candidate-v2";
import { generatePolCp023ReviewBatchV1 } from "./statutory-executive-bodies/pol-cp023-review-candidate-v1";
import { generatePolCp024ReviewBatchV1 } from "./official-language-scheduled-tribal-areas/pol-cp024-review-candidate-v1";
import { generatePolCp025ReviewBatchV1 } from "./union-territories-special-state-provisions/pol-cp025-review-candidate-v1";
import { generatePolCp026ReviewBatchV1 } from "./public-services-administrative-tribunals/pol-cp026-review-candidate-v1";
import { generatePolCp027ReviewBatchV1 } from "./trade-commerce-cooperative-societies/pol-cp027-review-candidate-v1";

type AuditQuestion = {
  questionId: string;
  qlId: string;
  difficulty: string;
  stem: string;
  options: readonly string[];
  correctIndex: number;
  canonicalAnswer?: string;
  explanation: string;
  sourceIds: readonly string[];
  sourceFactIds?: readonly string[];
  reviewOnly?: boolean;
  runtimeRegistered?: boolean;
};

const batches: Array<[string, AuditQuestion[]]> = [
  ["POL-CP-001", generatePolCp001ReviewBatchV1()],
  ["POL-CP-002", generatePolCp002ReviewBatchV2()],
  ["POL-CP-003", generatePolCp003ReviewBatchV3()],
  ["POL-CP-004", generatePolCp004ReviewBatchV3()],
  ["POL-CP-005", generatePolCp005ReviewBatchV3()],
  ["POL-CP-006", generatePolCp006ReviewBatchV3()],
  ["POL-CP-007", generatePolCp007ReviewBatchV7()],
  ["POL-CP-008", generatePolCp008ReviewBatchV7()],
  ["POL-CP-009", generatePolCp009ReviewBatchV1()],
  ["POL-CP-010", generatePolCp010ReviewBatchV1()],
  ["POL-CP-011", generatePolCp011ReviewBatchV2()],
  ["POL-CP-012", generatePolCp012ReviewBatchV3()],
  ["POL-CP-013", generatePolCp013ReviewBatchV2()],
  ["POL-CP-014", generatePolCp014ReviewBatchV2()],
  ["POL-CP-015", generatePolCp015ReviewBatchV1()],
  ["POL-CP-016", generatePolCp016ReviewBatchV2()],
  ["POL-CP-017", generatePolCp017ReviewBatchV2()],
  ["POL-CP-018", generatePolCp018ReviewBatchV1()],
  ["POL-CP-019", generatePolCp019ReviewBatchV1()],
  ["POL-CP-020", generatePolCp020ReviewBatchV1()],
  ["POL-CP-021", generatePolCp021ReviewBatchV1()],
  ["POL-CP-022", generatePolCp022ReviewBatchV2()],
  ["POL-CP-023", generatePolCp023ReviewBatchV1()],
  ["POL-CP-024", generatePolCp024ReviewBatchV1()],
  ["POL-CP-025", generatePolCp025ReviewBatchV1()],
  ["POL-CP-026", generatePolCp026ReviewBatchV1()],
  ["POL-CP-027", generatePolCp027ReviewBatchV1()],
];

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function norm(text: string): string {
  return text.toLowerCase().replace(/\s+/g, " ").replace(/[?.!,;:'"“”‘’()]/g, "").trim();
}

const globalIds = new Set<string>();
const exactSemanticSignature = new Map<string, Array<{ cpId: string; questionId: string }>>();
let total = 0;

for (const [cpId, questions] of batches) {
  assert(questions.length > 0, `${cpId}: empty review batch`);
  const ids = new Set<string>();
  const signatures = new Set<string>();
  const answerPositions = new Set<number>();

  for (const q of questions) {
    total += 1;
    assert(q.questionId && !ids.has(q.questionId), `${cpId}: duplicate question ID ${q.questionId}`);
    ids.add(q.questionId);
    assert(!globalIds.has(q.questionId), `Global duplicate question ID ${q.questionId}`);
    globalIds.add(q.questionId);

    assert(q.qlId?.length > 0, `${q.questionId}: missing QL ID`);
    assert(["Easy", "Medium", "Hard"].includes(q.difficulty), `${q.questionId}: invalid difficulty ${q.difficulty}`);
    assert(q.stem?.trim().length > 0, `${q.questionId}: empty stem`);

    assert(q.options?.length === 4, `${q.questionId}: expected four options`);
    assert(new Set(q.options).size === 4, `${q.questionId}: duplicate option values`);
    assert(Number.isInteger(q.correctIndex) && q.correctIndex >= 0 && q.correctIndex < 4, `${q.questionId}: invalid correct index`);
    const resolvedAnswer = q.options[q.correctIndex];
    assert(resolvedAnswer?.trim().length > 0, `${q.questionId}: empty resolved answer`);
    if (q.canonicalAnswer !== undefined) {
      assert(resolvedAnswer === q.canonicalAnswer, `${q.questionId}: canonical answer/index mismatch`);
    }
    answerPositions.add(q.correctIndex);

    assert(q.explanation?.trim().length > 0, `${q.questionId}: empty explanation`);
    assert(q.sourceIds?.length > 0, `${q.questionId}: missing source IDs`);
    if ("sourceFactIds" in q && q.sourceFactIds !== undefined) {
      assert(q.sourceFactIds.length > 0, `${q.questionId}: empty source-fact IDs`);
    }
    if ("runtimeRegistered" in q) assert(q.runtimeRegistered !== true, `${q.questionId}: review content unexpectedly runtime-registered`);

    const semanticSignature = [
      norm(q.stem),
      [...q.options].map(norm).sort().join("||"),
      norm(q.canonicalAnswer ?? q.options[q.correctIndex]),
    ].join("|||");
    assert(!signatures.has(semanticSignature), `${cpId}: duplicate semantic question ${q.questionId}`);
    signatures.add(semanticSignature);
    const list = exactSemanticSignature.get(semanticSignature) ?? [];
    list.push({ cpId, questionId: q.questionId });
    exactSemanticSignature.set(semanticSignature, list);
  }

  assert(answerPositions.size === 4, `${cpId}: all four correct-option positions are not represented`);
}

const crossCpExactDuplicates = [...exactSemanticSignature.entries()]
  .map(([key, refs]) => ({ key, refs }))
  .filter(({ refs }) => new Set(refs.map(r => r.cpId)).size > 1);

if (crossCpExactDuplicates.length) {
  const details = crossCpExactDuplicates
    .map(d => d.refs.map(r => `${r.cpId}/${r.questionId}`).join(" <-> "))
    .join("\n");
  throw new Error(`Cross-CP exact semantic duplicates found:\n${details}`);
}

function requireQualification(cpId: string, predicate: (q: AuditQuestion) => boolean, snippets: string[]) {
  const batch = batches.find(([id]) => id === cpId)?.[1] ?? [];
  const targets = batch.filter(predicate);
  assert(targets.length > 0, `${cpId}: no qualification targets found`);
  for (const q of targets) for (const snippet of snippets) {
    assert(q.explanation.includes(snippet), `${q.questionId}: qualification explanation missing "${snippet}"`);
  }
}

requireQualification("POL-CP-007", q => q.qlId === "POL-007-QL-007", [
  "• Citizen of India", "• At least 35 years old", "• Qualified for election to Lok Sabha",
]);
requireQualification("POL-CP-008", q => q.qlId === "POL-008-QL-009", [
  "• Citizen of India", "• At least 35 years old", "• Qualified for election to Rajya Sabha",
]);
requireQualification("POL-CP-012", q => q.qlId === "POL-012-QL-004", [
  "• Citizen of India", "• At least 5 years as a High Court Judge", "• At least 10 years as a High Court advocate",
]);
requireQualification("POL-CP-013", q => q.qlId === "POL-013-QL-005", [
  "• Citizen of India", "• At least 10 years in judicial office in India", "• At least 10 years as an advocate of a High Court",
]);

const governor = batches.find(([id]) => id === "POL-CP-014")![1];
for (const q of [governor[16], governor[17]]) {
  assert(q.explanation.includes("• Citizen of India") && q.explanation.includes("• At least 35 years old"), `${q.questionId}: incomplete Governor qualifications`);
}

const stateLeg = batches.find(([id]) => id === "POL-CP-016")![1];
for (const q of [stateLeg[18], stateLeg[19]]) {
  assert(q.explanation.includes("• Citizen of India"), `${q.questionId}: missing citizenship qualification`);
  assert(q.explanation.includes("• Make the prescribed oath or affirmation"), `${q.questionId}: missing oath qualification`);
  assert(q.explanation.includes("• Meet any other qualifications prescribed by Parliament by law"), `${q.questionId}: missing statutory qualification link`);
}

console.log(JSON.stringify({
  chapter: "POL-001",
  cpCount: batches.length,
  questionCount: total,
  crossCpExactStemAnswerDuplicates: 0,
  qualificationBackfill: "PASS",
  structuralAudit: "PASS",
}, null, 2));
