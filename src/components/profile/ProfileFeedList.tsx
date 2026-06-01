import { ChevronRight } from "lucide-react";
import { ProfileFeedItem } from "./ProfileFeedItem";
import { Artwork } from "@/types/profile";

interface ProfileFeedProps {
  artworks: Artwork[];
}

export const ProfileFeedList: React.FC<ProfileFeedProps> = ({ artworks }) => {
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-heading-2 text-text-primary font-medium">피드</h2>
        <button className="text-label text-text-secondary flex items-center gap-0.5 font-medium">
          전체보기
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-6">
        {artworks.map(artwork => (
          <ProfileFeedItem key={artwork.id} artwork={artwork} />
        ))}
      </div>
    </div>
  );
};
