import { deterministicPick, deterministicShuffle } from "../../deterministic";
import { assertKnowledgeQuestionValid } from "../../question-validation";
import type { KnowledgeFact, KnowledgeV1Difficulty } from "../../types";
import {
  GEO_RIV_001_CP011_BASIN_FACTS_V1,
  GEO_RIV_001_CP011_BASIN_ROWS_V1,
  GEO_RIV_001_CP011_PATTERN_FACTS_V1,
  GEO_RIV_001_CP011_PATTERN_ROWS_V1,
} from "./geo-riv-001-cp011-facts";
import type { GeoRiv001Cp011ReviewQuestion } from "./geo-riv-001-cp011-review-types";

export const GEO_RIV_001_CP011_QL_IDS_V1 = Object.freeze([
  "GEO-RIV-001-QL-092",
  "GEO-RIV-001-QL-093",
  "GEO-RIV-001-QL-094",
  "GEO-RIV-001-QL-095",
  "GEO-RIV-001-QL-096",
  "GEO-RIV-001-QL-097",
  "GEO-RIV-001-QL-098",
  "GEO-RIV-001-QL-099",
  "GEO-RIV-001-QL-100",
] as const);

const QL_NAMES: Record<string, string> = {
  "GEO-RIV-001-QL-092": "River to basin membership",
  "GEO-RIV-001-QL-093": "Basin to river discrimination",
  "GEO-RIV-001-QL-094": "Correctly matched river-basin pair",
  "GEO-RIV-001-QL-095": "Incorrectly matched river-basin pair",
  "GEO-RIV-001-QL-096": "Drainage pattern recognition",
  "GEO-RIV-001-QL-097": "Physiographic control to drainage pattern",
  "GEO-RIV-001-QL-098": "Correctly matched pattern-control pair",
  "GEO-RIV-001-QL-099": "Mixed Statement I and II",
  "GEO-RIV-001-QL-100": "Three-statement basin-pattern count",
};

const BASIN_ROWS = GEO_RIV_001_CP011_BASIN_ROWS_V1;
const PATTERN_ROWS = GEO_RIV_001_CP011_PATTERN_ROWS_V1;
const BASINS = [...new Set(BASIN_ROWS.map((row) => row.basin))];
const RIVERS = BASIN_ROWS.map((row) => row.river);
const PATTERNS = PATTERN_ROWS.map((row) => row.pattern);

function displayRiver(river: string) {
  return river.startsWith("River ") ? river : `River ${river}`;
}

function rawRiver(river: string) {
  return river.replace(/^River\s+/, "");
}

function unique<T>(values: readonly T[]) {
  return [...new Set(values)];
}

function basinFactForRiver(river: string) {
  return GEO_RIV_001_CP011_BASIN_FACTS_V1.find((fact) => fact.entity.label.en === river);
}

function patternFacts(pattern: string) {
  return GEO_RIV_001_CP011_PATTERN_FACTS_V1.filter((fact) => fact.entity.label.en === pattern);
}

function build(args: {
  qlId: string;
  seed: string;
  stem: string;
  answer: string;
  optionPool: readonly string[];
  explanation: string;
  facts: readonly KnowledgeFact[];
  difficulty: KnowledgeV1Difficulty;
  solverAuthority: GeoRiv001Cp011ReviewQuestion["solverAuthority"];
}): GeoRiv001Cp011ReviewQuestion {
  const distractors = deterministicShuffle(unique(args.optionPool.filter((item) => item !== args.answer)), `${args.seed}:${args.qlId}:distractors`).slice(0, 3);
  if (distractors.length !== 3) throw new Error(`CP011 requires three distractors for ${args.qlId}`);
  const rows = deterministicShuffle([{ text: args.answer, correct: true }, ...distractors.map((text) => ({ text, correct: false }))], `${args.seed}:${args.qlId}:options`);
  const options = rows.map((row) => row.text);
  const correctIndex = rows.findIndex((row) => row.correct);
  assertKnowledgeQuestionValid({ stem: args.stem, options, correctIndex, canonicalAnswer: args.answer, explanation: args.explanation });
  return {
    questionId: `GEO-RIV-001-CP011-V1-${args.qlId}-${args.seed}`,
    chapterId: "GEO-RIV-001",
    cpId: "GEO-RIV-001-CP011",
    qlId: args.qlId,
    qlName: QL_NAMES[args.qlId] ?? args.qlId,
    difficulty: args.difficulty,
    stem: args.stem,
    options,
    correctIndex,
    canonicalAnswer: args.answer,
    explanation: args.explanation,
    sourceIds: unique(args.facts.map((fact) => fact.source.sourceId)),
    sourceFactIds: unique(args.facts.map((fact) => fact.factId)),
    solverAuthority: args.solverAuthority,
    reviewOnly: true,
    runtimeRegistered: false,
  };
}

