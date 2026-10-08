import type { Lang } from "./i18n";

/**
 * Local pages for search engines: one page per service and city ("Programmation automate à
 * Blida") and one page per city ("Automatisme industriel à Blida"). Each page has its own
 * text about the city (zones, travel time, sectors) so it answers a local search, not a copy
 * of the home page. The paths are also listed in api/_local-pages.js for the sitemap.
 */

type L<T = string> = Record<Lang, T>;

export type City = {
  slug: string;
  wilaya: string;
  name: L;
  /** "à Blida", "in Blida", "في البليدة". */
  inCity: L;
  geo: { latitude: number; longitude: number };
  /** Travel from the workshop in Médéa (null: the workshop is here). */
  travel: { km: number; time: L } | null;
  /** Unique paragraph about the city and how MTE works there. */
  intro: L;
  /** Industrial zones and communes where MTE goes. */
  places: L<string[]>;
  sectors: L<string[]>;
};

export const CITIES: City[] = [
  {
    slug: "blida",
    wilaya: "09",
    name: { fr: "Blida", en: "Blida", ar: "البليدة" },
    inCity: { fr: "à Blida", en: "in Blida", ar: "في البليدة" },
    geo: { latitude: 36.47, longitude: 2.8277 },
    travel: { km: 50, time: { fr: "environ 1 h", en: "about 1 hour", ar: "حوالي ساعة" } },
    intro: {
      fr: "La wilaya de Blida concentre une grande partie de l’industrie agroalimentaire, de l’emballage et de la plasturgie de la Mitidja. Depuis notre atelier de Médéa, nous rejoignons Blida en une heure environ par la RN1 et les gorges de la Chiffa : un dépannage peut souvent se faire le jour même, et les équipements à réparer (variateurs, cartes, alimentations) peuvent être déposés ou envoyés à l’atelier.",
      en: "The wilaya of Blida is home to much of the Mitidja’s food, packaging and plastics industry. From our workshop in Médéa we reach Blida in about an hour on the RN1 through the Chiffa gorges: a breakdown can often be fixed the same day, and equipment to repair (drives, boards, power supplies) can be dropped off or sent to the workshop.",
      ar: "تضم ولاية البليدة جزءاً كبيراً من الصناعات الغذائية والتغليف والبلاستيك في سهل المتيجة. من ورشتنا في المدية نصل إلى البليدة في حوالي ساعة عبر الطريق الوطني رقم 1 ومضيق الشفة: غالباً ما يمكن إصلاح العطل في اليوم نفسه، ويمكن إيداع الأجهزة المراد تصليحها (مغيرات السرعة، البطاقات، مزودات الطاقة) أو إرسالها إلى الورشة.",
    },
    places: {
      fr: ["Zone industrielle Ben Boulaïd", "Ouled Yaïch", "Boufarik", "Larbaâ", "Mouzaïa", "Beni Tamou", "Bouinan", "El Affroun"],
      en: ["Ben Boulaïd industrial zone", "Ouled Yaïch", "Boufarik", "Larbaâ", "Mouzaïa", "Beni Tamou", "Bouinan", "El Affroun"],
      ar: ["المنطقة الصناعية بن بولعيد", "أولاد يعيش", "بوفاريك", "الأربعاء", "موزاية", "بني تامو", "بوينان", "العفرون"],
    },
    sectors: {
      fr: ["Agroalimentaire et boissons", "Emballage et cartonnerie", "Plasturgie et injection", "Matériaux de construction"],
      en: ["Food and beverages", "Packaging and cardboard", "Plastics and injection moulding", "Building materials"],
      ar: ["الصناعات الغذائية والمشروبات", "التغليف والكرتون", "البلاستيك والحقن", "مواد البناء"],
    },
  },
  {
    slug: "alger",
    wilaya: "16",
    name: { fr: "Alger", en: "Algiers", ar: "الجزائر العاصمة" },
    inCity: { fr: "à Alger", en: "in Algiers", ar: "في الجزائر العاصمة" },
    geo: { latitude: 36.7538, longitude: 3.0588 },
    travel: { km: 90, time: { fr: "environ 1 h 30", en: "about 1 h 30", ar: "حوالي ساعة ونصف" } },
    intro: {
      fr: "Alger et sa périphérie accueillent les plus grandes zones industrielles du pays, de Rouiba–Réghaïa à Oued Smar et Baba Ali. Nous y intervenons sur site pour la programmation, la mise en service et le dépannage, avec un déplacement planifié depuis Médéa (environ 1 h 30 par Blida) ; pour une machine à l’arrêt, nous organisons le déplacement en priorité.",
      en: "Algiers and its outskirts host the country’s largest industrial zones, from Rouiba–Réghaïa to Oued Smar and Baba Ali. We work on site there for programming, commissioning and troubleshooting, with a trip planned from Médéa (about 1 h 30 via Blida); when a machine is down, the trip is given priority.",
      ar: "تضم الجزائر العاصمة وضواحيها أكبر المناطق الصناعية في البلاد، من الرويبة والرغاية إلى وادي السمار وبابا علي. نتدخل هناك في الموقع للبرمجة والتشغيل وتصليح الأعطال، مع تنقل مبرمج من المدية (حوالي ساعة ونصف عبر البليدة)؛ وإذا كانت الآلة متوقفة نعطي الأولوية للتنقل.",
    },
    places: {
      fr: ["Zone industrielle Rouiba – Réghaïa", "Oued Smar", "Dar El Beïda", "Baba Ali", "Birtouta", "Baraki", "El Harrach", "Les Eucalyptus"],
      en: ["Rouiba – Réghaïa industrial zone", "Oued Smar", "Dar El Beïda", "Baba Ali", "Birtouta", "Baraki", "El Harrach", "Les Eucalyptus"],
      ar: ["المنطقة الصناعية الرويبة – الرغاية", "وادي السمار", "الدار البيضاء", "بابا علي", "بئر توتة", "براقي", "الحراش", "الكاليتوس"],
    },
    sectors: {
      fr: ["Agroalimentaire et embouteillage", "Mécanique et métallurgie", "Plasturgie et emballage", "Industrie pharmaceutique"],
      en: ["Food and bottling", "Mechanical engineering and metalworking", "Plastics and packaging", "Pharmaceutical industry"],
      ar: ["الصناعات الغذائية والتعبئة", "الميكانيك والتعدين", "البلاستيك والتغليف", "الصناعة الصيدلانية"],
    },
  },
  {
    slug: "medea",
    wilaya: "26",
    name: { fr: "Médéa", en: "Médéa", ar: "المدية" },
    inCity: { fr: "à Médéa", en: "in Médéa", ar: "في المدية" },
    geo: { latitude: 36.2675, longitude: 2.7539 },
    travel: null,
    intro: {
      fr: "Notre atelier est à Ain Dhab, Médéa : c’est là que nous réparons variateurs, cartes électroniques et alimentations, et d’où nous partons pour les interventions sur site. Dans la wilaya de Médéa, nous intervenons rapidement, souvent dans la journée, et vous pouvez déposer vos équipements directement à l’atelier.",
      en: "Our workshop is in Ain Dhab, Médéa: this is where we repair drives, electronic boards and power supplies, and where our on-site trips start. In the wilaya of Médéa we come quickly, often the same day, and you can bring your equipment straight to the workshop.",
      ar: "ورشتنا في عين الذهب بالمدية: هناك نصلح مغيرات السرعة والبطاقات الإلكترونية ومزودات الطاقة، ومنها ننطلق للتدخلات في الموقع. في ولاية المدية نتدخل بسرعة، غالباً في اليوم نفسه، ويمكنكم إحضار أجهزتكم مباشرة إلى الورشة.",
    },
    places: {
      fr: ["Médéa", "Ain Dhab", "Berrouaghia", "Ksar El Boukhari", "Tablat", "Beni Slimane", "Ouzera", "Draa Esmar"],
      en: ["Médéa", "Ain Dhab", "Berrouaghia", "Ksar El Boukhari", "Tablat", "Beni Slimane", "Ouzera", "Draa Esmar"],
      ar: ["المدية", "عين الذهب", "البرواقية", "قصر البخاري", "تابلاط", "بني سليمان", "وزرة", "ذراع السمار"],
    },
    sectors: {
      fr: ["Agroalimentaire et minoterie", "Matériaux de construction", "Pompage et irrigation", "Ateliers et PME industrielles"],
      en: ["Food and flour milling", "Building materials", "Pumping and irrigation", "Workshops and industrial SMEs"],
      ar: ["الصناعات الغذائية والمطاحن", "مواد البناء", "الضخ والسقي", "الورشات والمؤسسات الصناعية الصغيرة"],
    },
  },
];

