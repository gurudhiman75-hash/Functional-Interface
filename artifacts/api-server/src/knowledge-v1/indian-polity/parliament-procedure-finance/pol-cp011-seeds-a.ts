import type { PolCp011Seed } from "./pol-cp011-review-seed-types";

const C = "LEGISLATIVE-DEPT-CONSTITUTION-2025";
const S = "DIGITAL-SANSAD-LEGISLATION-INTRO";
const F = "DIGITAL-SANSAD-LOK-SABHA-FAQ";

const q = (ql: number, stem: string, canonicalAnswer: string, distractors: [string, string, string], explanation: string, sourceIds: string[] = [C], fact = "pol-cp011-core"): PolCp011Seed => ({
  qlId: `POL-011-QL-${String(ql).padStart(3, "0")}`,
  difficulty: "Easy",
  stem,
  canonicalAnswer,
  distractors,
  explanation,
  sourceIds,
  sourceFactIds: [fact],
});

export const POL_CP011_SEEDS_A: readonly PolCp011Seed[] = Object.freeze([
  // QL-001 — Article map: legislative procedure
  q(1, "Article 107 mainly deals with:", "Introduction and passing of Bills", ["Joint sitting of both Houses", "Money Bill definition", "President's assent to Bills"], "Article 107 gives the basic rules for introducing, passing and lapsing of Bills in Parliament.", [C], "pol-cp011-art107"),
  q(1, "Article 108 deals with:", "Joint sitting of both Houses", ["Money Bill definition", "Annual Financial Statement", "Appropriation Bills"], "Article 108 provides a joint sitting mechanism for certain deadlocks between Lok Sabha and Rajya Sabha.", [C], "pol-cp011-art108"),
  q(1, "Special procedure for Money Bills is under:", "Article 109", ["Article 107", "Article 110", "Article 111"], "Article 109 explains Lok Sabha's primary role and Rajya Sabha's recommendation period for a Money Bill.", [C], "pol-cp011-art109"),
  q(1, "The constitutional definition of a Money Bill is in:", "Article 110", ["Article 108", "Article 109", "Article 112"], "Article 110 lists the matters a Bill may contain to qualify constitutionally as a Money Bill.", [C], "pol-cp011-art110"),

  // QL-002 — Article map: financial procedure
  q(2, "The Annual Financial Statement is provided under:", "Article 112", ["Article 110", "Article 113", "Article 114"], "Article 112 requires the President to cause the Annual Financial Statement to be laid before both Houses.", [C], "pol-cp011-art112"),
  q(2, "Demands for grants are mainly governed by:", "Article 113", ["Article 111", "Article 114", "Article 116"], "Article 113 separates charged expenditure from demands for grants and gives Lok Sabha the voting role.", [C], "pol-cp011-art113"),
  q(2, "Appropriation Bills are dealt with in:", "Article 114", ["Article 112", "Article 115", "Article 117"], "Article 114 provides the law needed to withdraw money from the Consolidated Fund for authorised expenditure.", [C], "pol-cp011-art114"),
  q(2, "Vote on account, vote of credit and exceptional grants are under:", "Article 116", ["Article 113", "Article 114", "Article 117"], "Article 116 creates three special grant mechanisms for advance, unexpected or exceptional financial needs.", [C], "pol-cp011-art116"),

  // QL-003 — Ordinary Bill basics
  q(3, "An ordinary Bill may normally be introduced in:", "Either House of Parliament", ["Lok Sabha only", "Rajya Sabha only", "A joint sitting only"], "Article 107 allows an ordinary Bill to originate in either House, unlike a Money Bill.", [C], "pol-cp011-ordinary-bills"),
  q(3, "An ordinary Bill is normally passed only when it is agreed to by:", "Both Houses", ["Lok Sabha alone", "Rajya Sabha alone", "The President before Parliament"], "Except where special provisions apply, both Houses must agree to the Bill in the same form.", [C], "pol-cp011-ordinary-bills"),
  q(3, "A Bill introduced by a Minister is called a:", "Government Bill", ["Private Member's Bill", "Money Bill", "Appropriation Bill"], "Digital Sansad describes a Bill introduced by a Minister as a Government Bill.", [S], "pol-cp011-bill-stages"),
  q(3, "A Bill introduced by a member who is not a Minister is a:", "Private Member's Bill", ["Government Bill", "Money Bill", "Financial Bill"], "A member other than a Minister introduces a Private Member's Bill, not a Government Bill.", [S], "pol-cp011-bill-stages"),

  // QL-004 — Lapse and prorogation
  q(4, "A Bill pending in Parliament lapses merely because the Houses are prorogued:", "No", ["Yes", "Only in Lok Sabha", "Only in Rajya Sabha"], "Article 107 clearly says prorogation by itself does not cause a pending Bill to lapse.", [C], "pol-cp011-ordinary-bills"),
  q(4, "A Bill pending in Rajya Sabha but not passed by Lok Sabha lapses when Lok Sabha is dissolved:", "No", ["Yes", "Only after six months", "Only if the President directs"], "A Bill pending only in Rajya Sabha does not lapse merely because Lok Sabha is dissolved.", [C], "pol-cp011-ordinary-bills"),
  q(4, "A Bill pending in Lok Sabha normally lapses when Lok Sabha is:", "Dissolved", ["Prorogued", "Adjourned", "Summoned"], "Article 107 makes dissolution, not prorogation or adjournment, the important event for a Bill pending in Lok Sabha.", [C], "pol-cp011-ordinary-bills"),
  q(4, "A Bill passed by Lok Sabha but pending in Rajya Sabha normally lapses on:", "Dissolution of Lok Sabha", ["Prorogation of Rajya Sabha", "Adjournment of Lok Sabha", "President's annual address"], "A Lok Sabha-passed Bill pending in Rajya Sabha normally lapses when Lok Sabha is dissolved, subject to Article 108.", [C], "pol-cp011-ordinary-bills"),

  // QL-005 — Joint sitting triggers
  q(5, "A joint sitting may be considered when the other House:", "Rejects the Bill", ["Prorogues for one day", "Discusses the Bill", "Refers the Bill to a committee"], "Rejection by the second House is one of the constitutional deadlocks that can lead to a joint sitting.", [C], "pol-cp011-joint-sitting"),
  q(5, "Final disagreement between the Houses over amendments may lead to a:", "Joint sitting", ["Money Bill certificate", "New general election", "Supreme Court reference"], "Article 108 includes final disagreement over amendments as a ground for a joint sitting.", [C], "pol-cp011-joint-sitting"),
  q(5, "If the second House does not pass a Bill for more than six months, Article 108 may allow a:", "Joint sitting", ["Money Bill procedure", "Constitutional amendment by decree", "Presidential veto"], "Delay beyond the constitutional six-month period can create the third type of deadlock under Article 108.", [C], "pol-cp011-joint-sitting"),
  q(5, "Who notifies the intention to summon a joint sitting under Article 108?", "President", ["Prime Minister", "Speaker of Lok Sabha", "Chairman of Rajya Sabha"], "Article 108 gives the President the formal role of notifying the Houses about the intended joint sitting.", [C], "pol-cp011-joint-sitting"),

  // QL-006 — Joint sitting exclusions and chair
  q(6, "A Money Bill can be referred to a joint sitting of Parliament:", "No", ["Yes", "Only after 14 days", "Only if Rajya Sabha rejects it"], "Article 108 expressly excludes Money Bills because Article 109 already gives them a separate procedure.", [C, S], "pol-cp011-joint-sitting"),
  q(6, "A Constitution Amendment Bill can be resolved through a joint sitting:", "No", ["Yes", "Only with President's approval", "Only after six months"], "Constitution Amendment Bills must be passed separately by both Houses, so a joint sitting cannot cure disagreement.", [C, S], "pol-cp011-joint-sitting"),
  q(6, "Who normally presides over a joint sitting of Parliament?", "Speaker of Lok Sabha", ["Vice-President", "President", "Prime Minister"], "The official Lok Sabha FAQ states that the Speaker of Lok Sabha presides over a joint sitting.", [F], "pol-cp011-joint-sitting"),
  q(6, "At a joint sitting, a Bill is passed by a majority of members of both Houses:", "Present and voting", ["Total membership", "Present whether voting or not", "Elected members only"], "Article 108 uses the majority of the total number of members of both Houses present and voting.", [C], "pol-cp011-joint-sitting"),
]);
