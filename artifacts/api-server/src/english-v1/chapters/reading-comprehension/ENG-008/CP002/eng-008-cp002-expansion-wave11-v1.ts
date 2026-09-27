import type{Eng008Cp002PassageV1}from"./eng-008-cp002-authorities-v1";
const q=(id:string,familyId:any,difficulty:any,question:string,correctAnswer:string,distractors:readonly[string,string,string],explanation:string,evidence:string)=>({id,familyId,difficulty,question,correctAnswer,distractors,explanation,evidence});
export const ENG008_CP002_EXPANSION_WAVE11_V1:readonly Eng008Cp002PassageV1[]=[
{
 id:"ENG008-RC2-E32",title:"Good Defaults Should Be Easy to Change",genre:"editorial",
 text:`Defaults are useful because they reduce the number of decisions a person must make. A new phone can arrive with sensible privacy settings, a form can suggest a common delivery option and a pension plan can enrol workers automatically.

The problem begins when a default quietly becomes a trap. If the recommended option is difficult to change, hidden behind several menus or described in confusing language, convenience turns into pressure.

A good default should therefore be both reasonable and reversible. People who do nothing receive a sensible starting point, while people with different needs can change it without facing unnecessary friction.

This is especially important when preferences vary widely. One notification schedule may suit a student but overwhelm a shift worker. One data-sharing setting may be acceptable to one user and too broad for another.

Designers should also explain the consequence of the default. “Share usage data to improve recommendations” is more informative than simply marking a switch as “recommended”.

Defaults can guide behaviour without removing choice. Their power comes partly from inertia: many users accept the starting option because changing it requires time and attention.

That influence creates responsibility. A default should not be chosen only because it benefits the service provider.

The broader principle is simple: defaults are most defensible when they help the typical user, are explained clearly and remain easy to reverse when the user's needs differ.`,
 questions:[
 q("E32-Q1","RC2-F01","easy","When does a default become problematic according to the passage?","When it is difficult to change or poorly explained",["When it saves time","When it is visible","When it suits many users"],"The passage distinguishes a helpful starting point from a setting that quietly traps users through friction or confusion.","difficult to change"),
 q("E32-Q2","RC2-F02","medium","What can be inferred about user inertia?","People may keep a default even when another option would suit them better",["Users always study every setting","Defaults never affect behaviour","Inertia means changing settings quickly"],"The author notes that many people accept starting options because changing them requires extra attention.","many users accept the starting option"),
 q("E32-Q3","RC2-F03","medium","Which summary is most accurate?","Defaults are useful when sensible, transparent and easy to reverse",["Defaults should be banned","Recommended options should be permanent","Users should always configure everything manually"],"The article supports defaults while placing clear conditions on how they should be designed.","reasonable and reversible"),
 q("E32-Q4","RC2-F04","hard","What is the author's tone?","Balanced and design-focused",["Hostile to all default settings","Promotional","Humorous"],"The passage recognises the convenience of defaults but examines the risks of hidden friction and provider self-interest.","useful because"),
 q("E32-Q5","RC2-F05","medium","Why does the author mention notification schedules and data sharing?","To show that one starting option may not fit users with different needs",["To argue notifications should be removed","To compare phone prices","To explain pension rules"],"The examples demonstrate why reversibility matters when preferences and circumstances differ.","preferences vary widely"),
 q("E32-Q6","RC2-F06","hard","Which conclusion follows most logically?","A provider should not rely on change-friction to keep users in a preferred setting",["The hardest setting to change is always safest","Defaults should maximise provider revenue","Users never need explanations"],"The passage treats friction-based persistence as pressure rather than legitimate convenience.","unnecessary friction"),
 q("E32-Q7","RC2-F07","medium","Which statement is supported?","A default can influence behaviour even without removing choice",["Defaults eliminate choice by definition","All users change default settings","Recommended settings require no explanation"],"The author explicitly says defaults guide behaviour partly through inertia while leaving alternatives available.","guide behaviour without removing choice"),
 q("E32-Q8","RC2-F08","easy","In context, “reversible” most nearly means:","able to be changed back or altered easily",["permanent","hidden","automatic"],"The word describes a default that users can change when their needs differ.","easy to reverse")
 ]
},
{
 id:"ENG008-RC2-E33",title:"Queue Numbers Need Context, Not Just Order",genre:"editorial",
 text:`A queue number appears precise. If a screen says “You are number 12”, a customer may assume that eleven people must be served before their turn. In simple queues that may be true. In many services, however, order is only part of the story.

Hospitals may prioritise emergencies. Repair centres may send different jobs to different technicians. Banks may have separate counters for cash, loans and account services.

A single number can therefore create false expectations if customers do not know which queue it belongs to or whether priority rules apply.

Better systems show both position and category. “Number 12 in document verification” is more informative than “12” alone. A short note such as “urgent cases may be called earlier” can explain why the sequence sometimes changes.

Estimated time should also be treated carefully. Ten people ahead may mean five minutes in one service and an hour in another if task lengths differ.

This does not mean queue numbers are useless. They reduce uncertainty and help people see that progress is being made.

The problem comes from giving a precise-looking number without enough context to interpret it.

Good queue communication therefore answers three questions: where am I, what process am I waiting for and what could legitimately change the order? With that information, a number becomes useful rather than misleading.`,
 questions:[
 q("E33-Q1","RC2-F01","easy","Why can one queue number be misleading?","Different services may use categories or priority rules",["Numbers cannot be counted","Every service has one counter","Customers dislike screens"],"The passage shows that position alone may not reveal which process or priority system controls the wait.","priority rules apply"),
 q("E33-Q2","RC2-F02","medium","What can be inferred about two customers both shown number 12?","They may still be waiting in different service categories",["They must be served together","They have identical waiting times","Their tasks are equally long"],"The author recommends showing the category because the same numerical position can refer to different service streams.","position and category"),
 q("E33-Q3","RC2-F03","medium","Which summary is most accurate?","Queue information should combine order with service category and legitimate exceptions",["Queue numbers should be removed","Every queue needs exact timing","Priority should never alter order"],"The passage argues that context turns a bare number into useful information.","where am I, what process"),
 q("E33-Q4","RC2-F04","hard","What is the author's tone?","Practical and explanatory",["Hostile to waiting systems","Promotional","Sarcastic"],"The author accepts the value of queue numbers while explaining how to make them easier to interpret.","does not mean queue numbers are useless"),
 q("E33-Q5","RC2-F05","medium","Why does the author discuss task length?","The same number of people ahead can imply very different waiting times",["Task length determines queue colour","Every task takes one hour","Hospitals cannot estimate time"],"Different service durations weaken any simple conversion from position to waiting time.","task lengths differ"),
 q("E33-Q6","RC2-F06","hard","Which conclusion follows most logically?","Precision without context can create more confidence than the information deserves",["Exact numbers are always wrong","Customers should ignore queue systems","Categories make waiting longer"],"The passage warns that a precise-looking number can be misinterpreted when the underlying process is unclear.","precise-looking number"),
 q("E33-Q7","RC2-F07","medium","Which statement is supported?","Urgent cases can legitimately move ahead in some queues",["All queues are first-come, first-served","Banks use only one queue","Repair jobs always take equal time"],"The passage uses emergency medical priority as a clear example of a justified sequence change.","prioritise emergencies"),
 q("E33-Q8","RC2-F08","easy","In context, “legitimately” most nearly means:","for a valid or justified reason",["secretly","randomly","permanently"],"The word refers to recognised rules that can properly change the expected order.","legitimately change the order")
 ]
},
{
 id:"ENG008-RC2-E34",title:"Cancellation Should Not Be Harder Than Joining",genre:"editorial",
 text:`Many services make enrolment extremely easy. A person can start a subscription with one tap, save a card and begin using the service immediately. Cancellation can be very different.

Some users must search through several menus, call during limited office hours or answer repeated questions before they can end the same service.

This imbalance matters because ease of entry and difficulty of exit shape consumer choice. A low-friction sign-up can encourage experimentation, but hidden cancellation friction can turn that convenience into lock-in.

A fair design should make the basic cancellation path reasonably comparable to the joining path. That does not mean every service must cancel instantly. A loan account may need security checks; a utility may need a final meter reading.

The key is whether each extra step has a clear operational reason.

Retention offers are not necessarily a problem either. A service may offer a cheaper plan or temporary pause when someone tries to leave. But the offer should not obscure the actual cancellation option.

Businesses sometimes argue that difficult cancellation reduces accidental account closure. That risk can usually be managed with a final confirmation screen rather than an obstacle course.

The broader principle is symmetry. When a company deliberately removes friction from joining, it should be cautious about adding friction only when the user wants to leave. Convenience should not work in only one direction.`,
 questions:[
 q("E34-Q1","RC2-F01","easy","What imbalance does the passage criticise?","Services that make joining easy but cancellation unnecessarily difficult",["Services with confirmation screens","Utilities that need final readings","Subscriptions with monthly billing"],"The article focuses on one-sided friction between entry and exit.","ease of entry and difficulty of exit"),
 q("E34-Q2","RC2-F02","medium","What can be inferred about security checks during cancellation?","They can be justified when they serve a real operational need",["They are always deceptive","They should never be used","They prove cancellation is impossible"],"The author allows extra steps when they have a clear reason, such as security or final account handling.","clear operational reason"),
 q("E34-Q3","RC2-F03","medium","Which summary is most accurate?","Cancellation should be reasonably accessible and extra friction should have a genuine purpose",["Every service must cancel instantly","Retention offers should be banned","Joining should be made harder"],"The passage supports symmetry without ignoring legitimate procedural requirements.","basic cancellation path reasonably comparable"),
 q("E34-Q4","RC2-F04","hard","What is the author's tone?","Critical but practical",["Promotional","Indifferent to consumers","Humorous"],"The passage criticises artificial lock-in while recognising valid reasons for some steps.","does not mean every service must cancel instantly"),
 q("E34-Q5","RC2-F05","medium","Why does the author mention retention offers?","To distinguish a legitimate alternative offer from hiding the cancellation option",["To argue every customer should receive a discount","To define security checks","To explain payment processing"],"An offer can be acceptable as long as it does not replace or obscure the requested exit path.","should not obscure"),
 q("E34-Q6","RC2-F06","hard","Which conclusion follows most logically?","A final confirmation screen is usually a better safeguard than making cancellation difficult to find",["Accidental cancellation cannot be prevented","Every cancellation needs a phone call","Lock-in benefits consumers"],"The passage explicitly presents confirmation as a narrower solution to accidental closure.","final confirmation screen"),
 q("E34-Q7","RC2-F07","medium","Which statement is supported?","Some service closures legitimately require additional information",["All extra steps are unfair","Loans never need security checks","Utility accounts can close without readings"],"The article gives examples where security or meter information may reasonably be needed.","may need security checks"),
 q("E34-Q8","RC2-F08","easy","In context, “symmetry” most nearly means:","a reasonably balanced treatment of joining and leaving",["identical prices","matching logos","automatic renewal"],"The conclusion uses symmetry to describe comparable friction in opposite directions.","Convenience should not work in only one direction")
 ]
},
{
 id:"ENG008-RC2-E35",title:"School Dashboards Should Not Rank Raw Scores Alone",genre:"editorial",
 text:`School dashboards often display average marks by class, subject or campus. These summaries can reveal broad patterns, but ranking schools by raw scores alone can encourage misleading conclusions.

Students do not begin from identical starting points. One school may serve many pupils who recently changed language of instruction. Another may enrol students with prior access to tutoring or stronger preparation.

A raw final score combines what students already knew with what happened during the year.

For this reason, growth measures can add useful context. If students begin far behind and make large gains, a school may be improving learning even if its final average remains below another school's. Growth measures also have limits. Tests contain measurement error, and very small groups can show large percentage changes from only a few students.

Attendance, subject choice and student mobility can also influence comparisons.

The answer is not to hide results. It is to present several measures together: current achievement, change over time, group size and relevant context.

Dashboards should also avoid turning every difference into a league table. Ranking can imply more certainty than the data supports, especially when schools are separated by only a few marks.

Good public reporting helps people ask better questions rather than offering one simplistic verdict. The broader lesson is that educational performance is multidimensional. A raw score is useful evidence, but it should not be treated as a complete measure of school quality or student progress.`,
 questions:[
 q("E35-Q1","RC2-F01","easy","Why can raw school scores be misleading when used alone?","Students can begin with different levels of prior preparation",["Scores cannot be measured","Every school teaches different subjects","Growth never matters"],"The passage explains that final scores combine starting point and learning during the year.","do not begin from identical starting points"),
 q("E35-Q2","RC2-F02","medium","What can be inferred about a school with low final scores but large gains?","It may be producing meaningful learning progress despite a lower final average",["It must be the weakest school","Its tests are invalid","Students learned nothing"],"Growth measures can reveal improvement that final-level comparisons alone miss.","make large gains"),
 q("E35-Q3","RC2-F03","medium","Which summary is most accurate?","School performance should be interpreted using achievement, growth and context rather than raw-score rankings alone",["Scores should never be published","Growth is the only valid measure","Every school should receive the same rank"],"The article calls for multiple measures and warns against simplistic league tables.","present several measures together"),
 q("E35-Q4","RC2-F04","hard","What is the author's tone?","Analytical and cautious",["Hostile to school testing","Promotional","Celebratory"],"The passage treats scores as useful but limited evidence and repeatedly qualifies interpretation.","useful evidence, but"),
 q("E35-Q5","RC2-F05","medium","Why does the author mention small groups?","Their percentage changes can look large because only a few students affect the result",["Small groups cannot be tested","They always score lower","Group size determines curriculum"],"Small samples make growth estimates more unstable and should be visible in dashboards.","very small groups"),
 q("E35-Q6","RC2-F06","hard","Which conclusion follows most logically?","A league table can exaggerate small differences when measurement uncertainty is ignored",["Rankings are always meaningless","Every score difference is important","Growth measures remove all error"],"The passage warns that close scores can be presented as more certain than they really are.","only a few marks"),
 q("E35-Q7","RC2-F07","medium","Which statement is supported?","Student mobility can affect school comparisons",["Attendance never matters","Tutoring has no effect on preparation","Raw scores measure only school teaching"],"The article lists student mobility among factors that complicate direct comparisons.","student mobility"),
 q("E35-Q8","RC2-F08","easy","In context, “multidimensional” most nearly means:","having several relevant aspects",["impossible to measure","based on one number","limited to test scores"],"The conclusion says school performance includes more than one type of evidence.","multidimensional")
 ]
},
{
 id:"ENG008-RC2-R28",title:"A City Rebalances Shared Bicycles",genre:"current-affairs-report",
 text:`A city shared-bicycle programme found that many bikes accumulated near the railway station each morning while residential docking points became empty.

For eight weeks, the operator tested a redistribution schedule using small trucks. Staff moved bicycles from full docks to empty ones before the evening commute.

Availability improved at residential docks during the first hour after work. However, moving too many bicycles away from the station created shortages for passengers arriving on later trains.

The operator then used hourly demand data rather than one fixed redistribution target. On days with late events near the station, staff left more bicycles there.

The trial also recorded truck distance and labour time. Better availability required additional operating cost and vehicle movement.

Officials concluded that balancing a shared fleet is not simply about keeping every dock equally full. Different locations need different stock at different times.

The next phase will test small user incentives for returning bicycles to under-supplied docks. The city will compare the cost and effect of incentives with staff-driven redistribution.

The pilot showed that availability is a moving pattern. A dock that is overfull at 9 a.m. may be the place where bicycles are most needed later in the day.  The operator will also examine whether redistribution changes trip abandonment when users open the app and find no bicycle nearby.`,
 questions:[
 q("R28-Q1","RC2-F01","easy","Why were bicycles moved away from the railway station?","Residential docks were becoming empty",["The station banned bicycles","Trains carried bicycles away","Residential users paid higher fares"],"Morning travel concentrated bikes at the station and reduced availability elsewhere.","residential docking points became empty"),
 q("R28-Q2","RC2-F02","medium","Why did the operator stop using one fixed redistribution target?","Demand varied by time and special events",["Truck capacity disappeared","Every dock had identical demand","The city removed hourly data"],"A static target created later shortages because different locations needed bikes at different times.","hourly demand data"),
 q("R28-Q3","RC2-F03","medium","Which summary is most accurate?","Shared-bike redistribution improved availability but required time-sensitive balancing and extra operating cost",["Every dock should contain the same number of bikes","Redistribution eliminated shortages","Trucks reduced total demand"],"The report combines service benefits with cost and timing trade-offs.","additional operating cost"),
 q("R28-Q4","RC2-F04","hard","What is the tone of the report?","Operational and balanced",["Promotional","Hostile to shared bicycles","Alarmist"],"The report evaluates both improved availability and the costs or new shortages created by redistribution.","not simply about"),
 q("R28-Q5","RC2-F05","medium","Why does the report mention late events near the station?","They change the time pattern of bicycle demand",["Events close the railway","They reduce labour cost","They make all docks full"],"Special events show why demand cannot be predicted only from the normal commute pattern.","left more bicycles there"),
 q("R28-Q6","RC2-F06","hard","Which conclusion is justified?","Fleet balance should be judged against expected local demand rather than equal dock occupancy",["Every dock should be half full","Station docks should always be emptied","User incentives are guaranteed to work"],"The report explicitly says different places need different stock at different times.","different stock at different times"),
 q("R28-Q7","RC2-F07","medium","Which statement is supported?","Redistribution increased truck travel and labour use",["Residential availability worsened","Events reduced bicycle demand","The city ended the programme"],"The trial tracked extra operating resources required to move the fleet.","truck distance and labour time"),
 q("R28-Q8","RC2-F08","easy","In context, “incentives” most nearly means:","rewards or benefits intended to encourage a behaviour",["repairs","routes","penalties only"],"The city plans to encourage users to return bikes to places that need them.","user incentives")
 ]
},
{
 id:"ENG008-RC2-R29",title:"A Hospital Tests Two-Way Appointment Reminders",genre:"current-affairs-report",
 text:`A public hospital changed its appointment reminder system from one-way text messages to messages that allowed patients to confirm, cancel or request a call.

During a ten-week pilot, the hospital compared clinics using the new system with clinics that continued sending simple reminders.

More appointments were cancelled early enough to be offered to another patient. Missed appointments also fell slightly.

The system did not work equally well for everyone. Some patients shared a family phone, while others could not use the reply link on older devices.

The hospital therefore kept a telephone option and trained reception staff to record responses received by voice.

Another issue involved multiple appointments on the same day. Early messages were unclear about which visit a patient was cancelling. The hospital added department name and appointment time to each reminder.

Administrators concluded that reminders are more useful when they support a practical response rather than simply repeat information.

The hospital will next measure how many released appointments are actually refilled, because an early cancellation creates value only if the slot can be used. Officials also plan to compare patient preferences by age and clinic type before deciding whether the same message format should be used everywhere.  The next review will also compare how often patients choose each response channel.`,
 questions:[
 q("R29-Q1","RC2-F01","easy","What could patients do with the new reminder message?","Confirm, cancel or request a call",["Change their diagnosis","Order medicine","Choose a doctor salary"],"The pilot turned the reminder into a two-way scheduling tool.","confirm, cancel or request a call"),
 q("R29-Q2","RC2-F02","medium","Why was the department name added to reminders?","Patients with several appointments needed to know which visit the message referred to",["The hospital had no appointment times","Departments shared one building","Phone numbers changed daily"],"The added context prevented an ambiguous cancellation from affecting the wrong visit.","multiple appointments"),
 q("R29-Q3","RC2-F03","medium","Which summary is most accurate?","Two-way reminders improved scheduling but still required alternative channels and clearer context",["Text messages replaced reception staff","Every cancelled slot was refilled","Older phones worked best"],"The report combines improved early cancellation with accessibility and identification limits.","did not work equally well"),
 q("R29-Q4","RC2-F04","hard","What is the tone of the report?","Cautiously positive",["Triumphant","Dismissive of patients","Humorous"],"The hospital saw practical benefits but kept fallback channels and continued evaluation.","fell slightly"),
 q("R29-Q5","RC2-F05","medium","Why will the hospital measure whether released slots are refilled?","Cancellation is more useful if another patient can use the appointment",["To increase message length","To remove phone support","To reduce clinic hours"],"The value of early cancellation depends partly on whether the freed capacity is reused.","slot can be used"),
 q("R29-Q6","RC2-F06","hard","Which conclusion is justified?","Interactive reminders can improve scheduling only if patients can respond through accessible channels",["One message format fits everyone","Telephone support is unnecessary","Every reminder reduces missed appointments"],"The passage shows that shared phones and older devices make fallback channels important.","kept a telephone option"),
 q("R29-Q7","RC2-F07","medium","Which statement is supported?","Missed appointments fell slightly during the pilot",["All no-shows disappeared","Every patient used the reply link","One-way reminders were stopped everywhere"],"The report records a modest reduction rather than a complete solution.","Missed appointments also fell slightly"),
 q("R29-Q8","RC2-F08","easy","In context, “released” most nearly means:","made available again",["deleted permanently","confirmed","made more expensive"],"A cancelled appointment becomes available for another patient.","released appointments")
 ]
},
{
 id:"ENG008-RC2-R30",title:"A Market Tests Digital Receipts",genre:"current-affairs-report",
 text:`A municipal produce market tested digital receipts at twenty stalls that normally issued handwritten paper slips.

Customers could choose a printed receipt or receive a digital copy by scanning a QR code at the counter. The digital receipt listed item, quantity, price and stall number.

During the three-month trial, fewer customers returned with disputes about which stall had sold an item because the stall number was recorded clearly.

However, some older customers found QR scanning difficult, and poor mobile signal near one entrance slowed access to the receipt page.

The market therefore kept paper as an option and installed a local wireless connection for the digital system.

Vendors appreciated that totals were calculated automatically, but several asked whether receipt data would be used for tax or licensing checks. The market authority published a short notice explaining what data was stored and who could access it.

Officials concluded that digital receipts improved traceability but should not require customers to own a suitable phone.

The next phase will test whether receipts can also support quick price comparisons without exposing personal purchase histories. The pilot showed that digitising a record can improve clarity while creating new questions about access, connectivity and data use.  Staff will also measure whether digital receipts reduce the time needed to resolve later price or quantity disputes.`,
 questions:[
 q("R30-Q1","RC2-F01","easy","What information did the digital receipt include?","Item, quantity, price and stall number",["Customer income","Vendor home address","Market opening history"],"The receipt recorded the transaction and identified the selling stall.","stall number"),
 q("R30-Q2","RC2-F02","medium","Why did the market keep paper receipts?","Not every customer could use the QR-based digital option easily",["Digital totals were inaccurate","Vendors refused all technology","Paper receipts were legally required in the passage"],"Accessibility problems with phones and scanning made a non-digital option necessary.","older customers found QR scanning difficult"),
 q("R30-Q3","RC2-F03","medium","Which summary is most accurate?","Digital receipts improved transaction traceability but raised access and data-governance issues",["Paper receipts were completely removed","QR codes solved every dispute","Receipt data had no privacy implications"],"The report presents both clearer records and practical concerns around devices, signal and data use.","access, connectivity and data use"),
 q("R30-Q4","RC2-F04","hard","What is the tone of the report?","Balanced and practical",["Promotional","Hostile to vendors","Alarmist"],"The passage notes benefits while retaining paper and explaining data-use concerns.","improved traceability but"),
 q("R30-Q5","RC2-F05","medium","Why was a data-use notice published?","Vendors wanted to know how receipt information might be used and accessed",["Customers requested longer receipts","The market removed stall numbers","Signal strength increased"],"The notice responded to concern over storage, tax and licensing access to transaction data.","what data was stored"),
 q("R30-Q6","RC2-F06","hard","Which conclusion is justified?","Digitisation works better when an alternative exists for users who cannot access the digital channel",["All market records should be paperless","QR codes eliminate connectivity needs","Personal purchase histories should be public"],"The market kept paper because the digital channel did not suit every customer.","should not require customers to own a suitable phone"),
 q("R30-Q7","RC2-F07","medium","Which statement is supported?","Poor mobile signal affected access near one entrance",["Every stall lost connectivity","Paper disputes increased","Digital receipts omitted prices"],"The report identifies one location where network conditions slowed the digital service.","poor mobile signal"),
 q("R30-Q8","RC2-F08","easy","In context, “traceability” most nearly means:","the ability to identify and follow where a transaction came from",["faster payment","lower price","anonymous shopping"],"Recording stall numbers made it easier to link later questions to the original seller.","which stall had sold")
 ]
},
{
 id:"ENG008-RC2-R31",title:"A District Tests Flood-Warning Siren Codes",genre:"current-affairs-report",
 text:`A flood-prone district tested new siren patterns in villages near a river. Previously, the same long siren was used for severe weather, evacuation practice and real flood warnings.

Residents reported that they were often unsure whether a siren required immediate action.

The district introduced three distinct patterns: one for a test, one for “prepare to move” and one for immediate evacuation. Text alerts and village loudspeakers repeated the same instruction in words.

During the trial, recognition improved in community drills, but some residents could not remember the difference between the two urgent patterns after several months without an exercise.

Officials therefore added simple posters in public buildings and scheduled brief monthly test signals.

The district also kept verbal alerts because people with hearing difficulties or those far from a siren might not receive the sound clearly.

Emergency managers concluded that a warning system should not depend on memory of sound alone. Repetition across channels and regular practice help people understand what action is expected.

The next monsoon season will be used to measure message reach, false alarms and evacuation response time. The pilot showed that warning design is not only about making a signal louder. A signal must also carry a meaning that people can recognise quickly under stress.  Officials will also test whether visitors and seasonal workers understand the signal codes as well as long-term residents.`,
 questions:[
 q("R31-Q1","RC2-F01","easy","Why were new siren patterns introduced?","The old single pattern did not clearly distinguish different situations",["The sirens were too quiet to hear anywhere","Text alerts were banned","Villages had no emergency plans"],"Using one sound for tests and real warnings left residents uncertain about required action.","same long siren"),
 q("R31-Q2","RC2-F02","medium","Why were monthly test signals added?","Residents could forget the meaning of rarely heard patterns",["The river flooded every month","Posters were removed","Siren volume decreased"],"Regular practice helps maintain recognition of the warning codes.","could not remember"),
 q("R31-Q3","RC2-F03","medium","Which summary is most accurate?","Effective warnings require distinct meanings, repeated channels and regular practice",["Louder sirens solve every warning problem","Text messages should replace sirens","Drills create confusion"],"The report emphasises recognition and action rather than sound alone.","Repetition across channels"),
 q("R31-Q4","RC2-F04","hard","What is the tone of the report?","Practical and safety-focused",["Promotional","Humorous","Dismissive of residents"],"The passage evaluates how people interpret emergency signals and how the system can reduce confusion.","what action is expected"),
 q("R31-Q5","RC2-F05","medium","Why were verbal alerts retained?","Not everyone could reliably receive or interpret the siren sound",["The sirens had no patterns","Villages rejected posters","Verbal alerts were cheaper"],"Different channels improve reach for people with hearing or distance limitations.","hearing difficulties"),
 q("R31-Q6","RC2-F06","hard","Which conclusion is justified?","A warning code is useful only if people can connect it quickly to the required action",["More warning categories are always better","Tests should never use sirens","Sound volume is the only important factor"],"The final paragraph separates physical loudness from understandable meaning.","carry a meaning"),
 q("R31-Q7","RC2-F07","medium","Which statement is supported?","The district planned to measure false alarms and response time",["All villages used only text alerts","Residents remembered every pattern perfectly","Monthly tests replaced evacuation drills"],"The next-stage evaluation includes both signal quality and behavioural response.","false alarms and evacuation response time"),
 q("R31-Q8","RC2-F08","easy","In context, “recognition” most nearly means:","the ability to identify what a signal means",["signal volume","river height","message length"],"The drills tested whether residents could identify each siren pattern and its action.","recognition improved")
 ]
}
] as const;
