import { PropsWithChildren } from "react";
import clsx from "clsx";

type ModalProps = PropsWithChildren<{
  open: boolean;
  onClose: () => void;
  title?: string;
  actions?: React.ReactNode;
}>;

export const Modal = ({ open, onClose, title, actions, children }: ModalProps) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur">
      <div className="relative w-full max-w-3xl rounded-2xl bg-white p-6 shadow-2xl fade-in">
        <button
          className="absolute right-3 top-3 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600"
          onClick={onClose}
        >
          ✕
        </button>
        {title && <div className="mb-3 text-lg font-bold text-slate-900">{title}</div>}
        <div className="text-sm text-slate-700">{children}</div>
        {actions && <div className={clsx("mt-4 flex justify-end gap-2")}>{actions}</div>}
      </div>
    </div>
  );
};
