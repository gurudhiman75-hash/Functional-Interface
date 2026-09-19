import type { EcoCp012ReviewQuestion } from "./eco-cp012-review-types";
import { ECO_CP012_REVIEW_V2 } from "./eco-cp012-review-generator-v2";

const STEM_REVISIONS_V3: Readonly<Record<string, string>> = Object.freeze({
  "What does public finance mainly deal with?": "What does public finance deal with?",
  "Which tools does fiscal policy mainly use?": "Which tools are used in fiscal policy?",
  "Which statement best separates fiscal policy from monetary policy?": "Which statement correctly distinguishes fiscal policy from monetary policy?",
  "Which of the following is an expansionary fiscal policy measure?": "Which of the following represents expansionary fiscal policy?",
  "Which of the following is a contractionary fiscal policy measure?": "Which of the following represents contractionary fiscal policy?",
  "The economy is in a deep slowdown. Which fiscal direction is most likely to support demand?": "During a deep economic slowdown, which fiscal action can support aggregate demand?",
  "Demand is overheating and inflationary pressure is strong. Which fiscal action is most contractionary?": "When demand is overheating and inflationary pressure is strong, which fiscal action can restrain demand?",
  "How is the payment of Government salaries generally classified?": "How is Government salary expenditure classified?",
  "How is Government spending on constructing a new highway generally classified?": "How is Government spending on construction of a new highway classified?",
  "How is interest paid on Government debt generally classified?": "How are interest payments on Government debt classified?",
  "What does the fiscal deficit mainly indicate?": "What does the fiscal deficit indicate?",
  "Which approach is most consistent with FRBM principles?": "Which approach is consistent with FRBM principles?",
  "Consider the statements: I. Capital expenditure may create assets. II. Interest payments are generally revenue expenditure. Which is correct?": "Consider the statements: I. Capital expenditure may create assets. II. Interest payments are classified as revenue expenditure. Which is correct?",
  "Which deficit measure most directly shows the borrowing requirement before new debt financing?": "Which deficit measure shows the Government's overall borrowing requirement before new debt financing?",
  "Which best distinguishes an automatic stabiliser from discretionary fiscal policy?": "Which statement correctly distinguishes an automatic stabiliser from discretionary fiscal policy?",
});

export function generateEcoCp012ReviewV3(): EcoCp012ReviewQuestion[] {
  return ECO_CP012_REVIEW_V2.map((question) => ({
    ...question,
    stem: STEM_REVISIONS_V3[question.stem] ?? question.stem,
  }));
}

export const ECO_CP012_REVIEW_V3 = Object.freeze(generateEcoCp012ReviewV3());
