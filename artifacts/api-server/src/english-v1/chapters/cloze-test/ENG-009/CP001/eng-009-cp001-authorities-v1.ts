import{ENG009_CP001_BREADTH_WAVE5}from"./eng-009-cp001-breadth-wave5";
import{ENG009_CP001_BREADTH_WAVE4}from"./eng-009-cp001-breadth-wave4";
import{ENG009_CP001_BREADTH_WAVE3}from"./eng-009-cp001-breadth-wave3";
import{ENG009_CP001_BREADTH_WAVE2}from"./eng-009-cp001-breadth-wave2";
import{ENG009_CP001_BREADTH_WAVE1}from"./eng-009-cp001-breadth-wave1";
export type Eng009Cp001Difficulty="easy"|"medium";
export type Eng009Cp001BlankKind="grammar"|"vocabulary"|"collocation"|"context";
export interface Eng009Cp001BlankV1{
 id:string;blankNo:1|2|3|4|5;difficulty:Eng009Cp001Difficulty;kind:Eng009Cp001BlankKind;
 answer:string;distractors:readonly[string,string,string];explanation:string;clue:string;
}
export interface Eng009Cp001PassageV1{
 id:string;title:string;topic:string;template:string;blanks:readonly Eng009Cp001BlankV1[];
}
const b=(id:string,blankNo:1|2|3|4|5,difficulty:Eng009Cp001Difficulty,kind:Eng009Cp001BlankKind,answer:string,distractors:readonly[string,string,string],explanation:string,clue:string):Eng009Cp001BlankV1=>({id,blankNo,difficulty,kind,answer,distractors,explanation,clue});

