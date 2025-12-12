import { Mail, MapPin, Phone, Send } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";

const ContactPage = () => {
  const { i18n } = useTranslation();
  const isFa = i18n.language === "fa";
  return (
    <div className="py-10 space-y-6">
      <div className="flex items-center gap-3">
        <Badge tone="primary">{isFa ? "تماس مستقیم" : "Direct contact"}</Badge>
        <Badge tone="neutral">{isFa ? "داده نمایشی" : "Demo data"}</Badge>
      </div>
      <h1 className="text-3xl font-black text-slate-900">{isFa ? "هماهنگی جلسه" : "Schedule a session"}</h1>
      <p className="text-sm text-slate-600">
        {isFa
          ? "برای دمو حضوری یا آنلاین در کارخانه فنر لول ایران یا پارک علم و فناوری سمنان تماس بگیرید."
          : "Contact us for on-site or remote demo at Fanar Lool factory or Semnan Science & Tech Park."}
      </p>
      <div className="grid gap-4 md:grid-cols-3">
        <Card title="Mohammadreza Yousefi" subtitle="+98 910 296 8816" actions={<Phone size={14} />}>
          <div className="text-xs text-slate-600">
            {isFa ? "هماهنگی فنی و برنامه‌ریزی جلسه" : "Technical coordination & scheduling"}
          </div>
        </Card>
        <Card title="مسعود بخشی" subtitle="۰۹۱۲۴۷۳۳۲۳۴" actions={<Phone size={14} />}>
          <div className="text-xs text-slate-600">
            {isFa ? "مدیریت پروژه و استقرار" : "Project & deployment"}
          </div>
        </Card>
        <Card title="محمد بخشی" subtitle="۰۹۱۲۳۳۱۱۹۲۱" actions={<Phone size={14} />}>
          <div className="text-xs text-slate-600">
            {isFa ? "پشتیبانی QC و OEE" : "QC & OEE support"}
          </div>
        </Card>
      </div>
      <Card title={isFa ? "ایمیل" : "Email"} actions={<Mail size={14} />} className="md:w-1/2">
        <div className="flex items-center justify-between text-sm text-slate-700">
          <span>Devcodebase.dev@gmail.com</span>
          <button className="rounded-full bg-primary-600 px-3 py-2 text-xs font-bold text-white shadow-soft">
            {isFa ? "ارسال" : "Send"}
          </button>
        </div>
      </Card>
      <Card title={isFa ? "آدرس پیشنهادی استقرار" : "Suggested deployment site"} actions={<MapPin size={14} />}>
        <div className="text-sm text-slate-600">
          {isFa
            ? "ابر خصوصی در پارک علم و فناوری سمنان یا سرور اختصاصی در کارخانه فنر لول ایران. دسترسی امن برای کارخانه‌های عضو A ،B ،C."
            : "Private cloud at Semnan Science & Tech Park or dedicated server at Fanar Lool factory. Secure access for member factories A, B, C."}
        </div>
      </Card>
      <Card title={isFa ? "فرم تماس (نمایشی)" : "Contact form (demo)"} actions={<Send size={14} />}>
        <div className="grid gap-3 md:grid-cols-2">
          <input className="rounded-xl border border-slate-200 p-3" placeholder={isFa ? "نام" : "Name"} />
          <input className="rounded-xl border border-slate-200 p-3" placeholder={isFa ? "ایمیل یا تلفن" : "Email or phone"} />
        </div>
        <textarea className="mt-3 h-24 w-full rounded-xl border border-slate-200 p-3" placeholder={isFa ? "پیام..." : "Message..."} />
        <div className="mt-3 text-xs text-slate-500">
          {isFa ? "این فرم صرفاً نمایشی است؛ جهت هماهنگی از شماره‌های بالا استفاده کنید." : "Demo form only; please use phone/email above."}
        </div>
      </Card>
    </div>
  );
};

export default ContactPage;
