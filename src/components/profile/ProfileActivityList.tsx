"use client";

import { Activity } from "@/types/profile";
import { ProfileActivityItem } from "./ProfileActivityItem";
import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { EmptyContent } from "@/components/common/EmptyContent";

interface ProfileActivityListProps {
  userId: number;
  activities: Activity[];
}

export const ProfileActivityList: React.FC<ProfileActivityListProps> = ({ userId, activities }) => {
  const router = useRouter();
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-heading-2 text-text-primary font-medium">활동 정보</h2>
        {activities.length > 4 && (
          <button
            onClick={() => router.push(`/profile/${userId}/activity`)}
            className="text-label text-text-secondary flex items-center gap-0.5 font-medium"
          >
            전체보기
            <ChevronRight size={16} />
          </button>
        )}
      </div>

      <div>
        {activities.length === 0 ? (
          <EmptyContent />
        ) : (
          <div>
            {activities.slice(0, 4).map(activity => (
              <ProfileActivityItem key={activity.id} activity={activity} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
