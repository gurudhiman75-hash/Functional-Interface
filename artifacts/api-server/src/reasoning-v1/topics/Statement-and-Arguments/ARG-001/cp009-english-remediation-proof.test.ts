import assert from "node:assert/strict";

import { ARG_CP003_TEMPLATES_BY_QL } from "./cp003-templates.ts";
import {
  answerClassFromCp003Strengths,
  assertArgCp003TemplateContract,
  renderArgCp003Template,
} from "./cp003-saturation-helpers.ts";
import { generateArgCp009EnglishQuestion } from "./cp009-english-generator.ts";
import {
  ARG_CP009_CHECKPOINT_ID,
  ARG_CP009_ENGLISH_REMEDIATION_AUTHORITY,
  ARG_CP009_ENGLISH_REMEDIATED_TEMPLATE_IDS,
  ARG_CP009_ENGLISH_TEMPLATES_BY_QL,
} from "./cp009-english-remediated-templates.ts";
import { ARG_QL_IDS, type ArgAnswerClass } from "./types.ts";

const EXPECTED_TEMPLATE_COUNT = 48;
const EXPECTED_VARIANTS_PER_TEMPLATE = 256;
const EXPECTED_SURFACES_PER_QL = 2048;
const EXPECTED_TOTAL_ENGLISH_SURFACES = 12_288;

function correctIndex(answerClass: ArgAnswerClass): number {
  if (answerClass === "ONLY_I") return 0;
  if (answerClass === "ONLY_II") return 1;
  if (answerClass === "BOTH") return 2;
  return 3;
}

const originalTemplates = ARG_QL_IDS.flatMap((qlId) => ARG_CP003_TEMPLATES_BY_QL[qlId]);
const remediatedTemplates = ARG_QL_IDS.flatMap((qlId) => ARG_CP009_ENGLISH_TEMPLATES_BY_QL[qlId]);

assert.equal(ARG_CP009_CHECKPOINT_ID, "ARG-CP-009");
assert.equal(ARG_CP009_ENGLISH_REMEDIATION_AUTHORITY, "ARG_CP009_ENGLISH_EDITORIAL_REMEDIATION_V1");
assert.equal(originalTemplates.length, EXPECTED_TEMPLATE_COUNT);
assert.equal(remediatedTemplates.length, EXPECTED_TEMPLATE_COUNT);
assert.equal(ARG_CP009_ENGLISH_REMEDIATED_TEMPLATE_IDS.length, EXPECTED_TEMPLATE_COUNT);
assert.deepEqual(
  ARG_CP009_ENGLISH_REMEDIATED_TEMPLATE_IDS,
  originalTemplates.map((template) => template.id),
  "CP009 must preserve the exact 48 historical template IDs and ordering",
);

for (let index = 0; index < originalTemplates.length; index += 1) {
  const original = originalTemplates[index]!;
  const remediated = remediatedTemplates[index]!;
  assert.equal(remediated.id, original.id, `${original.id}: template ID changed`);
  assert.equal(remediated.qlId, original.qlId, `${original.id}: QL changed`);
  assert.equal(remediated.archetype, original.archetype, `${original.id}: archetype changed`);
  assert.equal(remediated.difficulty, original.difficulty, `${original.id}: difficulty changed`);
  assert.equal(remediated.answerClass, original.answerClass, `${original.id}: answer class changed`);
  assert.deepEqual(
    remediated.arguments.map((argument) => [argument.stance, argument.strength, argument.weaknessDefect ?? null]),
    original.arguments.map((argument) => [argument.stance, argument.strength, argument.weaknessDefect ?? null]),
    `${original.id}: stance/strength/defect identity changed`,
  );
  assertArgCp003TemplateContract(remediated);
}

const byId = new Map(remediatedTemplates.map((template) => [template.id, template] as const));
const requireTemplate = (id: string) => {
  const template = byId.get(id);
  assert.ok(template, `missing CP009 template ${id}`);
  return template;
};

// Source-level guards for every hard blocker plus the high-priority naturalness repairs included in V1.
assert.match(requireTemplate("ARG-CP003-QL001-T01").arguments[0].text, /using \{d\} can address/);
assert.match(requireTemplate("ARG-CP003-QL001-T03").arguments[1].text, /If customers can \{c\}/);
assert.doesNotMatch(requireTemplate("ARG-CP003-QL001-T07").arguments[1].text, /one fixed \{b\}/);
assert.match(requireTemplate("ARG-CP003-QL001-T08").arguments[0].text, /all \{c\}/);

