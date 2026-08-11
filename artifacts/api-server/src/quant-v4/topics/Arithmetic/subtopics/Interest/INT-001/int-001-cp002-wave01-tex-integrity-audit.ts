import { generateIntCp002Wave01Prototype as generateV1 } from "./cp002-wave01-runtime";
import {
  assertIntCp002Wave01MathJaxIntegrity,
  generateIntCp002Wave01PrototypeV2,
} from "./cp002-wave01-runtime-v2";
import { INT_CP002_WAVE01_PROTOTYPE_IDS } from "./cp002-wave01-types";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function stable(value: unknown): string {
  return JSON.stringify(value, (_key, item) => typeof item === "bigint" ? item.toString() : item);
}

function learnerText(question: ReturnType<typeof generateIntCp002Wave01PrototypeV2>): string {
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
let integrityChecks = 0;
let requiredCommandChecks = 0;
let legacyControlSequencesDetected = 0;
let repairedControlSequencesRemaining = 0;

for (const prototypeId of INT_CP002_WAVE01_PROTOTYPE_IDS) {
  for (let index = 1; index <= 100; index += 1) {
    const seed = `int-cp002-wave01-tex-audit:${prototypeId}:${index}`;
    const v1 = generateV1({ prototypeId, seed });
    const v2 = generateIntCp002Wave01PrototypeV2({ prototypeId, seed });
    const replay = generateIntCp002Wave01PrototypeV2({ prototypeId, seed });
    assert(stable(v2) === stable(replay), `${prototypeId}/${index}: V2 deterministic replay drift`);
    deterministicChecks += 1;

    assert(v2.stem === v1.stem, `${prototypeId}/${index}: stem changed during TeX repair`);
    assert(stable(v2.options) === stable(v1.options), `${prototypeId}/${index}: options changed during TeX repair`);
    assert(v2.correctIndex === v1.correctIndex, `${prototypeId}/${index}: correct index changed during TeX repair`);
    assert(stable(v2.solution) === stable(v1.solution), `${prototypeId}/${index}: solution changed during TeX repair`);
    assert(stable(v2.sourceState) === stable(v1.sourceState), `${prototypeId}/${index}: hidden state changed during TeX repair`);
    assert(stable(v2.optionAudit) === stable(v1.optionAudit), `${prototypeId}/${index}: option audit changed during TeX repair`);
    frozenMathematicsChecks += 6;

    const v1Text = learnerText(v1);
    const v2Text = learnerText(v2);
    legacyControlSequencesDetected += (v1Text.match(/[\u0009\u000C]/gu) ?? []).length;
    repairedControlSequencesRemaining += (v2Text.match(/[\u0009\u000C]/gu) ?? []).length;
    assertIntCp002Wave01MathJaxIntegrity(v2Text, `${prototypeId}/${index}`);
    assert(!/[\u0000-\u0008\u0009\u000B\u000C\u000E-\u001F]/u.test(v2Text), `${prototypeId}/${index}: control character remains after V2 repair`);
    assert(!/(?:\u000crac|\u0009imes|\u0009ext)/u.test(v2Text), `${prototypeId}/${index}: escaped control-token fragment remains`);
    assert(!/<sub>Trace:|INT-QL-|INT-CP002-PROT-|requestedSeed|effectiveSeed|generationAttempts|FIND_/u.test(v2Text), `${prototypeId}/${index}: internal metadata leaked into V2 learner text`);
    integrityChecks += 4;

    assert(v2Text.includes("\\frac"), `${prototypeId}/${index}: repaired explanation does not contain a valid \\frac command`);
    assert(v2Text.includes("\\times"), `${prototypeId}/${index}: repaired explanation does not contain a valid \\times command`);
    if (prototypeId === "INT-CP002-PROT-DAY-COUNT") {
      assert(v2Text.includes("\\text"), `${prototypeId}/${index}: day-count explanation lacks repaired \\text command`);
      requiredCommandChecks += 1;
    }
    if (prototypeId === "INT-CP002-PROT-COUNTERFACTUAL-CHANGE") {
      assert(v2Text.includes("\\Delta"), `${prototypeId}/${index}: counterfactual explanation lacks repaired \\Delta command`);
      requiredCommandChecks += 1;
    }
    requiredCommandChecks += 2;
    questions += 1;
  }
}

assert(legacyControlSequencesDetected > 0, "TeX audit failed to reproduce the superseded V1 control-character defect");
assert(repairedControlSequencesRemaining === 0, "V2 TeX repair left control sequences in learner text");

console.log(JSON.stringify({
  packageId: "INT-001",
  canonicalProblemId: "INT-CP-002",
  auditId: "INT-CP-002-WAVE01-TEX-INTEGRITY-V2",
  questions,
  deterministicChecks,
  frozenMathematicsChecks,
  integrityChecks,
  requiredCommandChecks,
  legacyControlSequencesDetected,
  repairedControlSequencesRemaining,
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
console.log("PASS_INT_CP002_WAVE01_TEX_INTEGRITY_V2");
