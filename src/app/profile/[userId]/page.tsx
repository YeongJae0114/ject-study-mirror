import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileInfo } from "@/components/profile/ProfileInfo";
import { ProfileFeedList } from "@/components/profile/ProfileFeedList";
import { ProfileActivityList } from "@/components/profile/ProfileActivityList";
import Header from "@/components/common/Header";

export default function CreatorProfilePage() {
  // 프로필 이미지도 함께 받도록 수정해야 함
  const userProfile = {
    name: "홍길동",
    role: "크리에이터",
    bio: "도시의 일상과 감정을 섬세한 시선으로 기록하는 작가입니다.\n회화와 디지털 작업을 넘나들며 익숙한 풍경 속 새로운 이야기를 전합니다.",
    snsLink: "https://www.naver.com",
  };

  const mockArtworks = [
    {
      id: "1",
      title: "작품 제목",
      type: "작품 유형",
      status: "전시 중" as const,
      imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe",
    },
    {
      id: "2",
      title: "작품 제목",
      type: "작품 유형",
      status: "전시 예정" as const,
      imageUrl: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5",
    },
    {
      id: "3",
      title: "작품 제목",
      type: "작품 유형",
      status: "전시 가능" as const,
      imageUrl: "https://images.unsplash.com/photo-1541701494587-cb58502866ab",
    },
  ];

  const mockActivities = [
    {
      id: "1",
      title: "전시 이름",
      period: "2000.01.01-2000.02.01",
      location: "전시 장소",
      imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe",
    },
    {
      id: "2",
      title: "전시 이름",
      period: "2000.01.01-2000.02.01",
      location: "전시 장소",
      imageUrl: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5",
    },
  ];

  return (
    <>
      <Header title="프로필" showBack />
      <div>
        <ProfileHeader name={userProfile.name} role={userProfile.role} />
        <div className="bg-bg-primary-darker my-6 h-1"></div>
        <div className="mb-9 flex flex-col gap-11 px-5">
          <ProfileInfo bio={userProfile.bio} snsLink={userProfile.snsLink} />
          <ProfileFeedList artworks={mockArtworks} />
          <ProfileActivityList activities={mockActivities} />
        </div>
      </div>
    </>
  );
}
