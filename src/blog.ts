import type { Lang } from "./i18n";

/**
 * Blog articles. Each post is authored here (live on deploy) in French, English and Arabic.
 * The owner can show/hide, reorder and edit posts from /admin → Blog (overrides stored in
 * site_content → "blog", merged on top of these defaults). Bodies are written in a small
 * Markdown subset (see src/ui/markdown.ts).
 */

type L<T = string> = Record<Lang, T>;

export type Post = {
  slug: string;
  /** ISO date (publication). */
  date: string;
  pillar?: string;
  /** Optional cover image path. */
  cover?: string;
  title: L;
  description: L;
  /** Article body in Markdown, per language. */
  body: L;
};

export const BLOG_PATH = "/blog";
export const postPath = (p: Post) => `${BLOG_PATH}/${p.slug}`;

export const BLOG_HUB: { eyebrow: L; h1: L; title: L; description: L; intro: L; readMore: L; backToBlog: L; published: L } = {
  eyebrow: { fr: "Blog", en: "Blog", ar: "المدونة" },
  h1: { fr: "Conseils automatisme & électronique industrielle", en: "Industrial automation & electronics insights", ar: "نصائح في الأتمتة والإلكترونيك الصناعي" },
  title: {
    fr: "Blog – automatisme, programmation PLC/IHM et réparation industrielle | MTE",
    en: "Blog – automation, PLC/HMI programming and industrial repair | MTE",
    ar: "المدونة – الأتمتة، برمجة PLC/HMI والتصليح الصناعي | MTE",
  },
  description: {
    fr: "Articles pratiques sur la programmation d'automates (PLC) et d'écrans IHM, et la réparation électronique industrielle en Algérie. Par MTE.",
    en: "Practical articles on PLC and HMI programming and industrial electronics repair in Algeria. By MTE.",
    ar: "مقالات عملية حول برمجة المتحكمات (PLC) وشاشات IHM، والتصليح الإلكتروني الصناعي في الجزائر. من MTE.",
  },
  intro: {
    fr: "Des articles concrets pour les équipes de maintenance : programmation d'automates et d'IHM, dépannage et réparation d'équipements industriels.",
    en: "Practical articles for maintenance teams: PLC and HMI programming, troubleshooting and repair of industrial equipment.",
    ar: "مقالات عملية لفرق الصيانة: برمجة المتحكمات وشاشات IHM، تصليح وإصلاح المعدات الصناعية.",
  },
  readMore: { fr: "Lire l'article", en: "Read the article", ar: "اقرأ المقال" },
  backToBlog: { fr: "Tous les articles", en: "All articles", ar: "كل المقالات" },
  published: { fr: "Publié le", en: "Published", ar: "نُشر في" },
};

