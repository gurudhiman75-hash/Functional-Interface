import { compare, rational } from "./foundation/rational";
import { TMW_CP_011_REGISTRY } from "./foundation/cp011-registry";
import { selectTmwCp011StemOpeningStyle, type TmwCp011StemOpeningStyle } from "./foundation/cp011-presentation";
import { runTmwCp011Pipeline } from "./foundation/cp011-runtime";

const expectedIds = Array.from({ length: 19 }, (_, index) => `TMW-QL-${193 + index}`);
if (TMW_CP_011_REGISTRY.map((entry) => entry.qlId).join("|") !== expectedIds.join("|")) {
  throw new Error("CP-011 QL continuity mismatch");
}

const allStems = new Set<string>();
const contexts = new Set<string>();
const multipliers = new Set<string>();
const arithmeticSigns = new Set<number>();
const thresholdSigns = new Set<number>();
const recoveredChangeSigns = new Set<number>();
const openingStyleCounts = new Map<TmwCp011StemOpeningStyle, number>();
let total = 0;

for (const entry of TMW_CP_011_REGISTRY) {
  const positions = new Set<number>();
  const fingerprints = new Set<string>();
  const perQlOpeningStyles = new Map<TmwCp011StemOpeningStyle, number>();
  for (let index = 0; index < 50; index += 1) {
    const seed = `runtime-${entry.qlId}-${index}`;
    const question = runTmwCp011Pipeline(entry.qlId, seed);
    const replay = runTmwCp011Pipeline(entry.qlId, seed);
    if (JSON.stringify(question) !== JSON.stringify(replay)) throw new Error(`${entry.qlId}: non-deterministic replay`);
    if (!question.validation.valid) throw new Error(`${entry.qlId}:${index}: ${question.validation.errors.join(" | ")}`);
    if (new Set(question.options).size !== 4) throw new Error(`${entry.qlId}:${index}: duplicate options`);
    if (question.options.filter((option) => option === question.solution.answerText).length !== 1) throw new Error(`${entry.qlId}:${index}: answer multiplicity`);
    if (entry.answerType === "OUTPUT" && question.optionAudit.some((option) => option.value.denominator !== 1)) throw new Error(`${entry.qlId}:${index}: fractional discrete output option`);
    if (question.parameters.targetOutput?.denominator !== undefined && question.parameters.targetOutput.denominator !== 1) throw new Error(`${entry.qlId}:${index}: fractional discrete target`);
    if (question.parameters.initialRate && compare(question.parameters.initialRate, rational(0)) <= 0) throw new Error(`${entry.qlId}:${index}: non-positive initial rate`);
    if (question.parameters.postThresholdRate && compare(question.parameters.postThresholdRate, rational(0)) <= 0) throw new Error(`${entry.qlId}:${index}: non-positive post-threshold rate`);
    if (question.parameters.sequenceKind === "ARITHMETIC" && question.parameters.dailyChange) arithmeticSigns.add(Math.sign(question.parameters.dailyChange.numerator));
    if (question.parameters.multiplier) multipliers.add(`${question.parameters.multiplier.numerator}/${question.parameters.multiplier.denominator}`);
    if (question.parameters.sequenceKind === "THRESHOLD" && question.parameters.postThresholdRate && question.parameters.initialRate) {
      thresholdSigns.add(compare(question.parameters.postThresholdRate, question.parameters.initialRate));
    }
    if (entry.solveMode === "findPostThresholdRateChange") recoveredChangeSigns.add(Math.sign(question.solution.answer.numerator));
    if (["findCompletionTimeFromArithmeticDailyRates", "findCompletionTimeFromGeometricDailyRates", "findCompletionTimeAfterThresholdRateSwitch", "findCompletionTimeFromExplicitRateTable", "findCompletionTimeWithVaryingCrewByDay"].includes(entry.solveMode)) {
      const days = question.parameters.days!;
      if (!(question.solution.answer.numerator * 1 > (days - 1) * question.solution.answer.denominator && question.solution.answer.numerator < days * question.solution.answer.denominator)) {
        throw new Error(`${entry.qlId}:${index}: terminal partial-day boundary not exercised`);
      }
    }
    const openingStyle = selectTmwCp011StemOpeningStyle(entry, seed);
    if (openingStyle === "CONTEXT_FIRST" && !question.stem.startsWith("At ")) throw new Error(`${entry.qlId}:${index}: context-first stem mismatch`);
    if (openingStyle !== "CONTEXT_FIRST" && question.stem.startsWith("At ")) throw new Error(`${entry.qlId}:${index}: fixed At-prefix leaked into ${openingStyle}`);
    perQlOpeningStyles.set(openingStyle, (perQlOpeningStyles.get(openingStyle) ?? 0) + 1);
    openingStyleCounts.set(openingStyle, (openingStyleCounts.get(openingStyle) ?? 0) + 1);
    positions.add(question.correctIndex);
    fingerprints.add(question.mathematicalFingerprint);
    allStems.add(question.stem);
    contexts.add(question.parameters.context.setting);
    total += 1;
  }
  if (positions.size !== 4) throw new Error(`${entry.qlId}: all four answer positions not reached`);
  if (fingerprints.size < 3) throw new Error(`${entry.qlId}: insufficient mathematical diversity`);
  if (perQlOpeningStyles.size !== 4) throw new Error(`${entry.qlId}: all four stem-opening styles not reached`);
  if ((perQlOpeningStyles.get("CONTEXT_FIRST") ?? 0) !== 10) throw new Error(`${entry.qlId}: context-first frequency is not exactly 20%`);
}

if (multipliers.size !== 3 || !multipliers.has("1/2") || !multipliers.has("3/2") || !multipliers.has("2/1")) throw new Error("geometric multiplier coverage incomplete");
if (!arithmeticSigns.has(-1) || !arithmeticSigns.has(1)) throw new Error("arithmetic increase/decrease coverage incomplete");
if (!thresholdSigns.has(-1) || !thresholdSigns.has(1)) throw new Error("threshold learning/fatigue coverage incomplete");
if (!recoveredChangeSigns.has(-1) || !recoveredChangeSigns.has(1)) throw new Error("recovered threshold-change direction coverage incomplete");
if (contexts.size !== 6) throw new Error(`context coverage incomplete: ${contexts.size}`);
if (openingStyleCounts.size !== 4) throw new Error("stem-opening style coverage incomplete");
if ((openingStyleCounts.get("CONTEXT_FIRST") ?? 0) * 5 !== total) throw new Error("global context-first frequency is not exactly 20%");

console.log(JSON.stringify({
  qls: TMW_CP_011_REGISTRY.length,
  total,
  distinctStems: allStems.size,
  contexts: contexts.size,
  openingStyleCounts: Object.fromEntries(openingStyleCounts),
  multipliers: [...multipliers].sort(),
  arithmeticSigns: [...arithmeticSigns].sort(),
  thresholdSigns: [...thresholdSigns].sort(),
  recoveredChangeSigns: [...recoveredChangeSigns].sort(),
}, null, 2));
