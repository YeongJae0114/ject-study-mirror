import { Images } from "lucide-react";
import Image from "next/image";

import { Activity } from "@/types/profile";
import { normalizeImageUrl } from "@/utils/normalizeImageUrl";

interface ProfileActivityItemProps {
  activity: Activity;
}

export const ProfileActivityItem = ({ activity }: ProfileActivityItemProps) => {
  const imageUrl = normalizeImageUrl(activity.imageUrl);

  return (
    <div className="border-border-primary flex items-center gap-4 border-b py-4 last:border-b-0">
      <div className="bg-bg-primary-darker text-text-disabled relative flex h-18.5 w-18.5 shrink-0 items-center justify-center overflow-hidden rounded-lg">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={activity.title}
            fill
            unoptimized
            className="object-cover"
            sizes="74px"
          />
        ) : (
          <Images size={24} />
        )}
      </div>
      <div className="flex min-w-0 flex-col justify-center gap-1">
        <h3 className="text-body-1 text-text-primary font-medium">{activity.title}</h3>
        <p className="text-body-2 text-text-secondary font-medium">{activity.period}</p>
        <p className="text-body-2 text-text-secondary truncate font-medium">{activity.location}</p>
      </div>
    </div>
  );
};
