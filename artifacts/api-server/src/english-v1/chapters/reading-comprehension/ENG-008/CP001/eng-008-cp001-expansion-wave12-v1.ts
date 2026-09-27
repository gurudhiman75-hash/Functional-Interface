import type{Eng008RcPassageV1}from"./eng-008-cp001-authorities-v1";
const q=(id:string,familyId:any,difficulty:any,question:string,correctAnswer:string,distractors:readonly[string,string,string],explanation:string,evidence:string)=>({id,familyId,difficulty,question,correctAnswer,distractors,explanation,evidence});
export const ENG008_CP001_EXPANSION_WAVE12_V1:readonly Eng008RcPassageV1[]=[
{
 id:"ENG008-RC-N32",title:"The Library Seat Grace Period",genre:"narrative",
 text:`Ananya reserved a study seat in her college library for 4 p.m. The booking page said the seat would be held for fifteen minutes after the start time.

Her class ended late, and she entered the library at 4:11. A student near the desk told her that reserved seats were cancelled if the holder was not present exactly at 4 p.m.

Ananya checked the booking page again. Her reservation still showed “active until 4:15”. The librarian confirmed that the fifteen-minute grace period existed because students often needed a few minutes to walk from classrooms.

At 4:13, Ananya scanned her student card at the seat terminal and checked in successfully.

The librarian explained that the start time and the release time served different purposes. The first marked when the booking began; the second marked when an unused booking could be given to someone else.

Later, the library added the words “arrive by 4:15” beside the booking time.

Ananya learned that a scheduled start does not always mean immediate cancellation at that exact minute. When a system includes a grace period, the relevant deadline is the release time, not the first minute of the reservation.`,
 questions:[
 q("N32-Q1","RC-F01","easy","By what time did Ananya need to check in?","4:15 p.m.",["4:00 p.m.","4:30 p.m.","5:00 p.m."],"The reservation remained active for fifteen minutes after its 4 p.m. start.","active until 4:15"),
 q("N32-Q2","RC-F02","medium","Why did the library allow a grace period?","Students might need time to walk from class",["Seats were never in demand","The library opened late","Bookings had no start time"],"The librarian explains that the extra minutes account for travel from classrooms.","walk from classrooms"),
 q("N32-Q3","RC-F03","hard","What is the main lesson of the passage?","A start time and a release deadline can describe different stages of one booking",["Reserved seats should never be released","All schedules need fifteen-minute delays","Students should ignore booking pages"],"The story distinguishes when use begins from when an unused reservation expires.","different purposes"),
 q("N32-Q4","RC-F04","medium","Which title best suits the passage?","The Library Seat Grace Period",["The Closed Library","A Missing Student Card","The Empty Classroom"],"The central issue is the short period during which a late-arriving student can still claim a reserved seat.","grace period"),
 q("N32-Q5","RC-F05","easy","In context, “grace period” most nearly means:","extra allowed time before a rule is enforced",["a study break","a cancellation fee","a waiting list"],"The term describes the additional fifteen minutes before the booking is released.","held for fifteen minutes"),
 q("N32-Q6","RC-F06","medium","Which statement is supported?","Ananya checked in before the reservation was released",["She arrived after 4:15","The student near the desk was correct","The librarian cancelled her booking"],"She scanned in at 4:13, within the active window.","checked in successfully")
 ]
},
{
 id:"ENG008-RC-N33",title:"The Mixed-Up Art Portfolios",genre:"narrative",
 text:`Two students submitted art portfolios in identical black folders. Each folder had a small paper label, but one label came loose while the folders were being moved to the judging room.

The teacher noticed the problem before judging began. Instead of guessing from drawing style, she checked the submission log.

Each student had signed beside a unique barcode number when handing in the folder. The barcode stickers were still attached to the back covers.

The teacher matched the surviving barcode numbers to the log and restored the correct names. She then replaced both loose paper labels with larger printed labels.

The students were relieved because some drawings used similar materials and could easily have been mistaken for one another.

The teacher later changed the submission process so the student's name appeared both on the visible label and inside the front cover. The barcode remained as a separate tracking identifier.

The incident showed that identity should not depend on one fragile label. When two objects look similar, a second independent identifier can prevent guesswork.

It also showed why the best backup information is information recorded before a mix-up occurs. The submission log was useful because it already linked each barcode to a student before the labels became unreliable.`,
 questions:[
 q("N33-Q1","RC-F01","easy","How were the portfolios correctly identified?","By matching barcode numbers to the submission log",["By guessing from drawing style","By weighing the folders","By asking another class"],"The barcode remained attached and the log linked each barcode to a student.","matched ... barcode numbers"),
 q("N33-Q2","RC-F02","medium","Why did the teacher avoid using drawing style?","The students had used some similar materials and styles could be mistaken",["The drawings were hidden","The teacher had never seen art","The barcodes contained marks"],"Visual similarity made style a weaker identifier than the recorded barcode.","could easily have been mistaken"),
 q("N33-Q3","RC-F03","hard","What is the central idea of the passage?","Important items should have more than one reliable way to preserve identity",["Paper labels should never be used","Barcodes always contain names","Art portfolios should be different colours"],"The mix-up is solved because an independent identifier existed before the visible label failed.","second independent identifier"),
 q("N33-Q4","RC-F04","medium","Which title best suits the passage?","The Mixed-Up Art Portfolios",["The Missing Drawing","A New Art Competition","The Broken Barcode Scanner"],"The story concerns restoring correct ownership after labels become unreliable.","labels became unreliable"),
 q("N33-Q5","RC-F05","easy","In context, “tracking” most nearly means:","keeping a reliable record of identity or movement",["decorating","judging quality","pricing"],"The barcode is used to keep each submitted folder linked to the correct student.","tracking identifier"),
 q("N33-Q6","RC-F06","medium","Which statement is supported?","The submission log had been created before the label problem",["The barcodes were added after judging","The folders had different colours","The teacher discarded the log"],"The log was useful precisely because it already existed before the mix-up.","recorded before a mix-up")
 ]
},
{
 id:"ENG008-RC-N34",title:"The Temporary Parking Permit",genre:"narrative",
 text:`Ravi's apartment parking sticker had expired while the management office was waiting for a new batch of printed permits. Residents who had already paid the annual fee received a temporary paper permit for their dashboards.

The temporary permit carried Ravi's vehicle number and an expiry date one week later. His old windshield sticker still showed last year's date.

A security guard saw the old sticker and told Ravi that the vehicle might not be authorised. Ravi showed the temporary dashboard permit and the payment receipt.

The guard checked the vehicle number against the resident list and allowed him to enter.

Management later explained that the old sticker represented an expired physical credential, while the temporary permit represented current permission during the printing delay.

When the new stickers arrived, residents were asked to remove both the old sticker and temporary paper permit.

Ravi realised that visible information on an old credential can remain outdated even when a valid replacement has already been issued.

He also understood why the temporary permit included both a vehicle number and an expiry date. One connected it to the correct car; the other showed how long the temporary permission remained valid.`,
 questions:[
 q("N34-Q1","RC-F01","easy","What proved Ravi could currently park?","The temporary permit and payment record",["The expired sticker alone","A neighbour's permit","The old expiry date"],"The temporary document represented current permission while new stickers were delayed.","temporary paper permit"),
 q("N34-Q2","RC-F02","medium","Why was the old sticker misleading?","It showed an expired date even though current permission had been issued separately",["It had Ravi's wrong vehicle number","It belonged to another building","It had no date"],"The old physical credential no longer represented Ravi's current status.","expired physical credential"),
 q("N34-Q3","RC-F03","hard","What is the central idea of the passage?","Current permission can be represented by a temporary replacement even when an old visible credential remains",["Expired stickers should be reused","Temporary permits need no identifiers","Payments never affect permission"],"The story separates outdated evidence from the current temporary authorisation.","current permission"),
 q("N34-Q4","RC-F04","medium","Which title best suits the passage?","The Temporary Parking Permit",["The Missing Car","A Closed Parking Lot","The New Security Gate"],"The passage centres on a temporary document used while permanent stickers are unavailable.","temporary paper permit"),
 q("N34-Q5","RC-F05","easy","In context, “credential” most nearly means:","a document or item used to prove permission",["a payment amount","a parking space","a vehicle model"],"The old sticker and temporary permit are both forms of evidence used to show parking rights.","physical credential"),
 q("N34-Q6","RC-F06","medium","Which statement is supported?","The temporary permit had its own expiry date",["The old sticker remained valid forever","Ravi had not paid the fee","The guard refused entry"],"The temporary paper document clearly stated how long it could be used.","expiry date one week later")
 ]
},
{
 id:"ENG008-RC-N35",title:"The Delayed Parcel Status",genre:"narrative",
 text:`Mina returned an online purchase at a parcel counter. The clerk scanned the package and gave her a printed receipt showing that the return had been accepted at 10:14 a.m.

When Mina checked the shopping app twenty minutes later, the order still showed “return not received”. She worried that the counter scan had failed.

Instead of travelling back immediately, she read the receipt. It included a tracking number and a note saying app status could take several hours to update.

Mina entered the tracking number on the courier page. That page showed “accepted at counter” with the same time as the receipt.

By afternoon, the shopping app also changed to “return in transit”.

The retailer later explained that the courier system and shopping system exchanged updates in batches. The physical return could be accepted before every connected system displayed the new status.

Mina learned that delayed display does not always mean delayed action. When systems update at different speeds, an earlier transaction receipt and a matching tracking record can provide stronger evidence than a slow secondary screen.

She kept the receipt until the refund was completed.`,
 questions:[
 q("N35-Q1","RC-F01","easy","What did the courier tracking page show?","The return had been accepted at the counter",["The parcel was delivered back to Mina","The order was cancelled","The counter was closed"],"The courier page matched the receipt and confirmed the physical handover.","accepted at counter"),
 q("N35-Q2","RC-F02","medium","Why did the shopping app still show the old status?","Its system had not yet received or displayed the courier update",["The clerk never scanned the parcel","Mina used the wrong store","The tracking number was invalid"],"The retailer explained that connected systems refreshed at different times.","updates in batches"),
 q("N35-Q3","RC-F03","hard","What is the central idea of the passage?","A delayed status screen does not necessarily mean the underlying action failed",["Shopping apps should never be trusted","Receipts are always final proof of refunds","Courier pages update instantly"],"Multiple records showed the return had occurred before the shopping app caught up.","delayed display does not always mean delayed action"),
 q("N35-Q4","RC-F04","medium","Which title best suits the passage?","The Delayed Parcel Status",["The Lost Purchase","A Closed Courier Office","The Wrong Refund"],"The story centres on a return that happened before all digital systems reflected it.","status could take several hours"),
 q("N35-Q5","RC-F05","easy","In context, “in transit” most nearly means:","being transported from one place to another",["already refunded","still at home","cancelled"],"The parcel had left the acceptance stage and was moving through the return network.","return in transit"),
 q("N35-Q6","RC-F06","medium","Which statement is supported?","Mina kept the printed receipt until the refund was complete",["She returned to the counter immediately","The retailer refused the return","The app updated before the courier system"],"The receipt remained useful as evidence during the return process.","kept the receipt")
 ]
},
{
 id:"ENG008-RC-R32",title:"A Bank Tests Appointment Capacity Indicators",genre:"report",
 text:`A bank branch introduced a simple online indicator showing whether walk-in service was “normal”, “busy” or “very busy”. The aim was to help customers choose when to visit for routine work.

For six weeks, staff recorded queue length every thirty minutes and compared it with the public indicator.

The indicator was accurate most of the time, but sudden groups of customers could make a “normal” branch busy before the next update.

The bank shortened the update interval during lunch hours and added the words “current estimate” beside the status.

Customer surveys found that some people delayed non-urgent visits when the branch was marked “very busy”. Others still came immediately because they needed cash services or document verification.

Average queue length fell slightly during the busiest periods, but total daily customers changed little.

Managers concluded that a capacity indicator can spread flexible demand but cannot move customers whose task is time-sensitive.

The bank kept the system and added the next planned update time so customers would know how fresh the status was.`,
 questions:[
 q("R32-Q1","RC-F01","easy","What did the bank's indicator show?","How busy walk-in service currently was",["Interest rates","Account balances","ATM cash levels"],"The indicator used three categories to describe branch crowding.","normal, busy or very busy"),
 q("R32-Q2","RC-F02","medium","Why was the update interval shortened at lunch?","Customer numbers could change quickly during a busy period",["The bank closed after lunch","Staff stopped measuring queues","Lunch customers used only ATMs"],"More frequent updates reduced the risk that a status remained stale while demand changed.","sudden groups"),
 q("R32-Q3","RC-F03","hard","What is the main idea of the report?","Busy-status information can shift flexible visits but cannot remove unavoidable demand",["Branch indicators eliminate queues","All customers can delay visits","Daily customer volume must fall"],"The status helped some customers choose another time, while urgent users still came.","cannot move customers whose task is time-sensitive"),
 q("R32-Q4","RC-F04","medium","Which title best suits the report?","A Bank Tests Appointment Capacity Indicators",["The Closed Bank Branch","A New ATM Card","Why Customers Stop Using Banks"],"The passage evaluates a public status describing branch service demand.","online indicator"),
 q("R32-Q5","RC-F05","easy","In context, “estimate” most nearly means:","an approximate current judgement rather than a guarantee",["a bill","a receipt","a permanent rule"],"The label warned customers that busyness could change before the next refresh.","current estimate"),
 q("R32-Q6","RC-F06","medium","Which statement is supported?","Total daily customer volume changed little",["Every queue disappeared","The indicator was always exact","Customers avoided the branch completely"],"The main effect was timing, not a large change in total demand.","changed little")
 ]
},
{
 id:"ENG008-RC-R33",title:"A Workshop Tests Shared Tool Check-Out",genre:"report",
 text:`A college workshop kept drills, measuring tools and safety equipment on open shelves. Students were supposed to return each item after use, but staff often spent time searching for tools that had been left at another workbench.

The workshop introduced a simple check-out board. A student taking a shared tool placed a magnetic name tag beside the tool number and removed it when the tool was returned.

Missing-tool searches fell during the first month. However, students sometimes forgot to remove their tag after returning an item, making the board look inaccurate.

Staff added a quick end-of-session check in which one student compared the board with the shelf.

The system also showed which tools were in heavy demand. Two measuring tools were checked out almost continuously, so the workshop bought additional copies.

Managers concluded that the board was useful because it improved visibility, not because it physically prevented tools from being misplaced.

The workshop kept the system but reminded students that a status board is reliable only when users update it at both check-out and return.`,
 questions:[
 q("R33-Q1","RC-F01","easy","What did students place on the board when taking a tool?","A magnetic name tag beside the tool number",["A payment receipt","A safety certificate","A written exam answer"],"The tag showed who had taken each shared item.","magnetic name tag"),
 q("R33-Q2","RC-F02","medium","Why could the board become inaccurate?","Students sometimes returned tools without removing their tags",["Tool numbers changed daily","The shelves had no labels","Staff removed the magnets"],"The physical tool and recorded status could become inconsistent if the return step was skipped.","forgot to remove"),
 q("R33-Q3","RC-F03","hard","What is the main idea of the report?","Shared-resource tracking works only when status is updated consistently",["Open shelves should be banned","More tools eliminate every problem","A board physically prevents loss"],"The system improved visibility but depended on correct check-out and return updates.","reliable only when users update it"),
 q("R33-Q4","RC-F04","medium","Which title best suits the report?","A Workshop Tests Shared Tool Check-Out",["The Broken Drill","A New Workshop Building","Why Students Stop Measuring"],"The report evaluates a simple tracking system for shared workshop tools.","check-out board"),
 q("R33-Q5","RC-F05","easy","In context, “visibility” most nearly means:","the ability to see or understand current status",["lighting quality","tool colour","shelf height"],"The board made tool location and use easier to understand.","improved visibility"),
 q("R33-Q6","RC-F06","medium","Which statement is supported?","The workshop bought more copies of heavily used tools",["All tools were locked away","No tags were ever forgotten","Search time increased"],"Usage data revealed sustained demand for two measuring tools.","bought additional copies")
 ]
},
{
 id:"ENG008-RC-R34",title:"A School Revises Homework Calendar Exceptions",genre:"report",
 text:`A school used an online homework calendar that automatically marked assignments due at 8 p.m. Teachers could change the due time for individual classes, but the exception was shown only inside the assignment page.

Students who looked only at the calendar grid sometimes missed the changed time.

The school updated the system so an altered deadline appeared directly on the main calendar with a small “changed” label.

During a one-month trial, fewer students submitted after a revised deadline because they had relied on the default time.

Teachers also asked for a reason field, such as “sports event” or “extended lesson”, so students could understand why one class differed from the normal rule.

The school kept the standard 8 p.m. default but made exceptions more visible.

Administrators concluded that defaults save effort only when departures from them are easy to notice. A hidden exception can be more confusing than having no default at all.

The revised calendar therefore treated the normal deadline and the class-specific exception as equally important pieces of information.`,
 questions:[
 q("R34-Q1","RC-F01","easy","What was the normal homework deadline?","8 p.m.",["6 p.m.","Midnight","No fixed time"],"The calendar automatically used 8 p.m. unless a teacher changed it.","automatically marked assignments due at 8 p.m."),
 q("R34-Q2","RC-F02","medium","Why were some students late before the change?","The revised time was visible only inside the assignment page",["Teachers removed deadlines","The calendar was offline","Students had no accounts"],"The main grid continued to suggest the default time even when a class had an exception.","looked only at the calendar grid"),
 q("R34-Q3","RC-F03","hard","What is the main idea of the report?","Defaults are useful only when exceptions are clearly visible",["Every class should have a different deadline","Homework calendars should have no defaults","Reasons are more important than times"],"The system improves when departures from the standard deadline appear prominently.","departures ... easy to notice"),
 q("R34-Q4","RC-F04","medium","Which title best suits the report?","A School Revises Homework Calendar Exceptions",["The Cancelled Homework Rule","A New School Day","Why Students Stop Using Calendars"],"The passage concerns making changed class deadlines visible within a default calendar system.","changed label"),
 q("R34-Q5","RC-F05","easy","In context, “default” most nearly means:","the standard option used unless changed",["a punishment","a late submission","a special exception"],"The calendar used one normal time until a teacher deliberately set another.","normal rule"),
 q("R34-Q6","RC-F06","medium","Which statement is supported?","The school retained the standard 8 p.m. time",["Every class adopted a unique deadline","Reasons replaced due times","The main calendar was removed"],"The change improved exception visibility without eliminating the default.","kept the standard 8 p.m. default")
 ]
},
{
 id:"ENG008-RC-R35",title:"A Park Tests Trail-Condition Boards",genre:"report",
 text:`A nature park placed condition boards at three trail entrances after rain often made some paths muddy or unsafe. Rangers classified each trail as “open”, “caution” or “closed”.

The boards were updated during the morning inspection. Visitors appreciated the simple categories, but heavy afternoon rain could change conditions before the next inspection.

The park added the time of the last check and a note asking visitors to follow temporary signs placed farther along a trail.

One problem involved a long loop trail. Its first section could be dry while a low bridge near the far end remained flooded. A single entrance label did not describe every part equally well.

Rangers therefore added short notes identifying the location of known hazards.

Visitor questions at the information desk fell after the change, though staff still answered questions about footwear and alternative routes.

Managers concluded that a status category is useful only when its time and geographic scope are clear.

The boards remained simple, but the park added enough detail to prevent an “open” label from being interpreted as a guarantee that every metre of trail was dry.`,
 questions:[
 q("R35-Q1","RC-F01","easy","What categories did the trail boards use?","Open, caution and closed",["Dry, hot and cold","Easy, medium and hard","Morning, noon and night"],"Rangers used three simple condition states for visitors.","open, caution or closed"),
 q("R35-Q2","RC-F02","medium","Why was the last-check time added?","Conditions could change after the morning inspection",["The park had no clocks","Visitors wanted trail lengths","Rangers stopped inspecting"],"The timestamp helped visitors judge how current the status was.","afternoon rain could change conditions"),
 q("R35-Q3","RC-F03","hard","What is the main idea of the report?","Public status labels need clear time and location limits",["One label describes every part of a trail perfectly","Open always means dry","Trail boards should contain long technical reports"],"The park improves the boards by showing when and where the status applies.","time and geographic scope"),
 q("R35-Q4","RC-F04","medium","Which title best suits the report?","A Park Tests Trail-Condition Boards",["The New Visitor Centre","A Closed Nature Park","Why Rangers Stop Inspecting"],"The report evaluates status boards used to communicate changing trail conditions.","condition boards"),
 q("R35-Q5","RC-F05","easy","In context, “scope” most nearly means:","the range or area to which information applies",["the brightness of a sign","the trail length only","the price of entry"],"The passage asks whether a status covers an entire trail or only some sections.","geographic scope"),
 q("R35-Q6","RC-F06","medium","Which statement is supported?","The loop trail could contain both dry and flooded sections",["Every trail was closed after rain","Visitors stopped asking questions","Temporary signs were removed"],"The report uses the dry first section and flooded bridge to show mixed conditions.","first section could be dry")
 ]
}
] as const;