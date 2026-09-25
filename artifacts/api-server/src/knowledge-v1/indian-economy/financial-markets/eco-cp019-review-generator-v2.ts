import { ECO_CP019_REVIEW_V1 } from "./eco-cp019-review-generator-v1";
import type { EcoCp019ReviewQuestion } from "./eco-cp019-review-types";

const STEM_OVERRIDES: Readonly<Record<string, string>> = Object.freeze({
  "Which market mainly deals in short-term funds and instruments?": "Which market deals in short-term funds and instruments?",
  "Which market is mainly used for raising medium- and long-term funds through shares and bonds?": "Which market is used for raising medium- and long-term funds through shares and bonds?",
  "Where do investors normally trade already-issued listed shares with one another?": "Where are already-issued listed shares traded between investors?",
  "What does a bond or similar debt security mainly represent?": "What does a bond or similar debt security represent?",
  "An investor wants ownership participation rather than a creditor claim. Which instrument best fits that objective?": "An investor wants ownership participation rather than a creditor claim. Which instrument provides that?",
  "What is the main purpose of a demat account?": "What is the purpose of a demat account?",
  "How do Treasury Bills normally provide a return to investors?": "How do Treasury Bills provide a return to investors?",
  "Which market is mainly used for very short-term unsecured liquidity between eligible financial participants?": "Which market is used for very short-term unsecured liquidity between eligible financial participants?",
  "Which asset is generally more liquid: a frequently traded listed share or an illiquid unlisted asset?": "Which asset is more liquid: a frequently traded listed share or an illiquid unlisted asset?",
  "Which combination correctly matches the instrument with its main market feature?": "Which combination correctly matches each instrument with its market feature?",
});

export const ECO_CP019_REVIEW_V2: EcoCp019ReviewQuestion[] = ECO_CP019_REVIEW_V1.map((question) => ({
  ...question,
  stem: STEM_OVERRIDES[question.stem] ?? question.stem,
}));