function ql092(seed: string) {
  const row = deterministicPick(BASIN_ROWS, `${seed}:row`);
  const fact = basinFactForRiver(row.river);
  return build({
    qlId: "GEO-RIV-001-QL-092",
    seed,
    stem: `${displayRiver(row.river)} belongs to which of the following river basins?`,
    answer: row.basin,
    optionPool: BASINS,
    explanation: `${displayRiver(row.river)} is part of the ${row.basin}. It belongs to the ${displayRiver(row.parentRiver)} system.`,
    facts: fact ? [fact] : [],
    difficulty: "Easy",
    solverAuthority: "RIVER_BASIN_RELATION",
  });
}

function ql093(seed: string) {
  const basin = deterministicPick(BASINS, `${seed}:basin`);
  const target = deterministicPick(BASIN_ROWS.filter((row) => row.basin === basin), `${seed}:target`);
  const distractors = BASINS.filter((item) => item !== basin).map((other, index) => deterministicPick(BASIN_ROWS.filter((row) => row.basin === other), `${seed}:other:${index}`));
  const pool = [target, ...distractors].map((row) => displayRiver(row.river));
  const fact = basinFactForRiver(target.river);
  return build({
    qlId: "GEO-RIV-001-QL-093",
    seed,
    stem: `Which of the following rivers is a part of the ${basin}?`,
    answer: displayRiver(target.river),
    optionPool: pool,
    explanation: `${displayRiver(target.river)} belongs to the ${basin}; its parent river system is the ${displayRiver(target.parentRiver)} system.`,
    facts: fact ? [fact] : [],
    difficulty: "Medium",
    solverAuthority: "BASIN_RIVER_DISCRIMINATION",
  });
}

function pair(left: string, right: string) {
  return `${left} — ${right}`;
}

function ql094(seed: string) {
  const selected = deterministicShuffle(BASIN_ROWS, `${seed}:rows`).slice(0, 4);
  const target = deterministicPick([0, 1, 2, 3] as const, `${seed}:target`);
  const pairs = selected.map((row, index) => {
    if (index === target) return pair(displayRiver(row.river), row.basin);
    const wrong = deterministicPick(BASINS.filter((basin) => basin !== row.basin), `${seed}:wrong:${index}`);
    return pair(displayRiver(row.river), wrong);
  });
  const row = selected[target];
  return build({
    qlId: "GEO-RIV-001-QL-094",
    seed,
    stem: "Select the correctly matched river–basin pair.",
    answer: pairs[target],
    optionPool: pairs,
    explanation: `${displayRiver(row.river)} belongs to the ${row.basin}. It is part of the ${displayRiver(row.parentRiver)} system.`,
    facts: selected.map((item) => basinFactForRiver(item.river)).filter((fact): fact is KnowledgeFact => Boolean(fact)),
    difficulty: "Medium",
    solverAuthority: "MATCHED_RIVER_BASIN_VERIFIER",
  });
}

