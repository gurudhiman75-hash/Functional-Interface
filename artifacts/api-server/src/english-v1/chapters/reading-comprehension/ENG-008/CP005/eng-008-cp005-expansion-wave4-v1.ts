import type{Eng008Cp005PassageV1}from"./eng-008-cp005-authorities-v1";
const q=(id:string,familyId:any,difficulty:any,question:string,correctAnswer:string,distractors:readonly[string,string,string],explanation:string,evidence:string)=>({id,familyId,difficulty,question,correctAnswer,distractors,explanation,evidence});

export const ENG008_CP005_EXPANSION_WAVE4_V1:readonly Eng008Cp005PassageV1[]=[
{
 id:"ENG008-RS-W03",title:"Does a Midday Break Change Afternoon Error Rates?",genre:"workplace-study",
 text:`A document-processing company tested whether a fixed twenty-minute midday break affected afternoon accuracy. Two teams took their usual flexible breaks, while two similar teams were asked to stop work together at 1:30 p.m. for six weeks.

The fixed-break teams made fewer data-entry corrections during the first two afternoon hours than they had during the previous six weeks. Employees also reported feeling less rushed when returning from lunch.

However, the company noticed that the trial coincided with a reduction in overall case volume. Fewer incoming files may itself have lowered pressure and error rates.

The teams were not randomly assigned. Managers had chosen groups whose schedules made a shared break easier to organise, so those teams may already have differed in coordination or workload patterns.

Researchers compared the first and second halves of the trial. Error rates stayed lower even when case volume rose slightly in the final three weeks, but the difference remained smaller than the initial headline suggested.

Some employees disliked the fixed timing because it reduced flexibility for personal errands. Others preferred knowing that colleagues would be unavailable at the same time rather than at unpredictable moments.

The company concluded that a common break was associated with lower afternoon correction rates, but the study could not determine how much of the change came from the break itself.

A future trial will rotate the break policy across teams and record case complexity as well as case volume. The goal is to test whether shared rest improves accuracy or whether the observed pattern mainly reflected easier work during the trial period. Researchers will also record error severity, not only the number of corrections. A small spelling fix and a serious data-entry error have different consequences, so a simple count may hide whether the policy changes the types of mistakes employees make. The next phase will also examine whether any benefit continues after teams become accustomed to the schedule rather than responding only to the novelty of a new routine. Researchers also want to compare whether the effect differs by task type. Repetitive data entry, document review and complex exception handling may respond differently to a shared break because each places a different kind of demand on attention. If the benefit appears only in certain work, a flexible policy may be more useful than a company-wide rule.`,
 questions:[
 q("W03-Q1","RS-F01","medium","What happened to afternoon correction rates in the fixed-break teams?","They fell during the first two afternoon hours",["They doubled","They stayed exactly the same","They were not recorded"],"The second paragraph directly reports fewer corrections.","made fewer data-entry corrections"),
 q("W03-Q2","RS-F02","medium","What can be inferred about the observed improvement?","Lower workload may explain part of it",["The break was proven to cause all of it","Case volume had no relationship with pressure","Flexible teams stopped working"],"The trial overlapped with lower case volume, creating a plausible alternative explanation.","Fewer incoming files may itself have lowered"),
 q("W03-Q3","RS-F03","medium","Which summary is most accurate?","A shared midday break was linked to fewer afternoon errors, but workload and non-random assignment limit causal certainty",["The break completely solved quality problems","Flexible breaks caused more mistakes","Employees unanimously preferred fixed timing"],"The conclusion presents an association with clear limitations.","associated with lower afternoon correction rates"),
 q("W03-Q4","RS-F04","hard","Which limitation most directly weakens causal interpretation?","Teams were not randomly assigned and workload changed during the trial",["The study lasted six weeks","Corrections were counted","Employees took breaks"],"Both assignment and workload are confounders.","not randomly assigned"),
 q("W03-Q5","RS-F05","hard","Which statement makes an unjustified causal claim?","The fixed break caused the full reduction in afternoon errors",["Correction rates were lower","Case volume also changed","Employees reported less rush"],"The study cannot isolate the break from other changes.","could not determine how much"),
 q("W03-Q6","RS-F06","hard","Which is a directly reported finding?","Some employees disliked losing flexibility over break timing",["Fixed breaks improved everyone's wellbeing","The final three weeks had the lowest case volume","Managers preferred flexible breaks"],"The passage directly records this employee response.","Some employees disliked"),
 q("W03-Q7","RS-F07","hard","Which competing explanation is explicitly identified?","Lower case volume may have reduced pressure and errors",["Employees became more skilled overnight","Software automatically corrected every file","Teams received bonuses"],"The passage directly states this alternative.","Fewer incoming files"),
 q("W03-Q8","RS-F08","medium","Which next step is best supported?","Rotate the break policy and track case complexity as well as volume",["Make the policy permanent immediately","Ignore employee preferences","Measure only attendance"],"The proposed design addresses assignment and workload differences.","rotate the break policy")
 ]
},
{
 id:"ENG008-RS-T03",title:"Do Real-Time Crowding Alerts Change Bus Choices?",genre:"transport-survey",
 text:`A transport authority tested crowding alerts on a mobile journey-planning app for six weeks. On selected routes, the app showed whether the next bus was expected to be lightly, moderately or heavily occupied.

Researchers compared boarding patterns on routes with alerts against similar routes without them. On heavily crowded services, a small share of app users waited for the following bus when the alert predicted high occupancy.

The effect was not uniform. During peak commuting hours, most passengers boarded the first available bus regardless of the warning. Outside the peak, travellers appeared more willing to wait for a less crowded service.

The study had an important limitation: only app users could see the alerts, and app users differed from the full passenger population. They were younger on average and more likely to check live arrival information.

The occupancy estimates were also imperfect. They were based on recent boarding data and sometimes lagged behind sudden changes at busy stops.

Passenger surveys found that users valued the alerts most when they were accompanied by an estimate of how long they would wait for the next bus. Crowding information alone was less useful when the alternative service was uncertain.

The authority concluded that real-time crowding information was associated with modest changes in off-peak boarding choices but had little effect when travel was time-sensitive.

The next phase will test improved occupancy estimates and compare behaviour among frequent commuters, occasional riders and passengers who receive the same information on stop displays rather than through the app. Researchers also plan to measure whether crowding is redistributed rather than reduced. If many informed passengers simply move from one bus to the next, the first vehicle may become less crowded while the following one becomes more crowded. That pattern would still affect comfort, but it would be different from a genuine reduction in total passenger density. The authority also plans to compare predicted crowding with actual on-board counts after each trip. That will show whether inaccurate alerts weaken trust over time. A passenger may stop using the feature if several warnings prove wrong, even if the system is generally useful. Reliability therefore needs to be measured alongside behavioural change. The authority will also check whether repeated false warnings cause users to stop consulting the feature altogether over time.`,
 questions:[
 q("T03-Q1","RS-F01","medium","When were passengers most willing to wait for a less crowded bus?","Outside peak commuting hours",["During the busiest peak","Only late at night","Never"],"The third paragraph directly reports stronger behavioural change off-peak.","Outside the peak"),
 q("T03-Q2","RS-F02","medium","What can be inferred about time pressure?","It reduces the influence of crowding alerts on boarding choices",["It makes alerts more accurate","It affects only app installation","It eliminates crowding"],"Most peak passengers boarded the first available bus despite warnings.","regardless of the warning"),
 q("T03-Q3","RS-F03","medium","Which summary is most accurate?","Crowding alerts modestly changed some off-peak choices but had limited effect under strong time pressure",["Alerts transformed all bus travel","Peak passengers always waited","Occupancy estimates were perfectly accurate"],"The conclusion directly states this pattern. The cited result directly supports this interpretation.","modest changes ... little effect"),
 q("T03-Q4","RS-F04","hard","Which limitation most directly affects generalisation to all passengers?","Only app users received the alerts and they differed from the wider population",["The study lasted six weeks","Routes were compared","Passengers were surveyed"],"App users are a selective subgroup. The cited result directly supports this interpretation.","app users differed"),
 q("T03-Q5","RS-F05","hard","Which statement makes an unjustified causal claim?","Crowding alerts caused all observed off-peak waiting behaviour",["Some users waited after high-occupancy alerts","Peak users changed less","Estimate accuracy was imperfect"],"The study is observational across route groups and includes user-selection effects.","associated with modest changes"),
 q("T03-Q6","RS-F06","hard","Which is a directly reported finding?","Passengers valued alerts more when next-bus wait time was also shown",["Alerts reduced total crowding system-wide","Older passengers used the app most","Stop displays worked better than phones"],"The survey directly reports this preference. The cited result directly supports this interpretation.","accompanied by an estimate"),
 q("T03-Q7","RS-F07","hard","Which competing explanation complicates interpretation of app-user behaviour?","App users differ demographically and in information habits from other passengers",["Bus fares changed during the study","Routes stopped operating","Drivers changed schedules"],"The passage explicitly notes these user differences.","younger on average"),
 q("T03-Q8","RS-F08","medium","Which next step is best supported?","Compare different passenger groups and delivery channels with improved occupancy estimates",["Remove crowding information","Study only peak riders","Assume all users react the same way"],"The final paragraph proposes exactly this broader comparison.","compare behaviour among")
 ]
},
{
 id:"ENG008-RS-E03",title:"Does Mulch Reduce Water Use in Public Flower Beds?",genre:"environment-study",
 text:`A parks department tested whether adding mulch to public flower beds could reduce irrigation demand during early summer. Twelve matched beds received a layer of shredded bark, while twelve continued with exposed soil.

Over eight weeks, soil-moisture sensors showed that mulched beds retained moisture longer after watering. Maintenance crews reduced irrigation frequency at those beds without observing a decline in plant condition.

The water saving was not identical at every site. Beds shaded by buildings required less irrigation regardless of whether mulch was present, while exposed roadside beds showed a larger difference.

The trial was not fully random because crews selected beds that were easy to pair by size and plant type. Differences in wind, soil depth or previous maintenance could still influence results.

Researchers also recorded weed growth. Mulched beds had fewer visible weeds, which may have reduced competition for water and partly contributed to the moisture difference.

One practical drawback was noted: after heavy rain, mulch washed out of two sloped beds and had to be replaced. This added maintenance time that was not included in the water-use comparison.

The department concluded that mulch was associated with lower irrigation needs, especially at exposed sites, but site conditions and maintenance costs should be included in any larger rollout.

A follow-up trial will randomly assign mulch within larger parks, track total labour time and compare several mulch depths to see whether additional material produces enough extra benefit to justify the cost. The department also plans to record soil temperature because mulch can change heat exposure as well as moisture loss. If deeper mulch retains more water but also changes soil conditions in ways that affect some plants, the best depth may differ by species. That would make a single universal recommendation less useful than a site-specific guideline. Researchers will also compare how quickly different mulch materials break down because replacement frequency affects both cost and labour. A material that saves slightly less water but lasts much longer may be more practical over several seasons. The final recommendation will therefore consider water savings, plant response, maintenance effort and material lifespan together rather than selecting the treatment with the largest short-term moisture difference. Seasonal rainfall will be recorded separately as well so unusual weather patterns do not distort the comparison.`,
 questions:[
 q("E03-Q1","RS-F01","medium","What happened to soil moisture in mulched beds?","It remained higher for longer after watering",["It disappeared immediately","It was not measured","It fell below exposed soil at every site"],"The second paragraph directly reports longer moisture retention.","retained moisture longer"),
 q("E03-Q2","RS-F02","medium","What can be inferred about site exposure?","It affects irrigation needs independently of mulch",["Only mulch determines water use","Shaded beds always need more water","Roadside beds cannot be mulched"],"Shaded beds needed less irrigation regardless of treatment.","regardless of whether mulch was present"),
 q("E03-Q3","RS-F03","medium","Which summary is most accurate?","Mulch was linked to lower irrigation needs, but site conditions and maintenance trade-offs matter",["Mulch eliminated irrigation","All sites responded equally","Weeds increased under mulch"],"The conclusion explicitly balances benefit with site variation and maintenance.","site conditions and maintenance costs"),
 q("E03-Q4","RS-F04","hard","Which limitation most directly affects causal interpretation?","Beds were matched but not fully randomly assigned",["The study lasted eight weeks","Sensors measured moisture","Plants were observed"],"Non-random selection leaves possible site differences.","not fully random"),
 q("E03-Q5","RS-F05","hard","Which statement makes an unjustified causal claim?","Mulch alone caused all of the reduction in irrigation",["Mulched beds retained more moisture","Shaded beds needed less water","Weed reduction may have contributed"],"Several factors could explain part of the observed difference.","may have reduced competition"),
 q("E03-Q6","RS-F06","hard","Which is a directly reported finding?","Mulch washed out of two sloped beds after heavy rain",["Mulch reduced labour at every site","All weeds disappeared","Plant condition improved dramatically"],"The sixth paragraph directly reports this maintenance problem.","washed out of two sloped beds"),
 q("E03-Q7","RS-F07","hard","Which competing explanation is explicitly identified?","Reduced weed competition may partly explain higher moisture",["Mulch increased rainfall","Sensors failed at exposed sites","Workers watered control beds twice as often"],"The passage directly notes fewer weeds as a contributing factor.","reduced competition for water"),
 q("E03-Q8","RS-F08","medium","Which next step is best supported?","Randomly assign mulch and track labour as well as water use",["Apply maximum mulch everywhere","Ignore slope and maintenance","Measure only flower colour"],"The follow-up design addresses both causality and maintenance cost.","randomly assign mulch")
 ]
},
{
 id:"ENG008-RS-D03",title:"Does Instant Feedback Improve Practice Accuracy?",genre:"digital-learning-evaluation",
 text:`An online test-preparation platform compared two feedback designs for vocabulary practice. One group saw the correct answer and a short explanation immediately after each response. Another group completed a block of ten questions before receiving the same information.

After four weeks, the immediate-feedback group had slightly higher accuracy during practice sessions. On a delayed quiz given three days later, however, the score difference between the groups was much smaller.

Researchers noted that immediate feedback may help users correct mistakes quickly, but it may also make practice feel easier because the right answer appears before the learner has much time to reflect.

The groups were not identical at the start. The delayed-feedback group had slightly lower baseline vocabulary scores, although statistical adjustment reduced this imbalance.

Usage patterns also differed. Immediate-feedback users completed more total practice questions, which itself could contribute to better performance.

A survey showed that immediate feedback was preferred by beginners, while more experienced users were more evenly divided. Some advanced learners said delayed feedback made them review their reasoning across several questions.

The platform concluded that immediate feedback improved short-term practice accuracy, but the evidence for stronger retention was weaker because delayed quiz differences were small and practice volume differed.

The next experiment will hold the number of practice questions constant and randomly assign feedback timing. It will also include a one-week retention test to examine whether either design produces a more durable learning advantage. Researchers will record how often learners revisit explanations voluntarily after the answer is shown. That behaviour may matter because two students exposed to the same feedback can use it very differently. The team also wants to test mixed feedback, where easy items are delayed but repeated errors trigger immediate explanation, to see whether adaptive timing works better than one fixed rule. Another question is whether learners become dependent on instant correction. If users expect the answer after every attempt, they may spend less time checking their own reasoning before submitting. The next study will therefore record response time and voluntary answer changes before feedback appears. Those measures could reveal whether different timing encourages more independent checking. Researchers also plan to compare whether the effect differs for easy recall items and harder context-based vocabulary questions, since feedback timing may interact with task difficulty differently.`,
 questions:[
 q("D03-Q1","RS-F01","medium","Which group had slightly higher practice-session accuracy?","The immediate-feedback group",["The delayed-feedback group","Both were identical","Only advanced learners"],"The second paragraph directly reports this difference.","immediate-feedback group had slightly higher accuracy"),
 q("D03-Q2","RS-F02","medium","What can be inferred from the delayed quiz?","The short-term practice advantage may not translate fully into retention",["Immediate feedback guarantees long-term learning","Delayed feedback prevents learning","Quiz scores were not measured"],"The delayed score difference was much smaller.","difference ... was much smaller"),
 q("D03-Q3","RS-F03","medium","Which summary is most accurate?","Immediate feedback improved practice accuracy, but evidence for better retention remains uncertain",["Delayed feedback was clearly superior","Immediate feedback reduced practice volume","Beginners disliked immediate feedback"],"The conclusion directly makes this distinction.","evidence for stronger retention was weaker"),
 q("D03-Q4","RS-F04","hard","Which limitation most directly affects comparison of learning outcomes?","Groups differed at baseline and completed different amounts of practice",["Vocabulary was studied","Feedback was provided","The study lasted four weeks"],"Both starting ability and practice volume can confound the comparison.","baseline ... practice volume differed"),
 q("D03-Q5","RS-F05","hard","Which statement makes an unjustified causal claim?","Immediate feedback caused the higher delayed learning outcome",["Practice accuracy was higher with immediate feedback","Delayed quiz differences were small","Immediate-feedback users practised more"],"The retention effect is uncertain and confounded by practice volume.","evidence ... was weaker"),
 q("D03-Q6","RS-F06","hard","Which is a directly reported finding?","Beginners preferred immediate feedback",["Immediate feedback is best for all learners","Delayed feedback improves reasoning","Advanced learners performed worse"],"The survey directly reports beginner preference.","preferred by beginners"),
 q("D03-Q7","RS-F07","hard","Which competing explanation is explicitly identified?","Immediate-feedback users completed more practice questions",["They received easier vocabulary","Their quiz was shorter","They studied fewer weeks"],"More practice could independently improve performance.","completed more total practice questions"),
 q("D03-Q8","RS-F08","medium","Which next step is best supported?","Randomly assign feedback timing while keeping practice volume constant and add a retention test",["Use only immediate feedback","Remove explanations","Measure practice accuracy only"],"The proposed next experiment directly addresses the main confounds.","hold the number ... constant")
 ]
}
] as const;