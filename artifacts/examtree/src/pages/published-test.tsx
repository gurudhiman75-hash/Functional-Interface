import { TestPreparing } from "@/components/TestPreparing";
import { useEffect } from "react";
import { useLocation, useParams } from "wouter";

// Backward-compatible route for links created by the first catalogue bridge.
// Published mocks now open in the same timed test-taking engine as legacy tests.
export default function PublishedTest() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (id) setLocation(`/test/${encodeURIComponent(id)}`, { replace: true });
  }, [id, setLocation]);

  return <TestPreparing />;
}
