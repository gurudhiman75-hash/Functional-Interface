import { TSD_CP012_LEARNER_AUTHORITIES } from "./source-saturation";
import { TSD_CP012_REPRESENTATIONS, TSD_CP012_REPRESENTATION_SUMMARY } from "./representation-saturation";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`TSD-CP-012 representation saturation proof failed: ${message}`);
}

assert(TSD_CP012_REPRESENTATION_SUMMARY.totalRepresentations === 44, "expected 44 representation descriptions");
assert(new Set(TSD_CP012_REPRESENTATIONS.map((x) => x.representationId)).size === 44, "representation IDs must be unique");

for (const authorityKey of TSD_CP012_LEARNER_AUTHORITIES) {
  const items = TSD_CP012_REPRESENTATIONS.filter((x) => x.authorityKey === authorityKey);
  assert(items.length >= 4, `${authorityKey}: fewer than four representation descriptions`);
  assert(new Set(items.map((x) => x.label)).size === items.length, `${authorityKey}: duplicate representation label`);
  assert(items.every((x) => x.essentialEvidence.length >= 2), `${authorityKey}: representation lacks essential mathematical evidence`);
}

const reconstruction = TSD_CP012_REPRESENTATIONS.filter((x) => x.authorityKey === "motionReconstructionProgramState");
assert(reconstruction.some((x) => /table/.test(x.label)), "reconstruction must cover table representation");
assert(reconstruction.some((x) => /diagram|caselet/.test(x.label)), "reconstruction must cover diagram/caselet representation");

const synthesisAuthorities = new Set(["trainScheduleSynthesisState", "mediumPursuitSynthesisState", "closedTrackRaceSynthesisState", "movingSurfaceScheduleSynthesisState", "twoEngineInverseState"]);
for (const representation of TSD_CP012_REPRESENTATIONS.filter((x) => synthesisAuthorities.has(x.authorityKey))) {
  assert(representation.essentialEvidence.length >= 2, `${representation.representationId}: synthesis representation must name both essential evidence classes`);
}

assert(TSD_CP012_REPRESENTATION_SUMMARY.representationCreatesNewQl === false, "representation alone must not create a QL");
assert(TSD_CP012_REPRESENTATION_SUMMARY.tableDiagramCaseletCreatesNewQl === false, "table/diagram/caselet wrappers must not inflate QLs");

console.log("TSD-CP-012 REPRESENTATION SATURATION PROOF: PASS");
console.log(JSON.stringify({
  representations: TSD_CP012_REPRESENTATIONS.length,
  authorities: TSD_CP012_LEARNER_AUTHORITIES.length,
  perAuthority: Object.fromEntries(TSD_CP012_LEARNER_AUTHORITIES.map((key) => [key, TSD_CP012_REPRESENTATIONS.filter((x) => x.authorityKey === key).length])),
}, null, 2));
