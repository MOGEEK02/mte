import type { Lang } from "./i18n";

/**
 * Free electrical-engineering calculators (/outils). Each tool is a page with an interactive
 * calculator (src/ui/calculators.tsx) and its own SEO text, in French, English and Arabic.
 * The paths are also listed in api/sitemap.js (TOOLS_PATHS) for the sitemap.
 */

type L<T = string> = Record<Lang, T>;

export type Tool = {
  slug: string;
  /** lucide-react icon name. */
  icon: string;
  title: L;
  /** Search keyword, used in the page title. */
  keyword: L;
  /** Short line on the hub card. */
  tagline: L;
  /** Meta description. */
  description: L;
  /** Opening paragraph (SEO + context). */
  intro: L;
  /** The formula, shown as a note. */
  formula: L;
  /** Assumptions / good-to-know bullets. */
  notes: L<string[]>;
};

export const TOOLS: Tool[] = [
  {
    slug: "loi-ohm",
    icon: "Zap",
    title: { fr: "Loi d’Ohm & puissance", en: "Ohm’s law & power", ar: "قانون أوم والقدرة" },
    keyword: { fr: "Calcul loi d’Ohm", en: "Ohm’s law calculator", ar: "حاسبة قانون أوم" },
    tagline: {
      fr: "Tension, courant, résistance et puissance.",
      en: "Voltage, current, resistance and power.",
      ar: "الجهد، التيار، المقاومة والقدرة.",
    },
    description: {
      fr: "Calculateur de la loi d’Ohm : entrez deux valeurs parmi tension (U), courant (I) et résistance (R), obtenez la troisième et la puissance (P). Gratuit, en ligne.",
      en: "Ohm’s law calculator: enter any two of voltage (U), current (I) and resistance (R) to get the third and the power (P). Free, online.",
      ar: "حاسبة قانون أوم: أدخل قيمتين من الجهد (U) والتيار (I) والمقاومة (R) للحصول على الثالثة والقدرة (P). مجانية وعلى الإنترنت.",
    },
    intro: {
      fr: "La loi d’Ohm relie la tension U (volts), le courant I (ampères) et la résistance R (ohms). Avec deux de ces trois grandeurs, on calcule la troisième ainsi que la puissance dissipée P (watts). Indiquez les valeurs que vous connaissez.",
      en: "Ohm’s law links voltage U (volts), current I (amperes) and resistance R (ohms). With any two of them you can find the third and the dissipated power P (watts). Enter the values you know.",
      ar: "يربط قانون أوم بين الجهد U (فولط) والتيار I (أمبير) والمقاومة R (أوم). بمعرفة قيمتين منها يمكن حساب الثالثة وكذلك القدرة المبدَّدة P (واط). أدخل القيم التي تعرفها.",
    },
    formula: { fr: "U = R × I   ·   P = U × I = R × I²", en: "U = R × I   ·   P = U × I = R × I²", ar: "U = R × I   ·   P = U × I = R × I²" },
    notes: {
      fr: ["Valable en courant continu et, en alternatif, pour une charge purement résistive.", "Pour un moteur ou une charge inductive, utilisez le calcul de courant moteur (cos φ)."],
      en: ["Valid for DC and, in AC, for a purely resistive load.", "For a motor or an inductive load, use the motor current calculator (cos φ)."],
      ar: ["صالح للتيار المستمر، وفي المتناوب للحمل المقاوم البحت.", "بالنسبة لمحرك أو حمل حثي، استعمل حاسبة تيار المحرك (cos φ)."],
    },
  },
  {
    slug: "courant-moteur",
    icon: "Gauge",
    title: { fr: "Courant moteur triphasé", en: "Three-phase motor current", ar: "تيار المحرك ثلاثي الطور" },
    keyword: { fr: "Calcul courant moteur", en: "Motor current calculator", ar: "حساب تيار المحرك" },
    tagline: {
      fr: "Intensité d’un moteur à partir de la puissance.",
      en: "Motor current from its power rating.",
      ar: "شدة تيار المحرك انطلاقاً من قدرته.",
    },
    description: {
      fr: "Calcul du courant nominal d’un moteur triphasé à partir de la puissance (kW), la tension, le cos φ et le rendement. Choisir câble et protection. Gratuit.",
      en: "Three-phase motor full-load current from power (kW), voltage, power factor and efficiency. Size the cable and protection. Free online tool.",
      ar: "حساب التيار الاسمي لمحرك ثلاثي الطور انطلاقاً من القدرة (kW) والجهد وعامل القدرة والمردود. اختيار الكابل والحماية. أداة مجانية.",
    },
    intro: {
      fr: "Estimez le courant absorbé par un moteur asynchrone triphasé à partir de sa puissance mécanique (kW), la tension du réseau, le facteur de puissance (cos φ) et le rendement (η). Ce courant sert à choisir la section du câble et le calibre de la protection.",
      en: "Estimate the current drawn by a three-phase induction motor from its mechanical power (kW), the supply voltage, the power factor (cos φ) and the efficiency (η). This current is used to choose the cable section and the protection rating.",
      ar: "قدّر التيار الذي يسحبه محرك تحريضي ثلاثي الطور انطلاقاً من قدرته الميكانيكية (kW) وجهد الشبكة وعامل القدرة (cos φ) والمردود (η). يُستعمل هذا التيار لاختيار مقطع الكابل وعيار الحماية.",
    },
    formula: { fr: "I = P / (√3 × U × cos φ × η)", en: "I = P / (√3 × U × cos φ × η)", ar: "I = P / (√3 × U × cos φ × η)" },
    notes: {
      fr: ["Courant nominal en régime établi ; le courant de démarrage direct vaut 5 à 8 fois ce courant.", "Valeurs usuelles : cos φ 0,8–0,86, rendement 0,85–0,92 selon la puissance."],
      en: ["Full-load current in steady state; the direct-on-line starting current is 5 to 8 times this value.", "Typical values: cos φ 0.8–0.86, efficiency 0.85–0.92 depending on power."],
      ar: ["التيار الاسمي في النظام المستقر؛ تيار الإقلاع المباشر يساوي 5 إلى 8 أضعاف هذه القيمة.", "قيم معتادة: cos φ من 0,8 إلى 0,86، المردود من 0,85 إلى 0,92 حسب القدرة."],
    },
  },
  {
    slug: "section-cable",
    icon: "Cable",
    title: { fr: "Section de câble", en: "Cable size", ar: "مقطع الكابل" },
    keyword: { fr: "Calcul section de câble", en: "Cable size calculator", ar: "حساب مقطع الكابل" },
    tagline: {
      fr: "Section minimale selon la chute de tension.",
      en: "Minimum section from the voltage drop.",
      ar: "المقطع الأدنى حسب هبوط الجهد.",
    },
    description: {
      fr: "Calcul de la section de câble (mm²) selon le courant, la longueur, la tension et la chute de tension admissible, en cuivre ou aluminium, mono ou triphasé. Gratuit.",
      en: "Cable section (mm²) from the current, length, voltage and allowed voltage drop, copper or aluminium, single- or three-phase. Free online calculator.",
      ar: "حساب مقطع الكابل (mm²) حسب التيار والطول والجهد وهبوط الجهد المسموح، نحاس أو ألمنيوم، أحادي أو ثلاثي الطور. أداة مجانية.",
    },
    intro: {
      fr: "Déterminez la section minimale d’un câble pour que la chute de tension reste sous la limite admissible (en général 3 % pour l’éclairage, 5 % pour la force motrice). Entrez le courant, la longueur de la ligne et le pourcentage maximal, le calcul propose la section normalisée au-dessus.",
      en: "Find the minimum cable section so the voltage drop stays under the allowed limit (usually 3 % for lighting, 5 % for motors). Enter the current, the line length and the maximum percentage; the tool suggests the next standard section.",
      ar: "حدّد المقطع الأدنى للكابل بحيث يبقى هبوط الجهد تحت الحد المسموح (عادة 3٪ للإنارة و5٪ للقوة المحركة). أدخل التيار وطول الخط والنسبة القصوى، فتقترح الأداة المقطع المعياري الأعلى.",
    },
    formula: {
      fr: "S = (k × ρ × L × I × cos φ) / ΔU   (k = √3 triphasé, 2 monophasé)",
      en: "S = (k × ρ × L × I × cos φ) / ΔU   (k = √3 three-phase, 2 single-phase)",
      ar: "S = (k × ρ × L × I × cos φ) / ΔU   (k = √3 ثلاثي، 2 أحادي)",
    },
    notes: {
      fr: ["Calcul basé sur la chute de tension ; vérifiez aussi le courant admissible (échauffement) selon le mode de pose.", "ρ ≈ 0,0225 Ω·mm²/m pour le cuivre, 0,036 pour l’aluminium."],
      en: ["Based on voltage drop; also check the current-carrying capacity (heating) for the installation method.", "ρ ≈ 0.0225 Ω·mm²/m for copper, 0.036 for aluminium."],
      ar: ["الحساب مبني على هبوط الجهد؛ تحقّق أيضاً من التيار المسموح (التسخين) حسب طريقة التمديد.", "ρ ≈ 0,0225 Ω·mm²/m للنحاس، 0,036 للألمنيوم."],
    },
  },
  {
    slug: "chute-tension",
    icon: "TrendingDown",
    title: { fr: "Chute de tension", en: "Voltage drop", ar: "هبوط الجهد" },
    keyword: { fr: "Calcul chute de tension", en: "Voltage drop calculator", ar: "حساب هبوط الجهد" },
    tagline: {
      fr: "Chute de tension d’une ligne en volts et %.",
      en: "Line voltage drop in volts and %.",
      ar: "هبوط جهد الخط بالفولط والنسبة٪.",
    },
    description: {
      fr: "Calcul de la chute de tension (V et %) d’un câble selon le courant, la longueur, la section et la tension, cuivre ou aluminium, mono ou triphasé. Gratuit en ligne.",
      en: "Voltage drop (V and %) of a cable from the current, length, section and voltage, copper or aluminium, single- or three-phase. Free online calculator.",
      ar: "حساب هبوط الجهد (فولط و٪) لكابل حسب التيار والطول والمقطع والجهد، نحاس أو ألمنيوم، أحادي أو ثلاثي الطور. مجانية على الإنترنت.",
    },
    intro: {
      fr: "Vérifiez la chute de tension d’une ligne existante ou prévue. Entrez le courant, la longueur, la section du conducteur et la tension : le calcul donne la chute en volts et en pourcentage, à comparer à la limite admissible.",
      en: "Check the voltage drop of an existing or planned line. Enter the current, length, conductor section and voltage: the tool gives the drop in volts and as a percentage, to compare with the allowed limit.",
      ar: "تحقّق من هبوط الجهد لخط قائم أو مُزمع. أدخل التيار والطول ومقطع الموصل والجهد: تعطي الأداة الهبوط بالفولط وبالنسبة المئوية لمقارنته بالحد المسموح.",
    },
    formula: {
      fr: "ΔU = (k × ρ × L × I × cos φ) / S   ·   ΔU% = ΔU / U × 100",
      en: "ΔU = (k × ρ × L × I × cos φ) / S   ·   ΔU% = ΔU / U × 100",
      ar: "ΔU = (k × ρ × L × I × cos φ) / S   ·   ΔU% = ΔU / U × 100",
    },
    notes: {
      fr: ["Limites usuelles : 3 % éclairage, 5 % autres usages (force motrice).", "Au-delà, augmentez la section ou réduisez la longueur."],
      en: ["Typical limits: 3 % lighting, 5 % other uses (motors).", "Above that, increase the section or reduce the length."],
      ar: ["حدود معتادة: 3٪ للإنارة، 5٪ للاستعمالات الأخرى (القوة المحركة).", "فوق ذلك، زِد المقطع أو قلّل الطول."],
    },
  },
  {
    slug: "conversion-kw-cv",
    icon: "RefreshCw",
    title: { fr: "Conversion kW ↔ CV", en: "kW ↔ HP conversion", ar: "تحويل kW ↔ حصان" },
    keyword: { fr: "Conversion kW CV", en: "kW to HP converter", ar: "تحويل كيلوواط إلى حصان" },
    tagline: {
      fr: "Puissance en kilowatts et en chevaux.",
      en: "Power in kilowatts and horsepower.",
      ar: "القدرة بالكيلوواط وبالحصان.",
    },
    description: {
      fr: "Convertisseur kW ↔ CV (cheval-vapeur) dans les deux sens. Utile pour les moteurs électriques. Gratuit et instantané.",
      en: "kW ↔ HP (metric horsepower) converter, both ways. Handy for electric motors. Free and instant.",
      ar: "محوّل kW ↔ حصان (حصان متري) في الاتجاهين. مفيد للمحركات الكهربائية. مجاني وفوري.",
    },
    intro: {
      fr: "Convertissez une puissance entre kilowatts (kW) et chevaux-vapeur (CV, cheval métrique). Les puissances des moteurs sont souvent données en CV sur la plaque signalétique et en kW sur les équipements électriques.",
      en: "Convert a power between kilowatts (kW) and metric horsepower (HP/CV). Motor power is often given in HP on the nameplate and in kW on the electrical equipment.",
      ar: "حوّل قدرة بين الكيلوواط (kW) والحصان المتري (CV/HP). غالباً ما تُعطى قدرة المحركات بالحصان على لوحة البيانات وبالكيلوواط على التجهيزات الكهربائية.",
    },
    formula: { fr: "1 CV = 0,7355 kW   ·   1 kW = 1,3596 CV", en: "1 HP = 0.7355 kW   ·   1 kW = 1.3596 HP", ar: "1 حصان = 0,7355 kW   ·   1 kW = 1,3596 حصان" },
    notes: {
      fr: ["Cheval métrique (CV) = 0,7355 kW, utilisé en Europe et au Maghreb.", "Le cheval anglais (HP) vaut 0,7457 kW."],
      en: ["Metric horsepower (CV) = 0.7355 kW, used in Europe and the Maghreb.", "Mechanical/imperial HP is 0.7457 kW."],
      ar: ["الحصان المتري (CV) = 0,7355 kW، مستعمل في أوروبا والمغرب العربي.", "الحصان الإنجليزي (HP) يساوي 0,7457 kW."],
    },
  },
  {
    slug: "compensation-cos-phi",
    icon: "BatteryCharging",
    title: { fr: "Compensation d’énergie réactive", en: "Power factor correction", ar: "تحسين عامل القدرة" },
    keyword: { fr: "Calcul batterie de condensateurs", en: "Power factor correction calculator", ar: "حساب بطارية المكثفات" },
    tagline: {
      fr: "Puissance de condensateurs (kVAR) à installer.",
      en: "Capacitor power (kVAR) to install.",
      ar: "قدرة المكثفات (kVAR) الواجب تركيبها.",
    },
    description: {
      fr: "Calcul de la puissance réactive (kVAR) d’une batterie de condensateurs pour relever le cos φ et éviter les pénalités. À partir de la puissance active et du cos φ visé. Gratuit.",
      en: "Reactive power (kVAR) of a capacitor bank to raise the power factor and avoid penalties, from the active power and the target cos φ. Free online calculator.",
      ar: "حساب القدرة التفاعلية (kVAR) لبطارية مكثفات لرفع عامل القدرة وتفادي الغرامات، انطلاقاً من القدرة الفعّالة وعامل القدرة المستهدف. مجانية.",
    },
    intro: {
      fr: "Déterminez la puissance de condensateurs à installer pour améliorer le facteur de puissance (cos φ) de votre installation, réduire la facture et éviter les pénalités du distributeur. Entrez la puissance active (kW), le cos φ actuel et le cos φ visé.",
      en: "Work out the capacitor power needed to improve your installation’s power factor (cos φ), cut the bill and avoid utility penalties. Enter the active power (kW), the present cos φ and the target cos φ.",
      ar: "حدّد قدرة المكثفات اللازمة لتحسين عامل القدرة (cos φ) لمنشأتك، وتقليل الفاتورة وتفادي غرامات الموزّع. أدخل القدرة الفعّالة (kW) وعامل القدرة الحالي والمستهدف.",
    },
    formula: { fr: "Qc = P × (tan φ₁ − tan φ₂)", en: "Qc = P × (tan φ₁ − tan φ₂)", ar: "Qc = P × (tan φ₁ − tan φ₂)" },
    notes: {
      fr: ["Objectif courant : cos φ ≥ 0,9 à 0,95 pour éviter les pénalités de réactif.", "Au-delà de quelques dizaines de kVAR, prévoir une batterie automatique à gradins."],
      en: ["Common target: cos φ ≥ 0.9 to 0.95 to avoid reactive-energy penalties.", "Above a few tens of kVAR, use an automatic stepped bank."],
      ar: ["هدف شائع: cos φ ≥ 0,9 إلى 0,95 لتفادي غرامات الطاقة التفاعلية.", "فوق بضع عشرات من kVAR، استعمل بطارية آلية متدرّجة."],
    },
  },
];

