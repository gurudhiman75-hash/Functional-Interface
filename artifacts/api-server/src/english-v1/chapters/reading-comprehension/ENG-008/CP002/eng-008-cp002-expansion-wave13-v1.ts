import type{Eng008Cp002PassageV1}from"./eng-008-cp002-authorities-v1";
const q=(id:string,familyId:any,difficulty:any,question:string,correctAnswer:string,distractors:readonly[string,string,string],explanation:string,evidence:string)=>({id,familyId,difficulty,question,correctAnswer,distractors,explanation,evidence});
export const ENG008_CP002_EXPANSION_WAVE13_V1:readonly Eng008Cp002PassageV1[]=[
{
 id:"ENG008-RC2-E40",title:"Progress Bars Should Reflect Real Stages",genre:"editorial",
 text:`A progress bar can make a long digital process feel easier. People are more willing to wait when they can see that something is moving. The problem begins when the bar gives a smooth visual impression that does not match the actual work happening behind it.

Uploading a file may finish quickly while virus scanning, format checks and server processing take much longer. If the bar reaches 95 per cent almost immediately and then stops for several minutes, users may think the system has failed.

A better design reflects real stages. It can say “upload complete — checking file” rather than pretending that all remaining work belongs to one continuous percentage.

Estimated completion time should also be used carefully. Some tasks vary widely depending on file size or server load. A broad range can be more honest than a precise countdown that repeatedly changes.

The goal is not perfect prediction. It is understandable state.

People usually tolerate waiting better when they know what the system is doing and whether action is required from them.

A progress indicator should therefore communicate stage, uncertainty and next step—not merely show motion.

Visual reassurance is useful, but it should not create a false sense of precision about work the system cannot actually predict.`,
 questions:[
 q("E40-Q1","RC2-F01","easy","Why can a progress bar become misleading?","Its visual movement may not match the actual stages of work",["Users dislike percentages","Every digital task has one stage","Files never require checking"],"The passage warns against a smooth-looking bar that hides uneven backend stages.","does not match the actual work"),
 q("E40-Q2","RC2-F02","medium","What can be inferred from a bar stuck at 95 per cent?","The visible percentage may be a poor representation of the remaining process",["The task has definitely failed","The user should always restart","The final five per cent is always largest"],"The example shows that backend checking can take longer than the visual bar suggests.","then stops"),
 q("E40-Q3","RC2-F03","medium","Which summary is most accurate?","Progress indicators should communicate real stages and uncertainty rather than false precision",["Progress bars should be removed","Every task needs an exact countdown","Visual motion is more important than state"],"The article supports indicators when they represent the process honestly.","reflects real stages"),
 q("E40-Q4","RC2-F04","hard","What is the author's tone?","Practical and design-focused",["Hostile to software","Promotional","Humorous"],"The passage evaluates how interface feedback can reduce confusion without overclaiming.","better design"),
 q("E40-Q5","RC2-F05","medium","Why does the author prefer a stage label such as “checking file”?","It explains what the system is actually doing after upload",["It makes processing faster","It removes the need for servers","It guarantees success"],"A meaningful state label is more informative than an arbitrary percentage.","checking file"),
 q("E40-Q6","RC2-F06","hard","Which conclusion follows most logically?","A less precise but honest estimate can be more useful than a precise-looking estimate that changes constantly",["Precise numbers should never be used","Users do not care about waiting","Server load is irrelevant"],"The passage repeatedly values understandable uncertainty over false exactness.","broad range"),
 q("E40-Q7","RC2-F07","medium","Which statement is supported?","File checking can continue after upload itself is complete",["Upload and processing always finish together","Progress bars eliminate waiting","Every task has fixed duration"],"The example explicitly separates upload from later scanning and validation.","upload complete — checking file"),
 q("E40-Q8","RC2-F08","easy","In context, “uncertainty” most nearly means:","lack of exact knowledge about what will happen or how long it will take",["system failure","visual design","user action"],"The passage uses uncertainty for unpredictable remaining duration and process state.","uncertainty")
 ]
},
{
 id:"ENG008-RC2-E41",title:"Digital Receipts Need Retention Rules",genre:"editorial",
 text:`Digital receipts are convenient because they are searchable and do not fade like paper. But convenience creates a new question: how long should the seller keep the record?

Keeping every purchase indefinitely may help customers retrieve old proof of payment, yet it also creates a large history of personal shopping data.

The correct retention period depends on purpose. A receipt needed for a two-year warranty may reasonably remain available for that period. Keeping it for decades without a clear reason is harder to justify.

Customers should also know whether the seller stores the full receipt, only a transaction number or additional information such as email address and payment token.

Deletion rules need clarity. If a customer closes an account, some financial records may still need to be retained for tax, fraud or legal obligations.

This means “delete my account” cannot always mean “erase every transaction immediately”.

A responsible system should explain what remains, why it remains and when it will be removed.

Digital records are valuable precisely because they persist. That same persistence creates responsibility.

Good receipt design therefore includes not only delivery and search, but also retention limits, access controls and understandable deletion rules.`,
 questions:[
 q("E41-Q1","RC2-F01","easy","Why can indefinite receipt storage be a concern?","It creates a long-term record of personal purchase history",["Digital receipts cannot be searched","Paper receipts last longer","Warranties never need proof"],"The passage links convenience with the privacy cost of retaining detailed shopping history.","personal shopping data"),
 q("E41-Q2","RC2-F02","medium","What can be inferred about retention periods?","They should be linked to a clear business or legal purpose",["Every receipt needs the same period","No receipt should ever be stored","Warranty length is irrelevant"],"The author ties storage duration to the reason the information is needed.","depends on purpose"),
 q("E41-Q3","RC2-F03","medium","Which summary is most accurate?","Digital receipts need clear rules for how long data is kept, why it is kept and how deletion works",["Digital receipts should replace all paper","Account closure must erase every record instantly","Sellers need unlimited retention"],"The article focuses on balancing usefulness with data responsibility.","retention limits"),
 q("E41-Q4","RC2-F04","hard","What is the author's tone?","Balanced and privacy-conscious",["Anti-digital","Promotional","Humorous"],"The passage recognises convenience while examining the obligations created by persistence.","convenient ... But"),
 q("E41-Q5","RC2-F05","medium","Why might some records remain after account closure?","Legal or financial rules may require temporary retention",["The seller wants unlimited marketing data","Customers cannot delete accounts","Receipts contain no personal information"],"The passage gives tax, fraud and legal obligations as legitimate reasons.","may still need to be retained"),
 q("E41-Q6","RC2-F06","hard","Which conclusion follows most logically?","Deletion promises should explain exceptions instead of implying that all data disappears immediately",["Account closure should be banned","Tax records should be public","Receipt storage should be permanent"],"The passage argues for honest explanation of retained records and removal timing.","what remains, why"),
 q("E41-Q7","RC2-F07","medium","Which statement is supported?","A warranty period can help determine a reasonable receipt-retention period",["Warranties require permanent storage","Digital receipts cannot support warranty claims","Retention never depends on product type"],"The author uses a two-year warranty as an example of purpose-based retention.","two-year warranty"),
 q("E41-Q8","RC2-F08","easy","In context, “retention” most nearly means:","keeping information for a period of time",["sending a receipt","printing a receipt","refunding a purchase"],"The whole passage discusses how long stored receipt data remains available.","retention")
 ]
},
{
 id:"ENG008-RC2-E42",title:"Public Ratings Should Show Sample Size",genre:"editorial",
 text:`A rating of 4.8 out of 5 looks impressive. Yet the meaning of that number depends partly on how many people contributed to it.

A café with two perfect reviews can show a higher average than a café with four thousand reviews and a stable 4.6. The smaller result is not necessarily false; it is simply less certain.

Sample size should therefore appear beside the average.

Distribution also matters. Two businesses can share the same average while one receives mostly fours and fives and another receives a mix of ones and fives.

Recency matters too. A hotel renovated last year may have current reviews that differ greatly from older ones.

Platforms sometimes highlight a single average because it is easy to scan, but users benefit from context such as review count, recent trend and rating spread.

This does not mean large review counts guarantee quality. Coordinated manipulation and selection bias can still affect the data.

The point is narrower: a public rating should not look more certain than the evidence behind it.

A useful summary helps users see both the central score and the amount and pattern of information supporting it.`,
 questions:[
 q("E42-Q1","RC2-F01","easy","Why should sample size appear beside a rating?","It helps users judge how much evidence supports the average",["It changes the rating scale","It guarantees review honesty","It removes old reviews"],"The passage explains that the same average is more or less stable depending on how many reviews contributed.","how many people"),
 q("E42-Q2","RC2-F02","medium","What can be inferred from a 5.0 rating based on two reviews?","The score may be genuine but highly uncertain",["It is definitely manipulated","It is better than every 4.8 rating","It cannot change"],"A tiny sample can produce an extreme average without much evidence.","less certain"),
 q("E42-Q3","RC2-F03","medium","Which summary is most accurate?","Ratings are more informative when average, sample size, spread and recency are shown together",["Average rating should never be used","Only recent reviews matter","Large samples guarantee quality"],"The article argues for contextualising the headline average rather than discarding it.","context"),
 q("E42-Q4","RC2-F04","hard","What is the author's tone?","Analytical and cautious",["Promotional","Dismissive of reviews","Humorous"],"The author recognises the usefulness of ratings while warning against unsupported certainty.","not necessarily false"),
 q("E42-Q5","RC2-F05","medium","Why does the author discuss rating distribution?","The same average can hide very different patterns of opinion",["Distribution changes business location","Every review has the same score","Large samples have no spread"],"Averages can conceal whether ratings are consistent or polarised.","mix of ones and fives"),
 q("E42-Q6","RC2-F06","hard","Which conclusion follows most logically?","Platforms should avoid presenting a small-sample rating with the same apparent certainty as a large stable one",["Small businesses should have no ratings","Every rating needs a confidence interval","Old reviews should be deleted"],"The passage's core concern is certainty relative to evidence.","not look more certain"),
 q("E42-Q7","RC2-F07","medium","Which statement is supported?","Recent reviews may better reflect a hotel after a major renovation",["Old reviews are always useless","Renovation guarantees higher ratings","Review count should be hidden"],"The passage uses renovation to show why timing can affect relevance.","current reviews"),
 q("E42-Q8","RC2-F08","easy","In context, “distribution” most nearly means:","how ratings are spread across different scores",["where the business is located","how reviews are delivered","the average alone"],"The article contrasts the same average arising from different patterns of scores.","rating spread")
 ]
},
{
 id:"ENG008-RC2-E43",title:"Urgent Alerts Should Reserve Urgency",genre:"editorial",
 text:`Push notifications are effective because they interrupt attention. That makes them useful for urgent information—and easy to misuse.

If an app labels routine promotions, weekly summaries and genuine emergencies with the same sound and visual style, users learn that interruption does not necessarily mean importance.

Some will disable notifications entirely. Others will stop reading quickly.

Urgency therefore needs a hierarchy. A banking fraud alert, a severe weather warning and a sale announcement should not compete as though they carry the same consequence.

Users also need control over categories. Someone may want transaction security alerts while refusing marketing notifications.

Designers sometimes argue that strong alerts improve engagement. In the short term, that may be true. In the long term, overuse can destroy the credibility of the channel.

The same principle applies inside organisations. If every email is marked “urgent”, the label stops helping employees decide what deserves immediate attention.

Urgency is a scarce signal.

A responsible system protects that signal by reserving the strongest interruptions for information where delay has meaningful cost.`,
 questions:[
 q("E43-Q1","RC2-F01","easy","Why can too many urgent alerts become ineffective?","Users stop treating the urgent signal as meaningful",["Phones cannot play many sounds","All alerts become slower","Promotions disappear"],"The passage argues that repeated low-value interruption weakens the credibility of the channel.","label stops helping"),
 q("E43-Q2","RC2-F02","medium","What can be inferred if users disable all notifications?","Overuse of low-priority alerts can also reduce reach for genuinely important alerts",["Urgent alerts become louder","Marketing improves","Security messages become unnecessary"],"Channel fatigue can cause users to remove the channel altogether.","disable notifications entirely"),
 q("E43-Q3","RC2-F03","medium","Which summary is most accurate?","Alert systems should distinguish urgency levels and reserve strong interruption for high-consequence information",["Every notification should look urgent","Marketing should replace security alerts","Users should have no category controls"],"The article treats urgency as a limited signalling resource.","scarce signal"),
 q("E43-Q4","RC2-F04","hard","What is the author's tone?","Critical but practical",["Promotional","Alarmist","Humorous"],"The passage identifies a design failure and proposes a clear principle for improvement.","responsible system"),
 q("E43-Q5","RC2-F05","medium","Why does the author mention workplace email?","To show the same signal-dilution problem outside mobile apps",["Email has no urgency labels","Employees never ignore messages","Apps and email are identical systems"],"The example generalises the principle beyond push notifications.","same principle"),
 q("E43-Q6","RC2-F06","hard","Which conclusion follows most logically?","Maximising alert frequency can reduce long-term effectiveness of the notification channel",["More alerts always increase trust","Urgency should be hidden","Every sale deserves an emergency sound"],"The passage explicitly contrasts short-term engagement with long-term credibility.","destroy the credibility"),
 q("E43-Q7","RC2-F07","medium","Which statement is supported?","Users may want security alerts while rejecting marketing alerts",["All notification categories have equal importance","Category control reduces security","Marketing messages are always urgent"],"The passage argues for separate user control by alert type.","want transaction security alerts"),
 q("E43-Q8","RC2-F08","easy","In context, “hierarchy” most nearly means:","an ordered set of importance levels",["a list of users","a sound file","a marketing schedule"],"The author proposes different alert strengths for different consequences.","urgency needs a hierarchy")
 ]
},
{
 id:"ENG008-RC2-R36",title:"A District Tests School-Bus Delay Reasons",genre:"current-affairs-report",
 text:`A school district added reason codes to its bus-delay app. Previously, parents saw only “delayed” and an estimated arrival time.

The new system separated traffic congestion, mechanical inspection, weather and late departure from the depot.

During the first term, parents made fewer calls asking whether a delay reflected a safety problem.

However, staff noticed that reason codes could become stale. A bus initially delayed by traffic might later stop for a separate mechanical check.

The app was changed so the reason showed a timestamp and could be updated independently from the arrival estimate.

Drivers did not enter the codes themselves while moving. Depot staff updated them from route-control information.

The district concluded that delay explanations are useful only when they remain current.

The next phase will measure whether reason information reduces unnecessary early pickups by parents and whether families prefer broad categories or more detailed explanations.`,
 questions:[
 q("R36-Q1","RC2-F01","easy","What did the new bus app add?","Reason codes for delays",["Driver salaries","Student grades","Fuel prices"],"Parents could see broad causes such as traffic or weather.","reason codes"),
 q("R36-Q2","RC2-F02","medium","Why was a timestamp added to the delay reason?","The original reason could become outdated as the situation changed",["Parents requested the driver's location history","Arrival estimates were removed","Weather never changed"],"A timestamp helps users judge whether the displayed explanation is still current.","could become stale"),
 q("R36-Q3","RC2-F03","medium","Which summary is most accurate?","Delay reasons improved understanding but had to be updated as conditions changed",["Every delay had one permanent cause","Drivers typed while driving","Reason codes eliminated delays"],"The report emphasises dynamic explanation rather than a one-time label.","remain current"),
 q("R36-Q4","RC2-F04","hard","What is the tone of the report?","Operational and measured",["Promotional","Alarmist","Humorous"],"The report evaluates a communication feature and its limitations.","next phase"),
 q("R36-Q5","RC2-F05","medium","Why did depot staff enter the reason codes?","Drivers should not be distracted while driving",["Drivers did not know the route","Parents requested staff names","The app worked only at the depot"],"The system uses route-control information rather than asking drivers to update while moving.","did not enter ... while moving"),
 q("R36-Q6","RC2-F06","hard","Which conclusion is justified?","An explanation can become misleading if it is not refreshed when the cause changes",["Arrival estimates are unnecessary","Every bus needs detailed diagnostics","Traffic is the only useful reason"],"The report explicitly identifies stale reason codes as a problem.","reason codes could become stale"),
 q("R36-Q7","RC2-F07","medium","Which statement is supported?","Parent calls about possible safety problems decreased",["All buses became punctual","Weather delays disappeared","Drivers updated the app directly"],"The added reason context reduced uncertainty about why the bus was late.","fewer calls"),
 q("R36-Q8","RC2-F08","easy","In context, “stale” most nearly means:","outdated and no longer reflecting the current situation",["dangerous","detailed","automatic"],"The reason could remain on screen after the actual cause had changed.","stale")
 ]
},
{
 id:"ENG008-RC2-R37",title:"A Hospital Tests Discharge-Readiness Boards",genre:"current-affairs-report",
 text:`A hospital ward tested patient-facing discharge boards showing whether four steps were complete: doctor decision, pharmacy medicines, transport plan and final paperwork.

Previously, patients often heard “you may go home today” and assumed departure was immediate.

The new board showed each step separately. During the pilot, fewer patients repeatedly asked nurses whether they could leave.

One issue appeared when the doctor decision was complete but pharmacy medicines were delayed. Patients initially treated the first green tick as a guarantee of immediate discharge.

The board was changed to show “all required steps complete” only when the full sequence was ready.

Staff also added a note explaining that some patients would not need every category, such as hospital-arranged transport.

The ward concluded that discharge is a process, not a single moment.

The next evaluation will measure whether the board changes actual discharge time or mainly reduces uncertainty while patients wait.`,
 questions:[
 q("R37-Q1","RC2-F01","easy","What did the discharge board show?","Separate completion states for several discharge steps",["Only the doctor's name","Hospital bills only","Room availability"],"The board tracked doctor decision, medicines, transport and paperwork.","four steps"),
 q("R37-Q2","RC2-F02","medium","Why was a final “all required steps complete” message added?","One completed step could be mistaken for full discharge readiness",["Patients could not see green ticks","Doctors stopped making decisions","The pharmacy closed"],"The system needed a clear signal that the whole required pathway was complete.","guarantee of immediate discharge"),
 q("R37-Q3","RC2-F03","medium","Which summary is most accurate?","Discharge communication improved when multiple required stages were shown separately and a final readiness state was explicit",["Doctor approval always means immediate departure","Every patient needs transport","Boards shorten all discharge times"],"The report treats discharge as a staged process.","process, not a single moment"),
 q("R37-Q4","RC2-F04","hard","What is the tone of the report?","Practical and patient-focused",["Promotional","Dismissive","Humorous"],"The report evaluates how clearer process information affects patient uncertainty.","patient-facing"),
 q("R37-Q5","RC2-F05","medium","Why did the board note that some categories may not apply?","Different patients may require different discharge steps",["The system had missing data","Transport was always cancelled","Pharmacy medicines were optional for everyone"],"A universal board needed to distinguish required from irrelevant stages.","would not need every category"),
 q("R37-Q6","RC2-F06","hard","Which conclusion is justified?","Better process visibility may reduce uncertainty even if physical completion time does not change",["Boards guarantee faster pharmacy work","Every tick shortens discharge","Patients should ignore nurses"],"The next evaluation explicitly separates communication benefit from actual time reduction.","mainly reduces uncertainty"),
 q("R37-Q7","RC2-F07","medium","Which statement is supported?","Patients asked fewer repeated questions during the pilot",["All discharges became faster","Every patient needed hospital transport","The pharmacy delay disappeared"],"The board reduced repeated requests for status information.","fewer patients repeatedly asked"),
 q("R37-Q8","RC2-F08","easy","In context, “readiness” most nearly means:","being fully prepared for the next action",["hospital admission","medication cost","room cleaning"],"The board indicates whether discharge requirements are complete enough for departure.","readiness")
 ]
},
{
 id:"ENG008-RC2-R38",title:"A Market Tests Stall-Queue Tickets",genre:"current-affairs-report",
 text:`A busy wholesale market tested digital queue tickets for traders waiting to unload at six loading bays.

Each ticket showed the trader's position in the bay-specific queue and whether the bay was operating normally, slowly or temporarily stopped.

The system reduced arguments about who had arrived first.

However, a single position number could move backward when an emergency food-safety inspection gave one vehicle priority access.

The market added a message explaining recognised priority events whenever the sequence changed.

Another problem involved traders joining the wrong bay queue for their goods category. The app therefore displayed product category beside the bay number.

Managers concluded that queue transparency requires both position and the rules that can legitimately alter position.

The next phase will measure unloading time and whether traders switch bays unnecessarily when they see a shorter queue elsewhere.`,
 questions:[
 q("R38-Q1","RC2-F01","easy","What did each queue ticket show?","Position in a specific loading-bay queue",["Wholesale prices","Driver licence status","Product quality score"],"The ticket identified both the bay and current position.","bay-specific queue"),
 q("R38-Q2","RC2-F02","medium","Why could a trader's position move backward?","A recognised priority inspection could move another vehicle ahead",["The app lost every ticket","Bay numbers changed randomly","Traders were removed from the market"],"The queue allowed explicit safety-related priority events.","priority access"),
 q("R38-Q3","RC2-F03","medium","Which summary is most accurate?","Queue information works better when position, category and legitimate priority rules are visible",["Position should never change","Every bay handles every product","Priority should be hidden"],"The system becomes clearer by adding context around both bay assignment and sequence changes.","rules ... alter position"),
 q("R38-Q4","RC2-F04","hard","What is the tone of the report?","Operational and balanced",["Promotional","Hostile to traders","Humorous"],"The report evaluates benefits and problems in a queue-management pilot.","Another problem"),
 q("R38-Q5","RC2-F05","medium","Why was product category added beside the bay number?","Traders sometimes joined the wrong queue",["Categories affected ticket price","Every bay was closed","Position numbers were unavailable"],"Bay assignment depended on the type of goods being unloaded.","wrong bay queue"),
 q("R38-Q6","RC2-F06","hard","Which conclusion is justified?","A queue can remain fair even when position changes, if the recognised priority rule is transparent",["Any priority makes a queue unfair","Digital tickets prevent all delay","Short queues are always best"],"The passage distinguishes arbitrary movement from rule-based exceptions.","recognised priority events"),
 q("R38-Q7","RC2-F07","medium","Which statement is supported?","Arguments over arrival order decreased",["Unloading time definitely fell","All bays operated normally","Traders never switched queues"],"The queue-ticket system clarified who had arrived first.","reduced arguments"),
 q("R38-Q8","RC2-F08","easy","In context, “legitimately” most nearly means:","for a valid and recognised reason",["secretly","randomly","permanently"],"Priority changes were acceptable when based on declared safety rules.","legitimately alter")
 ]
},
{
 id:"ENG008-RC2-R39",title:"A City Tests Public-Toilet Cleaning Status",genre:"current-affairs-report",
 text:`A city installed simple cleaning-status screens outside twelve public toilets. The screens showed “open”, “cleaning in progress” or “temporarily closed”.

Before the change, people sometimes waited outside a locked door without knowing whether the closure would last two minutes or an hour.

The new screen also displayed the time cleaning started and an expected reopening range.

During the pilot, complaints about unexplained closures fell.

The estimate was not always exact. A spill or maintenance issue could extend the closure beyond the original range.

The city therefore changed the wording from an exact reopening minute to “expected between” two times.

Screens also showed a maintenance symbol when closure was not routine cleaning.

Officials concluded that public status is most useful when it distinguishes reason and expected duration without pretending the estimate is guaranteed.

The city will next compare screen accuracy across locations and measure whether users simply move to the nearest alternative facility.`,
 questions:[
 q("R39-Q1","RC2-F01","easy","What did the cleaning-status screens show?","Whether the facility was open, being cleaned or temporarily closed",["Only the cleaner's name","Entry fees","Water usage"],"The screens used three operational states for visitors.","open ... cleaning ... closed"),
 q("R39-Q2","RC2-F02","medium","Why was an exact reopening minute replaced by a range?","Cleaning or maintenance duration could vary",["The screens had no clock","Users requested less information","Every closure lasted an hour"],"A range better represented uncertainty in completion time.","could extend"),
 q("R39-Q3","RC2-F03","medium","Which summary is most accurate?","Public facility status should explain the reason and likely duration of closure without false precision",["Every closure needs an exact minute","Cleaning and maintenance are the same","Screens should show only open or closed"],"The report emphasises reason, time range and uncertainty.","distinguishes reason"),
 q("R39-Q4","RC2-F04","hard","What is the tone of the report?","Practical and service-oriented",["Promotional","Alarmist","Humorous"],"The passage evaluates a public-information feature and its limitations.","pilot"),
 q("R39-Q5","RC2-F05","medium","Why was a maintenance symbol added?","Some closures were not routine cleaning",["Cleaning never happened","Users could not read text","Maintenance always took less time"],"The symbol helps distinguish different reasons for the same closed state.","not routine cleaning"),
 q("R39-Q6","RC2-F06","hard","Which conclusion is justified?","A less exact time range can be more informative than an unreliable exact time",["Exact times are never useful","Users do not care about closure length","Maintenance should be hidden"],"The city deliberately traded false precision for a realistic interval.","expected between"),
 q("R39-Q7","RC2-F07","medium","Which statement is supported?","Complaints about unexplained closures decreased",["Every toilet remained open","All estimates were exact","Users never moved elsewhere"],"The new screens reduced uncertainty about why doors were locked.","complaints ... fell"),
 q("R39-Q8","RC2-F08","easy","In context, “duration” most nearly means:","how long something lasts",["why it happens","where it happens","who reports it"],"The passage discusses how long a closure may continue.","expected duration")
 ]
}
] as const;