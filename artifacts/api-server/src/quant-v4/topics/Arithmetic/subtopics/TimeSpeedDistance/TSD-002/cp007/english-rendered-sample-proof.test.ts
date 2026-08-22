import { renderCp007EnglishReviewSamples } from "./english-rendered-sample-runtime";
import { TSD_CP007_PERMANENT_QL_IDS } from "./ql-allocation";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`TSD-CP-007 rendered English proof failed: ${message}`);
}

function normalize(value: string): string {
  return value.toLowerCase().replace(/\d+(?:\/\d+|\.\d+)?/g, "{n}").replace(/\s+/g, " ").trim();
}

const samples = renderCp007EnglishReviewSamples();
assert(samples.length === 66, `expected 66 rendered English review samples, found ${samples.length}`);
assert(new Set(samples.map((sample) => sample.familyId)).size === 66, "rendered family IDs are not unique");
assert(new Set(samples.map((sample) => sample.qlId)).size === 11, "not every permanent QL is represented");

const byQl = new Map<string, typeof samples[number][]>();
const byFamily = new Map(samples.map((sample) => [sample.familyId, sample] as const));
const normalizedStems = new Set<string>();
const normalizedExplanations = new Set<string>();
const difficulty = { EASY: 0, MEDIUM: 0, HARD: 0 };
const bannedRenderedStemPhrases = [
  "without first finding",
  "without treating",
  "explaining what",
  "state which gap",
  "taking care not",
  "keeping the intermediate",
  "maintenance deck",
  "inspection deck",
  "maintenance bay",
  "inspection shed",
  "station logbook",
  "camera line",
  "maintenance block",
] as const;

for (const sample of samples) {
  const list = byQl.get(sample.qlId) ?? [];
  list.push(sample);
  byQl.set(sample.qlId, list);
  difficulty[sample.difficulty as keyof typeof difficulty] += 1;

  assert(sample.unresolvedPlaceholders.length === 0, `${sample.familyId}: unresolved placeholders: ${sample.unresolvedPlaceholders.join(", ")}`);
  assert(!/[{}]/.test(sample.stem), `${sample.familyId}: rendered stem still contains template braces`);
  assert(!/[{}]/.test(sample.explanation), `${sample.familyId}: rendered explanation still contains template braces`);
  assert(!/\b\d+\/\d+\s*s\b/.test(sample.stem), `${sample.familyId}: learner-facing stem contains an awkward fractional-seconds value`);
  assert(sample.explanation.startsWith("Given in this question:"), `${sample.familyId}: explanation does not explicitly state the question-specific givens`);
  assert(sample.explanation.includes("Therefore, the "), `${sample.familyId}: explanation does not explicitly close with the computed target`);
  assert(sample.explanation.includes(sample.answer), `${sample.familyId}: explanation does not include the computed answer`);
  assert(sample.explanation.split(/\s+/).length >= 34, `${sample.familyId}: rendered explanation is too terse`);
  assert(sample.stem.split(/\s+/).length >= 10, `${sample.familyId}: rendered stem is too terse even for a direct exam form`);
  const lowerStem = sample.stem.toLowerCase();
  for (const phrase of bannedRenderedStemPhrases) assert(!lowerStem.includes(phrase), `${sample.familyId}: synthetic/tutorial phrase '${phrase}' remains learner-facing`);

  const stemSignature = normalize(sample.stem);
  assert(!normalizedStems.has(stemSignature), `${sample.familyId}: rendered stem collapses to a duplicate structural signature`);
  normalizedStems.add(stemSignature);
  const explanationSignature = normalize(sample.explanation);
  assert(!normalizedExplanations.has(explanationSignature), `${sample.familyId}: rendered explanation collapses to a duplicate structural signature`);
  normalizedExplanations.add(explanationSignature);
}

for (const qlId of TSD_CP007_PERMANENT_QL_IDS) {
  const qlSamples = byQl.get(qlId) ?? [];
  assert(qlSamples.length === 6, `${qlId}: expected six rendered samples, found ${qlSamples.length}`);
  assert(new Set(qlSamples.map((sample) => sample.scene)).size >= 3, `${qlId}: rendered review pack has too little meaningful scene variety`);
  assert(new Set(qlSamples.map((sample) => sample.representation)).size >= 4, `${qlId}: rendered review pack has too little structural representation variety`);
  assert(new Set(qlSamples.map((sample) => sample.seed)).size >= 6, `${qlId}: numeric source pool is reusing the same executable seed too heavily`);
}

const kmhInputFamilies = ["84-D", "84-F", "85-D", "85-F", "86-D", "86-F", "88-E"];
for (const familyId of kmhInputFamilies) {
  const sample = byFamily.get(familyId);
  assert(sample?.stem.includes("km/h"), `${familyId}: expected a genuine km/h input representation`);
}
const kmhAnswerFamilies = ["87-D", "87-F", "90-E"];
for (const familyId of kmhAnswerFamilies) {
  const sample = byFamily.get(familyId);
  assert(sample?.stem.toLowerCase().includes("km/h"), `${familyId}: stem must explicitly request km/h`);
  assert(sample?.answer.endsWith("km/h"), `${familyId}: rendered answer must be projected to km/h`);
}

assert(difficulty.EASY === 25 && difficulty.MEDIUM === 41 && difficulty.HARD === 0, `rendered difficulty calibration changed: ${JSON.stringify(difficulty)}`);

console.log("TSD-CP-007 RENDERED ENGLISH SAMPLE PROOF: PASS");
console.log(JSON.stringify({
  renderedSamples: samples.length,
  samplesPerQl: 6,
  qls: byQl.size,
  unresolvedPlaceholders: 0,
  awkwardFractionalSecondStems: 0,
  kmhInputFamilies,
  kmhAnswerFamilies,
  difficulty,
  difficultyPolicy: "DEPTH_DRIVEN_NO_FORCED_SPLIT",
  uniqueStructuralStemSignatures: normalizedStems.size,
  uniqueStructuralExplanationSignatures: normalizedExplanations.size,
  explanationShape: "QUESTION_SPECIFIC_GIVENS + HUMAN_REASONING + COMPUTED_CONCLUSION",
  englishStatus: "REVIEW_CANDIDATE",
  questionStudioEnabled: false,
}, null, 2));
