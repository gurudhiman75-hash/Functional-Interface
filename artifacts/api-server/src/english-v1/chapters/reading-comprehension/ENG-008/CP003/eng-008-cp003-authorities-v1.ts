import { ENG008_CP003_EXPANSION_WAVE4_V1 } from "./eng-008-cp003-expansion-wave4-v1";
import { ENG008_CP003_EXPANSION_WAVE3_V1 } from "./eng-008-cp003-expansion-wave3-v1";
import { ENG008_CP003_EXPANSION_WAVE2_V1 } from "./eng-008-cp003-expansion-wave2-v1";
import { ENG008_CP003_EXPANSION_WAVE1_V1 } from "./eng-008-cp003-expansion-wave1-v1";
export type Eng008Cp003Difficulty="easy"|"medium";
export type Eng008Cp003Genre="narrative"|"social"|"science"|"business";
export type Eng008Cp003FamilyId="BP-F01"|"BP-F02"|"BP-F03"|"BP-F04"|"BP-F05"|"BP-F06"|"BP-F07"|"BP-F08"|"BP-F09";

export interface Eng008Cp003QuestionAuthorityV1{
 id:string;familyId:Eng008Cp003FamilyId;difficulty:Eng008Cp003Difficulty;question:string;correctAnswer:string;
 distractors:readonly [string,string,string];explanation:string;evidence:string;
}
export interface Eng008Cp003PassageV1{
 id:string;title:string;genre:Eng008Cp003Genre;text:string;questions:readonly Eng008Cp003QuestionAuthorityV1[];
}
const q=(id:string,familyId:Eng008Cp003FamilyId,difficulty:Eng008Cp003Difficulty,question:string,correctAnswer:string,distractors:readonly [string,string,string],explanation:string,evidence:string):Eng008Cp003QuestionAuthorityV1=>({id,familyId,difficulty,question,correctAnswer,distractors,explanation,evidence});