function ql095(seed: string) {
  const selected = deterministicShuffle(BASIN_ROWS, `${seed}:rows`).slice(0, 4);
  const target = deterministicPick([0, 1, 2, 3] as const, `${seed}:target`);
  const pairs = selected.map((row, index) => {
    if (index !== target) return pair(displayRiver(row.river), row.basin);
    const wrong = deterministicPick(BASINS.filter((basin) => basin !== row.basin), `${seed}:wrong`);
    return pair(displayRiver(row.river), wrong);
  });
  const row = selected[target];
  return build({
    qlId: "GEO-RIV-001-QL-095",
    seed,
    stem: "Which one of the following river–basin pairs is incorrectly matched?",
    answer: pairs[target],
    optionPool: pairs,
    explanation: `${displayRiver(row.river)} belongs to the ${row.basin}, not to the basin shown in that pair. It is part of the ${displayRiver(row.parentRiver)} system.`,
    facts: selected.map((item) => basinFactForRiver(item.river)).filter((fact): fact is KnowledgeFact => Boolean(fact)),
    difficulty: "Medium",
    solverAuthority: "MATCHED_RIVER_BASIN_VERIFIER",
  });
}

function ql096(seed: string) {
  const row = deterministicPick(PATTERN_ROWS, `${seed}:row`);
  return build({
    qlId: "GEO-RIV-001-QL-096",
    seed,
    stem: `A drainage network in which ${row.recognition} is known as which type of drainage pattern?`,
    answer: row.pattern,
    optionPool: PATTERNS,
    explanation: `${row.pattern} is identified by the way ${row.recognition}. Its form reflects ${row.control}.`,
    facts: patternFacts(row.pattern),
    difficulty: "Easy",
    solverAuthority: "DRAINAGE_PATTERN_RECOGNITION",
  });
}

function ql097(seed: string) {
  const row = deterministicPick(PATTERN_ROWS, `${seed}:row`);
  return build({
    qlId: "GEO-RIV-001-QL-097",
    seed,
    stem: `Which drainage pattern is most closely associated with ${row.control}?`,
    answer: row.pattern,
    optionPool: PATTERNS,
    explanation: `${row.pattern} develops under this control. It is recognized because ${row.recognition}.`,
    facts: patternFacts(row.pattern),
    difficulty: "Medium",
    solverAuthority: "DRAINAGE_PATTERN_CONTROL",
  });
}

function ql098(seed: string) {
  const selected = deterministicShuffle(PATTERN_ROWS, `${seed}:rows`);
  const target = deterministicPick([0, 1, 2, 3] as const, `${seed}:target`);
  const pairs = selected.map((row, index) => {
    if (index === target) return pair(row.pattern, row.control);
    const wrong = selected[(index + 1) % selected.length];
    return pair(row.pattern, wrong.control);
  });
  const row = selected[target];
  return build({
    qlId: "GEO-RIV-001-QL-098",
    seed,
    stem: "Which one of the following drainage pattern–control pairs is correctly matched?",
    answer: pairs[target],
    optionPool: pairs,
    explanation: `${row.pattern} is correctly associated with ${row.control}. It is recognized because ${row.recognition}.`,
    facts: GEO_RIV_001_CP011_PATTERN_FACTS_V1,
    difficulty: "Medium",
    solverAuthority: "MATCHED_PATTERN_CONTROL_VERIFIER",
  });
}

type Claim = Readonly<{ text: string; truth: boolean; explanation: string; facts: KnowledgeFact[] }>;

function basinClaim(seed: string, truth: boolean): Claim {
  const row = deterministicPick(BASIN_ROWS, `${seed}:row`);
  const basin = truth ? row.basin : deterministicPick(BASINS.filter((item) => item !== row.basin), `${seed}:wrong`);
  const fact = basinFactForRiver(row.river);
  return {
    text: `${displayRiver(row.river)} belongs to the ${basin}.`,
    truth,
    explanation: truth
      ? `${displayRiver(row.river)} belongs to the ${row.basin}.`
      : `${displayRiver(row.river)} belongs to the ${row.basin}, not the ${basin}.`,
    facts: fact ? [fact] : [],
  };
}

