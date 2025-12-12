import { PropsWithChildren } from "react";
import clsx from "clsx";

type DrawerProps = PropsWithChildren<{
  open: boolean;
  onClose: () => void;
  title?: string;
}>;

export const Drawer = ({ open, onClose, title, children }: DrawerProps) => {
  return (
    <div
      className={clsx(
        "fixed inset-y-0 right-0 z-50 w-full max-w-lg transform bg-white shadow-2xl transition duration-300 ease-out",
        open ? "translate-x-0" : "translate-x-full"
      )}
    >
      <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
        <div className="text-base font-semibold text-slate-900">{title}</div>
        <button
          className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600"
          onClick={onClose}
        >
          ✕
        </button>
      </div>
      <div className="h-full overflow-y-auto p-6 text-sm text-slate-700">{children}</div>
    </div>
  );
};
