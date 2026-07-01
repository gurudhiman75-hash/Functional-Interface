import { strict as assert } from "node:assert";
import type {
  EEV2DetailMode,
  TutorThinkingTrace,
} from "../../../../../../../common/eev2/contracts";
import type { PercentOfKnownNumberEvidence } from "./evidence";
import {
  PERCENT_OF_KNOWN_NUMBER_ENGLISH_ASSETS,
  PERCENT_OF_KNOWN_NUMBER_ENGLISH_FAMILY_VERSION,
} from "./english-language-family";
import { buildPercentOfKnownNumberGraph } from "./graph-builder";
import { renderPercentOfKnownNumberEnglish } from "./language-renderer";
import {
  PERCENT_OF_KNOWN_NUMBER_ROLE_KINDS,
  planPercentOfKnownNumberExplanation,
} from "./planner";
import { buildPercentOfKnownNumberTrace } from "./trace-builder";

const evidence: PercentOfKnownNumberEvidence = {
  evidenceId: "PCT-001:PCT-QL-017:case-001:unit-value-evidence",
  evidenceVersion: "1.0.0",
  taskKind: "percentOfKnownNumber",
  methodFamily: "UNIT_VALUE",
  sourceValues: {
    knownUnitCount: 20,
    knownQuantity: 600,
    targetUnitCount: 25,
  },
  derivedValues: {
    singleUnitValue: 31,
    targetQuantity: 777,
  },
  exactValues: {
    singleUnitValue: { numerator: 600, denominator: 20 },
    targetQuantity: { numerator: 15_000, denominator: 20 },
  },
  units: {
    knownUnitCount: "percentage-point",
    knownQuantity: "abstract-number",
    targetUnitCount: "percentage-point",
    singleUnitValue: "abstract-number",
    targetQuantity: "abstract-number",
  },
  metadata: {
    exactness: "rational",
    roundingPolicy: "defer-to-presentation",
    countIntegrity: "not-required",
  },
};

const trace = buildPercentOfKnownNumberTrace(evidence);
const graph = buildPercentOfKnownNumberGraph(trace);
const modes: readonly EEV2DetailMode[] = ["short", "standard", "detailed"];

for (const mode of modes) {
  assert.deepEqual(
    Object.keys(PERCENT_OF_KNOWN_NUMBER_ENGLISH_ASSETS[mode]),
    PERCENT_OF_KNOWN_NUMBER_ROLE_KINDS,
    `${mode}: every semantic role must have an English asset`,
  );

  const plan = planPercentOfKnownNumberExplanation(graph, mode);
  const planBeforeRendering = JSON.stringify(plan);
  const first = renderPercentOfKnownNumberEnglish(plan, trace);
  const second = renderPercentOfKnownNumberEnglish(plan, trace);

  assert.deepEqual(first, second, `${mode}: rendering must be deterministic`);
  assert.equal(first.locale, "en");
  assert.equal(
    first.languageFamilyVersion,
    PERCENT_OF_KNOWN_NUMBER_ENGLISH_FAMILY_VERSION,
  );
  assert.deepEqual(
    first.roles.map((role) => role.roleKind),
    PERCENT_OF_KNOWN_NUMBER_ROLE_KINDS,
    `${mode}: renderer must preserve role ordering`,
  );
  assert.equal(
    JSON.stringify(plan),
    planBeforeRendering,
    `${mode}: renderer must not mutate planner visibility`,
  );

  for (const renderedRole of first.roles) {
    const plannedRole = plan.roles.find(
      (role) => role.roleId === renderedRole.roleId,
    )!;
    assert.deepEqual(
      renderedRole.visibility,
      plannedRole.visibility,
      `${mode}: renderer must carry visibility through unchanged`,
    );
    assert.ok(renderedRole.sentence.length > 0);
    assert.equal(
      (renderedRole.sentence.match(/[.!?](?:\s|$)/g) ?? []).length,
      1,
      `${mode}:${renderedRole.roleKind}: one educational sentence required`,
    );
  }

  const renderedText = first.roles
    .flatMap((role) => [role.sentence, role.math ?? ""])
    .join("\n");
  assert.doesNotMatch(
    renderedText,
    /using the formula|substitut(?:e|ing) values|applying percentage formula|hence the required answer is obtained|completing the arithmetic|notice that/i,
  );
  assert.doesNotMatch(
    renderedText,
    /\bformula\b|\bsubstitut(?:e|ion|ing)\b|\bsimplif(?:y|ication)\b/i,
  );
  assert.ok(
    renderedText.includes("31"),
    `${mode}: supplied one-unit value must be rendered`,
  );
  assert.ok(
    renderedText.includes("777"),
    `${mode}: supplied target value must be rendered`,
  );
  assert.equal(
    renderedText.includes("30"),
    false,
    `${mode}: renderer must not recalculate the one-unit value`,
  );
  assert.equal(
    renderedText.includes("750"),
    false,
    `${mode}: renderer must not recalculate the target value`,
  );
}

const studentsTrace: TutorThinkingTrace = {
  ...trace,
  unitRefs: trace.unitRefs.map((unitRef) =>
    unitRef.refId === "unit:quantity"
      ? { ...unitRef, semanticUnit: "students" }
      : unitRef,
  ),
};
const studentsPlan = planPercentOfKnownNumberExplanation(graph, "standard");
const studentsOutput = renderPercentOfKnownNumberEnglish(
  studentsPlan,
  studentsTrace,
);
assert.match(
  studentsOutput.roles.find(
    (role) => role.roleKind === "ANSWER_INTERPRETATION",
  )!.sentence,
  /777 students/,
);

console.log("ENG-006 English Language Family tests passed.");
