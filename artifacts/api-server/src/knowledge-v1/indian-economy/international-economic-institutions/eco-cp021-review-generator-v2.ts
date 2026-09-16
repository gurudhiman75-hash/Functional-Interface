import type { EcoCp021ReviewQuestion } from "./eco-cp021-review-types";
import { ECO_CP021_REVIEW_V1 } from "./eco-cp021-review-generator-v1";

const STEM_OVERRIDES: Record<string, string> = {
  "ECO-CP-021-Q01": "Which pair is associated with the Bretton Woods Conference of 1944?",
  "ECO-CP-021-Q02": "The IMF was conceived at Bretton Woods in which year?",
  "ECO-CP-021-Q03": "Why was the IMF established?",
  "ECO-CP-021-Q04": "Which option correctly matches the original roles of the IMF and IBRD?",

  "ECO-CP-021-Q05": "Which institution promotes international monetary cooperation and financial stability?",
  "ECO-CP-021-Q06": "What is meant by IMF surveillance?",
  "ECO-CP-021-Q07": "What is an SDR?",
  "ECO-CP-021-Q08": "Which statement about SDRs is correct?",

  "ECO-CP-021-Q09": "What is the full form of IBRD?",
  "ECO-CP-021-Q10": "Which institution mainly lends to middle-income and creditworthy lower-income countries?",
  "ECO-CP-021-Q11": "Which two institutions together constitute the World Bank?",
  "ECO-CP-021-Q12": "Which institution mainly provides long-term development finance to middle-income and creditworthy countries?",

  "ECO-CP-021-Q13": "Which World Bank institution provides concessional finance to low-income countries?",
  "ECO-CP-021-Q14": "IDA was established in which year?",
  "ECO-CP-021-Q15": "Which option correctly distinguishes IBRD from IDA?",
  "ECO-CP-021-Q16": "Which World Bank institution mainly supports low-income countries with limited creditworthiness?",

  "ECO-CP-021-Q17": "The World Trade Organization was established on which date?",
  "ECO-CP-021-Q18": "Which institution provides a forum for multilateral trade negotiations?",
  "ECO-CP-021-Q19": "Which of the following is a function of the WTO?",
  "ECO-CP-021-Q20": "Which option correctly distinguishes the WTO from the IMF?",

  "ECO-CP-021-Q21": "ADB was established in which year?",
  "ECO-CP-021-Q22": "ADB mainly works in which region?",
  "ECO-CP-021-Q23": "Which of the following can ADB provide to its members?",
  "ECO-CP-021-Q24": "Which statement correctly compares ADB and the IMF?",

  "ECO-CP-021-Q25": "AIIB began operations in which year?",
  "ECO-CP-021-Q26": "What is the main financing focus of AIIB?",
  "ECO-CP-021-Q27": "Which description best fits AIIB?",
  "ECO-CP-021-Q28": "Which statement correctly compares AIIB and ADB?",

  "ECO-CP-021-Q29": "Which group established the New Development Bank?",
  "ECO-CP-021-Q30": "The New Development Bank was established in which year?",
  "ECO-CP-021-Q31": "What is a major objective of the New Development Bank?",
  "ECO-CP-021-Q32": "Which of the following is correctly matched?",

  "ECO-CP-021-Q33": "Which of the following institution-function pairs is correctly matched?",
  "ECO-CP-021-Q34": "Which institution is correctly matched with its function?",
  "ECO-CP-021-Q35": "Which set of institutions and functions is correctly matched?",

  "ECO-CP-021-Q36": "Which institution has a broad development mandate across Asia and the Pacific?",
  "ECO-CP-021-Q37": "Which institution mainly finances infrastructure in Asia and beyond?",
  "ECO-CP-021-Q38": "Which option correctly compares IBRD, IDA and AIIB?",

  "ECO-CP-021-Q39": "Consider the statements. I. WTO was established in 1995. II. IMF was conceived at Bretton Woods in 1944. Which option is correct?",
  "ECO-CP-021-Q40": "Consider the statements. I. IDA provides concessional finance to low-income countries. II. IBRD and IDA together form the World Bank. Which option is correct?",
  "ECO-CP-021-Q41": "Consider the statements. I. AIIB mainly focuses on infrastructure. II. WTO issues SDRs. Which option is correct?",

  "ECO-CP-021-Q42": "Which institution provides financial assistance to countries facing balance-of-payments difficulties?",
  "ECO-CP-021-Q43": "A low-income country needs concessional finance, while another seeks settlement of a trade dispute. Which pair is correct?",
  "ECO-CP-021-Q44": "Which of the following sequences is chronologically correct?",
};

export const ECO_CP021_REVIEW_V2: EcoCp021ReviewQuestion[] = ECO_CP021_REVIEW_V1.map((question) => ({
  ...question,
  stem: STEM_OVERRIDES[question.questionId] ?? question.stem,
}));
