export type Eng005Difficulty="easy"|"medium"|"hard";
export type Eng005Mode="idiom-to-meaning"|"meaning-to-idiom";
export interface Eng005IdiomEntryV1{id:string;phrase:string;meaning:string;category:string;difficulty:Eng005Difficulty;}

const RAW=`
#communication_truth
call a spade a spade|speak plainly and directly
beat around the bush|avoid saying the main point
spill the beans|reveal a secret
let the cat out of the bag|reveal a secret unintentionally
read between the lines|understand a hidden meaning
in black and white|clearly written or printed
by word of mouth|through spoken communication
straight from the horse's mouth|directly from the original source
talk through one's hat|speak without knowing the facts
give someone a piece of one's mind|speak angrily and frankly to someone
keep something under one's hat|keep something secret
make a long story short|give only the main points
speak volumes|convey a great deal without many words
hold one's tongue|remain silent
get a word in edgeways|manage to speak during a long conversation
#success_failure
hit the nail on the head|say or do exactly the right thing
miss the boat|lose an opportunity
back to square one|return to the starting point after failure
go places|be likely to become successful
come through with flying colours|succeed very well
fall flat|fail to have the intended effect
make the grade|reach the required standard
turn the corner|begin to improve after difficulty
steal a march on someone|gain an advantage by acting first
rest on one's laurels|rely on past success instead of making further effort
break new ground|do something innovative
go down in flames|fail in a very obvious way
have the last laugh|succeed after others expected failure
rise to the occasion|perform well in a difficult situation
leave one's mark|have a lasting effect or influence
#work_effort
burn the midnight oil|work or study late into the night
go the extra mile|make more effort than is expected
leave no stone unturned|try every possible way
work one's fingers to the bone|work extremely hard
put one's shoulder to the wheel|begin working hard on a task
pull one's weight|do one's fair share of work
keep one's nose to the grindstone|work continuously and hard
by the sweat of one's brow|through hard physical effort
move heaven and earth|make every possible effort
bend over backwards|try very hard to help or please
give it one's best shot|make one's best possible attempt
take pains|make careful and considerable effort
spare no effort|do everything possible
learn the ropes|learn how a job or activity is done
cut corners|save effort or money by doing something less thoroughly
#money_business
make ends meet|manage expenses with available income
cost an arm and a leg|be extremely expensive
pay through the nose|pay much more than something is worth
feather one's nest|make money unfairly for oneself
in the red|in debt or operating at a loss
in the black|financially profitable or free from debt
break even|have neither profit nor loss
bring home the bacon|earn money for the household
tighten one's belt|reduce spending because money is limited
a nest egg|money saved for the future
a cash cow|a reliable source of profit
penny wise and pound foolish|careful about small costs but wasteful about larger ones
worth one's salt|competent enough to deserve one's pay
foot the bill|pay the cost
go for a song|be sold very cheaply
#emotions_relationships
the apple of one's eye|a person who is greatly loved
give someone the cold shoulder|deliberately ignore or reject someone
bury the hatchet|end a quarrel and make peace
see eye to eye|agree fully
have a soft spot for|feel special affection for
lose heart|become discouraged
get cold feet|become nervous and withdraw from a plan
on cloud nine|extremely happy
green with envy|very jealous
one's heart in one's mouth|very frightened or anxious
wear one's heart on one's sleeve|show emotions openly
at daggers drawn|in bitter hostility
as thick as thieves|very close and secretive friends
a fair-weather friend|a friend who disappears in difficult times
through thick and thin|in both good and bad times
#risk_trouble
in hot water|in serious trouble
on thin ice|in a risky or uncertain situation
out of the frying pan into the fire|move from a bad situation to a worse one
stir up a hornet's nest|cause a lot of trouble or anger
ask for trouble|behave in a way likely to cause problems
bite the bullet|face a difficult situation bravely
face the music|accept the unpleasant consequences of one's actions
take the bull by the horns|deal with a difficult problem directly
between the devil and the deep blue sea|caught between two dangerous choices
under fire|being strongly criticised or attacked
in deep water|in a difficult or dangerous situation
walk on eggshells|act very carefully to avoid upsetting someone
play with fire|take a dangerous risk
open Pandora's box|create many unexpected problems
have one's back to the wall|be in a situation with very few choices
#time_frequency
once in a blue moon|very rarely
at the eleventh hour|at the last possible moment
in the nick of time|just before it is too late
at the drop of a hat|immediately and without planning
from time to time|occasionally
round the clock|all day and all night
day in, day out|every day for a long period
in no time|very quickly
for good|permanently
sooner or later|at some future time
at the crack of dawn|very early in the morning
till the cows come home|for a very long time
once and for all|finally and permanently
age-old|existing for a very long time
on the spur of the moment|without previous planning
#knowledge_understanding
know the ropes|understand how something is done
know something inside out|know something extremely well
not have a clue|have no knowledge or idea
draw a blank|fail to remember or find an answer
ring a bell|seem familiar
food for thought|something worth thinking seriously about
put two and two together|infer the truth from available facts
learn by heart|memorise exactly
keep abreast of|stay informed about recent developments
be in the dark|lack important information
see the light|finally understand or realise the truth
catch on|understand something
get the picture|understand the situation
a grey area|a matter with no clear rule or answer
know which way the wind blows|understand how a situation is likely to develop
#behavior_character
a chip off the old block|a person very similar to a parent
a wolf in sheep's clothing|a dangerous person who appears harmless
a dark horse|a person whose abilities are not well known
a dog in the manger|someone who prevents others using what they cannot use
a wet blanket|a person who spoils other people's enjoyment
a big fish in a small pond|an important person in a limited setting
a jack of all trades|a person able to do many different kinds of work
a man of letters|a learned person devoted to literature
the salt of the earth|a very good and honest person
an old hand|a very experienced person
a loose cannon|an unpredictable person likely to cause trouble
a couch potato|a person who spends much time sitting and watching television
a back-seat driver|someone who gives unwanted advice to the person in control
a rotten apple|a bad person who has a harmful influence on a group
a square peg in a round hole|a person unsuitable for a particular role
#conflict_decision
fight tooth and nail|fight with great determination
cross swords|have an argument or conflict
lock horns|enter into a serious dispute
draw the line|set a firm limit
take sides|support one party in a dispute
stand one's ground|refuse to change one's position under pressure
have an axe to grind|have a personal reason for being involved
add fuel to the fire|make a bad situation worse
pour oil on troubled waters|try to calm a disagreement
agree to disagree|accept that an argument will not be resolved
call the shots|make the important decisions
take matters into one's own hands|act independently instead of waiting for others
sit on the fence|avoid choosing between two sides
make up one's mind|reach a decision
stick to one's guns|refuse to change one's opinion or decision
#situation_change
turn the tables|reverse a situation to one's advantage
weather the storm|survive a difficult period
a blessing in disguise|something that seems bad but proves beneficial
every cloud has a silver lining|something good can be found in a bad situation
the tip of the iceberg|a small visible part of a much larger problem
a storm in a teacup|great excitement about a small matter
a change of heart|a change in one's feelings or opinion
a new lease of life|a fresh period of energy or usefulness
turn over a new leaf|start behaving in a better way
go from bad to worse|become progressively worse
a far cry from|very different from
the order of the day|the usual or expected situation
a mixed blessing|something with both advantages and disadvantages
a necessary evil|an unpleasant thing that must be accepted
a chain reaction|a series of events in which each causes the next
#social_status
the lion's share|the largest part
play second fiddle|take a less important role
rub shoulders with|mix socially with
keep up with the Joneses|try to match other people's social status
born with a silver spoon in one's mouth|born into a wealthy family
from rags to riches|from poverty to wealth
high and mighty|arrogantly important
in someone's good books|in someone's favour
in someone's bad books|out of favour with someone
under someone's thumb|under another person's control
pull strings|use influence to obtain an advantage
the red-carpet treatment|special and impressive treatment
at someone's beck and call|always ready to obey someone's orders
top dog|the most powerful or important person
rank and file|ordinary members of an organisation
`.trim();

const rows:Eng005IdiomEntryV1[]=[];let category="";let within=0;
for(const raw of RAW.split("\n")){const line=raw.trim();if(!line)continue;if(line.startsWith("#")){category=line.slice(1);within=0;continue;}const [phrase,meaning]=line.split("|");if(!phrase||!meaning)throw new Error(`Invalid ENG-005 row: ${line}`);const difficulty:Eng005Difficulty=within<5?"easy":within<12?"medium":"hard";rows.push({id:`IDIOM-${String(rows.length+1).padStart(3,"0")}`,phrase,meaning,category,difficulty});within++;}
export const ENG005_CP001_IDIOMS_V1=Object.freeze(rows);
export function eng005Cp001PoolV1(difficulty:Eng005Difficulty){return ENG005_CP001_IDIOMS_V1.filter(x=>x.difficulty===difficulty);}
