import type{Eng008RcPassageV1}from"./eng-008-cp001-authorities-v1";
const q=(id:string,familyId:any,difficulty:any,question:string,correctAnswer:string,distractors:readonly[string,string,string],explanation:string,evidence:string)=>({id,familyId,difficulty,question,correctAnswer,distractors,explanation,evidence});

export const ENG008_CP001_EXPANSION_WAVE4_V1:readonly Eng008RcPassageV1[]=[
{
 id:"ENG008-RC-N08",title:"The Box of Old Photographs",genre:"narrative",
 text:`While cleaning a cupboard, Asha found a cardboard box filled with old family photographs. Many had no dates or names written on them. She was about to put the box back when her grandfather recognised a picture of a market that no longer existed.

He began identifying people and places while Asha wrote short notes on the backs of the photographs. One picture showed a narrow bridge that had been replaced years earlier. Another showed her grandmother standing outside a school that had since moved to a larger building.

The activity took longer than Asha expected, but it changed the box from a collection of unidentified images into a record the family could understand. Her grandfather also enjoyed explaining why certain places had mattered to him.

Asha later scanned a few photographs and saved the notes with them. She realised that preserving an object is not always enough. Sometimes its meaning also needs to be recorded before the people who remember it are no longer available to explain it.`,
 questions:[
 q("N08-Q1","RC-F01","easy","What did Asha write on the backs of the photographs?","Short notes identifying people and places",["Prices of the photographs","Directions to the market","Names of modern buildings"],"The passage directly says Asha wrote short identifying notes.","wrote short notes on the backs"),
 q("N08-Q2","RC-F02","medium","Why did the photographs become more useful after the conversation?","Their people and places had been identified and explained",["They became newer","They were moved to a different box","They were printed in larger sizes"],"The added context turned unidentified images into understandable records.","a record the family could understand"),
 q("N08-Q3","RC-F03","medium","What is the central idea of the passage?","Objects can lose meaning unless their stories and context are also preserved",["Old photographs should always be displayed","Digital copies are better than originals","Markets should not be replaced"],"The passage ends by stressing preservation of meaning, not only objects.","its meaning also needs to be recorded"),
 q("N08-Q4","RC-F04","medium","Which title best suits the passage?","The Box of Old Photographs",["The New School Building","A Visit to the Market","The Broken Bridge"],"The entire story develops from the discovery and explanation of the photograph box.","found a cardboard box filled with old family photographs"),
 q("N08-Q5","RC-F05","easy","In context, “preserving” most nearly means:","keeping something safe for the future",["selling it quickly","changing it completely","hiding it permanently"],"The passage discusses keeping photographs and their meaning for later generations.","preserving an object"),
 q("N08-Q6","RC-F06","medium","Which statement is supported by the passage?","Some places shown in the photographs no longer existed in the same form",["Every photograph already had a date","Asha's grandfather had taken all the photographs","The family threw away the original photographs"],"The passage mentions a market gone and a replaced bridge.","market that no longer existed")
 ]
},
{
 id:"ENG008-RC-N09",title:"The Borrowed Calculator",genre:"narrative",
 text:`On the morning of a mathematics test, Dev realised that the battery in his calculator had stopped working. He asked his classmate Simran if he could borrow hers after she finished the first section of the paper.

Simran agreed, but the teacher explained that calculators could not be passed between students during the test. Instead, she gave Dev a spare calculator kept in the examination cupboard. Dev completed the paper without further difficulty.

After the test, Dev thanked Simran even though he had not used her calculator. He said that her willingness to help had stopped him from panicking long enough to think clearly and ask the teacher for another solution.

That evening, Dev replaced the battery in his own calculator and added spare batteries to his school bag. He understood that preparation could prevent the same problem next time, while asking calmly for help could solve an unexpected problem when preparation failed.`,
 questions:[
 q("N09-Q1","RC-F01","easy","Why could Dev not use Simran's calculator during the test?","Calculators could not be passed between students",["Simran's calculator was broken","Dev had forgotten how to use it","The teacher banned all calculators"],"The teacher directly explains that calculators cannot be passed during the test.","could not be passed between students"),
 q("N09-Q2","RC-F02","medium","How did Simran help Dev even though he did not use her calculator?","Her willingness to help reduced his panic and helped him think clearly",["She answered his questions","She changed the calculator battery","She spoke to the teacher for him"],"Dev explicitly says her response helped him stay calm enough to seek another solution.","stopped him from panicking"),
 q("N09-Q3","RC-F03","medium","What is the main idea of the passage?","Preparation matters, but calm problem-solving also helps when something unexpected happens",["Students should always carry two calculators","Teachers should allow students to share equipment","Tests should not use calculators"],"The ending combines preparation with calm help-seeking.","preparation could prevent ... asking calmly for help could solve"),
 q("N09-Q4","RC-F04","medium","Which title best suits the passage?","The Borrowed Calculator",["The Cancelled Test","A Difficult Mathematics Question","The Spare Battery Shop"],"The central problem begins with Dev trying to borrow a calculator.","could borrow hers"),
 q("N09-Q5","RC-F05","easy","In context, “panicking” most nearly means:","becoming very anxious and unable to think calmly",["celebrating loudly","working slowly","forgetting a rule"],"Dev describes becoming upset enough that it affected his thinking.","stopped him from panicking"),
 q("N09-Q6","RC-F06","medium","Which statement is supported?","Dev later prepared spare batteries for future problems",["Simran gave Dev her calculator after the test","The teacher cancelled the first section","Dev bought a new calculator"],"The final paragraph says Dev added spare batteries to his bag.","added spare batteries to his school bag")
 ]
},
{
 id:"ENG008-RC-R08",title:"A School Tests a Quiet Lunch Zone",genre:"report",
 text:`A secondary school created a small quiet lunch zone in one corner of the dining hall after some students said the main seating area felt too noisy. The zone did not ban conversation, but signs asked students to keep voices low and avoid playing audio.

During a four-week trial, staff counted how many seats were used and asked students why they chose the area. The zone was busiest during examination weeks and was used by students who wanted to read, finish short assignments or simply sit somewhere calmer.

The school also checked whether the new area caused crowding elsewhere. Overall dining-hall capacity did not change because the same tables were being used; only the expected noise level differed.

Teachers concluded that the quiet zone served a specific preference without requiring the whole dining hall to become silent. They decided to keep it for another term and review whether its size should change depending on demand.`,
 questions:[
 q("R08-Q1","RC-F01","easy","When was the quiet lunch zone busiest?","During examination weeks",["During school holidays","Only on Fridays","Before breakfast"],"The report directly says usage peaked during examination weeks.","busiest during examination weeks"),
 q("R08-Q2","RC-F02","medium","Why did the school check crowding in other areas?","To see whether creating the quiet zone caused a problem elsewhere",["To reduce the number of lunch tables","To close the dining hall","To move students outside"],"The check tested whether one change created a side effect in another part of the hall.","caused crowding elsewhere"),
 q("R08-Q3","RC-F03","medium","What is the main idea of the report?","A designated quiet area met a specific student need without changing the whole dining hall",["The school banned talking during lunch","Students stopped eating in the main hall","Examinations were held in the dining hall"],"The report focuses on a limited option for students who wanted a calmer environment.","served a specific preference"),
 q("R08-Q4","RC-F04","medium","Which title best suits the passage?","A School Tests a Quiet Lunch Zone",["The End of Lunch Break","Why Students Should Study at Meals","A New Examination Hall"],"The report directly concerns the trial of a quieter lunch area.","created a small quiet lunch zone"),
 q("R08-Q5","RC-F05","easy","In context, “capacity” most nearly means:","the number of people or seats an area can accommodate",["noise level","meal price","length of lunch break"],"The passage says capacity did not change because the same tables remained.","Overall dining-hall capacity"),
 q("R08-Q6","RC-F06","medium","Which statement is supported?","Students were still allowed to talk in the quiet zone",["Audio was encouraged there","The zone replaced the entire dining hall","Only teachers could use it"],"The opening paragraph explicitly says conversation was not banned.","did not ban conversation")
 ]
},
{
 id:"ENG008-RC-R09",title:"Library Returns Move Closer to the Gate",genre:"report",
 text:`A town library noticed that many overdue books were being returned in batches at the end of the week. Staff asked users why they delayed returns even when they passed the library regularly.

Several commuters said the return desk was open only when the main library was open, so they could not return books early in the morning or late in the evening. The library installed a secure return box beside the outer gate that could be used when the building was closed.

During the next six weeks, after-hours returns increased steadily and the number of books more than three days overdue fell. Staff still checked each returned book before removing it from a borrower's account.

The library did not treat the box as a replacement for the return desk. It simply added another practical route for people whose schedules did not match opening hours. The trial suggested that small access changes can improve compliance without changing the borrowing rules themselves.`,
 questions:[
 q("R09-Q1","RC-F01","easy","Where was the new return box installed?","Beside the outer gate",["Inside the reading room","At the bus station","Behind the issue desk"],"The passage directly states the box was placed beside the outer gate.","beside the outer gate"),
 q("R09-Q2","RC-F02","medium","Why did some commuters delay returning books?","The return desk was unavailable when they passed the library",["They wanted to keep books permanently","They did not know where the library was","They were charged for every return"],"Their schedules did not match the desk's opening hours.","could not return books early ... or late"),
 q("R09-Q3","RC-F03","medium","What is the main idea of the report?","A more convenient return option reduced overdue delays without changing borrowing rules",["The library stopped using a return desk","Borrowers were allowed unlimited loan periods","The library extended all opening hours"],"The report shows that access changed while rules stayed the same.","without changing the borrowing rules"),
 q("R09-Q4","RC-F04","medium","Which title best suits the passage?","Library Returns Move Closer to the Gate",["A Library Without Books","The End of Overdue Loans","Why Commuters Read More"],"The central change is the new return box near the gate.","installed a secure return box beside the outer gate"),
 q("R09-Q5","RC-F05","easy","In context, “compliance” most nearly means:","following a rule or requirement",["buying a book","reading quickly","extending a loan"],"The report says easier access helped people follow return requirements.","improve compliance"),
 q("R09-Q6","RC-F06","medium","Which statement is supported?","Library staff still inspected returned books before updating accounts",["The return box automatically closed accounts","All overdue books disappeared immediately","The outer gate was locked at night"],"The third paragraph directly states staff checked each book first.","checked each returned book")
 ]
}
] as const;