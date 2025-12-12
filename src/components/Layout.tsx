import { PropsWithChildren } from "react";
import clsx from "clsx";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { useAppContext } from "../context/AppContext";

export const Layout = ({ children }: PropsWithChildren) => {
  const { isRTL } = useAppContext();
  return (
    <div className={clsx(isRTL ? "rtl" : "ltr", "min-h-screen bg-slate-50/70 text-slate-900")}>
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 lg:px-8">{children}</main>
      <Footer />
    </div>
  );
};
