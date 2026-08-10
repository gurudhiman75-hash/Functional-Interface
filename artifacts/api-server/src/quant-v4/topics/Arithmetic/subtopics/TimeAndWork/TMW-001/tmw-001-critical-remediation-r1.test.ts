import { runTmw001ChapterPipeline } from "./foundation/chapter-localized-runtime";
import { add, divide, equals, formatRational, multiply, rational, reciprocal, subtract } from "./foundation/rational";
import { cp007Copy } from "./foundation/localization-cp007-language";
import { cp009Time } from "./foundation/localization-cp009-language";
import { projectLegacyTmwExplanationToV2, validateTmwLearnerExplanationV2 } from "./foundation/learner-explanation-contract";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function assertValid(question: any, label: string): void {
  assert(question.validation?.valid, `${label}: validation failed: ${(question.validation?.errors ?? []).join(" | ")}`);
  assert(question.options.length === 4, `${label}: expected four options`);
  assert(new Set(question.options).size === 4, `${label}: options are not unique`);
  assert(question.options[question.correctIndex] === question.solution.answerText, `${label}: correct option does not equal answer text`);
}

const criticalIds = [
  "TMW-QL-102",
  "TMW-QL-131",
  "TMW-QL-133",
  "TMW-QL-138",
  "TMW-QL-148",
  "TMW-QL-183",
  "TMW-QL-187",
] as const;

