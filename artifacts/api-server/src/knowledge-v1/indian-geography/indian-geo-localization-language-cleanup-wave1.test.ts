import assert from "node:assert/strict";
import { localizeIndianGeoQuestionV1 } from "./indian-geo-localization-v1";

function q(stem:string, answer:string, distractors:string[], explanation:string){
  return {
    questionId:"QA-Q1",
    qlId:"QA-QL",
    stem,
    options:[answer,...distractors],
    correctIndex:0,
    canonicalAnswer:answer,
    explanation,
  } as const;
}

const riv = q(
  "River Tawa is a tributary of which river?",
  "River Narmada",
  ["River Tapi","River Mahi","River Sabarmati"],
  "River Tawa is a left-bank tributary of River Narmada.",
);
assert.equal(
  localizeIndianGeoQuestionV1(riv,"hi","GEO-RIV-001").stem,
  "नदी Tawa किस नदी की सहायक नदी है?",
);
assert.equal(
  localizeIndianGeoQuestionV1(riv,"pa","GEO-RIV-001").stem,
  "ਨਦੀ Tawa ਕਿਹੜੀ ਨਦੀ ਦੀ ਸਹਾਇਕ ਨਦੀ ਹੈ?",
);

const cli = q(
  "Which combination best supports the onset of the southwest monsoon over India?",
  "Strong continental low pressure and moisture-bearing oceanic flow",
  ["High pressure over northwest India and dry continental winds","Weak summer heating and permanent winter circulation","Only local sea breezes with no pressure contrast"],
  "Summer heating creates a strong land-ocean pressure contrast.",
);
assert.equal(
  localizeIndianGeoQuestionV1(cli,"hi","GEO-CLI-001").stem,
  "भारत में दक्षिण-पश्चिम मानसून के आगमन के लिए कौन-सा संयोजन सबसे अधिक अनुकूल है?",
);
assert.equal(
  localizeIndianGeoQuestionV1(cli,"pa","GEO-CLI-001").stem,
  "ਭਾਰਤ ਵਿੱਚ ਦੱਖਣ-ਪੱਛਮੀ ਮਾਨਸੂਨ ਦੇ ਆਗਮਨ ਲਈ ਕਿਹੜਾ ਜੋੜ ਸਭ ਤੋਂ ਵੱਧ ਅਨੁਕੂਲ ਹੈ?",
);

const phy = q(
  "Guru Shikhar is the highest peak of which range?",
  "Aravali Range",
  ["Nilgiri Hills","Satpura Range","Eastern Ghats"],
  "Guru Shikhar is the highest peak of the Aravali Range.",
);
assert.equal(
  localizeIndianGeoQuestionV1(phy,"hi","GEO-PHY-001").stem,
  "Guru Shikhar किस पर्वत श्रेणी की सबसे ऊँची चोटी है?",
);
assert.equal(
  localizeIndianGeoQuestionV1(phy,"pa","GEO-PHY-001").stem,
  "Guru Shikhar ਕਿਹੜੀ ਪਹਾੜੀ ਲੜੀ ਦੀ ਸਭ ਤੋਂ ਉੱਚੀ ਚੋਟੀ ਹੈ?",
);
