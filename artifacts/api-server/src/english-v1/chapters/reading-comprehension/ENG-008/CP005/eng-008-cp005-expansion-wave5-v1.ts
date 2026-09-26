import type{Eng008Cp005PassageV1}from"./eng-008-cp005-authorities-v1";
const q=(id:string,familyId:any,difficulty:any,question:string,correctAnswer:string,distractors:readonly[string,string,string],explanation:string,evidence:string)=>({id,familyId,difficulty,question,correctAnswer,distractors,explanation,evidence});
export const ENG008_CP005_EXPANSION_WAVE5_V1:readonly Eng008Cp005PassageV1[]=[
{
 id:"ENG008-RS-W04",title:"Does a No-Meeting Morning Improve Deep Work?",genre:"workplace-study",
 text:`A software company tested a no-meeting morning policy in three teams for eight weeks. Between 9 a.m. and noon, internal meetings were blocked unless a production incident required immediate coordination.

The teams recorded how many uninterrupted work blocks employees completed and how often planned tasks were finished before lunch. Both measures improved modestly during the trial.

However, the company had also reduced the number of active projects during the same period. Fewer competing priorities may itself have made focused work easier.

Employee responses were mixed. Developers liked having predictable quiet time, while some project coordinators said important decisions were delayed until the afternoon.

The company compared days with urgent incidents against normal days. On incident days, the policy made little difference because teams still needed rapid communication.

The trial was not randomly assigned. The selected teams had volunteered because they already believed meetings were excessive, which may have influenced both behaviour and survey responses.

Managers also checked whether work simply shifted later into the day. Evening login time did not rise substantially, suggesting that at least some of the productivity gain reflected better use of morning hours rather than longer total work time.

The company concluded that protected morning time was associated with more uninterrupted work, but project mix and volunteer selection limited causal certainty. A future test will rotate the policy across teams and hold project load more constant. The follow-up will also record collaboration outcomes, because uninterrupted individual work is only one part of team performance. A policy that increases focus but delays necessary coordination could improve one metric while harming another. Researchers will therefore track task completion, rework and time spent waiting for decisions. They also plan to compare teams handling independent technical work with teams whose tasks require frequent cross-functional input. If benefits differ sharply, the company may adopt protected mornings selectively rather than as a universal rule. Researchers will also examine whether the protected period changes error rates, not only output volume. More completed tasks would be less valuable if rework rises later because employees rushed before lunch. Comparing first-pass quality, completion and collaboration together will show whether the policy improves productivity broadly or merely shifts when work is done. The follow-up will therefore use several outcome measures rather than treating uninterrupted time as the final objective.`,
 questions:[
 q("W04-Q1","RS-F01","medium","What happened to uninterrupted work blocks during the trial?","They increased modestly",["They disappeared","They were not measured","They fell sharply"],"The second paragraph directly reports improvement.","improved modestly"),
 q("W04-Q2","RS-F02","medium","What can be inferred about project load?","Fewer active projects may have contributed to the improvement",["Project load had no effect","More projects were added","Project coordinators stopped working"],"The passage identifies reduced projects as a possible alternative explanation.","Fewer competing priorities"),
 q("W04-Q3","RS-F03","medium","Which summary is most accurate?","Protected mornings were linked to more focused work, but project changes and self-selection limit causal claims",["The policy proved meetings are harmful","All employees preferred the change","Evening work rose sharply"],"The conclusion states an association with clear limitations.","associated with more uninterrupted work"),
 q("W04-Q4","RS-F04","hard","Which limitation most directly weakens causal interpretation?","Teams volunteered and project load changed during the trial",["The trial lasted eight weeks","Work blocks were counted","Meetings existed"],"Both selection and concurrent workload changes create confounding.","not randomly assigned"),
 q("W04-Q5","RS-F05","hard","Which statement makes an unjustified causal claim?","The no-meeting policy caused all of the improvement in morning productivity",["Uninterrupted work increased","Projects were fewer","Incident days behaved differently"],"The design cannot isolate the policy from other changes.","limited causal certainty"),
 q("W04-Q6","RS-F06","hard","Which is a directly reported finding?","Evening login time did not rise substantially",["Employees worked fewer total hours","All decisions moved to the morning","Every team handled incidents the same way"],"The seventh paragraph directly reports this. The cited result directly supports this interpretation.","did not rise substantially"),
 q("W04-Q7","RS-F07","hard","Which competing explanation is explicitly identified?","Reduced project load may have made focus easier",["Employees received bonuses","The software became faster","Teams hired more staff"],"The passage names fewer competing priorities as an alternative explanation.","Fewer competing priorities"),
 q("W04-Q8","RS-F08","medium","Which next step is best supported?","Rotate the policy across teams while keeping project load more comparable",["Make it permanent immediately","Ban all meetings","Measure only employee satisfaction"],"The conclusion proposes this design. The cited result directly supports this interpretation.","rotate the policy across teams")
 ]
},
{
 id:"ENG008-RS-T04",title:"Do Platform Signs Reduce Missed Train Connections?",genre:"transport-survey",
 text:`A commuter rail operator tested larger transfer signs at three busy stations where passengers often changed lines. The new signs showed platform numbers, walking arrows and estimated transfer time.

For six weeks, observers recorded how often passengers asked staff for directions and how many missed connecting trains after arriving from selected services. Direction questions fell at all three stations.

Missed connections also declined slightly, but the operator cautioned that one timetable change during the trial had increased the transfer window on two routes. That could explain part of the improvement.

The effect varied by station layout. The clearest improvement occurred at a station with several long corridors, where passengers had previously faced multiple turns before reaching the next platform.

A passenger survey found that estimated walking time was especially useful for travellers deciding whether to hurry or wait for the following train. Platform numbers alone were already available on older signs.

The study did not include passengers with mobility limitations as a separate analysis group, even though walking time may affect them differently. The operator identified this as a gap for future evaluation.

Maintenance staff also noted that one sign became partly hidden when a temporary advertising display was installed nearby. It was moved after several complaints.

The rail operator concluded that larger directional signs were associated with fewer questions and somewhat fewer missed transfers, but timetable changes and station design affected the result. A follow-up study will compare matched stations without schedule changes. The operator will also record whether clearer signage changes passenger walking speed or only reduces hesitation at decision points. A shorter transfer may come from choosing the correct corridor sooner rather than physically walking faster. Researchers plan to map where passengers stop, turn back or ask for help. That spatial information could show which parts of a station create the most confusion and whether a sign helps because it is larger, better placed or more specific. A stronger study would therefore connect outcome changes with the exact navigation problem being solved. Researchers also plan to record whether people miss connections because they choose the wrong direction or because the transfer window is physically too short. Better signs can solve the first problem but not the second. Separating these causes will prevent the operator from crediting signage for delays that depend mainly on timetable design or walking distance.`,
 questions:[
 q("T04-Q1","RS-F01","medium","What happened to passenger direction questions after the new signs were installed?","They fell at all three stations",["They doubled","They stayed identical","They were not recorded"],"The second paragraph directly reports the decline.","Direction questions fell"),
 q("T04-Q2","RS-F02","medium","What can be inferred about the missed-connection decline?","Part of it may be explained by longer transfer windows",["Signs were proven to cause all of it","Timetables became shorter","Passengers stopped changing trains"],"The trial overlapped with schedule changes that made transfers easier.","could explain part of the improvement"),
 q("T04-Q3","RS-F03","medium","Which summary is most accurate?","Larger signs improved navigation, while effects on missed transfers were harder to isolate",["Signs eliminated missed trains","Station layout did not matter","Walking time estimates were ignored"],"The passage presents strong direction findings but qualified transfer results.","somewhat fewer missed transfers"),
 q("T04-Q4","RS-F04","hard","Which limitation most directly affects causal interpretation of missed connections?","Transfer windows changed on some routes during the trial",["The study lasted six weeks","Passengers asked questions","Signs included arrows"],"The timetable change directly affects missed connections.","increased the transfer window"),
 q("T04-Q5","RS-F05","hard","Which statement makes an unjustified causal claim?","The new signs caused the entire decline in missed connections",["Questions fell","One schedule changed","Station layout mattered"],"The study cannot separate signage from timetable effects.","could explain part"),
 q("T04-Q6","RS-F06","hard","Which is a directly reported finding?","Estimated walking time was useful to travellers deciding whether to hurry",["Mobility-limited passengers benefited most","Advertisements improved navigation","All old signs were removed"],"The survey directly reports this. The cited result directly supports this interpretation.","estimated walking time was especially useful"),
 q("T04-Q7","RS-F07","hard","Which competing explanation is explicitly identified?","Longer transfer windows may have reduced missed connections",["Tickets became cheaper","Stations had fewer passengers","Staff stopped giving directions"],"The schedule change is the stated alternative explanation.","transfer window"),
 q("T04-Q8","RS-F08","medium","Which next step is best supported?","Compare similar stations without timetable changes and include mobility differences",["Remove all old signs","Ignore station layout","Study only direction questions"],"The conclusion and limitation point to this stronger design.","matched stations without schedule changes")
 ]
},
{
 id:"ENG008-RS-C03",title:"Does a Default Refill Option Reduce Disposable Cup Use?",genre:"consumer-survey",
 text:`A university café tested a default refill option for hot drinks. Customers who brought a reusable cup were automatically offered a refill price, while disposable cups remained available at the standard price.

During a seven-week trial, reusable-cup transactions rose by 18 percent. Disposable-cup use fell, though total drink sales remained stable.

The café initially considered the result evidence that the default prompt changed behaviour. However, the trial coincided with a student sustainability campaign that promoted reusable bottles and cups across campus.

Researchers surveyed customers and found that some had noticed the campaign before encountering the café prompt. Others said they had already planned to use reusable cups because of a new student club initiative.

The effect also differed by time of day. Reusable-cup use rose more during morning hours, when regular customers were more common, than during evening periods with more occasional visitors.

The café recorded no meaningful increase in service time. Staff said the refill option was easy to process once customers understood the rule.

The study did not track the same individual customers over time, so it could not tell whether the increase came from existing reusable-cup users visiting more often or new users changing their habits.

The café concluded that the default refill prompt was associated with lower disposable-cup use, but concurrent campaigns and limited customer tracking made the size of the independent effect uncertain. A future trial will rotate the prompt across outlets while keeping campaign exposure more consistent. Researchers also want to separate habit formation from short-term response. A customer may use a reusable cup several times during the campaign and then return to disposable cups later. Tracking behaviour after campaign messages end would show whether the prompt creates a lasting routine or only a temporary shift. The next trial will therefore include a post-intervention period and compare first-time reusable-cup users with customers who already had the habit. That distinction will help identify whether the prompt expands participation or mainly reinforces existing behaviour. The café will also measure how many reusable cups are actually brought from home versus borrowed through campus cup-share schemes. These behaviours have different implications for convenience and waste. A prompt may work better when customers already own a cup than when participation requires finding one first, so availability of reusable containers will be analysed as a separate factor.`,
 questions:[
 q("C03-Q1","RS-F01","medium","What happened to reusable-cup transactions during the trial?","They rose by 18 percent",["They fell by 18 percent","They did not change","They doubled"],"The second paragraph directly reports the increase.","rose by 18 percent"),
 q("C03-Q2","RS-F02","medium","What can be inferred about the sustainability campaign?","It may have contributed to the increase in reusable-cup use",["It had no overlap with the trial","It reduced reusable-cup use","Only staff saw it"],"Some customers had encountered the campaign before the café prompt.","noticed the campaign"),
 q("C03-Q3","RS-F03","medium","Which summary is most accurate?","Reusable-cup use increased, but the independent effect of the default prompt is uncertain because other campaigns were active",["The prompt alone was proven to cause the increase","Disposable cups were banned","Evening customers changed most"],"The conclusion explicitly qualifies the effect.","independent effect uncertain"),
 q("C03-Q4","RS-F04","hard","Which limitation most directly affects causal interpretation?","Other sustainability campaigns ran during the same period",["The trial lasted seven weeks","Drink sales were stable","Service time was measured"],"Concurrent campaigns create a strong confound.","coincided with a student sustainability campaign"),
 q("C03-Q5","RS-F05","hard","Which statement makes an unjustified causal claim?","The default prompt caused the full 18 percent increase",["Reusable use rose","Morning change was larger","Campaign exposure differed"],"The study cannot isolate the prompt from other influences.","associated with"),
 q("C03-Q6","RS-F06","hard","Which is a directly reported finding?","Reusable-cup use rose more in the morning than in the evening",["Morning customers were more environmentally conscious","The student club caused the increase","Service became slower"],"The fifth paragraph directly reports the time-of-day difference.","rose more during morning hours"),
 q("C03-Q7","RS-F07","hard","Which competing explanation is explicitly identified?","Campus campaigns may have encouraged reusable-cup use independently",["Disposable cups became more expensive","The café reduced drink variety","Weather was colder"],"The passage directly names other initiatives.","student sustainability campaign"),
 q("C03-Q8","RS-F08","medium","Which next step is best supported?","Rotate the prompt across outlets while keeping other campaign exposure more comparable",["Ban disposable cups immediately","Measure sales only","Ignore regular customers"],"The final paragraph proposes this design. The cited result directly supports this interpretation.","rotate the prompt across outlets")
 ]
},
{
 id:"ENG008-RS-D04",title:"Do Practice Streaks Increase Study Consistency?",genre:"digital-learning-evaluation",
 text:`An exam-preparation app introduced a visible study streak showing how many consecutive days a learner completed at least ten practice questions. The company wanted to know whether the feature improved study consistency.

For six weeks, half of newly registered users saw the streak counter while the other half used the app without it. Users with the counter practised on more days on average.

However, the streak group also opened reminder notifications slightly more often. It was unclear whether the counter itself or greater attention to reminders explained part of the difference.

The feature had another effect. Some users completed exactly ten easy questions late at night to avoid breaking the streak, even when they did not continue into deeper study.

Researchers therefore separated “active day” counts from total questions and average difficulty. The streak group still had more active days, but the difference in total difficult questions was smaller.

A survey found that some learners found the streak motivating, while others described it as pressure after missing a day. Reactions were strongest among users with long streaks.

The experiment randomly assigned the feature, which strengthened causal interpretation, but notification behaviour still differed after assignment and may have become part of the mechanism through which the feature worked.

The company concluded that streaks increased day-to-day practice frequency, but frequency alone did not prove better learning. A follow-up study will include delayed test performance and compare fixed streaks with more flexible weekly goals. The company also plans to examine what happens after a streak breaks. Some learners may resume normally, while others may disengage because the visible count has returned to zero. A weekly-goal design could reduce this all-or-nothing response by allowing recovery after one missed day. Researchers will compare return rates after a lapse and measure whether users with flexible goals continue practising more consistently over several weeks. This will help distinguish a motivating progress signal from a feature that works only while an unbroken sequence is maintained. Researchers will also compare whether streaks influence the kinds of questions learners choose. If users protect a streak by selecting easier sets, activity may rise while challenge falls. Tracking difficulty, accuracy and time per question will help show whether the feature encourages meaningful practice or simply the minimum activity needed to keep the counter alive.`,
 questions:[
 q("D04-Q1","RS-F01","medium","What happened to practice frequency among users who saw the streak counter?","They practised on more days on average",["They practised on fewer days","They stopped using reminders","They completed fewer active days"],"The second paragraph directly reports this. The cited result directly supports this interpretation.","practised on more days"),
 q("D04-Q2","RS-F02","medium","What can be inferred from users doing exactly ten easy questions late at night?","Some behaviour may have been aimed at preserving the streak rather than deeper study",["Easy questions always improve learning","The streak had no effect","Users forgot the rule"],"The passage explicitly describes minimal activity to avoid breaking the streak.","to avoid breaking the streak"),
 q("D04-Q3","RS-F03","medium","Which summary is most accurate?","Streaks increased study-day frequency, but that did not necessarily mean more difficult practice or better learning",["Streaks proved exam scores improve","All users liked the feature","Notifications had no relationship"],"The conclusion separates frequency from learning quality.","frequency alone did not prove better learning"),
 q("D04-Q4","RS-F04","hard","Which limitation remains despite random assignment?","The study did not yet measure delayed learning outcomes",["The feature was not assigned randomly","Practice days were not counted","No users saw reminders"],"The passage explicitly says learning quality remains uncertain and follow-up tests are needed.","include delayed test performance"),
 q("D04-Q5","RS-F05","hard","Which statement makes an unjustified causal claim?","The streak feature improved exam performance",["The streak group practised more days","Some users felt pressure","Hard-question differences were smaller"],"Exam performance was not measured. The cited result directly supports this interpretation.","did not prove better learning"),
 q("D04-Q6","RS-F06","hard","Which is a directly reported finding?","Some users felt pressure after missing a day",["Pressure caused lower exam scores","Flexible goals are better","All long-streak users disliked the feature"],"The survey directly reports this reaction. The cited result directly supports this interpretation.","described it as pressure"),
 q("D04-Q7","RS-F07","hard","Which competing mechanism is explicitly discussed?","Greater attention to reminder notifications may explain part of the behaviour change",["Question prices changed","Users received easier exams","The app reduced content"],"The third paragraph names reminder behaviour as a possible mechanism.","opened reminder notifications"),
 q("D04-Q8","RS-F08","medium","Which next step is best supported?","Measure delayed performance and compare streaks with flexible weekly goals",["Remove the counter immediately","Study only easy questions","Ignore study quality"],"The final paragraph proposes exactly this. The cited result directly supports this interpretation.","compare fixed streaks with more flexible weekly goals")
 ]
}
] as const;