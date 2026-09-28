import type{Eng009Cp003PassageV1}from"./eng-009-cp003-authorities-v1";
export const ENG009_CP003_BREADTH_WAVE4:readonly Eng009Cp003PassageV1[]=[
{id:"ENG009-BP-C17",title:"How Overdrafts Help Small Businesses",topic:"small-business banking",template:`Small businesses often face short periods when supplier payments are due before customer money arrives. An overdraft can bridge this timing gap by allowing the account balance to fall below zero up to an agreed limit. The facility works best when cash is expected to return soon, making it more __(1)__ for short-term working-capital needs.

Banks usually set a limit based on cash flow, account history and risk. Interest is charged only on the amount used, which gives flexibility. However, a business that remains overdrawn for long periods may have a deeper problem that short-term credit cannot solve.

The business should know why it is using the facility, how long the balance may remain negative and what incoming cash will repay it. This makes borrowing more __(2)__. The bank may also review the limit periodically so the arrangement remains __(3)__ to current needs.

An overdraft can act as a buffer against timing uncertainty, but using it for predictable long-term expenses can turn a useful tool into an expensive habit. Good use therefore depends on discipline. The business should avoid treating the limit as extra income and reduce the balance when cash arrives. This makes the borrowing pattern more __(4)__.

The wider lesson is that short-term credit works best when it matches a short-term problem. Strong lending relationships depend on honest cash-flow information and realistic limits. The aim is to provide flexibility without allowing temporary borrowing to become __(5)__. An overdraft is most useful when it remains easy to monitor and __(6)__.`,blanks:[
{id:"C17-B1",blankNo:1,difficulty:"medium",kind:"vocabulary",answer:"suitable",distractors:["formal","visible","large"],explanation:"An overdraft is suitable when the need is temporary.",clue:"more ... for short-term needs"},
{id:"C17-B2",blankNo:2,difficulty:"hard",kind:"context",answer:"controlled",distractors:["random","broad","hidden"],explanation:"Knowing the purpose and repayment source makes borrowing more controlled.",clue:"borrowing more ..."},
{id:"C17-B3",blankNo:3,difficulty:"hard",kind:"phrase-fit",answer:"appropriate",distractors:["automatic","uniform","ordinary"],explanation:"Periodic review keeps the limit appropriate to current needs.",clue:"arrangement more ..."},
{id:"C17-B4",blankNo:4,difficulty:"medium",kind:"collocation",answer:"disciplined",distractors:["rapid","visible","private"],explanation:"Repaying the overdraft when cash arrives makes use more disciplined.",clue:"pattern more ..."},
{id:"C17-B5",blankNo:5,difficulty:"hard",kind:"discourse",answer:"permanent",distractors:["temporary","visible","simple"],explanation:"The warning is against short-term borrowing becoming permanent.",clue:"temporary borrowing to become ..."},
{id:"C17-B6",blankNo:6,difficulty:"medium",kind:"grammar",answer:"repay",distractors:["repaid","repaying","repays"],explanation:"After 'easy to', the base form 'repay' fits.",clue:"easy to monitor and ..."}]},
{id:"ENG009-BP-C18",title:"Why Failed Card Payments Get Retried",topic:"payment systems",template:`A card payment can fail because of insufficient funds, security controls or a temporary network problem. For subscription businesses, this does not always mean the customer wants to stop the service. Some companies therefore retry the payment after a delay.

Retrying every failure immediately is not useful. If the account lacks funds, several attempts within minutes are unlikely to help. A better strategy considers the reason for failure and chooses a later time when success may be more __(1)__.

Payment systems can also use updated card information when a card is replaced. Clear customer messages still matter. The user should know that a payment failed, whether another attempt will be made and what action is needed.

Repeated retries should have limits because too many attempts can create frustration or trigger bank controls. Good retry systems therefore make the process more __(2)__. Data can improve the strategy by showing which failure reasons and retry times actually recover payments. This makes the policy more __(3)__.

Customer experience matters too. A short grace period may help when the issue is temporary, while continuing service for too long without payment creates risk. Strong systems therefore classify the failure before deciding what to do next.

Retry logic should also be transparent internally. Teams need to know how many attempts will occur, when they will happen and when manual follow-up begins. This makes the process easier to __(4)__. The best systems recover genuine temporary failures while keeping collection more __(5)__ and failed-payment handling more __(6)__.`,blanks:[
{id:"C18-B1",blankNo:1,difficulty:"medium",kind:"context",answer:"likely",distractors:["formal","visible","simple"],explanation:"A later retry should be chosen when success is more likely.",clue:"success may be more ..."},
{id:"C18-B2",blankNo:2,difficulty:"hard",kind:"vocabulary",answer:"proportionate",distractors:["rapid","general","automatic"],explanation:"Retry frequency should match the situation, making the process proportionate.",clue:"process more ..."},
{id:"C18-B3",blankNo:3,difficulty:"hard",kind:"phrase-fit",answer:"evidence-based",distractors:["random","fixed","informal"],explanation:"Using retry performance data makes the policy evidence-based.",clue:"policy more ..."},
{id:"C18-B4",blankNo:4,difficulty:"medium",kind:"collocation",answer:"govern",distractors:["hide","borrow","divide"],explanation:"Clear retry rules make the process easier to govern.",clue:"easier to ..."},
{id:"C18-B5",blankNo:5,difficulty:"hard",kind:"discourse",answer:"reliable",distractors:["large","formal","visible"],explanation:"A good retry strategy makes revenue collection more reliable.",clue:"collection more ..."},
{id:"C18-B6",blankNo:6,difficulty:"medium",kind:"vocabulary",answer:"effective",distractors:["silent","distant","private"],explanation:"A disciplined strategy makes failed-payment handling more effective.",clue:"handling more ..."}]}
];