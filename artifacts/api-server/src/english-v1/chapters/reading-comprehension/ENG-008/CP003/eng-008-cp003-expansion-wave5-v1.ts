import type{Eng008Cp003PassageV1}from"./eng-008-cp003-authorities-v1";
const q=(id:string,familyId:any,difficulty:any,question:string,correctAnswer:string,distractors:readonly[string,string,string],explanation:string,evidence:string)=>({id,familyId,difficulty,question,correctAnswer,distractors,explanation,evidence});
export const ENG008_CP003_EXPANSION_WAVE5_V1:readonly Eng008Cp003PassageV1[]=[
{
 id:"ENG008-BP-S06",title:"A Housing Society Changes Its Visitor Log",genre:"social",
 text:`A large housing society used a paper visitor register at the main gate. During busy evenings, guests sometimes waited while the guard searched earlier pages to confirm whether a flat had already approved a visitor.

The residents' committee reviewed the process and found that most delays came from incomplete entries. Some residents gave only a first name, while others forgot to mention the expected arrival time.

Instead of replacing the register immediately, the committee changed the booking slip. Residents now entered the visitor's full name, flat number and an approximate arrival window. The guard placed the slips in time order before the evening rush.

During the next month, average verification time fell. Guards also made fewer phone calls to flats because the entries were easier to match with arriving visitors.

The new system created one small problem. Visitors who arrived much earlier or later than expected were harder to locate in the time-ordered slips. The committee added a simple alphabetical index for those cases.

Residents were reminded that the log was only for gate verification and should not contain unnecessary personal details. The committee deliberately avoided asking for information that was not needed for entry.

By the end of the trial, the paper system still required manual work, but it functioned more smoothly because the information was structured before the busy period began.

The committee concluded that better input quality can improve a simple process even without new technology. A digital system may still be considered later, but only if booking volume grows enough to justify it.`,
 questions:[
 q("S06-Q1","BP-F01","easy","Which details were added to the visitor booking slip?","Full name, flat number and approximate arrival time",["Vehicle price, phone model and age","Only a first name","Flat colour and occupation"],"The third paragraph lists the required fields.","full name, flat number and an approximate arrival window"),
 q("S06-Q2","BP-F02","medium","Why did verification become faster?","Visitor information was more complete and organised before arrival",["The society removed the gate","Visitors stopped arriving in the evening","Guards stopped checking entries"],"Better input and time ordering reduced searching and phone calls.","entries were easier to match"),
 q("S06-Q3","BP-F03","medium","What is the central idea of the passage?","A simple process can improve when the information entering it is clearer and better structured",["Paper systems should never be replaced","Visitors should provide many personal details","Housing societies should remove guards"],"The improvement came from better input quality, not technology.","better input quality can improve a simple process"),
 q("S06-Q4","BP-F04","medium","Which statement is supported?","An alphabetical index was added for visitors arriving outside the expected time window",["The register was removed","Every visitor arrived on time","The system collected more personal data"],"The sixth paragraph explains this adjustment.","added a simple alphabetical index"),
 q("S06-Q5","BP-F05","easy","In context, “verification” is closest in meaning to:","checking that a visitor matches an approved entry",["collecting a fee","repairing a gate","writing a complaint"],"The guard verifies whether the arriving person matches the booking.","gate verification"),
 q("S06-Q6","BP-F06","easy","Which word is opposite in meaning to “complete” as used in the passage?","incomplete",["full","detailed","finished"],"Incomplete is the direct opposite.","incomplete entries"),
 q("S06-Q7","BP-F07","medium","What does “input quality” refer to here?","The accuracy and completeness of information recorded before the visitor arrives",["The strength of the gate","The number of guards","The speed of the lift"],"The conclusion refers to how useful the booking information is.","better input quality"),
 q("S06-Q8","BP-F08","medium","Why did the committee avoid extra personal details?","They were not necessary for gate entry",["The register had no space","Visitors refused all identification","The guards could not read"],"The passage explicitly limits collection to what is needed.","should not contain unnecessary personal details"),
 q("S06-Q9","BP-F09","medium","Which title best suits the passage?","A Housing Society Changes Its Visitor Log",["The Gate Without Guards","Why Visitors Should Arrive Early","A Fully Digital Apartment"],"The passage focuses on redesigning the visitor-entry process.","changed the booking slip")
 ]
},
{
 id:"ENG008-BP-SC04",title:"A School Measures Heat in Different Classrooms",genre:"science",
 text:`A school science club placed temperature sensors in eight classrooms after students noticed that some rooms felt much hotter than others during the afternoon. The rooms were in different parts of the same building.

For two weeks, sensors recorded temperature every fifteen minutes. Rooms facing west were generally warmer after 2 p.m., but the difference was not identical every day.

The club also recorded whether curtains were closed, ceiling fans were running and windows were open. On several hot days, two west-facing rooms were cooler than expected because curtains had been drawn before direct sunlight reached the glass.

Students initially wanted to conclude that room direction alone determined afternoon heat. Their teacher asked them to compare the sensor readings with the other observations first.

The analysis showed that orientation mattered, but ventilation and shading also changed the result. A north-facing room with poor airflow could still become warmer than a shaded west-facing room.

The club then tested one simple intervention: closing curtains before noon in two rooms that received strong afternoon sun. Average afternoon temperature fell slightly compared with the previous week.

The experiment was small and weather conditions differed from week to week, so the students did not treat the result as final proof.

They concluded that classroom heat came from several interacting factors and that measurement was more useful when it was combined with observations about the room rather than reduced to one simple cause.`,
 questions:[
 q("SC04-Q1","BP-F01","easy","Which rooms were generally warmer after 2 p.m.?","West-facing rooms",["North-facing rooms only","All rooms equally","Rooms with closed curtains"],"The second paragraph directly reports this pattern.","Rooms facing west were generally warmer"),
 q("SC04-Q2","BP-F02","medium","What can be inferred about curtains?","They may reduce some afternoon heat from direct sunlight",["They always make rooms hotter","They matter only at night","They replace ventilation"],"The west-facing rooms with curtains closed were cooler than expected.","curtains had been drawn"),
 q("SC04-Q3","BP-F03","medium","What is the central idea of the passage?","Classroom heat depends on several interacting factors, not orientation alone",["Room direction is the only cause of heat","Fans have no effect","Sensors are unnecessary"],"The conclusion explicitly rejects a one-cause explanation.","several interacting factors"),
 q("SC04-Q4","BP-F04","medium","Which statement is supported?","A north-facing room could still be warmer if airflow was poor",["Every west-facing room was hottest","Curtains were always open","Weather stayed identical"],"The fifth paragraph gives this example.","north-facing room with poor airflow"),
 q("SC04-Q5","BP-F05","easy","In context, “orientation” is closest in meaning to:","the direction a room faces",["the number of desks","the type of fan","the room size"],"Orientation refers to west- or north-facing position.","orientation mattered"),
 q("SC04-Q6","BP-F06","easy","Which word is opposite in meaning to “poor” as used for airflow?","good",["weak","limited","bad"],"Good is the opposite of poor.","poor airflow"),
 q("SC04-Q7","BP-F07","medium","What does “one simple cause” refer to?","Explaining room temperature only by the direction the room faces",["Using only one sensor","Closing one curtain","Measuring one day"],"The students initially wanted to attribute heat to orientation alone.","room direction alone determined"),
 q("SC04-Q8","BP-F08","medium","Why did the teacher ask students to compare other observations?","To avoid drawing a conclusion from one factor before checking alternatives",["To remove the sensors","To shorten the experiment","To increase room temperature"],"The teacher wanted them to test the initial explanation against more evidence.","compare the sensor readings with the other observations"),
 q("SC04-Q9","BP-F09","medium","Which title best suits the passage?","A School Measures Heat in Different Classrooms",["Why All West Rooms Are Hot","The Broken Ceiling Fans","A Winter Weather Study"],"The passage is about measuring and explaining classroom heat differences.","placed temperature sensors in eight classrooms")
 ]
},
{
 id:"ENG008-BP-B06",title:"A Bakery Changes Its Pre-Order Cut-off",genre:"business",
 text:`A neighbourhood bakery accepted cake pre-orders until 8 p.m. for collection the next morning. The arrangement was convenient for customers, but the kitchen often received several late orders after ingredients had already been prepared for the day.

The owner reviewed six weeks of orders and found that late-evening requests were not very numerous, yet they caused disproportionate disruption because staff had to adjust quantities after cleaning and preparation had begun.

For a one-month trial, the bakery moved the standard cut-off to 6 p.m. Customers who ordered later could still choose from a smaller list of designs that used ingredients already prepared.

Kitchen staff reported fewer last-minute changes and less leftover icing. Most customers accepted the earlier deadline, but a few office workers said they could not always place orders before leaving work.

In response, the bakery added a reminder message at 4 p.m. for customers who had started an online order but not completed it. It also kept two simple cake designs available for late orders.

The owner checked whether the earlier cut-off reduced sales. Total cake orders stayed similar, though more customers selected standard designs during the final two hours.

The trial showed that a rule can be tightened without removing all flexibility. The bakery reduced operational disruption while preserving a limited option for customers whose schedules made the earlier deadline difficult.

At the end of the month, the 6 p.m. cut-off was retained, with the late-order menu clearly shown online so customers knew the trade-off before choosing when to order.`,
 questions:[
 q("B06-Q1","BP-F01","easy","What was the original cake pre-order cut-off time?","8 p.m.",["4 p.m.","6 p.m.","Midnight"],"The opening paragraph directly states the original time.","until 8 p.m."),
 q("B06-Q2","BP-F02","medium","Why did a small number of late orders cause large disruption?","They arrived after preparation and cleaning had already begun",["They were always cancelled","They used no ingredients","They were cheaper"],"Late timing forced staff to revise prepared quantities.","after ingredients had already been prepared"),
 q("B06-Q3","BP-F03","medium","What is the central idea of the passage?","The bakery reduced late disruption while keeping a limited flexible option for customers",["The bakery stopped taking pre-orders","Late orders increased sales sharply","All customers preferred the earlier deadline"],"The trial balanced operational efficiency with a smaller late menu.","without removing all flexibility"),
 q("B06-Q4","BP-F04","medium","Which statement is supported?","Total cake orders stayed roughly similar after the change",["Sales collapsed","Late orders were banned","Every customer ordered before 4 p.m."],"The seventh paragraph states this directly.","Total cake orders stayed similar"),
 q("B06-Q5","BP-F05","easy","In context, “disproportionate” is closest in meaning to:","larger than expected relative to the number of orders",["perfectly equal","very cheap","completely predictable"],"A few late orders created a relatively large operational effect.","disproportionate disruption"),
 q("B06-Q6","BP-F06","easy","Which word is opposite in meaning to “limited”?","unlimited",["restricted","small","narrow"],"Unlimited is the opposite.","limited option"),
 q("B06-Q7","BP-F07","medium","What does “the trade-off” refer to?","Ordering later meant having fewer design choices",["Ordering earlier cost more","Late orders were always rejected","Customers had to collect at night"],"The bakery preserved late ordering but with a smaller menu.","late-order menu"),
 q("B06-Q8","BP-F08","medium","Why was a 4 p.m. reminder added?","To help customers finish orders before the new cut-off",["To advertise new prices","To close the website","To reduce cake variety"],"The reminder targeted incomplete orders before 6 p.m.","started an online order but not completed it"),
 q("B06-Q9","BP-F09","medium","Which title best suits the passage?","A Bakery Changes Its Pre-Order Cut-off",["The Bakery Stops Making Cakes","Why Office Workers Bake at Home","A Midnight Cake Menu"],"The passage focuses on changing the order deadline and preserving limited flexibility.","moved the standard cut-off")
 ]
},
{
 id:"ENG008-BP-B07",title:"A Courier Company Tests Photo Proof of Delivery",genre:"business",
 text:`A local courier company introduced photo proof of delivery for parcels left in building reception areas. Previously, drivers recorded only the time and the name of the person who accepted the package.

The company made the change after several customers said they could not locate parcels even though the tracking page showed “delivered.” In some cases, the package had been left with reception staff on a different floor.

During a six-week trial, drivers took a photograph showing the parcel and its immediate drop-off location. They were instructed not to include faces or unnecessary private information.

Customer enquiries about missing delivered parcels fell. Support staff said the photographs often helped them identify whether a package had been left at a reception desk, mailroom or security cabin.

The system did not solve every problem. A photo could confirm where a parcel had been placed without proving who later moved it. Some buildings also restricted photography in secure areas.

For those locations, drivers used a more detailed written location note instead. The company kept both options rather than requiring one method everywhere.

Managers also checked whether photography slowed delivery rounds. The average increase was small, but new drivers needed more time until the process became familiar.

The trial suggested that proof of delivery is most useful when it records enough context to help recover a parcel without collecting unnecessary information. The company decided to continue the system while refining privacy guidance for drivers.`,
 questions:[
 q("B07-Q1","BP-F01","easy","Why was photo proof introduced?","Some customers could not find parcels marked as delivered",["Drivers stopped using tracking","Customers requested parcel photos as souvenirs","Receptions stopped accepting deliveries"],"The second paragraph directly identifies the problem.","could not locate parcels"),
 q("B07-Q2","BP-F02","medium","What can be inferred about a delivery photograph?","It can show drop-off location but not necessarily what happened later",["It proves who moved a parcel","It eliminates every delivery dispute","It always includes a person's face"],"The passage explicitly limits what the image can prove.","without proving who later moved it"),
 q("B07-Q3","BP-F03","medium","What is the central idea of the passage?","More contextual delivery records can reduce confusion if privacy and local restrictions are respected",["Every delivery should include a face photo","Written notes are useless","Photography should replace tracking"],"The system balances useful evidence with privacy and flexibility.","enough context ... without collecting unnecessary information"),
 q("B07-Q4","BP-F04","medium","Which statement is supported?","Some secure buildings did not allow photography",["All buildings required photos","Delivery rounds became much faster","Customer enquiries increased"],"The fifth paragraph states this restriction.","restricted photography in secure areas"),
 q("B07-Q5","BP-F05","easy","In context, “refining” is closest in meaning to:","improving or making more precise",["removing completely","hiding","delaying"],"The company plans to improve privacy guidance.","refining privacy guidance"),
 q("B07-Q6","BP-F06","easy","Which word is opposite in meaning to “unnecessary”?","necessary",["extra","irrelevant","avoidable"],"Necessary is the direct opposite.","unnecessary private information"),
 q("B07-Q7","BP-F07","medium","What does “both options” refer to?","Photo proof or a detailed written location note",["Home delivery or shop pickup","Tracking or payment","Morning or evening delivery"],"The company retained an alternative for no-photo locations.","kept both options"),
 q("B07-Q8","BP-F08","medium","What most directly reduced missing-parcel enquiries?","Better evidence about the actual drop-off location",["Fewer parcels were delivered","Customers stopped using tracking","Buildings removed reception areas"],"Photos often revealed the exact reception or security location.","helped them identify"),
 q("B07-Q9","BP-F09","medium","Which title best suits the passage?","A Courier Company Tests Photo Proof of Delivery",["The Parcel That Was Never Sent","Why Buildings Ban Couriers","A Company Without Tracking"],"The passage centres on the photo-proof trial.","introduced photo proof of delivery")
 ]
}
] as const;