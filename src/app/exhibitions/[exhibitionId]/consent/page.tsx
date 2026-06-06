"use client";

import { use, useEffect, useMemo, useRef, useState } from "react";

import { useRouter, useSearchParams } from "next/navigation";

import Header from "@/components/common/Header";
import AgreementContentSection from "@/components/exhibition-consent/AgreementContentSection";
import ExhibitionProgressInfoCard from "@/components/exhibition-consent/ExhibitionProgressInfoCard";
import SignatureSection from "@/components/exhibition-consent/SignatureSection";
import Toast from "@/components/mypage/Toast";
import { useExhibitionConsent, useSubmitExhibitionConsent } from "@/hooks/useExhibitionConsent";
import { useSession } from "@/services/session";
import type { ConsentMode, ExhibitionConsent } from "@/types/exhibitionConsent";

interface ConsentPageProps {
  params: Promise<{ exhibitionId: string }>;
}

interface ConsentDraftState {
  exhibitionId: number;
  checkedMap: Record<string, boolean>;
  signatureDataUrl: string | null | undefined;
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "요청 처리 중 오류가 발생했습니다.";
}

function getPreviewSignatureDataUrl() {
  return (
    "data:image/svg+xml;charset=UTF-8," +
    encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" width="320" height="152" viewBox="0 0 320 152"><path d="M86 91c22-41 37 39 61-3 17-30 27 25 47-1 12-15 27 1 38 18" fill="none" stroke="#1A1A1E" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>'
    )
  );
}

function createPreviewConsent(exhibitionId: number, readOnly: boolean): ExhibitionConsent {
  return {
    exhibitionId,
    mode: readOnly ? "READONLY" : "WRITE",
    canSubmit: !readOnly,
    exhibition: {
      title: "작성된 전시 이름",
      startDate: "2026-06-20",
      endDate: "2026-06-30",
      spaceName: "전시 공간 이름",
      spaceAddress: "공간 도로명 주소",
      spaceOwnerNickname: "공간 파트너 닉네임",
      spaceOwnerProfileImageUrl: null,
      spaceThumbnailUrl: null,
      creatorNickname: "크리에이터 닉네임",
      creatorProfileImageUrl: null,
      artworkTitle: "전시 작품 이름",
      artworkType: "작품 유형",
      artworkThumbnailUrl: null,
    },
    agreements: [
      {
        id: "progress_terms",
        title: "전시 진행 약관",
        required: true,
        content:
          "제1조 (목적)\n본 약관은 리핏 플랫폼을 통해 크리에이터와 공간 파트너가 전시 진행 및 공간 이용에 관한 제반 사항을 규정함을 목적으로 합니다.\n\n제2조 (전시 위탁)\n전시 기간 동안 작품 설치, 관리, 철수 일정은 양 당사자가 합의한 내용을 기준으로 진행합니다.",
        checked: readOnly,
      },
      {
        id: "notice",
        title: "전시 주의사항",
        required: true,
        content:
          "원활한 전시 진행을 위해 공간 파트너와 크리에이터가 작성한 안내사항을 확인해주세요.\n\n[공간 파트너가 작성한 내용입니다.]\n\n[크리에이터가 작성한 내용입니다.]",
        checked: readOnly,
      },
    ],
    signature: {
      signed: readOnly,
      signedAt: readOnly ? "2026-06-03T12:00:00Z" : null,
      imageUrl: readOnly ? getPreviewSignatureDataUrl() : null,
    },
  };
}

function ConsentPageSkeleton() {
  return (
    <div className="px-4 pt-5">
      <div className="bg-object-disabled h-6 w-32 rounded" />
      <div className="bg-bg-primary-darker mt-4 h-80 rounded-lg" />
      <div className="bg-object-disabled mt-8 h-6 w-28 rounded" />
      <div className="bg-bg-primary-darker mt-4 h-24 rounded-lg" />
      <div className="bg-bg-primary-darker mt-4 h-24 rounded-lg" />
      <div className="bg-object-disabled mt-8 h-6 w-32 rounded" />
      <div className="bg-bg-primary-darker mt-4 h-[152px] rounded-lg" />
    </div>
  );
}

