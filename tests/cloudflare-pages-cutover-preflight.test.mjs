import assert from "node:assert/strict";
import test from "node:test";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { findLegacyApiCalls } from "../scripts/check-examtree-cloudflare-cutover.mjs";

test("cutover preflight detects direct Render API references inside compiled JS, including admin", () => {
  const root = mkdtempSync(path.join(tmpdir(), "examtree-cutover-"));
  try {
    mkdirSync(path.join(root, "admin", "assets"), {recursive:true});
    writeFileSync(path.join(root,"index.html"),"<html>Examtree</html>");
    writeFileSync(path.join(root,"assets.js"),'fetch("/api/exams")');
    writeFileSync(path.join(root,"admin","assets","index-abc.js"),'fetch("https://examtree-new.onrender.com/api/admin/session")');
    assert.deepEqual(findLegacyApiCalls(root),["admin/assets/index-abc.js"]);
    writeFileSync(path.join(root,"admin","assets","index-abc.js"),'fetch("/api/admin/session")');
    assert.deepEqual(findLegacyApiCalls(root),[]);
  } finally {rmSync(root,{recursive:true,force:true});}
});
