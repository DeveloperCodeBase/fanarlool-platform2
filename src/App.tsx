import { Suspense, useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LandingPage from "./pages/LandingPage";
import PlatformPage from "./pages/PlatformPage";
import DemoPage from "./pages/DemoPage";
import CompanyPage from "./pages/CompanyPage";
import ContactPage from "./pages/ContactPage";
import { Layout } from "./components/Layout";
import { AppProvider } from "./context/AppContext";
import { Skeleton } from "./components/ui/Skeleton";

const ScrollToHash = () => {
  const { hash, pathname } = useLocation();
  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.replace("#", ""));
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } else if (pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [hash, pathname]);
  return null;
};

const App = () => {
  const { i18n } = useTranslation();

  useEffect(() => {
    const dir = i18n.language === "fa" ? "rtl" : "ltr";
    document.documentElement.setAttribute("dir", dir);
    document.documentElement.setAttribute("lang", i18n.language);
  }, [i18n.language]);

  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <Skeleton className="h-12 w-12 rounded-full" />
        </div>
      }
    >
      <AppProvider>
        <ScrollToHash />
        <Layout>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/platform" element={<PlatformPage />} />
            <Route path="/demo" element={<DemoPage />} />
            <Route path="/company" element={<CompanyPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </AppProvider>
    </Suspense>
  );
};

export default App;
