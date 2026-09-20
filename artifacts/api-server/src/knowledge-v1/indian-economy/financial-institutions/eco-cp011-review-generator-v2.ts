import type { EcoCp011ReviewQuestion } from "./eco-cp011-review-types";
import { ECO_CP011_REVIEW_V1 } from "./eco-cp011-review-generator-v1";

const STEM_REVISIONS_V2: Readonly<Record<string, string>> = Object.freeze({
  "What is the main purpose of a Development Financial Institution?": "What is the primary role of a Development Financial Institution (DFI)?",
  "Why were DFIs important when commercial banks mainly focused on shorter-term finance?": "Why were DFIs important when commercial banks focused on shorter-term finance?",
  "Which feature best separates a DFI from an ordinary retail-banking role?": "Which feature distinguishes a DFI from ordinary retail banking?",
  "IFCI was originally created mainly to meet which need?": "IFCI was originally created to meet which need?",
  "Which sector is most directly associated with NABARD?": "Which sector does NABARD focus on?",
  "A rural cooperative bank needs refinance support for agricultural lending. Which institution is most directly relevant?": "A rural cooperative bank needs refinance support for agricultural lending. Which institution provides this support?",
  "Which statement best describes NABARD's refinance role?": "Which statement correctly describes NABARD's refinance role?",
  "An institution wants to refinance lenders and also provide direct finance to MSMEs. Which institution's mandate fits best?": "Which institution can both refinance lenders and provide direct finance to MSMEs?",
  "Which feature best distinguishes SIDBI from NABARD?": "Which statement correctly distinguishes SIDBI from NABARD?",
  "An Indian exporter needs specialised finance for an overseas project. Which institution is most directly relevant?": "An Indian exporter needs specialised finance for an overseas project. Which institution should it approach?",
  "A large infrastructure project needs long-tenor specialised finance. Which institution is most directly aligned with this need?": "Which institution is designed to provide long-term finance for large infrastructure projects?",
  "An NBFC is best described as:": "Which statement correctly describes an NBFC?",
  "Which statement is most accurate?": "Which statement about NBFCs is correct?",
  "A small manufacturer needs MSME development finance, while a highway project needs long-term infrastructure finance. Which pairing fits best?": "A small manufacturer needs MSME finance and a highway project needs long-term infrastructure finance. Which pairing is correct?",
  "A housing-finance institution seeks sector-development support, while an exporter seeks overseas trade finance. Which pairing fits best?": "A housing-finance institution seeks sector support and an exporter seeks overseas trade finance. Which pairing is correct?",
  "Which statement best distinguishes a sector-specific DFI from an NBFC category?": "Which statement correctly distinguishes a sector-specific DFI from an NBFC?",
  "NHB is primarily associated with development of which financial sector?": "Which financial sector does NHB support?",
  "NaBFID is primarily focused on:": "What is the core financing focus of NaBFID?",
  "Which statement best reflects NHB\'s position after the 2019 regulatory change?": "Which statement correctly describes NHB after the 2019 regulatory change?",
});

export function generateEcoCp011ReviewV2(): EcoCp011ReviewQuestion[] {
  return ECO_CP011_REVIEW_V1.map((question) => ({
    ...question,
    stem: STEM_REVISIONS_V2[question.stem] ?? question.stem,
  }));
}

export const ECO_CP011_REVIEW_V2 = Object.freeze(generateEcoCp011ReviewV2());