for (let seedIndex = 0; seedIndex < 20; seedIndex += 1) {
  const seed = `tmw-r1-critical:${seedIndex}`;

  const q102 = runTmw001ChapterPipeline({ questionLanguageId: "TMW-QL-102", seed, language: "en" });
  assertValid(q102, `QL102:${seed}`);
  assert(q102.parameters.timeA && q102.parameters.timeB, `QL102:${seed}: stem solo times are missing`);
  assert(equals(reciprocal(q102.parameters.cycle[0].rate), q102.parameters.timeA), `QL102:${seed}: first printed solo time diverges from cycle rate`);
  assert(equals(reciprocal(q102.parameters.cycle[1].rate), q102.parameters.timeB), `QL102:${seed}: second printed solo time diverges from cycle rate`);
  assert(q102.stem.includes(`${formatRational(q102.parameters.timeA)} days`), `QL102:${seed}: first solo time is not visible in the stem`);
  assert(q102.stem.includes(`${formatRational(q102.parameters.timeB)} days`), `QL102:${seed}: second solo time is not visible in the stem`);
  const cycleWork = q102.parameters.cycle.reduce(
    (total: any, segment: any) => add(total, multiply(segment.rate, segment.duration)),
    rational(0),
  );
  const cycleTime = q102.parameters.cycle.reduce(
    (total: any, segment: any) => add(total, segment.duration),
    rational(0),
  );
  const exactCycles = divide(q102.parameters.totalWork, cycleWork);
  assert(exactCycles.denominator === 1, `QL102:${seed}: whole work is not an integral number of cycles`);
  assert(typeof q102.solution.answer !== "string", `QL102:${seed}: expected numeric answer`);
  assert(equals(q102.solution.answer, multiply(exactCycles, cycleTime)), `QL102:${seed}: solved time disagrees with exact-boundary oracle`);

  const q187 = runTmw001ChapterPipeline({ questionLanguageId: "TMW-QL-187", seed, language: "en" });
  assertValid(q187, `QL187:${seed}`);
  const control = q187.parameters.levelControl;
  assert(control, `QL187:${seed}: missing level control`);
  assert(control.offPipes.length === 1, `QL187:${seed}: drain phase must have one outlet`);
  assert(control.onPipes.length === 1 && control.onPipes[0].kind === "INLET", `QL187:${seed}: refill phase must be inlet-only`);
  const span = subtract(control.upper, control.lower);
  const drainTime = divide(span, reciprocal(control.offPipes[0].soloTime));
  const fillTime = divide(span, reciprocal(control.onPipes[0].soloTime));
  const expectedReturnTime = multiply(add(drainTime, fillTime), rational(control.targetUpperHits));
  assert(equals(q187.solution.answerValues[0], expectedReturnTime), `QL187:${seed}: controller answer disagrees with independent phase oracle`);

  for (const language of ["hi", "pa"] as const) {
    for (const qlId of criticalIds) {
      const question = runTmw001ChapterPipeline({ questionLanguageId: qlId, seed, language });
      assertValid(question, `${qlId}:${language}:${seed}`);
      assert(question.publiclyPublishable === false, `${qlId}:${language}:${seed}: publication lock changed`);
      const projected = projectLegacyTmwExplanationToV2(question);
      const contractErrors = validateTmwLearnerExplanationV2(projected);
      assert(contractErrors.length === 0, `${qlId}:${language}:${seed}: V2 explanation projection invalid: ${contractErrors.join(" | ")}`);

      if (qlId === "TMW-QL-102") {
        assert(question.parameters.timeA && question.parameters.timeB, `${qlId}:${language}:${seed}: solo times missing`);
        assert(equals(reciprocal(question.parameters.cycle[0].rate), question.parameters.timeA), `${qlId}:${language}:${seed}: first solo time/rate mismatch`);
        assert(equals(reciprocal(question.parameters.cycle[1].rate), question.parameters.timeB), `${qlId}:${language}:${seed}: second solo time/rate mismatch`);
      }
      if (qlId === "TMW-QL-131") {
        const p = question.parameters;
        const target = p.targetCategoryIndex ?? p.replacementCategoryIndex ?? 0;
        const targetName = cp007Copy(p.context.categories[target].plural, language);
        assert(question.stem.includes(targetName), `${qlId}:${language}:${seed}: stem omits target category ${targetName}`);
      }
      if (qlId === "TMW-QL-133") {
        const categories = question.parameters.context.categories;
        assert(question.stem.includes(formatRational(categories[0].efficiency)), `${qlId}:${language}:${seed}: first individual rate missing`);
        assert(question.stem.includes(formatRational(categories[1].efficiency)), `${qlId}:${language}:${seed}: second individual rate missing`);
      }
      if (qlId === "TMW-QL-138") {
        const ratio = question.parameters.context.categories.map((category: any) => formatRational(category.efficiency)).join(":");
        assert(question.stem.includes(ratio), `${qlId}:${language}:${seed}: efficiency ratio ${ratio} missing`);
      }
      if (qlId === "TMW-QL-148") {
        const phrase = language === "hi" ? "समान संख्या में घंटे" : "ਇੱਕੋ ਗਿਣਤੀ ਦੇ ਘੰਟੇ";
        assert(question.stem.includes(phrase), `${qlId}:${language}:${seed}: equal daily hours assumption is not explicit`);
      }
      if (qlId === "TMW-QL-183") {
        const firstPipe = question.parameters.stages?.[0]?.pipes?.[0];
        assert(firstPipe, `${qlId}:${language}:${seed}: first-stage pipe missing`);
        const soloTime = cp009Time(firstPipe.soloTime, language);
        assert(question.stem.includes(soloTime), `${qlId}:${language}:${seed}: Pipe A solo filling time ${soloTime} missing`);
      }
      if (qlId === "TMW-QL-187") {
        const lc = question.parameters.levelControl;
        assert(lc?.onPipes.length === 1 && lc.onPipes[0].kind === "INLET", `${qlId}:${language}:${seed}: localized source did not retain exclusive refill phase`);
      }
    }
  }
}

console.log(JSON.stringify({
  chapter: "TMW-001",
  remediation: "R1-critical",
  seedsPerQl: 20,
  criticalQls: criticalIds.length,
  localizedRowsChecked: criticalIds.length * 20 * 2,
  verdict: "PASS",
}, null, 2));
