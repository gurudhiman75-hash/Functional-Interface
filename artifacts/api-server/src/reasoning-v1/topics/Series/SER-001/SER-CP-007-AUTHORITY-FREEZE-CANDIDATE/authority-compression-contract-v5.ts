import {
  SER_CP007_CANDIDATE_13_MAP,
  SER_CP007_CANDIDATE_14_MAP,
  SER_CP007_DISCOVERY_AUTHORITY_IDS,
  SER_CP007_TEMPLATE_PROBES,
  type SerCp007CandidateQuestion,
  type SerCp007TemplateProbe,
} from "./authority-compression-contract";
import {
  generateSerCp007WaveDExamReadyQuestion,
} from "../SER-CP-007-WAVE-D/foundation-exam-ready";
import type { SerCp007WaveDTemporaryTemplateId } from "../SER-CP-007-WAVE-D/foundation";

export {
  SER_CP007_CANDIDATE_13_MAP,
  SER_CP007_CANDIDATE_14_MAP,
  SER_CP007_DISCOVERY_AUTHORITY_IDS,
};

export const SER_CP007_TEMPLATE_PROBES_V5: readonly SerCp007TemplateProbe[] =
  SER_CP007_TEMPLATE_PROBES.map((probe) => {
    if (probe.waveId !== "WAVE_D") return probe;
    return {
      ...probe,
      generate: (seed: number) =>
        generateSerCp007WaveDExamReadyQuestion(
          probe.temporaryTemplateId as SerCp007WaveDTemporaryTemplateId,
          seed,
        ) as unknown as SerCp007CandidateQuestion,
    };
  });

if (SER_CP007_TEMPLATE_PROBES_V5.length !== SER_CP007_TEMPLATE_PROBES.length) {
  throw new Error("V5 probe routing changed the template count.");
}

if (
  SER_CP007_TEMPLATE_PROBES_V5.filter((probe) => probe.waveId === "WAVE_D")
    .length !== 32
) {
  throw new Error("Expected all 32 Wave D templates in V5 routing.");
}
