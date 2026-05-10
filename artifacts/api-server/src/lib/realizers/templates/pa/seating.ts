import {
  localizePersonName,
} from "../../entity-registry";
import { punjabiSitVerb } from "../../gender-utils";
import type {
  SemanticClue,
} from "../../semantic-primitives";
import { ordinalPa } from "../shared";

const name = (value: unknown) =>
  localizePersonName(value, "pa");

export function realizeSeatingPunjabi(
  clue: SemanticClue,
) {
  const subjectRaw = clue.subject;
  const subject = name(subjectRaw);
  const object = name(clue.object);
  const secondObject = name(clue.secondObject);
  const distance = clue.distance ?? 1;

  switch (clue.primitive) {
    case "immediate-left":
      return `${subject}, ${object} ਦੇ ਤੁਰੰਤ ਖੱਬੇ ਪਾਸੇ ${punjabiSitVerb(subjectRaw)}।`;
    case "immediate-right":
      return `${subject}, ${object} ਦੇ ਤੁਰੰਤ ਸੱਜੇ ਪਾਸੇ ${punjabiSitVerb(subjectRaw)}।`;
    case "relative-left":
      return `${subject}, ${object} ਦੇ ${ordinalPa(distance)} ਖੱਬੇ ਪਾਸੇ ${punjabiSitVerb(subjectRaw)}।`;
    case "relative-right":
      return `${subject}, ${object} ਦੇ ${ordinalPa(distance)} ਸੱਜੇ ਪਾਸੇ ${punjabiSitVerb(subjectRaw)}।`;
    case "opposite":
      return `${subject}, ${object} ਦੇ ਸਾਹਮਣੇ ${punjabiSitVerb(subjectRaw)}।`;
    case "adjacent":
      return `${subject} ਅਤੇ ${object} ਇੱਕ-ਦੂਜੇ ਦੇ ਨਾਲ ਬੈਠੇ ਹਨ।`;
    case "not-adjacent":
      return `${subject} ਅਤੇ ${object} ਇੱਕ-ਦੂਜੇ ਦੇ ਨਾਲ ਨਹੀਂ ਬੈਠੇ ਹਨ।`;
    case "between":
      if (clue.secondObject) {
        return `${subject}, ${object} ਅਤੇ ${secondObject} ਦੇ ਵਿਚਕਾਰ ${punjabiSitVerb(subjectRaw)}।`;
      }
      return `${subject}, ${object} ਨਾਲ ਜੁੜੀ ਵਿਚਕਾਰ ਵਾਲੀ ਸ਼ਰਤ ਅਨੁਸਾਰ ${punjabiSitVerb(subjectRaw)}।`;
    case "same-row":
      return `${subject} ਅਤੇ ${object} ਇੱਕੋ ਕਤਾਰ ਵਿੱਚ ਹਨ।`;
    case "different-row":
      return `${subject} ਅਤੇ ${object} ਵੱਖ-ਵੱਖ ਕਤਾਰਾਂ ਵਿੱਚ ਹਨ।`;
    case "north-facing":
      return `${subject} ਉੱਤਰ ਵੱਲ ਮੂੰਹ ਕਰਕੇ ${punjabiSitVerb(subjectRaw)}।`;
    case "south-facing":
      return `${subject} ਦੱਖਣ ਵੱਲ ਮੂੰਹ ਕਰਕੇ ${punjabiSitVerb(subjectRaw)}।`;
    case "clockwise":
      return `${subject}, ${object} ਤੋਂ ਘੜੀ ਦੀ ਦਿਸ਼ਾ ਵਿੱਚ ਹੈ।`;
    case "anti-clockwise":
      return `${subject}, ${object} ਤੋਂ ਘੜੀ ਦੀ ਉਲਟੀ ਦਿਸ਼ਾ ਵਿੱਚ ਹੈ।`;
    case "not-end":
      return `${subject} ਕਿਸੇ ਵੀ ਕਿਨਾਰੇ ਤੇ ਨਹੀਂ ${punjabiSitVerb(subjectRaw)}।`;
    default:
      return `ਸ਼ਰਤ: ${clue.raw ?? clue.primitive}`;
  }
}
