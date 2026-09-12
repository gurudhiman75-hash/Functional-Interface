# CAE-001 V3 editorial-realness review pack

Deterministic English (`en-IN`) review-only samples. There are ten generated questions for each current CP/QL. The pack exposes causal state separately from item presentation; QL allocation remains provisional.

## CAE-CP-001 / CAE-QL-001

### EASY — seed 0

Read the two statements and determine the relationship supported by the information shown.

Statement I: Visibility on the runway fell sharply.

Statement II: Dense fog formed around the airport.

A. Statement I is the direct cause and Statement II is its effect.
B. Statement II is the direct cause and Statement I is its effect.
C. Statements I and II are effects of a common cause.
D. The statements are independent; neither causes the other.

**Answer:** B. Statement II is the direct cause and Statement I is its effect.

**Explanation:** Dense fog formed around the airport → Visibility on the runway fell sharply. This is one direct causal step.

**Family / variant:** CAE-FAM-OPERATIONS-CHAIN / fog
**causalStateId:** `projection:CAE-PLAN-DIRECT|family:CAE-FAM-OPERATIONS-CHAIN|variant:fog|graph:DIRECT_CHAIN|direction:cause>bridge|visible:bridge,cause`
**itemVariantId:** `projection:CAE-PLAN-DIRECT|family:CAE-FAM-OPERATIONS-CHAIN|variant:fog|graph:DIRECT_CHAIN|direction:cause>bridge|visible:bridge,cause|distractors:COMMON_CAUSE,FIRST_DIRECT_CAUSES_SECOND,INDEPENDENT|profile:FOUR_WAY|presentation:FIRST_DIRECT_CAUSES_SECOND>SECOND_DIRECT_CAUSES_FIRST>COMMON_CAUSE>INDEPENDENT`
**Difficulty evidence:** distance=1; hiddenLinks=0; topology=1; credibleDistractors=0; candidateBurden=0; inference=0; score=4
**Distractor mechanisms:** UNRELATED_EVENT, COMMON_CAUSE_CONFUSION, UNRELATED_EVENT

### EASY — seed 1

Read the two statements and determine the relationship supported by the information shown.

Statement I: Applicants reached the counter for help.

Statement II: Online applications took longer to submit.

A. Statements I and II are effects of a common cause.
B. The statements are independent; neither causes the other.
C. Statement I is the direct cause and Statement II is its effect.
D. Statement II is the direct cause and Statement I is its effect.

**Answer:** D. Statement II is the direct cause and Statement I is its effect.

**Explanation:** Online applications took longer to submit → Applicants reached the counter for help. This is one direct causal step.

**Family / variant:** CAE-FAM-DIAGNOSTIC-DISRUPTION / server
**causalStateId:** `projection:CAE-PLAN-DIRECT|family:CAE-FAM-DIAGNOSTIC-DISRUPTION|variant:server|graph:DIRECT_CHAIN|direction:effect>terminal|visible:terminal,effect`
**itemVariantId:** `projection:CAE-PLAN-DIRECT|family:CAE-FAM-DIAGNOSTIC-DISRUPTION|variant:server|graph:DIRECT_CHAIN|direction:effect>terminal|visible:terminal,effect|distractors:COMMON_CAUSE,FIRST_DIRECT_CAUSES_SECOND,INDEPENDENT|profile:FOUR_WAY|presentation:COMMON_CAUSE>INDEPENDENT>FIRST_DIRECT_CAUSES_SECOND>SECOND_DIRECT_CAUSES_FIRST`
**Difficulty evidence:** distance=1; hiddenLinks=0; topology=1; credibleDistractors=0; candidateBurden=0; inference=0; score=4
**Distractor mechanisms:** COMMON_CAUSE_CONFUSION, UNRELATED_EVENT, UNRELATED_EVENT

### EASY — seed 2

Read the two statements and determine the relationship supported by the information shown.

Statement I: Regular lessons paused.

Statement II: Classes moved to the assembly area.

A. The statements are independent; neither causes the other.
B. Statements I and II are effects of a common cause.
C. Statement II is the direct cause and Statement I is its effect.
D. Statement I is the direct cause and Statement II is its effect.

**Answer:** C. Statement II is the direct cause and Statement I is its effect.

**Explanation:** Classes moved to the assembly area → Regular lessons paused. This is one direct causal step.

**Family / variant:** CAE-FAM-CIVIC-SEQUENCE / drill
**causalStateId:** `projection:CAE-PLAN-DIRECT|family:CAE-FAM-CIVIC-SEQUENCE|variant:drill|graph:HIDDEN_CHAIN|direction:bridge>effect|visible:effect,bridge`
**itemVariantId:** `projection:CAE-PLAN-DIRECT|family:CAE-FAM-CIVIC-SEQUENCE|variant:drill|graph:HIDDEN_CHAIN|direction:bridge>effect|visible:effect,bridge|distractors:COMMON_CAUSE,FIRST_DIRECT_CAUSES_SECOND,INDEPENDENT|profile:FOUR_WAY|presentation:INDEPENDENT>COMMON_CAUSE>SECOND_DIRECT_CAUSES_FIRST>FIRST_DIRECT_CAUSES_SECOND`
**Difficulty evidence:** distance=1; hiddenLinks=0; topology=4; credibleDistractors=0; candidateBurden=0; inference=0; score=7
**Distractor mechanisms:** UNRELATED_EVENT, COMMON_CAUSE_CONFUSION, UNRELATED_EVENT

### EASY — seed 3

Read the two statements and determine the relationship supported by the information shown.

Statement I: Passengers were moved to later flights.

Statement II: Several departures were delayed.

A. The statements are independent; neither causes the other.
B. Statement I is the direct cause and Statement II is its effect.
C. Statement II is the direct cause and Statement I is its effect.
D. Statements I and II are effects of a common cause.

**Answer:** C. Statement II is the direct cause and Statement I is its effect.

**Explanation:** Several departures were delayed → Passengers were moved to later flights. This is one direct causal step.

**Family / variant:** CAE-FAM-OPERATIONS-CHAIN / fog
**causalStateId:** `projection:CAE-PLAN-DIRECT|family:CAE-FAM-OPERATIONS-CHAIN|variant:fog|graph:DIRECT_CHAIN|direction:effect>terminal|visible:terminal,effect`
**itemVariantId:** `projection:CAE-PLAN-DIRECT|family:CAE-FAM-OPERATIONS-CHAIN|variant:fog|graph:DIRECT_CHAIN|direction:effect>terminal|visible:terminal,effect|distractors:COMMON_CAUSE,FIRST_DIRECT_CAUSES_SECOND,INDEPENDENT|profile:FOUR_WAY|presentation:INDEPENDENT>FIRST_DIRECT_CAUSES_SECOND>SECOND_DIRECT_CAUSES_FIRST>COMMON_CAUSE`
**Difficulty evidence:** distance=1; hiddenLinks=0; topology=1; credibleDistractors=0; candidateBurden=0; inference=0; score=4
**Distractor mechanisms:** UNRELATED_EVENT, UNRELATED_EVENT, COMMON_CAUSE_CONFUSION

### EASY — seed 4

Read the two statements and determine the relationship supported by the information shown.

Statement I: Vehicles merged into the remaining lane.

Statement II: Traffic queues formed.

A. Statement I is the direct cause and Statement II is its effect.
B. Statements I and II are effects of a common cause.
C. Statement II is the direct cause and Statement I is its effect.
D. The statements are independent; neither causes the other.

**Answer:** A. Statement I is the direct cause and Statement II is its effect.

**Explanation:** Vehicles merged into the remaining lane → Traffic queues formed. This is one direct causal step.

**Family / variant:** CAE-FAM-CIVIC-SEQUENCE / roadwork
**causalStateId:** `projection:CAE-PLAN-DIRECT|family:CAE-FAM-CIVIC-SEQUENCE|variant:roadwork|graph:HIDDEN_CHAIN|direction:bridge>effect|visible:bridge,effect`
**itemVariantId:** `projection:CAE-PLAN-DIRECT|family:CAE-FAM-CIVIC-SEQUENCE|variant:roadwork|graph:HIDDEN_CHAIN|direction:bridge>effect|visible:bridge,effect|distractors:COMMON_CAUSE,INDEPENDENT,SECOND_DIRECT_CAUSES_FIRST|profile:FOUR_WAY|presentation:FIRST_DIRECT_CAUSES_SECOND>COMMON_CAUSE>SECOND_DIRECT_CAUSES_FIRST>INDEPENDENT`
**Difficulty evidence:** distance=1; hiddenLinks=0; topology=4; credibleDistractors=0; candidateBurden=0; inference=0; score=7
**Distractor mechanisms:** COMMON_CAUSE_CONFUSION, REVERSE_CAUSATION, UNRELATED_EVENT

### EASY — seed 5

Read the two statements and determine the relationship supported by the information shown.

Statement I: Train movement slowed down.

Statement II: Trains were instructed to move cautiously through that section.

A. Statement I is the direct cause and Statement II is its effect.
B. Statements I and II are effects of a common cause.
C. Statement II is the direct cause and Statement I is its effect.
D. The statements are independent; neither causes the other.

**Answer:** C. Statement II is the direct cause and Statement I is its effect.

**Explanation:** Trains were instructed to move cautiously through that section → Train movement slowed down. This is one direct causal step.

**Family / variant:** CAE-FAM-OPERATIONS-CHAIN / signal
**causalStateId:** `projection:CAE-PLAN-DIRECT|family:CAE-FAM-OPERATIONS-CHAIN|variant:signal|graph:DIRECT_CHAIN|direction:bridge>effect|visible:effect,bridge`
**itemVariantId:** `projection:CAE-PLAN-DIRECT|family:CAE-FAM-OPERATIONS-CHAIN|variant:signal|graph:DIRECT_CHAIN|direction:bridge>effect|visible:effect,bridge|distractors:COMMON_CAUSE,FIRST_DIRECT_CAUSES_SECOND,INDEPENDENT|profile:FOUR_WAY|presentation:FIRST_DIRECT_CAUSES_SECOND>COMMON_CAUSE>SECOND_DIRECT_CAUSES_FIRST>INDEPENDENT`
**Difficulty evidence:** distance=1; hiddenLinks=0; topology=1; credibleDistractors=0; candidateBurden=0; inference=0; score=4
**Distractor mechanisms:** UNRELATED_EVENT, COMMON_CAUSE_CONFUSION, UNRELATED_EVENT

### EASY — seed 6

Read the two statements and determine the relationship supported by the information shown.

Statement I: Trains moved slowly through the section.

Statement II: Water accumulated on the track section.

A. Statement I is the direct cause and Statement II is its effect.
B. The statements are independent; neither causes the other.
C. Statements I and II are effects of a common cause.
D. Statement II is the direct cause and Statement I is its effect.

**Answer:** D. Statement II is the direct cause and Statement I is its effect.

**Explanation:** Water accumulated on the track section → Trains moved slowly through the section. This is one direct causal step.

**Family / variant:** CAE-FAM-DIAGNOSTIC-DISRUPTION / waterlogged-rail
**causalStateId:** `projection:CAE-PLAN-DIRECT|family:CAE-FAM-DIAGNOSTIC-DISRUPTION|variant:waterlogged-rail|graph:DIRECT_CHAIN|direction:bridge>effect|visible:effect,bridge`
**itemVariantId:** `projection:CAE-PLAN-DIRECT|family:CAE-FAM-DIAGNOSTIC-DISRUPTION|variant:waterlogged-rail|graph:DIRECT_CHAIN|direction:bridge>effect|visible:effect,bridge|distractors:COMMON_CAUSE,FIRST_DIRECT_CAUSES_SECOND,INDEPENDENT|profile:FOUR_WAY|presentation:FIRST_DIRECT_CAUSES_SECOND>INDEPENDENT>COMMON_CAUSE>SECOND_DIRECT_CAUSES_FIRST`
**Difficulty evidence:** distance=1; hiddenLinks=0; topology=1; credibleDistractors=0; candidateBurden=0; inference=0; score=4
**Distractor mechanisms:** UNRELATED_EVENT, UNRELATED_EVENT, COMMON_CAUSE_CONFUSION

### EASY — seed 7

Read the two statements and determine the relationship supported by the information shown.

Statement I: Travel time on the route increased.

Statement II: More commuters chose the metro.

A. Statement I is the direct cause and Statement II is its effect.
B. Statements I and II are effects of a common cause.
C. Statement II is the direct cause and Statement I is its effect.
D. The statements are independent; neither causes the other.

**Answer:** A. Statement I is the direct cause and Statement II is its effect.

**Explanation:** Travel time on the route increased → More commuters chose the metro. This is one direct causal step.

**Family / variant:** CAE-FAM-OPERATIONS-CHAIN / bridge
**causalStateId:** `projection:CAE-PLAN-DIRECT|family:CAE-FAM-OPERATIONS-CHAIN|variant:bridge|graph:DIRECT_CHAIN|direction:effect>terminal|visible:effect,terminal`
**itemVariantId:** `projection:CAE-PLAN-DIRECT|family:CAE-FAM-OPERATIONS-CHAIN|variant:bridge|graph:DIRECT_CHAIN|direction:effect>terminal|visible:effect,terminal|distractors:COMMON_CAUSE,INDEPENDENT,SECOND_DIRECT_CAUSES_FIRST|profile:FOUR_WAY|presentation:FIRST_DIRECT_CAUSES_SECOND>COMMON_CAUSE>SECOND_DIRECT_CAUSES_FIRST>INDEPENDENT`
**Difficulty evidence:** distance=1; hiddenLinks=0; topology=1; credibleDistractors=0; candidateBurden=0; inference=0; score=4
**Distractor mechanisms:** COMMON_CAUSE_CONFUSION, REVERSE_CAUSATION, UNRELATED_EVENT

### EASY — seed 8

Read the two statements and determine the relationship supported by the information shown.

Statement I: Travel time on the route increased.

Statement II: Traffic was diverted through nearby streets.

A. The statements are independent; neither causes the other.
B. Statements I and II are effects of a common cause.
C. Statement I is the direct cause and Statement II is its effect.
D. Statement II is the direct cause and Statement I is its effect.

**Answer:** D. Statement II is the direct cause and Statement I is its effect.

**Explanation:** Traffic was diverted through nearby streets → Travel time on the route increased. This is one direct causal step.

**Family / variant:** CAE-FAM-OPERATIONS-CHAIN / bridge
**causalStateId:** `projection:CAE-PLAN-DIRECT|family:CAE-FAM-OPERATIONS-CHAIN|variant:bridge|graph:DIRECT_CHAIN|direction:bridge>effect|visible:effect,bridge`
**itemVariantId:** `projection:CAE-PLAN-DIRECT|family:CAE-FAM-OPERATIONS-CHAIN|variant:bridge|graph:DIRECT_CHAIN|direction:bridge>effect|visible:effect,bridge|distractors:COMMON_CAUSE,FIRST_DIRECT_CAUSES_SECOND,INDEPENDENT|profile:FOUR_WAY|presentation:INDEPENDENT>COMMON_CAUSE>FIRST_DIRECT_CAUSES_SECOND>SECOND_DIRECT_CAUSES_FIRST`
**Difficulty evidence:** distance=1; hiddenLinks=0; topology=1; credibleDistractors=0; candidateBurden=0; inference=0; score=4
**Distractor mechanisms:** UNRELATED_EVENT, COMMON_CAUSE_CONFUSION, UNRELATED_EVENT

### EASY — seed 9

Read the two statements and determine the relationship supported by the information shown.

Statement I: The service server received an unusually high number of requests.

Statement II: The server response queue grew.

A. Statement I is the direct cause and Statement II is its effect.
B. Statement II is the direct cause and Statement I is its effect.
C. Statements I and II are effects of a common cause.
D. The statements are independent; neither causes the other.

**Answer:** A. Statement I is the direct cause and Statement II is its effect.

**Explanation:** The service server received an unusually high number of requests → The server response queue grew. This is one direct causal step.

**Family / variant:** CAE-FAM-DIAGNOSTIC-DISRUPTION / server
**causalStateId:** `projection:CAE-PLAN-DIRECT|family:CAE-FAM-DIAGNOSTIC-DISRUPTION|variant:server|graph:DIRECT_CHAIN|direction:cause>bridge|visible:cause,bridge`
**itemVariantId:** `projection:CAE-PLAN-DIRECT|family:CAE-FAM-DIAGNOSTIC-DISRUPTION|variant:server|graph:DIRECT_CHAIN|direction:cause>bridge|visible:cause,bridge|distractors:COMMON_CAUSE,INDEPENDENT,SECOND_DIRECT_CAUSES_FIRST|profile:FOUR_WAY|presentation:FIRST_DIRECT_CAUSES_SECOND>SECOND_DIRECT_CAUSES_FIRST>COMMON_CAUSE>INDEPENDENT`
**Difficulty evidence:** distance=1; hiddenLinks=0; topology=1; credibleDistractors=0; candidateBurden=0; inference=0; score=4
**Distractor mechanisms:** REVERSE_CAUSATION, COMMON_CAUSE_CONFUSION, UNRELATED_EVENT

## CAE-CP-002 / CAE-QL-002

### EASY — seed 0

Read the two statements and determine the relationship supported by the information shown.

Statement I: Demand for local buses increased.

Statement II: Mobile data use in the area increased.

A. Statement I is the direct cause and Statement II is its effect.
B. The statements are independent; neither causes the other.
C. Statement II is the direct cause and Statement I is its effect.
D. Statements I and II are effects of a common cause.

**Answer:** D. Statements I and II are effects of a common cause.

**Explanation:** A large local festival began → Demand for local buses increased / Mobile data use in the area increased. Both events follow from the same hidden cause.

**Family / variant:** CAE-FAM-SHARED-PRESSURE / festival
**causalStateId:** `projection:CAE-PLAN-COMMON-INDEPENDENT|family:CAE-FAM-SHARED-PRESSURE|variant:festival|graph:BRANCHING_COMMON_CAUSE|direction:cause|visible:first-effect,second-effect`
**itemVariantId:** `projection:CAE-PLAN-COMMON-INDEPENDENT|family:CAE-FAM-SHARED-PRESSURE|variant:festival|graph:BRANCHING_COMMON_CAUSE|direction:cause|visible:first-effect,second-effect|distractors:FIRST_DIRECT_CAUSES_SECOND,INDEPENDENT,SECOND_DIRECT_CAUSES_FIRST|profile:FOUR_WAY|presentation:FIRST_DIRECT_CAUSES_SECOND>INDEPENDENT>SECOND_DIRECT_CAUSES_FIRST>COMMON_CAUSE`
**Difficulty evidence:** distance=0; hiddenLinks=1; topology=2; credibleDistractors=0; candidateBurden=0; inference=2; score=8
**Distractor mechanisms:** UNRELATED_EVENT, UNRELATED_EVENT, REVERSE_CAUSATION

### EASY — seed 1

Read the two statements and determine the relationship supported by the information shown.

Statement I: A water pipe burst in one neighbourhood.

Statement II: A clinic updated its appointment software.

A. Statement II is the direct cause and Statement I is its effect.
B. Statements I and II are effects of a common cause.
C. The statements are independent; neither causes the other.
D. Statement I is the direct cause and Statement II is its effect.

**Answer:** C. The statements are independent; neither causes the other.

**Explanation:** The two observations do not establish a causal link. Neither displayed event lies on a causal path to the other.

**Family / variant:** CAE-FAM-PARALLEL-INCIDENTS / pipe-clinic
**causalStateId:** `projection:CAE-PLAN-COMMON-INDEPENDENT|family:CAE-FAM-PARALLEL-INCIDENTS|variant:pipe-clinic|graph:PARALLEL_CHAINS|direction:first-cause>second-cause|visible:first-cause,second-cause`
**itemVariantId:** `projection:CAE-PLAN-COMMON-INDEPENDENT|family:CAE-FAM-PARALLEL-INCIDENTS|variant:pipe-clinic|graph:PARALLEL_CHAINS|direction:first-cause>second-cause|visible:first-cause,second-cause|distractors:COMMON_CAUSE,FIRST_DIRECT_CAUSES_SECOND,SECOND_DIRECT_CAUSES_FIRST|profile:FOUR_WAY|presentation:SECOND_DIRECT_CAUSES_FIRST>COMMON_CAUSE>INDEPENDENT>FIRST_DIRECT_CAUSES_SECOND`
**Difficulty evidence:** distance=1; hiddenLinks=0; topology=2; credibleDistractors=0; candidateBurden=0; inference=1; score=6
**Distractor mechanisms:** REVERSE_CAUSATION, COMMON_CAUSE_CONFUSION, UNRELATED_EVENT

### EASY — seed 2

Read the two statements and determine the relationship supported by the information shown.

Statement I: New library memberships increased.

Statement II: Bus boarding at that depot increased.

A. The statements are independent; neither causes the other.
B. Statement II is the direct cause and Statement I is its effect.
C. Statement I is the direct cause and Statement II is its effect.
D. Statements I and II are effects of a common cause.

**Answer:** A. The statements are independent; neither causes the other.

**Explanation:** The two observations do not establish a causal link. Neither displayed event lies on a causal path to the other.

**Family / variant:** CAE-FAM-COINCIDENT-OBSERVATIONS / books-buses
**causalStateId:** `projection:CAE-PLAN-COMMON-INDEPENDENT|family:CAE-FAM-COINCIDENT-OBSERVATIONS|variant:books-buses|graph:PARALLEL_CHAINS|direction:first-effect>second-effect|visible:first-effect,second-effect`
**itemVariantId:** `projection:CAE-PLAN-COMMON-INDEPENDENT|family:CAE-FAM-COINCIDENT-OBSERVATIONS|variant:books-buses|graph:PARALLEL_CHAINS|direction:first-effect>second-effect|visible:first-effect,second-effect|distractors:COMMON_CAUSE,FIRST_DIRECT_CAUSES_SECOND,SECOND_DIRECT_CAUSES_FIRST|profile:FOUR_WAY|presentation:INDEPENDENT>SECOND_DIRECT_CAUSES_FIRST>FIRST_DIRECT_CAUSES_SECOND>COMMON_CAUSE`
**Difficulty evidence:** distance=1; hiddenLinks=0; topology=2; credibleDistractors=0; candidateBurden=0; inference=1; score=6
**Distractor mechanisms:** REVERSE_CAUSATION, UNRELATED_EVENT, COMMON_CAUSE_CONFUSION

### EASY — seed 3

Read the two statements and determine the relationship supported by the information shown.

Statement I: The public library started a membership drive.

Statement II: A bus depot added two peak-hour services.

A. Statements I and II are effects of a common cause.
B. The statements are independent; neither causes the other.
C. Statement II is the direct cause and Statement I is its effect.
D. Statement I is the direct cause and Statement II is its effect.

**Answer:** B. The statements are independent; neither causes the other.

**Explanation:** The two observations do not establish a causal link. Neither displayed event lies on a causal path to the other.

**Family / variant:** CAE-FAM-COINCIDENT-OBSERVATIONS / books-buses
**causalStateId:** `projection:CAE-PLAN-COMMON-INDEPENDENT|family:CAE-FAM-COINCIDENT-OBSERVATIONS|variant:books-buses|graph:PARALLEL_CHAINS|direction:first-cause>second-cause|visible:first-cause,second-cause`
**itemVariantId:** `projection:CAE-PLAN-COMMON-INDEPENDENT|family:CAE-FAM-COINCIDENT-OBSERVATIONS|variant:books-buses|graph:PARALLEL_CHAINS|direction:first-cause>second-cause|visible:first-cause,second-cause|distractors:COMMON_CAUSE,FIRST_DIRECT_CAUSES_SECOND,SECOND_DIRECT_CAUSES_FIRST|profile:FOUR_WAY|presentation:COMMON_CAUSE>INDEPENDENT>SECOND_DIRECT_CAUSES_FIRST>FIRST_DIRECT_CAUSES_SECOND`
**Difficulty evidence:** distance=1; hiddenLinks=0; topology=2; credibleDistractors=0; candidateBurden=0; inference=1; score=6
**Distractor mechanisms:** COMMON_CAUSE_CONFUSION, REVERSE_CAUSATION, UNRELATED_EVENT

### EASY — seed 4

Read the two statements and determine the relationship supported by the information shown.

Statement I: Enquiries at the counselling desk increased.

Statement II: Demand for student-hostel rooms increased.

A. Statement II is the direct cause and Statement I is its effect.
B. Statements I and II are effects of a common cause.
C. Statement I is the direct cause and Statement II is its effect.
D. The statements are independent; neither causes the other.

**Answer:** B. Statements I and II are effects of a common cause.

**Explanation:** College admissions opened for the new session → Enquiries at the counselling desk increased / Demand for student-hostel rooms increased. Both events follow from the same hidden cause.

