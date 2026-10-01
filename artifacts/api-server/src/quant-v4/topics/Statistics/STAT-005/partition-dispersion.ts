import { STAT005_PERMANENT_QLS, getStat005PermanentQl, STAT005_PERMANENT_OWNERSHIP } from "./permanent-ql-registry";
import { STAT005_CONTRACTS, type Stat005ContractId, type Stat005Difficulty, type Stat005ExamProfile, type Stat005Question, type Stat005State } from "./types";

function hash(text: string) { let h = 2166136261; for (let i = 0; i < text.length; i += 1) h = Math.imul(h ^ text.charCodeAt(i), 16777619); return h >>> 0; }
function fmt(n: number) { const rounded = Math.round(n * 100) / 100; return Number.isInteger(rounded) ? String(rounded) : String(rounded); }
function rng(seed: string) { let x = hash(seed) || 1; return () => { x ^= x << 13; x ^= x >>> 17; x ^= x << 5; return (x >>> 0) / 4294967296; }; }
function choose<T>(values: readonly T[], seed: string): T { return values[hash(seed) % values.length]!; }
function shuffled<T>(values: readonly T[], seed: string): T[] { const out = [...values]; const r = rng(seed); for (let i = out.length - 1; i > 0; i -= 1) { const j = Math.floor(r() * (i + 1)); [out[i], out[j]] = [out[j]!, out[i]!]; } return out; }
function options(answer: number, seed: string) {
  const base = Math.round(answer * 100) / 100;
  const deltas = [1, 2, -1, -2, 5, -5].map((n) => n * (Math.abs(base) < 1 ? 0.1 : 1));
  const candidates = [base, ...deltas.map((d) => Math.round((base + d) * 100) / 100)];
  const unique = [...new Set(candidates)].slice(0, 4);
  while (unique.length < 4) unique.push(Math.round((base + unique.length * 7 + 3) * 100) / 100);
  return shuffled(unique.map(fmt), seed) as [string, string, string, string];
}
function rawPosition(values: readonly number[], numerator: number, denominator: number) {
  const ordered = [...values].sort((a, b) => a - b);
  const position = numerator * (ordered.length + 1) / denominator;
  const bounded = Math.max(1, Math.min(ordered.length, position));
  const lowerIndex = Math.floor(bounded) - 1;
  const fraction = bounded - Math.floor(bounded);
  const low = ordered[lowerIndex]!;
  const high = ordered[Math.min(lowerIndex + 1, ordered.length - 1)]!;
  return low + fraction * (high - low);
}
function discretePosition(rows: readonly { value: number; frequency: number }[], numerator: number, denominator: number) {
  const total = rows.reduce((n, row) => n + row.frequency, 0);
  const rank = Math.max(1, Math.ceil(numerator * total / denominator));
  let cumulative = 0;
  for (const row of rows) { cumulative += row.frequency; if (cumulative >= rank) return { value: row.value, rank, total }; }
  throw new Error("Discrete partition rank exceeded the frequency total.");
}
function groupedPosition(classes: readonly { lower: number; upper: number; frequency: number }[], numerator: number, denominator: number) {
  const total = classes.reduce((n, row) => n + row.frequency, 0);
  const target = numerator * total / denominator;
  let cumulative = 0;
  for (const row of classes) {
    if (target <= cumulative + row.frequency) return { value: row.lower + ((target - cumulative) / row.frequency) * (row.upper - row.lower), target, total, cumulativeBefore: cumulative, row };
    cumulative += row.frequency;
  }
  throw new Error("Grouped partition target exceeded the frequency total.");
}
function rawValues(seed: string, count = 9) {
  const r = rng(seed); const start = 12 + Math.floor(r() * 9) * 3; const step = 2 + Math.floor(r() * 3);
  return Array.from({ length: count }, (_, i) => start + i * step + (i % 3 === 1 ? 1 : 0));
}
function rawTable(values: readonly number[]) { return values.map((x) => x).join(", "); }
function freqTable(rows: readonly { value: number; frequency: number }[]) { return [`| Value | Frequency |`, `|---:|---:|`, ...rows.map((r) => `| ${r.value} | ${r.frequency} |`)].join("\n"); }
function groupedTable(rows: readonly { lower: number; upper: number; frequency: number }[]) { return [`| Class interval | Frequency |`, `|---:|---:|`, ...rows.map((r) => `| ${r.lower}–${r.upper} | ${r.frequency} |`)].join("\n"); }
function contractSpec(contractId: Stat005ContractId, seed: string): { state: Stat005State; answer: number; stem: string; explanation: string } {
  const r = rng(seed);
  if (contractId.endsWith("FROM_RAW_DATA")) {
    const values = rawValues(seed, contractId === "QUARTILE_FROM_RAW_DATA" ? 11 : 9);
    const [numerator, denominator, symbol] = contractId === "QUARTILE_FROM_RAW_DATA"
      ? [choose([1, 2, 3], `${seed}:k`), 4, "Q"]
      : contractId === "DECILE_FROM_RAW_DATA" ? [choose([2, 3, 4, 6, 7, 8], `${seed}:k`), 10, "D"]
        : [choose([20, 25, 30, 40, 60, 70, 75, 80], `${seed}:k`), 100, "P"];
    const answer = rawPosition(values, numerator, denominator);
    const state: Stat005State = { kind: "RAW_PARTITION", values, numerator, denominator, convention: "N_PLUS_1_LINEAR" };
    const label = symbol === "Q" ? `Q${numerator}` : symbol === "D" ? `D${numerator}` : `P${numerator}`;
    const position = numerator * (values.length + 1) / denominator;
    return { state, answer, stem: `For the ordered observations ${rawTable(values)}, what is ${label} under the k(n + 1)/m position rule with linear interpolation when needed?`, explanation: `${label}'s position is ${numerator} × (${values.length} + 1) / ${denominator} = ${fmt(position)}. Interpolate at that position in the ordered observations; the value is ${fmt(answer)}.` };
  }
  if (contractId.endsWith("FROM_DISCRETE_FREQUENCY")) {
    const start = choose([6, 10, 12, 15, 20], `${seed}:discrete:start`);
    const step = choose([4, 5, 6, 8, 10], `${seed}:discrete:step`);
    const frequencies = choose([
      [2, 4, 5, 7, 5],
      [3, 5, 8, 6, 3],
      [4, 6, 9, 7, 4],
      [2, 7, 10, 6, 5],
      [5, 8, 11, 7, 3],
      [3, 6, 12, 8, 4],
    ] as const, `${seed}:discrete:freq`);
    const values = Array.from({ length: frequencies.length }, (_, i) => start + i * step);
    const rows = values.map((value, i) => ({ value, frequency: frequencies[i]! }));
    const [numerator, denominator, symbol] = contractId === "QUARTILE_FROM_DISCRETE_FREQUENCY"
      ? [choose([1, 2, 3], `${seed}:k`), 4, "Q"]
      : contractId === "DECILE_FROM_DISCRETE_FREQUENCY" ? [choose([2, 3, 4, 6, 7, 8], `${seed}:k`), 10, "D"]
        : [choose([20, 25, 30, 40, 60, 70, 75, 80], `${seed}:k`), 100, "P"];
    const result = discretePosition(rows, numerator, denominator);
    const state: Stat005State = { kind: "DISCRETE_PARTITION", rows, numerator, denominator, convention: "CEILING_KN_OVER_M" };
    const label = symbol === "Q" ? `Q${numerator}` : symbol === "D" ? `D${numerator}` : `P${numerator}`;
    return { state, answer: result.value, stem: `The following ordered frequency distribution has N = ${result.total}. Under the nearest-rank rule ceil(kN/m), what is ${label}?\n${freqTable(rows)}`, explanation: `The rank is ceil(${numerator} × ${result.total} / ${denominator}) = ${result.rank}. The cumulative frequencies are ${rows.map((_, i) => rows.slice(0, i + 1).reduce((n, row) => n + row.frequency, 0)).join(", ")}, so rank ${result.rank} falls at value ${result.value}.` };
  }
  if (contractId.endsWith("FROM_GROUPED_DATA")) {
    const width = choose([5, 10, 15, 20], `${seed}:grouped:width`);
    const start = choose([0, 10, 20, 30], `${seed}:grouped:start`);
    const frequencies = choose([
      [2, 4, 5, 7, 5],
      [4, 7, 11, 8, 4],
      [3, 6, 10, 9, 5],
      [5, 9, 13, 8, 3],
      [2, 8, 12, 7, 4],
      [6, 10, 14, 9, 5],
    ] as const, `${seed}:grouped:freq`);
    const classes = frequencies.map((frequency, i) => ({ lower: start + i * width, upper: start + (i + 1) * width, frequency }));
    const [numerator, denominator, symbol] = contractId === "QUARTILE_FROM_GROUPED_DATA"
      ? [choose([1, 2, 3], `${seed}:k`), 4, "Q"]
      : contractId === "DECILE_FROM_GROUPED_DATA" ? [choose([2, 3, 4, 6, 7, 8], `${seed}:k`), 10, "D"]
        : [choose([20, 25, 30, 40, 60, 70, 75, 80], `${seed}:k`), 100, "P"];
    const result = groupedPosition(classes, numerator, denominator);
    const state: Stat005State = { kind: "GROUPED_PARTITION", classes, numerator, denominator, convention: "K_N_OVER_M_INTERPOLATION" };
    const label = symbol === "Q" ? `Q${numerator}` : symbol === "D" ? `D${numerator}` : `P${numerator}`;
    return { state, answer: result.value, stem: `Under the grouped interpolation rule at position kN/m, what is ${label}?\n${groupedTable(classes)}`, explanation: `N = ${result.total}, so the target position is ${numerator} × ${result.total} / ${denominator} = ${fmt(result.target)}. This lies in ${result.row.lower}–${result.row.upper}. Using L + [(target − cumulative frequency before the class) / class frequency] × class width gives ${result.row.lower} + [(${fmt(result.target)} − ${result.cumulativeBefore}) / ${result.row.frequency}] × ${result.row.upper - result.row.lower} ≈ ${fmt(result.value)}.` };
  }
  if (contractId === "RANGE_OF_RAW_DATA" || contractId === "COEFFICIENT_OF_RANGE") {
    const values = rawValues(`${seed}:range`, 6); const min = Math.min(...values); const max = Math.max(...values);
    const state: Stat005State = { kind: "RAW_RANGE", values };
    const answer = contractId === "RANGE_OF_RAW_DATA" ? max - min : 100 * (max - min) / (max + min);
    const stem = contractId === "RANGE_OF_RAW_DATA" ? `What is the range of the observations ${rawTable(values)}?` : `The smallest and largest observations in a data set are ${min} and ${max}. What is the coefficient of range as a percentage.`;
    const explanation = contractId === "RANGE_OF_RAW_DATA" ? `The largest value is ${max} and the smallest is ${min}. Range = ${max} − ${min} = ${fmt(answer)}.` : `Coefficient of range = (largest − smallest) / (largest + smallest) × 100 = (${max} − ${min}) / (${max} + ${min}) × 100 ≈ ${fmt(answer)}%.`;
    return { state, answer, stem, explanation };
  }
  if (contractId === "QUARTILE_DEVIATION_OF_RAW_DATA") {
    const values = rawValues(`${seed}:qd`, 11); const q1 = rawPosition(values, 1, 4); const q3 = rawPosition(values, 3, 4);
    const state: Stat005State = { kind: "RAW_QUARTILE_DEVIATION", values };
    return { state, answer: (q3 - q1) / 2, stem: `For the ordered observations ${rawTable(values)}, what is the quartile deviation under the k(n + 1)/4 position rule with linear interpolation?`, explanation: `Q1 is at position (${values.length} + 1)/4 = 3 and equals ${fmt(q1)}. Q3 is at position 3(${values.length} + 1)/4 = 9 and equals ${fmt(q3)}. Quartile deviation = (Q3 − Q1)/2 = (${fmt(q3)} − ${fmt(q1)})/2 = ${fmt((q3 - q1) / 2)}.` };
  }
  if (contractId === "COEFFICIENT_OF_QUARTILE_DEVIATION") {
    const q1 = 10 + Math.floor(r() * 8) * 2; const q3 = q1 + 12 + Math.floor(r() * 7) * 2;
    const state: Stat005State = { kind: "COEFFICIENT_QUARTILE_DEVIATION", q1, q3 };
    const answer = 100 * (q3 - q1) / (q3 + q1);
    return { state, answer, stem: `For a distribution, Q1 = ${q1} and Q3 = ${q3}. What is the coefficient of quartile deviation as a percentage.`, explanation: `Coefficient of quartile deviation = (Q3 − Q1)/(Q3 + Q1) × 100 = (${q3} − ${q1})/(${q3} + ${q1}) × 100 ≈ ${fmt(answer)}%.` };
  }
  if (contractId === "MEAN_DEVIATION_ABOUT_MEAN" || contractId === "MEAN_DEVIATION_ABOUT_MEDIAN") {
    const center = 20 + Math.floor(r() * 5) * 4; const gaps = [0, 0, 4, 4, 8, 8];
    const values = shuffled(gaps.map((gap, i) => center + (i % 2 ? gap : -gap)), `${seed}:md`).sort((a, b) => a - b);
    const about = contractId === "MEAN_DEVIATION_ABOUT_MEAN" ? "mean" : "median";
    const base = about === "mean" ? values.reduce((a, b) => a + b, 0) / values.length : (values[2]! + values[3]!) / 2;
    const answer = values.reduce((sum, value) => sum + Math.abs(value - base), 0) / values.length;
    const state: Stat005State = { kind: "RAW_MEAN_DEVIATION", values, about };
    const deviations = values.map((v) => Math.abs(v - base));
    return { state, answer, stem: `What is the mean deviation about the ${about} for the observations ${rawTable(values)}?`, explanation: `The ${about} is ${fmt(base)}. The absolute deviations are ${deviations.map(fmt).join(", ")}. Their sum is ${fmt(answer * values.length)}; dividing by ${values.length} gives mean deviation ${fmt(answer)}.` };
  }
  const mean = 30 + Math.floor(r() * 5) * 10; const sd = 3 + Math.floor(r() * 5) * 3;
  const answer = sd / mean * 100;
  const state: Stat005State = { kind: "COEFFICIENT_OF_VARIATION", mean, populationStandardDeviation: sd };
  return { state, answer, stem: `A distribution has arithmetic mean ${mean} and population standard deviation ${sd}. What is its coefficient of variation as a percentage.`, explanation: `Coefficient of variation = standard deviation / mean × 100 = ${sd}/${mean} × 100 ≈ ${fmt(answer)}%.` };
}

