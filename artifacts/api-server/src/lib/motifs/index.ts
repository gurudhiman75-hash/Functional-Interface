import { percentageMotifs } from "./percentage";
import { ratioMotifs } from "./ratio";
import { codingDecodingMotifs } from "./coding-decoding";
import { bloodRelationMotifs } from "./blood-relations";
import { directionSenseMotifs } from "./direction-sense";
import { abstractReasoningMotifs } from "./abstract-reasoning";
import { inequalityMotifs } from "./inequality";
import { temporalReasoningMotifs } from "./temporal-reasoning";
import { criticalInferenceMotifs } from "./critical-inference";
import { seatingArrangementMotifs } from "./seating-arrangement";
import { practicalQuantMotifs } from "./practical-quant";
import {
  fundamentalsMotifs,
  numberSystemMotifs,
  algebraBasicsMotifs,
  averagesMotifs,
  simpleCompoundInterestMotifs,
  compoundInterestMotifs,
  mensurationMotifs,
  mixtureAlligationMotifs,
  percentageMotifs as practicalPercentageMotifs,
  profitLossMotifs,
  ratioProportionMotifs,
  simpleInterestMotifs,
  speedDistanceMotifs,
  timeWorkMotifs,
} from "./quant";
import { practicalReasoningMotifs } from "./practical-reasoning";
import { englishMotifs } from "./english";
import { diMotifs } from "./di";
import {
  defineQuantMotif,
  type UniversalMotif,
} from "./types";
export * from "./types";

export const ALL_MOTIFS = [
  ...percentageMotifs,
  ...ratioMotifs,
  ...codingDecodingMotifs,
  ...bloodRelationMotifs,
  ...directionSenseMotifs,
  ...abstractReasoningMotifs,
  ...inequalityMotifs,
  ...temporalReasoningMotifs,
  ...criticalInferenceMotifs,
  ...seatingArrangementMotifs,
  ...practicalQuantMotifs,
  ...practicalReasoningMotifs,
];

export const UNIVERSAL_MOTIFS: UniversalMotif[] =
  [
    ...ALL_MOTIFS.map(
      defineQuantMotif,
    ),
    ...englishMotifs,
    ...diMotifs,
  ];

export {
  percentageMotifs,
  ratioMotifs,
  fundamentalsMotifs,
  numberSystemMotifs,
  practicalPercentageMotifs,
  ratioProportionMotifs,
  averagesMotifs,
  profitLossMotifs,
  simpleCompoundInterestMotifs,
  simpleInterestMotifs,
  compoundInterestMotifs,
  timeWorkMotifs,
  speedDistanceMotifs,
  mixtureAlligationMotifs,
  algebraBasicsMotifs,
  mensurationMotifs,
  codingDecodingMotifs,
  bloodRelationMotifs,
  directionSenseMotifs,
  abstractReasoningMotifs,
  inequalityMotifs,
  temporalReasoningMotifs,
  criticalInferenceMotifs,
  seatingArrangementMotifs,
  practicalQuantMotifs,
  practicalReasoningMotifs,
  englishMotifs,
  diMotifs,
};
