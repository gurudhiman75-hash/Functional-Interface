import { readFileSync } from "node:fs";
import {
  generateMalCp006Wave02FinalAuthorityV4,
  MAL_CP006_WAVE02_CONTAINER_OBJECTS,
  MAL_CP006_WAVE02_FINAL_AUTHORITY_V4_ID,
  MAL_CP006_WAVE02_OBJECT_CONTEXTS,
} from "./foundation/cp006-wave02-final-authority-v4";
import { MAL_CP006_WAVE02_PROTOTYPE_IDS } from "./foundation/cp006-source-fixtures-wave02";

type LiquidEntity = { id: string; en: string };
const liquidLibrary = JSON.parse(
  readFileSync("src/quant-v4/common/entity-libraries/liquid-library.json", "utf8"),
) as LiquidEntity[];
const liquidById = new Map(liquidLibrary.map((item) => [item.id, item]));

const failures: string[] = [];
const positions = [0, 0, 0, 0];
let generated = 0;
let passed = 0;
const stats: Record<string, {
  states: Set<string>;
  shapes: Set<number>;
  contexts: Set<string>;
  containers: Set<string>;
  objectCombinations: Set<string>;
}> = {};

const contextIds = new Set<string>();
for (const context of MAL_CP006_WAVE02_OBJECT_CONTEXTS) {
  if (contextIds.has(context.id)) failures.push(`duplicate object context id ${context.id}`);
  contextIds.add(context.id);
  if (context.primaryId === context.secondaryId) failures.push(`${context.id}: primary and secondary liquid are identical`);
  const primary = liquidById.get(context.primaryId);
  const secondary = liquidById.get(context.secondaryId);
  if (!primary) failures.push(`${context.id}: primary ${context.primaryId} missing from canonical liquid library`);
  if (!secondary) failures.push(`${context.id}: secondary ${context.secondaryId} missing from canonical liquid library`);
  if (primary && primary.en.toLowerCase() !== context.primary.toLowerCase()) failures.push(`${context.id}: primary label drift ${primary.en} / ${context.primary}`);
  if (secondary && secondary.en.toLowerCase() !== context.secondary.toLowerCase()) failures.push(`${context.id}: secondary label drift ${secondary.en} / ${context.secondary}`);
  for (const container of context.containers) {
    if (!MAL_CP006_WAVE02_CONTAINER_OBJECTS.includes(container)) failures.push(`${context.id}: unknown container ${container}`);
  }
}

const expectedObjectCombinations = new Set(
  MAL_CP006_WAVE02_OBJECT_CONTEXTS.flatMap((context) => context.containers.map((container) => `${context.id}:${container}`)),
);

for (const id of MAL_CP006_WAVE02_PROTOTYPE_IDS) {
  const s = {
    states: new Set<string>(),
    shapes: new Set<number>(),
    contexts: new Set<string>(),
    containers: new Set<string>(),
    objectCombinations: new Set<string>(),
  };
  stats[id] = s;

  for (let i = 0; i < 1200; i += 1) {
    const seed = `mal-cp006-wave02-final-v4:${id}:${i}`;
    const q = generateMalCp006Wave02FinalAuthorityV4(id, seed);
    const q2 = generateMalCp006Wave02FinalAuthorityV4(id, seed);
    generated += 1;
    s.states.add(q.stateKey);
    s.shapes.add(q.stemShape);
    s.contexts.add(q.objectContextId);
    s.containers.add(q.containerObject);
    s.objectCombinations.add(`${q.objectContextId}:${q.containerObject}`);
    positions[q.correctIndex] += 1;

    const text = [q.stem, ...q.options, ...q.explanation, q.commonMistake].join(" ");
    const ok =
      q.validation.ok &&
      JSON.stringify(q) === JSON.stringify(q2) &&
      q.stem.endsWith("?") &&
      q.explanation.length === 4 &&
      q.options.length === 4 &&
      new Set(q.options).size === 4 &&
      q.options[q.correctIndex] === q.answer &&
      !text.includes("→") &&
      !text.includes("component load") &&
      !text.includes("state key") &&
      q.permanentQlId === null &&
      q.permanentSolveModeId === null &&
      !q.active &&
      !q.publiclyPublishable &&
      !q.questionStudioDiscoverable &&
      !q.questionBankWritable &&
      !q.testEligible;

    if (ok) passed += 1;
    else failures.push(`${id}:${i}:${q.validation.errors.join("|")}`);
  }

  if (s.states.size !== 16) failures.push(`${id}: expected 16 numerical states, got ${s.states.size}`);
  if (s.shapes.size !== 8) failures.push(`${id}: expected 8 stem structures, got ${s.shapes.size}`);
  if (s.contexts.size !== MAL_CP006_WAVE02_OBJECT_CONTEXTS.length) failures.push(`${id}: object context coverage ${s.contexts.size}`);
  if (s.containers.size !== MAL_CP006_WAVE02_CONTAINER_OBJECTS.length) failures.push(`${id}: container object coverage ${s.containers.size}`);
  const missingCombinations = [...expectedObjectCombinations].filter((item) => !s.objectCombinations.has(item));
  if (missingCombinations.length) failures.push(`${id}: missing object combinations ${missingCombinations.join(",")}`);
}

if (positions.some((n) => n < 500)) failures.push(`answer position imbalance ${positions.join("/")}`);

const report = {
  status: failures.length ? "FAIL_MAL_CP006_WAVE02_FINAL_V4" : "PASS_MAL_CP006_WAVE02_FINAL_V4",
  authorityId: MAL_CP006_WAVE02_FINAL_AUTHORITY_V4_ID,
  generated,
  passed,
  answerPositions: positions,
  objectPool: {
    canonicalLibrary: "src/quant-v4/common/entity-libraries/liquid-library.json",
    canonicalLibraryEntities: liquidLibrary.length,
    materialContexts: MAL_CP006_WAVE02_OBJECT_CONTEXTS.map((x) => x.id),
    materialContextCount: MAL_CP006_WAVE02_OBJECT_CONTEXTS.length,
    containerObjects: [...MAL_CP006_WAVE02_CONTAINER_OBJECTS],
    allowedObjectCombinations: expectedObjectCombinations.size,
    policy: "use canonical liquid-library entities through an exam-suitable homogeneous/miscible pair allowlist; do not blindly combine all liquids",
  },
  prototypes: Object.fromEntries(Object.entries(stats).map(([id, s]) => [id, {
    states: s.states.size,
    stemShapes: s.shapes.size,
    objectContexts: s.contexts.size,
    containerObjects: s.containers.size,
    objectCombinations: s.objectCombinations.size,
  }])),
  alligation: "NOT_A_CP006_CORE_SOLVE_MODE",
  permanentQls: 0,
  permanentSolveModes: 0,
  failures,
};

console.log(JSON.stringify(report, null, 2));
if (failures.length) process.exitCode = 1;
