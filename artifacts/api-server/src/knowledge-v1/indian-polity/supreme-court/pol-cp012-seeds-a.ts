import type { PolCp012Seed } from "./pol-cp012-review-seed-types";

const C = "LEGISLATIVE-DEPT-CONSTITUTION-2026";
const q = (ql: number, stem: string, canonicalAnswer: string, distractors: [string, string, string], explanation: string, fact: string): PolCp012Seed => ({
  qlId: `POL-012-QL-${String(ql).padStart(3, "0")}`,
  difficulty: "Easy",
  stem,
  canonicalAnswer,
  distractors,
  explanation,
  sourceIds: [C],
  sourceFactIds: [fact],
});

export const POL_CP012_SEEDS_A: readonly PolCp012Seed[] = Object.freeze([
  // QL-001 — Article to subject
  q(1, "Article 124 mainly deals with:", "Supreme Court establishment and Judges", ["Supreme Court original jurisdiction", "Supreme Court review power", "Law declared by Supreme Court"], "Article 124 establishes the Supreme Court and contains the core rules on its Judges, including appointment, qualifications, tenure and removal.", "pol-cp012-art124"),
  q(1, "Article 129 deals with:", "Supreme Court as a court of record", ["Civil appeals to Supreme Court", "Presidential reference", "Transfer of cases"], "Article 129 makes the Supreme Court a court of record and expressly includes the power to punish for contempt of itself.", "pol-cp012-art129"),
  q(1, "Article 131 deals with:", "Original jurisdiction of the Supreme Court", ["Review jurisdiction", "Advisory jurisdiction", "Special leave to appeal"], "Article 131 gives the Supreme Court exclusive original jurisdiction over specified Union-State and inter-State disputes involving legal rights.", "pol-cp012-art131"),
  q(1, "Article 136 deals with:", "Special leave to appeal", ["Court of record", "Presidential reference", "Supreme Court rules"], "Article 136 gives the Supreme Court a broad discretionary special-leave power over judgments or orders of courts and tribunals, subject to its exception.", "pol-cp012-art136"),

  // QL-002 — Subject to Article
  q(2, "Supreme Court review of its own judgment is mainly under:", "Article 137", ["Article 131", "Article 141", "Article 143"], "Article 137 gives the Supreme Court power to review its own judgments or orders, subject to parliamentary law and Court rules.", "pol-cp012-art137"),
  q(2, "Law declared by the Supreme Court is binding on all courts under:", "Article 141", ["Article 137", "Article 142", "Article 144"], "Article 141 makes the law declared by the Supreme Court binding on every court within India, ensuring nationwide judicial consistency.", "pol-cp012-art141"),
  q(2, "The Supreme Court's complete-justice power is mainly under:", "Article 142", ["Article 136", "Article 141", "Article 145"], "Article 142 lets the Supreme Court pass orders needed to do complete justice in a pending cause or matter within its jurisdiction.", "pol-cp012-art142"),
  q(2, "Presidential consultation with the Supreme Court is mainly under:", "Article 143", ["Article 131", "Article 137", "Article 144"], "Article 143 creates the Supreme Court's advisory jurisdiction when the President refers a qualifying question of law or fact for opinion.", "pol-cp012-art143"),

  // QL-003 — Appointment, tenure and retirement
  q(3, "Who formally appoints a Judge of the Supreme Court?", "President", ["Prime Minister", "Chief Justice of India", "Parliament"], "Article 124 provides that every Supreme Court Judge is appointed by the President by warrant under the President's hand and seal.", "pol-cp012-art124"),
  q(3, "A Supreme Court Judge normally holds office until the age of:", "65 years", ["60 years", "62 years", "68 years"], "Article 124 fixes sixty-five years as the retirement age for a Supreme Court Judge, higher than the High Court retirement age.", "pol-cp012-art124"),
  q(3, "The Constitution fixes a separate minimum age for appointment as a Supreme Court Judge:", "No", ["Yes, 35 years", "Yes, 40 years", "Yes, 45 years"], "Article 124 sets no separate minimum age.\nQualifications:\n• Citizen of India\n• 5 years as a High Court judge, or\n• 10 years as a High Court advocate, or\n• Distinguished jurist in the President's opinion.", "pol-cp012-art124"),
  q(3, "The formal instrument used to appoint a Supreme Court Judge is a:", "Warrant under the President's hand and seal", ["Resolution of Lok Sabha", "Order of the Chief Justice of India", "Joint sitting resolution"], "Article 124 uses a presidential warrant under hand and seal, showing that the formal appointment is made by the President.", "pol-cp012-art124"),

  // QL-004 — Qualifications
  q(4, "A person appointed as a Supreme Court Judge must be a:", "Citizen of India", ["Member of Parliament", "State Governor", "Senior Advocate only"], "Article 124 qualifications:\n• Citizen of India\n• 5 years as a High Court judge, or\n• 10 years as a High Court advocate, or\n• Distinguished jurist in the President's opinion.", "pol-cp012-art124"),
  q(4, "One judicial qualification for Supreme Court appointment is at least:", "Five years as a High Court Judge", ["Three years as a District Judge", "Five years as a Supreme Court advocate only", "Ten years as a Governor"], "Judicial service is one Article 124 route.\nQualifications:\n• Citizen of India\n• 5 years as a High Court judge, or\n• 10 years as a High Court advocate, or\n• Distinguished jurist in the President's opinion.", "pol-cp012-art124"),
  q(4, "One advocacy qualification for Supreme Court appointment is at least:", "Ten years as a High Court advocate", ["Five years as a High Court advocate", "Ten years as a District Judge", "Fifteen years as a law professor"], "Advocacy is one Article 124 route.\nQualifications:\n• Citizen of India\n• 5 years as a High Court judge, or\n• 10 years as a High Court advocate, or\n• Distinguished jurist in the President's opinion.", "pol-cp012-art124"),
  q(4, "Who may be appointed under the 'distinguished jurist' qualification?", "A person considered a distinguished jurist by the President", ["Only a sitting High Court Chief Justice", "Only the Attorney-General", "Only a former Governor"], "Distinguished jurist is the third Article 124 route.\nQualifications:\n• Citizen of India\n• 5 years as a High Court judge, or\n• 10 years as a High Court advocate, or\n• Distinguished jurist in the President's opinion.", "pol-cp012-art124"),

  // QL-005 — Resignation and removal
  q(5, "A Supreme Court Judge resigns by writing to the:", "President", ["Chief Justice of India", "Prime Minister", "Speaker of Lok Sabha"], "Article 124 requires a Supreme Court Judge's resignation to be addressed to the President, who is also the formal appointing authority.", "pol-cp012-art124"),
  q(5, "A Supreme Court Judge may be removed for proved:", "Misbehaviour or incapacity", ["Political disagreement", "Loss of parliamentary majority", "Failure to win reappointment"], "Article 124 limits removal to proved misbehaviour or incapacity, preventing ordinary political disagreement from becoming a removal ground.", "pol-cp012-art124"),
  q(5, "Removal of a Supreme Court Judge requires an address by:", "Each House of Parliament", ["Lok Sabha only", "Rajya Sabha only", "A joint sitting"], "Each House must separately pass the removal address in the same session; there is no joint-sitting substitute for this requirement.", "pol-cp012-art124"),
  q(5, "The removal address for a Supreme Court Judge requires, in each House:", "Majority of total membership and two-thirds present and voting", ["Simple majority present and voting only", "Two-thirds of total membership only", "Unanimous vote of all members"], "Article 124 uses two thresholds together: a majority of total membership and at least two-thirds of members present and voting.", "pol-cp012-art124"),
]);
