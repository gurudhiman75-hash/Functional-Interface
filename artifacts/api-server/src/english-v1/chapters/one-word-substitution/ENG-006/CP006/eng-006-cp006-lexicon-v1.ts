export type Eng006Cp006Difficulty="easy"|"medium"|"hard";
export interface Eng006Cp006EntryV1{id:string;answer:string;definition:string;category:string;difficulty:Eng006Cp006Difficulty;}

const RAW=`
#logic_reasoning
axiom|a statement accepted as true without needing proof and used as a basis for reasoning
postulate|a principle assumed to be true as a starting point for argument or theory
theorem|a proposition proved by logical reasoning from accepted principles
hypothesis|a proposed explanation that can be tested by evidence
conjecture|an opinion or conclusion formed on incomplete evidence
corollary|a result that follows naturally from an already established proposition
premise|a statement on which an argument or conclusion is based
inference|a conclusion reached from evidence and reasoning
deduction|reasoning from general principles to a specific conclusion
induction|reasoning from specific observations to a general conclusion
syllogism|a form of reasoning in which a conclusion follows from two stated premises
fallacy|an error in reasoning that makes an argument invalid or misleading
sophistry|clever but misleading reasoning intended to deceive
analogy|a comparison used to explain a similarity between otherwise different things
dictum|a formal or authoritative statement or pronouncement
maxim|a short statement expressing a general rule of conduct or truth
truism|a statement that is obviously true and says little that is new
platitude|an overused statement presented as meaningful or original
cliché|an expression or idea that has become unoriginal through overuse
proposition|a statement put forward for consideration, proof, or argument
#crafts_trades
luthier|a person who makes or repairs stringed musical instruments
engraver|a person who cuts designs or lettering into hard surfaces
sculptor|an artist who creates three-dimensional works by carving or modelling
potter|a person who makes objects from clay
weaver|a person who makes fabric by interlacing threads
jeweller|a person who makes, repairs, or sells jewellery
florist|a person who sells and arranges flowers
perfumer|a person who creates or sells perfumes
milliner|a person who makes or sells women's hats
haberdasher|a dealer in sewing materials or men's small clothing items
upholsterer|a person who fits furniture with padding, springs, and fabric
carpenter|a person skilled in making and repairing wooden structures
mason|a worker skilled in building with stone or brick
glazier|a person whose trade is fitting glass into windows and frames
plumber|a person who installs and repairs water pipes and sanitary systems
farrier|a person who shoes horses and cares for their hooves
cooper|a person who makes or repairs wooden barrels and casks
tanner|a person who converts animal hides into leather
blacksmith|a person who shapes iron or steel by heating and hammering
watchmaker|a person who makes or repairs watches and clocks
#speech_language_disorders
aphonia|loss of the ability to produce voiced sound
dysarthria|difficulty speaking clearly because of impaired control of speech muscles
dysphonia|a disorder affecting the quality, pitch, or loudness of the voice
dysgraphia|a learning difficulty affecting writing
dyscalculia|a learning difficulty affecting understanding of numbers and arithmetic
alexia|loss of the ability to read despite previously having that ability
agraphia|loss of the ability to write despite previously having that ability
anomia|difficulty recalling or producing the names of objects or people
echolalia|automatic repetition of words or phrases spoken by another person
palilalia|involuntary repetition of one's own words or phrases
mutism|the inability or refusal to speak
lisp|a speech defect involving incorrect production of certain consonant sounds
stammer|speech marked by involuntary pauses or repetition of sounds
logorrhoea|excessive and often incoherent talkativeness
glossolalia|speech-like utterance of unintelligible sounds, often in a religious context
paraphasia|production of unintended words or sounds during speech
coprolalia|involuntary utterance of obscene or socially inappropriate words
bradylalia|abnormally slow speech
tachylalia|abnormally rapid speech
dysprosody|abnormal rhythm, stress, or intonation in speech
#legal_contracts
covenant|a formal binding agreement or promise
deed|a signed legal document that records a transfer, right, or obligation
lease|a contract granting the use of property for a period in return for payment
tenancy|the legal condition of occupying property as a tenant
easement|a legal right to use another person's land for a specific purpose
lien|a legal claim over property as security for a debt
usufruct|the legal right to use and benefit from property owned by another
bequest|property or money left to someone by a will
legacy|money or property left to someone in a will
probate|the legal process of proving and administering a will
codicil|a legal document that modifies an existing will
intestacy|the condition of dying without a valid will
guardianship|legal responsibility for caring for a person unable to manage their own affairs
surety|a person or arrangement guaranteeing another person's debt or obligation
indemnity|protection or compensation against financial loss or legal liability
escrow|property or money held by a third party until agreed conditions are met
novation|replacement of an existing contract with a new one by agreement
subrogation|the legal substitution of one party for another in claiming rights or remedies
forfeiture|loss of property or rights as a penalty for wrongdoing or breach
foreclosure|the legal process by which a lender takes possession of mortgaged property after default
#crime_offences
embezzlement|dishonest appropriation of money entrusted to one's care
fraud|intentional deception for financial or personal gain
forgery|the making of a false document, signature, or object with intent to deceive
bribery|the giving or receiving of something valuable to influence an official action
corruption|dishonest or unlawful conduct by a person in authority
racketeering|organised criminal activity carried on as an illegal business
trespass|unlawful entry onto another person's land or property
assault|an act that intentionally causes another person to fear immediate unlawful violence
battery|unlawful physical contact or force against another person
manslaughter|unlawful killing of a person without the intent required for murder
shoplifting|stealing goods from a shop while pretending to be a customer
pickpocketing|stealing from a person's pocket or bag without their noticing
mugging|attacking and robbing someone in a public place
stalking|repeatedly following or harassing someone in a threatening manner
trafficking|illegal trade in people, drugs, or other prohibited goods
bootlegging|illegal manufacture, distribution, or sale of restricted goods
laundering|concealing the criminal origin of money by making it appear legitimate
plagiarism|presenting another person's words or ideas as one's own
impersonation|pretending to be another person, often to deceive
cybercrime|criminal activity carried out using computers or networks
#residence_inhabitants
resident|a person who lives in a particular place
citizen|a legally recognised member of a state with rights and duties
alien|a person living in a country who is not a citizen of that country
foreigner|a person from a country other than the one being considered
settler|a person who moves to a new area and establishes a permanent home there
colonist|a person who settles in a colony
migrant|a person who moves from one place to another, often for work
diaspora|a population dispersed from its original homeland
domicile|a person's permanent legal home
denizen|an inhabitant or regular occupant of a particular place
urbanite|a person who lives in a city
villager|a person who lives in a village
islander|a person who lives on an island
highlander|a person who lives in a highland or mountainous region
mountaineer|a person skilled in climbing mountains
frontiersman|a person who lives or works on the frontier of settled territory
countryman|a person from the same country as another
compatriot|a fellow citizen or person from the same country
native|a person born in a particular place
aborigine|an indigenous inhabitant of a region, especially from its earliest known population
#personality_traits
magnanimous|generous and forgiving, especially toward a rival or weaker person
parsimonious|extremely unwilling to spend money or use resources
prodigal|wastefully extravagant in spending money or resources
gregarious|fond of company and sociable
solitary|preferring to be alone or living alone
indolent|habitually lazy and avoiding effort
diligent|showing steady and careful effort in work
meticulous|very careful and precise about details
fastidious|very attentive to detail, cleanliness, or accuracy
credulous|too ready to believe things without enough evidence
incredulous|unwilling or unable to believe something
pragmatic|dealing with problems in a practical rather than theoretical way
obstinate|stubbornly refusing to change one's opinion or course of action
docile|easily taught, controlled, or managed
belligerent|hostile and aggressive
benevolent|kind and generous toward others
malevolent|wishing to cause harm or evil to others
impartial|treating all sides fairly without favour
partisan|strongly supporting one side or cause
reticent|not revealing one's thoughts or feelings readily
#education_learning
pedagogue|a teacher, especially one who is strict or formal
autodidact|a person who has taught themselves without formal instruction
scholar|a person with deep learning in a particular subject
savant|a person with profound or specialised knowledge
polymath|a person with wide knowledge across many different subjects
laureate|a person honoured for outstanding achievement in a field
alumnus|a male graduate or former student of an institution
alumna|a female graduate or former student of an institution
dropout|a person who leaves school or a course before completing it
undergraduate|a student studying for a first university degree
postgraduate|a student studying after completing a first degree
valedictorian|the student who delivers the farewell speech at a graduation ceremony
salutatorian|the graduate ranked second in a class who gives a welcoming speech at graduation
apprentice|a person learning a trade from a skilled worker
intern|a trainee working to gain practical professional experience
trainee|a person undergoing training for a job or skill
tutor|a person who gives individual or small-group instruction
preceptor|an instructor or mentor responsible for guiding a student
invigilator|a person who supervises candidates during an examination
examiner|a person who sets, conducts, or assesses an examination
#architecture_parts
portico|a roofed entrance supported by columns
colonnade|a row of columns supporting a roof or entablature
dome|a rounded roof forming part of a sphere
cupola|a small dome-like structure on top of a roof
spire|a tall pointed structure on the top of a building
turret|a small tower projecting from a building
parapet|a low protective wall along the edge of a roof, bridge, or balcony
cornice|a projecting decorative moulding along the top of a wall
lintel|a horizontal support across the top of a door or window
sill|the horizontal base of a window or doorway
facade|the principal front face of a building
pediment|a triangular upper part of the front of a classical building
nave|the central part of a church where the congregation sits
transept|the part of a church crossing the nave at right angles
apse|a rounded or polygonal recess at the end of a church
crypt|an underground room or vault beneath a church, often used for burial
minaret|a tall slender tower attached to or near a mosque
steeple|a tall tower on a church, often topped by a spire
buttress|a projecting support built against a wall to strengthen it
alcove|a small recessed section of a room or wall
#botany_terms
rhizome|a horizontal underground plant stem that produces roots and shoots
tuber|a swollen underground plant part used for food storage
bulb|an underground storage organ made of fleshy leaf bases
corm|a short swollen underground plant stem used for storage
stolon|a horizontal stem growing along the ground and producing new plants
tendril|a slender coiling plant part used for climbing or support
thorn|a hard pointed plant structure formed from a modified branch or stem
spine|a sharp pointed plant structure often formed from a modified leaf
bract|a modified leaf associated with a flower or inflorescence
sepal|one of the outer leaf-like parts protecting a flower bud
petal|one of the usually coloured parts of a flower
stamen|the pollen-producing male reproductive part of a flower
pistil|the female reproductive structure of a flower
ovary|the part of a flower containing ovules
cotyledon|an embryonic leaf in a seed
xylem|plant tissue that transports water and minerals upward
phloem|plant tissue that transports sugars and other organic nutrients
stoma|a tiny pore in a leaf or stem used for gas exchange
chlorophyll|the green pigment that absorbs light for photosynthesis
grafting|joining plant tissues so that they grow together as one plant
#philosophy_social
nihilist|a person who rejects established moral, religious, or social principles
utilitarian|a person who believes actions should be judged by the greatest overall benefit
existentialist|a person who emphasises individual freedom, choice, and responsibility
pragmatist|a person who judges ideas mainly by their practical results
pluralist|a person who supports coexistence of multiple groups, ideas, or centres of power
fundamentalist|a person who strictly adheres to basic traditional doctrines
libertarian|a person who strongly values individual liberty and limited government
authoritarian|a person who favours strict obedience to authority
totalitarian|a person who supports a system in which the state exercises extensive control over public and private life
populist|a person who claims to represent ordinary people against an elite
elitist|a person who believes a society should be led by a select superior group
revisionist|a person who challenges and seeks to revise an accepted interpretation or doctrine
traditionalist|a person who supports long-established customs or beliefs
modernist|a person who favours modern ideas and methods over traditional ones
conformist|a person who behaves according to accepted standards and customs
nonconformist|a person who refuses to follow accepted customs or beliefs
dissident|a person who openly disagrees with an established authority or doctrine
radical|a person who advocates far-reaching political or social change
moderate|a person whose views avoid extremes
reactionary|a person who opposes change and seeks a return to earlier conditions
#music_terms
soprano|the highest standard adult singing voice
alto|a low female or high male singing voice
tenor|a high adult male singing voice
bass|the lowest adult male singing voice
baritone|a male singing voice between tenor and bass
contralto|the lowest female singing voice
falsetto|an unusually high voice produced using a special vocal register
vibrato|a rapid slight variation in pitch used to enrich a musical tone
tremolo|rapid repetition or wavering of a musical note
crescendo|a gradual increase in loudness
diminuendo|a gradual decrease in loudness
forte|a musical direction to play loudly
piano|a musical direction to play softly
staccato|a style in which notes are played short and detached
legato|a style in which notes are played smoothly and connected
octave|the interval between one musical note and another with twice its frequency
semitone|the smallest standard interval in Western music
timbre|the distinctive tonal quality of a sound or voice
pitch|the perceived highness or lowness of a sound
tempo|the speed at which a piece of music is performed
`.trim();

const rows:Eng006Cp006EntryV1[]=[];let category="";let within=0;
for(const raw of RAW.split("\n")){const line=raw.trim();if(!line)continue;if(line.startsWith("#")){category=line.slice(1);within=0;continue;}const [answer,definition]=line.split("|");if(!answer||!definition)throw new Error(`Invalid ENG-006 CP006 row: ${line}`);const difficulty:Eng006Cp006Difficulty=within<4?"easy":within<12?"medium":"hard";rows.push({id:`OWS6-${String(rows.length+1).padStart(3,"0")}`,answer,definition,category,difficulty});within++;}
export const ENG006_CP006_ENTRIES_V1=Object.freeze(rows);
export function eng006Cp006PoolV1(difficulty:Eng006Cp006Difficulty){return ENG006_CP006_ENTRIES_V1.filter(x=>x.difficulty===difficulty);}
