import { NUM_CP003_PROTOTYPE_IDS } from "../../foundation/types";
import { NUM_CP003_WAVE02_IDS } from "../wave02/types";
import { NUM_CP003_WAVE03_IDS } from "../wave03/types";
import { NUM_CP003_WAVE04_IDS } from "../wave04/types";
import { NUM_CP003_WAVE05_IDS } from "../wave05/types";
import {
  NUM_CP003_NON_RETAINED_PROTOTYPE_DISPOSITIONS,
  NUM_CP003_RETAINED_TEMPLATE_REGISTRY,
} from "./template-registry";

function ok(value: unknown, message: string): void {
  if (!value) throw new Error(message);
}

function equal(actual: unknown, expected: unknown, message: string): void {
  if (actual !== expected) throw new Error(`${message}: ${String(actual)} !== ${String(expected)}`);
}

const allExploratoryIds = [
  ...NUM_CP003_PROTOTYPE_IDS,
  ...NUM_CP003_WAVE02_IDS,
  ...NUM_CP003_WAVE03_IDS,
  ...NUM_CP003_WAVE04_IDS,
  ...NUM_CP003_WAVE05_IDS,
];

const retainedAncestry = NUM_CP003_RETAINED_TEMPLATE_REGISTRY.flatMap((entry) => [...entry.prototypeAncestry]);
const nonRetainedIds = NUM_CP003_NON_RETAINED_PROTOTYPE_DISPOSITIONS.map((entry) => entry.prototypeId);
const classifiedIds = [...retainedAncestry, ...nonRetainedIds];

const allSet = new Set(allExploratoryIds);
const retainedSet = new Set(retainedAncestry);
const nonRetainedSet = new Set(nonRetainedIds);
const classifiedSet = new Set(classifiedIds);

// Complete exploratory accounting.
equal(allExploratoryIds.length, 38, "Unexpected exploratory inventory size");
equal(allSet.size, 38, "Exploratory prototype IDs are not unique");
equal(retainedAncestry.length, 23, "Unexpected retained prototype ancestry size");
equal(retainedSet.size, 23, "A retained prototype appears in more than one template");
equal(nonRetainedIds.length, 15, "Unexpected non-retained disposition size");
equal(nonRetainedSet.size, 15, "A non-retained prototype has duplicate dispositions");
equal(classifiedIds.length, 38, "Every exploratory prototype must have exactly one classification");
equal(classifiedSet.size, 38, "Prototype classifications overlap");

for (const prototypeId of allSet) {
  ok(classifiedSet.has(prototypeId), `Missing disposition for ${prototypeId}`);
}
for (const prototypeId of classifiedSet) {
  ok(allSet.has(prototypeId), `Unknown prototype in registry/disposition ledger: ${prototypeId}`);
}
for (const prototypeId of retainedSet) {
  ok(!nonRetainedSet.has(prototypeId), `Prototype is both retained and non-retained: ${prototypeId}`);
}

// Registry identity and lifecycle locks.
equal(NUM_CP003_RETAINED_TEMPLATE_REGISTRY.length, 17, "Expected 17 temporary template rows");
const labels = NUM_CP003_RETAINED_TEMPLATE_REGISTRY.map((entry) => entry.temporaryTemplateLabel);
equal(new Set(labels).size, 17, "Temporary template labels are not unique");
for (let index = 0; index < labels.length; index += 1) {
  equal(labels[index], `NUM-CP003-QLT2-${String(index + 1).padStart(2, "0")}`, "Temporary labels are not continuous");
}

for (const entry of NUM_CP003_RETAINED_TEMPLATE_REGISTRY) {
  equal(entry.permanentQlId, null, `${entry.temporaryTemplateLabel}: permanent ID leak`);
  equal(entry.publiclyPublishable, false, `${entry.temporaryTemplateLabel}: public exposure leak`);
  equal(entry.questionStudioDiscoverable, false, `${entry.temporaryTemplateLabel}: Question Studio exposure leak`);
  ok(entry.sourceEvidence.length > 0, `${entry.temporaryTemplateLabel}: missing source evidence`);
  ok(entry.prototypeAncestry.length > 0, `${entry.temporaryTemplateLabel}: missing prototype ancestry`);
}

// Authority and representation compression.
const authorities = new Set(NUM_CP003_RETAINED_TEMPLATE_REGISTRY.map((entry) => entry.authorityId));
equal(authorities.size, 7, `Expected seven authorities, received ${[...authorities].join(", ")}`);
const standardCount = NUM_CP003_RETAINED_TEMPLATE_REGISTRY.filter((entry) => entry.representation === "STANDARD").length;
const dataSufficiencyCount = NUM_CP003_RETAINED_TEMPLATE_REGISTRY.filter((entry) => entry.representation === "DATA_SUFFICIENCY").length;
const claimCount = NUM_CP003_RETAINED_TEMPLATE_REGISTRY.filter((entry) => entry.representation === "CLAIM").length;
equal(standardCount, 15, "Expected fifteen numerical/task templates");
equal(dataSufficiencyCount, 1, "Expected one data-sufficiency template");
equal(claimCount, 1, "Expected one claim template");

const extremumParameterRows = NUM_CP003_RETAINED_TEMPLATE_REGISTRY
  .filter((entry) => entry.extremumDirectionParameter)
  .map((entry) => entry.temporaryTemplateLabel);
equal(extremumParameterRows.length, 4, "Expected four direction-parameter templates");

// The two meta-rule prototypes must stay outside the learner registry.
for (const studyOnlyId of [
  "NUM-CP003-W4-PROT-DIVISOR-FROM-RULE",
  "NUM-CP003-W4-PROT-RULE-FROM-DIVISOR",
]) {
  ok(!retainedSet.has(studyOnlyId), `${studyOnlyId} must remain study-only`);
  const row = NUM_CP003_NON_RETAINED_PROTOTYPE_DISPOSITIONS.find((entry) => entry.prototypeId === studyOnlyId);
  equal(row?.disposition, "STUDY_ONLY", `${studyOnlyId}: incorrect disposition`);
}

const dispositionCounts = NUM_CP003_NON_RETAINED_PROTOTYPE_DISPOSITIONS.reduce<Record<string, number>>((counts, entry) => {
  counts[entry.disposition] = (counts[entry.disposition] ?? 0) + 1;
  return counts;
}, {});
equal(dispositionCounts.REJECT, 3, "Rejected prototype count changed");
equal(dispositionCounts.REASSIGN, 2, "Reassigned prototype count changed");
equal(dispositionCounts.OWNERSHIP_HOLD, 8, "Ownership-hold prototype count changed");
equal(dispositionCounts.STUDY_ONLY, 2, "Study-only prototype count changed");

console.log(JSON.stringify({
  status: "PASS",
  exploratoryPrototypeCount: allSet.size,
  retainedPrototypeCount: retainedSet.size,
  nonRetainedPrototypeCount: nonRetainedSet.size,
  retainedTemplateCount: NUM_CP003_RETAINED_TEMPLATE_REGISTRY.length,
  authorityCount: authorities.size,
  representationCounts: {
    standard: standardCount,
    dataSufficiency: dataSufficiencyCount,
    claim: claimCount,
  },
  extremumParameterRows,
  dispositionCounts,
  permanentQlCount: 0,
}, null, 2));
