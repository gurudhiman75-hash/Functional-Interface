import type{Eng008Cp002PassageV1}from"./eng-008-cp002-authorities-v1";
const q=(id:string,familyId:any,difficulty:any,question:string,correctAnswer:string,distractors:readonly[string,string,string],explanation:string,evidence:string)=>({id,familyId,difficulty,question,correctAnswer,distractors,explanation,evidence});
export const ENG008_CP002_EXPANSION_WAVE12_V1:readonly Eng008Cp002PassageV1[]=[
{
 id:"ENG008-RC2-E36",title:"Renewal Reminders Should Arrive Before Commitment",genre:"editorial",
 text:`Automatic renewal can make subscriptions convenient. A user does not have to re-enter payment details each month or risk losing access by forgetting a deadline. The same design can become unfair, however, when renewal occurs before the user has a reasonable chance to reconsider.

A useful reminder should arrive before the payment becomes difficult to stop. Sending a message after the charge is technically informative but does little to support choice.

The reminder should also state what will happen: the renewal date, the amount, any price change and the easiest way to cancel or modify the plan.

Timing matters because not every subscription has the same consequence. A small monthly charge may need a short notice period, while an annual plan renewing at a much higher amount deserves more warning.

The message should not be hidden inside promotional email. A renewal reminder has a different purpose from marketing and should be recognisable as account information.

Users also benefit when the system shows whether cancellation affects current access or only the next billing period. Fear of losing service immediately can make people postpone a decision.

Automatic renewal is not inherently deceptive. The problem arises when convenience for the provider replaces informed choice for the customer.

A fair system therefore treats the reminder as part of the transaction itself, not as an optional courtesy sent after the commitment has already been made.`,
 questions:[
 q("E36-Q1","RC2-F01","easy","When should a renewal reminder ideally arrive?","Before the user becomes committed to the new payment",["Only after the charge","After the subscription ends","Only when the user complains"],"The passage argues that notice should support a real chance to reconsider before payment becomes difficult to stop.","before the payment becomes difficult to stop"),
 q("E36-Q2","RC2-F02","medium","What can be inferred about annual subscriptions?","They may justify earlier notice because the financial consequence can be larger",["They should never renew automatically","They need no reminder","They always cost less"],"The author links notice timing to the size and consequence of the renewal.","annual plan ... deserves more warning"),
 q("E36-Q3","RC2-F03","medium","Which summary is most accurate?","Automatic renewal can be convenient if users receive timely, clear and actionable notice",["Automatic renewal should be banned","Marketing emails are sufficient notice","Cancellation should end access immediately"],"The passage supports renewal while requiring meaningful pre-commitment information.","not inherently deceptive"),
 q("E36-Q4","RC2-F04","hard","What is the author's tone?","Consumer-focused and balanced",["Promotional","Hostile to subscriptions","Humorous"],"The author recognises convenience while criticising opaque or late reminders.","can make subscriptions convenient"),
 q("E36-Q5","RC2-F05","medium","Why should renewal reminders be separated from promotional email?","Account information can otherwise be overlooked among marketing messages",["Marketing emails cannot contain dates","Promotions are illegal","Users never open email"],"The passage says the two message types serve different purposes and should be recognisable.","different purpose"),
 q("E36-Q6","RC2-F06","hard","Which conclusion follows most logically?","A reminder sent after an unavoidable charge may satisfy disclosure without supporting meaningful choice",["Every post-charge message is fraudulent","Users should ignore reminders","Annual plans should have no cancellation"],"The passage distinguishes merely informing users from giving them time to act.","technically informative but"),
 q("E36-Q7","RC2-F07","medium","Which statement is supported?","A useful reminder should include the amount and renewal date",["Price changes should be hidden","Current access must end on cancellation","All plans require the same notice period"],"The passage explicitly lists date, amount, price change and action path as useful information.","renewal date, the amount"),
 q("E36-Q8","RC2-F08","easy","In context, “commitment” most nearly means:","the point at which the user is bound to the renewal",["a marketing slogan","a temporary password","a trial period"],"The passage uses commitment for the point when payment can no longer reasonably be avoided.","commitment")
 ]
},
{
 id:"ENG008-RC2-E37",title:"Waitlists Should Show What Can Change",genre:"editorial",
 text:`A waitlist number can reassure people that a system has not forgotten them. It can also mislead if the number appears to promise a fixed order when the underlying service uses priority rules.

A housing programme may prioritise emergency cases. A medical service may move urgent patients ahead. A training course may reserve some places for different eligibility groups.

In such systems, “you are number 18” does not necessarily mean exactly seventeen people must be served first.

A better waitlist explains the category, the main priority rules and whether the displayed position is approximate.

Estimated waiting time should be handled carefully too. If service capacity changes from week to week, a precise date may create confidence that the programme cannot justify.

This does not mean users should receive no information. Silence creates uncertainty of its own.

A useful system can show broad position bands, recent movement and factors that may change the sequence. “High-priority cases may be placed ahead” is more informative than quietly allowing the order to move.

The design challenge is to communicate uncertainty without making the system feel arbitrary.

A transparent waitlist therefore explains both the ordinary order and the recognised exceptions. People may still dislike waiting, but they are better able to understand why the sequence can change.  Clear rules make movement easier to interpret.`,
 questions:[
 q("E37-Q1","RC2-F01","easy","Why can a waitlist number be misleading?","Priority rules can change the actual service order",["Numbers cannot be updated","Every service uses random order","Waitlists always have one person"],"The passage explains that urgent or category-based cases may move ahead of a simple numerical position.","priority rules"),
 q("E37-Q2","RC2-F02","medium","What can be inferred about exact waiting dates?","They can create false certainty when capacity changes",["They are always required","They never change","They improve service capacity"],"A precise date is weak if the system cannot predict future throughput reliably.","service capacity changes"),
 q("E37-Q3","RC2-F03","medium","Which summary is most accurate?","Waitlists should communicate order, exceptions and uncertainty rather than only one number",["Waitlists should be hidden","Priority rules should be removed","Users need exact dates only"],"The article favours transparency about both the normal sequence and recognised reasons it can change.","ordinary order and ... exceptions"),
 q("E37-Q4","RC2-F04","hard","What is the author's tone?","Practical and transparency-focused",["Dismissive of waiting users","Promotional","Humorous"],"The author tries to make uncertain queue systems easier to understand rather than pretending they are fixed.","transparent waitlist"),
 q("E37-Q5","RC2-F05","medium","Why does the author mention broad position bands?","They can provide useful information without implying unjustified precision",["They eliminate priority rules","They guarantee exact dates","They make waitlists shorter"],"Bands are presented as a compromise between silence and false exactness.","broad position bands"),
 q("E37-Q6","RC2-F06","hard","Which conclusion follows most logically?","A changing queue can still be fair if the rules causing changes are explicit and consistently applied",["Any movement makes a queue unfair","Priority should never matter","Approximate positions are useless"],"The passage distinguishes understandable exceptions from arbitrary unexplained movement.","recognised exceptions"),
 q("E37-Q7","RC2-F07","medium","Which statement is supported?","Some training courses reserve places for different eligibility groups",["Housing programmes never use priority","Medical queues are always fixed","All waitlists are chronological"],"The article uses eligibility groups as one example of structured queue exceptions.","reserve some places"),
 q("E37-Q8","RC2-F08","easy","In context, “arbitrary” most nearly means:","changing without a clear or consistent reason",["slow","public","numerical"],"The passage contrasts arbitrary movement with transparent priority rules.","feel arbitrary")
 ]
},
{
 id:"ENG008-RC2-E38",title:"Repair Warranties Need Clear Scope",genre:"editorial",
 text:`A warranty can reassure buyers that a repair will not immediately create another bill. Yet the phrase “90-day repair warranty” can mean very different things unless the scope is clear.

Does the warranty cover only the part replaced, the same symptom, all labour or any fault in the device? These are not equivalent promises.

A good warranty should identify the repaired component, the covered period and the conditions that would make a new visit chargeable.

For example, replacing a laptop battery does not normally guarantee the screen, keyboard and charging port for ninety days. At the same time, a battery connection left loose during the repair should not be treated as an unrelated new problem.

Diagnostic uncertainty makes wording important. Sometimes the original fault had several possible causes. If the first repair addressed one reasonable cause but the symptom returns, the customer needs to know how the shop will reassess the case.

Receipts should therefore record what was diagnosed and what work was actually performed.

Clear exclusions are useful when they prevent false assumptions, but a warranty should not contain so many vague exclusions that the promise becomes meaningless.

The broader principle is that warranty value depends on a shared understanding of what has been guaranteed. A short headline can attract attention; the real protection lies in the specific scope behind it.`,
 questions:[
 q("E38-Q1","RC2-F01","easy","What should a repair warranty clearly identify?","The covered component, period and conditions",["Only the shop name","The customer's income","Every future device problem"],"The passage argues for precise scope rather than a vague headline promise.","repaired component, the covered period"),
 q("E38-Q2","RC2-F02","medium","What can be inferred if a repaired battery connection was left loose?","It should not automatically be treated as an unrelated fault",["The screen warranty becomes permanent","The customer needs a new laptop","The warranty is irrelevant"],"The passage distinguishes genuinely unrelated problems from issues connected to the repair work itself.","should not be treated as unrelated"),
 q("E38-Q3","RC2-F03","medium","Which summary is most accurate?","Repair warranties are useful only when the exact protected work and exclusions are understandable",["All repairs need lifetime warranties","Every fault should be covered","Receipts are unnecessary"],"The article emphasises clear scope, documentation and meaningful exclusions.","shared understanding"),
 q("E38-Q4","RC2-F04","hard","What is the author's tone?","Explanatory and consumer-oriented",["Hostile to repair shops","Promotional","Humorous"],"The passage clarifies how warranties can protect both buyer and repairer when terms are specific.","reassure buyers"),
 q("E38-Q5","RC2-F05","medium","Why should receipts record diagnosis and work performed?","They provide evidence of what the warranty actually relates to",["They replace the warranty period","They prevent every future failure","They determine device price"],"A written record makes later disagreements easier to assess.","record what was diagnosed"),
 q("E38-Q6","RC2-F06","hard","Which conclusion follows most logically?","A broad warranty headline can be misleading if the underlying scope is narrow or vague",["Short headlines are always false","Exclusions should never exist","Every repair has one cause"],"The conclusion distinguishes attention-grabbing wording from the specific protection behind it.","real protection lies"),
 q("E38-Q7","RC2-F07","medium","Which statement is supported?","A recurring symptom can sometimes require renewed diagnosis",["Every repeat symptom proves the first repair was wrong","A battery repair covers all laptop parts","Warranty periods have no value"],"The passage notes that one symptom can have multiple causes and may need reassessment.","several possible causes"),
 q("E38-Q8","RC2-F08","easy","In context, “scope” most nearly means:","the range of problems or work covered",["the repair price","the shop location","the customer queue"],"The passage uses scope to describe the boundaries of warranty protection.","scope")
 ]
},
{
 id:"ENG008-RC2-E39",title:"Rankings Should Show Their Weighting",genre:"editorial",
 text:`Rankings are attractive because they turn many pieces of information into one ordered list. Universities, hospitals, cities and products can all be ranked. The simplicity is useful, but the order depends heavily on how different measures are weighted.

A university ranking might combine research output, teaching surveys and graduate employment. Giving research twice the weight of teaching can change the final order even when the underlying data stays the same.

There is no universally correct weighting for every purpose. A student choosing an undergraduate college may care more about teaching and cost than a researcher comparing laboratories.

Rankings should therefore publish their components, definitions and weights. Users can then understand what the list rewards.

Sensitivity analysis can also help. If a small change in weighting moves an institution from third to twentieth, the apparent precision of the rank is weak.

Missing data needs attention too. Replacing a missing value with an average, zero or estimate can affect positions differently.

This does not make rankings useless. They can summarise complex information and prompt further investigation.

The problem comes when the final order is treated as though it exists independently of the design choices used to create it.

A responsible ranking is therefore transparent about the value judgements built into its formula and encourages users to look beyond the headline position.  Transparency also helps users compare alternative rankings built for different purposes.`,
 questions:[
 q("E39-Q1","RC2-F01","easy","Why can rankings change even if the underlying data does not?","The weighting of different measures can change",["Institutions always change names","Ranks are random","Data is never used"],"Different weights can reorder the same set of measured outcomes.","weight ... can change the final order"),
 q("E39-Q2","RC2-F02","medium","What can be inferred from large rank changes after small weighting changes?","The exact rank is not very robust",["The institution's data is false","Weighting never matters","The institution improved suddenly"],"Sensitivity to small design choices weakens the apparent precision of the final order.","apparent precision ... weak"),
 q("E39-Q3","RC2-F03","medium","Which summary is most accurate?","Rankings can be useful summaries if their measures, weights and uncertainty are transparent",["Rankings should be banned","One weighting is correct for all users","Headline rank is sufficient"],"The article supports rankings while emphasising visibility into their construction.","transparent"),
 q("E39-Q4","RC2-F04","hard","What is the author's tone?","Analytical and cautious",["Promotional","Dismissive of all rankings","Humorous"],"The passage acknowledges utility but warns against treating one ordering as objective truth.","can summarise complex information"),
 q("E39-Q5","RC2-F05","medium","Why does the author mention undergraduate students and researchers?","Different users may value ranking components differently",["Students never care about research","Researchers ignore teaching completely","All rankings use one audience"],"The example shows why no universal weighting fits every purpose.","care more about"),
 q("E39-Q6","RC2-F06","hard","Which conclusion follows most logically?","Users should interpret rank as a product of both data and design choices",["Rankings contain no data","Weighting should be secret","Missing values never matter"],"The conclusion states that final order does not exist independently of the formula.","design choices"),
 q("E39-Q7","RC2-F07","medium","Which statement is supported?","Missing-data treatment can affect positions",["All missing values should be zero","Rankings never use estimates","Every institution supplies complete data"],"The passage directly notes that different replacements for missing data can alter results.","Missing data needs attention"),
 q("E39-Q8","RC2-F08","easy","In context, “weighting” most nearly means:","the relative importance assigned to each measure",["the physical mass of a report","the number of institutions","the order of data collection"],"Weights determine how strongly each component influences the final score.","twice the weight")
 ]
},
{
 id:"ENG008-RC2-R32",title:"A City Tests EV-Charger Queue Status",genre:"current-affairs-report",
 text:`A city installed live queue displays at six public electric-vehicle charging sites. The displays showed how many chargers were occupied and how many vehicles were waiting.

During the two-month pilot, drivers were more likely to choose a nearby alternative site when the closest station had a long queue.

However, the first version counted a charger as available immediately after a session ended, even if the driver had not yet moved the vehicle. This produced false availability for several minutes.

The city changed the status to “session ended — bay clearing” until a parking sensor confirmed the space was open.

Another problem involved fast and slow chargers. One free slow charger did not necessarily help a driver who needed the faster connector type. The display therefore began separating charger categories.

Average reported waiting time fell at the busiest two stations, while use became more evenly distributed across the network.

Officials cautioned that the displays did not create more charging capacity. They improved how existing capacity was shared.

The next phase will measure whether drivers make unnecessary extra trips between sites when queue information changes quickly.  The city will also measure how often drivers abandon a site after seeing a long queue and whether those diversions create congestion at nearby chargers. Officials want to know whether information redistributes waiting or genuinely shortens it across the network.`,
 questions:[
 q("R32-Q1","RC2-F01","easy","What did the queue displays show?","Occupied chargers and waiting vehicles",["Electricity price history only","Driver names","Vehicle battery health"],"The system described current site demand and charging occupancy.","how many chargers were occupied"),
 q("R32-Q2","RC2-F02","medium","Why was “bay clearing” added?","A finished charging session did not always mean the parking space was physically free",["Chargers stopped recording sessions","Every driver used slow charging","Parking sensors were removed"],"The extra status prevented a recently finished bay from being shown as immediately usable.","driver had not yet moved"),
 q("R32-Q3","RC2-F03","medium","Which summary is most accurate?","Live status helped distribute demand but needed to reflect physical bay and charger-type constraints",["The displays increased the number of chargers","All drivers need the same connector","Queues disappeared everywhere"],"The pilot improved use of existing capacity while correcting misleading availability states.","separating charger categories"),
 q("R32-Q4","RC2-F04","hard","What is the tone of the report?","Practical and measured",["Promotional","Anti-electric-vehicle","Alarmist"],"The report describes benefits while clearly limiting what information alone can solve.","did not create more charging capacity"),
 q("R32-Q5","RC2-F05","medium","Why were charger categories separated?","A free charger may not match the connector or speed a driver needs",["Categories changed electricity price","Slow chargers were removed","Drivers requested identical labels"],"Availability is meaningful only when the free equipment is compatible with the user's need.","needed the faster connector type"),
 q("R32-Q6","RC2-F06","hard","Which conclusion is justified?","Information can improve utilisation without increasing physical infrastructure",["Queue displays replace chargers","Waiting time must become zero","Drivers should ignore alternatives"],"The city explicitly separates better sharing from added capacity.","existing capacity"),
 q("R32-Q7","RC2-F07","medium","Which statement is supported?","Use became more evenly distributed across charging sites",["Every station became busier","The city removed slow chargers","Parking sensors failed"],"Drivers used alternatives when the nearest queue was long.","more evenly distributed"),
 q("R32-Q8","RC2-F08","easy","In context, “capacity” most nearly means:","the amount of charging service the network can provide",["the display brightness","the parking fee","the number of drivers in the city"],"Capacity refers to the underlying ability to serve vehicles.","charging capacity")
 ]
},
{
 id:"ENG008-RC2-R33",title:"A School Tests Attendance-Alert Escalation",genre:"current-affairs-report",
 text:`A school district changed its attendance-alert system after parents complained that identical messages were sent for both one missed period and repeated absence.

The pilot introduced three levels. A first unexplained absence produced a simple reminder. Several absences within a short period triggered a request to confirm the reason. Continued absence created a staff follow-up call.

The aim was to match the response to the pattern rather than treat every event as equally serious.

During the first term, routine message volume fell, while staff calls became more focused on students with repeated absence.

A problem appeared when students were marked absent because a teacher had not yet completed the register. Parents sometimes received an unnecessary first-level alert.

The district delayed the initial message by twenty minutes and allowed teachers to correct the register before it was sent.

Officials also added a clear statement that the first alert was not a disciplinary warning.

The next evaluation will compare correction rates, parent response and whether repeated absence is identified earlier.

Administrators concluded that escalation works only if the underlying data is timely enough to prevent minor recording delays from looking like behaviour patterns.  The district will also compare whether the delay reduces false alerts without making genuine absence patterns harder to identify quickly. Staff will review outcomes separately for single-period mistakes and repeated multi-day absence.`,
 questions:[
 q("R33-Q1","RC2-F01","easy","What happened after repeated unexplained absences?","The system escalated toward confirmation and staff follow-up",["Every absence caused immediate punishment","Alerts stopped permanently","The student was automatically removed"],"The pilot used progressively stronger responses as the pattern became more serious.","three levels"),
 q("R33-Q2","RC2-F02","medium","Why was the first alert delayed by twenty minutes?","Teachers needed time to correct incomplete attendance records",["Parents wanted later school hours","Students needed travel time","The alert server was too slow"],"The delay reduced false alerts caused by unfinished registers.","not yet completed the register"),
 q("R33-Q3","RC2-F03","medium","Which summary is most accurate?","Attendance alerts became more useful when response intensity matched repeated patterns and data was allowed time to settle",["Every absence should trigger the same response","Teacher corrections should be ignored","Calls should replace all messages"],"The system combines escalation with a short data-correction window.","match the response to the pattern"),
 q("R33-Q4","RC2-F04","hard","What is the tone of the report?","Operational and balanced",["Punitive","Promotional","Humorous"],"The report evaluates both the benefits of escalation and the risk of false alerts.","problem appeared"),
 q("R33-Q5","RC2-F05","medium","Why did the district clarify that the first message was not disciplinary?","Parents might otherwise interpret a routine alert as punishment",["The school had no attendance rules","Messages had no text","Repeated absence was allowed"],"The wording helps distinguish early information from stronger later intervention.","not a disciplinary warning"),
 q("R33-Q6","RC2-F06","hard","Which conclusion is justified?","Escalation systems need reliable event data before interpreting repetition as a pattern",["Faster alerts are always better","Attendance data should never be corrected","Every first alert should trigger a call"],"A data-entry delay can create a false signal if the system escalates too quickly.","underlying data is timely"),
 q("R33-Q7","RC2-F07","medium","Which statement is supported?","Routine message volume fell during the pilot",["Staff calls stopped","Every student received fewer absences","The district ended registration"],"The new system reduced low-value repetition while focusing stronger contact.","message volume fell"),
 q("R33-Q8","RC2-F08","easy","In context, “escalation” most nearly means:","increasing the strength of response as the pattern becomes more serious",["delaying every action","removing data","shortening school hours"],"The three levels become progressively more active.","escalation")
 ]
},
{
 id:"ENG008-RC2-R34",title:"A Wholesale Market Tests Cold-Room Occupancy Boards",genre:"current-affairs-report",
 text:`A wholesale market installed occupancy boards outside three cold rooms used by fruit and vegetable traders. Previously, traders often moved carts to a room only to discover that the available floor space had already been taken.

The new boards displayed “space available”, “nearly full” or “full”, based on staff scans when pallets entered or left.

During the pilot, unnecessary cart movement fell. However, one room continued showing “nearly full” after several pallets had been removed because an exit scan was missed.

The market added an hourly reconciliation in which a supervisor compared the digital count with a quick physical estimate.

Another issue involved pallet size. Ten small pallets did not occupy the same space as ten large ones. The system therefore moved from simple item counts to estimated floor area used.

Traders said the revised board was more useful because it answered the practical question of whether another load could fit.

Managers concluded that capacity information should be based on the resource actually being consumed. Counting items is convenient, but floor area was the more relevant measure for a shared cold room.

The next trial will test whether booking space in advance further reduces congestion at peak arrival times.  Managers will also record how often the hourly physical check changes the digital status, because frequent corrections would indicate that scanning alone is not reliable enough for live capacity reporting.`,
 questions:[
 q("R34-Q1","RC2-F01","easy","What did the occupancy boards show?","Whether cold-room space was available, nearly full or full",["Fruit prices","Truck fuel use","Trader names"],"The boards summarised current storage capacity for arriving traders.","space available"),
 q("R34-Q2","RC2-F02","medium","Why could a board stay too full after pallets left?","An exit scan could be missed",["Cold rooms changed size","Pallets became heavier","Traders stopped using scans entirely"],"The status depended on both entry and exit updates, so a missing exit event left stale information.","exit scan was missed"),
 q("R34-Q3","RC2-F03","medium","Which summary is most accurate?","Capacity displays became more accurate when they measured floor space rather than only pallet count",["Every pallet uses the same space","Physical checks are unnecessary","Booking alone determines capacity"],"The pilot improved after the system matched its measure to the resource actually constrained.","estimated floor area"),
 q("R34-Q4","RC2-F04","hard","What is the tone of the report?","Practical and evidence-based",["Promotional","Hostile to traders","Alarmist"],"The report describes an iterative operational trial and its corrections.","added an hourly reconciliation"),
 q("R34-Q5","RC2-F05","medium","Why was pallet count a weak measure?","Pallets differed in size",["Pallets were never scanned","The rooms had no floors","Traders counted incorrectly"],"Equal item counts could consume different amounts of cold-room space.","Ten small pallets"),
 q("R34-Q6","RC2-F06","hard","Which conclusion is justified?","Operational metrics should match the scarce resource people are trying to use",["The easiest measure is always best","Item counts should replace area","Every cold room needs identical rules"],"The market improved usefulness by measuring floor area, the actual constraint.","resource actually being consumed"),
 q("R34-Q7","RC2-F07","medium","Which statement is supported?","Unnecessary cart movement fell after the boards were introduced",["Cold-room capacity increased","All scan errors disappeared","Traders stopped using carts"],"The live status reduced trips to rooms that could not take more loads.","cart movement fell"),
 q("R34-Q8","RC2-F08","easy","In context, “reconciliation” most nearly means:","checking two records or observations against each other",["a price discount","a pallet repair","a new booking"],"Supervisors compared the digital count with physical space to correct errors.","compared ... digital count")
 ]
},
{
 id:"ENG008-RC2-R35",title:"A Municipality Tests Permit-Application Milestones",genre:"current-affairs-report",
 text:`A municipality replaced a single “application received” message with a milestone tracker for small building permits.

Applicants could now see “documents received”, “initial check complete”, “technical review”, “clarification requested” and “decision issued”.

During the three-month pilot, phone calls asking whether an application had been lost declined.

The tracker also exposed a new source of confusion. Some applicants interpreted “technical review” as meaning approval was almost certain, even though the review could still identify major problems.

The municipality added a note saying each milestone described process location, not likelihood of approval.

Another issue involved clarification requests. When an applicant uploaded new documents, the tracker did not immediately return to “technical review”. Staff added a “response received — awaiting reassessment” state.

Applicants said this was useful because it confirmed that their new documents had reached the system.

Officials concluded that process transparency works best when status labels describe what has happened without implying an outcome that has not yet been decided.

The municipality will next compare total processing time and the number of incomplete applications, because better visibility alone does not necessarily make review faster.  The municipality will also review whether milestone wording changes applicant behaviour, such as prompting earlier responses to clarification requests. That will help separate better visibility from actual process improvement.`,
 questions:[
 q("R35-Q1","RC2-F01","easy","What did the new permit tracker show?","Stages such as document receipt, review and decision",["Construction prices","Inspector salaries","Neighbour names"],"The tracker replaced one generic receipt status with several process milestones.","milestone tracker"),
 q("R35-Q2","RC2-F02","medium","Why was a note added beside “technical review”?","Applicants were treating a process stage as a sign of likely approval",["Technical review had been removed","Every application was approved","The label had no meaning"],"The municipality wanted the status to show location in the workflow rather than outcome probability.","not likelihood of approval"),
 q("R35-Q3","RC2-F03","medium","Which summary is most accurate?","Process trackers reduce uncertainty when stages are clear and do not imply undecided outcomes",["Milestones guarantee faster approval","Every status should predict the final decision","Applicants need only one receipt message"],"The report focuses on visibility while avoiding false interpretation of process labels.","describe what has happened"),
 q("R35-Q4","RC2-F04","hard","What is the tone of the report?","Measured and administrative",["Promotional","Hostile to applicants","Humorous"],"The passage evaluates a workflow tool, including benefits and interpretation problems.","new source of confusion"),
 q("R35-Q5","RC2-F05","medium","Why was “response received — awaiting reassessment” added?","Applicants needed confirmation that new documents had arrived before review resumed",["The municipality wanted more stages for appearance","Applications were automatically approved","Technical review was cancelled"],"The new state fills an informational gap between upload and renewed review.","confirmed ... new documents"),
 q("R35-Q6","RC2-F06","hard","Which conclusion is justified?","Status visibility and processing speed are separate outcomes",["More labels always shorten review","Tracking replaces technical assessment","Calls are the only measure of service"],"The municipality plans to measure processing time separately because visibility alone may not accelerate work.","does not necessarily make review faster"),
 q("R35-Q7","RC2-F07","medium","Which statement is supported?","Phone calls asking whether applications were lost declined",["All applications became complete","Approval rates doubled","Clarification requests disappeared"],"Applicants had better information about where their files were in the process.","phone calls ... declined"),
 q("R35-Q8","RC2-F08","easy","In context, “milestone” most nearly means:","a recognisable stage in a process",["a legal penalty","a construction material","a final guarantee"],"The tracker lists successive points in the application workflow.","milestone tracker")
 ]
}
] as const;