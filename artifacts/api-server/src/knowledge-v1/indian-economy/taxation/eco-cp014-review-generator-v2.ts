import type { EcoCp014ReviewQuestion } from "./eco-cp014-review-types";
import { ECO_CP014_REVIEW_V1 } from "./eco-cp014-review-generator-v1";

const STEM_REVISIONS_V2: Readonly<Record<string,string>> = Object.freeze({
  "Which feature best distinguishes an indirect tax from a direct tax?": "Which feature distinguishes an indirect tax from a direct tax?",
  "Two taxpayers face the same statutory tax rate, but the tax absorbs a larger share of the poorer taxpayer's income. Which statement is most accurate?": "Two taxpayers face the same statutory tax rate, but the tax takes a larger share of the poorer taxpayer's income. What does this indicate?",
  "Which taxes generally apply together on a taxable intra-State supply?": "Which taxes apply together on a taxable intra-State supply?",
  "Which GST is generally levied on an inter-State supply?": "Which GST is levied on an inter-State supply?",
  "Which statement best distinguishes IGST from CGST plus SGST?": "Which statement correctly distinguishes IGST from CGST plus SGST?",
  "How should customs duty generally be classified in the direct-indirect tax distinction?": "How is customs duty classified in the direct-indirect tax distinction?",
  "How is personal income tax generally classified?": "How is personal income tax classified?",
  "How is corporation tax generally classified?": "How is corporation tax classified?",
  "Consider the statements. I. GST is destination-based. II. IGST generally applies to inter-State supplies. Which option is correct?": "Consider the statements. I. GST is destination-based. II. IGST applies to inter-State supplies. Which option is correct?",
  "A taxable supply is consumed in State B after originating in State A. Which pair of ideas is most relevant to the GST treatment?": "A taxable supply is consumed in State B after originating in State A. Which pair of principles applies?",
  "Which statement best separates a progressive direct tax from a destination-based indirect tax?": "Which statement correctly distinguishes a progressive direct tax from a destination-based indirect tax?",
});

export function generateEcoCp014ReviewV2(): EcoCp014ReviewQuestion[] {
  return ECO_CP014_REVIEW_V1.map((q)=>({...q,stem:STEM_REVISIONS_V2[q.stem]??q.stem}));
}
export const ECO_CP014_REVIEW_V2=Object.freeze(generateEcoCp014ReviewV2());