export const DEFAULT_POSTS: Post[] = [
  {
    slug: "programme-automate-perdu",
    date: "2026-10-16",
    pillar: "plc-programming",
    title: {
      fr: "Programme d'automate perdu : comment le récupérer ou le réécrire",
      en: "Lost PLC program: how to recover or rewrite it",
      ar: "فقدان برنامج المتحكم (PLC): كيف تسترجعه أو تعيد كتابته",
    },
    description: {
      fr: "Programme d'automate (PLC) perdu ? Comment le récupérer depuis l'automate ou le réécrire, et éviter que ça se reproduise. MTE, Algérie.",
      en: "Lost PLC program? How to recover it from the controller or rewrite it, and stop it happening again. MTE, Algeria.",
      ar: "هل فقدت برنامج المتحكم؟ كيف تسترجعه من المتحكم أو تعيد كتابته، وتتفادى تكرار ذلك. MTE، الجزائر.",
    },
    body: {
      fr: `Votre machine fonctionne, mais le fichier source du programme a disparu : la personne qui l'avait fait est partie, le PC d'origine est en panne, ou personne ne sait où est la sauvegarde. Le jour où il faut modifier la machine — ou qu'elle tombe en panne — ce programme devient introuvable. C'est l'une des situations les plus fréquentes que nous rencontrons dans les usines en Algérie.

**La réponse courte :** dans beaucoup de cas, le programme peut être **lu directement dans l'automate** (s'il n'est pas protégé). Quand ce n'est pas possible, on le **réécrit** à partir du fonctionnement réel de la machine. Dans les deux cas, vous repartez avec une **sauvegarde documentée**.

## 1. Récupérer le programme depuis l'automate

La première chose à tenter : transférer le programme depuis la mémoire de l'automate vers un PC (opération dite *upload*). C'est possible sur la plupart des marques : **Siemens** (S7-1200/1500 avec TIA Portal, S7-300/400 avec Step 7, LOGO!), **Schneider** (Modicon, Zelio), **Omron**, **Fatek**, **Delta** et **Mitsubishi**.

Deux points importants :

- **Les commentaires et les noms de variables ne sont pas toujours stockés dans l'automate.** Sur un S7-300/400, on récupère la logique mais souvent sans les commentaires : le programme est fonctionnel mais moins lisible. Sur les automates récents (S7-1200/1500), le projet complet peut être conservé dans la CPU.
- **Une protection peut bloquer la lecture.** Mot de passe, know-how protection, blocs verrouillés : on évalue au cas par cas.

## 2. Si le programme est protégé ou illisible

Quand la lecture directe échoue : vérifier les sauvegardes existantes (clé USB, carte mémoire, e-mail du fournisseur), contacter le constructeur de la machine (OEM), ou réécrire le programme à partir de la machine.

## 3. Réécrire le programme à partir de la machine

C'est la **rétro-ingénierie fonctionnelle** : comprendre ce que fait la machine, puis reconstruire le programme.

1. **Relever les entrées/sorties** : capteurs, actionneurs, sécurités.
2. **Observer les séquences** : ordre de travail, temporisations, conditions de démarrage/arrêt.
3. **Écrire et tester** le programme, étape par étape, avec vos opérateurs.

Le temps dépend de la complexité : quelques jours pour une petite machine, plus pour une ligne complète.

## Évitez que ça se reproduise : la sauvegarde

Gardez le **fichier source** (pas seulement la version compilée) et une courte documentation. Conservez une copie **hors de la machine**. Notez la version à chaque modification. C'est ce que nous remettons après chaque intervention.

## Comment MTE peut vous aider

Nous programmons et récupérons les automates **Siemens, Schneider, Omron, Fatek, Delta et Mitsubishi**, ainsi que leurs écrans IHM. Diagnostic sous 24 à 48 h, devis gratuit, sur site partout en Algérie. Besoin d'aide ? [Voir nos services](/#services) ou [essayez nos outils de calcul](/outils).

👉 **Programme perdu ou machine à modifier ?** Envoyez-nous le modèle de l'automate et une photo de l'armoire sur WhatsApp — nous vous disons rapidement ce qui est récupérable.`,
      en: `Your machine runs, but the program's source file is gone: the person who wrote it has left, the original PC is dead, or nobody knows where the backup is. The day you need to modify the machine — or it breaks down — that program is nowhere to be found. It's one of the most common situations we meet in Algerian factories.

**The short answer:** in many cases the program can be **read straight from the controller** (if it isn't protected). When that isn't possible, we **rewrite** it from how the machine actually works. Either way, you leave with a **documented backup**.

## 1. Recover the program from the controller

The first thing to try: transfer the program from the controller's memory to a PC (an *upload*). This works on most brands: **Siemens** (S7-1200/1500 with TIA Portal, S7-300/400 with Step 7, LOGO!), **Schneider** (Modicon, Zelio), **Omron**, **Fatek**, **Delta** and **Mitsubishi**.

Two important points:

- **Comments and variable names aren't always stored in the controller.** On an S7-300/400 you recover the logic but often without the comments: the program is functional but less readable. On newer controllers (S7-1200/1500), the full project can be kept in the CPU.
- **Protection can block the read.** Password, know-how protection, locked blocks: we assess case by case.

## 2. If the program is protected or unreadable

When a direct read fails: check existing backups (USB stick, memory card, supplier email), contact the machine builder (OEM), or rewrite the program from the machine.

## 3. Rewrite the program from the machine

This is **functional reverse engineering**: understand what the machine does, then rebuild the program.

1. **List the inputs/outputs**: sensors, actuators, safety devices.
2. **Observe the sequences**: work order, timers, start/stop conditions.
3. **Write and test** the program, step by step, with your operators.

The time depends on complexity: a few days for a small machine, more for a full line.

## Stop it happening again: the backup

Keep the **source file** (not just the compiled version) and short documentation. Store a copy **off the machine**. Note the version at each change. That's what we hand back after every job.

## How MTE can help

We program and recover **Siemens, Schneider, Omron, Fatek, Delta and Mitsubishi** controllers, and their HMI screens. Diagnosis within 24-48h, free quote, on site across Algeria. Need a hand? [See our services](/en/#services) or [try our calculators](/en/outils).

👉 **Lost program or a machine to modify?** Send us the controller model and a photo of the panel on WhatsApp — we'll quickly tell you what's recoverable.`,
      ar: `آلتك تعمل، لكن الملف المصدري للبرنامج اختفى: الشخص الذي أنجزه غادر، أو الحاسوب الأصلي تعطّل، أو لا أحد يعرف مكان النسخة الاحتياطية. وفي اليوم الذي تحتاج فيه إلى تعديل الآلة — أو عندما تتعطّل — يصبح هذا البرنامج غير موجود. هذه من أكثر الحالات شيوعاً في المصانع الجزائرية.

**الجواب المختصر:** في كثير من الحالات يمكن **قراءة البرنامج مباشرة من المتحكم** (إن لم يكن محمياً). وعندما يتعذّر ذلك، نعيد **كتابته** انطلاقاً من طريقة عمل الآلة فعلياً. وفي الحالتين، تخرج بنسخة **احتياطية موثّقة**.

## 1. استرجاع البرنامج من المتحكم

أول ما نجرّبه: نقل البرنامج من ذاكرة المتحكم إلى حاسوب (عملية الرفع *upload*). هذا ممكن في أغلب الماركات: **Siemens** (S7-1200/1500 عبر TIA Portal، وS7-300/400 عبر Step 7، وLOGO!)، و**Schneider** (Modicon، Zelio)، و**Omron**، و**Fatek**، و**Delta**، و**Mitsubishi**.

نقطتان مهمتان:

- **التعليقات وأسماء المتغيرات ليست دائماً مخزّنة في المتحكم.** في S7-300/400 نسترجع المنطق لكن غالباً دون التعليقات: البرنامج يعمل لكنه أقل وضوحاً. أما في المتحكمات الحديثة (S7-1200/1500) فيمكن حفظ المشروع كاملاً في المعالج.
- **قد تمنع الحماية القراءة.** كلمة مرور، حماية المعرفة (know-how)، كتل مقفلة: نقيّم كل حالة على حدة.

## 2. إذا كان البرنامج محمياً أو غير قابل للقراءة

عند فشل القراءة المباشرة: تحقّق من النسخ الاحتياطية الموجودة (قرص USB، بطاقة ذاكرة، بريد المورّد)، أو تواصل مع صانع الآلة (OEM)، أو أعد كتابة البرنامج انطلاقاً من الآلة.

## 3. إعادة كتابة البرنامج انطلاقاً من الآلة

هذه هي **الهندسة العكسية الوظيفية**: فهم ما تقوم به الآلة، ثم إعادة بناء البرنامج.

1. **حصر المداخل/المخارج**: الحساسات، المشغّلات، وسائل الأمان.
2. **ملاحظة التسلسلات**: ترتيب العمل، المؤقتات، شروط التشغيل/التوقف.
3. **كتابة البرنامج واختباره** خطوة بخطوة مع المشغّلين.

تعتمد المدة على التعقيد: بضعة أيام لآلة صغيرة، وأكثر لخط إنتاج كامل.

## تفادَ تكرار ذلك: النسخة الاحتياطية

احتفظ بـ **الملف المصدري** (لا النسخة المترجمة فقط) مع توثيق مختصر. احفظ نسخة **خارج الآلة**. دوّن الإصدار عند كل تعديل. هذا ما نسلّمه بعد كل تدخّل.

## كيف تساعدك MTE

نبرمج ونسترجع متحكمات **Siemens وSchneider وOmron وFatek وDelta وMitsubishi**، وكذلك شاشات IHM. تشخيص خلال 24 إلى 48 ساعة، عرض سعر مجاني، في الموقع عبر كامل الجزائر. تحتاج مساعدة؟ [خدماتنا](/ar/#services) أو [جرّب أدوات الحساب](/ar/outils).

👉 **برنامج مفقود أو آلة بحاجة لتعديل؟** أرسل لنا طراز المتحكم وصورة للخزانة عبر واتساب — نخبرك بسرعة بما يمكن استرجاعه.`,
    },
  },
];

