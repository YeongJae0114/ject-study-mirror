export interface MypageProfile {
  nickname: string;
  roleLabel?: string | null;
  profileImageUrl?: string | null;
  introduction?: string | null;
  snsUrl?: string | null;
}

export interface MypageExhibition {
  id: string;
  imageUrl?: string | null;
  title: string;
  period: string;
  place: string;
}

export type MypageFeedTargetType = "ARTWORK" | "SPACE";

export interface MypageFeedApiItem {
  targetType: MypageFeedTargetType;
  id: number;
  title: string;
  type: string;
  thumbnailUrl: string | null;
  isPublic: boolean;
  createdAt: string;
}

export interface MypageFeedResponse {
  items: MypageFeedApiItem[];
  page: number;
  size: number;
  hasNext: boolean;
}

export interface MypageArtwork {
  id: string;
  targetId: number;
  targetType: MypageFeedTargetType;
  imageUrl?: string | null;
  title: string;
  type: string;
  statusLabel?: string | null;
  isPrivate?: boolean;
  href: string;
}

export interface MypageData {
  profile: MypageProfile | null;
  exhibitions: MypageExhibition[];
  artworks: MypageArtwork[];
}
