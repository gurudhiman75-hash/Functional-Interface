import type{Eng008Cp005PassageV1}from"./eng-008-cp005-authorities-v1";
const q=(id:string,familyId:any,difficulty:any,question:string,correctAnswer:string,distractors:readonly[string,string,string],explanation:string,evidence:string)=>({id,familyId,difficulty,question,correctAnswer,distractors,explanation,evidence});
export const ENG008_CP005_EXPANSION_WAVE7_V1:readonly Eng008Cp005PassageV1[]=[
{
 id:"ENG008-RS-W05",title:"Do Asynchronous Status Updates Reduce Meeting Time?",genre:"workplace-study",
 text:`A product team tested whether short written status updates could replace part of its weekly project meeting. For eight weeks, team members posted three points before the meeting: what changed, what was blocked and what decision was needed.

The meeting still took place, but routine progress reporting was removed from the agenda. Average meeting time fell by about twenty minutes.

The trial also changed preparation. Team members who posted clear updates were more likely to arrive with specific questions, while vague updates often led to the same discussion that had occurred before the trial.

The study had a selection issue. The team volunteering for the test already used written project tools more consistently than several other teams in the company.

Researchers also tracked whether shorter meetings caused more follow-up messages later. Message volume rose slightly, but the increase was much smaller than the meeting-time reduction.

One drawback appeared when a decision required rapid back-and-forth discussion. Written updates were useful for context, but they did not replace live conversation for every problem. The company concluded that asynchronous updates were associated with shorter meetings without a large rise in follow-up communication, but the result may not generalise to teams that rely less on written tools. A follow-up trial will rotate the practice across teams and classify agenda items by type. Researchers want to know which kinds of information can move safely to written updates and which still benefit from real-time discussion.

Researchers also want to measure whether asynchronous updates change who participates. In live meetings, faster speakers or senior staff may dominate discussion, while written updates give quieter team members more time to prepare a point. On the other hand, written channels may disadvantage people who are less comfortable expressing complex problems in text. The follow-up will therefore track whose issues reach the agenda and whether decision ownership becomes clearer or more uneven under the new system.

The company will also compare project stages. Early planning may require more live discussion because goals are still uncertain, while mature execution may benefit more from short written progress notes. If the effect differs by stage, a flexible meeting design may work better than one permanent rule. This would allow teams to keep synchronous time for ambiguity and negotiation while moving predictable status reporting into asynchronous channels.`,
 questions:[
 q("W05-Q1","RS-F01","medium","What happened to average meeting time during the trial?","It fell by about twenty minutes",["It doubled","It stayed unchanged","It was not measured"],"The second paragraph reports the reduction directly.","fell by about twenty minutes"),
 q("W05-Q2","RS-F02","medium","What can be inferred about clear written updates?","They may help live meetings focus on specific decisions",["They eliminate all meetings","They increase vague discussion","They are useful only after meetings"],"Clear updates were linked with more specific questions.","arrive with specific questions"),
 q("W05-Q3","RS-F03","medium","Which summary is most accurate?","Written status updates shortened meetings, but some issues still required live discussion and the volunteer team may not represent all teams",["Written updates fully replaced meetings","Follow-up communication disappeared","Every team already used written tools equally"],"The conclusion balances the benefit with generalisation and task-type limits.","associated with shorter meetings"),
 q("W05-Q4","RS-F04","hard","Which limitation most directly affects generalisation?","The volunteer team already used written project tools more consistently",["The trial lasted eight weeks","Meeting time was measured","Team members posted updates"],"The selected team may differ from other teams.","selection issue"),
 q("W05-Q5","RS-F05","hard","Which statement makes an unjustified causal claim?","Written updates will reduce meeting time by twenty minutes for every team",["The trial team had shorter meetings","Message volume rose slightly","Some decisions needed live discussion"],"The single volunteer team does not justify a universal effect.","may not generalise"),
 q("W05-Q6","RS-F06","hard","Which is a directly reported finding?","Follow-up message volume rose slightly",["All follow-up messages disappeared","Written updates reduced every discussion","Other teams had the same result"],"The fifth paragraph reports this directly.","Message volume rose slightly"),
 q("W05-Q7","RS-F07","hard","Which competing explanation is explicitly identified?","The participating team may already have been better suited to written coordination",["The company hired more staff","Meeting rooms became smaller","Project workload disappeared"],"The passage identifies pre-existing tool use as a selection difference.","already used written project tools more consistently"),
 q("W05-Q8","RS-F08","medium","Which next step is best supported?","Rotate the practice across teams and compare which agenda types work well asynchronously",["Remove all live meetings","Measure only message count","Ignore team differences"],"The final paragraph proposes this design.","rotate the practice across teams")
 ]
},
{
 id:"ENG008-RS-T05",title:"Do Better Bus-Shelter Seats Increase Waiting Comfort?",genre:"transport-survey",
 text:`A transport authority replaced narrow metal perches with full-width seats at ten bus shelters and compared passenger feedback with ten similar shelters that kept the old design.

For six weeks, observers recorded how often passengers sat, stood or leaned against the shelter. Seating use increased at the upgraded stops, especially among older passengers.

Survey respondents also rated waiting comfort higher. The difference was largest at stops where average waits exceeded ten minutes.

The comparison was not perfectly controlled. Several upgraded shelters also had slightly better shade because nearby trees had grown since the earlier site survey.

Researchers therefore compared shaded and less-shaded stops separately. The seating difference remained, but the comfort gap became smaller after accounting for shade.

One practical issue was cleaning. Wider seats collected more dust and leaves, so maintenance teams spent slightly longer cleaning some shelters. The authority also noted that more seating did not increase bus frequency or shorten waits. It changed the waiting experience rather than the transport service itself. Officials concluded that full seats were associated with higher comfort and greater use, particularly for longer waits, but shade and maintenance needs also mattered. A future trial will randomly upgrade matched shelters and include accessibility measures such as seat height and armrests.

The authority also plans to measure whether passengers with mobility limitations use the new seats differently. Seat height, back support and the presence of armrests can affect whether a seat is actually usable, even when the surface is wider. Researchers will therefore record accessibility features separately rather than treating all full-width seats as equivalent. A design that increases average use but remains difficult for some passengers would not fully meet the purpose of the upgrade.

Weather exposure may change the effect as well. During very hot or rainy periods, shade and shelter can matter more than seat shape. The next trial will therefore compare comfort under different weather conditions and record whether passengers choose to stand because the seat is wet, hot or occupied. This should help separate the value of seating from the wider quality of the shelter environment. Researchers will also record whether seats are occupied by bags or other objects, since nominal seating capacity may overstate the number of places actually available to passengers during busy periods.`,
 questions:[
 q("T05-Q1","RS-F01","medium","Which passengers showed especially higher seating use at upgraded shelters?","Older passengers",["Only school children","Drivers","Cyclists"],"The second paragraph states this directly.","especially among older passengers"),
 q("T05-Q2","RS-F02","medium","What can be inferred about waiting time?","Seat design may matter more when passengers wait longer",["Seats shorten bus travel time","Long waits eliminate comfort effects","Only short waits matter"],"The comfort difference was largest where waits exceeded ten minutes.","largest at stops where average waits exceeded ten minutes"),
 q("T05-Q3","RS-F03","medium","Which summary is most accurate?","Full-width seating was linked to greater comfort and use, while shade and maintenance also influenced the result",["New seats made buses arrive faster","Shade had no role","Maintenance became easier everywhere"],"The conclusion reports the benefit and confounding factors.","shade and maintenance needs also mattered"),
 q("T05-Q4","RS-F04","hard","Which limitation most directly affects the comfort comparison?","Some upgraded stops also had better shade",["The study lasted six weeks","Passengers could stand","Bus shelters existed"],"Shade could independently improve comfort.","slightly better shade"),
 q("T05-Q5","RS-F05","hard","Which statement makes an unjustified causal claim?","The new seats caused the entire increase in comfort ratings",["Comfort ratings were higher","Shade differed across stops","Cleaning took longer"],"The design cannot isolate seating from shade fully.","comfort gap became smaller"),
 q("T05-Q6","RS-F06","hard","Which is a directly reported finding?","Wider seats required slightly more cleaning at some shelters",["Bus frequency increased","All passengers sat down","Shade decreased"],"The sixth paragraph states this.","spent slightly longer cleaning"),
 q("T05-Q7","RS-F07","hard","Which competing explanation is explicitly identified?","Better shade at some upgraded shelters may have raised comfort ratings",["Bus fares fell","Stops were moved closer","Passengers received free tickets"],"The passage identifies shade as a confound.","slightly better shade"),
 q("T05-Q8","RS-F08","medium","Which next step is best supported?","Randomly upgrade matched shelters and measure accessibility features",["Replace every shelter immediately","Ignore maintenance","Measure only bus speed"],"The final paragraph proposes this design.","randomly upgrade matched shelters")
 ]
},
{
 id:"ENG008-RS-E05",title:"Do Reflective Roof Coatings Lower Classroom Heat?",genre:"environment-study",
 text:`A school district tested reflective roof coatings on six single-storey classroom blocks during late summer. Six similar blocks with standard dark roofs were used for comparison.

Temperature sensors recorded indoor and roof-surface temperature from noon to 5 p.m. On clear days, coated roofs were substantially cooler at the surface, while indoor classroom temperature was modestly lower.

The indoor effect varied. Rooms with strong ventilation showed smaller differences because air movement already reduced heat buildup.

The blocks were not randomly assigned. The district chose roofs that were due for maintenance, and several coated buildings were slightly newer than the comparison blocks.

Researchers adjusted for building age and recorded ventilation. The estimated indoor-temperature benefit became smaller but remained present.

Energy use was also monitored in rooms with air conditioning. Coated blocks used slightly less afternoon cooling energy on average, though equipment age differed across buildings. Maintenance staff reported no immediate problems with the coating, but the trial was too short to measure durability over several years. The district concluded that reflective roofs were associated with lower roof temperatures and modestly cooler classrooms, but building differences limited causal certainty. A larger trial will randomise treatment among comparable roofs and track coating condition, energy use and indoor comfort across multiple seasons.

Researchers will also examine nighttime cooling. A roof that stays cooler in the afternoon may help indoor conditions during occupied hours, but stored heat in walls and ceilings can also affect evening temperature. Sensors will therefore continue recording after sunset in the next phase. This will show whether reflective coatings mainly shift peak temperature or reduce total heat accumulation across the day.

Cost and durability will be included as well. A coating that lowers cooling energy modestly may still be worthwhile if it lasts many years and requires little maintenance, but less attractive if frequent recoating is needed. The district plans to compare installation cost, maintenance, energy savings and indoor comfort together. This broader measure will help determine whether the treatment is practical at scale rather than merely effective during a short summer test.`,
 questions:[
 q("E05-Q1","RS-F01","medium","What happened to roof-surface temperature on coated buildings?","It was substantially lower on clear days",["It rose sharply","It was not measured","It matched dark roofs exactly"],"The second paragraph reports this directly.","substantially cooler at the surface"),
 q("E05-Q2","RS-F02","medium","What can be inferred about ventilation?","It can reduce the additional indoor benefit observed from reflective roofs",["Ventilation increases roof temperature","It has no effect on classrooms","It makes coatings unnecessary everywhere"],"Rooms with strong ventilation had smaller differences.","strong ventilation showed smaller differences"),
 q("E05-Q3","RS-F03","medium","Which summary is most accurate?","Reflective coatings were linked to cooler roofs and modest indoor benefits, but building differences limit causal certainty",["Coatings eliminated classroom heat","Every building was randomly assigned","Durability was proven"],"The conclusion states the qualified result.","associated with lower roof temperatures"),
 q("E05-Q4","RS-F04","hard","Which limitation most directly affects causal interpretation?","Coated and comparison buildings were not randomly assigned and differed in age",["Temperatures were measured","The study occurred in summer","Roofs existed"],"Selection and building-age differences can confound results.","not randomly assigned"),
 q("E05-Q5","RS-F05","hard","Which statement makes an unjustified causal claim?","The coating alone caused the full indoor-temperature difference",["Coated roofs were cooler","Ventilation mattered","Building age differed"],"The observational design cannot isolate the full effect.","building differences limited causal certainty"),
 q("E05-Q6","RS-F06","hard","Which is a directly reported finding?","Some coated blocks used slightly less afternoon cooling energy",["All air-conditioning use ended","The coating lasted many years","Ventilation was identical"],"The sixth paragraph reports this directly.","used slightly less afternoon cooling energy"),
 q("E05-Q7","RS-F07","hard","Which competing explanation is explicitly identified?","Newer buildings and ventilation differences may explain part of the indoor effect",["Rainfall increased","Class sizes fell","Roof area doubled"],"The passage identifies these building characteristics.","building age and recorded ventilation"),
 q("E05-Q8","RS-F08","medium","Which next step is best supported?","Randomise coating across comparable roofs and track results over multiple seasons",["Coat every roof immediately","Ignore durability","Measure only roof colour"],"The final paragraph proposes this stronger design.","randomise treatment among comparable roofs")
 ]
},
{
 id:"ENG008-RS-D06",title:"Do Spaced Practice Reminders Improve Revision Regularity?",genre:"digital-learning-evaluation",
 text:`An exam-preparation platform tested reminders that encouraged learners to revisit a topic several days after first practising it. New users were randomly assigned either to receive spaced-practice reminders or to see only their normal daily study notification.

Over six weeks, users receiving spaced reminders returned to previously studied topics more often. They also completed revision on a greater number of separate days.

However, total question volume was similar between groups. The reminders appeared to change when learners practised more than how much they practised.

A delayed quiz showed a small advantage for the spaced-reminder group on topics they had actually revisited. The difference was weaker for reminders that users ignored.

Researchers cautioned that opening a reminder did not guarantee careful revision. Some users completed only a few questions before leaving the topic.

Survey responses suggested that learners liked reminders more when they named the exact topic rather than using a generic message such as “time to revise.” The platform also tracked notification fatigue. Users receiving too many other promotional messages were more likely to disable all notifications, including study reminders. The company concluded that targeted spaced reminders improved revision regularity and were associated with a small delayed-performance benefit when users actually revisited the material. A follow-up study will vary reminder frequency and separate study messages from promotional notifications.

Researchers also plan to examine whether reminder timing interacts with topic difficulty. A reminder after three days may work well for familiar vocabulary but be too late for a difficult concept that was never understood properly in the first session. The next experiment will therefore vary both interval and topic complexity. Learners who repeatedly answer a concept incorrectly may receive an earlier reminder, while stable topics may be spaced farther apart.

The platform will also distinguish reminder effectiveness from notification dependence. If learners revise only when prompted, regularity may disappear once reminders stop. A post-intervention period will therefore measure whether users continue spaced practice after notifications are withdrawn. This will help determine whether the system is building a durable study habit or simply creating temporary compliance while the external cue remains active.`,
 questions:[
 q("D06-Q1","RS-F01","medium","What changed most clearly for users receiving spaced reminders?","They returned to old topics on more separate days",["They answered twice as many total questions","They stopped daily study","They disabled all reminders"],"The second paragraph reports more topic returns and revision days.","greater number of separate days"),
 q("D06-Q2","RS-F02","medium","What can be inferred from similar total question volume?","The reminders mainly changed the timing and distribution of practice",["They greatly increased total practice","They reduced every study session","Question count was not measured"],"The passage explicitly distinguishes when from how much.","change when learners practised"),
 q("D06-Q3","RS-F03","medium","Which summary is most accurate?","Targeted spaced reminders improved revision regularity and showed a small delayed benefit when learners actually revisited topics",["Reminders doubled all exam scores","Generic messages worked best","Question volume rose sharply"],"The conclusion states this directly.","small delayed-performance benefit"),
 q("D06-Q4","RS-F04","hard","Which limitation most directly affects interpretation of reminder opens?","Opening a reminder did not guarantee meaningful revision",["The groups were not random","No delayed quiz was used","Topics were not named"],"The fifth paragraph identifies this behaviour gap.","did not guarantee careful revision"),
 q("D06-Q5","RS-F05","hard","Which statement makes an unjustified causal claim?","Every spaced reminder improves memory even when the user ignores it",["Revisited topics showed a small advantage","Total volume was similar","Generic reminders were less liked"],"Ignored reminders showed weaker effects and do not support universal benefit.","difference was weaker for reminders that users ignored"),
 q("D06-Q6","RS-F06","hard","Which is a directly reported finding?","Users preferred reminders that named the exact topic",["Promotional notifications improved revision","All users kept notifications on","Generic messages produced the best scores"],"The survey reports this preference.","liked reminders more when they named the exact topic"),
 q("D06-Q7","RS-F07","hard","Which competing mechanism is explicitly identified?","Notification fatigue from promotional messages may reduce exposure to study reminders",["Users received easier questions","Topics became shorter","The delayed quiz was optional"],"The seventh paragraph explains this pathway.","disable all notifications"),
 q("D06-Q8","RS-F08","medium","Which next step is best supported?","Test different reminder frequencies while separating study notifications from promotions",["Send as many reminders as possible","Remove topic names","Measure only question volume"],"The final paragraph proposes this design.","vary reminder frequency")
 ]
}
] as const;