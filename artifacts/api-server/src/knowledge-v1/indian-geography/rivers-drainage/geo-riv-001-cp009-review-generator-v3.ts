import { deterministicPick } from "../../deterministic";
import { generateGeoRiv001Cp009ReviewV2, GEO_RIV_001_CP009_QL_IDS_V2 } from "./geo-riv-001-cp009-review-generator-v2";
import {
  geoRiv001Cp009CourseStatesForRiver,
  geoRiv001Cp009IsCourseState,
} from "./geo-riv-001-cp009-scope";
import type { GeoRiv001Cp009ReviewQuestion } from "./geo-riv-001-cp009-review-types";

function courseListSentence(river: string) {
  const states = geoRiv001Cp009CourseStatesForRiver(river);
  if (!states.length) return "";
  return `In India, the main course of the ${river} passes through ${states.join(", ")}.`;
}

function parsePair(pair: string) {
  const [river = "", state = ""] = pair.split(" — ").map((part) => part.trim());
  return { river, state };
}

function statementClaims(stem: string) {
  return [...stem.matchAll(/(?:I{1,2}|\d+)\. The (.+?) flows through (.+?)\./g)].map((match) => ({
    river: match[1],
    state: match[2],
  }));
}

function explainClaim(river: string, state: string, label?: string) {
  const prefix = label ? `${label} ` : "";
  const trueClaim = geoRiv001Cp009IsCourseState(river, state);
  if (trueClaim) return `${prefix}Correct: the ${river} flows through ${state}. ${courseListSentence(river)}`;
  return `${prefix}Incorrect: ${state} is not on the ${river}'s main course in this relation. ${courseListSentence(river)}`;
}

function pickStem(question: GeoRiv001Cp009ReviewQuestion, variants: readonly string[]) {
  return deterministicPick(variants, `${question.questionId}:natural-stem-v3`);
}

/**
 * Converts the mechanically regular V2 wording into controlled, competitive-
 * exam style English. The semantic payload is deliberately unchanged.
 */
export function naturalizeGeoRiv001Cp009Stem(question: GeoRiv001Cp009ReviewQuestion) {
  switch (question.qlId) {
    case "GEO-RIV-001-QL-074": {
      const river = question.stem.match(/^Which of the following states does the (.+?) flow through\?$/)?.[1];
      if (!river) return question.stem;
      return pickStem(question, [
        `The ${river} flows through which of the following states?`,
        `Which one of the following states is traversed by the ${river}?`,
        `The main course of the ${river} passes through which of the following states?`,
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
      const river = match[1];
      const verb = match[2] === "rises" ? "rise" : "originate";
      return pickStem(question, [
        `In which of the following states does the ${river} ${verb}?`,
        `The ${river} has its source in which of the following states?`,
        `Which of the following states is the place of origin of the ${river}?`,
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
        `I. The ${claims[0].river} flows through ${claims[0].state}.`,
        `II. The ${claims[1].river} flows through ${claims[1].state}.`,
      ];
      return pickStem(question, [
        `Consider the following statements:\n${lines.join("\n")}\nWhich of the statements given above is/are correct?`,
        `With reference to Indian rivers, consider the following statements:\n${lines.join("\n")}\nWhich of the statements given above is/are correct?`,
      ]);
    }
    case "GEO-RIV-001-QL-082": {
      const claims = statementClaims(question.stem);
      if (claims.length !== 3) return question.stem;
      const lines = claims.map((claim, index) => `${index + 1}. The ${claim.river} flows through ${claim.state}.`);
      return pickStem(question, [
        `Consider the following statements:\n${lines.join("\n")}\nHow many of the statements given above are correct?`,
        `With reference to Indian rivers, consider the following statements:\n${lines.join("\n")}\nHow many of the above statements are correct?`,
      ]);
    }
    default:
      return question.stem;
  }
}

function richerExplanation(question: GeoRiv001Cp009ReviewQuestion) {
  switch (question.qlId) {
    case "GEO-RIV-001-QL-074": { // direct river -> state
      const river = question.stem.match(/^Which of the following states does the (.+?) flow through\?$/)?.[1] ?? "";
      return `The ${river} flows through ${question.canonicalAnswer}. ${courseListSentence(river)}`;
    }
    case "GEO-RIV-001-QL-075": { // state -> river
      const state = question.stem.match(/^Which of the following rivers flows through (.+?)\?$/)?.[1] ?? "";
      const river = question.canonicalAnswer;
      return `The ${river} flows through ${state}. ${courseListSentence(river)}`;
    }
    case "GEO-RIV-001-QL-076": { // source state
      const match = question.stem.match(/^The (.+?) (rises|originates) in which state\?$/);
      const river = match?.[1] ?? "";
      const verb = match?.[2] === "rises" ? "rises" : "originates";
      const courseContext = courseListSentence(river);
      return `The ${river} ${verb} in ${question.canonicalAnswer}.${courseContext ? ` ${courseContext}` : ""} The place of origin and the states crossed by the river are different facts and should not be confused.`;
    }
    case "GEO-RIV-001-QL-077": { // exhaustive main-course states
      const river = question.canonicalAnswer;
      return `${courseListSentence(river)} These are the Indian states crossed by its main course; states lying only in its drainage basin are a separate matter.`;
    }
    case "GEO-RIV-001-QL-078": { // correct pair
      const { river, state } = parsePair(question.canonicalAnswer);
      return `The pair ${river} — ${state} is correct because the ${river} flows through ${state}. ${courseListSentence(river)}`;
    }
    case "GEO-RIV-001-QL-079": { // incorrect pair
      const { river, state } = parsePair(question.canonicalAnswer);
      return `${river} — ${state} is the incorrect pair: ${state} is not crossed by the ${river}'s main course. ${courseListSentence(river)} A state in a river basin must not automatically be treated as a main-course state.`;
    }
    case "GEO-RIV-001-QL-080": { // both states
      const match = question.stem.match(/^Which river flows through both (.+?) and (.+?)\?$/);
      const first = match?.[1] ?? "";
      const second = match?.[2] ?? "";
      const river = question.canonicalAnswer;
      return `The ${river} flows through both ${first} and ${second}. ${courseListSentence(river)}`;
    }
    case "GEO-RIV-001-QL-081": { // two statements
      const claims = statementClaims(question.stem);
      if (claims.length !== 2) return question.explanation;
      return [
        explainClaim(claims[0].river, claims[0].state, "Statement I:"),
        explainClaim(claims[1].river, claims[1].state, "Statement II:"),
        `Hence, ${question.canonicalAnswer.toLowerCase()}.`,
      ].join(" ");
    }
    case "GEO-RIV-001-QL-082": { // three statements
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
 * It preserves the verified answer, options, difficulty and provenance while
 * replacing mechanical stems with controlled exam-standard wording and giving
 * question-specific explanations grounded in the canonical main-course matrix.
 */
export function toGeoRiv001Cp009ReviewV3(question: GeoRiv001Cp009ReviewQuestion): GeoRiv001Cp009ReviewQuestion {
  return {
    ...question,
    questionId: question.questionId.replace("CP009-V2", "CP009-V3"),
    stem: naturalizeGeoRiv001Cp009Stem(question),
    explanation: richerExplanation(question),
  };
}

export function generateGeoRiv001Cp009ReviewV3(qlId: string, seed: string): GeoRiv001Cp009ReviewQuestion {
  return toGeoRiv001Cp009ReviewV3(generateGeoRiv001Cp009ReviewV2(qlId, seed));
}

export const GEO_RIV_001_CP009_QL_IDS_V3 = GEO_RIV_001_CP009_QL_IDS_V2;
