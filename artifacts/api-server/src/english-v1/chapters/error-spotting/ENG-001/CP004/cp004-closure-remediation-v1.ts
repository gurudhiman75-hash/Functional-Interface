import type { PronounSceneV1 } from "./cp004-catalog-v1";

const replacements: Readonly<Record<string, PronounSceneV1>> = {
  "PRN-M-007": {
    id: "PRN-M-007", difficulty: "medium", ruleId: "GR-PRN-004", domain: "sports",
    correctSegments: ["He blamed", "himself", "for missing the final shot", "after the match."],
    errorSegments: ["He blamed", "herself", "for missing the final shot", "after the match."],
    errorIndex: 1, correction: "himself",
    reason: "The reflexive pronoun refers back to the subject 'he', so the masculine singular form 'himself' is required.",
  },
  "PRN-M-008": {
    id: "PRN-M-008", difficulty: "medium", ruleId: "GR-PRN-004", domain: "media",
    correctSegments: ["She reminded", "herself", "to verify the figures", "before filing the story."],
    errorSegments: ["She reminded", "himself", "to verify the figures", "before filing the story."],
    errorIndex: 1, correction: "herself",
    reason: "The reflexive pronoun refers back to the subject 'she', so the feminine singular form 'herself' is required.",
  },
  "PRN-M-010": {
    id: "PRN-M-010", difficulty: "medium", ruleId: "GR-PRN-005", domain: "transport",
    correctSegments: ["She called", "him", "into the office", "after the inspection."],
    errorSegments: ["She called", "himself", "into the office", "after the inspection."],
    errorIndex: 1, correction: "him",
    reason: "'Himself' cannot refer back to the subject 'she'; the ordinary object pronoun 'him' is required.",
  },
  "PRN-H-004": {
    id: "PRN-H-004", difficulty: "hard", ruleId: "GR-PRN-004", domain: "sports",
    correctSegments: ["After reviewing the recording,", "she blamed", "herself", "for making the final mistake."],
    errorSegments: ["After reviewing the recording,", "she blamed", "himself", "for making the final mistake."],
    errorIndex: 2, correction: "herself",
    reason: "The reflexive pronoun must agree with the subject 'she'; therefore 'herself' is required even though the subject is separated from the reflexive by the reporting phrase.",
  },
  "PRN-H-005": {
    id: "PRN-H-005", difficulty: "hard", ruleId: "GR-PRN-004", domain: "technology",
    correctSegments: ["While preparing the report,", "he reminded", "himself", "to include the backup results."],
    errorSegments: ["While preparing the report,", "he reminded", "herself", "to include the backup results."],
    errorIndex: 2, correction: "himself",
    reason: "The reflexive pronoun must agree with the subject 'he', so 'himself' is the only correct form.",
  },
  "PRN-H-006": {
    id: "PRN-H-006", difficulty: "hard", ruleId: "GR-PRN-004", domain: "healthcare",
    correctSegments: ["Before speaking to the family,", "she allowed", "herself", "a few minutes to review the notes."],
    errorSegments: ["Before speaking to the family,", "she allowed", "himself", "a few minutes to review the notes."],
    errorIndex: 2, correction: "herself",
    reason: "The reflexive object refers back to the subject 'she', so it must be 'herself'.",
  },
  "PRN-H-009": {
    id: "PRN-H-009", difficulty: "hard", ruleId: "GR-PRN-005", domain: "media",
    correctSegments: ["Before the programme started,", "she introduced", "him", "to the production team."],
    errorSegments: ["Before the programme started,", "she introduced", "himself", "to the production team."],
    errorIndex: 2, correction: "him",
    reason: "The reflexive 'himself' cannot refer to the subject 'she'; the sentence needs the ordinary object pronoun 'him'.",
  },
};

export function remediateCp004SceneForClosureV1(scene: PronounSceneV1): PronounSceneV1 {
  return replacements[scene.id] ?? scene;
}
