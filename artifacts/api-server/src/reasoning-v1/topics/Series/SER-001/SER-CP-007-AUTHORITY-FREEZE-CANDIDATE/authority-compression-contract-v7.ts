import {
  SER_CP007_CANDIDATE_13_MAP,
  SER_CP007_CANDIDATE_14_MAP,
  SER_CP007_DISCOVERY_AUTHORITY_IDS,
  SER_CP007_TEMPLATE_PROBES_V6,
} from "./authority-compression-contract-v6";
import type {
  SerCp007CandidateQuestion,
  SerCp007TemplateProbe,
} from "./authority-compression-contract";
import {
  remediateSerCp007DistractorsV7,
  type SerCp007DistractorQuestionLike,
} from "../SER-CP-007-ENGLISH-REMODEL/distractor-remediation-v7";

export {
  SER_CP007_CANDIDATE_13_MAP,
  SER_CP007_CANDIDATE_14_MAP,
  SER_CP007_DISCOVERY_AUTHORITY_IDS,
};

export const SER_CP007_TEMPLATE_PROBES_V7: readonly SerCp007TemplateProbe[] =
  SER_CP007_TEMPLATE_PROBES_V6.map((probe) => ({
    ...probe,
    generate: (seed: number) =>
      remediateSerCp007DistractorsV7(
        probe.generate(seed) as unknown as SerCp007DistractorQuestionLike,
      ) as unknown as SerCp007CandidateQuestion,
  }));

if (SER_CP007_TEMPLATE_PROBES_V7.length !== 140) {
  throw new Error("V7 probe routing must preserve all 140 temporary templates.");
}
