import { TSD_CP004_NATIVE_REVIEW_V2 as cp004 } from "../TSD-001/cp004/localization/native-review-v2";
import { TSD_CP005_DEPARTURE_REVIEW_V1 as cp005 } from "../TSD-001/cp005/departure-review-v1";
import { TSD_CP008_CONTENT_REVIEW_V2 as cp008 } from "../TSD-002/cp008/content-review-candidate-v2";
import { TSD_CP009_CONTENT_REVIEW_V2 as cp009 } from "../TSD-002/cp009/content-review-candidate-v2";
import { TSD_CP010_FINISH_TIME_EVIDENCE_REVIEW_V1 as cp010Time } from "../TSD-002/cp010/finish-time-evidence-review-v1";
import { TSD_CP010_HANDICAP_WORKED_REVIEW_V1 as cp010Handicap } from "../TSD-002/cp010/handicap-worked-review-v1";
import { TSD_CP010_RACE_EVIDENCE_WORKED_REVIEW_V1 as cp010Evidence } from "../TSD-002/cp010/race-evidence-worked-review-v1";
import { TSD_CP010_ADVANCED_RACE_WORKED_REVIEW_V1 as cp010Advanced } from "../TSD-002/cp010/advanced-race-worked-review-v1";
import { TSD_CP011_WHEEL_WORKED_REVIEW_V1 as cp011Wheel } from "../TSD-002/cp011/wheel-worked-review-v1";
import { TSD_CP011_ESCALATOR_WORKED_REVIEW_V1 as cp011Escalator } from "../TSD-002/cp011/escalator-worked-review-v1";
import { TSD_CP012_TWO_ENGINE_WORKED_REVIEW_V1 as cp012Inverse } from "../TSD-002/cp012/two-engine-worked-review-v1";
import { TSD_CP012_MOVING_SURFACE_WORKED_REVIEW_V1 as cp012Surface } from "../TSD-002/cp012/moving-surface-worked-review-v1";
import { TSD_CP012_JOURNEY_WORKED_REVIEW_V1 as cp012Journey } from "../TSD-002/cp012/journey-worked-review-v1";
import { buildCp007ContentReviewCandidateV2 } from "../TSD-002/cp007/content-review-candidate-v2";
import { TSD_CP011_TWO_WALKER_REVIEW_V1 as twoWalker } from "../TSD-002/cp011/two-walker-source-review-v1";
import { TSD_CP012_SIGNED_CYCLE_REVIEW_V1 as signedCycle } from "../TSD-002/cp012/signed-cycle-source-review-v1";
import { TSD_CP012_SLOWDOWN_OBSERVATIONS_REVIEW_V1 as slowdown } from "../TSD-002/cp012/slowdown-observations-source-review-v1";
import { TSD_CP010_TIME_HEADSTARTS_REVIEW_V1 as headstarts } from "../TSD-002/cp010/time-headstarts-source-review-v1";
import { TSD_SOURCE_MOTION_EXTENSION_REVIEW as motionExtensions } from "./source-motion-extension-review";
const groups = {
  cp004,
  cp005,
  cp008,
  cp009,
  cp010Time,
  cp010Handicap,
  cp010Evidence,
  cp010Advanced,
  cp011Wheel,
  cp011Escalator,
  cp012Inverse,
  cp012Surface,
  cp012Journey,
  cp007: buildCp007ContentReviewCandidateV2(),
};
const supplements = {
  twoWalker,
  signedCycle,
  slowdown,
  headstarts,
  motionExtensions,
};
import { buildTsdQualityAuditCorpus } from "./corpus";
/** All audit revisions plus frozen foundations/line-circular authorities for complete chapter review. */
export function buildTsdIntegratedReviewCorpus(): readonly Record<
  string,
  unknown
>[] {
  const foundations = buildTsdQualityAuditCorpus().filter((row) =>
    ["CP003", "CP004", "CP005", "CP006"].includes(row.checkpoint),
  );
  const candidates = Object.entries({ ...groups, ...supplements }).flatMap(
    ([group, rows]) => rows.map((row) => ({ ...row, reviewGroup: group })),
  );
  return [...foundations, ...candidates];
}
