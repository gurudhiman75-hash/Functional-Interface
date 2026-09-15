import type { PolCp011ReviewQuestion } from "./pol-cp011-review-types";
import { generatePolCp011ReviewBatchV1 } from "./pol-cp011-review-generator-v1";

const DETAILS: readonly string[] = Object.freeze([
  "It is the starting Article for ordinary legislative procedure.",
  "Use it when the two Houses reach a qualifying deadlock.",
  "This is why Money Bills follow a different path from ordinary Bills.",
  "The definition matters because only listed financial subjects qualify.",
  "This is the constitutional foundation of the Union Budget statement.",
  "The key exam distinction is discussion versus voting of expenditure.",
  "Without appropriation by law, withdrawal from the Fund is not authorised.",
  "These three grants serve different kinds of temporary or unusual needs.",
  "Money Bills are the major exception to the either-House rule.",
  "Agreement must be on the same text before assent.",
  "The classification depends on who introduces the Bill.",
  "A non-Minister MP can introduce this type of Bill.",
  "Prorogation ends a session, but the Bill itself survives.",
  "The Bill survives because Lok Sabha has not yet passed it.",
  "Dissolution ends the existing Lok Sabha, so its pending Bill falls.",
  "This differs from a Bill pending only in Rajya Sabha.",
  "Rejection is one of three Article 108 deadlock situations.",
  "A final amendment dispute can also trigger the mechanism.",
  "The delay ground is calculated with specific excluded periods.",
  "The President notifies the intention; the Speaker normally presides later.",
  "Rajya Sabha's special 14-day role replaces any joint-sitting solution.",
  "Both Houses must separately pass a constitutional amendment with the required majority.",
  "The Vice-President does not preside merely because he chairs Rajya Sabha.",
  "The majority is not based on total membership of both Houses.",
  "This prevents inactive session time from unfairly creating a deadlock.",
  "Only adjournments longer than four consecutive days are excluded.",
  "The clock starts only after the second House receives the Bill.",
  "The Bill then moves to the joint-sitting route instead of separate action.",
  "This is a core difference between Money Bills and ordinary Bills.",
  "Rajya Sabha can suggest changes but cannot insist on them.",
  "Lok Sabha has the final say on every recommendation.",
  "Rajya Sabha is not asked for equal approval under Article 109.",
  "The period runs from the date Rajya Sabha receives the Bill.",
  "No separate rejection motion or joint sitting is needed after that.",
  "The original Lok Sabha text can therefore prevail unchanged.",
  "Only the recommendations accepted by Lok Sabha alter the final text.",
  "Tax provisions are among the clearest Article 110 Money Bill subjects.",
  "Borrowing matters qualify only when they fall within Article 110's listed scope.",
  "This links Money Bills directly with authorised use of the Consolidated Fund.",
  "The rule covers both declaring charged expenditure and increasing it.",
  "Fines and penalties are specifically excluded from the automatic Money Bill test.",
  "These fees alone are not enough to satisfy Article 110.",
  "For constitutional exam questions, the Speaker's decision is the key authority.",
  "The certificate travels with the Bill to show its Money Bill status.",
  "Presidential assent comes only after the parliamentary passage stage is complete.",
  "The return power is therefore unavailable for a Money Bill.",
  "Repassing closes the reconsideration stage and makes assent compulsory.",
  "The President cannot send a Money Bill back with suggested changes.",
  "The readings describe stages of consideration, not three separate Bills.",
  "At this stage the House takes the Bill into its formal legislative process.",
  "This is where clauses and proposed amendments receive detailed scrutiny.",
  "The third reading focuses on final approval rather than detailed redrafting.",
  "The President causes presentation, while Parliament examines the financial proposals.",
  "Both Houses receive it, but their later financial powers are not identical.",
  "It is an annual statement, not a multi-year spending authorisation.",
  "This separation helps distinguish revenue-account expenditure in the estimates.",
  "Charged expenditure is protected from voting, not from parliamentary discussion.",
  "That distinction is frequently tested: discussion is allowed, voting is not.",
  "Debt charges are constitutionally listed rather than treated as voted demands.",
  "These presiding-officer payments do not depend on a demand-for-grant vote.",
  "This is one reason Lok Sabha has the stronger role in financial control.",
  "A reduction may be used to express policy, economy or grievance concerns.",
  "The recommendation is required before the demand is formally made.",
  "Rajya Sabha may discuss financial matters but does not vote on these demands.",
  "The grant vote comes first; appropriation gives legal authority to withdraw funds.",
  "Approval of grants alone does not authorise withdrawal from the Consolidated Fund.",
  "Parliament cannot reopen the voted amount through an Appropriation Bill amendment.",
  "This turns the approved expenditure into legally withdrawable money.",
  "It adds money to an existing service whose original provision is insufficient.",
  "It covers a genuinely new service omitted from the original statement.",
  "It regularises overspending that has already occurred, unlike a supplementary grant.",
  "The timing differs: supplementary or additional needs arise before spending; excess follows overspending.",
  "It is temporary financing, not final approval of the whole year's demands.",
  "Its purpose is flexibility when exact expenditure details cannot yet be stated.",
  "It is separate from routine annual service expenditure.",
  "All three still operate within the wider grant and appropriation system.",
  "The Re. 1 amount signals policy disapproval rather than a literal funding plan.",
  "The member states the exact saving proposed through the specified reduction.",
  "The Rs. 100 reduction is symbolic and highlights a specific grievance.",
  "Its purpose is to finish pending grant voting when allotted discussion time ends.",
  "Such a Bill must begin in Lok Sabha because of the listed financial content.",
  "The recommendation is a constitutional precondition to introduction.",
  "Reducing or abolishing a tax is the express exception to that recommendation rule.",
  "Here the recommendation concerns consideration before passage, not necessarily introduction.",
  "The trap is that Rajya Sabha may recommend, but cannot block a Money Bill indefinitely.",
  "Dissolution and prorogation have different effects; Money Bill origin is another separate rule.",
  "This shows why financial discussion and financial voting must not be confused.",
  "The timing is the key distinction: advance funding versus later regularisation.",
]);

export function generatePolCp011ReviewBatchV2(): PolCp011ReviewQuestion[] {
  const base = generatePolCp011ReviewBatchV1();
  if (DETAILS.length !== base.length) throw new Error(`Expected ${base.length} V2 details, got ${DETAILS.length}`);

  const questions = base.map((q, index): PolCp011ReviewQuestion => ({
    ...q,
    questionId: `POL-CP011-V2-${String(index + 1).padStart(3, "0")}`,
    explanation: `${q.explanation} ${DETAILS[index]}`,
  }));

  if (new Set(questions.map(q => q.explanation)).size !== questions.length) throw new Error("Repeated explanation in POL-CP-011 V2");

  for (const q of questions) {
    if (q.options[q.correctIndex] !== q.canonicalAnswer) throw new Error(`Answer mismatch: ${q.questionId}`);
    const words = q.explanation.trim().split(/\s+/).length;
    if (words < 18 || words > 32) throw new Error(`Explanation length ${q.questionId}: ${words}`);
    if (/Correct answer:|This is the exact|nearby Articles|Match the topic|Remember the word/i.test(q.explanation)) {
      throw new Error(`Generic explanation clutter: ${q.questionId}`);
    }
  }

  return questions;
}
