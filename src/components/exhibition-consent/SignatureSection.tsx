"use client";

import { RefreshCw } from "lucide-react";

import SignaturePad from "@/components/exhibition-consent/SignaturePad";
import type { ConsentMode } from "@/types/exhibitionConsent";
import { normalizeImageUrl } from "@/utils/normalizeImageUrl";

interface SignatureSectionProps {
  mode: ConsentMode;
  signatureDataUrl: string | null;
  signedAt?: string | null;
  onSignatureChange?: (value: string | null) => void;
}

function formatSignatureDate(value?: string | null) {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value.slice(0, 10).replaceAll("-", ".");

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}.${month}.${day}`;
}

function formatTodayDate() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}.${month}.${day}`;
}

export default function SignatureSection({
  mode,
  signatureDataUrl,
  signedAt,
  onSignatureChange,
}: SignatureSectionProps) {
  const isReadOnly = mode === "readonly";
  const displayDate = isReadOnly ? formatSignatureDate(signedAt) : formatTodayDate();
  const displaySignatureUrl = normalizeImageUrl(signatureDataUrl);

  const handleClear = () => {
    onSignatureChange?.(null);
  };

  return (
    <section className="mt-7 px-4 pb-28">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-headline-1 text-text-primary font-semibold">
          서명하기 <span className="text-text-primary-brand">(필수)</span>
        </h2>

        {!isReadOnly && signatureDataUrl && (
          <button
            type="button"
            onClick={handleClear}
            className="text-text-secondary hover:text-text-primary flex h-8 w-8 items-center justify-center rounded-full transition-colors"
            aria-label="서명 초기화"
          >
            <RefreshCw size={18} />
          </button>
        )}
      </div>

      {isReadOnly ? (
        <div className="bg-bg-primary-darker border-border-primary flex h-[152px] items-center justify-center overflow-hidden rounded-lg border">
          {displaySignatureUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={displaySignatureUrl}
              alt="저장된 서명"
              aria-label="저장된 서명"
              className="h-full w-full object-contain"
            />
          ) : (
            <p className="text-body-2 text-text-secondary">저장된 서명이 없습니다.</p>
          )}
        </div>
      ) : (
        <SignaturePad value={signatureDataUrl} onChange={onSignatureChange} />
      )}

      <div className="text-label text-text-primary mt-3 text-right">
        {displayDate || "YYYY.MM.DD"}
      </div>
    </section>
  );
}
