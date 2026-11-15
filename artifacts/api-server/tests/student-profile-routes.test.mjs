import assert from "node:assert/strict";
import { once } from "node:events";
import { build } from "esbuild";
import express from "express";
await build({
  entryPoints: ["src/routes/student-profile.ts"], outfile: "dist/student-profile-test-route.mjs",
  bundle: true, platform: "node", format: "esm", packages: "external",
  plugins: [{ name: "profile-fixtures", setup(b) {
    for (const name of ["db", "firebase-admin"]) b.onResolve({ filter: new RegExp("^\\.\\./lib/" + name + "$") }, () => ({ path: name, namespace: "fixture" }));
    b.onResolve({ filter: /^\.\.\/middlewares\/auth$/ }, () => ({ path: "auth", namespace: "fixture" }));
    b.onLoad({ filter: /.*/, namespace: "fixture" }, ({ path }) => ({
      loader: "js", contents: path === "auth" ? 'export function authenticate(req,res,next){const id=req.headers["x-fixture-user"];if(!id)return res.status(401).json({});req.user={id};next();}'
        : path === "firebase-admin" ? 'export const storage={bucket(){throw Object.assign(new Error("Fixture storage failure"),{code:Number(process.env.PROFILE_FIXTURE_STORAGE_ERROR)});}};'
        : 'const profiles=new Map();export const sqlClient=async(strings,...values)=>{const q=strings.join("?");if(q.includes("SELECT u.id::text AS id"))return values[0]==="blocked"?[]:[{id:values[0]}];if(q.includes("INSERT INTO identity.student_profile_details")){const [id,fullName,dateOfBirth,state,city,address,socialCategory,preferredLanguageCode]=values;profiles.set(id,{fullName,dateOfBirth,state,city,address,socialCategory,preferredLanguageCode,email:null,phoneNumber:null,hasPhoto:false});return [];}if(q.includes("COALESCE(d.full_name"))return [profiles.get(values[0])??{fullName:"Fixture",email:null,phoneNumber:null}];return [];};sqlClient.begin=operation=>operation(sqlClient);',
    }));
  } }],
});
const { default: router } = await import("../dist/student-profile-test-route.mjs");
const app = express(); app.use(express.json()); app.use("/users", router);
const server = app.listen(0, "127.0.0.1"); await once(server, "listening");
const url = "http://127.0.0.1:" + server.address().port + "/users/me/profile";
async function request(user, method = "GET", body, suffix = "") {
  const res = await fetch(url + suffix, { method, headers: { ...(user ? { "x-fixture-user": user } : {}), "content-type": "application/json" }, ...(body ? { body: JSON.stringify(body) } : {}) });
  return { status: res.status, body: await res.json() };
}
try {
  assert.equal((await request(null)).status, 401);
  assert.equal((await request("blocked")).status, 403);
  assert.equal((await request("student-a", "PUT", { fullName: "A", userId: "student-b" })).status, 400);
  assert.equal((await request("student-a", "PUT", { fullName: "A", email: "forged@example.com" })).status, 400);
  const saved = await request("student-a", "PUT", { fullName: "Learner A", socialCategory: "SC", preferredLanguageCode: "pa" });
  assert.equal(saved.status, 200); assert.equal(saved.body.fullName, "Learner A");
  assert.equal((await request("student-a")).body.socialCategory, "SC");
  assert.equal((await request("student-b")).body.fullName, "Fixture");
  const cleared = await request("student-a", "PUT", { fullName: "Learner A", socialCategory: "" });
  assert.equal(cleared.body.socialCategory, null);
  assert.equal(cleared.body.emailVerified, false);
  const photo = "data:image/jpeg;base64," + Buffer.from([0xff, 0xd8, 0xff, 0xd9]).toString("base64");
  try {
    process.env.PROFILE_FIXTURE_STORAGE_ERROR = "403";
    const denied = await request("student-a", "PUT", { photo }, "/photo");
    assert.equal(denied.status, 503);
    assert.equal(denied.body.code, "PROFILE_STORAGE_ACCESS_DENIED");
    process.env.PROFILE_FIXTURE_STORAGE_ERROR = "404";
    const missing = await request("student-a", "PUT", { photo }, "/photo");
    assert.equal(missing.status, 503);
    assert.equal(missing.body.code, "PROFILE_STORAGE_NOT_FOUND");
  } finally { delete process.env.PROFILE_FIXTURE_STORAGE_ERROR; }
  console.log("PASS: authenticated profile isolation, optional fields, clearing and contact-write rejection");
} finally { server.close(); }
