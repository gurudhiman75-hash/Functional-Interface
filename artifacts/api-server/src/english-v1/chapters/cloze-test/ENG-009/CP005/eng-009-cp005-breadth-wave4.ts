import type{Eng009Cp005PassageV1}from"./eng-009-cp005-authorities-v1";
export const ENG009_CP005_BREADTH_WAVE4:readonly Eng009Cp005PassageV1[]=[
{id:"ENG009-NP-C15",title:"Why App Permission Prompts Need Context",topic:"digital privacy",template:`Mobile apps often ask for access to location, contacts, camera, microphone or files. These permissions may be necessary for some features, but users can become suspicious when a request appears without explanation. A permission prompt is most useful when it appears at the moment a feature actually needs access and when the reason is easy to understand.

An app that asks for several permissions immediately after installation may create uncertainty because the user has not yet seen why those permissions matter. Delaying the request until the feature is used makes the purpose more __(1)__.

Wording matters too. A generic message such as "allow access to continue" may not tell the user what will happen. A better prompt explains the specific benefit, such as allowing camera access to scan a document. This makes the choice more __(2)__.

Apps should also respect denial. If a user refuses an optional permission, the rest of the app should continue working where possible. Repeatedly asking for the same permission after every screen can turn a legitimate request into pressure. Good design therefore makes permission handling more __(3)__.

Some permissions are sensitive because they reveal personal information or allow continuous access. These requests need especially clear justification. Developers should ask whether the permission is truly necessary or whether a less intrusive method can achieve the same goal. This keeps data collection more __(4)__.

Permission settings should also be easy to review later. A user may grant access for one purpose and change their mind after the feature is no longer needed. Clear settings make consent easier to manage over time.

The broader lesson is that privacy controls work best when users understand both the request and the consequence. A permission dialog should not be treated as a legal obstacle that must simply be accepted. It is part of the product experience.

Good permission design can also improve trust because users see that access is requested only when justified. This is especially important for apps that handle financial, health or identity information. Users are more likely to accept necessary access when the request feels proportionate.

The strongest systems therefore connect permission requests to real features, explain the purpose in plain language and avoid collecting more access than needed. This makes the process more __(5)__.

Ultimately, the aim is not to maximise the number of permissions granted. It is to help users make choices they understand. When prompts are timely, specific and respectful, consent becomes more __(6)__ rather than merely something the user clicks through.`,blanks:[
{id:"N15-B1",blankNo:1,difficulty:"medium",mode:"can-fit",accepted:["clear","obvious","understandable"],rejected:["hidden"],explanation:"Waiting until the feature is used makes the purpose clearer.",clue:"purpose more ..."},
{id:"N15-B2",blankNo:2,difficulty:"hard",mode:"cannot-fit",accepted:["informed","meaningful","deliberate"],rejected:["blind"],explanation:"Specific explanations help users make an informed choice. 'Blind' does not fit.",clue:"choice more ..."},
{id:"N15-B3",blankNo:3,difficulty:"hard",mode:"phrasal-word",accepted:["respectful"],rejected:["coercive","aggressive","random"],explanation:"Permission handling should respect the user's decision.",clue:"handling more ..."},
{id:"N15-B4",blankNo:4,difficulty:"medium",mode:"can-fit",accepted:["limited","proportionate","targeted"],rejected:["unrestricted"],explanation:"Apps should collect only the access they need.",clue:"data collection more ..."},
{id:"N15-B5",blankNo:5,difficulty:"hard",mode:"cannot-fit",accepted:["transparent","trustworthy","defensible"],rejected:["deceptive"],explanation:"Clear, justified permission requests make the process more transparent. 'Deceptive' does not fit.",clue:"process more ..."},
{id:"N15-B6",blankNo:6,difficulty:"medium",mode:"phrasal-word",accepted:["genuine"],rejected:["automatic","meaningless","forced"],explanation:"Timely and respectful prompts make consent more genuine.",clue:"consent becomes more ..."}]},
{id:"ENG009-NP-C16",title:"Why Return Windows Need Clear Rules",topic:"consumer policy",template:`Retail return policies try to balance customer convenience with the risk of misuse. A very short return window may frustrate genuine customers, while an unlimited window can create uncertainty for inventory and accounting. The best policy therefore depends on the product, the reason for return and how easily the item can be resold.

Customers need to know when the return period begins. Some businesses count from the purchase date, while others count from delivery. If this is not clear, disputes become more likely. The policy should therefore make the starting point __(1)__.

Different products may also need different rules. A sealed electronic item and a used personal-care product do not create the same resale or hygiene risk. Applying one rule to every category may look simple but can produce poor outcomes. A better system makes the policy more __(2)__.

Condition requirements should also be explained in plain language. If original packaging, tags or accessories are required, customers should know before they decide to return the item. Hidden conditions weaken trust and increase service complaints.

Digital purchases create another issue because customers may begin the return online but hand the item over later. The system should record when the request was made and what deadline applies next. This keeps the process more __(3)__.

Retailers also need controls against repeated misuse. A small number of customers may buy items for temporary use and return them repeatedly. Controls can be justified, but they should rely on clear patterns rather than arbitrary suspicion. This makes enforcement more __(4)__.

Return data can reveal useful product information. A high return rate for one size, model or description may indicate a quality or listing problem. Businesses can use this evidence to reduce future returns rather than treating every return as an isolated cost.

The broader lesson is that a return policy is part of product design and customer service. It shapes expectations before purchase and influences trust after purchase. A policy that is fair but difficult to understand can still create friction.

The strongest return systems make rules easy to find, apply them consistently and allow reasonable exceptions when evidence justifies them. This creates a process that is both structured and __(5)__.

A clear policy can also reduce unnecessary contacts because customers can answer simple questions themselves. Staff then have more time for unusual cases. In this way, transparency improves both customer experience and operational efficiency.

Ultimately, the goal is not to encourage returns or prevent every return. It is to make legitimate returns easy enough while protecting the business from avoidable misuse. When the rules are clear and consistently applied, the process becomes more __(6)__ for both sides.`,blanks:[
{id:"N16-B1",blankNo:1,difficulty:"hard",mode:"can-fit",accepted:["explicit","clear","unambiguous"],rejected:["hidden"],explanation:"The customer should clearly know when the return period begins.",clue:"starting point ..."},
{id:"N16-B2",blankNo:2,difficulty:"medium",mode:"phrasal-word",accepted:["proportionate"],rejected:["uniform","random","automatic"],explanation:"Different products justify different rules, making the policy proportionate.",clue:"policy more ..."},
{id:"N16-B3",blankNo:3,difficulty:"hard",mode:"cannot-fit",accepted:["traceable","predictable","consistent"],rejected:["confusing"],explanation:"Recording dates makes the process easier to track. 'Confusing' does not fit.",clue:"process more ..."},
{id:"N16-B4",blankNo:4,difficulty:"medium",mode:"can-fit",accepted:["fair","targeted","defensible"],rejected:["arbitrary"],explanation:"Misuse controls should be evidence-based and fair.",clue:"enforcement more ..."},
{id:"N16-B5",blankNo:5,difficulty:"hard",mode:"cannot-fit",accepted:["flexible","practical","reasonable"],rejected:["rigid"],explanation:"The system should allow justified exceptions. 'Rigid' does not fit.",clue:"structured and ..."},
{id:"N16-B6",blankNo:6,difficulty:"medium",mode:"phrasal-word",accepted:["predictable"],rejected:["random","hidden","uncertain"],explanation:"Clear and consistent rules make outcomes more predictable.",clue:"process becomes more ..."}]}
];