assert.deepEqual(requireTemplate("ARG-CP003-QL002-T05").dimensions[3], [
  "further fraudulent activity",
  "additional account misuse",
  "loss of control over account details",
  "further unauthorised profile activity",
]);
assert.equal(requireTemplate("ARG-CP003-QL002-T07").dimensions[3].includes("student stress"), false);

assert.doesNotMatch(requireTemplate("ARG-CP003-QL003-T02").arguments[0].text, /Once \{d\} is introduced, it/);
assert.equal(requireTemplate("ARG-CP003-QL003-T03").statement, "Should the city introduce {c} on {a} during {b}?");
assert.match(requireTemplate("ARG-CP003-QL003-T04").statement, /^Should all \{a\}/);

assert.doesNotMatch(requireTemplate("ARG-CP003-QL004-T01").arguments[1].text, /Every student in \{c\}/);
assert.equal(requireTemplate("ARG-CP003-QL004-T03").dimensions[2].includes("two defined start bands"), false);
assert.deepEqual(requireTemplate("ARG-CP003-QL004-T04").dimensions[0], [
  "basic digital literacy",
  "cyber safety",
  "financial literacy",
  "career planning",
]);
assert.equal(requireTemplate("ARG-CP003-QL004-T06").dimensions[2].some((value) => /before conversion/.test(value)), false);
assert.match(requireTemplate("ARG-CP003-QL004-T08").arguments[1].text, /the institution should never regulate/);

assert.deepEqual(requireTemplate("ARG-CP003-QL005-T01").dimensions[2], [
  "users with accessibility needs",
  "users relying on assistive access",
  "users who face barriers in standard interfaces",
  "users needing accessible digital interaction",
]);
assert.doesNotMatch(requireTemplate("ARG-CP003-QL005-T08").arguments[1].text, /among \{b\}/);

assert.equal(requireTemplate("ARG-CP003-QL006-T02").statement, "Should a bank use {b} for all {a}?");
assert.equal(requireTemplate("ARG-CP003-QL006-T04").dimensions[3].every((value) => /ing\b/.test(value)), true);
assert.equal(requireTemplate("ARG-CP003-QL006-T05").arguments.some((argument) => /\{d\} exist/.test(argument.text)), false);
assert.equal(requireTemplate("ARG-CP003-QL006-T07").dimensions[1].includes("a reusable-option surcharge"), false);
assert.equal(requireTemplate("ARG-CP003-QL006-T07").dimensions[1].includes("a single-use surcharge"), true);

const allRenderedSurfaces = new Set<string>();
for (const template of remediatedTemplates) {
  const perTemplate = new Set<string>();
  for (let variantIndex = 0; variantIndex < EXPECTED_VARIANTS_PER_TEMPLATE; variantIndex += 1) {
    const rendered = renderArgCp003Template(template, variantIndex);
    const surface = `${rendered.statement}\n${rendered.arguments[0].text}\n${rendered.arguments[1].text}`;
    assert.doesNotMatch(surface, /\{[abcd]\}/, `${template.id}/${variantIndex}: unresolved placeholder`);
    assert.equal(perTemplate.has(surface), false, `${template.id}/${variantIndex}: duplicate within template`);
    perTemplate.add(surface);
    assert.equal(
      answerClassFromCp003Strengths(rendered.arguments[0].strength, rendered.arguments[1].strength),
      rendered.answerClass,
      `${template.id}/${variantIndex}: answer class drift`,
    );
    allRenderedSurfaces.add(`${template.qlId}\n${surface}`);
  }
  assert.equal(perTemplate.size, EXPECTED_VARIANTS_PER_TEMPLATE, `${template.id}: expected 256 distinct surfaces`);
}
assert.equal(allRenderedSurfaces.size, EXPECTED_TOTAL_ENGLISH_SURFACES, "CP009 must retain 12,288 distinct English source surfaces");

