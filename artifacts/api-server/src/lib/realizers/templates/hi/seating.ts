import {
  localizePersonName,
} from "../../entity-registry";
import { hindiSitVerb } from "../../gender-utils";
import type {
  SemanticClue,
} from "../../semantic-primitives";
import { ordinalHi } from "../shared";

const name = (value: unknown) =>
  localizePersonName(value, "hi");

export function realizeSeatingHindi(
  clue: SemanticClue,
) {
  const subjectRaw = clue.subject;
  const subject = name(subjectRaw);
  const object = name(clue.object);
  const secondObject = name(clue.secondObject);
  const distance = clue.distance ?? 1;

  switch (clue.primitive) {
    case "immediate-left":
      return `${subject}, ${object} के ठीक बाईं ओर ${hindiSitVerb(subjectRaw)}।`;
    case "immediate-right":
      return `${subject}, ${object} के ठीक दाईं ओर ${hindiSitVerb(subjectRaw)}।`;
    case "relative-left":
      return `${subject}, ${object} के ${ordinalHi(distance)} बाईं ओर ${hindiSitVerb(subjectRaw)}।`;
    case "relative-right":
      return `${subject}, ${object} के ${ordinalHi(distance)} दाईं ओर ${hindiSitVerb(subjectRaw)}।`;
    case "opposite":
      return `${subject}, ${object} के सामने ${hindiSitVerb(subjectRaw)}।`;
    case "not-opposite":
      return `${subject}, ${object} के सामने नहीं ${hindiSitVerb(subjectRaw)}।`;
    case "adjacent":
      return `${subject} और ${object} एक-दूसरे के बगल में बैठे हैं।`;
    case "not-adjacent":
      return `${subject} और ${object} एक-दूसरे के बगल में नहीं बैठे हैं।`;
    case "between":
      if (clue.secondObject) {
        return `${subject}, ${object} और ${secondObject} के बीच ${hindiSitVerb(subjectRaw)}।`;
      }
      return `${subject}, ${object} से जुड़ी बीच वाली शर्त के अनुसार ${hindiSitVerb(subjectRaw)}।`;
    case "same-row":
      return `${subject} और ${object} एक ही पंक्ति में हैं।`;
    case "different-row":
      return `${subject} और ${object} अलग-अलग पंक्तियों में हैं।`;
    case "north-facing":
      return `${subject} उत्तर दिशा की ओर मुख करके ${hindiSitVerb(subjectRaw)}।`;
    case "south-facing":
      return `${subject} दक्षिण दिशा की ओर मुख करके ${hindiSitVerb(subjectRaw)}।`;
    case "clockwise":
      return `${subject}, ${object} से घड़ी की दिशा में स्थित है।`;
    case "anti-clockwise":
      return `${subject}, ${object} से घड़ी की विपरीत दिशा में स्थित है।`;
    case "not-end":
      return `${subject} किसी भी छोर पर नहीं ${hindiSitVerb(subjectRaw)}।`;
    default:
      return `शर्त: ${clue.raw ?? clue.primitive}`;
  }
}
