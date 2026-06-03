import { Artwork } from "@/types/profile";
import { ExhibitionStatus } from "../common/ExhibitionStatus";

interface ProfileFeedItemProps {
  artwork: Artwork;
}

export const ProfileFeedItem = ({ artwork }: ProfileFeedItemProps) => {
  return (
    <div className="flex flex-col">
      <div className="mb-2 aspect-4/3 overflow-hidden rounded-lg">
        <img src={artwork.imageUrl} alt={artwork.title} className="h-full w-full object-cover" />
      </div>

      <ExhibitionStatus status={artwork.status} />

      <h3 className="text-body-1 text-text-primary truncate font-semibold">{artwork.title}</h3>

      <p className="text-label font-regular text-text-secondary">{artwork.type}</p>
    </div>
  );
};
