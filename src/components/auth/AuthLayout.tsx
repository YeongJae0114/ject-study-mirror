import React from 'react';
import Image from 'next/image';

interface AuthLayoutProps {
  title: string;
  description?: string;
  showBackButton?: boolean;
  onBack?: () => void;
  showCloseButton?: boolean;
  onClose?: () => void;
  showLogo?: boolean;
  background?: 'primary' | 'primary-darker';
  variant?: 'brand' | 'form';
  children: React.ReactNode;
}

export default function AuthLayout({
  title,
  description,
  showBackButton = false,
  onBack,
  showCloseButton = false,
  onClose,
  showLogo = false,
  background = 'primary',
  variant = 'form',
  children,
}: AuthLayoutProps) {
  const isBrandLayout = variant === 'brand';
  const backgroundClass = 
    background === 'primary-darker' ? 'bg-bg-primary-darker' : 'bg-bg-primary';

  return (
    <div
      className={
        isBrandLayout
          ? `relative flex min-h-dvh items-center justify-center ${backgroundClass} px-5`
          : `relative min-h-dvh ${backgroundClass} px-5`
      }
    >
      {showCloseButton && (
        <button
          onClick={onClose}
          className="absolute right-5 top-12 p-2 text-text-primary"
          type="button"
          aria-label="닫기"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M18 6L6 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M6 6L18 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      )}

      <div className="mx-auto w-full max-w-97.5">
        {showBackButton && (
        <button
            onClick={onBack}
            className="mt-12 p-0 text-text-primary"
            type="button"
            aria-label="뒤로가기"
        >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
                d="M19 12H5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
            />
            <path
                d="M12 5L5 12L12 19"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            </svg>
        </button>
        )}

        {isBrandLayout ? (
          <div className="flex flex-col items-center gap-[clamp(80px,14vh,124px)]">
            <div className="flex flex-col items-center">
              {showLogo ? (
                <Image
                  src="/refit-logo.svg"
                  alt={title}
                  width={194}
                  height={100}
                  className="mb-2"
                  priority
                />
              ) : (
                <h1 className="mb-2 font-alata text-display-1 font-medium text-text-primary-brand">
                  {title}
                </h1>
              )}

              {description && (
                <p className="text-heading-2 font-medium text-text-primary-brand">
                  {description}
                </p>
              )}
            </div>

            {children}
          </div>
        ) : (
          <div className="pt-8">
            <div className="mb-18">
              <h1 className="text-heading-1 font-semibold text-text-primary">
                {title}
              </h1>

              {description && (
                <p className="mt-1 whitespace-pre-line text-body-2 font-medium text-text-secondary">
                  {description}
                </p>
              )}
            </div>

            {children}
          </div>
        )}
      </div>
    </div>
  );
}