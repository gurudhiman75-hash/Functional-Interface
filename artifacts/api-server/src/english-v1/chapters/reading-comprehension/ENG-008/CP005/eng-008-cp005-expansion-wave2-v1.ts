import type{Eng008Cp005PassageV1}from"./eng-008-cp005-authorities-v1";
const q=(id:string,familyId:any,difficulty:any,question:string,correctAnswer:string,distractors:readonly[string,string,string],explanation:string,evidence:string)=>({id,familyId,difficulty,question,correctAnswer,distractors,explanation,evidence});

export const ENG008_CP005_EXPANSION_WAVE2_V1:readonly Eng008Cp005PassageV1[]=[
{
 id:"ENG008-RS-W02",title:"Does a Later Meeting Start Improve Attendance?",genre:"workplace-study",
 text:`A regional office noticed that attendance at its weekly Monday meeting had become uneven. The meeting began at 8:30 a.m., and managers suspected that employees commuting from distant areas were more likely to miss the opening. For six weeks, the office shifted the meeting to 9:00 a.m. and compared attendance with the previous six weeks.

Average attendance increased from 82 percent to 89 percent. Late arrivals also fell. At first, managers considered this evidence that the later start had solved the attendance problem.

A closer look showed that the trial overlapped with the end of a major road-repair project near the office. Travel delays on the main route had become shorter during the same period. Employees also reported fewer transport problems in the final three weeks.

The office therefore compared workers living close to the office with those commuting more than twenty kilometres. Attendance improved in both groups, but the increase was larger among longer-distance commuters.

The change had another effect: some teams said the later meeting interrupted their most productive early work period. Those employees attended more reliably but rated the meeting time less favourably in a follow-up survey.

Because the schedule change was not randomly assigned and external travel conditions also improved, managers did not claim that the later start caused the entire attendance increase. They treated the result as encouraging but incomplete.

The office decided to repeat the comparison during another six-week period when no major roadwork was expected. It will also test whether a 20-minute rather than 30-minute delay produces similar attendance with less disruption to early work.

The study illustrates why a workplace change can improve one outcome while creating a new trade-off. Higher attendance mattered, but managers also needed to consider commuting conditions, productivity and employee preferences before deciding on a permanent schedule.`,
 questions:[
 q("W02-Q1","RS-F01","medium","What happened to average meeting attendance during the later-start trial?","It rose from 82 percent to 89 percent",["It fell from 89 percent to 82 percent","It stayed at 82 percent","It rose to 100 percent"],"The second paragraph directly reports the attendance increase.","increased from 82 percent to 89 percent"),
 q("W02-Q2","RS-F02","medium","What can be inferred about longer-distance commuters?","They may have benefited more from the later start than nearby workers",["They attended less often after the change","They were unaffected by road conditions","They preferred earlier meetings"],"Attendance improved more strongly among employees travelling over twenty kilometres.","increase was larger among longer-distance commuters"),
 q("W02-Q3","RS-F03","medium","Which summary is most accurate?","Attendance improved after the later start, but road conditions and productivity trade-offs limit a simple causal conclusion",["The later start fully solved the attendance problem","Road repairs were the only reason attendance changed","Employees unanimously preferred the new time"],"The passage presents an improvement with confounding and trade-offs.","encouraging but incomplete"),
 q("W02-Q4","RS-F04","hard","Which limitation most directly weakens causal interpretation?","Road-repair delays improved during the same period and the schedule was not randomly assigned",["The trial lasted six weeks","Attendance was recorded","Employees lived at different distances"],"Both concurrent travel changes and non-random timing create alternative explanations.","not randomly assigned and external travel conditions also improved"),
 q("W02-Q5","RS-F05","hard","Which statement confuses correlation with causation?","Starting at 9:00 caused the entire seven-point attendance increase",["Attendance was higher during the trial","Long-distance commuters improved more","Road delays also became shorter"],"The study cannot isolate the later start as the sole cause of the increase.","did not claim that the later start caused the entire attendance increase"),
 q("W02-Q6","RS-F06","hard","Which is a directly reported finding?","Some employees rated the later time less favourably despite attending more reliably",["The later time reduced everyone's productivity","All distant commuters preferred the new schedule","Road repairs improved because of the meeting change"],"The follow-up survey directly reported a less favourable rating among some teams.","rated the meeting time less favourably"),
 q("W02-Q7","RS-F07","hard","Which competing explanation is explicitly identified?","Reduced roadwork delays may have improved attendance independently of the meeting time",["Employees received attendance bonuses","The office hired more staff","Managers shortened the meeting"],"The passage explicitly notes improved commuting conditions during the trial.","Travel delays ... had become shorter"),
 q("W02-Q8","RS-F08","medium","Which next step is best supported?","Repeat the comparison when road conditions are stable and test a smaller time shift",["Make 9:00 permanent immediately","Return to 8:30 without further study","Ignore employee productivity concerns"],"The planned follow-up directly addresses the confound and the trade-off.","repeat the comparison ... test whether a 20-minute ... delay")
 ]
},
{
 id:"ENG008-RS-E02",title:"Does a Tree-Guard Design Improve Sapling Survival?",genre:"environment-study",
 text:`A municipal parks department compared two types of guards used around newly planted roadside saplings. One design used a solid lower panel, while the other used an open metal frame. The department wanted to know whether the design influenced damage, watering access and survival during the first summer.

Four hundred saplings were observed across twenty road sections. Half had solid-panel guards and half had open-frame guards. By the end of twelve weeks, 86 percent of saplings with solid lower panels were still healthy compared with 78 percent of those with open frames.

The difference appeared largest on roads with heavy pedestrian movement. Field workers recorded more broken branches and litter trapped around open-frame guards in those areas. On quieter roads, the survival gap between the two designs was much smaller.

However, the two guard types had not been assigned randomly. Solid-panel guards were more common on recently upgraded roads where watering schedules were also somewhat more regular. Better watering could therefore explain part of the survival difference.

The department reviewed watering logs and adjusted its analysis for recorded watering frequency. The estimated advantage of the solid design became smaller but remained present. Officials cautioned that the logs might not capture every watering event accurately.

Workers also reported a practical drawback. Solid lower panels made it harder to see whether weeds or plastic waste had collected around the base of a sapling. Maintenance crews sometimes needed to open or move the panel to inspect the soil.

The department concluded that solid lower panels were associated with higher first-summer survival, especially on busier roads, but the observational design could not establish the full causal effect. It recommended a future trial in which guard types are randomly assigned within the same road sections.

That experiment would also track maintenance time, not only survival. The department wanted to know whether a design that protects saplings better creates extra upkeep costs that could reduce its advantage when used across thousands of trees.`,
 questions:[
 q("E02-Q1","RS-F01","medium","What proportion of saplings with solid-panel guards remained healthy after twelve weeks?","86 percent",["78 percent","50 percent","20 percent"],"The second paragraph directly reports 86 percent survival for the solid-panel group.","86 percent ... were still healthy"),
 q("E02-Q2","RS-F02","medium","What can be inferred about road conditions?","Guard design may matter more where pedestrian activity is heavy",["Quiet roads always have lower survival","Pedestrian movement improves watering","Guard design matters only on highways"],"The survival difference was largest on heavily used roads and smaller on quieter ones.","difference appeared largest on roads with heavy pedestrian movement"),
 q("E02-Q3","RS-F03","medium","Which summary is most accurate?","Solid-panel guards were linked to better survival, but watering differences and maintenance trade-offs limit the conclusion",["Solid panels were proven superior in every condition","Open frames always caused sapling death","Watering had no relationship with survival"],"The study found an association with clear confounding and a practical drawback.","associated with higher first-summer survival"),
 q("E02-Q4","RS-F04","hard","Which limitation most directly affects causal interpretation?","Guard types were not randomly assigned and watering schedules differed",["The study included twenty road sections","Saplings were observed for twelve weeks","Workers recorded damage"],"Non-random assignment and unequal watering create confounding.","had not been assigned randomly"),
 q("E02-Q5","RS-F05","hard","Which statement makes an unjustified causal claim?","Solid-panel guards caused the full eight-point survival advantage",["Solid-panel saplings had higher observed survival","The adjusted advantage became smaller","Watering may explain part of the difference"],"The observational design does not isolate guard design as the sole cause.","could therefore explain part of the survival difference"),
 q("E02-Q6","RS-F06","hard","Which is a directly reported finding?","The survival gap was smaller on quieter roads",["Solid panels improve soil quality","Open frames discourage watering","Maintenance crews preferred solid panels overall"],"The passage directly compares the size of the gap by road activity.","On quieter roads, the survival gap ... was much smaller"),
 q("E02-Q7","RS-F07","hard","Which competing explanation is explicitly mentioned?","More regular watering on roads using solid-panel guards may have improved survival",["Solid panels received more sunlight","Open frames were always older","Pedestrians watered open-frame saplings less"],"The passage identifies watering frequency as a possible confound.","watering schedules were also somewhat more regular"),
 q("E02-Q8","RS-F08","medium","Which next step is best supported?","Randomly assign guard types within the same road sections and track both survival and maintenance time",["Replace every open-frame guard immediately","Ignore maintenance costs","Study only quiet roads"],"Random assignment would strengthen causal inference and tracking maintenance would capture the identified trade-off.","randomly assigned ... track maintenance time")
 ]
}
] as const;