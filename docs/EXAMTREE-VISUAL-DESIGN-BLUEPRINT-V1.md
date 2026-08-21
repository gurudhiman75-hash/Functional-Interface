# Examtree Visual Design Blueprint V1

Status: **Design direction candidate — implementation not yet started**  
Baseline: `New-main` at `89bee37171ada40cba405b334e642900f6789bab`  
Scope: Student-facing Examtree website and preparation workspace  
Primary goal: Make Examtree feel more focused, premium, distinctive, and trustworthy without sacrificing the production-ready accessibility, reliability, SEO, catalog scale, multilingual, and exam-runner work already completed.

---

## 1. Product design position

Examtree should not look like another generic purple SaaS dashboard and should not visually clone Testbook, Oliveboard, Unacademy, or Adda247.

The target is:

> **Testbook-level decision density + Oliveboard-level exam credibility + Unacademy-level visual restraint + a more coherent Examtree preparation workspace.**

Examtree should feel:

- serious, not playful;
- modern, not trendy-for-trend's-sake;
- dense where students need comparison data, calm where they need focus;
- exam-specific rather than generic edtech;
- premium without appearing expensive or ornamental;
- distinctly Examtree even when competitor logos are removed from a comparison.

The existing indigo / teal family is acceptable and should remain recognizable. The redesign must come primarily from hierarchy, typography, spacing, layout, card anatomy, iconography, content density, and interaction — not from replacing the palette.

---

## 2. Competitor reference study

### 2.1 Testbook — learn from information architecture

Observed strengths:

- Test-series cards expose useful decision data before click-through: users, test counts, free-test counts, languages, live tests, PYQs, chapter tests, and series depth.
- Exam discovery is commercially direct and easy to scan.
- Student intent is translated quickly into an exam → series → test path.

What Examtree should borrow:

- high-value metadata on test-series cards;
- obvious free-vs-premium distinction;
- fast exam-family discovery;
- compact but useful card comparison.

What Examtree should avoid:

- excessive merchandising density;
- too many simultaneous badges;
- banner-heavy promotional hierarchy;
- visual noise competing with the preparation task.

Reference: https://testbook.com/

### 2.2 Oliveboard — learn from trust and exam credibility

Observed strengths:

- Strong trust proof through results, AIR/topper stories, mock-test volume, ratings, and exam credibility.
- Exam pages explain exactly what is included: full mocks, sectional tests, topic tests, previous-year papers, languages, latest patterns, and analysis.
- Real-exam familiarity and post-test analysis are positioned as important outcomes, not incidental features.

What Examtree should borrow:

- results/credibility areas once genuine Examtree proof exists;
- explicit test-series composition;
- outcome-oriented presentation: accuracy, speed, weak areas, exam readiness;
- strong “why this series” clarity on exam detail pages.

What Examtree should avoid:

- long SEO pages becoming the default interaction model;
- repeated category menus dominating the experience;
- excessive vertical repetition.

References:
- https://www.oliveboard.in/
- https://www.oliveboard.in/test-series/

### 2.3 Unacademy — learn from restraint

Observed strengths:

- Test-series detail pages have a clear title, metadata, then a small number of content structures such as About / Schedule / Syllabus.
- Navigation and page content are less visually boxed than typical exam-prep competitors.
- Strong use of whitespace and clear grouping.

What Examtree should borrow:

- fewer container boundaries;
- clearer section rhythm;
- tabs only where they organize meaningful complexity;
- large type and simple content grouping.

What Examtree should avoid:

- educator/course-first patterns that do not match Examtree's mock-test-first product;
- unnecessarily sparse catalog cards where exam candidates need comparison data.

References:
- https://unacademy.com/goal/-/KSCGY/test-series/all?test-type=1
- https://unacademy.com/test-series/unacademy-all-india-prelims-test-series-2026/PP3M2O4F

### 2.4 Adda247 — learn from market expectations, not visual density

Use Adda247 mainly as a reminder of what Indian government-exam students expect to find quickly: exam categories, live tests, test series, PYQs, preparation resources, language support, and strong CTAs.

Examtree should deliberately be calmer and more product-led.

---

## 3. Current Examtree visual diagnosis

The current frontend is functionally strong but visually over-contained.