**Family / variant:** CAE-FAM-SHARED-PRESSURE / admissions
**causalStateId:** `projection:CAE-PLAN-COMMON-INDEPENDENT|family:CAE-FAM-SHARED-PRESSURE|variant:admissions|graph:BRANCHING_COMMON_CAUSE|direction:cause|visible:first-effect,second-effect`
**itemVariantId:** `projection:CAE-PLAN-COMMON-INDEPENDENT|family:CAE-FAM-SHARED-PRESSURE|variant:admissions|graph:BRANCHING_COMMON_CAUSE|direction:cause|visible:first-effect,second-effect|distractors:FIRST_DIRECT_CAUSES_SECOND,INDEPENDENT,SECOND_DIRECT_CAUSES_FIRST|profile:FOUR_WAY|presentation:SECOND_DIRECT_CAUSES_FIRST>COMMON_CAUSE>FIRST_DIRECT_CAUSES_SECOND>INDEPENDENT`
**Difficulty evidence:** distance=0; hiddenLinks=1; topology=2; credibleDistractors=0; candidateBurden=0; inference=2; score=8
**Distractor mechanisms:** REVERSE_CAUSATION, UNRELATED_EVENT, UNRELATED_EVENT

### EASY — seed 5

Read the two statements and determine the relationship supported by the information shown.

Statement I: A warehouse scanner stopped working.

Statement II: A library began its annual stock check.

A. The statements are independent; neither causes the other.
B. Statements I and II are effects of a common cause.
C. Statement II is the direct cause and Statement I is its effect.
D. Statement I is the direct cause and Statement II is its effect.

**Answer:** A. The statements are independent; neither causes the other.

**Explanation:** The two observations do not establish a causal link. Neither displayed event lies on a causal path to the other.

**Family / variant:** CAE-FAM-PARALLEL-INCIDENTS / warehouse-library
**causalStateId:** `projection:CAE-PLAN-COMMON-INDEPENDENT|family:CAE-FAM-PARALLEL-INCIDENTS|variant:warehouse-library|graph:PARALLEL_CHAINS|direction:first-cause>second-cause|visible:first-cause,second-cause`
**itemVariantId:** `projection:CAE-PLAN-COMMON-INDEPENDENT|family:CAE-FAM-PARALLEL-INCIDENTS|variant:warehouse-library|graph:PARALLEL_CHAINS|direction:first-cause>second-cause|visible:first-cause,second-cause|distractors:COMMON_CAUSE,FIRST_DIRECT_CAUSES_SECOND,SECOND_DIRECT_CAUSES_FIRST|profile:FOUR_WAY|presentation:INDEPENDENT>COMMON_CAUSE>SECOND_DIRECT_CAUSES_FIRST>FIRST_DIRECT_CAUSES_SECOND`
**Difficulty evidence:** distance=1; hiddenLinks=0; topology=2; credibleDistractors=0; candidateBurden=0; inference=1; score=6
**Distractor mechanisms:** COMMON_CAUSE_CONFUSION, REVERSE_CAUSATION, UNRELATED_EVENT

### EASY — seed 6

Read the two statements and determine the relationship supported by the information shown.

Statement I: Enquiries at the counselling desk increased.

Statement II: Demand for student-hostel rooms increased.

A. Statements I and II are effects of a common cause.
B. The statements are independent; neither causes the other.
C. Statement I is the direct cause and Statement II is its effect.
D. Statement II is the direct cause and Statement I is its effect.

**Answer:** A. Statements I and II are effects of a common cause.

**Explanation:** College admissions opened for the new session → Enquiries at the counselling desk increased / Demand for student-hostel rooms increased. Both events follow from the same hidden cause.

**Family / variant:** CAE-FAM-SHARED-PRESSURE / admissions
**causalStateId:** `projection:CAE-PLAN-COMMON-INDEPENDENT|family:CAE-FAM-SHARED-PRESSURE|variant:admissions|graph:BRANCHING_COMMON_CAUSE|direction:cause|visible:first-effect,second-effect`
**itemVariantId:** `projection:CAE-PLAN-COMMON-INDEPENDENT|family:CAE-FAM-SHARED-PRESSURE|variant:admissions|graph:BRANCHING_COMMON_CAUSE|direction:cause|visible:first-effect,second-effect|distractors:FIRST_DIRECT_CAUSES_SECOND,INDEPENDENT,SECOND_DIRECT_CAUSES_FIRST|profile:FOUR_WAY|presentation:COMMON_CAUSE>INDEPENDENT>FIRST_DIRECT_CAUSES_SECOND>SECOND_DIRECT_CAUSES_FIRST`
**Difficulty evidence:** distance=0; hiddenLinks=1; topology=2; credibleDistractors=0; candidateBurden=0; inference=2; score=8
**Distractor mechanisms:** UNRELATED_EVENT, UNRELATED_EVENT, REVERSE_CAUSATION

### EASY — seed 7

Read the two statements and determine the relationship supported by the information shown.

Statement I: A warehouse scanner stopped working.

Statement II: A library began its annual stock check.

A. The statements are independent; neither causes the other.
B. Statement II is the direct cause and Statement I is its effect.
C. Statement I is the direct cause and Statement II is its effect.
D. Statements I and II are effects of a common cause.

**Answer:** A. The statements are independent; neither causes the other.

**Explanation:** The two observations do not establish a causal link. Neither displayed event lies on a causal path to the other.

**Family / variant:** CAE-FAM-PARALLEL-INCIDENTS / warehouse-library
**causalStateId:** `projection:CAE-PLAN-COMMON-INDEPENDENT|family:CAE-FAM-PARALLEL-INCIDENTS|variant:warehouse-library|graph:PARALLEL_CHAINS|direction:first-cause>second-cause|visible:first-cause,second-cause`
**itemVariantId:** `projection:CAE-PLAN-COMMON-INDEPENDENT|family:CAE-FAM-PARALLEL-INCIDENTS|variant:warehouse-library|graph:PARALLEL_CHAINS|direction:first-cause>second-cause|visible:first-cause,second-cause|distractors:COMMON_CAUSE,FIRST_DIRECT_CAUSES_SECOND,SECOND_DIRECT_CAUSES_FIRST|profile:FOUR_WAY|presentation:INDEPENDENT>SECOND_DIRECT_CAUSES_FIRST>FIRST_DIRECT_CAUSES_SECOND>COMMON_CAUSE`
**Difficulty evidence:** distance=1; hiddenLinks=0; topology=2; credibleDistractors=0; candidateBurden=0; inference=1; score=6
**Distractor mechanisms:** REVERSE_CAUSATION, UNRELATED_EVENT, COMMON_CAUSE_CONFUSION

### EASY — seed 8

Read the two statements and determine the relationship supported by the information shown.

Statement I: Sales of umbrellas increased.

Statement II: Admissions to engineering colleges increased.

A. Statements I and II are effects of a common cause.
B. Statement II is the direct cause and Statement I is its effect.
C. Statement I is the direct cause and Statement II is its effect.
D. The statements are independent; neither causes the other.

**Answer:** D. The statements are independent; neither causes the other.

**Explanation:** The two observations do not establish a causal link. Neither displayed event lies on a causal path to the other.

**Family / variant:** CAE-FAM-COINCIDENT-OBSERVATIONS / umbrellas-admissions
**causalStateId:** `projection:CAE-PLAN-COMMON-INDEPENDENT|family:CAE-FAM-COINCIDENT-OBSERVATIONS|variant:umbrellas-admissions|graph:PARALLEL_CHAINS|direction:first-effect>second-effect|visible:first-effect,second-effect`
**itemVariantId:** `projection:CAE-PLAN-COMMON-INDEPENDENT|family:CAE-FAM-COINCIDENT-OBSERVATIONS|variant:umbrellas-admissions|graph:PARALLEL_CHAINS|direction:first-effect>second-effect|visible:first-effect,second-effect|distractors:COMMON_CAUSE,FIRST_DIRECT_CAUSES_SECOND,SECOND_DIRECT_CAUSES_FIRST|profile:FOUR_WAY|presentation:COMMON_CAUSE>SECOND_DIRECT_CAUSES_FIRST>FIRST_DIRECT_CAUSES_SECOND>INDEPENDENT`
**Difficulty evidence:** distance=1; hiddenLinks=0; topology=2; credibleDistractors=0; candidateBurden=0; inference=1; score=6
**Distractor mechanisms:** COMMON_CAUSE_CONFUSION, REVERSE_CAUSATION, UNRELATED_EVENT

### EASY — seed 9

Read the two statements and determine the relationship supported by the information shown.

Statement I: New library memberships increased.

Statement II: Bus boarding at that depot increased.

A. Statement II is the direct cause and Statement I is its effect.
B. Statement I is the direct cause and Statement II is its effect.
C. The statements are independent; neither causes the other.
D. Statements I and II are effects of a common cause.

**Answer:** C. The statements are independent; neither causes the other.

**Explanation:** The two observations do not establish a causal link. Neither displayed event lies on a causal path to the other.

**Family / variant:** CAE-FAM-COINCIDENT-OBSERVATIONS / books-buses
**causalStateId:** `projection:CAE-PLAN-COMMON-INDEPENDENT|family:CAE-FAM-COINCIDENT-OBSERVATIONS|variant:books-buses|graph:PARALLEL_CHAINS|direction:first-effect>second-effect|visible:first-effect,second-effect`
**itemVariantId:** `projection:CAE-PLAN-COMMON-INDEPENDENT|family:CAE-FAM-COINCIDENT-OBSERVATIONS|variant:books-buses|graph:PARALLEL_CHAINS|direction:first-effect>second-effect|visible:first-effect,second-effect|distractors:COMMON_CAUSE,FIRST_DIRECT_CAUSES_SECOND,SECOND_DIRECT_CAUSES_FIRST|profile:FOUR_WAY|presentation:SECOND_DIRECT_CAUSES_FIRST>FIRST_DIRECT_CAUSES_SECOND>INDEPENDENT>COMMON_CAUSE`
**Difficulty evidence:** distance=1; hiddenLinks=0; topology=2; credibleDistractors=0; candidateBurden=0; inference=1; score=6
**Distractor mechanisms:** REVERSE_CAUSATION, UNRELATED_EVENT, COMMON_CAUSE_CONFUSION

## CAE-CP-003 / CAE-QL-003

### MEDIUM — seed 0

Observation: Applicants reached the counter for help.

Which option is the most probable immediate cause of the observed event?

A. A payment gateway failed for applicants in a different district.
B. Online applications took longer to submit.
C. The help desk opened extra counters after applicants began arriving.
D. The server response queue grew.

**Answer:** B. Online applications took longer to submit.

**Explanation:** Online applications took longer to submit → Applicants reached the counter for help. This immediate link fits the observation's timing, scope, and magnitude.

**Family / variant:** CAE-FAM-DIAGNOSTIC-DISRUPTION / server
**causalStateId:** `projection:CAE-PLAN-PROBABLE-CAUSE|family:CAE-FAM-DIAGNOSTIC-DISRUPTION|variant:server|graph:DIRECT_CHAIN|direction:effect>terminal|visible:terminal`
**itemVariantId:** `projection:CAE-PLAN-PROBABLE-CAUSE|family:CAE-FAM-DIAGNOSTIC-DISRUPTION|variant:server|graph:DIRECT_CHAIN|direction:effect>terminal|visible:terminal|distractors:CAE-WORLD-DIAGNOSTIC-DISRUPTION-server:authored:server-extra-counters,CAE-WORLD-DIAGNOSTIC-DISRUPTION-server:authored:server-payment-gateway,CAE-WORLD-DIAGNOSTIC-DISRUPTION-server:node:CAE-WORLD-DIAGNOSTIC-DISRUPTION-server:bridge|profile:NONE|presentation:CAE-WORLD-DIAGNOSTIC-DISRUPTION-server:authored:server-payment-gateway>CAE-WORLD-DIAGNOSTIC-DISRUPTION-server:effect>CAE-WORLD-DIAGNOSTIC-DISRUPTION-server:authored:server-extra-counters>CAE-WORLD-DIAGNOSTIC-DISRUPTION-server:node:CAE-WORLD-DIAGNOSTIC-DISRUPTION-server:bridge`
**Difficulty evidence:** distance=1; hiddenLinks=1; topology=1; credibleDistractors=2; candidateBurden=5; inference=1; score=10
**Distractor mechanisms:** INDIRECTNESS_CONFUSION (CREDIBLE_ALTERNATIVE), WRONG_SCOPE (CREDIBLE_ALTERNATIVE), REVERSE_CAUSATION (CLEAR_REJECT)

### HARD — seed 22

Observation: Arrival time at the centre increased.

Which option is the most probable immediate cause of the observed event?

A. A short security check delayed a few candidates at one gate.
B. The approach road to the examination centre was closed.
C. A parking shortage affected a coaching centre in another locality.
D. Candidates used a longer alternate route.

**Answer:** D. Candidates used a longer alternate route.

**Explanation:** Candidates used a longer alternate route → Arrival time at the centre increased. This immediate link fits the observation's timing, scope, and magnitude.

**Family / variant:** CAE-FAM-COMPETING-SCOPE / exam-centre
**causalStateId:** `projection:CAE-PLAN-PROBABLE-CAUSE|family:CAE-FAM-COMPETING-SCOPE|variant:exam-centre|graph:COMPETING_CAUSES|direction:bridge>effect|visible:effect`
**itemVariantId:** `projection:CAE-PLAN-PROBABLE-CAUSE|family:CAE-FAM-COMPETING-SCOPE|variant:exam-centre|graph:COMPETING_CAUSES|direction:bridge>effect|visible:effect|distractors:CAE-WORLD-COMPETING-SCOPE-exam-centre:authored:exam-centre-parking,CAE-WORLD-COMPETING-SCOPE-exam-centre:authored:exam-centre-security-check,CAE-WORLD-COMPETING-SCOPE-exam-centre:node:CAE-WORLD-COMPETING-SCOPE-exam-centre:cause|profile:NONE|presentation:CAE-WORLD-COMPETING-SCOPE-exam-centre:authored:exam-centre-security-check>CAE-WORLD-COMPETING-SCOPE-exam-centre:node:CAE-WORLD-COMPETING-SCOPE-exam-centre:cause>CAE-WORLD-COMPETING-SCOPE-exam-centre:authored:exam-centre-parking>CAE-WORLD-COMPETING-SCOPE-exam-centre:bridge`
**Difficulty evidence:** distance=1; hiddenLinks=1; topology=4; credibleDistractors=3; candidateBurden=10; inference=2; score=17
**Distractor mechanisms:** WEAK_CAUSE (CREDIBLE_ALTERNATIVE), INDIRECTNESS_CONFUSION (CREDIBLE_ALTERNATIVE), WRONG_SCOPE (CREDIBLE_ALTERNATIVE)

### MEDIUM — seed 2

Observation: More candidates requested late-entry help.

Which option is the most probable immediate cause of the observed event?

A. A parking shortage affected a coaching centre in another locality.
B. Candidates used a longer alternate route.
C. A short security check delayed a few candidates at one gate.
D. Arrival time at the centre increased.

**Answer:** D. Arrival time at the centre increased.

**Explanation:** Arrival time at the centre increased → More candidates requested late-entry help. This immediate link fits the observation's timing, scope, and magnitude.

**Family / variant:** CAE-FAM-COMPETING-SCOPE / exam-centre
**causalStateId:** `projection:CAE-PLAN-PROBABLE-CAUSE|family:CAE-FAM-COMPETING-SCOPE|variant:exam-centre|graph:COMPETING_CAUSES|direction:effect>terminal|visible:terminal`
**itemVariantId:** `projection:CAE-PLAN-PROBABLE-CAUSE|family:CAE-FAM-COMPETING-SCOPE|variant:exam-centre|graph:COMPETING_CAUSES|direction:effect>terminal|visible:terminal|distractors:CAE-WORLD-COMPETING-SCOPE-exam-centre:authored:exam-centre-parking,CAE-WORLD-COMPETING-SCOPE-exam-centre:authored:exam-centre-security-check,CAE-WORLD-COMPETING-SCOPE-exam-centre:node:CAE-WORLD-COMPETING-SCOPE-exam-centre:bridge|profile:NONE|presentation:CAE-WORLD-COMPETING-SCOPE-exam-centre:authored:exam-centre-parking>CAE-WORLD-COMPETING-SCOPE-exam-centre:node:CAE-WORLD-COMPETING-SCOPE-exam-centre:bridge>CAE-WORLD-COMPETING-SCOPE-exam-centre:authored:exam-centre-security-check>CAE-WORLD-COMPETING-SCOPE-exam-centre:effect`
**Difficulty evidence:** distance=1; hiddenLinks=1; topology=4; credibleDistractors=2; candidateBurden=5; inference=1; score=13
**Distractor mechanisms:** INDIRECTNESS_CONFUSION (CREDIBLE_ALTERNATIVE), WRONG_SCOPE (CREDIBLE_ALTERNATIVE), WEAK_CAUSE (CLEAR_REJECT)

### MEDIUM — seed 3

Observation: Trains were instructed to move cautiously through that section.

Which option is the most probable immediate cause of the observed event?

A. A platform display system briefly failed at one station.
B. A track circuit gave an intermittent warning on the same rail section.
C. A signal fault was detected on one rail section.
D. Train movement slowed down.

**Answer:** C. A signal fault was detected on one rail section.

**Explanation:** A signal fault was detected on one rail section → Trains were instructed to move cautiously through that section. This immediate link fits the observation's timing, scope, and magnitude.

**Family / variant:** CAE-FAM-OPERATIONS-CHAIN / signal
**causalStateId:** `projection:CAE-PLAN-PROBABLE-CAUSE|family:CAE-FAM-OPERATIONS-CHAIN|variant:signal|graph:DIRECT_CHAIN|direction:cause>bridge|visible:bridge`
**itemVariantId:** `projection:CAE-PLAN-PROBABLE-CAUSE|family:CAE-FAM-OPERATIONS-CHAIN|variant:signal|graph:DIRECT_CHAIN|direction:cause>bridge|visible:bridge|distractors:CAE-WORLD-OPERATIONS-CHAIN-signal:authored:signal-platform-display,CAE-WORLD-OPERATIONS-CHAIN-signal:authored:signal-track-circuit,CAE-WORLD-OPERATIONS-CHAIN-signal:node:CAE-WORLD-OPERATIONS-CHAIN-signal:effect|profile:NONE|presentation:CAE-WORLD-OPERATIONS-CHAIN-signal:authored:signal-platform-display>CAE-WORLD-OPERATIONS-CHAIN-signal:authored:signal-track-circuit>CAE-WORLD-OPERATIONS-CHAIN-signal:cause>CAE-WORLD-OPERATIONS-CHAIN-signal:node:CAE-WORLD-OPERATIONS-CHAIN-signal:effect`
**Difficulty evidence:** distance=1; hiddenLinks=1; topology=1; credibleDistractors=2; candidateBurden=9; inference=2; score=12
**Distractor mechanisms:** MAGNITUDE_MISMATCH (CREDIBLE_ALTERNATIVE), WEAK_CAUSE (CREDIBLE_ALTERNATIVE), REVERSE_CAUSATION (CLEAR_REJECT)

### MEDIUM — seed 4

Observation: Some certificates were issued late.

Which option is the most probable immediate cause of the observed event?

A. Applications waited for verification.
B. The office sent delay notices after certificates were issued late.
C. A nearby office changed its visitor-register system.
D. The office printer network failed.

**Answer:** A. Applications waited for verification.

**Explanation:** Applications waited for verification → Some certificates were issued late. This immediate link fits the observation's timing, scope, and magnitude.

**Family / variant:** CAE-FAM-MISSING-BRIDGE / printer
**causalStateId:** `projection:CAE-PLAN-PROBABLE-CAUSE|family:CAE-FAM-MISSING-BRIDGE|variant:printer|graph:HIDDEN_CHAIN|direction:effect>terminal|visible:terminal`
**itemVariantId:** `projection:CAE-PLAN-PROBABLE-CAUSE|family:CAE-FAM-MISSING-BRIDGE|variant:printer|graph:HIDDEN_CHAIN|direction:effect>terminal|visible:terminal|distractors:CAE-WORLD-MISSING-BRIDGE-printer:authored:printer-delay-notice,CAE-WORLD-MISSING-BRIDGE-printer:authored:printer-visitor-register,CAE-WORLD-MISSING-BRIDGE-printer:node:CAE-WORLD-MISSING-BRIDGE-printer:cause|profile:NONE|presentation:CAE-WORLD-MISSING-BRIDGE-printer:effect>CAE-WORLD-MISSING-BRIDGE-printer:authored:printer-delay-notice>CAE-WORLD-MISSING-BRIDGE-printer:authored:printer-visitor-register>CAE-WORLD-MISSING-BRIDGE-printer:node:CAE-WORLD-MISSING-BRIDGE-printer:cause`
**Difficulty evidence:** distance=1; hiddenLinks=1; topology=4; credibleDistractors=2; candidateBurden=4; inference=1; score=13
**Distractor mechanisms:** INDIRECTNESS_CONFUSION (CREDIBLE_ALTERNATIVE), WRONG_SCOPE (CREDIBLE_ALTERNATIVE), REVERSE_CAUSATION (CLEAR_REJECT)

### MEDIUM — seed 8

Observation: Deliveries to the neighbourhood arrived late.

Which option is the most probable immediate cause of the observed event?

A. Heavy rain fell for several hours.
B. A delivery van stalled in a nearby lane.
C. Leaves blocked a small roadside drain for a few minutes.
D. Water collected on the access road.

**Answer:** D. Water collected on the access road.

**Explanation:** Water collected on the access road → Deliveries to the neighbourhood arrived late. This immediate link fits the observation's timing, scope, and magnitude.

**Family / variant:** CAE-FAM-HIDDEN-CHAIN / drainage
**causalStateId:** `projection:CAE-PLAN-PROBABLE-CAUSE|family:CAE-FAM-HIDDEN-CHAIN|variant:drainage|graph:HIDDEN_CHAIN|direction:effect>terminal|visible:terminal`
**itemVariantId:** `projection:CAE-PLAN-PROBABLE-CAUSE|family:CAE-FAM-HIDDEN-CHAIN|variant:drainage|graph:HIDDEN_CHAIN|direction:effect>terminal|visible:terminal|distractors:CAE-WORLD-HIDDEN-CHAIN-drainage:authored:drainage-leaves,CAE-WORLD-HIDDEN-CHAIN-drainage:authored:drainage-stalled-van,CAE-WORLD-HIDDEN-CHAIN-drainage:node:CAE-WORLD-HIDDEN-CHAIN-drainage:cause|profile:NONE|presentation:CAE-WORLD-HIDDEN-CHAIN-drainage:node:CAE-WORLD-HIDDEN-CHAIN-drainage:cause>CAE-WORLD-HIDDEN-CHAIN-drainage:authored:drainage-stalled-van>CAE-WORLD-HIDDEN-CHAIN-drainage:authored:drainage-leaves>CAE-WORLD-HIDDEN-CHAIN-drainage:effect`
**Difficulty evidence:** distance=1; hiddenLinks=1; topology=4; credibleDistractors=2; candidateBurden=0; inference=1; score=11
**Distractor mechanisms:** INDIRECTNESS_CONFUSION (CREDIBLE_ALTERNATIVE), WRONG_SCOPE (CREDIBLE_ALTERNATIVE), WEAK_CAUSE (CLEAR_REJECT)

### MEDIUM — seed 1

Observation: Pressure in the supply line fell.

Which option is the most probable immediate cause of the observed event?

A. A valve test briefly reduced water flow to one street.
B. A main pump stopped operating.
C. A maintenance crew shut a small pump in another supply zone.
D. A pressure-control valve on the main line stuck partly closed.

**Answer:** B. A main pump stopped operating.

**Explanation:** A main pump stopped operating → Pressure in the supply line fell. This immediate link fits the observation's timing, scope, and magnitude.

**Family / variant:** CAE-FAM-DIAGNOSTIC-DISRUPTION / pump
**causalStateId:** `projection:CAE-PLAN-PROBABLE-CAUSE|family:CAE-FAM-DIAGNOSTIC-DISRUPTION|variant:pump|graph:DIRECT_CHAIN|direction:cause>bridge|visible:bridge`
**itemVariantId:** `projection:CAE-PLAN-PROBABLE-CAUSE|family:CAE-FAM-DIAGNOSTIC-DISRUPTION|variant:pump|graph:DIRECT_CHAIN|direction:cause>bridge|visible:bridge|distractors:CAE-WORLD-DIAGNOSTIC-DISRUPTION-pump:authored:pump-other-zone,CAE-WORLD-DIAGNOSTIC-DISRUPTION-pump:authored:pump-pressure-valve,CAE-WORLD-DIAGNOSTIC-DISRUPTION-pump:authored:pump-valve-test|profile:NONE|presentation:CAE-WORLD-DIAGNOSTIC-DISRUPTION-pump:authored:pump-valve-test>CAE-WORLD-DIAGNOSTIC-DISRUPTION-pump:cause>CAE-WORLD-DIAGNOSTIC-DISRUPTION-pump:authored:pump-other-zone>CAE-WORLD-DIAGNOSTIC-DISRUPTION-pump:authored:pump-pressure-valve`
**Difficulty evidence:** distance=1; hiddenLinks=1; topology=1; credibleDistractors=2; candidateBurden=7; inference=2; score=12
**Distractor mechanisms:** MAGNITUDE_MISMATCH (CREDIBLE_ALTERNATIVE), WEAK_CAUSE (CREDIBLE_ALTERNATIVE), WRONG_SCOPE (CLEAR_REJECT)

