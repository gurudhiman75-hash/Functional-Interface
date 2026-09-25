# DIR-CP-007 Implementation Report

Status: English runtime implemented on a feature branch; manual product approval pending.

## Ownership

`DIR-CP-007` owns standard competitive-exam environmental orientation based on the explicit morning/evening sun convention. It excludes midday shadows, seasonal or latitude-dependent sun paths, scientific shadow length, and unspecified clock-time inference.

## Need-based QLs

| QL | Answer demand | Material distinction |
|---|---|---|
| `DIR-QL-030` | absolute sun or shadow direction | environmental direction without a person reference frame |
| `DIR-QL-031` | facing/walking direction from relative shadow side | enumerate the four possible cardinal person frames |
| `DIR-QL-032` | relative side of the shadow from a known facing | inverse person-frame projection with side-valued options |
| `DIR-QL-033` | morning or evening from facing and shadow side | inverse environmental-state reconstruction |
| `DIR-QL-034` | final facing after a shadow clue and turns | environmental inference followed by one to three rotations |
| `DIR-QL-035` | second person's facing | two linked person frames with same/opposite orientation |

Morning versus evening, standing versus walking, left/right/front/behind wording, object names and relation phrases are runtime variations rather than separate QLs.

## Runtime model

- morning → sun East → shadow West;
- evening → sun West → shadow East;
- four cardinal person facings;
- four person-relative shadow positions;
- independent facing and time-period enumeration;
- independent turn replay;
- independent second-person orientation;
- four unique misconception-labelled options;
- metadata `solveMode: null` under the open optional policy.

## Learner-facing contract

1. explicit morning/evening setting or uniquely inferable time demand;
2. state the sun–shadow convention;
3. translate the absolute shadow direction into the person's frame;
4. apply turns or person-to-person orientation only after the first frame is resolved;
5. direct conclusion;
6. plain sun–person–shadow diagram last.

The diagram always contains a compass, sun marker, shadow ray and absolute shadow label. Person-frame questions add a facing arrow; turn questions add a distinct final-facing arrow; mutual questions separate the second person from the first person's shadow path.

## Proof scope

- 6 QLs × 120 seeds = 720 deterministic cases;
- independent solver agreement for every answer family;
- both morning and evening for every QL;
- all four relative sides for QL-031 through QL-035;
- all four cardinal facings/answers for QL-031 through QL-035;
- one, two and three-turn coverage;
- same-direction and opposite-direction mutual relations;
- four unique options and exactly one correct answer;
- 120 distinct stems per QL;
- balanced answer positions;
- renderer role and layout contracts;
- 30-question HTML/JSONL review export.

## Review state

- English local mathematical/runtime proof: passed;
- English visual audit: passed;
- English exact-head CI: pending;
- English manual product approval: pending;
- Hindi: not started;
- Punjabi: not started;
- Question Studio exposure: not enabled;
- freeze status: not claimed.
