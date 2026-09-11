import { deterministicPick } from "../../deterministic";
import { generateGeoRiv001Cp009ReviewV2, GEO_RIV_001_CP009_QL_IDS_V2 } from "./geo-riv-001-cp009-review-generator-v2";
import {
  geoRiv001Cp009CourseStatesForRiver,
  geoRiv001Cp009IsCourseState,
} from "./geo-riv-001-cp009-scope";
import type { GeoRiv001Cp009ReviewQuestion } from "./geo-riv-001-cp009-review-types";

export function geoRiv001Cp009DisplayRiverName(river: string) {
  return river.startsWith("River ") ? river : `River ${river}`;
}

export function geoRiv001Cp009FactRiverName(river: string) {
  return river.replace(/^River\s+/, "");
}

function courseListSentence(river: string) {
  const factRiver = geoRiv001Cp009FactRiverName(river);
  const states = geoRiv001Cp009CourseStatesForRiver(factRiver);
  if (!states.length) return "";
  return `In India, the main course of ${geoRiv001Cp009DisplayRiverName(factRiver)} passes through ${states.join(", ")}.`;
}

function parsePair(pair: string) {
  const [river = "", state = ""] = pair.split(" — ").map((part) => part.trim());
  return { river: geoRiv001Cp009FactRiverName(river), state };
}

function displayPair(pair: string) {
  const { river, state } = parsePair(pair);
  return `${geoRiv001Cp009DisplayRiverName(river)} — ${state}`;
}

function statementClaims(stem: string) {
  return [...stem.matchAll(/(?:I{1,2}|\d+)\. (?:The )?(.+?) flows through (.+?)\./g)].map((match) => ({
    river: geoRiv001Cp009FactRiverName(match[1]),
    state: match[2],
  }));
}

function explainClaim(river: string, state: string, label?: string) {
  const factRiver = geoRiv001Cp009FactRiverName(river);
  const displayRiver = geoRiv001Cp009DisplayRiverName(factRiver);
  const prefix = label ? `${label} ` : "";
  const trueClaim = geoRiv001Cp009IsCourseState(factRiver, state);
  if (trueClaim) return `${prefix}Correct: ${displayRiver} flows through ${state}. ${courseListSentence(factRiver)}`;
  return `${prefix}Incorrect: ${state} is not on the main course of ${displayRiver}. ${courseListSentence(factRiver)}`;
}

function pickStem(question: GeoRiv001Cp009ReviewQuestion, variants: readonly string[]) {
  return deterministicPick(variants, `${question.questionId}:natural-stem-v3`);
}

/**
 * Converts the mechanically regular V2 wording into controlled, competitive-
 * exam style English. Every visible proper river name uses the `River X`
 * convention while the underlying fact/entity label remains unchanged.
 */
