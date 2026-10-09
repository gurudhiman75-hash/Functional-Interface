import { TSD_CP011_LEARNER_AUTHORITIES } from "./source-saturation";
import { TSD_CP011_REPRESENTATIONS, TSD_CP011_REPRESENTATION_STATUS } from "./representation-saturation";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`TSD-CP-011 representation saturation proof failed: ${message}`);
}

assert(TSD_CP011_REPRESENTATIONS.length === 42, "expected 42 representation descriptions");
assert(new Set(TSD_CP011_REPRESENTATIONS.map((x) => x.representationId)).size === 42, "representation IDs must be unique");
assert(TSD_CP011_REPRESENTATION_STATUS.minimumPerAuthority === 6, "minimum representation floor must remain six");

for (const authorityKey of TSD_CP011_LEARNER_AUTHORITIES) {
  const representations = TSD_CP011_REPRESENTATIONS.filter((x) => x.authorityKey === authorityKey);
  assert(representations.length === 6, `${authorityKey}: expected exactly six discovery representations`);
  assert(new Set(representations.map((x) => `${x.evidenceForm} -> ${x.targetForm}`)).size === 6, `${authorityKey}: duplicate evidence/target representation`);
  assert(representations.every((x) => x.examContexts.length >= 1), `${authorityKey}: every representation needs an exam context`);
}

assert(TSD_CP011_REPRESENTATION_STATUS.learnerFacingContextDoesNotCreateNewQl, "context-only variants cannot create QLs");
assert(TSD_CP011_REPRESENTATION_STATUS.multiStageSurfaceScheduleHeldForCp012, "direction-reversal/stop-start schedules must stay in CP012 hold");
assert(TSD_CP011_REPRESENTATION_STATUS.pureCircumferenceMeasurementDelegatedToMensuration, "pure circle measurement must stay delegated");
assert(TSD_CP011_REPRESENTATION_STATUS.gearPulleyBeltMechanicsExcluded, "gear/pulley/belt mechanics must remain excluded");

console.log("TSD-CP-011 REPRESENTATION SATURATION PROOF: PASS");
console.log(JSON.stringify({
  representations: TSD_CP011_REPRESENTATIONS.length,
  authorities: TSD_CP011_LEARNER_AUTHORITIES.length,
  perAuthority: Object.fromEntries(TSD_CP011_LEARNER_AUTHORITIES.map((authorityKey) => [authorityKey, TSD_CP011_REPRESENTATIONS.filter((x) => x.authorityKey === authorityKey).length])),
}, null, 2));