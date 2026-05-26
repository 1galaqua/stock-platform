import { DashboardSkeleton } from "@/components/ui/Skeleton";

export default function GlobalLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 space-y-3">
        <div className="h-6 w-28 animate-pulse rounded-full bg-surface-hover" />
        <div className="h-10 w-full max-w-lg animate-pulse rounded-lg bg-surface-hover" />
        <div className="h-4 w-full max-w-2xl animate-pulse rounded bg-surface-hover" />
      </div>
      <div className="mb-6 h-24 animate-pulse rounded-xl bg-surface-hover" />
      <DashboardSkeleton count={6} />
    </div>
  );
}
