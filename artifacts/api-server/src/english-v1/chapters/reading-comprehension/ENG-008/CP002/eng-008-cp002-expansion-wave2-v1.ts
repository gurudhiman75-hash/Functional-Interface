import type{Eng008Cp002PassageV1}from"./eng-008-cp002-authorities-v1";
const q=(id:string,familyId:any,difficulty:any,question:string,correctAnswer:string,distractors:readonly[string,string,string],explanation:string,evidence:string)=>({id,familyId,difficulty,question,correctAnswer,distractors,explanation,evidence});

export const ENG008_CP002_EXPANSION_WAVE2_V1:readonly Eng008Cp002PassageV1[]=[
{
 id:"ENG008-RC2-E10",title:"Public Notices Should Be Written for Readers, Not Files",genre:"editorial",
 text:`Government notices often contain accurate information but still fail to communicate clearly. A document may include every legal detail and yet leave ordinary readers unsure about what action they must take, which deadline matters or where they should go next. The problem is not always lack of information; sometimes it is poor ordering.

A useful notice should make the main action visible early. Dates, eligibility conditions and required documents should not be hidden inside long introductory paragraphs. Technical terms may still be necessary, but they can be followed by a short explanation in plain language.

This is especially important when a notice affects people who do not regularly deal with official procedures. A person reading one government form each year should not be expected to understand the same abbreviations and conventions as a clerk who sees them every day.

Clarity also reduces work for the issuing office. When instructions are easy to follow, fewer people call helplines or arrive with incomplete documents. In that sense, plain language is not merely a courtesy; it can improve administrative efficiency.

The answer is not to remove precision. Legal requirements must remain correct and complete. The better approach is to separate what readers need to do from the background detail that explains why the rule exists.

A public notice succeeds when a reader can identify the next step without first learning the habits of the office that produced it. Good writing therefore treats understanding as part of the service, not as an extra task left to the citizen.`,
 questions:[
 q("E10-Q1","RC2-F01","easy","What problem does the author identify in some government notices?","Important actions can be buried inside poorly ordered information",["They contain too few legal details","They are always written in multiple languages","They are usually too short"],"The first paragraph says accurate notices can still confuse readers when information is poorly ordered.","sometimes it is poor ordering"),
 q("E10-Q2","RC2-F02","medium","What can be inferred about plain-language explanations?","They can coexist with technical accuracy",["They require deleting all legal terms","They are useful only for private companies","They make official notices less precise"],"The author argues for retaining necessary technical terms while adding clear explanations.","Technical terms may still be necessary"),
 q("E10-Q3","RC2-F03","medium","Which option best summarises the passage?","Official notices should preserve precision while making required actions easy to identify",["Government notices should avoid all technical language","Citizens should learn administrative abbreviations","Helplines are more useful than written notices"],"The passage consistently argues for clarity without sacrificing legal accuracy.","The answer is not to remove precision"),
 q("E10-Q4","RC2-F04","hard","What is the author's tone?","Practical and reform-oriented",["Sarcastic and mocking","Hostile toward legal requirements","Indifferent to public access"],"The author identifies a communication problem and proposes concrete improvements.","A useful notice should make the main action visible early"),
 q("E10-Q5","RC2-F05","medium","Why does the author mention helplines and incomplete documents?","To show that clearer notices can also reduce administrative workload",["To argue offices should stop accepting documents","To prove citizens never read notices","To show helplines create legal confusion"],"The passage links clarity with fewer calls and fewer incomplete submissions.","fewer people call helplines or arrive with incomplete documents"),
 q("E10-Q6","RC2-F06","hard","Which conclusion follows most logically?","A notice can be legally complete and still poorly designed for readers",["Legal accuracy automatically guarantees clarity","Short notices are always easier to understand","Readers should rely on clerks instead of written guidance"],"The opening argument distinguishes completeness from effective communication.","include every legal detail and yet leave ordinary readers unsure"),
 q("E10-Q7","RC2-F07","medium","Which statement is supported?","Readers should be able to find deadlines and required documents without searching through unnecessary detail",["All background explanation should be removed","Only frequent users need clear notices","Abbreviations should replace full terms"],"The author explicitly says dates and requirements should be visible early.","Dates, eligibility conditions and required documents should not be hidden"),
 q("E10-Q8","RC2-F08","easy","In context, “courtesy” most nearly means:","a considerate act",["a legal penalty","a technical rule","a filing system"],"The passage says plain language is more than politeness or consideration.","not merely a courtesy")
 ]
},
{
 id:"ENG008-RC2-R06",title:"A Town Tests Shared Bicycle Parking",genre:"current-affairs-report",
 text:`A town council installed ten shared bicycle parking zones near markets, offices and two bus stops to reduce bicycles being left across narrow footpaths. The six-week pilot did not provide bicycles; it only marked organised places where riders could park them.

Before the pilot, survey teams counted bicycles left outside designated racks during the evening peak. After the new zones were painted and signposted, the number of bicycles blocking the busiest footpaths fell by 28 percent.

The decline was not equal everywhere. Zones placed close to shop entrances were used more often than those located at the edge of large parking areas. Riders interviewed by the council said convenience mattered more than the colour or design of the markings.

The council also noted that some footpaths remained crowded because delivery scooters and temporary stalls occupied the same space. The bicycle zones therefore addressed only one source of obstruction.

Maintenance staff reported another issue: two zones became difficult to use after construction materials were stored beside them for several days. Once the materials were removed, bicycle use of those zones increased again.

Officials concluded that organised bicycle parking can improve footpath use when it is placed near where riders actually need to stop. They did not claim that painted zones alone could solve every obstruction problem.

The next phase will compare locations with similar pedestrian traffic and test whether adding simple wheel stands makes the zones easier to recognise and use over a longer period.`,
 questions:[
 q("R06-Q1","RC2-F01","easy","What change was observed after the bicycle zones were introduced?","Fewer bicycles blocked the busiest footpaths",["Bus use fell sharply","All bicycles moved to indoor parking","Delivery scooters disappeared"],"The second paragraph reports a 28 percent fall in bicycles blocking busy footpaths.","fell by 28 percent"),
 q("R06-Q2","RC2-F02","medium","What can be inferred about location choice?","Parking zones work better when they are close to riders' destinations",["Riders prefer zones far from shops","Paint colour is the main factor in use","All locations perform equally"],"Zones near shop entrances were used more often, and riders emphasised convenience.","convenience mattered more"),
 q("R06-Q3","RC2-F03","medium","Which summary is most accurate?","Organised bicycle parking reduced some footpath obstruction, but effectiveness depended on placement and other street uses",["The pilot eliminated footpath crowding","Bicycle parking failed because no bicycles were provided","Painted zones solved all transport problems"],"The report shows a measurable benefit with clear limits.","addressed only one source of obstruction"),
 q("R06-Q4","RC2-F04","hard","What is the tone of the report?","Cautiously positive and evidence-based",["Celebratory and absolute","Dismissive of cycling","Alarmist about markets"],"The report notes improvement while repeatedly limiting broader claims.","did not claim ... alone could solve every obstruction problem"),
 q("R06-Q5","RC2-F05","medium","Why does the report mention construction materials beside two zones?","To show that temporary local conditions can affect usage",["To prove the zones were unsafe","To explain why bicycles caused construction delays","To show the council cancelled the pilot"],"Use increased again after the obstruction was removed, showing a situational effect.","Once the materials were removed, bicycle use ... increased"),
 q("R06-Q6","RC2-F06","hard","Which conclusion is justified?","Well-placed parking zones can help, but they should be evaluated alongside other causes of footpath crowding",["Every town should use exactly ten zones","Bicycle parking is the main cause of pedestrian congestion","Wheel stands will certainly solve all remaining problems"],"The report separates bicycle obstruction from scooters, stalls and other factors.","only one source of obstruction"),
 q("R06-Q7","RC2-F07","medium","Which statement is supported?","The pilot organised parking space but did not provide bicycles",["All zones included metal stands","The council removed market stalls","The trial lasted one year"],"The opening paragraph explicitly states that the pilot marked parking places only.","did not provide bicycles"),
 q("R06-Q8","RC2-F08","easy","In context, “designated” most nearly means:","officially set aside for a purpose",["temporarily closed","privately owned","poorly maintained"],"The word refers to places specifically assigned for bicycle parking.","designated racks")
 ]
}
] as const;