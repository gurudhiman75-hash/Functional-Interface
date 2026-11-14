import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "wouter";
import { getCommercePurchases } from "@/lib/commerce";
import { getSessionUser } from "@/lib/session-user";
import { Button } from "@/components/ui/button";

export default function PurchasedPackagePage() {
  const { id } = useParams<{ id: string }>();
  const purchases = useQuery({ queryKey: ["commerce-purchases", getSessionUser()?.id], queryFn: getCommercePurchases, staleTime: 0, retry: 1 });
  const entitlement = purchases.data?.entitlements.find((entry) => entry.id === id);
  const active = entitlement?.accessStatus === "active";
  return <div className="mx-auto max-w-3xl px-4 py-8">
    <Link href="/my-packages" className="inline-flex min-h-11 items-center text-sm underline">Back to My purchases</Link>
    <h1 className="mt-4 text-2xl font-bold">{entitlement?.productTitle ?? (purchases.isLoading ? "Loading package…" : "Package unavailable")}</h1>
    {purchases.isError ? <div role="alert" className="mt-4"><p>Unable to load your package.</p><Button className="mt-3" onClick={() => purchases.refetch()}>Try again</Button></div> : entitlement ? <>
      <p className="mt-3 text-sm text-muted-foreground">{entitlement.productDescription}</p>
      {!active ? <p className="mt-5">Your package access is {entitlement.accessStatus}. Visit My purchases for details.</p> : <section className="mt-6 space-y-3" aria-label="Included tests">
        {entitlement.tests?.length ? entitlement.tests.map((test) => <div key={test.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-card p-4"><span className="font-semibold">{test.label || "Included test"}</span><Link href={`/test/${encodeURIComponent(test.id)}`} className="inline-flex min-h-11 items-center rounded-lg bg-primary px-4 font-semibold text-primary-foreground">Start test</Link></div>) : <p>There are no available tests in this package right now.</p>}
      </section>}
    </> : !purchases.isLoading && !purchases.isError ? <p className="mt-4">This package is unavailable for your signed-in account.</p> : null}
  </div>;
}
