import{ENG009_CP005_BREADTH_WAVE5}from"./eng-009-cp005-breadth-wave5";
import{ENG009_CP005_BREADTH_WAVE4}from"./eng-009-cp005-breadth-wave4";
import{ENG009_CP005_BREADTH_WAVE3}from"./eng-009-cp005-breadth-wave3";
import{ENG009_CP005_BREADTH_WAVE2}from"./eng-009-cp005-breadth-wave2";
import{ENG009_CP005_BREADTH_WAVE1}from"./eng-009-cp005-breadth-wave1";
export type Eng009Cp005Difficulty="medium"|"hard";
export type Eng009Cp005Mode="can-fit"|"cannot-fit"|"phrasal-word";
export interface Eng009Cp005BlankV1{
 id:string;blankNo:1|2|3|4|5|6;difficulty:Eng009Cp005Difficulty;mode:Eng009Cp005Mode;
 accepted:readonly string[];rejected:readonly string[];explanation:string;clue:string;
}
export interface Eng009Cp005PassageV1{
 id:string;title:string;topic:string;template:string;blanks:readonly Eng009Cp005BlankV1[];
}
const b=(id:string,blankNo:1|2|3|4|5|6,difficulty:Eng009Cp005Difficulty,mode:Eng009Cp005Mode,accepted:readonly string[],rejected:readonly string[],explanation:string,clue:string):Eng009Cp005BlankV1=>({id,blankNo,difficulty,mode,accepted,rejected,explanation,clue});

