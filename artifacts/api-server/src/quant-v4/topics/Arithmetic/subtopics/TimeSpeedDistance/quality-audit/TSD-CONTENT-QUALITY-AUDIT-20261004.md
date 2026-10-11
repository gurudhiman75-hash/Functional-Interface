# TSD content quality audit — 2026-10-04

Verdict: **NO-GO for chapter closure**. This is a content audit, not a release approval.

## Scope and evidence

2,769 deterministic rendered rows across CP003–CP012: approved English/native surfaces, CP007 frozen Studio families, and CP010 official-paper V3. All 105 current permanent QLs (038–142) have English samples. CP003 also contributes eight prior-authority QLs; these are supplemental evidence, not eight additional current authorities. CP004 has no native localization files in this checkout.

One deterministic CP007 sample per family/locale is included in this corpus. Separately, the regression and existing Studio proof exercise every supported combination after the fix. Other Studio numeric pools are not exhaustively represented by this editorial snapshot. CP008–CP012 human-review exports do not carry options; their absence here is not evidence that their separate Studio adapters lack options.

## Blocking findings

| ID | Severity | Finding | Disposition |
|---|---|---|---|
| TSD-QA-001 | Critical | CP007 93-A can select BACKWARD_CLOCK, yielding 08:20:11 for a front-entry timestamp of 08:20:41 and a 30-second forward crossing. | Fixed runtime selection; frozen wording unchanged. Independent rendered arithmetic regression passes. |
| TSD-QA-002 | Critical | CP007 94-A can select inclusive-start counting: 100 m / 25 m produces answer 5 although the stem excludes the starting pole. | Fixed runtime selection. Independent rendered count regression passes. |
| TSD-QA-003 | High | CP007 placeholder compatibility does not constrain occupancy target or clock interval kind. A value may be mathematically valid for the generated input but answer another question. | Added explicit target/event/endpoint contracts for all affected families 92–94. |
| TSD-QA-004 | High | CP007 options use answer ±1/+2; clock options use −10/+10/+20 seconds. | Open: replace in a versioned review candidate with named misconception calculations; preserve approved authority. |
| TSD-QA-005 | High | CP004 has 60 English rows and no Hindi/Punjabi freeze layer/proof in this checkout. | Open: localization is not complete on this branch. |
| TSD-QA-006 | High | CP008 explanations give rules and final answers without substituted arithmetic; similar omissions occur in CP009 and later native surfaces. | Open: add worked calculations in new review versions, in all three languages. |
| TSD-QA-007 | High | CP009 QL111 first example does not assign the 12 and 8 km/h boats to their departure banks. It admits meeting points 42 km or 30 km from upstream. | Draft correction below; frozen content untouched. |
| TSD-QA-008 | High | CP005 QL061 first example omits simultaneous departure, needed for the post-meeting arrival-time square-root rule. | Draft correction below; frozen content untouched. |
| TSD-QA-009 | Medium | CP011 has 168 English numeric families but only 40 number-masked stem shapes; CP012 has 270 families but 70 shapes. | Open: expand topology-valid scenes and wording, rather than counting numeric substitutions as scenario diversity. |
| TSD-QA-010 | Medium | CP012 QL141 includes “1 seconds”; some walkway/worker scenarios use implausible walking speeds. | Open: grammar and physical-context review per family. |
| TSD-QA-011 | High | CP010 Studio candidate imports older final-rendered/native-final sources, while the owner review export uses official-paper V3. | Open: prove or reconcile learner-surface parity before any Studio registration. |
| TSD-QA-012 | High | CP001–CP002 are superseded, but this audit does not independently establish that every foundational 001–037 contract has an executable replacement. | Open: map foundation contracts to current authority; do not close the chapter from QL continuity alone. |

## Measured corpus

Arithmetic markers are a triage heuristic: a numeral adjacent to an arithmetic operator in the steps. They are not an editorial pass/fail rule. A prose calculation may be valid without these markers. Template counts mask numbers only, and retain names/context words; they are an upper bound on distinct semantic scenarios.

