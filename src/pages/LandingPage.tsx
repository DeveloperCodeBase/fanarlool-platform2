import {
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Gauge,
  Cpu,
  Battery,
  Factory,
  BarChart3,
  LayoutDashboard
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { KpiCard } from "../components/ui/KpiCard";
import { useAppContext } from "../context/AppContext";

const LandingPage = () => {
  const { t, i18n } = useTranslation();
  const isFa = i18n.language === "fa";
  const navigate = useNavigate();
  const { selection, setSelection } = useAppContext();

  const moduleCards = [
    {
      title: isFa ? "ماژول ۳: پلتفرم مرکزی QC" : "Module 3: Central QC",
      desc: isFa
        ? "بازرسی تصویری و ابعادی با مدل‌های هوش مصنوعی، مدیریت نسخه و ذخیره‌سازی متمرکز."
        : "AI-powered visual and dimensional inspection with versioned models and central storage.",
      icon: <Sparkles className="text-primary-600" />
    },
    {
      title: isFa ? "ماژول ۵: OEE و توقفات" : "Module 5: OEE & Downtime",
      desc: isFa
        ? "تحلیل دسترسی، کارایی و کیفیت به تفکیک خط و شیفت؛ پارِتو توقفات."
        : "Availability, performance, quality per line and shift; downtime Pareto with actions.",
      icon: <Gauge className="text-emerald-600" />
    },
    {
      title: isFa ? "ماژول ۶: انرژی هوشمند" : "Module 6: Smart Energy",
      desc: isFa
        ? "پایش برق، گاز و هوای فشرده؛ کشف نشت و محاسبه هزینه بر اساس تعرفه."
        : "Electricity, gas, compressed air monitoring; leak detection and cost estimation.",
      icon: <Battery className="text-indigo-600" />
    }
  ];

  const architecture = [
    {
      title: t("architecture.edge"),
      points: isFa
        ? ["حسگر و دوربین صنعتی", "PLC/OPC UA", "پردازش اولیه و هشدار"]
        : ["Industrial sensors & cameras", "PLC/OPC UA", "Pre-processing & alarms"]
    },
    {
      title: t("architecture.gateway"),
      points: isFa
        ? ["Gateway امن", "MQTT/HTTPS", "همگام‌سازی مدل و Recipe"]
        : ["Secure gateway", "MQTT/HTTPS", "Model & recipe sync"]
    },
    {
      title: t("architecture.central"),
      points: isFa
        ? ["Lakehouse کیفیت", "RBAC و Audit log", "نسخه‌بندی مدل/Recipe"]
        : ["Quality lakehouse", "RBAC + audit log", "Model/recipe versioning"]
    },
    {
      title: t("architecture.apps"),
      points: isFa
        ? ["داشبورد QC/OEE/انرژی", "Benchmarks بین کارخانه", "API برای MES/ERP"]
        : ["QC/OEE/Energy dashboards", "Cross-plant benchmarks", "API for MES/ERP"]
    }
  ];

  return (
    <div className="space-y-16 pb-16">
      <section
        id="hero"
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-900 via-slate-900 to-emerald-800 px-6 py-16 text-white shadow-soft"
      >
        <div className="absolute inset-0 opacity-30">
          <div className="absolute left-10 top-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute right-10 top-10 h-64 w-64 rounded-full bg-emerald-400/20 blur-3xl" />
          <div className="absolute bottom-0 right-20 h-48 w-48 rounded-full bg-primary-500/20 blur-3xl" />
        </div>
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-4 lg:w-2/3">
            <Badge tone="success" className="bg-white/20 text-white">
              {t("demoData")}
            </Badge>
            <h1 className="text-3xl font-black leading-tight sm:text-4xl">
              {t("hero.title")}
            </h1>
            <p className="text-lg text-white/80">{t("hero.subtitle")}</p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => navigate("/demo")}
                className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-slate-900 shadow-soft transition hover:-translate-y-0.5"
              >
                <ArrowRight size={16} />
                {t("hero.primary")}
              </button>
              <button
                onClick={() => {
                  setSelection({ range: "30d" });
                  const el = document.getElementById("architecture");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
                className="rounded-full border border-white/50 px-4 py-2 text-sm font-bold text-white/80 transition hover:bg-white/10"
              >
                {t("hero.secondary")}
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <KpiCard
                label={isFa ? "OEE نمایشی" : "Demo OEE"}
                value="87%"
                delta={isFa ? "بهبود ۳٪ نسبت به ماه قبل (داده نمایشی)" : "+3% vs last month (demo)"}
              />
              <KpiCard
                label={isFa ? "نرخ عیب" : "Defect rate"}
                value="1.8%"
                delta={isFa ? "QC مرکزی" : "Central QC"}
                tone="warning"
              />
              <KpiCard label={isFa ? "مصرف برق امروز" : "Electricity today"} value="2.3 MWh" tone="primary" />
              <KpiCard
                label={isFa ? "صرفه‌جویی انرژی" : "Energy savings"}
                value="9.5%"
                delta={isFa ? "هدف ۱۰٪ خط ۳" : "Target 10% Line 3"}
                tone="success"
              />
            </div>
          </div>
          <div className="mt-6 grid gap-4 rounded-2xl border border-white/30 bg-white/10 p-5 shadow-soft backdrop-blur lg:mt-0 lg:w-1/3">
            <div className="flex items-center justify-between text-sm font-semibold">
              <span>{t("demoData")}</span>
              <span className="rounded-full bg-white/20 px-3 py-1 text-xs">Fanar Lool</span>
            </div>
            <div className="grid gap-3">
              <div className="flex items-center justify-between rounded-xl bg-white/10 p-3">
                <div className="flex items-center gap-2">
                  <Sparkles size={16} />
                  <span>{isFa ? "بازرسی تصویری" : "Visual inspection"}</span>
                </div>
                <span className="text-sm font-bold">98.2%</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-white/10 p-3">
                <div className="flex items-center gap-2">
                  <Gauge size={16} />
                  <span>{isFa ? "کیفیت ابعادی" : "Dimensional quality"}</span>
                </div>
                <span className="text-sm font-bold">97.1%</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-white/10 p-3">
                <div className="flex items-center gap-2">
                  <Battery size={16} />
                  <span>{isFa ? "مصرف برق خط ۲" : "Line 2 electricity"}</span>
                </div>
                <span className="text-sm font-bold">-8.4% {isFa ? "بهتر" : "better"}</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-white/10 p-3">
                <div className="flex items-center gap-2">
                  <Factory size={16} />
                  <span>{isFa ? "بنچمارک با عضو A" : "Benchmark vs A"}</span>
                </div>
                <span className="text-sm font-bold text-emerald-300">+6.2%</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="modules" className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-primary-600">{t("demoData")}</div>
            <h2 className="text-2xl font-black text-slate-900">{t("modules.title")}</h2>
            <p className="text-sm text-slate-600">{t("modules.description")}</p>
          </div>
          <button
            onClick={() => navigate("/demo")}
            className="hidden items-center gap-2 rounded-full bg-primary-600 px-4 py-2 text-sm font-bold text-white shadow-soft transition hover:-translate-y-0.5 lg:flex"
          >
            <LayoutDashboard size={16} />
            {t("nav.demo")}
          </button>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {moduleCards.map((m) => (
            <Card
              key={m.title}
              title={m.title}
              subtitle={isFa ? "داده نمایشی" : "Demo data"}
              className="card-hover"
              actions={<Badge tone="primary">Module</Badge>}
            >
              <div className="flex items-start gap-3">
                {m.icon}
                <p className="text-sm text-slate-600">{m.desc}</p>
              </div>
              <div className="mt-4 flex items-center gap-3 text-xs text-primary-600">
                <BarChart3 size={14} />
                {isFa ? "تحلیل بر خط + تاریخچه" : "Real-time + history analytics"}
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section id="architecture" className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black text-slate-900">{t("architecture.title")}</h2>
          <Badge tone="neutral">{isFa ? "ابر خصوصی/آن‌پرمیس" : "Private cloud/on-prem"}</Badge>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {architecture.map((item) => (
            <Card key={item.title} title={item.title} className="card-hover">
              <ul className="space-y-2 text-sm text-slate-600">
                {item.points.map((p) => (
                  <li key={p} className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-emerald-500" />
                    {p}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </section>

      <section id="security" className="space-y-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="text-primary-600" />
          <h2 className="text-2xl font-black text-slate-900">{t("security.title")}</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {(t("security.items", { returnObjects: true }) as string[])?.map((item) => (
            <Card key={item}>
              <div className="flex items-start gap-3">
                <Cpu className="text-emerald-600" />
                <p className="text-sm text-slate-600">{item}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section id="subscription" className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black text-slate-900">{t("subscription.title")}</h2>
          <Badge tone="warning">{isFa ? "نمونه قیمت" : "Example only"}</Badge>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { title: t("subscription.tier1"), price: isFa ? "رایگان تست" : "Test only", feats: ["2 خط", "7 روز داده", "داشبورد نمایشی"] },
            { title: t("subscription.tier2"), price: isFa ? "۱۲,۵۰۰,۰۰۰ ریال/ماه" : "12.5M IRR/mo", feats: ["۵ خط", "حفظ تاریخچه ۶ ماه", "پشتیبانی ۵×۹"] },
            { title: t("subscription.tier3"), price: isFa ? "تماس" : "Contact", feats: ["تمام خطوط", "استقرار اختصاصی", "یکپارچه‌سازی MES/ERP"] }
          ].map((tier, idx) => (
            <Card
              key={tier.title}
              title={tier.title}
              subtitle={isFa ? "داده نمایشی" : "Demo"}
              className="card-hover"
              actions={<Badge tone={idx === 1 ? "primary" : "neutral"}>{idx === 1 ? (isFa ? "محبوب" : "Popular") : "Demo"}</Badge>}
            >
              <div className="text-2xl font-black text-slate-900">{tier.price}</div>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                {tier.feats.map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary-500" />
                    {f}
                  </li>
                ))}
              </ul>
              <button
                className="mt-4 w-full rounded-xl bg-primary-600 px-3 py-2 text-sm font-bold text-white shadow-soft"
                onClick={() => navigate("/contact")}
              >
                {isFa ? "درخواست جلسه" : "Request meeting"}
              </button>
            </Card>
          ))}
        </div>
      </section>

      <section id="contact" className="space-y-4">
        <h2 className="text-2xl font-black text-slate-900">{t("contact.title")}</h2>
        <p className="text-sm text-slate-600">{t("contact.subtitle")}</p>
        <div className="grid gap-4 md:grid-cols-3">
          <Card title="Mohammadreza Yousefi" subtitle="+98 910 296 8816" actions={<Badge tone="primary">{t("contact.people")}</Badge>}>
            <div className="text-xs text-slate-600">
              {isFa ? "مشاور ارشد صنعتی و مسئول ارتباط با کارخانه فنر لول ایران" : "Senior industrial advisor, Fanar Lool liaison"}
            </div>
          </Card>
          <Card title="مسعود بخشی" subtitle="۰۹۱۲۴۷۳۳۲۳۴" actions={<Badge tone="primary">{t("contact.people")}</Badge>}>
            <div className="text-xs text-slate-600">
              {isFa ? "مدیر پروژه و استقرار، عضو پارک علم و فناوری سمنان" : "Project & deployment lead, Semnan Science & Tech Park member"}
            </div>
          </Card>
          <Card title="محمد بخشی" subtitle="۰۹۱۲۳۳۱۱۹۲۱" actions={<Badge tone="primary">{t("contact.people")}</Badge>}>
            <div className="text-xs text-slate-600">
              {isFa ? "ارتباط فنی و توسعه مدل‌های QC" : "Technical contact for QC models"}
            </div>
          </Card>
        </div>
        <Card
          title={isFa ? "ایمیل" : "Email"}
          subtitle="Devcodebase.dev@gmail.com"
          className="card-hover"
          actions={<Badge tone="success">{isFa ? "پاسخ سریع" : "Quick response"}</Badge>}
        >
          <div className="text-xs text-slate-600">
            {isFa
              ? "جهت برگزاری دمو در محل کارخانه فنر لول ایران یا پارک علم و فناوری سمنان هماهنگ کنید."
              : "Schedule an on-site or private cloud demo at Fanar Lool factory or Semnan Science & Tech Park."}
          </div>
        </Card>
      </section>
    </div>
  );
};

export default LandingPage;
