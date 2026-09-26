import type{Eng008RcPassageV1}from"./eng-008-cp001-authorities-v1";
const q=(id:string,familyId:any,difficulty:any,question:string,correctAnswer:string,distractors:readonly[string,string,string],explanation:string,evidence:string)=>({id,familyId,difficulty,question,correctAnswer,distractors,explanation,evidence});
export const ENG008_CP001_EXPANSION_WAVE5_V1:readonly Eng008RcPassageV1[]=[
{
 id:"ENG008-RC-N10",title:"The Missing Name Tag",genre:"narrative",
 text:`During a school science exhibition, Nisha noticed a model volcano on a table without a student name tag. Visitors kept asking who had made it, but the supervising teacher was helping another group and did not know.

Nisha remembered that the class had photographed each model during setup. She opened the shared class album and found the volcano in a picture beside Aman and Harjit. Instead of guessing which student owned it, she checked the project list at the registration desk.

The model belonged to Aman. Nisha wrote a temporary name card and placed it beside the display. Later, Aman explained that his original card had probably fallen when the table was moved.

The problem was small, but Nisha noticed how quickly people had begun making assumptions from one photograph. She realised that a clue can narrow a search without proving the answer. Checking the official list took only a minute and prevented the wrong student from receiving credit. After the exhibition, the teacher asked the class to attach duplicate labels to the storage boxes used for future events. Nisha suggested keeping the registration list beside the display area as well, because a backup record was useful when a physical tag was lost. The change was simple, but it reduced dependence on any one label.`,
 questions:[
 q("N10-Q1","RC-F01","easy","How did Nisha confirm who owned the model?","She checked the project list at the registration desk",["She asked every visitor","She guessed from the photograph","She moved the model to another table"],"The passage says Nisha used the official project list to confirm ownership.","checked the project list"),
 q("N10-Q2","RC-F02","medium","What can be inferred from Nisha's use of the photograph?","She treated it as a clue rather than final proof",["She believed photographs are never useful","She already knew the answer","She ignored the official list"],"She used the photo to narrow possibilities, then verified the answer separately.","a clue can narrow a search without proving the answer"),
 q("N10-Q3","RC-F03","medium","What is the central idea of the passage?","Useful clues should still be verified before reaching a conclusion",["Science exhibitions need more teachers","Students should avoid photographs","Name tags are unnecessary"],"The story contrasts a likely clue with proper confirmation.","Checking the official list"),
 q("N10-Q4","RC-F04","medium","Which title best suits the passage?","The Missing Name Tag",["The Broken Volcano","A New Science Teacher","The Empty Classroom"],"The entire story begins with and resolves the missing identification card.","without a student name tag"),
 q("N10-Q5","RC-F05","easy","In context, “assumptions” most nearly means:","beliefs accepted without full proof",["written instructions","scientific results","visitor questions"],"The passage warns against deciding ownership based only on a partial clue.","making assumptions"),
 q("N10-Q6","RC-F06","medium","Which statement is supported by the passage?","The original name card may have fallen when the table was moved",["The model belonged to Harjit","The teacher removed the card","The project list was missing"],"Aman gives this explanation directly.","probably fallen when the table was moved")
 ]
},
{
 id:"ENG008-RC-N11",title:"The Notebook on the Bench",genre:"narrative",
 text:`After evening practice, Karan found a notebook on a park bench near the running track. The first page contained no name, only a weekly exercise plan and several timings written in pencil.

He considered leaving it at the nearby tea stall in case the owner returned, but then noticed a membership sticker from the local athletics club on the back cover. The club office was still open, so he carried the notebook there.

The receptionist recognised the training schedule as one used by a junior athlete and checked the day's attendance sheet. Within ten minutes, the owner was identified and contacted.

When the athlete collected the notebook, he explained that the timings were part of his preparation for a district race. Karan realised that an ordinary-looking object can contain work that matters greatly to someone else. He also saw the value of using the most relevant clue rather than choosing the nearest convenient place to leave a lost item. The club later added a small lost-property tray near reception so similar items would not be left at unrelated shops or benches. Karan noticed that the new system did not require more rules; it simply gave people a sensible place to use when they found something connected to the club.`,
 questions:[
 q("N11-Q1","RC-F01","easy","Where did Karan take the notebook?","To the athletics club office",["To the tea stall","To his home","To the police station"],"The passage directly says he carried it to the club office.","club office was still open"),
 q("N11-Q2","RC-F02","medium","Why was the club sticker useful?","It connected the notebook to a place likely to identify the owner",["It showed the notebook's price","It contained the owner's phone number","It proved the tea stall was closed"],"The sticker provided a relevant connection to the athletics club.","membership sticker"),
 q("N11-Q3","RC-F03","medium","What is the central idea of the passage?","The right clue can help return a lost object to the person who values it",["Sports clubs should issue new notebooks","Lost items should always go to tea stalls","Exercise plans should include names"],"Karan uses the club connection to identify the owner efficiently.","using the most relevant clue"),
 q("N11-Q4","RC-F04","medium","Which title best suits the passage?","The Notebook on the Bench",["The District Race","A Closed Club Office","The Missing Membership Card"],"The story centres on the lost notebook found on the park bench.","found a notebook on a park bench"),
 q("N11-Q5","RC-F05","easy","In context, “relevant” most nearly means:","directly connected to the problem",["expensive","temporary","public"],"The clue was useful because it directly connected the object with the club.","most relevant clue"),
 q("N11-Q6","RC-F06","medium","Which statement is supported?","The notebook contained training timings for a district race",["The club had no attendance sheet","Karan knew the athlete personally","The notebook was empty"],"The owner says the timings were part of race preparation.","preparation for a district race")
 ]
},
{
 id:"ENG008-RC-R10",title:"A School Changes Its Noticeboard Layout",genre:"report",
 text:`A senior secondary school reorganised its main noticeboard after students complained that exam dates, club announcements and administrative notices were mixed together. Important information was sometimes covered by newer posters.

The school divided the board into fixed sections: examinations, activities, scholarships and general notices. Each section had a date label showing when old material would be removed.

For one month, teachers recorded how often students asked for information already available on the board. Repeated questions about exam dates and scholarship deadlines fell noticeably.

The school did not conclude that every student now read the board carefully. Some still relied on messages from classmates. However, the new layout made important notices easier to locate and reduced the chance that a colourful poster would hide a deadline. Staff decided to keep the sections and review them each term. The school also asked whether students could tell which section contained a notice before reading the full text. Most could do so after a few days, which suggested that the fixed categories themselves were becoming familiar. Staff decided that future posters would keep the same headings rather than redesigning the board every month.`,
 questions:[
 q("R10-Q1","RC-F01","easy","How was the noticeboard reorganised?","Into fixed sections by type of information",["By student age","By poster colour","By classroom number"],"The second paragraph lists separate sections by purpose.","fixed sections"),
 q("R10-Q2","RC-F02","medium","Why did repeated questions fall?","Students could find key information more easily",["Teachers stopped answering questions","Notices were removed","Exam dates changed less often"],"The new structure made notices easier to locate.","easier to locate"),
 q("R10-Q3","RC-F03","medium","What is the main idea of the report?","A clearer information layout reduced confusion without changing the information itself",["The school removed its noticeboard","Students stopped using classmates for information","Posters were banned"],"The change was organisational rather than informational.","new layout"),
 q("R10-Q4","RC-F04","medium","Which title best suits the passage?","A School Changes Its Noticeboard Layout",["Why Posters Should Be Colourful","The End of Scholarships","A New Examination System"],"The report is about reorganising the school noticeboard.","reorganised its main noticeboard"),
 q("R10-Q5","RC-F05","easy","In context, “deadline” most nearly means:","the final date for completing something",["a noticeboard section","a classroom rule","an exam result"],"The passage discusses scholarship and exam dates that should not be missed.","hide a deadline"),
 q("R10-Q6","RC-F06","medium","Which statement is supported?","Some students still depended on classmates for information",["All students read the board daily","Exam notices were removed","The board had no date labels"],"The final paragraph states this directly.","still relied on messages from classmates")
 ]
},
{
 id:"ENG008-RC-R11",title:"A Park Adds Distance Markers to a Walking Track",genre:"report",
 text:`A municipal park added small distance markers every 250 metres along its walking track after visitors asked how far they had completed. Previously, only the total track length was displayed at the entrance.

During a six-week trial, park staff asked walkers how they used the markers. Some used them to set exercise goals, while others said the signs helped them decide when to turn back if they had limited time.

The markers did not increase the physical length of the track or change the walking surface. Their value came from making progress visible during the walk.

Staff also noticed that first-time visitors asked fewer questions about distance at the information booth. The park decided to keep the markers and add one simple map showing how the numbered points connected around the route. Officials said the improvement was small but useful because it helped visitors understand the space without needing extra staff assistance. The park also compared weekend and weekday use. Weekend visitors were more likely to use the markers for exercise goals, while weekday walkers more often used them to judge how much time remained before work or school. Staff said this showed that the same information could support different needs.`,
 questions:[
 q("R11-Q1","RC-F01","easy","How often were distance markers placed?","Every 250 metres",["Every 50 metres","Every kilometre","Only at the entrance"],"The opening paragraph directly gives the spacing.","every 250 metres"),
 q("R11-Q2","RC-F02","medium","Why did some walkers use the markers to decide when to turn back?","They had limited time and could judge how far they had gone",["The track was unsafe","The markers showed weather","The park was closing permanently"],"The passage links the markers to distance awareness and time limits.","limited time"),
 q("R11-Q3","RC-F03","medium","What is the main idea of the report?","Simple distance information made the walking track easier to use",["The park built a longer track","Visitors needed more staff assistance","The walking surface was replaced"],"The markers improved understanding without changing the track itself.","making progress visible"),
 q("R11-Q4","RC-F04","medium","Which title best suits the passage?","A Park Adds Distance Markers to a Walking Track",["A New Running Competition","The Shortest Track in Town","Why Parks Need More Staff"],"The report focuses on adding markers along the track.","added small distance markers"),
 q("R11-Q5","RC-F05","easy","In context, “progress” most nearly means:","distance already completed",["ticket price","walking speed only","park opening time"],"The markers show how far a walker has gone.","making progress visible"),
 q("R11-Q6","RC-F06","medium","Which statement is supported?","First-time visitors asked fewer distance questions after the markers were added",["The track surface changed","The park removed its information booth","Only athletes used the markers"],"The final paragraph directly reports this.","asked fewer questions")
 ]
}
] as const;