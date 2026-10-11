import { TSD_CP012_LEARNER_AUTHORITIES } from "./source-saturation";
import { TSD_CP012_GLOBAL_OWNERSHIP_GUARDS, TSD_CP012_OWNERSHIP_BOUNDARIES } from "./ownership-boundaries";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`TSD-CP-012 ownership boundary proof failed: ${message}`);
}

assert(TSD_CP012_OWNERSHIP_BOUNDARIES.length === TSD_CP012_LEARNER_AUTHORITIES.length, "every learner authority needs exactly one ownership boundary");
assert(new Set(TSD_CP012_OWNERSHIP_BOUNDARIES.map((x) => x.authorityKey)).size === TSD_CP012_LEARNER_AUTHORITIES.length, "ownership authority keys must be unique");
for (const authorityKey of TSD_CP012_LEARNER_AUTHORITIES) {
  const boundary = TSD_CP012_OWNERSHIP_BOUNDARIES.find((x) => x.authorityKey === authorityKey);
  assert(boundary, `${authorityKey}: ownership boundary missing`);
  assert(boundary.ownsWhen.length >= 50, `${authorityKey}: ownership condition too vague`);
  assert(boundary.rejectsOrDelegates.length >= 2, `${authorityKey}: collision/delegation guard too thin`);
}

const route = TSD_CP012_OWNERSHIP_BOUNDARIES.find((x) => x.authorityKey === "routeProfileProgramState")!;
assert(route.rejectsOrDelegates.some((x) => /CP006/.test(x)), "route profile must guard ordinary closed-track collision");
assert(route.rejectsOrDelegates.some((x) => /Data Interpretation/.test(x)), "route profile must guard DI collision");
const terminal = TSD_CP012_OWNERSHIP_BOUNDARIES.find((x) => x.authorityKey === "terminalConstraintProgramState")!;
assert(terminal.rejectsOrDelegates.some((x) => /CP003/.test(x)), "terminal constraints must guard CP003 collision");
const reconstruction = TSD_CP012_OWNERSHIP_BOUNDARIES.find((x) => x.authorityKey === "motionReconstructionProgramState")!;
assert(reconstruction.rejectsOrDelegates.some((x) => /Data Interpretation/.test(x)), "reconstruction must guard large-DI ownership");
const twoEngine = TSD_CP012_OWNERSHIP_BOUNDARIES.find((x) => x.authorityKey === "twoEngineInverseState")!;
assert(/neither equation alone/i.test(twoEngine.ownsWhen), "two-engine inverse must require independent necessity of both equations");
const feasible = TSD_CP012_OWNERSHIP_BOUNDARIES.find((x) => x.authorityKey === "feasibleParameterSetState")!;
assert(feasible.rejectsOrDelegates.some((x) => /QA only/.test(x)), "feasible set must not absorb internal identifiability QA");

assert(TSD_CP012_GLOBAL_OWNERSHIP_GUARDS.requiresEssentialMultiStageOrCrossAuthorityState, "CP012 must require essential complexity");
assert(TSD_CP012_GLOBAL_OWNERSHIP_GUARDS.decorativeComplexityNeverPromotesToCp012, "decorative complexity guard missing");
assert(TSD_CP012_GLOBAL_OWNERSHIP_GUARDS.finiteRouteChoiceOnly, "open-ended route optimisation must remain excluded");
assert(TSD_CP012_GLOBAL_OWNERSHIP_GUARDS.largeDiDelegated, "large DI must remain delegated");
assert(TSD_CP012_GLOBAL_OWNERSHIP_GUARDS.continuousAccelerationRejected, "continuous acceleration must remain outside aptitude TSD");
assert(TSD_CP012_GLOBAL_OWNERSHIP_GUARDS.ordinaryAuthorityWinsWhenSecondaryEvidenceCanBeRemoved, "ordinary CP must win when secondary evidence is nonessential");

console.log("TSD-CP-012 OWNERSHIP BOUNDARY PROOF: PASS");
console.log(JSON.stringify({
  authorities: TSD_CP012_OWNERSHIP_BOUNDARIES.length,
  collisionGuards: "LOCKED",
  ordinaryAuthorityWinsWhenSecondaryEvidenceIsDecorative: true,
  largeDiDelegated: true,
  openEndedRouteOptimisationRejected: true,
}, null, 2));
