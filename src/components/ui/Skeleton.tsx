import clsx from "clsx";

type SkeletonProps = {
  className?: string;
};

export const Skeleton = ({ className }: SkeletonProps) => (
  <div
    className={clsx(
      "animate-pulse rounded-lg bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100",
      className
    )}
  />
);
