/*
 * Reviewed-layer CAE QA entrypoint.
 *
 * Keep `cae-001.test.ts` as the frozen V3 architecture/saturation regression.
 * This entrypoint executes source-profile fidelity and reviewed checkpoint
 * overrides without making the frozen regression depend on editorial layers.
 */
import "./cae-001-source-profiles.test.ts";
import "./cp005-competing-explanations.test.ts";
import "./cp007-false-causation.test.ts";

console.log("PASS_CAE_001_REVIEWED_LAYER");
