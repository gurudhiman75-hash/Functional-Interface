import type {
  RealizerLanguage,
} from "../types";
import type {
  SemanticClue,
} from "../semantic-primitives";
import {
  realizeSeatingEnglish,
} from "./en/seating";
import {
  realizeSeatingHindi,
} from "./hi/seating";
import {
  realizeSeatingPunjabi,
} from "./pa/seating";

export function realizeSemanticSeatingClue(
  language: RealizerLanguage,
  clue: SemanticClue,
) {
  if (language === "hi") {
    return realizeSeatingHindi(clue).normalize("NFC");
  }

  if (language === "pa") {
    return realizeSeatingPunjabi(clue).normalize("NFC");
  }

  return realizeSeatingEnglish(clue).normalize("NFC");
}
