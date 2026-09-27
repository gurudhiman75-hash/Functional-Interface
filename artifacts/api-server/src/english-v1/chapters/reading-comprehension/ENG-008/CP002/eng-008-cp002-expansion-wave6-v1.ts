import type{Eng008Cp002PassageV1}from"./eng-008-cp002-authorities-v1";
const q=(id:string,familyId:any,difficulty:any,question:string,correctAnswer:string,distractors:readonly[string,string,string],explanation:string,evidence:string)=>({id,familyId,difficulty,question,correctAnswer,distractors,explanation,evidence});
export const ENG008_CP002_EXPANSION_WAVE6_V1:readonly Eng008Cp002PassageV1[]=[
{
 id:"ENG008-RC2-E16",title:"A Public Form Should Ask Only for What It Needs",genre:"editorial",
 text:`Public forms often grow over time. A field is added for one special case, another for an internal report, and eventually a simple application becomes difficult for ordinary users to complete.

Every field has a cost. It takes time to read, answer and verify, and unclear questions increase the chance of incomplete submissions. A form should therefore ask whether each item is necessary for deciding the application, contacting the user or meeting a legal requirement.

This does not mean removing useful detail. Some services genuinely need documents, declarations or supporting information. The important distinction is between information that helps make the decision and information collected simply because it has always been collected.

Form design should also consider sequence. Basic eligibility questions can come first so applicants do not spend time completing several pages before discovering that they do not qualify.

Plain language matters for the same reason. A short question that uses an unfamiliar technical term can still create confusion.

Good forms reduce unnecessary effort for both applicants and staff. When irrelevant fields disappear and instructions become clearer, fewer corrections are needed later. Simplicity is therefore not about making the process less serious; it is about making every requested piece of information earn its place.

 Digital forms create the same problem in a different way. Because adding a field costs almost nothing technically, organisations may keep collecting information long after the original reason has disappeared. Periodic review is therefore useful: departments can ask which fields were actually used in decisions, which caused repeated confusion and which can be removed or made optional. This also improves privacy because information that is never needed does not have to be stored.`,
 questions:[
 q("E16-Q1","RC2-F01","easy","What question should designers ask about each form field?","Whether it is necessary for the decision, contact or legal requirement",["Whether it makes the form longer","Whether every old form used it","Whether it looks official"],"The passage lists these reasons directly. The cited passage detail directly supports this answer.","necessary for deciding the application"),
 q("E16-Q2","RC2-F02","medium","What can be inferred about long forms?","Some length may come from information that is no longer necessary",["Every long form is illegal","Long forms are always more accurate","Applicants prefer more fields"],"The author says forms can accumulate fields over time without rechecking need.","grow over time"),
 q("E16-Q3","RC2-F03","medium","Which summary is most accurate?","Public forms should collect necessary information clearly and in a logical order",["Forms should ask for as much data as possible","Technical language improves accuracy","Eligibility should be checked last"],"The passage focuses on necessity, sequencing and clarity.","make every requested piece of information earn its place"),
 q("E16-Q4","RC2-F04","hard","What is the author's tone?","Practical and reform-oriented",["Hostile toward government forms","Humorous","Indifferent"],"The passage proposes specific design principles.","should therefore ask"),
 q("E16-Q5","RC2-F05","medium","Why does the author mention eligibility questions first?","To avoid making ineligible applicants complete unnecessary pages",["To hide legal requirements","To increase form length","To reduce staff contact"],"The passage explicitly links sequence with avoiding wasted effort.","before discovering that they do not qualify"),
 q("E16-Q6","RC2-F06","hard","Which conclusion follows most logically?","Collecting extra information can create work without improving the decision",["More fields always improve decisions","Plain language removes legal duties","Short forms need no verification"],"The author argues that every field should justify its cost.","Every field has a cost"),
 q("E16-Q7","RC2-F07","medium","Which statement is supported?","Some services genuinely require supporting documents",["All documents should be removed","Technical terms should never appear","Applicants should guess missing information"],"The third paragraph states this directly. The cited passage detail directly supports this answer.","Some services genuinely need documents"),
 q("E16-Q8","RC2-F08","easy","In context, “sequence” most nearly means:","the order in which steps or questions appear",["the size of a form","the colour of a page","a legal signature"],"The passage discusses which questions should come first.","consider sequence")
 ]
},
{
 id:"ENG008-RC2-E17",title:"A Good Warning Should Explain the Risk, Not Just Display a Symbol",genre:"editorial",
 text:`Warning symbols are useful because they can attract attention quickly, but a symbol alone may not tell every user what the danger is or what action to take.

This matters when the same shape or colour is used in different settings. A person may recognise that something is hazardous without knowing whether the risk involves heat, electricity, chemicals or moving machinery.

A good warning therefore combines visibility with enough explanation to support action. A short phrase such as “high voltage—keep clear” communicates both the hazard and the response.

Too much detail can also weaken a warning if the urgent message disappears inside several paragraphs. Additional instructions can be placed nearby, but the first line should answer the most immediate question: what is dangerous and what should I do?

Testing matters because designers are often familiar with the system. A symbol that seems obvious to an engineer may be unfamiliar to a visitor or new employee.

Warnings should also be reviewed after incidents or near misses. If people repeatedly misunderstand the same sign, the problem may be in the communication rather than in the user's attention.

Good safety design does not choose between symbols and words. It uses each for what it does best: symbols attract attention quickly, while short text gives the meaning needed for safe action.

 Accessibility should be part of the same review. A warning that depends only on colour may fail for some users, while a small label placed too high may be difficult to read. Combining shape, contrast, short text and placement reduces dependence on any one signal. The aim is not to make every sign complex. It is to make the essential warning understandable under realistic conditions, including poor light, distance or unfamiliarity with the site.`,
 questions:[
 q("E17-Q1","RC2-F01","easy","What limitation can a warning symbol have?","It may not explain the exact danger or required action",["It is always too large","It cannot attract attention","It removes legal duties"],"The opening paragraph states this directly. The cited passage detail directly supports this answer.","may not tell every user"),
 q("E17-Q2","RC2-F02","medium","Why can the same symbol be misunderstood in different settings?","People may recognise danger without knowing which hazard applies",["Symbols change colour automatically","Visitors never read signs","Engineers remove explanations"],"The passage lists different possible hazards under similar warning cues.","heat, electricity, chemicals"),
 q("E17-Q3","RC2-F03","medium","Which summary is most accurate?","Effective warnings combine rapid visual attention with clear action-oriented explanation",["Symbols should replace words","Warnings should contain long legal paragraphs","Only trained staff need safety signs"],"The conclusion explicitly combines symbols and text.","uses each for what it does best"),
 q("E17-Q4","RC2-F04","hard","What is the author's tone?","Practical and safety-focused",["Mocking","Promotional","Dismissive"],"The author offers clear communication principles.","A good warning therefore"),
 q("E17-Q5","RC2-F05","medium","Why does the author mention near misses?","Repeated misunderstandings can reveal a communication problem before a serious incident",["Near misses prove signs are unnecessary","Only accidents matter","Warnings should never change"],"The passage says misunderstandings should prompt sign review.","reviewed after incidents or near misses"),
 q("E17-Q6","RC2-F06","hard","Which conclusion follows most logically?","A visible warning can still be ineffective if users do not know what action it requires",["Symbols always fail","Words alone are sufficient","Long explanations are safest"],"The passage distinguishes attention from actionable understanding.","support action"),
 q("E17-Q7","RC2-F07","medium","Which statement is supported?","Short text can explain both the hazard and the response",["Every warning needs several paragraphs","Visitors understand all symbols","Engineers should design for engineers only"],"The high-voltage example demonstrates this. The cited passage detail directly supports this answer.","communicates both the hazard and the response"),
 q("E17-Q8","RC2-F08","easy","In context, “urgent” most nearly means:","requiring immediate attention",["optional","historical","decorative"],"The passage uses urgent for the most immediate safety message.","urgent message")
 ]
},
{
 id:"ENG008-RC2-R12",title:"A District Tests Earlier Opening Hours at a Citizen Service Centre",genre:"current-affairs-report",
 text:`A district administration opened one citizen service centre an hour earlier for a ten-week trial after commuters said the usual opening time conflicted with work schedules.

During the trial, the centre recorded a noticeable increase in visits between 8 a.m. and 9 a.m. The busiest early users were people submitting short applications or collecting completed documents before work.

Total daily visits increased only slightly. Many early visitors appeared to be shifting the time of an existing visit rather than creating new demand.

Staffing was adjusted so the first counter opened earlier while another shift ended earlier in the afternoon. Overtime did not rise significantly.

The centre also monitored whether afternoon queues became longer because of the shift. They did not, although one late-afternoon period became more dependent on fewer staff.

Officials concluded that earlier opening improved convenience for some commuters without greatly increasing total workload. They plan to test whether the pattern continues outside the busy application season before making the schedule permanent.

 The district also asked early visitors whether they would still use the service if the centre returned to its old hours. Most said they would, but several commuters expected to take leave from work or send another family member instead. Officials therefore treated the early opening as an access improvement rather than a pure demand increase. They will also compare staff fatigue and service quality before deciding whether the schedule is sustainable across a full year.`,
 questions:[
 q("R12-Q1","RC2-F01","easy","Who used the earlier opening hours most?","People making short visits before work",["Only school children","Tourists","Evening shift workers"],"The report says early users often submitted short applications or collected documents.","before work passage detail"),
 q("R12-Q2","RC2-F02","medium","What can be inferred from the small rise in total daily visits?","Many people changed visit time rather than creating new demand",["The centre lost users","Every early visitor was new","Afternoon service stopped"],"The report states that many visits were shifted.","shifting the time of an existing visit"),
 q("R12-Q3","RC2-F03","medium","Which summary is most accurate?","Earlier opening improved convenience for some users with little change in total workload",["The centre doubled demand","Overtime rose sharply","Afternoon queues collapsed"],"The conclusion states this directly. The cited passage detail directly supports this answer.","without greatly increasing total workload"),
 q("R12-Q4","RC2-F04","hard","What is the tone of the report?","Cautiously positive",["Celebratory and absolute","Hostile","Alarmist"],"Benefits are reported with operational caveats.","They plan to test"),
 q("R12-Q5","RC2-F05","medium","Why did the centre monitor afternoon queues?","To check whether earlier staffing created a problem later in the day",["To reduce morning visits","To close the centre early","To cancel applications"],"The staffing shift could have affected later service.","because of the shift"),
 q("R12-Q6","RC2-F06","hard","Which conclusion is justified?","Changing service hours can improve access even without increasing capacity",["Earlier opening always increases demand","Overtime is unavoidable","Every centre should copy the schedule"],"The trial improved convenience mainly by changing timing.","improved convenience"),
 q("R12-Q7","RC2-F07","medium","Which statement is supported?","Overtime did not increase significantly",["All staff worked longer","Late-afternoon queues disappeared","Daily visits doubled"],"The fourth paragraph states this directly. The cited passage detail directly supports this answer.","Overtime did not rise significantly"),
 q("R12-Q8","RC2-F08","easy","In context, “permanent” most nearly means:","intended to continue indefinitely",["temporary","experimental","seasonal"],"Officials had not yet decided whether to keep the schedule long-term.","making the schedule permanent")
 ]
},
{
 id:"ENG008-RC2-R13",title:"A Town Tests Water-Level Markers on Flood-Prone Roads",genre:"current-affairs-report",
 text:`A town installed painted water-level markers on twelve road underpasses that frequently flooded during heavy rain. The markers showed simple depth bands so drivers could judge whether water was shallow or potentially dangerous.

During the monsoon trial, traffic police recorded fewer cases of small cars attempting to cross the deepest flooded underpasses. Drivers also reported that the markers were easier to understand than verbal estimates shared on local radio.

The system had limits. Mud covered two markers after several storms, and one location was poorly lit at night.

Maintenance teams cleaned the markings more often and added reflective strips where visibility was weak. Officials also stressed that the markers were not permission to cross; road closures and police instructions still took priority.

The town did not measure whether total flooding decreased, because the markers were only an information tool. Their purpose was to help people interpret conditions that already existed.

Officials concluded that simple depth markers improved situational awareness but required maintenance and clear supporting rules. The town will compare different marker designs before expanding the system to rural roads.

 Traffic police also compared the markers with temporary barricades used during the deepest flooding. The two tools served different purposes: the markers communicated changing depth, while barricades indicated that a road should not be entered at all. Officers said the distinction had to remain clear so that drivers did not interpret a visible marker as permission to proceed. Future designs may include a colour band that becomes visible only above a clearly marked danger threshold.`,
 questions:[
 q("R13-Q1","RC2-F01","easy","What was the purpose of the water-level markers?","To help drivers judge flood depth",["To reduce rainfall","To repair underpasses","To replace police"],"The opening paragraph states the purpose directly.","judge whether water was shallow or potentially dangerous"),
 q("R13-Q2","RC2-F02","medium","What can be inferred from the visibility problems?","An information tool is useful only if people can actually see and interpret it",["Markers reduce flooding","Night driving is always unsafe","Police instructions are unnecessary"],"Mud and poor lighting reduced the usefulness of the markers.","poorly lit at night"),
 q("R13-Q3","RC2-F03","medium","Which summary is most accurate?","Flood-depth markers improved awareness but needed maintenance and could not replace closure instructions",["Markers prevented all flooding","Drivers ignored every marker","Radio estimates were always wrong"],"The conclusion combines benefit with limitations.","required maintenance and clear supporting rules"),
 q("R13-Q4","RC2-F04","hard","What is the tone of the report?","Cautiously positive",["Promotional and absolute","Dismissive","Humorous"],"The report notes measurable benefit and practical limits.","had limits passage detail"),
 q("R13-Q5","RC2-F05","medium","Why does the report mention mud covering two markers?","To show that maintenance affects whether the system remains usable",["To prove roads were dry","To justify removing the markers","To show paint causes flooding"],"Covered markings cannot communicate depth clearly.","Mud covered two markers"),
 q("R13-Q6","RC2-F06","hard","Which conclusion is justified?","Depth markers can support decisions but should not override official closures",["Markers make police unnecessary","Any shallow water is safe","Flooding decreased because markers were painted"],"The passage explicitly gives priority to closures and police.","still took priority"),
 q("R13-Q7","RC2-F07","medium","Which statement is supported?","The town did not claim the markers reduced flooding itself",["Every driver used radio instead","All markers remained clean","Rural roads already used the system"],"The fifth paragraph states this directly. The cited passage detail directly supports this answer.","did not measure whether total flooding decreased"),
 q("R13-Q8","RC2-F08","easy","In context, “situational awareness” most nearly means:","understanding current conditions around you",["long-term weather forecasting","road construction","vehicle speed"],"The markers helped drivers understand existing flood conditions.","situational awareness")
 ]
}
] as const;