// Render-level regression guards for defect strings that canonical-variant review previously missed.
const everyRenderedText = [...remediatedTemplates.flatMap((template) =>
  Array.from({ length: EXPECTED_VARIANTS_PER_TEMPLATE }, (_, variantIndex) => {
    const rendered = renderArgCp003Template(template, variantIndex);
    return `${rendered.statement}\n${rendered.arguments[0].text}\n${rendered.arguments[1].text}`;
  }),
)].join("\n");
assert.doesNotMatch(everyRenderedText, /helmets addresses a material safety risk/i);
assert.doesNotMatch(everyRenderedText, /If (?:temporarily disable transactions|place a temporary payment lock|pause outgoing digital payments|activate an emergency transaction freeze) is too easy/i);
assert.doesNotMatch(everyRenderedText, /one fixed (?:expected response times|target resolution windows|expected acknowledgement periods|service-response benchmarks)/i);
assert.doesNotMatch(everyRenderedText, /every (?:application status enquiries|payment queries|appointment problems|service-delivery questions)/i);
assert.doesNotMatch(everyRenderedText, /Should every (?:recruitment examinations|licensing examinations|university entrance tests|departmental promotion tests)/i);
assert.doesNotMatch(everyRenderedText, /Every student in students /i);
assert.doesNotMatch(everyRenderedText, /before conversion before /i);
assert.doesNotMatch(everyRenderedText, /(?:school premises|training centres|examination campuses|college classrooms) should never regulate/i);
assert.doesNotMatch(everyRenderedText, /without (?:investigate|verify|isolate|use) /i);
assert.doesNotMatch(everyRenderedText, /(?:investigate|verify|isolate|use) .* cannot be considered/i);
assert.doesNotMatch(everyRenderedText, /reusable-option surcharge/i);

const generatedSurfaceKeys = new Set<string>();
for (const qlId of ARG_QL_IDS) {
  const semanticPairs = new Set<string>();
  for (let seed = 0; seed < EXPECTED_SURFACES_PER_QL; seed += 1) {
    const question = generateArgCp009EnglishQuestion({ qlId, seed });
    assert.equal(question.checkpointId, ARG_CP009_CHECKPOINT_ID);
    assert.equal(question.authority, ARG_CP009_ENGLISH_REMEDIATION_AUTHORITY);
    assert.equal(question.locale, "en-IN");
    assert.equal(question.metadata.editorialRemediation, true);
    assert.equal(question.metadata.localizationStatus, "HI_PA_REMEDIATION_PENDING");
    assert.equal(question.metadata.reviewOnly, true);
    assert.equal(question.metadata.manualApprovalRequired, true);
    assert.equal(question.metadata.persistenceAllowed, false);
    assert.equal(question.metadata.questionBankWritable, false);
    assert.equal(question.metadata.testEligible, false);
    assert.equal(question.metadata.mockEligible, false);
    assert.equal(question.metadata.publicEligible, false);
    assert.equal(question.metadata.automaticStudentPublication, false);
    assert.equal(question.metadata.learnerRelease, "LOCKED");
    assert.equal(
      answerClassFromCp003Strengths(question.argumentStrengths[0], question.argumentStrengths[1]),
      question.answerClass,
      `${qlId}/${seed}: generated strengths disagree with answer class`,
    );
    assert.equal(question.correctIndex, correctIndex(question.answerClass), `${qlId}/${seed}: correct index drift`);
    assert.equal(question.options[question.correctIndex], [
      "Only argument I is strong",
      "Only argument II is strong",
      "Both arguments I and II are strong",
      "Neither argument I nor II is strong",
    ][question.correctIndex]);
    semanticPairs.add(`${question.templateId}:${question.variantIndex}`);
    generatedSurfaceKeys.add(`${qlId}\n${question.statement}\n${question.arguments[0]}\n${question.arguments[1]}`);
  }
  assert.equal(semanticPairs.size, EXPECTED_SURFACES_PER_QL, `${qlId}: scheduler must still cover all 2048 semantic surfaces`);
}
assert.equal(generatedSurfaceKeys.size, EXPECTED_TOTAL_ENGLISH_SURFACES, "CP009 generator must expose 12,288 distinct English surfaces across one scheduler cycle");

for (const qlId of ARG_QL_IDS) {
  for (const seed of [0, 1, 17, 255, 1023, 2047]) {
    assert.deepEqual(
      generateArgCp009EnglishQuestion({ qlId, seed }),
      generateArgCp009EnglishQuestion({ qlId, seed }),
      `${qlId}/${seed}: CP009 replay must be deterministic`,
    );
  }
}

console.log("ARG-001 CP009 English remediation: PASS (48 templates, 12,288 exhaustive English surfaces)");
