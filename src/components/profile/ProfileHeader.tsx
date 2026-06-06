import { ProfileHeaderProps } from "@/types/profile";
import { normalizeImageUrl } from "@/utils/normalizeImageUrl";
import Image from "next/image";

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ avatarUrl, role, name }) => {
  const displayAvatarUrl = normalizeImageUrl(avatarUrl);

  return (
    <div className="flex flex-col items-center pt-8">
      <div className="relative mb-4 flex h-20 w-20 items-center justify-center overflow-hidden rounded-full">
        {displayAvatarUrl ? (
          <Image
            src={displayAvatarUrl}
            alt="프로필 사진"
            fill
            sizes="80px"
            className="object-cover"
            unoptimized
          />
        ) : (
          <Image src="/default-profile.svg" alt="기본 이미지" width={80} height={80} />
        )}
      </div>

      {/* 뱃지 및 이름 */}
      {role && (
        <div className="bg-object-primary-light text-caption text-text-primary-brand mb-1.25 rounded px-1.5 py-1 font-medium">
          {role}
        </div>
      )}
      <div className="text-heading-1 text-text-primary font-semibold">{name}</div>
    </div>
  );
};