| CP | English | Hindi | Punjabi | English number-masked shapes | English arithmetic-marker rows | Native arithmetic-marker rows |
|---|---:|---:|---:|---:|---:|---:|
| CP003 | 63 | 63 | 63 | 60 | 63/63 | 126/126 |
| CP004 | 60 | 0 | 0 | 52 | 60/60 | 0/0 |
| CP005 | 78 | 78 | 78 | 78 | 72/78 | 144/156 |
| CP006 | 78 | 78 | 78 | 78 | 35/78 | 70/156 |
| CP007 | 66 | 66 | 66 | 66 | 15/66 | 86/132 |
| CP008 | 54 | 54 | 54 | 54 | 0/54 | 0/108 |
| CP009 | 66 | 66 | 66 | 66 | 4/66 | 12/132 |
| CP010 | 60 | 60 | 60 | 60 | 54/60 | 12/120 |
| CP011 | 168 | 168 | 168 | 40 | 102/168 | 130/336 |
| CP012 | 270 | 270 | 270 | 70 | 111/270 | 134/540 |

## Concrete worked-example gaps

CP008 95-A should show: 54×5/18=15 m/s; 36×5/18=10 m/s; total length=120+180=300 m; time=300/(15+10)=12 s. Current explanation describes these operations but does not display them.

CP009 111-A, with the corrected bank assignment below, should show: downstream ground speed=12+2=14 km/h; upstream ground speed=8−2=6 km/h; meeting time=60/(14+6)=3 h; upstream-bank distance=14×3=42 km.

CP011 125-A native steps should explicitly show 4+1=5 m/s and 60÷5=12 s; the current native steps state the rule then jump to 12 s.

## Versioned editorial correction proposals — unapproved

These replace no frozen source and create no approval or registration.

### CP005 QL061 simultaneous departure

English: Two coaches start simultaneously from opposite ends P and Q of a 360 km route and travel at constant speeds. After meeting, Coach A takes 1 hour 48 minutes to reach Q and Coach B takes 5 hours to reach P. Find their speeds, with Coach A first.

Hindi: दो बसें 360 km लंबे मार्ग के विपरीत सिरों P और Q से एक ही समय पर स्थिर गतियों से चलती हैं। मिलने के बाद बस A को Q पहुँचने में 1 घंटा 48 मिनट और बस B को P पहुँचने में 5 घंटे लगते हैं। दोनों की गतियाँ ज्ञात कीजिए, पहले बस A की गति लिखिए।

Punjabi: ਦੋ ਬੱਸਾਂ 360 km ਲੰਬੇ ਰਸਤੇ ਦੇ ਉਲਟ ਸਿਰਿਆਂ P ਅਤੇ Q ਤੋਂ ਇੱਕੋ ਸਮੇਂ ਸਥਿਰ ਰਫ਼ਤਾਰਾਂ ਨਾਲ ਚੱਲਦੀਆਂ ਹਨ। ਮਿਲਣ ਤੋਂ ਬਾਅਦ ਬੱਸ A ਨੂੰ Q ਪਹੁੰਚਣ ਲਈ 1 ਘੰਟਾ 48 ਮਿੰਟ ਅਤੇ ਬੱਸ B ਨੂੰ P ਪਹੁੰਚਣ ਲਈ 5 ਘੰਟੇ ਲੱਗਦੇ ਹਨ। ਦੋਵਾਂ ਦੀਆਂ ਰਫ਼ਤਾਰਾਂ ਕੱਢੋ, ਪਹਿਲਾਂ ਬੱਸ A ਦੀ ਰਫ਼ਤਾਰ ਲਿਖੋ।

### CP009 QL111 bank assignment

English: Two boats start simultaneously toward each other from opposite ends of a 60 km river stretch. The boat starting at the upstream end has a still-water speed of 12 km/h; the other has a still-water speed of 8 km/h. The current flows downstream at 2 km/h. How far from the upstream end do they meet?

