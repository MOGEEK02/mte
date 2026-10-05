// English dictionary — must mirror the shape of fr.ts (same keys, array lengths & slugs).
import type { Dictionary } from "./fr";

const en: Dictionary = {
  /* ───────────── SEO / <head> ───────────── */
  meta: {
    title:
      "Industrial Repair & Automation in Algeria | VFD, PLC, Generators – MTE",
    description:
      "MTE – Repair and programming of industrial equipment in Algeria: variable frequency drives (VFD), PLCs, electronic boards, control panels, generator sets and machines. On-site and workshop service across Algeria.",
    keywords:
      "VFD repair Algeria, variable frequency drive repair, PLC programming Algeria, Siemens TIA Portal programming, industrial PCB repair, control panel repair, generator set installation Algeria, generator repair, industrial machine repair, industrial automation Algeria, Medea",
    ogTitle:
      "MTE – Industrial Repair & Automation in Algeria (VFD, PLC, Generators)",
    ogDescription:
      "Repair, programming and installation of industrial equipment across Algeria. Drives, PLCs, electronic boards, control panels, generators and machines.",
  },

  /* ───────────── Navigation ───────────── */
  nav: {
    home: "Home",
    services: "Services",
    portfolio: "Portfolio",
    process: "Process",
    faq: "FAQ",
    contact: "Contact",
    quote: "Get a quote",
  },

  /* ───────────── Hero ───────────── */
  hero: {
    badge: "Electronics · Automation · Power — Algeria",
    title: "Equipment down?",
    titleAccent: "I get it running again.",
    subtitle:
      "Repair and programming of industrial equipment in Algeria: variable frequency drives (VFD), PLCs, electronic boards, control panels, generator sets and machines. On site and in the workshop.",
    ctaPrimary: "Chat on WhatsApp",
    ctaQuote: "Request a quote",
    chips: [
      "On site — all of Algeria",
      "Equipped workshop",
      "Diagnosis in 24–48h",
      "Fast, free quote",
    ],
  },

  /* ───────────── Services ───────────── */
  services: {
    eyebrow: "Services",
    title: "What I handle",
    intro:
      "From PLC programming to generator installation and component-level repair — a single point of contact to get your production running again.",
    learnMore: "Learn more",
    allServices: "All services",
    coversTitle: "What I handle",
    relatedTitle: "Other services",
    ctaTitle: "Equipment to repair or program?",
    ctaSubtitle:
      "Send me a description or a photo on WhatsApp — I'll get back to you quickly with a diagnosis and a quote.",
    indexTitle: "Services — Industrial Repair & Automation",
    indexIntro:
      "Repair, programming and installation of industrial equipment across Algeria.",
    indexMetaTitle: "Services | Industrial Repair & Automation – MTE Algeria",
    indexMetaDescription:
      "All MTE services: VFD repair, PLC programming, electronic boards, control panels, generator sets and industrial machine repair in Algeria.",
    groups: {
      automation: "Automation & Programming",
      repair: "Industrial repair",
      power: "Generator sets",
    },
    items: [
      {
        slug: "programmation-plc",
        group: "automation",
        title: "PLCs — programming & repair",
        tagline: "Development, modification and troubleshooting of your PLCs.",
        intro:
          "Programming and repair of industrial programmable logic controllers for reliable, high-performing machines.",
        overview:
          "I develop, modify and repair PLC programs for all major brands. Whether it's a new machine, a modernization or an urgent breakdown, I fix the fault at its source to get your process running again.",
        covers: [
          "Siemens S7-1200 / S7-1500 (TIA Portal), S7-300/400, LOGO!",
          "Schneider Modicon / EcoStruxure, Omron, Fatek, Delta",
          "New program development",
          "Modification & migration of existing installations",
          "Industrial networking and communication",
          "Backup and documentation of your programs",
        ],
      },
      {
        slug: "variateurs-vfd",
        group: "automation",
        title: "Variable frequency drives (VFD)",
        tagline: "Repair, parameterization and commissioning.",
        intro:
          "Repair and commissioning of variable frequency drives (VFD), all brands and all power ratings.",
        overview:
          "I repair at component level and commission variable speed drives: power stages, control boards, motor parameterization and optimization. From 0.37 kW to several hundred kW.",
        covers: [
          "ABB, Schneider Altivar, Siemens SINAMICS, Danfoss, Delta, INVT",
          "Power stage (IGBT) and control board repair",
          "On-site parameterization and commissioning",
          "Fault diagnosis and motor optimization",
          "Replacement and sizing advice",
        ],
      },
      {
        slug: "servo-variateurs",
        group: "automation",
        title: "Servo drives & motion control",
        tagline: "Programming, tuning and synchronization.",
        intro:
          "Configuration and tuning of servo drives for precise positioning and reliable motion control.",
        overview:
          "I configure, tune and troubleshoot servo systems: loop tuning, positioning, axis synchronization and electronic cam for your precision machines.",
        covers: [
          "Commissioning of servo drives, all brands",
          "Loop tuning and performance optimization",
          "Positioning and motion control",
          "Axis synchronization & electronic cam",
          "Diagnosis and troubleshooting",
        ],
      },
      {
        slug: "ihm-scada",
        group: "automation",
        title: "HMI / SCADA",
        tagline: "Development and repair of operator interfaces.",
        intro:
          "Design of human-machine interfaces (HMI) and SCADA supervision that are clear and effective.",
        overview:
          "I develop and repair your HMI touch screens and supervision systems: control pages, alarms, recipes and production monitoring, so you can run your machines simply.",
        covers: [
          "HMI touch-screen development",
          "SCADA supervision & production monitoring",
          "Alarm and recipe management",
          "Repair and replacement of HMI panels",
          "Communication with PLCs and drives",
        ],
      },
      {
        slug: "reparation-carte-electronique",
        group: "repair",
        title: "Electronic board (PCB) repair",
        tagline: "Component-level repair of all industrial boards.",
        intro:
          "Component-level repair of industrial electronic boards, with reverse engineering when needed.",
        overview:
          "I repair your industrial electronic boards: power boards, control boards, power supplies and modules. Diagnosis, SMD component replacement and load testing.",
        covers: [
          "Component-level diagnosis",
          "SMD / through-hole component replacement",
          "Reverse engineering of boards without schematics",
          "Power, control and power-supply boards",
          "Load testing and validation",
        ],
      },
      {
        slug: "armoires-de-commande",
        group: "repair",
        title: "Control panels & cabinets",
        tagline: "Design, build and repair.",
        intro:
          "Design, build and repair of bespoke control cabinets and panels.",
        overview:
          "I design, wire and repair your electrical cabinets and control panels, to your specification and to the highest standards, for a safe and durable installation.",
        covers: [
          "Design and wiring of bespoke cabinets",
          "Repair and upgrade of existing panels",
          "Integration of PLCs, drives and protections",
          "Electrical schematics and documentation",
          "Compliance and safety",
        ],
      },
      {
        slug: "reparation-machine-industrielle",
        group: "repair",
        title: "Industrial machine repair",
        tagline: "Electrical & electronic breakdown service, all brands.",
        intro:
          "Breakdown service for industrial machines — electrical, electronic and automation, all brands.",
        overview:
          "When a machine stops, I step in to find and fix the fault: control section, power, sensors and actuators. The goal: get your production running again as fast as possible.",
        covers: [
          "Electrical and electronic fault diagnosis",
          "Control and power section troubleshooting",
          "Sensors, actuators and safety devices",
          "Recommissioning and testing",
          "Advice to make the machine more reliable",
        ],
      },
      {
        slug: "groupe-electrogene",
        group: "power",
        title: "Generator sets",
        tagline: "Installation, repair & maintenance.",
        intro:
          "Installation, repair and maintenance of generator sets, with automatic transfer switch (ATS).",
        overview:
          "I install, repair and maintain your generator sets: connection, automatic transfer switch (ATS / mains-standby), start-up automation and maintenance for reliable backup power.",
        covers: [
          "Installation and connection of generator sets",
          "Automatic transfer switch (ATS) mains/standby",
          "Start-up and transfer automation",
          "Repair and preventive maintenance",
          "Fault diagnosis and breakdown service",
        ],
      },
    ],
  },

  /* ───────────── Recent projects ───────────── */
  projects: {
    eyebrow: "Our work",
    title: "Real interventions",
    intro: "A look at my latest work in the field, across Algeria.",
    viewAll: "View all my work",
    empty: "My projects will be shown here soon.",
  },

  /* ───────────── Why me ───────────── */
  why: {
    eyebrow: "Why MTE",
    title: "Faults fixed at the source",
    items: [
      {
        title: "Component-level repair",
        description:
          "I don't swap blindly: I diagnose and repair the board at its source, keeping costs under control.",
      },
      {
        title: "Programming + electronics",
        description:
          "Dual automation and electronics skills: I handle both the software and the hardware.",
      },
      {
        title: "On site, all of Algeria",
        description:
          "I come to your plant directly, and I have an equipped workshop for repairs.",
      },
      {
        title: "Transparent & fast",
        description:
          "Diagnosis within 24–48h, a clear quote with no hidden costs, and one contact from start to finish.",
      },
    ],
  },

  /* ───────────── Industries ───────────── */
  industries: {
    eyebrow: "Sectors",
    title: "Industries I serve",
    intro:
      "I work with any industry or workshop that uses electrical and automated equipment.",
    items: [
      "Food & beverage",
      "Cement & concrete",
      "Quarries & mining",
      "Recycling & waste",
      "Plastics & textile",
      "Pumping & water",
      "Agriculture & irrigation",
      "Renewable energy",
    ],
  },

  /* ───────────── Process ───────────── */
  process: {
    eyebrow: "Process",
    title: "How I work",
    intro:
      "A clear path from diagnosis to commissioning, for an intervention with no surprises.",
    steps: [
      { title: "Diagnosis", description: "Analysis of the fault or requirement, within 24 to 48 hours." },
      { title: "Transparent quote", description: "A clear, detailed proposal with no hidden costs." },
      { title: "Intervention", description: "Repair, programming or installation, in the workshop or on site." },
      { title: "Testing & validation", description: "Load testing and full verification." },
      { title: "Delivery & support", description: "Back in service, with warranty and support." },
    ],
  },

  /* ───────────── Brands ───────────── */
  brands: {
    eyebrow: "Technologies",
    title: "Brands I work with",
  },

  /* ───────────── About ───────────── */
  about: {
    eyebrow: "About",
    title: "Fekhar Moutie — automation & electronics engineer",
    p1: "When your machines stop, your production stops too. I'm <strong>Fekhar Moutie</strong>, an automation and electronics engineer based in Médéa, working across all of Algeria to get your equipment running again.",
    p2: "My strength: a dual <strong>programming + electronics</strong> skill set. I program your PLCs and drives, repair your boards at component level, and install your panels and generator sets — one contact, from breakdown to recommissioning.",
    p3: "My commitment: tailored, transparent and reliable technical solutions for the maximum efficiency of your installations.",
    ctaPortfolio: "My work",
    cvFr: "My CV (French)",
    cvEn: "My CV (English)",
  },

  /* ───────────── FAQ ───────────── */
  faq: {
    eyebrow: "FAQ",
    title: "Frequently asked questions",
    items: [
      {
        q: "Do you repair variable frequency drives (VFD)?",
        a: "Yes. I repair variable frequency drives at component level, all brands (ABB, Schneider Altivar, Siemens SINAMICS, Danfoss, Delta, INVT) — power stages, control boards — and I also handle parameterization and commissioning.",
      },
      {
        q: "Do you program Siemens and Schneider PLCs?",
        a: "Yes. I program Siemens S7-1200/1500 (TIA Portal), S7-300/400, LOGO!, as well as Schneider Modicon, Omron and Fatek: new programs, modification and migration.",
      },
      {
        q: "Do you install and repair generator sets?",
        a: "Yes. I install, repair and maintain generator sets, including the automatic transfer switch (ATS) mains/standby and the start-up automation.",
      },
      {
        q: "Do you repair electronic boards and control panels?",
        a: "Yes. I repair industrial electronic boards at component level (with reverse engineering if needed), and I design, wire and repair control cabinets and panels.",
      },
      {
        q: "Do you work on site across Algeria?",
        a: "Yes. I travel on site across all of Algeria for breakdowns, commissioning and installation, and I have an equipped workshop for repairs.",
      },
      {
        q: "What are your lead times?",
        a: "Diagnosis is delivered within 24 to 48 hours. The lead time then depends on complexity and parts availability, with a focus on getting your production running again quickly.",
      },
    ],
  },

  /* ───────────── Quote form (WhatsApp) ───────────── */
  quote: {
    eyebrow: "Free quote",
    title: "Describe your problem",
    subtitle:
      "Fill in this form: your request goes straight to my WhatsApp and I reply quickly.",
    name: "Your name",
    phone: "Phone",
    city: "City / Wilaya",
    equipment: "Equipment type",
    message: "Describe the fault or need",
    submit: "Send on WhatsApp",
    equipmentOptions: [
      "Variable frequency drive (VFD)",
      "PLC",
      "Electronic board (PCB)",
      "Control panel / cabinet",
      "Generator set",
      "Industrial machine",
      "Programming / commissioning",
      "Other",
    ],
    waIntro: "Hello, I'd like a quote.",
  },

  /* ───────────── Contact ───────────── */
  contact: {
    eyebrow: "Contact",
    title: "Let's talk about your project",
    subtitle: "Reach me on WhatsApp, by phone, or drop by the workshop.",
    whatsappLabel: "WhatsApp",
    whatsappDesc: "Chat with me directly",
    callLabel: "Phone",
    callDesc: "Call me directly",
    locationLabel: "Médéa, Ain Dhab, Algeria",
    locationDesc: "Workshop location",
  },

  /* ───────────── Testimonials ───────────── */
  testimonials: {
    eyebrow: "Testimonials",
    title: "What my clients say",
  },

  /* ───────────── Footer ───────────── */
  footer: {
    about:
      "Repair, programming and installation of industrial equipment. Drives, PLCs, electronic boards, panels and generator sets. Serving industry across Algeria.",
    services: "Services",
    quickLinks: "Quick links",
    follow: "Follow me",
    rights: "All rights reserved.",
    tagline: "Industrial Electronics & Automation",
  },

  /* ───────────── Portfolio (chrome) ───────────── */
  portfolio: {
    heroTitle: "My",
    heroTitleAccent: "Work",
    heroSubtitle: "Repairs, programming and installations across all of Algeria.",
    loading: "Loading...",
    emptyTitle: "No projects yet",
    emptyDesc: "Check back soon to discover my latest interventions.",
    interventionDate: "Date:",
    viewProject: "View project",
    notFound: "Post not found",
    backToPortfolio: "Back to portfolio",
    mediaUnavailable: "Media unavailable",
    noMedia: "No media",
    photo: "photo",
    photos: "photos",
    videoLabel: "Video",
    metaTitle: "Portfolio | Industrial Repair & Automation – MTE Algeria",
    metaDescription:
      "See my work: repair of drives and electronic boards, PLC programming, panels and generator sets across Algeria.",
  },
};

export default en;
