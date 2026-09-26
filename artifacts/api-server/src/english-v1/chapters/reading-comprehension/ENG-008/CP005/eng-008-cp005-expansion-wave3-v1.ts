import type{Eng008Cp005PassageV1}from"./eng-008-cp005-authorities-v1";
const q=(id:string,familyId:any,difficulty:any,question:string,correctAnswer:string,distractors:readonly[string,string,string],explanation:string,evidence:string)=>({id,familyId,difficulty,question,correctAnswer,distractors,explanation,evidence});

export const ENG008_CP005_EXPANSION_WAVE3_V1:readonly Eng008Cp005PassageV1[]=[
{
 id:"ENG008-RS-S02",title:"Does a Fixed Bedtime Improve Morning Alertness?",genre:"sleep-study",
 text:`A college wellness team studied whether keeping a more regular bedtime was related to morning alertness. For five weeks, 360 students recorded when they went to bed, when they woke up and how alert they felt during their first class of the day.

Students whose bedtime varied by less than forty-five minutes across the week reported higher average morning alertness than students whose bedtime shifted by more than two hours. They also missed fewer early classes.

At first, the team considered whether regular bedtime itself explained the difference. However, students with regular schedules were also less likely to work late shifts and more likely to eat breakfast before class. Those factors could independently affect alertness.

The researchers adjusted for reported work hours and breakfast frequency. The alertness gap became smaller but did not disappear. They cautioned that self-reported sleep and alertness measures could still contain error.

Another pattern appeared on weekends. Some students kept a regular bedtime from Monday to Thursday but shifted much later on Friday and Saturday. Their Monday alertness scores were closer to those of the irregular group than to students who kept similar times throughout the week.

The team did not interpret this as proof that weekend timing caused lower Monday alertness. Students who changed schedules on weekends also reported more evening social activity, which may have affected sleep duration as well as bedtime.

The researchers concluded that greater schedule regularity was associated with better morning alertness, but the study could not isolate regularity from related habits. They recommended a follow-up study using wearable devices and repeated alertness tests rather than relying only on daily self-reports.

The next study will also compare changes within the same student over time. If a student becomes more regular while other conditions remain similar, that pattern may provide stronger evidence than simply comparing people with very different lifestyles.`,
 questions:[
 q("S02-Q1","RS-F01","medium","Which students reported higher average morning alertness?","Those whose bedtime varied by less than forty-five minutes",["Those whose bedtime varied by more than two hours","Only students who worked late shifts","Students who skipped breakfast"],"The second paragraph directly reports higher alertness among the more regular group.","bedtime varied by less than forty-five minutes"),
 q("S02-Q2","RS-F02","medium","What can be inferred about bedtime regularity and alertness?","The relationship may partly reflect other habits such as work schedules and breakfast",["Regular bedtime was proven to be the only cause","Breakfast had no relationship with alertness","Work hours were identical across groups"],"The groups differed in other behaviours that could affect the outcome.","Those factors could independently affect alertness"),
 q("S02-Q3","RS-F03","medium","Which summary is most accurate?","Regular sleep timing was linked with better alertness, but related habits limit causal conclusions",["Regular bedtime was proven to improve every student's alertness","Weekend schedules had no relationship with Monday alertness","Self-reported sleep data was unusable"],"The conclusion states association while explicitly limiting causal interpretation.","associated with better morning alertness"),
 q("S02-Q4","RS-F04","hard","Which limitation most directly affects causal interpretation?","Students were not randomly assigned to bedtime schedules and differed in other habits",["The study lasted five weeks","Students attended college","Morning classes were observed"],"The design is observational and the groups differ on plausible confounds.","could not isolate regularity from related habits"),
 q("S02-Q5","RS-F05","hard","Which statement confuses correlation with causation?","Keeping the same bedtime will automatically make any student more alert",["More regular students reported higher alertness","The adjusted gap became smaller","Weekend shifts were associated with lower Monday scores"],"The first statement turns an observed association into a universal causal claim.","did not interpret this as proof"),
 q("S02-Q6","RS-F06","hard","Which is a directly reported finding?","The alertness gap became smaller after adjustment for work hours and breakfast",["Breakfast caused the original difference","Late shifts always reduce attendance","Weekend social activity was the main cause of lower scores"],"The fourth paragraph directly reports the adjusted result.","gap became smaller but did not disappear"),
 q("S02-Q7","RS-F07","hard","Which competing explanation is explicitly discussed for lower Monday alertness?","Students with later weekend schedules also reported more evening social activity",["Monday classes were longer","Wearable devices changed sleep behaviour","Students with regular sleep had fewer exams"],"The passage explicitly identifies weekend social activity as an alternative explanation.","also reported more evening social activity"),
 q("S02-Q8","RS-F08","medium","Which next step is best supported?","Track the same students with wearable devices and repeated alertness tests",["Assign every student the same bedtime immediately","Ignore within-person changes","Use only attendance records"],"The conclusion recommends more objective and longitudinal measurement.","using wearable devices and repeated alertness tests")
 ]
},
{
 id:"ENG008-RS-C02",title:"Do Shelf Labels Change Healthy Snack Choices?",genre:"consumer-survey",
 text:`A supermarket chain tested simple shelf labels beside selected snack foods in eight stores. The labels used a small green symbol to identify products that met the chain's criteria for lower added sugar and salt. Eight similar stores continued without the labels for the same six-week period.

Sales of labelled products rose by 12 percent in the stores using the symbols. Sales of other snacks fell slightly, though total snack sales remained almost unchanged. The chain initially considered the result evidence that the labels had shifted customer choices.

The comparison was not fully controlled. Four of the labelled stores were located near offices and received more lunchtime shoppers than most comparison stores. The chain also ran a general healthy-eating campaign on social media during the final two weeks.

Researchers therefore compared lunchtime and evening sales separately and adjusted for store size. The estimated increase in labelled-product sales became smaller but remained positive.

A short exit survey found that many customers had noticed the green symbol, but only about half could correctly explain what it represented. Some shoppers assumed it meant the product was low in calories, even though calorie content was not part of the label rule.

This raised a design concern. A simple symbol can attract attention but may also invite customers to supply their own meaning if the explanation is unclear. The chain added a short line of text under the symbol in two stores during the final week.

Because that change was tested only briefly, researchers did not treat it as a separate result. They concluded that shelf labels were associated with a shift toward the marked products, but store differences and the wider campaign made the size of the effect uncertain.

The next trial will randomly assign labels across a larger number of comparable stores and will test whether a short explanation improves understanding without making the shelf display too crowded.`,
 questions:[
 q("C02-Q1","RS-F01","medium","What happened to sales of labelled products in stores using the symbols?","They rose by 12 percent",["They fell by 12 percent","They remained unchanged","They doubled"],"The second paragraph directly reports a 12 percent increase.","rose by 12 percent"),
 q("C02-Q2","RS-F02","medium","What can be inferred from the exit survey?","Noticing a label does not guarantee understanding its exact meaning",["Customers ignored the symbols entirely","Everyone understood the criteria","The symbols reduced total snack sales sharply"],"Many shoppers noticed the symbol, but only about half interpreted it correctly.","only about half could correctly explain"),
 q("C02-Q3","RS-F03","medium","Which summary is most accurate?","Labelled products sold more, but store differences, campaign effects and misunderstanding limit a simple causal conclusion",["The green symbol was proven to improve diet quality","Total snack sales collapsed after labelling","The social-media campaign had no effect"],"The conclusion explicitly treats the observed shift as an association with several limitations.","made the size of the effect uncertain"),
 q("C02-Q4","RS-F04","hard","Which limitation most directly affects the comparison between labelled and unlabelled stores?","The stores differed in location and were not randomly assigned",["The trial lasted six weeks","Snack sales were measured","Customers were surveyed"],"Store-location differences create a plausible confound in the sales comparison.","comparison was not fully controlled"),
 q("C02-Q5","RS-F05","hard","Which statement makes an unjustified causal claim?","The shelf labels caused the full 12 percent rise in labelled-product sales",["Labelled products sold more in test stores","A social-media campaign ran during part of the trial","Adjusted estimates remained positive"],"The design cannot isolate the labels from store differences and the wider campaign.","made the size of the effect uncertain"),
 q("C02-Q6","RS-F06","hard","Which is a directly reported finding?","Some customers incorrectly believed the green symbol meant low calories",["The labels improved customers' health","Office workers were more health-conscious","Text explanations always improve sales"],"The survey directly found this misunderstanding.","assumed it meant the product was low in calories"),
 q("C02-Q7","RS-F07","hard","Which competing explanation is explicitly mentioned?","The healthy-eating social-media campaign may have influenced purchases",["Snack prices were reduced only in labelled stores","All labelled products were placed near checkouts","Comparison stores closed earlier"],"The broader campaign overlaps with the final part of the trial and could affect choices.","healthy-eating campaign ... final two weeks"),
 q("C02-Q8","RS-F08","medium","Which next step is best supported?","Randomly assign labels across more comparable stores and test clearer explanations",["Use the current 12 percent estimate as a universal effect","Remove every unlabelled snack","Stop measuring customer understanding"],"The proposed next trial directly addresses assignment and interpretation problems.","randomly assign labels ... test whether a short explanation improves understanding")
 ]
}
] as const;