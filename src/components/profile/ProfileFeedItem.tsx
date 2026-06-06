import { Artwork } from "@/types/profile";
import { ExhibitionStatus } from "../common/ExhibitionStatus";
import { normalizeImageUrl } from "@/utils/normalizeImageUrl";

interface ProfileFeedItemProps {
  artwork: Artwork;
}

export const ProfileFeedItem = ({ artwork }: ProfileFeedItemProps) => {
  const imageUrl = normalizeImageUrl(artwork.imageUrl);

  return (
    <div className="flex flex-col">
      <div className="mb-2 aspect-4/3 overflow-hidden rounded-lg">
        {imageUrl ? (
          <img src={imageUrl} alt={artwork.title} className="h-full w-full object-cover" />
        ) : null}
      </div>

      <ExhibitionStatus status={artwork.status} />

      <h3 className="text-body-1 text-text-primary truncate font-semibold">{artwork.title}</h3>

      <p className="text-label font-regular text-text-secondary">{artwork.type}</p>
    </div>
  );
};
