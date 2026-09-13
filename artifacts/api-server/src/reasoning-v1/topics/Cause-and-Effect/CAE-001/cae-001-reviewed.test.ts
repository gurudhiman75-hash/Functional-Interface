/*
 * Reviewed-layer CAE QA entrypoint.
 *
 * Keep `cae-001.test.ts` as the frozen V3 architecture/saturation regression.
 * This entrypoint executes source-profile fidelity plus every reviewed
 * checkpoint override and the CP-010 final freeze gate.
 */
import "./cae-001-source-profiles.test.ts";
import "./cp003004-combination.test.ts";
import "./cp005-competing-explanations.test.ts";
import "./cp006-causal-distance.test.ts";
import "./cp007-false-causation.test.ts";
import "./cp008-reviewed.test.ts";
import "./cp009-integrated.test.ts";
import "./cp010-freeze.test.ts";

console.log("PASS_CAE_001_REVIEWED_LAYER_CP010_CANDIDATE");