Hindi: 60 km लंबे नदी-खंड के विपरीत सिरों से दो नावें एक ही समय पर एक-दूसरे की ओर चलती हैं। ऊपरी सिरे से चलने वाली नाव की शांत जल में गति 12 km/h और दूसरी नाव की गति 8 km/h है। धारा 2 km/h से नीचे की ओर बहती है। वे ऊपरी सिरे से कितनी दूर मिलेंगी?

Punjabi: ਦਰਿਆ ਦੇ 60 km ਲੰਬੇ ਹਿੱਸੇ ਦੇ ਉਲਟ ਸਿਰਿਆਂ ਤੋਂ ਦੋ ਕਿਸ਼ਤੀਆਂ ਇੱਕੋ ਸਮੇਂ ਇੱਕ-ਦੂਜੇ ਵੱਲ ਚੱਲਦੀਆਂ ਹਨ। ਉੱਪਰਲੇ ਸਿਰੇ ਤੋਂ ਚੱਲਣ ਵਾਲੀ ਕਿਸ਼ਤੀ ਦੀ ਸ਼ਾਂਤ ਪਾਣੀ ਵਿੱਚ ਰਫ਼ਤਾਰ 12 km/h ਅਤੇ ਦੂਜੀ ਦੀ 8 km/h ਹੈ। ਧਾਰਾ 2 km/h ਨਾਲ ਹੇਠਾਂ ਵੱਲ ਵਹਿੰਦੀ ਹੈ। ਉਹ ਉੱਪਰਲੇ ਸਿਰੇ ਤੋਂ ਕਿੰਨੀ ਦੂਰ ਮਿਲਣਗੀਆਂ?

## Scenario expansion proposal — review only

A pool entry must preserve motion topology, unit scale, speed plausibility and exact numeric solver bindings. Localization must be authored alongside each scene. These are proposed additional scenes, not claims of active pool expansion.

| Topology | Proposed additional scenes | Constraint |
|---|---|---|
| Straight relative motion | electric campus shuttles, intercity coaches, depot vans, cyclist pair, track runners, patrol jeeps | Assign directions and common start/time origin explicitly. |
| Reflected route motion | ferry terminals, shuttle turnaround loop, depot vans, cycle relay corridor, patrol boundary, airport transfer route | State endpoint reversals and halts; avoid overtaking assumptions outside proven cases. |
| Closed-track motion | velodrome, skating oval, kart circuit, athletics track, walking loop, maintenance inspection circuit | Express signed direction/start offsets and event-count endpoints. |
| Fixed-object train passage | railway viaduct, freight loading platform, covered rail shed, mountain tunnel, inspection gantry, trackside signal cabin | Distinguish point, full crossing and full occupancy; retain finite lengths. |
| Moving medium | canal service launch, rescue boat, fishing motorboat, river ferry, survey craft, drift buoy | Assign banks and ensure upstream speed is positive when upstream travel is asked. |
| Moving surface / wheel | airport walkway, terminal conveyor walkway, metro escalator, shopping-centre escalator, measuring wheel, luggage-cart wheel | Use credible person/surface rates; state no slipping for wheel calculations. |

## Rendering and difficulty

The sampled learner strings contain no unresolved `${...}` / alphabetic brace placeholders, NaN or Infinity. This does not certify MathJax rendering. Current surfaces largely use plain Unicode math; literal answer-set braces are valid content. A UI render proof is still needed for any new LaTeX layer.

Difficulty tags are retained as evidence. This pass does not assign new difficulty labels: easy/medium/hard calibration needs operation depth, inverse inference and constraint handling, rather than forced quotas. CP007 stores difficultyBand and the audit normalizes it.

## QL review ledger

One representative English stem per current QL was inspected for the authority/asked-value contract. Full family/locale data are in the accompanying corpus. Coverage is not equivalent to approval.

