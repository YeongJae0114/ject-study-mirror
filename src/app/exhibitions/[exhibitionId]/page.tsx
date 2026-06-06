"use client";

import { use, useEffect, useRef, useState } from "react";

import { useRouter } from "next/navigation";

import Header from "@/components/common/Header";
import CancelExhibitionDialog from "@/components/exhibition-status/CancelExhibitionDialog";
import ExhibitionDetailSummary from "@/components/exhibition-status/ExhibitionDetailSummary";
import ExhibitionInfoSection, {
  InfoRow,
} from "@/components/exhibition-status/ExhibitionInfoSection";
import StickyActionBar from "@/components/exhibition-status/StickyActionBar";
import Toast from "@/components/mypage/Toast";
import { useCancelExhibition, useExhibitionDetail } from "@/hooks/useExhibitions";
import { useRequireAuth } from "@/hooks/useRequireAuth";

interface ExhibitionDetailPageProps {
  params: Promise<{ exhibitionId: string }>;
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "요청 처리 중 오류가 발생했습니다.";
}

function DetailSkeleton() {
  return (
    <div className="px-5 py-5">
      <div className="bg-bg-primary-darker aspect-4/3 w-full rounded-lg" />
      <div className="bg-object-disabled mt-5 h-5 w-24 rounded" />
      <div className="bg-bg-primary-darker mt-3 h-8 w-3/4 rounded" />
      <div className="bg-bg-primary-darker mt-6 h-5 w-full rounded" />
      <div className="bg-bg-primary-darker mt-2 h-5 w-2/3 rounded" />
      <div className="bg-bg-primary-darker mt-10 h-32 rounded-lg" />
      <div className="bg-bg-primary-darker mt-4 h-32 rounded-lg" />
    </div>
  );
}

export default function ExhibitionDetailPage({ params }: ExhibitionDetailPageProps) {
  const { exhibitionId } = use(params);
  const id = Number(exhibitionId);
  const isValidId = Number.isFinite(id);
  const router = useRouter();
  const redirectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { isAuthReady, isAuthenticated } = useRequireAuth();

  const query = useExhibitionDetail(id);
  const cancelMutation = useCancelExhibition(id);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [toastOpen, setToastOpen] = useState(false);

  useEffect(() => {
    return () => {
      if (redirectTimerRef.current) clearTimeout(redirectTimerRef.current);
    };
  }, []);

  if (!isValidId) {
    return (
      <div className="bg-bg-primary min-h-dvh">
        <Header title="전시 상세" showBack />
        <main className="px-5 py-10">
          <p role="alert" className="text-body-1 text-error-default">
            전시 정보를 찾을 수 없습니다.
          </p>
        </main>
      </div>
    );
  }

  const exhibition = query.data;
  const isLoading = !isAuthReady || (isAuthenticated && query.isLoading);
  const detailErrorMessage = query.error ? getErrorMessage(query.error) : null;
  const cancelErrorMessage = cancelMutation.error ? getErrorMessage(cancelMutation.error) : null;

  const primaryLabel = exhibition?.actions.canWriteConsent
    ? "동의서 작성"
    : exhibition?.actions.canViewConsent
      ? "동의서 확인"
      : undefined;

  const handlePrimaryAction = () => {
    if (!exhibition) return;

    const modeQuery =
      exhibition.actions.canViewConsent && !exhibition.actions.canWriteConsent
        ? "?mode=readonly"
        : "";
    router.push(`/exhibitions/${id}/consent${modeQuery}`);
  };

  const handleCancel = () => {
    const reason = cancelReason.trim();
    if (!reason) return;

    cancelMutation.mutate(
      { reason },
      {
        onSuccess: () => {
          setCancelDialogOpen(false);
          setToastOpen(true);
          redirectTimerRef.current = setTimeout(() => {
            router.replace("/exhibitions/status?filter=canceled");
          }, 800);
        },
      }
    );
  };

  return (
    <div className="bg-bg-primary min-h-dvh">
      <Header title="전시 상세" showBack />

      <main className="mx-auto min-h-[calc(100dvh-60px)] w-full max-w-97.5 min-w-[320px] pb-24">
        {isLoading ? (
          <DetailSkeleton />
        ) : detailErrorMessage ? (
          <section className="flex min-h-[calc(100dvh-120px)] flex-col items-center justify-center px-5 text-center">
            <p role="alert" className="text-body-1 text-error-default">
              {detailErrorMessage}
            </p>
            <button
              type="button"
              onClick={() => void query.refetch()}
              className="border-border-primary text-body-1 text-text-primary mt-5 h-11 rounded-lg border px-5 font-medium"
            >
              다시 불러오기
            </button>
          </section>
        ) : exhibition ? (
          <>
            <ExhibitionDetailSummary exhibition={exhibition} />

            <ExhibitionInfoSection title="공간 정보">
              <InfoRow label="공간명">{exhibition.space.name}</InfoRow>
              <InfoRow label="주소">{exhibition.space.address}</InfoRow>
              <InfoRow label="파트너">{exhibition.space.ownerNickname}</InfoRow>
            </ExhibitionInfoSection>

            <ExhibitionInfoSection title="작품 정보">
              <InfoRow label="작품명">{exhibition.artwork.title}</InfoRow>
              <InfoRow label="유형">{exhibition.artwork.type}</InfoRow>
              <InfoRow label="크리에이터">{exhibition.creator.nickname}</InfoRow>
            </ExhibitionInfoSection>

            {exhibition.cancelReason && (
              <ExhibitionInfoSection title="취소 정보">
                <InfoRow label="취소 사유">{exhibition.cancelReason}</InfoRow>
              </ExhibitionInfoSection>
            )}
          </>
        ) : (
          <section className="flex min-h-[calc(100dvh-120px)] items-center justify-center px-5 text-center">
            <p className="text-body-1 text-text-secondary">전시 정보가 없습니다.</p>
          </section>
        )}
      </main>

      {exhibition && (
        <StickyActionBar
          primaryLabel={primaryLabel}
          secondaryLabel={exhibition.actions.canCancel ? "전시 취소" : undefined}
          primaryDisabled={cancelMutation.isPending}
          secondaryDisabled={cancelMutation.isPending}
          onPrimaryClick={handlePrimaryAction}
          onSecondaryClick={() => setCancelDialogOpen(true)}
        />
      )}

      <CancelExhibitionDialog
        open={cancelDialogOpen}
        reason={cancelReason}
        errorMessage={cancelErrorMessage}
        isSubmitting={cancelMutation.isPending}
        onReasonChange={setCancelReason}
        onClose={() => setCancelDialogOpen(false)}
        onConfirm={handleCancel}
      />
      <Toast open={toastOpen} message="전시가 취소되었습니다." />
    </div>
  );
}