export function solveStat005State(state: Stat005State, contractId: Stat005ContractId) {
  if (state.kind === "RAW_PARTITION") return rawPosition(state.values, state.numerator, state.denominator);
  if (state.kind === "DISCRETE_PARTITION") return discretePosition(state.rows, state.numerator, state.denominator).value;
  if (state.kind === "GROUPED_PARTITION") return groupedPosition(state.classes, state.numerator, state.denominator).value;
  if (state.kind === "RAW_RANGE") { const range = Math.max(...state.values) - Math.min(...state.values); return contractId === "COEFFICIENT_OF_RANGE" ? 100 * range / (Math.max(...state.values) + Math.min(...state.values)) : range; }
  if (state.kind === "RAW_QUARTILE_DEVIATION") return (rawPosition(state.values, 3, 4) - rawPosition(state.values, 1, 4)) / 2;
  if (state.kind === "COEFFICIENT_QUARTILE_DEVIATION") return 100 * (state.q3 - state.q1) / (state.q3 + state.q1);
  if (state.kind === "RAW_MEAN_DEVIATION") { const ordered = [...state.values].sort((a, b) => a - b); const center = state.about === "mean" ? state.values.reduce((a, b) => a + b, 0) / state.values.length : (ordered[Math.floor((ordered.length - 1) / 2)]! + ordered[Math.ceil((ordered.length - 1) / 2)]!) / 2; return state.values.reduce((sum, value) => sum + Math.abs(value - center), 0) / state.values.length; }
  return state.populationStandardDeviation / state.mean * 100;
}

