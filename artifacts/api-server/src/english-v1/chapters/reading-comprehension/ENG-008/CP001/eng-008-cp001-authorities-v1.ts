import { ENG008_CP001_EXPANSION_WAVE1_V1 } from "./eng-008-cp001-expansion-wave1-v1";
export type Eng008Difficulty="easy"|"medium"|"hard";
export type Eng008Genre="narrative"|"report"|"editorial";
export type Eng008RcFamilyId="RC-F01"|"RC-F02"|"RC-F03"|"RC-F04"|"RC-F05"|"RC-F06";

export interface Eng008RcQuestionAuthorityV1{
  id:string;
  familyId:Eng008RcFamilyId;
  difficulty:Eng008Difficulty;
  question:string;
  correctAnswer:string;
  distractors:readonly [string,string,string];
  explanation:string;
  evidence:string;
}

export interface Eng008RcPassageV1{
  id:string;
  title:string;
  genre:Eng008Genre;
  text:string;
  questions:readonly Eng008RcQuestionAuthorityV1[];
}

const q=(id:string,familyId:Eng008RcFamilyId,difficulty:Eng008Difficulty,question:string,correctAnswer:string,distractors:readonly [string,string,string],explanation:string,evidence:string):Eng008RcQuestionAuthorityV1=>({
  id,familyId,difficulty,question,correctAnswer,distractors,explanation,evidence
});


