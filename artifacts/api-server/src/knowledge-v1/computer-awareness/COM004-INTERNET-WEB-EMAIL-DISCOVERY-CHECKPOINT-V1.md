# COM-004 — Internet, Web, E-mail & Digital Services — Discovery Checkpoint V1

Status: **EXECUTABLE DISCOVERY ACTIVE / NOT SATURATED / NO PERMANENT QLs**

Branch: `feature/com004-internet-web-email-discovery-v1`
Base authority: `integration/computer-content-engine-mainline-v1` after COM-003 completion.

## Scope authority

COM-004 owns the user-facing Internet/Web/e-mail/e-banking knowledge explicitly called out by the Computer Awareness chapter map and SSC CGL Computer Knowledge syllabus.

Current candidate families cover:
- Internet vs World Wide Web
- webpages/websites/hyperlinks
- browsers vs search engines
- browser navigation/bookmarks/history/cache
- web searching
- downloading vs uploading
- URL/domain/high-level URL structure
- HTTP vs HTTPS at Web-use depth
- e-mail account/address structure
- To/Cc/Bcc, Subject/body, Reply/Reply All/Forward, attachments and folders
- SMTP/POP3/IMAP at broad e-mail-role depth
- e-banking definition/capabilities
- verified/HTTPS bank-site practice, credential safety and unsafe access contexts
- composition-only statement/matching forms

## Source anchors used in V1

1. **SSC CGL 2026 official notice** — explicit scope: Web Browsing & Searching, Downloading & Uploading, Managing an E-mail Account, e-Banking.
2. **MDN Web documentation** — World Wide Web, URL/URI structure, HTTP and HTTPS semantics.
3. **IETF/RFC Editor** — SMTP (RFC 5321), IMAP (RFC 9051), POP3 (RFC 1939).
4. **Reserve Bank of India digital-banking safety guidance** — verified secure sites, credential/OTP/PIN secrecy, avoiding public/open networks and reporting unauthorized transactions.
5. **Oliveboard 2026 Internet & Web exam corpus** — banking/SSC-style Internet, browser/search, Web, URL, protocol and e-mail pattern breadth.
6. **Testbook 2026 Internet / Internet-banking question corpora** — e-mail fields and user-facing e-banking functions.

These sources support discovery. Exam-prep sources do **not** become canonical truth authorities when a standards/regulator source exists.

## Current executable inventory

- provisional candidates: **36**
- production state: **DISCOVERY_ONLY**
- permanent QLs: **0**
- Question Studio: **disabled for COM-004**
- Question Bank/test/mock/publication: **disabled**
- source saturation: **OPEN**

Executable audit:
- `com004-internet-web-email-discovery.test.ts`
- workflow: `COM-004 Internet Web Email Discovery V1`

## Ownership locks

### COM-005 Networking owns
- IP addressing and subnet detail
- DNS resolution mechanics beyond user-facing domain meaning
- network types/topologies/devices
- TCP/IP and OSI placement
- protocol port-number trivia
- transport/session mechanics
- transmission media

COM-004 may name HTTP/HTTPS/SMTP/POP3/IMAP only where the learner task is the **user-facing Web/e-mail role**.

### COM-006 Cyber Security owns
- malware taxonomy
- phishing/social-engineering taxonomy
- hacking/attack classifications
- firewall/antivirus/security-control taxonomy
- cryptographic mechanism depth

COM-004 owns only service-use safety decisions directly attached to Web/e-mail/e-banking use.

### Banking Awareness / Current Affairs owns
- NEFT/RTGS/IMPS/UPI current limits/timings/rules
- bank product features and changing regulatory details
- payment-system policy/current affairs

COM-004 owns only durable e-banking channel concepts and safe-use basics.

## Explicit anti-misconception locks

- HTTPS alone must **not** be presented as proof that a banking site is legitimate; verified/trusted URL context is required.
- POP3 must **not** be taught as an invariant that always deletes server mail.
- `.com` / `.org` suffixes must **not** be treated as guaranteed proof of the registrant’s organization type.
- browser examples must **not** encode current market share/default-browser claims.
- Web and Internet must **not** be treated as synonyms.

## Saturation work still required

Before merge/split or permanent QL allocation:

1. collect attributable PYQ/source evidence for every candidate marked `PYQ_REQUIRED`;
2. deliberately search Punjab-state computer-awareness material for Internet/e-mail wording and regional exam depth;
3. search banking prelims/mains material for recurring e-mail-management and e-banking forms without importing Banking-Awareness ownership;
4. test whether browser cache/cookies, webmail/client, TLD categories and URL components are routine enough to keep;
5. search inverse, NOT/incorrect-statement, matching and statement-set forms;
6. audit Internet-vs-Networking overlap candidate by candidate;
7. merge surface-only pairs and reject source-thin trivia;
8. build temporary executable prototypes only after the saturation inventory is wider than the current 36 candidates;
9. allocate permanent QLs only after the saturation verdict is green.

## Next gate

`COM004_SOURCE_SATURATION_AND_MERGE_SPLIT_AUDIT`

No freeze or runtime activation is authorized by this checkpoint.