export const TOOLS_PATH = "/outils";
export const toolPath = (t: Tool) => `${TOOLS_PATH}/${t.slug}`;
export const findTool = (slug: string | undefined) => TOOLS.find((t) => t.slug === slug) ?? null;

/* ───────────── Admin-managed config (site_content → "tools") ───────────── */

export type ToolTextOverride = { title?: string; tagline?: string; intro?: string };
/** Edited in /admin → Outils; what is not set keeps the built-in text/order. */
export type ToolsConfig = {
  order?: string[];
  hidden?: string[];
  text?: Partial<Record<string, Partial<Record<Lang, ToolTextOverride>>>>;
};

/** Tools in the admin order; hidden ones are dropped unless includeHidden. */
export function orderedTools(cfg?: ToolsConfig, includeHidden = false): Tool[] {
  const hidden = new Set(cfg?.hidden ?? []);
  const bySlug = new Map(TOOLS.map((t) => [t.slug, t]));
  const out: Tool[] = [];
  for (const slug of cfg?.order ?? []) {
    const t = bySlug.get(slug);
    if (t) { out.push(t); bySlug.delete(slug); }
  }
  for (const t of TOOLS) if (bySlug.has(t.slug)) out.push(t);
  return includeHidden ? out : out.filter((t) => !hidden.has(t.slug));
}

