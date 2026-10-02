# ExamTree web launch page audit

Date: 2026-10-02

This audit covers the student/public web application route graph and launch-facing page truth. It separates pages that are ready to expose from pages that are intentionally unavailable or still incomplete.

## Ready / materially complete

- Home
- Login / signup
- Account recovery
- Account deletion
- Exams / tests discovery
- Category and subcategory discovery
- Published test detail
- Test series
- Test runner
- Result / review
- Dashboard / My Tests
- Bookmarks
- Store / packages
- My Purchases
- Resources
- About Us
- Contact Us
- FAQ
- Exams Covered
- Mock Tests
- Privacy Policy
- Terms & Conditions
- Cancellation & Refund Policy
- Disclaimer
- Payment & Billing Help
- Grievance Redressal
- Accessibility

## Present but still incomplete

### Profile / Settings
The page is useful for account summary, sign-out, security/account links and preparation summary, but editable learner profile data is not yet a complete canonical self-service workflow.

Launch treatment: keep the page available, but do not advertise profile editing that is not implemented.

### Report Question
The current page prepares a structured support email. It does not yet persist question reports into a canonical support/content-quality queue.

Launch treatment: acceptable as a truthful support fallback. Canonical report persistence remains a product backlog item.

### Contact
The current page prepares a structured support email rather than storing a support request in ExamTree.

Launch treatment: acceptable while the copy clearly states that nothing is submitted until the learner sends the email.

## Intentionally unavailable

### Performance Analytics
The /performance route intentionally renders an unavailable state. Sidebar and mobile navigation must not advertise it as a live destination until server-backed ranking, percentile, weak-area and trend services are production-ready.

### Downloads
Visible only as a disabled “Soon” navigation item.

### Study Plan
Visible only as a disabled “Soon” navigation item.

### Rewards
Visible only as a disabled “Soon” navigation item.

## Placeholder content that must not be promoted

### PYQ Hub
The /pyqs page is currently a noindex placeholder describing future exam/year/topic filters rather than published PYQ collections.

Launch treatment applied in this audit: remove PYQ links from the public header/home/footer until real PYQ collections are published.

### Blog
The /blog page is currently a noindex future-content shell.

Launch treatment applied in this audit: remove Blog from public footer navigation. Keep the route unpromoted for future implementation.

### SEO landing routes
The following routes are noindex future shells and must not be linked as real content:
- /ssc-cgl-pyqs
- /punjab-police-mock-tests
- /ibps-clerk-syllabus

They can remain internal development routes until real, source-verified landing content exists.

## Remaining launch backlog

1. Canonical learner profile editing and persistence.
2. Canonical question-report submission and admin/content-review workflow.
3. Canonical support request persistence if ExamTree wants in-app ticketing instead of email handoff.
4. Production learner analytics before enabling /performance navigation.
5. Real PYQ publishing and discovery before restoring PYQ links.
6. Real blog/editorial publishing before restoring Blog links.
7. Real exam-specific SEO pages before indexing the existing landing routes.
8. Optional dedicated payment-result pages only if the checkout flow needs URL-based success/failure recovery beyond the current store/checkout state handling.

## Navigation rule

Only surfaces backed by real content or a truthful operational workflow should be promoted in launch navigation. Unimplemented roadmap features may remain as clearly disabled “Soon” items when useful for product orientation, but placeholder content pages should not look like published resources.
