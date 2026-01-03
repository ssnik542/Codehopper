import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

type Feature = {
  name: string;
  included: boolean;
};

type Props = {
  title: string;
  price: string;
  description: string;
  features: Feature[];
  isCurrent: boolean;
  ctaLabel: string;
  onClick?: () => void;
  loading?: boolean;
};

export function PlanCard({
  title,
  price,
  description,
  features,
  isCurrent,
  ctaLabel,
  onClick,
  loading,
}: Props) {
  return (
    <Card
      className={cn(
        "relative border p-6 transition",
        isCurrent
          ? "border-yellow-400 shadow-[0_0_0_1px_rgba(234,179,8,0.6)]"
          : "border-white/10"
      )}
    >
      {isCurrent && (
        <span className="absolute top-4 right-4 text-xs rounded-full bg-yellow-400 text-black px-3 py-1">
          Current Plan
        </span>
      )}

      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-xs text-muted-foreground mt-1">{description}</p>

      <div className="mt-4 text-3xl font-bold">
        {price}
        <span className="text-sm text-muted-foreground">/month</span>
      </div>

      <ul className="mt-6 space-y-3 text-sm">
        {features.map((f) => (
          <li key={f.name} className="flex items-center gap-2">
            {f.included ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <X className="h-4 w-4 text-muted-foreground" />
            )}
            <span className={cn(!f.included && "text-muted-foreground")}>
              {f.name}
            </span>
          </li>
        ))}
      </ul>

      <Button
        className="mt-6 w-full outline-4 border-black"
        variant={
          title !== "Pro" ? (isCurrent ? "outline" : "default") : "default"
        }
        onClick={onClick}
        disabled={title !== "Pro" ? isCurrent || loading : false}
      >
        {ctaLabel}
        {!isCurrent && <ExternalLink className="h-4 w-4 ml-2" />}
      </Button>
    </Card>
  );
}
