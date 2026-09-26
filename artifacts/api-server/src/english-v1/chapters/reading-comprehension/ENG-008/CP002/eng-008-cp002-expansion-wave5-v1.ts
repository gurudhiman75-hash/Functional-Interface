import type{Eng008Cp002PassageV1}from"./eng-008-cp002-authorities-v1";
const q=(id:string,familyId:any,difficulty:any,question:string,correctAnswer:string,distractors:readonly[string,string,string],explanation:string,evidence:string)=>({id,familyId,difficulty,question,correctAnswer,distractors,explanation,evidence});
export const ENG008_CP002_EXPANSION_WAVE5_V1:readonly Eng008Cp002PassageV1[]=[
{
 id:"ENG008-RC2-E14",title:"Emergency Instructions Should Be Designed for Stressful Moments",genre:"editorial",
 text:`Emergency instructions are often written as if readers will study them calmly. In reality, people may look at them only when something has already gone wrong. That changes what good communication should look like.

A long paragraph may be legally complete but hard to use when someone is anxious or in a hurry. The first actions should therefore be visible immediately: where to go, what to avoid and who to contact.

This does not mean removing important detail. Background information, warnings and exceptions can still appear below the first steps. The order matters because people under pressure tend to scan before they read carefully.

Visual design also matters. Large headings, short numbered steps and familiar symbols can help, but only if the symbols are widely understood. Decorative graphics should not compete with the instruction itself.

Emergency communication should also be tested with ordinary users rather than only with the people who wrote it. An instruction that seems obvious to a trained employee may confuse someone seeing the situation for the first time.

Good emergency guidance therefore combines accuracy with speed of understanding. The goal is not merely to include every correct fact, but to make the most important action hard to miss when attention is limited. This approach also helps when instructions must work across languages. A clear hierarchy of actions makes translation easier because translators can preserve the order of urgent steps instead of reproducing a dense block of text.`,
 questions:[
 q("E14-Q1","RC2-F01","easy","What does the author say should appear first in emergency instructions?","The immediate actions people need to take",["The history of the building","Legal background","Decorative graphics"],"The passage says the first actions should be visible immediately.","first actions should therefore be visible immediately"),
 q("E14-Q2","RC2-F02","medium","Why can long paragraphs be a problem in emergencies?","People may be stressed and unable to read carefully",["Long text is always inaccurate","Legal information is unnecessary","People never read signs"],"The passage emphasises limited attention and hurried scanning.","anxious or in a hurry"),
 q("E14-Q3","RC2-F03","medium","Which summary is most accurate?","Emergency instructions should remain accurate while making essential actions easy to find under pressure",["Emergency notices should contain only symbols","Legal details should be removed","People should memorise all procedures"],"The central argument balances completeness with usability.","accuracy with speed of understanding"),
 q("E14-Q4","RC2-F04","hard","What is the author's tone?","Practical and cautionary",["Humorous","Dismissive","Celebratory"],"The author explains a risk and proposes design principles.","Good emergency guidance"),
 q("E14-Q5","RC2-F05","medium","Why does the author mention ordinary users?","To show that instructions should be tested with people who lack specialist familiarity",["To replace trained staff","To avoid legal review","To reduce emergency drills"],"The passage warns that trained writers may overestimate clarity.","seeing the situation for the first time"),
 q("E14-Q6","RC2-F06","hard","Which conclusion follows most logically?","A technically correct instruction can still fail if users cannot identify the key action quickly",["Short instructions are always complete","Symbols eliminate the need for words","Stress improves comprehension"],"The entire passage distinguishes correctness from usability.","not merely to include every correct fact"),
 q("E14-Q7","RC2-F07","medium","Which statement is supported?","Details and exceptions can remain below the urgent steps",["Warnings should be deleted","Only employees need instructions","Graphics should dominate the page"],"The third paragraph says detail can remain lower in the notice.","can still appear below the first steps"),
 q("E14-Q8","RC2-F08","easy","In context, “scan” most nearly means:","look over quickly for important information",["read aloud","rewrite carefully","ignore completely"],"The passage contrasts scanning with careful reading.","scan before they read carefully")
 ]
},
{
 id:"ENG008-RC2-E15",title:"Public Data Should Show When a Series Changes Meaning",genre:"editorial",
 text:`Public dashboards often present long lines of data that appear directly comparable from year to year. That appearance can be misleading when the way a measure is collected or defined changes.

A crime series, for example, may rise after reporting rules improve. A school attendance series may change when remote classes begin to count differently. Without a note, readers may assume the underlying behaviour changed when part of the movement came from measurement.

Good data communication should therefore mark breaks in a series clearly. A vertical line, note or short explanation can show that values before and after a change should not be compared mechanically.

This does not make the newer data less useful. A better method may produce more accurate information than the older one. The problem is only when the transition is hidden.

Analysts also need to decide whether older data can be recalculated under the new definition. Sometimes that is possible; sometimes the underlying records do not contain enough detail.

A transparent dashboard should not pretend away these limits. It should help readers distinguish real change from changes in measurement so that a clean-looking chart does not create false certainty. Version dates are useful for the same reason. If a dashboard clearly states when a definition changed, later readers can understand why two apparently continuous points may not represent exactly the same concept.`,
 questions:[
 q("E15-Q1","RC2-F01","easy","What problem can occur when a data definition changes?","Values from different periods may no longer be directly comparable",["All older data becomes false","Charts cannot be used","New data always falls"],"The passage directly warns against mechanical comparison across a definition change.","should not be compared mechanically"),
 q("E15-Q2","RC2-F02","medium","What can be inferred about improved reporting rules?","They can make recorded values rise even without an equally large real-world increase",["They always reduce recorded values","They make data useless","They remove the need for notes"],"The crime example illustrates a measurement-driven increase.","may rise after reporting rules improve"),
 q("E15-Q3","RC2-F03","medium","Which summary is most accurate?","Public data should clearly mark methodological breaks so readers can separate measurement change from real change",["Old data should be deleted","Dashboards should avoid long time series","New methods are less accurate"],"The passage repeatedly argues for visible break notes.","mark breaks in a series clearly"),
 q("E15-Q4","RC2-F04","hard","What is the author's tone?","Analytical and cautionary",["Sarcastic","Promotional","Hostile toward data"],"The author supports data use while warning about interpretation.","does not make the newer data less useful"),
 q("E15-Q5","RC2-F05","medium","Why does the author discuss recalculating older data?","To show one possible way to restore comparability after a method change",["To argue old data should always be changed","To prove all records are complete","To remove methodological notes"],"Recalculation can sometimes align older values with the new definition.","whether older data can be recalculated"),
 q("E15-Q6","RC2-F06","hard","Which conclusion follows most logically?","A smooth-looking trend line can hide a break in what the numbers actually represent",["Every change in a chart is methodological","Data notes reduce transparency","New data should never be compared"],"The conclusion warns that a clean chart can create false certainty.","clean-looking chart"),
 q("E15-Q7","RC2-F07","medium","Which statement is supported?","Some historical records may not contain enough detail for recalculation",["All old data can be converted","Method changes should be hidden","Only crime data has this problem"],"The fifth paragraph states this directly.","do not contain enough detail"),
 q("E15-Q8","RC2-F08","easy","In context, “mechanically” most nearly means:","without considering important differences",["using a machine","very slowly","with perfect accuracy"],"The word describes comparing values without accounting for a methodological break.","compared mechanically")
 ]
},
{
 id:"ENG008-RC2-R10",title:"A Municipality Tests Evening Street Sweeping",genre:"current-affairs-report",
 text:`A municipality moved street sweeping on six market roads from early morning to late evening for an eight-week trial. Shopkeepers had complained that morning cleaning sometimes happened after deliveries had already begun, making it harder for sweepers to reach the kerb.

During the trial, crews reported fewer parked delivery vehicles in their way after 9 p.m. The amount of litter collected per shift increased slightly on four of the six roads.

The result was not identical everywhere. Two roads contained restaurants that remained busy late into the night, and sweeping there still faced obstacles.

Residents living above shops also reported more noise from cleaning vehicles during the first two weeks. The municipality adjusted the route order so the loudest equipment passed residential stretches earlier in the evening.

The trial did not measure whether total litter generation changed. It only tested whether a different cleaning time made existing work easier.

Officials concluded that evening sweeping improved access on several market roads but needed local adjustment where late-night activity or residential noise was important. The next phase will compare labour time, complaints and cleanliness ratings before deciding whether to expand the schedule. The municipality also recorded fuel use because a later schedule could change travel patterns between roads. That measure did not show a large difference, but officials decided to keep it in the next trial so operational cost would not be judged only through labour time.`,
 questions:[
 q("R10-Q1","RC2-F01","easy","Why was evening sweeping tested?","Morning delivery vehicles were obstructing cleaning",["Streetlights were too bright","Shops opened only at night","Residents requested louder equipment"],"The opening paragraph directly identifies delivery traffic as the problem.","making it harder for sweepers to reach the kerb"),
 q("R10-Q2","RC2-F02","medium","What can be inferred about the two restaurant roads?","Late-night activity reduced some of the benefit of evening cleaning",["They had no litter","Restaurants closed early","Sweeping was cancelled permanently"],"Those roads still had obstacles because they remained busy late.","still faced obstacles"),
 q("R10-Q3","RC2-F03","medium","Which summary is most accurate?","Evening sweeping improved access on several roads but required local adjustment for noise and late activity",["Evening cleaning solved every problem","Morning cleaning was banned citywide","Restaurants caused all litter"],"The conclusion gives a mixed but positive result.","improved access ... needed local adjustment"),
 q("R10-Q4","RC2-F04","hard","What is the tone of the report?","Cautiously positive",["Promotional and absolute","Dismissive","Alarmist"],"The report notes benefits and location-specific drawbacks.","not identical everywhere"),
 q("R10-Q5","RC2-F05","medium","Why did the municipality change the route order?","To reduce noise impact on residents",["To collect less litter","To avoid all restaurants","To shorten market hours"],"The fourth paragraph directly links route order to noise complaints.","passed residential stretches earlier"),
 q("R10-Q6","RC2-F06","hard","Which conclusion is justified?","Cleaning time should be evaluated together with local street activity",["Evening is always the best cleaning time","Litter generation definitely fell","Noise complaints should be ignored"],"The report shows that results differ by road conditions.","local adjustment"),
 q("R10-Q7","RC2-F07","medium","Which statement is supported?","The trial tested cleaning access rather than whether people created less litter",["All six roads collected more litter","Residents preferred more noise","Deliveries stopped during the trial"],"The fifth paragraph states this explicitly.","did not measure whether total litter generation changed"),
 q("R10-Q8","RC2-F08","easy","In context, “kerb” most nearly refers to:","the edge of the road beside the pavement",["a market stall","a cleaning vehicle","a restaurant entrance"],"Sweepers needed access to the road edge.","reach the kerb")
 ]
},
{
 id:"ENG008-RC2-R11",title:"A District Tests Appointment Tokens at Service Centres",genre:"current-affairs-report",
 text:`A district administration tested numbered appointment tokens at four public service centres where visitors previously formed informal queues. The aim was to reduce uncertainty about turn order rather than shorten every transaction.

Visitors received a token at entry and could sit until their number appeared on a display. During the six-week pilot, disputes about queue order fell at all four centres.

Average waiting time changed very little because the same number of counters remained open. However, survey responses showed that visitors felt less need to stand near the counter to protect their place.

One centre initially had difficulty because visitors could not easily see the display from the far side of the hall. A second screen was added there.

Staff also found that some elderly visitors needed help understanding when their number was called, so a spoken announcement was added alongside the visual display.

Officials concluded that the token system improved clarity and comfort without increasing service capacity. They plan to test whether appointment booking by time slot can reduce actual waiting, while keeping the token system for walk-in visitors. The district will also measure how often visitors leave before being served. A clearer queue may reduce uncertainty without reducing the wait, but abandonment rates could show whether comfort and predictability still affect whether people remain in the system.`,
 questions:[
 q("R11-Q1","RC2-F01","easy","What was the main purpose of the token system?","To make turn order clearer",["To increase the number of counters","To reduce every service time","To eliminate walk-in visits"],"The opening paragraph states the aim directly.","reduce uncertainty about turn order"),
 q("R11-Q2","RC2-F02","medium","Why did average waiting time change little?","Service capacity stayed the same",["Visitors refused tokens","The displays failed","Counters closed earlier"],"The same number of counters remained open.","same number of counters"),
 q("R11-Q3","RC2-F03","medium","Which summary is most accurate?","Tokens reduced queue uncertainty and disputes even though they did not materially shorten waits",["Tokens doubled capacity","Visitors preferred standing in line","Walk-ins were eliminated"],"The report distinguishes comfort/clarity from speed.","improved clarity and comfort without increasing service capacity"),
 q("R11-Q4","RC2-F04","hard","What is the tone of the report?","Measured and positive",["Celebratory and absolute","Hostile","Dismissive"],"The report notes gains alongside limitations and needed adjustments.","Average waiting time changed very little"),
 q("R11-Q5","RC2-F05","medium","Why was a second display added at one centre?","Some visitors could not see the first display clearly",["The first display showed wrong numbers","The hall doubled in size","Staff removed spoken announcements"],"The fourth paragraph directly explains the visibility problem.","could not easily see the display"),
 q("R11-Q6","RC2-F06","hard","Which conclusion is justified?","A queue system can improve perceived order without increasing throughput",["Visible displays always reduce service time","Tokens eliminate the need for staff","Every visitor understands visual alerts equally"],"The pilot improved clarity but not capacity.","without increasing service capacity"),
 q("R11-Q7","RC2-F07","medium","Which statement is supported?","Spoken announcements were added to help some elderly visitors",["All visitors disliked the displays","The centres stopped serving walk-ins","Queue disputes increased"],"The fifth paragraph states this directly.","spoken announcement was added"),
 q("R11-Q8","RC2-F08","easy","In context, “informal” most nearly means:","not organised by a fixed official system",["illegal","expensive","private"],"The earlier queues lacked structured token ordering.","informal queues")
 ]
}
] as const;