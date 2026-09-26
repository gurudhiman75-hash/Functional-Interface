import type{Eng008Cp002PassageV1}from"./eng-008-cp002-authorities-v1";
const q=(id:string,familyId:any,difficulty:any,question:string,correctAnswer:string,distractors:readonly[string,string,string],explanation:string,evidence:string)=>({id,familyId,difficulty,question,correctAnswer,distractors,explanation,evidence});
export const ENG008_CP002_EXPANSION_WAVE8_V1:readonly Eng008Cp002PassageV1[]=[
{
 id:"ENG008-RC2-E20",title:"Error Messages Should Explain the Next Step",genre:"editorial",
 text:`Digital forms often fail at the moment when a user makes a small mistake. A field turns red, the form refuses to continue, and the message says only “invalid input”. That message identifies a problem without explaining how to solve it.

Useful error messages should answer two questions: what is wrong and what the user can do next. If a date must be entered in a particular format, the form should show an example. If a password needs a minimum length, the message should state the requirement before the user submits it repeatedly.

This does not mean every screen should be filled with instructions. Clear labels and short examples can prevent many errors before they happen. Detailed help can appear only when a user needs it.

Designers should also avoid blaming language. “You entered this incorrectly” adds little value. “Enter the date as DD-MM-YYYY” is more direct and useful.

Good error messages reduce repeated attempts and make support easier because users can often correct the problem themselves. They also reveal whether a rule is reasonable. If many people repeatedly fail at the same field, the form may need redesign rather than a longer warning.

A digital form should not treat an error as the end of a task. It should treat it as a point where the system helps the user recover and continue.`,
 questions:[
 q("E20-Q1","RC2-F01","easy","What is wrong with a message that says only “invalid input”?","It identifies a problem without telling the user how to correct it",["It always reveals private data","It makes the form load faster","It removes every validation rule"],"The opening paragraph says the message flags an error but gives no practical instruction for fixing it.","without explaining how to solve it"),
 q("E20-Q2","RC2-F02","medium","What can be inferred about repeated errors in one field?","They may indicate that the field or its instructions need redesign",["They prove every user is careless","They mean validation should be removed","They show the form has no rules"],"The author says repeated failure at the same field may point to a design problem rather than a need for harsher warnings.","form may need redesign"),
 q("E20-Q3","RC2-F03","medium","Which summary is most accurate?","Error messages should help users understand the problem and recover from it",["Forms should display all instructions at once","Every mistake should block access permanently","Blaming language improves accuracy"],"The passage consistently argues that validation should guide users toward a successful next step instead of merely rejecting input.","helps the user recover and continue"),
 q("E20-Q4","RC2-F04","hard","What is the author's tone?","Practical and solution-oriented",["Sarcastic and mocking","Alarmist and fearful","Indifferent to usability"],"The author identifies specific design problems and proposes concise, workable improvements rather than using emotional language.","more direct and useful"),
 q("E20-Q5","RC2-F05","medium","Why does the author compare two date-error messages?","To show that a concrete instruction is more useful than blame",["To argue that dates should be removed","To compare calendar systems","To recommend longer passwords"],"The contrast demonstrates how specific guidance helps a user correct an error more effectively than accusatory wording.","Enter the date as DD-MM-YYYY"),
 q("E20-Q6","RC2-F06","hard","Which conclusion follows most logically?","Good validation should support correction, not merely detect failure",["The best forms contain no rules","All help text should always be visible","Users should contact support for every error"],"The passage treats an error as a recovery point, so effective validation must guide the user toward a valid response.","point where the system helps"),
 q("E20-Q7","RC2-F07","medium","Which statement is supported?","Clear labels can prevent some errors before submission",["Long instructions are always required","A red field is enough guidance","All repeated errors are caused by users"],"The passage directly says that clear labels and short examples can prevent many mistakes before they happen.","prevent many errors before they happen"),
 q("E20-Q8","RC2-F08","easy","In context, “recover” most nearly means:","correct the problem and continue the task",["delete the entire form","hide the error message","restart the device"],"The final sentence describes helping the user move past an error and continue completing the form.","recover and continue")
 ]
},
{
 id:"ENG008-RC2-E21",title:"Repairability Labels Can Add Useful Buying Information",genre:"editorial",
 text:`Buyers can compare price, size and energy use on many products, yet they often receive little information about how easily an item can be repaired. A low purchase price may look attractive even when a simple failure later requires replacing the whole product.

A repairability label could make some of that hidden information visible. It might show whether common parts are available, whether the product can be opened with ordinary tools and how long software or manuals are expected to remain accessible.

Such a label would not tell every buyer which product to choose. Repair cost still depends on local labour, warranty terms and the type of failure. A highly repairable product can also be poorly made.

The value of the label is therefore comparative. It can give consumers one more dimension to consider and give manufacturers a reason to improve access to parts and documentation.

The scoring method would need to be public and stable. If companies can receive high marks through vague promises, the label would become promotional rather than informative.

Repairability information is most useful when it turns a technical design choice into something ordinary buyers can understand. It should support a decision, not pretend to replace judgement about price, quality, performance and expected use.

A useful label could also make trade-offs easier to discuss in stores and product reviews. Instead of treating repair as a vague virtue, buyers could ask which parts are replaceable, how difficult access is and whether independent repair information exists.`,
 questions:[
 q("E21-Q1","RC2-F01","easy","What might a repairability label show?","Whether parts, tools and repair information are available",["Only the product's colour","The buyer's future income","The exact date every failure will occur"],"The second paragraph lists part availability, ordinary-tool access and continued access to manuals or software information.","common parts are available"),
 q("E21-Q2","RC2-F02","medium","What can be inferred about a high repairability score?","It should not be treated as proof that the product is good in every respect",["It guarantees zero repair cost","It proves the product cannot fail","It makes price irrelevant"],"The passage explicitly notes that a repairable product can still be poorly made and that other buying factors remain important.","can also be poorly made"),
 q("E21-Q3","RC2-F03","medium","Which summary is most accurate?","Repairability labels can add useful comparative information if their scoring is transparent",["Repairability should replace every other buying criterion","Only expensive products should be repaired","Labels make warranties unnecessary"],"The argument supports repair information as one additional dimension while requiring a public and credible scoring method.","one more dimension to consider"),
 q("E21-Q4","RC2-F04","hard","What is the author's tone?","Supportive but qualified",["Unconditionally promotional","Hostile to repair","Humorous and casual"],"The author sees value in labels but repeatedly limits the claim by discussing quality, labour costs and scoring integrity.","would not tell every buyer"),
 q("E21-Q5","RC2-F05","medium","Why does the author discuss the scoring method?","To show that the label is useful only if the rating cannot be manipulated by vague claims",["To argue that every company needs the same products","To explain how barcodes are printed","To compare repair workers' salaries"],"A transparent method is presented as necessary to keep the label informative rather than merely promotional.","scoring method would need to be public"),
 q("E21-Q6","RC2-F06","hard","Which conclusion follows most logically?","Repairability information is best used alongside price, quality and expected use",["Repairability alone should determine every purchase","Manufacturers should stop offering warranties","Repair costs are identical everywhere"],"The conclusion says the label should support judgement rather than replace other important dimensions of a buying decision.","support a decision, not pretend to replace judgement"),
 q("E21-Q7","RC2-F07","medium","Which statement is supported?","Local labour and warranty terms can affect actual repair cost",["Repair cost depends only on product colour","Every repairable product is durable","Manuals never matter for repair"],"The passage directly identifies local labour, warranty conditions and failure type as factors that can change repair cost.","depends on local labour"),
 q("E21-Q8","RC2-F08","easy","In context, “comparative” most nearly means:","useful for comparing one option with another",["secret and unavailable","legally compulsory","unrelated to choice"],"The label is described as adding another dimension that lets buyers compare products rather than dictating a single answer.","value of the label is therefore comparative")
 ]
},
{
 id:"ENG008-RC2-E22",title:"Public Dashboards Need Clear Definitions",genre:"editorial",
 text:`Small public dashboards are increasingly used to show school attendance, hospital queues, water levels or local spending. Their weakness is often not a lack of numbers but a lack of definitions.

A chart may show that “cases resolved” increased by 20 per cent, but users cannot interpret the change unless they know what counts as a case and when it is considered resolved. A dashboard that changes a definition without marking the change can create a false trend.

Definitions do not need to dominate the screen. A short note, an information icon or a linked methods page can explain the measure while keeping the main display simple.

Time periods also matter. Monthly totals should not be compared casually with weekly averages. If data is incomplete for the latest period, that should be visible rather than hidden behind a polished chart.

Good dashboards therefore require editorial discipline as well as technical skill. Designers must decide which measures deserve space, how to label them and what context a reader needs before drawing conclusions.

More data is not automatically more transparency. A smaller dashboard with clear definitions can be more informative than a crowded one full of unexplained indicators. The goal is not to display everything that can be counted, but to make the displayed numbers understandable and comparable.

This context is especially important when a dashboard is updated frequently, because readers may otherwise assume that every change in the line represents a real change in the underlying situation.`,
 questions:[
 q("E22-Q1","RC2-F01","easy","Why can the phrase “cases resolved” be hard to interpret?","Readers may not know what counts as a case or when it is considered resolved",["It is always measured in money","The words cannot appear on a chart","Cases are never counted"],"The passage says the number has little meaning unless the underlying definition of both the case and resolution is clear.","what counts as a case"),
 q("E22-Q2","RC2-F02","medium","What can be inferred if a definition changes without being marked?","A trend may appear to change even when the underlying situation has not changed in the same way",["The dashboard becomes legally invalid","Every value becomes zero","Readers automatically see the change"],"Changing the measurement rule can alter the displayed series, which may make a methodological change look like a real-world trend.","create a false trend"),
 q("E22-Q3","RC2-F03","medium","Which summary is most accurate?","Public dashboards need clear definitions, comparable time periods and visible limitations",["Dashboards should show every available number","Charts are useful only for experts","Definitions should replace all visual displays"],"The passage argues for context that lets readers interpret selected indicators correctly rather than simply adding more data.","understandable and comparable"),
 q("E22-Q4","RC2-F04","hard","What is the author's tone?","Analytical and cautionary",["Celebratory and promotional","Mocking","Completely opposed to dashboards"],"The author accepts dashboards as useful but warns that unclear definitions and periods can lead readers to false conclusions.","not automatically more transparency"),
 q("E22-Q5","RC2-F05","medium","Why does the author mention information icons and methods pages?","To show that definitions can be provided without crowding the main display",["To argue that charts should be hidden","To recommend removing labels","To describe website advertising"],"These examples demonstrate practical ways to supply context while keeping a dashboard visually simple.","while keeping the main display simple"),
 q("E22-Q6","RC2-F06","hard","Which conclusion follows most logically?","Transparency depends on making data interpretable, not merely making more data visible",["The largest dashboard is always the most transparent","Incomplete periods should look complete","All time periods are directly comparable"],"The final argument explicitly separates the quantity of displayed data from the clarity needed for meaningful interpretation.","More data is not automatically more transparency"),
 q("E22-Q7","RC2-F07","medium","Which statement is supported?","Incomplete data for the latest period should be clearly identified",["Monthly totals should always be compared with weekly averages","Definitions must occupy most of the screen","Every line movement represents a real event"],"The passage directly says that incomplete recent data should be visible rather than hidden by presentation.","data is incomplete for the latest period"),
 q("E22-Q8","RC2-F08","easy","In context, “indicator” most nearly means:","a measure used to represent some aspect of performance or conditions",["a decorative icon only","a private password","a legal penalty"],"The word refers to the different measures shown on a dashboard to communicate conditions or outcomes.","unexplained indicators")
 ]
},
{
 id:"ENG008-RC2-E23",title:"Queue Numbers Should Leave Room for Human Help",genre:"editorial",
 text:`Numbered queue systems are useful because they let people sit, move around a waiting area and know roughly when their turn is approaching. Problems begin when the number becomes the only way to communicate.

A person may miss a call because of hearing difficulty, a language barrier or a brief trip to another counter. Someone with an urgent question may not know whether it belongs in the same queue at all.

For this reason, a queue display should be supported by clear signs and an identifiable staff member who can answer short process questions. Human help does not have to replace the numbered system. It can handle the exceptions that the system was not designed to understand.

Staff should also be able to explain what happens after a missed number. If the rule is hidden, people may crowd the counter because they fear losing their place permanently.

Technology works best when it reduces routine uncertainty without making unusual cases harder to solve. A well-designed queue system can automate order while leaving room for judgement.

The purpose of a queue number is to organise service, not to prevent conversation. Efficiency improves when common cases move smoothly and people with genuine exceptions can quickly find the right kind of help.

This is particularly important in public offices, clinics and banks, where visitors may be unfamiliar with the process and may not know which exceptions require staff attention.`,
 questions:[
 q("E23-Q1","RC2-F01","easy","What advantage of numbered queues does the passage identify?","People can wait without standing continuously at the counter",["They eliminate every service delay","They remove the need for signs","They guarantee that no number is missed"],"The opening paragraph explains that people can sit or move around while still knowing roughly when their turn is approaching.","let people sit, move around"),
 q("E23-Q2","RC2-F02","medium","What can be inferred about unusual cases?","A purely automated queue may not provide enough guidance for them",["They should always be placed last","They never occur in public offices","They can be solved only by longer queues"],"The author argues that staff assistance is needed for exceptions that the standard queue process was not designed to interpret.","handle the exceptions"),
 q("E23-Q3","RC2-F03","medium","Which summary is most accurate?","Queue technology should organise routine service while preserving access to human guidance for exceptions",["Numbered queues should be abandoned","Every visitor needs individual assistance","Displays should replace all staff"],"The passage supports automation for routine order but explicitly keeps a human route for unclear or exceptional situations.","automate order while leaving room for judgement"),
 q("E23-Q4","RC2-F04","hard","What is the author's tone?","Balanced and practical",["Hostile to technology","Celebratory without qualification","Humorous and dismissive"],"The author recognises the value of numbered systems while identifying conditions under which staff support remains necessary.","useful because ... Problems begin"),
 q("E23-Q5","RC2-F05","medium","Why does the author discuss missed numbers?","To show why people need a clear rule for what happens when the normal sequence is interrupted",["To argue that numbers should never be called","To explain how tickets are printed","To recommend longer waiting times"],"A hidden missed-number rule creates uncertainty and can cause unnecessary crowding near the service counter.","what happens after a missed number"),
 q("E23-Q6","RC2-F06","hard","Which conclusion follows most logically?","Efficiency can improve when routine steps are automated and exceptions have a clear human route",["Automation is efficient only when no staff are present","Every exception should restart the whole queue","Conversation always slows service"],"The passage defines a complementary role for technology and staff rather than treating them as competing alternatives.","common cases move smoothly"),
 q("E23-Q7","RC2-F07","medium","Which statement is supported?","Unclear missed-number rules may cause people to crowd the counter",["Queue numbers prevent language barriers","Urgent questions always belong in the normal queue","Public offices should remove waiting areas"],"The fourth paragraph directly connects hidden rules with fear of losing a place and increased crowding.","people may crowd the counter"),
 q("E23-Q8","RC2-F08","easy","In context, “routine” most nearly means:","common and regularly occurring",["secret","emergency","unplanned"],"The author contrasts ordinary, repeated cases with unusual exceptions that may need staff judgement.","routine uncertainty")
 ]
},
{
 id:"ENG008-RC2-R16",title:"A District Library Extends Evening Hours",genre:"current-affairs-report",
 text:`A district library extended weekday closing time from 7 p.m. to 9 p.m. at three branches for a six-week trial. The change was introduced after students and shift workers said the earlier schedule limited evening access.

Visitor counts rose after 7 p.m., but the increase was not equal across branches. The branch near the college recorded the largest late-evening use. A residential branch attracted fewer additional visitors but saw more people using computers for job applications.

The library also tracked staffing and electricity costs. These increased, although not enough during the trial to cancel the extra hours.

One concern was transport. Some staff and visitors said the final bus departures made 9 p.m. closing less convenient on certain routes. The library adjusted staff rosters and posted nearby bus times at the exit.

Officials concluded that the extra hours were useful, but a single schedule might not suit every branch. The next trial will keep the college branch open until 9 p.m. and test an 8 p.m. closing time at the residential branch.

The library will compare not only total visits but also computer sessions, study-seat use and staffing costs before deciding on a permanent timetable.

The trial also found that late visitors stayed for different reasons. College users mainly occupied study seats, while the residential branch recorded shorter computer and document-printing visits. That difference will be considered when staffing the extra hours.`,
 questions:[
 q("R16-Q1","RC2-F01","easy","Which branch recorded the largest increase in late-evening use?","The branch near the college",["The residential branch","Every branch had the same increase","A branch that closed at 6 p.m."],"The report says the college-area branch had the strongest use after the original 7 p.m. closing time.","largest late-evening use"),
 q("R16-Q2","RC2-F02","medium","What can be inferred from the different patterns across branches?","The best closing time may depend on how each branch is used",["All branches should immediately stay open until midnight","Visitor numbers are unrelated to location","Computer use fell everywhere"],"The library plans different schedules because demand and activities varied between the college and residential branches.","single schedule might not suit every branch"),
 q("R16-Q3","RC2-F03","medium","Which summary is most accurate?","Longer hours increased access, but the library is adjusting schedules to local demand, costs and transport",["The trial failed because no one visited after 7 p.m.","The library ignored staffing costs","Every branch will permanently close at 9 p.m."],"The report presents a useful increase in access together with branch differences and operational considerations that still need testing.","extra hours were useful"),
 q("R16-Q4","RC2-F04","hard","What is the tone of the report?","Measured and evidence-based",["Promotional and absolute","Angry","Humorous"],"The report gives both benefits and constraints, including costs, transport and different patterns of use, without claiming a universal answer.","not equal across branches"),
 q("R16-Q5","RC2-F05","medium","Why were nearby bus times posted at the exit?","Some late users and staff were concerned about final bus departures",["The library began selling bus tickets","The college asked for a new route","Electricity costs were too high"],"Transport was identified as a practical limit on the usefulness of a later closing time for some people.","final bus departures"),
 q("R16-Q6","RC2-F06","hard","Which conclusion is justified?","Total visitor count alone is not enough to choose a permanent evening schedule",["Staffing cost does not matter","Every late visitor uses a study seat","The residential branch has no evening demand"],"The library plans to examine activity type and staffing costs as well as total visits before making a permanent decision.","not only total visits"),
 q("R16-Q7","RC2-F07","medium","Which statement is supported?","The residential branch had more evening computer use related to job applications",["The college branch had no students","Electricity costs fell","The trial lasted six months"],"The report directly notes job-application computer use at the residential branch during the extended hours.","computers for job applications"),
 q("R16-Q8","RC2-F08","easy","In context, “timetable” most nearly means:","the planned schedule of opening and closing times",["a list of book prices","a transport ticket","a staff complaint"],"The word refers to the permanent operating schedule the library will choose after comparing the trial evidence.","permanent timetable")
 ]
},
{
 id:"ENG008-RC2-R17",title:"A City Market Tests Reusable-Cup Deposits",genre:"current-affairs-report",
 text:`A city market tested a reusable-cup deposit system at twelve tea and juice stalls during a month-long festival. Customers who chose a reusable cup paid a small deposit that was returned when the cup was brought back to any participating stall.

Most cups were returned on the same day. Return rates were highest near exits where collection crates were easy to see. Stalls located farther from a return point reported more customers asking where cups could be handed back.

The trial reduced the number of disposable cups used by participating stalls, but washing created extra work. A central cleaning station was added in the second week so individual sellers did not have to wash large batches themselves.

Some customers kept cups as souvenirs, which meant the deposit fund had to cover replacements. Organisers had expected some losses and included them in the trial budget.

The city concluded that the system worked best when return points were obvious and cleaning responsibility was shared. It plans a second test at a weekly market, where visitors stay for less time and buying patterns may be different.

Officials said the next trial will measure both cup return rates and the total cost of collection, washing and replacement.

Organisers also recorded how long cups remained outside the cleaning station. Faster circulation mattered during busy periods because the scheme needed enough clean cups available without buying an unnecessarily large spare stock.`,
 questions:[
 q("R17-Q1","RC2-F01","easy","When was the reusable-cup deposit returned to customers?","When the cup was returned to a participating stall",["When a customer bought a second drink","At the end of the month","Only if the cup was unused"],"The deposit system refunded the small payment when a reusable cup came back to any stall taking part in the scheme.","brought back to any participating stall"),
 q("R17-Q2","RC2-F02","medium","What can be inferred about visible return points?","They made it easier for customers to return cups promptly",["They reduced the price of drinks","They removed the need for washing","They caused more cups to be kept as souvenirs"],"Return rates were highest where collection crates were easy to see, while less-visible locations generated more questions.","collection crates were easy to see"),
 q("R17-Q3","RC2-F03","medium","Which summary is most accurate?","The deposit trial reduced disposable-cup use but required visible returns, shared cleaning and cost tracking",["The trial eliminated all cup losses","Sellers refused to use reusable cups","Return location had no effect"],"The report presents environmental benefit together with operational work involving returns, washing and replacement.","worked best when return points were obvious"),
 q("R17-Q4","RC2-F04","hard","What is the tone of the report?","Positive but operationally cautious",["Triumphant and absolute","Hostile to customers","Comedic"],"The report notes success in reducing disposable use while also discussing washing, losses, circulation and costs that need further testing.","but washing created extra work"),
 q("R17-Q5","RC2-F05","medium","Why was a central cleaning station added?","To prevent individual stalls from having to wash large batches themselves",["To collect customer deposits","To sell souvenir cups","To reduce the number of return points"],"The central station redistributed the cleaning workload that had become an operational burden for participating sellers.","did not have to wash large batches"),
 q("R17-Q6","RC2-F06","hard","Which conclusion is justified?","A reusable-cup system must manage circulation and cleaning as well as customer returns",["Deposits guarantee that every cup comes back","Washing costs can be ignored","A larger spare stock is always better"],"The trial shows that a successful return rate is only one part of keeping enough clean cups available at busy times.","measure both cup return rates and the total cost"),
 q("R17-Q7","RC2-F07","medium","Which statement is supported?","Some customers kept reusable cups instead of returning them",["No cup was lost","Every stall washed cups separately throughout the trial","The next test will be at another festival"],"The report directly says some cups were kept as souvenirs and replacements were funded from expected losses.","kept cups as souvenirs"),
 q("R17-Q8","RC2-F08","easy","In context, “circulation” most nearly means:","the movement of cups through use, return and cleaning",["the number of market entrances","the temperature of drinks","the amount of deposit money"],"The final paragraph discusses how quickly cups moved back through the system so clean cups were available again.","how long cups remained outside the cleaning station")
 ]
},
{
 id:"ENG008-RC2-R18",title:"A Bus Depot Protects Minimum Driver Rest",genre:"current-affairs-report",
 text:`A regional bus depot changed driver rest scheduling on two intercity routes after records showed that long delays sometimes reduced the planned break between return trips.

For eight weeks, dispatchers tested a rule that protected a minimum rest period even when the incoming bus arrived late. The next departure could be reassigned to a standby driver or delayed slightly rather than automatically shortening the original driver's break.

The number of severely shortened breaks fell. Departure punctuality declined by a small amount on days when standby staff were unavailable, but most trips still left within the depot's normal tolerance.

Drivers reported that the new rule made rest periods more predictable. Dispatchers said the system required clearer information because a late incoming trip could now affect several later assignments.

The depot did not claim that the trial proved a direct safety benefit. It measured scheduling outcomes and driver feedback, not accident risk.

Managers decided to continue the rule while studying staffing levels. They will compare the cost of standby coverage with delays created when no replacement driver is available.

The trial showed that protecting one scheduling condition can shift pressure elsewhere, so the depot is evaluating rest, punctuality and staffing together.

The depot will also separate delays caused by the rest rule from delays caused by traffic or mechanical faults. Managers said that distinction is necessary before deciding how much standby capacity is actually justified.`,
 questions:[
 q("R18-Q1","RC2-F01","easy","What happened when an incoming delay threatened the minimum rest period?","A standby driver could take the next trip or the departure could be delayed",["The original driver always lost the break","The route was permanently cancelled","Passengers drove the bus"],"The trial protected the break by changing the next assignment or accepting a small departure delay instead of shortening rest automatically.","reassigned to a standby driver"),
 q("R18-Q2","RC2-F02","medium","What can be inferred about standby staffing?","It can reduce the punctuality trade-off created by protecting rest periods",["It makes every incoming bus arrive on time","It removes traffic delays","It eliminates the need for scheduling"],"Punctuality worsened mainly on days when standby drivers were not available, suggesting replacement capacity helps absorb the conflict.","standby staff were unavailable"),
 q("R18-Q3","RC2-F03","medium","Which summary is most accurate?","Protecting minimum rest reduced shortened breaks but created scheduling and staffing trade-offs that still need study",["The trial proved that accidents fell","All departures became earlier","Rest periods were removed from schedules"],"The report balances improved rest predictability with small punctuality effects and a need to evaluate standby costs.","evaluating rest, punctuality and staffing together"),
 q("R18-Q4","RC2-F04","hard","What is the tone of the report?","Cautious and analytical",["Celebratory and conclusive","Dismissive of driver rest","Humorous"],"The report clearly limits what the trial can prove and separates measured scheduling outcomes from unmeasured safety effects.","did not claim ... direct safety benefit"),
 q("R18-Q5","RC2-F05","medium","Why will the depot separate different causes of delay?","To estimate how much delay is actually attributable to the rest rule",["To stop recording traffic problems","To reduce driver feedback","To remove standby drivers"],"Managers need to distinguish the policy's effect from traffic and mechanical causes before choosing an appropriate staffing level.","separate delays caused by the rest rule"),
 q("R18-Q6","RC2-F06","hard","Which conclusion is justified?","Improving one scheduling objective can create pressure on another objective",["Minimum rest always improves punctuality","Standby coverage has no cost","All late trips are caused by the policy"],"The trial shows that protecting rest may affect departure timing and staffing needs, so the objectives must be assessed together.","shift pressure elsewhere"),
 q("R18-Q7","RC2-F07","medium","Which statement is supported?","Most trips still left within the depot's normal punctuality tolerance",["Every departure was delayed","No driver preferred the new rule","The trial measured accident risk directly"],"The report states that punctuality slipped slightly on some days but most trips remained within the normal tolerance.","most trips still left within"),
 q("R18-Q8","RC2-F08","easy","In context, “predictable” most nearly means:","more consistent and easier to anticipate",["shorter in every case","completely optional","unrecorded"],"Drivers said the rule made rest periods more reliable in advance instead of allowing delays to shrink them unexpectedly.","rest periods more predictable")
 ]
},
{
 id:"ENG008-RC2-R19",title:"A Wholesale Market Introduces a Digital Stall Map",genre:"current-affairs-report",
 text:`A wholesale market introduced a digital stall map to help visitors locate traders after repeated complaints that paper directories became outdated when seasonal vendors changed places.

For a ten-week pilot, each stall received a number linked to a searchable map. Visitors could search by trader name or product category and see the nearest entrance.

Search logs showed that product-category searches were more common than searches for individual traders. Spices, packaging materials and fresh produce were among the most frequently searched categories.

The system also exposed a maintenance problem. When a stall changed hands, its listing sometimes remained unchanged until market staff received a manual update. The market added a daily change form for supervisors so the map could be corrected before opening.

Older visitors were less likely to use the map on their own, so printed zone boards remained at major junctions. Staff also helped visitors at an information desk.

Officials concluded that the digital map improved navigation, but only when location data was kept current and non-digital guidance remained available.

The market will now test whether QR codes at entrances increase map use without reducing the need for visible physical signs.

During the pilot, supervisors also checked whether search results led visitors to the correct zone. Most did, but spelling differences in trader names occasionally reduced search success, so the market added common alternate spellings to the index.`,
 questions:[
 q("R19-Q1","RC2-F01","easy","What kind of search was more common on the digital map?","Searches by product category",["Searches by bus route","Searches by stall colour","Searches by customer name"],"The search logs showed that visitors more often looked for types of products than for a particular trader by name.","product-category searches were more common"),
 q("R19-Q2","RC2-F02","medium","What can be inferred from the need for a daily change form?","A digital map can become inaccurate if location data is not updated quickly",["Digital maps never need maintenance","Seasonal vendors never move","Printed boards update themselves"],"The pilot found that stall changes could leave old listings in place, so a routine update process was necessary.","listing sometimes remained unchanged"),
 q("R19-Q3","RC2-F03","medium","Which summary is most accurate?","The digital map improved navigation but depended on current data and continued non-digital support",["The map made physical signs unnecessary","Visitors searched only for individual traders","The pilot removed the information desk"],"The report treats the map as useful while preserving printed guidance and addressing data maintenance and search issues.","only when location data was kept current"),
 q("R19-Q4","RC2-F04","hard","What is the tone of the report?","Measured and practical",["Uncritically enthusiastic","Hostile to older visitors","Alarmist"],"The report describes gains, maintenance problems and accessibility limits without exaggerating either success or failure.","improved navigation, but only when"),
 q("R19-Q5","RC2-F05","medium","Why were common alternate spellings added to the index?","Different spellings of trader names sometimes caused unsuccessful searches",["Product categories were removed","QR codes could not be printed","Zone boards were too large"],"The pilot identified spelling variation as a search problem, so alternate forms were added to improve matching.","spelling differences in trader names"),
 q("R19-Q6","RC2-F06","hard","Which conclusion is justified?","Digital navigation works best when data maintenance is treated as part of the service",["Once launched, a map needs no staff attention","Printed signs should always be removed","Trader names should never be searchable"],"The map's usefulness depended on correcting stall changes promptly, showing that maintenance is essential rather than separate.","map could be corrected before opening"),
 q("R19-Q7","RC2-F07","medium","Which statement is supported?","Printed zone boards remained available at major junctions",["Every visitor used the digital map independently","The pilot lasted one year","No seasonal vendor changed location"],"The report directly states that physical zone boards were retained because not all visitors used the digital tool on their own.","printed zone boards remained"),
 q("R19-Q8","RC2-F08","easy","In context, “index” most nearly means:","the searchable list of names and terms used to find entries",["a map's physical frame","a payment receipt","a stall's rent"],"Alternate spellings were added so searches could match more forms of a trader's name, which describes a searchable index.","added common alternate spellings to the index")
 ]
}
] as const;
