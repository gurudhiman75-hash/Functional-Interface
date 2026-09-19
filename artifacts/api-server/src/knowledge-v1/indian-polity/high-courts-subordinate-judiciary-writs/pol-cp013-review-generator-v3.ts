import type { PolCp013ReviewQuestion } from "./pol-cp013-review-types";
import { generatePolCp013ReviewBatchV2 } from "./pol-cp013-review-generator-v2";

const TEXT: Record<number, {stem:string; explanation:string}> = {
  32: {
    stem: "In an Article 226 petition before a High Court, which writ primarily seeks release from unlawful detention?",
    explanation: "Under Article 226, a High Court may issue habeas corpus to test unlawful detention and order release where detention lacks lawful authority.",
  },
  33: {
    stem: "Under Article 226, which writ may a High Court use to require a public authority to perform a neglected public duty?",
    explanation: "A High Court may issue mandamus under Article 226 to require performance of a public duty that an authority has failed or refused to perform.",
  },
  34: {
    stem: "In High Court writ jurisdiction, which writ can stop an inferior court or tribunal from continuing beyond its jurisdiction?",
    explanation: "Under Article 226, prohibition is the preventive writ used to stop an inferior court or tribunal from continuing proceedings beyond lawful jurisdiction.",
  },
  35: {
    stem: "Under Article 226, which writ may a High Court use to question a person's legal authority to hold a public office?",
    explanation: "A High Court may issue quo warranto under Article 226 to test the legal authority by which a person occupies a public office.",
  },
  36: {
    stem: "Under Article 226, which writ may a High Court use to quash an order already made by an inferior court or tribunal?",
    explanation: "Certiorari is the corrective Article 226 remedy commonly used to quash an already-made order where an inferior body exceeded lawful jurisdiction.",
  },
  37: {
    stem: "For an Article 226 petition, which distinction between prohibition and certiorari is correct?",
    explanation: "In High Court writ practice, prohibition prevents unlawful proceedings from continuing, while certiorari can quash an order or decision already made.",
  },
  38: {
    stem: "A person challenges unlawful private detention before a High Court under Article 226. Which writ is the direct remedy?",
    explanation: "Habeas corpus under Article 226 protects personal liberty and can reach unlawful private detention, not only detention by a public authority.",
  },
  39: {
    stem: "A person allegedly occupies a public office without legal qualification. Which Article 226 writ directly tests that authority?",
    explanation: "Quo warranto allows the High Court to test the legal authority for occupying a public office and is suited to unlawful-office claims.",
  },
  73: {
    stem: "A High Court faces unfinished tribunal proceedings that allegedly exceed jurisdiction. Which Article 226 writ is the preventive remedy?",
    explanation: "Prohibition is the preventive Article 226 remedy: it can stop an inferior tribunal from continuing proceedings beyond its lawful jurisdiction.",
  },
  74: {
    stem: "A tribunal has already made an order beyond jurisdiction. Which Article 226 writ most directly asks the High Court to quash it?",
    explanation: "Certiorari is the corrective Article 226 remedy used against an already-made order; prohibition normally acts before the unlawful proceeding is completed.",
  },
};

export function generatePolCp013ReviewBatchV3(): PolCp013ReviewQuestion[] {
  return generatePolCp013ReviewBatchV2().map((q,index)=>{
    const t=TEXT[index];
    const questionId=`POL-CP013-V3-${String(index+1).padStart(3,"0")}`;
    if(!t) return {...q,questionId};
    return {...q,questionId,stem:t.stem,explanation:t.explanation};
  });
}
