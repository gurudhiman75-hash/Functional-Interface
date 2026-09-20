export type Eng005Cp004Difficulty="easy"|"medium"|"hard";
export type Eng005Cp004Mode="idiom-to-meaning"|"meaning-to-idiom";
export interface Eng005Cp004EntryV1{id:string;phrase:string;meaning:string;contextTemplate:string;category:string;difficulty:Eng005Cp004Difficulty;}

const RAW=`
#decision_action
call it quits|stop doing something|After another unproductive round, the two sides decided to {idiom}.
take stock|carefully assess the present situation|Before approving the next phase, the committee paused to {idiom}.
take things as they come|deal with events without worrying too far ahead|With the schedule changing every day, she chose to {idiom}.
go with the flow|accept a situation and adapt without resistance|The plan kept changing, so the team decided to {idiom}.
leave well enough alone|avoid changing something that is already satisfactory|The repair was working, and the engineer advised everyone to {idiom}.
let sleeping dogs lie|avoid reviving an old problem or dispute|No one wanted to reopen the settled argument, so they agreed to {idiom}.
keep one's options open|avoid making a final choice too early|Until the final offers arrived, the candidate wanted to {idiom}.
take a leaf out of someone's book|copy a useful method or behaviour from someone|The new manager decided to {idiom} and hold shorter meetings.
play it by ear|decide what to do as a situation develops|Because the weather was uncertain, the organisers chose to {idiom}.
cross one's fingers|hope strongly for a favourable result|The application had been submitted, and all they could do was {idiom}.
jump on the bandwagon|join a popular activity or trend|Once the campaign became successful, several rivals tried to {idiom}.
take the path of least resistance|choose the easiest course rather than the best or hardest one|Instead of confronting the issue, he chose to {idiom}.
sit tight|wait patiently without taking action|The officer told everyone to {idiom} until new instructions arrived.
wait and see|delay action until more information is available|With the market still uncertain, the board decided to {idiom}.
take one day at a time|deal with problems gradually rather than worrying about the distant future|During the long recovery, she learned to {idiom}.
#communication
cut to the chase|get to the main point without delay|The meeting was running late, so the chair asked everyone to {idiom}.
get the message across|communicate an idea successfully|The trainer used a simple example to {idiom}.
talk nineteen to the dozen|talk very quickly and continuously|Excited by the news, the children began to {idiom}.
talk someone's ear off|talk to someone for an excessively long time|On the journey, he managed to {idiom} about his new project.
bend someone's ear|talk to someone at length, usually to persuade or complain|She cornered the supervisor to {idiom} about the new schedule.
hold forth|speak at length and with confidence on a subject|At dinner, the professor began to {idiom} about ancient trade routes.
talk down to someone|speak to someone as if they are less intelligent|Employees disliked the supervisor because he would often {idiom}.
talk over someone's head|use language too difficult for someone to understand|The specialist realised he was beginning to {idiom} and simplified the explanation.
go on record|make a public or official statement|The minister agreed to {idiom} with a clear denial of the rumour.
off the record|not intended for public quotation|The official shared the background information strictly {idiom}.
for the record|said so that a fact is clearly and officially noted|{idiom}, the committee had not approved the proposal.
name names|publicly identify the people involved|The witness described the scheme but refused to {idiom}.
give someone an earful|speak angrily to someone for a long time|After discovering the damage, the owner gave the contractor {idiom}.
say the word|give a signal or instruction to act|If you need the documents today, just {idiom}.
make one's point|express one's main argument clearly|She used two figures and a short example to {idiom}.
#success_progress
make the cut|reach the required standard for selection|Only twelve candidates would {idiom} after the final round.
pass muster|meet the required standard|The revised design had to {idiom} before production could begin.
cut the mustard|perform well enough to meet expectations|The old software could no longer {idiom} under the heavier workload.
make good|become successful after effort or difficulty|After years of small roles, the actor finally began to {idiom}.
make the big time|become highly successful or famous|The young singer moved to the city hoping to {idiom}.
hit pay dirt|discover something valuable or achieve a profitable success|After months of research, the team finally {idiom}.
strike gold|find or achieve something very valuable|The company seemed to {idiom} with its low-cost design.
bear fruit|produce successful results|The long negotiations eventually began to {idiom}.
pay off|produce a good result after effort or investment|Her months of preparation finally started to {idiom}.
take off|become successful or popular very quickly|Orders increased sharply once the new product began to {idiom}.
hit the ground running|start a new task quickly and effectively|The new officer arrived ready to {idiom}.
make a splash|attract a lot of attention or create a strong impression|The small firm hoped to {idiom} at the national exhibition.
blaze a trail|be the first to develop or do something new|The research group continued to {idiom} in low-cost diagnostics.
ahead of the pack|more successful or advanced than competitors|Its faster delivery system kept the company {idiom}.
set the pace|establish the standard or speed for others|The leading school continued to {idiom} in digital learning.
#work_responsibility
shoulder the burden|accept a difficult responsibility|When the project leader fell ill, her deputy had to {idiom}.
carry the can|accept blame or responsibility for a failure|The junior officer was unfairly made to {idiom} for the mistake.
hold the fort|take care of a place or activity while others are absent|While the manager attended the conference, Anita stayed behind to {idiom}.
mind the shop|look after a business or activity temporarily|His partner went to the bank while he remained to {idiom}.
show someone the ropes|teach someone how a job or activity is done|On the first day, a senior clerk was assigned to {idiom}.
put one's hand to the plough|begin a difficult task with determination|Once funding was approved, the team was ready to {idiom}.
go through the mill|undergo a difficult and exhausting experience|The trainees had to {idiom} before earning their certificates.
earn one's spurs|prove one's ability and gain recognition|The young lawyer hoped to {idiom} on a difficult case.
work like a Trojan|work extremely hard|The volunteers had to {idiom} to finish before sunset.
down tools|stop working as a form of protest|The workers threatened to {idiom} unless safety measures improved.
pick up the slack|do work that someone else has failed to do|When two employees were absent, the rest of the team had to {idiom}.
do the legwork|do the practical and often tiring preliminary work|The analysts gathered the records while interns did most of {idiom}.
make short work of something|finish a task quickly and efficiently|The experienced mechanic {idiom} the minor repair.
pull double duty|perform two roles or sets of duties at once|During the shortage, the receptionist had to {idiom}.
take the strain|bear the pressure or workload|The backup system was designed to {idiom} during peak demand.
#money_trade
make money hand over fist|earn money very quickly and in large amounts|The popular roadside stall began to {idiom} during the festival.
rake it in|earn a great deal of money|The company was {idiom} after demand suddenly doubled.
laugh all the way to the bank|make a large profit with ease|After selling the land at a huge gain, he was {idiom}.
go broke|lose all or nearly all one's money|Several poorly managed firms {idiom} during the downturn.
flat broke|having no money at all|By the end of the trip, he was {idiom}.
out of pocket|having lost money because of an expense|The cancellation left many small vendors {idiom}.
deep pockets|having a great deal of money available|Only a buyer with {idiom} could afford the property.
cost the earth|be extremely expensive|A replacement imported part would {idiom}.
cost a bomb|cost a very large amount of money|The last-minute flight {idiom}.
for peanuts|for a very small amount of money|He sold the old equipment {idiom}.
on the house|provided free by a business|The restaurant offered dessert {idiom} after the delay.
pay dividends|produce useful results in the future|Regular practice began to {idiom} during the examination.
top dollar|the highest possible price|Collectors were willing to pay {idiom} for the rare item.
bottom dollar|one's last remaining amount of money|He would bet his {idiom} that the figures were wrong.
money is no object|cost is not an important consideration|For the emergency repair, {idiom}.
#emotion_relationship
head over heels|deeply in love|Within a few months, he was {idiom} in love.
sweep someone off their feet|make someone quickly become strongly attracted or impressed|Her confidence and humour seemed to {idiom}.
carry a torch for someone|continue to have romantic feelings for someone|Years later, he still appeared to {idiom}.
an old flame|a former romantic partner|At the reunion, she unexpectedly met {idiom}.
pop the question|ask someone to marry|After months of planning, he finally decided to {idiom}.
tie the knot|get married|The couple planned to {idiom} in December.
go one's separate ways|end a relationship or partnership and move apart|After the final project, the partners chose to {idiom}.
kiss and make up|become friendly again after a quarrel|The two friends argued in the morning but soon {idiom}.
give someone a wide berth|avoid going near or dealing closely with someone|After the argument, most colleagues gave him {idiom}.
take a shine to someone|begin to like someone|The elderly teacher quickly {idiom} the new student.
get on swimmingly|have a very friendly and easy relationship|The two new roommates began to {idiom}.
bosom buddies|very close friends|The two officers had been {idiom} since college.
birds of a feather|people with similar interests or characters|The two collectors soon discovered they were {idiom}.
blood is thicker than water|family loyalty is stronger than other relationships|When the dispute became serious, he remembered that {idiom}.
a shoulder to cry on|a sympathetic person who listens and gives comfort|After the setback, she needed {idiom}.
#trouble_risk
in a pickle|in a difficult situation|Losing the key just before closing time left the staff {idiom}.
in a jam|in a difficult or troublesome situation|Without the missing permit, the contractor was {idiom}.
in a fix|in an awkward or difficult situation|The cancelled train left the travellers {idiom}.
up the creek without a paddle|in serious trouble with no easy solution|Without cash or transport, they were {idiom}.
at one's wits' end|so worried or frustrated that one does not know what to do|After repeated failures, the technician was {idiom}.
in dire straits|in a very difficult or dangerous situation|The small business was {idiom} after months without orders.
on the ropes|close to defeat or failure|After losing two major clients, the firm was {idiom}.
caught napping|caught unprepared or inattentive|The defence was {idiom} by the sudden change in strategy.
caught off guard|surprised and unprepared|The unexpected question caught the spokesperson {idiom}.
drop one's guard|stop being sufficiently careful or alert|The coach warned the team not to {idiom} despite the early lead.
keep one's guard up|remain alert and cautious|After the first scam attempt, customers learned to {idiom}.
dig one's own grave|cause one's own failure through foolish actions|By ignoring every warning, the manager was {idiom}.
make one's bed and lie in it|accept the unpleasant results of one's own choices|He had chosen the risky deal and now had to {idiom}.
come home to roost|return as harmful consequences of earlier actions|Years of neglect finally began to {idiom}.
pay the piper|accept the unpleasant cost or consequences of one's actions|After years of overspending, the company had to {idiom}.
#knowledge_thought
have an inkling|have a slight idea or suspicion|She had {idiom} that the announcement would be delayed.
know a thing or two|have useful knowledge or experience|After twenty years in the trade, he {idiom} about repairs.
a no-brainer|a decision or question that is extremely easy|Given the lower cost and better warranty, the choice was {idiom}.
a brainwave|a sudden clever idea|During the discussion, one student had {idiom}.
a light-bulb moment|a sudden moment of understanding or inspiration|The diagram gave her {idiom}.
dawn on someone|become understood gradually or suddenly|It slowly began to {idiom} that the address was wrong.
ring true|sound believable or convincing|Most of the witness's account did not {idiom}.
ring false|sound unconvincing or insincere|His sudden excuse seemed to {idiom}.
see the point|understand the reason or argument|After the example, the trainees could finally {idiom}.
miss the point|fail to understand the main idea|By arguing about the spelling, he completely {idiom}.
learn one's lesson|learn from an unpleasant experience|After paying the penalty, the driver had {idiom}.
think on one's feet|make quick and effective decisions without preparation|A good interviewer must be able to {idiom}.
have one's wits about one|remain alert and able to think clearly|Travellers should {idiom} in a crowded station.
know what's what|understand the facts and practical realities|Ask the senior clerk; she {idiom} in this office.
get to the bottom of something|discover the real cause or truth|The inquiry was set up to {idiom}.
#character_social
a chip on one's shoulder|a tendency to feel resentful or easily offended|He entered every discussion with {idiom} about his past treatment.
have one's head in the clouds|be unrealistic or lost in imagination|The accountant warned that the proposal had {idiom}.
have one's feet on the ground|be practical and realistic|Despite his success, he still had {idiom}.
have one's nose in the air|behave in a proud or superior way|She walked past the old neighbours with {idiom}.
thick-skinned|not easily upset by criticism|A public spokesperson needs to be {idiom}.
thin-skinned|easily hurt or offended by criticism|He was too {idiom} to accept even mild feedback.
warm-hearted|kind and sympathetic|The village remembered her as a {idiom} teacher.
cold-hearted|showing little sympathy or emotion|The decision seemed unnecessarily {idiom}.
open-minded|willing to consider new ideas|The panel remained {idiom} during the discussion.
narrow-minded|unwilling to consider unfamiliar views|The rule was criticised as {idiom} and outdated.
strong-willed|very determined and difficult to influence|The {idiom} athlete refused to abandon training.
weak-kneed|lacking courage or determination|The leader could not afford to appear {idiom} during the crisis.
level-headed|calm and sensible in difficult situations|Her {idiom} response prevented panic.
hot-headed|quick to become angry or act rashly|The {idiom} player was warned to stay calm.
big-headed|having an exaggerated opinion of one's importance|Early praise made the young actor {idiom}.
#conflict_power
at loggerheads|in serious disagreement|The two departments were {idiom} over the budget.
up in arms|angry and protesting strongly|Residents were {idiom} over the sudden fee increase.
a war of words|a prolonged public verbal dispute|The disagreement soon became {idiom} in the newspapers.
a battle of wills|a struggle in which each side refuses to give in|The negotiation turned into {idiom}.
take issue with someone|disagree with or challenge someone's statement|Several members {idiom} the chair's interpretation.
have words with someone|have an angry argument with someone|The supervisor {idiom} a contractor over the delay.
come to blows|begin physically fighting|The argument nearly caused the two men to {idiom}.
go for the jugular|attack an opponent's weakest or most vulnerable point|In the final debate, the candidate chose to {idiom}.
hit below the belt|act unfairly or make an unfair personal attack|Bringing up his family was clearly {idiom}.
pull one's punches|hold back from using full force or criticism|The auditor did not {idiom} in the final report.
no holds barred|with no restrictions on methods or criticism|The final discussion became a {idiom} contest.
throw in the towel|admit defeat and stop trying|After the third rejection, he was ready to {idiom}.
wave the white flag|show that one is giving up or seeking peace|The smaller side finally decided to {idiom}.
call a truce|agree to stop a conflict temporarily or permanently|Both groups agreed to {idiom} during the festival.
fight a losing battle|continue trying despite having little chance of success|Without better evidence, the lawyer felt he was {idiom}.
#change_uncertainty
up in the air|not yet decided or settled|The venue was still {idiom} two weeks before the event.
hang in the balance|remain uncertain and capable of going either way|The future of the project continued to {idiom}.
go either way|have two equally possible outcomes|With one round left, the result could {idiom}.
turn on a dime|change direction or opinion very quickly|The market can {idiom} after unexpected news.
the flip side|the less obvious opposite aspect of something|Higher salaries were attractive, but {idiom} was the longer commute.
the other side of the coin|a contrasting aspect of the same situation|More freedom was welcome; {idiom} was greater responsibility.
business as usual|the normal routine despite unusual events|After the brief outage, it was soon {idiom}.
winds of change|signs that important change is approaching|New technology brought clear {idiom} to the industry.
a sea change|a major transformation|Remote work produced {idiom} in office culture.
a change of scene|a move to a different environment for variety or relief|After months indoors, a short trip provided {idiom}.
a new broom sweeps clean|a new leader often makes many changes|The department soon learned that {idiom}.
old habits die hard|established habits are difficult to change|He still printed every email because {idiom}.
break with tradition|do something in a new way instead of following custom|The committee decided to {idiom} and hold the event outdoors.
buck the trend|go against the prevailing pattern|While competitors cut staff, the company chose to {idiom}.
move with the times|adapt to modern ideas or methods|Traditional retailers must {idiom} to remain competitive.
#body_misc
keep an eye on|watch or monitor carefully|Please {idiom} the oven while I answer the phone.
turn a blind eye|deliberately ignore something wrong|The regulator refused to {idiom} repeated violations.
lend an ear|listen sympathetically|Whenever a colleague was worried, she would {idiom}.
prick up one's ears|begin listening with sudden interest|The mention of scholarships made several students {idiom}.
fall on deaf ears|be ignored or not listened to|Repeated safety warnings seemed to {idiom}.
keep one's chin up|remain cheerful during difficulty|Despite the delay, his friends told him to {idiom}.
lose one's head|panic or behave irrationally|The officer reminded everyone not to {idiom} during the emergency.
keep one's head|remain calm in a difficult situation|She managed to {idiom} while others panicked.
head and shoulders above|clearly much better than others|Her final presentation was {idiom} the rest.
put one's foot down|act firmly and refuse to allow something|The principal finally had to {idiom} about repeated lateness.
put one's foot in one's mouth|say something embarrassing or tactless|He {idiom} by congratulating her on the wrong result.
drag one's feet|delay doing something deliberately|The agency was accused of {idiom} over the complaint.
stand on one's own feet|be independent and able to support oneself|After finding stable work, he could finally {idiom}.
have itchy feet|have a strong desire to travel or move on|After two years in one city, she began to {idiom}.
all thumbs|clumsy with one's hands|He felt {idiom} while trying to repair the tiny device.
`.trim();

const rows:Eng005Cp004EntryV1[]=[];let category="";let within=0;
for(const raw of RAW.split("\n")){const line=raw.trim();if(!line)continue;if(line.startsWith("#")){category=line.slice(1);within=0;continue;}const [phrase,meaning,template]=line.split("|");if(!phrase||!meaning||!template)throw new Error(`Invalid ENG-005 CP004 row: ${line}`);const difficulty:Eng005Cp004Difficulty=within<3?"easy":within<9?"medium":"hard";rows.push({id:`IDIOM4-${String(rows.length+1).padStart(3,"0")}`,phrase,meaning,contextTemplate:template,category,difficulty});within++;}
export const ENG005_CP004_IDIOMS_V1=Object.freeze(rows);
export function eng005Cp004PoolV1(difficulty:Eng005Cp004Difficulty){return ENG005_CP004_IDIOMS_V1.filter(x=>x.difficulty===difficulty);}
