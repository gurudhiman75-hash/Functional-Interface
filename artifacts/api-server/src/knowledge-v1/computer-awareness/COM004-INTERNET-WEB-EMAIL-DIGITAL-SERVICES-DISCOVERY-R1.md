# COM-004 — Internet, Web, E-mail & Digital Services — Discovery R1

Status: DISCOVERY ACTIVE / NO PERMANENT QLs / NO RUNTIME AUTHORITY

## 1. Authority

COM-004 is the next Computer Awareness chapter after merged COM-003.

Parent subject authority:
- `COMPUTER-AWARENESS-END-TO-END-DESIGN-R1.md`
- integration base at chapter start: `ea2bed885e5ffca5517f80bcf050b140ad71771d`

Primary external anchors used for discovery:
1. SSC Computer Knowledge Test scope already recorded in the parent design: Internet/e-mail/e-banking are explicit ownership areas.
2. NIELIT CCC Revision 4 (implemented 2023-10-01):
   - Chapter 6: Introduction to Internet and WWW
   - Chapter 7: E-mail, Social Networking and e-Governance Services
   - Chapter 8: Digital Financial Tools and Applications
   - https://www.nielit.gov.in/sites/default/files/headquarter/pdf/20231006_CCC_Revised_Syllabus.pdf
3. NIELIT CCC learning surface: Internet/WWW, E-mail, e-Commerce/e-Governance, Digital Financial Tools.
   - https://lms.nielit.gov.in/course/view.php?id=21
4. NPCI product authorities for durable payment-system identity/purpose facts:
   - UPI: https://www.npci.org.in/product/upi
   - IMPS: https://www.npci.org.in/product/imps
5. RBI durable payment-system/safe-digital-banking authorities:
   - RTGS FAQ and RBI payment-system material
   - RBI Kehta Hai digital-banking safeguards

Uploaded File Library search was also run for Computer/Internet/e-mail material. No dedicated COM-004 exam corpus was found; the available COM-003 review artifact is useful only as an editorial-quality reference, not as COM-004 factual authority.

## 2. Ownership boundary

COM-004 owns learner tasks whose primary demand is using or identifying Internet/Web/e-mail/digital-service concepts at SSC, banking and Punjab-state exam depth.

COM-004 includes:
- Internet vs WWW and basic service concepts
- websites/webpages/homepages/hyperlinks and common web terminology
- web browsers, browsing, search, upload/download
- URL/domain/addressing concepts at user-awareness depth
- HTTP/HTTPS identity/purpose only where the learner task is Web-service awareness
- e-mail address structure, fields, mailbox folders and common actions
- attachment, reply, reply-all, forward, CC/BCC awareness
- SMTP/POP3/IMAP identity/purpose only where the learner task is e-mail-service awareness
- e-commerce and e-governance concepts at awareness depth
- durable identity/purpose facts for common digital financial tools
- UPI, AEPS, USSD, cards, e-wallet, PoS, QR and OTP concepts where exam relevant
- durable identity/purpose distinctions among NEFT, RTGS and IMPS
- basic safe-use principles specific to digital banking/services

COM-004 does NOT own:
- LAN/WAN/topology/network devices, addressing architecture or transmission media -> COM-005
- protocol stack depth, port-number memorisation or packet-routing mechanics -> COM-005
- malware/phishing/vishing/social-engineering taxonomy as the primary learner task -> COM-006
- firewall/antivirus/security-control taxonomy -> COM-006
- generic software classification/compilers/databases -> COM-007
- current transaction limits, live adoption counts, current product versions, current bank availability or other date-sensitive trivia -> dated knowledge/current-affairs, not the frozen COM-004 corpus

Cross-boundary rule: a fact may be cited by more than one chapter, but the QL belongs to the chapter that owns the learner demand. Example: `HTTPS` as the secure form of HTTP for a web URL can be COM-004; protocol-layer mechanics belong to COM-005.

## 3. Provisional CP discovery families

These are discovery families only. CP IDs and QLs are not permanent until merge/split audit.

### D-CP-A — Internet & WWW fundamentals
Explore:
- Internet concept/purpose
- Internet vs WWW
- website vs webpage
- homepage
- hyperlink/hypertext
- web server/client at elementary awareness depth
- common Internet services where not owned elsewhere

