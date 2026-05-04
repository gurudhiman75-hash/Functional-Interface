import { percentageMotifs } from "./percentage";
import { ratioMotifs } from "./ratio";
import { codingDecodingMotifs } from "./coding-decoding";
import { bloodRelationMotifs } from "./blood-relations";
import { directionSenseMotifs } from "./direction-sense";
import { inequalityMotifs } from "./inequality";
import { seatingArrangementMotifs } from "./seating-arrangement";

export const ALL_MOTIFS = [
  ...percentageMotifs,
  ...ratioMotifs,
  ...codingDecodingMotifs,
  ...bloodRelationMotifs,
  ...directionSenseMotifs,
  ...inequalityMotifs,
  ...seatingArrangementMotifs,
];
