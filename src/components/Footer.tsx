import { useTranslation } from "react-i18next";
import { Mail, Phone } from "lucide-react";
import { Logo } from "./Logo";

export const Footer = () => {
  const { t, i18n } = useTranslation();
  const isFa = i18n.language === "fa";
  return (
    <footer className="mt-16 bg-white/70 border-t border-white/70">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 lg:flex-row lg:items-start lg:justify-between lg:px-8">
        <div className="flex flex-col gap-3">
          <Logo />
          <div className="text-sm text-slate-600">{t("footer.note")}</div>
          <div className="text-xs text-slate-500">
            داده نمایشی - برای جلسه مدیرعامل در پارک علم و فناوری سمنان
          </div>
        </div>
        <div className="grid flex-1 grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <div className="text-sm font-bold text-slate-900">
              شرکت شبکه هوشمند ابتکار ویستا
            </div>
            <div className="mt-2 text-xs text-slate-600">
              شرکت فن آور، عضو پارک علم و فن اوری استان سمنان
              <br />
              عضو نظام صنفی رایانه ای استان سمنان
            </div>
          </div>
          <div>
            <div className="text-sm font-bold text-slate-900">{isFa ? "راه‌های تماس" : "Contacts"}</div>
            <div className="mt-2 space-y-2 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <Phone size={14} /> محمدرضا یوسفی — +98 910 296 8816
              </div>
              <div className="flex items-center gap-2">
                <Phone size={14} /> مسعود بخشی — ۰۹۱۲۴۷۳۳۲۳۴
              </div>
              <div className="flex items-center gap-2">
                <Phone size={14} /> محمد بخشی — ۰۹۱۲۳۳۱۱۹۲۱
              </div>
            </div>
          </div>
          <div>
            <div className="text-sm font-bold text-slate-900">{t("contact.email")}</div>
            <div className="mt-2 flex items-center gap-2 text-xs text-slate-600">
              <Mail size={14} />
              Devcodebase.dev@gmail.com
            </div>
            <div className="mt-3 text-xs text-slate-500">
              {isFa
                ? "استقرار روی ابر خصوصی/آن‌پرمیس در پارک علم و فناوری سمنان یا کارخانه فنر لول ایران."
                : "Deploy on private cloud or on-prem at Semnan Science & Tech Park or Fanar Lool site."}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