### D-CP-B — Browsers, search and web use
Explore:
- browser purpose/identification
- browser vs search engine
- search operation and query concepts at basic depth
- download vs upload
- refresh/reload, back/forward, bookmark/favourite where exam-supported
- tabs/address bar at awareness depth

Avoid product-version UI trivia.

### D-CP-C — URL, domain and Web addressing
Explore:
- URL full form and purpose
- components learners are actually tested on: scheme/protocol, domain/host, path at basic depth
- domain-name purpose
- common generic domain suffix meanings only when stable and exam-supported
- HTTP vs HTTPS conceptual distinction

Do not turn DNS/network-resolution mechanics into COM-004 QLs; that belongs to COM-005.

### D-CP-D — E-mail structure and operations
Explore:
- e-mail concept and address structure
- To / CC / BCC
- Subject
- Inbox / Outbox / Sent / Draft / Spam/Trash where exam-supported
- compose/send/reply/reply-all/forward
- attachments
- signatures
- multiple-recipient semantics

### D-CP-E — E-mail service protocols
Explore only durable awareness-level tasks:
- SMTP -> sending/outgoing mail
- POP3 -> mail retrieval model at awareness depth
- IMAP -> server-synchronised mailbox access at awareness depth
- distinguish sending vs receiving/access protocols

Do not allocate protocol QLs until source wording is checked for ambiguity and version-neutrality.

### D-CP-F — Digital public/commercial services
Explore:
- e-commerce concept
- e-governance concept
- durable purpose/identity of representative e-governance services only if they remain exam-relevant
- netiquette/basic responsible online use where syllabus/PYQ evidence supports a distinct learner task

Brand/service trivia that can change must not become immutable fact authority.

### D-CP-G — Digital financial tools
Explore durable identity/purpose/classification facts:
- OTP
- QR code
- UPI — canonical expansion must be `Unified Payments Interface` per NPCI
- AEPS
- USSD
- debit/credit card concepts at basic awareness depth
- e-wallet
- PoS

NIELIT wording is a syllabus hint, not sufficient authority where a product owner provides a more precise canonical name.

### D-CP-H — Internet banking and electronic fund-transfer services
Explore:
- Internet banking concept
- NEFT expansion and broad settlement model
- RTGS expansion and `real-time` + `gross` conceptual meaning
- IMPS expansion/purpose and instant-service identity
- robust comparison tasks only when answer uniqueness is invariant

Exclude current monetary thresholds/limits and changing operating rules from frozen facts unless explicitly validity-scoped.

### D-CP-I — Digital-service safety basics
COM-004 may own only user-action safety tasks tightly coupled to digital-service use, for example:
- do not share OTP/PIN/password/CVV
- use verified/secure banking sites/apps
- avoid suspicious links and insecure public networks for banking
- transaction alerts and prompt reporting of unauthorised activity

Attack-category recognition (phishing/vishing/malware) remains COM-006 unless the question is strictly a safe-use action question.

## 4. Candidate learner-task inventory

Discovery must test merge/split boundaries for at least these solve modes:

1. Concept from definition/function
2. Definition/function from concept
3. Full form from acronym
4. Acronym from full form, only when materially distinct from #3
5. Category/classification identification
6. Correct-service selection for a stated user task
7. Browser vs search-engine discrimination
8. Internet vs WWW discrimination
9. Website/webpage/homepage discrimination
10. Upload vs download direction
11. URL/domain component identification
12. HTTP vs HTTPS awareness distinction
13. E-mail field selection from recipient-visibility requirement
14. E-mail folder/action from described state
15. Reply vs reply-all vs forward semantics
16. Attachment/signature identification
17. Sending-protocol vs receiving/access-protocol discrimination
18. Digital-payment tool from purpose
19. Purpose from digital-payment tool
20. NEFT/RTGS/IMPS durable conceptual discrimination
21. Safe-action / unsafe-action identification for digital banking
22. Correct/incorrect statement set where every statement can be independently verified
23. Matching/pair tasks only after independent verifier support exists

Surface wording variants are not separate QLs.

## 5. High-risk ambiguity list

