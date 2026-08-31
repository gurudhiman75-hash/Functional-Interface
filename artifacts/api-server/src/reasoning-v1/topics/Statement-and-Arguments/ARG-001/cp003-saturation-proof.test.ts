import { ARG_ENGLISH_ARCHETYPE_BY_SCENARIO } from "./cp002-archetype-ledger.ts";
import { ARG_ENGLISH_AUTHORITIES } from "./english-authorities.ts";
import {
  ARG_CP003_SEMANTIC_SURFACE_CAPACITY_PER_QL,
  ARG_CP003_TEMPLATE_COUNT_PER_QL,
  ARG_CP003_VARIANTS_PER_TEMPLATE,
  generateArgCp003Question,
  scheduleArgCp003Surface,
} from "./cp003-generator.ts";
import { assertArgCp003TemplateContract } from "./cp003-saturation-helpers.ts";
import { ARG_CP003_TEMPLATES_BY_QL } from "./cp003-templates.ts";
import { ARG_QL_IDS, type ArgAnswerClass } from "./types.ts";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function learnerKey(question: ReturnType<typeof generateArgCp003Question>): string {
  return `${question.statement}\n${question.arguments[0]}\n${question.arguments[1]}`.toLowerCase().replace(/\s+/g, " ").trim();
}

const cp002AnswerByArchetype = new Map<string, ArgAnswerClass>();
for (const scenario of ARG_ENGLISH_AUTHORITIES) {
  assert(scenario.id in ARG_ENGLISH_ARCHETYPE_BY_SCENARIO, `${scenario.id}: missing CP002 archetype`);
  const archetype = ARG_ENGLISH_ARCHETYPE_BY_SCENARIO[scenario.id as keyof typeof ARG_ENGLISH_ARCHETYPE_BY_SCENARIO];
  const key = `${scenario.qlId}|${archetype}`;
  assert(!cp002AnswerByArchetype.has(key), `${key}: duplicate CP002 archetype authority`);
  cp002AnswerByArchetype.set(key, scenario.expectedAnswerClass);
}

const globalSemanticSurfaces = new Set<string>();
const bannedToyPhrases = ["attractive colours", "favourite colour", "named after a fruit", "born in january", "particular hometown"];