export default function ConsentPage({ params }: ConsentPageProps) {
  const { exhibitionId } = use(params);
  const searchParams = useSearchParams();
  const router = useRouter();
  const { accessToken } = useSession();
  const redirectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const id = Number(exhibitionId);
  const isValidId = Number.isFinite(id);
  const requestedReadOnly = searchParams.get("mode") === "readonly";
  const isPreviewMode = process.env.NODE_ENV === "development" && !accessToken && isValidId;

  const { data, isLoading, error, refetch } = useExhibitionConsent(id);
  const submitMutation = useSubmitExhibitionConsent(id);
  const previewData = useMemo(
    () => (isPreviewMode ? createPreviewConsent(id, requestedReadOnly) : null),
    [id, isPreviewMode, requestedReadOnly]
  );
  const consentData = data ?? previewData;

  const [draft, setDraft] = useState<ConsentDraftState>({
    exhibitionId: id,
    checkedMap: {},
    signatureDataUrl: undefined,
  });
  const [toastOpen, setToastOpen] = useState(false);

  const mode: ConsentMode = useMemo(() => {
    if (requestedReadOnly) return "readonly";
    if (consentData?.mode === "READONLY" || consentData?.canSubmit === false) return "readonly";
    return "write";
  }, [consentData?.canSubmit, consentData?.mode, requestedReadOnly]);

  const isReadOnly = mode === "readonly";

  useEffect(() => {
    return () => {
      if (redirectTimerRef.current) clearTimeout(redirectTimerRef.current);
    };
  }, []);

  const serverCheckedMap = useMemo(
    () =>
      Object.fromEntries(
        consentData?.agreements.map(agreement => [agreement.id, agreement.checked]) ?? []
      ),
    [consentData?.agreements]
  );

  const activeDraft = draft.exhibitionId === id ? draft : null;

  const checkedMap = useMemo(
    () => ({
      ...serverCheckedMap,
      ...(activeDraft?.checkedMap ?? {}),
    }),
    [activeDraft?.checkedMap, serverCheckedMap]
  );

  const signatureDataUrl = isReadOnly
    ? (consentData?.signature.imageUrl ?? null)
    : activeDraft?.signatureDataUrl === undefined
      ? null
      : activeDraft.signatureDataUrl;

  const requiredAgreements = useMemo(
    () => consentData?.agreements.filter(agreement => agreement.required) ?? [],
    [consentData?.agreements]
  );

  const allRequiredAgreementsChecked =
    requiredAgreements.length > 0 &&
    requiredAgreements.every(agreement => checkedMap[agreement.id]);

  const canSubmit =
    !isReadOnly &&
    allRequiredAgreementsChecked &&
    Boolean(signatureDataUrl) &&
    !submitMutation.isPending;

  const handleCheckedChange = (agreementId: string, checked: boolean) => {
    if (isReadOnly) return;

    setDraft(prev => ({
      exhibitionId: id,
      checkedMap: {
        ...(prev.exhibitionId === id ? prev.checkedMap : {}),
        [agreementId]: checked,
      },
      signatureDataUrl: prev.exhibitionId === id ? prev.signatureDataUrl : undefined,
    }));
  };

  const handleSignatureChange = (value: string | null) => {
    if (isReadOnly) return;

    setDraft(prev => ({
      exhibitionId: id,
      checkedMap: prev.exhibitionId === id ? prev.checkedMap : {},
      signatureDataUrl: value,
    }));
  };

  const handleSubmit = () => {
    if (!consentData || !signatureDataUrl || !canSubmit) return;

    const agreementIds = consentData.agreements
      .filter(agreement => checkedMap[agreement.id])
      .map(agreement => agreement.id);

    if (isPreviewMode) {
      setToastOpen(true);
      return;
    }

    submitMutation.mutate(
      { agreementIds, signatureDataUrl },
      {
        onSuccess: () => {
          setToastOpen(true);
          redirectTimerRef.current = setTimeout(() => {
            router.push("/exhibitions/status");
          }, 900);
        },
      }
    );
  };

  const title = isReadOnly ? "동의서 확인" : "동의서 작성";

  if (!isValidId) {
    return (
      <div className="bg-bg-primary min-h-dvh">
        <Header title="동의서 작성" showBack />
        <main className="px-4 py-10">
          <p role="alert" className="text-body-1 text-error-default">
            전시 정보를 찾을 수 없습니다.
          </p>
        </main>
      </div>
    );
  }

  return (
    <div className="bg-bg-primary min-h-dvh">
      <Header title={title} showBack />

      <main className="mx-auto min-h-[calc(100dvh-60px)] w-full max-w-[430px] min-w-[320px]">
        {isLoading && !consentData ? (
          <ConsentPageSkeleton />
        ) : error && !consentData ? (
          <section className="flex min-h-[calc(100dvh-120px)] flex-col items-center justify-center px-4 text-center">
            <p role="alert" className="text-body-1 text-error-default">
              {getErrorMessage(error)}
            </p>
            <button
              type="button"
              onClick={() => void refetch()}
              className="border-border-primary text-body-1 text-text-primary mt-5 h-11 rounded-lg border px-5 font-medium"
            >
              다시 불러오기
            </button>
          </section>
        ) : consentData ? (
          <>
            <ExhibitionProgressInfoCard exhibition={consentData.exhibition} />
            <AgreementContentSection
              agreements={consentData.agreements}
              checkedMap={checkedMap}
              readOnly={isReadOnly}
              onCheckedChange={handleCheckedChange}
            />
            <SignatureSection
              mode={mode}
              signatureDataUrl={signatureDataUrl}
              signedAt={consentData.signature.signedAt}
              onSignatureChange={handleSignatureChange}
            />

            {submitMutation.error && (
              <div
                role="alert"
                className="bg-error-light text-body-2 text-error-default fixed right-4 bottom-24 left-4 z-40 mx-auto max-w-[398px] rounded-lg px-4 py-3"
              >
                {getErrorMessage(submitMutation.error)}
              </div>
            )}

            {!isReadOnly && (
              <footer className="border-border-primary bg-bg-primary fixed right-0 bottom-0 left-0 mx-auto w-full max-w-[430px] min-w-[320px] border-t px-4 py-4">
                <button
                  type="button"
                  disabled={!canSubmit}
                  onClick={handleSubmit}
                  className="bg-object-primary hover:bg-object-primary-hover active:bg-object-primary-pressed text-body-1 text-text-invert disabled:bg-object-disabled disabled:text-text-disabled h-12 w-full rounded-lg font-semibold transition-colors disabled:cursor-not-allowed"
                >
                  {submitMutation.isPending ? "처리 중" : "동의 완료"}
                </button>
              </footer>
            )}
          </>
        ) : (
          <section className="flex min-h-[calc(100dvh-120px)] items-center justify-center px-4 text-center">
            <p className="text-body-1 text-text-secondary">동의서 정보가 없습니다.</p>
          </section>
        )}
      </main>

      <Toast open={toastOpen} message="동의서 작성이 완료되었습니다." />
    </div>
  );
}
