import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const header = fs.readFileSync(path.join(appRoot, "src/components/StickyHeader.tsx"), "utf8");
const sidebar = fs.readFileSync(path.join(appRoot, "src/components/AppSidebar.tsx"), "utf8");

assert.match(header, /aria-expanded=\{open\}/, "exam selector must expose expanded state");
assert.match(header, /aria-controls="exam-selector-panel"/, "exam selector must own its popup panel");
assert.match(header, /aria-haspopup="dialog"/, "exam selector must communicate popup semantics");
assert.match(header, /id="exam-selector-panel"[\s\S]*?role="dialog"[\s\S]*?aria-label="Choose exam or published test"/, "exam selector panel needs dialog semantics and an accessible name");
assert.match(header, /event\.key === "Escape"/, "exam selector popup must close with Escape");
assert.match(header, /SidebarTrigger className="h-11 w-11/, "sidebar trigger must meet the 44px-class touch target");
assert.match(header, /aria-label="My activity"[\s\S]*?BarChart3/, "activity icon control needs a stable accessible name");
assert.match(header, /aria-label="User profile"[\s\S]*?CircleUserRound/, "profile icon control needs a stable accessible name");
assert.match(header, /className="flex h-11 w-11 items-center justify-center[\s\S]*?aria-label="My activity"/, "activity control must meet the 44px-class touch target");
assert.match(header, /className="flex h-11 w-11 items-center justify-center[\s\S]*?aria-label="User profile"/, "profile control must meet the 44px-class touch target");
assert.match(header, /className="flex min-h-11 w-full items-center justify-between[\s\S]*?subcategory\.name/, "subcategory selector rows must meet the 44px-class touch target");

assert.match(sidebar, /aria-label="ExamTree home"/, "sidebar brand link needs a useful accessible name");
assert.match(sidebar, /className="min-h-11 rounded-md border border-transparent/, "primary sidebar navigation must use 44px-class targets");
assert.match(sidebar, /href="\/profile"[\s\S]*?h-11 w-11[\s\S]*?aria-label="Profile"/, "sidebar profile control needs a 44px-class target and correct accessible name");
assert.match(sidebar, /h-11 w-11[\s\S]*?aria-label="Log out"/, "sidebar logout control needs a 44px-class target and clear accessible name");
assert.doesNotMatch(sidebar, /aria-label="Settings"/, "profile navigation must not be mislabeled as Settings");
assert.match(sidebar, /className="min-h-11 rounded-md border border-indigo-800[\s\S]*?>\s*<Link href="\/login\/student">Login<\/Link>/, "signed-out sidebar login must meet the 44px-class touch target");

console.log("App chrome accessibility audit passed (17 assertions).");
