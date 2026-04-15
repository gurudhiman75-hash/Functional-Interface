import { useMemo, useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import {
  BookOpen,
  Clock,
  Filter,
  Lock,
  Play,
  Search,
  ShoppingCart,
  Star,
  TrendingUp,
} from "lucide-react";
import { getMyTests, getTests, type PurchasedTest, type Test } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { openRazorpayCheckoutForTest } from "@/lib/razorpay-checkout";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

function formatPrice(cents: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(cents / 100);
}

function TestCard({
  test,
  isPurchased,
  onPurchase,
  onStart,
}: {
  test: Test | PurchasedTest;
  isPurchased: boolean;
  onPurchase: (testId: string, testName: string, priceCents: number) => void;
  onStart: (testId: string) => void;
}) {
  const displayCurrency = import.meta.env.VITE_RAZORPAY_CURRENCY ?? "INR";
  const priceCents = "priceCents" in test ? test.priceCents : 0;

  return (
    <Card className="group hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <CardTitle className="text-lg leading-tight line-clamp-2">{test.name}</CardTitle>
            <CardDescription className="mt-1 flex items-center gap-2 text-sm">
              <span className="capitalize">{test.category}</span>
              {test.subcategoryName && (
                <>
                  <span>â€¢</span>
                  <span>{test.subcategoryName}</span>
                </>
              )}
            </CardDescription>
          </div>
          {isPurchased && (
            <Badge variant="secondary" className="shrink-0">
              <Star className="h-3 w-3 mr-1" />
              Purchased
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{Math.floor(test.duration / 60)}h {test.duration % 60}m</span>
          </div>
          <div className="flex items-center gap-1">
            <BookOpen className="h-4 w-4" />
            <span>{test.totalQuestions} Qs</span>
          </div>
          <div className="flex items-center gap-1">
            <TrendingUp className="h-4 w-4" />
            <span>{test.avgScore}% avg</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant={test.difficulty === "Easy" ? "secondary" : test.difficulty === "Medium" ? "default" : "destructive"}>
              {test.difficulty}
            </Badge>
            <Badge variant="outline" className="capitalize">
              {test.kind?.replace("-", " ")}
            </Badge>
          </div>

          {isPurchased ? (
            <Button
              onClick={() => onStart(test.id)}
              className="gap-2"
              size="sm"
            >
              <Play className="h-4 w-4" />
              Start Test
            </Button>
          ) : (
            <Button
              onClick={() => onPurchase(test.id, test.name, priceCents || 499)}
              variant="outline"
              className="gap-2"
              size="sm"
            >
              <ShoppingCart className="h-4 w-4" />
              Buy {formatPrice(priceCents || 499)}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  // Fetch purchased tests
  const {
    data: myTestsData,
    isLoading: myTestsLoading,
    error: myTestsError,
  } = useQuery({
    queryKey: ["my-tests"],
    queryFn: getMyTests,
  });

  // Fetch all available tests
  const {
    data: allTests,
    isLoading: allTestsLoading,
    error: allTestsError,
  } = useQuery({
    queryKey: ["tests"],
    queryFn: getTests,
  });

  const purchasedTestIds = useMemo(() => {
    return new Set(myTestsData?.purchasedTests?.map(t => t.id) || []);
  }, [myTestsData]);

  const purchasedTests = myTestsData?.purchasedTests || [];
  const availableTests = useMemo(() => {
    return (allTests || []).filter(test => !purchasedTestIds.has(test.id));
  }, [allTests, purchasedTestIds]);

  // Get unique categories for filter
  const categories = useMemo(() => {
    const allTestsCombined = [...purchasedTests, ...availableTests];
    return Array.from(new Set(allTestsCombined.map(test => test.category))).sort();
  }, [purchasedTests, availableTests]);

  // Filter and search logic
  const filteredPurchasedTests = useMemo(() => {
    return purchasedTests.filter(test => {
      const matchesSearch = test.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          test.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === "all" || test.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [purchasedTests, searchQuery, categoryFilter]);

  const filteredAvailableTests = useMemo(() => {
    return availableTests.filter(test => {
      const matchesSearch = test.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          test.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === "all" || test.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [availableTests, searchQuery, categoryFilter]);

  const handlePurchase = async (testId: string, testName: string, priceCents: number) => {
    try {
      await openRazorpayCheckoutForTest({
        testId,
        successPath: `/dashboard?purchase=success`,
        onPaid: async () => {
          await queryClient.invalidateQueries({ queryKey: ["my-tests"] });
          await queryClient.invalidateQueries({ queryKey: ["me", "entitlements"] });
          toast({
            title: "Purchase successful!",
            description: `${testName} has been added to your tests.`,
          });
          setLocation(`/dashboard?purchase=success`);
        },
        onError: (message) => {
          toast({
            title: "Purchase failed",
            description: message,
            variant: "destructive",
          });
        },
      });
    } catch (error) {
      toast({
        title: "Purchase failed",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    }
  };

  const handleStartTest = (testId: string) => {
    setLocation(`/test/${testId}`);
  };

  const loading = myTestsLoading || allTestsLoading;
  const error = myTestsError || allTestsError;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-lg font-semibold text-destructive mb-2">Failed to load dashboard</p>
          <p className="text-muted-foreground">Please try refreshing the page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">
          My Dashboard
        </h1>
        <p className="text-muted-foreground">
          Access your purchased tests and discover new ones to prepare for your exams.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search tests..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <section className="mb-12">
        <div className="flex items-center gap-2 mb-6">
          <BookOpen className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-semibold text-foreground">
            My Purchased Tests ({filteredPurchasedTests.length})
          </h2>
        </div>

        {filteredPurchasedTests.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Lock className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No purchased tests yet
              </h3>
              <p className="text-muted-foreground text-center mb-4">
                Purchase your first test below to start preparing for your exams.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredPurchasedTests.map((test) => (
              <TestCard
                key={test.id}
                test={test}
                isPurchased={true}
                onPurchase={handlePurchase}
                onStart={handleStartTest}
              />
            ))}
          </div>
        )}
      </section>

      <section>
        <div className="flex items-center gap-2 mb-6">
          <ShoppingCart className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-semibold text-foreground">
            Available Tests ({filteredAvailableTests.length})
          </h2>
        </div>

        {filteredAvailableTests.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No tests available
              </h3>
              <p className="text-muted-foreground text-center">
                Check back later for new tests.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredAvailableTests.map((test) => (
              <TestCard
                key={test.id}
                test={test}
                isPurchased={false}
                onPurchase={handlePurchase}
                onStart={handleStartTest}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
