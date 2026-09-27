import type{Eng008Cp005PassageV1}from"./eng-008-cp005-authorities-v1";
const q=(id:string,familyId:any,difficulty:any,question:string,correctAnswer:string,distractors:readonly[string,string,string],explanation:string,evidence:string)=>({id,familyId,difficulty,question,correctAnswer,distractors,explanation,evidence});
export const ENG008_CP005_EXPANSION_WAVE12_V1:readonly Eng008Cp005PassageV1[]=[
{
 id:"ENG008-RS-W14",title:"Do Short Focus Blocks Reduce Task Switching?",genre:"workplace-study",
 text:`A design firm tested whether twenty-five-minute focus blocks followed by five-minute breaks would reduce task switching during individual work. Fifty-two employees volunteered for a four-week pilot.

During the first week, employees worked normally while software recorded how often they changed between project files, email and messaging tools. For the next three weeks, one team used timed focus blocks for two hours each morning. Another team continued its usual work pattern.

The focus-block team showed fewer application switches during the scheduled two-hour period. Employees also reported that it was easier to return to unfinished design work after interruptions.

However, message response time increased slightly during the focus periods because routine messages were checked mainly during breaks. Urgent channels remained available. The teams differed in project type. The focus-block team was working on longer design tasks, while the comparison team handled more client revisions. That difference could explain part of the switching pattern.

Researchers also found that some employees ignored the timer when they entered a productive flow state. Others stopped early when a task naturally finished. Strict adherence therefore varied.

Task output did not increase consistently. Some employees completed more planned work, while others simply reported feeling less fragmented.

The study did not measure creative quality or end-of-day fatigue. It also covered only morning work, not the full day.

A follow-up will rotate both teams through the method and compare fixed timers with self-selected focus lengths. Researchers will also measure total daily switching so they can see whether reduced morning switching is merely displaced into the afternoon. The preliminary result suggests timed focus blocks can reduce short-term switching, but their usefulness depends on task type and whether the timing fits natural work boundaries.  Researchers also compared switching immediately before and after the focus window. The intervention group showed a small rebound in message checking during the first fifteen minutes after the protected period, suggesting that some deferred communication accumulated rather than disappeared. Employees differed in how disruptive they found that rebound. People with few external dependencies liked the method more than those coordinating across several teams. The follow-up will therefore classify work by interdependence and measure whether focus blocks shift interruptions to another part of the day. It will also record subjective effort because fewer switches may still feel demanding if workers must suppress frequent incoming requests.`,
 questions:[
 q("W14-Q1","RS-F01","medium","What was the main intervention?","Two hours of morning work organised into twenty-five-minute focus blocks",["A ban on all messaging","A shorter workday","Daily client meetings"],"The treatment team used repeated focus-and-break cycles during part of the morning.","twenty-five-minute focus blocks"),
 q("W14-Q2","RS-F02","hard","Why is the team comparison difficult to interpret?","The teams were doing different kinds of work",["No baseline data existed","Both teams used timers","Switching was not recorded"],"Long design tasks and client-revision work may naturally involve different switching patterns.","differed in project type"),
 q("W14-Q3","RS-F03","hard","Which conclusion is best supported?","Focus blocks reduced switching during the scheduled period but did not clearly increase total output",["The method improves every job","Message response became faster","Task quality definitely increased"],"The clearest measured effect was lower switching, while output results were mixed.","did not increase consistently"),
 q("W14-Q4","RS-F04","medium","What trade-off appeared during focus periods?","Routine message responses became slightly slower",["Urgent messages were blocked","Project files disappeared","Breaks became longer"],"Employees checked non-urgent messages less often while concentrating.","response time increased slightly"),
 q("W14-Q5","RS-F05","medium","Why does variable timer adherence matter?","The intervention was not experienced in exactly the same way by every participant",["Timers cannot be measured","Every worker stopped early","Only the comparison group used breaks"],"Some employees extended or shortened focus periods according to workflow.","Strict adherence ... varied"),
 q("W14-Q6","RS-F06","hard","Which is a directly reported finding?","Application switching decreased during the scheduled focus period",["Creative quality improved","End-of-day fatigue fell","Afternoon switching decreased"],"Software logs directly recorded fewer switches during the treatment window.","fewer application switches"),
 q("W14-Q7","RS-F07","hard","Which unmeasured outcome limits interpretation?","Creative quality",["Application switching","Message response time","Self-reported fragmentation"],"The study did not examine whether fewer switches improved or harmed the quality of creative work.","did not measure creative quality"),
 q("W14-Q8","RS-F08","medium","Which follow-up is best supported?","Use a crossover design and compare fixed with self-selected focus lengths",["Remove switching measures","Study only one team","Require every employee to ignore natural task endings"],"The proposed design addresses team differences and fit between timer length and work structure.","rotate both teams")
 ]
},
{
 id:"ENG008-RS-W15",title:"Does a Shared Decision Log Reduce Repeated Discussion?",genre:"workplace-study",
 text:`A product team tested a shared decision log after noticing that the same design questions were reopened in several meetings. The log recorded the decision, date, main reason, alternatives considered and any condition that would justify revisiting it.

For one month before the trial, researchers reviewed meeting notes and counted how often a previously settled issue was discussed again without new evidence. During the next two months, the team used the decision log alongside normal meeting minutes.

Repeated discussion of settled issues declined. Team members also reported spending less time searching old chat threads to remember why a choice had been made.

The log did not prevent legitimate reconsideration. In several cases, a recorded condition changed, such as a supplier delay or new user research, and the team reopened the decision deliberately.

A challenge appeared when entries became too long. Staff sometimes copied full meeting notes into the log, making the important reason difficult to find. The team then limited the rationale field to three short points and linked to detailed notes separately.

The study had no external comparison team. Workload and team membership also changed slightly during the two-month intervention, so improvement cannot be attributed solely to the log.

Researchers did not measure product quality or whether faster meetings led to better decisions. They measured only repetition, search effort and user experience.

A follow-up will test the log across several teams and compare a minimal version with a more detailed version. It will also measure how often decisions are reopened for valid new evidence versus simple loss of organisational memory. The preliminary result suggests a decision log can reduce repeated debate when it preserves the reason and the conditions for reopening, but excessive documentation can make the record harder to use.  Researchers also reviewed the age of decisions that were reopened. The log seemed most useful for choices made several weeks earlier, when memory of the original rationale had faded. Recent decisions were rarely reopened even before the intervention. This suggests the tool may act mainly as organisational memory rather than as a universal meeting-control mechanism. The team also found that decision ownership mattered: entries without a clearly named owner were more likely to remain ambiguous when conditions changed. A follow-up will therefore test whether owner fields improve clarity and whether the log continues to be used after the novelty of the trial disappears.`,
 questions:[
 q("W15-Q1","RS-F01","medium","What information did the decision log record?","The decision, reason, alternatives and conditions for revisiting it",["Only meeting attendance","Employee salaries","Customer addresses"],"The log was designed to preserve both the choice and why it was made.","main reason"),
 q("W15-Q2","RS-F02","hard","Why is causal interpretation limited?","There was no comparison team and other workplace conditions changed",["The log was never used","Meeting notes were unavailable","No outcomes were measured"],"Without a control, other changes could partly explain reduced repetition.","no external comparison team"),
 q("W15-Q3","RS-F03","hard","Which conclusion is best supported?","A concise decision log may reduce repeated discussion while still allowing evidence-based reconsideration",["Every decision should become permanent","Longer records are always better","Meeting minutes should be removed"],"The log worked best when it captured reasons and reopening conditions without copying everything.","conditions for reopening"),
 q("W15-Q4","RS-F04","medium","What happened when entries became too long?","Important reasons became harder to find",["The log stopped saving dates","Meetings became longer automatically","Alternatives disappeared"],"Copying full notes reduced the usefulness of the summary record.","difficult to find"),
 q("W15-Q5","RS-F05","medium","Why were some decisions legitimately reopened?","Relevant conditions such as supplier information or user evidence changed",["Staff forgot the log existed","Every decision expired monthly","The team wanted longer meetings"],"The system explicitly allowed reconsideration when new facts altered the basis of the original choice.","condition changed"),
 q("W15-Q6","RS-F06","hard","Which is a directly reported finding?","Repeated discussion of settled issues declined",["Product quality improved","Every meeting became shorter","Team size stayed constant"],"The study directly counted how often settled issues resurfaced without new evidence.","Repeated discussion ... declined"),
 q("W15-Q7","RS-F07","hard","Which outcome was not measured?","Product quality",["Search effort","Repeated discussion","User experience"],"The study notes that faster or less repetitive meetings were not linked to product outcomes.","did not measure product quality"),
 q("W15-Q8","RS-F08","medium","Which next step is best supported?","Test the log across several teams and compare different levels of detail",["Remove reopening conditions","Use only one long rationale field","Measure attendance only"],"A broader comparison can test generalisability and the optimal amount of documentation.","several teams")
 ]
},
{
 id:"ENG008-RS-T10",title:"Do Parcel Lockers Reduce Failed Home Deliveries?",genre:"transport-survey",
 text:`A delivery company installed parcel lockers beside three commuter stations and offered nearby customers the option to redirect selected deliveries there.

For eight weeks before installation, researchers recorded failed home-delivery attempts in the surrounding neighbourhoods. During the twelve-week pilot, they tracked locker use, redelivery attempts and customer travel distance reported in surveys.

Customers who chose lockers had fewer failed deliveries because parcels could be deposited even when no one was home. Courier drivers also spent less time making second attempts for those packages.

However, the benefit was partly offset by customer travel. Some users collected parcels during an existing commute, while others made a separate trip to the station. Locker capacity mattered during festival weeks. Full compartments forced some parcels back into the normal delivery system, reducing the advantage.

The study was not randomised. Customers chose whether to use a locker, and people with frequent delivery problems may have been more likely to opt in.

Researchers compared users with similar past failed-delivery rates and still found fewer repeat attempts among locker users, but self-selection could remain.

The pilot did not measure emissions directly. Fewer van redeliveries might reduce travel, yet extra customer trips could offset part of that effect.

A follow-up will randomise free locker credits among eligible customers, record actual travel patterns where participants consent and test larger lockers during peak periods. The preliminary evidence suggests parcel lockers can reduce failed deliveries, especially when collection fits an existing journey and locker capacity is sufficient.  Researchers also examined package size. Small parcels fit lockers easily, while larger boxes sometimes exceeded available compartment dimensions even when a locker bank had empty spaces. This meant nominal locker capacity could overstate practical capacity for a particular delivery mix. The company therefore plans to classify compartments by size in the next pilot. Customer surveys also found that some users valued lockers for privacy or theft prevention even when they had rarely missed home deliveries. Those benefits are separate from the failed-delivery outcome and could influence voluntary uptake. A larger study will need to distinguish convenience, security and transport effects rather than treat all locker use as one behaviour.  Researchers will also compare weekday and weekend collection patterns, because lockers near commuter stations may be convenient during work travel but less useful when people remain at home.`,
 questions:[
 q("T10-Q1","RS-F01","medium","What was the intervention?","Optional parcel lockers near commuter stations",["More home-delivery vans","Higher delivery fees","Longer delivery windows"],"Customers could redirect eligible packages to secure station lockers.","parcel lockers"),
 q("T10-Q2","RS-F02","hard","Why is the study not fully causal?","Customers chose whether to use the lockers",["Failed deliveries were not recorded","The pilot had no before period","Lockers were never full"],"Self-selection can make locker users different from non-users before the intervention.","chose whether to use"),
 q("T10-Q3","RS-F03","hard","Which conclusion is best supported?","Lockers can reduce failed deliveries, but overall travel effects depend on customer collection trips and capacity",["Lockers always reduce emissions","Every customer should use a locker","Home delivery became impossible"],"The intervention reduced repeat van visits while potentially adding some user travel.","extra customer trips"),
 q("T10-Q4","RS-F04","medium","What happened during festival weeks?","Some lockers filled and parcels returned to normal delivery",["All lockers were removed","Customers stopped ordering","Home deliveries ended"],"Capacity constraints reduced the availability of the locker option during peak demand.","Full compartments"),
 q("T10-Q5","RS-F05","medium","Why compare customers with similar past failure rates?","To reduce one source of difference between locker users and non-users",["To randomise the study fully","To measure locker size","To increase failed deliveries"],"Matching on prior experience partially addresses self-selection.","similar past failed-delivery rates"),
 q("T10-Q6","RS-F06","hard","Which is a directly reported finding?","Locker users had fewer failed delivery attempts",["Emissions definitely fell","Every collection occurred during commuting","Customer travel disappeared"],"The operational data directly showed fewer repeat delivery failures among users.","fewer failed deliveries"),
 q("T10-Q7","RS-F07","hard","Which unmeasured outcome limits the environmental conclusion?","Actual emissions",["Locker use","Redelivery attempts","Customer surveys"],"The study cannot determine net emissions without measuring both van and customer travel effects.","did not measure emissions directly"),
 q("T10-Q8","RS-F08","medium","Which next step is best supported?","Randomise locker incentives and measure actual travel patterns",["Remove capacity tracking","Study only festival weeks","Exclude prior delivery data"],"Randomisation strengthens causal inference and travel data clarifies net transport effects.","randomise free locker credits")
 ]
},
{
 id:"ENG008-RS-S08",title:"Does Evening Street Noise Affect Sleep Continuity?",genre:"sleep-study",
 text:`Researchers studied whether evening street noise was associated with fragmented sleep in adults living near a busy road. Eighty participants wore sound sensors in their bedrooms and wrist activity monitors for two weeks.

The sensors recorded average and peak sound levels between 9 p.m. and 2 a.m. Participants also completed morning diaries describing awakenings and perceived sleep quality.

Nights with higher peak noise were associated with more recorded movement and more self-reported awakenings. Average sound level showed a weaker relationship.

The study was observational. Traffic noise may have coincided with other factors such as warmer nights, open windows or weekend social activity. Researchers recorded bedroom temperature and whether windows were open. The association with peak noise became smaller but remained after statistical adjustment.

The sound sensor could not identify the source of every event. A loud motorcycle, a television inside the home or a dropped object could produce similar peaks.

Participants living on higher floors had slightly lower recorded peak levels, but floor height was also related to apartment type and income.

The study did not measure brain activity, so wrist movement could not confirm every awakening. It also lasted only two weeks.

A follow-up will use source-classifying audio features that do not store intelligible speech, include longer monitoring and test whether temporary window inserts reduce night-time noise. The preliminary evidence suggests sudden noise peaks may matter more for sleep continuity than average evening sound level, but causal claims require stronger intervention evidence.  Researchers also asked participants about bedroom orientation and whether they used fans or air conditioners, since both can affect noise exposure and sleep. Apartments facing the main road recorded higher peaks on average, but residents in those units were also more likely to keep windows closed. That behavioural response could reduce part of the exposure difference. The follow-up will therefore combine indoor and outdoor sensors and analyse nights by ventilation state. Investigators also plan to test whether subjective annoyance predicts awakenings beyond measured decibel level, because the meaning and predictability of a sound may influence sleep response as well as its physical intensity.  Investigators will also record traffic volume outside each building so measured bedroom noise can be linked more directly to external road activity rather than treated as one undifferentiated sound environment.`,
 questions:[
 q("S08-Q1","RS-F01","medium","What did the study measure in bedrooms?","Sound levels and sleep-related movement",["Air pollution only","Bed size","Daily income"],"Participants wore or used sensors that recorded acoustic exposure and movement-based sleep estimates.","sound sensors"),
 q("S08-Q2","RS-F02","hard","Why can't the study prove that traffic noise caused the awakenings?","Noise exposure was observed rather than randomly assigned and could coincide with other factors",["No sound was measured","Sleep diaries were unavailable","Every participant lived on the same floor"],"Observational association can reflect confounding by temperature, open windows or behaviour.","observational"),
 q("S08-Q3","RS-F03","hard","Which conclusion is best supported?","Peak noise was more strongly associated with disrupted sleep than average sound level",["Average noise had no relationship at all","Traffic noise definitely caused insomnia","Higher floors prevent awakenings"],"Both movement and diaries showed a stronger association with sudden peaks.","higher peak noise"),
 q("S08-Q4","RS-F04","medium","What happened after adjustment for temperature and open windows?","The peak-noise association became smaller but remained",["It disappeared entirely","It became much larger","No adjustment was possible"],"Measured covariates explained part but not all of the observed relationship.","smaller but remained"),
 q("S08-Q5","RS-F05","medium","Why is source identification a limitation?","Not every loud sound was necessarily traffic noise",["The sensor measured no peaks","Motorcycles are silent","Indoor noise cannot affect sleep"],"Similar acoustic peaks could come from inside or outside the home.","could not identify the source"),
 q("S08-Q6","RS-F06","hard","Which is a directly reported finding?","Higher peak noise coincided with more reported awakenings",["Window inserts improved sleep","Brain-wave awakenings increased","Income caused noise exposure"],"The study directly found an association between peak sound and both movement and diary awakenings.","more self-reported awakenings"),
 q("S08-Q7","RS-F07","hard","Which measurement limitation affected sleep assessment?","Wrist movement cannot confirm every awakening",["Participants did not wear monitors","Sound sensors measured only temperature","Diaries recorded no sleep data"],"Movement-based estimates are indirect compared with brain-activity measurement.","did not measure brain activity"),
 q("S08-Q8","RS-F08","medium","Which next step is best supported?","Test a noise-reduction intervention with longer monitoring",["Stop measuring sound","Use only one-night studies","Ignore indoor noise"],"An intervention would strengthen causal inference while longer monitoring improves reliability.","window inserts")
 ]
},
{
 id:"ENG008-RS-C09",title:"Do Repairability Labels Change Appliance Choice?",genre:"consumer-survey",
 text:`Researchers tested whether a simple repairability label influenced consumer choices between small appliances. Seven hundred adults completed an online shopping task involving kettles, fans and vacuum cleaners.

Participants were randomly assigned to product pages showing either price and features only or the same information plus a repairability score from one to ten. A short note explained that higher scores reflected easier access to spare parts, disassembly and repair information.

The labelled group was more likely to choose products with higher repairability when price differences were small. The effect weakened when the more repairable product cost substantially more.

Participants who had recently experienced an appliance failure responded more strongly to the label than those who had not. The study measured stated choices, not real purchases. Participants did not spend their own money, wait for a repair or verify whether spare parts were actually available.

Researchers also asked what people thought the score meant. Some incorrectly assumed a high score meant the product was less likely to fail, even though the label described ease of repair rather than reliability.

The team added a clarification in a second small pilot: “This score does not predict failure rate.” Misinterpretation decreased.

The study did not test brand loyalty, extended warranties or retailer repair services, all of which could influence real decisions.

A follow-up will run a field experiment with real discounts and track whether consumers later use repair services. The preliminary evidence suggests repairability information can influence choice, but the label must clearly distinguish ease of repair from product durability.  Researchers also measured how long participants spent viewing the label. Some shoppers noticed the score only after comparing price, while others used it early to narrow the options. This suggests the same label can influence different stages of choice. The field trial will therefore track click sequence and whether repairability information changes search effort as well as final purchase. Investigators also plan to test whether showing expected spare-parts availability in years improves interpretation, since a single score may hide why a product is easier to repair. Any added detail, however, risks making the label too complex for quick shopping decisions.  Researchers will also test whether the label changes willingness to pay for repairable products rather than only which option is chosen at a fixed price.`,
 questions:[
 q("C09-Q1","RS-F01","medium","What did the repairability score represent?","Ease of parts access, disassembly and repair information",["Probability of never failing","Energy use only","Retailer profit"],"The label described how repairable the product was, not whether it would fail.","easier access to spare parts"),
 q("C09-Q2","RS-F02","hard","Why is the online choice task limited?","Participants did not face real financial or repair consequences",["Prices were not shown","No appliances were compared","Random assignment was absent"],"Hypothetical choices can differ from decisions made with actual money and future repair needs.","not real purchases"),
 q("C09-Q3","RS-F03","hard","Which conclusion is best supported?","Repairability labels can influence choice, especially when price differences are modest, but they can be misunderstood",["Repairability always outweighs price","High scores prove reliability","Labels guarantee future repair"],"The study found a conditional choice effect and an interpretation problem.","effect weakened"),
 q("C09-Q4","RS-F04","medium","When was the label effect weaker?","When the higher-repairability product cost much more",["When prices were similar","Among people with recent appliance failure","After the score was explained"],"A larger price trade-off reduced willingness to choose the more repairable option.","cost substantially more"),
 q("C09-Q5","RS-F05","medium","Why was a clarification added in the second pilot?","Some participants confused repairability with reliability",["The score had no scale","Prices were missing","Participants could not see products"],"The note corrected the mistaken belief that a repair score predicted failure frequency.","less likely to fail"),
 q("C09-Q6","RS-F06","hard","Which is a directly reported finding?","People with recent appliance failures responded more strongly to the label",["Real repair rates increased","Brand loyalty disappeared","High-score products lasted longer"],"The study directly observed a stronger choice effect in that subgroup.","responded more strongly"),
 q("C09-Q7","RS-F07","hard","Which factor limits generalisation to real retail settings?","Brand loyalty and service arrangements were not tested",["Repairability was randomised","Scores ranged from one to ten","Three product types were included"],"Real purchases may depend on brands, warranties and repair networks beyond the label.","did not test brand loyalty"),
 q("C09-Q8","RS-F08","medium","Which next step is best supported?","Test real purchase incentives and later repair behaviour",["Remove price information","Measure label visibility only","Assume scores predict durability"],"A field experiment can connect stated preference to actual buying and repair use.","real discounts")
 ]
},
{
 id:"ENG008-RS-E10",title:"Do Reflective Pavements Reduce Surface Heat?",genre:"environment-study",
 text:`A city engineering team tested a light-coloured reflective coating on two small parking areas to see whether it reduced surface temperature during hot weather. Two nearby uncoated areas served as comparisons.

Temperature sensors recorded pavement surface temperature every fifteen minutes for eight weeks. Air temperature, cloud cover and time of day were recorded as well.

On clear afternoons, coated pavement was cooler at the surface than uncoated pavement. The difference was smaller in the morning and on cloudy days.

Researchers also measured air temperature one metre above the ground. Differences there were much smaller and inconsistent. The coated sites reflected more sunlight, but drivers reported greater glare around midday. The city added this as a design concern rather than treating lower surface temperature as the only outcome.

One coated area had more tree shade than its comparison site. Researchers analysed only fully sunlit periods separately and still found a surface-temperature difference, though the sample became smaller.

The coating also became slightly darker as dust accumulated. Cleaning restored some reflectivity, raising questions about maintenance.

The pilot did not measure building energy use, pedestrian comfort or long-term coating durability.

A follow-up will test larger street sections, standardise shade exposure and monitor reflectivity after rain, cleaning and traffic wear. The preliminary evidence supports a narrow conclusion: reflective coating lowered pavement surface temperature under strong sun, but effects on surrounding air and broader urban heat remain uncertain.  Researchers also measured surface brightness and found that the coolest coated sections were generally the most reflective. Yet greater reflectivity also corresponded with stronger glare reports, illustrating a trade-off rather than a simple improvement. The city will therefore test coatings with different reflectance levels instead of treating maximum reflectivity as the only goal. Maintenance cost will also be tracked because repeated cleaning or recoating could reduce practical value. A larger trial will include pedestrian routes and adjacent building walls to examine whether reflected radiation changes comfort nearby even when pavement itself becomes cooler.  The team will also compare coated and uncoated sections after several months of traffic wear. If reflectivity falls quickly, a strong short-term cooling result may not translate into durable benefit. Researchers will record cleaning frequency, resurfacing cost and skid resistance so thermal performance is not evaluated in isolation from road safety and maintenance.`,
 questions:[
 q("E10-Q1","RS-F01","medium","What was the main intervention?","A light-coloured reflective pavement coating",["New trees only","Underground cooling pipes","Reduced parking hours"],"Two parking areas received a reflective surface treatment.","reflective coating"),
 q("E10-Q2","RS-F02","hard","Why was tree shade a confound?","One treated area received more shade, which can also reduce surface temperature",["Shade increases sunlight","Trees changed sensor timing","Comparison sites had no pavement"],"Different solar exposure could explain part of the temperature gap.","more tree shade"),
 q("E10-Q3","RS-F03","hard","Which conclusion is best supported?","The coating reduced surface temperature in strong sun, but broader air-temperature effects were unclear",["The coating cooled the whole city","Glare disappeared","Air temperature always fell equally"],"The strongest consistent effect was on the pavement itself.","surface temperature"),
 q("E10-Q4","RS-F04","medium","When was the surface-temperature difference largest?","On clear afternoons",["At night","On cloudy mornings","During rainfall"],"Strong sunlight produced the clearest treatment difference.","clear afternoons"),
 q("E10-Q5","RS-F05","medium","Why was dust accumulation important?","It reduced reflectivity and may change performance over time",["Dust increased glare permanently","It cooled the air","It changed parking demand only"],"Maintenance can affect how well the coating continues reflecting sunlight.","became slightly darker"),
 q("E10-Q6","RS-F06","hard","Which is a directly reported finding?","Surface temperatures were lower on coated pavement under clear afternoon conditions",["Building energy use fell","Pedestrian comfort improved","Coating durability was proven"],"Sensors directly measured a surface-temperature difference.","coated pavement was cooler"),
 q("E10-Q7","RS-F07","hard","Which outcome was not measured?","Building energy use",["Pavement surface temperature","Air temperature","Cloud cover"],"The study explicitly lists building energy among outcomes outside the pilot.","did not measure building energy use"),
 q("E10-Q8","RS-F08","medium","Which next step is best supported?","Test larger areas while controlling shade and monitoring durability",["Measure only midday glare","Remove comparison sites","Ignore maintenance"],"The proposed follow-up addresses scale, confounding and long-term performance.","test larger street sections")
 ]
},
{
 id:"ENG008-RS-D15",title:"Does Retrieval Before Feedback Improve Recall?",genre:"digital-learning-evaluation",
 text:`A digital history course tested whether asking learners to attempt an answer before showing feedback improved later recall. Six hundred students were randomly assigned to two practice formats after reading the same short lesson.

The retrieval group saw a question and had twenty seconds to type or select an answer before the explanation appeared. The study group saw the question and explanation together without first attempting an answer.

Immediately after practice, the study group rated the material as easier. Two days later, the retrieval group remembered slightly more facts on a delayed quiz. The benefit was larger for questions that students initially answered incorrectly but then corrected after feedback.

However, the retrieval format took more time because learners paused before receiving the explanation. Extra time-on-task could contribute to the memory difference.

Researchers created a small third condition in which learners waited twenty seconds without attempting an answer. That group's delayed performance was between the main groups but closer to the study condition.

This suggests active retrieval may contribute beyond delay alone, though the third condition was smaller. The study measured factual recall, not essay quality or transfer to unfamiliar historical problems.

Some learners in the retrieval group reported frustration when they had no idea of the answer. Researchers plan to test an “I don't know yet” option that still preserves a brief retrieval attempt without forcing random guessing.

A follow-up will equalise total study time more tightly and include a one-week test. The preliminary evidence suggests attempting retrieval before feedback can strengthen short-term recall, but time cost and learner frustration should be considered.  Researchers also coded the kinds of facts remembered. The retrieval advantage was somewhat larger for dates and named events than for broad thematic statements, although the study was not powered to make strong claims about item type. This raises the possibility that retrieval timing interacts with the form of knowledge being tested. The follow-up will include conceptual questions and source-evaluation items so the intervention is not judged only on isolated factual memory. Researchers will also record whether repeated retrieval attempts become faster over time, which could indicate growing fluency but might also encourage guessing if learners rush.  Researchers will also examine whether repeated retrieval improves confidence calibration or merely factual recall.`,
 questions:[
 q("D15-Q1","RS-F01","medium","What did the retrieval group do before seeing feedback?","Attempted an answer",["Read the explanation first","Skipped every question","Watched a video"],"The intervention required a response attempt before the solution appeared.","attempt an answer"),
 q("D15-Q2","RS-F02","hard","Why is extra time-on-task a competing explanation?","The retrieval group spent longer with each question",["Both groups had identical timing","Time cannot affect memory","The study group used more practice"],"Longer exposure could partly contribute to better delayed recall.","took more time"),
 q("D15-Q3","RS-F03","hard","Which conclusion is best supported?","Retrieval before feedback modestly improved delayed factual recall, though timing and frustration remain relevant",["Retrieval improves every learning outcome","The study group remembered more","Delay alone fully explains the benefit"],"The strongest evidence concerns two-day fact recall, not all forms of learning.","slightly more facts"),
 q("D15-Q4","RS-F04","medium","Which group rated the material easier immediately after practice?","The study group",["The retrieval group","Both groups equally","The wait-only group only"],"Seeing explanation without forced retrieval felt easier at the time.","rated the material as easier"),
 q("D15-Q5","RS-F05","medium","Why was the wait-only condition included?","To separate the effect of active retrieval from simply spending more time",["To test essay writing","To reduce sample size","To remove feedback"],"The condition added delay without an answer attempt.","waited twenty seconds without attempting"),
 q("D15-Q6","RS-F06","hard","Which is a directly reported finding?","The retrieval group remembered slightly more facts after two days",["Essay quality improved","One-week recall improved","Every learner enjoyed retrieval"],"The delayed factual quiz directly showed a small advantage.","remembered slightly more facts"),
 q("D15-Q7","RS-F07","hard","Which outcome limits generalisation?","The study did not test transfer or essay quality",["Immediate difficulty","Factual recall","Practice time"],"The measured outcome was narrow and may not represent deeper historical reasoning.","not essay quality or transfer"),
 q("D15-Q8","RS-F08","medium","Which next step is best supported?","Equalise study time and add a longer delayed test",["Remove feedback","Measure only ease ratings","Force guessing"],"The follow-up directly addresses time confounding and durability.","equalise total study time")
 ]
},
{
 id:"ENG008-RS-D16",title:"Do Confidence Prompts Improve Error Detection?",genre:"digital-learning-evaluation",
 text:`An online reasoning course tested whether asking learners to rate confidence before submitting an answer helped them identify mistakes. Eight hundred users were randomly assigned to ordinary multiple-choice practice or the same practice with a confidence prompt: low, medium or high.

After submission, both groups saw the same explanation. The confidence group also received a message when a high-confidence wrong answer occurred, asking them to compare their reasoning with the explanation.

During the four-week trial, high-confidence errors became slightly less common in the prompt group. Overall accuracy improved only modestly.

Learners with low confidence often spent more time reviewing explanations, regardless of whether their answer was correct. The prompt added a few seconds to each question. Some users found repeated confidence ratings annoying and began choosing the middle option automatically.

Researchers therefore analysed participants who used all three confidence levels versus those who almost always selected “medium”. The reduction in high-confidence errors was concentrated among the more varied users, but this comparison was not random.

The study did not show whether confidence judgements became better calibrated outside the course.

A follow-up will ask for confidence only on selected questions and will test calibration on new problem types after one week.

Researchers also plan to compare a numeric confidence scale with simple verbal categories to see which produces more thoughtful responses with less burden. The preliminary finding is that confidence prompts may help learners notice some strongly held errors, but excessive prompting can become mechanical and reduce the quality of the self-assessment.  Researchers also compared calibration curves, asking whether answers marked high confidence were actually correct more often than those marked medium or low. The prompt group showed a slightly clearer separation by the end of the study, but the difference was small. Because confidence ratings themselves were part of the intervention, repeated measurement may have changed the behaviour being measured. A follow-up will therefore include occasional unprompted calibration checks and compare them with prompted questions. Researchers also want to know whether learners transfer better self-monitoring to entirely new reasoning formats rather than only becoming familiar with one confidence scale.  The next study will also measure whether selective prompting changes completion rates, since reducing prompt frequency may preserve reflection while lowering annoyance.`,
 questions:[
 q("D16-Q1","RS-F01","medium","What did the intervention add?","A low-medium-high confidence rating before submission",["A second correct answer","A longer lesson","Peer discussion"],"The treatment group rated certainty before seeing feedback.","confidence prompt"),
 q("D16-Q2","RS-F02","hard","Why is the varied-user subgroup comparison not causal?","Use of confidence levels was not randomly assigned",["Accuracy was never measured","The comparison group also rated confidence","No feedback was given"],"Users who engage thoughtfully with the scale may differ in other ways.","not random"),
 q("D16-Q3","RS-F03","hard","Which conclusion is best supported?","Confidence prompts may reduce some high-confidence errors but can become mechanical when overused",["Prompts greatly increase overall accuracy","Every user becomes well calibrated","Numeric confidence is always best"],"The main benefit was a small reduction in strongly held errors alongside signs of prompt fatigue.","began choosing the middle option automatically"),
 q("D16-Q4","RS-F04","medium","What happened to overall accuracy?","It improved only modestly",["It doubled","It fell sharply","It was not measured"],"The intervention affected confidence-error patterns more clearly than total accuracy.","improved only modestly"),
 q("D16-Q5","RS-F05","medium","Why did researchers worry about repeated medium responses?","They may indicate the prompt had become automatic rather than reflective",["Medium was always correct","Users could not see other options","The course required medium"],"Mechanical responding weakens the quality of confidence data.","automatically"),
 q("D16-Q6","RS-F06","hard","Which is a directly reported finding?","High-confidence wrong answers became slightly less common",["One-week calibration improved","All users reviewed more","Numeric scales outperformed words"],"The trial directly recorded a small decline in strongly confident errors.","less common"),
 q("D16-Q7","RS-F07","hard","Which outcome was not established?","Whether confidence calibration improved outside the course",["Confidence ratings","Question accuracy","Explanation review time"],"External calibration on new contexts was not measured.","outside the course"),
 q("D16-Q8","RS-F08","medium","Which next step is best supported?","Use confidence prompts selectively and test later calibration on new problems",["Prompt after every sentence","Remove explanations","Measure only completion speed"],"Selective prompting may reduce burden while delayed transfer tests examine real calibration.","selected questions")
 ]
}
] as const;