"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Loader2, RefreshCcw, Check, Search } from "lucide-react";
import { toast } from "sonner";

import { checkout, customer } from "@/lib/auth-client";
import {
  getSubscriptionData,
  syncSubscriptionStatus,
} from "@/module/payment/lib/payment-action";
import { CurrentUsage } from "@/components/billing/current-usage";
import { PlanCard } from "@/components/billing/plan-card";

export default function BillingPage() {
  const searchParams = useSearchParams();
  const success = searchParams.get("success");

  const [syncLoading, setSyncLoading] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [portalLoading, setPortalLoading] = useState(false);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["subscription-data"],
    queryFn: getSubscriptionData,
    refetchOnWindowFocus: true,
  });

  console.log(data);

  /* ---------------- Sync Subscription ---------------- */
  const handleSync = async () => {
    try {
      setSyncLoading(true);
      const result = await syncSubscriptionStatus();
      if (result.success) {
        toast.success("Subscription synced");
      }
    } catch {
      toast.error("Failed to sync subscription");
    } finally {
      setSyncLoading(false);
    }
  };

  /* ---------------- Checkout ---------------- */
  const handleCheckout = async () => {
    try {
      setCheckoutLoading(true);
      await checkout({ slug: "codehopper" });
    } catch {
      toast.error("Checkout failed");
      setCheckoutLoading(false);
    } finally {
      setCheckoutLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    try {
      setPortalLoading(true);
      await customer.portal();
    } catch (error) {
      console.log("failed to open portal");
      setPortalLoading(false);
    } finally {
      setPortalLoading(false);
    }
  };

  /* ---------------- Loading ---------------- */
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  /* ---------------- Error ---------------- */
  if (error || !data) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Billing</h1>

        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load billing data.
            <Button
              variant="outline"
              size="sm"
              className="ml-4"
              onClick={() => refetch()}
            >
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const currentTier = data?.user?.subscriptionTier as "FREE" | "PRO";
  const isActive = data?.user?.subscriptionStatus === "ACTIVE";
  const isPro = currentTier === "PRO";

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-10">
      {/* ---------------- Header ---------------- */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Billing & Subscription
          </h1>
          <p className="text-muted-foreground">
            Manage your subscription and usage
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleSync}
          disabled={syncLoading}
          className="bg-black"
        >
          {syncLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCcw className="h-4 w-4 mr-2" />
          )}
          Sync Status
        </Button>
      </div>

      {/* ---------------- Success Alert ---------------- */}
      {success === "true" && (
        <Alert className="border-green-500/30 bg-green-50 dark:bg-green-950">
          <Check className="h-4 w-4 text-green-600" />
          <AlertTitle>Subscription Updated</AlertTitle>
          <AlertDescription>
            Your subscription has been updated successfully. Changes may take a
            few moments to reflect.
          </AlertDescription>
        </Alert>
      )}

      {/* ---------------- Current Plan ---------------- */}
      <Card>
        <CardHeader>
          <CardTitle>Current Plan</CardTitle>
          <CardDescription>Your active subscription details</CardDescription>
        </CardHeader>

        <CardContent className="flex items-center justify-between">
          <div>
            <p className="text-lg font-semibold">{currentTier} Plan</p>
            <p className="text-sm text-muted-foreground">
              Status: {isActive ? "Active" : "Inactive"}
            </p>
          </div>

          {currentTier === "FREE" ? (
            <Button onClick={handleCheckout} disabled={checkoutLoading}>
              {checkoutLoading && (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              )}
              Upgrade to Pro
            </Button>
          ) : (
            <Button onClick={handleManageSubscription} disabled={portalLoading}>
              {portalLoading && (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              )}
              Manage Subscriptions
            </Button>
          )}
        </CardContent>
      </Card>

      {/* ---------------- Current Usage ---------------- */}
      <CurrentUsage
        tier={currentTier}
        reposUsed={data?.limits?.repositories.current || 0}
        reposLimit={currentTier === "FREE" ? 5 : "unlimited"}
        reviewsUsed={Object.keys(data?.limits?.reviews || {}).length}
        reviewsLimit={currentTier === "FREE" ? 25 : "unlimited"}
      />

      <div className="grid md:grid-cols-2 gap-6">
        <PlanCard
          title="Free"
          description="Perfect for getting started"
          price="$0"
          isCurrent={currentTier === "FREE"}
          ctaLabel="Downgrade"
          onClick={handleManageSubscription}
          features={[
            { name: "Up to 5 repositories", included: true },
            { name: "Up to 5 reviews per repository", included: true },
            { name: "Basic code reviews", included: true },
            { name: "Community support", included: true },
            { name: "Advanced analytics", included: false },
            { name: "Priority support", included: false },
          ]}
        />

        <PlanCard
          title="Pro"
          description="For professional developers"
          price="$29.99"
          isCurrent={currentTier === "PRO"}
          ctaLabel={
            currentTier === "PRO" ? "Manage Subscription" : "Upgrade to Pro"
          }
          onClick={
            currentTier === "PRO" ? handleManageSubscription : handleCheckout
          }
          loading={portalLoading}
          features={[
            { name: "Unlimited repositories", included: true },
            { name: "Unlimited reviews", included: true },
            { name: "Advanced code reviews", included: true },
            { name: "Email support", included: true },
            { name: "Advanced analytics", included: true },
            { name: "Priority support", included: true },
          ]}
        />
      </div>
    </div>
  );
}
