import { TooltipProps } from "recharts";

export function MonthlyActivityTooltip({
  active,
  payload,
  label,
}: TooltipProps<number, string>) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  return (
    <div className="rounded-lg border border-white/10 bg-black px-4 py-3 shadow-xl">
      <p className="mb-2 text-sm font-medium text-white">{label}</p>

      <div className="space-y-1 text-xs">
        {payload.map((item) => (
          <div
            key={item.dataKey}
            className="flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-2">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-gray-400 capitalize">{item.dataKey}</span>
            </div>
            <span className="text-white font-medium">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
