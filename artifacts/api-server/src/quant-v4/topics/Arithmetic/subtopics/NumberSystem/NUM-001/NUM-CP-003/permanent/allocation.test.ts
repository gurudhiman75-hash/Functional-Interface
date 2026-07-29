import {
  NUM_CP003_PERMANENT_ALLOCATION,
  NUM_CP003_PERMANENT_QL_IDS,
  NUM_CP003_PERMANENT_SOLVE_MODE_IDS,
} from "./allocation";
import { runNumCp003PermanentPipeline } from "./runtime";
import { generateNumCp003RetainedQuestion } from "../retained/runtime-reviewed";

const ok = (value: unknown, message: string): void => {
  if (!value) throw new Error(message);
};
const equal = (actual: unknown, expected: unknown, message: string): void => {
  if (actual !== expected) {
    throw new Error(`${message}: ${String(actual)} !== ${String(expected)}`);
  }
};
const stable = (value: unknown): string => JSON.stringify(
  value,
  (_key, item) => typeof item === "bigint" ? item.toString() : item,
);

const expectedIds = Array.from(
  { length: 17 },
  (_unused, index) => `NUM-QL-${String(index + 1).padStart(3, "0")}`,
);
equal(NUM_CP003_PERMANENT_ALLOCATION.length, 17, "allocation row count");
equal(NUM_CP003_PERMANENT_QL_IDS.length, 17, "permanent QL count");
equal(new Set(NUM_CP003_PERMANENT_QL_IDS).size, 17, "permanent QL uniqueness");
equal(stable(NUM_CP003_PERMANENT_QL_IDS), stable(expectedIds), "continuous NUM-QL range");
equal(new Set(NUM_CP003_PERMANENT_SOLVE_MODE_IDS).size, 7, "solve-mode count");
equal(
  new Set(NUM_CP003_PERMANENT_ALLOCATION.map((entry) => entry.temporaryTemplateLabel)).size,
  17,
  "temporary-template ancestry uniqueness",
);
equal(
  new Set(NUM_CP003_PERMANENT_ALLOCATION.map((entry) => entry.qlTemplateId)).size,
  17,
  "permanent template-family uniqueness",
);
equal(
  new Set(NUM_CP003_PERMANENT_ALLOCATION.map((entry) => entry.solveModeId)).size,
  7,
  "allocated solve-mode reach",
);

for (const entry of NUM_CP003_PERMANENT_ALLOCATION) {
  equal(entry.packageId, "NUM-001", `${entry.qlId}: package`);
  equal(entry.cpId, "NUM-CP-003", `${entry.qlId}: CP`);
  equal(entry.language, "en", `${entry.qlId}: language`);
  equal(entry.difficultyPolicy, "STATE_DERIVED", `${entry.qlId}: difficulty policy`);
  equal(entry.allocationStatus, "ALLOCATED_IMPLEMENTATION_PROOF", `${entry.qlId}: allocation status`);
  equal(entry.permanentIdentityFrozen, true, `${entry.qlId}: identity freeze`);
  equal(entry.active, false, `${entry.qlId}: active leak`);
  equal(entry.publiclyPublishable, false, `${entry.qlId}: public leak`);
  equal(entry.questionStudioDiscoverable, false, `${entry.qlId}: Question Studio leak`);
  equal(entry.questionBankWritable, false, `${entry.qlId}: Question Bank write leak`);
  equal(entry.testEligible, false, `${entry.qlId}: test leak`);
  ok(entry.sourceEvidence.length > 0, `${entry.qlId}: source evidence missing`);
  ok(entry.prototypeAncestry.length > 0, `${entry.qlId}: prototype ancestry missing`);
}

let generated = 0;
const chapterDifficulties = new Set<string>();
const answerSemantics = new Set<string>();
const positionsByQl = new Map<string, Set<number>>();
const summaries: Record<string, unknown> = {};

