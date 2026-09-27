import type{Eng008RcPassageV1}from"./eng-008-cp001-authorities-v1";
const q=(id:string,familyId:any,difficulty:any,question:string,correctAnswer:string,distractors:readonly[string,string,string],explanation:string,evidence:string)=>({id,familyId,difficulty,question,correctAnswer,distractors,explanation,evidence});
export const ENG008_CP001_EXPANSION_WAVE11_V1:readonly Eng008RcPassageV1[]=[
{
 id:"ENG008-RC-N28",title:"The Museum Entry Window",genre:"narrative",
 text:`Dev booked a museum ticket for Sunday afternoon. The email showed an entry window from 2:00 to 2:30 p.m. and a separate note saying visitors could remain inside until closing.

When Dev reached the museum at 2:20, a volunteer near the queue told him that his ticket would expire at 2:30. Dev briefly thought this meant he would have to leave the building after ten minutes.

He checked the ticket again and noticed that the 2:30 time appeared beside the words “entry window”, not “visit end”. The museum's help desk confirmed that the time controlled when a visitor could enter, not how long the visitor could stay after admission.

Dev entered before 2:30 and spent more than an hour inside. On his way out, he saw another visitor making the same mistake.

The museum later changed the ticket wording to “Enter between 2:00 and 2:30; stay until closing” so the two ideas would not be confused.

Dev realised that the same clock time can have different meanings depending on the label attached to it. Reading the rule carefully was more useful than treating the nearest visible time as a deadline for every part of the visit.`,
 questions:[
 q("N28-Q1","RC-F01","easy","What did the 2:30 p.m. time actually represent?","The latest time Dev could enter",["The time the museum closed","The time Dev had to leave","The start of the guided tour"],"The ticket labelled 2:30 as the end of the entry window, not the end of the visit.","entry window"),
 q("N28-Q2","RC-F02","medium","Why did Dev initially misunderstand the ticket?","He treated the entry deadline as if it were the visit end time",["He booked the wrong museum","The help desk changed the date","The ticket had no time printed"],"The volunteer's wording caused Dev to apply one time limit to the wrong stage of the visit.","not “visit end”"),
 q("N28-Q3","RC-F03","hard","What is the central idea of the passage?","A time limit should be interpreted according to the stage or action it controls",["Museum tickets should have no time limits","Visitors should ignore volunteers","Closing times are unimportant"],"The story distinguishes a deadline for entering from the separate duration of the visit.","same clock time can have different meanings"),
 q("N28-Q4","RC-F04","medium","Which title best suits the passage?","The Museum Entry Window",["The Closed Gallery","A Lost Ticket","The Long Queue"],"The misunderstanding centres on the meaning of a timed museum entry window.","entry window"),
 q("N28-Q5","RC-F05","easy","In context, “admission” most nearly means:","permission to enter",["a ticket refund","a closing announcement","a guided explanation"],"The sentence describes what happens after Dev is allowed into the museum.","after admission"),
 q("N28-Q6","RC-F06","medium","Which statement is supported?","Dev stayed inside for more than an hour",["Dev arrived after 2:30","The museum closed at 2:30","The volunteer cancelled Dev's ticket"],"After entering within the allowed window, Dev remained inside for over an hour.","spent more than an hour inside")
 ]
},
{
 id:"ENG008-RC-N29",title:"The Two Sample Labels",genre:"narrative",
 text:`During a school science practical, Rhea and Simran prepared two soil samples. One came from the playground and the other from a garden bed. They placed each sample in a clear container and wrote labels before beginning the moisture test.

Halfway through the activity, Rhea noticed that both containers were marked “Garden”. The soil itself looked similar, so appearance could not tell them which sample had been mislabelled.

The students checked their worksheet. Simran had recorded the weight of each empty container before collecting soil. One container weighed three grams more than the other, and that difference matched the original notes.

Using the recorded container weights, they identified which sample had come from the playground and corrected the label before continuing.

Their teacher praised them for using an independent record rather than guessing from colour or texture.

The mistake also led the class to change its routine. Students would now write the location on both the container and the worksheet immediately after collecting each sample.

Rhea understood that a label is useful only if it remains connected to the correct object. When a label becomes doubtful, another recorded feature can help restore the link.`,
 questions:[
 q("N29-Q1","RC-F01","easy","What problem did Rhea notice?","Both soil containers had been labelled “Garden”",["Both samples were missing","The scales had stopped working","The worksheet had no weights"],"The duplicate label made it unclear which sample came from the playground.","both containers were marked"),
 q("N29-Q2","RC-F02","medium","How did the students identify the correct sample?","They matched the containers to previously recorded empty weights",["They guessed from soil colour","They asked another class","They repeated the collection immediately"],"The recorded weight difference provided an independent identifier for the containers.","recorded the weight"),
 q("N29-Q3","RC-F03","hard","What is the main lesson of the passage?","Independent records can resolve an identification problem when labels become unreliable",["Labels should never be used","Soil samples always look identical","Weight is the only useful identifier"],"The class uses a second record to reconnect each sample with its correct origin.","another recorded feature"),
 q("N29-Q4","RC-F04","medium","Which title best suits the passage?","The Two Sample Labels",["The Broken Scale","The Empty Garden","A New Science Room"],"The narrative centres on duplicate sample labels and how the mix-up is corrected.","both containers were marked"),
 q("N29-Q5","RC-F05","easy","In context, “independent” most nearly means:","separate from the doubtful label",["expensive","unrecorded","temporary"],"The container weight was a separate source of evidence that did not depend on the incorrect label.","independent record"),
 q("N29-Q6","RC-F06","medium","Which statement is supported?","The class changed its labelling routine after the mistake",["The experiment was cancelled","The soil was thrown away","The teacher removed worksheets"],"Students were told to record the location on both the container and worksheet immediately.","change its routine")
 ]
},
{
 id:"ENG008-RC-N30",title:"The Hostel Room Swap",genre:"narrative",
 text:`Nikhil was assigned Room 203 in a college hostel. On move-in day, the warden told him that a plumbing problem had made the room temporarily unusable and asked him to stay in Room 117 for two nights.

The paper slip given to Nikhil showed “117 — temporary”. His online hostel account, however, still displayed Room 203 because the permanent assignment had not changed.

On the second evening, a friend saw the online account and assumed Nikhil had moved back. Nikhil checked with the warden before shifting his luggage.

The repair had taken longer than expected, so the temporary arrangement would continue for one more night. The warden added a dated note to the hostel portal explaining the extension.

The next afternoon, Room 203 was cleared for use and Nikhil moved there.

He noticed that the two records had described different things: the portal showed his permanent allocation, while the paper slip showed where he should actually sleep during the repair.

Neither record was meaningless, but each answered a different question. Nikhil learned that a temporary operating arrangement can exist alongside an unchanged permanent assignment, and confusion arises when the two are treated as the same kind of information.`,
 questions:[
 q("N30-Q1","RC-F01","easy","Where did Nikhil stay during the temporary arrangement?","Room 117",["Room 203","Room 107","Room 217"],"The warden moved Nikhil to Room 117 while plumbing work made Room 203 unusable.","stay in Room 117"),
 q("N30-Q2","RC-F02","medium","Why did the online account still show Room 203?","It recorded Nikhil's permanent assignment rather than the temporary sleeping arrangement",["The portal was broken","Room 117 did not exist","Nikhil had not registered"],"The permanent allocation remained unchanged while the short-term arrangement differed.","permanent assignment had not changed"),
 q("N30-Q3","RC-F03","hard","What is the central idea of the passage?","Permanent records and temporary operating instructions can both be correct while describing different states",["Online records are unreliable","Temporary rooms should become permanent","Paper slips are always more accurate"],"The story resolves the apparent conflict by showing that the two records answer different questions.","different things"),
 q("N30-Q4","RC-F04","medium","Which title best suits the passage?","The Hostel Room Swap",["The Missing Luggage","The Closed College","A New Warden"],"The passage is about a short-term room change during repairs.","temporarily unusable"),
 q("N30-Q5","RC-F05","easy","In context, “allocation” most nearly means:","official assignment",["repair cost","temporary note","room cleaning"],"The portal recorded which room had officially been assigned to Nikhil.","permanent allocation"),
 q("N30-Q6","RC-F06","medium","Which statement is supported?","The temporary stay was extended by one night",["Nikhil never moved to Room 203","The plumbing repair finished early","Room 117 became his permanent room"],"The repair took longer and the warden extended the temporary arrangement.","continue for one more night")
 ]
},
{
 id:"ENG008-RC-N31",title:"The Reprinted Concert Pass",genre:"narrative",
 text:`Sara bought a pass for a college concert and saved the QR code on her phone. On the day of the event, her phone screen cracked and became difficult to use, so she visited the ticket desk and asked for a paper copy.

The desk printed a new pass with the same booking number but a different QR code. The staff member explained that generating the new code automatically cancelled the old one.

Sara's friend had already received a screenshot of the original mobile code and offered to keep it as a backup. Sara realised that using the old image would fail because the system now recognised only the reissued code.

At the entrance, the paper pass scanned successfully. The booking number matched her purchase, but the live code was the newer one.

After the concert, Sara noticed how two documents could refer to the same booking while only one remained active for entry.

The ticket desk later added the words “Previous QR code cancelled” to reprint receipts.

Sara learned that an identifier can be replaced without changing the underlying reservation. The booking stayed the same, but the credential used to prove entry was updated. Keeping the old credential as a backup would not help once the system had invalidated it.`,
 questions:[
 q("N31-Q1","RC-F01","easy","Which QR code worked at the entrance?","The newly printed QR code",["The original screenshot","Both codes","Neither code"],"The reprint process cancelled the old code and activated the new one.","paper pass scanned successfully"),
 q("N31-Q2","RC-F02","medium","Why would the original screenshot fail?","The old QR code had been invalidated when the replacement was issued",["The booking number changed","The concert was cancelled","Sara's friend deleted the image"],"Reissuing the credential replaced the active entry code even though the reservation stayed the same.","cancelled the old one"),
 q("N31-Q3","RC-F03","hard","What is the central idea of the passage?","A reservation can remain unchanged even when the credential used to access it is replaced",["All printed passes are safer","Booking numbers should change after reprinting","Screenshots always fail"],"The story separates the underlying booking from the active QR credential.","booking stayed the same"),
 q("N31-Q4","RC-F04","medium","Which title best suits the passage?","The Reprinted Concert Pass",["The Broken Stage","A Missing Booking","The Cancelled Concert"],"The narrative concerns a replacement pass generated after Sara's phone became unusable.","asked for a paper copy"),
 q("N31-Q5","RC-F05","easy","In context, “credential” most nearly means:","something used to prove permission or access",["the concert schedule","a booking refund","a phone repair"],"The QR code functions as the item that proves Sara may enter.","credential used to prove entry"),
 q("N31-Q6","RC-F06","medium","Which statement is supported?","The new pass kept the same booking number",["Sara bought a second ticket","The desk changed her seat","The original code remained active"],"The replacement pass referred to the same purchase even though its QR code changed.","same booking number")
 ]
},
{
 id:"ENG008-RC-R28",title:"A School Tests Staggered Bus Boarding",genre:"report",
 text:`A school tested staggered boarding zones for afternoon buses after students crowded around the main gate at dismissal.

For four weeks, buses were assigned to three coloured waiting areas. Students checked a board for their bus number and waited in the matching zone until a teacher called the route.

Crowding near the gate fell, and buses left in a more regular order. However, younger students sometimes went to the wrong colour when route assignments changed for a replacement bus.

The school added route numbers beside the colours and asked teachers to announce both pieces of information.

Staff also measured departure times. Average departure improved slightly, but the biggest benefit was that the walkway remained clearer for students leaving on foot.

The system required extra signs and two teachers during the first ten minutes of dismissal. On days with fewer buses, staff found that all three zones were unnecessary.

The school therefore kept the coloured system but allowed zones to be combined on quieter days.

Managers concluded that staggered boarding worked best as a flexible crowd-management method rather than a rigid three-zone rule. The goal was not to make every afternoon look identical but to separate competing flows of students when demand was high.`,
 questions:[
 q("R28-Q1","RC-F01","easy","Why did the school introduce coloured boarding zones?","To reduce crowding around the main gate",["To change bus fares","To shorten school hours","To replace route numbers"],"The trial separated bus queues so the gate area would be less congested.","crowded around the main gate"),
 q("R28-Q2","RC-F02","medium","Why were route numbers added beside colours?","Students could make mistakes when replacement buses changed assignments",["Colours were too expensive","Teachers could not see the gate","Buses had no route numbers"],"Using both route number and colour reduced confusion when a bus assignment changed.","replacement bus"),
 q("R28-Q3","RC-F03","hard","What is the main idea of the report?","Flexible separation of boarding flows reduced congestion better than one rigid layout",["Every dismissal needs three zones","Bus departure time was the only goal","Colours should replace route information"],"The system helped most when crowding was high and could be simplified on quieter days.","flexible crowd-management method"),
 q("R28-Q4","RC-F04","medium","Which title best suits the report?","A School Tests Staggered Bus Boarding",["The New School Gate","A Cancelled Bus Route","Why Students Walk Home"],"The report evaluates a new way of organising students before bus departure.","staggered boarding zones"),
 q("R28-Q5","RC-F05","easy","In context, “staggered” most nearly means:","separated into different groups or times",["cancelled","unplanned","identical"],"The school spread students across different waiting zones rather than one crowd.","staggered boarding"),
 q("R28-Q6","RC-F06","medium","Which statement is supported?","The walkway became clearer for students leaving on foot",["All buses left earlier every day","The school removed teachers from dismissal","Three zones were always required"],"Staff identified a clearer pedestrian path as a major benefit of the trial.","walkway remained clearer")
 ]
},
{
 id:"ENG008-RC-R29",title:"A Clinic Revises Token Display",genre:"report",
 text:`A neighbourhood clinic used numbered tokens to organise walk-in patients. The reception desk called each number aloud, but people sitting in the rear waiting area sometimes missed the announcement.

The clinic installed a small display showing the current token and the next two expected numbers. During a six-week trial, fewer patients asked reception whether their turn had passed.

The first version created confusion when an emergency case was taken ahead of the normal queue. The display moved forward, and some patients thought their number had been skipped permanently.

Staff added a short message saying “Emergency priority in progress — regular queue will resume” whenever triage changed the order.

The clinic also avoided displaying an exact waiting time because consultation length varied widely.

Patient surveys found that the token display reduced uncertainty, but some older visitors still preferred spoken announcements.

The clinic therefore kept both channels.

Managers concluded that a queue display should explain exceptional changes rather than showing only a number. The screen was useful not because it made doctors work faster, but because it made the current state of the queue easier to understand.`,
 questions:[
 q("R29-Q1","RC-F01","easy","What did the clinic display show?","The current token and the next two expected numbers",["Patient diagnoses","Doctor salaries","Medicine prices"],"The screen provided queue-position information to people in the waiting area.","current token"),
 q("R29-Q2","RC-F02","medium","Why was an emergency message added?","Priority cases could change the apparent queue order",["The display stopped working","Patients wanted exact waiting times","The clinic removed triage"],"Without context, a jump in token numbers looked like a skipped turn.","Emergency priority"),
 q("R29-Q3","RC-F03","hard","What is the main idea of the report?","Queue information is more useful when it explains exceptions as well as normal order",["Displays should replace triage","Every patient should receive an exact time","Spoken announcements are unnecessary"],"The clinic improved clarity by showing what a queue change meant rather than only the current number.","explain exceptional changes"),
 q("R29-Q4","RC-F04","medium","Which title best suits the report?","A Clinic Revises Token Display",["The New Pharmacy","A Closed Waiting Room","Why Doctors Stop Using Tokens"],"The report concerns changes to a patient token-information system.","installed a small display"),
 q("R29-Q5","RC-F05","easy","In context, “triage” most nearly means:","prioritising patients according to medical urgency",["booking future appointments","dispensing medicines","registering addresses"],"Emergency cases could be treated ahead of the normal queue because of clinical priority.","emergency case"),
 q("R29-Q6","RC-F06","medium","Which statement is supported?","The clinic kept spoken announcements as well as the screen",["The display made consultations shorter","Older visitors preferred only the screen","Exact wait times were shown"],"The clinic retained both channels because different patients preferred different formats.","kept both channels")
 ]
},
{
 id:"ENG008-RC-R30",title:"A Sports Centre Tests Equipment Reservations",genre:"report",
 text:`A sports centre introduced short reservation slots for its rowing machines during evening peak hours. Previously, members waited nearby and tried to judge when a machine would become free.

The trial allowed members to reserve a twenty-minute start window through the front desk. A reservation was released if the member had not arrived within five minutes of the start.

Waiting became more predictable, but some members booked several future slots “just in case” and used only one.

The centre added a rule limiting each person to one active future reservation at a time. It also displayed recently released slots on a board near the gym entrance.

Machine use became more evenly distributed across the busiest hour, although total demand did not fall.

Staff noted that the booking rule mattered less after 8 p.m., when machines were usually available.

The centre therefore restricted reservations to peak periods rather than using them all day.

Managers concluded that booking can improve access to a scarce resource when demand is concentrated, but unnecessary reservation rules can add friction when capacity is already sufficient.`,
 questions:[
 q("R30-Q1","RC-F01","easy","What happened if a member was more than five minutes late?","The reservation was released",["The gym closed","The machine was removed","The slot doubled in length"],"The centre freed unused reservations shortly after the scheduled start.","released if"),
 q("R30-Q2","RC-F02","medium","Why was a one-reservation limit introduced?","Some members booked several future slots but used only one",["Machines became unsafe","The front desk lost the schedule","Members requested longer sessions"],"The limit reduced speculative booking that blocked access for others.","just in case"),
 q("R30-Q3","RC-F03","hard","What is the main idea of the report?","Reservation rules are most useful when demand exceeds immediate capacity and should be limited when unnecessary",["Every machine should always require booking","Reservations reduce total demand","Peak periods should be removed"],"The centre keeps booking only during busy periods because it adds little value when machines are freely available.","restricted reservations to peak periods"),
 q("R30-Q4","RC-F04","medium","Which title best suits the report?","A Sports Centre Tests Equipment Reservations",["The Closed Gym","A New Rowing Team","Why Members Stop Exercising"],"The report evaluates timed access to shared rowing machines.","reservation slots"),
 q("R30-Q5","RC-F05","easy","In context, “scarce” most nearly means:","limited compared with demand",["damaged","expensive","unused"],"The equipment is described as scarce during busy periods when many people want it.","scarce resource"),
 q("R30-Q6","RC-F06","medium","Which statement is supported?","Reservations were eventually limited to peak hours",["The centre removed all rowing machines","Demand disappeared after 8 p.m.","Members could hold unlimited future slots"],"The booking system was retained only when demand was concentrated.","restricted reservations to peak periods")
 ]
},
{
 id:"ENG008-RC-R31",title:"A Town Tests Water-Tank Level Notices",genre:"report",
 text:`A small town supplied several hillside neighbourhoods from a storage tank that refilled overnight. During a dry spell, residents often called the water office to ask whether low pressure meant a local pipe problem or a low tank level.

The town began posting a simple morning status: “normal”, “low but stable” or “restricted”. The notice also showed the expected next update time.

Calls to the office declined, especially on mornings when the tank was low but service was still available.

A problem appeared when a repair crew temporarily closed one street valve. The town-wide status remained “normal”, yet households on that street had no supply.

Officials added a separate local-outage section so residents could distinguish system-wide storage conditions from neighbourhood repairs.

The town avoided publishing minute-by-minute tank percentages because sensor readings fluctuated and could create false precision.

Managers concluded that a useful public status should match the scale of the problem. A town-wide indicator can explain general supply conditions, but it cannot replace local outage information.

The system was kept because it reduced uncertainty while making clear that more than one cause can affect water pressure.`,
 questions:[
 q("R31-Q1","RC-F01","easy","What did the morning water notice show?","A simple tank-status category and next update time",["Household water bills","Every pipe diameter","Individual meter readings"],"The town used three status categories rather than a detailed technical dashboard.","normal ... restricted"),
 q("R31-Q2","RC-F02","medium","Why was a local-outage section added?","A street-level repair could interrupt service even when town-wide tank status was normal",["The storage tank was removed","Residents wanted weather forecasts","The sensor had no readings"],"The original town-wide status could not explain a local valve closure.","local-outage section"),
 q("R31-Q3","RC-F03","hard","What is the main idea of the report?","Public status information should distinguish system-wide conditions from local problems",["One town-wide label explains every outage","Exact percentages are always best","Water pressure has only one cause"],"The improved notice separates broad storage status from neighbourhood-specific interruption.","match the scale of the problem"),
 q("R31-Q4","RC-F04","medium","Which title best suits the report?","A Town Tests Water-Tank Level Notices",["The New Water Bill","A Broken Household Meter","Why Hillside Roads Close"],"The passage evaluates public notices about water-supply status.","posting a simple morning status"),
 q("R31-Q5","RC-F05","easy","In context, “fluctuated” most nearly means:","changed up and down",["remained fixed","failed completely","became public"],"Sensor readings did not stay perfectly stable from moment to moment.","readings fluctuated"),
 q("R31-Q6","RC-F06","medium","Which statement is supported?","The town chose not to publish minute-by-minute percentages",["Residents received no updates","All calls to the office stopped","Local outages were removed"],"Officials avoided false precision from rapidly changing readings.","avoided publishing minute-by-minute")
 ]
}
] as const;