Examples visible in current production code:

- `home.tsx` repeatedly uses `rounded-2xl + border + shadow` for hero, information panels, exam pathways, exam cards, progress areas, and utility blocks.
- The hero contains another large card, then cards inside that card, producing nested visual boxes rather than one clear composition.
- A full-width indigo metrics bar appears before the main hero, which makes catalog counts compete with the primary value proposition.
- Many sections use uppercase 11–12 px eyebrow labels with wide tracking. Individually they work; repeated across nearly every block they make the interface feel templated.
- `PublicPage.tsx` gives many public pages the same large dark-indigo banner regardless of the page's content or importance.
- `CatalogTestBrowser.tsx` places all controls and all tests inside one large card, then each test inside another card, creating a “dashboard widget” feel rather than an exam marketplace / preparation library.
- The public navigation is usable but visually generic and does not yet establish a strong exam-preparation identity.

The redesign therefore focuses on **reducing container count and increasing information hierarchy**, not simply restyling borders.

---

## 4. Core visual principles

### Principle A — hierarchy before decoration

Every page must have one obvious visual priority. Secondary areas should look secondary.

### Principle B — cards represent objects, not layout

Use cards for things a student can mentally treat as an object:

- exam family;
- test series;
- individual mock test;
- active attempt;
- result;
- recommendation;
- performance insight.

Do not automatically card-wrap:

- headings;
- section intros;
- search areas;
- filters;
- descriptive text;
- basic navigation groups.

### Principle C — one dominant accent per viewport

Indigo is the primary brand/action colour. Teal is the progress/success/secondary accent. Other colours are semantic or exam-family accents and must not compete with the primary action.

### Principle D — quiet by default, dense by intent

Marketing hero and dashboard overview: calm.  
Test-series comparison and test library: dense enough to make decisions.  
Exam runner: highly focused, minimal ornament.

### Principle E — real product proof instead of generic feature cards

Where possible, show:

- a score or percentile panel;
- a mock test card;
- an attempt progress strip;
- a performance insight;
- exam-series composition.

Avoid rows of generic “feature” tiles unless they convey unique information.

### Principle F — responsive composition, not desktop shrinkage

Mobile layouts must be designed separately where necessary. Desktop navigation, filters, and multi-column dashboards should not merely collapse mechanically.

---

## 5. Visual foundation

### 5.1 Colour roles

Keep existing Examtree identity but formalize roles.

**Brand / Ink Indigo**  
`#1E1B4B` — brand anchor, selective dark surfaces, logo, highest-emphasis text on special surfaces.

**Primary Action Indigo**  
Use an accessible `indigo-600/700` implementation token for interactive actions. Do not use the very dark brand indigo for every button.

**Progress Teal**  
Use `teal-600/700` for progress, positive movement, active learning state, secondary action where appropriate.

**Canvas**  
Near-white cool neutral. Preferred page canvas should be lighter and quieter than current repeated grey cards.

**Surface**  
White.

**Raised Surface**  
White with subtle border or subtle shadow — rarely both strongly.

**Text**  
Slate 950 / 700 / 500 hierarchy.

**Semantic**  
Emerald = free/success  
Amber = premium/warning  
Rose = destructive/error  
Blue/sky = informational only where useful

### 5.2 Surface rules

Use four explicit surface levels:

1. `canvas` — page background, no border;
2. `surface` — white section/body region, normally no shadow;
3. `interactive-surface` — bordered object, hover elevation allowed;
4. `elevated-surface` — overlays, floating selector, priority action; subtle shadow.

Rule: a component should normally use **border OR shadow as its main separation device**, not strong versions of both.

### 5.3 Radius system

Reduce the current “everything rounded-2xl” effect.

Proposed radii:

- controls / compact chips: 8 px;
- buttons / inputs / compact cards: 10 px;
- standard cards: 12 px;
- hero/media panels: 16 px;
- pills: full radius only for true pills/status chips.

Avoid 20–24 px radius unless the visual form genuinely benefits from it.

### 5.4 Shadow system

**Shadow 0** — none; default.  
**Shadow 1** — subtle object separation.  
**Shadow 2** — active/elevated card, popover, command/search panel.  
**Shadow 3** — rare modal or major floating surface.

