# ExamTree reusable exam acquisition page system

The public exam SEO/acquisition layer is config-driven. SSC CGL is the first implementation, but the page design is shared.

## Shared design surfaces

All configured exams use the same components for:

- exam preparation hub;
- How to Prepare page;
- syllabus / exam-pattern page;
- continuous-scroll free topic questions;
- inline answer + explanation reveal;
- MathJax question rendering;
- related-topic/internal links;
- mock-test CTA blocks;
- public canonical-question loading.

The shared React implementation lives in:

- `artifacts/examtree/src/components/ExamAcquisitionPages.tsx`
- `artifacts/examtree/src/pages/exam-acquisition.tsx`

Exam-specific content lives in:

- `artifacts/examtree/src/lib/seo-practice.ts`

## Adding a new exam

For a new exam such as SSC CHSL, IBPS PO, Punjab Police, or PSSSB:

1. Add one `ExamAcquisitionConfig` entry in `EXAM_ACQUISITION_CONFIGS`.
2. Use an exam slug that matches the canonical exam code or normalized exam name in the catalog where possible.
3. Supply:
   - display name and year label;
   - mock-test category URL;
   - official authority URL;
   - SEO titles/descriptions;
   - hub copy;
   - preparation cards and weekly cycle;
   - syllabus sections;
   - exam-pattern cards;
   - official-information verification note;
   - supported public practice topics.
4. Add the four public routes in `App.tsx` using the configured route adapters:
   - `/<exam-slug>`
   - `/<exam-slug>-preparation`
   - `/<exam-slug>-syllabus`
   - `/<exam-slug>/questions/:topicSlug`
5. Add the indexable routes to the public prerender/sitemap registry after the content has been editorially verified.

No new page design/component should be created for routine exam additions.

## Public question sourcing

The public practice API is:

`GET /public/practice/:examSlug/:topicSlug?limit=10`

It:

- reads only published canonical question versions;
- resolves the exam against canonical exam code/name;
- filters by taxonomy topic;
- returns approved translations only;
- exposes 5–12 questions per request;
- returns answer and explanation data for inline reveal;
- never falls back to another exam merely to fill a page.

If no eligible canonical questions exist, the public page displays a truthful empty state.

## Topic registry

The current public topic registry is intentionally controlled. A topic must be added to the public API topic whitelist before it can be served publicly. This prevents arbitrary taxonomy scraping and keeps SEO pages curated.

## Design rule

Do not fork the page UI for individual exams unless an exam genuinely requires a structurally different learner experience. Differences in wording, syllabus, pattern, subjects, preparation guidance, official source, topics, and mock-test destination belong in configuration rather than duplicated React pages.
