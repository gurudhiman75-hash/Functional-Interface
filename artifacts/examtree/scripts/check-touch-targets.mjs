import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const repoRoot = path.resolve(appRoot, "../..");
const packageJson = fs.readFileSync(path.join(appRoot, "package.json"), "utf8");
const button = fs.readFileSync(path.join(appRoot, "src/components/ui/button.tsx"), "utf8");
const accessibility = fs.readFileSync(path.join(appRoot, "src/accessibility.css"), "utf8");
const login = fs.readFileSync(path.join(appRoot, "src/pages/login.tsx"), "utf8");
const activity = fs.readFileSync(path.join(appRoot, "src/pages/activity.tsx"), "utf8");
const tests = fs.readFileSync(path.join(appRoot, "src/pages/tests.tsx"), "utf8");
const result = fs.readFileSync(path.join(appRoot, "src/pages/canonical-result.tsx"), "utf8");
const stickyHeader = fs.readFileSync(path.join(appRoot, "src/components/StickyHeader.tsx"), "utf8");
const proof = fs.readFileSync(path.join(repoRoot, "scripts/e2e/tests/student-touch-target-hardening.spec.ts"), "utf8");

assert.match(packageJson, /"audit:touch-targets": "node scripts\/check-touch-targets\.mjs"/, "touch-target audit must be runnable");
assert.match(packageJson, /"quality": "[^"]*audit:touch-targets[^"]*"/, "standard frontend quality must include touch-target audit");

assert.match(button, /default: "h-11 min-w-11 px-4 py-2"/, "default Button target must be at least 44px");
assert.match(button, /sm: "h-11 min-w-11 rounded-md px-3"/, "small Button target must not shrink below 44px");
assert.match(button, /lg: "h-12 min-w-11 rounded-md px-8"/, "large Button target must retain a 44px minimum width");
assert.match(button, /icon: "h-11 w-11"/, "icon Button target must be 44px square");
assert.doesNotMatch(button, /default: "h-10|sm: "h-9|icon: "h-10 w-10/, "legacy sub-44px shared button sizes must not return");

assert.match(accessibility, /button \{[\s\S]*?min-block-size: 2\.75rem;[\s\S]*?min-inline-size: 2\.75rem;/, "native buttons need a global 44px minimum target");
assert.match(accessibility, /a\.fixed\[href="\/account-recovery"\][\s\S]*?min-block-size: 2\.75rem;/, "fixed account-recovery shortcut needs a 44px height");

assert.match(login, /data-testid="tab-login"/, "login tab must remain covered by browser proof");
assert.match(login, /data-testid="btn-toggle-password"/, "password visibility control must remain covered by browser proof");
assert.match(login, /data-testid="btn-forgot-password"/, "forgot-password control must remain covered by browser proof");
assert.match(activity, /size="sm"[\s\S]*?View result/, "small Activity result action must inherit the hardened shared target");
assert.match(tests, /size="sm"[\s\S]*?Start test/, "small test-discovery action must inherit the hardened shared target");
assert.match(result, /size="sm"[\s\S]*?setFilter/, "small result filter actions must inherit the hardened shared target");

assert.match(stickyHeader, /relative mx-auto min-w-0 flex-1 max-w-2xl/, "mobile exam selector must be allowed to shrink inside the preparation header");
assert.match(stickyHeader, /ml-auto flex shrink-0 items-center gap-2/, "mobile Activity and Profile actions must retain their fixed touch-target space");

assert.match(proof, /expect\(box!\.width\)\.toBeGreaterThanOrEqual\(44\)/, "browser proof must measure target width");
assert.match(proof, /expect\(box!\.height\)\.toBeGreaterThanOrEqual\(44\)/, "browser proof must measure target height");
assert.match(proof, /btn-toggle-password[\s\S]*?btn-forgot-password[\s\S]*?btn-submit[\s\S]*?btn-back/, "browser proof must exercise custom login controls");
assert.match(proof, /Can’t access your account\?/, "browser proof must exercise the fixed recovery shortcut");
assert.match(proof, /\/dashboard[\s\S]*?\/profile[\s\S]*?\/result/, "browser proof must exercise representative preparation/result actions");
assert.match(proof, /User profile[\s\S]*?expectNoHorizontalOverflow/, "browser proof must keep the mobile preparation header actions on-screen before overflow certification");
assert.match(proof, /scrollWidth - window\.innerWidth/, "touch-target hardening must retain mobile overflow protection");

console.log("Page-level touch-target audit passed (24 assertions).");