export const ENG009_CP005_PASSAGES_V1:readonly Eng009Cp005PassageV1[]=[
{
 id:"ENG009-NP-C01",title:"Why Subscription Prices Change",topic:"consumer economics",
 template:`Subscription businesses often begin with low prices to attract users, but those prices may not remain unchanged forever. As the service grows, the company may face higher content, support and technology costs. It may also add new features that increase the value of the service. A price rise can therefore be __(1)__ by genuine cost or product changes, but customers still judge whether the new price feels fair. Companies that raise prices suddenly without explanation may create frustration even when the increase is financially reasonable. Clear communication can make the change easier to understand, especially when customers are told what has changed and why. Businesses should also study whether users actually value the new features being added. A feature that looks impressive internally may not __(2)__ enough benefit to justify a higher fee. This is why pricing decisions need both financial analysis and customer evidence. Firms may test different plans, bundle features or offer annual discounts to reduce resistance. These choices can help customers find a plan that better __(3)__ their needs. However, too many plans can create confusion, particularly when the differences between them are small. Good pricing therefore requires simplicity as well as flexibility. A company should make it easy for customers to compare plans and understand what they are paying for. If the structure becomes too complex, users may suspect that complexity is being used to hide the real price. Trust is easier to maintain when prices and benefits remain __(4)__. In the long run, a sustainable subscription model must work for both sides: customers need value, and the company needs enough revenue to maintain the service. A price that is too low may attract users but damage quality later. A price that is too high may protect margins but reduce demand. The challenge is to find a level that can be __(5)__ over time. Pricing therefore is not a one-time decision but an ongoing process of adjustment. Strong businesses review usage, costs and customer response rather than assuming that the first price will remain __(6)__ forever.`,
 blanks:[
 b("N01-B1",1,"hard","cannot-fit",["justified","supported","explained"],["decorated"],"The blank needs a word meaning supported by real reasons. 'Decorated' does not fit.","price rise can therefore be ..."),
 b("N01-B2",2,"hard","can-fit",["provide","deliver","create"],["borrow"],"The feature must give customers benefit. 'Provide', 'deliver' and 'create' can fit.","feature may not ... enough benefit"),
 b("N01-B3",3,"medium","phrasal-word",["fits"],["runs","turns","breaks"],"'Fits their needs' is the natural phrase.","plan that better ... their needs"),
 b("N01-B4",4,"medium","can-fit",["clear","transparent","simple"],["silent"],"The sentence needs a word showing prices are easy to understand.","prices and benefits remain ..."),
 b("N01-B5",5,"hard","cannot-fit",["maintained","sustained","supported"],["escaped"],"The price should be possible to keep over time. 'Escaped' does not fit.","level that can be ... over time"),
 b("N01-B6",6,"medium","phrasal-word",["fixed"],["folded","thrown","broken"],"'Remain fixed' means stay unchanged.","price will remain ... forever")
 ]
},
{
 id:"ENG009-NP-C02",title:"The Value of Slow Decisions",topic:"management",
 template:`Fast decisions are useful when delay is costly, but speed is not always a sign of good judgment. Some choices involve information that is incomplete, conflicting or likely to change. In such cases, deciding immediately can create the appearance of confidence while increasing the chance of error. A short delay can sometimes improve the decision by allowing time for new evidence to arrive. This does not mean that managers should postpone every difficult choice. Delay has a cost too. The useful question is whether waiting is likely to produce information that could __(1)__ the decision. If nothing important will change, delay may simply waste time. If new information could alter the choice, waiting may be sensible. Good managers therefore distinguish between useful patience and avoidance. They also set a point at which the decision must be made, so that uncertainty does not become an excuse for endless discussion. Another useful practice is to identify which assumptions are most uncertain. Teams can then focus their effort on checking those points instead of collecting more information about things already known. This makes the decision process more __(2)__. It also reduces the risk that people keep searching only because they are uncomfortable with uncertainty. No decision can remove all uncertainty. The goal is to reduce the most important uncertainty enough to act. Strong decision-making therefore combines analysis with a clear stopping rule. Once the key questions are answered, the team should move forward rather than continue searching for perfect information. This helps prevent analysis from becoming __(3)__. At the same time, the team should remain willing to revise the decision if conditions change later. A decision can be reasonable when made and still need to change when new facts appear. This is not inconsistency; it is adaptation. Mature organisations therefore separate the quality of the original decision from the final outcome. A good decision can sometimes produce a poor result because of events that could not have been known in advance. Judging only by outcome can encourage people to avoid reasonable risks. Better evaluation asks whether the process was sound given the information available at the time. This creates a more __(4)__ learning culture. People can discuss errors without pretending that every bad outcome was predictable. The wider lesson is that speed, confidence and quality are different things. The best decision is not always the fastest one, and the slowest decision is not automatically better. Good judgment depends on knowing when more time will add value and when it will only __(5)__ action. A useful process therefore creates enough space for thought without allowing uncertainty to __(6)__ the organisation.`,
 blanks:[
 b("N02-B1",1,"hard","can-fit",["change","alter","influence"],["decorate"],"The new information must be able to affect the decision.","information that could ... the decision"),
 b("N02-B2",2,"medium","cannot-fit",["focused","efficient","disciplined"],["careless"],"The process should become more organised, not careless.","decision process more ..."),
 b("N02-B3",3,"hard","phrasal-word",["paralysis"],["motion","strength","energy"],"'Analysis paralysis' is the known phrase for overthinking that stops action.","analysis from becoming ..."),
 b("N02-B4",4,"hard","can-fit",["honest","constructive","balanced"],["secret"],"The culture should support fair learning from decisions.","more ... learning culture"),
 b("N02-B5",5,"medium","phrasal-word",["delay"],["lift","draw","build"],"'Delay action' means make action happen later.","only ... action"),
 b("N02-B6",6,"hard","cannot-fit",["freeze","paralyse","stall"],["celebrate"],"Uncertainty can stop progress; 'celebrate' cannot fit.","uncertainty to ... the organisation")
 ]
},
{
 id:"ENG009-NP-C03",title:"Why Repair Data Matters",topic:"operations",
 template:`Companies that maintain large fleets of machines often record breakdowns, but the quality of those records varies. A simple note saying that a machine failed may be enough to close a repair ticket, yet it provides little help for preventing the next failure. More useful records include the part that failed, the conditions at the time, the repair carried out and whether the same problem has happened before. When these details are collected consistently, patterns begin to emerge. A particular component may fail more often in hot conditions, or one model may require the same repair repeatedly. Such patterns can help maintenance teams __(1)__ problems before they become expensive. They can also guide decisions about spare parts and replacement schedules. However, collecting more data is useful only if the information is accurate enough to trust. Staff may stop entering details if forms are too long or difficult. This creates a trade-off between detail and practicality. The best system captures the information needed for learning without making reporting so burdensome that people avoid it. Standard categories can help because they make records easier to compare. Free-text notes still have value, but they are harder to analyse at scale. Good systems therefore combine structure with room for explanation. Another challenge is that repair records often describe what happened after failure but not the conditions before it. Sensor data can sometimes fill this gap by showing temperature, vibration or load over time. When maintenance records and operating data are combined, teams can make more __(2)__ decisions about preventive work. This does not mean every failure can be predicted. Some breakdowns will remain random or too rare to model well. The goal is to reduce avoidable failure, not to promise perfect reliability. Organisations should also review whether maintenance actions actually reduce future problems. Replacing a component more often may appear safer, but if failures do not fall, the extra work may be unnecessary. Good maintenance therefore needs evidence about both problems and solutions. Over time, the organisation can learn which actions are worth repeating and which should be changed. This makes maintenance more than a repair function; it becomes a source of operational learning. The key is to treat each breakdown as information, not only as an interruption. A repaired machine solves the immediate problem, but a well-recorded repair can also help __(3)__ the next one. That is why data quality matters. Poor records may allow the same failure to repeat without anyone recognising the pattern. Strong records create a memory for the organisation. They allow experience from one repair to be __(4)__ across many machines and teams. This is especially valuable when experienced staff leave, because knowledge remains in the system rather than disappearing with individuals. A mature maintenance programme therefore depends on both technical skill and disciplined documentation. One without the other is weaker. The long-term goal is to make maintenance increasingly __(5)__ rather than purely reactive. Better information makes this shift possible by turning repeated incidents into evidence. In this way, every repair can contribute not only to restoring equipment but also to __(6)__ future reliability.`,
 blanks:[
 b("N03-B1",1,"medium","phrasal-word",["anticipate"],["admire","borrow","divide"],"'Anticipate problems' means expect them before they happen.","help maintenance teams ... problems"),
 b("N03-B2",2,"hard","can-fit",["informed","targeted","evidence-based"],["decorative"],"The decisions should use actual evidence from records and sensors.","make more ... decisions"),
 b("N03-B3",3,"hard","cannot-fit",["prevent","reduce","avoid"],["repeat"],"The goal is to stop the next failure, not repeat it.","help ... the next one"),
 b("N03-B4",4,"medium","phrasal-word",["shared"],["hidden","lost","broken"],"'Shared across teams' means knowledge can be used widely.","experience ... can be ... across many machines"),
 b("N03-B5",5,"hard","can-fit",["predictive","preventive","proactive"],["accidental"],"The programme should move ahead of failures rather than only react after them.","maintenance increasingly ..."),
 b("N03-B6",6,"medium","cannot-fit",["improving","strengthening","supporting"],["weakening"],"The final idea is making future reliability better, not weaker.","also to ... future reliability")
 ]
},
{
 id:"ENG009-NP-C04",title:"How Trust Changes After an Error",topic:"service recovery",
 template:`Customers do not expect every service to be perfect, but they pay close attention to what happens after a failure. A delayed delivery, incorrect bill or failed transaction can damage trust, yet a clear response can prevent that damage from becoming permanent. Customers usually want three things: an honest explanation, a practical solution and a realistic time for resolution. An apology helps, but if it is repeated without action it may begin to feel __(1)__. Speed also matters, especially when money, access or an important deadline is affected. However, a quick answer that is inaccurate can make the situation worse, so staff need both urgency and reliable information.

Front-line employees should have enough authority to solve routine problems without sending every case through several layers of approval. Larger or unusual cases can still be escalated, but the boundary should be clear. Clear guidance creates a more __(2)__ experience because customers are less dependent on which employee happens to receive the complaint. It also reduces pressure on staff to invent solutions while under stress.

Good organisations do more than close individual complaints. They record recurring problems and look for patterns. If the same error appears repeatedly, the stronger response may be to repair the process rather than handle each complaint separately. Complaint data can show where training, systems or communication need the greatest __(3)__. This turns service recovery into a source of learning.

Trust is rebuilt through both words and behaviour. A customer may accept a mistake if the organisation appears honest, capable and willing to __(4)__ it. What usually damages trust most is the feeling that the organisation is ignoring, hiding or repeating the problem. A response supported by visible action is therefore more __(5)__ than a simple apology.

Service recovery should be designed before a crisis occurs. Staff need clear escalation routes, reasonable authority and access to accurate information. Preparation does not create failure; it makes failure easier to __(6)__. A well-designed recovery process helps the organisation respond calmly, treat customers fairly and learn from mistakes instead of repeating them.`,
 blanks:[
 b("N04-B1",1,"hard","cannot-fit",["empty","insincere","mechanical"],["helpful"],"An apology without action can feel empty or mechanical. 'Helpful' does not fit.","response feel ..."),
 b("N04-B2",2,"medium","can-fit",["consistent","predictable","reliable"],["random"],"Clear rules help customers receive similar treatment.","more ... experience"),
 b("N04-B3",3,"hard","phrasal-word",["impact"],["colour","shape","noise"],"'Greatest impact' means the area where improvement matters most.","greatest ..."),
 b("N04-B4",4,"medium","cannot-fit",["fix","correct","resolve"],["admire"],"The organisation must deal with the mistake, not admire it.","willing to ... it"),
 b("N04-B5",5,"hard","can-fit",["credible","meaningful","effective"],["decorative"],"Action makes the response more real and useful.","response more ... than a simple apology"),
 b("N04-B6",6,"medium","phrasal-word",["manage"],["invite","repeat","celebrate"],"'Manage failure' means handle it well when it occurs.","failure easier to ...")
 ]
},
{
 id:"ENG009-NP-C05",title:"Why Models Need Limits",topic:"analytics",
 template:`Models are useful because they simplify reality. A demand model may reduce thousands of customer decisions to a few variables, while a credit model may combine many pieces of information into one score. That makes decisions faster, but it also creates risk. A model can reflect only the relationships it was designed to capture. If conditions change or important variables are missing, it may continue producing confident-looking results that are no longer reliable.

Organisations therefore need to understand where a model works and where it does not. A model built on past behaviour may perform poorly when customer behaviour changes sharply, and a model trained on one population may not work equally well on another. These limits should be documented so users know when extra review is needed. A score can support judgment, but it should not automatically __(1)__ judgment when a case falls outside normal patterns.

Monitoring matters after deployment as well. Teams should compare predictions with actual outcomes and watch for signs that performance is weakening. Average accuracy alone can hide problems, so subgroup checks are often necessary. Clear limits and regular monitoring make reliance on the model more __(2)__.

Human oversight remains valuable because people can notice unusual context that a statistical system may miss. At the same time, a model can process patterns across more information than a person can easily hold in mind. The strongest systems combine both strengths and create a more __(3)__ decision process.

Good governance also requires traceability. When a result is challenged, teams should be able to inspect the assumptions, data and recent performance. This makes the model easier to __(4)__ when problems appear. Healthy scepticism is not a rejection of data; it is part of using data responsibly.

Model risk is therefore managed through design, testing, monitoring and revision rather than by searching for one perfect model. A useful tool remains useful because the organisation is willing to __(5)__ it when evidence changes. No model is permanently correct in a changing world. The goal is a system in which errors can be recognised, investigated and __(6)__ before they become routine.`,
 blanks:[
 b("N05-B1",1,"hard","cannot-fit",["replace","override","substitute for"],["strengthen"],"In unusual cases the model should not take the place of human judgment. 'Strengthen' does not fit that warning.","should not automatically ... judgment"),
 b("N05-B2",2,"medium","can-fit",["careful","controlled","responsible"],["blind"],"Understanding limits makes model use more careful and responsible.","reliance ... more ..."),
 b("N05-B3",3,"hard","phrasal-word",["balanced"],["one-sided","random","broken"],"'A balanced decision process' combines model evidence and human judgment.","more ... decision process"),
 b("N05-B4",4,"medium","cannot-fit",["audit","review","improve"],["worship"],"Problems should make the model easier to examine or improve, not worship.","model easier to ..."),
 b("N05-B5",5,"hard","can-fit",["revise","update","change"],["freeze"],"The organisation must be willing to change the model when evidence changes.","willing to ... it"),
 b("N05-B6",6,"medium","phrasal-word",["corrected"],["hidden","ignored","repeated"],"Good systems recognise errors and correct them.","errors can be recognised and ...")
 ]
},
{
 id:"ENG009-NP-C06",title:"Why Local Knowledge Still Matters",topic:"policy implementation",
 template:`Large organisations often create standard procedures because consistency can improve quality, simplify training and make results easier to compare. Yet strict standardisation can fail when local conditions differ sharply. A process designed for a large city may not work equally well in a remote district with fewer staff, longer travel times or weaker internet access. The challenge is to decide which parts of a process must remain standard and which can be adapted.

Local staff are usually the first to see where a rule creates unnecessary difficulty. Their experience can be valuable, but it should be collected systematically rather than only through informal complaints. Organisations can compare outcomes, identify recurring barriers and distinguish genuine local constraints from simple resistance to change. The strongest systems keep the core goal stable while allowing enough flexibility to make implementation more __(1)__.

Leaders should also explain which parts of a process can be changed locally and which require approval. Clear boundaries make local decision-making more __(2)__ because staff can explain why a variation was allowed. Without such clarity, different locations may drift in incompatible directions.

Feedback from implementation can also reveal hidden costs. A rule that appears simple at headquarters may require extra travel, repeated paperwork or long waiting times in practice. If those costs are ignored, compliance may fall even when staff support the policy's purpose. Good policy therefore treats implementation as a source of evidence.

Adaptation does not mean abandoning standards. The purpose is to make standards more __(3)__ by ensuring they can work under real conditions. A rule that cannot be followed consistently is less useful than one that protects the same objective through a workable process. Evidence may show that a policy needs to be __(4)__ rather than enforced more aggressively.

Successful local solutions should be shared so that learning does not remain isolated. Over time, this can make the organisation more __(5)__ without creating disorder. The final goal is neither complete central control nor unlimited local freedom. It is a system in which standards, feedback and judgment work together, with leaders willing to __(6)__ when evidence shows that a rule is not producing the intended result.`,
 blanks:[
 b("N06-B1",1,"medium","can-fit",["practical","workable","realistic"],["decorative"],"Local flexibility should make implementation easier in real conditions.","implementation more ..."),
 b("N06-B2",2,"hard","cannot-fit",["consistent","defensible","transparent"],["random"],"Clear boundaries should make local decisions easier to explain, not random.","decision-making more ..."),
 b("N06-B3",3,"hard","phrasal-word",["effective"],["beautiful","formal","silent"],"'More effective' means better at producing the intended result.","standards ... more ..."),
 b("N06-B4",4,"medium","can-fit",["adapted","revised","modified"],["celebrated"],"Evidence may show that the policy needs changing.","policy needs to be ..."),
 b("N06-B5",5,"hard","cannot-fit",["responsive","adaptive","resilient"],["rigid"],"Learning should make the system more able to adjust, not more rigid.","system more ... over time"),
 b("N06-B6",6,"medium","phrasal-word",["change"],["pause","complain","wait"],"'Willingness to change' fits the final idea of adapting when evidence changes.","willingness to ...")
 ]
},
{
 id:"ENG009-NP-C07",title:"Why Cash Flow Can Matter More Than Profit",topic:"business finance",
 template:`A business can report a profit and still face serious financial pressure if cash arrives later than payments are due. Profit measures whether revenue exceeds expenses over a period, while cash flow shows when money actually enters and leaves the business. The distinction matters because wages, supplier bills and loan payments must be paid on specific dates. A company may record a profitable sale today but receive the cash several weeks later.

Managers therefore monitor both profit and cash flow. A cash-flow forecast can show when large receipts and payments are expected and can warn about a shortage before it occurs. That gives the business time to arrange finance, collect invoices faster or delay non-essential spending. Understanding the cause of a shortage makes financial decisions more __(1)__ because a temporary timing problem requires a different response from a business model that consistently loses money.

Profit and cash flow answer different questions and should be used __(2)__. Profitability indicates whether the business creates value over time; cash flow shows whether it can meet immediate obligations. Borrowing may solve a short-term cash gap, but it cannot repair persistent losses.

A cash reserve can provide a useful __(3)__ against delays in customer payments or unexpected costs. However, holding too much idle cash also has a cost because that money could be invested elsewhere. The aim is not to maximise cash at all times but to maintain enough liquidity for operations and uncertainty.

This balance becomes especially important during rapid growth. Sales may rise quickly while customers still take weeks to pay, so working-capital needs can increase before cash receipts catch up. A sound cash system helps the firm remain __(4)__ while it invests for expansion.

Cash-flow management also connects daily operations with long-term strategy. A plan may look profitable on paper but still be difficult to __(5)__ if the required cash is unavailable at the right time. Managers therefore need to test the timing consequences of major decisions.

The wider lesson is simple: money promised is not the same as money received. A healthy business needs both profitability and liquidity, and one measure cannot __(6)__ the other. Looking at them together gives managers, lenders and investors a more accurate picture of financial strength.`,
 blanks:[
 b("N07-B1",1,"medium","can-fit",["informed","targeted","appropriate"],["decorative"],"Knowing the cause makes decisions better informed.","financial decisions more ..."),
 b("N07-B2",2,"hard","cannot-fit",["together","jointly","side by side"],["separately"],"Profit and cash flow should be used together, not separately.","should be used ..."),
 b("N07-B3",3,"hard","phrasal-word",["buffer"],["colour","weight","noise"],"'A buffer against risk' means protection from temporary shocks.","form of ... against timing risk"),
 b("N07-B4",4,"medium","can-fit",["liquid","stable","solvent"],["silent"],"The business needs enough cash to remain financially secure.","remain ... while still investing"),
 b("N07-B5",5,"hard","cannot-fit",["execute","implement","finance"],["admire"],"A strategy must be carried out or financed. 'Admire' does not fit.","strategy may be difficult to ..."),
 b("N07-B6",6,"medium","phrasal-word",["replace"],["decorate","invite","copy"],"One measure cannot replace the other.","assuming one can ... the other")
 ]
},
{
 id:"ENG009-NP-C08",title:"Why Simple Rules Can Work Better",topic:"behavioural design",
 template:`Organisations often respond to mistakes by adding more rules. The logic seems reasonable: if one control failed, another control may prevent the same problem. Over time, however, procedures can become so detailed that employees struggle to remember which rule applies. Complexity can then create new errors. A short checklist focused on critical steps may be more useful than a long checklist that people stop reading.

This does not mean important safeguards should be removed. It means rules should be designed around the behaviour they need to produce. A useful rule is clear, relevant and easy to follow under real working conditions. If a procedure requires repeated data entry or approval for minor actions, staff may begin to find shortcuts. Those shortcuts can indicate poor training, but they can also reveal a badly designed process.

Good systems reduce unnecessary effort while preserving important controls. Warnings are most useful when they appear before a risky action rather than after an error. Safe defaults can also make the easiest action the correct one. These choices reduce the amount of memory and attention required from employees, making rules more __(1)__ in real conditions.

Simplification should still be evidence-based. Removing a step may save time, but if errors rise, that step may have been doing useful work. The aim is not fewer rules for their own sake; it is better rules. Good design makes the path to compliance clearer and more __(2)__.

Every extra step should therefore have a reason. If a rule adds effort without reducing risk, it may deserve to be __(3)__. If it protects against a serious failure, it should remain even when it is inconvenient. This requires judgment rather than a simple preference for either more or fewer controls.

Clear priorities also make compliant behaviour easier to __(4)__ over time because employees know which actions matter most. Training and monitoring can then focus on the highest-risk points. A simple rule can be powerful when it directs attention to the right action at the right time.

The best procedures reduce cognitive load while preserving essential protections. That makes a system easier to follow and harder to __(5)__. Ultimately, a written rule works only if people can use it consistently. Good policy therefore considers human behaviour from the beginning rather than assuming instructions will automatically be __(6)__.`,
 blanks:[
 b("N08-B1",1,"hard","can-fit",["robust","reliable","effective"],["decorative"],"Good rules should still work under real pressure.","rules more ... in real conditions"),
 b("N08-B2",2,"medium","cannot-fit",["direct","usable","consistent"],["confusing"],"The path should become clearer, not confusing.","path ... more ..."),
 b("N08-B3",3,"hard","phrasal-word",["removed"],["painted","admired","celebrated"],"A useless rule may deserve to be removed.","deserve to be ..."),
 b("N08-B4",4,"medium","can-fit",["maintain","sustain","repeat"],["hide"],"Clear priorities make compliant behaviour easier to maintain, sustain or repeat over time.","compliant behaviour becomes easier to ..."),
 b("N08-B5",5,"hard","cannot-fit",["misuse","ignore","bypass"],["understand"],"A good system should be harder to misuse or bypass. 'Understand' is the opposite.","harder to ..."),
 b("N08-B6",6,"medium","phrasal-word",["followed"],["forgotten","hidden","broken"],"Written instructions matter only if people can follow them.","instructions will automatically be ...")
 ]
}
,
...ENG009_CP005_BREADTH_WAVE1
,
...ENG009_CP005_BREADTH_WAVE2
,
...ENG009_CP005_BREADTH_WAVE3
,
...ENG009_CP005_BREADTH_WAVE4
,
...ENG009_CP005_BREADTH_WAVE5
];

export const ENG009_CP005_BLANKS_V1=ENG009_CP005_PASSAGES_V1.flatMap(p=>p.blanks.map(blank=>({passage:p,blank})));
