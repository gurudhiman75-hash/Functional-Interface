import type{Eng008RcPassageV1}from"./eng-008-cp001-authorities-v1";
const q=(id:string,familyId:any,difficulty:any,question:string,correctAnswer:string,distractors:readonly[string,string,string],explanation:string,evidence:string)=>({id,familyId,difficulty,question,correctAnswer,distractors,explanation,evidence});

export const ENG008_CP001_EXPANSION_WAVE1_V1:readonly Eng008RcPassageV1[]=[
{
 id:"ENG008-RC-N05",title:"The Umbrella at the Gate",genre:"narrative",
 text:`After the last class, Kabir noticed a black umbrella leaning against the school gate. Rain had stopped an hour earlier, and most students had already left. He carried the umbrella to the security desk instead of taking it with him.

The next morning, a new student came looking for it. She explained that she had borrowed the umbrella from her aunt and was worried about losing it on her first week at school. The guard returned it after asking her to describe the small red thread tied around the handle.

Kabir had not expected to meet the owner, but he was glad he had left the umbrella where it could be found. The incident was ordinary, yet it reminded him that a small choice can matter greatly to someone whose situation we do not know.

Later that week, the guard placed a small lost-and-found box near the desk because several students had started handing in pens, water bottles and notebooks instead of leaving them where they were found. Kabir noticed that none of those objects looked important by themselves. Their importance depended on who had lost them and what problem the loss created.`,
 questions:[
 q("N05-Q1","RC-F01","easy","Where did Kabir leave the umbrella?","At the school security desk",["In his classroom","At a nearby shop","Inside the school bus"],"The passage directly says Kabir carried the umbrella to the security desk.","carried the umbrella to the security desk"),
 q("N05-Q2","RC-F02","medium","Why was the umbrella especially important to the new student?","She had borrowed it and was afraid of losing it",["It contained her school books","It was a prize from the school","She needed it for a sports event"],"She explains that the umbrella belonged to her aunt and that she was worried about losing it.","borrowed the umbrella from her aunt"),
 q("N05-Q3","RC-F03","medium","What is the central idea of the passage?","A simple responsible act can be important to another person",["Students should avoid borrowing umbrellas","School guards should collect lost objects every day","Rainy days make new students nervous"],"Kabir's small decision to hand in the umbrella solved a problem he could not have known about.","a small choice can matter greatly"),
 q("N05-Q4","RC-F04","medium","Which title best suits the passage?","The Umbrella at the Gate",["The First Week of Rain","The Empty Security Desk","A New School Rule"],"The story centres on the lost umbrella found at the school gate and returned to its owner.","a black umbrella leaning against the school gate"),
 q("N05-Q5","RC-F05","easy","In the passage, “ordinary” most nearly means:","not unusual or special",["dangerous","expensive","unfair"],"The incident is described as ordinary because it was a simple everyday event.","The incident was ordinary"),
 q("N05-Q6","RC-F06","medium","Which statement is supported by the passage?","The student identified the umbrella by a red thread on its handle",["Kabir knew the student who owned the umbrella","The umbrella had been left inside a classroom","The guard returned the umbrella without asking any questions"],"The guard asked the student to describe the red thread before returning the umbrella.","describe the small red thread tied around the handle")
 ]
},
{
 id:"ENG008-RC-R05",title:"A Shorter Queue at the Clinic",genre:"report",
 text:`A community clinic reviewed waiting times after patients repeatedly reported long queues at the registration desk. Staff recorded arrival times for two weeks and found that most delays occurred during the first hour after opening, when many patients arrived at once.

The clinic did not add another counter immediately. Instead, it moved routine appointment confirmations to a separate desk and allowed patients with pre-booked visits to check in using a simpler form. During a second two-week review, the average registration wait during the busiest hour fell by nine minutes.

The clinic noted that the change did not reduce waiting for doctors themselves. It improved only the registration stage. Staff therefore decided to study consultation scheduling separately rather than claiming that the entire patient journey had become faster.

The clinic also separated walk-in patients from people who already had appointments when reviewing the new data. The change helped both groups, but pre-booked patients benefited more because their check-in process was easier to simplify. Staff said the result showed why a single average can hide differences between patient groups even in a small service improvement.`,
 questions:[
 q("R05-Q1","RC-F01","easy","When did most registration delays occur?","During the first hour after the clinic opened",["During the lunch break","Just before closing","Only on weekends"],"The first paragraph directly identifies the first hour after opening as the busiest period.","most delays occurred during the first hour after opening"),
 q("R05-Q2","RC-F02","medium","Why did the clinic create a separate desk for routine confirmations?","To reduce pressure on the main registration queue",["To increase consultation time","To collect more medical fees","To replace doctors with clerks"],"Separating simple confirmations reduced the number of people using the main registration process.","moved routine appointment confirmations to a separate desk"),
 q("R05-Q3","RC-F03","medium","What is the main idea of the report?","A targeted process change reduced one specific source of waiting",["The clinic solved every delay without hiring staff","Patients should arrive only after the first hour","Registration is more important than medical consultation"],"The report shows that a focused change improved registration while other waiting remained outside its scope.","improved only the registration stage"),
 q("R05-Q4","RC-F04","medium","Which title best suits the passage?","Reducing a Queue One Step at a Time",["Why Clinics Need More Doctors","The Nine-Minute Consultation","Closing the Registration Desk"],"The report focuses on reducing one part of the queueing process without overstating the result.","study consultation scheduling separately"),
 q("R05-Q5","RC-F05","easy","In context, “routine” most nearly means:","regular and uncomplicated",["urgent and dangerous","private and confidential","rare and unexpected"],"The confirmations were simple, regular tasks moved away from the main queue.","routine appointment confirmations"),
 q("R05-Q6","RC-F06","medium","Which statement is supported?","The change shortened registration waits but not doctor waiting time",["The clinic hired a new doctor during the review","All patients used the simpler form","Waiting time disappeared completely"],"The final paragraph explicitly limits the improvement to registration.","did not reduce waiting for doctors themselves")
 ]
}
] as const;