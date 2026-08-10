import {
  SER_CP007_CANDIDATE_13_MAP,
  SER_CP007_CANDIDATE_14_MAP,
  SER_CP007_DISCOVERY_AUTHORITY_IDS,
  SER_CP007_TEMPLATE_PROBES_V7,
} from "./authority-compression-contract-v7";
import type {
  SerCp007CandidateQuestion,
  SerCp007TemplateProbe,
} from "./authority-compression-contract";
import type { SerCp007DistractorQuestionLike } from "../SER-CP-007-ENGLISH-REMODEL/distractor-remediation-v7";
import { remediateSerCp007DistractorsV71 } from "../SER-CP-007-ENGLISH-REMODEL/distractor-remediation-v7-1";

export {
  SER_CP007_CANDIDATE_13_MAP,
  SER_CP007_CANDIDATE_14_MAP,
  SER_CP007_DISCOVERY_AUTHORITY_IDS,
};

export const SER_CP007_TEMPLATE_PROBES_V71: readonly SerCp007TemplateProbe[] =
  SER_CP007_TEMPLATE_PROBES_V7.map((probe) => ({
    ...probe,
    generate: (seed: number) =>
      remediateSerCp007DistractorsV71(
        probe.generate(seed) as unknown as SerCp007DistractorQuestionLike,
      ) as unknown as SerCp007CandidateQuestion,
  }));

if (SER_CP007_TEMPLATE_PROBES_V71.length !== 140) {
  throw new Error("V7.1 probe routing must preserve all 140 temporary templates.");
}