function patternClaim(seed: string, truth: boolean): Claim {
  const row = deterministicPick(PATTERN_ROWS, `${seed}:row`);
  const condition = truth ? row.control : deterministicPick(PATTERN_ROWS.filter((item) => item.pattern !== row.pattern), `${seed}:wrong`).control;
  return {
    text: `${row.pattern} is associated with ${condition}.`,
    truth,
    explanation: truth
      ? `${row.pattern} is associated with ${row.control}.`
      : `${row.pattern} is associated with ${row.control}, not ${condition}.`,
    facts: patternFacts(row.pattern),
  };
}

const TWO_STATEMENT_OPTIONS = ["Both I and II are correct", "Only I is correct", "Only II is correct", "Neither I nor II is correct"];
function ql099(seed: string) {
  const mode = deterministicPick([0, 1, 2, 3] as const, `${seed}:mode`);
  const first = basinClaim(`${seed}:I`, mode === 0 || mode === 1);
  const second = patternClaim(`${seed}:II`, mode === 0 || mode === 2);
  const answer = TWO_STATEMENT_OPTIONS[mode];
  return build({
    qlId: "GEO-RIV-001-QL-099",
    seed,
    stem: `With reference to river basins and drainage patterns, consider the following statements:\nI. ${first.text}\nII. ${second.text}\nWhich of the statements given above is/are correct?`,
    answer,
    optionPool: TWO_STATEMENT_OPTIONS,
    explanation: `Statement I: ${first.explanation} Statement II: ${second.explanation} Therefore, ${answer}.`,
    facts: [...first.facts, ...second.facts],
    difficulty: "Medium",
    solverAuthority: "STATEMENT_COMPOSITION_VERIFIER",
  });
}

const COUNT_OPTIONS = ["None", "One", "Two", "Three"];
function ql100(seed: string) {
  const targetCount = deterministicPick([0, 1, 2, 3] as const, `${seed}:count`);
  const flags = deterministicShuffle([0, 1, 2].map((index) => index < targetCount), `${seed}:flags`);
  const claims = [basinClaim(`${seed}:1`, flags[0]), patternClaim(`${seed}:2`, flags[1]), basinClaim(`${seed}:3`, flags[2])];
  const answer = COUNT_OPTIONS[targetCount];
  const countWord = ["None", "One", "Two", "Three"][targetCount];
  return build({
    qlId: "GEO-RIV-001-QL-100",
    seed,
    stem: `Consider the following statements about river basins and drainage patterns:\n${claims.map((claim, index) => `${index + 1}. ${claim.text}`).join("\n")}\nHow many of the statements given above are correct?`,
    answer,
    optionPool: COUNT_OPTIONS,
    explanation: `${claims.map((claim, index) => `${index + 1}. ${claim.explanation}`).join(" ")} ${countWord} of the three statements ${targetCount === 1 ? "is" : "are"} correct.`,
    facts: claims.flatMap((claim) => claim.facts),
    difficulty: "Hard",
    solverAuthority: "STATEMENT_COMPOSITION_VERIFIER",
  });
}

export function generateGeoRiv001Cp011ReviewV1(qlId: string, seed: string): GeoRiv001Cp011ReviewQuestion {
  switch (qlId) {
    case "GEO-RIV-001-QL-092": return ql092(seed);
    case "GEO-RIV-001-QL-093": return ql093(seed);
    case "GEO-RIV-001-QL-094": return ql094(seed);
    case "GEO-RIV-001-QL-095": return ql095(seed);
    case "GEO-RIV-001-QL-096": return ql096(seed);
    case "GEO-RIV-001-QL-097": return ql097(seed);
    case "GEO-RIV-001-QL-098": return ql098(seed);
    case "GEO-RIV-001-QL-099": return ql099(seed);
    case "GEO-RIV-001-QL-100": return ql100(seed);
    default: throw new Error(`Unsupported CP011 QL: ${qlId}`);
  }
}

export const geoRiv001Cp011RawRiver = rawRiver;