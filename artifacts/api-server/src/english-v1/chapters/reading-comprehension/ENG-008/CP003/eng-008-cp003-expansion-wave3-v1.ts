import type{Eng008Cp003PassageV1}from"./eng-008-cp003-authorities-v1";
const q=(id:string,familyId:any,difficulty:any,question:string,correctAnswer:string,distractors:readonly[string,string,string],explanation:string,evidence:string)=>({id,familyId,difficulty,question,correctAnswer,distractors,explanation,evidence});

export const ENG008_CP003_EXPANSION_WAVE3_V1:readonly Eng008Cp003PassageV1[]=[
{
 id:"ENG008-BP-S04",title:"A Community Hall Learns to Schedule Shared Rooms",genre:"social",
 text:`A community hall had three small rooms that residents could use for study groups, meetings and hobby classes. Bookings were written in a notebook at the reception desk. During busy weeks, two groups occasionally arrived expecting to use the same room because one booking had been added later without checking the earlier page.

The hall committee first considered buying a digital booking system. Before spending money, volunteers reviewed three months of records and found that most conflicts occurred when bookings were made by phone but entered into the notebook several hours later.

They introduced a simpler rule: every phone booking had to be written down immediately, and the caller received a booking number. A whiteboard near reception also displayed that day's room schedule.

During the next six weeks, double bookings became rare. Residents said the whiteboard was useful because they could see whether a room was free without asking the receptionist each time.

The change did not solve every scheduling problem. Some groups stayed beyond their reserved time, which delayed the next booking. The committee therefore added a ten-minute gap between consecutive reservations during evening hours.

One study group disliked the gap because it reduced the maximum session length, but most regular users preferred having a predictable changeover. Volunteers also found it easier to identify which booking caused a delay.

The committee concluded that the main problem had not been the absence of advanced software. It had been the delay between taking a booking and recording it clearly. Better process discipline solved most conflicts at very little cost.

The hall may still adopt a digital system later if bookings increase. For now, the committee plans to keep measuring conflicts and waiting times before deciding whether a more complex tool would provide enough additional benefit. The volunteers also began checking how often rooms were left unused after being booked. They found that a small number of groups sometimes cancelled informally without informing reception. A simple cancellation note was added to the process so that released rooms could be offered to others. This reduced wasted slots and gave the committee one more reason to improve the basic workflow before buying software.`,
 questions:[
 q("S04-Q1","BP-F01","easy","What caused most booking conflicts according to the review?","Phone bookings were sometimes recorded late",["Residents refused to use booking numbers","The hall had only one room","Digital software often failed"],"The review found that conflicts usually followed a delay between phone booking and written entry.","bookings were made by phone but entered ... several hours later"),
 q("S04-Q2","BP-F02","medium","What can be inferred about the committee's approach?","It tried a low-cost process change before buying new software",["It rejected technology permanently","It increased room fees immediately","It reduced the number of available rooms"],"The committee reviewed the process and fixed recording discipline before purchasing a new system.","Before spending money"),
 q("S04-Q3","BP-F03","medium","What is the central idea of the passage?","A clear booking process solved most conflicts without requiring complex technology",["Community halls should avoid phone bookings","Digital systems always create confusion","Study groups need longer sessions"],"The passage shows that a simple procedural fix addressed the main problem.","Better process discipline solved most conflicts"),
 q("S04-Q4","BP-F04","medium","Which statement is supported?","A daily whiteboard helped residents see room availability",["The whiteboard replaced the booking notebook completely","All groups preferred the ten-minute gap","The hall purchased booking software"],"The passage directly describes residents using the whiteboard to check availability.","see whether a room was free"),
 q("S04-Q5","BP-F05","easy","In context, “predictable” is closest in meaning to:","expected and easier to plan for",["expensive","temporary","informal"],"The gap made room changeovers more regular and easier to anticipate.","predictable changeover"),
 q("S04-Q6","BP-F06","easy","Which word is opposite in meaning to “complex”?","simple",["advanced","detailed","complicated"],"Simple is the direct opposite of complex.","more complex tool"),
 q("S04-Q7","BP-F07","medium","What does “process discipline” refer to in the passage?","Following the recording procedure consistently",["Punishing groups that arrive late","Using only digital technology","Closing rooms between bookings"],"The phrase refers to writing bookings down immediately and clearly.","delay between taking a booking and recording it clearly"),
 q("S04-Q8","BP-F08","medium","Why was a ten-minute gap added between evening reservations?","Some groups were staying beyond their booked time",["The receptionist needed a dinner break","Rooms required cleaning after every session","The whiteboard could not display consecutive bookings"],"The gap was introduced because over-running sessions delayed the next users.","stayed beyond their reserved time"),
 q("S04-Q9","BP-F09","medium","Which title best suits the passage?","A Simpler Way to Share Community Rooms",["Why Digital Booking Failed","Three Empty Rooms","The End of Evening Meetings"],"The passage focuses on improving shared-room scheduling through simpler procedures.","main problem had not been the absence of advanced software")
 ]
},
{
 id:"ENG008-BP-B04",title:"A Grocery Store Changes Its Express Checkout",genre:"business",
 text:`A neighbourhood grocery store had an express checkout lane marked “ten items or fewer.” During the evening rush, the lane often moved slowly because customers with baskets of small items argued that their purchases were quick to scan even when the total exceeded ten.

The manager reviewed transaction data for two weeks and found that item count was not the only factor affecting checkout time. Some ten-item baskets included loose vegetables that needed weighing, while a fifteen-item basket of packaged goods could sometimes be processed faster.

For a four-week trial, the store changed the rule. The express lane accepted customers with up to fifteen packaged items, but baskets containing items that required weighing or manual price checks were directed to the regular lanes.

Average transaction time in the express lane fell slightly, and the number of disputes at the lane entrance dropped. Cashiers said the rule was easier to explain because it focused on the type of transaction rather than only the number of products.

The new system was not perfect. Some customers found the wording on the sign confusing during the first week. The store replaced it with a shorter sign showing examples of eligible and non-eligible baskets.

The manager also checked whether regular lanes had become slower because more complex baskets were being redirected there. Waiting time increased briefly during the busiest twenty minutes, so an additional cashier was assigned to one regular lane during that period.

By the end of the trial, overall checkout time across all lanes was slightly lower than before. The store decided to keep the revised express rule but review it again after the holiday season, when shopping patterns might change.

The experiment suggested that a simple rule can be improved when it reflects the actual source of delay. Counting items was easy, but transaction complexity turned out to be a better guide to how quickly a basket could be processed. The manager also compared customer complaints before and after the change. Complaints about unfair queueing fell, but a few shoppers still preferred the old rule because it was easier to understand at a glance. The store therefore kept the revised system but trained cashiers to explain it in one short sentence during the busiest period.`,
 questions:[
 q("B04-Q1","BP-F01","easy","What was the original express-lane rule?","Ten items or fewer",["Only packaged items","Fifteen items or fewer","No vegetables"],"The first paragraph states the original rule directly.","ten items or fewer"),
 q("B04-Q2","BP-F02","medium","What can be inferred from the transaction review?","A small basket is not always faster to process than a larger one",["Item count never affects checkout time","Loose vegetables are always expensive","Packaged goods require manual price checks"],"The passage gives examples where fewer items still take longer because of weighing.","item count was not the only factor"),
 q("B04-Q3","BP-F03","medium","What is the central idea of the passage?","The store improved its express rule by focusing on transaction complexity rather than item count alone",["Express lanes should be removed","Fifteen items is the ideal limit everywhere","Regular lanes are always slower"],"The trial changes the rule to reflect what actually causes delay.","transaction complexity turned out to be a better guide"),
 q("B04-Q4","BP-F04","medium","Which statement is supported?","The store revised its sign after customers found the first version confusing",["All customers understood the new rule immediately","The store closed one regular lane","Checkout time rose across all lanes"],"The fifth paragraph directly describes replacing the sign.","replaced it with a shorter sign"),
 q("B04-Q5","BP-F05","easy","In context, “eligible” is closest in meaning to:","allowed to use the express lane",["priced at a discount","weighed by hand","already scanned"],"Eligible baskets are those permitted under the new express rule.","examples of eligible and non-eligible baskets"),
 q("B04-Q6","BP-F06","easy","Which word is opposite in meaning to “complex”?","simple",["difficult","complicated","detailed"],"Simple is the opposite of complex.","more complex baskets"),
 q("B04-Q7","BP-F07","medium","What does “source of delay” refer to?","The factor that actually makes checkout take longer",["The location of the store","The number of cashiers on payroll","The time when the store opens"],"The phrase refers to identifying whether weighing and manual checks, rather than item count alone, cause slower transactions.","actual source of delay"),
 q("B04-Q8","BP-F08","medium","Why was an extra cashier added to a regular lane?","Redirected complex baskets briefly increased waiting there",["The express lane was closed","Customers stopped buying packaged goods","The manager reduced store hours"],"The sixth paragraph directly links the extra cashier to a temporary regular-lane slowdown.","Waiting time increased briefly"),
 q("B04-Q9","BP-F09","medium","Which title best suits the passage?","Rethinking the Express Checkout Rule",["Why Grocery Stores Need Fewer Cashiers","The Fifteen-Item Discount","A Store Without Vegetables"],"The passage is about redesigning an express-lane rule using transaction data.","store decided to keep the revised express rule")
 ]
}
] as const;