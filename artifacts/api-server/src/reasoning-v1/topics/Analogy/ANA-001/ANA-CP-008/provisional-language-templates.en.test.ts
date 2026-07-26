import assert from "node:assert/strict";
import {
  ANA_CP008_ENGLISH_PROTOTYPES,
  renderAllDirectEnglishPrototypes,
  renderAllOddPairEnglishPrototypes,
} from "./provisional-language-templates.en";
import {
  independentlyApplyProvisionalMixedRule,
} from "./provisional-independent-solver";
import {
  ANA_CP008_PROVISIONAL_RULES,
} from "./provisional-rule-definitions";
import {
  mixedTokenKey,
  renderMixedToken,
  sameMixedToken,
} from "./foundation/mixed-token";

const INTERNAL_TEXT = /ANA-QL|ANA-CP|MIXED_|PROTO_|ruleId|contextKey|LANGUAGE_PROTOTYPE|publiclyPublishable/i;
const PLACEHOLDER_TEXT = /\{\{?[^}]+\}?\}|\[[A-Z_]{3,}\]/;
const TERSE_ANSWER_KEY = /\b(?:ans\.?|answer\s*[:=-]|option\s+[a-d]\s+is\s+correct)\b/i;

const prototypeIds = ANA_CP008_ENGLISH_PROTOTYPES.map((prototype) => prototype.prototypeId);
assert.equal(new Set(prototypeIds).size, prototypeIds.length, "English prototype IDs must be unique.");
assert.ok(prototypeIds.every((prototypeId) => !prototypeId.startsWith("ANA-QL-")), "Prototype IDs must not allocate permanent QLs.");

for (const prototype of ANA_CP008_ENGLISH_PROTOTYPES) {
  assert.deepEqual(
    prototype.taskEligibility,
    ["DIRECT_COMPLETION", "ODD_PAIR_SELECTION"],
    `${prototype.prototypeId} must remain limited to the two source-eligible prototype tasks.`,
  );
  assert.ok(prototype.title.length >= 20, `${prototype.prototypeId} needs a descriptive editorial title.`);
  assert.ok(prototype.solveContract.length >= 45, `${prototype.prototypeId} needs a clear solve contract.`);
  assert.ok(prototype.sourceNote.length >= 30, `${prototype.prototypeId} needs a precise source-ownership note.`);
  assert.equal(new Set(prototype.sampleInputs.map(mixedTokenKey)).size, 4,
    `${prototype.prototypeId} sample inputs must be canonically unique.`);
}

const representedRuleIds = new Set(ANA_CP008_ENGLISH_PROTOTYPES.map((prototype) => prototype.ruleId));
assert.deepEqual(
  [...representedRuleIds].sort(),
  ANA_CP008_PROVISIONAL_RULES.map((rule) => rule.id).sort(),
  "Every provisional runtime authority must be represented by at least one English prototype.",
);

assert.ok(
  ANA_CP008_ENGLISH_PROTOTYPES.some((prototype) =>
    prototype.context.kind === "LETTER_GROUP_SCALAR" && prototype.context.aggregate === "SUM"),
  "The scalar-sum operation needs its own prototype.",
);
assert.ok(
  ANA_CP008_ENGLISH_PROTOTYPES.some((prototype) =>
    prototype.context.kind === "LETTER_GROUP_SCALAR" && prototype.context.aggregate === "PRODUCT"),
  "The scalar-product operation needs its own prototype.",
);
assert.ok(
  ANA_CP008_ENGLISH_PROTOTYPES.some((prototype) =>
    prototype.context.kind === "CLUSTER_NUMBER_VECTOR_POWER" && prototype.context.transform === "CUBE"),
  "Direct cube needs its own prototype.",
);
assert.ok(
  ANA_CP008_ENGLISH_PROTOTYPES.some((prototype) =>
    prototype.context.kind === "CLUSTER_NUMBER_VECTOR_POWER" && prototype.context.transform === "PERFECT_SQUARE_TO_CUBE"),
  "Perfect-square-to-cube needs its own prototype.",
);