Avoid permanent 30 px spread-like shadows on every content card.

### 5.5 Border system

- default border: slate-200 / low contrast;
- selected object: indigo-300/400 plus clear state, not thick glow rings by default;
- category accent: a small icon background or 2–3 px marker, not a mandatory 4 px left border on every exam card;
- dashed borders only for empty/drop states.

---

## 6. Typography system

### 6.1 Typeface strategy

Requirement: excellent Latin + Hindi + Punjabi readability.

Implementation candidate:

- UI Latin: Inter Variable or a comparable neutral grotesk;
- Devanagari: Noto Sans Devanagari;
- Gurmukhi: Noto Sans Gurmukhi;
- resilient system fallbacks.

Do not load a heavy multi-font bundle before measuring performance. Font loading must preserve the CP05 startup work.

### 6.2 Type scale

**Marketing display**  
48–56 desktop / 36–40 mobile, 1.05–1.12 line height.

**Public page H1**  
40–48 desktop / 32–36 mobile.

**App page H1**  
30–34 desktop / 26–30 mobile.

**H2**  
24–28.

**H3 / card title**  
17–20.

**Body large**  
17–18.

**Body**  
15–16.

**Metadata**  
13–14.

**Micro**  
12 minimum for meaningful visible text where practical.

### 6.3 Eyebrow policy

Uppercase tracked labels become a rare accent, not a section template.

Use them for:

- one hero category label;
- small status groups;
- data labels where scanning benefits.

Prefer normal sentence-case section labels elsewhere.

---

## 7. Spacing and grid

### 7.1 Base spacing

Use a 4 px base with a deliberate 8 px rhythm.

Primary values: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96.

### 7.2 Public layout width

- default max content: 1200–1240 px;
- reading content: 720–800 px;
- wide data/catalog surfaces: up to 1320 px only where the extra width improves comparison.

### 7.3 Section rhythm

Public homepage desktop: typically 80–104 px between major sections.  
App workspace: 28–40 px between major regions.  
Mobile public: 56–72 px.  
Mobile app: 20–28 px.

Whitespace should replace many decorative separators.

---

## 8. Iconography and exam identity

### 8.1 Global iconography

Continue with Lucide for interface icons. Keep the CP05C bounded/tree-shakable import discipline.

Interface icons should normally be 16–20 px. Decorative 24–28 px icons should be rare.

### 8.2 Exam-family identity

Create a consistent exam identity system instead of treating every category as a generic card.

Each exam family gets:

- a recognizable icon/mark;
- one restrained tint/accent;
- abbreviation treatment where useful;
- consistent cover geometry.

Examples:

- SSC: structured shield/grid motif;
- Banking: institutional / ledger motif;
- Railways: motion / rail motif;
- Punjab/state exams: state/institution motif;
- Teaching: academic motif;
- Defence: disciplined crest motif.

Do not create a different UI colour palette for every category. The identity should be subtle and remain subordinate to Examtree brand colours.

---

## 9. Navigation architecture

### 9.1 Public navigation

Desktop target:

**Logo** | Exams | Mock Tests | PYQs | Practice/Resources | Search | Sign in | Primary CTA

Changes from current structure:

- reduce low-priority nav links in the top bar;
- move FAQ/About into footer/support areas;
- introduce a prominent search / command affordance;
- allow Exams to become a useful discovery menu when catalog depth warrants it;
- authenticated state should prioritize “Continue preparation” / dashboard.

### 9.2 App navigation

The preparation workspace should not feel like the public site plus a giant sidebar.

Desktop target:

- 220–240 px navigation when expanded, or a compact rail after usage patterns justify it;
- dark indigo may remain, but reduce its visual mass and heavy contrast;
- group navigation: Prepare / Progress / Account;
- selected exam context near the top;
- active test/resume state visible without dominating all pages.

### 9.3 Mobile navigation

Public:

- compact top bar;
- search and menu clearly accessible;
- avoid hiding the core “Find your exam” action behind multiple taps.

App:

Candidate direction is a bottom navigation for 4–5 highest-frequency destinations plus contextual top actions. Validate against runner routes before implementation.

---

## 10. Canonical component redesigns

### 10.1 Exam Family Tile

Purpose: choose an exam family quickly.

