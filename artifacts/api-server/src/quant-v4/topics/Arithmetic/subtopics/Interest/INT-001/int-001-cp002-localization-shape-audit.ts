import assert from "node:assert/strict";
import { INT_CP002_FINAL_QL_IDS } from "./cp002-final-registry";
import { generateIntCp002EnglishFrozenQuestion } from "./cp002-english-frozen-runtime";

function json(value: unknown) {
  return JSON.stringify(value, (_key, current) => {
    if (typeof current === "bigint") return `${current}n`;
    return current;
  });
}

const inventory: Array<Record<string, unknown>> = [];
for (const qlId of INT_CP002_FINAL_QL_IDS) {
  const question = generateIntCp002EnglishFrozenQuestion(qlId, `int-cp002-localization-shape:${qlId}`);
  assert.equal(question.validation.ok, true, `${qlId}: frozen English source failed validation`);
  const provenance = question.internalProvenance.sourceState as Record<string, unknown> | undefined;
  const values = provenance && typeof provenance === "object"
    ? (provenance.values as Record<string, unknown> | undefined)
    : undefined;
  inventory.push({
    qlId,
    topology: question.topology,
    taskDirection: question.taskDirection,
    answerSemantic: question.answerSemantic,
    sourceKind: question.internalProvenance.sourceKind,
    sourcePrototypeId: question.internalProvenance.sourcePrototypeId,
    valueKeys: values ? Object.keys(values).sort() : [],
    values: values ?? null,
    stem: question.stem,
    workedSteps: question.explanation.workedSteps,
  });
}

assert.equal(inventory.length, 31);
assert.equal(new Set(inventory.map((item) => item.qlId)).size, 31);
console.log("PASS_INT_CP002_LOCALIZATION_SHAPE_AUDIT");
for (const item of inventory) console.log(json(item));
