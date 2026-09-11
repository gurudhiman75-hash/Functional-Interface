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
 * V3 is a pedagogical and semantic-safety overlay over V2.
 * It preserves the verified question task, answer, options and provenance,
 * while giving question-specific explanations grounded in the canonical
 * main-course matrix and keeping basin drainage explicitly separate.
 */
export function toGeoRiv001Cp009ReviewV3(question: GeoRiv001Cp009ReviewQuestion): GeoRiv001Cp009ReviewQuestion {
  return {
    ...question,
    questionId: question.questionId.replace("CP009-V2", "CP009-V3"),
    explanation: richerExplanation(question),
  };
}

export function generateGeoRiv001Cp009ReviewV3(qlId: string, seed: string): GeoRiv001Cp009ReviewQuestion {
  return toGeoRiv001Cp009ReviewV3(generateGeoRiv001Cp009ReviewV2(qlId, seed));
}

export const GEO_RIV_001_CP009_QL_IDS_V3 = GEO_RIV_001_CP009_QL_IDS_V2;