export type LocalService = {
  /** Slug of the service card (src/services.ts): image and admin texts. */
  key: string;
  /** URL part: "programmation-automate" → /programmation-automate-blida. */
  slug: string;
  /** The words people search for. */
  keyword: L;
  /** The work as a phrase inside a sentence: "un dépannage d’armoire électrique". */
  job: L;
  /** Title of the page (city added after). */
  titleTail: L;
  /** Meta description; {in} is replaced by "à Blida"… */
  description: L;
  bullets: L<string[]>;
  /** One question specific to the service, for the page FAQ. */
  faq: L<{ q: string; a: string }>;
};

export const LOCAL_SERVICES: LocalService[] = [
  {
    key: "plc-programming",
    job: { fr: "la programmation d’un automate", en: "PLC programming", ar: "برمجة المتحكم" },
    slug: "programmation-automate",
    keyword: { fr: "Programmation automate", en: "PLC programming", ar: "برمجة المتحكمات المنطقية PLC" },
    titleTail: { fr: "PLC et IHM", en: "PLC and HMI", ar: "وشاشات HMI" },
    description: {
      fr: "Automaticien {in} : programmation et modification d’automates (Siemens, Schneider, Omron, Fatek), écrans IHM, récupération de programmes, migration. Devis gratuit.",
      en: "Automation engineer {in}: PLC programming and changes (Siemens, Schneider, Omron, Fatek), HMI screens, program recovery, migration. Free quote.",
      ar: "مهندس أتمتة {in}: برمجة وتعديل المتحكمات (Siemens وSchneider وOmron وFatek)، شاشات HMI، استرجاع البرامج والترحيل. عرض سعر مجاني.",
    },
    bullets: {
      fr: [
        "Création et modification de programmes : Siemens S7 / TIA Portal, Schneider Modicon, Omron, Fatek, Delta, Xinje",
        "Programmation d’écrans IHM et de supervision",
        "Sauvegarde et récupération de programmes, réécriture d’un programme perdu",
        "Migration d’automates obsolètes (S7-300 vers S7-1200 / S7-1500)",
        "Réseaux industriels Profinet et Modbus, pilotage de variateurs",
        "Mise en service sur site avec vos opérateurs",
      ],
      en: [
        "Writing and changing programs: Siemens S7 / TIA Portal, Schneider Modicon, Omron, Fatek, Delta, Xinje",
        "HMI and supervision screens",
        "Program backup and recovery, rewriting a lost program",
        "Migration of obsolete PLCs (S7-300 to S7-1200 / S7-1500)",
        "Profinet and Modbus networks, drive control",
        "On-site commissioning with your operators",
      ],
      ar: [
        "كتابة وتعديل البرامج: Siemens S7 / TIA Portal وSchneider Modicon وOmron وFatek وDelta وXinje",
        "برمجة شاشات HMI والإشراف",
        "حفظ واسترجاع البرامج، وإعادة كتابة برنامج مفقود",
        "ترحيل المتحكمات القديمة (من S7-300 إلى S7-1200 / S7-1500)",
        "الشبكات الصناعية Profinet وModbus والتحكم في مغيرات السرعة",
        "التشغيل في الموقع مع المشغلين",
      ],
    },
    faq: {
      fr: { q: "Quelles marques d’automates programmez-vous ?", a: "Siemens (S7-200, S7-300, S7-1200, S7-1500, LOGO!), Schneider (Modicon, Zelio), Omron, Fatek, Delta, Xinje et Mitsubishi, avec leurs écrans IHM. Nous reprenons aussi un programme existant pour le modifier ou le documenter." },
      en: { q: "Which PLC brands do you program?", a: "Siemens (S7-200, S7-300, S7-1200, S7-1500, LOGO!), Schneider (Modicon, Zelio), Omron, Fatek, Delta, Xinje and Mitsubishi, with their HMI screens. We also take over an existing program to change or document it." },
      ar: { q: "ما هي ماركات المتحكمات التي تبرمجونها؟", a: "Siemens (S7-200 وS7-300 وS7-1200 وS7-1500 وLOGO!) وSchneider (Modicon وZelio) وOmron وFatek وDelta وXinje وMitsubishi مع شاشات HMI الخاصة بها. ونستلم أيضاً برنامجاً موجوداً لتعديله أو توثيقه." },
    },
  },
  {
    key: "control-panel-diagnostics",
    job: { fr: "un dépannage d’armoire électrique", en: "a control panel repair", ar: "تصليح خزانة التحكم" },
    slug: "depannage-armoire-electrique",
    keyword: { fr: "Dépannage armoire électrique", en: "Control panel troubleshooting", ar: "تصليح أعطال خزائن التحكم" },
    titleTail: { fr: "machines à l’arrêt", en: "machines down", ar: "الآلات المتوقفة" },
    description: {
      fr: "Dépannage d’armoires de commande {in} : machine à l’arrêt, défaut intermittent, automate, capteurs, relais. Intervention sur site et remise en production. Devis gratuit.",
      en: "Control panel troubleshooting {in}: machine down, intermittent fault, PLC, sensors, relays. On-site service and back to production. Free quote.",
      ar: "تصليح أعطال خزائن التحكم {in}: آلة متوقفة، عطل متقطع، المتحكم، الحساسات، المرحلات. تدخل في الموقع وإعادة الإنتاج. عرض سعر مجاني.",
    },
    bullets: {
      fr: [
        "Recherche méthodique de la panne : automate, entrées / sorties, capteurs, relais, alimentations",
        "Défauts intermittents : surveillance de la machine en production",
        "Câblage et modification de circuits, ajout de départs moteur",
        "Remplacement de composants (contacteurs, disjoncteurs, relais thermiques)",
        "Remise en état et contrôle par caméra thermique",
        "Mise en conformité des sécurités et de l’arrêt d’urgence",
      ],
      en: [
        "Methodical fault finding: PLC, inputs / outputs, sensors, relays, power supplies",
        "Intermittent faults: watching the machine in production",
        "Wiring and circuit changes, new motor feeders",
        "Replacing components (contactors, breakers, thermal relays)",
        "Overhaul and thermal camera inspection",
        "Safety circuits and emergency stop brought up to standard",
      ],
      ar: [
        "بحث منهجي عن العطل: المتحكم، المداخل والمخارج، الحساسات، المرحلات، مزودات الطاقة",
        "الأعطال المتقطعة: مراقبة الآلة أثناء الإنتاج",
        "تمديد وتعديل الدارات وإضافة مخارج المحركات",
        "استبدال المكونات (الملامسات، القواطع، المرحلات الحرارية)",
        "إعادة التأهيل والفحص بالكاميرا الحرارية",
        "مطابقة دارات الأمان والتوقف الطارئ",
      ],
    },
    faq: {
      fr: { q: "Ma machine est à l’arrêt : que faire ?", a: "Appelez ou écrivez sur WhatsApp en décrivant le défaut (message de l’écran, voyant, photo de l’armoire). Nous vous disons tout de suite ce qu’il faut vérifier, et si une intervention sur site est nécessaire, nous la planifions en priorité." },
      en: { q: "My machine is down: what should I do?", a: "Call or send a WhatsApp message describing the fault (screen message, warning lamp, photo of the panel). We tell you straight away what to check, and if an on-site visit is needed, it is planned with priority." },
      ar: { q: "آلتي متوقفة: ماذا أفعل؟", a: "اتصلوا أو اكتبوا على واتساب مع وصف العطل (رسالة الشاشة، المؤشر الضوئي، صورة الخزانة). نقول لكم فوراً ما يجب فحصه، وإذا كان التدخل في الموقع ضرورياً نبرمجه بالأولوية." },
    },
  },
  {
    key: "electrical-study",
    job: { fr: "une étude électrique", en: "an electrical design", ar: "الدراسة الكهربائية" },
    slug: "etude-electrique",
    keyword: { fr: "Étude électrique", en: "Electrical design", ar: "الدراسات الكهربائية" },
    titleTail: { fr: "schémas et armoires", en: "diagrams and panels", ar: "المخططات والخزائن" },
    description: {
      fr: "Bureau d’études électriques {in} : schémas, bilan de puissance, calcul des câbles et protections, conception d’armoires de commande, rétrofit. Devis gratuit.",
      en: "Electrical design {in}: wiring diagrams, power balance, cable and protection sizing, control panel design, retrofit. Free quote.",
      ar: "دراسات كهربائية {in}: المخططات، حصيلة القدرة، حساب الكوابل والحمايات، تصميم خزائن التحكم، تحديث المنشآت. عرض سعر مجاني.",
    },
    bullets: {
      fr: [
        "Schémas électriques de puissance et de commande",
        "Bilan de puissance et choix du transformateur ou de l’abonnement",
        "Note de calcul des câbles, des chutes de tension et des protections",
        "Conception d’armoires de commande : schémas, implantation, nomenclature",
        "Rétrofit d’installations existantes et mise en conformité",
        "Dossier technique de fin de travaux",
      ],
      en: [
        "Power and control wiring diagrams",
        "Power balance and choice of transformer or supply contract",
        "Cable, voltage drop and protection calculations",
        "Control panel design: diagrams, layout, bill of materials",
        "Retrofit of existing installations and compliance",
        "As-built technical file",
      ],
      ar: [
        "المخططات الكهربائية للقدرة والتحكم",
        "حصيلة القدرة واختيار المحول أو الاشتراك",
        "مذكرة حساب الكوابل وهبوط الجهد والحمايات",
        "تصميم خزائن التحكم: المخططات، التوزيع، قائمة المعدات",
        "تحديث المنشآت القائمة ومطابقتها",
        "الملف التقني لنهاية الأشغال",
      ],
    },
    faq: {
      fr: { q: "Que comprend une étude électrique ?", a: "Selon le projet : relevé de l’existant, bilan de puissance, schémas, calcul des câbles et des protections, plan d’armoire et liste du matériel. Tout est remis au format numérique, prêt pour la réalisation et pour vos dossiers." },
      en: { q: "What does an electrical design include?", a: "Depending on the project: survey of the existing installation, power balance, diagrams, cable and protection sizing, panel layout and bill of materials. Everything is delivered in digital form, ready for construction and for your records." },
      ar: { q: "ماذا تشمل الدراسة الكهربائية؟", a: "حسب المشروع: معاينة المنشأة، حصيلة القدرة، المخططات، حساب الكوابل والحمايات، مخطط الخزانة وقائمة المعدات. يُسلَّم كل شيء بصيغة رقمية جاهزة للإنجاز وللأرشيف." },
    },
  },
  {
    key: "drives-repair",
    job: { fr: "la réparation d’un variateur", en: "a drive repair", ar: "تصليح مغير السرعة" },
    slug: "reparation-variateur",
    keyword: { fr: "Réparation variateur de vitesse", en: "Variable speed drive repair", ar: "تصليح مغيرات السرعة" },
    titleTail: { fr: "0,37 à 500 kW", en: "0.37 to 500 kW", ar: "من 0,37 إلى 500 كيلوواط" },
    description: {
      fr: "Réparation de variateurs de vitesse {in} : ABB, Schneider Altivar, Siemens, Danfoss, LS, INVT, de 0,37 à 500 kW. Diagnostic, essai en charge, paramétrage. Devis gratuit.",
      en: "Variable speed drive repair {in}: ABB, Schneider Altivar, Siemens, Danfoss, LS, INVT, from 0.37 to 500 kW. Diagnosis, load test, set-up. Free quote.",
      ar: "تصليح مغيرات السرعة {in}: ABB وSchneider Altivar وSiemens وDanfoss وLS وINVT من 0,37 إلى 500 كيلوواط. تشخيص، اختبار تحت الحمل، ضبط. عرض سعر مجاني.",
    },
    bullets: {
      fr: [
        "Diagnostic en atelier ou sur site, devis avant réparation",
        "Réparation de 0,37 kW à plus de 500 kW : modules IGBT, condensateurs, cartes de commande",
        "Toutes marques : ABB, Schneider Altivar, Siemens Sinamics, Danfoss, LS, INVT, Delta",
        "Essai en charge sur banc avant restitution",
        "Paramétrage, mise en service et remplacement de variateurs",
        "Démarreurs progressifs et variateurs à courant continu",
      ],
      en: [
        "Diagnosis in the workshop or on site, quote before repair",
        "Repairs from 0.37 kW to over 500 kW: IGBT modules, capacitors, control boards",
        "All brands: ABB, Schneider Altivar, Siemens Sinamics, Danfoss, LS, INVT, Delta",
        "Load test on the bench before return",
        "Set-up, commissioning and drive replacement",
        "Soft starters and DC drives",
      ],
      ar: [
        "التشخيص في الورشة أو في الموقع، وعرض سعر قبل التصليح",
        "التصليح من 0,37 إلى أكثر من 500 كيلوواط: وحدات IGBT، المكثفات، بطاقات التحكم",
        "كل الماركات: ABB وSchneider Altivar وSiemens Sinamics وDanfoss وLS وINVT وDelta",
        "اختبار تحت الحمل على المنصة قبل التسليم",
        "الضبط والتشغيل واستبدال مغيرات السرعة",
        "المشغلات التدريجية ومغيرات سرعة التيار المستمر",
      ],
    },
    faq: {
      fr: { q: "Vaut-il mieux réparer ou remplacer un variateur ?", a: "Dans la plupart des cas la réparation coûte bien moins cher qu’un variateur neuf, surtout au-delà de quelques kilowatts. Après le diagnostic, nous vous donnons le prix de la réparation et, si c’est plus logique, celui d’un remplacement." },
      en: { q: "Is it better to repair or replace a drive?", a: "In most cases a repair costs much less than a new drive, especially above a few kilowatts. After the diagnosis we give you the repair price and, when it makes more sense, the price of a replacement." },
      ar: { q: "هل الأفضل تصليح مغير السرعة أم استبداله؟", a: "في أغلب الحالات يكلف التصليح أقل بكثير من مغير جديد، خاصة فوق بضعة كيلوواط. بعد التشخيص نعطيكم سعر التصليح، وسعر الاستبدال إذا كان أكثر منطقية." },
    },
  },
  {
    key: "electronic-repair",
    job: { fr: "la réparation d’une carte électronique", en: "a board repair", ar: "تصليح البطاقة الإلكترونية" },
    slug: "reparation-carte-electronique",
    keyword: { fr: "Réparation carte électronique", en: "Electronic board repair", ar: "تصليح البطاقات الإلكترونية" },
    titleTail: { fr: "commande et puissance", en: "control and power", ar: "التحكم والقدرة" },
    description: {
      fr: "Réparation de cartes électroniques industrielles {in} : cartes de commande et de puissance, écrans IHM, machines CNC, groupes électrogènes. Rétro-ingénierie. Devis gratuit.",
      en: "Industrial electronic board repair {in}: control and power boards, HMI screens, CNC machines, generators. Reverse engineering. Free quote.",
      ar: "تصليح البطاقات الإلكترونية الصناعية {in}: بطاقات التحكم والقدرة، شاشات HMI، آلات CNC، المولدات. الهندسة العكسية. عرض سعر مجاني.",
    },
    bullets: {
      fr: [
        "Réparation au niveau composant des cartes de commande et de puissance",
        "Écrans IHM : dalle tactile, rétroéclairage, alimentation",
        "Cartes de machines CNC, de groupes électrogènes et de postes de soudure",
        "Rétro-ingénierie quand le schéma n’existe pas",
        "Reprogrammation de mémoires EEPROM",
        "Vernis de protection contre l’humidité et la poussière",
      ],
      en: [
        "Component-level repair of control and power boards",
        "HMI screens: touch panel, backlight, power supply",
        "Boards of CNC machines, generators and welding sets",
        "Reverse engineering when no schematic exists",
        "EEPROM reprogramming",
        "Conformal coating against humidity and dust",
      ],
      ar: [
        "تصليح بطاقات التحكم والقدرة على مستوى المكونات",
        "شاشات HMI: لوح اللمس، الإضاءة الخلفية، التغذية",
        "بطاقات آلات CNC والمولدات وأجهزة التلحيم",
        "الهندسة العكسية عند غياب المخطط",
        "إعادة برمجة ذاكرات EEPROM",
        "طلاء الحماية من الرطوبة والغبار",
      ],
    },
    faq: {
      fr: { q: "Réparez-vous une carte sans schéma ?", a: "Oui. La plupart des cartes industrielles arrivent sans documentation : nous suivons les circuits, testons les composants et, si besoin, relevons le schéma complet de la carte (rétro-ingénierie)." },
      en: { q: "Do you repair a board without a schematic?", a: "Yes. Most industrial boards come without documentation: we trace the circuits, test the components and, when needed, draw the full schematic of the board (reverse engineering)." },
      ar: { q: "هل تصلحون بطاقة بدون مخطط؟", a: "نعم. أغلب البطاقات الصناعية تصلنا دون وثائق: نتتبع الدارات ونختبر المكونات، وعند الحاجة نرسم المخطط الكامل للبطاقة (الهندسة العكسية)." },
    },
  },
  {
    key: "power-sensors",
    job: { fr: "la réparation d’une alimentation ou d’un capteur", en: "a power supply or sensor repair", ar: "تصليح مزود الطاقة أو الحساس" },
    slug: "reparation-alimentation-capteurs",
    keyword: { fr: "Réparation alimentations et capteurs", en: "Power supplies and sensors", ar: "تصليح مزودات الطاقة والحساسات" },
    titleTail: { fr: "onduleurs, stabilisateurs", en: "UPS, stabilisers", ar: "UPS ومنظمات الجهد" },
    description: {
      fr: "Réparation d’alimentations à découpage, onduleurs (UPS), stabilisateurs et chargeurs {in} ; diagnostic et remplacement de capteurs et transmetteurs 4–20 mA. Devis gratuit.",
      en: "Repair of switching power supplies, UPS units, stabilisers and chargers {in}; diagnosis and replacement of sensors and 4–20 mA transmitters. Free quote.",
      ar: "تصليح مزودات الطاقة التبديلية وأجهزة UPS ومنظمات الجهد والشواحن {in}؛ تشخيص واستبدال الحساسات والمرسلات 4–20 ملي أمبير. عرض سعر مجاني.",
    },
    bullets: {
      fr: [
        "Alimentations à découpage 24 V et 12 V",
        "Onduleurs (UPS), stabilisateurs de tension et chargeurs de batteries",
        "Onduleurs solaires et hybrides",
        "Diagnostic et remplacement de capteurs : inductifs, photoélectriques, fins de course",
        "Transmetteurs de pression et de température 4–20 mA, sondes PT100",
        "Régulateurs de température et codeurs",
      ],
      en: [
        "24 V and 12 V switching power supplies",
        "UPS units, voltage stabilisers and battery chargers",
        "Solar and hybrid inverters",
        "Sensor diagnosis and replacement: inductive, photoelectric, limit switches",
        "4–20 mA pressure and temperature transmitters, PT100 probes",
        "Temperature controllers and encoders",
      ],
      ar: [
        "مزودات الطاقة التبديلية 24 فولط و12 فولط",
        "أجهزة UPS ومنظمات الجهد وشواحن البطاريات",
        "العاكسات الشمسية والهجينة",
        "تشخيص واستبدال الحساسات: الحثية، الكهروضوئية، مفاتيح نهاية الشوط",
        "مرسلات الضغط والحرارة 4–20 ملي أمبير ومسابير PT100",
        "منظمات الحرارة والمشفرات",
      ],
    },
    faq: {
      fr: { q: "Réparez-vous les onduleurs et les stabilisateurs ?", a: "Oui, en atelier : diagnostic, remplacement des composants défectueux et des batteries si besoin, puis essai avant restitution. Pour un onduleur solaire ou hybride, nous vérifions aussi la partie charge." },
      en: { q: "Do you repair UPS units and stabilisers?", a: "Yes, in the workshop: diagnosis, replacement of faulty components and of the batteries when needed, then a test before return. For a solar or hybrid inverter we also check the charging stage." },
      ar: { q: "هل تصلحون أجهزة UPS ومنظمات الجهد؟", a: "نعم، في الورشة: تشخيص، استبدال المكونات المعطلة والبطاريات عند الحاجة، ثم اختبار قبل التسليم. وبالنسبة للعاكس الشمسي أو الهجين نفحص أيضاً جزء الشحن." },
    },
  },
];

