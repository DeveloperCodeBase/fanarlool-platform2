import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  fa: {
    translation: {
      brand: "پلتفرم مرکزی کنترل کیفیت هوشمند",
      factory: "کارخانه فنر لول ایران",
      demoData: "داده نمایشی",
      nav: {
        home: "خانه",
        platform: "پلتفرم مرکزی QC",
        dashboards: "داشبوردها",
        architecture: "معماری",
        company: "درباره ما",
        contact: "تماس",
        demo: "دمو"
      },
      cta: {
        viewDemo: "مشاهده دمو",
        talkToUs: "گفتگو با ما"
      },
      hero: {
        title: "کنترل کیفیت یکپارچه، بین کارخانه‌ای",
        subtitle:
          "اتصال خطوط فنر لول ایران و اعضای پارک علم و فناوری سمنان به پلتفرم ابری/آن‌پرمیس برای کنترل کیفیت، OEE و انرژی. داده‌ها و تصاویر فقط جهت نمایش هستند.",
        primary: "شروع دمو",
        secondary: "مشاهده معماری"
      },
      modules: {
        title: "ماژول‌ها",
        m3: "پلتفرم مرکزی کنترل کیفیت هوشمند",
        m5: "داشبورد هوشمند بهره‌وری تولید و OEE",
        m6: "سامانه مانیتورینگ هوشمند انرژی",
        description:
          "انتقال داده‌ی برخط از خطوط تولید، انباره مرکزی، یادگیری مستمر و مقایسه بین کارخانه‌ها برای تصمیم‌های سریع و دقیق."
      },
      architecture: {
        title: "معماری عملیاتی",
        edge: "لبه (Edge)",
        gateway: "دروازه (Gateway)",
        central: "مرکز داده",
        apps: "اپلیکیشن‌ها"
      },
      security: {
        title: "امنیت و حاکمیت داده",
        items: [
          "استقرار آن‌پرمیس یا ابر خصوصی پارک علم و فناوری سمنان",
          "مدل RBAC، SSO و لاگ حسابرسی",
          "رمزنگاری در انتقال و ذخیره‌سازی، کنترل نسخه مدل و دستورالعمل"
        ]
      },
      contact: {
        title: "تماس",
        subtitle: "برای جلسه حضوری یا آنلاین با مدیرعامل آماده‌ایم.",
        people: "افراد",
        email: "ایمیل"
      },
      platform: {
        title: "پلتفرم مرکزی QC (ماژول ۳)",
        modelRegistry: "ثبت مدل‌ها",
        inspectionRecipes: "دستورالعمل بازرسی",
        traceability: "ردیابی و تاریخچه",
        storage: "انباره مرکزی کیفیت",
        detail: "جزئیات بازرسی"
      },
      demo: {
        overview: "نمای کلی",
        qc: "کیفیت مرکزی",
        oee: "OEE",
        energy: "انرژی",
        benchmark: "بنچمارک",
        reports: "گزارشات",
        admin: "مدیریت",
        filters: {
          factory: "کارخانه",
          range: "بازه",
          shift: "شیفت",
          product: "محصول"
        },
        ranges: {
          today: "امروز",
          week: "۷ روز",
          month: "۳۰ روز"
        },
        shifts: {
          a: "شیفت A",
          b: "شیفت B",
          c: "شیفت C"
        },
        products: {
          a: "فنر نوع A",
          b: "فنر نوع B",
          c: "فنر نوع C"
        },
        tooltipOee: "OEE = دسترسی × کارایی × کیفیت. داده نمایشی است."
      },
      company: {
        title: "شرکت شبکه هوشمند ابتکار ویستا",
        subtitle:
          "شرکت فن‌آور، عضو پارک علم و فناوری استان سمنان و عضو نظام صنفی رایانه‌ای استان سمنان. تمرکز بر راهکارهای هوش مصنوعی صنعتی و یکپارچه‌سازی داده.",
        certifications: "عضویت و همکاران",
        contact: "راه‌های ارتباط"
      },
      footer: {
        note: "برای کارخانه فنر لول ایران - داده نمایشی"
      }
    }
  },
  en: {
    translation: {
      brand: "Central Smart Quality Control Platform",
      factory: "Fanar Lool Spring Factory",
      demoData: "Demo Data",
      nav: {
        home: "Home",
        platform: "Central QC Platform",
        dashboards: "Dashboards",
        architecture: "Architecture",
        company: "Company",
        contact: "Contact",
        demo: "Demo"
      },
      cta: {
        viewDemo: "View Demo",
        talkToUs: "Talk to us"
      },
      hero: {
        title: "Unified, cross-plant quality control",
        subtitle:
          "Connecting Fanar Lool factory and member plants to a private/edge cloud for QC, OEE, and energy insights. All visuals show demo-only data.",
        primary: "Launch demo",
        secondary: "View architecture"
      },
      modules: {
        title: "Modules",
        m3: "Central Smart Quality Control (Module 3)",
        m5: "Smart Production OEE Dashboard (Module 5)",
        m6: "Intelligent Energy Monitoring (Module 6)",
        description:
          "Near real-time data from production lines, centralized lakehouse, continuous learning, and cross-factory benchmarking for precise, quick decisions."
      },
      architecture: {
        title: "Operational Architecture",
        edge: "Edge",
        gateway: "Gateway",
        central: "Central",
        apps: "Apps"
      },
      security: {
        title: "Security & Governance",
        items: [
          "On-prem or private cloud (Semnan Science & Tech Park)",
          "RBAC, SSO and audit logging",
          "Encrypted in transit/at rest, model and recipe versioning"
        ]
      },
      contact: {
        title: "Contact",
        subtitle: "Ready for your CEO session or on-site visit.",
        people: "People",
        email: "Email"
      },
      platform: {
        title: "Central QC Platform (Module 3)",
        modelRegistry: "Model registry",
        inspectionRecipes: "Inspection recipes",
        traceability: "Traceability",
        storage: "Central quality lake",
        detail: "Inspection detail"
      },
      demo: {
        overview: "Overview",
        qc: "Central QC",
        oee: "OEE",
        energy: "Energy",
        benchmark: "Benchmark",
        reports: "Reports",
        admin: "Admin",
        filters: {
          factory: "Factory",
          range: "Range",
          shift: "Shift",
          product: "Product"
        },
        ranges: {
          today: "Today",
          week: "7 days",
          month: "30 days"
        },
        shifts: {
          a: "Shift A",
          b: "Shift B",
          c: "Shift C"
        },
        products: {
          a: "Spring A",
          b: "Spring B",
          c: "Spring C"
        },
        tooltipOee: "OEE = Availability × Performance × Quality. Demo data only."
      },
      company: {
        title: "Shabakeh Hoshmand Ebtakar Vista",
        subtitle:
          "A technology company, member of Semnan Science & Technology Park and ICT Guild of Semnan, focused on industrial AI and data platforms.",
        certifications: "Memberships & partners",
        contact: "Contacts"
      },
      footer: {
        note: "For Fanar Lool Spring Factory - demo data"
      }
    }
  }
};

i18n.use(initReactI18next).init({
  resources,
  lng: "fa",
  fallbackLng: "fa",
  interpolation: {
    escapeValue: false
  }
});

export default i18n;
