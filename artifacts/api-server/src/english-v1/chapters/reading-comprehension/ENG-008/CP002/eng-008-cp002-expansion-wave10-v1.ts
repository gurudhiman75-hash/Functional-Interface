import type{Eng008Cp002PassageV1}from"./eng-008-cp002-authorities-v1";
const q=(id:string,familyId:any,difficulty:any,question:string,correctAnswer:string,distractors:readonly[string,string,string],explanation:string,evidence:string)=>({id,familyId,difficulty,question,correctAnswer,distractors,explanation,evidence});
export const ENG008_CP002_EXPANSION_WAVE10_V1:readonly Eng008Cp002PassageV1[]=[
{
 id:"ENG008-RC2-E28",title:"Alerts Should Distinguish Urgent From Important",genre:"editorial",
 text:`Digital systems often treat every notification as though it deserves immediate attention. A school app may send homework reminders, fee notices, timetable changes and emergency closures through the same channel with the same sound and visual style.

When everything looks urgent, users learn to ignore alerts. This is not necessarily carelessness. It is a predictable response to a system that provides no clear way to separate time-sensitive action from information that can wait.

Good notification design should therefore classify messages by consequence and timing. A sudden campus closure requires immediate attention. A reminder that library books are due next week is important but not urgent. A promotional message may deserve no interruption at all.

The solution is not to silence communication. It is to reduce competition between messages. Urgent notices can use stronger signals, while routine information can be grouped into a daily summary.

Users should also be able to control non-critical categories without losing essential service updates. A person who turns off event promotions should not accidentally miss a security warning.

Designers need to be careful with labels. If an organisation marks too many messages “urgent” simply to increase open rates, the label loses meaning.

The broader principle is that attention is limited. A useful alert system respects that limit by matching the strength of the interruption to the consequence of delay. The goal is not maximum visibility for every message, but reliable visibility for the messages that truly require prompt action.`,
 questions:[
 q("E28-Q1","RC2-F01","easy","What problem arises when every notification looks urgent?","Users may begin ignoring alerts because priority is unclear",["Messages become shorter","Emergency notices disappear automatically","Apps stop recording delivery"],"The passage argues that undifferentiated urgency creates alert fatigue and weakens attention.","users learn to ignore alerts"),
 q("E28-Q2","RC2-F02","medium","What can be inferred about routine reminders?","They can remain useful without interrupting users immediately",["They should always be deleted","They require stronger warning sounds than emergencies","They are never important"],"The author suggests grouping routine information into summaries instead of treating it like an emergency.","grouped into a daily summary"),
 q("E28-Q3","RC2-F03","medium","Which summary is most accurate?","Notification systems should match interruption strength to urgency and let users control non-critical categories",["All notifications should be silent","Users should receive only emergency messages","Every important message is urgent"],"The passage distinguishes urgency from importance and supports selective control rather than eliminating messages.","matching the strength of the interruption"),
 q("E28-Q4","RC2-F04","hard","What is the author's tone?","Practical and cautionary",["Promotional","Mocking","Indifferent to alerts"],"The author proposes design principles while warning that overusing urgency can undermine the whole system.","label loses meaning"),
 q("E28-Q5","RC2-F05","medium","Why does the author mention promotional messages?","To show that some communications should not interrupt users at all",["To argue promotions are emergencies","To explain school fees","To compare notification sounds"],"Promotions illustrate a low-priority category that should not compete with time-sensitive notices.","may deserve no interruption"),
 q("E28-Q6","RC2-F06","hard","Which conclusion follows most logically?","An alert system becomes more trustworthy when urgent signals are reserved for genuinely time-sensitive events",["More notifications always improve communication","Users should disable every category","Urgent labels should be used to increase open rates"],"The passage says excessive urgency weakens the meaning of the label and encourages ignoring alerts.","marks too many messages “urgent”"),
 q("E28-Q7","RC2-F07","medium","Which statement is supported?","Users should be able to disable non-critical categories without losing essential updates",["Emergency messages should be optional","Routine reminders must use alarms","All notifications should share one setting"],"The passage explicitly recommends category control that preserves critical communication.","without losing essential service updates"),
 q("E28-Q8","RC2-F08","easy","In context, “prompt” most nearly means:","quick and without unnecessary delay",["optional","confusing","promotional"],"The final paragraph describes messages that require users to act quickly.","prompt action")
 ]
},
{
 id:"ENG008-RC2-E29",title:"Repair Estimates Should Show Uncertainty",genre:"editorial",
 text:`Customers often ask a repair shop for one simple answer: “When will it be ready?” A single date is easy to understand, but it can create false confidence when important parts of the job are still uncertain.

Some repair stages are predictable. A routine replacement may take a known amount of labour once the correct part is available. Other stages depend on diagnosis. Opening a device can reveal hidden damage that was not visible during intake.

For this reason, an estimate should communicate both the expected range and the source of uncertainty. “Likely ready Tuesday or Wednesday, pending part arrival” tells the customer more than a precise Tuesday-at-4-p.m. promise made before the part has shipped.

Updates matter too. An estimate is useful only if it changes when new information arrives. A shop that keeps displaying an old date after a supplier delay is not being clearer simply because the original estimate looked precise.

Customers also need to know what has been completed. Status labels such as “diagnosis finished”, “part ordered” and “final testing” help explain why the expected date has changed.

This does not excuse vague communication. “Ready sometime soon” provides too little information to support planning. The goal is calibrated precision: enough detail to be useful without implying certainty the shop does not possess.

A good estimate therefore works like a living forecast. It narrows as uncertainty is resolved. Early in the repair, a range may be appropriate. Later, once parts and testing are complete, a specific collection time may become reasonable.`,
 questions:[
 q("E29-Q1","RC2-F01","easy","Why can a single precise repair date be misleading early in a job?","Diagnosis and parts availability may still be uncertain",["Every repair takes the same time","Customers cannot understand dates","Shops never know labour time"],"The passage explains that hidden damage and external parts can change the completion schedule.","important parts of the job are still uncertain"),
 q("E29-Q2","RC2-F02","medium","What can be inferred about a repair estimate that changes after a supplier delay?","Updating it can make the information more accurate rather than less reliable",["Any changed estimate proves poor management","Supplier delays should be hidden","The original date remains best"],"The author treats estimates as forecasts that should respond to new evidence.","useful only if it changes when new information arrives"),
 q("E29-Q3","RC2-F03","medium","Which summary is most accurate?","Repair estimates should express useful ranges, causes of uncertainty and updated status",["Repair shops should avoid all dates","Exact times should always be promised","Customers need only a queue number"],"The article supports calibrated rather than false precision.","calibrated precision"),
 q("E29-Q4","RC2-F04","hard","What is the author's tone?","Explanatory and practical",["Hostile to repair businesses","Humorous","Promotional"],"The passage focuses on how estimates can communicate uncertainty honestly and usefully.","enough detail to be useful"),
 q("E29-Q5","RC2-F05","medium","Why does the author mention status labels?","They help customers understand what stage the repair has reached and why timing changed",["They replace all estimates","They show the repair price","They prevent parts from being delayed"],"Stage information provides context for the current forecast.","help explain why the expected date has changed"),
 q("E29-Q6","RC2-F06","hard","Which conclusion follows most logically?","Precision should increase as uncertainty is resolved",["Early estimates should always be exact","Vague wording is the safest approach","Repair dates should never change"],"The conclusion explicitly says ranges can narrow as parts and testing become certain.","It narrows as uncertainty is resolved"),
 q("E29-Q7","RC2-F07","medium","Which statement is supported?","A very vague promise can be as unhelpful as false precision",["All ranges are vague","Supplier dates are always exact","Customers prefer no information"],"The passage rejects both unjustified exactness and meaningless wording such as “sometime soon”.","provides too little information"),
 q("E29-Q8","RC2-F08","easy","In context, “calibrated” most nearly means:","carefully matched to the actual level of certainty",["completely fixed","intentionally delayed","financially expensive"],"Calibrated precision means giving detail that fits what is genuinely known.","without implying certainty")
 ]
},
{
 id:"ENG008-RC2-E30",title:"Free Public Wi-Fi Needs Clear Session Rules",genre:"editorial",
 text:`Free public Wi-Fi can make libraries, stations and civic buildings more accessible to people who need internet access but do not have reliable mobile data. Yet a network can be technically free while still being confusing or difficult to use.

One common problem is the session rule. A user may be disconnected after thirty minutes, required to sign in again every hour or limited to a certain amount of data. If these limits appear only in a long terms page, people may assume the connection has failed when the rule is actually working as designed.

Clear session information should therefore appear before connection and again when a limit is approaching. A message such as “10 minutes remaining; reconnect allowed immediately” is more useful than suddenly ending the session.

Privacy matters too. A public network should explain what basic information it records and whether users must provide an email address or phone number. A service should not collect more personal information than is necessary simply because access is free.

Security communication also needs balance. Public Wi-Fi cannot guarantee that every website or user is safe, but warnings should be specific enough to support sensible behaviour rather than frightening people away from the service.

The objective is not to make the login screen longer. It is to make the conditions of use visible at the moments when they affect the user.

A well-designed public network treats connectivity as a service, not merely a signal. Reliability includes knowing how long a session lasts, what happens at the limit and what information the system asks from the user.`,
 questions:[
 q("E30-Q1","RC2-F01","easy","Why can users mistake a session limit for a technical failure?","The limit may not be clearly explained before disconnection",["Public Wi-Fi never reconnects","Every network uses the same session rule","Users cannot see a signal"],"Hidden time or data limits can make a planned disconnection appear accidental.","assume the connection has failed"),
 q("E30-Q2","RC2-F02","medium","What can be inferred about a useful pre-disconnection message?","It should explain both the remaining time and what the user can do next",["It should contain the full legal terms","It should request more personal data","It should hide the reconnect rule"],"The example combines a countdown with clear next-step information.","10 minutes remaining; reconnect allowed immediately"),
 q("E30-Q3","RC2-F03","medium","Which summary is most accurate?","Public Wi-Fi should make session, privacy and security conditions clear at the point of use",["Free Wi-Fi should require no rules","Public networks should collect maximum user data","Security warnings should discourage all use"],"The passage treats usability as knowing the practical conditions of the service.","conditions of use visible"),
 q("E30-Q4","RC2-F04","hard","What is the author's tone?","Supportive but qualified",["Opposed to public internet access","Promotional","Alarmist"],"The author sees public Wi-Fi as valuable while arguing for clearer rules and privacy limits.","can make ... more accessible"),
 q("E30-Q5","RC2-F05","medium","Why does the author discuss data collection?","A free service should still justify the personal information it requests",["Email addresses improve signal strength","Public networks cannot store data","Every user must provide a phone number"],"The passage applies data minimisation even when no money is charged.","should not collect more personal information than is necessary"),
 q("E30-Q6","RC2-F06","hard","Which conclusion follows most logically?","Technical availability alone is not enough if users cannot understand the service conditions",["A strong Wi-Fi signal guarantees good service","Session limits should be removed everywhere","Login screens should contain every policy detail"],"The final paragraph defines reliability partly through clear expectations and rules.","connectivity as a service, not merely a signal"),
 q("E30-Q7","RC2-F07","medium","Which statement is supported?","Public Wi-Fi may allow immediate reconnection even after a session ends",["All public Wi-Fi sessions last thirty minutes","Every network requires email registration","Security warnings should be hidden"],"The passage uses immediate reconnection as an example of a rule that should be communicated clearly.","reconnect allowed immediately"),
 q("E30-Q8","RC2-F08","easy","In context, “necessary” most nearly means:","needed for the purpose",["commercially attractive","legally secret","technically impossible"],"The author argues that only information required for the service should be collected.","more ... than is necessary")
 ]
},
{
 id:"ENG008-RC2-E31",title:"Bundle Prices Should Still Be Comparable",genre:"editorial",
 text:`Retailers often bundle several services or products into one price. A phone plan may include data, streaming and cloud storage; a travel package may combine transport, hotel and breakfast. Bundles can be convenient, but they can also make comparison harder.

The challenge is not that bundles are inherently misleading. The problem is that buyers may be unable to tell which part creates the claimed saving.

A package advertised as “₹500 cheaper” should state what the comparison is based on. Is the saving measured against buying every component separately from the same seller, against last month's price, or against a competitor?

Unused components matter too. A customer who never uses the included streaming service may receive less practical value than the advertised bundle value suggests.

Comparison becomes even harder when promotional prices expire at different times. A low first-year package can become more expensive later if one included service renews automatically at a higher rate.

Good presentation should therefore show the total price, the duration of any introductory offer and the main components. It need not force customers to calculate every hypothetical alternative, but it should make the basis of the advertised saving understandable.

Bundles can still benefit customers and simplify purchasing. The goal is not to break every package apart. It is to prevent complexity from hiding the real transaction.

A useful bundle is one whose convenience and saving can be judged without requiring the buyer to reconstruct the price from several pages of conditions.`,
 questions:[
 q("E31-Q1","RC2-F01","easy","What should an advertised bundle saving explain?","The comparison used to calculate the saving",["The retailer's profit margin","Every competitor's price history","The customer's income"],"Without a reference point, the stated saving has no clear meaning.","state what the comparison is based on"),
 q("E31-Q2","RC2-F02","medium","What can be inferred if a customer never uses one included service?","The bundle's practical value to that customer may be lower than the advertised total value",["The entire bundle becomes free","The unused service must be refunded","The remaining services stop working"],"The passage distinguishes headline bundle value from value actually used by the buyer.","less practical value"),
 q("E31-Q3","RC2-F03","medium","Which summary is most accurate?","Bundles can be useful, but savings, components and promotional timing should remain understandable",["Bundles should be prohibited","Customers should buy every service separately","Introductory prices should never be used"],"The passage supports bundling while arguing for transparent comparison.","prevent complexity from hiding the real transaction"),
 q("E31-Q4","RC2-F04","hard","What is the author's tone?","Balanced and consumer-focused",["Hostile to retailers","Promotional","Humorous"],"The author recognises convenience while examining information problems.","can still benefit customers"),
 q("E31-Q5","RC2-F05","medium","Why does the author discuss automatic renewal?","A low introductory bundle price may not represent later cost",["Renewal always makes bundles cheaper","It removes unused services","It changes the comparison currency"],"Price timing can change the practical value of the package after the initial period.","renews automatically at a higher rate"),
 q("E31-Q6","RC2-F06","hard","Which conclusion follows most logically?","Bundle transparency requires a clear reference price and visibility into major conditions",["Every component must have the same price","The largest bundle is always best value","Unused services should be ignored"],"The article repeatedly focuses on basis of saving, components and promotional duration.","basis of the advertised saving understandable"),
 q("E31-Q7","RC2-F07","medium","Which statement is supported?","Bundles can simplify purchasing even when they complicate price comparison",["Bundles are inherently misleading","Separate purchase is always cheaper","Promotional prices never expire"],"The passage explicitly acknowledges convenience as a genuine benefit.","simplify purchasing"),
 q("E31-Q8","RC2-F08","easy","In context, “reconstruct” most nearly means:","work out again from separate pieces of information",["cancel permanently","pay in advance","hide from view"],"The conclusion says customers should not have to rebuild the real price from scattered conditions.","reconstruct the price")
 ]
},
{
 id:"ENG008-RC2-R24",title:"A City Tests Parking-Occupancy Sensors",genre:"current-affairs-report",
 text:`A city installed parking-occupancy sensors on two busy commercial streets to test whether drivers could be shown where spaces were likely to be available.

The sensors detected whether a marked bay was occupied and sent updates to roadside signs and a mobile map. During the three-month pilot, drivers using the system reported spending less time circling the blocks.

The data was not perfect. Delivery vehicles sometimes stopped partly across two bays, causing one sensor to show an incorrect free space. Construction barriers also made some spaces unavailable even though the sensor beneath them still worked.

The city therefore added a maintenance flag so staff could temporarily remove blocked bays from the public display.

Officials also warned that the system did not create more parking. On the busiest evenings, almost every bay remained occupied, so better information could not eliminate the shortage.

The pilot was most useful during periods when spaces were turning over regularly. Drivers could choose between nearby streets instead of searching each one in sequence.

The city will next compare sensor accuracy, maintenance cost and changes in cruising time before expanding the system.

Planners said the trial showed a difference between information efficiency and physical capacity. A map can help drivers find existing vacancies faster, but it cannot substitute for decisions about how much parking space the area should provide.`,
 questions:[
 q("R24-Q1","RC2-F01","easy","What did the parking sensors detect?","Whether a marked parking bay was occupied",["Driver identity","Vehicle fuel level","Shop opening hours"],"The sensors reported occupancy of individual marked spaces.","whether a marked bay was occupied"),
 q("R24-Q2","RC2-F02","medium","What can be inferred about very busy evenings?","Information is less useful when almost no spaces are available",["Sensors automatically create spaces","Drivers stop using the area","Parking becomes free"],"When occupancy is nearly complete, knowing where spaces are does not solve the underlying shortage.","almost every bay remained occupied"),
 q("R24-Q3","RC2-F03","medium","Which summary is most accurate?","Occupancy information reduced search time but depended on accurate bay status and did not increase capacity",["Sensors eliminated parking shortages","Construction improved sensor accuracy","Drivers no longer needed signs"],"The trial improved search efficiency while revealing data and capacity limits.","information efficiency and physical capacity"),
 q("R24-Q4","RC2-F04","hard","What is the tone of the report?","Measured and practical",["Promotional","Hostile to drivers","Alarmist"],"The report presents benefits alongside data errors and capacity limits.","data was not perfect"),
 q("R24-Q5","RC2-F05","medium","Why did the city add a maintenance flag?","Blocked or unavailable bays could be removed from the public display",["To charge higher parking fees","To identify delivery companies","To extend parking hours"],"The flag prevented technically functioning sensors from showing unusable spaces as available.","temporarily remove blocked bays"),
 q("R24-Q6","RC2-F06","hard","Which conclusion is justified?","Real-time parking data can improve how existing capacity is used without solving a shortage of spaces",["More accurate data always increases capacity","Sensors should replace parking policy","Every empty bay can be detected perfectly"],"The final paragraph explicitly separates finding vacancies from deciding how much parking exists.","cannot substitute for decisions about how much parking"),
 q("R24-Q7","RC2-F07","medium","Which statement is supported?","Delivery vehicles sometimes caused incorrect occupancy readings",["Sensors worked only at night","Construction removed every bay","The city tested only one street"],"Vehicles positioned across bays created misleading sensor states.","stopped partly across two bays"),
 q("R24-Q8","RC2-F08","easy","In context, “cruising” most nearly means:","driving around while searching for parking",["travelling at high speed","using public transport","delivering goods"],"The city measures time spent circling streets looking for a space.","cruising time")
 ]
},
{
 id:"ENG008-RC2-R25",title:"A Library Revises Study-Room No-Show Rules",genre:"current-affairs-report",
 text:`A university library changed its study-room booking rules after staff found that some rooms remained empty even though the reservation system showed them as occupied.

For a six-week trial, students had to check in through the library app within ten minutes of the booking start. If no one checked in, the room was released to waiting students.

Unused reserved time fell, especially during evening peak hours. However, the first version of the rule created problems for students whose previous classes ended in another building.

The library added a “running late” option that extended the check-in window by ten minutes when a student sent notice before the reservation began.

Staff also monitored repeated no-shows. Rather than banning students after one missed booking, the library sent reminders and applied a temporary booking limit only after several unexplained absences.

The trial showed that automatic release could improve room availability, but a rigid rule could also cancel genuine bookings for small delays.

The library kept the revised system and published a simple status display showing “reserved”, “checked in”, “delayed with notice” or “released”.

Administrators said the goal was to make scarce rooms easier to share, not to punish occasional mistakes. Future evaluation will compare wait lists, no-show rates and student complaints during examination periods.`,
 questions:[
 q("R25-Q1","RC2-F01","easy","What happened if a student did not check in within the normal window?","The room was released to waiting students",["The booking extended automatically","The library closed the room","A fee was charged immediately"],"The no-show rule made unused rooms available again.","room was released"),
 q("R25-Q2","RC2-F02","medium","Why was a “running late” option added?","Some students had genuine short delays between buildings",["Students wanted longer study sessions","The app could not record check-ins","Rooms were too small"],"The exception prevented the automatic rule from treating every short delay as a true no-show.","previous classes ended in another building"),
 q("R25-Q3","RC2-F03","medium","Which summary is most accurate?","The library combined automatic release with a limited exception for genuine delay",["Every missed booking led to a ban","Rooms were no longer reservable","Check-in was removed"],"The system balances better utilisation with flexibility.","rigid rule could also cancel genuine bookings"),
 q("R25-Q4","RC2-F04","hard","What is the tone of the report?","Balanced and operational",["Punitive","Promotional","Humorous"],"The report focuses on availability while avoiding unnecessarily harsh penalties.","not to punish occasional mistakes"),
 q("R25-Q5","RC2-F05","medium","Why were repeated no-shows treated differently from one missed booking?","The library wanted sanctions to reflect a pattern rather than a single mistake",["One missed booking improves availability","Every absence has the same cause","Students requested permanent bans"],"The policy escalates only after several unexplained absences.","only after several unexplained absences"),
 q("R25-Q6","RC2-F06","hard","Which conclusion is justified?","Rules for scarce shared resources work better when they distinguish no-shows from small reported delays",["All bookings should be cancelled after ten minutes","Waiting lists are unnecessary","Status information has no value"],"The trial improved availability while preserving reasonable exceptions.","genuine bookings for small delays"),
 q("R25-Q7","RC2-F07","medium","Which statement is supported?","Unused reserved time fell during the trial",["Evening demand disappeared","Every room stayed occupied","Students stopped using the app"],"The report directly notes a reduction in empty reserved rooms.","Unused reserved time fell"),
 q("R25-Q8","RC2-F08","easy","In context, “scarce” most nearly means:","available in limited quantity",["free of charge","easy to replace","rarely requested"],"The study rooms are limited relative to demand.","scarce rooms")
 ]
},
{
 id:"ENG008-RC2-R26",title:"A Wholesale Market Tests Cold-Storage Slots",genre:"current-affairs-report",
 text:`A wholesale fruit market introduced booked cold-storage slots for small traders after complaints that the loading area became congested during the early morning rush.

Previously, traders arrived without appointments and waited until a chamber had space. Under the pilot, each trader selected a thirty-minute unloading window through a simple booking desk or phone line.

Queue length fell during the busiest hour, but the system created a new issue when trucks arrived late because of highway traffic. A strict missed-slot rule would have forced delayed traders to wait several hours.

Managers therefore created a standby list. If a booked truck was late, another waiting trader could use the open window, while the delayed truck was placed into the next suitable gap.

The market also learned that equal time slots were not ideal for every load. Small vans often finished early, while larger trucks needed more time.

The second month of the pilot used two slot sizes based on declared load category. Staff checked whether the declared category roughly matched the arriving vehicle.

Officials concluded that booking reduced congestion, but scheduling had to reflect both unpredictable arrival delays and different unloading times.

The market will next compare spoilage, labour overtime and average waiting time. Managers said the goal was not merely to create a tidy timetable but to move perishable goods through storage with less delay and fewer empty periods.`,
 questions:[
 q("R26-Q1","RC2-F01","easy","Why were booked cold-storage slots introduced?","To reduce congestion and waiting during the morning rush",["To increase fruit prices","To close storage chambers","To prevent traders using trucks"],"The system was designed to spread unloading demand more predictably.","loading area became congested"),
 q("R26-Q2","RC2-F02","medium","What can be inferred about the standby list?","It helps use a slot even when the original booked truck is late",["It eliminates highway delays","It guarantees every truck the same time","It removes the need for bookings"],"Another trader can fill a temporary gap instead of leaving capacity idle.","another waiting trader could use the open window"),
 q("R26-Q3","RC2-F03","medium","Which summary is most accurate?","Booking improved flow but needed flexibility for late arrivals and different load sizes",["Every truck should receive one identical slot","Late trucks should be rejected permanently","Cold storage no longer needs staff"],"The pilot evolves from fixed slots to standby handling and two slot sizes.","reflect both unpredictable arrival delays and different unloading times"),
 q("R26-Q4","RC2-F04","hard","What is the tone of the report?","Practical and evidence-based",["Celebratory","Hostile to traders","Alarmist"],"The report describes an iterative scheduling trial with measured trade-offs.","second month of the pilot"),
 q("R26-Q5","RC2-F05","medium","Why were two slot sizes introduced?","Different vehicle loads required different unloading times",["Phone bookings were unavailable","Storage temperature changed","All traders requested longer waits"],"Small vans and large trucks did not use time equally.","Small vans often finished early"),
 q("R26-Q6","RC2-F06","hard","Which conclusion is justified?","A booking system should be designed around actual service time and uncertainty, not just equal calendar blocks",["Equal slots are always fairest","Standby lists increase spoilage","Highway traffic can be scheduled exactly"],"The trial shows why identical slots and rigid timing were insufficient.","not merely to create a tidy timetable"),
 q("R26-Q7","RC2-F07","medium","Which statement is supported?","Delayed trucks were moved to the next suitable opening rather than automatically rejected",["All late trucks lost access for the day","Large trucks used shorter slots","Queue length increased"],"The standby process preserved access while filling the missed window.","placed into the next suitable gap"),
 q("R26-Q8","RC2-F08","easy","In context, “perishable” most nearly means:","likely to spoil if not handled in time",["very expensive","packed in metal","sold only wholesale"],"Fruit requires timely storage because its quality can deteriorate.","perishable goods")
 ]
},
{
 id:"ENG008-RC2-R27",title:"A Clinic Tests Translation Kiosks",genre:"current-affairs-report",
 text:`A community clinic installed two translation kiosks at reception to help patients who were not comfortable completing registration forms in the clinic's main language.

The kiosks offered six language options and read questions aloud as well as displaying them on screen. During the eight-week pilot, fewer forms were returned with blank address or medication fields.

Reception staff also reported spending less time repeating routine registration questions. However, the kiosks did not remove the need for human interpreters during complex medical conversations.

One problem involved translated names of medicines. Patients sometimes recognised a brand name but not the generic term shown by the software. The clinic added a prompt asking patients to bring or photograph medicine packaging when possible.

Another issue was privacy. Because the kiosk spoke aloud, staff moved one unit farther from the main queue and added headphones.

The clinic concluded that translation technology was useful for structured administrative tasks but should not be treated as a substitute for clinical interpretation.

The next phase will compare completion accuracy, waiting time and patient comfort across languages. Staff will also review whether translated wording is understood as intended rather than assuming that a technically correct translation is automatically clear.

The pilot showed that language access involves both translation and context. A system can convert words accurately while still requiring human help when meaning depends on medical history, uncertainty or sensitive discussion.`,
 questions:[
 q("R27-Q1","RC2-F01","easy","What was one result of the translation-kiosk pilot?","Fewer registration forms had important blank fields",["Human interpreters were removed","Medication questions were deleted","Every patient used the kiosk"],"Structured assistance improved completion of routine registration information.","fewer forms were returned with blank"),
 q("R27-Q2","RC2-F02","medium","What can be inferred from the medicine-name problem?","Accurate translation may still fail if patients recognise a different naming convention",["Generic names are always wrong","Brand names should replace medical records","Medication questions are unnecessary"],"Patients sometimes knew a medicine by brand but not by the translated generic term.","recognised a brand name but not the generic term"),
 q("R27-Q3","RC2-F03","medium","Which summary is most accurate?","Translation kiosks helped routine registration but did not replace human interpretation for complex care",["Kiosks solved every language problem","Clinical conversations should use only software","Reception staff became unnecessary"],"The trial separates structured administrative translation from nuanced medical communication.","not be treated as a substitute for clinical interpretation"),
 q("R27-Q4","RC2-F04","hard","What is the tone of the report?","Cautiously positive",["Dismissive of technology","Promotional","Humorous"],"The report describes clear benefits while preserving limits involving privacy and clinical nuance.","useful ... but"),
 q("R27-Q5","RC2-F05","medium","Why were headphones added?","To improve privacy for spoken translations",["To make forms longer","To replace interpreters","To increase screen brightness"],"The kiosk's audio could be heard by people in the queue, creating a confidentiality concern.","Because the kiosk spoke aloud"),
 q("R27-Q6","RC2-F06","hard","Which conclusion is justified?","Language-access tools should be evaluated for understanding and context, not translation accuracy alone",["A correct translation is always sufficient","Human interpretation is never needed","All patients should use the same language"],"The final paragraphs stress that meaning can depend on history and sensitive context.","both translation and context"),
 q("R27-Q7","RC2-F07","medium","Which statement is supported?","The kiosks could read questions aloud",["They supported every language spoken locally","They diagnosed medication problems","They were placed only inside examination rooms"],"Audio presentation was part of the accessibility design.","read questions aloud"),
 q("R27-Q8","RC2-F08","easy","In context, “structured” most nearly means:","organised into predictable standard questions or steps",["medically urgent","completely private","spoken without order"],"Registration forms follow a fixed process, unlike open-ended clinical discussion.","structured administrative tasks")
 ]
}
] as const;