// ---------------------------------------------------------------------------
// Paths and texts built from the data
// ---------------------------------------------------------------------------

export const cityPath = (city: City) => `/automatisme-${city.slug}`;
export const servicePath = (service: LocalService, city: City) => `/${service.slug}-${city.slug}`;

export type LocalPageRef = { path: string; city: City; service: LocalService | null };

/** Every local page (without the language prefix). */
export function localPages(): LocalPageRef[] {
  return CITIES.flatMap((city) => [
    { path: cityPath(city), city, service: null },
    ...LOCAL_SERVICES.map((service) => ({ path: servicePath(service, city), city, service })),
  ]);
}

export function findLocalPage(path: string): LocalPageRef | null {
  return localPages().find((p) => p.path === path) ?? null;
}

const HUB_TITLE: L = {
  fr: "Automatisme industriel {in} – PLC, variateurs, armoires",
  en: "Industrial automation {in} – PLC, drives, panels",
  ar: "الأتمتة الصناعية {in} – PLC، مغيرات السرعة، الخزائن",
};
const HUB_DESCRIPTION: L = {
  fr: "Automaticien et électronicien industriel {in} : programmation d’automates, dépannage d’armoires, études électriques, réparation de variateurs et de cartes. Intervention sur site, devis gratuit.",
  en: "Industrial automation and electronics engineer {in}: PLC programming, control panel troubleshooting, electrical design, drive and board repair. On-site service, free quote.",
  ar: "مهندس أتمتة وإلكترونيات صناعية {in}: برمجة المتحكمات، تصليح خزائن التحكم، الدراسات الكهربائية، تصليح مغيرات السرعة والبطاقات. تدخل في الموقع وعرض سعر مجاني.",
};

