import { ProfileInfoProps } from "@/types/profile";
import { EmptyContent } from "@/components/common/EmptyContent";

export const ProfileInfo = ({ bio, snsLink }: ProfileInfoProps) => {
  const hasBio = Boolean(bio?.trim());
  const displaySnsLink = snsLink?.trim();
  const hasSnsLink = Boolean(displaySnsLink);

  return (
    <div>
      <div className="text-heading-2 text-text-primary mb-4 font-medium">기본 정보</div>

      {!hasBio && !hasSnsLink ? (
        <EmptyContent />
      ) : (
        <>
          {hasBio && (
            <div className="mb-6">
              <div className="text-body-2 text-text-secondary mb-1 font-semibold">소개 글</div>

              <div className="text-body-2 font-regular text-text-primary leading-relaxed whitespace-pre-line">
                {bio}
              </div>
            </div>
          )}

          {hasSnsLink && (
            <div>
              <div className="text-body-2 text-text-secondary mb-1 font-semibold">SNS 링크</div>

              <a
                href={displaySnsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-primary-brand text-body-2 font-regular cursor-pointer break-all"
              >
                {displaySnsLink}
              </a>
            </div>
          )}
        </>
      )}
    </div>
  );
};