export function generateStat005Question(input: { seed?: string; examProfile?: Stat005ExamProfile; contractId?: Stat005ContractId } = {}): Stat005Question {
  const seed = input.seed ?? "STAT-005:P0";
  const examProfile = input.examProfile ?? "SSC_CGL_TIER_II";
  const contractId = input.contractId ?? choose(STAT005_CONTRACTS, `${seed}:contract`);
  const descriptor = STAT005_PERMANENT_QLS.find((item) => item.contractId === contractId);
  if (!descriptor || !descriptor.supportedProfiles.includes(examProfile)) throw new Error(`Unsupported STAT-005 contract/profile: ${contractId}/${examProfile}.`);
  const draft = contractSpec(contractId, seed);
  const answer = fmt(draft.answer);
  const correctIndex = hash(`${seed}:${contractId}:correct-index`) % 4;
  const optionTexts = options(draft.answer, `${seed}:${contractId}:options`);
  const rotated = [...optionTexts];
  const found = rotated.indexOf(answer);
  if (found < 0) rotated[correctIndex] = answer; else [rotated[correctIndex], rotated[found]] = [rotated[found]!, rotated[correctIndex]!];
  const question: Stat005Question = {
    packageId: "STAT-005", questionId: `STAT-005:${hash(`${seed}:${examProfile}:${contractId}`).toString(16).padStart(8, "0")}`,
    qlId: descriptor.qlId, contractId, seed, examProfile, difficulty: descriptor.difficulty, language: "en",
    stem: draft.stem, options: rotated as [string, string, string, string], correctIndex, answer, state: draft.state,
    explanation: draft.explanation, questionBankWritable: false, testEligible: false, mockTestEligible: false,
    publiclyPublishable: false, automaticStudentPublication: false, productionReleaseAuthorized: false,
  };
  if (new Set(question.options).size !== 4 || question.options[correctIndex] !== answer || fmt(solveStat005State(question.state, contractId)) !== answer) throw new Error(`STAT-005 validation failed for ${contractId}.`);
  return question;
}

