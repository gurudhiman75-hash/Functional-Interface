import { generateGeoPhy001Cp002ReviewBatchV1 } from "./geo-phy-001-cp002-review-generator-v1";
import type { GeoPhy001Cp002ReviewQuestion } from "./geo-phy-001-cp002-review-types";

const statementLineage: Record<number, string[]> = {
  42: ["geo-phy-001-cp002-himadri-position", "geo-phy-001-cp002-shiwalik-position"],
  43: ["geo-phy-001-cp002-himachal-position", "geo-phy-001-cp002-duns"],
  44: ["geo-phy-001-cp002-kumaon-boundaries", "geo-phy-001-cp002-nepal-boundaries"],
  45: ["geo-phy-001-cp002-assam-boundaries", "geo-phy-001-cp002-purvachal-location"],
  46: ["geo-phy-001-cp002-shiwalik-position", "geo-phy-001-cp002-himadri-height"],
  47: ["geo-phy-001-cp002-purvachal-components", "geo-phy-001-cp002-punjab-himalaya-boundaries"],
  48: ["geo-phy-001-cp002-himadri-position", "geo-phy-001-cp002-himachal-position", "geo-phy-001-cp002-shiwalik-position"],
  49: ["geo-phy-001-cp002-kumaon-boundaries", "geo-phy-001-cp002-nepal-boundaries", "geo-phy-001-cp002-assam-boundaries"],
  50: ["geo-phy-001-cp002-purvachal-location", "geo-phy-001-cp002-purvachal-components"],
  51: ["geo-phy-001-cp002-himadri-height", "geo-phy-001-cp002-shiwalik-altitude", "geo-phy-001-cp002-himachal-position"],
  52: ["geo-phy-001-cp002-duns", "geo-phy-001-cp002-punjab-himalaya-boundaries"],
  53: ["geo-phy-001-cp002-purvachal-components", "geo-phy-001-cp002-purvachal-location"],
};

function polish(text: string) {
  return text
    .replace(/^([A-Z][^.]+) identifies (Himadri|Himachal|Shiwaliks)\.$/, "This clue identifies $2.")
    .replace(/Which Himalayan range is best described as an average height of about 6,000 metres\?/, "Which Himalayan range has an average height of about 6,000 metres?")
    .replace(/Which Himalayan range is best described as an average altitude of about 3,700 to 4,500 metres\?/, "Which Himalayan range has an average altitude of about 3,700 to 4,500 metres?")
    .replace(/Which Himalayan range is best described as an altitude generally varying between about 900 and 1,100 metres\?/, "Which Himalayan range generally lies at about 900 to 1,100 metres in altitude?")
    .replace(/Himadri is described as an average height of about 6,000 metres\./, "Himadri has an average height of about 6,000 metres.")
    .replace(/Himachal is described as an average altitude of about 3,700 to 4,500 metres\./, "Himachal has an average altitude of about 3,700 to 4,500 metres.")
    .replace(/Shiwaliks is described as a range composed of/, "The Shiwaliks are composed of")
    .replace(/Shiwaliks is described as an altitude generally varying between about 900 and 1,100 metres\./, "The Shiwaliks generally lie at about 900 to 1,100 metres in altitude.")
    .replace(/^The Himalayas between (.+) is known as the (.+)\.$/, "The part of the Himalayas between $1 is known as the $2.")
    .replace(/Kumaon Himalayas lies between/g, "Kumaon Himalayas lie between")
    .replace(/Nepal Himalayas lies between/g, "Nepal Himalayas lie between")
    .replace(/Assam Himalayas lies between/g, "Assam Himalayas lie between")
    .replace(/(Patkai Hills|Naga Hills|Manipur Hills|Mizo Hills) is one of the hill ranges included in the Purvachal\./g, "$1 are included in the Purvachal.")
    .replace(/^3 of the three statements are correct\.$/, "All three statements are correct.")
    .replace(/^2 of the three statements are correct\.$/, "Two of the three statements are correct.");
}

export function generateGeoPhy001Cp002ReviewBatchV2(): GeoPhy001Cp002ReviewQuestion[] {
  return generateGeoPhy001Cp002ReviewBatchV1().map((question, index) => ({
    ...question,
    questionId: question.questionId.replace("-V1-", "-V2-"),
    stem: polish(question.stem),
    explanation: polish(question.explanation),
    sourceFactIds: statementLineage[index] ?? question.sourceFactIds,
  }));
}
