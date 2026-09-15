import type { PolCp011Seed } from "./pol-cp011-review-seed-types";

const C = "LEGISLATIVE-DEPT-CONSTITUTION-2025";
const S = "DIGITAL-SANSAD-LEGISLATION-INTRO";

const q = (ql: number, stem: string, canonicalAnswer: string, distractors: [string, string, string], explanation: string, sourceIds: string[] = [C], fact = "pol-cp011-core"): PolCp011Seed => ({
  qlId: `POL-011-QL-${String(ql).padStart(3, "0")}`,
  difficulty: "Medium",
  stem,
  canonicalAnswer,
  distractors,
  explanation,
  sourceIds,
  sourceFactIds: [fact],
});

export const POL_CP011_SEEDS_B: readonly PolCp011Seed[] = Object.freeze([
  // QL-007 — Six-month joint-sitting clock
  q(7, "For the six-month joint-sitting delay, a period of prorogation of the receiving House is:", "Excluded from the count", ["Always included", "Counted twice", "Ignored only for Money Bills"], "Article 108 excludes periods of prorogation when calculating the six-month delay for a possible joint sitting.", [C], "pol-cp011-joint-sitting"),
  q(7, "An adjournment of more than four consecutive days is treated how in the Article 108 six-month count?", "It is excluded", ["It is fully counted", "It restarts the Bill", "It converts the Bill into a Money Bill"], "An adjournment lasting more than four consecutive days is left out of the six-month calculation under Article 108.", [C], "pol-cp011-joint-sitting"),
  q(7, "The six-month period for joint-sitting deadlock begins from the Bill's:", "Receipt by the other House", ["Introduction in the first House", "Publication in the Gazette", "Presentation to the President"], "Article 108 measures the delay from the date the second House receives the Bill.", [C], "pol-cp011-joint-sitting"),
  q(7, "After the President notifies an intended joint sitting, either House may continue separately with that Bill:", "No", ["Yes", "Only Lok Sabha may", "Only Rajya Sabha may"], "Once the President gives the Article 108 notification, neither House proceeds further with that Bill separately.", [C], "pol-cp011-joint-sitting"),

  // QL-008 — Money Bill origin and Rajya Sabha role
  q(8, "A Money Bill may be introduced in:", "Lok Sabha only", ["Either House", "Rajya Sabha only", "A joint sitting only"], "A Money Bill cannot be introduced in Rajya Sabha; its parliamentary journey begins in Lok Sabha.", [C, S], "pol-cp011-money-bill"),
  q(8, "Rajya Sabha's constitutional role on a Money Bill is mainly to:", "Make recommendations", ["Reject it finally", "Amend it compulsorily", "Certify it as a Money Bill"], "Rajya Sabha may recommend changes to a Money Bill, but Lok Sabha decides whether to accept them.", [C], "pol-cp011-money-bill"),
  q(8, "Lok Sabha must accept Rajya Sabha's recommendations on a Money Bill:", "No", ["Yes", "Only tax recommendations", "Only unanimous recommendations"], "Lok Sabha may accept or reject all or any Rajya Sabha recommendations on a Money Bill.", [C], "pol-cp011-money-bill"),
  q(8, "A Money Bill sent to Rajya Sabha is sent for its:", "Recommendations", ["Final approval", "Certification", "Presidential assent"], "Article 109 sends a Lok Sabha-passed Money Bill to Rajya Sabha specifically for recommendations.", [C], "pol-cp011-money-bill"),

  // QL-009 — Fourteen-day rule
  q(9, "Rajya Sabha normally has how long to return a Money Bill?", "14 days", ["7 days", "30 days", "Six months"], "Article 109 gives Rajya Sabha fourteen days from receipt to return a Money Bill with recommendations.", [C], "pol-cp011-money-bill"),
  q(9, "If Rajya Sabha does not return a Money Bill within 14 days, it is deemed:", "Passed in the Lok Sabha form", ["Rejected", "Lapsed", "Referred to a joint sitting"], "After fourteen days without return, the Money Bill is deemed passed in the form approved by Lok Sabha.", [C], "pol-cp011-money-bill"),
  q(9, "If Lok Sabha rejects every Rajya Sabha recommendation on a Money Bill, the Bill is deemed passed:", "In the form originally passed by Lok Sabha", ["With all Rajya Sabha changes", "Only after a joint sitting", "Only after a fresh introduction"], "Lok Sabha may reject all recommendations, leaving the Money Bill in its original Lok Sabha form.", [C], "pol-cp011-money-bill"),
  q(9, "If Lok Sabha accepts some Rajya Sabha recommendations on a Money Bill, those accepted recommendations:", "Become part of the Bill", ["Are ignored", "Need Supreme Court approval", "Require another 14-day period"], "Accepted Rajya Sabha recommendations become amendments in the Money Bill as finally deemed passed by both Houses.", [C], "pol-cp011-money-bill"),

  // QL-010 — Money Bill included matters
  q(10, "Which subject can form part of a Money Bill under Article 110?", "Imposition or alteration of a tax", ["Creation of a new State", "Election of the President", "Appointment of judges"], "Article 110 expressly includes imposing, abolishing, remitting, altering or regulating a tax within Money Bill matters.", [C], "pol-cp011-money-bill"),
  q(10, "Government of India borrowing and guarantees can fall within a:", "Money Bill", ["Constitution Amendment Bill only", "Private Member's resolution only", "Motion of thanks only"], "Regulation of Government of India borrowing or guarantees is one of the listed Article 110 Money Bill subjects.", [C], "pol-cp011-money-bill"),
  q(10, "Appropriation of money from the Consolidated Fund of India is a listed matter for a:", "Money Bill", ["No-confidence motion", "Adjournment motion", "Constitution Amendment Bill only"], "Article 110 includes appropriation from the Consolidated Fund of India among the specific Money Bill matters.", [C], "pol-cp011-money-bill"),
  q(10, "Declaring expenditure charged on the Consolidated Fund may be included in a:", "Money Bill", ["Privilege motion only", "Private resolution only", "State reorganisation Bill only"], "Declaring expenditure charged on the Consolidated Fund, or increasing it, is listed in Article 110.", [C], "pol-cp011-money-bill"),

  // QL-011 — Money Bill exclusions and certification
  q(11, "A Bill becomes a Money Bill merely because it imposes a fine:", "No", ["Yes", "Only if the fine is large", "Only if Lok Sabha votes first"], "Article 110 says a fine or other pecuniary penalty alone does not make a Bill a Money Bill.", [C], "pol-cp011-money-bill"),
  q(11, "Licence fees or fees for services alone make a Bill a Money Bill:", "No", ["Yes", "Only with President's recommendation", "Only when collected by the Union"], "A Bill is not a Money Bill merely because it provides for licence fees or service fees.", [C], "pol-cp011-money-bill"),
  q(11, "Who decides whether a Bill is a Money Bill when a question arises?", "Speaker of Lok Sabha", ["President", "Chairman of Rajya Sabha", "Finance Minister"], "Article 110 assigns the Money Bill decision to the Lok Sabha Speaker when such a question arises.", [C], "pol-cp011-money-bill"),
  q(11, "A Money Bill sent to Rajya Sabha carries whose certificate?", "Speaker of Lok Sabha", ["President", "Prime Minister", "Chairman of Rajya Sabha"], "Every Money Bill carries the Lok Sabha Speaker's signed certificate when transmitted to Rajya Sabha and the President.", [C], "pol-cp011-money-bill"),

  // QL-012 — Presidential assent
  q(12, "After Parliament passes a Bill, it is presented for assent to the:", "President", ["Prime Minister", "Chief Justice of India", "Speaker of Lok Sabha"], "Article 111 requires a Bill passed by Parliament to be presented to the President for assent.", [C, S], "pol-cp011-assent"),
  q(12, "The President may return which Bill to Parliament for reconsideration?", "A non-Money Bill", ["A Money Bill", "A Constitution Amendment Bill after assent", "An Appropriation Act"], "Article 111 allows return for reconsideration only when the Bill presented is not a Money Bill.", [C, S], "pol-cp011-assent"),
  q(12, "If Parliament passes a returned non-Money Bill again, the President:", "Cannot withhold assent", ["Must return it again", "Must call a joint sitting", "May keep returning it indefinitely"], "After reconsideration and repassage, Article 111 requires assent and removes the option to withhold it.", [C], "pol-cp011-assent"),
  q(12, "Can the President return a Money Bill to Parliament for reconsideration?", "No", ["Yes", "Only once", "Only with Rajya Sabha consent"], "A Money Bill cannot be returned for reconsideration; the President may assent or withhold assent.", [C, S], "pol-cp011-assent"),
]);
