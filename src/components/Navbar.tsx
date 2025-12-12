import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Menu, X, MonitorSmartphone, LayoutDashboard } from "lucide-react";
import clsx from "clsx";
import { Logo } from "./Logo";
import { LanguageToggle } from "./LanguageToggle";
import { useAppContext } from "../context/AppContext";

const SECTION_IDS = ["hero", "modules", "architecture", "security", "subscription", "contact"];

export const Navbar = () => {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { isRTL } = useAppContext();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("hero");

  const isHome = pathname === "/";

  useEffect(() => {
    if (!isHome) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      { rootMargin: "-50% 0px -40% 0px" }
    );
    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [isHome]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setOpen(false);
    }
  };

  const handleNav = (target: string) => {
    if (isHome) {
      scrollTo(target);
    } else {
      navigate(`/#${target}`);
    }
  };

  const navItems = useMemo(
    () => [
      { key: "home", label: t("nav.home"), target: "hero" },
      { key: "platform", label: t("nav.platform"), path: "/platform" },
      { key: "dashboards", label: t("nav.dashboards"), target: "modules" },
      { key: "architecture", label: t("nav.architecture"), target: "architecture" },
      { key: "pricing", label: t("nav.pricing"), target: "subscription" },
      { key: "company", label: t("nav.company"), path: "/company" },
      { key: "contact", label: t("nav.contact"), path: "/contact", target: "contact" }
    ],
    [t]
  );

  return (
    <header className="sticky top-0 z-40">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 lg:px-8">
        <div className="glass flex w-full items-center justify-between rounded-2xl px-4 py-3 shadow-soft backdrop-blur">
          <Logo />
          <div className="flex items-center gap-3 lg:hidden">
            <LanguageToggle />
            <button
              onClick={() => setOpen((v) => !v)}
              className="rounded-xl bg-white/70 p-2 text-slate-700 shadow-soft"
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
          <nav className="hidden items-center gap-3 lg:flex">
            {navItems.map((item) => {
              const selected =
                (item.target && active === item.target && isHome) || pathname === item.path;
              return (
                <button
                  key={item.key}
                  className={clsx(
                    "rounded-xl px-3 py-2 text-sm font-semibold transition",
                    selected ? "bg-primary-600 text-white shadow-soft" : "text-slate-700 hover:bg-white/70"
                  )}
                  onClick={() => {
                    if (item.path) {
                      navigate(item.path);
                    } else if (item.target) {
                      handleNav(item.target);
                    }
                  }}
                >
                  {item.label}
                </button>
              );
            })}
            <LanguageToggle />
            <button
              onClick={() => navigate("/demo")}
              className="flex items-center gap-2 rounded-full bg-gradient-to-r from-primary-600 to-accent-600 px-4 py-2 text-sm font-bold text-white shadow-soft transition hover:-translate-y-0.5"
            >
              <LayoutDashboard size={16} />
              {t("nav.demo")}
            </button>
          </nav>
        </div>
      </div>
      {open && (
        <div className="lg:hidden">
          <div className="mx-4 mb-3 rounded-2xl bg-white/90 p-4 shadow-soft">
            <div className="flex flex-col gap-2">
              {navItems.map((item) => (
                <button
                  key={item.key}
                  className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                  onClick={() => {
                    if (item.path) {
                      navigate(item.path);
                    } else if (item.target) {
                      handleNav(item.target);
                    }
                    setOpen(false);
                  }}
                >
                  <span>{item.label}</span>
                  <span className="text-xs text-slate-400">●</span>
                </button>
              ))}
              <div className={clsx("flex items-center justify-between rounded-xl px-3 py-2")}>
                <LanguageToggle />
                <button
                  onClick={() => {
                    navigate("/demo");
                    setOpen(false);
                  }}
                  className="flex items-center gap-2 rounded-full bg-gradient-to-r from-primary-600 to-emerald-500 px-4 py-2 text-sm font-bold text-white shadow-soft"
                >
                  <MonitorSmartphone size={16} />
                  {t("nav.demo")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