### MEDIUM — seed 5

Observation: Fresh vegetable deliveries fell sharply.

Which option is the most probable immediate cause of the observed event?

A. Shopkeepers raised prices after supplies had already fallen.
B. A landslide blocked the main supply road.
C. Supply vehicles were delayed.
D. One delivery van arrived late with a small load of vegetables.

**Answer:** C. Supply vehicles were delayed.

**Explanation:** Supply vehicles were delayed → Fresh vegetable deliveries fell sharply. This immediate link fits the observation's timing, scope, and magnitude.

**Family / variant:** CAE-FAM-COMPETING-SCOPE / vegetables
**causalStateId:** `projection:CAE-PLAN-PROBABLE-CAUSE|family:CAE-FAM-COMPETING-SCOPE|variant:vegetables|graph:COMPETING_CAUSES|direction:bridge>effect|visible:effect`
**itemVariantId:** `projection:CAE-PLAN-PROBABLE-CAUSE|family:CAE-FAM-COMPETING-SCOPE|variant:vegetables|graph:COMPETING_CAUSES|direction:bridge>effect|visible:effect|distractors:CAE-WORLD-COMPETING-SCOPE-vegetables:authored:vegetables-late-van,CAE-WORLD-COMPETING-SCOPE-vegetables:authored:vegetables-price-rise,CAE-WORLD-COMPETING-SCOPE-vegetables:node:CAE-WORLD-COMPETING-SCOPE-vegetables:cause|profile:NONE|presentation:CAE-WORLD-COMPETING-SCOPE-vegetables:authored:vegetables-price-rise>CAE-WORLD-COMPETING-SCOPE-vegetables:node:CAE-WORLD-COMPETING-SCOPE-vegetables:cause>CAE-WORLD-COMPETING-SCOPE-vegetables:bridge>CAE-WORLD-COMPETING-SCOPE-vegetables:authored:vegetables-late-van`
**Difficulty evidence:** distance=1; hiddenLinks=1; topology=4; credibleDistractors=2; candidateBurden=7; inference=2; score=15
**Distractor mechanisms:** WEAK_CAUSE (CREDIBLE_ALTERNATIVE), INDIRECTNESS_CONFUSION (CREDIBLE_ALTERNATIVE), REVERSE_CAUSATION (CLEAR_REJECT)

### MEDIUM — seed 6

Observation: Traffic was diverted through nearby streets.

Which option is the most probable immediate cause of the observed event?

A. Travel time on the route increased.
B. A bridge was closed for urgent repairs.
C. An overturned vehicle blocked one lane on the bridge approach.
D. A minor collision slowed traffic in one service lane.

**Answer:** B. A bridge was closed for urgent repairs.

**Explanation:** A bridge was closed for urgent repairs → Traffic was diverted through nearby streets. This immediate link fits the observation's timing, scope, and magnitude.

**Family / variant:** CAE-FAM-OPERATIONS-CHAIN / bridge
**causalStateId:** `projection:CAE-PLAN-PROBABLE-CAUSE|family:CAE-FAM-OPERATIONS-CHAIN|variant:bridge|graph:DIRECT_CHAIN|direction:cause>bridge|visible:bridge`
**itemVariantId:** `projection:CAE-PLAN-PROBABLE-CAUSE|family:CAE-FAM-OPERATIONS-CHAIN|variant:bridge|graph:DIRECT_CHAIN|direction:cause>bridge|visible:bridge|distractors:CAE-WORLD-OPERATIONS-CHAIN-bridge:authored:bridge-approach-vehicle,CAE-WORLD-OPERATIONS-CHAIN-bridge:authored:bridge-service-lane-collision,CAE-WORLD-OPERATIONS-CHAIN-bridge:node:CAE-WORLD-OPERATIONS-CHAIN-bridge:effect|profile:NONE|presentation:CAE-WORLD-OPERATIONS-CHAIN-bridge:node:CAE-WORLD-OPERATIONS-CHAIN-bridge:effect>CAE-WORLD-OPERATIONS-CHAIN-bridge:cause>CAE-WORLD-OPERATIONS-CHAIN-bridge:authored:bridge-approach-vehicle>CAE-WORLD-OPERATIONS-CHAIN-bridge:authored:bridge-service-lane-collision`
**Difficulty evidence:** distance=1; hiddenLinks=1; topology=1; credibleDistractors=2; candidateBurden=7; inference=2; score=12
**Distractor mechanisms:** WEAK_CAUSE (CREDIBLE_ALTERNATIVE), MAGNITUDE_MISMATCH (CREDIBLE_ALTERNATIVE), REVERSE_CAUSATION (CLEAR_REJECT)

### MEDIUM — seed 7

Observation: Fresh vegetable deliveries fell sharply.

Which option is the most probable immediate cause of the observed event?

A. Shopkeepers raised prices after supplies had already fallen.
B. Supply vehicles were delayed.
C. One delivery van arrived late with a small load of vegetables.
D. A landslide blocked the main supply road.

**Answer:** B. Supply vehicles were delayed.

**Explanation:** Supply vehicles were delayed → Fresh vegetable deliveries fell sharply. This immediate link fits the observation's timing, scope, and magnitude.

**Family / variant:** CAE-FAM-COMPETING-SCOPE / vegetables
**causalStateId:** `projection:CAE-PLAN-PROBABLE-CAUSE|family:CAE-FAM-COMPETING-SCOPE|variant:vegetables|graph:COMPETING_CAUSES|direction:bridge>effect|visible:effect`
**itemVariantId:** `projection:CAE-PLAN-PROBABLE-CAUSE|family:CAE-FAM-COMPETING-SCOPE|variant:vegetables|graph:COMPETING_CAUSES|direction:bridge>effect|visible:effect|distractors:CAE-WORLD-COMPETING-SCOPE-vegetables:authored:vegetables-late-van,CAE-WORLD-COMPETING-SCOPE-vegetables:authored:vegetables-price-rise,CAE-WORLD-COMPETING-SCOPE-vegetables:node:CAE-WORLD-COMPETING-SCOPE-vegetables:cause|profile:NONE|presentation:CAE-WORLD-COMPETING-SCOPE-vegetables:authored:vegetables-price-rise>CAE-WORLD-COMPETING-SCOPE-vegetables:bridge>CAE-WORLD-COMPETING-SCOPE-vegetables:authored:vegetables-late-van>CAE-WORLD-COMPETING-SCOPE-vegetables:node:CAE-WORLD-COMPETING-SCOPE-vegetables:cause`
**Difficulty evidence:** distance=1; hiddenLinks=1; topology=4; credibleDistractors=2; candidateBurden=7; inference=2; score=15
**Distractor mechanisms:** INDIRECTNESS_CONFUSION (CREDIBLE_ALTERNATIVE), WEAK_CAUSE (CREDIBLE_ALTERNATIVE), REVERSE_CAUSATION (CLEAR_REJECT)

## CAE-CP-004 / CAE-QL-004

### MEDIUM — seed 0

Observation: Travel time on the route increased.

Which option is the most probable immediate effect of the event?

A. Traffic was diverted through nearby streets.
B. More commuters chose the metro.
C. Traffic built up at one side-street junction.
D. One bus reached a nearby stop a few minutes late.

**Answer:** B. More commuters chose the metro.

**Explanation:** Travel time on the route increased → More commuters chose the metro. This immediate link fits the observation's timing, scope, and magnitude.

**Family / variant:** CAE-FAM-OPERATIONS-CHAIN / bridge
**causalStateId:** `projection:CAE-PLAN-PROBABLE-EFFECT|family:CAE-FAM-OPERATIONS-CHAIN|variant:bridge|graph:DIRECT_CHAIN|direction:effect>terminal|visible:effect`
**itemVariantId:** `projection:CAE-PLAN-PROBABLE-EFFECT|family:CAE-FAM-OPERATIONS-CHAIN|variant:bridge|graph:DIRECT_CHAIN|direction:effect>terminal|visible:effect|distractors:CAE-WORLD-OPERATIONS-CHAIN-bridge:authored:bridge-side-street-queue,CAE-WORLD-OPERATIONS-CHAIN-bridge:authored:bridge-single-bus-delay,CAE-WORLD-OPERATIONS-CHAIN-bridge:node:CAE-WORLD-OPERATIONS-CHAIN-bridge:bridge|profile:NONE|presentation:CAE-WORLD-OPERATIONS-CHAIN-bridge:node:CAE-WORLD-OPERATIONS-CHAIN-bridge:bridge>CAE-WORLD-OPERATIONS-CHAIN-bridge:terminal>CAE-WORLD-OPERATIONS-CHAIN-bridge:authored:bridge-side-street-queue>CAE-WORLD-OPERATIONS-CHAIN-bridge:authored:bridge-single-bus-delay`
**Difficulty evidence:** distance=1; hiddenLinks=1; topology=1; credibleDistractors=2; candidateBurden=4; inference=1; score=10
**Distractor mechanisms:** WRONG_SCOPE (CREDIBLE_ALTERNATIVE), MAGNITUDE_MISMATCH (CREDIBLE_ALTERNATIVE), REVERSE_CAUSATION (CLEAR_REJECT)

### HARD — seed 31

Observation: Classes moved to the assembly area.

Which option is the most probable immediate effect of the event?

A. A teacher delayed one classroom activity.
B. One class missed a few minutes of a lesson.
C. Regular lessons paused.
D. A safety drill was announced.

**Answer:** C. Regular lessons paused.

**Explanation:** Classes moved to the assembly area → Regular lessons paused. This immediate link fits the observation's timing, scope, and magnitude.

**Family / variant:** CAE-FAM-CIVIC-SEQUENCE / drill
**causalStateId:** `projection:CAE-PLAN-PROBABLE-EFFECT|family:CAE-FAM-CIVIC-SEQUENCE|variant:drill|graph:HIDDEN_CHAIN|direction:bridge>effect|visible:bridge`
**itemVariantId:** `projection:CAE-PLAN-PROBABLE-EFFECT|family:CAE-FAM-CIVIC-SEQUENCE|variant:drill|graph:HIDDEN_CHAIN|direction:bridge>effect|visible:bridge|distractors:CAE-WORLD-CIVIC-SEQUENCE-drill:authored:drill-classroom-activity,CAE-WORLD-CIVIC-SEQUENCE-drill:authored:drill-one-class-delay,CAE-WORLD-CIVIC-SEQUENCE-drill:node:CAE-WORLD-CIVIC-SEQUENCE-drill:cause|profile:NONE|presentation:CAE-WORLD-CIVIC-SEQUENCE-drill:authored:drill-classroom-activity>CAE-WORLD-CIVIC-SEQUENCE-drill:authored:drill-one-class-delay>CAE-WORLD-CIVIC-SEQUENCE-drill:effect>CAE-WORLD-CIVIC-SEQUENCE-drill:node:CAE-WORLD-CIVIC-SEQUENCE-drill:cause`
**Difficulty evidence:** distance=1; hiddenLinks=1; topology=4; credibleDistractors=2; candidateBurden=14; inference=3; score=18
**Distractor mechanisms:** MAGNITUDE_MISMATCH (CREDIBLE_ALTERNATIVE), WRONG_SCOPE (CREDIBLE_ALTERNATIVE), REVERSE_CAUSATION (CLEAR_REJECT)

### MEDIUM — seed 1

Observation: The service server received an unusually high number of requests.

Which option is the most probable immediate effect of the event?

A. Applicants reached the counter for help.
B. The server response queue grew.
C. The help desk handled one additional call.
D. Online applications took longer to submit.

**Answer:** B. The server response queue grew.

**Explanation:** The service server received an unusually high number of requests → The server response queue grew. This immediate link fits the observation's timing, scope, and magnitude.

**Family / variant:** CAE-FAM-DIAGNOSTIC-DISRUPTION / server
**causalStateId:** `projection:CAE-PLAN-PROBABLE-EFFECT|family:CAE-FAM-DIAGNOSTIC-DISRUPTION|variant:server|graph:DIRECT_CHAIN|direction:cause>bridge|visible:cause`
**itemVariantId:** `projection:CAE-PLAN-PROBABLE-EFFECT|family:CAE-FAM-DIAGNOSTIC-DISRUPTION|variant:server|graph:DIRECT_CHAIN|direction:cause>bridge|visible:cause|distractors:CAE-WORLD-DIAGNOSTIC-DISRUPTION-server:authored:server-extra-call,CAE-WORLD-DIAGNOSTIC-DISRUPTION-server:node:CAE-WORLD-DIAGNOSTIC-DISRUPTION-server:effect,CAE-WORLD-DIAGNOSTIC-DISRUPTION-server:node:CAE-WORLD-DIAGNOSTIC-DISRUPTION-server:terminal|profile:NONE|presentation:CAE-WORLD-DIAGNOSTIC-DISRUPTION-server:node:CAE-WORLD-DIAGNOSTIC-DISRUPTION-server:terminal>CAE-WORLD-DIAGNOSTIC-DISRUPTION-server:bridge>CAE-WORLD-DIAGNOSTIC-DISRUPTION-server:authored:server-extra-call>CAE-WORLD-DIAGNOSTIC-DISRUPTION-server:node:CAE-WORLD-DIAGNOSTIC-DISRUPTION-server:effect`
**Difficulty evidence:** distance=1; hiddenLinks=1; topology=1; credibleDistractors=2; candidateBurden=6; inference=1; score=10
**Distractor mechanisms:** INDIRECTNESS_CONFUSION (CREDIBLE_ALTERNATIVE), INDIRECTNESS_CONFUSION (CREDIBLE_ALTERNATIVE), WRONG_SCOPE (CLEAR_REJECT)

### MEDIUM — seed 4

Observation: A prolonged heatwave affected the town.

Which option is the most probable immediate effect of the event?

A. One neighbourhood opened a shaded rest area.
B. A few residents bought extra cold drinks.
C. A local radio station gave its usual morning weather update.
D. Water consumption rose sharply.

**Answer:** D. Water consumption rose sharply.

**Explanation:** A prolonged heatwave affected the town → Water consumption rose sharply. This immediate link fits the observation's timing, scope, and magnitude.

**Family / variant:** CAE-FAM-SHARED-PRESSURE / heat
**causalStateId:** `projection:CAE-PLAN-PROBABLE-EFFECT|family:CAE-FAM-SHARED-PRESSURE|variant:heat|graph:BRANCHING_COMMON_CAUSE|direction:cause>first-effect|visible:cause`
**itemVariantId:** `projection:CAE-PLAN-PROBABLE-EFFECT|family:CAE-FAM-SHARED-PRESSURE|variant:heat|graph:BRANCHING_COMMON_CAUSE|direction:cause>first-effect|visible:cause|distractors:CAE-WORLD-SHARED-PRESSURE-heat:authored:heat-cold-drinks,CAE-WORLD-SHARED-PRESSURE-heat:authored:heat-radio-update,CAE-WORLD-SHARED-PRESSURE-heat:authored:heat-shaded-rest|profile:NONE|presentation:CAE-WORLD-SHARED-PRESSURE-heat:authored:heat-shaded-rest>CAE-WORLD-SHARED-PRESSURE-heat:authored:heat-cold-drinks>CAE-WORLD-SHARED-PRESSURE-heat:authored:heat-radio-update>CAE-WORLD-SHARED-PRESSURE-heat:first-effect`
**Difficulty evidence:** distance=1; hiddenLinks=1; topology=2; credibleDistractors=2; candidateBurden=2; inference=1; score=10
**Distractor mechanisms:** MAGNITUDE_MISMATCH (CREDIBLE_ALTERNATIVE), WRONG_SCOPE (CREDIBLE_ALTERNATIVE), REVERSE_CAUSATION (CLEAR_REJECT)

### MEDIUM — seed 9

Observation: Vehicles merged into the remaining lane.

Which option is the most probable immediate effect of the event?

A. A school crossing became busy for a short time.
B. One bus reached a stop a few minutes late.
C. Traffic queues formed.
D. Bus arrival times became less predictable.

**Answer:** C. Traffic queues formed.

**Explanation:** Vehicles merged into the remaining lane → Traffic queues formed. This immediate link fits the observation's timing, scope, and magnitude.

**Family / variant:** CAE-FAM-CIVIC-SEQUENCE / roadwork
**causalStateId:** `projection:CAE-PLAN-PROBABLE-EFFECT|family:CAE-FAM-CIVIC-SEQUENCE|variant:roadwork|graph:HIDDEN_CHAIN|direction:bridge>effect|visible:bridge`
**itemVariantId:** `projection:CAE-PLAN-PROBABLE-EFFECT|family:CAE-FAM-CIVIC-SEQUENCE|variant:roadwork|graph:HIDDEN_CHAIN|direction:bridge>effect|visible:bridge|distractors:CAE-WORLD-CIVIC-SEQUENCE-roadwork:authored:roadwork-crossing-busy,CAE-WORLD-CIVIC-SEQUENCE-roadwork:authored:roadwork-single-bus-late,CAE-WORLD-CIVIC-SEQUENCE-roadwork:node:CAE-WORLD-CIVIC-SEQUENCE-roadwork:terminal|profile:NONE|presentation:CAE-WORLD-CIVIC-SEQUENCE-roadwork:authored:roadwork-crossing-busy>CAE-WORLD-CIVIC-SEQUENCE-roadwork:authored:roadwork-single-bus-late>CAE-WORLD-CIVIC-SEQUENCE-roadwork:effect>CAE-WORLD-CIVIC-SEQUENCE-roadwork:node:CAE-WORLD-CIVIC-SEQUENCE-roadwork:terminal`
**Difficulty evidence:** distance=1; hiddenLinks=1; topology=4; credibleDistractors=3; candidateBurden=8; inference=2; score=16
**Distractor mechanisms:** MAGNITUDE_MISMATCH (CREDIBLE_ALTERNATIVE), INDIRECTNESS_CONFUSION (CREDIBLE_ALTERNATIVE), WRONG_SCOPE (CREDIBLE_ALTERNATIVE)

### MEDIUM — seed 2

Observation: Trains were instructed to move cautiously through that section.

Which option is the most probable immediate effect of the event?

A. Train movement slowed down.
B. Commuters reached later than usual.
C. Passengers at one platform waited a few extra minutes.
D. A signal fault was detected on one rail section.

**Answer:** A. Train movement slowed down.

**Explanation:** Trains were instructed to move cautiously through that section → Train movement slowed down. This immediate link fits the observation's timing, scope, and magnitude.

**Family / variant:** CAE-FAM-OPERATIONS-CHAIN / signal
**causalStateId:** `projection:CAE-PLAN-PROBABLE-EFFECT|family:CAE-FAM-OPERATIONS-CHAIN|variant:signal|graph:DIRECT_CHAIN|direction:bridge>effect|visible:bridge`
**itemVariantId:** `projection:CAE-PLAN-PROBABLE-EFFECT|family:CAE-FAM-OPERATIONS-CHAIN|variant:signal|graph:DIRECT_CHAIN|direction:bridge>effect|visible:bridge|distractors:CAE-WORLD-OPERATIONS-CHAIN-signal:authored:signal-platform-wait,CAE-WORLD-OPERATIONS-CHAIN-signal:node:CAE-WORLD-OPERATIONS-CHAIN-signal:cause,CAE-WORLD-OPERATIONS-CHAIN-signal:node:CAE-WORLD-OPERATIONS-CHAIN-signal:terminal|profile:NONE|presentation:CAE-WORLD-OPERATIONS-CHAIN-signal:effect>CAE-WORLD-OPERATIONS-CHAIN-signal:node:CAE-WORLD-OPERATIONS-CHAIN-signal:terminal>CAE-WORLD-OPERATIONS-CHAIN-signal:authored:signal-platform-wait>CAE-WORLD-OPERATIONS-CHAIN-signal:node:CAE-WORLD-OPERATIONS-CHAIN-signal:cause`
**Difficulty evidence:** distance=1; hiddenLinks=1; topology=1; credibleDistractors=2; candidateBurden=8; inference=2; score=12
**Distractor mechanisms:** MAGNITUDE_MISMATCH (CREDIBLE_ALTERNATIVE), INDIRECTNESS_CONFUSION (CREDIBLE_ALTERNATIVE), REVERSE_CAUSATION (CLEAR_REJECT)

### MEDIUM — seed 3

Observation: Continuous heavy rainfall occurred near the rail section.

Which option is the most probable immediate effect of the event?

A. One platform had a short boarding delay.
B. Several trains arrived late.
C. Water accumulated on the track section.
D. Trains moved slowly through the section.

**Answer:** C. Water accumulated on the track section.

**Explanation:** Continuous heavy rainfall occurred near the rail section → Water accumulated on the track section. This immediate link fits the observation's timing, scope, and magnitude.

**Family / variant:** CAE-FAM-DIAGNOSTIC-DISRUPTION / waterlogged-rail
**causalStateId:** `projection:CAE-PLAN-PROBABLE-EFFECT|family:CAE-FAM-DIAGNOSTIC-DISRUPTION|variant:waterlogged-rail|graph:DIRECT_CHAIN|direction:cause>bridge|visible:cause`
**itemVariantId:** `projection:CAE-PLAN-PROBABLE-EFFECT|family:CAE-FAM-DIAGNOSTIC-DISRUPTION|variant:waterlogged-rail|graph:DIRECT_CHAIN|direction:cause>bridge|visible:cause|distractors:CAE-WORLD-DIAGNOSTIC-DISRUPTION-waterlogged-rail:authored:waterlogged-rail-platform-delay,CAE-WORLD-DIAGNOSTIC-DISRUPTION-waterlogged-rail:node:CAE-WORLD-DIAGNOSTIC-DISRUPTION-waterlogged-rail:effect,CAE-WORLD-DIAGNOSTIC-DISRUPTION-waterlogged-rail:node:CAE-WORLD-DIAGNOSTIC-DISRUPTION-waterlogged-rail:terminal|profile:NONE|presentation:CAE-WORLD-DIAGNOSTIC-DISRUPTION-waterlogged-rail:authored:waterlogged-rail-platform-delay>CAE-WORLD-DIAGNOSTIC-DISRUPTION-waterlogged-rail:node:CAE-WORLD-DIAGNOSTIC-DISRUPTION-waterlogged-rail:terminal>CAE-WORLD-DIAGNOSTIC-DISRUPTION-waterlogged-rail:bridge>CAE-WORLD-DIAGNOSTIC-DISRUPTION-waterlogged-rail:node:CAE-WORLD-DIAGNOSTIC-DISRUPTION-waterlogged-rail:effect`
**Difficulty evidence:** distance=1; hiddenLinks=1; topology=1; credibleDistractors=2; candidateBurden=4; inference=1; score=10
**Distractor mechanisms:** INDIRECTNESS_CONFUSION (CREDIBLE_ALTERNATIVE), INDIRECTNESS_CONFUSION (CREDIBLE_ALTERNATIVE), MAGNITUDE_MISMATCH (CLEAR_REJECT)

### MEDIUM — seed 5

Observation: Continuous heavy rainfall occurred near the rail section.

Which option is the most probable immediate effect of the event?

A. Several trains arrived late.
B. A station advised passengers to use a different entrance.
C. Water accumulated on the track section.
D. Trains moved slowly through the section.

**Answer:** C. Water accumulated on the track section.

**Explanation:** Continuous heavy rainfall occurred near the rail section → Water accumulated on the track section. This immediate link fits the observation's timing, scope, and magnitude.

