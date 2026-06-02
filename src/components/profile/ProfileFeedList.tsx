"use client";

import { ChevronRight } from "lucide-react";
import { ProfileFeedItem } from "./ProfileFeedItem";
import { Artwork } from "@/types/profile";
import { useRouter } from "next/navigation";
import { EmptyContent } from "@/components/common/EmptyContent";

interface ProfileFeedProps {
  userId: number;
  artworks: Artwork[];
}
export const ProfileFeedList: React.FC<ProfileFeedProps> = ({ userId, artworks }) => {
  const router = useRouter();

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-heading-2 text-text-primary font-medium">피드</h2>
        {artworks.length > 4 && (
          <button
            onClick={() => router.push(`/profile/${userId}/feed`)}
            className="text-label text-text-secondary flex items-center gap-0.5 font-medium"
          >
            전체보기
            <ChevronRight size={16} />
          </button>
        )}
      </div>

      {artworks.length === 0 ? (
        <EmptyContent />
      ) : (
        <div className="grid grid-cols-2 gap-x-4 gap-y-6">
          {artworks.slice(0, 4).map(artwork => (
            <ProfileFeedItem key={artwork.id} artwork={artwork} />
          ))}
        </div>
      )}
    </div>
  );
};
