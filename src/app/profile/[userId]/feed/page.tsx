import Header from "@/components/common/Header";
import { ProfileFeedItem } from "@/components/profile/ProfileFeedItem";
import { mockArtworks } from "../../mockData";

export default function FeedInfoPage() {
  return (
    <>
      <Header title="피드" showBack />
      <div className="px-5 pt-5">
        <div className="grid grid-cols-2 gap-x-4 gap-y-6">
          {mockArtworks.map(artwork => (
            <ProfileFeedItem key={artwork.id} artwork={artwork} />
          ))}
        </div>
      </div>
    </>
  );
}
