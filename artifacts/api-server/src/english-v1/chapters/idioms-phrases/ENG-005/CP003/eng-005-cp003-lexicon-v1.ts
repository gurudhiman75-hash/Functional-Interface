export type Eng005Cp003Difficulty="easy"|"medium"|"hard";
export type Eng005Cp003Mode="idiom-to-meaning"|"meaning-to-idiom";
export interface Eng005Cp003EntryV1{id:string;phrase:string;meaning:string;category:string;difficulty:Eng005Cp003Difficulty;}

const RAW=`
#speech_information
at a loss for words|unable to think of anything to say
not mince one's words|speak very directly even if it may offend
talk turkey|discuss a matter seriously and directly
keep mum|remain silent about something
button one's lip|stop talking or keep a secret
put one's cards on the table|state one's intentions or facts openly
give the game away|reveal a secret or hidden plan
drop a hint|suggest something indirectly
pass the word|communicate information to others
word gets around|information becomes widely known
on everyone's lips|being talked about by many people
tongue in cheek|said humorously or ironically rather than seriously
a slip of the tongue|an accidental spoken mistake
on the tip of one's tongue|almost able to remember or say a word
talk at cross purposes|misunderstand one another because different points are being discussed
speak the same language|share the same ideas or understanding
read someone the riot act|reprimand someone very severely
make oneself heard|succeed in getting one's views noticed
have the final say|make the final decision in a matter
spread like wildfire|become known or circulate very rapidly
#success_failure
carry the day|win or prove successful
win hands down|win very easily
come a cropper|fail badly
meet one's Waterloo|suffer a final or decisive defeat
bite the dust|be defeated or fail
go belly up|fail completely, especially financially
come unstuck|experience failure or difficulty
fall by the wayside|fail to continue or complete something
go to the wall|be ruined or defeated
be dead in the water|have no realistic chance of succeeding
make or break|determine complete success or failure
sink or swim|succeed or fail entirely through one's own efforts
against all odds|despite very great difficulties
under one's own steam|by one's own efforts without help
ride high|enjoy a period of success or popularity
on the crest of a wave|at the highest point of success
make a name for oneself|become well known or respected
steal the show|receive the most attention or praise
have the world at one's feet|be extremely successful and admired
come out on top|finish in the strongest or most successful position
#work_action
have several irons in the fire|be involved in several projects at once
keep several balls in the air|manage many activities at the same time
go through the motions|perform actions without real interest or effort
be cut out for something|have the qualities needed for a particular activity
take the plunge|commit oneself to a difficult or risky course
roll up one's sleeves|prepare to work hard
get one's act together|become organised and start behaving effectively
put one's thinking cap on|think seriously about solving a problem
burn the candle at both ends|exhaust oneself by working or staying active too much
keep the pot boiling|keep an activity or interest continuing
knuckle down|get serious and work hard
pull one's socks up|improve one's effort or behaviour
put pen to paper|begin writing
hit the books|study seriously
do the spadework|do the difficult preliminary work
lay the groundwork|prepare the basis for future work
keep something at bay|prevent something harmful from approaching or worsening
go back to the drawing board|start planning again after failure
put one's back into something|work very hard at a task
make light work of something|complete a difficult task with apparent ease
#money_trade
cook the books|falsify financial records
balance the books|make financial accounts agree correctly
grease someone's palm|bribe someone
under the table|secretly and often dishonestly
hard cash|money in the form of notes and coins
pay one's way|pay for one's own expenses
keep the wolf from the door|earn enough to avoid hunger or severe poverty
cut one's coat according to one's cloth|live within the limits of one's income
rob Peter to pay Paul|solve one debt by creating another
throw good money after bad|waste more money trying to recover an earlier loss
on a shoestring|with very little money
a golden handshake|a large payment given when someone leaves a job
a white elephant|an expensive possession that is costly and useless
cash-strapped|having very little available money
a going concern|a business that is operating successfully
corner the market|gain control of the supply of a product
drive a hard bargain|negotiate strongly for favourable terms
sweeten the deal|make an offer more attractive
sell like hot cakes|sell very quickly and in large quantities
bring something to market|make a product available for sale
#emotion_relationship
wear rose-coloured spectacles|view a situation too optimistically
have a heart of gold|be very kind and generous
have a heart of stone|be cold and unsympathetic
no love lost|mutual dislike between people
mend fences|repair a damaged relationship
build bridges|improve relations between people or groups
break someone's heart|cause someone deep emotional pain
take something to heart|be deeply affected by criticism or an event
have one's heart set on something|want something very strongly
one's heart sinks|suddenly feel worried or disappointed
pour one's heart out|tell someone one's deepest feelings
eat one's heart out|feel intense unhappiness or envy
heart and soul|with complete energy and commitment
get under someone's skin|annoy or strongly affect someone
keep company with someone|spend time socially with someone
one's heart goes out to someone|feel deep sympathy for someone
bury one's differences|stop quarrelling despite disagreements
patch up a quarrel|restore friendly relations after a dispute
be on good terms|have a friendly relationship
be on bad terms|have an unfriendly relationship
#risk_problem
open a can of worms|create a complicated set of new problems
between a rock and a hard place|forced to choose between two difficult alternatives
on the horns of a dilemma|faced with two equally difficult choices
fall between two stools|fail because of trying to satisfy two different aims
have the sword of Damocles hanging over one|live under a constant threat
raise a red flag|signal possible danger or a problem
set alarm bells ringing|cause people to suspect danger or trouble
dodge a bullet|narrowly avoid a serious problem
have a brush with death|come close to dying
run a risk|expose oneself to possible danger or loss
at one's peril|with the risk of serious consequences
put all one's eggs in one basket|risk everything on a single plan
burn one's bridges|destroy the possibility of returning to an earlier position
cross that bridge when one comes to it|deal with a problem only when it actually arises
bell the cat|undertake a dangerous task for the benefit of others
be skating on thin ice|be in a risky situation where one mistake may cause trouble
a ticking time bomb|a situation likely to become dangerous suddenly
a recipe for disaster|a combination of conditions likely to cause failure
have trouble brewing|have signs that problems are developing
stare disaster in the face|be confronted with very serious danger
#time_change
for donkey's years|for a very long time
not in a month of Sundays|very unlikely to happen for a long time
when pigs fly|never or almost certainly never
on borrowed time|living or continuing longer than expected
bide one's time|wait patiently for the right opportunity
mark time|wait without making progress
buy time|delay something to gain more time
kill time|do something merely to pass the time
have time on one's hands|have more free time than needed
stand the test of time|remain successful or respected for a long period
in the fullness of time|eventually when the right time arrives
at all hours|at many unusual times of day or night
in the twinkling of an eye|in a very short moment
in the blink of an eye|extremely quickly
at a snail's pace|very slowly
at breakneck speed|dangerously fast
time after time|repeatedly
from the word go|from the very beginning
the sands of time|the passage of time
a race against time|an attempt to finish something before a deadline
#knowledge_judgment
a rule of thumb|a practical general guideline based on experience
common knowledge|information known by many people
an educated guess|a prediction based on knowledge rather than certainty
in a nutshell|in a few words
chapter and verse|full and exact details or evidence
have the inside track|have special information or an advantageous position
keep one's ear to the ground|stay alert for new information or developments
put one's finger on something|identify something exactly
cannot make head or tail of something|be unable to understand something
be all Greek to someone|be completely incomprehensible
know the score|understand the true situation
get someone's drift|understand the general meaning of what someone says
follow the thread|understand the sequence of an argument or story
lose the thread|stop understanding the sequence of an argument or story
piece the puzzle together|combine clues to understand a situation
connect the dots|combine separate facts to see the whole situation
take something with a pinch of salt|treat a claim with some doubt
jump to conclusions|form an opinion before having enough evidence
give someone the benefit of the doubt|choose to believe someone despite uncertainty
see through something|recognise the truth behind deception or appearance
#character_people
holier than thou|showing a morally superior attitude
two-faced|deceitful by behaving differently to different people
a Jekyll and Hyde|a person with two very different sides to their character
a snake in the grass|a secretly treacherous person
a sitting duck|a person or thing easily attacked or defeated
a paper tiger|something that appears powerful but is actually weak
a big mouth|a person who talks too much or reveals secrets
wet behind the ears|young and inexperienced
old school|traditional in ideas or methods
a smart cookie|an intelligent and capable person
an eager beaver|a person who is unusually enthusiastic about work
a busy bee|a very active and busy person
an early bird|a person who acts or arrives early
a night owl|a person who stays awake or works late at night
a blue-eyed boy|a person specially favoured by someone in authority
teacher's pet|a pupil specially favoured by a teacher
a stuffed shirt|a formal and self-important person
a shrinking violet|a very shy person
a rolling stone|a person who does not settle in one place or job
a smooth operator|a person skilled at getting what they want through charm
#conflict_power
hold one's own|defend oneself successfully in a difficult situation
toe the line|obey rules or accepted standards
draw the battle lines|make opposing positions clear
clear the decks|prepare for action by removing obstacles
cross the line|go beyond acceptable limits
take the law into one's own hands|punish someone without legal authority
show someone who's boss|demonstrate who has control
have someone over a barrel|have someone in a position where they must obey
turn the screws|apply increasing pressure
close ranks|unite in support against criticism or attack
break ranks|stop supporting a group and act independently
join forces|work together for a common purpose
make common cause|cooperate because of a shared interest
open old wounds|bring back painful past conflicts
settle a score|take revenge for a past wrong
even the score|retaliate so that neither side has an advantage
hold someone to account|require someone to explain or accept responsibility
call someone to order|formally require someone to behave properly
take someone to task|criticise someone strongly for a fault
stand up to someone|resist someone firmly
#appearance_deception
pull the wool over someone's eyes|deceive someone
smoke and mirrors|deceptive presentation used to hide the truth
window dressing|superficial changes made to create a good appearance
under false pretences|by deceiving someone about one's true intentions
under false colours|while pretending to be something one is not
at face value|according to the apparent meaning without deeper examination
take something at face value|accept something exactly as it appears
put on a brave face|pretend to be cheerful despite difficulty
save face|avoid humiliation or loss of respect
lose face|suffer humiliation or loss of respect
keep up appearances|pretend that a situation is better than it really is
make a show of something|display something deliberately for effect
a white lie|a small lie told to avoid hurting someone
be economical with the truth|avoid telling the whole truth
a red herring|a misleading clue or distraction
a blind alley|a course of action that leads nowhere
a false alarm|a warning of danger that proves unfounded
a cover-up|an attempt to hide wrongdoing or embarrassing facts
put up a front|present a false appearance of confidence or respectability
see behind the mask|recognise someone's real character or intentions
#classical_misc
Achilles' heel|a person's main weakness
a Pyrrhic victory|a victory gained at such great cost that it is almost a defeat
Hobson's choice|a situation in which there is only one real choice
cut the Gordian knot|solve a difficult problem by bold decisive action
a Trojan horse|something intended to undermine from within while appearing harmless
the Midas touch|the ability to make ventures highly successful
a swan song|a final performance or piece of work before retirement or death
a red-letter day|a very important or memorable day
halcyon days|a peaceful and happy period in the past
dog days|the hottest period of the year or a stagnant period
bread and butter|a person's main source of income
an acid test|a decisive test of value or quality
a litmus test|a test that reveals the true character of something
a bone of contention|a subject that causes disagreement
an apple of discord|something that causes quarrelling
a fly in the ointment|a small problem that spoils an otherwise good situation
the last straw|the final problem that makes a situation intolerable
the straw that broke the camel's back|the final small burden that causes collapse
a feather in one's cap|an achievement to be proud of
the writing on the wall|a clear sign that failure or disaster is approaching
`.trim();

const rows:Eng005Cp003EntryV1[]=[];let category="";let within=0;
for(const raw of RAW.split("\n")){const line=raw.trim();if(!line)continue;if(line.startsWith("#")){category=line.slice(1);within=0;continue;}const [phrase,meaning]=line.split("|");if(!phrase||!meaning)throw new Error(`Invalid ENG-005 CP003 row: ${line}`);const difficulty:Eng005Cp003Difficulty=within<4?"easy":within<12?"medium":"hard";rows.push({id:`IDIOM3-${String(rows.length+1).padStart(3,"0")}`,phrase,meaning,category,difficulty});within++;}
export const ENG005_CP003_IDIOMS_V1=Object.freeze(rows);
export function eng005Cp003PoolV1(difficulty:Eng005Cp003Difficulty){return ENG005_CP003_IDIOMS_V1.filter(x=>x.difficulty===difficulty);}
