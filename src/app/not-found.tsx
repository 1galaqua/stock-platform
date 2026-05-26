import { ROUTES } from "@/lib/config";
import { getServerI18n } from "@/lib/i18n/server";
import { EmptyState } from "@/components/ui/EmptyState";

export default async function NotFound() {
  const { t } = await getServerI18n();

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-7xl items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
      <EmptyState
        title={t("notFound.title")}
        description={t("notFound.description")}
        actionLabel={t("notFound.action")}
        actionHref={ROUTES.home}
      />
    </div>
  );
}