for (const qlId of ARG_QL_IDS) {
  const templates = ARG_CP003_TEMPLATES_BY_QL[qlId];
  assert(templates.length === ARG_CP003_TEMPLATE_COUNT_PER_QL, `${qlId}: expected eight templates`);

  const archetypes = new Set<string>();
  for (const template of templates) {
    assertArgCp003TemplateContract(template);
    assert(!archetypes.has(template.archetype), `${qlId}: duplicate CP003 archetype ${template.archetype}`);
    archetypes.add(template.archetype);
    const cp002Answer = cp002AnswerByArchetype.get(`${qlId}|${template.archetype}`);
    assert(cp002Answer !== undefined, `${template.id}: archetype missing from certified CP002 corpus`);
    assert(cp002Answer === template.answerClass, `${template.id}: CP003 answer class drifted from CP002 (${template.answerClass} vs ${cp002Answer})`);
  }
  assert(archetypes.size === 8, `${qlId}: expected eight distinct archetypes`);

  const semanticSlots = new Set<number>();
  const templateVariantPairs = new Set<string>();
  const learnerSurfaces = new Set<string>();
  const answerCounts = new Map<ArgAnswerClass, number>([["ONLY_I", 0], ["ONLY_II", 0], ["BOTH", 0], ["NEITHER", 0]]);
  const templateCounts = new Map<string, number>();
  const reversedCounts = new Map<string, number>();
  const answerSequence: ArgAnswerClass[] = [];

  for (let seed = 0; seed < ARG_CP003_SEMANTIC_SURFACE_CAPACITY_PER_QL; seed += 1) {
    const schedule = scheduleArgCp003Surface({ qlId, seed });
    assert(!semanticSlots.has(schedule.semanticSlot), `${qlId}: semantic scheduler collision at seed ${seed}`);
    semanticSlots.add(schedule.semanticSlot);

    const pairKey = `${schedule.templateIndex}:${schedule.variantIndex}`;
    assert(!templateVariantPairs.has(pairKey), `${qlId}: template/variant collision at seed ${seed}`);
    templateVariantPairs.add(pairKey);

    const question = generateArgCp003Question({ qlId, seed });
    assert(question.locale === "en-IN", `${qlId}/${seed}: CP003 must remain English-only`);
    assert(question.correctIndex >= 0 && question.correctIndex <= 3, `${qlId}/${seed}: invalid correct index`);
    assert(question.metadata.questionStudioRegistered === false, `${qlId}/${seed}: CP003 must not register Question Studio early`);
    assert(question.metadata.questionBankWritable === false, `${qlId}/${seed}: Question Bank gate opened`);
    assert(question.metadata.testEligible === false && question.metadata.mockEligible === false, `${qlId}/${seed}: learner test gate opened`);
    assert(question.metadata.publicEligible === false && question.metadata.automaticStudentPublication === false, `${qlId}/${seed}: public learner gate opened`);
    assert(!/\{[abcd]\}/.test(`${question.statement} ${question.arguments.join(" ")}`), `${qlId}/${seed}: unresolved placeholder`);

    const surface = learnerKey(question);
    assert(!learnerSurfaces.has(surface), `${qlId}: duplicate learner surface at seed ${seed}`);
    learnerSurfaces.add(surface);
    assert(!globalSemanticSurfaces.has(`${qlId}|${surface}`), `${qlId}: global learner surface collision`);
    globalSemanticSurfaces.add(`${qlId}|${surface}`);
    for (const phrase of bannedToyPhrases) {
      assert(!surface.includes(phrase), `${qlId}/${seed}: toy phrase survived saturation surface: ${phrase}`);
    }

    answerCounts.set(question.answerClass, (answerCounts.get(question.answerClass) ?? 0) + 1);
    answerSequence.push(question.answerClass);
    templateCounts.set(question.templateId, (templateCounts.get(question.templateId) ?? 0) + 1);
    if (question.metadata.argumentsReversed) reversedCounts.set(question.templateId, (reversedCounts.get(question.templateId) ?? 0) + 1);

    const strengths = question.argumentStrengths;
    const expectedIndex = strengths[0] === "STRONG"
      ? (strengths[1] === "STRONG" ? 2 : 0)
      : (strengths[1] === "STRONG" ? 1 : 3);
    assert(question.correctIndex === expectedIndex, `${qlId}/${seed}: answer index disagrees with ordered strength authority`);
  }

  assert(semanticSlots.size === 2048, `${qlId}: semantic slot saturation failed`);
  assert(templateVariantPairs.size === 2048, `${qlId}: template/variant saturation failed`);
  assert(learnerSurfaces.size === 2048, `${qlId}: learner surface saturation failed`);

  for (const answerClass of ["ONLY_I", "ONLY_II", "BOTH", "NEITHER"] as const) {
    assert(answerCounts.get(answerClass) === 512, `${qlId}: ${answerClass} count must be 512, got ${answerCounts.get(answerClass)}`);
  }
  for (const template of templates) {
    assert(templateCounts.get(template.id) === ARG_CP003_VARIANTS_PER_TEMPLATE, `${template.id}: expected 256 scheduled variants`);
    assert(reversedCounts.get(template.id) === 128, `${template.id}: expected exactly 128 reversed presentations`);
  }

  let maxRun = 1;
  let currentRun = 1;
  for (let i = 1; i < answerSequence.length; i += 1) {
    if (answerSequence[i] === answerSequence[i - 1]) {
      currentRun += 1;
      maxRun = Math.max(maxRun, currentRun);
    } else {
      currentRun = 1;
    }
  }
  assert(maxRun <= 2, `${qlId}: anti-gaming answer streak exceeded 2 (got ${maxRun})`);

  for (let seed = 0; seed < 64; seed += 1) {
    const firstCycle = generateArgCp003Question({ qlId, seed });
    const secondCycle = generateArgCp003Question({ qlId, seed: seed + 2048 });
    assert(firstCycle.statement === secondCycle.statement, `${qlId}/${seed}: semantic cycle should repeat after 2048`);
    assert(firstCycle.arguments[0] === secondCycle.arguments[1] && firstCycle.arguments[1] === secondCycle.arguments[0], `${qlId}/${seed}: next presentation block must reverse argument order`);
  }
}

assert(globalSemanticSurfaces.size === 12288, `Expected 12,288 English learner surfaces, got ${globalSemanticSurfaces.size}`);

console.log(JSON.stringify({
  chapter: "ARG-001",
  checkpoint: "ARG-CP-003",
  qls: 6,
  templatesPerQl: 8,
  variantsPerTemplate: 256,
  semanticSurfacesPerQl: 2048,
  fullEnglishSemanticSurfaceCount: globalSemanticSurfaces.size,
  answerClassPerQl: { ONLY_I: 512, ONLY_II: 512, BOTH: 512, NEITHER: 512 },
  argumentOrderReversalPerTemplate: 128,
  maximumIdenticalAnswerRun: 2,
  cp002SemanticAuthorityPreserved: true,
  localization: "PENDING_CP004",
  questionStudioRegistration: "CLOSED_UNTIL_CP005",
  learnerRelease: "LOCKED",
}, null, 2));
