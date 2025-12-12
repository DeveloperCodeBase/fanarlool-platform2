import clsx from "clsx";
import { ReactNode } from "react";

type SidebarProps = {
  items: { key: string; label: string; icon?: ReactNode }[];
  active: string;
  onSelect: (key: string) => void;
};

export const Sidebar = ({ items, active, onSelect }: SidebarProps) => (
  <div className="flex h-full flex-col gap-2 rounded-2xl border border-white/70 bg-white/80 p-3 shadow-soft">
    {items.map((item) => (
      <button
        key={item.key}
        onClick={() => onSelect(item.key)}
        className={clsx(
          "flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition",
          active === item.key
            ? "bg-primary-600 text-white shadow-soft"
            : "text-slate-700 hover:bg-slate-100"
        )}
      >
        {item.icon}
        {item.label}
      </button>
    ))}
  </div>
);
