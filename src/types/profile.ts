export interface ProfileHeaderProps {
  avatarUrl?: string | null;
  role?: string | null;
  name: string;
}

export interface ProfileInfoProps {
  bio?: string | null;
  snsLink?: string | null;
}

export type ProfileFeedTargetType = "ARTWORK" | "SPACE";
export type ProfileFeedStatus = "AVAILABLE" | "SCHEDULED" | "ONGOING";

export interface PublicProfile {
  userId: number;
  nickname: string | null;
  role: "CREATOR" | "SPACE_PARTNER" | "PENDING" | null;
  roleLabel: string | null;
  bio: string | null;
  snsUrl: string | null;
  profileImageUrl: string | null;
}

export interface ProfileFeedItem {
  targetType: ProfileFeedTargetType;
  id: number;
  title: string;
  type: string | null;
  address: string | null;
  status: ProfileFeedStatus;
  thumbnailUrl: string | null;
  createdAt: string;
  href: string;
}

export interface ProfileFeedResponse {
  items: Omit<ProfileFeedItem, "href">[];
  page: number;
  size: number;
  hasNext: boolean;
}

export interface Activity {
  id: number;
  title: string;
  spaceName: string | null;
  startDate: string;
  endDate: string;
  status: "SCHEDULED" | "ONGOING" | "COMPLETED" | "CANCELED" | "CONSENT_WRITING";
  thumbnailUrl: string | null;
  period: string;
  location: string;
  imageUrl: string | null;
}

export interface ProfileActivityResponse {
  items: Omit<Activity, "period" | "location" | "imageUrl">[];
  page: number;
  size: number;
  hasNext: boolean;
}
