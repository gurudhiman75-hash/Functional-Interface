import "@/styles/test-preparing.css";

export function isTestLoadingRoute(location: string) {
  return /^\/(?:test|published-tests)\/[^/]+\/?$/.test(location.split("?")[0]);
}

/** Displays actual pending work only; it never delays or starts an attempt. */
export function TestPreparing({ testName }: { testName?: string }) {
  return (
    <div className="test-preparing" data-testid="test-preparing">
      <section className="test-preparing-panel" role="status" aria-live="polite" aria-atomic="true">
        <p className="test-preparing-brand" aria-hidden="true">Exam<span>tree</span></p>
        <div className="test-preparing-spinner" aria-hidden="true" />
        <h1>Preparing your test…</h1>
        {testName && <p className="test-preparing-name">{testName}</p>}
        <p className="test-preparing-description">Loading questions and checking your saved progress.</p>
        <p className="test-preparing-note">Please keep this page open.</p>
      </section>
    </div>
  );
}