The following must fail closed during discovery unless independently source-verified and validity-scoped:
- `Internet` and `WWW` treated as synonyms
- browser and search engine treated as synonyms
- `URL` described as only a website address without allowing resources/paths
- `HTTPS` described as making a site inherently trustworthy rather than providing protected transport/authentication properties
- POP3/IMAP oversimplifications that become technically false
- CC/BCC statements that ignore recipient visibility semantics
- e-mail `Outbox` vs `Sent` conflation
- `UPI` expanded as `Unified Payment Interface`; canonical NPCI form is `Unified Payments Interface`
- fixed NEFT/RTGS/IMPS availability/limits that can change over time
- claiming OTP itself guarantees transaction safety
- claiming QR codes are inherently safe or unsafe
- treating phishing/vishing/malware taxonomy as COM-004 ownership rather than COM-006

## 6. Fact/freshness policy

Preferred corpus classes:
- IMMUTABLE: acronym expansions, durable definitions, core browser/e-mail concepts
- SLOW_MUTABLE: product/service features whose official semantics may evolve
- CURRENT: changing limits, versions, statistics, live participating institutions; generally excluded from frozen COM-004 generation

Every generation-eligible fact requires provenance, editorial approval, typed relation/value, semantic context, distractor neighborhood and validity metadata under `knowledge-v1`.

## 7. Distractor neighborhoods

Strong neighborhoods should include:
- Internet/Web concept peers
- browser/search-engine peers
- URL/domain/Web-addressing peers
- e-mail fields
- e-mail mailbox folders
- e-mail actions
- e-mail protocols
- digital financial tools
- electronic fund-transfer services
- safe vs unsafe digital-service actions

No arbitrary cross-category distractors solely to fill four options.

## 8. Explanation standard

COM-004 explanations must explain the distinguishing property, not restate the answer.

Examples of expected reasoning shape:
- browser/search engine: identify which is client software vs search service
- CC/BCC: explain recipient visibility
- upload/download: state direction of transfer relative to the user's device
- SMTP/IMAP: state sending vs mailbox-access role
- RTGS: unpack real-time and gross where useful
- safe banking: state the concrete risk reduced by the recommended action

Ban boilerplate such as `X is correct because X is the correct option`.

## 9. Difficulty policy

Easy:
- direct durable recognition with plausible same-family distractors

Medium:
- reverse recall, close-confusion distinctions, contextual user-task selection, two-attribute discrimination

Hard:
- only if genuine learner demand exists: independently verifiable multi-statement reasoning, close semantic distinctions, or multi-attribute comparison

Do not manufacture Hard via obscure acronyms, obsolete browsers, port numbers, changing payment limits or awkward wording.

## 10. Localization policy

English technical labels/acronyms commonly seen in exams remain recognizable in Hindi/Punjabi.

Hindi/Punjabi realizers should localize explanatory grammar and user context without inventing unfamiliar translations for:
- URL, HTTP, HTTPS
- CC, BCC
- SMTP, POP3, IMAP
- OTP, QR, UPI, AEPS, USSD, PoS
- NEFT, RTGS, IMPS

Canonical semantic parity across EN/HI/PA is mandatory before localization freeze.

## 11. Discovery exit gate

COM-004 may move from discovery to permanent QL allocation only after:
- source matrix covers all provisional CP families
- learner-task inventory is saturated against official syllabus + available exam/reference evidence
- COM-004/005/006 ownership conflicts are resolved
- merge/split audit removes surface-only QL duplication
- every proposed QL has a viable object/fact pool
- every target has at least three strong distractors or the QL fails closed
- ambiguous/version-sensitive facts are excluded or validity-scoped
- proposed explanation modes can teach the tested distinction
- expected Easy/Medium/Hard topology reflects actual learner demand

## 12. Immediate implementation sequence

1. Build source-backed canonical discovery facts for D-CP-A through D-CP-I.
2. Run learner-task saturation + merge/split audit.
3. Allocate provisional QLs only after that audit.
4. Generate an English review corpus before any English freeze.
5. Perform whole-chapter editorial/exam-realness review.
6. Freeze English only after corrections.
7. Build Hindi/Punjabi from frozen English semantics and audit parity.
8. Add audited difficulty authority.
9. Activate standard Question Studio `REVIEW_ONLY` runtime.
10. Preserve downstream Question Bank/test/mock/publication locks until explicit manual acceptance.
