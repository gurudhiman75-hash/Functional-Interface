import type{Eng008Cp005PassageV1}from"./eng-008-cp005-authorities-v1";
const q=(id:string,familyId:any,difficulty:any,question:string,correctAnswer:string,distractors:readonly[string,string,string],explanation:string,evidence:string)=>({id,familyId,difficulty,question,correctAnswer,distractors,explanation,evidence});
export const ENG008_CP005_EXPANSION_WAVE11_V1:readonly Eng008Cp005PassageV1[]=[
{
 id:"ENG008-RS-W12",title:"Do Meeting-Free Mornings Improve Deep Work?",genre:"workplace-study",
 text:`A consulting firm tested two meeting-free mornings per week in one division. Employees were asked not to schedule internal meetings before noon on Tuesdays and Thursdays, while urgent client calls remained allowed. A similar division kept its normal calendar and served as a comparison group.

For two weeks before the change and six weeks afterward, researchers collected calendar data, self-reported focus, completed project tasks and the number of meetings rescheduled into afternoons. Employees also recorded whether they worked from home or the office.

The meeting-free division reported longer uninterrupted work periods and higher morning focus. The comparison division changed little. However, afternoon meeting density increased in the intervention group, especially on Tuesdays.

Project completion improved modestly for analysis-heavy assignments but showed little change for coordination-heavy work. Researchers therefore questioned whether the policy shifted interruption rather than reducing it overall.

The two divisions were not identical. The intervention group contained more analysts, while the comparison group had more account managers. That job-mix difference could make protected morning time more valuable in one group even without the policy.

A subgroup analysis found that employees with the highest baseline meeting load reported the largest improvement in focus, but this was observational and may reflect expectation. People who disliked meetings could also have been more enthusiastic about the trial.

The study did not measure client satisfaction, evening overtime or project quality. A reduction in morning meetings could create hidden costs later in the day.

A follow-up will rotate both divisions through the meeting-free policy and track total daily interruption, overtime and work quality. The preliminary evidence suggests protected mornings may help concentration-heavy tasks, but the value depends on whether meetings are genuinely reduced rather than simply pushed into a smaller afternoon window.  Researchers also examined calendar displacement by counting meetings that moved to lunch, late afternoon or Friday. The intervention division showed a small increase in late-afternoon scheduling, which reinforced the concern that some interruption had been shifted rather than removed. Employees differed in preference: analysts tended to value protected mornings, while client-facing staff worried about losing flexibility for quick internal coordination. The company therefore plans to measure not only focus but also response delay between teams. It will also compare voluntary and mandatory versions of the policy because employee control may influence both adherence and satisfaction.`,
 questions:[
 q("W12-Q1","RS-F01","medium","What was the intervention?","Two mornings each week without normal internal meetings",["A ban on all client calls","A shorter workweek","Daily afternoon leave"],"The firm protected Tuesday and Thursday mornings from routine internal meetings.","meeting-free mornings"),
 q("W12-Q2","RS-F02","hard","Why is the division comparison imperfect?","The groups had different job mixes",["Neither group had baseline data","The policy affected both divisions","No calendar data was collected"],"Analysts and account managers may benefit differently from protected focus time.","job-mix difference"),
 q("W12-Q3","RS-F03","hard","Which conclusion is best supported?","Meeting-free mornings may help concentration-heavy work but can shift meetings into afternoons",["The policy improves every task","Afternoon meetings disappeared","Client satisfaction increased"],"The study found focus gains alongside higher afternoon meeting density.","shifted interruption"),
 q("W12-Q4","RS-F04","medium","What happened to afternoon meeting density?","It increased in the intervention group",["It fell to zero","It was not measured","It increased only in the comparison group"],"Some meetings were rescheduled later in the day.","afternoon meeting density increased"),
 q("W12-Q5","RS-F05","medium","Why is the high-meeting-load subgroup result not fully causal?","Employees with heavy meeting loads may differ in expectations or job type",["Meeting load was randomly assigned","Focus was not measured","The subgroup had no meetings"],"Observational subgroup differences can reflect factors besides the policy effect.","this was observational"),
 q("W12-Q6","RS-F06","hard","Which is a directly reported finding?","Morning focus ratings increased in the meeting-free division",["Project quality improved","Client satisfaction rose","Overtime fell"],"The study directly measured and reported higher morning focus.","higher morning focus"),
 q("W12-Q7","RS-F07","hard","Which unmeasured factor could hide a cost of the policy?","Evening overtime",["Calendar data","Morning focus","Task completion"],"If work shifts later, focus gains could be offset by longer days.","did not measure ... evening overtime"),
 q("W12-Q8","RS-F08","medium","Which follow-up is best supported?","Rotate both divisions through the policy and measure total interruption and overtime",["Remove the comparison group","Measure only meeting counts","Exclude analysts"],"A crossover reduces group differences and broader outcomes test whether meetings are merely shifted.","rotate both divisions")
 ]
},
{
 id:"ENG008-RS-W13",title:"Does a Handover Checklist Improve Remote Support?",genre:"workplace-study",
 text:`A technology support company tested a handover checklist for teams working across time zones. The evening team often passed unresolved customer cases to the morning team, but important details were sometimes buried in long message threads.

For four weeks, one support unit used a short checklist requiring case status, steps already attempted, customer impact and the next recommended action. Another unit continued using free-form notes. Both units handled similar products but different customer accounts.

Researchers measured how often the receiving team repeated a diagnostic step, how long it took to send the next useful customer update and how many handovers required a clarification message back to the earlier team.

Repeated diagnostic work and clarification messages were lower in the checklist unit. Median time to the next useful update also fell. However, checklist completion took several minutes longer at the end of each shift.

The checklist unit had a more experienced team leader who reviewed incomplete notes during the first two weeks. That additional coaching may have contributed to the improvement.

Researchers also found that not every checklist field was equally useful. “Customer impact” was often copied from the ticket, while “next recommended action” strongly predicted whether the next team could continue without asking questions.

After week four, the company simplified the checklist by making low-value fields optional. A follow-up will switch the two units' handover methods and keep supervisor review rules the same.

The preliminary result suggests that structured handover can reduce duplicated work when fields capture the next team's actual decision needs. The study does not show that longer forms are always better; useful structure depends on selecting information that changes what the receiving team can do.  Researchers reviewed a sample of handovers qualitatively as well. The clearest notes separated facts already established from hypotheses still needing tests. Free-form notes sometimes mixed the two, causing the next team to repeat checks because it could not tell whether a step had been completed or merely suggested. The company therefore added wording guidance rather than more mandatory fields. It will also measure whether checklist benefits persist after supervisors stop actively reminding staff, because early coaching can produce temporary improvements that fade once attention moves elsewhere.  Researchers will also record whether checklist benefits persist during unusually busy periods, when staff have less time to write detailed notes and may be more tempted to skip fields.`,
 questions:[
 q("W13-Q1","RS-F01","medium","What did the checklist require staff to record?","Case status, attempted steps, customer impact and the next action",["Only ticket number","Employee salary","Customer location history"],"The checklist focused on information needed to continue unresolved cases.","next recommended action"),
 q("W13-Q2","RS-F02","hard","Why might supervisor coaching confound the result?","The checklist unit received extra review support during the trial",["The comparison group used the same checklist","Coaching was randomly assigned","No one reviewed handovers"],"Improvement could partly reflect leadership attention rather than the form alone.","experienced team leader"),
 q("W13-Q3","RS-F03","hard","Which conclusion is best supported?","Structured handover can reduce duplicate work when it captures actionable information",["Every checklist field is equally useful","Longer handovers always improve support","Free-form notes should be banned"],"The strongest field was the recommended next action, and the company later simplified the form.","actual decision needs"),
 q("W13-Q4","RS-F04","medium","What was one cost of the checklist?","It took longer to complete at shift end",["Customer updates stopped","More diagnostic steps were repeated","Clarification messages increased"],"The intervention added several minutes to end-of-shift documentation.","took several minutes longer"),
 q("W13-Q5","RS-F05","medium","Why was “customer impact” made optional later?","It added less new decision value than some other fields",["Customers stopped reporting impact","The field caused delays only in the comparison group","It contained no text"],"Researchers found some fields duplicated information already available elsewhere.","often copied from the ticket"),
 q("W13-Q6","RS-F06","hard","Which is a directly reported finding?","Clarification messages were lower in the checklist unit",["Customer satisfaction doubled","Supervisor workload fell","Every handover was complete"],"The study directly counted clarification requests and found fewer in the intervention unit.","clarification messages were lower"),
 q("W13-Q7","RS-F07","hard","Which factor limits the original group comparison?","The two units handled different customer accounts and had different leadership support",["Both used identical methods","No outcomes were measured","Time zones were the same"],"Group differences beyond the checklist could influence results.","different customer accounts"),
 q("W13-Q8","RS-F08","medium","Which follow-up is best supported?","Switch the methods between units and standardise supervisor review",["Use a longer checklist","Remove action fields","Measure only completion time"],"The planned crossover directly addresses group and coaching differences.","switch the two units")
 ]
},
{
 id:"ENG008-RS-T09",title:"Do Bus-Shelter Seats Change Waiting Experience?",genre:"transport-survey",
 text:`A transport agency installed benches at six busy bus stops that previously offered shelter but no seating. Researchers wanted to know whether seating changed how passengers experienced waiting, especially older riders and people carrying bags.

Before installation, observers recorded passenger counts, standing locations and whether people left the stop before a bus arrived. Short surveys asked passengers to rate comfort and perceived waiting time.

For eight weeks after benches were added, average comfort ratings increased. The largest increase came from riders over sixty and passengers who reported mobility difficulty. Actual bus arrival times did not change.

Perceived waiting time fell slightly even though measured waiting time remained similar. Researchers suggested that physical comfort may change how long a wait feels.

The benches also reduced the clear standing area at two narrow stops. During peak periods, passengers sometimes stood in the bicycle lane to pass seated riders. The agency moved one bench and shortened another.

Weather complicates interpretation. The post-installation period had fewer extremely hot days than the baseline period, which may also have improved comfort.

Researchers compared only days with similar temperature and still found higher comfort, but the number of matched days was smaller.

The study did not measure whether seating affected boarding speed or whether people with wheelchairs found the revised stop layout easier to use. A follow-up will include accessibility audits and randomise bench installation across a larger set of stops. The preliminary evidence suggests seating can improve the experience of waiting without changing service speed, but physical layout must preserve safe movement around the stop.  Researchers also mapped where passengers stood before and after the benches were installed. At wide stops, seating reduced wandering and did not block boarding. At narrow stops, however, seated passengers, waiting riders and cyclists competed for limited space. This helped explain why one physical intervention produced different results by location. The follow-up will therefore classify stops by width and pedestrian volume before installation. Researchers will also record whether passengers choose to stand even when seats are available, since preference, trip length and fear of missing the bus may affect actual use.  The agency will also compare stops with different passenger volumes and measure whether benches change where people queue when buses arrive. This matters because improved comfort before arrival could still create boarding congestion if the seat position funnels passengers into a narrow path.`,
 questions:[
 q("T09-Q1","RS-F01","medium","What was the intervention?","Installing benches at bus shelters that previously had no seats",["Increasing bus frequency","Changing ticket prices","Removing shelters"],"The trial changed passenger waiting conditions rather than the bus service itself.","installed benches"),
 q("T09-Q2","RS-F02","hard","Why can't the comfort increase be attributed entirely to the benches?","The post-installation period had milder weather",["Passengers were not surveyed","Bus times became shorter","No baseline existed"],"Temperature changed between periods and could also affect comfort.","fewer extremely hot days"),
 q("T09-Q3","RS-F03","hard","Which conclusion is best supported?","Seats improved comfort, especially for some riders, while stop layout created new movement concerns",["Benches made buses arrive faster","All passengers preferred standing","The study proves boarding became quicker"],"The intervention changed waiting experience but introduced spatial trade-offs.","preserve safe movement"),
 q("T09-Q4","RS-F04","medium","What happened to actual waiting time?","It remained similar",["It fell sharply","It doubled","It was not measured"],"Bus service timing did not change during the seating trial.","measured waiting time remained similar"),
 q("T09-Q5","RS-F05","medium","Why were matched-temperature days analysed separately?","To reduce weather as a competing explanation",["To remove older riders","To measure ticket use","To increase bus delays"],"Comparing similar temperatures helps isolate the seating effect on comfort.","days with similar temperature"),
 q("T09-Q6","RS-F06","hard","Which is a directly reported finding?","Comfort gains were largest among older riders and people with mobility difficulty",["Boarding time improved","Wheelchair access improved","Bus crowding fell"],"The survey directly found larger comfort increases in those groups.","largest increase"),
 q("T09-Q7","RS-F07","hard","Which design problem emerged?","Benches reduced circulation space at narrow stops",["Shelters became too tall","Buses could not see the stop","Passengers stopped using seats"],"At two stops, the remaining standing and passing area became constrained.","reduced the clear standing area"),
 q("T09-Q8","RS-F08","medium","Which next step is best supported?","Test more stops with randomised installation and accessibility audits",["Remove all benches","Measure only temperature","Ignore narrow stops"],"A larger randomised trial and access checks address causal and layout limitations.","randomise bench installation")
 ]
},
{
 id:"ENG008-RS-S07",title:"Does a Fixed Wake Window Improve Sleep Regularity?",genre:"sleep-study",
 text:`Researchers recruited seventy adults who reported highly variable weekend and weekday wake times. The study tested whether keeping wake time within the same one-hour window every day would improve sleep regularity over five weeks.

Participants were randomly assigned either to the fixed-window instruction or to general advice about reducing late caffeine and keeping bedrooms dark. Both groups wore wrist activity monitors and completed morning sleep diaries.

The fixed-window group showed less variation in wake time by the end of the study. Their bedtime also became slightly more regular even though no fixed bedtime was required.

Average sleep duration changed little. Some participants in the fixed-window group slept less after late social nights because they still woke within the assigned window.

Daytime sleepiness improved slightly on average but not for participants who repeatedly shortened sleep. Researchers warned that regular timing should not be interpreted as a reason to ignore total sleep need.

Adherence varied. People with early work shifts followed the window more consistently than participants with rotating schedules. This limits how well the result may generalise to shift workers.

The wrist monitors estimated sleep from movement and could not identify all periods of quiet wakefulness. Diary and device measures nevertheless showed a similar reduction in timing variability.

The study lasted only five weeks and did not examine long-term health outcomes. A follow-up will compare a fixed wake window with a combined wake-and-bedtime plan and will include more shift workers. The preliminary finding is narrow: a consistent wake window can make sleep timing more regular, but regularity does not guarantee adequate duration after a late night.  Researchers also examined weekend behaviour separately. The fixed-window group showed the largest reduction in Sunday wake-time delay, but some participants compensated with longer daytime naps. Those naps were not prohibited, which makes it harder to know whether total sleep opportunity shifted rather than simply becoming more regular at night. The follow-up will therefore record nap duration more carefully and distinguish participants with fixed work schedules from those with rotating shifts. Investigators also plan to measure whether participants maintain the schedule after reminders stop, because short-term adherence may not represent a sustainable routine.  Researchers will also test whether participants compensate for shorter nights with daytime naps or weekend recovery sleep. Those behaviours could preserve total sleep while still changing regularity, so they need to be measured rather than assumed.`,
 questions:[
 q("S07-Q1","RS-F01","medium","What was the main instruction for the intervention group?","Wake within the same one-hour window every day",["Sleep exactly eight hours","Avoid all weekend activity","Use a fixed bedtime only"],"The study manipulated wake-time regularity rather than prescribing one exact bedtime.","same one-hour window"),
 q("S07-Q2","RS-F02","hard","Why could some participants become sleep deprived despite better regularity?","They kept the wake window after going to bed late",["The study forced daytime naps","Caffeine increased","The monitors woke them"],"A consistent wake time can shorten sleep if bedtime shifts much later.","slept less after late social nights"),
 q("S07-Q3","RS-F03","hard","Which conclusion is best supported?","A fixed wake window can improve timing regularity but does not ensure enough sleep",["Regularity automatically increases sleep duration","Shift workers benefit equally","Bedtime becomes fixed without variation"],"The study found lower timing variability with little average duration change.","does not guarantee adequate duration"),
 q("S07-Q4","RS-F04","medium","What changed slightly even without a fixed bedtime rule?","Bedtime became more regular",["Sleep duration doubled","Caffeine use rose","Weekend wake times became later"],"The fixed wake schedule was accompanied by somewhat more regular bedtimes.","bedtime also became slightly more regular"),
 q("S07-Q5","RS-F05","medium","Why is the result less generalisable to rotating-shift workers?","They had more difficulty adhering to a stable wake window",["Shift workers were the only participants","Their sleep was not measured","They all used medication"],"Rotating work times conflict with a fixed daily wake schedule.","rotating schedules"),
 q("S07-Q6","RS-F06","hard","Which is a directly reported finding?","Wake-time variability decreased in the fixed-window group",["Long-term health improved","Every participant felt less sleepy","Sleep duration increased greatly"],"Reduced variability was the clearest direct outcome of the intervention.","less variation in wake time"),
 q("S07-Q7","RS-F07","hard","Which measurement limitation affected the activity monitors?","Quiet wakefulness could be mistaken for sleep",["They measured only caffeine","They were worn only on weekends","They recorded no movement"],"Movement-based sleep estimates cannot perfectly distinguish still wakefulness.","quiet wakefulness"),
 q("S07-Q8","RS-F08","medium","Which next step is best supported?","Compare wake-only scheduling with a combined bedtime-and-wake plan",["Remove the comparison group","Measure only weekend sleep","Exclude shift workers"],"The proposed follow-up tests whether adding bedtime guidance improves duration and regularity together.","combined wake-and-bedtime plan")
 ]
},
{
 id:"ENG008-RS-C08",title:"Do Unit-Price Labels Change Grocery Choices?",genre:"consumer-survey",
 text:`Researchers tested whether larger unit-price labels changed how shoppers compared differently sized grocery packages. Eight hundred adults completed a simulated online shopping task involving rice, detergent and fruit juice.

Participants were randomly shown either the usual total price, a small unit price beneath it, or a larger unit price displayed beside the total price. Product sizes and total prices were identical across groups.

The large-unit-price group was more likely to choose the package with the lowest cost per kilogram or litre. The effect was strongest when package sizes differed greatly.

However, choosing the lowest unit price did not always minimise the shopper's total spending. Some participants selected a larger package with better value per unit even when they said they needed only a small amount. Researchers therefore separated “unit-value choice” from “basket cost”. The larger label improved comparison accuracy but sometimes encouraged a bigger immediate purchase.

The study was simulated, so participants did not spend their own money or carry products home. Real shoppers may care more about budget, storage space and product waste.

Brand preference also mattered. Strongly brand-loyal participants were less influenced by the unit-price display.

The study did not test whether shoppers understood promotions such as “buy two, get one free”, where calculating unit cost becomes more complicated.

A follow-up will use a real-store field trial and will examine whether clearer unit prices help low-budget shoppers without increasing unwanted bulk purchases. The preliminary evidence suggests unit-price visibility can improve value comparison, but “best value per unit” and “best purchase for this household” are not always the same decision.  Researchers also asked participants why they rejected the lowest unit-price option. Common reasons included limited storage, fear that food would spoil and unwillingness to spend more money at one time. These responses reinforced the distinction between economic value per unit and practical household value. The field trial will therefore record pantry space, household size and whether larger packs are fully used. Researchers also want to test a label that shows both unit price and estimated total saving without visually overpowering the regular price, because stronger emphasis may help comparison while also nudging shoppers toward quantities they do not need.  Investigators will also examine whether clearer unit pricing changes food waste after purchase, because a larger pack may look economical at checkout but lose value if part of it is discarded.`,
 questions:[
 q("C08-Q1","RS-F01","medium","What differed between the experimental display groups?","The visibility and size of the unit-price information",["Product size","Total price","Brand availability"],"The study held products constant and changed how unit price was presented.","larger unit price"),
 q("C08-Q2","RS-F02","hard","Why could a lower unit-price choice still increase immediate spending?","The better-value package was sometimes much larger",["Unit prices were inaccurate","Total prices were hidden","Participants had no budget"],"Buying more at a lower per-unit cost can still raise the amount paid today.","larger package"),
 q("C08-Q3","RS-F03","hard","Which conclusion is best supported?","Clearer unit prices improve comparison accuracy but do not automatically produce the best household purchase",["Unit pricing always reduces spending","Brand loyalty has no effect","Large packages are always preferable"],"The study distinguishes mathematical unit value from practical budget and quantity needs.","not always the same decision"),
 q("C08-Q4","RS-F04","medium","When was the unit-price effect strongest?","When package sizes differed greatly",["When all products had identical sizes","When unit prices were hidden","Only for fruit juice"],"Large size differences made unit-price comparison especially useful.","sizes differed greatly"),
 q("C08-Q5","RS-F05","medium","Why did researchers separate basket cost from unit-value choice?","A value-efficient package can still require higher total spending",["Basket cost cannot be measured","Unit price determines brand","All participants bought one item"],"The two outcomes answer different consumer questions.","separated"),
 q("C08-Q6","RS-F06","hard","Which is a directly reported finding?","Brand-loyal participants were less influenced by unit-price labels",["Every shopper chose the cheapest brand","Promotions were fully tested","Waste declined"],"The study observed weaker display effects among strongly brand-loyal shoppers.","less influenced"),
 q("C08-Q7","RS-F07","hard","Which factor limits external validity?","Participants used a simulated store and did not spend their own money",["Random assignment was used","Product prices were controlled","Three categories were included"],"Real budget and storage consequences may change behaviour.","did not spend their own money"),
 q("C08-Q8","RS-F08","medium","Which next step is best supported?","Test unit-price displays in real stores and track budget and bulk-purchase effects",["Remove total prices","Study only one brand","Measure label size without choices"],"A field trial can test whether comparison gains persist under real spending constraints.","real-store field trial")
 ]
},
{
 id:"ENG008-RS-E09",title:"Does Food-Waste Weighing Change Cafeteria Waste?",genre:"environment-study",
 text:`A university cafeteria tested whether displaying the daily weight of discarded food would reduce plate waste. For three weeks, staff quietly weighed food left on trays but did not show the result to diners. This created a baseline.

For the next six weeks, a board near the exit displayed the previous day's total waste and a simple comparison with the baseline average. No penalties or individual tracking were used.

Average plate waste fell during the display period. The decline was largest on days when the menu offered several portion sizes and smallest when only one fixed portion was available.

Researchers also recorded meal count. Waste per diner fell, not just total waste, which reduced the chance that the result was caused by fewer customers. However, the intervention period occurred later in the academic term, when students may have become more familiar with portion sizes and cafeteria dishes.

Staff also changed two popular serving spoons during week four of the display period. Smaller spoons could have reduced the amount taken independently of the information board.

A survey found that many diners noticed the display, but only a minority said it directly changed what they selected. Self-report may underestimate or overestimate behavioural influence.

The study did not measure kitchen preparation waste, only food returned on trays. It also did not track whether diners later bought snacks because they took smaller portions.

A follow-up will randomise the display across two cafeterias and keep serving utensils constant. Researchers will also compare information-only displays with prompts encouraging diners to take a small first portion and return for more if needed. The preliminary evidence suggests visible waste totals may contribute to lower plate waste, especially when diners have flexible portion choices, but menu design and serving tools remain competing explanations.  Researchers also separated edible from inedible plate waste in a small subsample. Fruit peels and bones changed little, while uneaten rice, bread and cooked vegetables accounted for most of the reduction during the display period. This suggests the intervention affected serving or consumption choices rather than every type of waste equally. The follow-up will weigh these categories systematically and will record menu satisfaction, because diners may leave more food when a dish is unpopular. Investigators also plan to examine whether smaller first portions increase repeat serving trips and whether that affects queue length.`,
 questions:[
 q("E09-Q1","RS-F01","medium","What did the intervention board display?","The previous day's total plate waste compared with the baseline",["Individual diner names","Kitchen salaries","Food prices"],"The board showed aggregate waste information without tracking individuals.","previous day's total waste"),
 q("E09-Q2","RS-F02","hard","Why could changing serving spoons confound the result?","Smaller utensils could reduce portions independently of the display",["Spoons changed the menu price","Waste was not weighed","Diners stopped using trays"],"The utensil change offers another mechanism for lower plate waste.","Smaller spoons"),
 q("E09-Q3","RS-F03","hard","Which conclusion is best supported?","Waste displays may reduce plate waste, but portion options and serving tools also matter",["The display alone caused all improvement","Kitchen waste fell","Every diner changed behaviour consciously"],"The result is promising but multiple design factors changed during the intervention.","competing explanations"),
 q("E09-Q4","RS-F04","medium","Why did researchers calculate waste per diner?","To account for changes in the number of cafeteria customers",["To identify individual diners","To change menu size","To measure kitchen preparation waste"],"Per-person waste helps separate behaviour from simple changes in meal count.","Waste per diner fell"),
 q("E09-Q5","RS-F05","medium","Why might later timing in the academic term matter?","Students may have learned which portion sizes suited them better",["Term timing changes scale accuracy","Food becomes free later","Diners stop seeing the display"],"Experience with the cafeteria could reduce waste even without the intervention.","more familiar with portion sizes"),
 q("E09-Q6","RS-F06","hard","Which is a directly reported finding?","The decline was largest when multiple portion sizes were available",["Kitchen waste decreased","Snack purchases decreased","All diners noticed the board"],"The study directly compared waste change across menu portion conditions.","largest on days"),
 q("E09-Q7","RS-F07","hard","Which outcome was not measured?","Whether diners later bought extra snacks",["Plate waste weight","Meal count","Display awareness"],"The researchers note that smaller cafeteria portions could shift eating elsewhere.","did not track whether diners later bought snacks"),
 q("E09-Q8","RS-F08","medium","Which next step is best supported?","Randomise display use across cafeterias while keeping utensils constant",["Stop weighing waste","Track individuals by name","Measure only total meals"],"Randomisation and controlled serving tools address major competing explanations.","keep serving utensils constant")
 ]
},
{
 id:"ENG008-RS-D13",title:"Does Fading Worked Examples Improve Independent Solving?",genre:"digital-learning-evaluation",
 text:`An online algebra course tested a “faded example” sequence for students learning multi-step equations. In a fully worked example, every step is shown. In a faded sequence, early questions show most steps and later questions leave progressively more steps for the learner to complete.

Five hundred students were randomly assigned to either faded examples or ordinary independent practice after the same lesson. Both groups solved the same number of equations and had access to hints.

During practice, the faded-example group made fewer early errors and completed questions faster. By the final third of practice, performance between groups was similar.

Two days later, students completed a test with familiar equations and transfer items that used different surface wording. The faded group scored slightly higher on familiar items and about the same on transfer items. Researchers had expected fading to improve transfer by gradually shifting responsibility to the learner, but the result did not clearly support that hypothesis.

Hint use complicates interpretation. Independent-practice students opened more hints early, which may have effectively turned some of their questions into partial worked examples.

Students in the faded group reported lower frustration during the first half of practice. However, they also rated some later transitions as abrupt when several steps disappeared at once.

The study did not test students with very strong prior algebra knowledge separately. Such learners may need less scaffolding and could find faded examples unnecessarily slow.

A follow-up will compare gradual and faster fading schedules, restrict hint content more carefully and include a one-week transfer test. The preliminary evidence suggests faded examples can make early practice smoother and may support short-term accuracy, but this version did not produce a clear advantage on unfamiliar transfer problems.  Researchers also analysed error type. The faded group made fewer procedural mistakes early, such as applying an operation to only one side of an equation, but conceptual errors involving which operation to choose were less different between groups. This distinction may explain why familiar accuracy improved more clearly than transfer. The follow-up will therefore code errors by type and vary where fading occurs within the solution rather than only how many steps disappear. Researchers also plan to test whether asking learners to explain the removed step improves transfer without adding too much time.  The next study will also compare learner confidence with actual performance after the fading sequence.`,
 questions:[
 q("D13-Q1","RS-F01","medium","What is a faded example sequence?","Worked steps are gradually removed so learners complete more of the solution",["Every problem is fully solved","Hints are removed permanently","Question difficulty decreases"],"The design shifts responsibility from shown steps to independent completion over time.","progressively more steps"),
 q("D13-Q2","RS-F02","hard","Why does hint use complicate the group comparison?","Independent-practice students could turn difficult items into partial worked examples",["Hints were unavailable to the faded group","Hints changed the lesson topic","Every student used the same number"],"Extra scaffolding in the comparison group reduces the contrast between conditions.","opened more hints"),
 q("D13-Q3","RS-F03","hard","Which conclusion is best supported?","Faded examples improved early practice experience but showed no clear transfer advantage",["Fading always improves transfer","Independent practice produced fewer errors","Fading reduced all frustration"],"The strongest benefits were early error reduction and lower frustration, not unfamiliar transfer.","about the same on transfer items"),
 q("D13-Q4","RS-F04","medium","What happened by the final third of practice?","Performance between groups became similar",["The faded group stopped solving","The comparison group had no correct answers","Hints were removed"],"Initial performance differences narrowed later in practice.","performance between groups was similar"),
 q("D13-Q5","RS-F05","medium","Why might strong prior-knowledge students respond differently?","They may need less scaffolding and find examples unnecessarily slow",["They cannot solve equations","They always need more hints","Prior knowledge was randomly changed"],"The benefit of scaffolding can depend on what the learner already knows.","need less scaffolding"),
 q("D13-Q6","RS-F06","hard","Which is a directly reported finding?","The faded group made fewer early practice errors",["Transfer scores doubled","One-week retention improved","Every transition felt smooth"],"Early error rate was directly lower in the faded condition.","fewer early errors"),
 q("D13-Q7","RS-F07","hard","Which feature may have made fading less comfortable?","Several steps sometimes disappeared at once",["Every step remained visible","Questions became shorter","Hints appeared automatically"],"Participants described some later transitions as abrupt.","transitions as abrupt"),
 q("D13-Q8","RS-F08","medium","Which next step is best supported?","Compare different fading rates and test delayed transfer",["Remove all worked examples","Measure only speed","Exclude hints without recording use"],"The proposed follow-up targets transition design and longer-term transfer.","gradual and faster fading")
 ]
},
{
 id:"ENG008-RS-D14",title:"Do Adaptive Review Reminders Improve Retention?",genre:"digital-learning-evaluation",
 text:`A language-learning app tested adaptive review reminders for vocabulary. The existing system sent every learner the same reminder three days after a lesson. The new system estimated when each learner was likely to forget a word based on recent accuracy and response time.

Nine hundred users were randomly assigned to fixed or adaptive reminders for four weeks. Both groups studied the same lesson content, but the timing of review prompts differed.

Adaptive users completed slightly more review sessions and performed better on vocabulary tested one week after the last lesson. The benefit was larger for words that users had answered incorrectly during initial practice.

However, adaptive users also received more reminders on average. Researchers could not immediately tell whether better retention came from better timing or simply from more review opportunities. To investigate, they compared users within a narrower reminder-count range. The adaptive advantage became smaller but remained, suggesting timing may contribute beyond frequency.

Notification fatigue was a concern. Users receiving more than five reminders in a week were more likely to disable app notifications regardless of group.

The algorithm also used response speed as a difficulty signal. Slow responses can indicate weak memory, but they can also reflect distraction or poor connectivity.

The study did not measure vocabulary use in spontaneous conversation, only recognition and recall tests inside the app.

A follow-up will cap both groups at the same number of reminders and vary timing only. Researchers will also test whether users should be able to choose quiet periods so reminders do not arrive during work or sleep. The preliminary evidence suggests adaptive timing may improve short-term retention, particularly for difficult words, but reminder frequency and user tolerance remain important parts of the effect.  Researchers also examined reminder timing by hour of day. Some users received adaptive prompts during work or late evening because the algorithm optimised predicted forgetting rather than convenience. Those reminders were more likely to be ignored, suggesting that theoretically optimal memory timing can conflict with practical attention. The follow-up will therefore constrain reminders to user-selected windows and compare retention with unconstrained adaptive timing. Researchers also plan to measure whether users voluntarily open the app before a reminder arrives, because those self-initiated reviews could influence both the algorithm's predictions and later test performance.  Researchers will also record whether users act on reminders immediately or postpone them.`,
 questions:[
 q("D14-Q1","RS-F01","medium","How did adaptive reminders differ from fixed reminders?","Their timing depended on estimated forgetting risk",["They used different lesson content","They removed review sessions","They arrived only once a month"],"The adaptive system used recent performance to choose when a reminder should appear.","estimated when each learner was likely to forget"),
 q("D14-Q2","RS-F02","hard","Why is reminder frequency a confound?","Adaptive users received more opportunities to review as well as different timing",["Both groups had identical reminder counts","Frequency cannot affect memory","Fixed users received more lessons"],"Extra exposure could explain part of the retention difference independently of timing.","more reminders on average"),
 q("D14-Q3","RS-F03","hard","Which conclusion is best supported?","Adaptive timing may improve retention, but the current study does not fully separate timing from reminder frequency",["Adaptive reminders are always superior","More than five reminders improves engagement","Response speed perfectly measures memory"],"The narrower-count analysis reduces but does not eliminate the timing uncertainty.","timing may contribute"),
 q("D14-Q4","RS-F04","medium","For which words was the adaptive benefit larger?","Words answered incorrectly during initial practice",["Only very short words","Words never reviewed","Words learned years earlier"],"The system appeared most helpful for initially difficult vocabulary.","answered incorrectly"),
 q("D14-Q5","RS-F05","medium","Why can slow response time be an imperfect difficulty signal?","Delay may reflect distraction or connectivity rather than weak memory",["Slow answers are always wrong","The app cannot record time","Fast answers indicate forgetting"],"The same observed delay can have several causes.","distraction or poor connectivity"),
 q("D14-Q6","RS-F06","hard","Which is a directly reported finding?","Users receiving many reminders were more likely to disable notifications",["Conversation fluency improved","Adaptive users had fewer reminders","All users kept notifications enabled"],"Notification fatigue appeared when weekly reminder volume became high.","more likely to disable"),
 q("D14-Q7","RS-F07","hard","Which outcome was not measured?","Use of vocabulary in spontaneous conversation",["One-week vocabulary performance","Reminder completion","Notification disabling"],"The study measured in-app recall rather than real conversational use.","did not measure vocabulary use in spontaneous conversation"),
 q("D14-Q8","RS-F08","medium","Which next step is best supported?","Hold reminder count equal while varying timing",["Increase reminder count without limit","Change lesson content between groups","Remove retention testing"],"Equal frequency would isolate the effect of adaptive timing more clearly.","cap both groups at the same number")
 ]
}
] as const;
