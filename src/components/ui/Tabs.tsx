import clsx from "clsx";
import { ReactNode } from "react";

export type TabItem = { key: string; label: string; icon?: ReactNode };

type TabsProps = {
  items: TabItem[];
  active: string;
  onChange: (key: string) => void;
  className?: string;
};

export const Tabs = ({ items, active, onChange, className }: TabsProps) => (
  <div className={clsx("flex flex-wrap gap-2 rounded-xl bg-white/60 p-2", className)}>
    {items.map((item) => (
      <button
        key={item.key}
        onClick={() => onChange(item.key)}
        className={clsx(
          "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition",
          active === item.key
            ? "bg-primary-600 text-white shadow-soft"
            : "text-slate-600 hover:bg-slate-100"
        )}
      >
        {item.icon}
        {item.label}
      </button>
    ))}
  </div>
);
