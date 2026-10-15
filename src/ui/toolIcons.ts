import { BatteryCharging, Cable, Gauge, RefreshCw, TrendingDown, Wrench, Zap, type LucideIcon } from "lucide-react";

/** Maps the `icon` field of src/tools.ts to a lucide icon. */
export const TOOL_ICONS: Record<string, LucideIcon> = {
  Zap,
  Gauge,
  Cable,
  TrendingDown,
  RefreshCw,
  BatteryCharging,
};

export const toolIcon = (name: string): LucideIcon => TOOL_ICONS[name] ?? Wrench;