export const ENG008_CP001_PASSAGES_V1:readonly Eng008RcPassageV1[]=[
...ENG008_CP001_EXPANSION_WAVE1_V1,
{
 id:"ENG008-RC-N01",title:"The Returned Notebook",genre:"narrative",
 text:`Mira found a small blue notebook under a chair in the public reading room. Its first pages contained ordinary class notes, but the last page listed three interview questions for a local history project. A name was written inside the cover, so she left the notebook with the librarian instead of taking it home.

The next afternoon, an elderly man came to the desk asking about a notebook his grandson had lost. The librarian checked the name and returned it to him. Before leaving, the man told Mira that his grandson had planned to interview him that evening about the old neighbourhood. Mira realised that returning the notebook had saved more than a few pages of notes; it had also saved a conversation that might otherwise have been postponed.`,
 questions:[
  q("N01-Q1","RC-F01","easy","Where did Mira find the notebook?","Under a chair in the public reading room",["On a bus seat","Beside the librarian's desk","Outside the history room"],"The passage directly says that Mira found the notebook under a chair in the public reading room.","Mira found a small blue notebook under a chair in the public reading room."),
  q("N01-Q2","RC-F02","medium","What can be inferred about the notebook's importance?","It was needed for a planned family-history interview",["It contained money for the interview","It belonged to the elderly man himself","It was the only copy of a school textbook"],"The interview questions and the man's explanation show that the notebook was needed for a planned conversation about local history.","his grandson had planned to interview him that evening about the old neighbourhood"),
  q("N01-Q3","RC-F03","medium","What is the central idea of the passage?","A small responsible action can preserve something meaningful",["Libraries should keep all lost objects for a week","Class notes are more valuable than oral history","Local history projects should be done only with relatives"],"Mira's simple decision to hand in the notebook allowed an important conversation to take place.","returning the notebook had saved ... a conversation"),
  q("N01-Q4","RC-F04","medium","Which title best suits the passage?","The Returned Notebook",["The Empty Reading Room","A Difficult History Exam","The Librarian's New Rule"],"The story centres on a lost notebook being responsibly returned and why that mattered.","the librarian ... returned it to him"),
  q("N01-Q5","RC-F05","easy","In the passage, the word “postponed” most nearly means:","delayed until a later time",["cancelled forever","recorded in writing","repeated from the beginning"],"The sentence says the conversation might have happened later if the notebook had not been returned. So “postponed” means delayed.","a conversation that might otherwise have been postponed"),
  q("N01-Q6","RC-F06","medium","Which statement is supported by the passage?","Mira gave the notebook to the librarian because a name was written inside it",["Mira read every page before returning the notebook","The grandson arrived personally to collect the notebook","The interview had already taken place before the notebook was found"],"The passage explicitly connects the written name with Mira's decision to leave the notebook with the librarian.","A name was written inside the cover, so she left the notebook with the librarian")
 ]
},
{
 id:"ENG008-RC-N02",title:"The Clock Above the Shop",genre:"narrative",
 text:`For years, the clock above Mr Sen's repair shop had been five minutes slow. Everyone in the lane knew it, and regular customers automatically added five minutes when they looked up. One Monday, Mr Sen repaired the clock and set it to the exact time without telling anyone.

That morning, several shopkeepers opened their shutters later than usual because they still added five minutes in their heads. By noon, people were laughing about the confusion. Mr Sen considered setting the clock back to its old error, but decided against it. Instead, he placed a small sign below it: “The clock is correct now.” Within a few days, the lane adjusted. The incident reminded him that even an improvement can cause temporary trouble when people have built habits around an old mistake.`,
 questions:[
  q("N02-Q1","RC-F01","easy","What change did Mr Sen make on Monday?","He set the clock to the exact time",["He removed the clock from the shop","He moved the clock five minutes ahead","He replaced the clock with a digital display"],"The passage directly states that Mr Sen repaired the clock and set it to the exact time.","Mr Sen repaired the clock and set it to the exact time"),
  q("N02-Q2","RC-F02","medium","Why did some shopkeepers open late that morning?","They continued to correct for the clock's old error",["They had not heard their alarm clocks","They believed the shop was closed for repairs","They were waiting for Mr Sen to open first"],"People were used to adding five minutes to the displayed time. They kept doing so even after the clock was fixed.","they still added five minutes in their heads"),
  q("N02-Q3","RC-F03","hard","What broader point does the passage make?","Correcting a system may still require people to change established habits",["Accurate clocks always reduce confusion immediately","Old mistakes should sometimes be preserved permanently","Public signs are more reliable than clocks"],"The clock became accurate, but people initially behaved according to the old error. The passage is about adjustment after correction.","even an improvement can cause temporary trouble when people have built habits around an old mistake"),
  q("N02-Q4","RC-F04","medium","Which title best captures the passage?","When the Wrong Clock Became Right",["Five Minutes Too Early","A Shop Without Customers","The Broken Sign"],"The main event is the correction of a clock that had long been wrong and the confusion that followed.","The clock is correct now"),
  q("N02-Q5","RC-F05","easy","In the passage, “adjusted” most nearly means:","became used to the new situation",["changed the clock again","closed the shops earlier","stopped using time completely"],"Within a few days, people changed their habit and became used to the correct clock.","Within a few days, the lane adjusted"),
  q("N02-Q6","RC-F06","medium","Which statement is supported by the passage?","Mr Sen chose to keep the clock accurate despite the initial confusion",["Mr Sen deliberately made the clock slow again","Customers complained that the clock was too fast","The shopkeepers asked Mr Sen to remove the clock"],"Mr Sen thought about restoring the old error but decided not to do so.","Mr Sen considered setting the clock back to its old error, but decided against it")
 ]
},
{
 id:"ENG008-RC-N03",title:"The Empty Patch",genre:"narrative",
 text:`During a school clean-up, Arjun's group was asked to clear weeds from a narrow patch beside the science block. Most students saw it as a quick task and wanted to finish before lunch. Arjun noticed, however, that the patch received sunlight for most of the day and that a tap stood nearby.

He suggested turning the cleared ground into a small herb garden. The group planted mint, basil and coriander from seedlings donated by families. At first, the garden was mainly a way to keep the patch from filling with weeds again. Later, science teachers began using it to discuss plant growth, insects and soil moisture. What began as a cleaning task became a small outdoor learning space because one student looked at the site as more than a problem to remove.`,
 questions:[
  q("N03-Q1","RC-F01","easy","What did Arjun notice about the patch?","It received plenty of sunlight and had a tap nearby",["It was shaded throughout the day","It was already planted with flowers","It was far from any water source"],"The passage directly mentions sunlight and a nearby tap as features Arjun noticed.","the patch received sunlight for most of the day and ... a tap stood nearby"),
  q("N03-Q2","RC-F02","medium","Why was the herb garden practical for that location?","The site had both sunlight and convenient access to water",["The science block provided free seeds every week","The soil had already been tested by a laboratory","No one else was allowed to use the area"],"Sunlight and nearby water made the site suitable for growing herbs.","sunlight for most of the day ... a tap stood nearby"),
  q("N03-Q3","RC-F03","medium","What is the main idea of the passage?","A routine task can create greater value when someone sees a new possibility",["School gardens should contain only herbs","Science lessons should always be held outdoors","Cleaning is less useful than planting"],"Arjun saw an opportunity beyond simply removing weeds, and the result became a learning space.","one student looked at the site as more than a problem to remove"),
  q("N03-Q4","RC-F04","medium","Which title best suits the passage?","From Weeds to a Learning Garden",["Lunch Before Work","The Closed Science Block","A Competition for Seedlings"],"The passage follows the transformation of a weedy patch into an educational garden.","became a small outdoor learning space"),
  q("N03-Q5","RC-F05","easy","In the passage, “donated” most nearly means:","given without payment",["sold at a discount","borrowed for a short time","grown by the science teacher"],"The families supplied seedlings to the group without any suggestion of payment.","seedlings donated by families"),
  q("N03-Q6","RC-F06","medium","Which statement is supported by the passage?","Teachers later used the garden during science lessons",["The garden was removed after the clean-up","Only Arjun was allowed to care for the plants","The herbs were planted before the weeds were cleared"],"The passage explicitly says science teachers later used the garden to discuss several topics.","science teachers began using it to discuss plant growth, insects and soil moisture")
 ]
},
{
 id:"ENG008-RC-N04",title:"The Last Bus Stop",genre:"narrative",
 text:`Leena usually waited for the evening bus at the crowded market stop. One day, road repairs forced the bus to use a temporary stop two streets away. A handwritten notice had been tied to a pole, but rain had blurred most of the words.

Leena saw an older passenger studying the damaged notice and looking uncertain. She had already confirmed the temporary location with a shopkeeper, so she explained the change and walked with him to the new stop. When they arrived, several other passengers were waiting there. The bus came only a few minutes later.

On the ride home, Leena thought about how little effort the detour had required from her and how confusing the same change had seemed to someone without clear information. She concluded that public changes are easier to manage when information is both accurate and easy to notice.`,
 questions:[
  q("N04-Q1","RC-F01","easy","Why was the normal bus stop not being used?","Road repairs had caused a temporary change",["The market had closed permanently","The bus route had been cancelled","The pole at the stop had fallen"],"The first paragraph directly states that road repairs forced the bus to use a temporary stop.","road repairs forced the bus to use a temporary stop"),
  q("N04-Q2","RC-F02","medium","Why was the older passenger uncertain?","The notice explaining the change had become difficult to read",["He did not know which town the bus served","He had never travelled by bus before","The shopkeeper had given him the wrong location"],"The rain had blurred the notice, so the change was not clearly communicated to him.","rain had blurred most of the words"),
  q("N04-Q3","RC-F03","hard","What central idea is developed in the passage?","Clear communication makes temporary public changes easier for people to follow",["Road repairs should never affect public transport","Passengers should depend only on shopkeepers for directions","Temporary bus stops are always more convenient"],"The final reflection connects the incident to the value of accurate, visible public information.","public changes are easier to manage when information is both accurate and easy to notice"),
  q("N04-Q4","RC-F04","medium","Which title best suits the passage?","A Change That Needed a Clearer Notice",["The Bus That Never Arrived","A Market Without Roads","The Shopkeeper's Journey"],"The key problem was not the temporary stop itself but unclear information about it.","rain had blurred most of the words"),
  q("N04-Q5","RC-F05","easy","In the passage, “detour” refers to:","a change from the usual route or path",["a delay caused by a broken bus","a written warning about rain","a payment made before travel"],"Leena had to go to a different stop because the usual arrangement had changed. That extra route is a detour.","how little effort the detour had required"),
  q("N04-Q6","RC-F06","medium","Which statement is supported by the passage?","Leena verified the temporary stop before guiding the older passenger",["Leena guessed the new stop from the damaged notice","The older passenger found the new stop without help","The bus arrived before they reached the temporary stop"],"Leena had already confirmed the temporary location with a shopkeeper before helping him.","She had already confirmed the temporary location with a shopkeeper")
 ]
},
{
 id:"ENG008-RC-R01",title:"Shade Along the Main Road",genre:"report",
 text:`A neighbourhood committee studied a 1.5-kilometre market road during the hottest part of the afternoon. Volunteers recorded where pedestrians naturally paused, which sections had continuous shade and where drinking-water points were available. They did not attempt to measure the temperature of every surface. Their aim was to understand how people used the street under strong sunlight.

The survey found that pedestrians clustered near building awnings and the few mature trees, even when those spots were slightly farther from shop entrances. The committee therefore proposed planting additional shade trees at wide pavement sections and adding benches where roots would not obstruct movement. It also recommended protecting existing mature trees during future roadwork.

The report did not claim that tree planting alone would solve summer heat. Instead, it treated shade as one practical part of making the walking route more usable.`,
 questions:[
  q("R01-Q1","RC-F01","easy","What was the committee mainly trying to understand?","How pedestrians used the street in strong sunlight",["The exact temperature of every road surface","Which shops sold the most drinking water","How many vehicles entered the market each hour"],"The passage explicitly says the aim was to understand how people used the street under strong sunlight.","Their aim was to understand how people used the street under strong sunlight"),
  q("R01-Q2","RC-F02","medium","What does the clustering of pedestrians near trees and awnings suggest?","People valued shade enough to alter where they paused",["People preferred to stay far from all shops","Awnings were cooler because they contained fans","Mature trees blocked access to the market"],"People gathered in shaded areas even when those places were less convenient to shop entrances, showing that shade influenced behaviour.","even when those spots were slightly farther from shop entrances"),
  q("R01-Q3","RC-F03","medium","What is the main idea of the report?","Observed pedestrian behaviour can guide practical improvements to street shade",["Every market road should be closed during summer afternoons","Temperature readings are unnecessary in all street studies","Tree planting is the only effective response to urban heat"],"The survey observed where people sought shade and used that evidence to propose targeted improvements.","The committee therefore proposed planting additional shade trees"),
  q("R01-Q4","RC-F04","medium","Which title best suits the passage?","Using Street Behaviour to Plan Better Shade",["Counting Vehicles in a Market","Why Shops Need Larger Entrances","Replacing Trees with Awnings"],"The passage is about studying pedestrian behaviour and using it to improve shade along the road.","understand how people used the street under strong sunlight"),
  q("R01-Q5","RC-F05","medium","In the passage, “clustered” most nearly means:","gathered closely in particular places",["walked rapidly in one direction","spread evenly along the road","stood inside every shop"],"Pedestrians concentrated near awnings and trees rather than being evenly distributed.","pedestrians clustered near building awnings and the few mature trees"),
  q("R01-Q6","RC-F06","medium","Which statement is supported by the passage?","The report presented shade as one useful measure rather than a complete solution",["The committee promised to eliminate summer heat from the road","The survey proved that benches reduce surface temperature","The report recommended removing mature trees during roadwork"],"The final paragraph explicitly says tree planting alone would not solve summer heat.","It did not claim that tree planting alone would solve summer heat")
 ]
},
{
 id:"ENG008-RC-R02",title:"A Water Audit at School",genre:"report",
 text:`A secondary school carried out a four-week water audit after staff noticed that the underground tank was being refilled more often than expected. Students from the environment club recorded meter readings at the start and end of each school day. The maintenance team separately checked taps, toilet cisterns and garden pipes for leaks.

The daily readings showed that most water use occurred during normal school hours, but an unusual amount was also being lost overnight. A leaking garden pipe was eventually found behind a storage shed. After the pipe was repaired, overnight consumption fell sharply.

The audit also showed that several taps were left running longer than necessary during lunch breaks. The school responded by repairing the leak first and then placing reminder signs near wash areas. The exercise showed the value of distinguishing between infrastructure losses and avoidable user habits rather than treating all excess use as the same problem.`,
 questions:[
  q("R02-Q1","RC-F01","easy","What first prompted the school to conduct a water audit?","The underground tank needed refilling more often than expected",["Students asked for a new environment project","The school planned to build another garden","The water meter had stopped working"],"The opening sentence directly gives the reason for the audit.","the underground tank was being refilled more often than expected"),
  q("R02-Q2","RC-F02","medium","Why were overnight readings useful?","They helped reveal water loss when normal student use was absent",["They measured the quality of drinking water","They showed which students used the garden","They proved that the tank was too small"],"Overnight use should have been low. The unusual overnight consumption helped point to a leak rather than ordinary daytime activity.","an unusual amount was also being lost overnight"),
  q("R02-Q3","RC-F03","hard","What is the main lesson of the report?","Excess resource use should be separated into different causes before solutions are chosen",["Reminder signs can fix every type of water loss","Schools should stop watering gardens completely","Meter readings are useful only during the night"],"The school found both a physical leak and wasteful habits and responded differently to each.","distinguishing between infrastructure losses and avoidable user habits"),
  q("R02-Q4","RC-F04","medium","Which title best fits the passage?","Finding Where the Water Was Going",["Building a Larger School Tank","A Club Without a Project","Why Gardens Waste Water"],"The audit traced unexpected water use to both a leak and user habits.","A Water Audit at School"),
  q("R02-Q5","RC-F05","easy","In the passage, “consumption” means:","the amount of water used",["the cost of repairing pipes","the speed of meter recording","the quality of stored water"],"Here “consumption” refers to how much water was being used or lost.","overnight consumption fell sharply"),
  q("R02-Q6","RC-F06","medium","Which statement is supported by the passage?","The school repaired the physical leak before addressing wasteful tap use",["The school blamed students before checking the pipes","The leaking pipe was located beside the main gate","The audit found that all excess use happened during school hours"],"The passage says the school repaired the leak first and then used reminder signs near wash areas.","repairing the leak first and then placing reminder signs")
 ]
},
{
 id:"ENG008-RC-R03",title:"Help Desks for Digital Payments",genre:"report",
 text:`A traders' association in a busy market tested a temporary help desk for customers who were unfamiliar with digital payments. The desk did not process payments on behalf of shoppers. Instead, volunteers explained how to check the receiver's name, confirm the amount and recognise whether a transaction had actually succeeded.

During the first week, most questions concerned failed or pending transactions. By the third week, fewer people asked how to make a basic payment, while more asked about safety, refunds and transaction records. The association took this change as a sign that many visitors were becoming more comfortable with the basic steps.

The trial suggested that short, practical guidance can reduce uncertainty, but the organisers also noted a limit: a help desk cannot replace secure banking systems or formal complaint channels. Its role is to help users understand routine actions and know when a problem requires official support.`,
 questions:[
  q("R03-Q1","RC-F01","easy","What was one task of the help desk volunteers?","Explaining how to confirm the receiver's name and payment amount",["Completing every payment for customers","Issuing refunds directly from the desk","Opening new bank accounts for shoppers"],"The passage states that volunteers explained checks such as the receiver's name and payment amount.","volunteers explained how to check the receiver's name, confirm the amount"),
  q("R03-Q2","RC-F02","medium","What does the change in the types of questions suggest?","Many users became more confident with basic payment steps",["Digital payments stopped working in the third week","Customers became less interested in payment safety","The help desk began processing refunds itself"],"Basic-payment questions declined while more advanced questions increased, suggesting growing familiarity with routine steps.","fewer people asked how to make a basic payment"),
  q("R03-Q3","RC-F03","medium","What is the main idea of the passage?","Practical guidance can improve user confidence while still having clear limits",["Markets should replace all cash payments immediately","Volunteers should handle formal banking complaints","Transaction records are unnecessary for digital payments"],"The report presents benefits of the help desk but also clearly explains what it cannot replace.","short, practical guidance can reduce uncertainty ... but ... a help desk cannot replace secure banking systems"),
  q("R03-Q4","RC-F04","medium","Which title best suits the passage?","A Small Help Desk with a Limited but Useful Role",["The End of Cash in the Market","How to Become a Bank Employee","Refunds Without Banks"],"The passage describes a useful support desk and carefully defines its limits.","Its role is to help users understand routine actions"),
  q("R03-Q5","RC-F05","medium","In the passage, “pending” most nearly means:","not yet finally completed or confirmed",["deliberately cancelled by the customer","recorded twice by the receiver","paid only in cash"],"A pending transaction is one whose final status has not yet been confirmed.","failed or pending transactions"),
  q("R03-Q6","RC-F06","medium","Which statement is supported by the passage?","The organisers did not treat the help desk as a substitute for formal banking support",["The help desk was authorised to settle all disputes","Volunteers were allowed to access customer accounts","Most visitors stopped using digital payments after the trial"],"The organisers explicitly said the desk cannot replace banking systems or formal complaint channels.","a help desk cannot replace secure banking systems or formal complaint channels")
 ]
},
{
 id:"ENG008-RC-R04",title:"A Bus Punctuality Pilot",genre:"report",
 text:`A city transport unit ran a six-week punctuality pilot on one bus route. Instead of judging performance only by the time a bus reached the final stop, the team recorded arrival times at five points along the route. This made it possible to see where delays were building up.

The records showed that buses usually began the route on time but lost several minutes near a large school during the afternoon. The delay was not caused mainly by passenger boarding. Traffic slowed because private vehicles stopped along both sides of a narrow section of road.

For the final two weeks, temporary no-parking signs were placed near that section during school closing time. Average delays fell, although they did not disappear completely. The pilot showed that measuring only the final arrival time would have revealed the delay but not its location or likely cause.`,
 questions:[
  q("R04-Q1","RC-F01","easy","What additional information did the team collect besides the final arrival time?","Arrival times at five points along the route",["Fuel use at every bus stop","Ticket prices on nearby routes","The number of schools in the city"],"The first paragraph directly says the team recorded arrival times at five points.","recorded arrival times at five points along the route"),
  q("R04-Q2","RC-F02","medium","Why was measuring several points useful?","It showed where delays began to accumulate",["It eliminated the need to observe traffic","It proved that passenger boarding caused the delay","It allowed buses to skip crowded stops"],"Intermediate measurements revealed where time was being lost instead of only showing the final result.","This made it possible to see where delays were building up"),
  q("R04-Q3","RC-F03","hard","What broader lesson does the pilot illustrate?","Detailed measurement can identify the location and possible cause of a performance problem",["Final results are always more useful than intermediate data","Parking restrictions remove every transport delay","School traffic affects only private vehicles"],"The key lesson is that the final delay alone could not show where or why it developed.","measuring only the final arrival time would have revealed the delay but not its location or likely cause"),
  q("R04-Q4","RC-F04","medium","Which title best fits the passage?","Tracing a Bus Delay to Its Source",["A Route Without Passengers","Closing a School Road Permanently","Why Buses Need More Tickets"],"The study followed the route at several points and identified where the delay arose.","see where delays were building up"),
  q("R04-Q5","RC-F05","easy","In the passage, “punctuality” refers to:","being on time",["carrying more passengers","using less fuel","travelling a longer route"],"The pilot examined whether buses reached points on the route at the expected times.","six-week punctuality pilot"),
  q("R04-Q6","RC-F06","medium","Which statement is supported by the passage?","The temporary parking restriction reduced delays but did not remove them entirely",["The buses normally started the route late","Passenger boarding was identified as the main cause","The final arrival time showed the exact location of the problem"],"The passage says average delays fell after the signs were installed, but they did not disappear completely.","Average delays fell, although they did not disappear completely")
 ]
}
] as const;