**Family / variant:** CAE-FAM-DIAGNOSTIC-DISRUPTION / waterlogged-rail
**causalStateId:** `projection:CAE-PLAN-PROBABLE-EFFECT|family:CAE-FAM-DIAGNOSTIC-DISRUPTION|variant:waterlogged-rail|graph:DIRECT_CHAIN|direction:cause>bridge|visible:cause`
**itemVariantId:** `projection:CAE-PLAN-PROBABLE-EFFECT|family:CAE-FAM-DIAGNOSTIC-DISRUPTION|variant:waterlogged-rail|graph:DIRECT_CHAIN|direction:cause>bridge|visible:cause|distractors:CAE-WORLD-DIAGNOSTIC-DISRUPTION-waterlogged-rail:authored:waterlogged-rail-entry-advice,CAE-WORLD-DIAGNOSTIC-DISRUPTION-waterlogged-rail:node:CAE-WORLD-DIAGNOSTIC-DISRUPTION-waterlogged-rail:effect,CAE-WORLD-DIAGNOSTIC-DISRUPTION-waterlogged-rail:node:CAE-WORLD-DIAGNOSTIC-DISRUPTION-waterlogged-rail:terminal|profile:NONE|presentation:CAE-WORLD-DIAGNOSTIC-DISRUPTION-waterlogged-rail:node:CAE-WORLD-DIAGNOSTIC-DISRUPTION-waterlogged-rail:terminal>CAE-WORLD-DIAGNOSTIC-DISRUPTION-waterlogged-rail:authored:waterlogged-rail-entry-advice>CAE-WORLD-DIAGNOSTIC-DISRUPTION-waterlogged-rail:bridge>CAE-WORLD-DIAGNOSTIC-DISRUPTION-waterlogged-rail:node:CAE-WORLD-DIAGNOSTIC-DISRUPTION-waterlogged-rail:effect`
**Difficulty evidence:** distance=1; hiddenLinks=1; topology=1; credibleDistractors=2; candidateBurden=4; inference=1; score=10
**Distractor mechanisms:** INDIRECTNESS_CONFUSION (CREDIBLE_ALTERNATIVE), INDIRECTNESS_CONFUSION (CREDIBLE_ALTERNATIVE), WRONG_SCOPE (CLEAR_REJECT)

### MEDIUM — seed 6

Observation: A prolonged heatwave affected the town.

Which option is the most probable immediate effect of the event?

A. One neighbourhood opened a shaded rest area.
B. Water consumption rose sharply.
C. A few residents bought extra cold drinks.
D. A local radio station gave its usual morning weather update.

**Answer:** B. Water consumption rose sharply.

**Explanation:** A prolonged heatwave affected the town → Water consumption rose sharply. This immediate link fits the observation's timing, scope, and magnitude.

**Family / variant:** CAE-FAM-SHARED-PRESSURE / heat
**causalStateId:** `projection:CAE-PLAN-PROBABLE-EFFECT|family:CAE-FAM-SHARED-PRESSURE|variant:heat|graph:BRANCHING_COMMON_CAUSE|direction:cause>first-effect|visible:cause`
**itemVariantId:** `projection:CAE-PLAN-PROBABLE-EFFECT|family:CAE-FAM-SHARED-PRESSURE|variant:heat|graph:BRANCHING_COMMON_CAUSE|direction:cause>first-effect|visible:cause|distractors:CAE-WORLD-SHARED-PRESSURE-heat:authored:heat-cold-drinks,CAE-WORLD-SHARED-PRESSURE-heat:authored:heat-radio-update,CAE-WORLD-SHARED-PRESSURE-heat:authored:heat-shaded-rest|profile:NONE|presentation:CAE-WORLD-SHARED-PRESSURE-heat:authored:heat-shaded-rest>CAE-WORLD-SHARED-PRESSURE-heat:first-effect>CAE-WORLD-SHARED-PRESSURE-heat:authored:heat-cold-drinks>CAE-WORLD-SHARED-PRESSURE-heat:authored:heat-radio-update`
**Difficulty evidence:** distance=1; hiddenLinks=1; topology=2; credibleDistractors=2; candidateBurden=2; inference=1; score=10
**Distractor mechanisms:** MAGNITUDE_MISMATCH (CREDIBLE_ALTERNATIVE), WRONG_SCOPE (CREDIBLE_ALTERNATIVE), REVERSE_CAUSATION (CLEAR_REJECT)

### MEDIUM — seed 7

Observation: A main pump stopped operating.

Which option is the most probable immediate effect of the event?

A. Pressure in the supply line fell.
B. Residents stored water earlier than usual.
C. Residents in one block stored water for the evening.
D. Water reached upper-floor homes slowly.

**Answer:** A. Pressure in the supply line fell.

**Explanation:** A main pump stopped operating → Pressure in the supply line fell. This immediate link fits the observation's timing, scope, and magnitude.

**Family / variant:** CAE-FAM-DIAGNOSTIC-DISRUPTION / pump
**causalStateId:** `projection:CAE-PLAN-PROBABLE-EFFECT|family:CAE-FAM-DIAGNOSTIC-DISRUPTION|variant:pump|graph:DIRECT_CHAIN|direction:cause>bridge|visible:cause`
**itemVariantId:** `projection:CAE-PLAN-PROBABLE-EFFECT|family:CAE-FAM-DIAGNOSTIC-DISRUPTION|variant:pump|graph:DIRECT_CHAIN|direction:cause>bridge|visible:cause|distractors:CAE-WORLD-DIAGNOSTIC-DISRUPTION-pump:authored:pump-household-storage,CAE-WORLD-DIAGNOSTIC-DISRUPTION-pump:node:CAE-WORLD-DIAGNOSTIC-DISRUPTION-pump:effect,CAE-WORLD-DIAGNOSTIC-DISRUPTION-pump:node:CAE-WORLD-DIAGNOSTIC-DISRUPTION-pump:terminal|profile:NONE|presentation:CAE-WORLD-DIAGNOSTIC-DISRUPTION-pump:bridge>CAE-WORLD-DIAGNOSTIC-DISRUPTION-pump:node:CAE-WORLD-DIAGNOSTIC-DISRUPTION-pump:terminal>CAE-WORLD-DIAGNOSTIC-DISRUPTION-pump:authored:pump-household-storage>CAE-WORLD-DIAGNOSTIC-DISRUPTION-pump:node:CAE-WORLD-DIAGNOSTIC-DISRUPTION-pump:effect`
**Difficulty evidence:** distance=1; hiddenLinks=1; topology=1; credibleDistractors=2; candidateBurden=5; inference=1; score=10
**Distractor mechanisms:** INDIRECTNESS_CONFUSION (CREDIBLE_ALTERNATIVE), INDIRECTNESS_CONFUSION (CREDIBLE_ALTERNATIVE), WRONG_SCOPE (CLEAR_REJECT)

## CAE-CP-005 / CAE-QL-005

### HARD — seed 0

Observation: Deliveries to the neighbourhood arrived late.

Which proposed event best explains the observation, considering timing, scope, and magnitude?

A. A delivery van stalled in a nearby lane.
B. Leaves blocked a small roadside drain for a few minutes.
C. Residents requested pumping after parcels began arriving late.
D. Heavy rain fell for several hours.

**Answer:** D. Heavy rain fell for several hours.

**Explanation:** Heavy rain fell for several hours → A storm drain became blocked → Water collected on the access road → Deliveries to the neighbourhood arrived late. This chain matches the observation's timing, scope, and magnitude.

**Family / variant:** CAE-FAM-HIDDEN-CHAIN / drainage
**causalStateId:** `projection:CAE-PLAN-COMPETING|family:CAE-FAM-HIDDEN-CHAIN|variant:drainage|graph:HIDDEN_CHAIN|direction:cause>bridge>effect>terminal|visible:terminal`
**itemVariantId:** `projection:CAE-PLAN-COMPETING|family:CAE-FAM-HIDDEN-CHAIN|variant:drainage|graph:HIDDEN_CHAIN|direction:cause>bridge>effect>terminal|visible:terminal|distractors:CAE-WORLD-HIDDEN-CHAIN-drainage:authored:drainage-leaves,CAE-WORLD-HIDDEN-CHAIN-drainage:authored:drainage-pumping-request,CAE-WORLD-HIDDEN-CHAIN-drainage:authored:drainage-stalled-van|profile:NONE|presentation:CAE-WORLD-HIDDEN-CHAIN-drainage:authored:drainage-stalled-van>CAE-WORLD-HIDDEN-CHAIN-drainage:authored:drainage-leaves>CAE-WORLD-HIDDEN-CHAIN-drainage:authored:drainage-pumping-request>CAE-WORLD-HIDDEN-CHAIN-drainage:cause`
**Difficulty evidence:** distance=3; hiddenLinks=3; topology=4; credibleDistractors=2; candidateBurden=4; inference=4; score=22
**Distractor mechanisms:** WRONG_SCOPE (CREDIBLE_ALTERNATIVE), WEAK_CAUSE (CREDIBLE_ALTERNATIVE), REVERSE_CAUSATION (CLEAR_REJECT)

### HARD — seed 1

Observation: Metro use from nearby stations increased.

Which proposed event best explains the observation, considering timing, scope, and magnitude?

A. A concert ended near a different metro station.
B. A bridge on the main route was closed.
C. Metro operators added coaches after ridership increased.
D. A traffic signal fault briefly slowed one junction.

**Answer:** B. A bridge on the main route was closed.

**Explanation:** A bridge on the main route was closed → Road traffic was diverted → The commute on that route became much longer → Metro use from nearby stations increased. This chain matches the observation's timing, scope, and magnitude.

**Family / variant:** CAE-FAM-COMPETING-SCOPE / metro
**causalStateId:** `projection:CAE-PLAN-COMPETING|family:CAE-FAM-COMPETING-SCOPE|variant:metro|graph:COMPETING_CAUSES|direction:cause>bridge>effect>terminal|visible:terminal`
**itemVariantId:** `projection:CAE-PLAN-COMPETING|family:CAE-FAM-COMPETING-SCOPE|variant:metro|graph:COMPETING_CAUSES|direction:cause>bridge>effect>terminal|visible:terminal|distractors:CAE-WORLD-COMPETING-SCOPE-metro:authored:metro-concert,CAE-WORLD-COMPETING-SCOPE-metro:authored:metro-extra-coaches,CAE-WORLD-COMPETING-SCOPE-metro:authored:metro-signal-fault|profile:NONE|presentation:CAE-WORLD-COMPETING-SCOPE-metro:authored:metro-concert>CAE-WORLD-COMPETING-SCOPE-metro:cause>CAE-WORLD-COMPETING-SCOPE-metro:authored:metro-extra-coaches>CAE-WORLD-COMPETING-SCOPE-metro:authored:metro-signal-fault`
**Difficulty evidence:** distance=3; hiddenLinks=3; topology=4; credibleDistractors=2; candidateBurden=5; inference=4; score=22
**Distractor mechanisms:** WEAK_CAUSE (CREDIBLE_ALTERNATIVE), WRONG_SCOPE (CREDIBLE_ALTERNATIVE), REVERSE_CAUSATION (CLEAR_REJECT)

### HARD — seed 2

Observation: Some certificates were issued late.

Which proposed event best explains the observation, considering timing, scope, and magnitude?

A. The office sent delay notices after certificates were issued late.
B. The office printer network failed.
C. A nearby office changed its visitor-register system.
D. One clerk paused briefly to verify a form.

**Answer:** B. The office printer network failed.

**Explanation:** The office printer network failed → Required forms could not be printed → Applications waited for verification → Some certificates were issued late. This chain matches the observation's timing, scope, and magnitude.

**Family / variant:** CAE-FAM-MISSING-BRIDGE / printer
**causalStateId:** `projection:CAE-PLAN-COMPETING|family:CAE-FAM-MISSING-BRIDGE|variant:printer|graph:HIDDEN_CHAIN|direction:cause>bridge>effect>terminal|visible:terminal`
**itemVariantId:** `projection:CAE-PLAN-COMPETING|family:CAE-FAM-MISSING-BRIDGE|variant:printer|graph:HIDDEN_CHAIN|direction:cause>bridge>effect>terminal|visible:terminal|distractors:CAE-WORLD-MISSING-BRIDGE-printer:authored:printer-delay-notice,CAE-WORLD-MISSING-BRIDGE-printer:authored:printer-form-check,CAE-WORLD-MISSING-BRIDGE-printer:authored:printer-visitor-register|profile:NONE|presentation:CAE-WORLD-MISSING-BRIDGE-printer:authored:printer-delay-notice>CAE-WORLD-MISSING-BRIDGE-printer:cause>CAE-WORLD-MISSING-BRIDGE-printer:authored:printer-visitor-register>CAE-WORLD-MISSING-BRIDGE-printer:authored:printer-form-check`
**Difficulty evidence:** distance=3; hiddenLinks=3; topology=4; credibleDistractors=2; candidateBurden=8; inference=4; score=23
**Distractor mechanisms:** WEAK_CAUSE (CREDIBLE_ALTERNATIVE), WRONG_SCOPE (CREDIBLE_ALTERNATIVE), REVERSE_CAUSATION (CLEAR_REJECT)

### HARD — seed 5

Observation: Applicants reached the counter for help.

Which proposed event best explains the observation, considering timing, scope, and magnitude?

A. The help desk opened extra counters after applicants began arriving.
B. A brief maintenance window slowed one online application form.
C. The service server received an unusually high number of requests.
D. A payment gateway failed for applicants in a different district.

**Answer:** C. The service server received an unusually high number of requests.

**Explanation:** The service server received an unusually high number of requests → The server response queue grew → Online applications took longer to submit → Applicants reached the counter for help. This chain matches the observation's timing, scope, and magnitude.

**Family / variant:** CAE-FAM-DIAGNOSTIC-DISRUPTION / server
**causalStateId:** `projection:CAE-PLAN-COMPETING|family:CAE-FAM-DIAGNOSTIC-DISRUPTION|variant:server|graph:DIRECT_CHAIN|direction:cause>bridge>effect>terminal|visible:terminal`
**itemVariantId:** `projection:CAE-PLAN-COMPETING|family:CAE-FAM-DIAGNOSTIC-DISRUPTION|variant:server|graph:DIRECT_CHAIN|direction:cause>bridge>effect>terminal|visible:terminal|distractors:CAE-WORLD-DIAGNOSTIC-DISRUPTION-server:authored:server-extra-counters,CAE-WORLD-DIAGNOSTIC-DISRUPTION-server:authored:server-maintenance-window,CAE-WORLD-DIAGNOSTIC-DISRUPTION-server:authored:server-payment-gateway|profile:NONE|presentation:CAE-WORLD-DIAGNOSTIC-DISRUPTION-server:authored:server-extra-counters>CAE-WORLD-DIAGNOSTIC-DISRUPTION-server:authored:server-maintenance-window>CAE-WORLD-DIAGNOSTIC-DISRUPTION-server:cause>CAE-WORLD-DIAGNOSTIC-DISRUPTION-server:authored:server-payment-gateway`
**Difficulty evidence:** distance=3; hiddenLinks=3; topology=1; credibleDistractors=2; candidateBurden=6; inference=4; score=19
**Distractor mechanisms:** WEAK_CAUSE (CREDIBLE_ALTERNATIVE), WRONG_SCOPE (CREDIBLE_ALTERNATIVE), REVERSE_CAUSATION (CLEAR_REJECT)

### HARD — seed 3

Observation: Vegetable prices in the town increased.

Which proposed event best explains the observation, considering timing, scope, and magnitude?

A. Shopkeepers raised prices after supplies had already fallen.
B. A landslide blocked the main supply road.
C. A local market closed one vegetable stall for cleaning.
D. One delivery van arrived late with a small load of vegetables.

**Answer:** B. A landslide blocked the main supply road.

**Explanation:** A landslide blocked the main supply road → Supply vehicles were delayed → Fresh vegetable deliveries fell sharply → Vegetable prices in the town increased. This chain matches the observation's timing, scope, and magnitude.

**Family / variant:** CAE-FAM-COMPETING-SCOPE / vegetables
**causalStateId:** `projection:CAE-PLAN-COMPETING|family:CAE-FAM-COMPETING-SCOPE|variant:vegetables|graph:COMPETING_CAUSES|direction:cause>bridge>effect>terminal|visible:terminal`
**itemVariantId:** `projection:CAE-PLAN-COMPETING|family:CAE-FAM-COMPETING-SCOPE|variant:vegetables|graph:COMPETING_CAUSES|direction:cause>bridge>effect>terminal|visible:terminal|distractors:CAE-WORLD-COMPETING-SCOPE-vegetables:authored:vegetables-late-van,CAE-WORLD-COMPETING-SCOPE-vegetables:authored:vegetables-price-rise,CAE-WORLD-COMPETING-SCOPE-vegetables:authored:vegetables-stall-cleaning|profile:NONE|presentation:CAE-WORLD-COMPETING-SCOPE-vegetables:authored:vegetables-price-rise>CAE-WORLD-COMPETING-SCOPE-vegetables:cause>CAE-WORLD-COMPETING-SCOPE-vegetables:authored:vegetables-stall-cleaning>CAE-WORLD-COMPETING-SCOPE-vegetables:authored:vegetables-late-van`
**Difficulty evidence:** distance=3; hiddenLinks=3; topology=4; credibleDistractors=2; candidateBurden=2; inference=4; score=21
**Distractor mechanisms:** WRONG_SCOPE (CREDIBLE_ALTERNATIVE), WEAK_CAUSE (CREDIBLE_ALTERNATIVE), REVERSE_CAUSATION (CLEAR_REJECT)

### HARD — seed 4

Observation: Metro use from nearby stations increased.

Which proposed event best explains the observation, considering timing, scope, and magnitude?

A. A bridge on the main route was closed.
B. A concert ended near a different metro station.
C. A traffic signal fault briefly slowed one junction.
D. Metro operators added coaches after ridership increased.

**Answer:** A. A bridge on the main route was closed.

**Explanation:** A bridge on the main route was closed → Road traffic was diverted → The commute on that route became much longer → Metro use from nearby stations increased. This chain matches the observation's timing, scope, and magnitude.

**Family / variant:** CAE-FAM-COMPETING-SCOPE / metro
**causalStateId:** `projection:CAE-PLAN-COMPETING|family:CAE-FAM-COMPETING-SCOPE|variant:metro|graph:COMPETING_CAUSES|direction:cause>bridge>effect>terminal|visible:terminal`
**itemVariantId:** `projection:CAE-PLAN-COMPETING|family:CAE-FAM-COMPETING-SCOPE|variant:metro|graph:COMPETING_CAUSES|direction:cause>bridge>effect>terminal|visible:terminal|distractors:CAE-WORLD-COMPETING-SCOPE-metro:authored:metro-concert,CAE-WORLD-COMPETING-SCOPE-metro:authored:metro-extra-coaches,CAE-WORLD-COMPETING-SCOPE-metro:authored:metro-signal-fault|profile:NONE|presentation:CAE-WORLD-COMPETING-SCOPE-metro:cause>CAE-WORLD-COMPETING-SCOPE-metro:authored:metro-concert>CAE-WORLD-COMPETING-SCOPE-metro:authored:metro-signal-fault>CAE-WORLD-COMPETING-SCOPE-metro:authored:metro-extra-coaches`
**Difficulty evidence:** distance=3; hiddenLinks=3; topology=4; credibleDistractors=2; candidateBurden=5; inference=4; score=22
**Distractor mechanisms:** WRONG_SCOPE (CREDIBLE_ALTERNATIVE), WEAK_CAUSE (CREDIBLE_ALTERNATIVE), REVERSE_CAUSATION (CLEAR_REJECT)

### HARD — seed 6

Observation: Applicants reached the counter for help.

Which proposed event best explains the observation, considering timing, scope, and magnitude?

A. A brief maintenance window slowed one online application form.
B. The service server received an unusually high number of requests.
C. The help desk opened extra counters after applicants began arriving.
D. A payment gateway failed for applicants in a different district.

**Answer:** B. The service server received an unusually high number of requests.

**Explanation:** The service server received an unusually high number of requests → The server response queue grew → Online applications took longer to submit → Applicants reached the counter for help. This chain matches the observation's timing, scope, and magnitude.

**Family / variant:** CAE-FAM-DIAGNOSTIC-DISRUPTION / server
**causalStateId:** `projection:CAE-PLAN-COMPETING|family:CAE-FAM-DIAGNOSTIC-DISRUPTION|variant:server|graph:DIRECT_CHAIN|direction:cause>bridge>effect>terminal|visible:terminal`
**itemVariantId:** `projection:CAE-PLAN-COMPETING|family:CAE-FAM-DIAGNOSTIC-DISRUPTION|variant:server|graph:DIRECT_CHAIN|direction:cause>bridge>effect>terminal|visible:terminal|distractors:CAE-WORLD-DIAGNOSTIC-DISRUPTION-server:authored:server-extra-counters,CAE-WORLD-DIAGNOSTIC-DISRUPTION-server:authored:server-maintenance-window,CAE-WORLD-DIAGNOSTIC-DISRUPTION-server:authored:server-payment-gateway|profile:NONE|presentation:CAE-WORLD-DIAGNOSTIC-DISRUPTION-server:authored:server-maintenance-window>CAE-WORLD-DIAGNOSTIC-DISRUPTION-server:cause>CAE-WORLD-DIAGNOSTIC-DISRUPTION-server:authored:server-extra-counters>CAE-WORLD-DIAGNOSTIC-DISRUPTION-server:authored:server-payment-gateway`
**Difficulty evidence:** distance=3; hiddenLinks=3; topology=1; credibleDistractors=2; candidateBurden=6; inference=4; score=19
**Distractor mechanisms:** WEAK_CAUSE (CREDIBLE_ALTERNATIVE), WRONG_SCOPE (CREDIBLE_ALTERNATIVE), REVERSE_CAUSATION (CLEAR_REJECT)

### HARD — seed 7

Observation: Supply vehicles were delayed.

Which proposed event best explains the observation, considering timing, scope, and magnitude?

A. A tractor broke down on a village approach road.
B. Loose stones briefly blocked one lane of the hill road.
C. Heavy rainfall continued in the hills.
D. The road authority announced a diversion after deliveries had already slowed.

**Answer:** C. Heavy rainfall continued in the hills.

**Explanation:** Heavy rainfall continued in the hills → A landslide occurred along the highway → The highway was blocked → Supply vehicles were delayed. This chain matches the observation's timing, scope, and magnitude.

**Family / variant:** CAE-FAM-HIDDEN-CHAIN / landslide
**causalStateId:** `projection:CAE-PLAN-COMPETING|family:CAE-FAM-HIDDEN-CHAIN|variant:landslide|graph:HIDDEN_CHAIN|direction:cause>bridge>effect>terminal|visible:terminal`
**itemVariantId:** `projection:CAE-PLAN-COMPETING|family:CAE-FAM-HIDDEN-CHAIN|variant:landslide|graph:HIDDEN_CHAIN|direction:cause>bridge>effect>terminal|visible:terminal|distractors:CAE-WORLD-HIDDEN-CHAIN-landslide:authored:landslide-diversion-notice,CAE-WORLD-HIDDEN-CHAIN-landslide:authored:landslide-loose-stones,CAE-WORLD-HIDDEN-CHAIN-landslide:authored:landslide-tractor|profile:NONE|presentation:CAE-WORLD-HIDDEN-CHAIN-landslide:authored:landslide-tractor>CAE-WORLD-HIDDEN-CHAIN-landslide:authored:landslide-loose-stones>CAE-WORLD-HIDDEN-CHAIN-landslide:cause>CAE-WORLD-HIDDEN-CHAIN-landslide:authored:landslide-diversion-notice`
**Difficulty evidence:** distance=3; hiddenLinks=3; topology=4; credibleDistractors=2; candidateBurden=5; inference=4; score=22
**Distractor mechanisms:** WRONG_SCOPE (CREDIBLE_ALTERNATIVE), WEAK_CAUSE (CREDIBLE_ALTERNATIVE), REVERSE_CAUSATION (CLEAR_REJECT)

### HARD — seed 8

Observation: The shop received stock later than planned.

Which proposed event best explains the observation, considering timing, scope, and magnitude?

A. A warehouse loading system stopped working.
B. The warehouse sent an apology after stock reached the shop late.
C. A local shop rearranged shelves during opening hours.
D. One loader paused briefly to check a pallet.

**Answer:** A. A warehouse loading system stopped working.

**Explanation:** A warehouse loading system stopped working → Packages waited at the loading bay → Delivery vehicles left late → The shop received stock later than planned. This chain matches the observation's timing, scope, and magnitude.

**Family / variant:** CAE-FAM-MISSING-BRIDGE / supply
**causalStateId:** `projection:CAE-PLAN-COMPETING|family:CAE-FAM-MISSING-BRIDGE|variant:supply|graph:HIDDEN_CHAIN|direction:cause>bridge>effect>terminal|visible:terminal`
**itemVariantId:** `projection:CAE-PLAN-COMPETING|family:CAE-FAM-MISSING-BRIDGE|variant:supply|graph:HIDDEN_CHAIN|direction:cause>bridge>effect>terminal|visible:terminal|distractors:CAE-WORLD-MISSING-BRIDGE-supply:authored:supply-apology,CAE-WORLD-MISSING-BRIDGE-supply:authored:supply-pallet-check,CAE-WORLD-MISSING-BRIDGE-supply:authored:supply-shelf-rearrangement|profile:NONE|presentation:CAE-WORLD-MISSING-BRIDGE-supply:cause>CAE-WORLD-MISSING-BRIDGE-supply:authored:supply-apology>CAE-WORLD-MISSING-BRIDGE-supply:authored:supply-shelf-rearrangement>CAE-WORLD-MISSING-BRIDGE-supply:authored:supply-pallet-check`
**Difficulty evidence:** distance=3; hiddenLinks=3; topology=4; credibleDistractors=2; candidateBurden=5; inference=4; score=22
**Distractor mechanisms:** WRONG_SCOPE (CREDIBLE_ALTERNATIVE), WEAK_CAUSE (CREDIBLE_ALTERNATIVE), REVERSE_CAUSATION (CLEAR_REJECT)