/* ───────────── Admin-managed config (site_content → "blog") ───────────── */

export type PostOverride = { title?: string; description?: string; body?: string };
export type BlogConfig = {
  order?: string[];
  hidden?: string[];
  text?: Partial<Record<string, Partial<Record<Lang, PostOverride>>>>;
};

export function orderedPosts(cfg?: BlogConfig, includeHidden = false): Post[] {
  const hidden = new Set(cfg?.hidden ?? []);
  const bySlug = new Map(DEFAULT_POSTS.map((p) => [p.slug, p]));
  const out: Post[] = [];
  for (const slug of cfg?.order ?? []) {
    const p = bySlug.get(slug);
    if (p) { out.push(p); bySlug.delete(slug); }
  }
  for (const p of DEFAULT_POSTS) if (bySlug.has(p.slug)) out.push(p);
  const kept = includeHidden ? out : out.filter((p) => !hidden.has(p.slug));
  return kept.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export const isPostHidden = (slug: string, cfg?: BlogConfig) => Boolean(cfg?.hidden?.includes(slug));
export const findPost = (slug: string | undefined) => DEFAULT_POSTS.find((p) => p.slug === slug) ?? null;

const ov = (cfg: BlogConfig | undefined, slug: string, lang: Lang) => cfg?.text?.[slug]?.[lang];
export const postTitle = (p: Post, lang: Lang, cfg?: BlogConfig) => ov(cfg, p.slug, lang)?.title?.trim() || p.title[lang];
export const postDescription = (p: Post, lang: Lang, cfg?: BlogConfig) => ov(cfg, p.slug, lang)?.description?.trim() || p.description[lang];
export const postBody = (p: Post, lang: Lang, cfg?: BlogConfig) => ov(cfg, p.slug, lang)?.body?.trim() || p.body[lang];
