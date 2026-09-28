import{ENG009_CP002_BREADTH_WAVE4}from"./eng-009-cp002-breadth-wave4";
import{ENG009_CP002_BREADTH_WAVE3}from"./eng-009-cp002-breadth-wave3";
import{ENG009_CP002_BREADTH_WAVE2}from"./eng-009-cp002-breadth-wave2";
import{ENG009_CP002_BREADTH_WAVE1}from"./eng-009-cp002-breadth-wave1";
export type Eng009Cp002Difficulty="medium"|"hard";
export type Eng009Cp002BlankKind="grammar"|"vocabulary"|"collocation"|"context"|"discourse";
export interface Eng009Cp002BlankV1{
 id:string;blankNo:1|2|3|4|5;difficulty:Eng009Cp002Difficulty;kind:Eng009Cp002BlankKind;
 answer:string;distractors:readonly[string,string,string];explanation:string;clue:string;
}
export interface Eng009Cp002PassageV1{
 id:string;title:string;topic:string;template:string;blanks:readonly Eng009Cp002BlankV1[];
}
const b=(id:string,blankNo:1|2|3|4|5,difficulty:Eng009Cp002Difficulty,kind:Eng009Cp002BlankKind,answer:string,distractors:readonly[string,string,string],explanation:string,clue:string):Eng009Cp002BlankV1=>({id,blankNo,difficulty,kind,answer,distractors,explanation,clue});

