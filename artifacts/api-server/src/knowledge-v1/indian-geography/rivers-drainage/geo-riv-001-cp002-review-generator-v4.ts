import type { KnowledgeFact } from "../../types";
import { GEO_RIV_001_CP002_REVIEWABLE_FACTS_V1 } from "./geo-riv-001-cp002-editorial-review-v1";
import { generateGeoRiv001Cp002ReviewV3 } from "./geo-riv-001-cp002-review-generator-v3";
import type { GeoRiv001Cp002ReviewQuestion } from "./geo-riv-001-cp002-review-types";

const FACTS = GEO_RIV_001_CP002_REVIEWABLE_FACTS_V1;
const SOURCE_RELATIONS = new Set(["originates_from", "source_region", "source_area"]);
const SOURCE_FACTS = FACTS.filter((fact) => SOURCE_RELATIONS.has(fact.relation));

function valueText(fact: KnowledgeFact) {
  if (fact.value.kind === "entity_ref") return fact.value.label.en;
  if (fact.value.kind === "text") return fact.value.text.en;
  throw new Error(`${fact.factId} has unsupported CP002 V4 value kind`);
}

function sourceFactFor(question: GeoRiv001Cp002ReviewQuestion) {
  return question.sourceFactIds
    .map((id) => FACTS.find((fact) => fact.factId === id))
    .find((fact): fact is KnowledgeFact => Boolean(fact && SOURCE_RELATIONS.has(fact.relation)));
}

function sourceFactForPair(question: GeoRiv001Cp002ReviewQuestion) {
  const river = question.canonicalAnswer.split(" — ")[0]?.trim();
  if (!river) return undefined;
  return question.sourceFactIds
    .map((id) => FACTS.find((fact) => fact.factId === id))
    .find(
      (fact): fact is KnowledgeFact =>
        Boolean(fact && SOURCE_RELATIONS.has(fact.relation) && fact.entity.label.en === river),
    );
}

function stripLeadingNear(value: string) {
  return value.replace(/^near\s+/i, "");
}

function simpleSourceExplanation(fact: KnowledgeFact) {
  const river = fact.entity.label.en;
  const value = valueText(fact);
  if (fact.relation === "originates_from") return `${river} originates from ${value}.`;
  if (/^near\s+/i.test(value)) return `${river} originates near ${stripLeadingNear(value)}.`;
  return `${river} originates in ${value}.`;
}

function sourcePhraseForValue(value: string) {
  const authority = SOURCE_FACTS.find((fact) => valueText(fact) === value);
  if (authority?.relation === "originates_from") return `originates from ${value}`;
  if (/^near\s+/i.test(value)) return `originates near ${stripLeadingNear(value)}`;
  return `originates in ${value}`;
}

function conclusionForPair(answer: string) {
  if (answer === "Both Statement I and Statement II are correct") return "Hence, both statements are correct.";
  if (answer === "Only Statement I is correct") return "Hence, only Statement I is correct.";
  if (answer === "Only Statement II is correct") return "Hence, only Statement II is correct.";
  return "Hence, neither statement is correct.";
}

function conclusionForCount(answer: string) {
  if (answer === "None") return "Hence, none of the statements is correct.";
  if (answer === "One") return "Hence, one statement is correct.";
  if (answer === "Two") return "Hence, two statements are correct.";
  return "Hence, all three statements are correct.";
}

function cleanupStatementLanguage(value: string) {
  let revised = value.replaceAll("has its source at or near", "originates at or near");
  for (const sourceValue of new Set(SOURCE_FACTS.map(valueText))) {
    revised = revised.replaceAll(
      `originates at or near ${sourceValue}`,
      sourcePhraseForValue(sourceValue),
    );
  }
  return revised;
}

function revise(question: GeoRiv001Cp002ReviewQuestion): GeoRiv001Cp002ReviewQuestion {
  let stem = cleanupStatementLanguage(question.stem);
  let explanation = cleanupStatementLanguage(question.explanation);

  if (question.qlId === "GEO-RIV-001-QL-010") {
    const fact = sourceFactFor(question);
    if (fact) {
      stem = fact.relation === "originates_from"
        ? `The ${fact.entity.label.en} River originates from which of the following?`
        : `Which of the following correctly gives the source area of the ${fact.entity.label.en} River?`;
      explanation = simpleSourceExplanation(fact);
    }
  }

  if (question.qlId === "GEO-RIV-001-QL-011") {
    const fact = sourceFactFor(question);
    if (fact) {
      const value = valueText(fact);
      if (fact.relation === "originates_from") {
        stem = `Which river originates from ${value}?`;
      } else if (/^near\s+/i.test(value)) {
        stem = `Which river originates near ${stripLeadingNear(value)}?`;
      } else {
        stem = `Which river originates in ${value}?`;
      }
      explanation = simpleSourceExplanation(fact);
    }
  }

  if (question.qlId === "GEO-RIV-001-QL-014" || question.qlId === "GEO-RIV-001-QL-015") {
    const fact = sourceFactForPair(question);
    if (fact) {
      explanation = question.qlId.endsWith("014")
        ? `This pair is correct. ${simpleSourceExplanation(fact)}`
        : `This pair is incorrect. ${simpleSourceExplanation(fact)}`;
    }
  }

  if (question.qlId === "GEO-RIV-001-QL-016") {
    if (question.canonicalAnswer === "Chenab") {
      stem = "The Jhelum joins which river at Trimmu, and the Satluj later joins the same river at Panjnad?";
    }
    if (question.canonicalAnswer === "Beas → Satluj → Chenab") {
      explanation = "The Beas joins the Satluj, and the Satluj later joins the Chenab. Hence, Beas → Satluj → Chenab is the correct sequence.";
    }
  }

  if (question.qlId === "GEO-RIV-001-QL-017") {
    explanation = `${explanation.replace(/\s*Hence,.*$/i, "").trim()} ${conclusionForPair(question.canonicalAnswer)}`;
  }

  if (question.qlId === "GEO-RIV-001-QL-018") {
    explanation = explanation
      .replace(/\s*Therefore,\s*\d+\s+statements?\s+(?:is|are)\s+correct\.?\s*$/i, "")
      .trim();
    explanation = `${explanation} ${conclusionForCount(question.canonicalAnswer)}`;
  }

  return {
    ...question,
    questionId: question.questionId.replace(/CP002-V3/g, "CP002-V4"),
    stem,
    explanation,
  };
}

export function generateGeoRiv001Cp002ReviewV4(qlId: string, seed: string) {
  if (!seed.trim()) throw new Error("GEO-RIV-001 CP002 V4 review generation requires an explicit seed");
  return revise(generateGeoRiv001Cp002ReviewV3(qlId, seed));
}
