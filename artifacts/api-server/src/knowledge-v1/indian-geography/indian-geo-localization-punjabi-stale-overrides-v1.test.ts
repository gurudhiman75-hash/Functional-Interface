import assert from "node:assert/strict";
import { localizeIndianGeoQuestionV1 } from "./indian-geo-localization-v1";

function q(stem:string, answer:string, distractors:string[], explanation:string){
  return { questionId:"QA-STALE", qlId:"QA-QL", stem, options:[answer,...distractors], correctIndex:0, canonicalAnswer:answer, explanation } as const;
}

const project=q(
  "Which project is important for irrigation?",
  "Multipurpose project",
  ["River","Forest","Road"],
  "A multipurpose project can support irrigation.",
);
const projectPa=localizeIndianGeoQuestionV1(project,"pa","GEO-WAT-001");
assert.equal(projectPa.stem.includes("ਪ੍ਰਾਜੈਕਟ"),true);
assert.equal(projectPa.stem.includes("ਪਰਿਯੋਜਨਾ"),false);

const watershed=q(
  "Which method is useful for watershed management?",
  "Watershed management",
  ["Mining","Deforestation","Overgrazing"],
  "Watershed management helps conserve soil and water.",
);
assert.equal(localizeIndianGeoQuestionV1(watershed,"pa","GEO-WAT-001").canonicalAnswer,"ਵਾਟਰਸ਼ੈੱਡ ਪ੍ਰਬੰਧਨ");
