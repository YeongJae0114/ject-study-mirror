import { ProfileInfoProps } from "@/types/profile";

export const ProfileInfo: React.FC<ProfileInfoProps> = ({ bio, snsLink }) => {
  return (
    <div>
      <div className="text-heading-2 text-text-primary mb-4 font-medium">기본 정보</div>

      {/* 소개글 */}
      <div className="mb-6">
        <div className="text-body-2 text-text-secondary mb-1 font-semibold">소개 글</div>
        <div className="text-body-2 font-regular text-text-primary leading-relaxed whitespace-pre-line">
          {bio}
        </div>
      </div>

      {/* SNS 링크 */}
      <div>
        <div className="text-body-2 text-text-secondary mb-1 font-semibold">SNS 링크</div>
        <a
          href={snsLink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-text-primary-brand text-body-2 font-regular cursor-pointer break-all"
        >
          {snsLink}
        </a>
      </div>
    </div>
  );
};
