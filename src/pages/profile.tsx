import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "wouter";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  PhoneAuthProvider, RecaptchaVerifier, linkWithCredential, updatePhoneNumber,
  sendEmailVerification, verifyBeforeUpdateEmail, reload, signOut,
} from "firebase/auth";
import { Camera, CheckCircle2, ArrowRight, LogOut, KeyRound, Trash2, CreditCard } from "lucide-react";
import { getFirebaseAuth } from "@/lib/firebase";
import { getUserAttempts } from "@/lib/data";
import { ApiError } from "@/lib/api";
import { getUser, setUser, clearAuth } from "@/lib/storage";
import { PREPARATION_CATEGORIES, getPreparationPreferences } from "@/lib/preparation";
import {
  loadStudentProfile, saveStudentProfile, syncProfileContacts, checkProfileContact,
  loadProfilePhoto, uploadProfilePhoto, prepareProfilePhoto,
  type StudentProfileFields, type StudentProfile,
} from "@/lib/student-profile";
import "@/styles/student-profile.css";

const states = ["Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"];
const emptyFields: StudentProfileFields = { fullName: "", dateOfBirth: "", state: "", city: "", address: "", socialCategory: "", preferredLanguageCode: "en" };
function fieldsFrom(profile: StudentProfile): StudentProfileFields {
  return { fullName: profile.fullName, dateOfBirth: profile.dateOfBirth ?? "", state: profile.state ?? "", city: profile.city ?? "", address: profile.address ?? "", socialCategory: profile.socialCategory ?? "", preferredLanguageCode: profile.preferredLanguageCode };
}
function messageFor(error: unknown): string {
  if (error instanceof ApiError && error.body && typeof error.body === "object" && "error" in error.body) return String(error.body.error);
  const code = (error as { code?: string })?.code;
  if (["auth/credential-already-in-use", "auth/email-already-in-use", "auth/account-exists-with-different-credential"].includes(code ?? "")) return "That email or mobile number is already linked to another account.";
  if (code === "auth/requires-recent-login") return "Please sign out and sign in again before changing contact details.";
  if (code === "auth/invalid-verification-code") return "The OTP is incorrect. Please check it and try again.";
  if (code === "auth/code-expired" || code === "auth/session-expired") return "The OTP has expired. Request a new one.";
  if (code === "auth/too-many-requests") return "Too many attempts. Please wait before trying again.";
  if (code === "auth/operation-not-allowed") return "This verification method is currently unavailable. Please try again later.";
  return error instanceof ApiError ? "Couldn't complete this action. Please try again." : error instanceof Error && !code ? error.message : "Couldn't complete this action. Please try again.";
}

