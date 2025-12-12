import clsx from "clsx";
import { PropsWithChildren } from "react";

type BadgeProps = PropsWithChildren<{
  tone?: "primary" | "success" | "warning" | "neutral";
  subtle?: boolean;
  className?: string;
}>;

const toneClasses: Record<NonNullable<BadgeProps["tone"]>, string> = {
  primary: "bg-blue-50 text-blue-700 border-blue-100",
  success: "bg-emerald-50 text-emerald-700 border-emerald-100",
  warning: "bg-amber-50 text-amber-700 border-amber-100",
  neutral: "bg-slate-50 text-slate-700 border-slate-100"
};

export const Badge = ({ tone = "neutral", subtle, className, children }: BadgeProps) => (
  <span
    className={clsx(
      "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium",
      subtle ? "bg-white/60" : toneClasses[tone],
      className
    )}
  >
    {children}
  </span>
);