export function generateStat005QuestionStudioBatch(input: { packageId?: string; seed?: string; count?: number; language?: string; examProfile?: string; questionLanguageId?: string } = {}) {
  if (input.packageId && input.packageId !== "STAT-005") throw new Error(`Unknown STAT-005 package '${input.packageId}'.`);
  if (input.language && input.language !== "en") throw new Error("STAT-005 is English-only; localization has not started.");
  const examProfile = input.examProfile === "SSC_CGL_JSO" ? "SSC_CGL_JSO" : "SSC_CGL_TIER_II";
  const count = Math.min(1000, Math.max(1, Math.floor(input.count ?? 1)));
  const batchSeed = input.seed ?? `STAT-005:${examProfile}:review`;
  const explicit = input.questionLanguageId ? getStat005PermanentQl(input.questionLanguageId) : undefined;
  if (input.questionLanguageId && !explicit) throw new Error(`Unknown STAT-005 QL '${input.questionLanguageId}'.`);
  const pool = explicit ? [explicit] : STAT005_PERMANENT_QLS;
  const questions = Array.from({ length: count }, (_, index) => {
    const descriptor = pool[index % pool.length]!;
    const question = generateStat005Question({ seed: `${batchSeed}:${descriptor.qlId}:${index}`, examProfile, contractId: descriptor.contractId });
    return { ...question, questionLanguageId: question.qlId, canonicalProblemId: "STAT-CP-005", patternId: "STAT-005", permanentQlId: question.qlId,
      topic: "Statistics", subtopic: "Partition Values & Dispersion", section: "Quant", generationBackend: "quant-v4",
      runtimeMode: "STAT005_PERMANENT_ENGLISH_REVIEW_P0", reviewStatus: "ENGLISH_REVIEW_CANDIDATE",
      questionBankStatus: "NOT_STORED", publiclyPublishable: false, automaticStudentPublication: false,
      productionReleaseAuthorized: false, manualApprovalRequired: true };
  });
  return { engineId: "quant-v4", generationContext: { generationDomain: "quant-v4", packageId: "STAT-005",
    canonicalProblemId: "STAT-CP-005", seed: batchSeed, language: "en", examProfile,
    runtimeMode: "STAT005_PERMANENT_ENGLISH_REVIEW_P0", reviewStatus: "ENGLISH_REVIEW_CANDIDATE",
    releaseId: STAT005_PERMANENT_OWNERSHIP.releaseId, permanentQlCount: STAT005_PERMANENT_QLS.length,
    questionStudioDiscoverable: true, questionStudioMode: "CONTROLLED_REVIEW", questionBankStatus: "NOT_STORED",
    questionBankWritable: false, testEligibility: "INELIGIBLE", testEligible: false, mockTestEligible: false,
    publiclyPublishable: false, automaticStudentPublication: false, productionReleaseAuthorized: false, manualApprovalRequired: true }, questions };
}

