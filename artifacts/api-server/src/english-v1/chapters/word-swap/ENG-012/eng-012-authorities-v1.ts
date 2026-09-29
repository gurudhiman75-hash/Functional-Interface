export type Eng012CpId="ENG-012-CP001"|"ENG-012-CP002";
export type Eng012Difficulty="easy"|"medium"|"hard";
export type Eng012Pair=readonly[1|2|3|4,1|2|3|4];

export interface Eng012AuthorityV1{
 id:string;
 cpId:Eng012CpId;
 difficulty:Eng012Difficulty;
 topic:string;
 template:string;
 natural:readonly[string,string,string,string];
 swap:Eng012Pair;
 cue1:string;
 cue2:string;
 variants?:readonly[
  readonly[string,string,string,string],
  readonly[string,string,string,string]
 ];
}

const a=(id:string,cpId:Eng012CpId,difficulty:Eng012Difficulty,topic:string,template:string,natural:readonly[string,string,string,string],swap:Eng012Pair,cue1:string,cue2:string,variants?:Eng012AuthorityV1["variants"]):Eng012AuthorityV1=>({id,cpId,difficulty,topic,template,natural,swap,cue1,cue2,variants});

export const ENG012_AUTHORITIES_V1:readonly Eng012AuthorityV1[]=[
a("WS-S01","ENG-012-CP001","easy","school notice","The school {1} students to read the {2} carefully before they {3} the online {4}.",["advised","notice","submit","form"],[2,4],"read the notice","submit the form",[
 ["asked","instructions","complete","application"],
 ["reminded","message","send","response"]
]),
a("WS-S02","ENG-012-CP001","easy","road safety","Drivers should {1} their speed near a {2} crossing and remain {3} for people on the {4}.",["reduce","pedestrian","alert","road"],[2,4],"pedestrian crossing","people on the road",[
 ["lower","school","careful","street"],
 ["control","zebra","watchful","carriageway"]
]),
a("WS-S03","ENG-012-CP001","easy","library","Students may {1} two books from the {2} and must {3} them before the due {4}.",["borrow","library","return","date"],[2,4],"books from the library","due date",[
 ["issue","counter","deposit","deadline"],
 ["take","collection","bring back","day"]
]),
a("WS-S04","ENG-012-CP001","medium","public service","The office will {1} applications only after the required {2} are {3} with the online {4}.",["process","documents","uploaded","form"],[2,4],"required documents","online form",[
 ["accept","records","attached","application"],
 ["review","certificates","submitted","portal"]
]),
a("WS-S05","ENG-012-CP001","easy","weather","Heavy rain may {1} traffic on low-lying {2}, so commuters should {3} extra travel {4}.",["slow","roads","allow","time"],[2,4],"low-lying roads","travel time",[
 ["delay","routes","keep","margin"],
 ["affect","streets","plan","time"]
]),
a("WS-S06","ENG-012-CP001","medium","health","Regular exercise can {1} physical fitness and may also {2} stress when it becomes part of a daily {3} and healthy {4}.",["improve","reduce","routine","lifestyle"],[3,4],"daily routine","healthy lifestyle",[
 ["support","lower","schedule","habit"],
 ["increase","ease","routine","pattern"]
]),
a("WS-S07","ENG-012-CP001","easy","water conservation","Residents should {1} leaking taps and avoid leaving water {2} while washing a {3} or cleaning the {4}.",["repair","running","vehicle","floor"],[2,3],"water running","washing a vehicle",[
 ["fix","flowing","car","yard"],
 ["report","running","bike","driveway"]
]),
a("WS-S08","ENG-012-CP001","medium","school event","The principal {1} the winners during the morning {2} and later {3} the certificates in the school {4}.",["congratulated","assembly","distributed","hall"],[2,4],"morning assembly","school hall",[
 ["praised","function","presented","auditorium"],
 ["announced","meeting","gave","campus"]
]),
a("WS-S09","ENG-012-CP001","easy","transport","Passengers should {1} their ticket until the end of the {2} and keep their luggage {3} during the entire {4}.",["retain","journey","secure","trip"],[2,4],"end of the journey","entire trip",[
 ["keep","ride","safe","journey"],
 ["hold","travel","close","trip"]
]),
a("WS-S10","ENG-012-CP001","medium","recycling","Clean paper should be {1} from wet waste before it is {2} for recycling at the local {3} collection {4}.",["separated","sent","paper","centre"],[3,4],"paper collection centre","sent for recycling",[
 ["kept apart","taken","recycling","point"],
 ["removed","delivered","waste","centre"]
]),
a("WS-S11","ENG-012-CP001","easy","bank counter","Customers should {1} the form clearly and {2} the required documents before visiting the service {3} at the bank {4}.",["fill","attach","counter","branch"],[3,4],"service counter","bank branch",[
 ["complete","carry","desk","office"],
 ["sign","submit","window","branch"]
]),
a("WS-S12","ENG-012-CP001","medium","exam preparation","A realistic study {1} helps students divide their {2} across subjects and revise difficult {3} before the final {4}.",["plan","time","topics","exam"],[1,2],"study plan","divide their time",[
 ["schedule","hours","chapters","test"],
 ["routine","effort","areas","paper"]
]),
a("WS-S13","ENG-012-CP001","easy","public park","Visitors should {1} litter in the bins provided and avoid {2} plants near the walking {3} inside the public {4}.",["place","damaging","path","park"],[3,4],"walking path","public park",[
 ["put","harming","track","garden"],
 ["drop","touching","trail","park"]
]),
a("WS-S14","ENG-012-CP001","medium","meeting","The chairperson {1} the main issue first and asked members to keep their {2} brief so that the meeting could {3} on {4}.",["discussed","comments","finish","time"],[2,4],"comments brief","finish on time",[
 ["raised","remarks","end","schedule"],
 ["introduced","responses","close","time"]
]),
a("WS-S15","ENG-012-CP001","easy","electricity","Households can {1} electricity by switching off unused {2} and choosing efficient {3} for regular {4}.",["save","lights","appliances","use"],[2,3],"unused lights","efficient appliances",[
 ["conserve","fans","devices","use"],
 ["reduce","bulbs","equipment","operation"]
]),
a("WS-S16","ENG-012-CP001","medium","school meal","The kitchen staff {1} the food before serving and kept the cooked {2} covered to maintain proper {3} and food {4}.",["checked","meals","hygiene","safety"],[3,4],"proper hygiene","food safety",[
 ["inspected","dishes","cleanliness","quality"],
 ["tested","items","sanitation","safety"]
]),
a("WS-S17","ENG-012-CP001","easy","sports","Players should {1} properly before intense exercise and drink enough {2} during long practice {3} on hot {4}.",["warm up","water","sessions","days"],[2,4],"drink enough water","hot days",[
 ["stretch","fluids","periods","afternoons"],
 ["prepare","water","sessions","weather"]
]),
a("WS-S18","ENG-012-CP001","medium","digital safety","Users should {1} strong passwords and avoid sharing account {2} through unknown messages or suspicious {3} received by {4}.",["create","details","links","email"],[2,3],"account details","suspicious links",[
 ["use","credentials","links","text"],
 ["choose","information","pages","email"]
]),
a("WS-S19","ENG-012-CP001","easy","queue","Visitors should {1} their turn and keep the service {2} clear so that staff can {3} each person without unnecessary {4}.",["wait","counter","assist","delay"],[1,2],"wait their turn","service counter",[
 ["take","window","help","confusion"],
 ["await","desk","serve","delay"]
]),
a("WS-S20","ENG-012-CP001","medium","rainwater","The building {1} rainwater from the roof and directs it through a {2} before storing it in an underground {3} for later {4}.",["collects","filter","tank","use"],[2,3],"through a filter","underground tank",[
 ["channels","screen","reservoir","use"],
 ["captures","filter","container","storage"]
]),
a("WS-S21","ENG-012-CP001","easy","notice board","Old notices should be {1} regularly so that important new {2} remain easy to {3} on the community {4}.",["removed","updates","find","board"],[2,4],"new updates","community board",[
 ["cleared","messages","see","noticeboard"],
 ["taken down","announcements","spot","board"]
]),
a("WS-S22","ENG-012-CP001","medium","school bus","The driver {1} at the marked stop and waited until all students had {2} safely before closing the {3} and starting the {4}.",["stopped","boarded","door","bus"],[3,4],"closing the door","starting the bus",[
 ["paused","entered","gate","vehicle"],
 ["halted","joined","door","journey"]
]),
a("WS-S23","ENG-012-CP001","easy","classroom","Students should {1} carefully to the instructions and ask a {2} if any step is not {3} before they begin the {4}.",["listen","question","clear","task"],[2,3],"ask a question","not clear",[
 ["pay attention","doubt","understood","exercise"],
 ["listen","query","clear","activity"]
]),
a("WS-S24","ENG-012-CP001","medium","market","Clear signs help shoppers {1} different sections quickly and reduce unnecessary {2} near narrow {3} inside a busy {4}.",["locate","crowding","passages","market"],[2,3],"reduce crowding","narrow passages",[
 ["find","congestion","aisles","market"],
 ["identify","confusion","lanes","bazaar"]
]),

a("WS-A01","ENG-012-CP002","medium","evidence","A strong argument should {1} relevant evidence and clearly {2} how that evidence supports the central {3} rather than merely adding extra {4}.",["present","explain","claim","information"],[3,4],"central claim","extra information",[
 ["include","show","conclusion","detail"],
 ["use","demonstrate","argument","material"]
]),
a("WS-A02","ENG-012-CP002","hard","measurement","A useful performance {1} should reflect the real objective rather than encourage people to {2} only the measured {3} while ignoring wider {4}.",["metric","optimise","number","outcomes"],[1,3],"performance metric","measured number",[
 ["indicator","improve","score","results"],
 ["measure","maximise","target","effects"]
]),
a("WS-A03","ENG-012-CP002","medium","risk communication","Risk messages should {1} the probability clearly and provide enough {2} for readers to {3} the figure without unnecessary {4}.",["state","context","interpret","alarm"],[2,4],"provide context","unnecessary alarm",[
 ["show","background","understand","fear"],
 ["present","comparison","read","confusion"]
]),
a("WS-A04","ENG-012-CP002","hard","policy evaluation","Researchers should {1} observed outcomes with a credible comparison before they {2} a change to the policy and draw a causal {3} from the available {4}.",["compare","attribute","conclusion","evidence"],[3,4],"causal conclusion","available evidence",[
 ["contrast","link","inference","data"],
 ["examine","credit","finding","results"]
]),
a("WS-A05","ENG-012-CP002","hard","forecasting","A forecast should {1} its main assumptions so that users can {2} when changing conditions make the original {3} less reliable and require a fresh {4}.",["state","judge","estimate","revision"],[3,4],"original estimate","fresh revision",[
 ["list","see","projection","update"],
 ["show","assess","forecast","review"]
]),
a("WS-A06","ENG-012-CP002","hard","automation","Automated systems can {1} routine decisions quickly, but unusual cases may still {2} human review when the available {3} falls outside the model's normal {4}.",["process","require","data","range"],[3,4],"available data","normal range",[
 ["handle","need","information","pattern"],
 ["make","demand","input","scope"]
]),
a("WS-A07","ENG-012-CP002","medium","survey","A large survey can still produce a {1} picture if the selected sample does not {2} important groups within the wider {3} being {4}.",["distorted","represent","population","studied"],[1,3],"distorted picture","wider population",[
 ["biased","include","community","examined"],
 ["misleading","cover","group","surveyed"]
]),
a("WS-A08","ENG-012-CP002","hard","consultation","Public consultation can {1} useful concerns, but officials must also {2} whether the responses reflect the wider {3} affected by the proposed {4}.",["reveal","consider","population","decision"],[3,4],"wider population","proposed decision",[
 ["identify","judge","community","policy"],
 ["surface","assess","public","change"]
]),
a("WS-A09","ENG-012-CP002","medium","maintenance","Preventive maintenance can {1} small defects before they become costly {2}, provided inspections are carried out at suitable {3} and findings are properly {4}.",["identify","failures","intervals","recorded"],[2,3],"costly failures","suitable intervals",[
 ["detect","breakdowns","periods","logged"],
 ["find","faults","times","documented"]
]),
a("WS-A10","ENG-012-CP002","hard","information overload","Frequent alerts may {1} attention rather than improve it when every message is given the same {2} and users cannot {3} urgent information from routine {4}.",["fragment","priority","separate","updates"],[2,4],"same priority","routine updates",[
 ["divide","importance","distinguish","messages"],
 ["reduce","weight","identify","notices"]
]),
a("WS-A11","ENG-012-CP002","hard","teamwork","Shared goals are useful, but teams also need clear {1} so that members know who should {2} each task and where final {3} for the result will {4}.",["ownership","handle","responsibility","rest"],[1,3],"clear ownership","final responsibility",[
 ["roles","manage","accountability","lie"],
 ["duties","perform","ownership","remain"]
]),
a("WS-A12","ENG-012-CP002","medium","consumer disclosure","A disclosure may be technically {1} yet still fail users if important warnings are {2} inside dense text and difficult to {3} before a purchase {4}.",["complete","buried","find","decision"],[1,4],"technically complete","purchase decision",[
 ["accurate","hidden","locate","choice"],
 ["detailed","placed","notice","decision"]
]),
a("WS-A13","ENG-012-CP002","hard","service design","A service can appear {1} at one stage while the full customer {2} remains slow because delays accumulate between separate {3} and repeated {4}.",["efficient","journey","steps","handoffs"],[1,2],"appear efficient","customer journey",[
 ["fast","experience","stages","transfers"],
 ["smooth","process","steps","handoffs"]
]),
a("WS-A14","ENG-012-CP002","medium","feedback","Useful feedback should {1} the behaviour that worked and clearly {2} what needs to change so that the learner can {3} the advice in the next {4}.",["identify","explain","apply","attempt"],[2,3],"clearly explain","apply the advice",[
 ["recognise","state","use","task"],
 ["show","describe","follow","effort"]
]),
a("WS-A15","ENG-012-CP002","hard","data quality","Large datasets can still support poor {1} when important records are {2}, inconsistent or outdated and users assume that volume guarantees {3} without checking data {4}.",["decisions","missing","accuracy","quality"],[3,4],"guarantees accuracy","data quality",[
 ["judgments","incomplete","reliability","validity"],
 ["results","absent","correctness","quality"]
]),
a("WS-A16","ENG-012-CP002","hard","urban planning","A transport project may {1} vehicle movement while reducing pedestrian {2}, so planners should compare the wider {3} before selecting a final {4}.",["improve","space","trade-offs","design"],[2,3],"pedestrian space","wider trade-offs",[
 ["speed","access","effects","plan"],
 ["increase","room","costs","option"]
]),
a("WS-A17","ENG-012-CP002","medium","training","Repeated practice is most {1} when learners receive specific {2} that helps them correct weak areas instead of simply repeating the same {3} without useful {4}.",["effective","feedback","mistakes","guidance"],[3,4],"same mistakes","useful guidance",[
 ["valuable","comments","errors","direction"],
 ["productive","advice","patterns","support"]
]),
a("WS-A18","ENG-012-CP002","hard","decision making","Quick decisions can be {1} in familiar situations, but unfamiliar risks may require more {2} before a choice is {3} and its possible consequences are fully {4}.",["efficient","analysis","made","considered"],[2,4],"more analysis","fully considered",[
 ["useful","thought","taken","examined"],
 ["practical","review","chosen","assessed"]
]),
a("WS-A19","ENG-012-CP002","hard","model risk","A model can remain technically {1} while becoming less useful if changing behaviour makes its original {2} weaker and the resulting {3} less reliable in current {4}.",["functional","assumptions","predictions","conditions"],[2,4],"original assumptions","current conditions",[
 ["operational","premises","outputs","markets"],
 ["working","rules","estimates","circumstances"]
]),
a("WS-A20","ENG-012-CP002","medium","research sample","Accurate calculations cannot fully {1} for a poorly chosen sample that {2} important sections of the target {3} and creates a biased final {4}.",["compensate","excludes","population","estimate"],[1,4],"compensate for","final estimate",[
 ["correct","misses","group","result"],
 ["adjust","omits","population","finding"]
]),
a("WS-A21","ENG-012-CP002","hard","targets","Performance targets can {1} effort, but narrow measures may also {2} behaviour when employees focus on the score rather than the underlying {3} the measure was meant to {4}.",["motivate","distort","goal","support"],[3,4],"underlying goal","meant to support",[
 ["direct","change","purpose","serve"],
 ["encourage","shift","objective","advance"]
]),
a("WS-A22","ENG-012-CP002","medium","navigation","A good sign should {1} the most important direction quickly and avoid unnecessary {2} that makes the instruction harder to {3} while a traveller is making a rapid {4}.",["show","detail","read","decision"],[2,4],"unnecessary detail","rapid decision",[
 ["display","information","understand","choice"],
 ["present","text","process","turn"]
]),
a("WS-A23","ENG-012-CP002","hard","governance","Clear governance should {1} who can make a decision, who must {2} it and where unresolved issues should be {3} when ordinary procedures cannot provide a timely {4}.",["define","review","escalated","answer"],[2,4],"must review it","timely answer",[
 ["specify","approve","raised","decision"],
 ["state","challenge","referred","response"]
]),
a("WS-A24","ENG-012-CP002","hard","financial literacy","Financial guidance is more {1} when it explains both the possible return and the related {2}, allowing users to compare choices without treating a high {3} as a guaranteed {4}.",["useful","risk","rate","outcome"],[2,4],"related risk","guaranteed outcome",[
 ["helpful","cost","return","result"],
 ["reliable","uncertainty","yield","gain"]
])
];

export const ENG012_CP_IDS_V1=["ENG-012-CP001","ENG-012-CP002","ENG-012-CP003","ENG-012-CP004","ENG-012-CP005"]as const;
