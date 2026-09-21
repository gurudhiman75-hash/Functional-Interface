export type Eng006Cp005Difficulty="easy"|"medium"|"hard";
export interface Eng006Cp005EntryV1{id:string;answer:string;definition:string;category:string;difficulty:Eng006Cp005Difficulty;}

const RAW=`
#people_personality
misandrist|a person who strongly dislikes or despises men
misogamist|a person who dislikes or avoids marriage
philanderer|a man who has casual romantic relationships with many women
gourmet|a person with refined knowledge and taste in food
gourmand|a person who enjoys eating and often eats a great deal
bibliophile|a person who loves or collects books
logophile|a person who loves words
xenophile|a person attracted to foreign peoples, cultures, or customs
malingerer|a person who pretends to be ill to avoid work or duty
charlatan|a person who falsely claims special knowledge or skill
quack|a person who dishonestly claims medical knowledge or qualifications
demagogue|a political leader who gains support by appealing to popular emotions and prejudices
dilettante|a person who takes up an art or subject superficially rather than seriously
prodigy|a young person with exceptional ability in a particular field
protégé|a person guided and supported by an older or more experienced person
mentor|an experienced adviser who guides a less experienced person
benefactor|a person who gives money or help to a person or cause
mercenary|a person primarily motivated by money or personal gain
poseur|a person who pretends to be what they are not in order to impress others
fop|a man excessively concerned with fashionable clothes and appearance
#medical_specialists
optometrist|a professional who examines eyes and tests vision
radiologist|a doctor who specialises in medical imaging
anaesthetist|a doctor who administers anaesthesia during medical procedures
oncologist|a doctor who specialises in the treatment of cancer
nephrologist|a doctor who specialises in kidney diseases
endocrinologist|a doctor who specialises in hormone-related disorders
gastroenterologist|a doctor who specialises in diseases of the digestive system
pulmonologist|a doctor who specialises in diseases of the lungs
haematologist|a doctor or scientist who specialises in blood and blood disorders
epidemiologist|a scientist who studies patterns and causes of disease in populations
bacteriologist|a scientist who studies bacteria
virologist|a scientist who studies viruses
geneticist|a scientist who studies heredity and genes
ecologist|a scientist who studies relationships between organisms and their environment
cytologist|a scientist who studies cells
histologist|a scientist who studies tissues
toxicologist|a specialist who studies poisons and their effects
pharmacologist|a scientist who studies drugs and their effects
urologist|a doctor who specialises in the urinary system
rheumatologist|a doctor who specialises in rheumatic and autoimmune diseases
#medicine_conditions
myopia|a condition in which distant objects are seen less clearly than near ones
hypermetropia|a condition in which near objects are seen less clearly than distant ones
presbyopia|age-related difficulty in focusing on nearby objects
astigmatism|blurred vision caused by irregular curvature of the eye
jaundice|yellowing of the skin or eyes due to excess bilirubin
oedema|swelling caused by excess fluid in body tissues
cyanosis|bluish discoloration of the skin caused by inadequate oxygen
syncope|temporary loss of consciousness caused by reduced blood flow to the brain
sepsis|a life-threatening body response to infection
gangrene|death of body tissue due to loss of blood supply or infection
arthritis|inflammation of one or more joints
osteoporosis|a condition in which bones become weak and brittle
bronchitis|inflammation of the bronchial tubes
nephritis|inflammation of the kidneys
hepatitis|inflammation of the liver
dermatitis|inflammation of the skin
tonsillitis|inflammation of the tonsils
conjunctivitis|inflammation of the membrane covering the front of the eye
tachycardia|an abnormally rapid heart rate
bradycardia|an abnormally slow heart rate
#government_power
kleptocracy|government by rulers who use power to steal the country's resources
kakistocracy|government by the least suitable or least competent citizens
stratocracy|government controlled by the military
ochlocracy|government by a mob or disorderly crowd
timocracy|government in which property ownership or wealth determines political power
diarchy|government in which power is shared by two independent authorities
junta|a military or political group that rules a country after taking power
protectorate|a state controlled and protected by another more powerful state
satrapy|a territory governed by a satrap in an ancient empire
hegemony|dominant influence or control exercised by one state or group over others
suzerainty|control by a powerful state over another state that retains some internal independence
autonomy|the right or condition of self-government
devolution|transfer of powers from central government to a lower or regional authority
secession|formal withdrawal of a region or group from a larger political body
annexation|the act of adding territory to a state, usually by force or legal claim
coalition|an alliance of groups or parties formed for a common purpose
opposition|the political parties or groups that are not in government
bicameralism|a legislative system with two chambers
unicameralism|a legislative system with one chamber
gerrymandering|manipulation of electoral district boundaries for political advantage
#law_justice
jurisprudence|the theory or philosophy of law
litigation|the process of resolving a dispute through a court
arbitrator|an independent person appointed to settle a dispute
mediator|a neutral person who helps opposing parties reach agreement
adjudicator|a person officially appointed to make a formal judgment on a dispute
appellant|a person who asks a higher court to review a lower court decision
respondent|a person who answers an appeal or legal petition
petitioner|a person who formally asks a court or authority for action
testator|a person who has made a valid will
intestate|a person who dies without leaving a valid will
legatee|a person who receives personal property under a will
heir|a person legally entitled to inherit property
inheritor|a person who receives property, title, or characteristics by inheritance
felon|a person guilty of a serious crime
misdemeanour|a less serious criminal offence
recidivist|a person who repeatedly returns to criminal behaviour
juvenile|a young person below the legal age of adulthood
detention|the act of keeping someone in official custody
bail|temporary release of an accused person while awaiting trial
clemency|mercy shown by reducing or cancelling a punishment
#writing_publication
byline|a line in a publication naming the writer of an article
masthead|the title or identifying information printed at the top of a newspaper or magazine
foreword|an introductory section to a book, usually written by someone other than the author
afterword|a concluding section added after the main text of a book
addendum|additional material added at the end of a document
corrigendum|a correction of an error in a printed or published work
citation|a reference to a source used as evidence or authority
annotation|a note added to a text to explain or comment on it
marginalia|notes written in the margins of a book or document
folio|a sheet of paper folded once to form two leaves, or a page number in a manuscript
foliole|a small leaf or leaflet, especially of a compound leaf
codex|an ancient manuscript book made of bound pages
incunabulum|a book printed in Europe before the year 1501
periodical|a publication issued at regular intervals
magazine|a periodical publication containing articles and illustrations
newsletter|a regularly distributed publication giving news about a group or topic
bulletin|a short official statement or news report
circular|a letter or notice distributed to many people
leaflet|a small printed sheet giving information or advertising
handbill|a small printed notice distributed by hand
#language_rhetoric
circumlocution|the use of many words to express something that could be said briefly
sesquipedalian|characterised by the use of long words
grandiloquent|using language that is pompous or extravagantly impressive
bombastic|using high-sounding language with little meaning
didactic|intended primarily to teach or instruct
polemical|strongly critical or argumentative in writing or speech
rhetorical|expressed for persuasive effect rather than to obtain a literal answer
elliptical|leaving out words that are understood from context
idiomatic|natural to a language and not always predictable from literal meanings
polysemous|having several related meanings
monosemous|having only one meaning
eponym|a name or word derived from the name of a person
patronymic|a name derived from the name of a father or male ancestor
matronymic|a name derived from the name of a mother or female ancestor
toponym|a place name
demonym|a word used for an inhabitant or native of a particular place
loanword|a word adopted from another language
calque|a word or phrase borrowed by translating its parts literally from another language
portmanteau|a word formed by blending parts of two other words
backronym|a phrase deliberately constructed to fit an existing word as if it were an acronym
#earth_weather
earthquake|sudden shaking of the ground caused by movement in the Earth's crust
tsunami|a series of large sea waves caused by underwater disturbance
avalanche|a large mass of snow, ice, and rock falling rapidly down a mountainside
landslide|movement of rock, earth, or debris down a slope
drought|a long period of unusually low rainfall
famine|an extreme shortage of food affecting many people
cyclone|a large rotating storm system around a low-pressure centre
hurricane|a powerful tropical cyclone in the Atlantic or eastern Pacific
typhoon|a powerful tropical cyclone in the western Pacific
tornado|a violently rotating column of air extending from a storm to the ground
monsoon|a seasonal wind system that brings a marked change in rainfall
blizzard|a severe snowstorm with strong winds and low visibility
drizzle|very light rain falling in fine drops
hail|small balls or lumps of ice falling from storm clouds
dew|water droplets formed on cool surfaces by condensation
frost|a thin layer of ice formed when water vapour freezes on surfaces
mist|a cloud of tiny water droplets near the ground that reduces visibility slightly
fog|a dense cloud of tiny water droplets near the ground that greatly reduces visibility
geyser|a hot spring that intermittently ejects water and steam
delta|a landform created by sediment deposited at the mouth of a river
#geography_landforms
peninsula|a piece of land almost surrounded by water but joined to the mainland
isthmus|a narrow strip of land connecting two larger land areas
strait|a narrow waterway connecting two larger bodies of water
lagoon|a shallow body of water separated from the sea by a barrier
estuary|the tidal mouth of a river where fresh and salt water mix
tributary|a smaller river or stream that flows into a larger river
distributary|a branch of a river that flows away from the main channel
watershed|an area of land that drains into a particular river system
plateau|an extensive area of high flat land
plain|a large area of flat or gently rolling land
valley|a low area between hills or mountains, often containing a river
canyon|a deep narrow valley with steep sides
gorge|a narrow valley with steep rocky walls
cliff|a steep rock face, especially at the coast or beside a valley
dune|a mound or ridge of sand formed by wind
oasis|a fertile place in a desert where water is available
atoll|a ring-shaped coral island surrounding a lagoon
volcano|an opening in the Earth's crust through which molten rock and gases erupt
glacier|a large mass of ice moving slowly over land
fjord|a long narrow sea inlet between steep cliffs formed by glacial erosion
#economics_commerce
entrepreneur|a person who starts and manages a business while taking financial risk
monopsony|a market with only one major buyer
oligopsony|a market dominated by a small number of buyers
arbitrage|buying and selling in different markets to profit from price differences
speculation|buying or selling assets in the hope of profiting from price changes
liquidity|the ease with which an asset can be converted into cash
solvency|the ability to meet long-term financial obligations
insolvency|the state of being unable to pay debts when due
collateral|an asset pledged as security for a loan
mortgage|a loan secured against real property
debenture|a long-term debt instrument issued by a company
bond|a debt security through which an issuer borrows money from investors
equity|ownership interest in a company or property
capitalisation|the total value of a company's shares or the act of providing capital
turnover|the total sales of a business during a particular period
revenue|income received by a business before expenses are deducted
profit|the financial gain remaining after costs are deducted from income
deficit|the amount by which spending exceeds income
surplus|the amount by which income or supply exceeds expenditure or demand
remittance|money sent as payment or as support to someone elsewhere
#science_physics
inertia|the tendency of an object to resist a change in its state of motion
velocity|speed in a specified direction
acceleration|the rate at which velocity changes
momentum|the quantity of motion of a moving body
friction|the force resisting motion between surfaces in contact
buoyancy|the upward force exerted by a fluid on an immersed object
density|mass per unit volume of a substance
viscosity|a measure of a fluid's resistance to flow
refraction|bending of light or another wave when it passes between media
reflection|the return of light, sound, or heat from a surface
diffraction|spreading of waves around obstacles or through openings
interference|the combination of waves that produces reinforcement or cancellation
conduction|transfer of heat or electricity through direct contact
convection|transfer of heat by movement of a fluid
radiation|transfer of energy by electromagnetic waves
gravitation|the force of attraction between masses
electrolysis|chemical decomposition caused by passing electric current through a substance
ionisation|the process of forming ions by gaining or losing electrons
fusion|the joining of light atomic nuclei to form a heavier nucleus
fission|the splitting of a heavy atomic nucleus into smaller nuclei
#biology_anatomy
cell|the smallest structural and functional unit of a living organism
tissue|a group of similar cells performing a common function
organ|a body structure made of different tissues performing a specific function
organism|an individual living thing
enzyme|a biological catalyst that speeds up chemical reactions in living organisms
hormone|a chemical messenger produced in the body that regulates activity
antibody|a protein produced by the immune system that recognises a specific antigen
antigen|a substance that triggers an immune response
pathogen|a microorganism or agent capable of causing disease
vaccine|a preparation that stimulates immunity against a particular disease
chromosome|a structure carrying genetic information in a cell
gene|a unit of heredity made of DNA
mutation|a change in genetic material
mitosis|cell division producing two genetically identical daughter cells
meiosis|cell division producing reproductive cells with half the chromosome number
fertilisation|fusion of male and female reproductive cells
embryo|an early developmental stage of an organism after fertilisation
foetus|a later prenatal stage of a developing mammal
placenta|the temporary organ connecting a developing fetus to the mother's uterus
metabolism|the total set of chemical reactions occurring in a living organism
#environment_resources
ecosystem|a community of organisms interacting with each other and their physical environment
habitat|the natural home or environment of an organism
biodiversity|the variety of living organisms in an area
ecology|the study of relationships between organisms and their environment
conservation|protection and careful management of natural resources
preservation|protection of something from damage or change
reforestation|replanting trees in an area where forest has been removed
desertification|the process by which fertile land becomes desert
erosion|the wearing away and removal of soil or rock
weathering|the breakdown of rocks at or near the Earth's surface
pollution|the introduction of harmful substances into the environment
contamination|the presence of unwanted or harmful substances
eutrophication|excess nutrient enrichment of water causing rapid plant or algal growth
salinisation|the accumulation of salts in soil or water
renewable|capable of being naturally replenished within a useful time
nonrenewable|not capable of being replaced quickly after use
geothermal|relating to heat from within the Earth
hydroelectric|relating to electricity generated from moving water
solar|relating to energy obtained from the sun
biomass|organic material used as a fuel or source of energy
#actions_processes
assimilation|the process of absorbing and integrating people, ideas, or nutrients
integration|the process of combining separate parts into a unified whole
segregation|the separation of people or things into different groups
amalgamation|the combination of two or more things into one
consolidation|the process of making something stronger or combining it into a single whole
fragmentation|the process of breaking into smaller parts
diversification|the process of increasing variety or entering different activities
standardisation|the process of making things conform to a common standard
modernisation|the process of adopting modern methods, systems, or technology
mechanisation|the introduction of machines to perform work
automation|the use of automatic systems to perform processes with little human intervention
digitisation|the conversion of information into digital form
globalisation|the increasing worldwide integration of economies, societies, and cultures
liberalisation|the removal or easing of restrictions, especially in trade or economics
deregulation|the reduction or removal of government rules controlling an industry
mobilisation|the organisation of people or resources for action
demobilisation|the release of troops or resources from active service
proliferation|rapid increase or spread of something
eradication|the complete destruction or removal of something harmful
dissemination|the wide distribution of information or ideas
#objects_places
apothecary|a historical shop where medicines were prepared and sold
boutique|a small shop selling fashionable or specialised goods
emporium|a large shop or trading centre offering many kinds of goods
canteen|a place providing food and drink in an institution or workplace
cafeteria|a restaurant where customers serve themselves from a counter
hostel|a low-cost lodging place, often with shared rooms
inn|a small establishment providing accommodation, food, and drink
motel|a roadside hotel designed mainly for motorists
caravanserai|an inn with a courtyard for travellers and caravans
bungalow|a house usually built on one storey
chalet|a wooden house with a sloping roof, especially in mountain regions
pavilion|a light or open building used for recreation, exhibitions, or events
kiosk|a small open-fronted booth used for selling goods or information
arcade|a covered passage lined with shops or arches
atrium|a large open central space inside a building
verandah|a roofed platform along the outside of a building
balcony|a platform projecting from an upper floor of a building
cellar|an underground room used for storage
attic|a space or room directly below a roof
pantry|a small room or cupboard used for storing food and kitchen supplies
#age_time_people
septuagenarian|a person aged between seventy and seventy-nine
sexagenarian|a person aged between sixty and sixty-nine
quinquagenarian|a person aged between fifty and fifty-nine
quadragenarian|a person aged between forty and forty-nine
vicenarian|a person aged between twenty and twenty-nine
tricentenary|a three-hundredth anniversary
bicentenary|a two-hundredth anniversary
sesquicentennial|a one-hundred-and-fiftieth anniversary
jubilee|a special anniversary, especially of twenty-five, fifty, or more years
epoch|a long and distinct period of history
era|a period of history marked by distinctive events or characteristics
interlude|a short period between longer events or activities
hiatus|a pause or break in continuity
respite|a short period of rest or relief
interregnum|a period between successive reigns or governments
antecedent|something that existed or happened before another event
aftermath|the consequences or period following a significant event
anachronism|something placed in a time period where it does not belong
contemporaneous|existing or occurring during the same period
synchronous|occurring at the same time or rate
`.trim();

const rows:Eng006Cp005EntryV1[]=[];let category="";let within=0;
for(const raw of RAW.split("\n")){const line=raw.trim();if(!line)continue;if(line.startsWith("#")){category=line.slice(1);within=0;continue;}const [answer,definition]=line.split("|");if(!answer||!definition)throw new Error(`Invalid ENG-006 CP005 row: ${line}`);const difficulty:Eng006Cp005Difficulty=within<5?"easy":within<13?"medium":"hard";rows.push({id:`OWS5-${String(rows.length+1).padStart(3,"0")}`,answer,definition,category,difficulty});within++;}
export const ENG006_CP005_ENTRIES_V1=Object.freeze(rows);
export function eng006Cp005PoolV1(difficulty:Eng006Cp005Difficulty){return ENG006_CP005_ENTRIES_V1.filter(x=>x.difficulty===difficulty);}