Anatomy:

- compact identity mark;
- exam family name;
- one useful count, e.g. `42 test series` or `1,240 tests` if truthful;
- optional short descriptor;
- arrow/hover affordance.

It should not look like a full test-series card.

### 10.2 Test Series Card — signature Examtree component

This is the most important discovery object.

Recommended anatomy:

```
[exam mark]  SSC CGL Mock Test Series 2026        [Free/Premium]
             Tier I + Tier II

2,348 tests    68 free    English · Hindi · Punjabi

5 Live tests   139 PYQs   79 Chapter tests

Popular with 2.0M learners         View series →
```

Only show values backed by real data. Hide unavailable dimensions rather than inventing them.

Visual behavior:

- 12 px radius;
- white surface;
- one quiet border;
- title is dominant;
- metadata has clear hierarchy;
- chips are limited;
- hover shifts border/elevation subtly, no large translate animation;
- whole card may be clickable, but must retain accessible focus treatment.

### 10.3 Individual Mock Test Row/Card

A test is operational, so it should feel closer to a task row than a marketing card.

Desktop candidate:

```
SSC CGL Full Mock 08               FREE
100 questions · 60 min · Medium
English · Hindi
2.4k attempts                     Start test →
```

Use compact rows in dense series pages; use cards only in recommendations/homepage modules.

### 10.4 Attempt / Resume Card

Should show:

- test name;
- completion percentage;
- time remaining where valid;
- last activity;
- one dominant Resume action.

Avoid feature-style prose.

### 10.5 Performance Insight

Should show a decision, not just a metric.

Example:

**Quant is costing you time**  
Accuracy is stable at 84%, but average response time increased 11% across your last 3 mocks.  
`Practice timed Quant →`

Only implement when the backend actually supports the insight.

---

## 11. Homepage redesign blueprint

The homepage becomes a decision surface, not a catalog dashboard.

### 11.1 Header

Calm white header, approximately 64–68 px tall.

Primary emphasis:

- brand;
- exam discovery;
- search;
- mock tests;
- authenticated preparation CTA.

### 11.2 Hero

Remove the separate top catalog-count banner.

Candidate copy direction:

**Prepare with tests that feel like the exam.**

Supporting copy should emphasize real published mocks, multilingual delivery, detailed solutions/review, and preparation continuity.

Primary CTA: **Explore mock tests**  
Secondary CTA: **Take a free test**

Right-side proof should be a real product composition rather than 4 generic feature cards.

Candidate visual:

- one test card;
- one result/performance mini panel;
- one progress strip;
- subtle layered composition on neutral background.

No fake score/percentile should appear in production. Until genuine user performance is available on anonymous home, use a clearly labeled product-preview representation or real catalog data.

### 11.3 Exam finder

Immediately below hero:

**What are you preparing for?**

- search field;
- 6–8 high-priority exam-family tiles;
- `View all exams`.

This should be faster to scan than the current large “Exam pathways” card.

### 11.4 Continue preparation — authenticated only

Place high on page for signed-in students.

- resume active attempt;
- most recent completed result;
- next recommended action when supported.

Anonymous visitors do not see an empty placeholder.

### 11.5 Popular / recommended test series

Use the new signature Test Series Card.

Desktop: 2–3 columns depending card density.  
Mobile: single column or horizontal snap only if usability testing supports it.

### 11.6 Free mock spotlight

A stronger standalone region:

**Start with a free mock**

- one featured free test;
- compact alternative list;
- factual time/questions/languages.

### 11.7 Product proof: analysis

Headline direction:

**A score is useful. Knowing what to fix is better.**

Show real result UI patterns:

- score;
- accuracy;
- time per question;
- section comparison;
- weak/strong areas if supported.

### 11.8 Credibility / trust

Do not fabricate social proof.

When genuine data exists, use:

- total attempted mocks;
- active learners;
- verified selections / ranks;
- app rating if real;
- testimonial evidence.

Until then, omit the section instead of using generic numbers.

### 11.9 Footer

Keep current useful structure but simplify typography and remove unnecessary marketing repetition.

---

## 12. Public page archetypes

The current `PublicPage` dark-header card should not remain the universal template.

Create three archetypes:

### A. Editorial / support page

For About, FAQ, Contact, policies.