/**
 * Editorial authorities authored during the first ENG-008 design pass.
 * They are intentionally excluded from CP001 after exam-profile separation and
 * are retained as seed material for CP002 (SSC editorial/current-affairs RC).
 * CP002 must expand and review them independently before runtime exposure.
 */
export const ENG008_CP002_SEED_PASSAGES_V1:readonly Eng008RcPassageV1[]=[
{
 id:"ENG008-RC-E01",title:"Libraries Need More Than Shelves",genre:"editorial",
 text:`A public library is often judged by the number of books it owns, but that measure alone says little about how useful the library is to its community. A room full of books can remain underused if opening hours are inconvenient, study tables are scarce or visitors cannot easily find the material they need.

This does not mean that book collections are unimportant. A library without a strong collection cannot serve readers well. The point is that access turns a collection into a public service. Clear catalogues, helpful staff, quiet study areas and predictable opening hours determine whether people can make practical use of the books already available.

Investment should therefore consider both resources and access. Counting books is simple, but a better question is how often and how effectively people can use them.`,
 questions:[
  q("E01-Q1","RC-F01","easy","According to the passage, which factor can make a library underused?","Inconvenient opening hours",["Having a clear catalogue","Providing quiet study areas","Employing helpful staff"],"The first paragraph lists inconvenient opening hours as one reason a library may remain underused.","if opening hours are inconvenient"),
  q("E01-Q2","RC-F02","medium","What can be inferred about the author's view of library collections?","They are necessary but not sufficient for a useful library service",["They are less important than furniture","They should be replaced by digital catalogues","Their size is the only reliable measure of quality"],"The author explicitly says collections matter, but argues that access determines whether they can be used effectively.","This does not mean that book collections are unimportant ... The point is that access turns a collection into a public service"),
  q("E01-Q3","RC-F03","medium","What is the main idea of the passage?","Library quality depends on both resources and practical access to them",["Libraries should reduce the number of books they hold","Opening hours matter more than every other library feature","Public libraries should serve only regular readers"],"The passage argues for evaluating both the collection and people's ability to use it.","Investment should therefore consider both resources and access"),
  q("E01-Q4","RC-F04","medium","Which title best suits the passage?","Libraries Need More Than Shelves",["Why Books Should Be Counted Daily","The Case Against Public Libraries","Replacing Staff with Catalogues"],"The title reflects the argument that books alone do not make a library effective.","a better question is how often and how effectively people can use them"),
  q("E01-Q5","RC-F05","medium","In the passage, “predictable” opening hours are hours that are:","regular and easy to know in advance",["changed without notice","limited to a few visitors","longer than necessary"],"In context, predictable hours help visitors plan when they can use the library.","predictable opening hours determine whether people can make practical use"),
  q("E01-Q6","RC-F06","medium","Which statement is supported by the passage?","A strong collection and good access should be considered together",["Book collections are unnecessary if staff are helpful","A library's usefulness can be measured only by visitor numbers","Quiet study areas reduce the need for books"],"The final paragraph explicitly calls for investment in both resources and access.","Investment should therefore consider both resources and access")
 ]
},
{
 id:"ENG008-RC-E02",title:"Repair Before Replacement",genre:"editorial",
 text:`When a public office printer, school desk or household appliance stops working, replacement can seem like the fastest solution. Yet replacing an item immediately may waste money and materials when the fault is minor and repairable.

A sensible repair-first approach does not mean keeping every old object forever. Some equipment becomes unsafe, inefficient or too costly to maintain. The decision should depend on the condition of the item, the cost and reliability of repair, and the expected remaining life after repair.

The larger principle is to avoid treating replacement as the automatic first response. Where repair is practical and safe, it can extend useful life and reduce waste. Where it is not, replacement remains justified. Good decisions come from comparison, not from a rule that always favours one option.`,
 questions:[
  q("E02-Q1","RC-F01","easy","Which factor does the author say should be considered before deciding to repair an item?","The cost and reliability of the repair",["The colour of the replacement item","The age of the person using it","The number of shops nearby"],"The second paragraph directly lists repair cost and reliability among the decision factors.","the cost and reliability of repair"),
  q("E02-Q2","RC-F02","medium","What can be inferred about the author's position?","The author supports repair when reasonable but accepts replacement when necessary",["The author believes replacement is always wasteful","The author wants all old equipment to be kept indefinitely","The author argues that repair cost should never matter"],"The passage repeatedly rejects an absolute rule and allows replacement when repair is unsafe or impractical.","Where it is not, replacement remains justified"),
  q("E02-Q3","RC-F03","hard","What is the central argument of the passage?","Repair and replacement should be compared case by case rather than chosen automatically",["Every broken item should be repaired at least once","New equipment is usually less efficient than old equipment","Waste can be eliminated only by banning replacement"],"The final sentence states that good decisions come from comparison rather than always favouring one option.","Good decisions come from comparison, not from a rule that always favours one option"),
  q("E02-Q4","RC-F04","medium","Which title best fits the passage?","Repair Before Replacement—but Not at Any Cost",["Never Buy Anything New","Why Repairs Always Save Money","The End of Old Equipment"],"The passage favours considering repair first while clearly recognising cases where replacement is better.","A sensible repair-first approach does not mean keeping every old object forever"),
  q("E02-Q5","RC-F05","easy","In the passage, “justified” most nearly means:","supported by good reason",["made cheaper","delayed without reason","guaranteed to succeed"],"Replacement is called justified when repair is not practical or safe, meaning there is a sound reason for it.","replacement remains justified"),
  q("E02-Q6","RC-F06","medium","Which statement is supported by the passage?","Safety can be a valid reason to replace rather than repair equipment",["Repair should be chosen even when an item is unsafe","Replacement always costs less than maintenance","The age of an item alone should decide what to do"],"The passage explicitly notes that some equipment becomes unsafe and may need replacement.","Some equipment becomes unsafe ... replacement remains justified")
 ]
},
{
 id:"ENG008-RC-E03",title:"A School Garden Should Be Used",genre:"editorial",
 text:`Schools sometimes create gardens for special events and then treat them mainly as decorative spaces. A garden can certainly make a campus more pleasant, but its educational value is greater when students are allowed to observe, measure and care for it.

A small growing area can support lessons on plant life, soil, insects, weather and even record-keeping. Students can compare growth under different conditions or track how often watering is needed. Such activities do not require an elaborate farm; they require a manageable space and a clear learning purpose.

The garden should not become an extra burden placed on a few students or teachers. Maintenance responsibilities need to be realistic. But if a school is already investing land, water and effort in a garden, it should also design ways for students to learn from it rather than viewing it only from a distance.`,
 questions:[
  q("E03-Q1","RC-F01","easy","What does the author suggest students should be allowed to do in a school garden?","Observe, measure and care for it",["Use it only during annual events","Avoid touching plants completely","Replace lessons with gardening every day"],"The first paragraph directly says students should be allowed to observe, measure and care for the garden.","students are allowed to observe, measure and care for it"),
  q("E03-Q2","RC-F02","medium","Why does the author mention record-keeping?","To show that a garden can support learning beyond simply growing plants",["To argue that every plant needs a written label","To suggest gardens should be run like businesses","To prove that gardening requires advanced mathematics"],"Record-keeping is listed with science-related learning activities to show broader educational use.","plant life, soil, insects, weather and even record-keeping"),
  q("E03-Q3","RC-F03","medium","What is the main idea of the passage?","A school garden is more valuable when it is integrated into learning",["Decorative gardens should be removed from schools","Only science teachers should manage school gardens","Large farms are necessary for practical education"],"The author argues that an existing garden should be used as a learning resource, not only decoration.","design ways for students to learn from it"),
  q("E03-Q4","RC-F04","medium","Which title best suits the passage?","A School Garden Should Be Used, Not Just Seen",["Why Schools Need Larger Campuses","The Problem with Plant Science","A Garden Without Students"],"The title captures the contrast between a decorative garden and one actively used for learning.","rather than viewing it only from a distance"),
  q("E03-Q5","RC-F05","medium","In the passage, “elaborate” most nearly means:","large or complicated in design",["temporary and unsafe","dry and unplanted","private and inaccessible"],"The author says useful activities do not need a complex or extensive farm, only a manageable space.","do not require an elaborate farm"),
  q("E03-Q6","RC-F06","medium","Which statement is supported by the passage?","Garden maintenance should be planned so it does not unfairly burden a few people",["Every student should water the garden daily","School gardens require full-time staff","A garden is useful only if it produces food"],"The third paragraph explicitly warns against placing maintenance on only a few students or teachers.","should not become an extra burden placed on a few students or teachers")
 ]
},
{
 id:"ENG008-RC-E04",title:"Numbers Need Context",genre:"editorial",
 text:`Public dashboards can make large amounts of information easy to see. A chart may show school attendance, bus delays, rainfall or hospital waiting times in a few seconds. The danger is that a clear display can create a false sense that the meaning is equally clear.

A number may rise because measurement improved, because the underlying situation changed, or because the definition of what is counted was revised. Without notes on method and time period, two figures that look comparable may not actually describe the same thing.

This is not an argument against public data. On the contrary, accessible data can improve scrutiny and discussion. But dashboards should provide enough context for users to interpret the numbers responsibly. Good presentation is not merely about making figures visible; it is also about making their limits understandable.`,
 questions:[
  q("E04-Q1","RC-F01","easy","What problem can occur with a very clear data display?","Users may assume the meaning is as simple as the appearance",["The numbers become impossible to read","Charts automatically change the underlying data","Public agencies stop collecting information"],"The first paragraph warns that visual clarity can create a false sense that meaning is equally clear.","a clear display can create a false sense that the meaning is equally clear"),
  q("E04-Q2","RC-F02","medium","Why might two figures that look comparable actually be different?","They may have been measured or defined differently",["They are always taken from different cities","Charts cannot display time periods","Public data never uses consistent methods"],"The passage explains that methods, definitions and time periods can change what a number represents.","because the definition of what is counted was revised"),
  q("E04-Q3","RC-F03","hard","What is the central argument of the passage?","Public data should be accessible but accompanied by enough context for responsible interpretation",["Dashboards should be replaced by long written reports","Only experts should be allowed to view public data","A visually clear chart is always misleading"],"The author supports public data while arguing that interpretation requires method and context.","accessible data can improve scrutiny ... But dashboards should provide enough context"),
  q("E04-Q4","RC-F04","medium","Which title best suits the passage?","Numbers Need Context",["Why Charts Should Be Banned","The End of Public Data","More Numbers, Fewer Questions"],"The entire passage argues that displayed figures need information about method, definition and limits.","making their limits understandable"),
  q("E04-Q5","RC-F05","medium","In the passage, “scrutiny” most nearly means:","careful examination",["rapid publication","automatic approval","private ownership"],"Accessible public data can allow people to examine decisions and trends more carefully.","accessible data can improve scrutiny and discussion"),
  q("E04-Q6","RC-F06","medium","Which statement is supported by the passage?","A change in measurement method can affect how a number should be interpreted",["Any rise in a number proves the situation has worsened","Dashboards should hide methodological notes","Figures from different periods are always directly comparable"],"The passage explicitly lists improved measurement and revised definitions as reasons a number may change.","A number may rise because measurement improved")
 ]
}
] as const;

export const ENG008_CP001_QUESTION_AUTHORITIES_V1=ENG008_CP001_PASSAGES_V1.flatMap(p=>p.questions.map(question=>({passage:p,question})));

export function getEng008Cp001PassageV1(id:string){
 const passage=ENG008_CP001_PASSAGES_V1.find(p=>p.id===id);
 if(!passage)throw new Error(`Unknown ENG-008 CP001 passage ${id}`);
 return passage;
}
