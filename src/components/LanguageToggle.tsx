import { useAppContext } from "../context/AppContext";

export const LanguageToggle = () => {
  const { language, changeLanguage } = useAppContext();
  const toggle = () => changeLanguage(language === "fa" ? "en" : "fa");
  return (
    <button
      onClick={toggle}
      className="rounded-full border border-white/60 bg-white/70 px-3 py-1 text-xs font-semibold text-slate-700 shadow-soft transition hover:-translate-y-0.5"
    >
      {language === "fa" ? "EN" : "فا"}
    </button>
  );
};
