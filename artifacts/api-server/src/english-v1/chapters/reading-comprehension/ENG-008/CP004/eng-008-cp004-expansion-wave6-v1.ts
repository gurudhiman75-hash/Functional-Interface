import type{Eng008Cp004PassageV1}from"./eng-008-cp004-authorities-v1";
const q=(id:string,familyId:any,difficulty:any,question:string,correctAnswer:string,distractors:readonly[string,string,string],explanation:string,evidence:string)=>({id,familyId,difficulty,question,correctAnswer,distractors,explanation,evidence});
export const ENG008_CP004_EXPANSION_WAVE6_V1:readonly Eng008Cp004PassageV1[]=[
{
 id:"ENG008-BM-E05",title:"Why Falling Unemployment Can Still Hide Labour-Market Weakness",genre:"economy",
 text:`A lower unemployment rate is usually treated as a sign of a stronger labour market, but the number can improve for more than one reason. One possibility is straightforward: more people find jobs. Another is less encouraging: some people stop looking for work and are no longer counted as unemployed.

This is why economists examine labour-force participation alongside unemployment. If unemployment falls while participation also drops sharply, the improvement may not reflect broad job creation.

Hours worked matter too. A person may be employed but unable to find as many hours as desired. Headline employment can therefore improve while underemployment remains high.

Job quality adds another layer. Employment growth concentrated in temporary or low-paid work may have different effects on household security than growth in stable full-time jobs.

None of this makes the unemployment rate useless. It is a valuable indicator when interpreted with related measures rather than as a complete description of labour conditions.

Regional differences can also be hidden by national averages. One area may have strong hiring while another loses workers to migration or business closures.

Policy makers therefore often look at participation, vacancies, wage growth, hours, duration of unemployment and employment by sector. These measures reveal whether improvement is broad or concentrated.

The central lesson is that labour-market health cannot be read from a single rate. A falling unemployment figure is most informative when it is accompanied by evidence that people are entering jobs rather than leaving the search altogether.`,
 questions:[
 q("E05-Q1","BM-F01","medium","Why can unemployment fall without strong job creation?","Some people may stop looking for work and leave the labour force",["Wages must always rise","Every worker gets more hours","Vacancies disappear"],"The opening paragraph identifies this alternative mechanism.","stop looking for work"),
 q("E05-Q2","BM-F02","hard","What can be inferred if unemployment and participation both fall sharply?","The labour-market improvement may be weaker than the unemployment rate alone suggests",["Job creation must be very strong","All workers found full-time jobs","Underemployment must disappear"],"Lower participation can partly drive the unemployment decline.","may not reflect broad job creation"),
 q("E05-Q3","BM-F03","hard","Which option best states the central argument?","Unemployment should be interpreted with participation, hours, wages and job quality",["Unemployment rates are useless","Participation alone is sufficient","Job quality never matters"],"The passage repeatedly argues for multiple measures.","related measures"),
 q("E05-Q4","BM-F04","hard","What is the author's tone?","Analytical and qualified",["Alarmist","Celebratory","Dismissive"],"The passage explains both usefulness and limits.","does not make the unemployment rate useless"),
 q("E05-Q5","BM-F05","medium","Why does the author mention underemployment?","To show that being counted as employed does not reveal whether people have enough work",["To argue every worker is unemployed","To explain migration","To discuss inflation"],"The passage distinguishes employment status from desired hours.","unable to find as many hours as desired"),
 q("E05-Q6","BM-F06","hard","Which statement cannot be inferred?","A falling unemployment rate always means labour conditions improved broadly",["Participation provides useful context","Job quality affects household security","Regional differences can be hidden"],"The passage explicitly rejects the one-number interpretation.","cannot be read from a single rate"),
 q("E05-Q7","BM-F07","hard","What role does the seventh paragraph play?","It lists complementary indicators that can test whether improvement is broad",["It defines unemployment","It argues wages do not matter","It introduces job quality"],"The paragraph lists the supporting measures analysts examine.","look at participation, vacancies, wage growth"),
 q("E05-Q8","BM-F08","hard","Which conclusion follows most logically?","Policy makers should distinguish job entry from labour-force exit when unemployment falls",["Participation should be ignored","Only national averages matter","Temporary jobs are never useful"],"The conclusion makes this distinction central.","entering jobs rather than leaving the search"),
 q("E05-Q9","BM-F09","medium","In context, “participation” most nearly refers to:","the share of people working or actively looking for work",["attendance at job fairs","number of vacancies","hours worked"],"The passage contrasts unemployment with labour-force participation.","labour-force participation"),
 q("E05-Q10","BM-F10","hard","Which assumption does the passage challenge?","That one favourable labour-market statistic necessarily describes the whole labour market",["Employment can vary by sector","Wages can change","People may migrate"],"This is the passage's core warning.","single rate")
 ]
},
{
 id:"ENG008-BM-H04",title:"Why Average Treatment Results May Not Apply Equally to Every Patient",genre:"health",
 text:`Clinical studies often report an average treatment effect, but patients can differ in age, disease severity, other conditions and previous treatment. An average therefore describes the study group as a whole, not necessarily every individual inside it.

This matters because a treatment can produce strong benefit in one subgroup and little benefit in another while still generating a moderate overall average.

Subgroup analysis can help, but it also creates risks. If researchers divide participants into many categories after seeing the results, some apparent differences may arise by chance.

Stronger evidence comes when subgroup hypotheses are specified before analysis or when the same pattern is reproduced in another study.

Sample size also matters. A trial may be large overall but contain only a small number of participants in a particular subgroup, making estimates for that group uncertain.

Doctors therefore combine study evidence with patient characteristics rather than treating the average effect as a guaranteed outcome.

The same caution applies to side effects. An adverse event may be rare overall but more common among people with a specific risk factor.

Good interpretation asks both “What happened on average?” and “How much confidence do we have that the same pattern applies to this kind of patient?” Precision in medicine depends on knowing when general evidence is strong and when individual differences deserve more attention.`,
 questions:[
 q("H04-Q1","BM-F01","medium","What does an average treatment effect describe most directly?","The study group as a whole",["Every patient identically","Only the healthiest subgroup","The price of treatment"],"The opening paragraph states this directly.","study group as a whole"),
 q("H04-Q2","BM-F02","hard","What can be inferred about subgroup findings based on very small samples?","They may be uncertain even if the full trial is large",["They are always more accurate","They replace the main result","They prove causation"],"The passage explicitly warns about small subgroup samples.","making estimates for that group uncertain"),
 q("H04-Q3","BM-F03","hard","Which option best states the central argument?","Average clinical results should be interpreted with subgroup evidence and uncertainty in mind",["Average effects are meaningless","Every patient needs a separate trial","Subgroup analysis is always unreliable"],"The passage balances overall results with individual differences.","not necessarily every individual"),
 q("H04-Q4","BM-F04","hard","What is the author's tone?","Analytical and cautious",["Hostile toward trials","Celebratory","Dismissive"],"The author values average evidence but qualifies its application.","combine study evidence"),
 q("H04-Q5","BM-F05","medium","Why does the author mention many post-hoc subgroups?","Testing many categories after seeing results can produce chance differences",["It increases sample size","It guarantees precision","It removes adverse events"],"The passage directly identifies this statistical risk.","may arise by chance"),
 q("H04-Q6","BM-F06","hard","Which statement cannot be inferred?","A treatment's average benefit guarantees the same benefit for every patient",["Patient characteristics can matter","Replication can strengthen subgroup evidence","Rare side effects may cluster in some groups"],"The passage explicitly rejects guaranteed individual application.","not necessarily every individual"),
 q("H04-Q7","BM-F07","hard","What role does the fourth paragraph play?","It describes ways to make subgroup evidence more credible",["It defines adverse events","It introduces averages","It argues against trials"],"The paragraph recommends pre-specification and replication.","specified before analysis"),
 q("H04-Q8","BM-F08","hard","Which conclusion follows most logically?","Clinical decisions should combine average evidence with patient-specific factors",["Only subgroup findings should be used","Average results should be ignored","Side effects never matter"],"The passage states this approach directly.","combine study evidence with patient characteristics"),
 q("H04-Q9","BM-F09","medium","In context, “subgroup” most nearly means:","a smaller category within the larger study population",["a separate hospital","a different medicine","a follow-up visit"],"The passage refers to groups defined by patient characteristics.","particular subgroup"),
 q("H04-Q10","BM-F10","hard","Which distinction is fundamental to the passage?","An average group effect is not identical to an individual patient's likely response",["Trials and treatment are identical","Adverse events are always common","Age never matters"],"This distinction drives the whole passage.","not necessarily every individual")
 ]
},
{
 id:"ENG008-BM-EN03",title:"Why Recycling Rates Can Improve While Waste Still Grows",genre:"environment",
 text:`A city may celebrate a rising recycling rate while still sending more total waste to disposal. This can happen when the amount of waste generated grows faster than the share recycled.

Suppose a city recycles 30 percent of 100 units of waste, then later recycles 40 percent of 150 units. The recycling rate improved, but disposal still rose from 70 units to 90.

This distinction matters because percentage measures can hide changes in the underlying total. A programme that increases recycling participation may be useful even if overall waste generation continues to rise.

Policy therefore needs at least two questions: what share is recycled, and how much waste is produced in total?

Material type matters as well. Recycling one tonne of aluminium and one tonne of mixed low-value material do not necessarily create the same environmental benefit.

Contamination can further reduce effective recycling. A bin may be counted as collected for recycling even if a large share is rejected later because the material is dirty or incorrectly sorted.

For this reason, cities increasingly track generation per person, recovery rates after sorting and the quality of recyclable material, not only collection rates.

The broader lesson is that success in one part of a waste system can coexist with deterioration elsewhere. Recycling is important, but reducing unnecessary waste and improving material quality may matter just as much as raising a headline percentage.`,
 questions:[
 q("EN03-Q1","BM-F01","medium","How can recycling rates rise while disposal also rises?","Total waste generation can grow faster than the recycled share",["Recycling automatically increases waste","Percentages cannot be calculated","Disposal is always fixed"],"The opening example demonstrates this directly.","amount of waste generated grows faster"),
 q("EN03-Q2","BM-F02","hard","What can be inferred from the numerical example?","A better percentage does not necessarily mean a better absolute outcome",["Percentages are useless","Recycling fell","Total waste remained constant"],"Disposal rises despite the improved recycling rate.","disposal still rose"),
 q("EN03-Q3","BM-F03","hard","Which option best states the central argument?","Waste policy should track both recycling performance and total waste generation",["Recycling rates should be ignored","Only disposal matters","All materials have equal value"],"The passage repeatedly argues for multiple measures.","what share is recycled, and how much waste is produced"),
 q("EN03-Q4","BM-F04","hard","What is the author's tone?","Analytical and cautionary",["Anti-recycling","Celebratory","Humorous"],"The author supports recycling but warns against a single metric.","Recycling is important"),
 q("EN03-Q5","BM-F05","medium","Why does the author mention aluminium and mixed material?","To show that equal recycled weight may not produce equal environmental benefit",["To compare market prices only","To argue aluminium should be banned","To explain bin colours"],"Material type changes the value of recycling.","do not necessarily create the same environmental benefit"),
 q("EN03-Q6","BM-F06","hard","Which statement cannot be inferred?","A higher recycling rate guarantees that less waste goes to disposal",["Contamination can reduce effective recycling","Waste per person is useful to track","Total generation matters"],"The passage explicitly disproves this assumption.","disposal still rose"),
 q("EN03-Q7","BM-F07","hard","What role does the seventh paragraph play?","It lists better measures for evaluating the waste system",["It defines contamination","It introduces the percentage example","It argues against recycling"],"The paragraph names per-person generation, recovery and quality.","cities increasingly track"),
 q("EN03-Q8","BM-F08","hard","Which conclusion follows most logically?","Waste policy should combine recycling targets with efforts to reduce total waste",["Only collection rates matter","Disposal should be ignored","Contamination has no effect"],"The conclusion emphasises both recycling and waste reduction.","reducing unnecessary waste"),
 q("EN03-Q9","BM-F09","medium","In context, “contamination” most nearly means:","unwanted or wrongly sorted material mixed into recyclables",["air pollution only","water leakage","transport cost"],"The passage defines it through dirty or incorrectly sorted material.","dirty or incorrectly sorted"),
 q("EN03-Q10","BM-F10","hard","Which assumption does the passage challenge?","That improving one headline recycling percentage proves the whole waste system improved",["Waste totals can change","Material types differ","Cities collect recycling"],"This is the central metric warning.","success in one part ... deterioration elsewhere")
 ]
},
{
 id:"ENG008-BM-PH03",title:"Why More Choice Can Sometimes Make Decisions Harder",genre:"philosophy",
 text:`Choice is usually associated with freedom, and having no choice can clearly be restrictive. Yet adding more options does not always make a decision easier or more satisfying.

When alternatives are few, people can compare them directly. As the number grows, the time and attention required to evaluate differences also increase.

This can lead to decision fatigue. A person may postpone choosing, rely on a simple shortcut or later worry more about the options not selected.

The effect is not universal. Experts may handle large choice sets well because they know which features matter and can ignore irrelevant differences.

The structure of choice also matters. Twenty options organised into clear categories may be easier to navigate than ten presented without any meaningful grouping.

Businesses and public services therefore face a design problem. Removing too much choice can frustrate users, but offering every possible variation can create unnecessary complexity.

One solution is progressive disclosure: show the most common options first, then allow users who need more detail to expand the list. Another is to provide filters based on meaningful needs rather than forcing people to compare everything at once.

The broader lesson is that freedom of choice and usability are related but not identical. Good decision environments preserve real alternatives while helping people focus on the differences that matter.`,
 questions:[
 q("PH03-Q1","BM-F01","medium","Why can more options make a decision harder?","They require more time and attention to compare",["Choice always removes freedom","Experts cannot handle options","Categories disappear"],"The second paragraph states this directly.","time and attention required"),
 q("PH03-Q2","BM-F02","hard","What can be inferred about experts?","They may cope better with many options because they know which features matter",["They always prefer fewer options","They never experience uncertainty","They ignore all differences"],"The fourth paragraph explains this advantage.","know which features matter"),
 q("PH03-Q3","BM-F03","hard","Which option best states the central argument?","Useful choice depends not only on the number of options but also on how they are structured",["More choice is always harmful","Fewer options are always better","Experts should choose for everyone"],"The passage repeatedly combines quantity with organisation.","structure of choice also matters"),
 q("PH03-Q4","BM-F04","hard","What is the author's tone?","Balanced and analytical",["Hostile toward choice","Celebratory without qualification","Sarcastic"],"The author recognises both freedom and complexity.","not universal"),
 q("PH03-Q5","BM-F05","medium","Why does the author mention clear categories?","To show that organisation can reduce the burden of a large choice set",["To argue categories remove choice","To compare prices","To describe expert training"],"Categories make more options easier to navigate.","easier to navigate"),
 q("PH03-Q6","BM-F06","hard","Which statement cannot be inferred?","More options always reduce satisfaction",["Choice can create decision fatigue","Experts may manage complexity better","Progressive disclosure can help"],"The passage explicitly says the effect is not universal.","not universal"),
 q("PH03-Q7","BM-F07","hard","What role does the seventh paragraph play?","It offers design methods for preserving choice while reducing complexity",["It defines freedom","It rejects filters","It explains experts"],"The paragraph proposes progressive disclosure and filters.","One solution"),
 q("PH03-Q8","BM-F08","hard","Which conclusion follows most logically?","Designers should preserve meaningful alternatives while reducing unnecessary comparison burden",["Every service should minimise options","Users should see every option at once","Filters reduce freedom"],"The conclusion states this balance.","preserve real alternatives"),
 q("PH03-Q9","BM-F09","medium","In context, “progressive disclosure” most nearly means:","showing basic options first and revealing more when needed",["removing advanced choices permanently","forcing an immediate decision","ranking users"],"The passage defines the term directly.","show the most common options first"),
 q("PH03-Q10","BM-F10","hard","Which assumption does the passage challenge?","That more choice automatically produces a better decision experience",["Choice can be structured","Experts use knowledge","Filters exist"],"This is the core argument.","adding more options does not always")
 ]
}
] as const;