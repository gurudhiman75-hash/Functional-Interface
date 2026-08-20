import { useState } from "react";
import { Link } from "wouter";
import { signOut } from "firebase/auth";
import { AlertTriangle, CheckCircle2, ShieldCheck, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ApiError, apiRequest, getApiErrorCode } from "@/lib/api";
import { getFirebaseAuth } from "@/lib/firebase";
import { clearAuth, clearStudentLocalData, getUser } from "@/lib/storage";
import { usePageMeta } from "@/components/PublicPage";

const CONFIRMATION = "DELETE MY ACCOUNT";

type DeletionResponse = {
  status: "deleted" | "pending";
  retainedFinancialRecords?: boolean;
};

async function endBrowserSession(): Promise<void> {
  clearAuth();
  clearStudentLocalData();
  const auth = getFirebaseAuth();
  if (!auth?.currentUser) return;
  try {
    await signOut(auth);
  } catch {
    // Canonical deletion may already have removed the Firebase identity.
  }
}

async function requireFreshLogin(): Promise<never> {
  await endBrowserSession();
  window.location.assign(`/login/student?next=${encodeURIComponent("/account-deletion")}`);
  return new Promise<never>(() => undefined);
}

export default function AccountDeletionPage() {
  usePageMeta(
    "Delete ExamTree account",
    "Request deletion of your ExamTree learner account and associated learning data.",
  );

  const user = getUser();
  const [confirmation, setConfirmation] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<DeletionResponse | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const deleteAccount = async () => {
    if (confirmation.trim() !== CONFIRMATION || submitting) return;
    setSubmitting(true);
    setMessage(null);
    try {
      const response = await apiRequest<DeletionResponse>("/users/me", {
        method: "DELETE",
        body: JSON.stringify({ confirmation: CONFIRMATION }),
      });
      await endBrowserSession();
      setResult(response);
      setConfirmation("");
    } catch (error) {
      if (
        error instanceof ApiError &&
        error.status === 401 &&
        getApiErrorCode(error.body) === "REAUTH_REQUIRED"
      ) {
        await requireFreshLogin();
      }
      setMessage(
        error instanceof ApiError && getApiErrorCode(error.body) === "ACCOUNT_DELETION_NOT_ALLOWED"
          ? "This account cannot be deleted through the learner self-service flow. Contact ExamTree support."
          : "Account deletion could not be completed. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (result) {
    return (
      <main className="min-h-screen bg-background px-4 py-12 sm:px-6">
        <div className="mx-auto max-w-2xl">
          <Card>
            <CardHeader>
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <CardTitle className="text-2xl">
                {result.status === "pending" ? "Your data has been erased" : "Your account has been deleted"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm leading-6 text-muted-foreground">
              <p>
                {result.status === "pending"
                  ? "Your learner-owned ExamTree data has been erased and you have been signed out. Final identity cleanup is still completing on the server."
                  : "Your learner account and learner-owned data have been deleted and you have been signed out."}
              </p>
              {result.retainedFinancialRecords ? (
                <p>
                  Limited financial or security records may remain in pseudonymous form where ExamTree has a legitimate record-keeping obligation.
                </p>
              ) : null}
              <Link href="/">
                <Button>Return to ExamTree</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-3xl space-y-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Privacy & account</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground">Delete your ExamTree account</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
            This page is the web self-service deletion resource for ExamTree learner accounts. You do not need the mobile app installed to use it.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" /> What deletion removes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-6 text-muted-foreground">
            <p>Deletion permanently erases your learner profile, test attempts, results, active entitlements, and other learner-owned learning history.</p>
            <p>Financial and security records may be retained only where there is a legitimate record-keeping requirement. Those retained records are detached from your email/name through an anonymized account tombstone.</p>
            <p>See the <Link href="/privacy" className="font-medium text-primary underline underline-offset-4">Privacy Policy</Link> for the full retention summary.</p>
          </CardContent>
        </Card>

        {!user ? (
          <Card>
            <CardHeader>
              <CardTitle>Sign in to verify ownership</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <p>Account deletion requires authentication so another person cannot delete your account. Sign in with the account you want to delete.</p>
              <Link href={`/login/student?next=${encodeURIComponent("/account-deletion")}`}>
                <Button>Sign in to request deletion</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-destructive/30">
            <CardHeader>
              <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <CardTitle>Permanent deletion</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm leading-6 text-muted-foreground">
                Signed in as <strong className="text-foreground">{user.email}</strong>. This action cannot be undone. If your login is older than the security window, ExamTree will ask you to sign in again before deletion proceeds.
              </p>
              <div className="space-y-2">
                <Label htmlFor="deletion-confirmation">Type {CONFIRMATION} to continue</Label>
                <Input
                  id="deletion-confirmation"
                  value={confirmation}
                  onChange={(event) => setConfirmation(event.target.value)}
                  autoComplete="off"
                  spellCheck={false}
                  aria-describedby="deletion-warning"
                />
              </div>
              <p id="deletion-warning" className="text-xs text-muted-foreground">Your learning history and active entitlements will be permanently erased.</p>
              {message ? <p role="alert" className="text-sm font-medium text-destructive">{message}</p> : null}
              <Button
                variant="destructive"
                className="w-full sm:w-auto"
                disabled={confirmation.trim() !== CONFIRMATION || submitting}
                onClick={() => void deleteAccount()}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                {submitting ? "Deleting account…" : "Delete account permanently"}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}
