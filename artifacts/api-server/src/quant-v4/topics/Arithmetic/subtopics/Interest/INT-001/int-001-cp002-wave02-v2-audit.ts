import { generateIntCp002Wave02Question as generateV1 } from "./cp002-wave02-runtime";
import {
  generateIntCp002Wave02QuestionV2,
  INT_CP002_WAVE02_RUNTIME_V2,
} from "./cp002-wave02-runtime-v2";
import { INT_CP002_WAVE02_PROTOTYPE_IDS } from "./cp002-wave02-types";
import { verifyIntCp002Wave02Candidate } from "./cp002-wave02-verifier";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function stable(value: unknown): string {
  return JSON.stringify(value, (_key, item) => typeof item === "bigint" ? item.toString() : item);
}

function learnerText(question: ReturnType<typeof generateIntCp002Wave02QuestionV2>): string {
  return [
    question.stem,
    ...question.options,
    question.explanation.mainRule,
    ...question.explanation.workedSteps,
    question.explanation.examShortcut,
    question.explanation.verification,
    question.explanation.conclusion,
    ...question.explanation.trapAnalysis.map((item) => item.explanation),
  ].join("\n");
}

let questions = 0;
let deterministicChecks = 0;
let frozenMathematicsChecks = 0;
let independentOptionChecks = 0;
let wrongOptionRejections = 0;
let texIntegrityChecks = 0;
let expandedRepaymentTimeChecks = 0;

for (const prototypeId of INT_CP002_WAVE02_PROTOTYPE_IDS) {
  for (let index = 1; index <= 100; index += 1) {
    const seed = `int-cp002-wave02-v2-audit:${prototypeId}:${index}`;
    const v1 = generateV1({ prototypeId, seed });
    const v2 = generateIntCp002Wave02QuestionV2({ prototypeId, seed });
    const replay = generateIntCp002Wave02QuestionV2({ prototypeId, seed });
    assert(stable(v2) === stable(replay), `${prototypeId}/${index}: V2 deterministic replay drift`);
    deterministicChecks += 1;

    assert(v2.stem === v1.stem, `${prototypeId}/${index}: stem changed in V2`);
    assert(stable(v2.state) === stable(v1.state), `${prototypeId}/${index}: hidden state changed in V2`);
    assert(stable(v2.solution) === stable(v1.solution), `${prototypeId}/${index}: solution changed in V2`);
    assert(stable(v2.options) === stable(v1.options), `${prototypeId}/${index}: options changed in V2`);
    assert(stable(v2.optionAudit) === stable(v1.optionAudit), `${prototypeId}/${index}: option audit changed in V2`);
    assert(v2.correctIndex === v1.correctIndex, `${prototypeId}/${index}: correct index changed in V2`);
    assert(v2.answerSemantic === v1.answerSemantic, `${prototypeId}/${index}: answer semantic changed in V2`);
    assert(v2.difficulty === v1.difficulty, `${prototypeId}/${index}: difficulty changed in V2`);
    frozenMathematicsChecks += 8;

    let accepted = 0;
    for (const option of v2.optionAudit) {
      const verifies = verifyIntCp002Wave02Candidate(v2, option.value);
      if (verifies) accepted += 1;
      if (option.misconceptionId === "CORRECT") {
        assert(verifies, `${prototypeId}/${index}: correct option failed V2 verifier`);
      } else {
        assert(!verifies, `${prototypeId}/${index}: wrong option ${option.misconceptionId} passed V2 verifier`);
        wrongOptionRejections += 1;
      }
      independentOptionChecks += 1;
    }
    assert(accepted === 1, `${prototypeId}/${index}: V2 verifier accepted ${accepted} options`);

    const text = learnerText(v2);
    assert(!/[\u0000-\u0008\u0009\u000B\u000C\u000E-\u001F]/u.test(text), `${prototypeId}/${index}: control character in V2 learner text`);
    assert(!/(^|[^\\])(?:frac\{|times\b|text\{|Delta\b)/u.test(text.match(/\$\$[\s\S]*?\$\$|\$[^$]+\$/gu)?.join("\n") ?? ""), `${prototypeId}/${index}: bare TeX command in V2`);
    assert(!/<sub>Trace:|INT-QL-|INT-CP002-W02-|requestedSeed|effectiveSeed|generationAttempts|FIND_/u.test(text), `${prototypeId}/${index}: internal metadata leaked in V2`);
    assert((text.match(/\$\$/gu) ?? []).length % 2 === 0, `${prototypeId}/${index}: unbalanced display math in V2`);
    texIntegrityChecks += 4;

    if (prototypeId === "INT-CP002-W02-PARTIAL-REPAYMENT-TIME") {
      assert(v2.explanation.workedSteps.length === 5, `${prototypeId}/${index}: V2 must show five repayment-time steps`);
      assert(v2.explanation.workedSteps[3]?.startsWith("Expand:"), `${prototypeId}/${index}: explicit expansion step missing`);
      assert(v2.explanation.workedSteps[4]?.startsWith("Collect terms and divide:"), `${prototypeId}/${index}: coefficient collection step missing`);
      assert(/t=\\frac\{/u.test(v2.explanation.workedSteps[4] ?? ""), `${prototypeId}/${index}: final numerical division missing`);
      expandedRepaymentTimeChecks += 4;
    } else {
      assert(stable(v2.explanation) === stable(v1.explanation), `${prototypeId}/${index}: unrelated explanation changed in V2`);
      expandedRepaymentTimeChecks += 1;
    }

    questions += 1;
  }
}

console.log(JSON.stringify({
  packageId: "INT-001",
  canonicalProblemId: "INT-CP-002",
  auditId: "INT-CP-002-WAVE02-INVERSE-SATURATION-V2",
  runtimeId: INT_CP002_WAVE02_RUNTIME_V2.id,
  questions,
  deterministicChecks,
  frozenMathematicsChecks,
  independentOptionChecks,
  wrongOptionRejections,
  texIntegrityChecks,
  expandedRepaymentTimeChecks,
  permanentQlCount: 0,
  frozenSolveContractCount: 0,
  enabled: false,
  stagingStatus: "NOT_STAGED",
  registrationStatus: "NOT_REGISTERED",
  questionStudioDiscoverable: false,
  questionBankStatus: "NOT_STORED",
  testEligibility: "INELIGIBLE",
  publiclyPublishable: false,
}, null, 2));
console.log("PASS_INT_CP002_WAVE02_INVERSE_SATURATION_V2");