export function naturalizeGeoRiv001Cp009Stem(question: GeoRiv001Cp009ReviewQuestion) {
  switch (question.qlId) {
    case "GEO-RIV-001-QL-074": {
      const river = question.stem.match(/^Which of the following states does the (.+?) flow through\?$/)?.[1];
      if (!river) return question.stem;
      const displayRiver = geoRiv001Cp009DisplayRiverName(river);
      return pickStem(question, [
        `${displayRiver} flows through which of the following states?`,
        `Which one of the following states is traversed by ${displayRiver}?`,
        `The main course of ${displayRiver} passes through which of the following states?`,
      ]);
    }
    case "GEO-RIV-001-QL-075": {
      const state = question.stem.match(/^Which of the following rivers flows through (.+?)\?$/)?.[1];
      if (!state) return question.stem;
      return pickStem(question, [
        `Which one of the following rivers flows through ${state}?`,
        `${state} is traversed by which of the following rivers?`,
        `The course of which of the following rivers passes through ${state}?`,
      ]);
    }
    case "GEO-RIV-001-QL-076": {
      const match = question.stem.match(/^The (.+?) (rises|originates) in which state\?$/);
      if (!match) return question.stem;
      const displayRiver = geoRiv001Cp009DisplayRiverName(match[1]);
      const verb = match[2] === "rises" ? "rise" : "originate";
      return pickStem(question, [
        `In which of the following states does ${displayRiver} ${verb}?`,
        `${displayRiver} has its source in which of the following states?`,
        `Which of the following states is the place of origin of ${displayRiver}?`,
      ]);
    }
    case "GEO-RIV-001-QL-077": {
      const states = question.stem.match(/^Which river's course in India passes through only the following states: (.+?)\?$/)?.[1];
      if (!states) return question.stem;
      return pickStem(question, [
        `Which of the following rivers passes through the following Indian states and no others: ${states}?`,
        `Consider the following states: ${states}. The main course of which of the following rivers passes through all these states and no other Indian state?`,
      ]);
    }
    case "GEO-RIV-001-QL-078":
      return pickStem(question, [
        "Select the correctly matched river–state pair.",
        "Which one of the following river–state pairs is correctly matched?",
      ]);
    case "GEO-RIV-001-QL-079":
      return pickStem(question, [
        "Select the incorrectly matched river–state pair.",
        "Which one of the following river–state pairs is incorrectly matched?",
      ]);
    case "GEO-RIV-001-QL-080": {
      const match = question.stem.match(/^Which river flows through both (.+?) and (.+?)\?$/);
      if (!match) return question.stem;
      const first = match[1];
      const second = match[2];
      return pickStem(question, [
        `Which of the following rivers flows through both ${first} and ${second}?`,
        `The main course of which of the following rivers passes through both ${first} and ${second}?`,
        `Both ${first} and ${second} are traversed by which of the following rivers?`,
      ]);
    }
    case "GEO-RIV-001-QL-081": {
      const claims = statementClaims(question.stem);
      if (claims.length !== 2) return question.stem;
      const lines = [
        `I. ${geoRiv001Cp009DisplayRiverName(claims[0].river)} flows through ${claims[0].state}.`,
        `II. ${geoRiv001Cp009DisplayRiverName(claims[1].river)} flows through ${claims[1].state}.`,
      ];
      return pickStem(question, [
        `Consider the following statements:\n${lines.join("\n")}\nWhich of the statements given above is/are correct?`,
        `With reference to Indian rivers, consider the following statements:\n${lines.join("\n")}\nWhich of the statements given above is/are correct?`,
      ]);
    }
    case "GEO-RIV-001-QL-082": {
      const claims = statementClaims(question.stem);
      if (claims.length !== 3) return question.stem;
      const lines = claims.map((claim, index) => `${index + 1}. ${geoRiv001Cp009DisplayRiverName(claim.river)} flows through ${claim.state}.`);
      return pickStem(question, [
        `Consider the following statements:\n${lines.join("\n")}\nHow many of the statements given above are correct?`,
        `With reference to Indian rivers, consider the following statements:\n${lines.join("\n")}\nHow many of the above statements are correct?`,
      ]);
    }
    default:
      return question.stem;
  }
}

export function geoRiv001Cp009DisplayOptions(question: GeoRiv001Cp009ReviewQuestion) {
  if (["GEO-RIV-001-QL-075", "GEO-RIV-001-QL-077", "GEO-RIV-001-QL-080"].includes(question.qlId)) {
    return question.options.map(geoRiv001Cp009DisplayRiverName);
  }
  if (["GEO-RIV-001-QL-078", "GEO-RIV-001-QL-079"].includes(question.qlId)) {
    return question.options.map(displayPair);
  }
  return [...question.options];
}

export function geoRiv001Cp009DisplayCanonicalAnswer(question: GeoRiv001Cp009ReviewQuestion) {
  if (["GEO-RIV-001-QL-075", "GEO-RIV-001-QL-077", "GEO-RIV-001-QL-080"].includes(question.qlId)) {
    return geoRiv001Cp009DisplayRiverName(question.canonicalAnswer);
  }
  if (["GEO-RIV-001-QL-078", "GEO-RIV-001-QL-079"].includes(question.qlId)) {
    return displayPair(question.canonicalAnswer);
  }
  return question.canonicalAnswer;
}

function richerExplanation(question: GeoRiv001Cp009ReviewQuestion) {
  switch (question.qlId) {
    case "GEO-RIV-001-QL-074": {
      const river = question.stem.match(/^Which of the following states does the (.+?) flow through\?$/)?.[1] ?? "";
      return `${geoRiv001Cp009DisplayRiverName(river)} flows through ${question.canonicalAnswer}. ${courseListSentence(river)}`;
    }
    case "GEO-RIV-001-QL-075": {
      const state = question.stem.match(/^Which of the following rivers flows through (.+?)\?$/)?.[1] ?? "";
      const river = question.canonicalAnswer;
      return `${geoRiv001Cp009DisplayRiverName(river)} flows through ${state}. ${courseListSentence(river)}`;
    }
    case "GEO-RIV-001-QL-076": {
      const match = question.stem.match(/^The (.+?) (rises|originates) in which state\?$/);
      const river = match?.[1] ?? "";
      const verb = match?.[2] === "rises" ? "rises" : "originates";
      const courseContext = courseListSentence(river);
      return `${geoRiv001Cp009DisplayRiverName(river)} ${verb} in ${question.canonicalAnswer}.${courseContext ? ` ${courseContext}` : ""} The place of origin and the states crossed by the river are different facts and should not be confused.`;
    }
    case "GEO-RIV-001-QL-077": {
      const river = question.canonicalAnswer;
      return `${courseListSentence(river)} These are the Indian states crossed by its main course; states lying only in its drainage basin are a separate matter.`;
    }
    case "GEO-RIV-001-QL-078": {
      const { river, state } = parsePair(question.canonicalAnswer);
      const displayRiver = geoRiv001Cp009DisplayRiverName(river);
      return `${displayRiver} — ${state} is correctly matched because ${displayRiver} flows through ${state}. ${courseListSentence(river)}`;
    }
    case "GEO-RIV-001-QL-079": {
      const { river, state } = parsePair(question.canonicalAnswer);
      const displayRiver = geoRiv001Cp009DisplayRiverName(river);
      return `${displayRiver} does not flow through ${state}. ${courseListSentence(river)} A state in a river basin must not automatically be treated as a main-course state.`;
    }
    case "GEO-RIV-001-QL-080": {
      const match = question.stem.match(/^Which river flows through both (.+?) and (.+?)\?$/);
      const first = match?.[1] ?? "";
      const second = match?.[2] ?? "";
      const river = question.canonicalAnswer;
      return `${geoRiv001Cp009DisplayRiverName(river)} flows through both ${first} and ${second}. ${courseListSentence(river)}`;
    }
    case "GEO-RIV-001-QL-081": {
      const claims = statementClaims(question.stem);
      if (claims.length !== 2) return question.explanation;
      return [
        explainClaim(claims[0].river, claims[0].state, "Statement I:"),
        explainClaim(claims[1].river, claims[1].state, "Statement II:"),
        `Hence, ${question.canonicalAnswer.toLowerCase()}.`,
      ].join(" ");
    }
    case "GEO-RIV-001-QL-082": {
      const claims = statementClaims(question.stem);
      if (claims.length !== 3) return question.explanation;
      const trueCount = claims.filter((claim) => geoRiv001Cp009IsCourseState(claim.river, claim.state)).length;
      return [
        ...claims.map((claim, index) => explainClaim(claim.river, claim.state, `${index + 1}.`)),
        `${trueCount} of the three statements ${trueCount === 1 ? "is" : "are"} correct, so the answer is ${question.canonicalAnswer}.`,
      ].join(" ");
    }
    default:
      return question.explanation;
  }
}

/**
 * V3 is a pedagogical and editorial overlay over V2.
 * It preserves the verified semantic options, correct position, difficulty and
 * provenance while rendering proper river names consistently as `River X`.
 */
export function toGeoRiv001Cp009ReviewV3(question: GeoRiv001Cp009ReviewQuestion): GeoRiv001Cp009ReviewQuestion {
  return {
    ...question,
    questionId: question.questionId.replace("CP009-V2", "CP009-V3"),
    stem: naturalizeGeoRiv001Cp009Stem(question),
    options: geoRiv001Cp009DisplayOptions(question),
    canonicalAnswer: geoRiv001Cp009DisplayCanonicalAnswer(question),
    explanation: richerExplanation(question),
  };
}

export function generateGeoRiv001Cp009ReviewV3(qlId: string, seed: string): GeoRiv001Cp009ReviewQuestion {
  return toGeoRiv001Cp009ReviewV3(generateGeoRiv001Cp009ReviewV2(qlId, seed));
}

export const GEO_RIV_001_CP009_QL_IDS_V3 = GEO_RIV_001_CP009_QL_IDS_V2;
