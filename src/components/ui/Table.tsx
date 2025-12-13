import clsx from "clsx";
import { PropsWithChildren, ReactNode } from "react";

type TableProps = PropsWithChildren<{
  headers: ReactNode[];
  className?: string;
}>;

export const Table = ({ headers, className, children }: TableProps) => (
  <div className={clsx("overflow-x-auto rounded-2xl border border-white/70 bg-white/80 shadow-soft", className)}>
    <table className="min-w-full divide-y divide-slate-100 text-sm">
      <thead className="bg-slate-50/70 text-slate-600">
        <tr>
          {headers.map((h, idx) => (
            <th key={idx} className="px-4 py-3 text-start font-semibold">
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100">{children}</tbody>
    </table>
  </div>
);