export const ENG008_CP003_PASSAGES_V1:readonly Eng008Cp003PassageV1[]=[
...ENG008_CP003_EXPANSION_WAVE4_V1,
...ENG008_CP003_EXPANSION_WAVE3_V1,
...ENG008_CP003_EXPANSION_WAVE2_V1,
...ENG008_CP003_EXPANSION_WAVE1_V1,
{
 id:"ENG008-BP-N01",title:"The Dog at the Station",genre:"narrative",
 text:`Every morning, a brown dog appeared near the small railway station just before the first passenger train arrived. The station staff assumed it belonged to someone in the nearby market, but no one came to claim it. The dog never entered the platforms when trains were moving. Instead, it waited beside the outer gate and followed the same elderly fruit seller to his stall after the morning rush.

One rainy day, the fruit seller did not arrive. The dog remained near the gate for several hours and refused food offered by a porter. The next morning, the seller returned and explained that he had been ill. He laughed when told about the dog's behaviour and admitted that he had been feeding it leftover fruit and bread for months.

The staff then understood that the dog's daily visit was not random. It had quietly built a routine around a person who had shown it regular kindness.

The station staff had also noticed that the dog behaved differently from other strays that wandered through the area. It did not search dustbins or follow passengers carrying food. It usually arrived at nearly the same time, watched the gate, and left only after the fruit seller had opened his stall. Because the pattern was so consistent, some staff members had started joking that the dog kept a more reliable schedule than a few regular commuters.

After the rainy-day incident, the fruit seller began carrying a small bowl for water and a little extra food. The staff did not officially adopt the dog, but they became more attentive to its routine. What had first seemed like an unexplained habit now looked like a simple example of how repeated small acts can shape behaviour over time.

A week later, the dog began waiting slightly farther from the gate because construction workers had placed barriers near its usual spot. Even then, it still arrived at almost the same time and followed the fruit seller after the rush. The staff took this as another sign that the animal was responding to the person rather than merely to one fixed location.`,
 questions:[
  q("N01-Q1","BP-F01","easy","Where did the dog usually wait?","Beside the outer gate of the station",["Inside the ticket office","On the railway tracks","Near the fruit seller's house"],"The passage directly says the dog waited beside the outer gate.","it waited beside the outer gate"),
  q("N01-Q2","BP-F02","medium","Why did the dog remain at the station for hours on the rainy day?","It was waiting for the fruit seller who usually arrived there",["It was afraid of the rain","It had missed the morning train","It was guarding the station"],"The fruit seller was absent that day, and the dog's routine had formed around him.","the fruit seller did not arrive ... The dog remained near the gate"),
  q("N01-Q3","BP-F03","medium","What is the central idea of the passage?","Regular kindness can create a quiet bond and routine",["Station animals should be formally adopted","Fruit sellers should feed every stray animal","Railway staff often misunderstand passengers"],"The ending explains that the dog's routine developed because of the seller's repeated kindness.","built a routine around a person who had shown it regular kindness"),
  q("N01-Q4","BP-F04","medium","Which statement is supported by the passage?","The dog avoided the platforms while trains were moving",["The dog belonged to the station porter","The fruit seller had adopted the dog officially","The dog travelled on the first train each morning"],"The passage explicitly states that the dog did not enter the platforms when trains were moving.","never entered the platforms when trains were moving"),
  q("N01-Q5","BP-F05","easy","In the passage, “random” is closest in meaning to:","without a clear pattern or reason",["carefully planned","dangerous","temporary"],"The staff realised the visits followed a meaningful routine rather than happening by chance.","the dog's daily visit was not random"),
  q("N01-Q6","BP-F06","easy","Which word is opposite in meaning to “regular” as used in the passage?","occasional",["steady","repeated","routine"],"Here regular means repeated or consistent, so occasional is the opposite.","regular kindness"),
  q("N01-Q7","BP-F07","medium","What does the phrase “built a routine around” suggest?","The dog's daily behaviour became linked to the seller's presence",["The dog protected the seller's stall from thieves","The seller trained the dog for railway work","The dog followed every person entering the station"],"The phrase describes a repeated pattern centred on the seller.","built a routine around a person"),
  q("N01-Q8","BP-F08","medium","What most directly caused the staff to understand the dog's behaviour?","The seller explained that he had been feeding the dog for months",["The porter offered the dog food","It rained heavily near the station","The first train arrived late"],"The seller's explanation revealed why the dog returned each morning.","he had been feeding it ... for months"),
  q("N01-Q9","BP-F09","medium","Which title best suits the passage?","A Routine Built on Kindness",["The Missing Morning Train","The Railway Porter's Pet","A Market Closed by Rain"],"The passage is about a repeated bond formed through the seller's kindness.","regular kindness")
 ]
},
{
 id:"ENG008-BP-N02",title:"A Solo Traveller Changes Her Plan",genre:"narrative",
 text:`Rhea had planned a two-day walk through a hill town using a list of popular viewpoints she had saved on her phone. On the first morning, however, a local bus driver told her that one of the roads on her list was closed for repairs. Instead of trying to reach every original stop, she asked which places were easily accessible that day.

The driver suggested a smaller lake, an old market street and a public garden. None had appeared in the travel posts Rhea had read, but all were on the same bus route. She spent more time at each place than she had expected and spoke with shopkeepers and students along the way.

By evening, Rhea realised that the trip had become less about completing a checklist and more about understanding the town at a slower pace. The road closure had changed her plan, but it had also made the day feel less rushed.

The change also altered how Rhea used her time. On her original plan, she had allowed only twenty or thirty minutes at several viewpoints because she wanted to cover as many locations as possible. On the revised route, the stops were closer together, so she did not spend much time moving between them. That gave her more time to sit near the lake, browse the old market and speak with people who lived in the town.

Rhea later compared the two versions of her itinerary. The first had looked more impressive on a map because it contained famous places, but it had left little room for delay or conversation. The second was less ambitious and had been created only because of a road closure, yet it gave her a clearer sense of the town. She decided that future trips would include fewer fixed stops and more time for unexpected changes.

When she returned home, Rhea did not remove the famous viewpoints from her travel notes. Instead, she added a reminder beside the itinerary: ask locally before trying to cover everything. She realised that preparation was still useful, but a plan worked best when it left enough space to respond to conditions on the ground.`,
 questions:[
  q("N02-Q1","BP-F01","easy","Why could Rhea not follow her original plan exactly?","One of the roads was closed for repairs",["Her phone stopped working","The viewpoints were too expensive","The bus service had ended"],"The bus driver told her that one road on her list was closed.","one of the roads ... was closed for repairs"),
  q("N02-Q2","BP-F02","medium","What can be inferred about the places suggested by the driver?","They were less famous online but convenient to visit together",["They were all outside the town","They were more expensive than the viewpoints","They could be reached only on foot"],"They were absent from Rhea's saved travel posts but lay on the same bus route.","None had appeared in the travel posts ... but all were on the same bus route"),
  q("N02-Q3","BP-F03","medium","What is the main idea of the passage?","Changing a travel plan can sometimes lead to a more meaningful experience",["Tourists should avoid popular viewpoints","Bus drivers are better than travel websites","Solo travel is always cheaper"],"Rhea's altered plan made the day slower and more engaging.","the trip had become less about completing a checklist"),
  q("N02-Q4","BP-F04","medium","Which statement is supported?","Rhea spent longer than expected at the newly suggested places",["Rhea returned home before evening","The road reopened later that day","The public garden was on her original list"],"The second paragraph directly says she spent more time at each place than expected.","spent more time at each place than she had expected"),
  q("N02-Q5","BP-F05","easy","In the passage, “accessible” is closest in meaning to:","easy to reach",["cheap to enter","crowded with tourists","hidden from maps"],"Rhea asks which places can be reached conveniently that day.","which places were easily accessible"),
  q("N02-Q6","BP-F06","easy","Which word is opposite in meaning to “rushed” as used in the passage?","relaxed",["hurried","busy","quick"],"A rushed day is hurried or hurriedly paced, so relaxed is the opposite in this context.","the day feel less rushed"),
  q("N02-Q7","BP-F07","medium","What does “completing a checklist” imply in the passage?","Visiting places mainly to mark them as done",["Writing down directions for other tourists","Paying for every attraction in advance","Checking the bus timetable repeatedly"],"The phrase contrasts quick completion of listed sights with slower exploration.","less about completing a checklist"),
  q("N02-Q8","BP-F08","medium","What caused Rhea to discover places outside her original list?","The road closure forced her to ask for alternatives",["Her phone battery failed","The garden closed early","She missed the first bus"],"The road closure led her to seek other accessible places.","road ... closed ... she asked which places were easily accessible"),
  q("N02-Q9","BP-F09","medium","Which title best suits the passage?","The Better Plan She Had Not Made",["Two Days Without a Bus","The Most Popular Viewpoint","A Guide to Hill Roads"],"The central event is an unplanned change that improves Rhea's experience.","The road closure had changed her plan")
 ]
},
{
 id:"ENG008-BP-S01",title:"The Shared Tool Shelf",genre:"social",
 text:`Residents of an apartment block noticed that many families owned the same rarely used tools: drills, ladders, tyre pumps and large screwdrivers. A residents' group proposed a shared shelf in a locked storeroom where people could borrow such items for short periods.

The idea initially received mixed reactions. Some residents worried that tools would be damaged or not returned. The group therefore introduced a simple sign-out sheet and asked borrowers to report faults instead of quietly returning damaged equipment.

After three months, the shelf was being used regularly. Only two items had needed replacement, and both failures were due to age rather than misuse. The project did not remove the need for personal tools, but it reduced unnecessary purchases and made occasional repair work easier for many households.

The group also learned that convenience mattered. At first, the storeroom could be opened only when one of two volunteers was available. Borrowing increased after the building manager agreed to keep the key at the reception desk during normal hours. Residents said they were more likely to borrow a ladder or drill when they did not have to arrange a special meeting to collect it.

There were still limits to the idea. Small personal items, specialised equipment and frequently used tools were not added to the shelf. The residents also decided that anything unsafe or expensive to repair should not be shared casually. The project worked best for sturdy items that were needed only from time to time and could be checked easily after use.

By the end of the third month, the group also began keeping a short list of the most frequently borrowed items. That list helped them decide which tools were genuinely useful to share and which had been added simply because someone happened to own a spare. The organisers wanted the shelf to remain practical rather than gradually becoming a storage place for unwanted objects. They also planned to remove items that had not been borrowed for several months, keeping the collection focused on tools that residents actually found useful.

The organisers later added a small borrowing card beside each tool so residents could note when an item had been taken and when it was expected back. The simple record reduced uncertainty without turning the shelf into a formal rental system.`,
 questions:[
  q("S01-Q1","BP-F01","easy","Why was the shared shelf proposed?","Many families owned the same tools that were rarely used",["The storeroom was empty","The building banned private tools","Residents wanted to sell old furniture"],"The first paragraph gives repeated ownership of rarely used tools as the reason.","many families owned the same rarely used tools"),
  q("S01-Q2","BP-F02","medium","Why was a sign-out sheet introduced?","To address concerns about responsibility and return of tools",["To calculate electricity use","To decide which tools residents could buy","To record apartment rents"],"Residents worried about damage and return, so the sheet added accountability.","worried that tools would be damaged or not returned"),
  q("S01-Q3","BP-F03","medium","What is the main idea?","Sharing infrequently used items can reduce waste while still meeting practical needs",["Every household should stop buying tools","Locked storerooms are necessary in all apartments","Old tools are safer than new ones"],"The project reduced unnecessary purchases without replacing all personal ownership.","reduced unnecessary purchases"),
  q("S01-Q4","BP-F04","medium","Which statement is supported?","The two replaced tools failed because they were old",["Most tools were damaged by borrowers","The shelf was rarely used after three months","Residents stopped owning personal tools"],"The passage directly states why the two items were replaced.","both failures were due to age rather than misuse"),
  q("S01-Q5","BP-F05","easy","In context, “misuse” is closest in meaning to:","incorrect or careless use",["regular maintenance","shared ownership","safe storage"],"Misuse contrasts with normal responsible use of the tools.","age rather than misuse"),
  q("S01-Q6","BP-F06","easy","Which word is opposite in meaning to “rarely”?","frequently",["seldom","occasionally","hardly"],"Rarely means not often; frequently is its opposite.","rarely used tools"),
  q("S01-Q7","BP-F07","medium","What does “mixed reactions” mean?","Residents had both positive and negative views",["Everyone rejected the idea","Only tool owners were consulted","The group received no response"],"The next sentence shows that some people were worried while others supported the proposal.","initially received mixed reactions"),
  q("S01-Q8","BP-F08","medium","What helped the project move past the initial concern about damaged tools?","A simple system for recording borrowing and faults",["Removing old tools from the shelf","Charging every borrower a fee","Allowing only staff to borrow items"],"The sign-out and fault-reporting system directly addressed the concern.","introduced a simple sign-out sheet"),
  q("S01-Q9","BP-F09","medium","Which title best suits the passage?","Borrowing Instead of Buying",["The Broken Storeroom","Why Tools Should Be Expensive","A Ban on Household Repairs"],"The passage focuses on sharing tools to avoid unnecessary purchases.","reduced unnecessary purchases")
 ]
},
{
 id:"ENG008-BP-S02",title:"A Community Kitchen Learns to Plan",genre:"social",
 text:`A neighbourhood community kitchen served free evening meals twice a week. During its first month, volunteers prepared the same number of meals each time, but attendance varied widely. Some evenings food was left over, while on others late arrivals found that all portions had been served.

The volunteers began asking regular visitors to confirm attendance by noon on meal days. They also kept a small reserve rather than cooking exactly the confirmed number. This did not predict demand perfectly, but it reduced both shortages and leftovers.

The kitchen later added a simple note explaining that confirmations helped with planning but were not required to receive a meal. The volunteers wanted better estimates without making the service difficult to access for people whose plans could change unexpectedly.

The volunteers also began recording which meal days were most difficult to predict. Attendance was relatively stable on ordinary weekdays but changed more sharply during local events, school holidays and periods of bad weather. Rather than trying to create a perfect forecast, they used the records to decide when a slightly larger reserve might be sensible.

This made the planning process more flexible. The kitchen could prepare closer to expected demand without turning advance confirmation into a barrier. Volunteers also found that explaining why they asked for confirmations improved cooperation. Regular visitors understood that the request was not about restricting access; it was simply a way to reduce unnecessary waste while keeping enough food available for unexpected arrivals.

The organisers also reviewed the records at the end of each month instead of assuming that one planning rule would work forever. If attendance patterns changed, the reserve could be adjusted. This kept the system simple while recognising that demand for a community service can change with seasons, local events and household circumstances. The volunteers preferred a flexible estimate that could be revised over time to a rigid target that looked precise but quickly became outdated.

The volunteers also began noting which meals attracted larger groups and which ingredients were often left unused. Over several weeks, those records helped them adjust quantities before shopping rather than relying only on memory. The kitchen still kept extra food for unexpected visitors, but the margin became more deliberate.`,
 questions:[
  q("S02-Q1","BP-F01","easy","What problem did the kitchen face in its first month?","The number of meals prepared did not match changing attendance",["Volunteers stopped serving evening meals","Visitors refused to eat the food","The kitchen opened only once a month"],"Attendance varied even though the same number of meals was prepared each time.","prepared the same number ... attendance varied widely"),
  q("S02-Q2","BP-F02","medium","Why did the kitchen keep a small reserve?","To handle people who came without being included in the confirmed count",["To sell meals the next day","To reduce the number of volunteers","To avoid asking for confirmations"],"A reserve protected against imperfect attendance estimates.","kept a small reserve rather than cooking exactly the confirmed number"),
  q("S02-Q3","BP-F03","medium","What is the main idea?","Better planning can reduce waste without making a community service less accessible",["Free meal services should require advance booking","Leftover food is unavoidable in every kitchen","Community kitchens should serve fixed groups only"],"The kitchen improves estimates while keeping confirmation optional.","wanted better estimates without making the service difficult to access"),
  q("S02-Q4","BP-F04","medium","Which statement is supported?","Confirming attendance was not made a condition for receiving a meal",["The reserve eliminated all shortages","Attendance became identical every week","Meals were served every evening"],"The final paragraph explicitly says confirmations were not required.","confirmations ... were not required to receive a meal"),
  q("S02-Q5","BP-F05","easy","In context, “varied” is closest in meaning to:","changed from one occasion to another",["remained equal","increased permanently","was carefully counted"],"Attendance changed noticeably from one meal day to another, so “varied” means it did not remain the same.","attendance varied widely"),
  q("S02-Q6","BP-F06","easy","Which word is opposite in meaning to “shortages”?","surpluses",["limits","deficits","gaps"],"A shortage is too little; a surplus is more than needed.","reduced both shortages and leftovers"),
  q("S02-Q7","BP-F07","medium","What does “plans could change unexpectedly” refer to?","Some people might not know by noon whether they could attend",["Volunteers could close the kitchen without notice","The menu changed after every meal","Visitors preferred different foods"],"The kitchen keeps confirmation optional because users may have uncertain schedules.","plans could change unexpectedly"),
  q("S02-Q8","BP-F08","medium","What directly reduced both waste and shortages?","Using confirmations together with a small reserve",["Serving fewer meals every week","Closing the kitchen to late arrivals","Preparing the same number as before"],"The new planning method combined expected attendance with a buffer.","confirm attendance ... kept a small reserve"),
  q("S02-Q9","BP-F09","medium","Which title best suits the passage?","Planning Meals Without Closing the Door",["Why Free Meals Fail","The End of Leftovers","A Kitchen for Confirmed Guests Only"],"The passage balances planning efficiency with open access.","better estimates without making the service difficult to access")
 ]
},
{
 id:"ENG008-BP-SC01",title:"Listening Below the Surface",genre:"science",
 text:`A coastal research team wanted to study the movement of small whales without following them constantly by boat. The researchers placed underwater microphones at several fixed points and recorded short samples throughout the day.

The microphones could not tell the team exactly how many animals were present. However, changes in the frequency and location of calls helped researchers identify periods when whale activity was higher in one part of the bay than another. Boat observations were still used on selected days to check how well the sound patterns matched what could be seen.

The project showed that passive listening could extend the amount of time the bay was monitored while reducing the need for repeated boat trips. The researchers treated the method as an additional source of evidence, not a complete replacement for direct observation.

The recordings created a large amount of data, so the researchers did not listen to every minute manually. Software first marked sections that were likely to contain whale calls, and researchers then reviewed samples to confirm whether the sounds had been identified correctly. Background noise from boats and weather occasionally made the recordings harder to interpret.

The team was especially interested in whether the pattern changed across different parts of the day. Some fixed microphones recorded more calls during early morning hours, while others showed greater activity later. The researchers were careful not to assume that more calls always meant more whales, since the same animals might call at different rates. Even so, the pattern helped them decide where direct observations would be most useful.

The team also compared recordings across several weeks rather than drawing conclusions from a single busy day. Weather, boat traffic and animal behaviour could all change the sound pattern. By looking at repeated observations, the researchers hoped to distinguish a temporary spike in calls from a more consistent shift in how the whales were using different parts of the bay.

Researchers repeated several recordings at different times of day to check whether the same sounds could still be detected when boat traffic changed. This made the work slower, but it helped them distinguish a genuine underwater pattern from noise created by one unusually busy period.`,
 questions:[
  q("SC01-Q1","BP-F01","easy","Why did the team place underwater microphones in the bay?","To study whale activity without constantly following the animals by boat",["To measure the depth of the bay","To warn ships about storms","To record tourist boats"],"The first paragraph directly states the purpose of the microphones.","study the movement ... without following them constantly by boat"),
  q("SC01-Q2","BP-F02","medium","Why were boat observations still used?","To compare visible whale activity with the sound patterns",["To move the microphones every hour","To count fishing vessels","To repair the coastline"],"Boat observations acted as a check on the acoustic evidence.","check how well the sound patterns matched what could be seen"),
  q("SC01-Q3","BP-F03","medium","What is the main idea?","Underwater listening can expand whale monitoring but works best alongside direct observation",["Boat observation is no longer useful","Microphones can count every whale exactly","Whales avoid areas with research equipment"],"The project treats passive listening as useful additional evidence rather than a total replacement.","additional source of evidence"),
  q("SC01-Q4","BP-F04","medium","Which statement is supported?","The microphones could indicate changes in activity but not exact whale numbers",["The microphones identified every whale individually","Boat trips were completely stopped","The team monitored only at night"],"The passage clearly states the limitation and the useful signal.","could not tell ... exactly how many ... However, changes ... helped"),
  q("SC01-Q5","BP-F05","easy","In context, “passive” is closest in meaning to:","operating without actively chasing the animals",["inactive and broken","temporary","expensive"],"The microphones listen from fixed points instead of pursuing the whales.","passive listening"),
  q("SC01-Q6","BP-F06","easy","Which word is opposite in meaning to “fixed” as used in the passage?","movable",["stable","set","stationary"],"Fixed means kept in one position; movable is the opposite.","fixed points"),
  q("SC01-Q7","BP-F07","medium","What does “additional source of evidence” imply?","The microphone data should be combined with other observations",["The microphone data is unreliable and should be ignored","Only sound recordings should be used","The team needed more researchers"],"The phrase shows the method supplements rather than replaces other evidence.","not a complete replacement for direct observation"),
  q("SC01-Q8","BP-F08","medium","What allowed researchers to monitor for longer with fewer boat trips?","Recording whale calls from fixed underwater microphones",["Counting animals from the shore","Using faster boats","Reducing the number of study sites"],"Passive acoustic monitoring extended coverage without repeated travel.","passive listening could extend the amount of time ... monitored"),
  q("SC01-Q9","BP-F09","medium","Which title best suits the passage?","Listening Below the Surface",["Counting Every Whale","The Fastest Research Boat","Why Whales Avoid Bays"],"The passage centres on underwater acoustic monitoring.","underwater microphones")
 ]
},
{
 id:"ENG008-BP-SC02",title:"When Streetlights Become Smarter",genre:"science",
 text:`A town replaced several old streetlights with lamps that could dim slightly when roads were empty and return to full brightness when movement was detected. The aim was to reduce electricity use without leaving streets dark.

During the first month, engineers reviewed energy use and also collected complaints from residents. Most streets operated as expected, but one lane produced repeated complaints because trees were blocking a motion sensor. The lamp there stayed dim longer than intended.

After the branches were trimmed and the sensor angle was adjusted, the problem largely disappeared. The trial showed that an automated system can save energy, but its performance still depends on ordinary physical conditions such as placement, maintenance and visibility.

Engineers also compared electricity use with the previous lighting system. The largest savings appeared on quieter roads where the lamps spent more time in the lower-brightness setting. On busier roads, the difference was smaller because passing vehicles and pedestrians kept triggering full brightness.

Residents were asked whether they felt less safe under the new system. Most did not report a problem, but the complaints from the lane with the blocked sensor showed why technical performance could not be judged by energy data alone. A system that saves electricity but fails to respond when people are present would not meet its purpose. For that reason, the town decided that future installations would include periodic checks of sensor visibility as part of routine maintenance.

The trial also changed how officials thought about efficiency. Lower electricity use was important, but it was only one measure of success. Engineers were asked to track complaints, response time and maintenance needs alongside energy savings. The town wanted to know whether the new system remained dependable for residents, not simply whether it consumed less power on paper. Officials also noted that a successful trial in one neighbourhood would not automatically guarantee identical results on roads with different traffic, trees or building layouts.

Engineers also reviewed cases where the sensors reacted correctly but residents still reported dark stretches. In some places, tree branches blocked the light rather than the sensor failing. The review showed that a smart control system could identify some problems while ordinary physical maintenance remained necessary.`,
 questions:[
  q("SC02-Q1","BP-F01","easy","What was the purpose of the new streetlights?","To reduce electricity use without leaving roads dark",["To remove all streetlights at night","To increase traffic speed","To replace road signs"],"The first paragraph directly states the aim.","reduce electricity use without leaving streets dark"),
  q("SC02-Q2","BP-F02","medium","Why did one lane receive repeated complaints?","A tree blocked the sensor and kept the light dim too long",["The lamp used too much electricity","Residents wanted the road closed","The sensor made the lamp too bright all day"],"The passage directly links the complaints to blocked sensor visibility.","trees were blocking a motion sensor"),
  q("SC02-Q3","BP-F03","medium","What is the main idea?","Smart systems can work well but still need proper placement and maintenance",["Automation removes the need for maintenance","Streetlights should always remain at full brightness","Trees are unsuitable for urban roads"],"The final sentence states that automated performance depends on physical conditions.","depends on ordinary physical conditions"),
  q("SC02-Q4","BP-F04","medium","Which statement is supported?","Adjusting the sensor helped resolve the lane's lighting problem",["Every street received complaints","The town removed the smart lights","The lights remained dim even when movement was detected"],"The issue largely disappeared after trimming branches and adjusting the sensor.","sensor angle was adjusted, the problem largely disappeared"),
  q("SC02-Q5","BP-F05","easy","In context, “dim” is closest in meaning to:","less bright",["completely broken","more expensive","newly installed"],"The lamps reduced brightness when roads were empty.","dim slightly"),
  q("SC02-Q6","BP-F06","easy","Which word is opposite in meaning to “ordinary” as used in the passage?","unusual",["common","normal","routine"],"Ordinary means normal or common; unusual is the opposite.","ordinary physical conditions"),
  q("SC02-Q7","BP-F07","medium","What does “operated as expected” mean?","The lights behaved according to the intended design",["The lights were replaced again","Residents stopped using the roads","Energy use increased everywhere"],"The phrase indicates normal intended functioning.","Most streets operated as expected"),
  q("SC02-Q8","BP-F08","medium","What directly caused the problem to improve?","Better sensor visibility and positioning",["Higher electricity use","Longer periods of darkness","Removing the lamp"],"Trimming branches and changing the sensor angle corrected detection.","branches were trimmed and the sensor angle was adjusted"),
  q("SC02-Q9","BP-F09","medium","Which title best suits the passage?","Smart Lights Still Need Simple Maintenance",["Why Towns Need Darker Roads","The End of Street Lighting","A Tree-Planting Campaign"],"The key lesson is that automation still depends on physical maintenance.","performance still depends on ... maintenance")
 ]
},
{
 id:"ENG008-BP-B01",title:"A Small Shop Tries Digital Receipts",genre:"business",
 text:`A neighbourhood clothing shop began offering digital receipts to customers who preferred them. Instead of printing a paper slip automatically, the cashier asked whether the buyer wanted a printed receipt or one sent by message.

The owner expected most younger customers to choose the digital option, but the pattern was less predictable. Some older customers preferred digital receipts because they were easier to store, while some younger buyers still wanted paper for returns. The shop therefore kept both choices.

After two months, paper use had fallen, but not disappeared. The owner concluded that the useful change was not replacing one format with another; it was allowing customers to choose the format that suited the transaction.

The shop also noticed that digital receipts were useful in a different way than expected. Customers who returned after several weeks could often find an old message more easily than a small paper slip kept in a wallet or shopping bag. On the other hand, some buyers purchasing gifts preferred paper because it was easier to hand to another person.

The owner briefly considered making digital receipts the default option and printing paper only on request. He decided against changing the process immediately because staff were still learning which customers found each format convenient. Instead, the shop continued asking at the counter. This added only a few seconds to each sale and gave the owner better information about actual customer behaviour than his original assumptions had provided.

The shop later used the same approach when testing another small change: customers were asked whether they wanted a bag instead of receiving one automatically. The owner noticed that simple questions at the counter could reveal preferences more accurately than guessing from age or appearance. That lesson mattered as much as the reduction in paper receipt use. The owner concluded that small operational choices were easier to improve when they were based on observed customer behaviour rather than assumptions about what different groups were likely to prefer.

The owner also kept a paper option for customers who did not want to share a phone number or email address. Over time, staff learned to ask which format a customer preferred instead of assuming that digital receipts were automatically more convenient for everyone.`,
 questions:[
  q("B01-Q1","BP-F01","easy","What choice did the shop give customers?","A printed receipt or a digital receipt sent by message",["Cash payment or no receipt","A discount or a receipt","Return or exchange only"],"The first paragraph directly describes the two receipt options.","printed receipt or one sent by message"),
  q("B01-Q2","BP-F02","medium","What surprised the owner?","Receipt preference did not follow age as neatly as expected",["No customer wanted a receipt","Paper use increased sharply","Digital receipts caused more returns"],"Older and younger customers did not divide neatly by format preference.","the pattern was less predictable"),
  q("B01-Q3","BP-F03","medium","What is the main idea?","Offering flexible choices can work better than assuming one format suits everyone",["Digital receipts should replace paper immediately","Older customers dislike technology","Paper receipts are unnecessary for returns"],"The shop kept both formats because customers had different needs.","allowing customers to choose the format that suited the transaction"),
  q("B01-Q4","BP-F04","medium","Which statement is supported?","Paper receipt use decreased but continued",["Only young customers selected digital receipts","The shop stopped printing receipts completely","Customers paid extra for digital receipts"],"The final paragraph states exactly this outcome.","paper use had fallen, but not disappeared"),
  q("B01-Q5","BP-F05","easy","In context, “predictable” is closest in meaning to:","easy to expect in advance",["expensive","temporary","unpopular"],"The owner expected a simple age pattern, but actual preferences did not match it.","less predictable"),
  q("B01-Q6","BP-F06","easy","Which word is opposite in meaning to “preferred”?","rejected",["favoured","selected","liked"],"Preferred means liked or favoured; rejected is opposite.","customers who preferred them"),
  q("B01-Q7","BP-F07","medium","What does “the format that suited the transaction” mean?","The receipt type that was most useful for that purchase",["The cheapest clothing size","The payment method chosen by the cashier","The message service used by the owner"],"The phrase refers to choosing paper or digital based on the customer's needs for that purchase.","format that suited the transaction"),
  q("B01-Q8","BP-F08","medium","Why did the shop keep both receipt options?","Customer preferences varied in ways the owner had not expected",["The digital system failed","Paper receipts were legally required for every sale","The shop had too much printer paper"],"The mixed preference pattern made a single-format policy less useful.","The shop therefore kept both choices"),
  q("B01-Q9","BP-F09","medium","Which title best suits the passage?","Two Receipt Options, One Useful Lesson",["Why Paper Always Wins","A Shop Without Customers","The Cost of Clothing Returns"],"The story centres on the lesson from offering both receipt formats.","kept both choices")
 ]
},
{
 id:"ENG008-BP-B02",title:"A Factory Changes One Small Step",genre:"business",
 text:`A small toy factory noticed that workers often waited for empty cartons at the end of the packing line. The cartons were stored in another room, and one employee had to leave the line several times each hour to bring more.

Instead of buying faster packing machines, the supervisor first moved a day's supply of flat cartons to a rack beside the line. Workers could then open a carton when needed without leaving their stations.

The change cost very little, but average packing time improved. The supervisor noted that the machines had never been the main problem; the delay came from the way materials were arranged. The experience encouraged the factory to examine other small interruptions before considering expensive equipment upgrades.

The supervisor then asked workers to identify other delays that appeared small but happened many times during a shift. They mentioned labels that were stored too far from the packing table and a shared tape dispenser that regularly had to be moved between two stations. Neither issue seemed important on its own, but repeated dozens of times, each one interrupted the flow of work.

The factory did not reject investment in better machinery. Management simply decided that equipment purchases should follow a review of the existing process. If a delay could be removed through layout, storage or task arrangement, that option would be tested first. More expensive upgrades would still be considered when the existing machines genuinely limited production rather than when the problem came from avoidable movement or waiting.

Workers were encouraged to report repeated delays even when each interruption lasted only a minute or two. Management realised that small delays can become significant when they occur many times across several shifts. The factory therefore began treating layout and material flow as part of productivity, rather than assuming that output depended mainly on machine speed. This gave workers a clearer role in improvement because they were often the first to notice repeated movements, waiting points and small shortages during a normal shift.

After the new layout had been used for several weeks, the supervisor checked whether the faster packing rate had increased mistakes. Error rates stayed roughly the same, suggesting that the gain came from reducing unnecessary movement rather than from workers simply rushing through the task.`,
 questions:[
  q("B02-Q1","BP-F01","easy","What were workers waiting for at the end of the packing line?","Empty cartons",["Finished toys","New machines","Delivery trucks"],"The opening sentence directly identifies the missing item.","waited for empty cartons"),
  q("B02-Q2","BP-F02","medium","Why did moving cartons beside the line improve packing time?","Workers no longer had to leave repeatedly to fetch them",["The cartons became larger","The machines ran faster","Fewer toys were packed"],"The new arrangement removed repeated trips away from the line.","without leaving their stations"),
  q("B02-Q3","BP-F03","medium","What is the main idea?","A simple process change can solve a delay without expensive equipment",["Factories should always buy faster machines","Packing lines work best with fewer workers","Cartons are the main cost in toy production"],"The factory improved output through better material placement rather than new machinery.","The change cost very little, but average packing time improved"),
  q("B02-Q4","BP-F04","medium","Which statement is supported?","The machines were not the main cause of the delay",["The factory bought new machines immediately","Workers packed fewer toys after the change","Cartons were moved farther from the line"],"The supervisor directly states that the machines were not the main problem.","machines had never been the main problem"),
  q("B02-Q5","BP-F05","easy","In context, “interruptions” is closest in meaning to:","small breaks or disruptions in the workflow",["bonuses","repairs","orders"],"The passage refers to delays that stop or slow work.","other small interruptions"),
  q("B02-Q6","BP-F06","easy","Which word is opposite in meaning to “expensive”?","cheap",["costly","valuable","high-priced"],"Cheap is the direct opposite of expensive.","expensive equipment upgrades"),
  q("B02-Q7","BP-F07","medium","What does “a day's supply” mean?","Enough cartons for normal work during one day",["All cartons owned by the factory","Only one carton per worker","Cartons for a full month"],"The phrase describes the quantity expected to be needed for a day.","a day's supply of flat cartons"),
  q("B02-Q8","BP-F08","medium","What caused the original delay?","The storage arrangement required workers to make repeated trips",["The machines were too slow","The toys were difficult to pack","Workers refused to open cartons"],"The passage identifies the material layout as the real source of delay.","delay came from the way materials were arranged"),
  q("B02-Q9","BP-F09","medium","Which title best suits the passage?","A Small Change Before a Big Purchase",["The Fastest Toy Machine","Why Factories Need More Rooms","A Day Without Cartons"],"The lesson is to fix a simple process issue before buying costly equipment.","before considering expensive equipment upgrades")
 ]
}
] as const;

export const ENG008_CP003_QUESTION_AUTHORITIES_V1=ENG008_CP003_PASSAGES_V1.flatMap(p=>p.questions.map(question=>({passage:p,question})));