### HARD — seed 9

Observation: Metro use from nearby stations increased.

Which proposed event best explains the observation, considering timing, scope, and magnitude?

A. A bridge on the main route was closed.
B. Metro operators added coaches after ridership increased.
C. A traffic signal fault briefly slowed one junction.
D. A concert ended near a different metro station.

**Answer:** A. A bridge on the main route was closed.

**Explanation:** A bridge on the main route was closed → Road traffic was diverted → The commute on that route became much longer → Metro use from nearby stations increased. This chain matches the observation's timing, scope, and magnitude.

**Family / variant:** CAE-FAM-COMPETING-SCOPE / metro
**causalStateId:** `projection:CAE-PLAN-COMPETING|family:CAE-FAM-COMPETING-SCOPE|variant:metro|graph:COMPETING_CAUSES|direction:cause>bridge>effect>terminal|visible:terminal`
**itemVariantId:** `projection:CAE-PLAN-COMPETING|family:CAE-FAM-COMPETING-SCOPE|variant:metro|graph:COMPETING_CAUSES|direction:cause>bridge>effect>terminal|visible:terminal|distractors:CAE-WORLD-COMPETING-SCOPE-metro:authored:metro-concert,CAE-WORLD-COMPETING-SCOPE-metro:authored:metro-extra-coaches,CAE-WORLD-COMPETING-SCOPE-metro:authored:metro-signal-fault|profile:NONE|presentation:CAE-WORLD-COMPETING-SCOPE-metro:cause>CAE-WORLD-COMPETING-SCOPE-metro:authored:metro-extra-coaches>CAE-WORLD-COMPETING-SCOPE-metro:authored:metro-signal-fault>CAE-WORLD-COMPETING-SCOPE-metro:authored:metro-concert`
**Difficulty evidence:** distance=3; hiddenLinks=3; topology=4; credibleDistractors=2; candidateBurden=5; inference=4; score=22
**Distractor mechanisms:** WRONG_SCOPE (CREDIBLE_ALTERNATIVE), WEAK_CAUSE (CREDIBLE_ALTERNATIVE), REVERSE_CAUSATION (CLEAR_REJECT)

## CAE-CP-006 / CAE-QL-006

### MEDIUM — seed 0

Which relationship between the two events is best supported?

Statement I: Dense fog formed around the airport.

Statement II: Passengers were moved to later flights.

A. No causal relationship is established between the statements.
B. Statement II is an indirect cause of Statement I.
C. Statements I and II are effects of a common cause.
D. Statement I is an indirect cause of Statement II.

**Answer:** D. Statement I is an indirect cause of Statement II.

**Explanation:** Dense fog formed around the airport → Visibility on the runway fell sharply → Several departures were delayed → Passengers were moved to later flights. The hidden event or events make the first statement an indirect cause of the second.

**Family / variant:** CAE-FAM-OPERATIONS-CHAIN / fog
**causalStateId:** `projection:CAE-PLAN-INDIRECT|family:CAE-FAM-OPERATIONS-CHAIN|variant:fog|graph:DIRECT_CHAIN|direction:cause>bridge>effect>terminal|visible:cause,terminal`
**itemVariantId:** `projection:CAE-PLAN-INDIRECT|family:CAE-FAM-OPERATIONS-CHAIN|variant:fog|graph:DIRECT_CHAIN|direction:cause>bridge>effect>terminal|visible:cause,terminal|distractors:COMMON_CAUSE,INDIRECT_SECOND_CAUSES_FIRST,NO_CAUSAL_LINK|profile:NONE|presentation:NO_CAUSAL_LINK>INDIRECT_SECOND_CAUSES_FIRST>COMMON_CAUSE>INDIRECT_FIRST_CAUSES_SECOND`
**Difficulty evidence:** distance=3; hiddenLinks=2; topology=1; credibleDistractors=0; candidateBurden=0; inference=3; score=13
**Distractor mechanisms:** INDIRECTNESS_CONFUSION, REVERSE_CAUSATION, COMMON_CAUSE_CONFUSION

### MEDIUM — seed 1

Which relationship between the two events is best supported?

Statement I: A warehouse loading system stopped working.

Statement II: The shop received stock later than planned.

A. Statement I is an indirect cause of Statement II.
B. Statements I and II are effects of a common cause.
C. No causal relationship is established between the statements.
D. Statement II is an indirect cause of Statement I.

**Answer:** A. Statement I is an indirect cause of Statement II.

**Explanation:** A warehouse loading system stopped working → Packages waited at the loading bay → Delivery vehicles left late → The shop received stock later than planned. The hidden event or events make the first statement an indirect cause of the second.

**Family / variant:** CAE-FAM-MISSING-BRIDGE / supply
**causalStateId:** `projection:CAE-PLAN-INDIRECT|family:CAE-FAM-MISSING-BRIDGE|variant:supply|graph:HIDDEN_CHAIN|direction:cause>bridge>effect>terminal|visible:cause,terminal`
**itemVariantId:** `projection:CAE-PLAN-INDIRECT|family:CAE-FAM-MISSING-BRIDGE|variant:supply|graph:HIDDEN_CHAIN|direction:cause>bridge>effect>terminal|visible:cause,terminal|distractors:COMMON_CAUSE,INDIRECT_SECOND_CAUSES_FIRST,NO_CAUSAL_LINK|profile:NONE|presentation:INDIRECT_FIRST_CAUSES_SECOND>COMMON_CAUSE>NO_CAUSAL_LINK>INDIRECT_SECOND_CAUSES_FIRST`
**Difficulty evidence:** distance=3; hiddenLinks=2; topology=4; credibleDistractors=0; candidateBurden=0; inference=3; score=16
**Distractor mechanisms:** COMMON_CAUSE_CONFUSION, INDIRECTNESS_CONFUSION, REVERSE_CAUSATION

### MEDIUM — seed 3

Which relationship between the two events is best supported?

Statement I: A safety drill was announced.

Statement II: The school timetable shifted for the day.

A. Statement I is an indirect cause of Statement II.
B. Statements I and II are effects of a common cause.
C. No causal relationship is established between the statements.
D. Statement II is an indirect cause of Statement I.

**Answer:** A. Statement I is an indirect cause of Statement II.

**Explanation:** A safety drill was announced → Classes moved to the assembly area → Regular lessons paused → The school timetable shifted for the day. The hidden event or events make the first statement an indirect cause of the second.

**Family / variant:** CAE-FAM-CIVIC-SEQUENCE / drill
**causalStateId:** `projection:CAE-PLAN-INDIRECT|family:CAE-FAM-CIVIC-SEQUENCE|variant:drill|graph:HIDDEN_CHAIN|direction:cause>bridge>effect>terminal|visible:cause,terminal`
**itemVariantId:** `projection:CAE-PLAN-INDIRECT|family:CAE-FAM-CIVIC-SEQUENCE|variant:drill|graph:HIDDEN_CHAIN|direction:cause>bridge>effect>terminal|visible:cause,terminal|distractors:COMMON_CAUSE,INDIRECT_SECOND_CAUSES_FIRST,NO_CAUSAL_LINK|profile:NONE|presentation:INDIRECT_FIRST_CAUSES_SECOND>COMMON_CAUSE>NO_CAUSAL_LINK>INDIRECT_SECOND_CAUSES_FIRST`
**Difficulty evidence:** distance=3; hiddenLinks=2; topology=4; credibleDistractors=0; candidateBurden=0; inference=3; score=16
**Distractor mechanisms:** COMMON_CAUSE_CONFUSION, INDIRECTNESS_CONFUSION, REVERSE_CAUSATION

### MEDIUM — seed 12

Which relationship between the two events is best supported?

Statement I: The power supply to a cold-storage unit failed.

Statement II: Dispatch vehicles left later than scheduled.

A. Statement II is an indirect cause of Statement I.
B. Statements I and II are effects of a common cause.
C. Statement I is an indirect cause of Statement II.
D. No causal relationship is established between the statements.

**Answer:** C. Statement I is an indirect cause of Statement II.

**Explanation:** The power supply to a cold-storage unit failed → The backup generator took time to start → Loading of perishable goods paused → Dispatch vehicles left later than scheduled. The hidden event or events make the first statement an indirect cause of the second.

**Family / variant:** CAE-FAM-HIDDEN-CHAIN / cold-storage
**causalStateId:** `projection:CAE-PLAN-INDIRECT|family:CAE-FAM-HIDDEN-CHAIN|variant:cold-storage|graph:HIDDEN_CHAIN|direction:cause>bridge>effect>terminal|visible:cause,terminal`
**itemVariantId:** `projection:CAE-PLAN-INDIRECT|family:CAE-FAM-HIDDEN-CHAIN|variant:cold-storage|graph:HIDDEN_CHAIN|direction:cause>bridge>effect>terminal|visible:cause,terminal|distractors:COMMON_CAUSE,INDIRECT_SECOND_CAUSES_FIRST,NO_CAUSAL_LINK|profile:NONE|presentation:INDIRECT_SECOND_CAUSES_FIRST>COMMON_CAUSE>INDIRECT_FIRST_CAUSES_SECOND>NO_CAUSAL_LINK`
**Difficulty evidence:** distance=3; hiddenLinks=2; topology=4; credibleDistractors=0; candidateBurden=0; inference=3; score=16
**Distractor mechanisms:** REVERSE_CAUSATION, COMMON_CAUSE_CONFUSION, INDIRECTNESS_CONFUSION

### MEDIUM — seed 2

Which relationship between the two events is best supported?

Statement I: A warehouse loading system stopped working.

Statement II: The shop received stock later than planned.

A. No causal relationship is established between the statements.
B. Statement II is an indirect cause of Statement I.
C. Statements I and II are effects of a common cause.
D. Statement I is an indirect cause of Statement II.

**Answer:** D. Statement I is an indirect cause of Statement II.

**Explanation:** A warehouse loading system stopped working → Packages waited at the loading bay → Delivery vehicles left late → The shop received stock later than planned. The hidden event or events make the first statement an indirect cause of the second.

**Family / variant:** CAE-FAM-MISSING-BRIDGE / supply
**causalStateId:** `projection:CAE-PLAN-INDIRECT|family:CAE-FAM-MISSING-BRIDGE|variant:supply|graph:HIDDEN_CHAIN|direction:cause>bridge>effect>terminal|visible:cause,terminal`
**itemVariantId:** `projection:CAE-PLAN-INDIRECT|family:CAE-FAM-MISSING-BRIDGE|variant:supply|graph:HIDDEN_CHAIN|direction:cause>bridge>effect>terminal|visible:cause,terminal|distractors:COMMON_CAUSE,INDIRECT_SECOND_CAUSES_FIRST,NO_CAUSAL_LINK|profile:NONE|presentation:NO_CAUSAL_LINK>INDIRECT_SECOND_CAUSES_FIRST>COMMON_CAUSE>INDIRECT_FIRST_CAUSES_SECOND`
**Difficulty evidence:** distance=3; hiddenLinks=2; topology=4; credibleDistractors=0; candidateBurden=0; inference=3; score=16
**Distractor mechanisms:** INDIRECTNESS_CONFUSION, REVERSE_CAUSATION, COMMON_CAUSE_CONFUSION

### MEDIUM — seed 4

Which relationship between the two events is best supported?

Statement I: A signal fault was detected on one rail section.

Statement II: Commuters reached later than usual.

A. Statement I is an indirect cause of Statement II.
B. Statements I and II are effects of a common cause.
C. Statement II is an indirect cause of Statement I.
D. No causal relationship is established between the statements.

**Answer:** A. Statement I is an indirect cause of Statement II.

**Explanation:** A signal fault was detected on one rail section → Trains were instructed to move cautiously through that section → Train movement slowed down → Commuters reached later than usual. The hidden event or events make the first statement an indirect cause of the second.

**Family / variant:** CAE-FAM-OPERATIONS-CHAIN / signal
**causalStateId:** `projection:CAE-PLAN-INDIRECT|family:CAE-FAM-OPERATIONS-CHAIN|variant:signal|graph:DIRECT_CHAIN|direction:cause>bridge>effect>terminal|visible:cause,terminal`
**itemVariantId:** `projection:CAE-PLAN-INDIRECT|family:CAE-FAM-OPERATIONS-CHAIN|variant:signal|graph:DIRECT_CHAIN|direction:cause>bridge>effect>terminal|visible:cause,terminal|distractors:COMMON_CAUSE,INDIRECT_SECOND_CAUSES_FIRST,NO_CAUSAL_LINK|profile:NONE|presentation:INDIRECT_FIRST_CAUSES_SECOND>COMMON_CAUSE>INDIRECT_SECOND_CAUSES_FIRST>NO_CAUSAL_LINK`
**Difficulty evidence:** distance=3; hiddenLinks=2; topology=1; credibleDistractors=0; candidateBurden=0; inference=3; score=13
**Distractor mechanisms:** COMMON_CAUSE_CONFUSION, REVERSE_CAUSATION, INDIRECTNESS_CONFUSION

### MEDIUM — seed 5

Which relationship between the two events is best supported?

Statement I: Strong wind affected the ferry crossing.

Statement II: Goods reached the market late.

A. Statement II is an indirect cause of Statement I.
B. No causal relationship is established between the statements.
C. Statement I is an indirect cause of Statement II.
D. Statements I and II are effects of a common cause.

**Answer:** C. Statement I is an indirect cause of Statement II.

**Explanation:** Strong wind affected the ferry crossing → Ferry departures were paused → Vehicles waited at the crossing → Goods reached the market late. The hidden event or events make the first statement an indirect cause of the second.

**Family / variant:** CAE-FAM-MISSING-BRIDGE / ferry
**causalStateId:** `projection:CAE-PLAN-INDIRECT|family:CAE-FAM-MISSING-BRIDGE|variant:ferry|graph:HIDDEN_CHAIN|direction:cause>bridge>effect>terminal|visible:cause,terminal`
**itemVariantId:** `projection:CAE-PLAN-INDIRECT|family:CAE-FAM-MISSING-BRIDGE|variant:ferry|graph:HIDDEN_CHAIN|direction:cause>bridge>effect>terminal|visible:cause,terminal|distractors:COMMON_CAUSE,INDIRECT_SECOND_CAUSES_FIRST,NO_CAUSAL_LINK|profile:NONE|presentation:INDIRECT_SECOND_CAUSES_FIRST>NO_CAUSAL_LINK>INDIRECT_FIRST_CAUSES_SECOND>COMMON_CAUSE`
**Difficulty evidence:** distance=3; hiddenLinks=2; topology=4; credibleDistractors=0; candidateBurden=0; inference=3; score=16
**Distractor mechanisms:** REVERSE_CAUSATION, INDIRECTNESS_CONFUSION, COMMON_CAUSE_CONFUSION

### MEDIUM — seed 7

Which relationship between the two events is best supported?

Statement I: The office printer network failed.

Statement II: Some certificates were issued late.

A. Statements I and II are effects of a common cause.
B. No causal relationship is established between the statements.
C. Statement I is an indirect cause of Statement II.
D. Statement II is an indirect cause of Statement I.

**Answer:** C. Statement I is an indirect cause of Statement II.

**Explanation:** The office printer network failed → Required forms could not be printed → Applications waited for verification → Some certificates were issued late. The hidden event or events make the first statement an indirect cause of the second.

**Family / variant:** CAE-FAM-MISSING-BRIDGE / printer
**causalStateId:** `projection:CAE-PLAN-INDIRECT|family:CAE-FAM-MISSING-BRIDGE|variant:printer|graph:HIDDEN_CHAIN|direction:cause>bridge>effect>terminal|visible:cause,terminal`
**itemVariantId:** `projection:CAE-PLAN-INDIRECT|family:CAE-FAM-MISSING-BRIDGE|variant:printer|graph:HIDDEN_CHAIN|direction:cause>bridge>effect>terminal|visible:cause,terminal|distractors:COMMON_CAUSE,INDIRECT_SECOND_CAUSES_FIRST,NO_CAUSAL_LINK|profile:NONE|presentation:COMMON_CAUSE>NO_CAUSAL_LINK>INDIRECT_FIRST_CAUSES_SECOND>INDIRECT_SECOND_CAUSES_FIRST`
**Difficulty evidence:** distance=3; hiddenLinks=2; topology=4; credibleDistractors=0; candidateBurden=0; inference=3; score=16
**Distractor mechanisms:** COMMON_CAUSE_CONFUSION, INDIRECTNESS_CONFUSION, REVERSE_CAUSATION

### MEDIUM — seed 8

Which relationship between the two events is best supported?

Statement I: A signal fault was detected on one rail section.

Statement II: Commuters reached later than usual.

A. Statement I is an indirect cause of Statement II.
B. No causal relationship is established between the statements.
C. Statement II is an indirect cause of Statement I.
D. Statements I and II are effects of a common cause.

**Answer:** A. Statement I is an indirect cause of Statement II.

**Explanation:** A signal fault was detected on one rail section → Trains were instructed to move cautiously through that section → Train movement slowed down → Commuters reached later than usual. The hidden event or events make the first statement an indirect cause of the second.

**Family / variant:** CAE-FAM-OPERATIONS-CHAIN / signal
**causalStateId:** `projection:CAE-PLAN-INDIRECT|family:CAE-FAM-OPERATIONS-CHAIN|variant:signal|graph:DIRECT_CHAIN|direction:cause>bridge>effect>terminal|visible:cause,terminal`
**itemVariantId:** `projection:CAE-PLAN-INDIRECT|family:CAE-FAM-OPERATIONS-CHAIN|variant:signal|graph:DIRECT_CHAIN|direction:cause>bridge>effect>terminal|visible:cause,terminal|distractors:COMMON_CAUSE,INDIRECT_SECOND_CAUSES_FIRST,NO_CAUSAL_LINK|profile:NONE|presentation:INDIRECT_FIRST_CAUSES_SECOND>NO_CAUSAL_LINK>INDIRECT_SECOND_CAUSES_FIRST>COMMON_CAUSE`
**Difficulty evidence:** distance=3; hiddenLinks=2; topology=1; credibleDistractors=0; candidateBurden=0; inference=3; score=13
**Distractor mechanisms:** INDIRECTNESS_CONFUSION, REVERSE_CAUSATION, COMMON_CAUSE_CONFUSION

### MEDIUM — seed 9

Which relationship between the two events is best supported?

Statement I: Dense fog formed around the airport.

Statement II: Passengers were moved to later flights.

A. Statement I is an indirect cause of Statement II.
B. Statement II is an indirect cause of Statement I.
C. No causal relationship is established between the statements.
D. Statements I and II are effects of a common cause.

**Answer:** A. Statement I is an indirect cause of Statement II.

**Explanation:** Dense fog formed around the airport → Visibility on the runway fell sharply → Several departures were delayed → Passengers were moved to later flights. The hidden event or events make the first statement an indirect cause of the second.

**Family / variant:** CAE-FAM-OPERATIONS-CHAIN / fog
**causalStateId:** `projection:CAE-PLAN-INDIRECT|family:CAE-FAM-OPERATIONS-CHAIN|variant:fog|graph:DIRECT_CHAIN|direction:cause>bridge>effect>terminal|visible:cause,terminal`
**itemVariantId:** `projection:CAE-PLAN-INDIRECT|family:CAE-FAM-OPERATIONS-CHAIN|variant:fog|graph:DIRECT_CHAIN|direction:cause>bridge>effect>terminal|visible:cause,terminal|distractors:COMMON_CAUSE,INDIRECT_SECOND_CAUSES_FIRST,NO_CAUSAL_LINK|profile:NONE|presentation:INDIRECT_FIRST_CAUSES_SECOND>INDIRECT_SECOND_CAUSES_FIRST>NO_CAUSAL_LINK>COMMON_CAUSE`
**Difficulty evidence:** distance=3; hiddenLinks=2; topology=1; credibleDistractors=0; candidateBurden=0; inference=3; score=13
**Distractor mechanisms:** REVERSE_CAUSATION, INDIRECTNESS_CONFUSION, COMMON_CAUSE_CONFUSION

## CAE-CP-007 / CAE-QL-007

### EASY — seed 0

Which conclusion about these two observations is logically supported?

Statement I: Visits to the vaccination desk increased.

Statement II: Footfall at the park increased.

A. Their co-occurrence does not establish causation.
B. Statements I and II are effects of a common cause.
C. Statement I is the direct cause and Statement II is its effect.
D. Statement II is the direct cause and Statement I is its effect.

**Answer:** A. Their co-occurrence does not establish causation.

**Explanation:** The two observations do not establish a causal link. The displayed observations arise on separate causal paths.

**Family / variant:** CAE-FAM-COINCIDENT-OBSERVATIONS / vaccination-market
**causalStateId:** `projection:CAE-PLAN-CORRELATION|family:CAE-FAM-COINCIDENT-OBSERVATIONS|variant:vaccination-market|graph:PARALLEL_CHAINS|direction:first-effect>second-effect|visible:first-effect,second-effect`
**itemVariantId:** `projection:CAE-PLAN-CORRELATION|family:CAE-FAM-COINCIDENT-OBSERVATIONS|variant:vaccination-market|graph:PARALLEL_CHAINS|direction:first-effect>second-effect|visible:first-effect,second-effect|distractors:COMMON_CAUSE,FIRST_DIRECT_CAUSES_SECOND,SECOND_DIRECT_CAUSES_FIRST|profile:NONE|presentation:CORRELATION_ONLY>COMMON_CAUSE>FIRST_DIRECT_CAUSES_SECOND>SECOND_DIRECT_CAUSES_FIRST`
**Difficulty evidence:** distance=1; hiddenLinks=0; topology=2; credibleDistractors=0; candidateBurden=0; inference=2; score=7
**Distractor mechanisms:** COMMON_CAUSE_CONFUSION, CORRELATION, REVERSE_CAUSATION

### EASY — seed 1

Which conclusion about these two observations is logically supported?

Statement I: A technical fault occurred in a factory machine.

Statement II: Heavy rain fell near a school in another town.

A. Statement I is the direct cause and Statement II is its effect.
B. Statements I and II are effects of a common cause.
C. Statement II is the direct cause and Statement I is its effect.
D. Their co-occurrence does not establish causation.

**Answer:** D. Their co-occurrence does not establish causation.

**Explanation:** The two observations do not establish a causal link. The displayed observations arise on separate causal paths.

**Family / variant:** CAE-FAM-PARALLEL-INCIDENTS / factory-school
**causalStateId:** `projection:CAE-PLAN-CORRELATION|family:CAE-FAM-PARALLEL-INCIDENTS|variant:factory-school|graph:PARALLEL_CHAINS|direction:first-cause>second-cause|visible:first-cause,second-cause`
**itemVariantId:** `projection:CAE-PLAN-CORRELATION|family:CAE-FAM-PARALLEL-INCIDENTS|variant:factory-school|graph:PARALLEL_CHAINS|direction:first-cause>second-cause|visible:first-cause,second-cause|distractors:COMMON_CAUSE,FIRST_DIRECT_CAUSES_SECOND,SECOND_DIRECT_CAUSES_FIRST|profile:NONE|presentation:FIRST_DIRECT_CAUSES_SECOND>COMMON_CAUSE>SECOND_DIRECT_CAUSES_FIRST>CORRELATION_ONLY`
**Difficulty evidence:** distance=1; hiddenLinks=0; topology=2; credibleDistractors=0; candidateBurden=0; inference=2; score=7
**Distractor mechanisms:** CORRELATION, COMMON_CAUSE_CONFUSION, REVERSE_CAUSATION

### EASY — seed 2

Which conclusion about these two observations is logically supported?

Statement I: Water supply there was interrupted.

Statement II: A clinic updated its appointment software.

A. Their co-occurrence does not establish causation.
B. Statements I and II are effects of a common cause.
C. Statement II is the direct cause and Statement I is its effect.
D. Statement I is the direct cause and Statement II is its effect.

**Answer:** A. Their co-occurrence does not establish causation.

**Explanation:** The two observations do not establish a causal link. The displayed observations arise on separate causal paths.

**Family / variant:** CAE-FAM-PARALLEL-INCIDENTS / pipe-clinic
**causalStateId:** `projection:CAE-PLAN-CORRELATION|family:CAE-FAM-PARALLEL-INCIDENTS|variant:pipe-clinic|graph:PARALLEL_CHAINS|direction:first-effect>second-cause|visible:first-effect,second-cause`
**itemVariantId:** `projection:CAE-PLAN-CORRELATION|family:CAE-FAM-PARALLEL-INCIDENTS|variant:pipe-clinic|graph:PARALLEL_CHAINS|direction:first-effect>second-cause|visible:first-effect,second-cause|distractors:COMMON_CAUSE,FIRST_DIRECT_CAUSES_SECOND,SECOND_DIRECT_CAUSES_FIRST|profile:NONE|presentation:CORRELATION_ONLY>COMMON_CAUSE>SECOND_DIRECT_CAUSES_FIRST>FIRST_DIRECT_CAUSES_SECOND`
**Difficulty evidence:** distance=1; hiddenLinks=0; topology=2; credibleDistractors=0; candidateBurden=0; inference=2; score=7
**Distractor mechanisms:** COMMON_CAUSE_CONFUSION, REVERSE_CAUSATION, CORRELATION