- simple page title on canvas;
- narrow reading width;
- no giant dark banner;
- sections separated by whitespace and typography.

### B. Discovery page

For Exams, Mock Tests, PYQs.

- compact page intro;
- search/filter region;
- results directly on canvas;
- no outer “everything card”.

### C. Exam landing / test-series page

- breadcrumb;
- exam identity + title + series metadata;
- strong primary action;
- tab/anchor navigation where useful;
- test groups / series details / exam benefits / FAQs as separate sections.

---

## 13. Catalog browser redesign

Current problem: one large wrapper card + seven controls + card grid creates a control-panel feel.

New structure:

1. Page heading on canvas.
2. Search bar as primary control.
3. Compact filter button/chips; desktop may expose the most useful 2–3 filters and place the rest in a popover/drawer.
4. Result count + sort aligned in a small utility row.
5. Tests rendered as dense, consistent operational objects.
6. Pagination / load-more depending measured catalog behavior.

Desktop filter priority candidate:

- Exam family;
- Free/Premium;
- Test type;
- Language;
- Difficulty;
- Sort.

Mobile filters belong in a sheet/drawer rather than six stacked selects.

---

## 14. Logged-in dashboard blueprint

The dashboard must answer three questions immediately:

1. **What should I do now?**
2. **How am I doing?**
3. **What should I improve next?**

Desktop composition candidate:

### Row 1 — identity + primary action

**Good evening**  
`SSC CGL preparation`

Main object: active/resumable test.

### Row 2 — preparation status

- recent score / average where real;
- accuracy;
- tests completed;
- time practiced or another real supported metric.

Metrics should not all be separate large cards. Use one coherent status region.

### Row 3 — next action + recent attempts

Left: recommended/free/next test.  
Right: recent attempts list.

### Row 4 — areas to improve

Only when supported by trustworthy analytics.

No decorative feature cards.

---

## 15. Result / performance design direction

Result presentation is a major opportunity for Examtree differentiation.

The page should progressively answer:

- What did I score?
- Was that good relative to the exam/attempt population if rank data is real?
- Where did marks come from?
- Where did I lose marks?
- Was accuracy or speed the bigger issue?
- What should I practice next?

Visual order:

1. result headline;
2. primary score / completion status;
3. section breakdown;
4. accuracy and time analysis;
5. question review;
6. recommended next action.

Avoid a dashboard of ten equal metric cards.

---

## 16. Runner visual refinement direction

Runner redesign comes after discovery/dashboard because its interaction reliability is already heavily protected.

Goals:

- keep question reading area dominant;
- reduce decorative chrome;
- maintain exact exam-like behavior where required;
- improve option spacing, question hierarchy, section navigation, palette clarity, and mobile ergonomics without changing attempt semantics.

No visual redesign may regress timer, draft, submit, recovery, keyboard, dialog, zoom, or accessibility protections already certified.

---

## 17. Motion and interaction

Motion should communicate state.

Recommended duration:

- 120–160 ms: button/control feedback;
- 160–220 ms: cards, tabs, menus;
- 220–280 ms: drawers/sheets/major layout transitions.

Avoid:

- permanent floating animation;
- large hover translation (`-translate-y-1`) on every card;
- glowing rings as ordinary hover treatment;
- animated gradients in primary preparation flows.

Prefer:

- border/elevation change;
- 1–2 px movement at most;
- progress animation;
- skeletons;
- tab/selection transitions;
- discreet success feedback.

Respect `prefers-reduced-motion`.

---

## 18. Mobile design rules

### Public

- hero copy shorter;
- CTA buttons can stack;
- product proof becomes one clear preview, not multiple miniature cards;
- exam family tiles 2 columns or horizontal quick selector based on content length;
- filters move into a bottom sheet/drawer;
- minimum 44 px touch targets retained.

### Preparation workspace

- bottom navigation candidate for Dashboard / Tests / Activity / Profile;
- selected exam appears in compact header/context control;
- avoid a desktop-style sidebar drawer as the only navigation model;
- active attempt/resume should be reachable in one tap when present.

### Test cards

Do not reduce metadata to unreadable chips. Prefer 2–3 useful lines with progressive disclosure.

---

## 19. Accessibility is part of the visual system