| QL | CP | English samples | Hindi samples | Punjabi samples |
|---|---|---:|---:|---:|
| TSD-QL-038 | CP003 | 6 | 6 | 6 |
| TSD-QL-039 | CP003 | 6 | 6 | 6 |
| TSD-QL-040 | CP003 | 3 | 3 | 3 |
| TSD-QL-041 | CP003 | 3 | 3 | 3 |
| TSD-QL-042 | CP003 | 3 | 3 | 3 |
| TSD-QL-043 | CP003 | 3 | 3 | 3 |
| TSD-QL-044 | CP003 | 3 | 3 | 3 |
| TSD-QL-045 | CP003 | 3 | 3 | 3 |
| TSD-QL-046 | CP003 | 3 | 3 | 3 |
| TSD-QL-047 | CP003 | 3 | 3 | 3 |
| TSD-QL-048 | CP004 | 6 | 0 | 0 |
| TSD-QL-049 | CP004 | 6 | 0 | 0 |
| TSD-QL-050 | CP004 | 6 | 0 | 0 |
| TSD-QL-051 | CP004 | 6 | 0 | 0 |
| TSD-QL-052 | CP004 | 6 | 0 | 0 |
| TSD-QL-053 | CP004 | 6 | 0 | 0 |
| TSD-QL-054 | CP004 | 6 | 0 | 0 |
| TSD-QL-055 | CP004 | 6 | 0 | 0 |
| TSD-QL-056 | CP004 | 6 | 0 | 0 |
| TSD-QL-057 | CP004 | 6 | 0 | 0 |
| TSD-QL-058 | CP005 | 6 | 6 | 6 |
| TSD-QL-059 | CP005 | 6 | 6 | 6 |
| TSD-QL-060 | CP005 | 6 | 6 | 6 |
| TSD-QL-061 | CP005 | 6 | 6 | 6 |
| TSD-QL-062 | CP005 | 6 | 6 | 6 |
| TSD-QL-063 | CP005 | 6 | 6 | 6 |
| TSD-QL-064 | CP005 | 6 | 6 | 6 |
| TSD-QL-065 | CP005 | 6 | 6 | 6 |
| TSD-QL-066 | CP005 | 6 | 6 | 6 |
| TSD-QL-067 | CP005 | 6 | 6 | 6 |
| TSD-QL-068 | CP005 | 6 | 6 | 6 |
| TSD-QL-069 | CP005 | 6 | 6 | 6 |
| TSD-QL-070 | CP005 | 6 | 6 | 6 |
| TSD-QL-071 | CP006 | 6 | 6 | 6 |
| TSD-QL-072 | CP006 | 6 | 6 | 6 |
| TSD-QL-073 | CP006 | 6 | 6 | 6 |
| TSD-QL-074 | CP006 | 6 | 6 | 6 |
| TSD-QL-075 | CP006 | 6 | 6 | 6 |
| TSD-QL-076 | CP006 | 6 | 6 | 6 |
| TSD-QL-077 | CP006 | 6 | 6 | 6 |
| TSD-QL-078 | CP006 | 6 | 6 | 6 |
| TSD-QL-079 | CP006 | 6 | 6 | 6 |
| TSD-QL-080 | CP006 | 6 | 6 | 6 |
| TSD-QL-081 | CP006 | 6 | 6 | 6 |
| TSD-QL-082 | CP006 | 6 | 6 | 6 |
| TSD-QL-083 | CP006 | 6 | 6 | 6 |
| TSD-QL-084 | CP007 | 6 | 6 | 6 |
| TSD-QL-085 | CP007 | 6 | 6 | 6 |
| TSD-QL-086 | CP007 | 6 | 6 | 6 |
| TSD-QL-087 | CP007 | 6 | 6 | 6 |
| TSD-QL-088 | CP007 | 6 | 6 | 6 |
| TSD-QL-089 | CP007 | 6 | 6 | 6 |
| TSD-QL-090 | CP007 | 6 | 6 | 6 |
| TSD-QL-091 | CP007 | 6 | 6 | 6 |
| TSD-QL-092 | CP007 | 6 | 6 | 6 |
| TSD-QL-093 | CP007 | 6 | 6 | 6 |
| TSD-QL-094 | CP007 | 6 | 6 | 6 |
| TSD-QL-095 | CP008 | 6 | 6 | 6 |
| TSD-QL-096 | CP008 | 6 | 6 | 6 |
| TSD-QL-097 | CP008 | 6 | 6 | 6 |
| TSD-QL-098 | CP008 | 6 | 6 | 6 |
| TSD-QL-099 | CP008 | 6 | 6 | 6 |
| TSD-QL-100 | CP008 | 6 | 6 | 6 |
| TSD-QL-101 | CP008 | 6 | 6 | 6 |
| TSD-QL-102 | CP008 | 6 | 6 | 6 |
| TSD-QL-103 | CP008 | 6 | 6 | 6 |
| TSD-QL-104 | CP009 | 6 | 6 | 6 |
| TSD-QL-105 | CP009 | 6 | 6 | 6 |
| TSD-QL-106 | CP009 | 6 | 6 | 6 |
| TSD-QL-107 | CP009 | 6 | 6 | 6 |
| TSD-QL-108 | CP009 | 6 | 6 | 6 |
| TSD-QL-109 | CP009 | 6 | 6 | 6 |
| TSD-QL-110 | CP009 | 6 | 6 | 6 |
| TSD-QL-111 | CP009 | 6 | 6 | 6 |
| TSD-QL-112 | CP009 | 6 | 6 | 6 |
| TSD-QL-113 | CP009 | 6 | 6 | 6 |
| TSD-QL-114 | CP009 | 6 | 6 | 6 |
| TSD-QL-115 | CP010 | 6 | 6 | 6 |
| TSD-QL-116 | CP010 | 6 | 6 | 6 |
| TSD-QL-117 | CP010 | 6 | 6 | 6 |
| TSD-QL-118 | CP010 | 6 | 6 | 6 |
| TSD-QL-119 | CP010 | 6 | 6 | 6 |
| TSD-QL-120 | CP010 | 6 | 6 | 6 |
| TSD-QL-121 | CP010 | 6 | 6 | 6 |
| TSD-QL-122 | CP010 | 6 | 6 | 6 |
| TSD-QL-123 | CP010 | 6 | 6 | 6 |
| TSD-QL-124 | CP010 | 6 | 6 | 6 |
| TSD-QL-125 | CP011 | 24 | 24 | 24 |
| TSD-QL-126 | CP011 | 24 | 24 | 24 |
| TSD-QL-127 | CP011 | 24 | 24 | 24 |
| TSD-QL-128 | CP011 | 24 | 24 | 24 |
| TSD-QL-129 | CP011 | 24 | 24 | 24 |
| TSD-QL-130 | CP011 | 24 | 24 | 24 |
| TSD-QL-131 | CP011 | 24 | 24 | 24 |
| TSD-QL-132 | CP012 | 26 | 26 | 26 |
| TSD-QL-133 | CP012 | 24 | 24 | 24 |
| TSD-QL-134 | CP012 | 26 | 26 | 26 |
| TSD-QL-135 | CP012 | 26 | 26 | 26 |
| TSD-QL-136 | CP012 | 24 | 24 | 24 |
| TSD-QL-137 | CP012 | 24 | 24 | 24 |
| TSD-QL-138 | CP012 | 24 | 24 | 24 |
| TSD-QL-139 | CP012 | 24 | 24 | 24 |
| TSD-QL-140 | CP012 | 24 | 24 | 24 |
| TSD-QL-141 | CP012 | 24 | 24 | 24 |
| TSD-QL-142 | CP012 | 24 | 24 | 24 |

## Validation and next closure work

Runtime fix: explicit family-to-target/event/endpoint filtering; 618 English combinations swept, with independent rendered arithmetic checks on clock families 93-A..E and count families 94-A..B, 1,854 multilingual combinations covered by the existing Studio proof. The CP003–CP012 frozen checkpoint proof suite and current-main 255-case closure proof both passed after this change.

Keep all TSD bank/test/mock/public gates locked and CP010–CP012 unregistered. Before moving to Banking Number Series: reconcile CP004 localization, foundation replacement map and CP010 source parity; repair worked explanations and misconception options in review candidates; expand realistic scenario pools; review all changed English/Hindi/Punjabi surfaces and rendering.

RAP remains closed. This report does not mark TSD complete.

Local changes only: GitHub PR #3148 has not been updated because push credentials are unavailable.
