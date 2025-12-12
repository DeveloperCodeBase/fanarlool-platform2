import { useState } from "react";
import clsx from "clsx";

type LogoProps = {
  className?: string;
  textClassName?: string;
};

export const Logo = ({ className, textClassName }: LogoProps) => {
  const [broken, setBroken] = useState(false);
  return (
    <div className={clsx("flex items-center gap-2", className)}>
      {!broken ? (
        <img
          src="/logo.svg"
          alt="Logo"
          className="h-10 w-10 rounded-xl bg-white/60 p-1 shadow-soft"
          onError={() => setBroken(true)}
        />
      ) : (
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-emerald-500 text-white shadow-soft">
          FL
        </div>
      )}
      <div className={clsx("text-sm font-bold leading-tight text-slate-900", textClassName)}>
        <div>پلتفرم QC</div>
        <div className="text-xs font-semibold text-slate-500">
          Place /public/logo.svg and it will render automatically
        </div>
      </div>
    </div>
  );
};
