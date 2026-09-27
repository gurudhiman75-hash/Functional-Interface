import type{Eng008Cp002PassageV1}from"./eng-008-cp002-authorities-v1";
const q=(id:string,familyId:any,difficulty:any,question:string,correctAnswer:string,distractors:readonly[string,string,string],explanation:string,evidence:string)=>({id,familyId,difficulty,question,correctAnswer,distractors,explanation,evidence});

export const ENG008_CP002_EXPANSION_WAVE3_V1:readonly Eng008Cp002PassageV1[]=[
{
 id:"ENG008-RC2-E11",title:"Public Feedback Should Be Easier to Give and Easier to Use",genre:"editorial",
 text:`Public agencies often invite feedback through surveys, complaint forms and consultation meetings. The existence of these channels can create the appearance of openness, but a feedback system is useful only when people can understand how to participate and officials can make sense of what they receive.

Long forms are one common barrier. A resident who wants to report a broken streetlight may abandon a form that asks for several details unrelated to the problem. At the same time, a form that asks too little may leave staff without enough information to act. Good design therefore requires asking for the minimum information needed to understand and verify the issue.

Another problem is silence after submission. If people receive no acknowledgement, they may not know whether the message was recorded or ignored. Even a simple reference number and status update can make the process feel more reliable.

Feedback also needs to be organised on the receiving side. Hundreds of comments are not automatically useful if they are stored as isolated messages. Agencies need ways to group recurring problems, identify urgent cases and separate broad opinions from reports that require immediate action.

This does not mean every suggestion should be accepted. Public bodies may have legal, financial or technical reasons to reject a proposal. But explaining what happened to the feedback can still improve trust because people can see that the process led to a decision rather than disappearing into a file.

A good feedback system therefore has two responsibilities: make participation reasonably easy and make the resulting information usable. Collecting more comments is not the same as listening better unless the system helps both citizens and officials understand what should happen next.`,
 questions:[
 q("E11-Q1","RC2-F01","easy","What problem can a very long feedback form create?","People may abandon it before submitting their issue",["It always produces inaccurate data","It prevents staff from reading any complaint","It makes every complaint anonymous"],"The second paragraph says unnecessary questions can cause residents to stop filling out the form.","may abandon a form"),
 q("E11-Q2","RC2-F02","medium","What can be inferred about a useful acknowledgement message?","It can reassure users that their feedback was actually received",["It guarantees the complaint will be accepted","It replaces the need for officials to act","It should include a legal decision immediately"],"The passage says a reference number or status update makes the process feel more reliable.","make the process feel more reliable"),
 q("E11-Q3","RC2-F03","medium","Which option best summarises the passage?","Feedback systems should make participation simple enough for citizens and information structured enough for officials to use",["Agencies should accept every suggestion they receive","Long forms always produce better decisions","Public consultations should replace complaint systems"],"The conclusion identifies both participation and usability as essential.","two responsibilities"),
 q("E11-Q4","RC2-F04","hard","What is the author's tone?","Practical and analytical",["Cynical about public participation","Celebratory and uncritical","Humorous and informal"],"The passage identifies design problems and proposes balanced improvements.","Good design therefore requires"),
 q("E11-Q5","RC2-F05","medium","Why does the author discuss grouping recurring problems?","To show that collecting comments is not enough unless agencies can organise them for action",["To argue similar complaints should be deleted","To prove every complaint has the same priority","To reduce the number of feedback channels"],"The passage distinguishes raw volume from usable information.","Hundreds of comments are not automatically useful"),
 q("E11-Q6","RC2-F06","hard","Which conclusion follows most logically?","A feedback process can appear open while still being ineffective in practice",["Any acknowledgement guarantees public trust","Every short form provides enough detail","Officials should avoid rejecting suggestions"],"The opening paragraph explicitly separates the existence of channels from their usefulness.","can create the appearance of openness"),
 q("E11-Q7","RC2-F07","medium","Which statement is supported?","Officials may reject suggestions for valid reasons while still explaining the decision",["All feedback must lead to policy change","Reference numbers are legally required","Anonymous complaints should be ignored"],"The fifth paragraph directly states this possibility.","may have legal, financial or technical reasons to reject"),
 q("E11-Q8","RC2-F08","easy","In context, “acknowledgement” most nearly means:","confirmation that something has been received",["a final approval","a financial payment","a public hearing"],"The word refers to confirming that the submitted message entered the system.","receive no acknowledgement")
 ]
},
{
 id:"ENG008-RC2-R07",title:"A District Tests Reusable Water Stations at Sports Grounds",genre:"current-affairs-report",
 text:`A district sports department installed reusable water-refill stations at six public grounds during a two-month summer trial. The aim was to reduce the number of disposable plastic bottles sold during tournaments and practice sessions.

The stations were placed near the main entrances and changing rooms. Officials also asked vendors to continue selling sealed bottles so that the trial would not depend on every visitor bringing a reusable container.

During the trial, vendors reported a 19 percent decline in single-use bottle sales compared with the same two months of the previous year. Refill counters recorded their highest use during weekend tournaments.

The department cautioned that the comparison was not perfect. Attendance was slightly lower during one of the trial months because several matches were moved after heavy rain. Lower attendance could explain part of the fall in bottle sales.

A short visitor survey found that most refill users had brought their own bottles, while a smaller group reused bottles they had already purchased. Several respondents said they were more likely to refill when the station was visible from the seating area.

Maintenance records also showed that one station was out of service for three days because of a damaged tap. Use at the nearby ground fell sharply during that period and recovered after repair.

Officials concluded that the stations were associated with lower disposable-bottle demand, but location, attendance and maintenance all affected the result. The next trial will track bottle sales per visitor rather than only total sales and will compare grounds with similar event schedules.`,
 questions:[
 q("R07-Q1","RC2-F01","easy","What change did vendors report during the trial?","A 19 percent decline in single-use bottle sales",["A 19 percent rise in attendance","A 30 percent fall in refill use","No change in bottle sales"],"The third paragraph directly reports the decline in single-use bottle sales.","19 percent decline"),
 q("R07-Q2","RC2-F02","medium","What can be inferred about station visibility?","People may be more likely to refill when the station is easy to notice",["Visibility determines attendance","Hidden stations are always unused","Vendors prefer stations inside shops"],"Survey respondents said visible stations were more likely to be used.","more likely to refill when the station was visible"),
 q("R07-Q3","RC2-F03","medium","Which summary is most accurate?","Refill stations were linked to lower bottle demand, but attendance and maintenance affected the measured result",["The trial proved refill stations eliminate plastic waste","Bottle vendors stopped selling sealed bottles","Rain increased refill use everywhere"],"The report presents an encouraging association with clear limitations.","location, attendance and maintenance all affected the result"),
 q("R07-Q4","RC2-F04","hard","What is the tone of the report?","Cautiously positive and evidence-based",["Promotional and absolute","Dismissive of environmental concerns","Alarmist about sports events"],"The report notes a positive result while carefully discussing alternative explanations.","comparison was not perfect"),
 q("R07-Q5","RC2-F05","medium","Why does the report mention lower attendance after heavy rain?","To explain a factor that may partly account for the drop in bottle sales",["To argue tournaments should be cancelled","To show refill stations cause bad weather","To prove visitors dislike summer sports"],"Lower attendance is identified as a confounding factor.","could explain part of the fall"),
 q("R07-Q6","RC2-F06","hard","Which conclusion is justified?","Bottle sales should be adjusted for attendance before estimating the station effect more precisely",["A 19 percent decline is fully caused by refill stations","Every ground should remove sealed bottles immediately","Maintenance has no effect on refill use"],"The next trial plans to compare sales per visitor specifically to address attendance differences.","track bottle sales per visitor"),
 q("R07-Q7","RC2-F07","medium","Which statement is supported?","One station's temporary breakdown was followed by lower refill use at that ground",["All six stations failed during the trial","Vendors refused to sell sealed bottles","Weekend tournaments used less water"],"Maintenance records directly show this local usage decline and recovery.","out of service for three days"),
 q("R07-Q8","RC2-F08","easy","In context, “sealed” most nearly means:","closed and unopened",["reusable","damaged","expensive"],"The vendors continued selling normal unopened bottled water.","sealed bottles")
 ]
}
] as const;