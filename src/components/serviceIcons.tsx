import type { LucideIcon } from "lucide-react";
import {
  Cpu,
  Gauge,
  Settings2,
  MonitorSmartphone,
  CircuitBoard,
  Server,
  Wrench,
  Zap,
  Cog,
} from "lucide-react";

export const SERVICE_ICONS: Record<string, LucideIcon> = {
  "programmation-plc": Cpu,
  "variateurs-vfd": Gauge,
  "servo-variateurs": Settings2,
  "ihm-scada": MonitorSmartphone,
  "reparation-carte-electronique": CircuitBoard,
  "armoires-de-commande": Server,
  "reparation-machine-industrielle": Wrench,
  "groupe-electrogene": Zap,
};

export function serviceIcon(slug: string): LucideIcon {
  return SERVICE_ICONS[slug] ?? Cog;
}
