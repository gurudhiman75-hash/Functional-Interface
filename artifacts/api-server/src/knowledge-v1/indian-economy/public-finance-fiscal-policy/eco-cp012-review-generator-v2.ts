import type { EcoCp012ReviewQuestion } from "./eco-cp012-review-types";
import { ECO_CP012_REVIEW_V1 } from "./eco-cp012-review-generator-v1";

const STEM_OVERRIDES_V2: Record<string, string> = {
  "ECO-CP-012-Q01-01": "What does public finance mainly deal with?",
  "ECO-CP-012-Q01-02": "Which tools does fiscal policy mainly use?",
  "ECO-CP-012-Q02-01": "Which of the following is an expansionary fiscal policy measure?",
  "ECO-CP-012-Q02-02": "Which of the following is a contractionary fiscal policy measure?",
  "ECO-CP-012-Q03-01": "How are income-tax receipts of the Government classified?",
  "ECO-CP-012-Q03-02": "How is Government borrowing classified?",
  "ECO-CP-012-Q03-03": "How is recovery of a loan earlier given by the Government classified?",
  "ECO-CP-012-Q04-01": "How is the payment of Government salaries generally classified?",
  "ECO-CP-012-Q04-02": "How is Government spending on constructing a new highway generally classified?",
  "ECO-CP-012-Q04-03": "How is interest paid on Government debt generally classified?",
  "ECO-CP-012-Q05-01": "What does the fiscal deficit mainly indicate?",
  "ECO-CP-012-Q05-02": "Which formula is used to calculate the fiscal deficit?",
  "ECO-CP-012-Q05-03": "If total expenditure is 1,000 and total non-debt receipts are 760, what is the fiscal deficit?",
  "ECO-CP-012-Q06-01": "Which formula is used to calculate the revenue deficit?",
  "ECO-CP-012-Q06-02": "If revenue expenditure is 700 and revenue receipts are 620, what is the revenue deficit?",
  "ECO-CP-012-Q06-03": "What does a revenue deficit indicate?",
  "ECO-CP-012-Q07-01": "Which formula is used to calculate the primary deficit?",
  "ECO-CP-012-Q07-02": "If fiscal deficit is 300 and interest payments are 120, what is the primary deficit?",
  "ECO-CP-012-Q07-03": "If fiscal deficit equals interest payments, what is the primary deficit?",
  "ECO-CP-012-Q08-01": "Which of the following is a debt-creating capital receipt?",
  "ECO-CP-012-Q08-02": "Which of the following is a non-debt capital receipt?",
  "ECO-CP-012-Q09-01": "What is the full form of FRBM?",
  "ECO-CP-012-Q09-02": "What is a central purpose of the FRBM framework?",
  "ECO-CP-012-Q10-01": "How does an automatic stabiliser work?",
  "ECO-CP-012-Q10-02": "During a slowdown, tax collections fall automatically as incomes weaken. What does this illustrate?",
};

export const ECO_CP012_REVIEW_V2: EcoCp012ReviewQuestion[] = ECO_CP012_REVIEW_V1.map((question) => ({
  ...question,
  stem: STEM_OVERRIDES_V2[question.questionId] ?? question.stem,
}));
