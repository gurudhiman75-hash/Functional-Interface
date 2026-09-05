import assert from "node:assert/strict";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

const read = (relative) => fs.readFileSync(fileURLToPath(new URL(relative, import.meta.url)), "utf8");

const main = read("../src/main.tsx");
const polish = read("../src/frontend-polish.css");
const publicLayout = read("../src/components/PublicLayout.tsx");
const appLayout = read("../src/components/AppLayout.tsx");
const stickyHeader = read("../src/components/StickyHeader.tsx");
const playwrightConfig = read("../../../scripts/e2e/playwright.config.ts");
const proof = read("../../../scripts/e2e/tests/student-cross-browser-polish.spec.ts");
const workflow = read("../../../.github/workflows/student-reliability-e2e.yml");
const pkg = JSON.parse(read("../package.json"));

assert.equal(pkg.scripts["audit:cross-browser-polish"], "node scripts/check-cross-browser-polish.mjs");
assert.match(pkg.scripts.quality, /audit:cross-browser-polish/);

assert.match(main, /import "\.\/index\.css";[\s\S]*?import "\.\/frontend-polish\.css";[\s\S]*?import "\.\/test-runner-mobile\.css";/);
assert.match(polish, /-webkit-backdrop-filter: blur\(18px\) saturate\(145%\)/);
assert.match(polish, /backdrop-filter: blur\(18px\) saturate\(145%\)/);
assert.match(polish, /min-height: 100svh/);
assert.match(polish, /@supports \(min-height: 100dvh\)/);
assert.match(polish, /@supports not \(\(backdrop-filter: blur\(1px\)\) or \(-webkit-backdrop-filter: blur\(1px\)\)\)/);
assert.match(polish, /@supports not \(scrollbar-gutter: stable\)/);
assert.match(polish, /overscroll-behavior: contain/);
assert.match(polish, /-webkit-overflow-scrolling: touch/);
assert.match(polish, /@media \(prefers-reduced-motion: reduce\)/);
assert.match(polish, /@media \(forced-colors: active\)/);
assert.match(polish, /touch-action: manipulation/);
assert.match(polish, /\.et-interactive:focus-visible/);

assert.match(publicLayout, /className="et-viewport et-page-surface bg-background text-foreground"/);
assert.match(publicLayout, /data-testid="public-header"/);
assert.match(publicLayout, /et-chrome sticky top-0 z-50 border-b/);
assert.match(publicLayout, /bg-primary/);
assert.match(publicLayout, /text-muted-foreground/);
assert.doesNotMatch(publicLayout, /min-h-screen bg-slate-50 text-slate-950/);

assert.match(appLayout, /className="et-viewport et-page-surface bg-background text-foreground"/);
assert.match(appLayout, /SidebarInset className="min-w-0 overflow-x-clip"/);
assert.match(stickyHeader, /className=\{`et-chrome et-shell-header fixed inset-x-0 top-0/);
assert.match(stickyHeader, /data-testid="app-sticky-header"/);
assert.match(stickyHeader, /et-popover/);
assert.match(stickyHeader, /aria-haspopup="dialog"/);

assert.match(playwrightConfig, /name: "firefox-smoke"/);
assert.match(playwrightConfig, /devices\["Desktop Firefox"\]/);
assert.match(playwrightConfig, /name: "webkit-smoke"/);
assert.match(playwrightConfig, /devices\["Desktop Safari"\]/);
assert.match(playwrightConfig, /cross-browser-polish/);
assert.match(workflow, /playwright install --with-deps chromium firefox webkit/);

assert.match(proof, /\["firefox", "webkit"\]/);
assert.match(proof, /width: 390, height: 844/);
assert.match(proof, /scrollWidth <= window\.innerWidth \+ 1/);
assert.match(proof, /keyboard\.press\("Escape"\)/);
assert.match(proof, /toBeGreaterThanOrEqual\(44\)/);
assert.match(proof, /data-testid="public-header"|getByTestId\("public-header"\)/);

console.log("Cross-browser visual polish audit passed.");
