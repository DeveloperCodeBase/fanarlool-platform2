import { PropsWithChildren, useEffect } from "react";
import clsx from "clsx";
import { X } from "lucide-react";
import { useAppContext } from "../../context/AppContext";

type DrawerProps = PropsWithChildren<{
  open: boolean;
  onClose: () => void;
  title?: string;
  side?: "left" | "right"; // Explicit side override, otherwise auto based on dir
  className?: string;
}>;

export const Drawer = ({ open, onClose, title, children, side, className }: DrawerProps) => {
  const { isRTL } = useAppContext();

  // Determine effective side: if LTR -> left, if RTL -> right (default behavior for drawers in most apps)
  // BUT user spec says: "slide from RIGHT in RTL and from LEFT in LTR".
  // So default is logical "start".

  const effectiveSide = side ?? (isRTL ? "right" : "left");

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleEsc);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEsc);
    };
  }, [open, onClose]);

  return (
    <div
      className={clsx(
        "fixed inset-0 z-50 overflow-hidden transition-colors",
        open ? "pointer-events-auto" : "pointer-events-none",
        className
      )}
    >
      {/* Backdrop */}
      <div
        className={clsx(
          "absolute inset-0 bg-slate-900/50 transition-opacity duration-300",
          open ? "opacity-100" : "opacity-0"
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        className={clsx(
          "absolute inset-y-0 flex h-full w-full max-w-[clamp(18rem,88vw,32rem)] bg-white shadow-2xl transition-transform duration-300 ease-out",
          effectiveSide === "right" ? "right-0" : "left-0",
          open ? "translate-x-0" : effectiveSide === "right" ? "translate-x-full" : "-translate-x-full"
        )}
        role="dialog"
        aria-modal="true"
        aria-hidden={!open}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
            <div className="text-base font-bold text-slate-900">{title}</div>
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100"
              aria-label="Close drawer"
            >
              <X size={20} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-4 py-4">{children}</div>
        </div>
      </div>
    </div>
  );
};
