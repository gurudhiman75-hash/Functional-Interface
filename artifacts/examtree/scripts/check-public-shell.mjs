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
assert.match(appSource, /path="\/result" component=\{\(\) => <ProtectedRoute component=\{Result\} \/>\}/, "saved results must require a student session and stay in the preparation shell");
assert.match(appSource, /path="\/bookmarks" component=\{\(\) => <ProtectedRoute component=\{Bookmarks\} \/>\}/, "bookmarks must require a student session and stay in the preparation shell");
assert.match(appSource, /path="\/profile" component=\{\(\) => renderAppRoute\(Profile\)\}/, "profile must stay in the preparation shell");
assert.match(appSource, /path="\/performance" component=\{\(\) => renderAppRoute\(AnalyticsUnavailable\)\}/, "direct analytics links must remain truthful until learner analytics is production-ready");
assert.match(appSource, /ProtectedRoute component=\{TestSeries\}/, "protected Test Series detail must use the default preparation shell");
assert.match(appSource, /ProtectedRoute component=\{Test\} layout="none"/, "full-screen test runner must remain outside both navigation shells");

assert.match(publicLayout, /<nav[\s\S]*?aria-label="Primary navigation"/, "public desktop navigation needs an accessible name for non-study routes");
assert.match(publicLayout, /className=\{showStudySidebar \? "hidden" : "ml-5 hidden items-center gap-1 lg:flex"\}/, "desktop top navigation must yield to the detailed sidebar on study routes");
assert.match(publicLayout, /lg:w-\[252px\]/, "header brand column must align to the detailed desktop rail");
assert.match(publicLayout, /lg:grid-cols-\[252px_minmax\(0,1fr\)\]/, "public sidebar must use the reference-style 252px desktop width");
assert.match(publicLayout, /aria-expanded=\{mobileOpen\}/, "public mobile menu control must expose expanded state");
assert.match(publicLayout, /aria-controls="public-mobile-navigation"/, "public mobile menu control must identify its panel");
assert.match(publicLayout, /event\.key === "Escape"/, "public mobile menu must close with Escape");
assert.match(publicLayout, /aria-current=\{active \? "page" : undefined\}/, "public navigation must expose current-page state");
assert.match(publicLayout, /href="#main-content"/, "public shell must preserve skip navigation");
assert.match(publicLayout, /id="main-content" tabIndex=\{-1\}/, "public shell must expose a focusable main landmark");
assert.match(publicLayout, /mobileStudyLinks/, "mobile navigation must mirror the study-shell hierarchy");
assert.match(publicLayout, /label: "Analytics"[\s\S]{0,80}disabled: true/, "mobile study navigation must mark learner analytics unavailable instead of linking to it");
assert.match(publicLayout, /data-testid=\{`mobile-disabled-\$\{item\.label\.toLowerCase\(\)\.replace\(\/\\s\+\/g, "-"\)\}`\}/, "mobile unavailable features need a stable browser-proof hook");
assert.match(publicLayout, /inline-flex min-h-\[45px\] items-center rounded-lg px-3 py-2 text-sm font-semibold/, "desktop public navigation links must exceed the 44px interaction contract to avoid fractional-pixel underflow");
assert.match(publicLayout, /href="\/login\/student" className="et-interactive inline-flex min-h-\[45px\]/, "desktop sign-in action must exceed the 44px interaction contract");
assert.match(publicLayout, /href="\/exams" className="et-interactive inline-flex min-h-\[45px\]/, "desktop browse action must exceed the 44px interaction contract");

assert.match(publicLayout, /function showStudySidebarForRoute\(location: string\)/, "public shell must centralize discovery-sidebar routing");
const sidebarRouting = publicLayout.match(/function showStudySidebarForRoute\(location: string\) \{[\s\S]*?\n\}/)?.[0] ?? "";
assert.doesNotMatch(sidebarRouting, /location === "\/"/, "homepage must remain a full-width acquisition surface outside the detailed study sidebar");
for (const routeProof of [
  /location === "\/exams"/,
  /location === "\/tests"/,
  /location === "\/mock-tests"/,
  /location === "\/pyqs"/,
  /location === "\/exams-covered"/,
  /location === "\/faq"/,
  /location === "\/contact"/,
  /location === "\/about"/,
  /location\.startsWith\("\/category\/"\)/,
  /location\.startsWith\("\/subcategory\/"\)/,
]) {
  assert.match(sidebarRouting, routeProof, "public sidebar must cover the core study and support journey");
}
assert.match(publicLayout, /<PublicHomeSidebar \/>/, "public discovery shell must render its desktop sidebar");
assert.match(publicHomeSidebar, /data-testid="public-study-sidebar"/, "public sidebar must expose a browser-proof hook");
assert.match(publicHomeSidebar, /hidden[^"]*lg:block/, "public sidebar must stay out of the mobile layout");
assert.match(publicHomeSidebar, /sticky top-16/, "public sidebar must sit below the unchanged 64px public header");
assert.match(publicHomeSidebar, /aria-label="Homepage study navigation"/, "public sidebar navigation needs an accessible name");

for (const href of ["/", "/exams", "/dashboard", "/bookmarks", "/profile", "/contact"]) {
  assert.match(publicHomeSidebar, new RegExp(`href: "${href.replaceAll("/", "\\/")}"|href="${href.replaceAll("/", "\\/")}"`), `public sidebar must preserve route: ${href}`);
}
assert.match(publicHomeSidebar, /href: "\/bookmarks"[\s\S]{0,120}label: "Bookmarks"[\s\S]{0,120}authNext: "\/bookmarks"/, "Bookmarks must be a live protected study-sidebar destination once implemented");
assert.doesNotMatch(publicHomeSidebar, /label: "Bookmarks"[\s\S]{0,80}disabled: true/, "implemented Bookmarks must not remain disabled in the public study sidebar");
assert.doesNotMatch(publicHomeSidebar, /href: "\/performance"/, "learner analytics must not be advertised as a live sidebar destination while its route is unavailable");
for (const label of ["Home", "Explore Exams", "My Tests", "Analytics", "Bookmarks", "Downloads", "Study Plan", "Rewards", "Support", "Settings"]) {
  assert.match(publicHomeSidebar, new RegExp(label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")), `public sidebar must expose reference navigation label: ${label}`);
}
for (const futureFeature of ["Analytics", "Downloads", "Study Plan", "Rewards"]) {
  assert.match(publicHomeSidebar, new RegExp(`label: "${futureFeature}"[\\s\\S]{0,80}disabled: true`), `${futureFeature} must be visible but non-navigating until implemented`);
}
assert.match(publicHomeSidebar, /aria-disabled="true"/, "future sidebar features must expose disabled semantics");
assert.match(publicHomeSidebar, />Soon</, "future sidebar features must be visibly marked as upcoming");

for (const forbidden of ["Logic Engine v2.4", "Practice Motifs", "API Docs", "deep logic diagnostics"]) {
  assert.doesNotMatch(publicLayout, new RegExp(forbidden, "i"), `public shell must not expose prototype footer copy: ${forbidden}`);
}
assert.doesNotMatch(appLayout, /MiniFooter/, "preparation shell must not render the obsolete public footer");
assert.equal(fs.existsSync(path.join(appRoot, "src/components/MiniFooter.tsx")), false, "obsolete prototype footer file must be removed");

console.log("Public/app shell audit passed (full-width Home + truthful detailed study navigation + hardened >=44px public header contract).\n");