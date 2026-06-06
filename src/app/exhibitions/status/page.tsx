"use client";

import { Suspense } from "react";

import { useSearchParams } from "next/navigation";

import Header from "@/components/common/Header";
import ExhibitionStatusList from "@/components/exhibition-status/ExhibitionStatusList";
import StatusFilterTabs from "@/components/exhibition-status/StatusFilterTabs";
import { useExhibitions } from "@/hooks/useExhibitions";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import type { ExhibitionStatusFilter, ExhibitionStatusFilterParam } from "@/types/exhibition";

const FILTER_PARAM_TO_API: Record<ExhibitionStatusFilterParam, ExhibitionStatusFilter> = {
  "consent-writing": "CONSENT_WRITING",
  confirmed: "CONFIRMED",
  canceled: "CANCELED",
};

function getFilterParam(value: string | null): ExhibitionStatusFilterParam {
  if (value === "confirmed" || value === "canceled" || value === "consent-writing") {
    return value;
  }
  return "consent-writing";
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "전시 현황을 불러오지 못했습니다.";
}

function ExhibitionStatusContent() {
  const searchParams = useSearchParams();
  const { isAuthReady, isAuthenticated } = useRequireAuth();

  const activeFilter = getFilterParam(searchParams.get("filter"));
  const query = useExhibitions(FILTER_PARAM_TO_API[activeFilter]);
  const exhibitions = query.data?.items ?? [];
  const isLoading = !isAuthReady || (isAuthenticated && query.isLoading);
  const errorMessage = query.error ? getErrorMessage(query.error) : null;

  return (
    <main className="mx-auto min-h-[calc(100dvh-60px)] w-full max-w-97.5 min-w-[320px]">
      <StatusFilterTabs activeFilter={activeFilter} />
      <ExhibitionStatusList
        exhibitions={exhibitions}
        isLoading={isLoading}
        errorMessage={isAuthenticated ? errorMessage : null}
        onRetry={() => void query.refetch()}
      />
    </main>
  );
}

function ExhibitionStatusFallback() {
  return (
    <main className="mx-auto min-h-[calc(100dvh-60px)] w-full max-w-97.5 min-w-[320px]">
      <ExhibitionStatusList
        exhibitions={[]}
        isLoading
        errorMessage={null}
        onRetry={() => undefined}
      />
    </main>
  );
}

export default function ExhibitionStatusPage() {
  return (
    <div className="bg-bg-primary min-h-dvh">
      <Header title="전시 현황" showBorder={false} />
      <Suspense fallback={<ExhibitionStatusFallback />}>
        <ExhibitionStatusContent />
      </Suspense>
    </div>
  );
}
