import assert from "node:assert/strict";
import {
  SER_CP007_TEMPORARY_TEMPLATES,
  generateSerCp007Question,
} from "../SER-CP-007/foundation";
import {
  SER_CP007_WAVE_B_TEMPORARY_TEMPLATES,
  generateSerCp007WaveBQuestion,
} from "../SER-CP-007-WAVE-B/foundation-expanded";
import {
  SER_CP007_WAVE_C_TEMPORARY_TEMPLATES,
  generateSerCp007WaveCQuestion,
} from "../SER-CP-007-WAVE-C/foundation-refined";
import {
  SER_CP007_WAVE_D_TEMPORARY_TEMPLATES,
  generateSerCp007WaveDQuestion,
} from "../SER-CP-007-WAVE-D/foundation";
import {
  SER_CP007_WAVE_E_TEMPORARY_TEMPLATES,
  generateSerCp007WaveEQuestion,
} from "../SER-CP-007-WAVE-E/foundation";
import {
  buildSerCp007DistractorCandidateV1,
  validateSerCp007DistractorRole,
  type SerCp007DistractorCandidateQuestion,
  type SerCp007DistractorRole,
} from "./distractor-candidate-v1";

type Probe = {
  readonly temporaryTemplateId: string;
  readonly generate: (seed: number) => SerCp007DistractorCandidateQuestion;
};

const probes: readonly Probe[] = [
  ...SER_CP007_TEMPORARY_TEMPLATES.map((template) => ({
    temporaryTemplateId: template.temporaryTemplateId,
    generate: (seed: number) =>
      generateSerCp007Question(
        template.temporaryTemplateId,
        seed,
      ) as unknown as SerCp007DistractorCandidateQuestion,
  })),
  ...SER_CP007_WAVE_B_TEMPORARY_TEMPLATES.map((template) => ({
    temporaryTemplateId: template.temporaryTemplateId,
    generate: (seed: number) =>
      generateSerCp007WaveBQuestion(
        template.temporaryTemplateId,
        seed,
      ) as unknown as SerCp007DistractorCandidateQuestion,
  })),
  ...SER_CP007_WAVE_C_TEMPORARY_TEMPLATES.map((template) => ({
    temporaryTemplateId: template.temporaryTemplateId,
    generate: (seed: number) =>
      generateSerCp007WaveCQuestion(
        template.temporaryTemplateId,
        seed,
      ) as unknown as SerCp007DistractorCandidateQuestion,
  })),
  ...SER_CP007_WAVE_D_TEMPORARY_TEMPLATES.map((template) => ({
    temporaryTemplateId: template.temporaryTemplateId,
    generate: (seed: number) =>
      generateSerCp007WaveDQuestion(
        template.temporaryTemplateId,
        seed,
      ) as unknown as SerCp007DistractorCandidateQuestion,
  })),
  ...SER_CP007_WAVE_E_TEMPORARY_TEMPLATES.map((template) => ({
    temporaryTemplateId: template.temporaryTemplateId,
    generate: (seed: number) =>
      generateSerCp007WaveEQuestion(
        template.temporaryTemplateId,
        seed,
      ) as unknown as SerCp007DistractorCandidateQuestion,
  })),
];

assert.equal(probes.length, 140);

function increment<K>(map: Map<K, number>, key: K): void {
  map.set(key, (map.get(key) ?? 0) + 1);
}

function answerShape(value: string): "ARROW" | "COMMA" | "SINGLE" {
  if (value.includes("→")) return "ARROW";
  if (value.includes(",")) return "COMMA";
  return "SINGLE";
}

const roleCounts = new Map<SerCp007DistractorRole, number>();
const proofModelCounts = new Map<string, number>();
const taskCounts = new Map<string, number>();
const shapeCounts = new Map<string, number>();
let sampledQuestions = 0;
let sampledDistractors = 0;
let optionIntegrityProofs = 0;
let roleValidationProofs = 0;
let distinctRoleProofs = 0;
let learnerCheckProofs = 0;
let directShiftRoleProofs = 0;
let interleavedRoleProofs = 0;
let positionRoleProofs = 0;
let lengthRoleProofs = 0;
let continuousRoleProofs = 0;
let markerRoleProofs = 0;
let orderedPairRoleProofs = 0;
let replacementRoleProofs = 0;

