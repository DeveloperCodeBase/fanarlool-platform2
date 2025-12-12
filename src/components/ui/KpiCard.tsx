import { ReactNode } from "react";
import clsx from "clsx";

type KpiCardProps = {
  label: string;
  value: string;
  delta?: string;
  icon?: ReactNode;
  tone?: "primary" | "success" | "warning";
};

export const KpiCard = ({ label, value, delta, icon, tone = "primary" }: KpiCardProps) => {
  const toneClasses =
    tone === "primary"
      ? "from-blue-50 to-indigo-50 text-blue-900"
      : tone === "success"
      ? "from-emerald-50 to-teal-50 text-emerald-900"
      : "from-amber-50 to-orange-50 text-amber-900";
  return (
    <div
      className={clsx(
        "rounded-2xl border border-white/70 bg-gradient-to-br p-4 shadow-soft transition card-hover",
        toneClasses
      )}
    >
      <div className="flex items-center justify-between">
        <div className="text-xs font-semibold text-slate-500">{label}</div>
        {icon && <div className="text-slate-600">{icon}</div>}
      </div>
      <div className="mt-2 flex items-end justify-between">
        <div className="text-2xl font-bold">{value}</div>
        {delta && <div className="text-xs text-slate-600">{delta}</div>}
      </div>
    </div>
  );
};
