export type Eng008Cp005Difficulty="medium"|"hard";
export type Eng008Cp005Genre="workplace-study"|"transport-survey"|"sleep-study"|"consumer-survey"|"environment-study"|"digital-learning-evaluation";
export type Eng008Cp005FamilyId="RS-F01"|"RS-F02"|"RS-F03"|"RS-F04"|"RS-F05"|"RS-F06"|"RS-F07"|"RS-F08";
export interface Eng008Cp005QuestionAuthorityV1{id:string;familyId:Eng008Cp005FamilyId;difficulty:Eng008Cp005Difficulty;question:string;correctAnswer:string;distractors:readonly[string,string,string];explanation:string;evidence:string;}
export interface Eng008Cp005PassageV1{id:string;title:string;genre:Eng008Cp005Genre;text:string;questions:readonly Eng008Cp005QuestionAuthorityV1[];}
const q=(id:string,familyId:Eng008Cp005FamilyId,difficulty:Eng008Cp005Difficulty,question:string,correctAnswer:string,distractors:readonly[string,string,string],explanation:string,evidence:string):Eng008Cp005QuestionAuthorityV1=>({id,familyId,difficulty,question,correctAnswer,distractors,explanation,evidence});

export const ENG008_CP005_PASSAGES_V1:readonly Eng008Cp005PassageV1[]=[
{
 id:"ENG008-RS-W01",title:"Does a Quiet Hour Improve Office Output?",genre:"workplace-study",
 text:`A mid-sized services company tested a “quiet hour” policy in two departments for six weeks. Between 10 a.m. and 11 a.m., internal meetings were discouraged and employees were asked to avoid non-urgent messages. Managers wanted to know whether a protected period would help staff complete work that required concentration.

The company compared task logs from the six-week trial with logs from the previous six weeks. In the two participating departments, the number of tasks completed before noon rose by 11 percent. Employees also reported fewer interruptions during the protected hour.

However, the result was not uniform. One department showed a larger gain than the other, and employees whose work depended heavily on real-time coordination reported little benefit. A third department that did not adopt the policy showed a 3 percent increase in morning task completion during the same period.

The company also noticed that the trial coincided with the end of a major software migration. Several teams said routine technical problems became less frequent during the later weeks of the study. That change could itself have improved productivity.

Because the trial was not randomly assigned, the company did not claim that the quiet hour caused the full 11 percent increase. Instead, it concluded that the policy was associated with better morning output in the participating departments, especially for concentration-heavy work.

Managers recommended extending the trial to more teams while continuing to track interruption levels, task type and technical disruptions. They also proposed allowing coordination-heavy teams to use a modified version rather than imposing the same rule everywhere.`,
 questions:[
 q("W01-Q1","RS-F01","medium","What happened to pre-noon task completion in the participating departments?","It rose by 11 percent",["It fell by 11 percent","It rose by 3 percent","It remained unchanged"],"The second paragraph directly reports an 11 percent increase.","rose by 11 percent"),
 q("W01-Q2","RS-F02","medium","What can be inferred about the policy's usefulness?","It may help concentration-heavy work more than coordination-heavy work",["It benefits every type of work equally","It is useful only when meetings are banned all day","It reduces software problems"],"The passage says coordination-heavy employees saw little benefit while concentration-heavy work benefited more.","especially for concentration-heavy work"),
 q("W01-Q3","RS-F03","medium","Which option best summarises the study?","The quiet hour was linked to higher morning output, but the company could not isolate its full causal effect",["The quiet hour proved an 11 percent causal productivity gain","The trial failed because one department improved less","Software migration was the only reason output changed"],"The study found an association while explicitly limiting causal claims.","did not claim that the quiet hour caused the full 11 percent increase"),
 q("W01-Q4","RS-F04","hard","Which limitation most directly weakens a causal interpretation?","The trial was not randomly assigned and coincided with other changes",["The trial lasted six weeks","Employees completed tasks before noon","Managers tracked interruption levels"],"Non-random assignment and the software-migration timing create alternative explanations.","trial was not randomly assigned"),
 q("W01-Q5","RS-F05","hard","Which statement best reflects the study's evidence?","The policy was associated with improved output, but causation was not established",["The policy definitely caused the full increase","The software migration definitely caused the increase","The control department proves the policy had no effect"],"The passage explicitly uses association language and rejects a full causal claim.","associated with better morning output"),
 q("W01-Q6","RS-F06","hard","Which is an interpretation rather than a directly observed finding?","The quiet hour probably helped concentration-heavy tasks",["Task completion rose by 11 percent","The comparison department rose by 3 percent","Employees reported fewer interruptions"],"The first is an explanatory interpretation drawn from the pattern; the others are reported observations.","especially for concentration-heavy work"),
 q("W01-Q7","RS-F07","hard","Which competing explanation is explicitly mentioned?","Fewer technical problems after the software migration may have improved productivity",["Employees may have worked longer hours","Managers may have reduced salaries","The company may have hired more staff"],"The passage identifies the software migration as a possible confounding factor.","technical problems became less frequent"),
 q("W01-Q8","RS-F08","medium","Which recommendation is most justified by the evidence?","Extend the trial while continuing to measure task type and other disruptions",["Make the quiet hour mandatory for all teams immediately","End the trial because causation was not proven","Claim an 11 percent company-wide productivity gain"],"The passage itself recommends a broader but still measured extension.","extending the trial to more teams")
 ]
},
{
 id:"ENG008-RS-T01",title:"Why Riders Stop Using a Bus Route",genre:"transport-survey",
 text:`A city transport agency surveyed 1,200 people who had used a newly redesigned bus route at least once during the previous three months. The survey asked about frequency of use, waiting time, transfers, crowding and reasons for choosing other transport.

Among riders who used the route at least three times a week, 62 percent rated it as reliable. Among occasional users, only 41 percent did so. The agency initially considered this evidence that frequent use increased trust in the route.

A closer analysis suggested another possibility. Frequent users were more likely to live near stops served every 12 minutes, while occasional users were more likely to use outer sections where buses arrived every 20 to 25 minutes. Service frequency therefore differed between the two groups.

The survey also found that crowding was the most common complaint among frequent riders, while long waits were the most common complaint among occasional riders. About one-third of occasional riders said they would use the route more often if waiting times became more predictable.

The survey did not include people who had never tried the route, so it could not explain why some residents avoided the service entirely. Nor did it measure actual waiting times with tracking data; responses were based on riders' perceptions.

The agency concluded that reliability perceptions were strongly related to where and how often people used the route, but the survey could not show that frequent use itself caused greater trust. It recommended combining passenger surveys with vehicle-tracking data before changing schedules.`,
 questions:[
 q("T01-Q1","RS-F01","medium","What was the most common complaint among occasional riders?","Long waits",["Crowding","High fares","Unsafe stops"],"The fourth paragraph directly identifies long waits.","long waits were the most common complaint"),
 q("T01-Q2","RS-F02","medium","What can be inferred about the difference in reliability ratings?","Part of the difference may reflect unequal service frequency across locations",["Frequent use definitely causes trust","Occasional riders dislike public transport in general","Crowding explains the entire gap"],"The two groups were exposed to different headways, which could affect perceptions.","service frequency therefore differed between the two groups"),
 q("T01-Q3","RS-F03","medium","Which option best summarises the survey?","Rider perceptions differed by usage and location, but the survey could not establish that frequency of use caused trust",["Frequent riders proved the route was reliable","The redesign failed for all users","Tracking data showed exact waiting times"],"The conclusion explicitly limits the causal claim.","could not show that frequent use itself caused greater trust"),
 q("T01-Q4","RS-F04","hard","Which limitation narrows the survey's scope most clearly?","It excluded people who had never tried the route",["It asked about crowding","It included 1,200 respondents","It compared frequent and occasional riders"],"Non-users are outside the sample, so their reasons cannot be inferred.","did not include people who had never tried the route"),
 q("T01-Q5","RS-F05","hard","Which causal claim is not justified?","Using the route more often makes riders trust it more",["Service frequency may affect reliability perceptions","Perceived waiting time differs across riders","Frequent riders reported higher reliability"],"The passage explicitly warns that usage frequency may be confounded by location and service frequency.","could not show that frequent use itself caused greater trust"),
 q("T01-Q6","RS-F06","hard","Which statement is directly observed rather than inferred?","62 percent of frequent riders rated the route reliable",["Frequent riders trusted the route because they used it more","Outer-section service caused occasional riders to travel less","Improving headways would certainly increase ridership"],"The 62 percent figure is a reported survey result.","62 percent rated it as reliable"),
 q("T01-Q7","RS-F07","hard","Which factor is a plausible confound in the relationship between use frequency and trust?","Different bus frequencies in the areas used by the two groups",["The survey's font size","The route's colour","The number of survey questions"],"Service frequency varies systematically with rider group and can affect reliability perceptions.","Frequent users were more likely to live near stops served every 12 minutes"),
 q("T01-Q8","RS-F08","medium","Which next step is best supported?","Combine rider surveys with actual vehicle-tracking data",["Remove the route immediately","Assume all non-users dislike waiting","Increase fares to reduce crowding"],"The report itself recommends pairing perceptions with observed service data.","combining passenger surveys with vehicle-tracking data")
 ]
},
{
 id:"ENG008-RS-S01",title:"Sleep, Study Time and Exam Performance",genre:"sleep-study",
 text:`Researchers at a college examined the study habits of 420 students during a four-week examination period. Students recorded nightly sleep duration and daily study time through an app, and researchers later compared these records with exam scores.

Students who averaged seven to eight hours of sleep had higher average scores than those who reported fewer than six hours. They also tended to report more regular study schedules. At first glance, the pattern suggested that more sleep improved exam performance.

However, the groups differed in other ways. Students in the seven-to-eight-hour group were less likely to have late-night jobs and were more likely to begin exam preparation earlier. The researchers could not fully separate the effect of sleep from these related differences.

The study also found that very long study hours were not consistently associated with higher scores. Students who reported more than nine hours of study on the day before an exam performed similarly, on average, to those who studied five to seven hours.

Because the study was observational, students were not assigned to different sleep schedules. Self-reported app records may also have contained errors, especially on days when students forgot to enter data until later.

The researchers concluded that regular sleep and study patterns were associated with stronger performance, but they did not claim that simply increasing sleep would automatically raise an individual student's score. They recommended experimental or longer-term research to test causal effects more directly.`,
 questions:[
 q("S01-Q1","RS-F01","medium","Which students had the highest average scores in the reported comparison?","Those averaging seven to eight hours of sleep",["Those sleeping fewer than six hours","Those studying more than nine hours the day before","Those with late-night jobs"],"The second paragraph directly reports this pattern.","seven to eight hours of sleep had higher average scores"),
 q("S01-Q2","RS-F02","medium","What can be inferred about the higher-scoring sleep group?","Its advantage may reflect several related habits, not sleep alone",["Sleep had no relationship with performance","Early preparation always causes better scores","Late-night jobs improve study efficiency"],"The groups differed in work schedules and preparation timing as well as sleep.","groups differed in other ways"),
 q("S01-Q3","RS-F03","medium","Which summary is most accurate?","Regular sleep and study patterns were linked with stronger scores, but causal effects were not established",["More sleep was proven to raise scores","Longer study hours always reduced scores","Self-reported data was too unreliable to use"],"The conclusion explicitly states association without automatic causation.","associated with stronger performance"),
 q("S01-Q4","RS-F04","hard","Which limitation most directly affects causal interpretation?","Students were not randomly assigned to sleep schedules",["The study lasted four weeks","The sample included 420 students","Exam scores were compared"],"Observational assignment leaves confounding variables uncontrolled.","students were not assigned to different sleep schedules"),
 q("S01-Q5","RS-F05","hard","Which statement confuses correlation with causation?","Sleeping eight hours will automatically improve any student's exam score",["Students sleeping seven to eight hours had higher average scores","The groups differed in work schedules","Regular patterns were associated with stronger performance"],"The first statement turns an observed association into a universal causal rule.","did not claim that simply increasing sleep would automatically raise"),
 q("S01-Q6","RS-F06","hard","Which is a reported finding rather than an interpretation?","Students studying more than nine hours before an exam performed similarly to those studying five to seven hours",["Very long study sessions are ineffective for everyone","Sleep is more important than study time","Students with jobs are less motivated"],"The first is directly reported; the others go beyond the evidence.","performed similarly, on average"),
 q("S01-Q7","RS-F07","hard","Which competing explanation could partly account for the sleep-score relationship?","Students with more sleep also tended to start preparation earlier",["The app automatically raised exam scores","Students with less sleep took easier exams","All students had identical schedules"],"Earlier preparation differed between groups and could influence results.","more likely to begin exam preparation earlier"),
 q("S01-Q8","RS-F08","medium","Which recommendation is best supported?","Use experimental or longer-term research to test causation",["Advise every student to study exactly seven hours","Ban late-night jobs","Treat app records as perfectly accurate"],"The researchers explicitly call for stronger causal designs.","recommended experimental or longer-term research")
 ]
},
{
 id:"ENG008-RS-C01",title:"What Makes Shoppers Return to a Local Store?",genre:"consumer-survey",
 text:`A retail association surveyed 860 customers who had purchased from independent neighbourhood stores during the previous month. The survey asked why they returned to the same store, what problems discouraged them and how price influenced their choices.

The most commonly selected reason for returning was “staff helpfulness,” chosen by 54 percent of respondents. Convenient location was selected by 49 percent, while low price was selected by 37 percent. Respondents could choose more than one reason.

Customers who visited the same store at least once a week were especially likely to select staff helpfulness. The association initially interpreted this as evidence that friendly service created loyalty.

However, frequent shoppers also tended to live closer to the stores they used. People living nearby may visit more often simply because the store is convenient, and repeated visits may then increase familiarity with staff. The direction of the relationship is therefore uncertain.

The survey also included only people who had made a recent purchase. It did not capture residents who had stopped using local stores entirely or those who considered a store but chose a larger retailer instead.

The association concluded that service quality, convenience and price all appeared relevant to repeat visits, but the survey could not rank them as independent causes. It recommended that stores track repeat-purchase behaviour alongside customer feedback rather than relying on survey preferences alone.`,
 questions:[
 q("C01-Q1","RS-F01","medium","Which reason was selected most often for returning to a store?","Staff helpfulness",["Low price","Parking availability","Product advertising"],"The second paragraph reports staff helpfulness at 54 percent.","staff helpfulness ... 54 percent"),
 q("C01-Q2","RS-F02","medium","What can be inferred about frequent shoppers?","Their higher rating of helpful staff may partly reflect proximity and repeated contact",["They are unaffected by location","They always pay lower prices","They shop only because of staff"],"Frequent shoppers also lived closer and had more repeated interaction.","frequent shoppers also tended to live closer"),
 q("C01-Q3","RS-F03","medium","Which summary is most accurate?","Several factors were linked to repeat visits, but the survey could not isolate their independent causal effects",["Helpful staff was proven to be the main cause of loyalty","Price had no role in repeat visits","Location explained every result"],"The conclusion explicitly avoids ranking independent causes.","could not rank them as independent causes"),
 q("C01-Q4","RS-F04","hard","Which limitation most affects generalising the results to all local residents?","Only recent purchasers were surveyed",["Respondents could select multiple reasons","The survey included price questions","There were 860 respondents"],"People who avoided or abandoned local stores were excluded.","included only people who had made a recent purchase"),
 q("C01-Q5","RS-F05","hard","Which claim is not justified by the survey?","Helpful staff causes customers to become loyal",["Helpful staff was frequently selected by repeat shoppers","Location was also commonly selected","Multiple factors appeared relevant"],"The survey is correlational and direction may be reversed or confounded.","direction of the relationship is therefore uncertain"),
 q("C01-Q6","RS-F06","hard","Which statement is a direct finding?","54 percent selected staff helpfulness",["Helpful staff is more important than convenience for every customer","Living nearby creates loyalty","Survey answers predict future purchases perfectly"],"The percentage is directly observed in responses.","chosen by 54 percent"),
 q("C01-Q7","RS-F07","hard","Which competing explanation is explicitly discussed?","People may visit more because they live nearby, and repeated visits may increase staff familiarity",["Prices changed during the survey","Stores reduced opening hours","Respondents were paid to answer"],"The passage explicitly presents proximity and familiarity as alternatives.","repeated visits may then increase familiarity with staff"),
 q("C01-Q8","RS-F08","medium","Which recommendation is best supported?","Combine customer feedback with observed repeat-purchase behaviour",["Raise prices to test loyalty","Ignore location","Treat survey preferences as proven causes"],"The conclusion recommends pairing survey responses with behavioural data.","track repeat-purchase behaviour alongside customer feedback")
 ]
},
{
 id:"ENG008-RS-E01",title:"Do Small Wetlands Cool Nearby Streets?",genre:"environment-study",
 text:`A university field team studied six small urban wetlands during the hottest eight weeks of summer. Temperature sensors were placed at the wetland edge, 200 metres away and 500 metres away. Measurements were recorded at the same times each afternoon.

On average, locations at the wetland edge were 1.4°C cooler than locations 500 metres away. The difference was larger on dry, low-wind days and smaller after rainfall. The pattern was observed at five of the six sites.

The researchers warned that the study did not prove the wetlands alone caused the temperature difference. Streets nearest the wetlands also tended to have more trees and less paved surface than streets farther away. Both factors can affect local temperature.

The sixth site showed almost no temperature difference. It had very little tree cover around the wetland and was bordered by a large paved parking area. Researchers said this contrast was useful because it suggested that surrounding land cover may influence how much cooling is observed.

The study covered only one summer and six sites, so the findings may not apply equally to larger wetlands, different climates or other seasons. The sensors also measured air temperature, not how hot pedestrians felt in direct sunlight.

The team concluded that small wetlands were associated with cooler nearby afternoon temperatures, but the size of the effect likely depended on surrounding vegetation and paving. It recommended studying more sites over several years before using a single cooling estimate in city planning.`,
 questions:[
 q("E01-Q1","RS-F01","medium","What average temperature difference was observed between the wetland edge and locations 500 metres away?","1.4°C",["0.4°C","2.5°C","5°C"],"The second paragraph directly reports the average difference.","1.4°C cooler"),
 q("E01-Q2","RS-F02","medium","What can be inferred from the sixth site?","Wetland cooling may depend partly on surrounding land cover",["Wetlands never cool paved areas","Tree cover has no influence","The sensors at that site failed"],"The sixth site had little vegetation, much paving and little temperature difference.","surrounding land cover may influence"),
 q("E01-Q3","RS-F03","medium","Which summary is most accurate?","Wetlands were linked to cooler nearby temperatures, but surrounding conditions and limited scope prevent a simple causal estimate",["Wetlands were proven to cool every city by 1.4°C","Paving was proven to be the only temperature driver","The study found no consistent pattern"],"The conclusion uses association language and emphasises context.","associated with cooler nearby afternoon temperatures"),
 q("E01-Q4","RS-F04","hard","Which limitation most directly restricts generalisation?","Only six sites and one summer were studied",["Sensors were used","Measurements were taken in the afternoon","Five sites showed a pattern"],"The sample is small in place and time.","only one summer and six sites"),
 q("E01-Q5","RS-F05","hard","Which causal claim is not justified?","The wetlands alone caused the full 1.4°C temperature difference",["Nearby wetland areas were cooler on average","Land cover may influence the effect","The observed association varied by weather"],"Tree cover and paving differed too, so causation cannot be isolated.","did not prove the wetlands alone caused"),
 q("E01-Q6","RS-F06","hard","Which statement is a direct observation?","Five of six sites showed cooler temperatures near the wetland",["Trees were the main cause of cooling","Wetlands improve pedestrian comfort","The same effect will occur in winter"],"The five-of-six pattern is directly reported.","observed at five of the six sites"),
 q("E01-Q7","RS-F07","hard","Which factor is an explicitly identified confound?","More tree cover near the wetlands",["Sensor brand","Time zone","Number of researchers"],"Tree cover differed systematically and can affect temperature.","streets nearest the wetlands also tended to have more trees"),
 q("E01-Q8","RS-F08","medium","Which recommendation is best supported?","Study more sites over multiple years before adopting one planning estimate",["Use 1.4°C as a universal cooling value","Remove paving from every wetland immediately","Stop measuring air temperature"],"The conclusion explicitly recommends broader, longer-term study.","studying more sites over several years")
 ]
},
{
 id:"ENG008-RS-D01",title:"A Digital Tutor in First-Year Mathematics",genre:"digital-learning-evaluation",
 text:`A college evaluated an optional digital tutoring tool in an introductory mathematics course. The tool provided practice questions, hints and short explanations. Of 600 enrolled students, 280 used the tool at least five times during the semester.

Tool users scored, on average, six percentage points higher on the final exam than students who used it fewer than five times or not at all. The difference attracted attention because both groups followed the same course syllabus and took the same final exam.

However, students chose for themselves whether to use the tutor. Users were also more likely to submit weekly assignments on time and to attend optional review sessions. These behaviours suggested that motivation or study discipline may have differed between the groups.

Researchers adjusted statistically for prior grades and assignment completion, and the score gap became smaller but did not disappear. They cautioned that statistical adjustment cannot account perfectly for every unmeasured difference between users and non-users.

The evaluation also found that students who used the hint feature repeatedly without attempting problems first showed little improvement over the semester. Students who attempted a problem before opening hints tended to improve more on later practice sets.

The college concluded that use of the digital tutor was associated with stronger performance, especially when students actively attempted problems before requesting help. It did not claim that the tool alone caused the exam-score gap. The next evaluation will randomly assign access to some tutorial features to test causal effects more directly.`,
 questions:[
 q("D01-Q1","RS-F01","medium","How much higher were final-exam scores among frequent tool users on average?","Six percentage points",["Two percentage points","Ten percentage points","No difference"],"The second paragraph directly reports the six-point gap.","six percentage points higher"),
 q("D01-Q2","RS-F02","medium","What can be inferred about the score gap?","Part of it may reflect differences in motivation or study habits between users and non-users",["The tool definitely caused the entire gap","Prior grades had no relationship with performance","Review sessions lowered scores"],"Tool users also differed in assignment completion and review-session attendance.","motivation or study discipline may have differed"),
 q("D01-Q3","RS-F03","medium","Which summary is most accurate?","Tutor use was associated with better performance, but self-selection limits causal claims",["The tutor was proven to raise scores by six points","Hints always improved learning","Non-users received a different exam"],"The conclusion explicitly states association and rejects tool-only causation.","did not claim that the tool alone caused"),
 q("D01-Q4","RS-F04","hard","Which limitation most directly affects causal interpretation?","Students chose whether to use the tutor",["The same exam was used","There were 600 students","The tool included hints"],"Self-selection can make users different from non-users before treatment.","students chose for themselves"),
 q("D01-Q5","RS-F05","hard","Which statement confuses correlation with causation?","Using the tutor at least five times causes a six-point increase for any student",["Frequent users scored six points higher on average","The adjusted gap became smaller","Users attended more review sessions"],"The first statement converts an observational association into a universal causal effect.","did not claim that the tool alone caused"),
 q("D01-Q6","RS-F06","hard","Which statement is a directly reported finding?","The score gap became smaller after statistical adjustment",["Motivation was fully measured","The tutor caused better study discipline","Random assignment had already been used"],"The fourth paragraph directly reports the adjusted gap shrinking.","score gap became smaller"),
 q("D01-Q7","RS-F07","hard","Which competing explanation is explicitly raised?","More motivated students may have been more likely to use the tutor",["The final exam was easier for users","Teachers gave users extra marks","Non-users had different textbooks"],"Differences in motivation and study discipline are explicitly discussed.","motivation or study discipline may have differed"),
 q("D01-Q8","RS-F08","medium","Which next step is most appropriate?","Use random assignment for some features to test causal effects",["Assume the full six-point gap is causal","Remove the hint feature immediately","Exclude non-users from future analysis"],"The planned next evaluation uses random assignment to strengthen causal inference.","randomly assign access")
 ]
}
] as const;
export const ENG008_CP005_QUESTION_AUTHORITIES_V1=ENG008_CP005_PASSAGES_V1.flatMap(p=>p.questions.map(question=>({passage:p,question})));
