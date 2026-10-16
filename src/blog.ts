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
  {
    slug: "ihm-ou-scada",
    date: "2026-10-16",
    pillar: "hmi-programming",
    title: {
      fr: "IHM ou SCADA : lequel choisir pour votre atelier",
      en: "HMI or SCADA: which one for your workshop",
      ar: "IHM أم SCADA: أيّهما تختار لورشتك",
    },
    description: {
      fr: "IHM ou SCADA ? La différence simplement, quand choisir l'un ou l'autre, et comment ils se complètent. MTE, programmation IHM/SCADA en Algérie.",
      en: "HMI or SCADA? The difference explained simply, when to choose each, and how they work together. MTE, HMI/SCADA programming in Algeria.",
      ar: "IHM أم SCADA؟ الفرق ببساطة، ومتى تختار كلاً منهما، وكيف يتكاملان. MTE، برمجة IHM/SCADA في الجزائر.",
    },
    body: {
      fr: `Vous voulez commander et surveiller votre machine ou votre ligne, mais faut-il un **écran IHM** sur la machine, ou une **supervision SCADA** sur PC ? Les deux servent à « voir et commander », mais pas au même niveau.

**La réponse courte :** un **IHM** est un écran tactile posé sur la machine, pour l'opérateur, en local. Un **SCADA** est une supervision centralisée sur PC de toute l'installation, avec historique et alarmes. Souvent, les deux se complètent.

## L'IHM : commander une machine, localement

L'écran opérateur (IHM / HMI) est monté sur l'armoire ou la machine. Il affiche l'état, les défauts et les réglages, avec des boutons et des recettes, et il est relié directement à l'automate. C'est la bonne solution pour **une machine ou un poste**.

## Le SCADA : superviser toute l'installation

Le SCADA est un logiciel qui tourne sur un **PC de supervision**. Il rassemble plusieurs automates et machines, enregistre l'**historique** (courbes, production), gère les **alarmes** et la traçabilité. C'est la bonne solution pour **une ligne complète, une station de pompage ou plusieurs machines**.

## Lequel choisir ?

- **Une seule machine** → un IHM suffit souvent.
- **Plusieurs machines, besoin d'historique et de rapports** → un SCADA.
- Beaucoup d'installations utilisent **les deux** : un IHM local sur chaque machine, un SCADA central pour tout voir.

## Et la communication ?

IHM et SCADA dialoguent avec les automates via **Profinet, Modbus ou Ethernet**. C'est souvent là que se jouent la fiabilité et la vitesse d'affichage : un réseau bien conçu évite les blocages.

## Comment MTE peut vous aider

Nous développons vos **écrans IHM** et votre **supervision SCADA** (pages, alarmes, recettes, historique) et les relions à vos automates Siemens, Schneider, Omron et Fatek. [Voir nos services](/#services) ou [essayez nos outils](/outils).

👉 **Un projet IHM ou SCADA ?** Décrivez-nous votre machine ou votre ligne sur WhatsApp — nous vous proposons la solution adaptée.

## Questions fréquentes

**Peut-on ajouter un SCADA à une installation existante ?**
Oui, sans tout changer : on se connecte aux automates en place et on construit la supervision par-dessus.

**Peut-on garder l'IHM et ajouter un SCADA ?**
Oui, les deux coexistent très bien : l'opérateur garde son écran local, le responsable voit l'ensemble sur le SCADA.

**Faut-il un PC dédié pour le SCADA ?**
C'est recommandé pour la fiabilité. On vous conseille sur le matériel selon la taille de l'installation.`,
      en: `You want to control and monitor your machine or line, but do you need an **HMI screen** on the machine, or a **SCADA** supervision on a PC? Both are for "seeing and commanding", but not at the same level.

**The short answer:** an **HMI** is a touch screen on the machine, for the operator, locally. A **SCADA** is centralised PC supervision of the whole installation, with history and alarms. Often, the two work together.

## HMI: control a machine, locally

The operator panel (HMI) is mounted on the cabinet or the machine. It shows status, faults and settings, with buttons and recipes, and connects directly to the PLC. It's the right fit for **one machine or station**.

## SCADA: supervise the whole installation

SCADA is software running on a **supervision PC**. It gathers several PLCs and machines, records **history** (trends, production), and manages **alarms** and traceability. It's the right fit for **a full line, a pumping station or several machines**.

## Which one to choose?

- **A single machine** → an HMI is often enough.
- **Several machines, need for history and reports** → a SCADA.
- Many installations use **both**: a local HMI on each machine, a central SCADA to see everything.

## And communication?

HMI and SCADA talk to the PLCs over **Profinet, Modbus or Ethernet**. Reliability and display speed often come down to this: a well-designed network avoids freezes.

## How MTE can help

We develop your **HMI screens** and your **SCADA** supervision (pages, alarms, recipes, history) and connect them to your Siemens, Schneider, Omron and Fatek controllers. [See our services](/en/#services) or [try our calculators](/en/outils).

👉 **An HMI or SCADA project?** Tell us about your machine or line on WhatsApp — we'll propose the right solution.

## Frequently asked questions

**Can a SCADA be added to an existing installation?**
Yes, without changing everything: we connect to the PLCs already in place and build the supervision on top.

**Can we keep the HMI and add a SCADA?**
Yes, the two coexist well: the operator keeps the local screen, the manager sees everything on the SCADA.

**Is a dedicated PC needed for SCADA?**
It's recommended for reliability. We advise on the hardware based on the size of the installation.`,
      ar: `تريد التحكّم في آلتك أو خطّك ومراقبته، لكن هل تحتاج إلى **شاشة IHM** على الآلة، أم إلى **إشراف SCADA** على الحاسوب؟ كلاهما لـ«الرؤية والتحكّم»، لكن ليس على المستوى نفسه.

**الجواب المختصر:** الـ**IHM** شاشة لمس على الآلة، للمشغّل، محلياً. أمّا الـ**SCADA** فهو إشراف مركزي على الحاسوب لكامل المنشأة، مع سجلّ وإنذارات. وغالباً ما يتكاملان.

## الـIHM: التحكّم في آلة، محلياً

تُركّب شاشة المشغّل (IHM) على الخزانة أو الآلة. تعرض الحالة والأعطال والإعدادات، مع أزرار ووصفات، وترتبط مباشرة بالمتحكم. إنها الحل المناسب لـ**آلة أو محطّة واحدة**.

## الـSCADA: الإشراف على كامل المنشأة

الـSCADA برنامج يعمل على **حاسوب إشراف**. يجمع عدّة متحكمات وآلات، ويسجّل **السجلّ** (المنحنيات، الإنتاج)، ويدير **الإنذارات** والتتبّع. إنه الحل المناسب لـ**خطّ كامل، أو محطّة ضخّ، أو عدّة آلات**.

## أيّهما تختار؟

- **آلة واحدة** → غالباً تكفي شاشة IHM.
- **عدّة آلات، وحاجة إلى سجلّ وتقارير** → SCADA.
- كثير من المنشآت تستعمل **الاثنين**: IHM محلي على كل آلة، وSCADA مركزي لرؤية كل شيء.

## وماذا عن الاتصال؟

يتواصل IHM وSCADA مع المتحكمات عبر **Profinet أو Modbus أو Ethernet**. وغالباً ما تتوقّف الموثوقية وسرعة العرض على هذا: شبكة مصمّمة جيداً تتفادى التجمّد.

## كيف تساعدك MTE

نطوّر **شاشات IHM** ونظام الإشراف **SCADA** (الصفحات، الإنذارات، الوصفات، السجلّ) ونربطها بمتحكمات Siemens وSchneider وOmron وFatek. [خدماتنا](/ar/#services) أو [جرّب أدواتنا](/ar/outils).

👉 **مشروع IHM أو SCADA؟** صِف لنا آلتك أو خطّك عبر واتساب — نقترح لك الحل المناسب.

## أسئلة شائعة

**هل يمكن إضافة SCADA إلى منشأة قائمة؟**
نعم، دون تغيير كل شيء: نتّصل بالمتحكمات الموجودة ونبني الإشراف فوقها.

**هل يمكن الاحتفاظ بالـIHM وإضافة SCADA؟**
نعم، يتعايشان جيداً: يحتفظ المشغّل بشاشته المحلية، ويرى المسؤول كل شيء على الـSCADA.

**هل يلزم حاسوب مخصّص للـSCADA؟**
يُنصح بذلك للموثوقية. ننصحك بالعتاد حسب حجم المنشأة.`,
    },
  },
  {
    slug: "retrofit-machine-industrielle",
    date: "2026-10-16",
    pillar: "plc-programming",
    title: {
      fr: "Rétrofit d'une machine industrielle : moderniser sans tout remplacer",
      en: "Industrial machine retrofit: modernise without replacing everything",
      ar: "تحديث آلة صناعية (Rétrofit): العصرنة دون استبدال كل شيء",
    },
    description: {
      fr: "Automate obsolète, variateur introuvable, armoire d'origine ? Le rétrofit modernise la partie commande sans changer la mécanique. MTE, Algérie.",
      en: "Obsolete PLC, no spare drive, original panel? A retrofit modernises the control side without changing the mechanics. MTE, Algeria.",
      ar: "متحكم قديم، مغيّر سرعة غير متوفر، خزانة أصلية؟ التحديث يعصرن جزء التحكّم دون تغيير الميكانيك. MTE، الجزائر.",
    },
    body: {
      fr: `Votre machine fonctionne encore mécaniquement, mais sa partie commande est dépassée : **automate obsolète**, variateur introuvable, armoire d'origine, programme perdu. Le **rétrofit** remplace la partie électrique et électronique en gardant la mécanique — pour une fraction du prix d'une machine neuve.

**La réponse courte :** le rétrofit, c'est **moderniser la partie commande** (automate, IHM, variateurs, armoire, capteurs) d'une machine qui tourne encore, sans toucher au châssis ni, souvent, aux moteurs. Moins cher, plus rapide, et vous repartez avec un **programme sauvegardé**.

## Pourquoi faire un rétrofit

- Les **pièces de rechange sont introuvables** (automate ou variateur obsolète).
- Les **pannes deviennent fréquentes** et l'arrêt coûte cher.
- Il n'y a **plus de documentation ni de programme**.
- Vous avez besoin de **nouvelles fonctions** : vitesse variable, sécurité, comptage, supervision.

## Ce qu'on remplace — et ce qu'on garde

- **On garde** : le châssis, la mécanique et, le plus souvent, les moteurs.
- **On remplace** : l'automate, l'écran IHM, les variateurs, les capteurs, les protections, et l'armoire si nécessaire.

## Les étapes d'un rétrofit

1. **Audit** de la machine et du besoin.
2. **Étude** : choix de l'automate, de l'IHM et des variateurs, schémas, armoire.
3. **Remplacement et câblage** de la partie commande et puissance.
4. **Programmation** (automate + IHM) et reprise du fonctionnement — au besoin, on **réécrit le programme** à partir de la machine (voir [Programme d'automate perdu](/blog/programme-automate-perdu)).
5. **Essais** avec vos opérateurs, mise en service, et **sauvegarde documentée**.

## Combien de temps, quel coût ?

Un rétrofit coûte **bien moins cher qu'une machine neuve**, et une grande partie se prépare à l'atelier pour limiter l'arrêt de production. Le délai dépend de la machine ; on le planifie avec vous.

## Comment MTE peut vous aider

Nous réalisons le **rétrofit complet** : étude électrique, armoire, automate et IHM, variateurs, mise en service — toutes marques, partout en Algérie. [Voir nos services](/#services) ou [essayez nos outils de calcul](/outils).

👉 **Une machine à moderniser ?** Envoyez-nous une photo de l'armoire et le modèle de l'automate sur WhatsApp — nous vous disons ce qui vaut la peine d'être gardé.

## Questions fréquentes

**Peut-on garder les moteurs existants ?**
Souvent oui : s'ils sont en bon état, on les conserve et on ne change que la commande.

**Combien de temps d'arrêt faut-il prévoir ?**
On prépare un maximum hors ligne (armoire, programme) pour réduire l'arrêt au montage et aux essais.

**Faut-il le programme d'origine ?**
Non : si le programme est perdu ou illisible, on le réécrit à partir du fonctionnement de la machine.`,
      en: `Your machine still runs mechanically, but its control side is outdated: an **obsolete PLC**, no spare drive, the original panel, a lost program. A **retrofit** replaces the electrical and electronic side while keeping the mechanics — for a fraction of the price of a new machine.

**The short answer:** a retrofit means **modernising the control side** (PLC, HMI, drives, panel, sensors) of a machine that still works, without touching the frame or, usually, the motors. Cheaper, faster, and you leave with a **saved program**.

## Why do a retrofit

- **Spare parts are unavailable** (obsolete PLC or drive).
- **Breakdowns become frequent** and downtime is expensive.
- There is **no documentation or program** left.
- You need **new functions**: variable speed, safety, counting, supervision.

## What we replace — and what we keep

- **We keep**: the frame, the mechanics and, most often, the motors.
- **We replace**: the PLC, the HMI, the drives, the sensors, the protection devices, and the panel if needed.

## The steps of a retrofit

1. **Audit** of the machine and the need.
2. **Design**: choice of PLC, HMI and drives, diagrams, panel.
3. **Replacement and wiring** of the control and power side.
4. **Programming** (PLC + HMI) and restoring operation — if needed, we **rewrite the program** from the machine (see [Lost PLC program](/en/blog/programme-automate-perdu)).
5. **Testing** with your operators, commissioning, and a **documented backup**.

## How long, how much?

A retrofit costs **much less than a new machine**, and a large part is prepared in the workshop to limit production downtime. The lead time depends on the machine; we plan it with you.

## How MTE can help

We carry out the **full retrofit**: electrical design, panel, PLC and HMI, drives, commissioning — all brands, across Algeria. [See our services](/en/#services) or [try our calculators](/en/outils).

👉 **A machine to modernise?** Send us a photo of the panel and the PLC model on WhatsApp — we'll tell you what's worth keeping.

## Frequently asked questions

**Can the existing motors be kept?**
Often yes: if they're in good condition, we keep them and only change the control side.

**How much downtime should be expected?**
We prepare as much as possible offline (panel, program) to reduce downtime to assembly and testing.

**Is the original program required?**
No: if the program is lost or unreadable, we rewrite it from how the machine works.`,
      ar: `آلتك لا تزال تعمل ميكانيكياً، لكن جزء التحكّم فيها متجاوَز: **متحكم قديم**، مغيّر سرعة غير متوفر، الخزانة الأصلية، برنامج مفقود. يستبدل **التحديث (Rétrofit)** الجزء الكهربائي والإلكتروني مع الاحتفاظ بالميكانيك — بجزء بسيط من ثمن آلة جديدة.

**الجواب المختصر:** التحديث يعني **عصرنة جزء التحكّم** (المتحكم، IHM، مغيّرات السرعة، الخزانة، الحساسات) لآلة لا تزال تعمل، دون المساس بالهيكل، وغالباً دون المحركات. أرخص، وأسرع، وتخرج بـ**برنامج محفوظ**.

## لماذا التحديث

- **قطع الغيار غير متوفرة** (متحكم أو مغيّر سرعة قديم).
- **الأعطال تتكرّر** والتوقّف مكلف.
- **لا توجد وثائق ولا برنامج**.
- تحتاج إلى **وظائف جديدة**: سرعة متغيّرة، أمان، عدّ، إشراف.

## ما الذي نستبدله — وما الذي نحتفظ به

- **نحتفظ بـ**: الهيكل، والميكانيك، وغالباً المحركات.
- **نستبدل**: المتحكم، شاشة IHM، مغيّرات السرعة، الحساسات، وسائل الحماية، والخزانة عند الحاجة.

## خطوات التحديث

1. **معاينة** الآلة والحاجة.
2. **الدراسة**: اختيار المتحكم وIHM ومغيّرات السرعة، المخططات، الخزانة.
3. **الاستبدال والتوصيل** لجزء التحكّم والقدرة.
4. **البرمجة** (المتحكم + IHM) واستعادة العمل — وعند الحاجة **نعيد كتابة البرنامج** انطلاقاً من الآلة (انظر [فقدان برنامج المتحكم](/ar/blog/programme-automate-perdu)).
5. **الاختبارات** مع المشغّلين، التشغيل، و**نسخة احتياطية موثّقة**.

## كم من الوقت، وبأيّ تكلفة؟

يكلّف التحديث **أقل بكثير من آلة جديدة**، ويُحضَّر جزء كبير منه في الورشة لتقليل توقّف الإنتاج. تعتمد المدة على الآلة؛ نبرمجها معك.

## كيف تساعدك MTE

ننجز **التحديث الكامل**: دراسة كهربائية، خزانة، متحكم وIHM، مغيّرات سرعة، تشغيل — جميع الماركات، في كامل الجزائر. [خدماتنا](/ar/#services) أو [جرّب أدوات الحساب](/ar/outils).

👉 **آلة بحاجة للعصرنة؟** أرسل لنا صورة للخزانة وطراز المتحكم عبر واتساب — نخبرك بما يستحقّ الإبقاء عليه.

## أسئلة شائعة

**هل يمكن الاحتفاظ بالمحركات الموجودة؟**
غالباً نعم: إن كانت بحالة جيدة نحتفظ بها ونغيّر جزء التحكّم فقط.

**كم من التوقّف يجب توقّعه؟**
نحضّر أقصى ما يمكن خارج الخط (الخزانة، البرنامج) لتقليص التوقّف إلى التركيب والاختبارات.

**هل يلزم البرنامج الأصلي؟**
لا: إن كان البرنامج مفقوداً أو غير قابل للقراءة نعيد كتابته انطلاقاً من عمل الآلة.`,
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
