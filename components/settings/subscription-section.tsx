import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function SubscriptionSection() {
  return (
    <Card className="bg-black border-white/10 p-6">
      <h2 className="text-lg font-semibold text-gray-200">Subscription</h2>

      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-white">Free Plan</p>
          <p className="text-xs text-gray-400">
            5 repositories · 5 reviews per repo
          </p>
        </div>

        <Link href="/dashboard/billing">
          <Button className="cursor-pointer">Upgrade to Pro</Button>
        </Link>
      </div>
    </Card>
  );
}