const fill = (text: string, city: City, lang: Lang) => text.replace("{in}", city.inCity[lang]);

export function localTitle(p: LocalPageRef, lang: Lang): string {
  if (!p.service) return `${fill(HUB_TITLE[lang], p.city, lang)} | MTE`;
  return `${p.service.keyword[lang]} ${p.city.inCity[lang]} – ${p.service.titleTail[lang]} | MTE`;
}

export function localDescription(p: LocalPageRef, lang: Lang): string {
  return fill(p.service ? p.service.description[lang] : HUB_DESCRIPTION[lang], p.city, lang);
}

export function localHeading(p: LocalPageRef, lang: Lang): string {
  if (!p.service) return fill(HUB_TITLE[lang].split(" – ")[0], p.city, lang);
  return `${p.service.keyword[lang]} ${p.city.inCity[lang]}`;
}

/** Questions of the page: on site, price, delay, and one about the service. */
export function localFaq(p: LocalPageRef, lang: Lang): { q: string; a: string }[] {
  const c = p.city;
  const what = p.service ? p.service.job[lang] : { fr: "une intervention", en: "a job", ar: "التدخل" }[lang];
  const trip = c.travel
    ? {
        fr: `Oui. Nous partons de notre atelier de Médéa et rejoignons ${c.name.fr} en ${c.travel.time.fr} (environ ${c.travel.km} km). Les communes et zones industrielles de la wilaya sont couvertes, notamment ${c.places.fr.slice(0, 3).join(", ")}.`,
        en: `Yes. We leave from our workshop in Médéa and reach ${c.name.en} in ${c.travel.time.en} (about ${c.travel.km} km). The towns and industrial zones of the wilaya are covered, including ${c.places.en.slice(0, 3).join(", ")}.`,
        ar: `نعم. ننطلق من ورشتنا في المدية ونصل إلى ${c.name.ar} في ${c.travel.time.ar} (حوالي ${c.travel.km} كلم). نغطي بلديات الولاية ومناطقها الصناعية، منها ${c.places.ar.slice(0, 3).join("، ")}.`,
      }
    : {
        fr: `Oui, notre atelier est à Ain Dhab, Médéa. Nous intervenons dans toute la wilaya, notamment à ${c.places.fr.slice(2, 5).join(", ")}, souvent dans la journée.`,
        en: `Yes, our workshop is in Ain Dhab, Médéa. We work across the wilaya, including ${c.places.en.slice(2, 5).join(", ")}, often the same day.`,
        ar: `نعم، ورشتنا في عين الذهب بالمدية. نتدخل في كامل الولاية، منها ${c.places.ar.slice(2, 5).join("، ")}، وغالباً في اليوم نفسه.`,
      };
  const questions: L<{ q: string; a: string }[]> = {
    fr: [
      { q: `Intervenez-vous sur site ${c.inCity.fr} ?`, a: trip.fr },
      {
        q: `Combien coûte ${what} ${c.inCity.fr} ?`,
        a: `Le prix dépend du travail à faire : nous établissons un devis gratuit avant toute intervention, après un échange par téléphone ou WhatsApp et, si besoin, un diagnostic. ${c.travel ? `Le déplacement ${c.inCity.fr} est compté selon la distance depuis Médéa.` : "À Médéa, le déplacement reste réduit."}`,
      },
      { q: "Sous quel délai pouvez-vous intervenir ?", a: "Le diagnostic est fait sous 24 à 48 h. Pour une machine à l’arrêt, nous donnons la priorité au déplacement ; les réparations en atelier prennent en général quelques jours selon les pièces." },
    ],
    en: [
      { q: `Do you work on site ${c.inCity.en}?`, a: trip.en },
      {
        q: `How much does ${what} cost ${c.inCity.en}?`,
        a: `The price depends on the work: we give a free quote before any job, after a call or WhatsApp exchange and, when needed, a diagnosis. ${c.travel ? `Travel ${c.inCity.en} is charged according to the distance from Médéa.` : "In Médéa, travel costs stay low."}`,
      },
      { q: "How soon can you come?", a: "Diagnosis within 24 to 48 hours. When a machine is down, the trip gets priority; workshop repairs usually take a few days depending on the parts." },
    ],
    ar: [
      { q: `هل تتدخلون في الموقع ${c.inCity.ar}؟`, a: trip.ar },
      {
        q: `كم تكلفة ${what} ${c.inCity.ar}؟`,
        a: `يتوقف السعر على العمل المطلوب: نقدم عرض سعر مجاني قبل أي تدخل، بعد اتصال هاتفي أو عبر واتساب، وعند الحاجة بعد التشخيص. ${c.travel ? `يُحسب التنقل ${c.inCity.ar} حسب المسافة من المدية.` : "في المدية تبقى تكاليف التنقل منخفضة."}`,
      },
      { q: "ما هو أجل التدخل؟", a: "يتم التشخيص خلال 24 إلى 48 ساعة. إذا كانت الآلة متوقفة نعطي الأولوية للتنقل؛ أما التصليح في الورشة فيستغرق عادة بضعة أيام حسب القطع." },
    ],
  };
  return p.service ? [...questions[lang], p.service.faq[lang]] : questions[lang];
}

/** Lower case without accents: to find the projects that mention the city. */
const plain = (s: string) => s.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();

export function mentionsCity(text: string, city: City): boolean {
  const t = plain(text);
  return [city.name.fr, city.name.ar, ...city.places.fr.slice(1)].some((n) => t.includes(plain(n)));
}
