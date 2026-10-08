import assert from "node:assert/strict";
import test from "node:test";
import { validateStudentProfile, validatedAvatar } from "../dist/student-profile-validation.mjs";
test("optional personal details can be omitted and cleared", () => {
  const parsed = validateStudentProfile({ fullName: "  Student  " });
  assert.equal(parsed.fullName, "Student");
  assert.equal(parsed.dateOfBirth, null);
  assert.equal(parsed.socialCategory, null);
  assert.equal(parsed.preferredLanguageCode, "en");
});
test("invalid calendar dates and future dates are rejected", () => {
  for (const dateOfBirth of ["2025-02-29", "2020-13-01", "2020-04-31", "2099-01-01", "1899-12-31"]) {
    assert.throws(() => validateStudentProfile({ fullName: "Student", dateOfBirth }, "2026-10-08"));
  }
  assert.equal(validateStudentProfile({ fullName: "Student", dateOfBirth: "2000-02-29" }).dateOfBirth, "2000-02-29");
});
test("identity, roles and verification cannot be set through profile fields", () => {
  for (const key of ["userId", "email", "phoneNumber", "role", "emailVerified", "avatar_key"]) {
    assert.throws(() => validateStudentProfile({ fullName: "Student", [key]: "forged" }));
  }
});
test("category, language and field length are validated", () => {
  assert.throws(() => validateStudentProfile({ fullName: "Student", socialCategory: "invented" }));
  assert.throws(() => validateStudentProfile({ fullName: "Student", preferredLanguageCode: "xx" }));
  assert.throws(() => validateStudentProfile({ fullName: "Student", address: "x".repeat(501) }));
  assert.equal(validateStudentProfile({ fullName: "Student", socialCategory: "SC", preferredLanguageCode: "pa" }).socialCategory, "SC");
});
test("photo endpoint rejects non-raster, malformed and oversized data", () => {
  for (const photo of ["https://example.com/photo.jpg", "data:image/svg+xml;base64,PHN2Zz4=", "data:image/jpeg;base64,aGVsbG8=", "data:image/jpeg;base64," + "A".repeat(350001)]) {
    assert.throws(() => validatedAvatar(photo));
  }
});
