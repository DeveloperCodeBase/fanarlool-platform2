import { useTranslation } from "react-i18next";
import { Award, Building2, Mail, Phone, Shield, Users } from "lucide-react";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";

const CompanyPage = () => {
  const { t, i18n } = useTranslation();
  const isFa = i18n.language === "fa";
  return (
    <div className="py-10 space-y-6">
      <div className="flex items-center gap-3">
        <Badge tone="primary">{isFa ? "شرکت شبکه هوشمند ابتکار ویستا" : "Shabakeh Hoshmand Ebtakar Vista"}</Badge>
        <Badge tone="neutral">{isFa ? "عضو پارک علم و فناوری سمنان" : "Semnan Science & Tech Park member"}</Badge>
      </div>
      <h1 className="text-3xl font-black text-slate-900">{t("company.title")}</h1>
      <p className="text-sm text-slate-600 max-w-3xl">{t("company.subtitle")}</p>

      <div className="grid gap-4 md:grid-cols-3">
        <Card title={isFa ? "حوزه‌ها" : "Domains"} subtitle={t("demoData")} actions={<Badge tone="primary">AI</Badge>}>
          <ul className="space-y-2 text-sm text-slate-600">
            <li>• {isFa ? "هوش مصنوعی صنعتی و بینایی ماشین" : "Industrial AI & computer vision"}</li>
            <li>• {isFa ? "پلتفرم داده برای QC/OEE/انرژی" : "Data platform for QC/OEE/Energy"}</li>
            <li>• {isFa ? "استقرار ابر خصوصی/آن‌پرمیس" : "Private cloud/on-prem deployments"}</li>
          </ul>
        </Card>
        <Card title={isFa ? "عضویت‌ها" : "Memberships"} actions={<Shield size={16} />}>
          <div className="space-y-2 text-sm text-slate-600">
            <div>• {isFa ? "شرکت فن آور" : "Technology firm"}</div>
            <div>• {isFa ? "عضو پارک علم و فناوری استان سمنان" : "Member, Semnan Science & Technology Park"}</div>
            <div>• {isFa ? "عضو نظام صنفی رایانه ای استان سمنان" : "Member, ICT Guild of Semnan"}</div>
          </div>
        </Card>
        <Card title={isFa ? "محور جلسه" : "Meeting focus"} subtitle={t("demoData")} actions={<Award size={16} />}>
          <div className="text-sm text-slate-600">
            {isFa
              ? "ارائه عملیاتی برای مدیرعامل درباره پلتفرم QC مرکزی کارخانه فنر لول ایران، بنچمارک بین کارخانه‌ای و نقشه راه استقرار."
              : "Operational walkthrough for CEO on central QC platform for Fanar Lool, cross-plant benchmarking, and deployment roadmap."}
          </div>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card title={t("company.contact")} subtitle={t("demoData")} actions={<Users size={16} />}>
          <div className="space-y-3 text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <Phone size={16} /> محمدرضا یوسفی — +98 910 296 8816
            </div>
            <div className="flex items-center gap-2">
              <Phone size={16} /> مسعود بخشی — ۰۹۱۲۴۷۳۳۲۳۴
            </div>
            <div className="flex items-center gap-2">
              <Phone size={16} /> محمد بخشی — ۰۹۱۲۳۳۱۱۹۲۱
            </div>
            <div className="flex items-center gap-2">
              <Mail size={16} /> Devcodebase.dev@gmail.com
            </div>
          </div>
        </Card>
        <Card title={isFa ? "آدرس استقرار پیشنهادی" : "Deployment location"} actions={<Building2 size={16} />}>
          <div className="text-sm text-slate-600">
            {isFa
              ? "ابر خصوصی/آن‌پرمیس در کارخانه فنر لول ایران یا دیتاسنتر پارک علم و فناوری سمنان. دسترسی امن برای کارخانه‌های عضو A، B، C."
              : "Private cloud/on-prem at Fanar Lool factory or Semnan Science & Tech Park DC. Secure multi-plant access for member factories A, B, C."}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CompanyPage;