export const isToolHidden = (slug: string, cfg?: ToolsConfig) => Boolean(cfg?.hidden?.includes(slug));

const ov = (cfg: ToolsConfig | undefined, slug: string, lang: Lang) => cfg?.text?.[slug]?.[lang];
export const toolTitle = (t: Tool, lang: Lang, cfg?: ToolsConfig) => ov(cfg, t.slug, lang)?.title?.trim() || t.title[lang];
export const toolTagline = (t: Tool, lang: Lang, cfg?: ToolsConfig) => ov(cfg, t.slug, lang)?.tagline?.trim() || t.tagline[lang];
export const toolIntro = (t: Tool, lang: Lang, cfg?: ToolsConfig) => ov(cfg, t.slug, lang)?.intro?.trim() || t.intro[lang];

export const TOOLS_HUB: {
  eyebrow: L;
  h1: L;
  title: L;
  description: L;
  intro: L;
} = {
  eyebrow: { fr: "Outils gratuits", en: "Free tools", ar: "أدوات مجانية" },
  h1: { fr: "Outils de calcul électrique", en: "Electrical calculators", ar: "أدوات الحساب الكهربائي" },
  title: {
    fr: "Outils de calcul électrique gratuits – câble, moteur, chute de tension | MTE",
    en: "Free electrical calculators – cable, motor, voltage drop | MTE",
    ar: "أدوات حساب كهربائي مجانية – الكابل، المحرك، هبوط الجهد | MTE",
  },
  description: {
    fr: "Calculateurs électriques gratuits : loi d’Ohm, courant moteur triphasé, section de câble, chute de tension, conversion kW/CV, compensation cos φ. Par MTE, automatisme et électronique industrielle en Algérie.",
    en: "Free electrical calculators: Ohm’s law, three-phase motor current, cable size, voltage drop, kW/HP conversion, power factor correction. By MTE, industrial automation and electronics in Algeria.",
    ar: "أدوات حساب كهربائي مجانية: قانون أوم، تيار المحرك ثلاثي الطور، مقطع الكابل، هبوط الجهد، تحويل kW/حصان، تحسين عامل القدرة. من MTE للأتمتة والإلكترونيات الصناعية في الجزائر.",
  },
  intro: {
    fr: "Des calculateurs gratuits pour vos études et vos dépannages : dimensionnement de câbles, courant moteur, chute de tension, compensation d’énergie réactive. Simples, instantanés et sans inscription.",
    en: "Free calculators for your design and troubleshooting work: cable sizing, motor current, voltage drop, power factor correction. Simple, instant and no sign-up.",
    ar: "أدوات حساب مجانية لدراساتكم وتدخلاتكم: تحجيم الكوابل، تيار المحرك، هبوط الجهد، تحسين الطاقة التفاعلية. بسيطة وفورية وبدون تسجيل.",
  },
};
