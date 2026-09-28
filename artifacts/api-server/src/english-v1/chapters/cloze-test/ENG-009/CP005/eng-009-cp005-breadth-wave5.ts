import type{Eng009Cp005PassageV1}from"./eng-009-cp005-authorities-v1";
export const ENG009_CP005_BREADTH_WAVE5:readonly Eng009Cp005PassageV1[]=[
{id:"ENG009-NP-C17",title:"Why Auto-Renewal Reminders Matter",topic:"consumer subscriptions",template:`Auto-renewal can be convenient because a service continues without the customer having to remember a payment date. The same convenience can become frustrating when a customer forgets that a renewal is approaching. A clear reminder before renewal helps people decide whether they still want the service.

The reminder should state the renewal date, amount and how to cancel or change the plan. This makes the upcoming charge more __(1)__.

Timing matters. A reminder sent too early may be forgotten, while one sent after the charge is too late. The right timing gives the customer enough time to act without creating unnecessary alarm.

Businesses may also use reminders to explain changes in price or terms. If the amount will increase, the message should make that change easy to notice. Hiding a price increase inside a long email weakens trust. Good design therefore keeps renewal information more __(2)__.

Customers should also be able to reach the cancellation or plan-management page without searching through many screens. A reminder that explains a choice but makes the choice difficult to exercise is only partly useful. This makes the process less __(3)__.

Auto-renewal systems can still support retention. A business may show the value of the service or offer another plan, but the customer should remain free to decline. The difference between persuasion and obstruction matters.

The broader lesson is that recurring billing works best when customers understand what will happen before money is taken. Clear reminders reduce disputes, refund requests and surprise. They also make the relationship more __(4)__.

Businesses benefit too because customers who knowingly renew are less likely to challenge the payment later. Transparency can therefore improve both trust and operational efficiency.

A mature system records when the reminder was sent and what terms applied at the time. This makes later questions easier to resolve.

The strongest auto-renewal process combines convenience with meaningful notice. It should help customers continue a service they still value without making exit unnecessarily difficult. This balance makes recurring billing more __(5)__.

Ultimately, a reminder is useful only if it arrives in time, contains the important facts and gives the customer a real choice. When those conditions are met, renewal becomes more __(6)__ rather than something that happens by surprise.`,blanks:[
{id:"N17-B1",blankNo:1,difficulty:"medium",mode:"can-fit",accepted:["predictable","clear","visible"],rejected:["hidden"],explanation:"The reminder should make the upcoming charge easy to understand.",clue:"charge more ..."},
{id:"N17-B2",blankNo:2,difficulty:"hard",mode:"cannot-fit",accepted:["prominent","transparent","obvious"],rejected:["buried"],explanation:"Renewal changes should be easy to notice. 'Buried' does not fit.",clue:"information more ..."},
{id:"N17-B3",blankNo:3,difficulty:"hard",mode:"phrasal-word",accepted:["usable"],rejected:["coercive","hidden","random"],explanation:"A choice is useful only if the customer can easily act on it.",clue:"process less ..."},
{id:"N17-B4",blankNo:4,difficulty:"medium",mode:"can-fit",accepted:["trustworthy","fair","transparent"],rejected:["deceptive"],explanation:"Clear reminders make the customer relationship more trustworthy.",clue:"relationship more ..."},
{id:"N17-B5",blankNo:5,difficulty:"hard",mode:"cannot-fit",accepted:["balanced","responsible","sustainable"],rejected:["manipulative"],explanation:"Recurring billing should balance convenience and choice. 'Manipulative' does not fit.",clue:"billing more ..."},
{id:"N17-B6",blankNo:6,difficulty:"medium",mode:"phrasal-word",accepted:["deliberate"],rejected:["automatic","hidden","forced"],explanation:"A clear reminder helps renewal become a deliberate choice.",clue:"renewal becomes more ..."}]},
{id:"ENG009-NP-C18",title:"Why Backup Retention Needs Rules",topic:"data resilience",template:`Backups protect organisations when files are deleted, systems fail or ransomware damages live data. Creating a backup is only one part of the problem. Organisations also need rules about how long backups are kept, how many versions exist and when old copies are removed.

Keeping every backup forever may seem safest, but it increases storage cost and can preserve sensitive data longer than necessary. Deleting backups too quickly creates the opposite risk: the organisation may discover a problem only after the last clean copy has disappeared. A retention policy therefore tries to make protection more __(1)__.

Different data may need different retention periods. A daily working file, a financial record and a system configuration do not necessarily require the same history. The policy should reflect business need, legal obligations and recovery risk.

Backups should also be separated from the live system. If an attacker can delete both production data and every backup using the same credentials, the backup strategy is weak. Strong systems therefore make some copies harder to __(2)__.

Testing matters because a backup that cannot be restored is not useful. Organisations should regularly recover sample files or systems to confirm that the process works. This makes resilience more __(3)__ rather than assumed.

Version history is also valuable. A file may be corrupted gradually, meaning the most recent backup already contains the problem. Several older versions can provide a clean recovery point. However, the number of versions should still follow a clear rule.

Retention policies also need ownership. Someone should know which systems are covered, how often backups run and when failures are investigated. Without ownership, a scheduled job can fail repeatedly without anyone noticing.

The broader lesson is that backup policy is about recovery, not simply storage. The organisation should begin by asking how much data it can afford to lose and how quickly service must return. These recovery goals guide the backup design.

A mature policy also changes when systems or obligations change. A new application may need a different schedule, while data no longer required may deserve shorter retention. This keeps the policy more __(4)__.

Strong backup systems therefore combine multiple copies, controlled access, tested restoration and clear retention. They avoid both extremes: keeping everything forever and deleting history too soon.

The goal is to preserve enough clean history to recover from realistic failures without creating unnecessary cost or exposure. That makes backup management more __(5)__.

Ultimately, a backup is valuable only when it can be found, trusted and restored at the moment it is needed. Clear retention rules make that outcome more __(6)__.`,blanks:[
{id:"N18-B1",blankNo:1,difficulty:"hard",mode:"cannot-fit",accepted:["proportionate","sustainable","practical"],rejected:["unlimited"],explanation:"A retention policy should balance protection and cost. 'Unlimited' does not fit.",clue:"protection more ..."},
{id:"N18-B2",blankNo:2,difficulty:"medium",mode:"phrasal-word",accepted:["erase"],rejected:["review","monitor","verify"],explanation:"Protected backup copies should be harder for an attacker to erase.",clue:"copies harder to ..."},
{id:"N18-B3",blankNo:3,difficulty:"hard",mode:"can-fit",accepted:["demonstrable","verified","measurable"],rejected:["assumed"],explanation:"Restore tests turn resilience into something verified rather than assumed.",clue:"resilience more ... rather than assumed"},
{id:"N18-B4",blankNo:4,difficulty:"medium",mode:"cannot-fit",accepted:["current","relevant","aligned"],rejected:["outdated"],explanation:"The policy should change with systems and obligations. 'Outdated' does not fit.",clue:"policy more ..."},
{id:"N18-B5",blankNo:5,difficulty:"hard",mode:"can-fit",accepted:["disciplined","controlled","efficient"],rejected:["random"],explanation:"Clear rules make backup management disciplined and controlled.",clue:"management more ..."},
{id:"N18-B6",blankNo:6,difficulty:"medium",mode:"phrasal-word",accepted:["reliable"],rejected:["uncertain","hidden","fragile"],explanation:"Clear retention rules make successful recovery more reliable.",clue:"outcome more ..."}]}
];