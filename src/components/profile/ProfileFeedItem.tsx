import { Artwork } from "@/types/profile";

interface ProfileFeedItemProps {
  artwork: Artwork;
}

export const ProfileFeedItem = ({ artwork }: ProfileFeedItemProps) => {
  const statusStyles = {
    "전시 중": "bg-object-primary-light text-text-primary-brand",
    "전시 가능": "bg-object-primary text-text-invert",
    "전시 예정": "bg-object-tertiary-light text-text-tertiary",
  };

  return (
    <div className="flex flex-col">
      <div className="mb-2 aspect-4/3 overflow-hidden rounded-lg">
        <img src={artwork.imageUrl} alt={artwork.title} className="h-full w-full object-cover" />
      </div>

      <span
        className={`inline-self-start text-caption mb-1 w-fit rounded px-1.5 py-0.5 font-medium ${
          statusStyles[artwork.status]
        }`}
      >
        {artwork.status}
      </span>

      <h3 className="text-body-1 text-text-primary truncate font-semibold">{artwork.title}</h3>

      <p className="text-label font-regular text-text-secondary">{artwork.type}</p>
    </div>
  );
};