export const ENG009_CP002_PASSAGES_V1:readonly Eng009Cp002PassageV1[]=[
{
 id:"ENG009-SSC-A01",title:"The Cost of Free Delivery",topic:"consumer behaviour",
 template:`Online stores often advertise free delivery as a simple benefit, but the effect on buying behaviour can be more complex. A customer who wants only one low-priced item may add another product merely to __(1)__ the minimum order value. From the seller's perspective, this can increase the average size of each order. However, the strategy does not automatically improve profit if the extra discount and delivery cost __(2)__ the additional revenue. Some retailers therefore test different thresholds in different regions. They study not only sales but also return rates, delivery distances and the types of products added at the last moment. The most useful threshold is not always the one that produces the highest number of orders. It is the one that encourages useful additional purchases without __(3)__ costs too sharply. This is why a policy that appears simple to customers may depend on several calculations behind the scenes. Businesses that change the threshold should also explain the new rule clearly, __(4)__ regular customers may assume that the earlier condition still applies. A well-designed offer can influence behaviour, but only when its financial effect is measured __(5)__.`,
 blanks:[
 b("A01-B1",1,"medium","collocation","reach",["meet","touch","cross"],"'Reach the minimum order value' is the natural phrase here.","minimum order value"),
 b("A01-B2",2,"hard","context","exceed",["match","follow","balance"],"If the extra costs are more than the extra revenue, profit may not improve. So 'exceed' fits.","delivery cost ... additional revenue"),
 b("A01-B3",3,"hard","vocabulary","raising",["lifting","expanding","growing"],"'Raising costs' means making costs higher.","without ... costs too sharply"),
 b("A01-B4",4,"medium","discourse","otherwise",["therefore","similarly","instead"],"'Otherwise' shows what may happen if the new rule is not explained.","explain the new rule clearly ... customers may assume"),
 b("A01-B5",5,"hard","context","carefully",["closely","exactly","narrowly"],"The passage says the offer must be checked from several angles, so 'carefully' fits.","financial effect is measured ...")
 ]
},
{
 id:"ENG009-SSC-A02",title:"Why Small Errors Matter",topic:"data quality",
 template:`A spreadsheet may contain thousands of correct entries and still produce a misleading result if a small number of important cells are wrong. This is because errors do not all have the same __(1)__. A misspelt label may be harmless, while an incorrect formula can alter an entire summary. For this reason, careful checking should focus first on cells that influence many later calculations. Reviewers can also compare totals with earlier reports, look for sudden changes and test whether formulas have been copied consistently. These checks do not guarantee that every mistake will be found, but they make serious errors more likely to be __(2)__. Good data practice also requires a record of corrections. If a number is changed without explanation, another user may later restore the old value, believing the change was accidental. A short note can prevent this and make the editing process more __(3)__. In large files, such discipline is especially useful because several people may work on the same document. The main lesson is that data quality depends not only on entering information correctly, but also on designing a process that makes errors easier to __(4)__ and corrections easier to __(5)__.`,
 blanks:[
 b("A02-B1",1,"hard","vocabulary","impact",["effect","importance","weight"],"Some errors cause more harm than others. 'Impact' means effect or consequence.","errors do not all have the same ..."),
 b("A02-B2",2,"medium","grammar","detected",["detect","detecting","detects"],"After 'to be', we need the past participle 'detected'.","more likely to be ..."),
 b("A02-B3",3,"hard","context","transparent",["visible","obvious","open"],"'Transparent' means the changes and reasons are clear to others.","make the editing process more ..."),
 b("A02-B4",4,"medium","collocation","spot",["notice","observe","watch"],"'Spot' means notice or find an error.","errors easier to ..."),
 b("A02-B5",5,"hard","discourse","trace",["follow","track","locate"],"'Trace' means follow the history of a correction.","corrections easier to ...")
 ]
},
{
 id:"ENG009-SSC-A03",title:"The Value of Public Benches",topic:"urban design",
 template:`Public benches may seem like minor pieces of street furniture, yet their placement can affect how comfortable a public space feels. A bench placed in direct afternoon sun may remain empty even when it is technically available. Another bench may be popular because it faces activity without blocking pedestrian movement. Good placement therefore depends on how people actually use the area, not merely on where empty space __(1)__. Designers sometimes observe a site for several days before deciding where seating should go. They note shade, noise, foot traffic and the needs of older people or parents with children. Such observation can reveal patterns that a plan on paper may __(2)__. It can also prevent money from being spent on benches that are rarely used. The lesson is not that every public space needs more seating, but that existing seating should be placed __(3)__. A small change in location can sometimes improve use more than adding another bench nearby. This is especially true where space is limited and every installation must be __(4)__. Thoughtful design begins with attention to behaviour and ends with choices that are practical as well as __(5)__.`,
 blanks:[
 b("A03-B1",1,"hard","context","exists",["remains","appears","occurs"],"'Exists' simply means that empty space is available there.","where empty space ..."),
 b("A03-B2",2,"hard","vocabulary","miss",["ignore","avoid","omit"],"A paper plan may fail to notice real usage patterns. So 'miss' fits.","patterns that a plan on paper may ..."),
 b("A03-B3",3,"medium","collocation","strategically",["carefully","deliberately","sensibly"],"'Strategically' means placed where it will work best.","seating should be placed ..."),
 b("A03-B4",4,"hard","context","justified",["explained","approved","supported"],"If space is limited, every bench needs a good reason to be there. So 'justified' fits.","every installation must be ..."),
 b("A03-B5",5,"medium","discourse","effective",["efficient","attractive","useful"],"The design should be practical and also work well. So 'effective' fits.","practical as well as ...")
 ]
},
{
 id:"ENG009-SSC-A04",title:"Learning from Near Misses",topic:"safety management",
 template:`A near miss is an event in which something almost goes wrong but no serious harm occurs. Because there is no injury or damage, such events are sometimes __(1)__ and quickly forgotten. This is a mistake. A near miss can reveal the same weakness that might later contribute to a real accident. For example, if a heavy box falls from a shelf but lands in an empty area, the absence of injury does not make the loose shelf safe. Recording the incident allows managers to examine what failed and correct it before the consequence becomes more __(2)__. Effective reporting systems should therefore be easy to use and should not punish workers simply for describing hazards. If employees fear blame, they may remain silent, leaving the organisation with less information about actual risk. The value of a near-miss report lies in the opportunity to act __(3)__. It turns an event with no serious outcome into a warning that can support prevention. Organisations that review these reports regularly are better able to identify repeated patterns and __(4)__ action where it is most needed. Safety improves when the absence of harm is not __(5)__ for the absence of danger.`,
 blanks:[
 b("A04-B1",1,"medium","vocabulary","dismissed",["ignored","overlooked","rejected"],"'Dismissed' means treated as unimportant and ignored.","sometimes ... and quickly forgotten"),
 b("A04-B2",2,"hard","context","serious",["severe","dangerous","harmful"],"The sentence means the result may become worse. So 'serious' fits.","before the consequence becomes more ..."),
 b("A04-B3",3,"hard","collocation","preventively",["promptly","carefully","responsibly"],"'Preventively' means acting early to stop an accident from happening.","opportunity to act ..."),
 b("A04-B4",4,"medium","vocabulary","target",["direct","focus","place"],"'Target action' means focus action on the areas that need it most.","... action where it is most needed"),
 b("A04-B5",5,"hard","discourse","mistaken",["taken","confused","accepted"],"'Mistaken for' means wrongly treated as the same thing.","not ... for the absence of danger")
 ]
},
{
 id:"ENG009-SSC-A05",title:"When More Choice Becomes Harder",topic:"decision making",
 template:`Consumers often say they want more choice, and in many situations variety is genuinely useful. However, an extremely large number of similar options can make a decision harder rather than easier. A shopper comparing fifty nearly identical products may spend more time identifying small differences and may still feel less __(1)__ about the final decision. This does not mean that choice is bad. It means that useful choice should be organised in a way that helps people compare options meaningfully. Clear categories, simple filters and honest descriptions can reduce the effort required to search. Good design therefore does not merely add options; it also helps users understand how those options __(2)__. In some cases, removing duplicate or confusing alternatives can improve the experience without reducing meaningful variety. The challenge is to preserve real differences while avoiding unnecessary complexity. A well-designed marketplace gives customers enough information to decide, but not so much disorder that comparison becomes __(3)__. This balance is especially important online, where users can leave a page immediately if the task feels too demanding. Choice creates value when it is both broad and __(4)__. Without structure, abundance can become less of a benefit and more of a __(5)__.`,
 blanks:[
 b("A05-B1",1,"hard","context","confident",["certain","secure","comfortable"],"'Confident' means sure about the choice made.","feel less ... about the final decision"),
 b("A05-B2",2,"medium","vocabulary","differ",["vary","change","separate"],"'Differ' means be different from one another.","how those options ..."),
 b("A05-B3",3,"hard","collocation","burdensome",["difficult","confusing","heavy"],"'Burdensome' means the comparison starts to feel too difficult or tiring.","comparison becomes ..."),
 b("A05-B4",4,"medium","discourse","manageable",["limited","ordered","simple"],"'Manageable' means the choice is still easy enough to handle.","both broad and ..."),
 b("A05-B5",5,"hard","vocabulary","burden",["problem","cost","barrier"],"'Burden' means something that becomes difficult to deal with.","more of a ...")
 ]
},
{
 id:"ENG009-SSC-A06",title:"Why Maintenance Is Easy to Ignore",topic:"infrastructure",
 template:`New infrastructure attracts attention because the result is visible: a road opens, a building is completed or a new system begins operating. Maintenance receives less attention because its success often appears as the absence of failure. A roof that does not leak or a pump that continues working may seem unremarkable, even though regular maintenance __(1)__ that reliability. This creates a planning problem. When budgets are tight, maintenance can be postponed because the immediate consequences are not always obvious. Yet delayed repairs often become more expensive later. A minor crack, leak or loose connection can gradually damage other parts of the system. Good asset management therefore requires organisations to treat maintenance as a continuing responsibility rather than an emergency response. Inspection schedules, service records and replacement plans help make future needs more __(2)__. They also allow managers to compare the cost of early action with the cost of failure. The aim is not to repair everything at once but to act before small problems become __(3)__. In this sense, maintenance is a form of risk management. Its value is easiest to appreciate when decision-makers look beyond visible new projects and consider the long-term performance of what already __(4)__. Reliable services depend not only on what is built, but on how well it is __(5)__.`,
 blanks:[
 b("A06-B1",1,"hard","grammar","supports",["support","supported","supporting"],"'Maintenance' is singular, so we use 'supports'.","maintenance ... that reliability"),
 b("A06-B2",2,"hard","context","predictable",["visible","certain","measurable"],"Records help people know future needs in advance, so 'predictable' fits.","make future needs more ..."),
 b("A06-B3",3,"medium","collocation","major",["large","serious","important"],"'Major' means large or serious.","small problems become ..."),
 b("A06-B4",4,"medium","grammar","exists",["exist","existed","existing"],"'What already exists' is the correct present-tense form here.","what already ..."),
 b("A06-B5",5,"hard","vocabulary","maintained",["managed","handled","serviced"],"'Maintained' means kept in good working condition.","how well it is ...")
 ]
},
{
 id:"ENG009-SSC-A07",title:"The Hidden Cost of Interruptions",topic:"work productivity",
 template:`A short interruption may last only a minute, but its effect on concentrated work can continue much longer. When a person stops a difficult task to answer a message, attention must later be __(1)__ to the original problem. This mental shift takes time, especially when the task involves several connected ideas. For this reason, some teams create periods during which routine messages are delayed unless they are urgent. The aim is not to eliminate communication, but to separate work that requires deep concentration from work that benefits from quick response. Such arrangements can fail if the definition of urgent is too __(2)__, because almost every message may then be treated as an exception. They can also fail if employees feel unable to ask for help when they genuinely need it. A useful system therefore needs both protected focus time and clear rules for interruption. The goal is to reduce unnecessary switching without making collaboration __(3)__. Measuring the effect is not simple, because productivity cannot always be captured by counting messages or hours. Still, fewer avoidable interruptions can make complex work feel more __(4)__ and can help people complete tasks with greater __(5)__.`,
 blanks:[
 b("A07-B1",1,"hard","collocation","restored",["returned","recovered","redirected"],"'Restored' means bringing attention back to the original task.","attention must later be ... to the original problem"),
 b("A07-B2",2,"hard","context","broad",["loose","wide","general"],"If the meaning of 'urgent' is too wide, almost every message may seem urgent.","definition of urgent is too ..."),
 b("A07-B3",3,"medium","discourse","difficult",["slow","formal","limited"],"The aim is to cut interruptions without making teamwork difficult.","without making collaboration ..."),
 b("A07-B4",4,"hard","vocabulary","manageable",["possible","comfortable","stable"],"'Manageable' means easier to handle.","complex work feel more ..."),
 b("A07-B5",5,"medium","collocation","consistency",["accuracy","speed","confidence"],"'Consistency' means doing the work in a more steady and reliable way.","with greater ...")
 ]
},
{
 id:"ENG009-SSC-A08",title:"The Limits of Average Ratings",topic:"online reviews",
 template:`A high average rating can be useful when comparing products, but the number alone can hide important information. A product with a rating of 4.8 from twelve reviews may be less well tested than another with 4.6 from several thousand. The first score may change sharply after only a few new reviews, while the second is likely to be more __(1)__. Ratings can also be affected by who chooses to leave a review. People with very strong positive or negative experiences may be more likely to comment than those with ordinary experiences. This does not make ratings useless, but it means they should be read with other evidence. Buyers can look at the number of reviews, the date of recent comments and whether repeated complaints describe the same issue. They can also distinguish between problems with the product and problems with delivery or packaging. A thoughtful comparison therefore treats the average as one signal rather than a complete judgment. The most informative review pattern is not always the highest score; it may be the one that is most __(2)__ across many users and over time. Platforms can support better decisions by showing review counts clearly and by making verified purchases easier to identify. Such features do not remove bias, but they make the evidence easier to __(3)__. In the end, good decisions come from interpreting ratings __(4)__ rather than accepting them __(5)__.`,
 blanks:[
 b("A08-B1",1,"hard","vocabulary","stable",["fixed","steady","secure"],"With many reviews, the rating changes less easily. So 'stable' fits.","more ..."),
 b("A08-B2",2,"hard","context","consistent",["uniform","reliable","balanced"],"'Consistent' means showing a similar pattern across users and time.","most ... across many users and over time"),
 b("A08-B3",3,"medium","collocation","interpret",["judge","read","compare"],"'Interpret' means understand what the evidence is telling us.","evidence easier to ..."),
 b("A08-B4",4,"hard","discourse","critically",["carefully","deeply","closely"],"'Critically' means thinking carefully about the rating before trusting it.","interpreting ratings ..."),
 b("A08-B5",5,"medium","collocation","blindly",["fully","directly","quickly"],"'Blindly' means accepting something without checking or thinking about it.","accepting them ...")
 ]
},
{
 id:"ENG009-SSC-A09",title:"Why Good Signs Use Fewer Words",topic:"public communication",
 template:`A public sign has only a few seconds to attract attention and communicate its message. Adding more words may seem helpful, but too much text can make the main instruction harder to notice. Good signs therefore separate essential information from supporting detail. A large heading might state the action required, while smaller text explains an exception or gives a contact number. The wording should also match the place. A complex paragraph that works on a website may fail beside a busy road, where people cannot stop to read carefully. Designers must therefore consider both content and viewing conditions. The best sign is not necessarily the shortest; it is the one that communicates the necessary message with no __(1)__ difficulty. Colour, spacing and symbols can also support understanding, but they should not replace clear language where words are needed. Testing can reveal whether people interpret the sign as intended. If users repeatedly misunderstand the same phrase, the problem may lie in the wording rather than in the reader. Effective communication requires the writer to reduce avoidable ambiguity and make the intended action immediately __(2)__. This is especially important in safety settings, where hesitation can matter. A good sign respects the reader's limited time and attention by making the important information __(3)__. In that sense, simplicity is not the absence of detail; it is the careful __(4)__ of detail so that meaning remains __(5)__.`,
 blanks:[
 b("A09-B1",1,"hard","context","unnecessary",["additional","avoidable","extra"],"'Unnecessary' means difficulty that is not needed.","with no ... difficulty"),
 b("A09-B2",2,"medium","collocation","clear",["visible","obvious","direct"],"'Clear' means easy to understand at once.","intended action immediately ..."),
 b("A09-B3",3,"hard","vocabulary","prominent",["obvious","central","noticeable"],"'Prominent' means easy to notice.","important information ..."),
 b("A09-B4",4,"hard","discourse","selection",["reduction","arrangement","removal"],"'Selection' means choosing only the details that are really needed.","careful ... of detail"),
 b("A09-B5",5,"medium","context","clear",["simple","visible","direct"],"The aim is to keep the meaning easy to understand. So 'clear' fits.","so that meaning remains ...")
 ]
},
{
 id:"ENG009-SSC-A10",title:"The Problem with One-Day Surveys",topic:"research methods",
 template:`A survey carried out on a single day can provide useful information, but it may not represent what usually happens. Weather, holidays, special events or temporary disruptions can influence behaviour on that particular day. For example, a transport survey conducted during heavy rain may show unusually high demand for buses and unusually low cycling. If planners treat those figures as typical, they may __(1)__ the long-term pattern. Repeating the survey on several ordinary days can reduce this risk. Researchers can also compare the results with ticket records, traffic counts or earlier studies. None of these sources is perfect, but together they provide a broader basis for judgment. The key issue is not that one-day surveys are worthless; it is that their limitations should be __(2)__. Good analysis asks whether unusual conditions may have affected the result and whether the same pattern appears elsewhere. This helps prevent a temporary situation from being mistaken for a permanent trend. In research, collecting more data is useful only when the additional evidence is relevant and comparable. Careful design therefore matters as much as simple quantity. A strong conclusion is one that matches the __(3)__ of the evidence. It neither claims too little nor __(4)__ what the data can support. The purpose of repeated measurement is to make conclusions more __(5)__, not merely to make reports longer.`,
 blanks:[
 b("A10-B1",1,"hard","vocabulary","misread",["misjudge","misstate","mistake"],"'Misread' means understand the pattern wrongly.","may ... the long-term pattern"),
 b("A10-B2",2,"medium","grammar","acknowledged",["acknowledge","acknowledging","acknowledges"],"After 'should be', we need 'acknowledged'.","limitations should be ..."),
 b("A10-B3",3,"hard","context","strength",["size","amount","quality"],"The conclusion should be as strong as the evidence allows. So 'strength' fits.","matches the ... of the evidence"),
 b("A10-B4",4,"hard","collocation","exceeds",["crosses","extends","surpasses"],"'Exceeds' means claims more than the data can support.","nor ... what the data can support"),
 b("A10-B5",5,"medium","discourse","reliable",["precise","detailed","complete"],"Repeating the measurement helps make the conclusion more reliable.","conclusions more ...")
 ]
}
,
...ENG009_CP002_BREADTH_WAVE1
,
...ENG009_CP002_BREADTH_WAVE2
,
...ENG009_CP002_BREADTH_WAVE3
,
...ENG009_CP002_BREADTH_WAVE4
];

export const ENG009_CP002_BLANKS_V1=ENG009_CP002_PASSAGES_V1.flatMap(p=>p.blanks.map(blank=>({passage:p,blank})));
