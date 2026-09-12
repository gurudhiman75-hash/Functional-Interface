import assert from "node:assert/strict";

import {
  ARG_CP015_REAL_PAPER_PROFILES,
  generateArgCp015QuestionStudioBatch,
  normalizeArgCp015Profile,
} from "./cp015-perceived-diversity-expansion.ts";

for (const alias of ["RRB_2X4", "RAILWAY_2X4", "PUNJAB_STATE_2X4", "STATE_2X4"] as const) {
  assert.equal(normalizeArgCp015Profile(alias), "SSC_RECENT_2X4", `${alias}: must route through the certified SSC/state-style 2x4 authority`);
  const result = generateArgCp015QuestionStudioBatch({
    profileMode: "real-paper",
    examProfile: alias,
    qlId: "ARG-QL-001",
    language: "en",
    difficulty: "Medium",
    seed: `ARG-001-FINAL-AUDIT:${alias}`,
    count: 4,
  });
  assert.equal(result.questions.length, 4);
  for (const question of result.questions as readonly Record<string, any>[]) {
    assert.equal(question.examProfile, "SSC_RECENT_2X4");
    assert.equal(question.arguments.length, 2);
    assert.equal(question.options.length, 4);
  }
}

const profileIds = new Set(ARG_CP015_REAL_PAPER_PROFILES.map((profile) => profile.id));
assert.deepEqual(profileIds, new Set([
  "SSC_RECENT_2X4",
  "BANKING_CLASSIC_2X5",
  "BANKING_COMBO_3X5",
  "BANKING_COMBO_4X5",
]));

const stateProfile = ARG_CP015_REAL_PAPER_PROFILES.find((profile) => profile.id === "SSC_RECENT_2X4");
assert.ok(stateProfile);
assert.ok(stateProfile.aliases.includes("PUNJAB_STATE_2X4"));
assert.ok(stateProfile.aliases.includes("RRB_2X4"));

assert.throws(
  () => generateArgCp015QuestionStudioBatch({
    profileMode: "real-paper",
    examProfile: "UNKNOWN_EXAM_PROFILE",
    qlId: "ARG-QL-001",
    language: "en",
    difficulty: "Medium",
    seed: "ARG-001-FINAL-AUDIT:UNKNOWN",
    count: 1,
  }),
  /Unsupported ARG-001 real-paper profile/,
);

console.log(JSON.stringify({
  status: "PASS_ARG_001_FINAL_CHAPTER_PROFILE_ROUTING",
  canonicalProfiles: [...profileIds],
  stateAndRailwayAliases: stateProfile.aliases,
}, null, 2));
