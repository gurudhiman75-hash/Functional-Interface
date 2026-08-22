import { TSD_CP007_EXAM_REVIEW_ENGLISH_AUTHORING_REGISTRY } from "./english-authoring-exam-review";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`TSD-CP-007 English semantic-contract proof failed: ${message}`);
}

const families = new Map(
  TSD_CP007_EXAM_REVIEW_ENGLISH_AUTHORING_REGISTRY.flatMap((ql) => ql.stemFamilies.map((family) => [family.familyId, family] as const)),
);

function family(id: string) {
  const value = families.get(id);
  if (!value) throw new Error(`Missing English family ${id}`);
  return value;
}

assert(families.size === 66, `expected 66 effective English families, found ${families.size}`);

const bridgeContext = family("91-D");
const bridgeStem = bridgeContext.stem.toLowerCase();
assert(bridgeStem.includes("difference") && bridgeStem.includes("lengths"), "91-D must target the approved length-difference authority");
assert(!bridgeStem.includes("find the second bridge length"), "91-D must not drift into an unimplemented absolute second-object target");

const timelineDiscrimination = family("93-F");
const timelineStem = timelineDiscrimination.stem.toLowerCase();
assert(timelineStem.includes("at {clocktime}") && timelineStem.includes("find the time when"), "93-F must identify one known clock event and one target event");
assert(timelineDiscrimination.stem.includes("{knownEvent}") && timelineDiscrimination.stem.includes("{targetEvent}"), "93-F must bind known and target event identities explicitly");

const endpointContrast = family("94-E");
assert(endpointContrast.stem.toLowerCase().includes("how many poles"), "94-E must target approved point counting");
assert(!endpointContrast.stem.toLowerCase().includes("find the corresponding travelled distance"), "94-E must not drift into an unimplemented distance target");

const occupancyFamilies = ["92-A", "92-B", "92-C", "92-D", "92-E", "92-F"].map(family);
assert(occupancyFamilies.slice(0, 3).every((entry) => /how long|duration|interval/i.test(entry.stem)), "92-A..C must remain duration targets");
assert(occupancyFamilies.slice(3, 5).every((entry) => /find the length|determine the length/i.test(entry.stem)), "92-D..E must remain inverse object-length targets");
assert(/how long|duration/i.test(occupancyFamilies[5]!.stem), "92-F must remain the full-occupancy duration target");

const spacingExpected = Object.freeze({
  "94-A": "COUNT",
  "94-B": "COUNT",
  "94-C": "SPACING",
  "94-D": "SPEED",
  "94-E": "COUNT",
  "94-F": "SPEED",
} as const);
for (const [id, target] of Object.entries(spacingExpected)) {
  const stem = family(id).stem.toLowerCase();
  if (target === "COUNT") assert(/how many|count/i.test(stem), `${id}: fixed-spacing family must ask for point count`);
  if (target === "SPACING") assert(/spacing/i.test(stem), `${id}: fixed-spacing family must ask for spacing`);
  if (target === "SPEED") assert(/speed/i.test(stem), `${id}: fixed-spacing family must ask for speed`);
}

for (const ql of TSD_CP007_EXAM_REVIEW_ENGLISH_AUTHORING_REGISTRY) {
  assert(ql.editorialStatus === "REVIEW_CANDIDATE", `${ql.qlId}: semantic review must not freeze English content`);
}

console.log("TSD-CP-007 ENGLISH SEMANTIC-CONTRACT PROOF: PASS");
console.log(JSON.stringify({
  effectiveStemFamilies: families.size,
  semanticCorrections: ["91-D", "93-F", "94-E"],
  difficultyPolicy: "DEPTH_DRIVEN_NO_FORCED_SPLIT",
  englishStatus: "REVIEW_CANDIDATE",
  questionStudioEnabled: false,
}, null, 2));
