import type{Eng008Cp003PassageV1}from"./eng-008-cp003-authorities-v1";
const q=(id:string,familyId:any,difficulty:any,question:string,correctAnswer:string,distractors:readonly[string,string,string],explanation:string,evidence:string)=>({id,familyId,difficulty,question,correctAnswer,distractors,explanation,evidence});

export const ENG008_CP003_EXPANSION_WAVE4_V1:readonly Eng008Cp003PassageV1[]=[
{
 id:"ENG008-BP-N04",title:"The Wrong Platform Announcement",genre:"narrative",
 text:`Arvind reached the railway station twenty minutes before his train. An announcement directed passengers for his route to platform three, so he walked there with his luggage. Five minutes later, the display board still showed platform two.

Several passengers began arguing about which source to trust. Arvind checked the official railway app, which also showed platform two. Rather than rushing back immediately, he asked a station employee nearby. The employee explained that the announcement had been made before a last-minute operational change and confirmed platform two.

Arvind returned with enough time to board. On the way, he noticed that many passengers were relying on only one source of information. Some had heard the announcement but not looked at the display, while others saw the board but assumed it had not been updated.

After boarding, Arvind thought about how the confusion had grown because two official channels temporarily disagreed. Neither passengers nor staff had caused the original change, but clear correction mattered once the information became inconsistent.

The incident also showed him that checking a second reliable source can be useful when instructions conflict. This did not mean every announcement should be doubted. Most of the time, a single source is sufficient. But when two signals clearly disagree, verification is more sensible than choosing whichever one was heard first.

The station later made a corrective announcement and updated the board at the same time. Passengers arriving after that point faced much less confusion.

Arvind's main lesson was simple: speed is useful only after the information is clear. Running quickly toward the wrong platform would not have saved time. On his return journey a week later, Arvind noticed that the station had begun displaying a short “platform changed” banner whenever an announcement was corrected. The added message did not prevent operational changes, but it made the relationship between old and new information easier to understand. He also saw staff directing confused passengers toward the latest display instead of simply repeating the most recent announcement. The station had not eliminated uncertainty; it had improved how quickly conflicting information was resolved.`,
 questions:[
 q("N04-Q1","BP-F01","easy","Which platform did the station employee finally confirm?","Platform two",["Platform three","Platform one","Platform four"],"The employee confirmed that the train would use platform two.","confirmed platform two"),
 q("N04-Q2","BP-F02","medium","What can be inferred from the conflicting announcement and display?","Official information can become temporarily inconsistent after a late change",["Display boards are always more reliable than staff","Announcements should never be trusted","Passengers caused the platform change"],"The passage explains that a late operational change made the earlier announcement outdated.","before a last-minute operational change"),
 q("N04-Q3","BP-F03","medium","What is the central idea of the passage?","When reliable sources conflict, verification is wiser than acting on the first message alone",["Railway apps should replace station staff","Passengers should arrive hours early","Announcements are usually wrong"],"Arvind verifies the platform instead of choosing one source blindly.","checking a second reliable source"),
 q("N04-Q4","BP-F04","medium","Which statement is supported?","The official app and display board both showed platform two",["The app showed platform three","The employee refused to help","The train departed early"],"Both the app and board agreed on platform two.","official railway app ... also showed platform two"),
 q("N04-Q5","BP-F05","easy","In context, “inconsistent” is closest in meaning to:","not matching or agreeing",["very detailed","completely private","officially approved"],"The sources were inconsistent because they gave different platform information.","temporarily disagreed"),
 q("N04-Q6","BP-F06","easy","Which word is opposite in meaning to “clear”?","confusing",["obvious","plain","certain"],"Confusing is the opposite of clear.","information is clear"),
 q("N04-Q7","BP-F07","medium","What does “choosing whichever one was heard first” imply?","Acting on the earliest message without checking later evidence",["Ignoring all official information","Following only staff instructions","Waiting until the train leaves"],"The phrase contrasts quick acceptance with verification.","heard first"),
 q("N04-Q8","BP-F08","medium","Why did confusion fall after the station updated both channels together?","Passengers received consistent information from multiple sources",["The train changed back to platform three","Passengers stopped using the app","The station closed one platform"],"Synchronised corrections removed the contradiction between channels.","corrective announcement and updated the board at the same time"),
 q("N04-Q9","BP-F09","medium","Which title best suits the passage?","The Wrong Platform Announcement",["A Train Without a Platform","Why Apps Cause Delays","The Empty Station"],"The entire narrative grows from an outdated announcement that conflicts with newer information.","announcement ... platform three")
 ]
},
{
 id:"ENG008-BP-N05",title:"The Package at the Reception Desk",genre:"narrative",
 text:`When Tara returned to her apartment building in the evening, the receptionist told her that a package had arrived in her name. She was expecting a book order, so she almost signed for it immediately.

Before doing so, she noticed that the flat number on the label was different from hers. The first name matched, but the surname was another resident's. The receptionist checked the register and realised that two people in the building shared the same first name.

The package had not yet been opened, and the correct resident lived two floors above. Tara asked the receptionist to correct the entry before handing it over. The error was small, but fixing the record mattered because future questions about delivery would otherwise point to the wrong person.

A week later, Tara's own book order arrived. This time the receptionist checked both the full name and flat number before recording it. He said the earlier mistake had shown that using one matching detail was not enough in a building with many residents.

Tara also realised why she had nearly accepted the wrong package: expectation had influenced what she noticed. Because she was already waiting for a delivery, the matching first name felt like confirmation.

The experience did not make her suspicious of every package. It simply made her slower to treat one familiar detail as proof that everything else must also be correct.

The building later changed its package register to include flat number, full name and courier company. The extra information took only a few seconds to record.

The incident was ordinary, but it showed how verification becomes more useful when people already expect something to be true. The receptionist later reviewed the previous month's entries and found two other cases where shortened names could have caused confusion. Those packages had reached the correct residents, but the review showed that the weakness was not limited to Tara's incident. The building therefore kept the extra identification fields permanently and asked temporary reception staff to follow the same check.`,
 questions:[
 q("N05-Q1","BP-F01","easy","What first showed Tara that the package might not be hers?","The flat number on the label was different",["The package was already open","The courier company was unknown","The receptionist refused to show the label"],"The passage directly says Tara noticed the flat number did not match.","flat number ... was different"),
 q("N05-Q2","BP-F02","medium","Why did Tara almost accept the wrong package?","She was already expecting a delivery and saw a matching first name",["She knew the other resident","The package contained her book","The receptionist told her the surname matched"],"Expectation made one matching detail feel convincing.","already waiting for a delivery"),
 q("N05-Q3","BP-F03","medium","What is the central idea of the passage?","Expectations can make partial matches feel convincing, so important details should be verified",["Apartment buildings should stop accepting packages","First names are never useful","All deliveries should be opened at reception"],"The passage focuses on how expectation and incomplete checking caused the near-error.","one familiar detail as proof"),
 q("N05-Q4","BP-F04","medium","Which statement is supported?","The correct resident lived two floors above Tara",["Tara opened the package","The receptionist had no delivery register","Tara's own order never arrived"],"The passage explicitly says the correct resident lived two floors above.","lived two floors above"),
 q("N05-Q5","BP-F05","easy","In context, “verification” is closest in meaning to:","checking that something is correct",["delivering something quickly","writing a complaint","opening a parcel"],"Verification refers to confirming multiple details before accepting the package.","verification becomes more useful"),
 q("N05-Q6","BP-F06","easy","Which word is opposite in meaning to “familiar”?","unfamiliar",["known","recognisable","usual"],"Unfamiliar is the direct opposite of familiar.","one familiar detail"),
 q("N05-Q7","BP-F07","medium","What does “one matching detail was not enough” mean?","A single correct piece of information could still belong to the wrong person",["Names should never be used","Flat numbers are always sufficient","Couriers should avoid registers"],"Two residents shared the same first name, so more identifiers were needed.","two people ... shared the same first name"),
 q("N05-Q8","BP-F08","medium","What directly led the building to improve its package register?","The mistaken entry involving two residents with the same first name",["A lost courier vehicle","A new apartment rule from the city","Tara's book order being late"],"The near-error showed that the old record lacked enough identifiers.","earlier mistake had shown"),
 q("N05-Q9","BP-F09","medium","Which title best suits the passage?","The Package at the Reception Desk",["The Missing Bookstore","Two Empty Flats","Why Couriers Use Surnames"],"The incident centres on identifying a package correctly at reception.","package had arrived")
 ]
},
{
 id:"ENG008-BP-S05",title:"A Shared Kitchen Changes Its Storage Labels",genre:"social",
 text:`A student residence had a shared kitchen with three refrigerators. Each shelf was labelled by room number, but residents still complained that food was sometimes moved or thrown away by mistake.

The housing committee reviewed the complaints and found that many containers had no date or owner name. Room numbers alone were not enough because several students from the same room used the kitchen, and leftovers were sometimes kept after one resident had gone home for the weekend.

The committee introduced removable labels with three fields: name, room number and date stored. It also set one weekly clean-up time that was announced in advance.

During the next month, complaints about missing food fell. The clean-up team also spent less time deciding whether an unmarked container had been abandoned.

However, one problem remained. Some residents wrote dates but forgot to update them when they reused a container. The committee responded by keeping pens beside each refrigerator instead of at the far end of the kitchen.

The change was small, but compliance improved because writing the label became easier at the moment food was stored.

The committee did not create strict penalties for every mistake. Its goal was to make the expected behaviour simple and visible before considering stronger rules.

By the end of the term, the kitchen still required occasional reminders, but fewer disputes came from uncertainty about ownership. The experience suggested that shared spaces work better when basic information is recorded where decisions are actually made. The committee later compared complaint types and found that disputes about ownership fell more than complaints about cleanliness. That distinction helped them avoid claiming that the labels had solved every kitchen problem. They began treating labelling, cleaning and refrigerator maintenance as separate issues, each requiring its own simple rule rather than one broad policy.`,
 questions:[
 q("S05-Q1","BP-F01","easy","Which three details were added to the new food labels?","Name, room number and storage date",["Price, meal type and shelf number","Name, phone number and expiry date","Room number, refrigerator brand and weight"],"The third paragraph lists the three fields directly.","name, room number and date stored"),
 q("S05-Q2","BP-F02","medium","Why were pens moved beside the refrigerators?","To make updating labels easier when food was actually stored",["To reduce refrigerator electricity use","To stop residents entering the kitchen","To record refrigerator temperatures"],"The passage says compliance improved when labelling became convenient at the point of use.","easier at the moment food was stored"),
 q("S05-Q3","BP-F03","medium","What is the central idea of the passage?","Simple information and convenient processes can reduce disputes in a shared space",["Shared kitchens require strict fines","Residents should never keep leftovers","Room numbers should be removed"],"The improvements came from clearer labels and easier compliance rather than penalties.","expected behaviour simple and visible"),
 q("S05-Q4","BP-F04","medium","Which statement is supported?","The clean-up team spent less time deciding whether food had been abandoned",["All food disputes disappeared","Every resident followed labels perfectly","The kitchen reduced to one refrigerator"],"The fourth paragraph directly reports this improvement.","spent less time deciding"),
 q("S05-Q5","BP-F05","easy","In context, “compliance” is closest in meaning to:","following the expected rule",["sharing food","cleaning a refrigerator","buying labels"],"Compliance improved when residents found labelling easier.","compliance improved"),
 q("S05-Q6","BP-F06","easy","Which word is opposite in meaning to “strict”?","flexible",["rigid","firm","severe"],"Flexible is the opposite of strict.","strict penalties"),
 q("S05-Q7","BP-F07","medium","What does “where decisions are actually made” refer to?","The place where residents store and label food",["The housing office","The student's classroom","The supermarket"],"The conclusion links recording information to the point of storage.","where ... food was stored"),
 q("S05-Q8","BP-F08","medium","What most directly reduced uncertainty about ownership?","Labels that included a person's name as well as room and date",["Removing old refrigerators","Increasing clean-up frequency","Introducing penalties"],"The new fields made it easier to identify who owned each item.","name, room number and date stored"),
 q("S05-Q9","BP-F09","medium","Which title best suits the passage?","A Shared Kitchen Changes Its Storage Labels",["Why Students Need More Refrigerators","The End of Leftovers","A Kitchen Without Rules"],"The passage is about redesigning labels and routines in a shared kitchen.","introduced removable labels")
 ]
},
{
 id:"ENG008-BP-B05",title:"A Repair Shop Changes How It Gives Estimates",genre:"business",
 text:`A neighbourhood appliance repair shop often gave customers a single estimated price before examining a device fully. When hidden faults were discovered later, the final bill sometimes exceeded the original estimate, leading to arguments even when the additional work was necessary.

The owner reviewed recent complaints and noticed that customers were less upset by higher prices when they had been told in advance that the first figure was provisional. The problem was often not the extra cost itself but the surprise.

The shop introduced a two-stage estimate. At drop-off, customers received a basic inspection range. After the technician opened the device, the shop sent a message with the confirmed repair cost and asked for approval before continuing.

During the next eight weeks, the number of billing complaints fell. Some repairs took slightly longer because work paused while the shop waited for customer approval.

The owner considered this delay acceptable because it gave customers a real decision before additional costs were incurred.

The shop also began separating parts and labour on the confirmed estimate. Customers said this made the final price easier to understand, even when it was higher than the initial range.

Not every customer wanted detailed messages, so repeat customers could choose a pre-approved spending limit for common repairs.

The experiment showed that price communication is not only about accuracy. A useful estimate should also make uncertainty visible and give customers a clear point at which to accept or reject a larger expense. The shop later added photographs of major damaged parts to some approval messages when the fault was difficult to explain in words. Customers did not need the image for every repair, but it helped when the additional cost was substantial. The owner found that transparency worked best when the amount of explanation matched the size and complexity of the change.`,
 questions:[
 q("B05-Q1","BP-F01","easy","What changed after the technician opened a device?","The shop sent a confirmed repair cost for approval",["The repair became free","The device was automatically replaced","The customer had to visit in person"],"The third paragraph directly explains the second-stage estimate.","confirmed repair cost"),
 q("B05-Q2","BP-F02","medium","Why were some customers less upset by a higher final price?","They had been warned that the first estimate was provisional",["They received discounts","They did not see the bill","The shop removed labour charges"],"Advance warning reduced surprise.","told in advance"),
 q("B05-Q3","BP-F03","medium","What is the central idea of the passage?","Clear communication of uncertainty and approval points can reduce conflict over repair costs",["Repair shops should never estimate prices","Customers always choose the cheapest repair","Detailed bills make repairs faster"],"The passage focuses on staged estimates and explicit approval.","make uncertainty visible"),
 q("B05-Q4","BP-F04","medium","Which statement is supported?","Some repairs took slightly longer under the new system",["Billing complaints increased","The shop stopped giving initial estimates","Every customer wanted detailed messages"],"The fourth paragraph directly reports the small delay.","Some repairs took slightly longer"),
 q("B05-Q5","BP-F05","easy","In context, “provisional” is closest in meaning to:","temporary and subject to change",["final and fixed","free of charge","legally required"],"The first estimate could change after inspection.","first figure was provisional"),
 q("B05-Q6","BP-F06","easy","Which word is opposite in meaning to “confirmed”?","uncertain",["verified","finalised","approved"],"Uncertain is the opposite of confirmed.","confirmed repair cost"),
 q("B05-Q7","BP-F07","medium","What does “a real decision” mean in the passage?","Customers could approve or reject extra cost before work continued",["Customers could repair the device themselves","Technicians could choose any price","The shop could refuse all repairs"],"Approval was requested before incurring additional repair expense.","asked for approval before continuing"),
 q("B05-Q8","BP-F08","medium","What most directly reduced billing disputes?","Separating an initial range from a later confirmed cost that required approval",["Raising all repair prices","Removing estimates completely","Completing repairs before contacting customers"],"The staged process made changes visible before work proceeded.","two-stage estimate"),
 q("B05-Q9","BP-F09","medium","Which title best suits the passage?","A Repair Shop Changes How It Gives Estimates",["The Appliance That Could Not Be Fixed","Why Labour Should Be Free","A Shop Without Customers"],"The passage centres on redesigning estimate communication.","introduced a two-stage estimate")
 ]
}
] as const;