export function stat005QuestionStudioPackageCard() {
  return { id: "STAT-005", packageId: "STAT-005", type: "quant-v4", section: "Quant", domain: "quant", topic: "Statistics",
    subtopic: "Partition Values & Dispersion", name: "STAT-005 Partition Values & Dispersion",
    label: "Quartiles, Deciles, Percentiles & Dispersion", generationDomain: "quant-v4", cpIds: ["STAT-CP-005"],
    permanentQlIds: STAT005_PERMANENT_QLS.map((item) => item.qlId), permanentQlCount: STAT005_PERMANENT_QLS.length,
    supportedDifficulties: ["easy", "medium", "hard"], supportedLanguages: ["en"],
    supportedExamProfiles: ["SSC_CGL_TIER_II", "SSC_CGL_JSO"], enabled: true,
    runtimeMode: "STAT005_PERMANENT_ENGLISH_REVIEW_P0", supportedRuntimeModes: ["STAT005_PERMANENT_ENGLISH_REVIEW_P0"],
    questionStudioDiscoverable: true, questionStudioMode: "CONTROLLED_REVIEW", questionBankStatus: "NOT_STORED",
    questionBankWritable: false, testEligibility: "INELIGIBLE", testEligible: false, mockTestEligible: false,
    publiclyPublishable: false, automaticStudentPublication: false, productionReleaseAuthorized: false, manualApprovalRequired: true,
    localizationStatus: "NOT_STARTED" };
}