### EASY — seed 3

Which conclusion about these two observations is logically supported?

Statement I: A technical fault occurred in a factory machine.

Statement II: Heavy rain fell near a school in another town.

A. Their co-occurrence does not establish causation.
B. Statement II is the direct cause and Statement I is its effect.
C. Statement I is the direct cause and Statement II is its effect.
D. Statements I and II are effects of a common cause.

**Answer:** A. Their co-occurrence does not establish causation.

**Explanation:** The two observations do not establish a causal link. The displayed observations arise on separate causal paths.

**Family / variant:** CAE-FAM-PARALLEL-INCIDENTS / factory-school
**causalStateId:** `projection:CAE-PLAN-CORRELATION|family:CAE-FAM-PARALLEL-INCIDENTS|variant:factory-school|graph:PARALLEL_CHAINS|direction:first-cause>second-cause|visible:first-cause,second-cause`
**itemVariantId:** `projection:CAE-PLAN-CORRELATION|family:CAE-FAM-PARALLEL-INCIDENTS|variant:factory-school|graph:PARALLEL_CHAINS|direction:first-cause>second-cause|visible:first-cause,second-cause|distractors:COMMON_CAUSE,FIRST_DIRECT_CAUSES_SECOND,SECOND_DIRECT_CAUSES_FIRST|profile:NONE|presentation:CORRELATION_ONLY>SECOND_DIRECT_CAUSES_FIRST>FIRST_DIRECT_CAUSES_SECOND>COMMON_CAUSE`
**Difficulty evidence:** distance=1; hiddenLinks=0; topology=2; credibleDistractors=0; candidateBurden=0; inference=2; score=7
**Distractor mechanisms:** REVERSE_CAUSATION, CORRELATION, COMMON_CAUSE_CONFUSION

### EASY — seed 4

Which conclusion about these two observations is logically supported?

Statement I: A warehouse scanner stopped working.

Statement II: A library began its annual stock check.

A. Statement II is the direct cause and Statement I is its effect.
B. Statements I and II are effects of a common cause.
C. Their co-occurrence does not establish causation.
D. Statement I is the direct cause and Statement II is its effect.

**Answer:** C. Their co-occurrence does not establish causation.

**Explanation:** The two observations do not establish a causal link. The displayed observations arise on separate causal paths.

**Family / variant:** CAE-FAM-PARALLEL-INCIDENTS / warehouse-library
**causalStateId:** `projection:CAE-PLAN-CORRELATION|family:CAE-FAM-PARALLEL-INCIDENTS|variant:warehouse-library|graph:PARALLEL_CHAINS|direction:first-cause>second-cause|visible:first-cause,second-cause`
**itemVariantId:** `projection:CAE-PLAN-CORRELATION|family:CAE-FAM-PARALLEL-INCIDENTS|variant:warehouse-library|graph:PARALLEL_CHAINS|direction:first-cause>second-cause|visible:first-cause,second-cause|distractors:COMMON_CAUSE,FIRST_DIRECT_CAUSES_SECOND,SECOND_DIRECT_CAUSES_FIRST|profile:NONE|presentation:SECOND_DIRECT_CAUSES_FIRST>COMMON_CAUSE>CORRELATION_ONLY>FIRST_DIRECT_CAUSES_SECOND`
**Difficulty evidence:** distance=1; hiddenLinks=0; topology=2; credibleDistractors=0; candidateBurden=0; inference=2; score=7
**Distractor mechanisms:** REVERSE_CAUSATION, COMMON_CAUSE_CONFUSION, CORRELATION

### EASY — seed 5

Which conclusion about these two observations is logically supported?

Statement I: A water pipe burst in one neighbourhood.

Statement II: A clinic updated its appointment software.

A. Statements I and II are effects of a common cause.
B. Their co-occurrence does not establish causation.
C. Statement II is the direct cause and Statement I is its effect.
D. Statement I is the direct cause and Statement II is its effect.

**Answer:** B. Their co-occurrence does not establish causation.

**Explanation:** The two observations do not establish a causal link. The displayed observations arise on separate causal paths.

**Family / variant:** CAE-FAM-PARALLEL-INCIDENTS / pipe-clinic
**causalStateId:** `projection:CAE-PLAN-CORRELATION|family:CAE-FAM-PARALLEL-INCIDENTS|variant:pipe-clinic|graph:PARALLEL_CHAINS|direction:first-cause>second-cause|visible:first-cause,second-cause`
**itemVariantId:** `projection:CAE-PLAN-CORRELATION|family:CAE-FAM-PARALLEL-INCIDENTS|variant:pipe-clinic|graph:PARALLEL_CHAINS|direction:first-cause>second-cause|visible:first-cause,second-cause|distractors:COMMON_CAUSE,FIRST_DIRECT_CAUSES_SECOND,SECOND_DIRECT_CAUSES_FIRST|profile:NONE|presentation:COMMON_CAUSE>CORRELATION_ONLY>SECOND_DIRECT_CAUSES_FIRST>FIRST_DIRECT_CAUSES_SECOND`
**Difficulty evidence:** distance=1; hiddenLinks=0; topology=2; credibleDistractors=0; candidateBurden=0; inference=2; score=7
**Distractor mechanisms:** COMMON_CAUSE_CONFUSION, REVERSE_CAUSATION, CORRELATION

### EASY — seed 6

Which conclusion about these two observations is logically supported?

Statement I: Production at that factory paused temporarily.

Statement II: Heavy rain fell near a school in another town.

A. Statement II is the direct cause and Statement I is its effect.
B. Statement I is the direct cause and Statement II is its effect.
C. Statements I and II are effects of a common cause.
D. Their co-occurrence does not establish causation.

**Answer:** D. Their co-occurrence does not establish causation.

**Explanation:** The two observations do not establish a causal link. The displayed observations arise on separate causal paths.

**Family / variant:** CAE-FAM-PARALLEL-INCIDENTS / factory-school
**causalStateId:** `projection:CAE-PLAN-CORRELATION|family:CAE-FAM-PARALLEL-INCIDENTS|variant:factory-school|graph:PARALLEL_CHAINS|direction:first-effect>second-cause|visible:first-effect,second-cause`
**itemVariantId:** `projection:CAE-PLAN-CORRELATION|family:CAE-FAM-PARALLEL-INCIDENTS|variant:factory-school|graph:PARALLEL_CHAINS|direction:first-effect>second-cause|visible:first-effect,second-cause|distractors:COMMON_CAUSE,FIRST_DIRECT_CAUSES_SECOND,SECOND_DIRECT_CAUSES_FIRST|profile:NONE|presentation:SECOND_DIRECT_CAUSES_FIRST>FIRST_DIRECT_CAUSES_SECOND>COMMON_CAUSE>CORRELATION_ONLY`
**Difficulty evidence:** distance=1; hiddenLinks=0; topology=2; credibleDistractors=0; candidateBurden=0; inference=2; score=7
**Distractor mechanisms:** REVERSE_CAUSATION, CORRELATION, COMMON_CAUSE_CONFUSION

### EASY — seed 7

Which conclusion about these two observations is logically supported?

Statement I: Seasonal rain began in the city.

Statement II: Admissions to engineering colleges increased.

A. Statement II is the direct cause and Statement I is its effect.
B. Statement I is the direct cause and Statement II is its effect.
C. Their co-occurrence does not establish causation.
D. Statements I and II are effects of a common cause.

**Answer:** C. Their co-occurrence does not establish causation.

**Explanation:** The two observations do not establish a causal link. The displayed observations arise on separate causal paths.

**Family / variant:** CAE-FAM-COINCIDENT-OBSERVATIONS / umbrellas-admissions
**causalStateId:** `projection:CAE-PLAN-CORRELATION|family:CAE-FAM-COINCIDENT-OBSERVATIONS|variant:umbrellas-admissions|graph:PARALLEL_CHAINS|direction:first-cause>second-effect|visible:first-cause,second-effect`
**itemVariantId:** `projection:CAE-PLAN-CORRELATION|family:CAE-FAM-COINCIDENT-OBSERVATIONS|variant:umbrellas-admissions|graph:PARALLEL_CHAINS|direction:first-cause>second-effect|visible:first-cause,second-effect|distractors:COMMON_CAUSE,FIRST_DIRECT_CAUSES_SECOND,SECOND_DIRECT_CAUSES_FIRST|profile:NONE|presentation:SECOND_DIRECT_CAUSES_FIRST>FIRST_DIRECT_CAUSES_SECOND>CORRELATION_ONLY>COMMON_CAUSE`
**Difficulty evidence:** distance=1; hiddenLinks=0; topology=2; credibleDistractors=0; candidateBurden=0; inference=2; score=7
**Distractor mechanisms:** REVERSE_CAUSATION, CORRELATION, COMMON_CAUSE_CONFUSION

### EASY — seed 8

Which conclusion about these two observations is logically supported?

Statement I: A warehouse scanner stopped working.

Statement II: A library began its annual stock check.

A. Statements I and II are effects of a common cause.
B. Their co-occurrence does not establish causation.
C. Statement I is the direct cause and Statement II is its effect.
D. Statement II is the direct cause and Statement I is its effect.

**Answer:** B. Their co-occurrence does not establish causation.

**Explanation:** The two observations do not establish a causal link. The displayed observations arise on separate causal paths.

**Family / variant:** CAE-FAM-PARALLEL-INCIDENTS / warehouse-library
**causalStateId:** `projection:CAE-PLAN-CORRELATION|family:CAE-FAM-PARALLEL-INCIDENTS|variant:warehouse-library|graph:PARALLEL_CHAINS|direction:first-cause>second-cause|visible:first-cause,second-cause`
**itemVariantId:** `projection:CAE-PLAN-CORRELATION|family:CAE-FAM-PARALLEL-INCIDENTS|variant:warehouse-library|graph:PARALLEL_CHAINS|direction:first-cause>second-cause|visible:first-cause,second-cause|distractors:COMMON_CAUSE,FIRST_DIRECT_CAUSES_SECOND,SECOND_DIRECT_CAUSES_FIRST|profile:NONE|presentation:COMMON_CAUSE>CORRELATION_ONLY>FIRST_DIRECT_CAUSES_SECOND>SECOND_DIRECT_CAUSES_FIRST`
**Difficulty evidence:** distance=1; hiddenLinks=0; topology=2; credibleDistractors=0; candidateBurden=0; inference=2; score=7
**Distractor mechanisms:** COMMON_CAUSE_CONFUSION, CORRELATION, REVERSE_CAUSATION

### EASY — seed 9

Which conclusion about these two observations is logically supported?

Statement I: Seasonal rain began in the city.

Statement II: Admissions to engineering colleges increased.

A. Statement II is the direct cause and Statement I is its effect.
B. Statements I and II are effects of a common cause.
C. Statement I is the direct cause and Statement II is its effect.
D. Their co-occurrence does not establish causation.

**Answer:** D. Their co-occurrence does not establish causation.

**Explanation:** The two observations do not establish a causal link. The displayed observations arise on separate causal paths.

**Family / variant:** CAE-FAM-COINCIDENT-OBSERVATIONS / umbrellas-admissions
**causalStateId:** `projection:CAE-PLAN-CORRELATION|family:CAE-FAM-COINCIDENT-OBSERVATIONS|variant:umbrellas-admissions|graph:PARALLEL_CHAINS|direction:first-cause>second-effect|visible:first-cause,second-effect`
**itemVariantId:** `projection:CAE-PLAN-CORRELATION|family:CAE-FAM-COINCIDENT-OBSERVATIONS|variant:umbrellas-admissions|graph:PARALLEL_CHAINS|direction:first-cause>second-effect|visible:first-cause,second-effect|distractors:COMMON_CAUSE,FIRST_DIRECT_CAUSES_SECOND,SECOND_DIRECT_CAUSES_FIRST|profile:NONE|presentation:SECOND_DIRECT_CAUSES_FIRST>COMMON_CAUSE>FIRST_DIRECT_CAUSES_SECOND>CORRELATION_ONLY`
**Difficulty evidence:** distance=1; hiddenLinks=0; topology=2; credibleDistractors=0; candidateBurden=0; inference=2; score=7
**Distractor mechanisms:** REVERSE_CAUSATION, COMMON_CAUSE_CONFUSION, CORRELATION

## CAE-CP-008 / CAE-QL-008

### MEDIUM — seed 0

Select the causally valid sequence.

P. Strong wind affected the ferry crossing.
Q. Ferry departures were paused.
R. Vehicles waited at the crossing.
S. Goods reached the market late.

A. Strong wind affected the ferry crossing → Ferry departures were paused → Goods reached the market late → Vehicles waited at the crossing
B. Strong wind affected the ferry crossing → Ferry departures were paused → Vehicles waited at the crossing → Goods reached the market late
C. Ferry departures were paused → Strong wind affected the ferry crossing → Vehicles waited at the crossing → Goods reached the market late
D. Strong wind affected the ferry crossing → Vehicles waited at the crossing → Ferry departures were paused → Goods reached the market late

**Answer:** B. Strong wind affected the ferry crossing → Ferry departures were paused → Vehicles waited at the crossing → Goods reached the market late

**Explanation:** Strong wind affected the ferry crossing → Ferry departures were paused → Vehicles waited at the crossing → Goods reached the market late. This order follows the causal chain shown by the events.

**Family / variant:** CAE-FAM-MISSING-BRIDGE / ferry
**causalStateId:** `projection:CAE-PLAN-SEQUENCE|family:CAE-FAM-MISSING-BRIDGE|variant:ferry|graph:HIDDEN_CHAIN|direction:cause>bridge>effect>terminal|visible:cause,bridge,effect,terminal`
**itemVariantId:** `projection:CAE-PLAN-SEQUENCE|family:CAE-FAM-MISSING-BRIDGE|variant:ferry|graph:HIDDEN_CHAIN|direction:cause>bridge>effect>terminal|visible:cause,bridge,effect,terminal|distractors:CAE-WORLD-MISSING-BRIDGE-ferry:bridge|CAE-WORLD-MISSING-BRIDGE-ferry:cause|CAE-WORLD-MISSING-BRIDGE-ferry:effect|CAE-WORLD-MISSING-BRIDGE-ferry:terminal,CAE-WORLD-MISSING-BRIDGE-ferry:cause|CAE-WORLD-MISSING-BRIDGE-ferry:bridge|CAE-WORLD-MISSING-BRIDGE-ferry:terminal|CAE-WORLD-MISSING-BRIDGE-ferry:effect,CAE-WORLD-MISSING-BRIDGE-ferry:cause|CAE-WORLD-MISSING-BRIDGE-ferry:effect|CAE-WORLD-MISSING-BRIDGE-ferry:bridge|CAE-WORLD-MISSING-BRIDGE-ferry:terminal|profile:NONE|presentation:CAE-WORLD-MISSING-BRIDGE-ferry:cause|CAE-WORLD-MISSING-BRIDGE-ferry:bridge|CAE-WORLD-MISSING-BRIDGE-ferry:terminal|CAE-WORLD-MISSING-BRIDGE-ferry:effect>CAE-WORLD-MISSING-BRIDGE-ferry:cause|CAE-WORLD-MISSING-BRIDGE-ferry:bridge|CAE-WORLD-MISSING-BRIDGE-ferry:effect|CAE-WORLD-MISSING-BRIDGE-ferry:terminal>CAE-WORLD-MISSING-BRIDGE-ferry:bridge|CAE-WORLD-MISSING-BRIDGE-ferry:cause|CAE-WORLD-MISSING-BRIDGE-ferry:effect|CAE-WORLD-MISSING-BRIDGE-ferry:terminal>CAE-WORLD-MISSING-BRIDGE-ferry:cause|CAE-WORLD-MISSING-BRIDGE-ferry:effect|CAE-WORLD-MISSING-BRIDGE-ferry:bridge|CAE-WORLD-MISSING-BRIDGE-ferry:terminal`
**Difficulty evidence:** distance=3; hiddenLinks=0; topology=4; credibleDistractors=0; candidateBurden=0; inference=3; score=14
**Distractor mechanisms:** INDIRECTNESS_CONFUSION, REVERSE_CAUSATION, TEMPORAL_VIOLATION

### MEDIUM — seed 2

Select the causally valid sequence.

P. Roadwork closed one lane.
Q. Vehicles merged into the remaining lane.
R. Traffic queues formed.
S. Bus arrival times became less predictable.

A. Roadwork closed one lane → Traffic queues formed → Vehicles merged into the remaining lane → Bus arrival times became less predictable
B. Vehicles merged into the remaining lane → Roadwork closed one lane → Traffic queues formed → Bus arrival times became less predictable
C. Roadwork closed one lane → Vehicles merged into the remaining lane → Traffic queues formed → Bus arrival times became less predictable
D. Roadwork closed one lane → Vehicles merged into the remaining lane → Bus arrival times became less predictable → Traffic queues formed

**Answer:** C. Roadwork closed one lane → Vehicles merged into the remaining lane → Traffic queues formed → Bus arrival times became less predictable

**Explanation:** Roadwork closed one lane → Vehicles merged into the remaining lane → Traffic queues formed → Bus arrival times became less predictable. This order follows the causal chain shown by the events.

**Family / variant:** CAE-FAM-CIVIC-SEQUENCE / roadwork
**causalStateId:** `projection:CAE-PLAN-SEQUENCE|family:CAE-FAM-CIVIC-SEQUENCE|variant:roadwork|graph:HIDDEN_CHAIN|direction:cause>bridge>effect>terminal|visible:cause,bridge,effect,terminal`
**itemVariantId:** `projection:CAE-PLAN-SEQUENCE|family:CAE-FAM-CIVIC-SEQUENCE|variant:roadwork|graph:HIDDEN_CHAIN|direction:cause>bridge>effect>terminal|visible:cause,bridge,effect,terminal|distractors:CAE-WORLD-CIVIC-SEQUENCE-roadwork:bridge|CAE-WORLD-CIVIC-SEQUENCE-roadwork:cause|CAE-WORLD-CIVIC-SEQUENCE-roadwork:effect|CAE-WORLD-CIVIC-SEQUENCE-roadwork:terminal,CAE-WORLD-CIVIC-SEQUENCE-roadwork:cause|CAE-WORLD-CIVIC-SEQUENCE-roadwork:bridge|CAE-WORLD-CIVIC-SEQUENCE-roadwork:terminal|CAE-WORLD-CIVIC-SEQUENCE-roadwork:effect,CAE-WORLD-CIVIC-SEQUENCE-roadwork:cause|CAE-WORLD-CIVIC-SEQUENCE-roadwork:effect|CAE-WORLD-CIVIC-SEQUENCE-roadwork:bridge|CAE-WORLD-CIVIC-SEQUENCE-roadwork:terminal|profile:NONE|presentation:CAE-WORLD-CIVIC-SEQUENCE-roadwork:cause|CAE-WORLD-CIVIC-SEQUENCE-roadwork:effect|CAE-WORLD-CIVIC-SEQUENCE-roadwork:bridge|CAE-WORLD-CIVIC-SEQUENCE-roadwork:terminal>CAE-WORLD-CIVIC-SEQUENCE-roadwork:bridge|CAE-WORLD-CIVIC-SEQUENCE-roadwork:cause|CAE-WORLD-CIVIC-SEQUENCE-roadwork:effect|CAE-WORLD-CIVIC-SEQUENCE-roadwork:terminal>CAE-WORLD-CIVIC-SEQUENCE-roadwork:cause|CAE-WORLD-CIVIC-SEQUENCE-roadwork:bridge|CAE-WORLD-CIVIC-SEQUENCE-roadwork:effect|CAE-WORLD-CIVIC-SEQUENCE-roadwork:terminal>CAE-WORLD-CIVIC-SEQUENCE-roadwork:cause|CAE-WORLD-CIVIC-SEQUENCE-roadwork:bridge|CAE-WORLD-CIVIC-SEQUENCE-roadwork:terminal|CAE-WORLD-CIVIC-SEQUENCE-roadwork:effect`
**Difficulty evidence:** distance=3; hiddenLinks=0; topology=4; credibleDistractors=0; candidateBurden=0; inference=3; score=14
**Distractor mechanisms:** TEMPORAL_VIOLATION, REVERSE_CAUSATION, INDIRECTNESS_CONFUSION

### MEDIUM — seed 4

Select the causally valid sequence.

P. The power supply to a cold-storage unit failed.
Q. The backup generator took time to start.
R. Loading of perishable goods paused.
S. Dispatch vehicles left later than scheduled.

A. The power supply to a cold-storage unit failed → The backup generator took time to start → Dispatch vehicles left later than scheduled → Loading of perishable goods paused
B. The backup generator took time to start → The power supply to a cold-storage unit failed → Loading of perishable goods paused → Dispatch vehicles left later than scheduled
C. The power supply to a cold-storage unit failed → The backup generator took time to start → Loading of perishable goods paused → Dispatch vehicles left later than scheduled
D. The power supply to a cold-storage unit failed → Loading of perishable goods paused → The backup generator took time to start → Dispatch vehicles left later than scheduled

**Answer:** C. The power supply to a cold-storage unit failed → The backup generator took time to start → Loading of perishable goods paused → Dispatch vehicles left later than scheduled

**Explanation:** The power supply to a cold-storage unit failed → The backup generator took time to start → Loading of perishable goods paused → Dispatch vehicles left later than scheduled. This order follows the causal chain shown by the events.

**Family / variant:** CAE-FAM-HIDDEN-CHAIN / cold-storage
**causalStateId:** `projection:CAE-PLAN-SEQUENCE|family:CAE-FAM-HIDDEN-CHAIN|variant:cold-storage|graph:HIDDEN_CHAIN|direction:cause>bridge>effect>terminal|visible:cause,bridge,effect,terminal`
**itemVariantId:** `projection:CAE-PLAN-SEQUENCE|family:CAE-FAM-HIDDEN-CHAIN|variant:cold-storage|graph:HIDDEN_CHAIN|direction:cause>bridge>effect>terminal|visible:cause,bridge,effect,terminal|distractors:CAE-WORLD-HIDDEN-CHAIN-cold-storage:bridge|CAE-WORLD-HIDDEN-CHAIN-cold-storage:cause|CAE-WORLD-HIDDEN-CHAIN-cold-storage:effect|CAE-WORLD-HIDDEN-CHAIN-cold-storage:terminal,CAE-WORLD-HIDDEN-CHAIN-cold-storage:cause|CAE-WORLD-HIDDEN-CHAIN-cold-storage:bridge|CAE-WORLD-HIDDEN-CHAIN-cold-storage:terminal|CAE-WORLD-HIDDEN-CHAIN-cold-storage:effect,CAE-WORLD-HIDDEN-CHAIN-cold-storage:cause|CAE-WORLD-HIDDEN-CHAIN-cold-storage:effect|CAE-WORLD-HIDDEN-CHAIN-cold-storage:bridge|CAE-WORLD-HIDDEN-CHAIN-cold-storage:terminal|profile:NONE|presentation:CAE-WORLD-HIDDEN-CHAIN-cold-storage:cause|CAE-WORLD-HIDDEN-CHAIN-cold-storage:bridge|CAE-WORLD-HIDDEN-CHAIN-cold-storage:terminal|CAE-WORLD-HIDDEN-CHAIN-cold-storage:effect>CAE-WORLD-HIDDEN-CHAIN-cold-storage:bridge|CAE-WORLD-HIDDEN-CHAIN-cold-storage:cause|CAE-WORLD-HIDDEN-CHAIN-cold-storage:effect|CAE-WORLD-HIDDEN-CHAIN-cold-storage:terminal>CAE-WORLD-HIDDEN-CHAIN-cold-storage:cause|CAE-WORLD-HIDDEN-CHAIN-cold-storage:bridge|CAE-WORLD-HIDDEN-CHAIN-cold-storage:effect|CAE-WORLD-HIDDEN-CHAIN-cold-storage:terminal>CAE-WORLD-HIDDEN-CHAIN-cold-storage:cause|CAE-WORLD-HIDDEN-CHAIN-cold-storage:effect|CAE-WORLD-HIDDEN-CHAIN-cold-storage:bridge|CAE-WORLD-HIDDEN-CHAIN-cold-storage:terminal`
**Difficulty evidence:** distance=3; hiddenLinks=0; topology=4; credibleDistractors=0; candidateBurden=0; inference=3; score=14
**Distractor mechanisms:** INDIRECTNESS_CONFUSION, REVERSE_CAUSATION, TEMPORAL_VIOLATION

