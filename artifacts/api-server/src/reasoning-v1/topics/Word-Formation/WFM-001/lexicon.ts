import { WOR_WORD_FAMILIES } from "../../Word-Dictionary-Order/WOR-001/datasets/word-registry";
import type { WfmCandidateAnalysis } from "./types";

function normalize(word: string): string {
  return word.toUpperCase().replace(/[^A-Z]/g, "");
}

function counts(word: string): Map<string, number> {
  const out = new Map<string, number>();
  for (const letter of normalize(word)) out.set(letter, (out.get(letter) ?? 0) + 1);
  return out;
}

export function analyseCandidate(sourceWord: string, candidateWord: string): WfmCandidateAnalysis {
  const source = counts(sourceWord);
  const candidate = counts(candidateWord);
  const deficits: Record<string, { needed: number; available: number }> = {};
  let totalDeficit = 0;
  let hasAbsent = false;
  let hasMultiplicity = false;

  for (const [letter, needed] of candidate) {
    const available = source.get(letter) ?? 0;
    if (needed <= available) continue;
    deficits[letter] = { needed, available };
    totalDeficit += needed - available;
    if (available === 0) hasAbsent = true;
    else hasMultiplicity = true;
  }

  const deficitKind = totalDeficit === 0
    ? "NONE"
    : hasAbsent && hasMultiplicity
      ? "MIXED"
      : hasAbsent
        ? "ABSENT_LETTER"
        : "MULTIPLICITY";

  return {
    word: normalize(candidateWord),
    canForm: totalDeficit === 0,
    deficitKind,
    totalDeficit,
    deficits,
  };
}

// These source words are taken from the classic source-backed word-formation family
// observed during the ALP final audit. They are seeds for ownership/provenance, not
// copied question text.
export const WFM_DIRECT_SOURCE_WORDS = [
  "MERCHANDISE",
  "REPUTATION",
  "CUMBERSOME",
  "SUPERINTENDENT",
  "INCONVENIENCE",
  "DISTRIBUTION",
] as const;

// Small independent supplement for ordinary meaningful candidate words. The runtime
// also reuses the frozen WOR real-word corpus as a lexical resource only; WOR retains
// ownership of dictionary-order logic and WFM owns letter-inventory feasibility.
const WFM_AUXILIARY_WORDS = `
CHAIR DREAM CHIME SHARE RAISE DANCE MARCH CRANE MEDIA DRESS CHEESE PLAIN
PAINT POINT TRAIN RATIO PIANO ROUTE PARENT URINE PAPER TATTER PLANT
CUBE CURE COME CORE SOME MUSE USER MOUSE ROOM BROOM ERROR SUMMER
PRESENT STUDENT TENDER INSERT UNITED PERSIST SISTER NEED PEPPER
CONVINCE INVOICE NICE COIN NINE VOICE ONCE VENICE CIVIC COCOON
TRUST BIRD UNIT DISTORT BURST INTRO SOUND ROOT BURR TRIO
EXAM NAME MAIN MINT TONE NATION ANIMATE TAXI MAMA MOMENT TOMATO
COUNT COURT RUIN TURN CROSS COCONUT TRUSTS TINT
LATER TRIAL INNER LINEAR ORIENTAL LETTER TELLER LITTLE
STAND TREAD UNDER NURSE DUSTER TUNER STREET
TAILOR STAIN TRAIL SATIN STATION RATION STALL TALL START
ROUND PRINT PRODUCT POOP CROP POOR
STARE PANTS TAPER
PERSON CHOIR PHONE MINE SHORE PRICE COMMON MISS CHEER
FORM INFORM FORMATION ACTION REACT READ REASON MARKET MASTER MATERIAL
COMPLETE COMPOSE COMPARE COMPANY COMPANION PROGRAM PROJECT PROMISE
INTEREST INTERFACE INTERNAL INTERNET INTERVAL INSTANCE INSTANT INSTITUTE
TRANSFORM TRANSIT TRANSLATE TRANSPORT TRANSPOSE
HAND WORK HEAD LAND RAIN SIDE NEWS HOME BACK FOOT
CANDLE GARDEN BRIDGE SILVER WINDOW ORANGE PLANET SCHOOL
`.trim().split(/\s+/).map(normalize);

const WOR_REAL_WORDS = WOR_WORD_FAMILIES.flatMap((family) => family.words.map((entry) => entry.normalized));

export const WFM_CANDIDATE_WORDS: readonly string[] = Array.from(new Set([
  ...WOR_REAL_WORDS,
  ...WFM_AUXILIARY_WORDS,
])).filter((word) => word.length >= 3 && word.length <= 12).sort();

const sourceCandidates = Array.from(new Set([
  ...WFM_DIRECT_SOURCE_WORDS,
  ...WOR_REAL_WORDS.filter((word) => word.length >= 9),
])).sort();

function isEligibleSource(sourceWord: string): boolean {
  let valid = 0;
  let multiplicityNearMiss = 0;
  let absentLetterWrong = 0;
  for (const candidate of WFM_CANDIDATE_WORDS) {
    if (candidate === sourceWord) continue;
    const analysis = analyseCandidate(sourceWord, candidate);
    if (analysis.canForm) valid += 1;
    else if (analysis.deficitKind === "MULTIPLICITY" && analysis.totalDeficit === 1) multiplicityNearMiss += 1;
    else if (analysis.deficitKind === "ABSENT_LETTER") absentLetterWrong += 1;
  }
  return valid >= 5 && multiplicityNearMiss >= 2 && absentLetterWrong >= 8;
}

export const WFM_SOURCE_WORDS: readonly string[] = sourceCandidates.filter(isEligibleSource);

if (WFM_CANDIDATE_WORDS.length < 500) {
  throw new Error(`WFM lexical candidate corpus unexpectedly small: ${WFM_CANDIDATE_WORDS.length}`);
}
if (WFM_SOURCE_WORDS.length < 18) {
  throw new Error(`WFM governed source pool unexpectedly small: ${WFM_SOURCE_WORDS.length}`);
}
if (new Set(WFM_SOURCE_WORDS).size !== WFM_SOURCE_WORDS.length) {
  throw new Error("WFM source pool contains duplicates.");
}
