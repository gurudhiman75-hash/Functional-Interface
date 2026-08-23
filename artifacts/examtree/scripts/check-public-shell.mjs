import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const appSource = fs.readFileSync(path.join(appRoot, "src/App.tsx"), "utf8");
const appLayout = fs.readFileSync(path.join(appRoot, "src/components/AppLayout.tsx"), "utf8");
const publicLayout = fs.readFileSync(path.join(appRoot, "src/components/PublicLayout.tsx"), "utf8");
const publicHomeSidebar = fs.readFileSync(path.join(appRoot, "src/components/PublicHomeSidebar.tsx"), "utf8");

assert.match(appSource, /import \{ PublicLayout \} from "@\/components\/PublicLayout"/, "router must import the dedicated public shell");
assert.match(appSource, /const renderPublicRoute = .*<PublicLayout><Component \/><\/PublicLayout>/, "router must expose a dedicated public-route renderer");
assert.match(appSource, /const renderCatalogPublicRoute = [\s\S]*?<RouteCatalogBoundary><PublicLayout><Component \/><\/PublicLayout><\/RouteCatalogBoundary>/, "catalog-backed acquisition routes must preserve the public shell inside the lazy catalog boundary");
assert.match(appSource, /path="\/" component=\{\(\) => renderCatalogPublicRoute\(Home\)\}/, "homepage must use the acquisition shell while retaining catalog context");
assert.match(appSource, /path="\/exams" component=\{\(\) => renderCatalogPublicRoute\(Tests\)\}/, "test discovery must use the acquisition shell while retaining catalog context");
assert.match(appSource, /path="\/category\/:id" component=\{\(\) => renderCatalogPublicRoute\(Category\)\}/, "category discovery must use the acquisition shell while retaining catalog context");
assert.match(appSource, /path="\/subcategory\/:id" component=\{\(\) => renderCatalogPublicRoute\(Subcategory\)\}/, "exam discovery must use the acquisition shell while retaining catalog context");
assert.match(appSource, /path="\/login\/student" component=\{\(\) => renderPublicRoute\(Login\)\}/, "student login must not be trapped inside the preparation sidebar");
assert.match(appSource, /path="\/dashboard" component=\{\(\) => renderAppRoute\(Dashboard\)\}/, "dashboard must stay in the preparation shell");
assert.match(appSource, /path="\/result" component=\{\(\) => renderAppRoute\(Result\)\}/, "saved results must stay in the preparation shell");
assert.match(appSource, /path="\/profile" component=\{\(\) => renderAppRoute\(Profile\)\}/, "profile must stay in the preparation shell");
assert.match(appSource, /ProtectedRoute component=\{TestSeries\}/, "protected Test Series detail must use the default preparation shell");
assert.match(appSource, /ProtectedRoute component=\{Test\} layout="none"/, "full-screen test runner must remain outside both navigation shells");

assert.match(publicLayout, /<nav aria-label="Primary navigation"/, "public desktop navigation needs an accessible name");
assert.match(publicLayout, /aria-expanded=\{mobileOpen\}/, "public mobile menu control must expose expanded state");
assert.match(publicLayout, /aria-controls="public-mobile-navigation"/, "public mobile menu control must identify its panel");
assert.match(publicLayout, /event\.key === "Escape"/, "public mobile menu must close with Escape");
assert.match(publicLayout, /aria-current=\{active \? "page" : undefined\}/, "public navigation must expose current-page state");
assert.match(publicLayout, /href="#main-content"/, "public shell must preserve skip navigation");
assert.match(publicLayout, /id="main-content" tabIndex=\{-1\}/, "public shell must expose a focusable main landmark");

assert.match(publicLayout, /const showHomeSidebar = location === "\/"/, "public sidebar must stay scoped to the homepage");
assert.match(publicLayout, /<PublicHomeSidebar \/>/, "homepage public shell must render its desktop sidebar");
assert.match(publicLayout, /lg:grid-cols-\[220px_minmax\(0,1fr\)\]/, "homepage sidebar must keep a compact desktop width");
assert.match(publicHomeSidebar, /hidden[^"]*lg:block/, "homepage sidebar must stay out of the mobile layout");
assert.match(publicHomeSidebar, /sticky top-16/, "homepage sidebar must sit below the unchanged 64px public header");
assert.match(publicHomeSidebar, /aria-label="Homepage study navigation"/, "homepage sidebar navigation needs an accessible name");
for (const href of ["/", "/exams", "/mock-tests", "/pyqs", "/exams-covered"]) {
  assert.match(publicHomeSidebar, new RegExp(`href: "${href.replaceAll("/", "\\/")}"|href="${href.replaceAll("/", "\\/")}"`), `homepage sidebar must preserve route: ${href}`);
}

for (const forbidden of ["Logic Engine v2.4", "Practice Motifs", "API Docs", "deep logic diagnostics"]) {
  assert.doesNotMatch(publicLayout, new RegExp(forbidden, "i"), `public shell must not expose prototype footer copy: ${forbidden}`);
}
assert.doesNotMatch(appLayout, /MiniFooter/, "preparation shell must not render the obsolete public footer");
assert.equal(fs.existsSync(path.join(appRoot, "src/components/MiniFooter.tsx")), false, "obsolete prototype footer file must be removed");

console.log("Public/app shell audit passed (38 assertions).");