### MEDIUM — seed 7

Select the causally valid sequence.

P. A bridge was closed for urgent repairs.
Q. Traffic was diverted through nearby streets.
R. Travel time on the route increased.
S. More commuters chose the metro.

A. A bridge was closed for urgent repairs → Traffic was diverted through nearby streets → Travel time on the route increased → More commuters chose the metro
B. Traffic was diverted through nearby streets → A bridge was closed for urgent repairs → Travel time on the route increased → More commuters chose the metro
C. A bridge was closed for urgent repairs → Traffic was diverted through nearby streets → More commuters chose the metro → Travel time on the route increased
D. A bridge was closed for urgent repairs → Travel time on the route increased → Traffic was diverted through nearby streets → More commuters chose the metro

**Answer:** A. A bridge was closed for urgent repairs → Traffic was diverted through nearby streets → Travel time on the route increased → More commuters chose the metro

**Explanation:** A bridge was closed for urgent repairs → Traffic was diverted through nearby streets → Travel time on the route increased → More commuters chose the metro. This order follows the causal chain shown by the events.

**Family / variant:** CAE-FAM-OPERATIONS-CHAIN / bridge
**causalStateId:** `projection:CAE-PLAN-SEQUENCE|family:CAE-FAM-OPERATIONS-CHAIN|variant:bridge|graph:DIRECT_CHAIN|direction:cause>bridge>effect>terminal|visible:cause,bridge,effect,terminal`
**itemVariantId:** `projection:CAE-PLAN-SEQUENCE|family:CAE-FAM-OPERATIONS-CHAIN|variant:bridge|graph:DIRECT_CHAIN|direction:cause>bridge>effect>terminal|visible:cause,bridge,effect,terminal|distractors:CAE-WORLD-OPERATIONS-CHAIN-bridge:bridge|CAE-WORLD-OPERATIONS-CHAIN-bridge:cause|CAE-WORLD-OPERATIONS-CHAIN-bridge:effect|CAE-WORLD-OPERATIONS-CHAIN-bridge:terminal,CAE-WORLD-OPERATIONS-CHAIN-bridge:cause|CAE-WORLD-OPERATIONS-CHAIN-bridge:bridge|CAE-WORLD-OPERATIONS-CHAIN-bridge:terminal|CAE-WORLD-OPERATIONS-CHAIN-bridge:effect,CAE-WORLD-OPERATIONS-CHAIN-bridge:cause|CAE-WORLD-OPERATIONS-CHAIN-bridge:effect|CAE-WORLD-OPERATIONS-CHAIN-bridge:bridge|CAE-WORLD-OPERATIONS-CHAIN-bridge:terminal|profile:NONE|presentation:CAE-WORLD-OPERATIONS-CHAIN-bridge:cause|CAE-WORLD-OPERATIONS-CHAIN-bridge:bridge|CAE-WORLD-OPERATIONS-CHAIN-bridge:effect|CAE-WORLD-OPERATIONS-CHAIN-bridge:terminal>CAE-WORLD-OPERATIONS-CHAIN-bridge:bridge|CAE-WORLD-OPERATIONS-CHAIN-bridge:cause|CAE-WORLD-OPERATIONS-CHAIN-bridge:effect|CAE-WORLD-OPERATIONS-CHAIN-bridge:terminal>CAE-WORLD-OPERATIONS-CHAIN-bridge:cause|CAE-WORLD-OPERATIONS-CHAIN-bridge:bridge|CAE-WORLD-OPERATIONS-CHAIN-bridge:terminal|CAE-WORLD-OPERATIONS-CHAIN-bridge:effect>CAE-WORLD-OPERATIONS-CHAIN-bridge:cause|CAE-WORLD-OPERATIONS-CHAIN-bridge:effect|CAE-WORLD-OPERATIONS-CHAIN-bridge:bridge|CAE-WORLD-OPERATIONS-CHAIN-bridge:terminal`
**Difficulty evidence:** distance=3; hiddenLinks=0; topology=1; credibleDistractors=0; candidateBurden=0; inference=3; score=11
**Distractor mechanisms:** REVERSE_CAUSATION, INDIRECTNESS_CONFUSION, TEMPORAL_VIOLATION

### MEDIUM — seed 1

Select the causally valid sequence.

P. Strong wind affected the ferry crossing.
Q. Ferry departures were paused.
R. Vehicles waited at the crossing.
S. Goods reached the market late.

A. Strong wind affected the ferry crossing → Vehicles waited at the crossing → Ferry departures were paused → Goods reached the market late
B. Strong wind affected the ferry crossing → Ferry departures were paused → Goods reached the market late → Vehicles waited at the crossing
C. Strong wind affected the ferry crossing → Ferry departures were paused → Vehicles waited at the crossing → Goods reached the market late
D. Ferry departures were paused → Strong wind affected the ferry crossing → Vehicles waited at the crossing → Goods reached the market late

**Answer:** C. Strong wind affected the ferry crossing → Ferry departures were paused → Vehicles waited at the crossing → Goods reached the market late

**Explanation:** Strong wind affected the ferry crossing → Ferry departures were paused → Vehicles waited at the crossing → Goods reached the market late. This order follows the causal chain shown by the events.

**Family / variant:** CAE-FAM-MISSING-BRIDGE / ferry
**causalStateId:** `projection:CAE-PLAN-SEQUENCE|family:CAE-FAM-MISSING-BRIDGE|variant:ferry|graph:HIDDEN_CHAIN|direction:cause>bridge>effect>terminal|visible:cause,bridge,effect,terminal`
**itemVariantId:** `projection:CAE-PLAN-SEQUENCE|family:CAE-FAM-MISSING-BRIDGE|variant:ferry|graph:HIDDEN_CHAIN|direction:cause>bridge>effect>terminal|visible:cause,bridge,effect,terminal|distractors:CAE-WORLD-MISSING-BRIDGE-ferry:bridge|CAE-WORLD-MISSING-BRIDGE-ferry:cause|CAE-WORLD-MISSING-BRIDGE-ferry:effect|CAE-WORLD-MISSING-BRIDGE-ferry:terminal,CAE-WORLD-MISSING-BRIDGE-ferry:cause|CAE-WORLD-MISSING-BRIDGE-ferry:bridge|CAE-WORLD-MISSING-BRIDGE-ferry:terminal|CAE-WORLD-MISSING-BRIDGE-ferry:effect,CAE-WORLD-MISSING-BRIDGE-ferry:cause|CAE-WORLD-MISSING-BRIDGE-ferry:effect|CAE-WORLD-MISSING-BRIDGE-ferry:bridge|CAE-WORLD-MISSING-BRIDGE-ferry:terminal|profile:NONE|presentation:CAE-WORLD-MISSING-BRIDGE-ferry:cause|CAE-WORLD-MISSING-BRIDGE-ferry:effect|CAE-WORLD-MISSING-BRIDGE-ferry:bridge|CAE-WORLD-MISSING-BRIDGE-ferry:terminal>CAE-WORLD-MISSING-BRIDGE-ferry:cause|CAE-WORLD-MISSING-BRIDGE-ferry:bridge|CAE-WORLD-MISSING-BRIDGE-ferry:terminal|CAE-WORLD-MISSING-BRIDGE-ferry:effect>CAE-WORLD-MISSING-BRIDGE-ferry:cause|CAE-WORLD-MISSING-BRIDGE-ferry:bridge|CAE-WORLD-MISSING-BRIDGE-ferry:effect|CAE-WORLD-MISSING-BRIDGE-ferry:terminal>CAE-WORLD-MISSING-BRIDGE-ferry:bridge|CAE-WORLD-MISSING-BRIDGE-ferry:cause|CAE-WORLD-MISSING-BRIDGE-ferry:effect|CAE-WORLD-MISSING-BRIDGE-ferry:terminal`
**Difficulty evidence:** distance=3; hiddenLinks=0; topology=4; credibleDistractors=0; candidateBurden=0; inference=3; score=14
**Distractor mechanisms:** TEMPORAL_VIOLATION, INDIRECTNESS_CONFUSION, REVERSE_CAUSATION

### MEDIUM — seed 3

Select the causally valid sequence.

P. Strong wind affected the ferry crossing.
Q. Ferry departures were paused.
R. Vehicles waited at the crossing.
S. Goods reached the market late.

A. Strong wind affected the ferry crossing → Ferry departures were paused → Vehicles waited at the crossing → Goods reached the market late
B. Ferry departures were paused → Strong wind affected the ferry crossing → Vehicles waited at the crossing → Goods reached the market late
C. Strong wind affected the ferry crossing → Vehicles waited at the crossing → Ferry departures were paused → Goods reached the market late
D. Strong wind affected the ferry crossing → Ferry departures were paused → Goods reached the market late → Vehicles waited at the crossing

**Answer:** A. Strong wind affected the ferry crossing → Ferry departures were paused → Vehicles waited at the crossing → Goods reached the market late

**Explanation:** Strong wind affected the ferry crossing → Ferry departures were paused → Vehicles waited at the crossing → Goods reached the market late. This order follows the causal chain shown by the events.

**Family / variant:** CAE-FAM-MISSING-BRIDGE / ferry
**causalStateId:** `projection:CAE-PLAN-SEQUENCE|family:CAE-FAM-MISSING-BRIDGE|variant:ferry|graph:HIDDEN_CHAIN|direction:cause>bridge>effect>terminal|visible:cause,bridge,effect,terminal`
**itemVariantId:** `projection:CAE-PLAN-SEQUENCE|family:CAE-FAM-MISSING-BRIDGE|variant:ferry|graph:HIDDEN_CHAIN|direction:cause>bridge>effect>terminal|visible:cause,bridge,effect,terminal|distractors:CAE-WORLD-MISSING-BRIDGE-ferry:bridge|CAE-WORLD-MISSING-BRIDGE-ferry:cause|CAE-WORLD-MISSING-BRIDGE-ferry:effect|CAE-WORLD-MISSING-BRIDGE-ferry:terminal,CAE-WORLD-MISSING-BRIDGE-ferry:cause|CAE-WORLD-MISSING-BRIDGE-ferry:bridge|CAE-WORLD-MISSING-BRIDGE-ferry:terminal|CAE-WORLD-MISSING-BRIDGE-ferry:effect,CAE-WORLD-MISSING-BRIDGE-ferry:cause|CAE-WORLD-MISSING-BRIDGE-ferry:effect|CAE-WORLD-MISSING-BRIDGE-ferry:bridge|CAE-WORLD-MISSING-BRIDGE-ferry:terminal|profile:NONE|presentation:CAE-WORLD-MISSING-BRIDGE-ferry:cause|CAE-WORLD-MISSING-BRIDGE-ferry:bridge|CAE-WORLD-MISSING-BRIDGE-ferry:effect|CAE-WORLD-MISSING-BRIDGE-ferry:terminal>CAE-WORLD-MISSING-BRIDGE-ferry:bridge|CAE-WORLD-MISSING-BRIDGE-ferry:cause|CAE-WORLD-MISSING-BRIDGE-ferry:effect|CAE-WORLD-MISSING-BRIDGE-ferry:terminal>CAE-WORLD-MISSING-BRIDGE-ferry:cause|CAE-WORLD-MISSING-BRIDGE-ferry:effect|CAE-WORLD-MISSING-BRIDGE-ferry:bridge|CAE-WORLD-MISSING-BRIDGE-ferry:terminal>CAE-WORLD-MISSING-BRIDGE-ferry:cause|CAE-WORLD-MISSING-BRIDGE-ferry:bridge|CAE-WORLD-MISSING-BRIDGE-ferry:terminal|CAE-WORLD-MISSING-BRIDGE-ferry:effect`
**Difficulty evidence:** distance=3; hiddenLinks=0; topology=4; credibleDistractors=0; candidateBurden=0; inference=3; score=14
**Distractor mechanisms:** REVERSE_CAUSATION, TEMPORAL_VIOLATION, INDIRECTNESS_CONFUSION

### MEDIUM — seed 5

Select the causally valid sequence.

P. Heavy rainfall continued in the hills.
Q. A landslide occurred along the highway.
R. The highway was blocked.
S. Supply vehicles were delayed.

A. Heavy rainfall continued in the hills → A landslide occurred along the highway → Supply vehicles were delayed → The highway was blocked
B. A landslide occurred along the highway → Heavy rainfall continued in the hills → The highway was blocked → Supply vehicles were delayed
C. Heavy rainfall continued in the hills → A landslide occurred along the highway → The highway was blocked → Supply vehicles were delayed
D. Heavy rainfall continued in the hills → The highway was blocked → A landslide occurred along the highway → Supply vehicles were delayed

**Answer:** C. Heavy rainfall continued in the hills → A landslide occurred along the highway → The highway was blocked → Supply vehicles were delayed

**Explanation:** Heavy rainfall continued in the hills → A landslide occurred along the highway → The highway was blocked → Supply vehicles were delayed. This order follows the causal chain shown by the events.

**Family / variant:** CAE-FAM-HIDDEN-CHAIN / landslide
**causalStateId:** `projection:CAE-PLAN-SEQUENCE|family:CAE-FAM-HIDDEN-CHAIN|variant:landslide|graph:HIDDEN_CHAIN|direction:cause>bridge>effect>terminal|visible:cause,bridge,effect,terminal`
**itemVariantId:** `projection:CAE-PLAN-SEQUENCE|family:CAE-FAM-HIDDEN-CHAIN|variant:landslide|graph:HIDDEN_CHAIN|direction:cause>bridge>effect>terminal|visible:cause,bridge,effect,terminal|distractors:CAE-WORLD-HIDDEN-CHAIN-landslide:bridge|CAE-WORLD-HIDDEN-CHAIN-landslide:cause|CAE-WORLD-HIDDEN-CHAIN-landslide:effect|CAE-WORLD-HIDDEN-CHAIN-landslide:terminal,CAE-WORLD-HIDDEN-CHAIN-landslide:cause|CAE-WORLD-HIDDEN-CHAIN-landslide:bridge|CAE-WORLD-HIDDEN-CHAIN-landslide:terminal|CAE-WORLD-HIDDEN-CHAIN-landslide:effect,CAE-WORLD-HIDDEN-CHAIN-landslide:cause|CAE-WORLD-HIDDEN-CHAIN-landslide:effect|CAE-WORLD-HIDDEN-CHAIN-landslide:bridge|CAE-WORLD-HIDDEN-CHAIN-landslide:terminal|profile:NONE|presentation:CAE-WORLD-HIDDEN-CHAIN-landslide:cause|CAE-WORLD-HIDDEN-CHAIN-landslide:bridge|CAE-WORLD-HIDDEN-CHAIN-landslide:terminal|CAE-WORLD-HIDDEN-CHAIN-landslide:effect>CAE-WORLD-HIDDEN-CHAIN-landslide:bridge|CAE-WORLD-HIDDEN-CHAIN-landslide:cause|CAE-WORLD-HIDDEN-CHAIN-landslide:effect|CAE-WORLD-HIDDEN-CHAIN-landslide:terminal>CAE-WORLD-HIDDEN-CHAIN-landslide:cause|CAE-WORLD-HIDDEN-CHAIN-landslide:bridge|CAE-WORLD-HIDDEN-CHAIN-landslide:effect|CAE-WORLD-HIDDEN-CHAIN-landslide:terminal>CAE-WORLD-HIDDEN-CHAIN-landslide:cause|CAE-WORLD-HIDDEN-CHAIN-landslide:effect|CAE-WORLD-HIDDEN-CHAIN-landslide:bridge|CAE-WORLD-HIDDEN-CHAIN-landslide:terminal`
**Difficulty evidence:** distance=3; hiddenLinks=0; topology=4; credibleDistractors=0; candidateBurden=0; inference=3; score=14
**Distractor mechanisms:** INDIRECTNESS_CONFUSION, REVERSE_CAUSATION, TEMPORAL_VIOLATION

### MEDIUM — seed 6

Select the causally valid sequence.

P. Heavy rainfall continued in the hills.
Q. A landslide occurred along the highway.
R. The highway was blocked.
S. Supply vehicles were delayed.

A. A landslide occurred along the highway → Heavy rainfall continued in the hills → The highway was blocked → Supply vehicles were delayed
B. Heavy rainfall continued in the hills → The highway was blocked → A landslide occurred along the highway → Supply vehicles were delayed
C. Heavy rainfall continued in the hills → A landslide occurred along the highway → Supply vehicles were delayed → The highway was blocked
D. Heavy rainfall continued in the hills → A landslide occurred along the highway → The highway was blocked → Supply vehicles were delayed

**Answer:** D. Heavy rainfall continued in the hills → A landslide occurred along the highway → The highway was blocked → Supply vehicles were delayed

**Explanation:** Heavy rainfall continued in the hills → A landslide occurred along the highway → The highway was blocked → Supply vehicles were delayed. This order follows the causal chain shown by the events.

**Family / variant:** CAE-FAM-HIDDEN-CHAIN / landslide
**causalStateId:** `projection:CAE-PLAN-SEQUENCE|family:CAE-FAM-HIDDEN-CHAIN|variant:landslide|graph:HIDDEN_CHAIN|direction:cause>bridge>effect>terminal|visible:cause,bridge,effect,terminal`
**itemVariantId:** `projection:CAE-PLAN-SEQUENCE|family:CAE-FAM-HIDDEN-CHAIN|variant:landslide|graph:HIDDEN_CHAIN|direction:cause>bridge>effect>terminal|visible:cause,bridge,effect,terminal|distractors:CAE-WORLD-HIDDEN-CHAIN-landslide:bridge|CAE-WORLD-HIDDEN-CHAIN-landslide:cause|CAE-WORLD-HIDDEN-CHAIN-landslide:effect|CAE-WORLD-HIDDEN-CHAIN-landslide:terminal,CAE-WORLD-HIDDEN-CHAIN-landslide:cause|CAE-WORLD-HIDDEN-CHAIN-landslide:bridge|CAE-WORLD-HIDDEN-CHAIN-landslide:terminal|CAE-WORLD-HIDDEN-CHAIN-landslide:effect,CAE-WORLD-HIDDEN-CHAIN-landslide:cause|CAE-WORLD-HIDDEN-CHAIN-landslide:effect|CAE-WORLD-HIDDEN-CHAIN-landslide:bridge|CAE-WORLD-HIDDEN-CHAIN-landslide:terminal|profile:NONE|presentation:CAE-WORLD-HIDDEN-CHAIN-landslide:bridge|CAE-WORLD-HIDDEN-CHAIN-landslide:cause|CAE-WORLD-HIDDEN-CHAIN-landslide:effect|CAE-WORLD-HIDDEN-CHAIN-landslide:terminal>CAE-WORLD-HIDDEN-CHAIN-landslide:cause|CAE-WORLD-HIDDEN-CHAIN-landslide:effect|CAE-WORLD-HIDDEN-CHAIN-landslide:bridge|CAE-WORLD-HIDDEN-CHAIN-landslide:terminal>CAE-WORLD-HIDDEN-CHAIN-landslide:cause|CAE-WORLD-HIDDEN-CHAIN-landslide:bridge|CAE-WORLD-HIDDEN-CHAIN-landslide:terminal|CAE-WORLD-HIDDEN-CHAIN-landslide:effect>CAE-WORLD-HIDDEN-CHAIN-landslide:cause|CAE-WORLD-HIDDEN-CHAIN-landslide:bridge|CAE-WORLD-HIDDEN-CHAIN-landslide:effect|CAE-WORLD-HIDDEN-CHAIN-landslide:terminal`
**Difficulty evidence:** distance=3; hiddenLinks=0; topology=4; credibleDistractors=0; candidateBurden=0; inference=3; score=14
**Distractor mechanisms:** REVERSE_CAUSATION, TEMPORAL_VIOLATION, INDIRECTNESS_CONFUSION

### MEDIUM — seed 8

Select the causally valid sequence.

P. A safety drill was announced.
Q. Classes moved to the assembly area.
R. Regular lessons paused.
S. The school timetable shifted for the day.

A. A safety drill was announced → Classes moved to the assembly area → The school timetable shifted for the day → Regular lessons paused
B. A safety drill was announced → Regular lessons paused → Classes moved to the assembly area → The school timetable shifted for the day
C. Classes moved to the assembly area → A safety drill was announced → Regular lessons paused → The school timetable shifted for the day
D. A safety drill was announced → Classes moved to the assembly area → Regular lessons paused → The school timetable shifted for the day

**Answer:** D. A safety drill was announced → Classes moved to the assembly area → Regular lessons paused → The school timetable shifted for the day

**Explanation:** A safety drill was announced → Classes moved to the assembly area → Regular lessons paused → The school timetable shifted for the day. This order follows the causal chain shown by the events.

**Family / variant:** CAE-FAM-CIVIC-SEQUENCE / drill
**causalStateId:** `projection:CAE-PLAN-SEQUENCE|family:CAE-FAM-CIVIC-SEQUENCE|variant:drill|graph:HIDDEN_CHAIN|direction:cause>bridge>effect>terminal|visible:cause,bridge,effect,terminal`
**itemVariantId:** `projection:CAE-PLAN-SEQUENCE|family:CAE-FAM-CIVIC-SEQUENCE|variant:drill|graph:HIDDEN_CHAIN|direction:cause>bridge>effect>terminal|visible:cause,bridge,effect,terminal|distractors:CAE-WORLD-CIVIC-SEQUENCE-drill:bridge|CAE-WORLD-CIVIC-SEQUENCE-drill:cause|CAE-WORLD-CIVIC-SEQUENCE-drill:effect|CAE-WORLD-CIVIC-SEQUENCE-drill:terminal,CAE-WORLD-CIVIC-SEQUENCE-drill:cause|CAE-WORLD-CIVIC-SEQUENCE-drill:bridge|CAE-WORLD-CIVIC-SEQUENCE-drill:terminal|CAE-WORLD-CIVIC-SEQUENCE-drill:effect,CAE-WORLD-CIVIC-SEQUENCE-drill:cause|CAE-WORLD-CIVIC-SEQUENCE-drill:effect|CAE-WORLD-CIVIC-SEQUENCE-drill:bridge|CAE-WORLD-CIVIC-SEQUENCE-drill:terminal|profile:NONE|presentation:CAE-WORLD-CIVIC-SEQUENCE-drill:cause|CAE-WORLD-CIVIC-SEQUENCE-drill:bridge|CAE-WORLD-CIVIC-SEQUENCE-drill:terminal|CAE-WORLD-CIVIC-SEQUENCE-drill:effect>CAE-WORLD-CIVIC-SEQUENCE-drill:cause|CAE-WORLD-CIVIC-SEQUENCE-drill:effect|CAE-WORLD-CIVIC-SEQUENCE-drill:bridge|CAE-WORLD-CIVIC-SEQUENCE-drill:terminal>CAE-WORLD-CIVIC-SEQUENCE-drill:bridge|CAE-WORLD-CIVIC-SEQUENCE-drill:cause|CAE-WORLD-CIVIC-SEQUENCE-drill:effect|CAE-WORLD-CIVIC-SEQUENCE-drill:terminal>CAE-WORLD-CIVIC-SEQUENCE-drill:cause|CAE-WORLD-CIVIC-SEQUENCE-drill:bridge|CAE-WORLD-CIVIC-SEQUENCE-drill:effect|CAE-WORLD-CIVIC-SEQUENCE-drill:terminal`
**Difficulty evidence:** distance=3; hiddenLinks=0; topology=4; credibleDistractors=0; candidateBurden=0; inference=3; score=14
**Distractor mechanisms:** INDIRECTNESS_CONFUSION, TEMPORAL_VIOLATION, REVERSE_CAUSATION

### MEDIUM — seed 9

Select the causally valid sequence.

P. A safety drill was announced.
Q. Classes moved to the assembly area.
R. Regular lessons paused.
S. The school timetable shifted for the day.

A. A safety drill was announced → Classes moved to the assembly area → The school timetable shifted for the day → Regular lessons paused
B. Classes moved to the assembly area → A safety drill was announced → Regular lessons paused → The school timetable shifted for the day
C. A safety drill was announced → Regular lessons paused → Classes moved to the assembly area → The school timetable shifted for the day
D. A safety drill was announced → Classes moved to the assembly area → Regular lessons paused → The school timetable shifted for the day

**Answer:** D. A safety drill was announced → Classes moved to the assembly area → Regular lessons paused → The school timetable shifted for the day

**Explanation:** A safety drill was announced → Classes moved to the assembly area → Regular lessons paused → The school timetable shifted for the day. This order follows the causal chain shown by the events.

