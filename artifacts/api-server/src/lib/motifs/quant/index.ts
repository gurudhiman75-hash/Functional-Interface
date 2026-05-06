import { algebraBasicsMotifs } from "./algebra-basics";
import { averagesMotifs } from "./averages";
import { compoundInterestMotifs } from "./compound-interest";
import { mensurationMotifs } from "./mensuration";
import { mixtureAlligationMotifs } from "./mixture-alligation";
import { percentageMotifs } from "./percentage";
import { profitLossMotifs } from "./profit-loss";
import { ratioProportionMotifs } from "./ratio-proportion";
import { simpleInterestMotifs } from "./simple-interest";
import { speedDistanceMotifs } from "./speed-distance";
import { timeWorkMotifs } from "./time-work";

export const quantTopicMotifs = [
  ...percentageMotifs,
  ...ratioProportionMotifs,
  ...averagesMotifs,
  ...profitLossMotifs,
  ...simpleInterestMotifs,
  ...compoundInterestMotifs,
  ...timeWorkMotifs,
  ...speedDistanceMotifs,
  ...mixtureAlligationMotifs,
  ...algebraBasicsMotifs,
  ...mensurationMotifs,
];

export {
  percentageMotifs,
  ratioProportionMotifs,
  averagesMotifs,
  profitLossMotifs,
  simpleInterestMotifs,
  compoundInterestMotifs,
  timeWorkMotifs,
  speedDistanceMotifs,
  mixtureAlligationMotifs,
  algebraBasicsMotifs,
  mensurationMotifs,
};