export default function ProfilePage() {
  const user = getUser();
  const [, navigate] = useLocation();
  const client = useQueryClient();
  const [form, setForm] = useState<StudentProfileFields>(emptyFields);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [verificationId, setVerificationId] = useState<string | null>(null);
  const [pendingPhone, setPendingPhone] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const hydrated = useRef<string | null>(null);
  const recaptcha = useRef<RecaptchaVerifier | null>(null);
  const photoInput = useRef<HTMLInputElement>(null);
  const query = useQuery({ queryKey: ["student-profile", user?.id], queryFn: loadStudentProfile, enabled: !!user, retry: false, refetchOnWindowFocus: false });
  const preparation = useQuery({ queryKey: ["preparation-preferences", user?.id], queryFn: getPreparationPreferences, enabled: !!user, retry: false });
  const attempts = useQuery({ queryKey: ["my-attempts", user?.id], queryFn: () => getUserAttempts(user?.id), enabled: !!user, retry: false });
  const photo = useQuery({ queryKey: ["student-profile-photo", user?.id], queryFn: loadProfilePhoto, enabled: !!query.data?.hasPhoto, retry: false, refetchOnWindowFocus: false });
  useEffect(() => {
    if (!query.data || hydrated.current === user?.id) return;
    hydrated.current = user?.id ?? null;
    setForm(fieldsFrom(query.data)); setEmail(query.data.email ?? "");
    setPhone((query.data.phoneNumber ?? "").replace(/^\+91/, ""));
  }, [query.data, user?.id]);
  useEffect(() => () => { recaptcha.current?.clear(); }, []);
  useEffect(() => {
    const viewport = window.visualViewport;
    const baseline = window.innerHeight;
    function adjust() {
      const focused = document.activeElement instanceof HTMLElement &&
        ["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement.tagName);
      setKeyboardOpen(!!focused && !!viewport && viewport.height < baseline - 140);
      if (focused) requestAnimationFrame(() => (document.activeElement as HTMLElement)?.scrollIntoView({ block: "center", behavior: "smooth" }));
    }
    viewport?.addEventListener("resize", adjust);
    return () => viewport?.removeEventListener("resize", adjust);
  }, []);
  function update<K extends keyof StudentProfileFields>(key: K, value: StudentProfileFields[K]) {
    setForm(current => ({ ...current, [key]: value })); setNotice("");
  }
  async function perform(name: string, operation: () => Promise<void>) {
    setBusy(name); setError(""); setNotice("");
    try { await operation(); } catch (error) { setError(messageFor(error)); } finally { setBusy(null); }
  }
  function currentFirebaseUser() {
    const current = getFirebaseAuth()?.currentUser;
    if (!current) throw new Error("Please sign in again to verify contact details.");
    return current;
  }
  async function refreshContacts() {
    const current = currentFirebaseUser();
    await reload(current); await current.getIdToken(true);
    const saved = await syncProfileContacts();
    client.setQueryData(["student-profile", user?.id], saved);
    setEmail(saved.email ?? ""); setPhone((saved.phoneNumber ?? "").replace(/^\+91/, ""));
    const existing = getUser();
    if (existing) setUser({ ...existing, email: saved.email ?? existing.email, name: saved.fullName });
  }
  async function verifyEmail() {
    const current = currentFirebaseUser();
    const destination = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(destination)) throw new Error("Enter a valid email address.");
    await checkProfileContact({ email: destination });
    const settings = { url: window.location.origin + "/profile" };
    if (destination === current.email?.toLowerCase()) {
      if (current.emailVerified) { await refreshContacts(); setNotice("Email is verified."); return; }
      await sendEmailVerification(current, settings);
    } else await verifyBeforeUpdateEmail(current, destination, settings);
    setNotice("Verification email sent. Open the link, then return here and choose Refresh verification.");
  }
  async function sendOtp() {
    const auth = getFirebaseAuth();
    if (!auth?.currentUser) throw new Error("Please sign in again.");
    const normalized = phone.replace(/[\s()-]/g, "");
    const fullPhone = normalized.startsWith("+") ? normalized : "+91" + normalized;
    if (!/^\+[1-9]\d{7,14}$/.test(fullPhone)) throw new Error("Enter a valid mobile number.");
    await checkProfileContact({ phoneNumber: fullPhone });
    if (fullPhone === auth.currentUser.phoneNumber) { await refreshContacts(); setNotice("Mobile number is verified."); return; }
    recaptcha.current?.clear();
    recaptcha.current = new RecaptchaVerifier(auth, "profile-recaptcha", { size: "normal" });
    try {
      const id = await new PhoneAuthProvider(auth).verifyPhoneNumber(fullPhone, recaptcha.current);
      setVerificationId(id); setPendingPhone(fullPhone); setOtp("");
      setNotice("OTP sent to " + fullPhone + ".");
    } finally { recaptcha.current?.clear(); recaptcha.current = null; }
  }
  async function confirmOtp() {
    if (!verificationId || !/^\d{6}$/.test(otp)) throw new Error("Enter the six-digit OTP.");
    const current = currentFirebaseUser();
    const credential = PhoneAuthProvider.credential(verificationId, otp);
    if (current.providerData.some(provider => provider.providerId === "phone")) await updatePhoneNumber(current, credential);
    else await linkWithCredential(current, credential);
    setVerificationId(null); setOtp("");
    await refreshContacts(); setNotice("Mobile number verified and saved.");
  }
  async function save() {
    const saved = await saveStudentProfile(form);
    client.setQueryData(["student-profile", user?.id], saved);
    setForm(fieldsFrom(saved));
    const existing = getUser(); if (existing) setUser({ ...existing, name: saved.fullName });
    setNotice("Profile saved.");
  }
  async function changePhoto(file: File) {
    const result = await uploadProfilePhoto(await prepareProfilePhoto(file));
    client.setQueryData(["student-profile-photo", user?.id], result);
    await client.invalidateQueries({ queryKey: ["student-profile", user?.id] });
    setNotice("Profile photo updated.");
  }
  async function logout() {
    const auth = getFirebaseAuth(); if (auth) await signOut(auth);
    clearAuth(); navigate("/");
  }
  if (!user) return <div className="min-h-screen bg-background student-profile"><h1>My profile</h1><p>Sign in to view and edit your profile.</p><Link href="/login/student">Sign in <ArrowRight /></Link></div>;
  if (query.isLoading) return <div className="min-h-screen bg-background student-profile"><p role="status">Loading your profile…</p></div>;
  if (query.isError || !query.data) return <div className="min-h-screen bg-background student-profile"><h1>My profile</h1><p role="alert">We couldn't load your profile.</p><button className="profile-primary" onClick={() => query.refetch()}>Try again</button></div>;
  const profile = query.data;
  const initials = (form.fullName || user.name).split(" ").filter(Boolean).slice(0, 2).map(part => part[0]).join("").toUpperCase();
  const dirty = JSON.stringify(form) !== JSON.stringify(fieldsFrom(profile));
  const emailVerified = profile.emailVerified && email.trim().toLowerCase() === profile.email?.toLowerCase();
  const phoneValue = phone.replace(/[\s()-]/g, "");
  const phoneVerified = profile.phoneVerified && (phoneValue.startsWith("+") ? phoneValue : "+91" + phoneValue) === profile.phoneNumber;
  return <div className={"min-h-screen bg-background student-profile " + (keyboardOpen ? "profile-keyboard-open" : "")}>
    <header className="profile-heading"><div><h1>My profile</h1><p>Update your details whenever you like.</p></div><p>All additional details are optional.</p></header>
    <div className="profile-person">
      <div className="profile-avatar">{photo.data?.photo ? <img src={photo.data.photo} alt="Your profile" /> : initials}</div>
      <div><h2>{form.fullName || user.name}</h2><p className="profile-account-status">Account status: Signed in</p>
        <button type="button" className="profile-text-button" disabled={!!busy} onClick={() => photoInput.current?.click()}><Camera aria-hidden="true" />{busy === "photo" ? "Uploading…" : "Change photo"}</button>
        <input ref={photoInput} type="file" accept="image/jpeg,image/png,image/webp" hidden onChange={event => { const file = event.target.files?.[0]; event.target.value = ""; if (file) void perform("photo", () => changePhoto(file)); }} />
        {photo.isError && <button type="button" className="profile-text-button" onClick={() => photo.refetch()}>Retry photo</button>}
      </div>
    </div>
    <form onSubmit={event => { event.preventDefault(); void perform("save", save); }}>
      <fieldset disabled={!!busy} className="profile-panel"><legend>Personal details</legend><div className="profile-form-grid">
        <label>Full name<input value={form.fullName} maxLength={120} autoComplete="name" required onChange={event => update("fullName", event.target.value)} /></label>
        <label><span className="profile-field-label">Date of birth <em>(optional)</em></span><input type="date" value={form.dateOfBirth ?? ""} min="1900-01-01" max={new Date().toISOString().slice(0, 10)} autoComplete="bday" onChange={event => update("dateOfBirth", event.target.value)} /></label>
        <label><span className="profile-field-label">State <em>(optional)</em></span><select value={form.state ?? ""} autoComplete="address-level1" onChange={event => update("state", event.target.value)}><option value="">Select state</option>{states.map(state => <option key={state}>{state}</option>)}</select></label>
        <label><span className="profile-field-label">District / City <em>(optional)</em></span><input value={form.city ?? ""} maxLength={100} autoComplete="address-level2" onChange={event => update("city", event.target.value)} placeholder="Enter district or city" /></label>
        <label><span className="profile-field-label">Address <em>(optional)</em></span><textarea value={form.address ?? ""} maxLength={500} rows={3} autoComplete="street-address" onChange={event => update("address", event.target.value)} placeholder="Enter your address" /></label>
        <label><span className="profile-field-label">Social category <em>(optional)</em></span><select value={form.socialCategory ?? ""} onChange={event => update("socialCategory", event.target.value)} aria-describedby="category-note"><option value="">Prefer not to say</option>{["General", "SC", "ST", "OBC", "EWS", "BC", "Other"].map(category => <option key={category}>{category}</option>)}</select><small id="category-note">For relevant exam cutoffs when available. Categories depend on the exam and state.</small></label>
      </div></fieldset>
      <fieldset disabled={!!busy} className="profile-panel"><legend>Contact &amp; preferences</legend><div className="profile-form-grid">
        <div className="profile-contact-field"><label htmlFor="profile-email">Email address</label><div className="profile-contact-row"><input id="profile-email" type="email" value={email} autoComplete="email" onChange={event => setEmail(event.target.value)} placeholder="Add email address" />{emailVerified ? <span className="profile-verified"><CheckCircle2 aria-hidden="true" />Verified</span> : <button type="button" className="profile-outline" onClick={() => void perform("email", verifyEmail)}>Verify</button>}</div></div>
        <div className="profile-contact-field"><label htmlFor="profile-phone">Mobile number</label><div className="profile-contact-row"><span className="profile-country">+91</span><input id="profile-phone" type="tel" value={phone} autoComplete="tel-national" onChange={event => { setPhone(event.target.value); setVerificationId(null); setOtp(""); }} placeholder="Add mobile number" />{phoneVerified ? <span className="profile-verified"><CheckCircle2 aria-hidden="true" />Verified</span> : <button type="button" className="profile-outline" onClick={() => void perform("phone", sendOtp)}>Verify</button>}</div></div>
        <label>Preferred language<select value={form.preferredLanguageCode} onChange={event => update("preferredLanguageCode", event.target.value)}><option value="en">English</option><option value="hi">हिन्दी</option><option value="pa">ਪੰਜਾਬੀ</option></select></label>
        <div className="profile-preparation"><p>Preparation categories</p><div className="profile-chips">{preparation.isLoading ? <span role="status">Loading…</span> : preparation.isError ? <button type="button" className="profile-text-button" onClick={() => preparation.refetch()}>Retry choices</button> : preparation.data?.categories.length ? PREPARATION_CATEGORIES.filter(category => preparation.data?.categories.includes(category.id)).map(category => <span key={category.id}>{category.label}</span>) : <span>No categories selected</span>}</div><Link href="/preparation?edit=1" onClick={event => { if (dirty || busy) { event.preventDefault(); setError("Save or cancel your profile changes before editing preparation choices."); } }}>Edit choices</Link></div>
      </div>
      <p className="profile-contact-help">Contact changes are saved after verification. Other details use Save changes.</p>
      <button type="button" className="profile-text-button" onClick={() => void perform("refresh", async () => { await refreshContacts(); setNotice("Verification status refreshed."); })}>Refresh verification</button>
      </fieldset>
      <div id="profile-recaptcha" />
      {verificationId && <section className="profile-otp"><label>OTP sent to {pendingPhone}<input type="text" inputMode="numeric" autoComplete="one-time-code" maxLength={6} value={otp} onChange={event => setOtp(event.target.value.replace(/\D/g, ""))} /></label><button type="button" className="profile-outline" disabled={!!busy} onClick={() => void perform("otp", confirmOtp)}>Confirm OTP</button><button type="button" className="profile-text-button" disabled={!!busy} onClick={() => void perform("phone", sendOtp)}>Resend OTP</button></section>}
      {notice && <p role="status" className="profile-notice">{notice}</p>}{error && <p role="alert" className="profile-error">{error}</p>}
      <div className="profile-actions"><button type="submit" className="profile-primary" disabled={!!busy || !dirty}>{busy === "save" ? "Saving…" : "Save changes"}</button><button type="button" className="profile-outline" disabled={!!busy} onClick={() => { setForm(fieldsFrom(profile)); setEmail(profile.email ?? ""); setPhone((profile.phoneNumber ?? "").replace(/^\+91/, "")); setVerificationId(null); setNotice(""); setError(""); }}>Cancel</button></div>
    </form>
    <details className="profile-results"><summary>Recent results</summary>
      {attempts.isLoading ? <p role="status">Loading attempts…</p> : attempts.isError ? <p>Recent attempts are unavailable.</p> : attempts.data?.length ? attempts.data.slice(0, 3).map(attempt => {
        const params = new URLSearchParams({ attemptId: attempt.id, testId: attempt.testId });
        return <Link key={attempt.id} href={"/result?" + params.toString()}>{attempt.testName} <ArrowRight /></Link>;
      }) : <p>No submitted attempts yet.</p>}
    </details>
    <nav className="profile-account-links" aria-label="Account options">
      <Link href="/dashboard">My activity <ArrowRight /></Link><Link href="/my-packages"><CreditCard />Purchases &amp; access</Link><Link href="/account-recovery"><KeyRound />Password &amp; recovery</Link><Link href="/account-deletion"><Trash2 />Delete account</Link><button type="button" onClick={() => void perform("logout", logout)} disabled={!!busy}><LogOut />Log out</button>
    </nav>
  </div>;
}
