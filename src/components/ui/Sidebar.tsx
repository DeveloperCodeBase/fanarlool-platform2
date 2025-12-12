import clsx from "clsx";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ReactNode } from "react";

type SidebarProps = {
  items: { key: string; label: string; icon?: ReactNode }[];
  active: string;
  onSelect: (key: string) => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  className?: string;
  title?: string;
};

export const Sidebar = ({
  items,
  active,
  onSelect,
  collapsed = false,
  onToggleCollapse,
  className,
  title = "Navigation"
}: SidebarProps) => (
  <div
    className={clsx(
      "flex h-full min-h-[280px] flex-col gap-3 rounded-2xl border border-white/70 bg-white/90 p-3 shadow-soft transition-all duration-200",
      collapsed ? "w-16 items-center px-2" : "w-full",
      className
    )}
  >
    <div className="flex w-full items-center justify-between gap-2">
      <span className={clsx("text-xs font-bold uppercase tracking-wide text-slate-500", collapsed && "sr-only")}>
        {title}
      </span>
      {onToggleCollapse && (
        <button
          onClick={onToggleCollapse}
          className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      )}
    </div>
    <div className="flex w-full flex-col gap-2">
      {items.map((item) => (
        <button
          key={item.key}
          onClick={() => onSelect(item.key)}
          className={clsx(
            "flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition",
            collapsed ? "justify-center" : "justify-start",
            active === item.key
              ? "bg-primary-600 text-white shadow-soft"
              : "text-slate-700 hover:bg-slate-100"
          )}
        >
          {item.icon}
          <span className={clsx("whitespace-nowrap", collapsed && "sr-only")}>{item.label}</span>
        </button>
      ))}
    </div>
  </div>
);
