import Link from "next/link";
import { ROUTES } from "@/lib/config";
import { EmptyState } from "@/components/ui/EmptyState";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-7xl items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
      <EmptyState
        title="Page not found"
        description="The page you are looking for does not exist or may have moved."
        actionLabel="Back to home"
        actionHref={ROUTES.home}
      />
    </div>
  );
}
