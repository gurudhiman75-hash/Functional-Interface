# ENG-001 CP012 — Voice and Narration — Source Audit V1

Status: `IMPLEMENTATION_SOURCE_AUTHORITY_V1`

## Blueprint boundary

ENG-BLUEPRINT-001 assigns CP012 to **Voice and Narration**. The blueprint explicitly requires voice coverage for active/passive compatibility, tense preservation, object requirement, modal passive and impossible passive structures; narration coverage must include tense backshift, pronoun change, time/place expression change, questions, commands, universal truths and reporting verbs.

CP012 therefore owns errors created specifically by voice transformation or reported-speech structure. It does **not** take ownership of ordinary tense errors already covered by CP002, ordinary pronoun agreement/case covered by CP004, ordinary preposition choice covered by CP005, or non-finite selection covered by CP009 unless that form is part of the voice/narration construction itself.

## Sources inspected

### Grammar authorities

1. Cambridge Dictionary — English Grammar Today — **Passive voice**  
   https://dictionary.cambridge.org/us/grammar/british-grammar/passive-voice  
   Confirms the active/passive information structure, passive auxiliary + past participle, optional agent and the requirement that the patient becomes the passive subject.

2. Cambridge Dictionary — English Grammar Today — **Reported speech: indirect speech**  
   https://dictionary.cambridge.org/uk/grammar/british-grammar/reported-speech-indirect-speech  
   Confirms that reported statements, questions and commands use different clause patterns; reported yes/no questions use if/whether, wh-questions retain the wh-word, and commands use a to-infinitive structure.

3. British Council LearnEnglish — **Reported speech: questions**  
   https://learnenglish.britishcouncil.org/free-resources/grammar/b1-b2/reported-speech-questions  
   Confirms statement word order inside reported questions, if/whether for yes/no questions, ordinary tense/reference shifts, and request reporting patterns.

4. British Council LearnEnglish — **Reported speech: reporting verbs**  
   https://learnenglish.britishcouncil.org/free-resources/grammar/b1-b2/reported-speech-reporting-verbs  
   Used to bound reporting-verb complement behavior and to avoid treating every lexical reporting choice as interchangeable.

### Competitive-exam pattern audit

5. Testbook — **SSC CGL Voice Questions**  
   https://testbook.com/questions/ssc-cgl-voice-questions--660d677bcc55e4e79efe95ce  
   Shows recurring SSC-style active/passive transformations, including modal passive forms and preservation of the lexical verb form.

6. Testbook SSC CGL Tier-II memory-based paper — direct/indirect speech items  
   https://blogmedia.testbook.com/blog/wp-content/uploads/2023/03/ssc-cgl-tier-ii-6th-march-2023-memory-based-test-c4ab2a57.pdf  
   Includes narration items testing reporting verbs, pronoun shift, future backshift and time-expression shift.

7. Testbook SSC CGL model / previous-paper material — narration  
   https://blogmedia.testbook.com/blog/wp-content/uploads/2016/11/Live-Leak-SSC-CGL-Tier-II-English-Model-Question-Paper-2017.pdf  
   Includes question reporting, imperative reporting and the competitive-exam convention that a universal truth remains in the present tense.

## Coverage matrix

| Rule | Owner | Core exam pattern | Easy | Medium | Hard | Main ambiguity guard |
| --- | --- | --- | --- | --- | --- | --- |
| GR-VNR-001 | Voice | be + past participle | Yes | Yes | Yes | Prefer visibly distinct participles |
| GR-VNR-002 | Voice | tense/aspect passive chain | Yes | Yes | Yes | Explicit time/aspect cue |
| GR-VNR-003 | Voice | no ordinary passive for intransitives | Yes | Yes | Yes | Unambiguously intransitive sense |
| GR-VNR-004 | Voice | modal + be + V3 / modal perfect passive | Yes | Yes | Yes | Patient role explicit |
| GR-VNR-005 | Voice | passive subject must not be duplicated as object | Yes | Yes | Yes | Duplicate pronoun must be co-referential |
| GR-VNR-006 | Narration | statement backshift | Yes | Yes | Yes | Past reporting point explicitly anchored |
| GR-VNR-007 | Narration | speaker/addressee pronoun shift | Yes | Yes | Yes | Speaker/addressee made explicit |
| GR-VNR-008 | Narration | time/place reference shift | Yes | Yes | Yes | Later reporting time/place changes reference |
| GR-VNR-009 | Narration | reported questions | Yes | Yes | Yes | Linker/order error, not punctuation |
| GR-VNR-010 | Narration | commands/requests | Yes | Yes | Yes | Explicit addressee and speech act |
| GR-VNR-011 | Narration | universal-truth exception | No | Yes | Yes | Only indisputable timeless truths; mutation creates completed-past reading |
| GR-VNR-012 | Narration | reporting-verb complement pattern | No | Yes | Yes | Grammatical valency error, not stylistic preference |

## Difficulty policy

### Easy

- 20 authored scenes.
- Two scenes each for GR-VNR-001 through GR-VNR-010.
- Shorter dependencies and obvious structural errors.
- No universal-truth exception or reporting-verb valency as keyed families because both need more context to avoid prescriptive/descriptive ambiguity.

### Medium

- 24 authored scenes.
- Two scenes for every one of the 12 rules.
- Longer passive auxiliary chains, past-time narration anchors, multi-person pronoun mapping and explicit reference-point shifts.

### Hard

- 24 authored scenes.
- Two scenes for every one of the 12 rules.
- Modal perfect passives, embedded clauses, multi-participant reference, delayed reporting points and higher dependency distance.
- Hardness comes from structure and dependency, not obscure vocabulary.

Total authored scenes: **68**.

## Important ambiguity decisions

### Backshift

Modern English sometimes permits an unbackshifted form when the proposition still holds at the reporting time. CP012 does not key those debatable cases. GR-VNR-006 uses explicit past or completed reporting contexts so the mutated present form conflicts with the stated time frame.

### Universal truths

Competitive-exam keys commonly expect present tense to be retained for universal truths. Natural reported English is more flexible, so GR-VNR-011 is deliberately narrow: only explicit timeless truths are used, and the mutation turns them into a completed past-perfect event rather than relying on a marginal present-vs-simple-past preference.

### Time and place words

Words such as *today*, *tomorrow*, *here* and *this week* do not mechanically change in every report. GR-VNR-008 only keys a shift when the later reporting date or place is stated and the unshifted expression would point to the wrong reference.

### Reporting verbs

CP012 does not treat stylistic alternatives as errors. GR-VNR-012 is limited to standard complement restrictions such as **told me**, not *said me*; **explained to us**, not *explained us*; and **informed us**, not *informed to us*.

## Question-family mapping

CP012 uses the permanent ENG-001 families already established by earlier checkpoints:

- `ENG-001-QL001` — four-part error spotting, always one keyed error.
- `ENG-001-QL002` — three learner-visible sentence parts plus `No error`; the generator merges two safe authored segments without swallowing the keyed error.
- `ENG-001-QL007` — calibrated no-error item generated from the exact correct base sentence.

Every scene begins as a verified correct four-part sentence. Exactly one authored segment differs in the error form. No free-form LLM mutation occurs at runtime.

## Explanation policy

Each scene carries its own sentence-specific reason. The explanation must:

1. identify the keyed part,
2. explain the relevant voice/narration rule in plain language,
3. state why that exact form is required in the sentence, and
4. show the full corrected sentence.

No option-by-option analysis, shortcut language, or generic "this is grammatically incorrect" explanation is accepted.
