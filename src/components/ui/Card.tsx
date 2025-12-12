import { PropsWithChildren, ReactNode } from "react";
import clsx from "clsx";

type CardProps = PropsWithChildren<{
  title?: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
  className?: string;
}>;

export const Card = ({ title, subtitle, actions, className, children }: CardProps) => (
  <div
    className={clsx(
      "glass relative rounded-2xl border border-white/60 shadow-soft p-5 transition hover:-translate-y-0.5 hover:shadow-lg bg-white/70",
      "before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-br before:from-white/60 before:to-white/30 before:-z-10",
      className
    )}
  >
    {(title || actions) && (
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          {title && <div className="text-sm font-semibold text-slate-900">{title}</div>}
          {subtitle && <div className="text-xs text-slate-500">{subtitle}</div>}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    )}
    {children}
  </div>
);
