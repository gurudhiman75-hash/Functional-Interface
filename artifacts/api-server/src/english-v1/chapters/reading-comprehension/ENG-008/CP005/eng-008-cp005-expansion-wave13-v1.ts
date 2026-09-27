import type{Eng008Cp005PassageV1}from"./eng-008-cp005-authorities-v1";
const q=(id:string,familyId:any,difficulty:any,question:string,correctAnswer:string,distractors:readonly[string,string,string],explanation:string,evidence:string)=>({id,familyId,difficulty,question,correctAnswer,distractors,explanation,evidence});
export const ENG008_CP005_EXPANSION_WAVE13_V1:readonly Eng008Cp005PassageV1[]=[
{
 id:"ENG008-RS-W16",title:"Do Shared Quiet Hours Reduce Workplace Interruptions?",genre:"workplace-study",
 text:`A software company tested a two-hour shared quiet period from 10 a.m. to noon on three weekdays. Internal meetings were discouraged during that window, and employees were asked to use non-urgent messaging only after noon.

One product team adopted the quiet period for six weeks. A similar team continued its normal schedule. Researchers compared calendar interruptions, message volume, self-reported concentration and project progress.

The quiet-hour team had fewer meeting interruptions during the protected window and reported longer periods of focused work. However, message volume increased sharply just after noon.

Project completion improved slightly for coding tasks but not for coordination-heavy tasks. This suggested the policy fit some work better than others.

The teams were not identical. The intervention team had more developers, while the comparison team included more project coordinators. That role mix could explain part of the difference.

Some employees also shifted short questions into the 9:30–10 a.m. period before quiet hours began. This reduced interruptions inside the target window but did not necessarily reduce total daily interruption.

Researchers did not measure evening work or stress. Employees might compensate for delayed communication later in the day.

A follow-up will rotate both teams through the policy, track total-day interruption and compare mandatory quiet hours with optional protected blocks chosen by each employee. The preliminary evidence suggests shared quiet hours can protect concentration, but their real value depends on whether interruptions are reduced overall rather than simply moved to another time.  Researchers also analysed when deferred communication reappeared. The largest spike occurred immediately after noon, but a smaller increase also appeared late in the afternoon as employees caught up on conversations postponed earlier. This suggested that protected time changed the timing of interruption more clearly than total communication volume. Staff interviews showed mixed preferences: developers valued a shared quiet period because colleagues knew when not to interrupt, while coordinators preferred flexible blocks because their work depended on quick responses from others. The follow-up will therefore measure team interdependence and employee control over timing as possible moderators of benefit.`,
 questions:[
 q("W16-Q1","RS-F01","medium","What was the intervention?","A shared two-hour quiet period with fewer meetings and non-urgent messages",["A shorter workweek","A ban on all communication","Daily overtime"],"The policy protected 10 a.m. to noon from routine internal interruption.","quiet period"),
 q("W16-Q2","RS-F02","hard","Why is the team comparison imperfect?","The teams had different role mixes",["No baseline existed","Both teams used quiet hours","Message volume was not measured"],"Developers and coordinators may benefit differently from interruption reduction.","more developers"),
 q("W16-Q3","RS-F03","hard","Which conclusion is best supported?","Quiet hours reduced interruptions during the protected period but may have displaced some communication",["The policy improved every task","Total daily interruption definitely fell","Meetings disappeared permanently"],"Noon message spikes and earlier questions suggest some shifting rather than pure reduction.","increased sharply just after noon"),
 q("W16-Q4","RS-F04","medium","What happened to message volume after noon?","It increased sharply",["It fell to zero","It was not measured","It stayed identical"],"Deferred messages accumulated and were sent after the protected period.","increased sharply"),
 q("W16-Q5","RS-F05","medium","Why does task type matter?","Concentration-heavy and coordination-heavy work may respond differently to fewer interruptions",["Every task needs meetings","Coding requires more messaging","Task type determines salary"],"Coding showed modest gains while coordination-heavy work did not.","not for coordination-heavy tasks"),
 q("W16-Q6","RS-F06","hard","Which is a directly reported finding?","Meeting interruptions fell during quiet hours",["Stress declined","Evening work fell","Every project finished earlier"],"The study directly recorded fewer meeting interruptions during the protected window.","fewer meeting interruptions"),
 q("W16-Q7","RS-F07","hard","Which unmeasured factor could hide a cost?","Evening work",["Calendar interruptions","Project progress","Message volume"],"Delayed communication could shift work later, but evening work was not measured.","did not measure evening work"),
 q("W16-Q8","RS-F08","medium","Which follow-up is best supported?","Use a crossover design and measure total-day interruption",["Study only developers","Remove message tracking","Measure only noon activity"],"The proposed design addresses team differences and displacement across the day.","rotate both teams")
 ]
},
{
 id:"ENG008-RS-W17",title:"Does a Visible Workload Board Improve Task Allocation?",genre:"workplace-study",
 text:`A customer-support department tested a shared workload board showing how many active cases each employee was handling. Managers hoped the board would reduce repeated assignment of new cases to already overloaded staff.

For two weeks before the trial, supervisors allocated work using their usual judgment. For six weeks afterward, one unit used the workload board while another similar unit did not.

The board unit showed a narrower spread in active-case counts across employees. Reassignment of newly assigned cases also fell.

However, the board counted every active case equally. A simple password-reset case and a complex billing dispute both added one unit, even though their effort differed substantially. Employees began adding a complexity tag: low, medium or high. Managers then viewed both raw case count and a weighted workload estimate.

The weighted measure improved perceived fairness in staff surveys, but the weighting system itself was subjective. Two supervisors sometimes rated the same type of case differently.

Researchers also worried that employees might close easy cases quickly to make their workload appear lower while leaving difficult cases open.

The study did not measure customer satisfaction or resolution quality. A balanced workload is useful only if service outcomes remain strong.

A follow-up will standardise complexity examples, randomise board use across more teams and compare workload balance with customer outcomes. The preliminary evidence suggests visible workload data can improve task distribution, but only when the metric reflects meaningful differences in work rather than counting every case as equal.  Researchers reviewed whether weighted workload predicted later overtime. Employees with higher weighted scores were somewhat more likely to work beyond scheduled hours, while raw case count showed a weaker relationship. This supported the idea that complexity mattered, although the result was observational. The team also found that cases could change complexity after new customer information arrived. A one-time rating at assignment was therefore sometimes stale. The follow-up will test whether periodic re-rating improves workload balance without creating too much administrative effort. Researchers will also examine whether visible workload data changes helping behaviour between colleagues.`,
 questions:[
 q("W17-Q1","RS-F01","medium","What did the workload board show initially?","The number of active cases per employee",["Customer income","Employee salary","Case outcomes only"],"The board made each person's active workload visible to managers.","active cases"),
 q("W17-Q2","RS-F02","hard","Why was raw case count an imperfect workload measure?","Cases differed greatly in complexity",["Employees had no cases","Every case took equal time","Case count was hidden"],"One simple case and one complex case both counted as one despite different effort.","effort differed substantially"),
 q("W17-Q3","RS-F03","hard","Which conclusion is best supported?","Visible workload data can improve allocation if the workload measure captures meaningful task differences",["Raw case count is always sufficient","Weighted workload is perfectly objective","Boards guarantee better customer outcomes"],"The trial improved balance, but metric design remained important.","meaningful differences"),
 q("W17-Q4","RS-F04","medium","What happened to reassignment of new cases?","It fell in the board unit",["It doubled","It was not measured","It rose in both units"],"Managers were less likely to give new work to someone who was already overloaded.","Reassignment ... fell"),
 q("W17-Q5","RS-F05","medium","Why is the complexity weighting subjective?","Supervisors could classify similar cases differently",["Weights were random numbers","Customers selected weights","Every case was high complexity"],"Human judgment affected the weighted workload estimate.","rated ... differently"),
 q("W17-Q6","RS-F06","hard","Which is a directly reported finding?","Active-case counts became more evenly distributed",["Customer satisfaction rose","Resolution quality improved","All complex cases closed faster"],"The spread in case counts narrowed in the board unit.","narrower spread"),
 q("W17-Q7","RS-F07","hard","Which behavioural risk did researchers identify?","Employees might close easy cases to make workload look lower",["Employees might stop taking breaks","Customers might change companies","Managers might remove all cases"],"Metric visibility can influence behaviour in ways that improve the number without improving work quality.","make their workload appear lower"),
 q("W17-Q8","RS-F08","medium","Which next step is best supported?","Standardise complexity rules and measure customer outcomes",["Remove case counts","Use one supervisor only","Measure workload without service results"],"The follow-up addresses rating consistency and whether workload balance improves real service.","customer outcomes")
 ]
},
{
 id:"ENG008-RS-T11",title:"Do Live Platform-Crowding Alerts Change Train Boarding?",genre:"transport-survey",
 text:`A suburban rail operator tested live crowding alerts for three busy platforms. Overhead screens showed “low”, “moderate” or “high” crowding based on camera counts and train-arrival data.

For four weeks before the trial, researchers recorded where passengers waited along each platform. During the next eight weeks, screens also suggested less crowded zones farther along the platform.

More passengers moved away from the busiest stairway area when the screen marked crowding as high. Boarding became more evenly distributed across train doors.

However, some passengers ignored the suggestion because they wanted to exit near a particular staircase at their destination. Others had limited mobility and preferred the shortest walking distance.

Camera counts sometimes lagged after a train departed, briefly showing high crowding even when the platform had cleared. The operator shortened the refresh interval.

Researchers also noticed that moving passengers along the platform did not change the total number waiting. The intervention redistributed crowding rather than reducing demand.

The study did not measure whether more even boarding shortened total station dwell time.

A follow-up will randomise alerts across comparable stations, measure train dwell time and examine whether crowding recommendations remain useful during disruptions when trains arrive irregularly. The preliminary evidence suggests live crowding information can influence where some passengers wait, but individual travel needs and data freshness limit how evenly people will redistribute.  Researchers also tracked where passengers moved after seeing a high-crowding alert. Most shifted only one or two carriage zones rather than walking to the far end of the platform, suggesting that convenience constrained redistribution. During service disruption, crowding categories changed more rapidly and users reported less confidence in the recommendation. The operator plans to add a freshness indicator showing when the last camera estimate was calculated. A follow-up will also measure whether platform redistribution reduces crowding inside specific train cars or merely changes boarding location while the same popular carriages remain crowded.`,
 questions:[
 q("T11-Q1","RS-F01","medium","What did the crowding screens show?","Low, moderate or high crowding with suggested less crowded zones",["Ticket prices","Train driver names","Passenger destinations"],"The intervention added real-time crowding categories and movement suggestions.","low, moderate or high"),
 q("T11-Q2","RS-F02","hard","Why did some passengers ignore the suggested zone?","They valued destination exit position or shorter walking distance",["They could not see trains","Every zone was equally crowded","Screens had no text"],"Individual journey needs competed with the goal of crowd redistribution.","exit near a particular staircase"),
 q("T11-Q3","RS-F03","hard","Which conclusion is best supported?","Crowding alerts redistributed some passengers but did not reduce the total number waiting",["Alerts eliminated platform crowding","All passengers followed suggestions","Train dwell time definitely fell"],"The system changed spatial distribution rather than demand.","redistributed crowding"),
 q("T11-Q4","RS-F04","medium","What technical problem affected the screens?","Crowding counts sometimes updated too slowly after a train left",["Cameras never counted passengers","Screens changed ticket fares","Train arrival data disappeared"],"Stale counts briefly overstated crowding after platform clearance.","counts sometimes lagged"),
 q("T11-Q5","RS-F05","medium","Why is mobility relevant?","Some passengers cannot easily walk farther along the platform",["Mobility changes train speed","Only mobile passengers buy tickets","Crowding levels depend on age alone"],"The recommendation imposes a physical movement cost that is not equal for every rider.","limited mobility"),
 q("T11-Q6","RS-F06","hard","Which is a directly reported finding?","Passengers moved away from the busiest stairway area more often during high-crowding alerts",["Station dwell time fell","Every door received equal boarding","Total passenger demand declined"],"The study observed spatial movement toward less crowded zones.","More passengers moved away"),
 q("T11-Q7","RS-F07","hard","Which outcome was not measured?","Whether more even boarding reduced train dwell time",["Passenger waiting location","Crowding category","Camera refresh lag"],"The passage explicitly notes that dwell-time effects were not measured.","did not measure"),
 q("T11-Q8","RS-F08","medium","Which next step is best supported?","Randomise alerts across stations and measure train dwell time",["Stop measuring crowding","Use only one platform","Ignore service disruptions"],"A broader randomised design can test causal effects and operational consequences.","randomise alerts")
 ]
},
{
 id:"ENG008-RS-S09",title:"Does a Pre-Sleep Notification Pause Improve Sleep Onset?",genre:"sleep-study",
 text:`Researchers tested whether a sixty-minute pause in non-urgent phone notifications before bedtime improved sleep onset. One hundred adults who regularly used smartphones in the evening joined a four-week study.

Participants were randomly assigned either to a phone setting that silenced non-urgent notifications during the hour before their chosen bedtime or to their normal notification settings.

Both groups wore wrist activity monitors and completed morning diaries. The intervention group reported fewer phone checks during the final hour before bed.

Average estimated sleep-onset time improved modestly in the intervention group. Total sleep duration changed little. The setting did not block calls from selected contacts or alarms. Participants could also manually open apps, so the intervention reduced incoming prompts rather than forcing complete phone avoidance.

Some participants moved bedtime later because they continued using entertainment apps without notifications. For them, reduced interruption did not necessarily mean earlier sleep.

The wrist monitors estimated sleep from movement and could not measure brain activity directly.

The study also relied on self-selected bedtime schedules, which varied across weekdays and weekends.

A follow-up will compare notification silencing with a stronger intervention that also limits selected high-engagement apps and will include a one-week post-study period after the settings are removed. The preliminary evidence suggests reducing incoming prompts before bed can modestly improve sleep onset, but notification control alone does not prevent voluntary late-night phone use.  Researchers also examined whether notification frequency before the intervention predicted benefit. Participants who normally received many evening alerts showed a larger reduction in pre-sleep phone checks after silencing was enabled. Those with few incoming notifications changed little. This suggests the intervention mainly removes external prompts rather than changing established entertainment habits. The follow-up will therefore stratify participants by baseline notification load and measure app-use minutes separately from notification-triggered checks. Researchers will also test whether participants keep the silencing schedule after the study ends, because sustained use may matter more than a short experimental effect.`,
 questions:[
 q("S09-Q1","RS-F01","medium","What did the intervention do?","Silenced non-urgent notifications for one hour before bedtime",["Blocked all phone use","Removed alarms","Changed work schedules"],"The setting reduced incoming prompts while preserving urgent contacts and alarms.","silenced non-urgent notifications"),
 q("S09-Q2","RS-F02","hard","Why didn't notification silence guarantee earlier sleep?","Participants could still choose to use entertainment apps",["The phone turned off automatically","Sleep onset was not measured","Every app was blocked"],"The intervention reduced prompts but did not eliminate voluntary device use.","continued using entertainment apps"),
 q("S09-Q3","RS-F03","hard","Which conclusion is best supported?","Pre-sleep notification silencing modestly improved sleep onset but did not meaningfully change total sleep duration",["It greatly increased sleep duration","It prevented all phone use","It improved every participant's sleep"],"The direct effect was modest and specific to onset, with little duration change.","changed little"),
 q("S09-Q4","RS-F04","medium","What happened to phone checks before bed?","They decreased in the intervention group",["They doubled","They were not measured","They fell only in the control group"],"Participants reported fewer checks during the silenced period.","fewer phone checks"),
 q("S09-Q5","RS-F05","medium","Why is wrist monitoring a limitation?","Movement-based estimates cannot directly measure brain-defined sleep onset",["Wrist devices do not record time","Participants removed phones","Movement cannot be measured"],"The monitors infer sleep rather than measuring brain activity.","could not measure brain activity"),
 q("S09-Q6","RS-F06","hard","Which is a directly reported finding?","Estimated sleep onset improved modestly",["Total sleep increased greatly","All entertainment use stopped","Weekend bedtime became fixed"],"The intervention produced a small improvement in estimated onset.","improved modestly"),
 q("S09-Q7","RS-F07","hard","Which factor may complicate comparison across nights?","Participants chose different bedtimes on different days",["Notification settings were identical","Every participant used the same phone","Alarms were removed"],"Self-selected schedules vary by weekday and weekend.","varied across weekdays and weekends"),
 q("S09-Q8","RS-F08","medium","Which next step is best supported?","Compare notification silencing with limits on selected high-engagement apps",["Remove sleep measurement","Block emergency calls","Study only one night"],"The follow-up can test whether reducing voluntary app use adds benefit beyond fewer prompts.","stronger intervention")
 ]
},
{
 id:"ENG008-RS-C10",title:"Do Nutrition Warning Icons Change Snack Choice?",genre:"consumer-survey",
 text:`Researchers tested whether a simple front-of-pack warning icon changed snack choices. Nine hundred adults completed an online shopping task involving biscuits, chips and sweetened drinks.

Participants were randomly shown either standard nutrition panels only or the same products with a small warning icon on items high in sugar, salt or saturated fat according to predefined thresholds.

The warning-icon group selected fewer high-warning products on average. The effect was strongest among participants who said they rarely read detailed nutrition panels.

However, some shoppers replaced one warned product with another product that had no warning but a larger portion size. Total calories purchased did not fall as much as the number of warnings selected. Researchers therefore separated “warning avoidance” from overall nutritional quality.

Brand preference also mattered. Strongly brand-loyal participants changed choices less often.

The study was hypothetical. Participants did not spend their own money or consume the products later.

Some participants interpreted a warning-free product as “healthy”, even though the absence of an icon only meant it did not cross the specific warning threshold.

A follow-up will test real purchases in a store and add a short explanation that “no warning” does not mean “nutritionally ideal”. The preliminary evidence suggests simple warning icons can redirect choice, but the health effect depends on what shoppers choose instead and how they interpret the absence of a warning.  Researchers also asked participants to explain their choices. Some treated the warning as a simple “avoid” signal, while others compared price, portion size and brand before deciding. The strongest behavioural change occurred when the warning did not conflict with a strong brand preference or large price difference. This suggests labels operate within a broader choice environment rather than overriding other considerations. The field trial will therefore measure price sensitivity and repeat purchasing, not only one-time selection. Researchers will also test whether a neutral explanatory legend reduces the mistaken belief that warning-free products are automatically healthy.`,
 questions:[
 q("C10-Q1","RS-F01","medium","What did the intervention add?","Warning icons on products above selected nutrient thresholds",["Higher prices","New brands","Calorie removal"],"The experimental condition added a simple front-of-pack warning.","warning icon"),
 q("C10-Q2","RS-F02","hard","Why did fewer warning selections not translate into an equally large calorie reduction?","Some replacement products had larger portions",["Calories were not measured","Every no-warning product had zero calories","Participants bought fewer items"],"Changing one product can alter nutrient warnings without reducing overall energy by the same amount.","larger portion size"),
 q("C10-Q3","RS-F03","hard","Which conclusion is best supported?","Warning icons can change product choice, but health impact depends on substitutions and interpretation",["Icons guarantee healthy diets","No-warning products are always healthy","Brand preference disappears"],"The study separates warning avoidance from overall nutritional quality.","what shoppers choose instead"),
 q("C10-Q4","RS-F04","medium","For whom was the icon effect strongest?","People who rarely read detailed nutrition panels",["Strongly brand-loyal shoppers","Only people buying drinks","Participants who ignored icons"],"Simple front labels added the most information for people who seldom used the detailed panel.","rarely read"),
 q("C10-Q5","RS-F05","medium","Why did researchers separate warning avoidance from nutritional quality?","A product can avoid a warning while still producing a poor overall choice",["Warnings were random","Nutrition cannot be measured","All products had identical portions"],"The threshold icon captures one rule, not the whole nutritional value of the basket.","separated"),
 q("C10-Q6","RS-F06","hard","Which is a directly reported finding?","The warning group chose fewer high-warning products",["Total calories fell to zero","Every shopper understood the icon perfectly","Brand loyalty increased"],"The experimental group directly selected fewer warned products.","selected fewer"),
 q("C10-Q7","RS-F07","hard","Which factor limits real-world generalisation?","Participants did not spend their own money",["Random assignment was used","Three product categories were included","Thresholds were predefined"],"Hypothetical shopping may differ from real purchase behaviour.","did not spend their own money"),
 q("C10-Q8","RS-F08","medium","Which next step is best supported?","Test real purchases and clarify that no warning does not equal healthy",["Remove nutrition information","Study only one product","Assume icon-free products are ideal"],"A field trial and interpretation note address both behavioural realism and misunderstanding.","real purchases")
 ]
},
{
 id:"ENG008-RS-E11",title:"Do Shade Sails Reduce Playground Heat Exposure?",genre:"environment-study",
 text:`A school district installed shade sails over parts of four playgrounds and compared them with similar unshaded areas. Researchers wanted to know whether the structures reduced heat exposure during warm afternoons.

Surface temperature, air temperature and radiant heat were measured every twenty minutes for six weeks. Researchers also counted how many children used shaded and unshaded areas during lunch breaks.

Shaded surfaces were substantially cooler than nearby sun-exposed surfaces. Air temperature differences were much smaller.

Radiant heat was also lower under the sails, and more children used the shaded zones on the hottest days. However, the shaded areas were not identical to the comparison areas. Some contained benches or were closer to drinking fountains, which could also attract children.

Wind conditions differed across playgrounds and occasionally made one site feel cooler regardless of shade.

The study did not measure hydration, core body temperature or heat-related illness.

Researchers also observed that shade position changed with the sun, leaving some equipment exposed during late afternoon.

A follow-up will randomise portable shade structures across matched areas, track radiant heat throughout the day and record whether children shift activity when shade moves. The preliminary evidence suggests shade sails reduce surface and radiant heat exposure, but their practical benefit depends on placement, time of day and how children use the shaded space.  Researchers also mapped where the shade actually fell at different times. A sail positioned well for noon provided much less coverage during late-afternoon sports practice, showing that installation geometry matters. Surface material also interacted with shade: dark rubber flooring remained warmer than pale concrete even under the same structure. The follow-up will therefore compare combinations of shade and surface type rather than treating shade as the only design factor. Investigators will also collect comfort ratings and activity duration, since lower surface temperature may matter most when it changes how long children can safely use the space.`,
 questions:[
 q("E11-Q1","RS-F01","medium","What was the intervention?","Shade sails installed over parts of playgrounds",["Air conditioning","Longer lunch breaks","New fountains only"],"The district added overhead shade structures to selected playground zones.","shade sails"),
 q("E11-Q2","RS-F02","hard","Why is child use difficult to attribute entirely to shade?","Shaded areas sometimes also had benches or nearby fountains",["Children were not counted","Shade never moved","All areas were identical"],"Other attractive features could confound where children chose to gather.","benches or ... fountains"),
 q("E11-Q3","RS-F03","hard","Which conclusion is best supported?","Shade sails reduced surface and radiant heat, while air-temperature effects were smaller",["Shade cooled the whole playground equally","Heat illness declined","Wind had no effect"],"The clearest direct effects were on surface and radiant heat rather than ambient air.","much smaller"),
 q("E11-Q4","RS-F04","medium","When did more children use shaded zones?","On the hottest days",["Only on cool mornings","Never","Only after school"],"Use of shaded areas increased during hotter lunch periods.","hottest days"),
 q("E11-Q5","RS-F05","medium","Why does changing sun position matter?","Shade can move and leave some equipment exposed later",["It changes school hours","It increases wind","It removes radiant heat permanently"],"A fixed structure does not protect the same ground at every time of day.","shade position changed"),
 q("E11-Q6","RS-F06","hard","Which is a directly reported finding?","Shaded surfaces were much cooler",["Hydration improved","Heat illness declined","Core body temperature fell"],"Surface sensors directly measured a substantial temperature difference.","substantially cooler"),
 q("E11-Q7","RS-F07","hard","Which outcome was not measured?","Core body temperature",["Surface temperature","Radiant heat","Playground use"],"The study did not measure internal body heat or illness outcomes.","did not measure"),
 q("E11-Q8","RS-F08","medium","Which next step is best supported?","Randomise portable shade and track heat across the day",["Remove comparison areas","Measure only air temperature","Ignore shade movement"],"Portable randomisation and longer time coverage address site confounding and moving shade.","randomise portable shade")
 ]
},
{
 id:"ENG008-RS-D17",title:"Does Interleaving Improve Formula Selection?",genre:"digital-learning-evaluation",
 text:`An online mathematics course tested interleaved practice for students learning three types of percentage problems. In blocked practice, students completed several questions of one type before moving to the next. In interleaved practice, the three problem types were mixed.

Four hundred students were randomly assigned to one format after the same lesson. Both groups completed the same number of practice questions and received identical explanations after errors.

During practice, the blocked group was faster and more accurate. Students often knew which formula to use because nearby questions followed the same pattern.

Two days later, the interleaved group performed slightly better on a mixed test where students had to decide which method applied. The advantage was largest on questions whose wording did not directly signal the problem type.

Researchers interpreted this as evidence that interleaving may train discrimination between problem structures rather than only repetition of one procedure.

However, the mixed practice group also reported higher frustration during the first session.

The study did not test long-term retention beyond two days or whether the benefit transferred to entirely new mathematical topics.

A follow-up will combine a short blocked introduction with later interleaving and will include a two-week delayed test. The preliminary evidence suggests interleaving can make practice feel harder while improving later formula selection when learners must identify the problem type for themselves.  Researchers also coded errors by type. Interleaved students made fewer “wrong formula” errors on the delayed mixed test but were not consistently better at arithmetic once the correct formula had been chosen. This supports the idea that the intervention mainly trained selection among methods rather than calculation itself. The study group also reported lower confidence during mixed practice, which may reflect desirable difficulty or simple frustration. The follow-up will track confidence calibration and include a transfer set where familiar procedures appear in unfamiliar story contexts. Researchers want to know whether improved discrimination persists beyond the exact percentage formats used in training.`,
 questions:[
 q("D17-Q1","RS-F01","medium","What differed between the practice groups?","Whether problem types were blocked or mixed",["Lesson content","Number of questions","Feedback quality"],"Both groups learned the same material but practised in different sequences.","blocked ... interleaved"),
 q("D17-Q2","RS-F02","hard","Why was blocked practice easier during training?","Nearby questions used the same type, making formula choice more predictable",["Blocked students saw answers first","They had fewer questions","Interleaved students had no explanations"],"Pattern repetition reduces the need to identify the problem type anew each time.","same pattern"),
 q("D17-Q3","RS-F03","hard","Which conclusion is best supported?","Interleaving may improve later selection among methods even though it feels harder during practice",["Interleaving improves every outcome","Blocked practice is always better","Frustration proves learning is worse"],"The mixed group struggled more initially but performed better on later method-selection tasks.","performed slightly better"),
 q("D17-Q4","RS-F04","medium","On which later questions was the interleaving advantage largest?","Questions whose wording did not reveal the problem type",["Questions identical to practice","Only the easiest questions","Questions with the formula printed"],"The benefit appeared strongest when students had to discriminate structure independently.","did not directly signal"),
 q("D17-Q5","RS-F05","medium","Why do researchers think discrimination matters?","Learners must decide which procedure fits rather than repeat one known pattern",["Every formula is identical","Blocked practice removes calculation","Interleaving changes arithmetic"],"Mixed practice forces comparison between problem structures.","identify the problem type"),
 q("D17-Q6","RS-F06","hard","Which is a directly reported finding?","The blocked group was faster during practice",["Two-week retention improved","Transfer to new topics improved","Frustration disappeared"],"Practice performance directly favoured blocked sequencing.","faster and more accurate"),
 q("D17-Q7","RS-F07","hard","Which limitation affects long-term claims?","The delayed test occurred only two days later",["Random assignment was absent","No feedback was given","Only one problem type was used"],"Two days is too short to establish durable retention.","beyond two days"),
 q("D17-Q8","RS-F08","medium","Which next step is best supported?","Test a blocked introduction followed by interleaving with a longer delay",["Remove mixed testing","Use only one formula","Measure speed only"],"The follow-up can balance initial support with later discrimination practice and test durability.","two-week delayed test")
 ]
},
{
 id:"ENG008-RS-D18",title:"Do Worked-Error Explanations Improve Debugging?",genre:"digital-learning-evaluation",
 text:`A coding course tested whether showing learners a worked example containing a deliberate bug improved later debugging skill. Six hundred beginners completed the same lesson on conditional statements.

One group then studied three correct worked examples. Another studied two correct examples and one buggy example followed by an explanation of why the code failed and how to fix it.

During immediate practice, both groups solved standard coding questions at similar rates. Two days later, students who had studied the buggy example were slightly better at identifying similar logic errors in new code.

The benefit was strongest when the new bug involved the same underlying misconception but different variable names.

Researchers cautioned that the buggy-example group spent more time on explanation because the error analysis was longer than a normal worked solution.

Some learners also reported that seeing incorrect code was initially confusing. The study did not test whether learners would begin imitating incorrect patterns or whether benefits extended to unrelated bug types.

A follow-up will equalise study time and compare one versus several buggy examples with clearly labelled correction steps.

Researchers will also test whether asking learners to predict the bug before seeing the explanation improves transfer. The preliminary evidence suggests carefully explained errors can support debugging by making misconceptions visible, but examples need clear correction and controlled exposure so learners do not simply absorb the wrong pattern.  Researchers also examined explanation quality. Learners who could accurately describe why the buggy code failed showed the strongest later debugging performance, while simply reading the correction was less predictive. This suggests active explanation may be an important part of the benefit. The follow-up will therefore compare passive worked-error study with a condition that asks learners to explain the bug before revealing the fix. Investigators will also include unrelated error categories to test whether the method teaches a general debugging habit or only recognition of one misconception. Longer-term testing will check whether incorrect examples leave any persistent confusion.`,
 questions:[
 q("D18-Q1","RS-F01","medium","What was special about the intervention example?","It contained a deliberate bug followed by an explanation and fix",["It had no code","It was longer only","It removed feedback"],"The treatment exposed learners to an incorrect pattern and then explicitly corrected it.","deliberate bug"),
 q("D18-Q2","RS-F02","hard","Why is extra explanation time a confound?","The buggy-example group spent longer studying the material",["Both groups had identical study time","Time cannot affect learning","The control group saw more examples"],"Longer exposure could partly explain later debugging improvement.","spent more time"),
 q("D18-Q3","RS-F03","hard","Which conclusion is best supported?","Explained buggy examples may improve recognition of similar logic errors, but study time and confusion remain concerns",["Buggy examples improve every coding skill","Incorrect code should replace correct examples","Standard practice performance doubled"],"The later benefit was small and specific, with important design limitations.","slightly better"),
 q("D18-Q4","RS-F04","medium","When was the later benefit strongest?","When the new bug reflected the same misconception in a different surface form",["When there was no bug","Only with identical variable names","On standard questions immediately"],"Transfer was strongest across examples sharing the same underlying logic error.","same underlying misconception"),
 q("D18-Q5","RS-F05","medium","Why could buggy examples confuse beginners?","Learners are exposed to incorrect code before the correction is fully understood",["Beginners cannot read code","Correct examples were removed","The course had no labels"],"Incorrect patterns can be risky if the correction is not sufficiently clear.","initially confusing"),
 q("D18-Q6","RS-F06","hard","Which is a directly reported finding?","Immediate standard-question performance was similar across groups",["All bug types improved","Incorrect imitation increased","Long-term retention was measured"],"The groups performed similarly during immediate ordinary practice.","similar rates"),
 q("D18-Q7","RS-F07","hard","Which outcome was not tested?","Whether learners would imitate incorrect patterns later",["Debugging similar errors","Immediate coding performance","Study-time difference"],"The passage explicitly identifies possible imitation as an unmeasured risk.","did not test whether learners would begin imitating"),
 q("D18-Q8","RS-F08","medium","Which next step is best supported?","Equalise study time and test clearly labelled buggy examples with prediction",["Remove correction steps","Study only correct code","Measure completion speed only"],"The proposed design isolates error-example effects and may strengthen active reasoning.","equalise study time")
 ]
}
] as const;