import type { PolCp012Seed } from "./pol-cp012-review-seed-types";

const C = "LEGISLATIVE-DEPT-CONSTITUTION-2026";
const S = "SCI-SUPREME-COURT-JURISDICTION";
const q = (ql: number, difficulty: "Easy" | "Medium", stem: string, canonicalAnswer: string, distractors: [string, string, string], explanation: string, fact: string, sourceIds: string[] = [C]): PolCp012Seed => ({
  qlId: `POL-012-QL-${String(ql).padStart(3, "0")}`,
  difficulty,
  stem,
  canonicalAnswer,
  distractors,
  explanation,
  sourceIds,
  sourceFactIds: [fact],
});

export const POL_CP012_SEEDS_B: readonly PolCp012Seed[] = Object.freeze([
  // QL-006 — Acting, ad hoc, retired Judges and seat
  q(6, "Easy", "When the Chief Justice of India cannot perform the duties, an acting CJI is appointed by the:", "President", ["Prime Minister", "Vice-President", "Supreme Court Collegium alone"], "Article 126 lets the President appoint another Supreme Court Judge to perform the Chief Justice's duties during vacancy or inability.", "pol-cp012-art126"),
  q(6, "Easy", "An ad hoc Supreme Court Judge under Article 127 is drawn from the:", "High Courts", ["District Courts", "Parliament", "Election Commission"], "Article 127 allows a duly qualified High Court Judge to sit temporarily as an ad hoc Supreme Court Judge when needed.", "pol-cp012-art127"),
  q(6, "Easy", "A retired Judge may sit in the Supreme Court only if the retired Judge:", "Consents", ["Is below 65 years", "Wins parliamentary approval", "Is reappointed permanently"], "Article 128 requires the retired Judge's consent, so a former Judge cannot be compelled to return and sit in the Supreme Court.", "pol-cp012-art128"),
  q(6, "Easy", "The normal seat of the Supreme Court is:", "Delhi", ["Mumbai", "Prayagraj", "Kolkata"], "Article 130 places the Supreme Court in Delhi, while allowing another place if the Chief Justice acts with presidential approval.", "pol-cp012-art130"),

  // QL-007 — Court of record and contempt
  q(7, "Medium", "The Supreme Court is declared a court of record by:", "Article 129", ["Article 131", "Article 136", "Article 141"], "Article 129 gives the Supreme Court court-of-record status and expressly includes power to punish for contempt of itself.", "pol-cp012-art129"),
  q(7, "Medium", "Which power is expressly linked with the Supreme Court being a court of record?", "Punishing for contempt of itself", ["Making the Union Budget", "Dissolving Lok Sabha", "Appointing Governors"], "The Constitution directly connects court-of-record status with contempt power, making Article 129 the key provision for this exam distinction.", "pol-cp012-art129"),
  q(7, "Medium", "The Supreme Court's contempt power under Article 129 is a:", "Constitutional power", ["Power created only by ordinary court rules", "Power of Parliament alone", "State-list power"], "Article 129 itself grants contempt power to the Supreme Court, so its basic source is constitutional rather than merely procedural.", "pol-cp012-art129"),
  q(7, "Medium", "Article 129 applies contempt power to contempt of:", "The Supreme Court itself", ["Parliament only", "High Courts only", "Election Commission only"], "Article 129 specifically mentions contempt of the Supreme Court itself; other contempt arrangements operate under their own constitutional or statutory framework.", "pol-cp012-art129"),

  // QL-008 — Original jurisdiction
  q(8, "Medium", "A dispute between two States involving a legal right may fall under Supreme Court original jurisdiction in:", "Article 131", ["Article 132", "Article 136", "Article 143"], "Article 131 gives exclusive original jurisdiction over specified federal disputes when the existence or extent of a legal right is involved.", "pol-cp012-art131", [C, S]),
  q(8, "Medium", "Article 131 original jurisdiction is described as exclusive because the covered dispute begins in the:", "Supreme Court", ["High Court", "District Court", "Parliament"], "For qualifying Union-State or inter-State disputes, Article 131 places original jurisdiction in the Supreme Court to the exclusion of other courts.", "pol-cp012-art131", [C, S]),
  q(8, "Medium", "Which dispute fits Article 131 most directly?", "Government of India versus one or more States", ["Two private companies", "A citizen versus a municipality", "Two political parties"], "Article 131 is a federal-dispute provision involving the Union and States, not a general route for ordinary private disputes.", "pol-cp012-art131", [C, S]),
  q(8, "Medium", "For Article 131, the dispute must involve a question affecting the existence or extent of a:", "Legal right", ["Political slogan", "Party manifesto", "Non-legal disagreement only"], "Article 131 requires a legal-right element, which separates its constitutional jurisdiction from purely political disagreements between governments.", "pol-cp012-art131"),

  // QL-009 — Constitutional and civil appeals
  q(9, "Medium", "An Article 132 appeal from a High Court must involve a substantial question of law about:", "Interpretation of the Constitution", ["Local administrative convenience", "A political party constitution", "Only court fees"], "Article 132 focuses on substantial constitutional-interpretation questions and normally depends on a High Court certificate under Article 134A.", "pol-cp012-art132", [C, S]),
  q(9, "Medium", "A civil appeal under Article 133 requires a substantial question of law of:", "General importance", ["Local importance only", "No legal importance", "Political importance only"], "Article 133 requires general legal importance and the High Court's view that the question needs decision by the Supreme Court.", "pol-cp012-art133", [C, S]),
  q(9, "Medium", "For a civil appeal under Article 133, the High Court must also consider that the question:", "Needs to be decided by the Supreme Court", ["Must be decided by Parliament", "Needs a referendum", "Must be sent to Rajya Sabha"], "Article 133 uses two linked tests: general legal importance and a need for the Supreme Court to decide that question.", "pol-cp012-art133"),
  q(9, "Medium", "The High Court certificate connected with Articles 132 and 133 is dealt with in:", "Article 134A", ["Article 129", "Article 136", "Article 143"], "Article 134A sets the certificate mechanism used for specified constitutional, civil and criminal appeals from High Courts to the Supreme Court.", "pol-cp012-art134a"),

  // QL-010 — Criminal appeals and certificate
  q(10, "Medium", "Supreme Court criminal appellate jurisdiction from High Courts is mainly under:", "Article 134", ["Article 131", "Article 137", "Article 143"], "Article 134 covers specified criminal appeals from High Courts, while Parliament may also enlarge this appellate jurisdiction by law.", "pol-cp012-art134", [C, S]),
  q(10, "Medium", "A High Court may certify a criminal case as fit for Supreme Court appeal under:", "Article 134", ["Article 129", "Article 141", "Article 144"], "Article 134 includes the High Court's fit-case certificate route, with Article 134A providing the procedure for considering such certificates.", "pol-cp012-art134"),
  q(10, "Medium", "Article 134A requires a High Court to consider a certificate question when an oral application is made:", "Immediately after the judgment, order or sentence", ["Only after one year", "Before the case begins", "Only after presidential assent"], "Article 134A allows an immediate oral request after the relevant decision, so the certificate question need not await a separate long process.", "pol-cp012-art134a"),
  q(10, "Medium", "Who may enlarge the Supreme Court's criminal appellate jurisdiction by law?", "Parliament", ["President by ordinance alone forever", "Election Commission", "Finance Commission"], "Article 134 permits Parliament to confer further criminal appellate powers on the Supreme Court beyond the constitutionally specified cases.", "pol-cp012-art134"),
]);
