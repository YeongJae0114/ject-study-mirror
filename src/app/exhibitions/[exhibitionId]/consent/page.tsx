"use client";

import { Suspense, use, useEffect, useMemo, useRef, useState } from "react";

import { useRouter, useSearchParams } from "next/navigation";

import Header from "@/components/common/Header";
import AgreementContentSection from "@/components/exhibition-consent/AgreementContentSection";
import ExhibitionProgressInfoCard from "@/components/exhibition-consent/ExhibitionProgressInfoCard";
import SignatureSection from "@/components/exhibition-consent/SignatureSection";
import Toast from "@/components/mypage/Toast";
import { useExhibitionConsent, useSubmitExhibitionConsent } from "@/hooks/useExhibitionConsent";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import type { ConsentMode } from "@/types/exhibitionConsent";

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

function ConsentPageFallback() {
  return (
    <div className="bg-bg-primary min-h-dvh">
      <Header title="동의서 작성" showBack />
      <main className="mx-auto min-h-[calc(100dvh-60px)] w-full max-w-[430px] min-w-[320px]">
        <ConsentPageSkeleton />
      </main>
    </div>
  );
}

function ConsentPageContent({ params }: ConsentPageProps) {
  const { exhibitionId } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthReady, isAuthenticated } = useRequireAuth();
  const redirectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const id = Number(exhibitionId);
  const isValidId = Number.isFinite(id);
  const readonlyRequested = searchParams.get("mode") === "readonly";
  const { data, isLoading, error, refetch } = useExhibitionConsent(id, readonlyRequested);
  const submitMutation = useSubmitExhibitionConsent(id);
  const consentData = data;

  const [draft, setDraft] = useState<ConsentDraftState>({
    exhibitionId: id,
    checkedMap: {},
    signatureDataUrl: undefined,
  });
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("동의서 작성이 완료되었습니다.");

  const mode: ConsentMode = useMemo(() => {
    if (readonlyRequested || consentData?.mode === "READONLY" || consentData?.canSubmit === false)
      return "readonly";
    return "write";
  }, [consentData?.canSubmit, consentData?.mode, readonlyRequested]);

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

    submitMutation.mutate(
      { agreementIds, signatureDataUrl },
      {
        onSuccess: result => {
          setToastMessage(
            result.allConsentSubmitted
              ? "상호 동의서 작성이 완료되었습니다."
              : "동의서 작성이 완료되었습니다."
          );
          setToastOpen(true);
          redirectTimerRef.current = setTimeout(() => {
            router.push("/exhibitions/status");
          }, 900);
        },
      }
    );
  };

  const title = isReadOnly ? "동의서 확인" : "동의서 작성";
  const pageLoading = !isAuthReady || !isAuthenticated || (isAuthenticated && isLoading);

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
        {pageLoading && !consentData ? (
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

      <Toast open={toastOpen} message={toastMessage} />
    </div>
  );
}

export default function ConsentPage({ params }: ConsentPageProps) {
  return (
    <Suspense fallback={<ConsentPageFallback />}>
      <ConsentPageContent params={params} />
    </Suspense>
  );
}
