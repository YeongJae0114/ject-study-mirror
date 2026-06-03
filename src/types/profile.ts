export interface ProfileHeaderProps {
  avatarUrl?: string;
  role: string;
  name: string;
}

export interface ProfileInfoProps {
  bio: string;
  snsLink: string;
}

export interface Artwork {
  id: string;
  title: string;
  type: string;
  author: string;
  status: "전시 중" | "전시 가능" | "전시 예정";
  imageUrl: string;
}

export interface Activity {
  id: string;
  title: string;
  period: string;
  location: string;
  imageUrl: string;
}
