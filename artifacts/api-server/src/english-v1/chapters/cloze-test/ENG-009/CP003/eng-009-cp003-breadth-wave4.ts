import type{Eng009Cp003PassageV1}from"./eng-009-cp003-authorities-v1";
export const ENG009_CP003_BREADTH_WAVE4:readonly Eng009Cp003PassageV1[]=[
{id:"ENG009-BP-C17",title:"How Overdrafts Help Small Businesses",topic:"small-business banking",template:`Small businesses often face short periods when payments to suppliers are due before customer money has arrived. An overdraft can help bridge this timing gap by allowing the account balance to fall below zero up to an agreed limit. This can be useful for temporary cash shortages, but it should not be confused with permanent financing. The facility works best when the business expects cash to return soon. This makes the overdraft more __(1)__ for short-term working-capital needs.

Banks usually set a limit based on the business's cash flow, account history and risk. Interest is charged only on the amount actually used, which can make the facility flexible. However, the cost may be higher than some longer-term loans, especially if the overdraft remains used for long periods. A business that is always overdrawn may have a deeper problem that short-term borrowing cannot solve.

Clear records are therefore important. The business should know why it is using the facility, how long the balance is expected to remain negative and what incoming cash will repay it. This makes borrowing more __(2)__.

The bank may also review the limit periodically. If sales grow, working-capital needs may rise. If the account repeatedly exceeds the agreed limit, the facility may no longer match the business's needs. Regular review keeps the arrangement more __(3)__.

An overdraft can also act as a buffer against timing uncertainty. A customer payment that arrives a few days late may otherwise force the business to delay a supplier payment. The facility gives the business time to absorb that mismatch. However, using the overdraft for predictable long-term expenses can turn a useful tool into an expensive habit.

The wider lesson is that short-term credit works best when it matches a short-term problem. Businesses should therefore separate temporary cash gaps from structural losses. If the underlying business is profitable and cash is merely delayed, an overdraft may be useful. If losses are ongoing, more borrowing may only postpone the problem.

Good use of the facility therefore depends on discipline. The business should avoid treating the limit as extra income and should reduce the balance when cash arrives. This makes the borrowing pattern more __(4)__.

Banks also benefit when the purpose is clear because they can assess whether the facility still fits the customer's situation. Strong lending relationships depend on honest cash-flow information and realistic limits. The aim is to provide flexibility without allowing temporary borrowing to become __(5)__.

In this sense, an overdraft is most valuable when it protects operations from short-term timing pressure while remaining easy to monitor and __(6)__.`,blanks:[
{id:"C17-B1",blankNo:1,difficulty:"medium",kind:"vocabulary",answer:"suitable",distractors:["formal","visible","large"],explanation:"An overdraft is suitable when the need is temporary.",clue:"more ... for short-term needs"},
{id:"C17-B2",blankNo:2,difficulty:"hard",kind:"context",answer:"controlled",distractors:["random","broad","hidden"],explanation:"Knowing the purpose and repayment source makes borrowing more controlled.",clue:"borrowing more ..."},
{id:"C17-B3",blankNo:3,difficulty:"hard",kind:"phrase-fit",answer:"appropriate",distractors:["automatic","uniform","ordinary"],explanation:"Periodic review keeps the limit appropriate to current needs.",clue:"arrangement more ..."},
{id:"C17-B4",blankNo:4,difficulty:"medium",kind:"collocation",answer:"disciplined",distractors:["rapid","visible","private"],explanation:"Repaying the overdraft when cash arrives makes use more disciplined.",clue:"pattern more ..."},
{id:"C17-B5",blankNo:5,difficulty:"hard",kind:"discourse",answer:"permanent",distractors:["temporary","visible","simple"],explanation:"The warning is against short-term borrowing becoming permanent.",clue:"temporary borrowing to become ..."},
{id:"C17-B6",blankNo:6,difficulty:"medium",kind:"grammar",answer:"repay",distractors:["repaid","repaying","repays"],explanation:"After 'easy to', the base form 'repay' fits.",clue:"easy to monitor and ..."}]},
{id:"ENG009-BP-C18",title:"Why Failed Card Payments Get Retried",topic:"payment systems",template:`A card payment can fail for many reasons. The account may have insufficient funds, the bank may block the transaction for security, or a temporary network problem may interrupt communication. For subscription businesses, a failed payment does not always mean the customer intends to stop the service. Some companies therefore retry the payment after a delay. This can recover revenue without asking the customer to enter details again.

Retrying every failed payment immediately, however, is not always useful. If the failure is caused by insufficient funds, several attempts within minutes are unlikely to help. A better strategy considers the reason for failure and chooses a later time when success may be more __(1)__.

Payment systems can also use updated card information provided by networks when a card has been replaced. This reduces avoidable failure when the customer has not manually changed the stored details. Clear customer messages are still important. A user should know that a payment failed, whether another attempt will be made and what action is needed.

Repeated retries should have limits. Too many attempts can create customer frustration or trigger additional bank controls. Good retry systems therefore balance recovery with restraint. This makes the process more __(2)__.

Data helps companies improve the strategy. They can compare success rates by failure reason, time of day and number of attempts. This can reveal which retries actually recover payments and which only add noise. The policy then becomes more __(3)__.

Customer experience also matters. If service is suspended immediately after one temporary failure, the customer may be surprised. A short grace period can help when the issue is likely to be temporary. On the other hand, continuing service for too long without payment creates credit risk. The right approach depends on the product and the value involved.

The broader lesson is that payment failure is not one single problem. Different causes require different responses. Treating every failure the same can reduce both recovery and customer trust. Strong systems therefore classify the failure before deciding what to do next.

Retry logic should also be transparent internally. Teams need to know how many attempts will occur, when they will occur and when the account moves to manual follow-up. This makes the process easier to __(4)__.

The best systems combine technical data with customer communication. They recover genuine temporary failures while avoiding endless attempts. This keeps revenue collection more __(5)__ and reduces unnecessary friction.

Ultimately, the goal is not to maximise the number of retries. It is to recover payments when another attempt has a reasonable chance of success. A disciplined strategy therefore makes failed-payment handling more __(6)__.`,blanks:[
{id:"C18-B1",blankNo:1,difficulty:"medium",kind:"context",answer:"likely",distractors:["formal","visible","simple"],explanation:"A later retry should be chosen when success is more likely.",clue:"success may be more ..."},
{id:"C18-B2",blankNo:2,difficulty:"hard",kind:"vocabulary",answer:"proportionate",distractors:["rapid","general","automatic"],explanation:"Retry frequency should match the situation, making the process proportionate.",clue:"process more ..."},
{id:"C18-B3",blankNo:3,difficulty:"hard",kind:"phrase-fit",answer:"evidence-based",distractors:["random","fixed","informal"],explanation:"Using retry performance data makes the policy evidence-based.",clue:"policy more ..."},
{id:"C18-B4",blankNo:4,difficulty:"medium",kind:"collocation",answer:"govern",distractors:["hide","borrow","divide"],explanation:"Clear retry rules make the process easier to govern.",clue:"easier to ..."},
{id:"C18-B5",blankNo:5,difficulty:"hard",kind:"discourse",answer:"reliable",distractors:["large","formal","visible"],explanation:"A good retry strategy makes revenue collection more reliable.",clue:"collection more ..."},
{id:"C18-B6",blankNo:6,difficulty:"medium",kind:"vocabulary",answer:"effective",distractors:["silent","distant","private"],explanation:"A disciplined strategy makes failed-payment handling more effective.",clue:"handling more ..."}]}
];