for (const allocation of NUM_CP003_PERMANENT_ALLOCATION) {
  const positions = new Set<number>();
  const fingerprints = new Set<string>();
  const stems = new Set<string>();
  const answers = new Set<string>();

  for (let index = 0; index < 100; index += 1) {
    const seed = `permanent-proof-${index}`;
    const first = runNumCp003PermanentPipeline({
      questionLanguageId: allocation.qlId,
      seed,
      language: "en",
    });
    const second = runNumCp003PermanentPipeline({
      questionLanguageId: allocation.qlId,
      seed,
      language: "en",
    });
    const retained = generateNumCp003RetainedQuestion(
      allocation.temporaryTemplateLabel,
      seed,
    );

    equal(stable(first), stable(second), `${allocation.qlId}/${seed}: non-deterministic`);
    equal(first.permanentQlId, allocation.qlId, `${allocation.qlId}/${seed}: permanent ID`);
    equal(first.questionLanguageId, allocation.qlId, `${allocation.qlId}/${seed}: QL trace`);
    equal(first.temporaryTemplateLabel, allocation.temporaryTemplateLabel, `${allocation.qlId}/${seed}: ancestry`);
    equal(first.traceability.qlTemplateId, allocation.qlTemplateId, `${allocation.qlId}/${seed}: template trace`);
    equal(first.traceability.solveModeId, allocation.solveModeId, `${allocation.qlId}/${seed}: solve-mode trace`);
    equal(first.traceability.authorityId, allocation.authorityId, `${allocation.qlId}/${seed}: authority trace`);
    equal(first.traceability.answerSemantic, allocation.answerSemantic, `${allocation.qlId}/${seed}: semantic trace`);
    equal(first.validation.ok, true, `${allocation.qlId}/${seed}: retained validation`);
    equal(first.options[first.correctIndex], first.answer, `${allocation.qlId}/${seed}: answer index`);
    equal(new Set(first.options).size, first.options.length, `${allocation.qlId}/${seed}: duplicate options`);
    equal(first.options.length, allocation.representation === "DATA_SUFFICIENCY" ? 5 : 4, `${allocation.qlId}/${seed}: option convention`);
    equal(first.reviewStatus, "PERMANENT_IMPLEMENTATION_PROOF", `${allocation.qlId}/${seed}: review status`);
    equal(first.maturity, "IMPLEMENTATION_PROOF", `${allocation.qlId}/${seed}: maturity`);
    equal(first.allocationStatus, "ALLOCATED_IMPLEMENTATION_PROOF", `${allocation.qlId}/${seed}: allocation status`);
    equal(first.permanentIdentityFrozen, true, `${allocation.qlId}/${seed}: identity freeze`);
    equal(first.active, false, `${allocation.qlId}/${seed}: active leak`);
    equal(first.questionBankStatus, "NOT_STORED", `${allocation.qlId}/${seed}: Question Bank state`);
    equal(first.questionBankWritable, false, `${allocation.qlId}/${seed}: Question Bank write leak`);
    equal(first.testEligibility, "INELIGIBLE", `${allocation.qlId}/${seed}: test state`);
    equal(first.testEligible, false, `${allocation.qlId}/${seed}: test leak`);
    equal(first.publiclyPublishable, false, `${allocation.qlId}/${seed}: public leak`);
    equal(first.questionStudioDiscoverable, false, `${allocation.qlId}/${seed}: Question Studio leak`);

    const permanentLearnerSurface = {
      stem: first.stem,
      answer: first.answer,
      options: first.options,
      correctIndex: first.correctIndex,
      optionAudit: first.optionAudit,
      hiddenState: first.hiddenState,
      explanation: first.explanation,
      reasoningGraph: first.reasoningGraph,
      fingerprint: first.fingerprint,
      difficulty: first.difficulty,
      answerSemantic: first.answerSemantic,
    };
    const retainedLearnerSurface = {
      stem: retained.stem,
      answer: retained.answer,
      options: retained.options,
      correctIndex: retained.correctIndex,
      optionAudit: retained.optionAudit,
      hiddenState: retained.hiddenState,
      explanation: retained.explanation,
      reasoningGraph: retained.reasoningGraph,
      fingerprint: retained.fingerprint,
      difficulty: retained.difficulty,
      answerSemantic: retained.answerSemantic,
    };
    equal(
      stable(permanentLearnerSurface),
      stable(retainedLearnerSurface),
      `${allocation.qlId}/${seed}: allocation changed learner or mathematical authority`,
    );

    positions.add(first.correctIndex);
    fingerprints.add(first.fingerprint);
    stems.add(first.stem);
    answers.add(first.answer);
    chapterDifficulties.add(first.difficulty);
    answerSemantics.add(first.answerSemantic);
    generated += 1;
  }

  equal(
    positions.size,
    allocation.representation === "DATA_SUFFICIENCY" ? 5 : 4,
    `${allocation.qlId}: answer-position reach`,
  );
  ok(fingerprints.size >= 65, `${allocation.qlId}: fingerprint diversity ${fingerprints.size}`);
  const minimumStemDiversity = allocation.representation === "CLAIM" ? 8 : 55;
  ok(stems.size >= minimumStemDiversity, `${allocation.qlId}: stem diversity ${stems.size}`);
  ok(answers.size >= 3, `${allocation.qlId}: answer diversity ${answers.size}`);
  positionsByQl.set(allocation.qlId, positions);
  summaries[allocation.qlId] = {
    temporaryTemplateLabel: allocation.temporaryTemplateLabel,
    qlTemplateId: allocation.qlTemplateId,
    solveModeId: allocation.solveModeId,
    positions: [...positions].sort(),
    distinctFingerprints: fingerprints.size,
    distinctStems: stems.size,
    distinctAnswers: answers.size,
  };
}

