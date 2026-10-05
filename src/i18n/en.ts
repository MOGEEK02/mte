// English dictionary — must mirror the shape of fr.ts (Dictionary type).
import type { Dictionary } from "./fr";

const en: Dictionary = {
  /* ───────────── SEO / <head> ───────────── */
  meta: {
    title:
      "Industrial Automation, PLC & Drive Programming in Algeria – MTE",
    description:
      "MTE – Specialist in PLC programming, variable frequency drive (VFD) and servo drive commissioning, and industrial automation in Algeria. Siemens, Schneider, ABB, Omron. VFD and electronic board repair. Based in Médéa, serving all of Algeria.",
    keywords:
      "PLC programming Algeria, Siemens S7 TIA Portal programming, VFD commissioning Algeria, variable frequency drive setup, servo drive programming, industrial automation Algeria, automation engineer Algeria, Schneider Altivar, Siemens SINAMICS, VFD repair Algeria, industrial PCB repair, Medea",
    ogTitle:
      "MTE – PLC & Drive Programming, Industrial Automation in Algeria",
    ogDescription:
      "PLC and drive programming, commissioning and repair of industrial equipment in Algeria. Professional, fast and reliable service.",
  },

  /* ───────────── Navigation ───────────── */
  nav: {
    home: "Home",
    about: "About",
    services: "Services",
    process: "Process",
    faq: "FAQ",
    contact: "Contact",
    portfolio: "Portfolio",
  },

  /* ───────────── Hero ───────────── */
  hero: {
    badge: "Industrial Automation & Electronics · Algeria",
    title: "Industrial Automation &",
    titleAccent: "PLC Programming",
    subtitle:
      "PLC programming, variable frequency drive and servo drive commissioning, HMI development — plus industrial equipment repair. Serving industry across Algeria.",
    ctaPrimary: "Chat on WhatsApp",
    ctaSecondary: "View my work",
    stat1Value: "Since 2020",
    stat1: "Automation expertise",
    stat2Value: "24–48h",
    stat2: "Diagnosis",
    stat3Value: "All of Algeria",
    stat3: "On-site service",
  },

  /* ───────────── About ───────────── */
  about: {
    eyebrow: "About",
    title: "Who I am and what I do",
    p1: "When your machines stop, your production stops too. I'm <strong>Fekhar Moutie</strong>, an automation and electronics engineer in Algeria. My specialty: programming, commissioning and troubleshooting your automated systems to get production running again fast.",
    p2: "I cover PLC programming, variable-speed and servo drive setup, HMI/SCADA development — and, as an independent technician, component-level (PCB) repair. This combination of programming and electronics lets me fix the fault at its source, not just hide the symptoms.",
    p3: "My commitment: tailored, transparent and reliable technical solutions that keep your installations running at peak efficiency.",
    ctaPortfolio: "My work",
    cvFr: "My CV (French)",
    cvEn: "My CV (English)",
  },

  /* ───────────── Brands ───────────── */
  brands: {
    eyebrow: "Technologies",
    title: "Brands I work with",
  },

  /* ───────────── Services ───────────── */
  services: {
    eyebrow: "Services",
    title: "What I do",
    intro:
      "My core business is industrial programming and automation. I also handle repair of your electronic equipment.",
    group1Title: "Programming & Commissioning",
    group1Subtitle: "My main expertise",
    group2Title: "Repair & Maintenance",
    group2Subtitle: "Component-level troubleshooting",
    group1: [
      {
        title: "PLC programming",
        description:
          "Development, modification and migration of PLC programs: Siemens S7-1200/1500 (TIA Portal), S7-300/400, LOGO!, Schneider Modicon, Omron, Fatek, Delta.",
      },
      {
        title: "VFD / drive commissioning",
        description:
          "Parameterization, commissioning and optimization of variable frequency drives: ABB, Schneider Altivar, Siemens SINAMICS, Danfoss, Delta, INVT.",
      },
      {
        title: "Servo drive programming & tuning",
        description:
          "Configuration, loop tuning and axis synchronization for servo drives: precise positioning, electronic cam and motion control.",
      },
      {
        title: "HMI / SCADA development",
        description:
          "Design of operator and supervision interfaces: HMI touch screens, control pages, alarms and production monitoring.",
      },
      {
        title: "Automation & retrofit",
        description:
          "Machine modernization, control panel design, and sensor/actuator integration to automate your processes.",
      },
    ],
    group2: [
      {
        title: "VFD / drive repair",
        description:
          "Component-level repair of variable frequency drives: IGBT power stages, control boards and power-supply faults.",
      },
      {
        title: "Industrial PCB repair (SMD)",
        description:
          "Repair of industrial electronic boards, reverse engineering and SMD component replacement.",
      },
      {
        title: "HMI panels",
        description:
          "Repair, replacement and reconfiguration of human-machine interfaces and operator panels.",
      },
      {
        title: "Industrial power supplies",
        description:
          "Repair and replacement of industrial power supplies (AC/DC, inverters, stabilizers).",
      },
      {
        title: "Sensors & transducers",
        description:
          "Diagnosis, repair and replacement of sensors: temperature, pressure, flow and position.",
      },
    ],
  },

  /* ───────────── Process ───────────── */
  process: {
    eyebrow: "Process",
    title: "How I work",
    intro:
      "A clear path from diagnosis to commissioning, for an intervention with no surprises.",
    steps: [
      {
        title: "Diagnosis",
        description:
          "Analysis of the fault or requirement. Diagnosis delivered within 24 to 48 hours.",
      },
      {
        title: "Transparent quote",
        description:
          "A clear, detailed proposal with no hidden costs, before any work begins.",
      },
      {
        title: "Programming / Repair",
        description:
          "Workshop or on-site intervention: programming, parameterization or repair.",
      },
      {
        title: "Testing & validation",
        description:
          "Load testing and full verification to guarantee reliable operation.",
      },
      {
        title: "Delivery & support",
        description:
          "Your equipment back in service, with warranty and post-intervention support.",
      },
    ],
  },

  /* ───────────── FAQ ───────────── */
  faq: {
    eyebrow: "FAQ",
    title: "Frequently asked questions",
    items: [
      {
        q: "Do you program Siemens and Schneider PLCs?",
        a: "Yes. I program Siemens S7-1200/1500 (TIA Portal), S7-300/400 and LOGO!, as well as Schneider Modicon, Omron and Fatek: new program development, modification and migration of existing installations.",
      },
      {
        q: "Do you commission variable frequency drives?",
        a: "Yes. I parameterize and commission VFDs from ABB, Schneider Altivar, Siemens SINAMICS, Danfoss, Delta and INVT, in the workshop or on site anywhere in Algeria.",
      },
      {
        q: "Do you program servo drives?",
        a: "Yes. I configure and tune servo drives: loop tuning, positioning, axis synchronization and motion control.",
      },
      {
        q: "Where are you located and do you work everywhere?",
        a: "I'm based in Ain Dhab, Médéa (wilaya 26). I work on site across all of Algeria, and I have a workshop for equipment repairs.",
      },
      {
        q: "Do you still repair drives and electronic boards?",
        a: "Yes. Alongside programming, I carry out component-level repair of variable frequency drives, power and control boards, HMI panels and industrial power supplies.",
      },
      {
        q: "What are your lead times?",
        a: "Diagnosis is delivered within 24 to 48 hours. The intervention lead time then depends on complexity and parts availability, with a focus on getting your production running again quickly.",
      },
    ],
  },

  /* ───────────── Contact ───────────── */
  contact: {
    eyebrow: "Contact",
    title: "Let's talk about your project",
    subtitle: "Reach me easily on WhatsApp, by phone, or drop by the workshop.",
    whatsappLabel: "WhatsApp",
    whatsappDesc: "Chat with me directly",
    callLabel: "Phone",
    callDesc: "Call me directly",
    locationLabel: "Médéa, Ain Dhab, Algeria",
    locationDesc: "Workshop location",
  },

  /* ───────────── Footer ───────────── */
  footer: {
    about:
      "PLC and drive programming, industrial automation and electronics repair. Serving industry across Algeria.",
    quickLinks: "Quick links",
    follow: "Follow me",
    rights: "All rights reserved.",
    tagline: "Industrial Automation & Electronics",
  },

  /* ───────────── Portfolio (chrome) ───────────── */
  portfolio: {
    heroTitle: "My",
    heroTitleAccent: "Work",
    heroSubtitle:
      "Programming, commissioning and repairs across all of Algeria.",
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
    metaTitle: "Portfolio | Industrial Programming & Repair – MTE Algeria",
    metaDescription:
      "See my work: PLC programming, drive commissioning, and repair of industrial equipment across Algeria.",
  },
};

export default en;