for (const probe of probes) {
  for (const seed of [1, 2, 3]) {
    const source = probe.generate(seed);
    const candidate = buildSerCp007DistractorCandidateV1(source);

    assert.equal(candidate.options.length, 4);
    assert.equal(new Set(candidate.options).size, 4);
    assert.equal(candidate.options[candidate.correctIndex], source.correctAnswer);
    assert.equal(candidate.correctAnswer, source.correctAnswer);
    assert.equal(candidate.correctIndex, source.correctIndex);
    assert.equal(candidate.distractors.length, 3);
    optionIntegrityProofs += 1;

    const roles = candidate.distractors.map((entry) => entry.role);
    assert.equal(new Set(roles).size, 3);
    distinctRoleProofs += 1;

    for (const distractor of candidate.distractors) {
      assert.notEqual(distractor.value, source.correctAnswer);
      assert.ok(
        validateSerCp007DistractorRole(source.correctAnswer, distractor),
        `${source.temporaryTemplateId}: ${distractor.role} does not match ${distractor.value}`,
      );
      assert.ok(distractor.learnerCheck.length >= 25);
      assert.doesNotMatch(
        distractor.learnerCheck,
        /trap code|authority|taxonomy|canonical|option [A-D]/i,
      );
      increment(roleCounts, distractor.role);
      roleValidationProofs += 1;
      learnerCheckProofs += 1;
      sampledDistractors += 1;
    }

    const shape = answerShape(source.correctAnswer);
    increment(shapeCounts, shape);

    if (shape === "ARROW") {
      assert.deepEqual(
        new Set(roles),
        new Set<SerCp007DistractorRole>([
          "REPLACEMENT_SHIFT_FORWARD",
          "REPLACEMENT_SHIFT_BACKWARD",
          "REPLACEMENT_SINGLE_POSITION_MUTATION",
        ]),
      );
      replacementRoleProofs += 1;
    } else if (shape === "COMMA") {
      assert.deepEqual(
        new Set(roles),
        new Set<SerCp007DistractorRole>([
          "ORDERED_PAIR_SWAPPED",
          "FIRST_COMPONENT_MUTATED",
          "SECOND_COMPONENT_MUTATED",
        ]),
      );
      orderedPairRoleProofs += 1;
    } else {
      switch (candidate.proofModel) {
        case "DIRECT_COLUMN_MOVEMENT":
          assert.ok(
            roles.includes("UNIFORM_SHIFT_FORWARD") ||
              roles.includes("UNIFORM_SHIFT_BACKWARD"),
          );
          directShiftRoleProofs += 1;
          break;
        case "INTERLEAVED_ROWS":
          assert.ok(roles.includes("SINGLE_POSITION_MUTATION"));
          interleavedRoleProofs += 1;
          break;
        case "POSITION_TRANSFORMATION":
          assert.ok(
            roles.includes("WHOLE_REVERSAL") ||
              roles.includes("CYCLIC_ROTATION_LEFT") ||
              roles.includes("CYCLIC_ROTATION_RIGHT"),
          );
          positionRoleProofs += 1;
          break;
        case "LENGTH_OR_CONTENT_CHANGE":
          assert.ok(
            roles.includes("LENGTH_PLUS_ONE") ||
              roles.includes("LENGTH_MINUS_ONE"),
          );
          lengthRoleProofs += 1;
          break;
        case "CONTINUOUS_GAP_COMPLETION":
          assert.ok(
            roles.includes("WHOLE_REVERSAL") ||
              roles.includes("SINGLE_POSITION_MUTATION"),
          );
          continuousRoleProofs += 1;
          break;
        case "MARKER_OR_BOUNDARY_MOVEMENT":
          assert.ok(
            roles.includes("CYCLIC_ROTATION_LEFT") ||
              roles.includes("CYCLIC_ROTATION_RIGHT"),
          );
          markerRoleProofs += 1;
          break;
      }
    }

    increment(proofModelCounts, candidate.proofModel);
    increment(taskCounts, candidate.editorialTaskKind);
    sampledQuestions += 1;
  }
}

assert.equal(sampledQuestions, 420);
assert.equal(sampledDistractors, 1_260);
assert.equal(optionIntegrityProofs, 420);
assert.equal(roleValidationProofs, 1_260);
assert.equal(distinctRoleProofs, 420);
assert.equal(learnerCheckProofs, 1_260);
assert.equal(replacementRoleProofs, 3);
assert.equal(orderedPairRoleProofs, 21);
assert.equal(proofModelCounts.size, 6);
assert.ok(directShiftRoleProofs > 0);
assert.ok(interleavedRoleProofs > 0);
assert.ok(positionRoleProofs > 0);
assert.ok(lengthRoleProofs > 0);
assert.ok(continuousRoleProofs > 0);
assert.ok(markerRoleProofs > 0);

console.log(
  JSON.stringify(
    {
      status: "PASS_SER_CP007_DISTRACTOR_CANDIDATE_V1",
      temporaryTemplates: probes.length,
      sampledSeedsPerTemplate: 3,
      sampledQuestions,
      sampledDistractors,
      optionIntegrityProofs,
      roleValidationProofs,
      distinctRoleProofs,
      learnerCheckProofs,
      proofModelCounts: Object.fromEntries([...proofModelCounts.entries()].sort()),
      taskCounts: Object.fromEntries([...taskCounts.entries()].sort()),
      answerShapeCounts: Object.fromEntries([...shapeCounts.entries()].sort()),
      roleCounts: Object.fromEntries([...roleCounts.entries()].sort()),
      directShiftRoleProofs,
      interleavedRoleProofs,
      positionRoleProofs,
      lengthRoleProofs,
      continuousRoleProofs,
      markerRoleProofs,
      orderedPairRoleProofs,
      replacementRoleProofs,
      candidateStatus: "EXECUTABLE_PENDING_MANUAL_EXAM_REALISM_REVIEW",
      permanentQls: 0,
      englishDiscoveryFreeze: "BLOCKED",
      nextAuthority:
        "SER_CP007_DISTRACTOR_CANDIDATE_V1_MANUAL_EXAM_REALISM_REVIEW",
    },
    null,
    2,
  ),
);
