import type { PolCp005Sourced } from "./pol-cp005-facts";

const IGNOU_DPSP = "IGNOU-UNIT13-DPSP-CLASSIFICATION";
const IGNOU_DUTIES = "IGNOU-HUMAN-RIGHTS-DUTIES-USSR";

export type PolCp005ExamContextRow = PolCp005Sourced & {
  id: string;
  prompt: string;
  answer: string;
  explanation: string;
};

export const POL_CP005_CLASSIFICATION_ROWS_V1: readonly PolCp005ExamContextRow[] = Object.freeze([
  {
    id: "social-economic-equal-pay",
    prompt: "Equal pay for equal work under Article 39(d) is commonly grouped under:",
    answer: "Social and economic principles",
    explanation: "In conventional DPSP classification, equal pay for equal work is treated as a social and economic principle.",
    sourceIds: [IGNOU_DPSP],
    sourceFactIds: ["pol-cp005-classification-social-economic"],
  },
  {
    id: "gandhian-panchayat",
    prompt: "Organisation of village panchayats under Article 40 is commonly associated with:",
    answer: "Gandhian principles",
    explanation: "Village self-government under Article 40 is commonly associated with Gandhian principles.",
    sourceIds: [IGNOU_DPSP],
    sourceFactIds: ["pol-cp005-classification-gandhian"],
  },
  {
    id: "international-peace",
    prompt: "Article 51 is mainly placed under principles relating to:",
    answer: "International peace and security",
    explanation: "Article 51 deals with international peace, just relations, international law and arbitration.",
    sourceIds: [IGNOU_DPSP],
    sourceFactIds: ["pol-cp005-classification-international"],
  },
]);

export const POL_CP005_ORIGIN_ROWS_V1: readonly PolCp005ExamContextRow[] = Object.freeze([
  {
    id: "dpsp-irish-source",
    prompt: "The idea of Directive Principles in the Indian Constitution was influenced by the Constitution of:",
    answer: "Ireland",
    explanation: "The Directive Principles were influenced by the Irish constitutional model.",
    sourceIds: [IGNOU_DPSP],
    sourceFactIds: ["pol-cp005-origin-dpsp-ireland"],
  },
  {
    id: "duties-ussr-source",
    prompt: "Fundamental Duties in the Indian Constitution were influenced by the Constitution of the former:",
    answer: "USSR",
    explanation: "The Fundamental Duties were influenced by the Constitution of the erstwhile USSR.",
    sourceIds: [IGNOU_DUTIES],
    sourceFactIds: ["pol-cp005-origin-duties-ussr"],
  },
  {
    id: "swaran-singh",
    prompt: "The committee associated with recommending Fundamental Duties was headed by:",
    answer: "Swaran Singh",
    explanation: "The Swaran Singh Committee recommended the inclusion of Fundamental Duties before their insertion by the Forty-second Amendment.",
    sourceIds: [IGNOU_DUTIES],
    sourceFactIds: ["pol-cp005-origin-swaran-singh"],
  },
]);
