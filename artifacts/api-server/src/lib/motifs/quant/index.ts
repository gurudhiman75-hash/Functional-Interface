import { fundamentalsMotifs } from "./fundamentals";
import { numberSystemMotifs } from "./number-system";
import { algebraBasicsMotifs } from "./algebra-basics";
import { averagesMotifs } from "./averages";
import { mensurationMotifs } from "./mensuration";
import { mixtureAlligationMotifs } from "./mixture-alligation";
import { percentageMotifs } from "./percentage";
import { profitLossMotifs } from "./profit-loss";
import { ratioProportionMotifs } from "./ratio-proportion";
import {
  compoundInterestMotifs,
  simpleCompoundInterestMotifs,
  simpleInterestMotifs,
} from "./simple-compound-interest";
import { speedDistanceMotifs } from "./speed-distance";
import { timeWorkMotifs } from "./time-work";

export const quantTopicMotifs = [
  ...fundamentalsMotifs,
  ...numberSystemMotifs,
  ...percentageMotifs,
  ...ratioProportionMotifs,
  ...averagesMotifs,
  ...profitLossMotifs,
  ...simpleCompoundInterestMotifs,
  ...timeWorkMotifs,
  ...speedDistanceMotifs,
  ...mixtureAlligationMotifs,
  ...algebraBasicsMotifs,
  ...mensurationMotifs,
];

export {
  fundamentalsMotifs,
  numberSystemMotifs,
  percentageMotifs,
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
};
