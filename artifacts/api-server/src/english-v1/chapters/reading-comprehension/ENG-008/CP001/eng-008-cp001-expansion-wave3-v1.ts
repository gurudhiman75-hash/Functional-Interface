import type{Eng008RcPassageV1}from"./eng-008-cp001-authorities-v1";
const q=(id:string,familyId:any,difficulty:any,question:string,correctAnswer:string,distractors:readonly[string,string,string],explanation:string,evidence:string)=>({id,familyId,difficulty,question,correctAnswer,distractors,explanation,evidence});

export const ENG008_CP001_EXPANSION_WAVE3_V1:readonly Eng008RcPassageV1[]=[
{
 id:"ENG008-RC-N07",title:"The Seat Near the Window",genre:"narrative",
 text:`Rohan usually sat near the window on the school bus because he liked reading the street signs along the route. One morning, he found a younger student already sitting there and looked annoyed. The child immediately stood up, assuming Rohan wanted the seat back.

Rohan noticed that the student was holding a paper map and trying to match road names with the stops outside. He asked why. The child explained that it was his first week using the bus alone and that the window helped him recognise where to get off.

Rohan chose another seat and spent the journey pointing out two landmarks the child could remember. By the end of the week, the younger student no longer needed the map and sometimes helped other new students identify their stops.

The experience changed Rohan's view of the seat. He had treated it as a small personal preference, while for someone else it had temporarily served a practical purpose. He still liked sitting by the window, but he became less quick to assume that wanting something and needing it were the same thing.`,
 questions:[
 q("N07-Q1","RC-F01","easy","Why did the younger student want the window seat?","It helped him recognise where to get off the bus",["He wanted to sleep during the journey","He was saving the seat for a friend","He disliked sitting near older students"],"The passage directly says the window helped him identify his stop.","the window helped him recognise where to get off"),
 q("N07-Q2","RC-F02","medium","What can be inferred about Rohan's reaction after hearing the student's explanation?","He understood that the seat mattered more to the student than he first realised",["He decided never to use the window seat again","He believed the student should travel with an adult","He thought maps were unnecessary"],"Rohan gives up the seat and helps the student after learning its practical importance.","temporarily served a practical purpose"),
 q("N07-Q3","RC-F03","medium","What is the central idea of the passage?","Understanding another person's need can change how we judge a small conflict",["Window seats should be reserved for new students","Paper maps are better than mobile phones","Older students should always give up their seats"],"The story contrasts Rohan's preference with the younger student's temporary need.","wanting something and needing it were the same thing"),
 q("N07-Q4","RC-F04","medium","Which title best suits the passage?","The Seat Near the Window",["The Lost Bus Map","A New School Route","The Last Stop"],"The story revolves around the meaning of the same window seat to two students.","sat near the window"),
 q("N07-Q5","RC-F05","easy","In context, “landmarks” most nearly means:","recognisable places used to identify a location",["rules written on a map","seats inside a vehicle","people waiting at a stop"],"Rohan points out places the child can use to know where he is.","two landmarks the child could remember"),
 q("N07-Q6","RC-F06","medium","Which statement is supported by the passage?","The younger student later became confident enough to help other new riders",["Rohan stopped travelling by bus","The student lost his map during the first journey","The bus route was changed after one week"],"The third paragraph says he later helped other new students identify their stops.","helped other new students identify their stops")
 ]
},
{
 id:"ENG008-RC-R07",title:"A Homework Help Desk After School",genre:"report",
 text:`A government school opened a small homework help desk in the library for one hour after classes. Two teachers rotated duty, and students could ask questions about assignments without booking a separate meeting.

During the first month, the desk received an average of eighteen visits a day. Mathematics questions were the most common, followed by English writing. Teachers noticed that some students arrived with the same type of question repeatedly because they had not understood one basic step taught earlier.

The school therefore added ten-minute mini-sessions twice a week on frequently repeated problems. After this change, the number of students asking the exact same question fell, while overall use of the desk remained steady.

The desk did not replace classroom teaching or private study. Its purpose was narrower: to give students a place to clear up small difficulties before those difficulties became reasons to avoid an assignment.

At the end of the term, the school decided to continue the desk but to record question types more systematically. Staff hoped the records would also show teachers which topics might need clearer explanation during regular lessons.`,
 questions:[
 q("R07-Q1","RC-F01","easy","How long was the homework help desk open after school?","One hour",["Ten minutes","Two hours","All evening"],"The first paragraph says the desk operated for one hour after classes.","for one hour after classes"),
 q("R07-Q2","RC-F02","medium","Why did the school add short mini-sessions?","Many students were repeatedly asking about the same basic problems",["The library had become too crowded","Teachers wanted to reduce English homework","Students requested longer school days"],"Repeated questions suggested common gaps that could be addressed together.","same type of question repeatedly"),
 q("R07-Q3","RC-F03","medium","What is the main idea of the report?","A simple support desk helped students resolve small academic difficulties and revealed common learning gaps",["The school replaced regular lessons with library tutoring","Mathematics homework was removed","Students were required to attend after school"],"The desk served both immediate support and feedback about recurring difficulties.","clear up small difficulties"),
 q("R07-Q4","RC-F04","medium","Which title best suits the passage?","A Homework Help Desk After School",["The End of Classroom Teaching","Why Libraries Should Close Late","A New Mathematics Exam"],"The report describes the operation and adjustment of an after-school help desk.","opened a small homework help desk"),
 q("R07-Q5","RC-F05","easy","In context, “systematically” most nearly means:","in an organised and regular way",["secretly","occasionally","without any plan"],"The school wants to record question types more consistently and methodically.","record question types more systematically"),
 q("R07-Q6","RC-F06","medium","Which statement is supported?","Overall use of the desk stayed steady after mini-sessions were introduced",["All repeated questions disappeared","Only mathematics teachers staffed the desk","The desk replaced private study"],"The third paragraph directly says overall use remained steady.","overall use of the desk remained steady")
 ]
}
] as const;