The redesign must retain or improve:

- WCAG AA text contrast;
- existing skip links;
- 44 px touch targets where required;
- visible keyboard focus;
- semantic headings;
- 200% zoom/reflow behavior;
- modal focus semantics;
- reduced motion support;
- multilingual text rendering;
- no meaning by colour alone.

Aesthetic polish cannot come from lowering contrast or reducing target sizes.

---

## 20. Performance constraints

The visual redesign must respect CP05 production work.

Do not:

- add a large illustration library to startup;
- reintroduce whole-library Lucide imports;
- add heavy animation frameworks unless justified and measured;
- globally preload authenticated/catalog code on anonymous routes;
- add blocking web fonts without a measured strategy.

Design prototypes should prefer CSS, existing Lucide icons, and lightweight static assets.

---

## 21. Design implementation phases

### D01 — Visual foundation and reference prototype

Deliverables:

- this blueprint;
- token mapping proposal;
- Homepage V1 reference implementation on a separate branch;
- responsive desktop/mobile proof;
- no production merge until design direction is approved.

### D02 — Public shell

- header/navigation;
- footer;
- public typography/layout primitives;
- page archetypes.

### D03 — Homepage

- hero;
- exam finder;
- authenticated continuation;
- popular series;
- free mock spotlight;
- product proof.

### D04 — Exam/category discovery

- exam-family tile;
- category/subcategory pages;
- exam finder/search.

### D05 — Test series + catalog objects

- signature test-series card;
- compact mock-test row/card;
- filters and sort.

### D06 — Exam/test-series detail

- exam identity header;
- series composition;
- tests list;
- sticky primary action where appropriate.

### D07 — Logged-in dashboard

- preparation hierarchy;
- active attempt;
- recent attempts;
- real performance summaries.

### D08 — App navigation/chrome

- sidebar/rail;
- selected exam context;
- mobile navigation.

### D09 — Result/performance visual system

- score hierarchy;
- analysis presentation;
- question review visual refinement;
- next action.

### D10 — Runner visual refinement

Only after all interaction/reliability audits are preserved in the new composition.

### D11 — Mobile-specific refinement

Dedicated handset review for all canonical surfaces.

### D12 — Final visual consistency audit

- component consistency;
- spacing;
- typography;
- empty/loading/error states;
- motion;
- screenshots / visual regression where feasible.

---

## 22. Homepage V1 implementation constraints

The first implementation should deliberately change **visual hierarchy only**, not business behavior.

Keep:

- current catalog provider contract;
- CP06 failure truth and retry behavior;
- route behavior;
- real test/category data;
- session continuation behavior;
- accessibility and startup isolation.

Refactor presentation into reusable primitives rather than growing `home.tsx` further.

Candidate new components:

- `PublicHero`
- `ExamFinder`
- `ExamFamilyTile`
- `TestSeriesCard`
- `MockTestCard`
- `ResumePreparation`
- `SectionHeader`

Do not prematurely create a generic “Card for everything” abstraction.

---

## 23. Approval criteria for the visual direction

Homepage V1 is approved only if it visibly achieves all of the following:

1. The first screen has one obvious primary message and one dominant CTA.
2. A user can identify their exam family faster than in the current design.
3. The page uses materially fewer large bordered/shadowed containers.
4. Test-series/test objects expose more useful decision data without becoming noisy.
5. The page still looks recognizably Examtree with the current indigo/teal family.
6. Desktop and mobile both feel deliberately composed.
7. No fake statistics, fake performance, fake testimonials, or fake social proof.
8. Existing accessibility checks remain green.
9. Startup isolation and bundle protections remain green.
10. The design feels calmer than Testbook/Oliveboard while remaining more useful than a sparse generic landing page.

---

## 24. Recommended immediate next step

Do **not** apply the whole blueprint globally at once.

Build **Homepage Visual Prototype V1** against real Examtree data on a fresh design branch. The prototype should implement the new public hierarchy and canonical cards while preserving all existing runtime behavior.

Review it at:

- 1440 px desktop;
- 1024 px tablet;
- 390 px mobile;
- 360 px narrow mobile;
- 200% browser zoom.

Once the homepage direction is approved, extract stable design primitives and propagate them through D02–D12.