const direct = renderAllDirectEnglishPrototypes();
const odd = renderAllOddPairEnglishPrototypes();
assert.equal(direct.length, ANA_CP008_ENGLISH_PROTOTYPES.length);
assert.equal(odd.length, ANA_CP008_ENGLISH_PROTOTYPES.length);

for (const rendered of direct) {
  const definition = ANA_CP008_ENGLISH_PROTOTYPES.find((prototype) => prototype.prototypeId === rendered.prototypeId);
  assert.ok(definition, `Missing definition for ${rendered.prototypeId}.`);
  assert.equal(rendered.metadata.permanentQlId, null);
  assert.equal(rendered.metadata.publiclyPublishable, false);
  assert.equal(rendered.metadata.maturity, "LANGUAGE_PROTOTYPE");
  assert.ok(rendered.stem.includes(renderMixedToken(rendered.source.input)));
  assert.ok(rendered.stem.includes(renderMixedToken(rendered.source.output)));
  assert.ok(rendered.stem.includes(renderMixedToken(rendered.target.input)));
  assert.ok(rendered.stem.includes("?"));
  assert.equal(rendered.answerKind, rendered.correctAnswer.kind);
  assert.ok(sameMixedToken(
    independentlyApplyProvisionalMixedRule(definition.ruleId, definition.context, rendered.target.input),
    rendered.correctAnswer,
  ));

  const explanationParts = Object.values(rendered.explanation);
  assert.ok(rendered.explanation.ruleStatement.length >= 30,
    `${rendered.prototypeId} needs a clear rule statement.`);
  assert.ok(rendered.explanation.sourceDemonstration.length >= 30,
    `${rendered.prototypeId} needs a value-specific source demonstration.`);
  assert.ok(rendered.explanation.targetApplication.length >= 30,
    `${rendered.prototypeId} needs a value-specific target application.`);
  assert.ok(rendered.explanation.conclusion.length >= 25,
    `${rendered.prototypeId} needs a complete conclusion.`);
  assert.ok(rendered.explanation.closestTrapRejection.length >= 55,
    `${rendered.prototypeId} needs a helpful nearest-trap rejection.`);
  assert.ok(explanationParts.every((part) => /[.!?]$/.test(part.trim())),
    `${rendered.prototypeId} explanation fields must be complete sentences.`);
  assert.ok(rendered.explanation.sourceDemonstration.includes(renderMixedToken(rendered.source.input)));
  assert.ok(rendered.explanation.targetApplication.includes(renderMixedToken(rendered.target.input)));
  assert.ok(rendered.explanation.conclusion.includes(renderMixedToken(rendered.correctAnswer)));
  assert.ok(/tempting|do not|rather than|not obtained|misses|breaks/i.test(rendered.explanation.closestTrapRejection),
    `${rendered.prototypeId} needs a helpful nearest-trap rejection.`);

  const studentText = [rendered.stem, ...explanationParts].join("\n");
  assert.ok(!INTERNAL_TEXT.test(studentText), `${rendered.prototypeId} leaks internal implementation text.`);
  assert.ok(!PLACEHOLDER_TEXT.test(studentText), `${rendered.prototypeId} contains an unresolved placeholder.`);
  assert.ok(!TERSE_ANSWER_KEY.test(studentText), `${rendered.prototypeId} reads like a compressed answer key.`);
}

