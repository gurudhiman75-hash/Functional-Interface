type RestorableAuth = {
  authStateReady(): Promise<void>;
  readonly currentUser: { getIdToken(): Promise<string> } | null;
};

/** Firebase starts with currentUser=null while restoring browser persistence. */
export async function getRestoredAuthHeader(auth: RestorableAuth | null): Promise<Record<string, string>> {
  if (!auth) return {};
  await auth.authStateReady();
  const currentUser = auth.currentUser;
  if (!currentUser) return {};
  // A token failure must not turn a signed-in request into an anonymous request.
  const token = await currentUser.getIdToken();
  return { Authorization: `Bearer ${token}` };
}
