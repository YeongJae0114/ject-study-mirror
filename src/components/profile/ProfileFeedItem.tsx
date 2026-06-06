import { Images } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { ExhibitionStatus } from "@/components/common/ExhibitionStatus";
import { ProfileFeedItem as ProfileFeedItemType } from "@/types/profile";
import { normalizeImageUrl } from "@/utils/normalizeImageUrl";

interface ProfileFeedItemProps {
  item: ProfileFeedItemType;
}

const STATUS_LABEL = {
  AVAILABLE: "전시 가능",
  SCHEDULED: "전시 예정",
  ONGOING: "전시 중",
} as const;

export const ProfileFeedItem = ({ item }: ProfileFeedItemProps) => {
  const imageUrl = normalizeImageUrl(item.thumbnailUrl);
  const subtitle = item.targetType === "SPACE" ? item.address || item.type : item.type;

  return (
    <Link href={item.href} className="flex min-w-0 flex-col">
      <div className="bg-bg-primary-darker text-text-disabled relative mb-2 flex aspect-4/3 items-center justify-center overflow-hidden rounded-lg">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={item.title}
            fill
            unoptimized
            className="object-cover"
            sizes="50vw"
          />
        ) : (
          <Images size={28} />
        )}
      </div>

      <ExhibitionStatus status={STATUS_LABEL[item.status]} />
      <h3 className="text-body-1 text-text-primary truncate font-semibold">{item.title}</h3>

      {subtitle && (
        <p className="text-label font-regular text-text-secondary truncate">{subtitle}</p>
      )}
    </Link>
  );
};