for (const rendered of odd) {
  const definition = ANA_CP008_ENGLISH_PROTOTYPES.find((prototype) => prototype.prototypeId === rendered.prototypeId);
  assert.ok(definition, `Missing definition for ${rendered.prototypeId}.`);
  assert.equal(rendered.metadata.permanentQlId, null);
  assert.equal(rendered.metadata.publiclyPublishable, false);
  assert.equal(rendered.options.length, 4);
  assert.equal(rendered.correctIndex, 3);
  assert.equal(
    new Set(rendered.options.map((option) => `${mixedTokenKey(option.input)}=>${mixedTokenKey(option.output)}`)).size,
    4,
    `${rendered.prototypeId} odd-pair options must be canonically unique.`,
  );

  for (let index = 0; index < rendered.options.length; index += 1) {
    const option = rendered.options[index];
    const intended = independentlyApplyProvisionalMixedRule(definition.ruleId, definition.context, option.input);
    assert.equal(
      sameMixedToken(intended, option.output),
      index !== rendered.correctIndex,
      `${rendered.prototypeId} option ${index} has the wrong validity classification.`,
    );
  }

  assert.equal(rendered.explanation.validPairDemonstrations.length, 3);
  assert.ok(rendered.explanation.validPairDemonstrations.every((part) => part.length >= 30));
  assert.ok(rendered.explanation.validPairDemonstrations.every((part) => /[.!?]$/.test(part.trim())));
  assert.ok(rendered.explanation.oddPairRejection.includes(renderMixedToken(rendered.options[rendered.correctIndex].input)));
  assert.ok(rendered.explanation.conclusion.includes(renderMixedToken(rendered.options[rendered.correctIndex].output)));

  const studentText = [
    rendered.stem,
    rendered.explanation.commonRule,
    ...rendered.explanation.validPairDemonstrations,
    rendered.explanation.oddPairRejection,
    rendered.explanation.conclusion,
  ].join("\n");
  assert.ok(!INTERNAL_TEXT.test(studentText), `${rendered.prototypeId} odd-pair text leaks internal implementation text.`);
  assert.ok(!PLACEHOLDER_TEXT.test(studentText), `${rendered.prototypeId} odd-pair text contains an unresolved placeholder.`);
  assert.ok(!TERSE_ANSWER_KEY.test(studentText), `${rendered.prototypeId} odd-pair explanation is too terse.`);
}

const directSourceExplanations = direct.map((rendered) => rendered.explanation.sourceDemonstration);
const directTargetExplanations = direct.map((rendered) => rendered.explanation.targetApplication);
const trapExplanations = direct.map((rendered) => rendered.explanation.closestTrapRejection);
const oddRejections = odd.map((rendered) => rendered.explanation.oddPairRejection);
assert.equal(new Set(directSourceExplanations).size, directSourceExplanations.length,
  "Source demonstrations must be value-specific and non-duplicated.");
assert.equal(new Set(directTargetExplanations).size, directTargetExplanations.length,
  "Target applications must be value-specific and non-duplicated.");
assert.ok(new Set(trapExplanations).size >= 12,
  "Nearest-trap explanations must remain operation-specific rather than generic boilerplate.");
assert.equal(new Set(oddRejections).size, oddRejections.length,
  "Odd-pair rejections must state the generated expected and displayed values.");

for (const rendered of direct.filter((entry) =>
  entry.prototypeId === "PROTO_EXACT_MULTIPLIER_NUMBER_FIRST" ||
  entry.prototypeId === "PROTO_SQUARE_ROOT_SUCCESSOR_NUMBER_FIRST")) {
  assert.match(renderMixedToken(rendered.correctAnswer), /^-?\d+[A-Z]{2,6}$/,
    `${rendered.prototypeId} must preserve number-first answer order.`);
  assert.match(rendered.explanation.targetApplication, /number-first|leading number|remains number-first/i);
}

for (const rendered of direct.filter((entry) =>
  entry.prototypeId === "PROTO_EXACT_MULTIPLIER_CLUSTER_FIRST" ||
  entry.prototypeId === "PROTO_DIRECT_CUBE_CLUSTER_FIRST" ||
  entry.prototypeId === "PROTO_SQUARE_TO_CUBE_CLUSTER_FIRST" ||
  entry.prototypeId === "PROTO_CUBE_ROOT_SUCCESSOR_CLUSTER_FIRST")) {
  assert.match(renderMixedToken(rendered.correctAnswer), /^[A-Z]{2,6}-?\d+$/,
    `${rendered.prototypeId} must preserve cluster-first answer order.`);
}

console.log("ANA-CP-008 English language prototype audit passed.", {
  prototypeFamilies: ANA_CP008_ENGLISH_PROTOTYPES.length,
  representedRuntimeAuthorities: representedRuleIds.size,
  directPrototypes: direct.length,
  oddPairPrototypes: odd.length,
  permanentQlIdsAllocated: 0,
  exactDuplicateSourceDemonstrations: directSourceExplanations.length - new Set(directSourceExplanations).size,
  exactDuplicateTargetApplications: directTargetExplanations.length - new Set(directTargetExplanations).size,
});
