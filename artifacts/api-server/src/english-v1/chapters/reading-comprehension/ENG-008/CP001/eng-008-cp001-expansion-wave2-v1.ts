import type{Eng008RcPassageV1}from"./eng-008-cp001-authorities-v1";
const q=(id:string,familyId:any,difficulty:any,question:string,correctAnswer:string,distractors:readonly[string,string,string],explanation:string,evidence:string)=>({id,familyId,difficulty,question,correctAnswer,distractors,explanation,evidence});

export const ENG008_CP001_EXPANSION_WAVE2_V1:readonly Eng008RcPassageV1[]=[
{
 id:"ENG008-RC-N06",title:"The Key in the Flower Pot",genre:"narrative",
 text:`When Meera reached her grandmother's house after school, she found the front door locked. Her grandmother had gone to the clinic and had forgotten to tell her where the spare key was kept. Meera considered walking back to a neighbour's house, but then remembered that her grandmother sometimes left notes beside the entrance.

Behind a flower pot, she found a folded slip that read, “Key with Mrs Rao next door.” Meera collected the key, entered the house and sent her grandmother a short message to say she had arrived safely.

That evening, her grandmother apologised for the confusion. Meera pointed out that the note had solved the problem even though the original plan had failed. They decided to keep a small written list of emergency contacts near the door so that future changes would be easier to handle.

A week later, the same list helped a delivery worker contact the family when no one heard the bell. Meera realised that a simple backup plan becomes useful precisely because people cannot predict every small disruption in advance. It also made small changes feel less stressful.`,
 questions:[
 q("N06-Q1","RC-F01","easy","Where was the spare key kept?","With Mrs Rao next door",["Under the flower pot","At the clinic","Inside Meera's school bag"],"The note beside the entrance said the key was with Mrs Rao next door.","Key with Mrs Rao next door"),
 q("N06-Q2","RC-F02","medium","What can be inferred about the note left by Meera's grandmother?","It served as a backup when the original plan failed",["It was intended for the delivery worker","It was written after Meera entered the house","It contained the clinic address"],"The note allowed Meera to solve the problem caused by the forgotten message.","the note had solved the problem"),
 q("N06-Q3","RC-F03","medium","What is the central idea of the passage?","Simple backup arrangements can reduce confusion when plans change",["Neighbours should always keep spare house keys","Written notes are better than phone messages","Clinic visits usually create household problems"],"The story shows how a basic backup note and contact list helped during unexpected changes.","a simple backup plan becomes useful"),
 q("N06-Q4","RC-F04","medium","Which title best suits the passage?","The Key in the Flower Pot",["The Long Walk Home","A Visit to the Clinic","The Delivery at School"],"The story begins with Meera finding the note behind the flower pot that leads her to the spare key.","Behind a flower pot, she found a folded slip"),
 q("N06-Q5","RC-F05","easy","In context, “disruption” most nearly means:","an unexpected interruption or change",["a permanent rule","a planned celebration","a written instruction"],"The word refers to small unexpected events that disturb a plan.","every small disruption"),
 q("N06-Q6","RC-F06","medium","Which statement is supported by the passage?","The emergency contact list was useful again later",["Meera lost the spare key after entering","Mrs Rao went to the clinic with Meera's grandmother","The delivery worker found the key under the pot"],"The final paragraph says the contact list later helped a delivery worker reach the family.","the same list helped a delivery worker")
 ]
},
{
 id:"ENG008-RC-R06",title:"A Reading Corner in the Waiting Hall",genre:"report",
 text:`A district office placed a small reading corner in the waiting hall after visitors complained that long queues felt unproductive. The corner contained newspapers, simple government guides and a shelf of children's books donated by local residents.

For three weeks, staff observed how often the materials were used. Newspapers were picked up most frequently in the morning, while children's books were used mainly in the afternoon when families were more likely to visit. The government guides were less popular overall, but people who used them often asked fewer basic questions at the service counter.

The office did not claim that the reading corner reduced queue length. Waiting times remained almost unchanged because staffing and case volume were the same. Its benefit was different: some visitors used the waiting period to find information or keep children occupied.

Staff later moved the government guides closer to the ticket dispenser because many visitors had not noticed them on the original shelf. Use increased after the change. The pilot suggested that even a small public resource can become more useful when it is placed where people naturally look while waiting.`,
 questions:[
 q("R06-Q1","RC-F01","easy","Which material was used most often in the morning?","Newspapers",["Children's books","Government guides","Application forms"],"The second paragraph directly says newspapers were picked up most frequently in the morning.","Newspapers were picked up most frequently in the morning"),
 q("R06-Q2","RC-F02","medium","Why might the government guides have reduced basic questions at the counter?","They provided information before visitors reached staff",["They shortened the queue automatically","They replaced the ticket system","They were read only by employees"],"People who used the guides often needed fewer basic explanations later.","asked fewer basic questions at the service counter"),
 q("R06-Q3","RC-F03","medium","What is the main idea of the report?","A small information resource improved the usefulness of waiting time without reducing the queue itself",["The office solved long queues by adding books","Children's books were the main public-service improvement","Government guides should replace staff"],"The report clearly separates the resource's benefit from queue length.","Waiting times remained almost unchanged"),
 q("R06-Q4","RC-F04","medium","Which title best suits the passage?","A Reading Corner in the Waiting Hall",["The End of Long Queues","A New Ticket Machine","Why Newspapers Should Be Free"],"The passage focuses on how a reading corner was used and adjusted in a public waiting area.","placed a small reading corner in the waiting hall"),
 q("R06-Q5","RC-F05","easy","In context, “volume” most nearly means:","amount or number",["sound level","book size","floor space"],"Case volume refers to how many cases the office had to handle.","staffing and case volume were the same"),
 q("R06-Q6","RC-F06","medium","Which statement is supported?","Moving the guides made them more noticeable and increased their use",["The reading corner reduced average waiting time","Most visitors ignored all reading material","The office removed the children's books"],"The final paragraph directly links the new location with increased guide use.","Use increased after the change")
 ]
}
] as const;