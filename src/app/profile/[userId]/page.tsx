import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileInfo } from "@/components/profile/ProfileInfo";
import { ProfileFeedList } from "@/components/profile/ProfileFeedList";
import { ProfileActivityList } from "@/components/profile/ProfileActivityList";
import Header from "@/components/common/Header";
import { mockActivities, mockArtworks, userProfile } from "../mockData";

// 크리에이터, 공간주 프로필 형식은 똑같음
export default function CreatorProfilePage() {
  return (
    <>
      <Header title="프로필" showBack />
      <div>
        <ProfileHeader name={userProfile.name} role={userProfile.role} />
        <div className="bg-bg-primary-darker my-6 h-1"></div>
        <div className="mb-9 flex flex-col gap-11 px-5">
          <ProfileInfo bio={userProfile.bio} snsLink={userProfile.snsLink} />
          <ProfileFeedList userId={userProfile.id} artworks={mockArtworks} />
          <ProfileActivityList userId={userProfile.id} activities={mockActivities} />
        </div>
      </div>
    </>
  );
}
