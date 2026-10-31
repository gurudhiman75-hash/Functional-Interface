# CP05B — Public startup isolation

Production-freeze checkpoint after route-scoped MathJax loading.

## Problem

The application root still statically imported Firebase-backed auth synchronization and globally mounted `ExamCatalogProvider`. As a result, anonymous informational routes could download Firebase/app-only code and trigger category/subcategory/test catalog requests they did not need.

## Boundary

- `RouteCatalogBoundary` dynamically imports `ExamCatalogProvider` only where catalog context is required.
- Catalog context remains present for Home, Exams/Tests, Mock Tests, category/subcategory discovery, preparation chrome, protected test-series routes, the active runner, result, profile, report and performance surfaces.
- About, Contact, legal, FAQ, account utility, thin-placeholder and not-found routes no longer mount the catalog provider.
- `RouteAuthSessionSync` dynamically imports the existing auth module only on preparation/authenticated surfaces.
- Login continues to load Firebase through its own lazy page chunk.
- Existing `syncAuthSession`, revocation handling, API contracts and runner logic are unchanged.

## Release proof

The existing startup browser suite now requires:

1. anonymous `/about` downloads no MathJax provider, no catalog provider and no Firebase chunk, and makes zero catalog API requests;
2. `/exams` downloads the catalog provider on demand, makes the three canonical catalog requests and still avoids Firebase;
3. `/login/student` downloads Firebase on demand while making zero catalog requests;
4. canonical result review still loads MathJax on demand.

`audit:startup-performance` is expanded to guard these source and browser contracts.