equal(generated, 1700, "generated package count");
equal(chapterDifficulties.size, 3, `difficulty reach ${[...chapterDifficulties]}`);
ok(answerSemantics.size >= 9, `answer semantic reach ${[...answerSemantics]}`);
equal(positionsByQl.size, 17, "position-map QL reach");

let unknownRejected = false;
try {
  runNumCp003PermanentPipeline({ questionLanguageId: "NUM-QL-999" as never });
} catch {
  unknownRejected = true;
}
ok(unknownRejected, "unknown permanent QL was accepted");

let languageRejected = false;
try {
  runNumCp003PermanentPipeline({ language: "hi" as never });
} catch {
  languageRejected = true;
}
ok(languageRejected, "unsupported language was accepted");

console.log(JSON.stringify({
  status: "PASS_NUM_CP003_PERMANENT_ALLOCATION_IMPLEMENTATION_PROOF",
  approvalDecision: "APPROVE_17_TEMPLATE_BOUNDARIES",
  permanentQlRange: "NUM-QL-001..NUM-QL-017",
  permanentQlCount: NUM_CP003_PERMANENT_QL_IDS.length,
  frozenTemplateFamilies: NUM_CP003_PERMANENT_ALLOCATION.length,
  frozenSolveModes: NUM_CP003_PERMANENT_SOLVE_MODE_IDS.length,
  generated,
  difficulties: [...chapterDifficulties].sort(),
  answerSemantics: [...answerSemantics].sort(),
  activeQlCount: NUM_CP003_PERMANENT_ALLOCATION.filter((entry) => entry.active).length,
  publiclyPublishableCount: NUM_CP003_PERMANENT_ALLOCATION.filter((entry) => entry.publiclyPublishable).length,
  questionStudioDiscoverableCount: NUM_CP003_PERMANENT_ALLOCATION.filter((entry) => entry.questionStudioDiscoverable).length,
  questionBankWritableCount: NUM_CP003_PERMANENT_ALLOCATION.filter((entry) => entry.questionBankWritable).length,
  testEligibleCount: NUM_CP003_PERMANENT_ALLOCATION.filter((entry) => entry.testEligible).length,
  summaries,
}, null, 2));
