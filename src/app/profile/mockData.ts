import { Activity, Artwork } from "@/types/profile";

export const mockEmptyData: Artwork[] = [];

export const mockArtworks: Artwork[] = [
  {
    id: "1",
    title: "작품 제목",
    type: "작품 유형",
    author: "작가 이름",
    status: "전시 중" as const,
    imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe",
  },
  {
    id: "2",
    title: "작품 제목",
    type: "작품 유형",
    author: "작가 이름",
    status: "전시 예정" as const,
    imageUrl: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5",
  },
  {
    id: "3",
    title: "작품 제목",
    type: "작품 유형",
    author: "작가 이름",
    status: "전시 가능" as const,
    imageUrl: "https://images.unsplash.com/photo-1541701494587-cb58502866ab",
  },
  {
    id: "4",
    title: "작품 제목",
    type: "작품 유형",
    author: "작가 이름",
    status: "전시 중" as const,
    imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe",
  },
  {
    id: "5",
    title: "작품 제목",
    type: "작품 유형",
    author: "작가 이름",
    status: "전시 예정" as const,
    imageUrl: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5",
  },
  {
    id: "6",
    title: "작품 제목",
    type: "작품 유형",
    author: "작가 이름",
    status: "전시 가능" as const,
    imageUrl: "https://images.unsplash.com/photo-1541701494587-cb58502866ab",
  },
];

// 프로필 이미지도 함께 받도록 수정해야 함
export const userProfile = {
  id: 1,
  name: "홍길동",
  role: "크리에이터",
  bio: "도시의 일상과 감정을 섬세한 시선으로 기록하는 작가입니다.\n회화와 디지털 작업을 넘나들며 익숙한 풍경 속 새로운 이야기를 전합니다.",
  snsLink: "https://www.naver.com",
};

export const mockActivities: Activity[] = [
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