**Family / variant:** CAE-FAM-CIVIC-SEQUENCE / drill
**causalStateId:** `projection:CAE-PLAN-SEQUENCE|family:CAE-FAM-CIVIC-SEQUENCE|variant:drill|graph:HIDDEN_CHAIN|direction:cause>bridge>effect>terminal|visible:cause,bridge,effect,terminal`
**itemVariantId:** `projection:CAE-PLAN-SEQUENCE|family:CAE-FAM-CIVIC-SEQUENCE|variant:drill|graph:HIDDEN_CHAIN|direction:cause>bridge>effect>terminal|visible:cause,bridge,effect,terminal|distractors:CAE-WORLD-CIVIC-SEQUENCE-drill:bridge|CAE-WORLD-CIVIC-SEQUENCE-drill:cause|CAE-WORLD-CIVIC-SEQUENCE-drill:effect|CAE-WORLD-CIVIC-SEQUENCE-drill:terminal,CAE-WORLD-CIVIC-SEQUENCE-drill:cause|CAE-WORLD-CIVIC-SEQUENCE-drill:bridge|CAE-WORLD-CIVIC-SEQUENCE-drill:terminal|CAE-WORLD-CIVIC-SEQUENCE-drill:effect,CAE-WORLD-CIVIC-SEQUENCE-drill:cause|CAE-WORLD-CIVIC-SEQUENCE-drill:effect|CAE-WORLD-CIVIC-SEQUENCE-drill:bridge|CAE-WORLD-CIVIC-SEQUENCE-drill:terminal|profile:NONE|presentation:CAE-WORLD-CIVIC-SEQUENCE-drill:cause|CAE-WORLD-CIVIC-SEQUENCE-drill:bridge|CAE-WORLD-CIVIC-SEQUENCE-drill:terminal|CAE-WORLD-CIVIC-SEQUENCE-drill:effect>CAE-WORLD-CIVIC-SEQUENCE-drill:bridge|CAE-WORLD-CIVIC-SEQUENCE-drill:cause|CAE-WORLD-CIVIC-SEQUENCE-drill:effect|CAE-WORLD-CIVIC-SEQUENCE-drill:terminal>CAE-WORLD-CIVIC-SEQUENCE-drill:cause|CAE-WORLD-CIVIC-SEQUENCE-drill:effect|CAE-WORLD-CIVIC-SEQUENCE-drill:bridge|CAE-WORLD-CIVIC-SEQUENCE-drill:terminal>CAE-WORLD-CIVIC-SEQUENCE-drill:cause|CAE-WORLD-CIVIC-SEQUENCE-drill:bridge|CAE-WORLD-CIVIC-SEQUENCE-drill:effect|CAE-WORLD-CIVIC-SEQUENCE-drill:terminal`
**Difficulty evidence:** distance=3; hiddenLinks=0; topology=4; credibleDistractors=0; candidateBurden=0; inference=3; score=14
**Distractor mechanisms:** INDIRECTNESS_CONFUSION, REVERSE_CAUSATION, TEMPORAL_VIOLATION

## CAE-CP-009 / CAE-QL-009

### MEDIUM — seed 0

Which event most logically completes the causal sequence?

Dense fog formed around the airport. → ? → Several departures were delayed.

A. Airport staff delayed a boarding announcement at one gate.
B. Smoke from a nearby field briefly drifted across the runway.
C. Passengers were moved to later flights.
D. Visibility on the runway fell sharply.

**Answer:** D. Visibility on the runway fell sharply.

**Explanation:** Dense fog formed around the airport → Visibility on the runway fell sharply → Several departures were delayed. The missing event is the only direct bridge between the shown events.

**Family / variant:** CAE-FAM-OPERATIONS-CHAIN / fog
**causalStateId:** `projection:CAE-PLAN-MISSING|family:CAE-FAM-OPERATIONS-CHAIN|variant:fog|graph:DIRECT_CHAIN|direction:cause>bridge>effect|visible:cause,effect`
**itemVariantId:** `projection:CAE-PLAN-MISSING|family:CAE-FAM-OPERATIONS-CHAIN|variant:fog|graph:DIRECT_CHAIN|direction:cause>bridge>effect|visible:cause,effect|distractors:CAE-WORLD-OPERATIONS-CHAIN-fog:authored:fog-boarding-announcement,CAE-WORLD-OPERATIONS-CHAIN-fog:authored:fog-runway-smoke,CAE-WORLD-OPERATIONS-CHAIN-fog:node:CAE-WORLD-OPERATIONS-CHAIN-fog:terminal|profile:NONE|presentation:CAE-WORLD-OPERATIONS-CHAIN-fog:authored:fog-boarding-announcement>CAE-WORLD-OPERATIONS-CHAIN-fog:authored:fog-runway-smoke>CAE-WORLD-OPERATIONS-CHAIN-fog:node:CAE-WORLD-OPERATIONS-CHAIN-fog:terminal>CAE-WORLD-OPERATIONS-CHAIN-fog:bridge`
**Difficulty evidence:** distance=2; hiddenLinks=1; topology=1; credibleDistractors=2; candidateBurden=5; inference=1; score=12
**Distractor mechanisms:** MAGNITUDE_MISMATCH (CREDIBLE_ALTERNATIVE), WRONG_SCOPE (CREDIBLE_ALTERNATIVE), REVERSE_CAUSATION (CLEAR_REJECT)

### HARD — seed 5

Which event most logically completes the causal sequence?

A safety drill was announced. → ? → Regular lessons paused.

A. The school timetable shifted for the day.
B. A safety drill was announced.
C. One class missed a few minutes of a lesson.
D. Classes moved to the assembly area.

**Answer:** D. Classes moved to the assembly area.

**Explanation:** A safety drill was announced → Classes moved to the assembly area → Regular lessons paused. The missing event is the only direct bridge between the shown events.

**Family / variant:** CAE-FAM-CIVIC-SEQUENCE / drill
**causalStateId:** `projection:CAE-PLAN-MISSING|family:CAE-FAM-CIVIC-SEQUENCE|variant:drill|graph:HIDDEN_CHAIN|direction:cause>bridge>effect|visible:cause,effect`
**itemVariantId:** `projection:CAE-PLAN-MISSING|family:CAE-FAM-CIVIC-SEQUENCE|variant:drill|graph:HIDDEN_CHAIN|direction:cause>bridge>effect|visible:cause,effect|distractors:CAE-WORLD-CIVIC-SEQUENCE-drill:authored:drill-one-class-delay,CAE-WORLD-CIVIC-SEQUENCE-drill:node:CAE-WORLD-CIVIC-SEQUENCE-drill:cause,CAE-WORLD-CIVIC-SEQUENCE-drill:node:CAE-WORLD-CIVIC-SEQUENCE-drill:terminal|profile:NONE|presentation:CAE-WORLD-CIVIC-SEQUENCE-drill:node:CAE-WORLD-CIVIC-SEQUENCE-drill:terminal>CAE-WORLD-CIVIC-SEQUENCE-drill:node:CAE-WORLD-CIVIC-SEQUENCE-drill:cause>CAE-WORLD-CIVIC-SEQUENCE-drill:authored:drill-one-class-delay>CAE-WORLD-CIVIC-SEQUENCE-drill:bridge`
**Difficulty evidence:** distance=2; hiddenLinks=1; topology=4; credibleDistractors=2; candidateBurden=11; inference=2; score=18
**Distractor mechanisms:** INDIRECTNESS_CONFUSION (CREDIBLE_ALTERNATIVE), MAGNITUDE_MISMATCH (CREDIBLE_ALTERNATIVE), REVERSE_CAUSATION (CLEAR_REJECT)

### MEDIUM — seed 1

Which event most logically completes the causal sequence?

Ferry departures were paused. → ? → Goods reached the market late.

A. The operator added an extra sailing after goods reached the market late.
B. Vehicles waited at the crossing.
C. Strong wind affected the ferry crossing.
D. A roadside repair slowed cars near another river crossing.

**Answer:** B. Vehicles waited at the crossing.

**Explanation:** Ferry departures were paused → Vehicles waited at the crossing → Goods reached the market late. The missing event is the only direct bridge between the shown events.

**Family / variant:** CAE-FAM-MISSING-BRIDGE / ferry
**causalStateId:** `projection:CAE-PLAN-MISSING|family:CAE-FAM-MISSING-BRIDGE|variant:ferry|graph:HIDDEN_CHAIN|direction:bridge>effect>terminal|visible:bridge,terminal`
**itemVariantId:** `projection:CAE-PLAN-MISSING|family:CAE-FAM-MISSING-BRIDGE|variant:ferry|graph:HIDDEN_CHAIN|direction:bridge>effect>terminal|visible:bridge,terminal|distractors:CAE-WORLD-MISSING-BRIDGE-ferry:authored:ferry-extra-sailing,CAE-WORLD-MISSING-BRIDGE-ferry:authored:ferry-other-crossing,CAE-WORLD-MISSING-BRIDGE-ferry:node:CAE-WORLD-MISSING-BRIDGE-ferry:cause|profile:NONE|presentation:CAE-WORLD-MISSING-BRIDGE-ferry:authored:ferry-extra-sailing>CAE-WORLD-MISSING-BRIDGE-ferry:effect>CAE-WORLD-MISSING-BRIDGE-ferry:node:CAE-WORLD-MISSING-BRIDGE-ferry:cause>CAE-WORLD-MISSING-BRIDGE-ferry:authored:ferry-other-crossing`
**Difficulty evidence:** distance=2; hiddenLinks=1; topology=4; credibleDistractors=2; candidateBurden=2; inference=1; score=14
**Distractor mechanisms:** INDIRECTNESS_CONFUSION (CREDIBLE_ALTERNATIVE), WRONG_SCOPE (CREDIBLE_ALTERNATIVE), REVERSE_CAUSATION (CLEAR_REJECT)

### MEDIUM — seed 4

Which event most logically completes the causal sequence?

The power supply to a cold-storage unit failed. → ? → Loading of perishable goods paused.

A. A short power fluctuation paused one loading bay.
B. The backup generator took time to start.
C. Dispatch vehicles left later than scheduled.
D. The power supply to a cold-storage unit failed.

**Answer:** B. The backup generator took time to start.

**Explanation:** The power supply to a cold-storage unit failed → The backup generator took time to start → Loading of perishable goods paused. The missing event is the only direct bridge between the shown events.

**Family / variant:** CAE-FAM-HIDDEN-CHAIN / cold-storage
**causalStateId:** `projection:CAE-PLAN-MISSING|family:CAE-FAM-HIDDEN-CHAIN|variant:cold-storage|graph:HIDDEN_CHAIN|direction:cause>bridge>effect|visible:cause,effect`
**itemVariantId:** `projection:CAE-PLAN-MISSING|family:CAE-FAM-HIDDEN-CHAIN|variant:cold-storage|graph:HIDDEN_CHAIN|direction:cause>bridge>effect|visible:cause,effect|distractors:CAE-WORLD-HIDDEN-CHAIN-cold-storage:authored:cold-storage-power-fluctuation,CAE-WORLD-HIDDEN-CHAIN-cold-storage:node:CAE-WORLD-HIDDEN-CHAIN-cold-storage:cause,CAE-WORLD-HIDDEN-CHAIN-cold-storage:node:CAE-WORLD-HIDDEN-CHAIN-cold-storage:terminal|profile:NONE|presentation:CAE-WORLD-HIDDEN-CHAIN-cold-storage:authored:cold-storage-power-fluctuation>CAE-WORLD-HIDDEN-CHAIN-cold-storage:bridge>CAE-WORLD-HIDDEN-CHAIN-cold-storage:node:CAE-WORLD-HIDDEN-CHAIN-cold-storage:terminal>CAE-WORLD-HIDDEN-CHAIN-cold-storage:node:CAE-WORLD-HIDDEN-CHAIN-cold-storage:cause`
**Difficulty evidence:** distance=2; hiddenLinks=1; topology=4; credibleDistractors=2; candidateBurden=7; inference=1; score=16
**Distractor mechanisms:** INDIRECTNESS_CONFUSION (CREDIBLE_ALTERNATIVE), WEAK_CAUSE (CREDIBLE_ALTERNATIVE), REVERSE_CAUSATION (CLEAR_REJECT)

### MEDIUM — seed 2

Which event most logically completes the causal sequence?

Visibility on the runway fell sharply. → ? → Passengers were moved to later flights.

A. Visibility on the runway fell sharply.
B. Several departures were delayed.
C. Airport staff delayed a boarding announcement at one gate.
D. A small number of passengers waited longer at one departure gate.

**Answer:** B. Several departures were delayed.

**Explanation:** Visibility on the runway fell sharply → Several departures were delayed → Passengers were moved to later flights. The missing event is the only direct bridge between the shown events.

**Family / variant:** CAE-FAM-OPERATIONS-CHAIN / fog
**causalStateId:** `projection:CAE-PLAN-MISSING|family:CAE-FAM-OPERATIONS-CHAIN|variant:fog|graph:DIRECT_CHAIN|direction:bridge>effect>terminal|visible:bridge,terminal`
**itemVariantId:** `projection:CAE-PLAN-MISSING|family:CAE-FAM-OPERATIONS-CHAIN|variant:fog|graph:DIRECT_CHAIN|direction:bridge>effect>terminal|visible:bridge,terminal|distractors:CAE-WORLD-OPERATIONS-CHAIN-fog:authored:fog-boarding-announcement,CAE-WORLD-OPERATIONS-CHAIN-fog:authored:fog-gate-wait,CAE-WORLD-OPERATIONS-CHAIN-fog:node:CAE-WORLD-OPERATIONS-CHAIN-fog:bridge|profile:NONE|presentation:CAE-WORLD-OPERATIONS-CHAIN-fog:node:CAE-WORLD-OPERATIONS-CHAIN-fog:bridge>CAE-WORLD-OPERATIONS-CHAIN-fog:effect>CAE-WORLD-OPERATIONS-CHAIN-fog:authored:fog-boarding-announcement>CAE-WORLD-OPERATIONS-CHAIN-fog:authored:fog-gate-wait`
**Difficulty evidence:** distance=2; hiddenLinks=1; topology=1; credibleDistractors=3; candidateBurden=6; inference=1; score=13
**Distractor mechanisms:** INDIRECTNESS_CONFUSION (CREDIBLE_ALTERNATIVE), MAGNITUDE_MISMATCH (CREDIBLE_ALTERNATIVE), WRONG_SCOPE (CREDIBLE_ALTERNATIVE)

### MEDIUM — seed 3

Which event most logically completes the causal sequence?

Trains were instructed to move cautiously through that section. → ? → Commuters reached later than usual.

A. A platform display system briefly failed at one station.
B. Train movement slowed down.
C. A station announced a short delay on one branch line.
D. Trains were instructed to move cautiously through that section.

**Answer:** B. Train movement slowed down.

**Explanation:** Trains were instructed to move cautiously through that section → Train movement slowed down → Commuters reached later than usual. The missing event is the only direct bridge between the shown events.

**Family / variant:** CAE-FAM-OPERATIONS-CHAIN / signal
**causalStateId:** `projection:CAE-PLAN-MISSING|family:CAE-FAM-OPERATIONS-CHAIN|variant:signal|graph:DIRECT_CHAIN|direction:bridge>effect>terminal|visible:bridge,terminal`
**itemVariantId:** `projection:CAE-PLAN-MISSING|family:CAE-FAM-OPERATIONS-CHAIN|variant:signal|graph:DIRECT_CHAIN|direction:bridge>effect>terminal|visible:bridge,terminal|distractors:CAE-WORLD-OPERATIONS-CHAIN-signal:authored:signal-branch-announcement,CAE-WORLD-OPERATIONS-CHAIN-signal:authored:signal-platform-display,CAE-WORLD-OPERATIONS-CHAIN-signal:node:CAE-WORLD-OPERATIONS-CHAIN-signal:bridge|profile:NONE|presentation:CAE-WORLD-OPERATIONS-CHAIN-signal:authored:signal-platform-display>CAE-WORLD-OPERATIONS-CHAIN-signal:effect>CAE-WORLD-OPERATIONS-CHAIN-signal:authored:signal-branch-announcement>CAE-WORLD-OPERATIONS-CHAIN-signal:node:CAE-WORLD-OPERATIONS-CHAIN-signal:bridge`
**Difficulty evidence:** distance=2; hiddenLinks=1; topology=1; credibleDistractors=2; candidateBurden=6; inference=1; score=12
**Distractor mechanisms:** INDIRECTNESS_CONFUSION (CREDIBLE_ALTERNATIVE), WRONG_SCOPE (CREDIBLE_ALTERNATIVE), WEAK_CAUSE (CLEAR_REJECT)

### MEDIUM — seed 6

Which event most logically completes the causal sequence?

Trains were instructed to move cautiously through that section. → ? → Commuters reached later than usual.

A. A platform display system briefly failed at one station.
B. Train movement slowed down.
C. A points failure slowed trains on a different branch line.
D. Passengers at one platform waited a few extra minutes.

**Answer:** B. Train movement slowed down.

**Explanation:** Trains were instructed to move cautiously through that section → Train movement slowed down → Commuters reached later than usual. The missing event is the only direct bridge between the shown events.

**Family / variant:** CAE-FAM-OPERATIONS-CHAIN / signal
**causalStateId:** `projection:CAE-PLAN-MISSING|family:CAE-FAM-OPERATIONS-CHAIN|variant:signal|graph:DIRECT_CHAIN|direction:bridge>effect>terminal|visible:bridge,terminal`
**itemVariantId:** `projection:CAE-PLAN-MISSING|family:CAE-FAM-OPERATIONS-CHAIN|variant:signal|graph:DIRECT_CHAIN|direction:bridge>effect>terminal|visible:bridge,terminal|distractors:CAE-WORLD-OPERATIONS-CHAIN-signal:authored:signal-branch-points,CAE-WORLD-OPERATIONS-CHAIN-signal:authored:signal-platform-display,CAE-WORLD-OPERATIONS-CHAIN-signal:authored:signal-platform-wait|profile:NONE|presentation:CAE-WORLD-OPERATIONS-CHAIN-signal:authored:signal-platform-display>CAE-WORLD-OPERATIONS-CHAIN-signal:effect>CAE-WORLD-OPERATIONS-CHAIN-signal:authored:signal-branch-points>CAE-WORLD-OPERATIONS-CHAIN-signal:authored:signal-platform-wait`
**Difficulty evidence:** distance=2; hiddenLinks=1; topology=1; credibleDistractors=2; candidateBurden=5; inference=1; score=12
**Distractor mechanisms:** MAGNITUDE_MISMATCH (CREDIBLE_ALTERNATIVE), WRONG_SCOPE (CREDIBLE_ALTERNATIVE), WEAK_CAUSE (CLEAR_REJECT)

### MEDIUM — seed 7

Which event most logically completes the causal sequence?

Ferry departures were paused. → ? → Goods reached the market late.

A. Ferry departures were paused.
B. Vehicles waited at the crossing.
C. A ticket check held one vehicle for a few minutes.
D. A roadside repair slowed cars near another river crossing.

**Answer:** B. Vehicles waited at the crossing.

**Explanation:** Ferry departures were paused → Vehicles waited at the crossing → Goods reached the market late. The missing event is the only direct bridge between the shown events.

**Family / variant:** CAE-FAM-MISSING-BRIDGE / ferry
**causalStateId:** `projection:CAE-PLAN-MISSING|family:CAE-FAM-MISSING-BRIDGE|variant:ferry|graph:HIDDEN_CHAIN|direction:bridge>effect>terminal|visible:bridge,terminal`
**itemVariantId:** `projection:CAE-PLAN-MISSING|family:CAE-FAM-MISSING-BRIDGE|variant:ferry|graph:HIDDEN_CHAIN|direction:bridge>effect>terminal|visible:bridge,terminal|distractors:CAE-WORLD-MISSING-BRIDGE-ferry:authored:ferry-other-crossing,CAE-WORLD-MISSING-BRIDGE-ferry:authored:ferry-ticket-check,CAE-WORLD-MISSING-BRIDGE-ferry:node:CAE-WORLD-MISSING-BRIDGE-ferry:bridge|profile:NONE|presentation:CAE-WORLD-MISSING-BRIDGE-ferry:node:CAE-WORLD-MISSING-BRIDGE-ferry:bridge>CAE-WORLD-MISSING-BRIDGE-ferry:effect>CAE-WORLD-MISSING-BRIDGE-ferry:authored:ferry-ticket-check>CAE-WORLD-MISSING-BRIDGE-ferry:authored:ferry-other-crossing`
**Difficulty evidence:** distance=2; hiddenLinks=1; topology=4; credibleDistractors=2; candidateBurden=3; inference=1; score=14
**Distractor mechanisms:** INDIRECTNESS_CONFUSION (CREDIBLE_ALTERNATIVE), WRONG_SCOPE (CREDIBLE_ALTERNATIVE), WEAK_CAUSE (CLEAR_REJECT)

### HARD — seed 8

Which event most logically completes the causal sequence?

A warehouse loading system stopped working. → ? → Delivery vehicles left late.

A. A warehouse loading system stopped working.
B. A loading-bay conveyor jammed during the morning dispatch.
C. A local shop rearranged shelves during opening hours.
D. Packages waited at the loading bay.

**Answer:** D. Packages waited at the loading bay.

**Explanation:** A warehouse loading system stopped working → Packages waited at the loading bay → Delivery vehicles left late. The missing event is the only direct bridge between the shown events.

**Family / variant:** CAE-FAM-MISSING-BRIDGE / supply
**causalStateId:** `projection:CAE-PLAN-MISSING|family:CAE-FAM-MISSING-BRIDGE|variant:supply|graph:HIDDEN_CHAIN|direction:cause>bridge>effect|visible:cause,effect`
**itemVariantId:** `projection:CAE-PLAN-MISSING|family:CAE-FAM-MISSING-BRIDGE|variant:supply|graph:HIDDEN_CHAIN|direction:cause>bridge>effect|visible:cause,effect|distractors:CAE-WORLD-MISSING-BRIDGE-supply:authored:supply-conveyor-jam,CAE-WORLD-MISSING-BRIDGE-supply:authored:supply-shelf-rearrangement,CAE-WORLD-MISSING-BRIDGE-supply:node:CAE-WORLD-MISSING-BRIDGE-supply:cause|profile:NONE|presentation:CAE-WORLD-MISSING-BRIDGE-supply:node:CAE-WORLD-MISSING-BRIDGE-supply:cause>CAE-WORLD-MISSING-BRIDGE-supply:authored:supply-conveyor-jam>CAE-WORLD-MISSING-BRIDGE-supply:authored:supply-shelf-rearrangement>CAE-WORLD-MISSING-BRIDGE-supply:bridge`
**Difficulty evidence:** distance=2; hiddenLinks=1; topology=4; credibleDistractors=2; candidateBurden=8; inference=2; score=17
**Distractor mechanisms:** MAGNITUDE_MISMATCH (CREDIBLE_ALTERNATIVE), INDIRECTNESS_CONFUSION (CREDIBLE_ALTERNATIVE), WRONG_SCOPE (CLEAR_REJECT)

### HARD — seed 9

Which event most logically completes the causal sequence?

Classes moved to the assembly area. → ? → The school timetable shifted for the day.

A. Classes moved to the assembly area.
B. A sports practice used a different school corridor.
C. A classroom projector fault paused one lesson.
D. Regular lessons paused.

**Answer:** D. Regular lessons paused.

**Explanation:** Classes moved to the assembly area → Regular lessons paused → The school timetable shifted for the day. The missing event is the only direct bridge between the shown events.

**Family / variant:** CAE-FAM-CIVIC-SEQUENCE / drill
**causalStateId:** `projection:CAE-PLAN-MISSING|family:CAE-FAM-CIVIC-SEQUENCE|variant:drill|graph:HIDDEN_CHAIN|direction:bridge>effect>terminal|visible:bridge,terminal`
**itemVariantId:** `projection:CAE-PLAN-MISSING|family:CAE-FAM-CIVIC-SEQUENCE|variant:drill|graph:HIDDEN_CHAIN|direction:bridge>effect>terminal|visible:bridge,terminal|distractors:CAE-WORLD-CIVIC-SEQUENCE-drill:authored:drill-projector,CAE-WORLD-CIVIC-SEQUENCE-drill:authored:drill-sports-practice,CAE-WORLD-CIVIC-SEQUENCE-drill:node:CAE-WORLD-CIVIC-SEQUENCE-drill:bridge|profile:NONE|presentation:CAE-WORLD-CIVIC-SEQUENCE-drill:node:CAE-WORLD-CIVIC-SEQUENCE-drill:bridge>CAE-WORLD-CIVIC-SEQUENCE-drill:authored:drill-sports-practice>CAE-WORLD-CIVIC-SEQUENCE-drill:authored:drill-projector>CAE-WORLD-CIVIC-SEQUENCE-drill:effect`
**Difficulty evidence:** distance=2; hiddenLinks=1; topology=4; credibleDistractors=2; candidateBurden=9; inference=2; score=17
**Distractor mechanisms:** INDIRECTNESS_CONFUSION (CREDIBLE_ALTERNATIVE), WRONG_SCOPE (CREDIBLE_ALTERNATIVE), WEAK_CAUSE (CLEAR_REJECT)
