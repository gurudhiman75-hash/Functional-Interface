import{ENG010_BREADTH_WAVE4_V1}from"./eng-010-breadth-wave4";
import{ENG010_BREADTH_WAVE3_V1}from"./eng-010-breadth-wave3";
import{ENG010_BREADTH_WAVE2_V1}from"./eng-010-breadth-wave2";
import{ENG010_BREADTH_WAVE1_V1}from"./eng-010-breadth-wave1";
export type Eng010CpId="ENG-010-CP001"|"ENG-010-CP002"|"ENG-010-CP003"|"ENG-010-CP004";
export type Eng010Difficulty="easy"|"medium"|"hard";
export interface Eng010SetV1{ id:string; cpId:Eng010CpId; difficulty:Eng010Difficulty; topic:string; sentences:readonly string[]; order:readonly number[]; explanation:string; }
const s=(id:string,cpId:Eng010CpId,difficulty:Eng010Difficulty,topic:string,sentences:string[],order:number[],explanation:string):Eng010SetV1=>({id,cpId,difficulty,topic,sentences,order,explanation});
export const ENG010_SETS_V1:readonly Eng010SetV1[]=[
s("PJ-SSC-S01","ENG-010-CP001","easy","urban trees",[
"These trees also provide shade during the hottest part of the day.",
"Cities often plant trees along roads and in public spaces.",
"Regular watering is especially important during the first few years.",
"Once established, many trees can survive with less care.",
"However, young trees need attention before they become strong."
],[2,1,5,3,4],"Sentence 2 introduces the topic. Sentence 1 adds a benefit. Sentence 5 creates the contrast, followed by the care needed in 3 and the result in 4."),
s("PJ-SSC-S02","ENG-010-CP001","easy","library membership",[
"After registration, members can borrow books for a fixed period.",
"A public library may ask new users to complete a simple membership form.",
"This helps the library keep accurate borrowing records.",
"The form usually asks for basic contact details.",
"Members must then return or renew books by the due date."
],[2,4,3,1,5],"Sentence 2 introduces registration. Sentence 4 explains the form, 3 gives its purpose, 1 moves to borrowing, and 5 completes the process."),
s("PJ-SSC-S03","ENG-010-CP001","medium","rainwater harvesting",[
"The stored water can later be used for gardening or cleaning.",
"Rainwater harvesting collects water that falls on roofs or other surfaces.",
"Before storage, leaves and dirt should be filtered out.",
"This reduces the demand for treated water for some household uses.",
"The collected water is then directed into a storage tank."
],[2,5,3,1,4],"Sentence 2 defines the process. Sentence 5 moves water to storage, 3 adds filtration, 1 explains use, and 4 gives the benefit."),
s("PJ-SSC-S04","ENG-010-CP001","medium","school clubs",[
"This gives students a chance to practise skills outside regular lessons.",
"Many schools organise clubs for activities such as science, debate or music.",
"Regular meetings also help members learn to work as a team.",
"Students usually choose a club according to their interests.",
"As a result, clubs can support both confidence and cooperation."
],[2,4,1,3,5],"Sentence 2 introduces clubs. Sentence 4 explains choice, 1 gives the immediate benefit, 3 adds teamwork, and 5 concludes."),

s("PJ-SSC-A01","ENG-010-CP002","medium","public transport",[
"Yet frequency alone does not guarantee a useful service.",
"A bus route may look adequate on a map because it covers many neighbourhoods.",
"Passengers also need stops that are easy to reach and reliable information about arrival times.",
"If buses come rarely, however, many people may still avoid the route.",
"Service quality therefore depends on how coverage, frequency and access work together.",
"For this reason, planners must examine the whole journey rather than route length alone."
],[2,4,1,3,5,6],"Sentence 2 introduces the apparent strength. Sentence 4 gives the limitation, 1 broadens it, 3 adds other needs, 5 combines them, and 6 concludes."),
s("PJ-SSC-A02","ENG-010-CP002","hard","measurement",[
"This can produce a neat number without producing a useful conclusion.",
"Managers often prefer a single metric because it is easy to compare over time.",
"A measure may improve even while an important part of performance becomes worse.",
"The problem arises when the metric is treated as the goal itself.",
"For that reason, a strong review uses the metric as evidence rather than as the entire judgment.",
"Numbers are valuable, but they still need context."
],[2,4,1,3,6,5],"Sentence 2 introduces reliance on one metric. Sentence 4 identifies the problem, 1 gives the consequence, 3 gives an example, 6 states the principle, and 5 concludes."),
s("PJ-SSC-A03","ENG-010-CP002","hard","maintenance",[
"By then, the repair may be more expensive than the earlier preventive work.",
"Preventive maintenance is easy to postpone because nothing appears to be wrong.",
"Small signs of wear can therefore remain unnoticed until a part fails.",
"However, the absence of a breakdown does not mean that equipment needs no attention.",
"A planned inspection can identify wear before it interrupts operations.",
"This is why maintenance schedules focus on risk rather than visible failure alone."
],[2,4,3,1,5,6],"Sentence 2 introduces the temptation to postpone. Sentence 4 corrects that assumption, 3 shows the consequence, 1 raises its cost, 5 offers the solution, and 6 concludes."),
s("PJ-SSC-A04","ENG-010-CP002","medium","consumer choice",[
"Too many similar options can make comparison harder rather than easier.",
"Choice is often assumed to benefit consumers because it increases freedom.",
"Clear categories and useful defaults can reduce this burden.",
"However, the value of choice depends partly on how easily options can be understood.",
"Consumers may spend more time comparing small differences and still feel uncertain.",
"Good design therefore supports choice without making every decision unnecessarily complex."
],[2,4,1,5,3,6],"Sentence 2 introduces the positive view. Sentence 4 qualifies it, 1 and 5 explain the problem, 3 gives a remedy, and 6 concludes."),

s("PJ-BP-S01","ENG-010-CP003","medium","digital payments",[
"This reduces the need for the customer to visit a branch for routine payments.",
"Mobile banking allows customers to transfer money and pay bills remotely.",
"Security still depends on protecting passwords and one-time codes.",
"Convenience, therefore, must be supported by safe user behaviour.",
"However, easier access does not remove the need for caution."
],[2,1,5,3,4],"Sentence 2 introduces mobile banking, 1 gives the benefit, 5 creates the contrast, 3 states the security need, and 4 concludes."),
s("PJ-BP-S02","ENG-010-CP003","medium","credit history",[
"A strong record can make future borrowing easier to assess.",
"Lenders often review past repayment behaviour when evaluating a loan application.",
"Late payments may therefore affect more than one transaction.",
"This history gives the lender evidence about how earlier obligations were handled.",
"For borrowers, regular repayment helps build a more reliable financial record."
],[2,4,1,3,5],"Sentence 2 introduces lender review, 4 explains the evidence, 1 gives its effect, 3 warns about late payments, and 5 concludes from the borrower side."),
s("PJ-BP-S03","ENG-010-CP003","hard","inventory finance",[
"If stock moves slowly, money may remain tied up for much longer than expected.",
"Businesses often need to buy inventory before they receive cash from customers.",
"This is why inventory decisions affect both sales and working capital.",
"Fast-moving stock may convert back into cash quickly.",
"The timing gap can create a need for short-term finance."
],[2,5,4,1,3],"Sentence 2 introduces the cash timing issue, 5 explains the financing need, 4 contrasts fast-moving stock, 1 gives the slow-moving case, and 3 concludes."),
s("PJ-BP-S04","ENG-010-CP003","hard","customer service",[
"A quick reply is useful only if it actually addresses the customer's problem.",
"Many service teams track response time because customers dislike long waits.",
"Quality and speed should therefore be measured together.",
"A fast but incomplete answer may simply create another contact later.",
"For this reason, response time alone can give a misleading picture of service quality."
],[2,1,4,5,3],"Sentence 2 introduces the metric, 1 qualifies speed, 4 gives the consequence of poor quality, 5 explains the measurement problem, and 3 concludes."),

s("PJ-BM-S01","ENG-010-CP004","hard","bank liquidity",[
"This mismatch is manageable in normal conditions but can become important during sudden withdrawals.",
"Banks accept deposits that customers may withdraw while also making loans that are repaid over longer periods.",
"For this reason, liquidity management focuses on both available cash and reliable funding sources.",
"The two sides of the balance sheet therefore operate on different time horizons.",
"Holding too much idle cash is costly, while holding too little can create vulnerability.",
"A sound framework balances these competing pressures rather than maximising one measure."
],[2,4,1,5,3,6],"Sentence 2 introduces deposits and loans, 4 states the maturity mismatch, 1 explains when it matters, 5 gives the trade-off, 3 names the management response, and 6 concludes."),
s("PJ-BM-S02","ENG-010-CP004","hard","automation",[
"Human review is therefore most valuable where consequences are high or the data is unusual.",
"Automated systems can process routine decisions faster and more consistently than manual workflows.",
"The strongest design does not choose between people and automation in absolute terms.",
"However, a rule that works well for common cases may fail when an unusual situation appears.",
"This creates a need for clear escalation rather than silent reliance on the model.",
"Instead, it assigns each task to the method best suited to its risk and complexity."
],[2,4,5,1,3,6],"Sentence 2 introduces automation's strength. Sentence 4 gives the exception, 5 explains escalation, 1 identifies where human review matters, and 3-6 provide the conclusion."),
s("PJ-BM-S03","ENG-010-CP004","medium","policy evaluation",[
"Without that comparison, an observed improvement may be wrongly attributed to the programme.",
"A policy can be followed by better outcomes without necessarily causing them.",
"Evaluation therefore asks what would probably have happened in the absence of the policy.",
"Other economic or social changes may have influenced the same outcome.",
"This counterfactual is difficult to observe directly, so analysts use comparison groups or other methods.",
"The aim is to separate the effect of the policy from changes that would have happened anyway."
],[2,4,1,3,5,6],"Sentence 2 introduces the causation issue, 4 supplies alternative causes, 1 states the attribution risk, 3 defines the counterfactual, 5 explains estimation, and 6 concludes."),
s("PJ-BM-S04","ENG-010-CP004","hard","data governance",[
"Giving every employee access to all available data may seem efficient but increases risk.",
"Organisations collect data because it can improve decisions, services and reporting.",
"Access should instead reflect what a person needs for a legitimate task.",
"The value of data therefore depends partly on how responsibly it is controlled.",
"Good governance also records who changed or downloaded sensitive information.",
"This creates accountability without preventing useful access."
],[2,4,1,3,5,6],"Sentence 2 introduces the value of data, 4 adds the governance condition, 1 presents the risk, 3 gives the principle, 5 adds auditability, and 6 concludes.")
,
...ENG010_BREADTH_WAVE1_V1
,
...ENG010_BREADTH_WAVE2_V1
,
...ENG010_BREADTH_WAVE3_V1
,
...ENG010_BREADTH_WAVE4_V1
];
export const ENG010_CP_IDS_V1=["ENG-010-CP001","ENG-010-CP002","ENG-010-CP003","ENG-010-CP004","ENG-010-CP005"] as const;