export const ENG009_CP001_PASSAGES_V1:readonly Eng009Cp001PassageV1[]=[
{
 id:"ENG009-SSC-C01",title:"The Village Reading Room",topic:"community learning",
 template:`A small reading room was opened near the village bus stand to give students a quiet place to study. At first, only a few students __(1)__ the room because many people did not know about it. The organisers then placed a notice outside the school and asked teachers to __(2)__ students about the facility. Within a month, attendance increased steadily. The room also began to receive donated newspapers and books, which made it more __(3)__ for different age groups. Volunteers kept a register so that they could understand which materials were used most __(4)__. This helped them decide what to purchase next. The project showed that a simple public facility can become useful when people know about it and when its resources are chosen __(5)__.`,
 blanks:[
 b("C01-B1",1,"easy","grammar","used",["use","using","uses"],"The sentence describes what students did in the past, so the simple past form 'used' is required.","At first ... the room"),
 b("C01-B2",2,"easy","vocabulary","inform",["ignore","divide","remove"],"'Inform students about the facility' means tell them that it exists and how it can be used.","asked teachers to ... students about the facility"),
 b("C01-B3",3,"medium","context","useful",["distant","silent","private"],"More kinds of reading material made the room more useful to different age groups.","newspapers and books ... for different age groups"),
 b("C01-B4",4,"medium","collocation","often",["early","apart","forward"],"'Used most often' is the natural expression for materials used most frequently.","which materials were used most ..."),
 b("C01-B5",5,"medium","context","carefully",["suddenly","loosely","rarely"],"The organisers used actual usage records to choose resources thoughtfully, so 'carefully' fits the meaning.","decide what to purchase next")
 ]
},
{
 id:"ENG009-SSC-C02",title:"Rainwater at School",topic:"water conservation",
 template:`A school in a dry area installed a simple rainwater harvesting system. Water from the roof was __(1)__ through pipes into a covered tank. The stored water was not used for drinking, but it was sufficient for cleaning and watering plants. Teachers explained that the system would not __(2)__ every water problem, yet it could reduce unnecessary use of treated water. Students were asked to check the tank after each rainfall and record how quickly it __(3)__. Their observations showed that even a short shower could add a noticeable amount of water. The activity also helped students understand that conservation is most effective when small steps are followed __(4)__. Over time, the school used less tap water for tasks that did not __(5)__ drinking-quality water.`,
 blanks:[
 b("C02-B1",1,"easy","grammar","collected",["collect","collecting","collects"],"The passive construction needs the past participle 'collected'.","Water ... was ... through pipes"),
 b("C02-B2",2,"medium","vocabulary","solve",["borrow","repeat","scatter"],"'Solve every water problem' fits the meaning that the system cannot fix all water-related difficulties.","would not ... every water problem"),
 b("C02-B3",3,"medium","context","filled",["argued","travelled","forgot"],"Students were checking how quickly the tank gained water after rainfall, so 'filled' fits.","check the tank after each rainfall"),
 b("C02-B4",4,"medium","collocation","consistently",["secretly","politely","roughly"],"Conservation works when small actions are followed regularly over time; 'consistently' expresses this.","small steps are followed ..."),
 b("C02-B5",5,"easy","context","require",["avoid","lend","divide"],"Cleaning and watering plants do not require drinking-quality water.","tasks that did not ... drinking-quality water")
 ]
},
{
 id:"ENG009-SSC-C03",title:"A Better Bus Queue",topic:"public transport",
 template:`Passengers at a busy bus stop often formed several small groups instead of one clear queue. This created confusion whenever a bus __(1)__. The local transport office painted a simple line on the pavement and placed a sign asking passengers to wait in order. During the first few days, staff members were present to __(2)__ the new arrangement. Soon, most passengers began following it without assistance. Boarding became faster because people no longer had to __(3)__ over who had arrived first. The change cost very little, but it worked because the instruction was easy to see and understand. It also showed that public behaviour can improve when a rule is both simple and __(4)__. The office later used the same idea at two other stops where crowding had caused __(5)__ problems.`,
 blanks:[
 b("C03-B1",1,"easy","grammar","arrived",["arrive","arriving","arrives"],"The passage narrates past events, so 'arrived' fits.","whenever a bus ..."),
 b("C03-B2",2,"medium","vocabulary","guide",["hide","cancel","measure"],"Staff were present to help passengers follow the new queue arrangement, so 'guide' is correct.","staff members were present to ... the new arrangement"),
 b("C03-B3",3,"medium","collocation","argue",["paint","borrow","count"],"'Argue over who had arrived first' is the natural expression for disagreement about queue order.","no longer had to ... over who had arrived first"),
 b("C03-B4",4,"medium","context","visible",["expensive","private","temporary"],"The passage says the instruction worked because it was easy to see and understand, making 'visible' the best fit.","easy to see and understand"),
 b("C03-B5",5,"easy","context","similar",["silent","ancient","formal"],"The office used the same solution at other stops with comparable crowding issues, so 'similar' fits.","used the same idea at two other stops")
 ]
},
{
 id:"ENG009-SSC-C04",title:"Repairing Old Computers",topic:"school technology",
 template:`A secondary school had several old computers that were no longer used because they had become slow. Instead of replacing all of them immediately, the school asked a technician to __(1)__ each machine. He found that some needed only extra memory and basic cleaning. After the repairs, these computers were good enough for typing practice and internet research. The school still replaced the machines that were too old to support current software, but it avoided spending money where repair was __(2)__. Teachers also created a simple schedule so that the restored computers would be used __(3)__ by different classes. The project did not prove that every old computer should be kept forever. Rather, it showed that equipment should be checked before it is __(4)__. A careful decision can save money without __(5)__ the quality of basic learning facilities.`,
 blanks:[
 b("C04-B1",1,"easy","vocabulary","inspect",["celebrate","borrow","translate"],"A technician would inspect each computer to find its condition and faults.","asked a technician to ... each machine"),
 b("C04-B2",2,"medium","context","practical",["invisible","foreign","formal"],"Repair was used where it was workable and sensible, so 'practical' fits.","avoided spending money where repair was ..."),
 b("C04-B3",3,"medium","collocation","fairly",["loudly","rarely","upward"],"A schedule shared the restored computers among classes, so 'fairly' fits the idea of equitable use.","used ... by different classes"),
 b("C04-B4",4,"easy","grammar","discarded",["discard","discarding","discards"],"After 'is', the passive construction requires the past participle 'discarded'.","before it is ..."),
 b("C04-B5",5,"medium","context","reducing",["drawing","announcing","copying"],"The sentence means money can be saved without lowering quality; 'reducing' fits.","without ... the quality")
 ]
},
{
 id:"ENG009-SSC-C05",title:"The Local History Walk",topic:"heritage education",
 template:`A group of students prepared a short history walk through their town. Instead of memorising a long list of dates, they selected five places that could __(1)__ an important change in the town's development. They spoke to older residents, checked local records and compared old photographs with the present streets. Their teacher reminded them that memories can be valuable but should be __(2)__ with other evidence when possible. The final walk included a railway building, an old market, a public well, a school and a former workshop. At each stop, students explained not only what had happened there but also why it __(3)__. This made the walk easier to follow because the places were connected by one clear story. The activity showed that local history becomes more __(4)__ when people can link facts to familiar surroundings. It also taught the students to use evidence __(5)__.`,
 blanks:[
 b("C05-B1",1,"medium","vocabulary","represent",["cancel","borrow","hide"],"'Represent an important change' means stand for or illustrate that change.","places that could ... an important change"),
 b("C05-B2",2,"medium","context","checked",["ignored","painted","delayed"],"Memories should be compared with records and other evidence, so 'checked' fits.","with other evidence when possible"),
 b("C05-B3",3,"easy","context","mattered",["floated","whispered","borrowed"],"Students explained why each event or place was important, so 'mattered' is correct.","not only what had happened ... but also why it ..."),
 b("C05-B4",4,"medium","vocabulary","meaningful",["empty","distant","accidental"],"Linking facts to familiar places makes history more meaningful to learners.","link facts to familiar surroundings"),
 b("C05-B5",5,"medium","collocation","carefully",["randomly","briefly","outward"],"'Use evidence carefully' fits the lesson about checking memories against records.","taught the students to use evidence ...")
 ]
},
{
 id:"ENG009-SSC-C06",title:"Reducing Food Waste",topic:"food management",
 template:`The manager of a hostel kitchen noticed that large amounts of cooked food were being thrown away after dinner. Rather than simply preparing less food every day, the staff began to record which dishes were left __(1)__. They also compared weekday and weekend attendance. The records showed that waste was highest on evenings when many students went home but the kitchen prepared the usual quantity. The manager therefore adjusted meal estimates according to expected attendance. Portions were also served in moderate amounts, while students could return for more if they were still __(2)__. Within a few weeks, waste fell noticeably. The kitchen did not remove popular dishes or reduce food below reasonable levels; it simply planned more __(3)__. The change showed that waste can often be reduced by understanding when and why it __(4)__, rather than by making one fixed cut. Accurate records made the new system easier to __(5)__.`,
 blanks:[
 b("C06-B1",1,"medium","collocation","uneaten",["unread","unclear","unequal"],"'Left uneaten' is the natural expression for cooked food that remains after a meal.","dishes were left ..."),
 b("C06-B2",2,"easy","context","hungry",["narrow","formal","absent"],"Students could take more food if the first portion was not enough, so 'hungry' fits.","return for more if they were still ..."),
 b("C06-B3",3,"medium","vocabulary","accurately",["secretly","softly","loosely"],"The kitchen used attendance records to estimate quantities more accurately.","adjusted meal estimates according to expected attendance"),
 b("C06-B4",4,"medium","grammar","occurs",["occur","occurred","occurring"],"The sentence states a general principle, so the singular present form 'occurs' agrees with 'it'.","when and why it ..."),
 b("C06-B5",5,"medium","context","maintain",["scatter","borrow","erase"],"Good records made it easier to continue the improved planning system over time.","made the new system easier to ...")
 ]
},
{
 id:"ENG009-SSC-C07",title:"A Safer School Crossing",topic:"road safety",
 template:`Parents had complained that children found it difficult to cross a busy road outside a primary school. The road was not especially wide, but traffic moved quickly during the morning rush. The local authority first collected traffic data rather than choosing a solution __(1)__. It found that the greatest risk occurred during a short period just before classes began. A crossing guard was therefore placed there during that period, and warning signs were moved to positions where drivers could see them __(2)__. Teachers also reminded children to cross only at the marked point. After several weeks, drivers were slowing earlier and the crossing became more orderly. The improvement came from combining road design, supervision and clear behaviour rules instead of relying on a __(3)__ measure. The authority continued to observe the crossing because conditions could __(4)__ when school timings or traffic patterns changed. Regular review helped ensure that the solution remained __(5)__.`,
 blanks:[
 b("C07-B1",1,"medium","context","immediately",["politely","privately","equally"],"The authority collected data before acting, so it did not choose a solution immediately.","first collected traffic data rather than choosing a solution ..."),
 b("C07-B2",2,"easy","collocation","clearly",["rarely","roughly","separately"],"Signs need to be seen clearly by drivers.","positions where drivers could see them ..."),
 b("C07-B3",3,"medium","vocabulary","single",["wooden","silent","narrow"],"The passage says several measures worked together rather than one measure alone.","combining ... instead of relying on a ... measure"),
 b("C07-B4",4,"medium","grammar","change",["changed","changes","changing"],"After the modal 'could', the base form 'change' is required.","conditions could ..."),
 b("C07-B5",5,"medium","context","effective",["ancient","private","accidental"],"Regular review checks whether the safety solution continues to work, so 'effective' fits.","ensure that the solution remained ...")
 ]
},
{
 id:"ENG009-SSC-C08",title:"The Seed Exchange",topic:"community gardening",
 template:`Gardeners in a small neighbourhood started a seed exchange so that people could share varieties they had grown successfully. Each packet carried the plant name, the year of collection and a short note about growing conditions. This information was important because seeds from an unknown source may not __(1)__ as expected. The organisers did not charge money; instead, participants were encouraged to return some seeds after a successful season. Over time, the exchange developed a collection of vegetables and flowers suited to local conditions. New gardeners also benefited from the practical advice written on the packets. The scheme worked because sharing was combined with simple record-keeping. Without labels, the collection would have become difficult to __(2)__. The organisers also removed very old seeds whose ability to grow had become __(3)__. This kept the collection useful rather than merely large. The exchange showed how a small community project can __(4)__ knowledge as well as materials. Its success depended on participants contributing information __(5)__.`,
 blanks:[
 b("C08-B1",1,"medium","context","grow",["argue","travel","borrow"],"Seeds are expected to grow; unknown source can affect whether they do so as expected.","seeds ... may not ... as expected"),
 b("C08-B2",2,"medium","vocabulary","manage",["celebrate","divide","invent"],"Labels make the collection easier to organise and manage.","Without labels, the collection would have become difficult to ..."),
 b("C08-B3",3,"medium","context","uncertain",["famous","polite","bright"],"Very old seeds may or may not germinate reliably, so their ability to grow is uncertain.","very old seeds whose ability to grow had become ..."),
 b("C08-B4",4,"easy","vocabulary","share",["hide","cancel","reduce"],"The project shares growing knowledge as well as seeds.","can ... knowledge as well as materials"),
 b("C08-B5",5,"medium","collocation","accurately",["suddenly","loosely","silently"],"Useful labels depend on correct information, so 'accurately' fits.","contributing information ...")
 ]
},
{
 id:"ENG009-SSC-C09",title:"The Restored Pond",topic:"environment",
 template:`A neglected pond near a residential area had gradually filled with litter and weeds. Residents first organised a clean-up, but they soon realised that removing waste once would not be __(1)__. New rubbish entered the pond whenever nearby drains overflowed. The local council therefore placed screens over the main drain outlets and arranged regular collection of trapped waste. Residents also planted native vegetation around part of the bank to reduce soil erosion. Within a year, the pond looked cleaner and attracted more birds. The improvement was not the result of one large action. It came from addressing the sources of the problem and repeating maintenance __(2)__. The project also showed why environmental work needs patience: visible change may be slow even when the right steps are being __(3)__. Volunteers continued to record litter and water levels so that they could identify new problems __(4)__. Their records made future decisions more __(5)__.`,
 blanks:[
 b("C09-B1",1,"medium","context","enough",["early","narrow","private"],"A one-time clean-up would not be sufficient because new waste kept entering the pond.","removing waste once would not be ..."),
 b("C09-B2",2,"medium","collocation","regularly",["loosely","upward","nearly"],"Maintenance needs to be repeated at regular intervals, so 'regularly' fits.","repeating maintenance ..."),
 b("C09-B3",3,"easy","grammar","taken",["take","taking","takes"],"The passive form 'are being taken' is grammatically required.","steps are being ..."),
 b("C09-B4",4,"medium","context","early",["secretly","softly","rarely"],"Records help detect problems before they become larger, so 'early' fits.","identify new problems ..."),
 b("C09-B5",5,"medium","vocabulary","informed",["empty","accidental","distant"],"Records provide evidence, making later decisions better informed.","records made future decisions more ...")
 ]
},
{
 id:"ENG009-SSC-C10",title:"The Mobile Book Van",topic:"public library",
 template:`A district library introduced a small book van for villages that were far from its main building. The van followed a fixed weekly route and stopped at each village for two hours. At first, librarians carried mostly children's books, but borrowing records soon showed that adults also wanted practical books on farming, health and employment. The selection was therefore __(1)__ to include these subjects. Each borrower received a simple card, and books could be returned during the next visit. The fixed route made the service easy to __(2)__ because people knew when the van would arrive. Librarians also kept a small reserve of frequently requested titles. This reduced the number of visitors who left without finding what they needed. The service remained modest, but it __(3)__ access for people who could not easily travel to town. Its success depended less on having a huge collection than on choosing books that matched local __(4)__. The borrowing records helped the library do this more __(5)__.`,
 blanks:[
 b("C10-B1",1,"easy","grammar","expanded",["expand","expanding","expands"],"The passive construction 'was expanded' requires the past participle.","The selection was therefore ..."),
 b("C10-B2",2,"medium","context","predict",["erase","divide","borrow"],"A fixed weekly route lets users know when the van will arrive, making the service predictable.","fixed route ... people knew when the van would arrive"),
 b("C10-B3",3,"medium","vocabulary","improved",["hidden","repeated","narrowed"],"The van made library access better for remote users, so 'improved' fits.","access for people who could not easily travel"),
 b("C10-B4",4,"medium","collocation","needs",["colours","distances","shadows"],"'Match local needs' is the natural expression for selecting useful materials.","books that matched local ..."),
 b("C10-B5",5,"medium","context","effectively",["privately","roughly","rarely"],"Borrowing records helped the library choose suitable books more effectively.","borrowing records helped the library do this more ...")
 ]
}
,
...ENG009_CP001_BREADTH_WAVE1
,
...ENG009_CP001_BREADTH_WAVE2
,
...ENG009_CP001_BREADTH_WAVE3
,
...ENG009_CP001_BREADTH_WAVE4
,
...ENG009_CP001_BREADTH_WAVE5
];

export const ENG009_CP001_BLANKS_V1=ENG009_CP001_PASSAGES_V1.flatMap(p=>p.blanks.map(blank=>({passage:p,blank})));
