/** Individual source mapping, NOT a claim that each source answer ran through
 * the learner runtime. Arun Sharma2018, chapter printedIII.145–159.
 * MAPPED=existing mathematical family; EXTENSION=separate motion model;
 * QUARANTINE=defective or underspecified source; OTHER=other chapter. */
export type SourceDisposition="MAPPED"|"EXTENSION"|"QUARANTINE"|"OTHER";
export type SourceInventoryRow=Readonly<{level:1|2|3;question:number;owner:string;model:string;disposition:SourceDisposition;note:string}>;
function rows(level:1|2|3,text:string):SourceInventoryRow[]{
 return text.trim().split("\n").map(line=>{const[q,owner,model,disposition="MAPPED",note="Existing family; individual source answer is not certified by this mapping"]=line.split("|");return Object.freeze({level,question:Number(q),owner:owner!,model:model!,disposition:disposition as SourceDisposition,note});});
}
export const TSD_CHAPTER_SOURCE_INVENTORY:readonly SourceInventoryRow[]=Object.freeze([
 ...rows(1,`
1|CP004|Delayed pursuit with speed sum
2|CP001|Reduced speed and arrival delay
3|CP001|Equal-distance time difference
4|CP004|Delayed pursuit position
5|CP005|Post-meeting time speed ratio
6|GEOMETRY|Equilateral locations and compass directions|QUARANTINE|Orientation relative to compass is unspecified; do not copy the keyed path length
7|CP004|Delayed opposite-direction meeting
8|CP001|Reduced speed and time excess
9|CP002|Mixed-mode return time
10|CP010|Distance margin versus time margin
11|CP001|Mixed-unit travel time
12|CP002|Stops per elapsed hour
13|CP002|Unequal-distance time weighting
14|CP002|Time-weighted speed|QUARANTINE|Velocity requires direction; listed answer assumes straight unidirectional travel
15|CP002|Three equal-distance legs
16|CP001|Two late-arrival observations
17|CP002|Unequal-speed return distance
18|CP002|Equal-distance halves
19|CP001|Fixed-distance reduced time
20|CP002|Two-mode round trip
21|CP001|Periodic pole passage|QUARANTINE|Starting phase and endpoint counting are unspecified;3600 is an interval count
22|CP005|Post-meeting arrival ratio
23|SOURCE_EXTENSION|Moving receiver sound intervals|EXTENSION|Wave arrival interval requires moving-receiver equation
24|CP004|Visibility-limited relative separation
25|CP001|Equal-distance arrival difference
26|CP001|Speed difference and time difference inverse
27|CP001|Speed increase and time saving inverse
28|CP001|Walking speed inverse
29|CP001|Departure delay and speed increase|QUARANTINE|33.33percent is rounded; exact expected option uses one-third
30|CP002|Equal-distance average
31|CP006|Circular distance per period
32|CP002|Unknown segment speed|QUARANTINE|53.33 average is rounded; intended exact value160/3
33|CP002|Three equal-distance velocities
34|CP004|Opposite-direction meeting position
35|CP001|Reduced-speed lateness duplicateQ2
36|CP001|Equal-distance time difference
37|CP004|Delayed pursuit
38|CP005|Post-meeting ratio duplicateQ5
39|CP004|Simultaneous opposite meeting
40|GEOMETRY|Perpendicular displacements and diameter|OTHER|Pythagorean geometry, no time or speed observation
41|CP010|Two race handicaps
42|CP009|Return ratio and changed current
43|CP008|Pole and stationary train passage
44|CP009|Current inferred from time difference
45|CP009|Unequal legs bounded total time
46|CP009|Round-trip distance
47|CP009|Components from leg speeds
48|CP008|Moving passenger passage
49|CP009|Upstream travel time
50|CP009|Body speed from upstream distance and time
51|CP009|Additive downstream and upstream leg times
52|CP008|Same/opposite train passage inverse
53|CP010|Race distance margin
54|CP010|Start distance and winning time|QUARANTINE|1.66m/s is rounded; do not silently substitute5/3 for exact numerical certification
55|RATIO|Billiards score handicap|OTHER|Ratio topic; not motion
56|CP010|Headstart winning margin
57|CP008|Extended-body point passage
58|CP008|Moving passenger passage
59|CP004|Delayed pursuit
60|CP002|Stops per elapsed hour
61|CP009|Components from equal-time distances
62|CP009|Current and leg time ratio
63|CP009|Round-trip distance
64|CP008|Train passes stationary animal|QUARANTINE|Answer assumes stationary dog; motion of dog is not supplied
65|CP009|Components from ground speeds
66|CP009|Two unequal-leg time observations
67|CP009|Round-trip body-speed inverse
68|CP009|Symbolic components from leg speeds
69|CP006|Clock tip arc distance
70|CLK|Hour-minute coincidences
71|CLK|Coincidence time
72|CP009|Unequal legs current inverse
73|CP009|Round-trip current inverse
74|CP010|Transitive race speed ratios
75|CP009|Round-trip current inverse
76|CP010|Transitive handicaps and speed
77|CP010|Transitive winning margins
78|CP010|Race distance convention|QUARANTINE|Stem mixes track length with distance assigned to A; specify which is1km before authoring
79|CP010|Race length inverse
80|CP006|Three runners common position
81|CP006|Three runners common start return
82|CP006|Distance at common start return
83|CP001|Late departure compensated speed
84|CP001|Percentage speed increase
85|CP005|Reflected third meeting|QUARANTINE|Executed correction: third event5hours and Ram250km; printed312.5km counts only head-on meetings
`),
 ...rows(2,`
1|CP001|Delay recovered by faster residual leg
2|CP001|Delayed start and increased speed
3|CP001|Changed speed expressed by hourly distance
4|CP001|Three speed/time observations
5|CP005|Meeting and unequal arrival times
6|SOURCE_EXTENSION|Perpendicular separation inverse|EXTENSION|Requires two-dimensional distance
7|CP005|Meeting and arrival-time difference
8|CP004|Fractional route rates and meeting distance
9|CP004|Simultaneous arrival plus opposite meeting|QUARANTINE|1.33hours is rounded; source option assumes4/3hours
10|GEOMETRY|Right-triangle route with two speeds|EXTENSION|Geometry/time composition
11|CP006|Sum and difference meeting periods
12|CP012|Delayed pursuit with intermediate rest
13|CP002|Mixed-mode time reversal
14|CP005|Staggered start and post-meeting arrivals
15|CP001|Two residual distances and hypothetical times
16|TMW|Tank pump fill/drain inverse|OTHER|Work-rate chapter
17|CP012|Climb/slip terminal cycle
18|CP004|Delayed ships simultaneous arrival
19|CP012|Arithmetic distance increments
20|CP001|Stopped route speed recovery|QUARANTINE|66.666percent is rounded; intended residual150km
21|SOURCE_EXTENSION|Perpendicular separation speed ratio|EXTENSION|Requires vector displacement magnitude
22|CP004|Opposite meeting and delayed arrival
23|CP005|Meeting time and arrival gap
24|CP001|Speed difference and journey-time gap
25|CP012|Breakdown rest and walk back
26|CP012|Three-stage trajectory intersection|QUARANTINE|3.33mph stage is rounded; author exact10/3 or respect literal value
27|CP012|Three-stage trajectory intersection|QUARANTINE|SharedQ26 rounded stage data
28|CP012|Replace final travel mode|QUARANTINE|SharedQ26 rounded stage data
29|CP012|Extend final travel stage|QUARANTINE|SharedQ26 rounded stage data
30|CP012|Compare extended arrival times|QUARANTINE|SharedQ26 rounded stage data
31|CP001|Half-route stop recovery
32|CP006|Common return period and lap count
33|CP005|Early pickup saved time
34|CP005|Reflected swim with equal endpoint rests
35|CP012|Alternating fractions of remaining/completed route
36|CP012|Hourly opposite service encounter count
37|CP002|Symbolic unequal-stage travel time
38|SOURCE_EXTENSION|Moving receiver sound intervals|QUARANTINE|Sound speed is absent; cannot certify72km/h without adding330m/s
39|CP004|Overnight delayed opposite meeting
40|CP001|Overnight meeting clock time
41|CP005|Bird shuttle total distance
42|SOURCE_EXTENSION|Nth bird visit before collision|EXTENSION|Geometric convergence of repeated intercepts
43|SOURCE_EXTENSION|Infinite idealized bird visits|EXTENSION|Limit classification, not a finite itinerary
44|CP004|Leap length and frequency pursuit|QUARANTINE|Initial25leaps needs cat-leap or dog-leap unit; source assumes dog leaps
45|CP005|Reflected fourth meeting
46|CLK|Two faulty clocks next same display
47|CP009|Bounded round-trip minimum speed
48|CP009|Round trip with passenger stop
49|CP004|Clock departure difference and meeting position
50|CP001|Two breakdown-location delay observations
51|CP006|First overtake lap interval
52|CP002|Return-speed ratio and work stop
53|CP005|Reflected third time|MAPPED|Actual CP005 executed150/7seconds after unit normalization
54|CP005|Reflected third position|MAPPED|Actual CP005 executed100/7metres after unit normalization
55|CP012|Piecewise approach position|QUARANTINE|Distances supplied in feet but requested in metres; normalize explicitly
56|CP012|Piecewise approach meeting
57|CP006|Overtakes before common return
58|CP005|Explicit head-on-only second meeting inverse
59|CP005|Explicit head-on-only speed ratio inverse
60|CLK|Clock angle and exit-time sum|QUARANTINE|30degree entry angle has two times; truncating seconds does not remove ambiguity
`),
 ...rows(3,`
1|CP005|Meeting then changed speeds
2|CP004|Equal-time distance ratio with speed difference
3|CP005|Staggered arrivals and endpoint return
4|SOURCE_EXTENSION|Perpendicular separation inverse|EXTENSION|Two-dimensional displacement
5|GEOMETRY|Changing triangle shape along two rays|EXTENSION|Angle geometry with simultaneous positions
6|GEOMETRY|Right-to-equilateral moving triangle|QUARANTINE|6.66km is rounded; exact proof must state20/3 assumption
7|CP002|Equal-time mixed speed and three arrival times|QUARANTINE|33.33minutes rounded; intended100/3minutes
8|CP005|Staggered three-runner return intersections
9|CP004|Two delayed pursuit events
10|CP005|Post-meeting arrival product
11|CP006|Meeting periods and local arc separation
12|CP004|Two route-fraction separation observations
13|CP004|Route distance from same observations
14|SOURCE_EXTENSION|Deceleration and collision avoidance|EXTENSION|Continuous acceleration is a separate kinematic model
15|SOURCE_EXTENSION|Minimum separation on triangular routes|EXTENSION|Quadratic relative-position minimization with endpoint domain
16|CP001|Two stop-recovery observations
17|SOURCE_EXTENSION|Closest perpendicular routes|EXTENSION|Quadratic relative-position minimization
18|SOURCE_EXTENSION|Accelerated residual route versus constant legs|EXTENSION|Continuous acceleration, not constant-stage sampling
19|SOURCE_EXTENSION|Fastest highway departure point|EXTENSION|Convex route-time minimization
20|SOURCE_EXTENSION|Polynomial velocity and acceleration|EXTENSION|Derivative of exact velocity polynomial
21|SOURCE_EXTENSION|Sampled polynomial speed distance|QUARANTINE|Executed signed sum14m but distance22m; source asks distance and offers14m
22|CP009|Raft/launch arrival inequality|QUARANTINE|Stem fixes body speed5below current8 but asks rangeV; cannot travel upstream as printed
23|CP005|Pursuit return-time minimization|QUARANTINE|Stem fixes pedestrian5 but asks variablev; specify optimization variable
24|CP005|Overtake then endpoint return|QUARANTINE|8.33km is rounded; intended25/3km
25|SOURCE_EXTENSION|Polynomial velocity derivative|EXTENSION|Continuous acceleration
26|SOURCE_EXTENSION|Discrete polynomial travel distance|QUARANTINE|Executed displacement minus7m and distance27m; neither occurs among printed options
27|SOURCE_EXTENSION|Accelerated pursuit|QUARANTINE|Meeting exactly at18m requires chaser9m/s; interval5<S<9 applies to overtaking before18m
28|CP009|Drifting time and two round-trip observations|MAPPED|Exact current-normalized body speed5:1 satisfies both10h and7h round trips; downstream4h
29|CP004|Unsigned separation before or after crossing
30|CP005|Post-meeting total duration
31|CP005|Cyclist repeatedly collects pedestrian
32|CP012|Three arrivals and changed-stage speed|QUARANTINE|104.66km rounded; intended314/3km
33|CP004|Two fractional-distance observations
34|CP004|Three pairwise meeting times
35|CP005|Delayed pursuit then endpoint return
36|CP004|Unsigned separation with speed difference
37|CP005|Two reflected meeting points and time gap
38|CP012|Return detour and waiting with common arrival
39|CP004|Two delayed overtakes
40|CP006|Meeting periods and local arc separation
41|CP004|Delayed halfway meeting and simultaneous meeting
42|CP004|Cyclist meets then overtakes two pedestrians
43|SOURCE_EXTENSION|Shared ride back and changed passenger membership|EXTENSION|Separate pickup/dropoff itinerary
44|SOURCE_EXTENSION|Speed from shared-ride time saving|EXTENSION|Same itinerary asQ43
45|SOURCE_EXTENSION|Mid-route dropoff then pickup|EXTENSION|Separate rider membership and endpoint arrivals
46|CP009|Doubled body speed round-trip ratio|EXTENSION|Exact radical inverse result needs symbolic squared-speed representation
47|CLK|Piecewise faulty clock rates
48|CLK|Common strike time from hourly rates
49|CP009|Log and return-boat meeting
50|CP009|Two boats assisted/opposed ratios
`),
]);
