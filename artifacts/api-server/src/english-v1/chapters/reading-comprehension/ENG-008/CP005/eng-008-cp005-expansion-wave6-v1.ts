import type{Eng008Cp005PassageV1}from"./eng-008-cp005-authorities-v1";
const q=(id:string,familyId:any,difficulty:any,question:string,correctAnswer:string,distractors:readonly[string,string,string],explanation:string,evidence:string)=>({id,familyId,difficulty,question,correctAnswer,distractors,explanation,evidence});
export const ENG008_CP005_EXPANSION_WAVE6_V1:readonly Eng008Cp005PassageV1[]=[
{
 id:"ENG008-RS-S03",title:"Does a Short Wind-Down Routine Improve Sleep Onset?",genre:"sleep-study",
 text:`A university wellness team studied whether a simple pre-sleep routine was associated with falling asleep more quickly. For five weeks, 280 students recorded bedtime, estimated sleep-onset time and whether they followed a twenty-minute wind-down routine without study or phone use.

Students who reported using the routine on at least five nights a week also reported shorter average sleep-onset times.

However, those students differed in other ways. They were less likely to drink caffeine after dinner and more likely to keep regular bedtimes.

Researchers adjusted for evening caffeine and bedtime variation. The difference became smaller but remained present.

The study relied on self-reported sleep onset, which can be imprecise because people do not always know exactly when they fall asleep.

Another pattern appeared during examination weeks. Routine use dropped while reported stress increased, making it difficult to separate the effect of the routine from changes in academic pressure.

The team concluded that the wind-down routine was associated with faster reported sleep onset, but the observational design could not establish causation. A follow-up experiment will randomly assign different pre-sleep routines and use wearable devices to estimate sleep timing. Researchers will also track stress and total sleep duration so that a faster sleep onset is not mistaken for better sleep overall.

 Researchers also plan to separate routine quality from routine adherence. Two students may both report a twenty-minute wind-down, but one might read quietly while another keeps checking messages despite avoiding formal study. The content of the routine could therefore matter as much as its duration. The follow-up will include a brief activity log and compare whether different low-stimulation activities produce similar results. Researchers will also measure morning sleepiness and total sleep duration because falling asleep faster is useful only if overall rest is not reduced by later bedtimes or earlier waking.`,
 questions:[
 q("S03-Q1","RS-F01","medium","Which students reported shorter sleep-onset times?","Those who used the wind-down routine on at least five nights a week",["Only students who studied late","Students who drank more caffeine","Students with irregular bedtimes"],"The second paragraph directly reports this.","at least five nights a week"),
 q("S03-Q2","RS-F02","medium","What can be inferred from the adjustment results?","Other habits explain part, but not all, of the observed difference",["Caffeine explained everything","The routine was proven causal","Bedtime variation was irrelevant"],"The gap became smaller but remained.","became smaller but remained"),
 q("S03-Q3","RS-F03","medium","Which summary is most accurate?","The routine was linked to faster reported sleep onset, but confounding and self-report limit causal claims",["The routine was proven to improve all sleep","Exam stress had no effect","Wearables were already used"],"The conclusion explicitly states association with limits.","could not establish causation"),
 q("S03-Q4","RS-F04","hard","Which limitation most directly affects measurement accuracy?","Sleep onset was self-reported",["The study lasted five weeks","Students attended university","Bedtime was recorded"],"People may not know exactly when they fall asleep.","self-reported sleep onset"),
 q("S03-Q5","RS-F05","hard","Which statement makes an unjustified causal claim?","The routine caused the full reduction in sleep-onset time",["Routine users reported shorter onset","Exam stress increased","Caffeine differed between groups"],"The study is observational and confounded.","associated with"),
 q("S03-Q6","RS-F06","hard","Which is a directly reported finding?","Routine use dropped during examination weeks",["Wearables improved sleep","Every routine user avoided caffeine","Stress caused insomnia"],"The sixth paragraph directly reports this.","Routine use dropped"),
 q("S03-Q7","RS-F07","hard","Which competing explanation is explicitly identified?","Routine users also had more regular bedtimes and less evening caffeine",["They exercised more","They had fewer classes","They used different mattresses"],"The passage names these differences directly.","less likely to drink caffeine"),
 q("S03-Q8","RS-F08","medium","Which next step is best supported?","Randomly assign routines and use wearable sleep measures",["Make the routine compulsory","Ignore stress","Measure only bedtime"],"The conclusion proposes this stronger design.","randomly assign")
 ]
},
{
 id:"ENG008-RS-C04",title:"Do Shelf-End Displays Increase Healthy Snack Purchases?",genre:"consumer-survey",
 text:`A supermarket tested whether moving selected lower-sugar snacks to shelf-end displays changed purchasing. Six stores used the display for eight weeks, while six similar stores kept the products in their usual aisles.

Sales of the displayed snacks increased in the test stores. Total snack sales changed very little.

The comparison was not random. Store managers had volunteered, and several test stores were located near gyms and offices with heavy lunchtime traffic.

Researchers adjusted for store size and time of day. The sales difference became smaller but remained positive.

Customer surveys showed that many buyers noticed the display, but only a minority said they had entered the store planning to buy those products.

The team also checked whether the display merely shifted purchases away from other lower-sugar snacks. Some substitution occurred, so the gain was smaller when the whole healthier-snack category was considered.

Price promotions complicated interpretation because two displayed products were discounted during part of the trial. Researchers concluded that shelf-end placement was associated with higher purchases of the featured products, but store selection, substitution and discounting limited a simple causal interpretation. A future trial will randomly rotate displays across stores and hold prices constant. It will also examine category-level purchasing rather than only sales of the featured items.

 The next trial will also examine whether the displays change basket composition or simply shift which snack is chosen. If customers buy a lower-sugar snack instead of another snack, that is different from adding an extra purchase to the basket. Researchers will therefore compare units per basket, category spending and whether the promoted item replaces or adds to existing snack choices. They also plan to keep packaging and price constant where possible so placement is the main changing factor. This will help distinguish visibility effects from product-specific appeal.`,
 questions:[
 q("C04-Q1","RS-F01","medium","What happened to sales of the displayed snacks?","They increased in the test stores",["They fell sharply","They were unchanged","They doubled everywhere"],"The second paragraph states this directly.","sales ... increased"),
 q("C04-Q2","RS-F02","medium","What can be inferred from category substitution?","Some featured-product gains came from shifting buyers between similar snacks",["All gains were new purchases","Substitution never occurred","Total snack sales collapsed"],"The passage says some sales shifted from other healthier snacks.","Some substitution occurred"),
 q("C04-Q3","RS-F03","medium","Which summary is most accurate?","Shelf-end placement was linked to higher featured-product sales, but several design factors limit causal certainty",["Placement was proven to improve diet quality","All stores were randomly assigned","Discounts had no role"],"The conclusion states this directly.","limited a simple causal interpretation"),
 q("C04-Q4","RS-F04","hard","Which limitation most directly affects causal interpretation?","Stores volunteered rather than being randomly assigned",["The trial lasted eight weeks","Snacks were sold","Customers were surveyed"],"Volunteer stores may differ systematically.","comparison was not random"),
 q("C04-Q5","RS-F05","hard","Which statement makes an unjustified causal claim?","Shelf-end placement caused all of the sales increase",["Sales rose","Some products were discounted","Substitution occurred"],"Multiple confounds prevent this conclusion.","associated with"),
 q("C04-Q6","RS-F06","hard","Which is a directly reported finding?","Total snack sales changed very little",["All buyers planned the purchase","Discounts reduced sales","Every store was near a gym"],"The second paragraph states this directly.","Total snack sales changed very little"),
 q("C04-Q7","RS-F07","hard","Which competing explanation is explicitly identified?","Discounts on two displayed products may have increased sales",["Store lighting changed","Cashiers recommended the snacks","Packaging was redesigned"],"The passage names price promotions as a confound.","discounted during part of the trial"),
 q("C04-Q8","RS-F08","medium","Which next step is best supported?","Randomly rotate displays while keeping prices constant",["Expand immediately","Measure only featured items","Ignore category substitution"],"The final paragraph proposes this design.","randomly rotate")
 ]
},
{
 id:"ENG008-RS-E04",title:"Do Rain Gardens Reduce Runoff on School Grounds?",genre:"environment-study",
 text:`A district installed small rain gardens beside four school parking areas to test whether they reduced surface runoff during moderate storms. Four similar parking areas without rain gardens were used for comparison.

Sensors measured how quickly water left each site after rainfall. During most moderate storms, runoff peaks were lower at the rain-garden sites.

The difference was smaller during very heavy rain, when the gardens filled quickly and excess water bypassed the planted areas.

The comparison was not perfectly controlled. Two rain-garden sites had more permeable surrounding soil than the comparison sites.

Researchers adjusted for measured soil infiltration rates. The estimated benefit became smaller but remained present for moderate storms.

Maintenance also mattered. One garden became partly blocked by leaves, and runoff performance worsened until the inlet was cleared.

The district concluded that rain gardens were associated with lower runoff peaks under moderate conditions, but soil differences and maintenance affected performance. A larger trial will randomly select treatment locations within similar soil zones and track maintenance time. It will also measure water quality to see whether the gardens reduce pollutants as well as runoff volume.

 Researchers will also compare how quickly the gardens recover after very heavy storms. A system that performs well during moderate rain but remains saturated for many hours may be less useful if another storm arrives soon afterward. Soil moisture, ponding duration and overflow frequency will therefore be recorded together. The team also wants to compare plant survival because vegetation affects infiltration and long-term maintenance. If a design reduces runoff only when plants remain healthy, maintenance quality becomes part of the treatment rather than a separate operational detail.`,
 questions:[
 q("E04-Q1","RS-F01","medium","When were runoff peaks generally lower at rain-garden sites?","During most moderate storms",["Only during drought","During every extreme storm","Never"],"The second paragraph states this directly.","most moderate storms"),
 q("E04-Q2","RS-F02","medium","What can be inferred about very heavy rain?","The gardens may have limited capacity when they fill quickly",["Rain gardens work best only when full","Heavy rain improves infiltration","Bypass water disappears"],"The passage explains weaker performance under extreme rainfall.","filled quickly"),
 q("E04-Q3","RS-F03","medium","Which summary is most accurate?","Rain gardens reduced moderate-storm runoff, but site conditions and maintenance influenced results",["Rain gardens prevented all flooding","Soil type did not matter","Maintenance was unnecessary"],"The conclusion states the balanced result.","soil differences and maintenance"),
 q("E04-Q4","RS-F04","hard","Which limitation most directly affects causal interpretation?","Treatment and comparison sites differed in soil permeability",["Storms were measured","Schools had parking areas","Leaves existed"],"Soil differences can independently affect runoff.","more permeable surrounding soil"),
 q("E04-Q5","RS-F05","hard","Which statement makes an unjustified causal claim?","Rain gardens caused the full runoff difference at all sites",["Runoff peaks were lower","Heavy-rain effects were smaller","Soil differed"],"The design cannot isolate the full effect.","associated with"),
 q("E04-Q6","RS-F06","hard","Which is a directly reported finding?","One blocked inlet reduced performance until it was cleared",["All gardens failed","Water quality improved","Maintenance time fell"],"The sixth paragraph directly reports this.","runoff performance worsened"),
 q("E04-Q7","RS-F07","hard","Which competing explanation is explicitly identified?","More permeable soil may explain part of the lower runoff",["Parking fees changed","Students planted more trees","Rainfall was artificial"],"The passage names soil permeability as a confound.","more permeable surrounding soil"),
 q("E04-Q8","RS-F08","medium","Which next step is best supported?","Compare similar soil zones and track maintenance and water quality",["Install gardens everywhere immediately","Ignore heavy storms","Measure only rainfall"],"The final paragraph proposes this broader evaluation.","similar soil zones")
 ]
},
{
 id:"ENG008-RS-D05",title:"Do Explanation Prompts Improve Error Review?",genre:"digital-learning-evaluation",
 text:`An online learning platform tested a feature that asked students to write one short sentence explaining why an incorrect answer was wrong before moving to the next question.

Half of new users received the prompt for six weeks, while the other half could continue immediately after viewing the correct answer and explanation.

Prompt users spent more time reviewing incorrect questions and were less likely to repeat the same error type within the same practice session.

However, they also completed fewer total questions because each review took longer.

The study measured repeated error categories rather than exam performance. A lower repeat rate during one session did not prove that learning lasted.

Survey responses were mixed. Some users said writing a sentence forced them to notice the exact mistake, while others felt the prompt interrupted momentum.

The platform also found that users skipped more prompts on mobile devices, where typing was slower. The company concluded that explanation prompts improved immediate error review but created a trade-off with practice volume and convenience. A follow-up experiment will test optional voice responses and a delayed quiz. Researchers will also compare whether prompts help more on conceptual mistakes than on simple factual slips.

 The follow-up will also distinguish between explanation quality and explanation completion. A learner can type a vague sentence simply to continue, so researchers will sample responses and code whether they identify the actual misconception. This may reveal whether the benefit comes from genuine reflection or merely from slowing users down. The platform will also test shorter prompts such as selecting the reason for an error from a small set of categories. That could preserve reflection while reducing typing burden on mobile devices. Comparing written, voice and structured responses will show whether the learning effect depends on the act of explanation or the effort required to produce it.`,
 questions:[
 q("D05-Q1","RS-F01","medium","What happened to repeated error types among prompt users?","They were less likely within the same session",["They increased sharply","They were not measured","They disappeared permanently"],"The third paragraph states this directly.","less likely to repeat"),
 q("D05-Q2","RS-F02","medium","What can be inferred about the prompt's cost?","It reduced practice volume because review took longer",["It increased question count","It had no time cost","It removed explanations"],"Prompt users completed fewer total questions.","completed fewer total questions"),
 q("D05-Q3","RS-F03","medium","Which summary is most accurate?","Explanation prompts improved immediate review but traded off against speed and did not yet prove long-term learning",["The prompts guaranteed exam gains","All users preferred them","Mobile users typed faster"],"The conclusion and limitation state this directly.","trade-off with practice volume"),
 q("D05-Q4","RS-F04","hard","Which limitation most directly affects claims about long-term learning?","The study measured same-session errors rather than delayed performance",["Users answered questions","The trial lasted six weeks","Explanations existed"],"The study did not test retention.","did not prove that learning lasted"),
 q("D05-Q5","RS-F05","hard","Which statement makes an unjustified causal claim?","The prompts improved final exam scores",["Prompt users reviewed longer","Repeated errors fell in-session","Question volume fell"],"Exam scores were not measured.","rather than exam performance"),
 q("D05-Q6","RS-F06","hard","Which is a directly reported finding?","Mobile users skipped more prompts",["Voice responses improved learning","All users liked writing","Prompts increased question volume"],"The seventh paragraph states this directly.","skipped more prompts on mobile devices"),
 q("D05-Q7","RS-F07","hard","Which competing mechanism is explicitly identified?","Longer review time may reduce total practice exposure",["Users received easier questions","Prompts changed answer keys","Mobile screens were larger"],"The passage links prompt time with fewer completed questions.","each review took longer"),
 q("D05-Q8","RS-F08","medium","Which next step is best supported?","Add delayed testing and compare different response methods",["Make prompts mandatory everywhere","Ignore device type","Measure only review time"],"The final paragraph proposes delayed quizzes and voice responses.","delayed quiz")
 ]
}
] as const;