import {
  SER_CP007_CANDIDATE_13_MAP,
  SER_CP007_CANDIDATE_14_MAP,
  SER_CP007_DISCOVERY_AUTHORITY_IDS,
  SER_CP007_TEMPLATE_PROBES_V5,
} from "./authority-compression-contract-v5";
import type {
  SerCp007CandidateQuestion,
  SerCp007TemplateProbe,
} from "./authority-compression-contract";
import {
  remediateSerCp007RotationQuestionV6,
  type SerCp007RotationQuestionLike,
} from "../SER-CP-007-ENGLISH-REMODEL/rotation-remediation-v6";
import {
  generateSerCp007WaveDDeterminateQuestionV6,
} from "../SER-CP-007-WAVE-D/foundation-determinate-v6";
import type { SerCp007WaveDTemporaryTemplateId } from "../SER-CP-007-WAVE-D/foundation";

export {
  SER_CP007_CANDIDATE_13_MAP,
  SER_CP007_CANDIDATE_14_MAP,
  SER_CP007_DISCOVERY_AUTHORITY_IDS,
};

export const SER_CP007_TEMPLATE_PROBES_V6: readonly SerCp007TemplateProbe[] =
  SER_CP007_TEMPLATE_PROBES_V5.map((probe) => {
    if (probe.waveId === "WAVE_D") {
      return {
        ...probe,
        generate: (seed: number) =>
          generateSerCp007WaveDDeterminateQuestionV6(
            probe.temporaryTemplateId as SerCp007WaveDTemporaryTemplateId,
            seed,
          ) as unknown as SerCp007CandidateQuestion,
      };
    }

    if (
      probe.sourceRuleId === "CYCLIC_CLUSTER_ROTATION" ||
      probe.sourceRuleId === "NEXT_TWO_ROTATION"
    ) {
      return {
        ...probe,
        generate: (seed: number) =>
          remediateSerCp007RotationQuestionV6(
            probe.generate(seed) as unknown as SerCp007RotationQuestionLike,
          ) as unknown as SerCp007CandidateQuestion,
      };
    }

    return probe;
  });

if (SER_CP007_TEMPLATE_PROBES_V6.length !== 140) {
  throw new Error("V6 probe routing must preserve all 140 temporary templates.");
}

if (
  SER_CP007_TEMPLATE_PROBES_V6.filter(
    (probe) =>
      probe.sourceRuleId === "CYCLIC_CLUSTER_ROTATION" ||
      probe.sourceRuleId === "NEXT_TWO_ROTATION",
  ).length !== 5
) {
  throw new Error("Expected four Wave A rotation templates and one Wave C rotation template.");
}

if (
  SER_CP007_TEMPLATE_PROBES_V6.filter((probe) => probe.waveId === "WAVE_D")
    .length !== 32
) {
  throw new Error("Expected all 32 Wave D templates in V6 routing.");
}
