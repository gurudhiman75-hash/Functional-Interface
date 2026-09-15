export type PolCp013Fact = {
  factId: string;
  sourceIds: readonly string[];
  summary: string;
};

const C = "LEGISLATIVE-DEPT-CONSTITUTION-2026";
const S = "SCI-SUPREME-COURT-JURISDICTION";
const W = "SCI-WRIT-DEFINITIONS";

export const POL_CP013_FACTS_V1: readonly PolCp013Fact[] = Object.freeze([
  { factId: "pol-cp013-art214-216", sourceIds: [C], summary: "Articles 214–216: High Court for each State, court-of-record status, and constitution of a High Court." },
  { factId: "pol-cp013-art217", sourceIds: [C, S], summary: "Article 217: formal presidential appointment, age 62, resignation/removal and High Court Judge qualifications." },
  { factId: "pol-cp013-art218-221", sourceIds: [C], summary: "Articles 218–221: removal provisions, oath, post-retirement practice restriction and salaries/allowances." },
  { factId: "pol-cp013-art222-224a", sourceIds: [C], summary: "Articles 222–224A: transfers, acting Chief Justice, additional/acting Judges and retired Judges sitting in High Courts." },
  { factId: "pol-cp013-art225", sourceIds: [C], summary: "Article 225 preserves existing High Court jurisdiction subject to the Constitution and valid legislation." },
  { factId: "pol-cp013-art226-scope", sourceIds: [C, S], summary: "Article 226 empowers High Courts to issue directions, orders or writs for Fundamental Rights and for any other purpose." },
  { factId: "pol-cp013-writ-meanings", sourceIds: [W], summary: "Functional meanings of habeas corpus, mandamus, prohibition, quo warranto and certiorari." },
  { factId: "pol-cp013-art226-territory", sourceIds: [C], summary: "Article 226(2): territorial jurisdiction can rest on cause of action arising wholly or partly within the High Court territory." },
  { factId: "pol-cp013-art226-v-art32", sourceIds: [C, S], summary: "Article 226 is wider in purpose than Article 32 because High Courts may act for Fundamental Rights and other legal purposes." },
  { factId: "pol-cp013-art227", sourceIds: [C], summary: "Article 227 gives every High Court superintendence over courts and tribunals within its territorial jurisdiction." },
  { factId: "pol-cp013-art228", sourceIds: [C], summary: "Article 228 allows a High Court to withdraw a subordinate-court case involving a substantial constitutional-interpretation question necessary for disposal." },
  { factId: "pol-cp013-art229", sourceIds: [C], summary: "Article 229: High Court staff appointments, service rules and administrative expenses charged on the Consolidated Fund of the State." },
  { factId: "pol-cp013-art230-231", sourceIds: [C], summary: "Articles 230–231: Parliament may extend/exclude High Court jurisdiction for Union territories and establish a common High Court." },
  { factId: "pol-cp013-art233", sourceIds: [C], summary: "Article 233: district-judge appointments/posting/promotion by Governor in consultation with High Court; outsider eligibility requires seven years as advocate/pleader plus High Court recommendation." },
  { factId: "pol-cp013-art234", sourceIds: [C], summary: "Article 234: recruitment below district-judge rank by Governor under rules made after consultation with State PSC and High Court." },
  { factId: "pol-cp013-art235", sourceIds: [C], summary: "Article 235 vests control over district courts and subordinate courts in the High Court, including posting, promotion and leave of judicial-service officers below district judge." },
  { factId: "pol-cp013-art236", sourceIds: [C], summary: "Article 236 defines district judge broadly and judicial service as service intended to fill district-judge and lower civil judicial posts." },
  { factId: "pol-cp013-art237", sourceIds: [C], summary: "Article 237 allows the Governor by public notification to apply subordinate-courts chapter provisions to specified classes of magistrates, with exceptions/modifications." },
]);
