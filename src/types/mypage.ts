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

export interface MypageArtwork {
  id: string;
  imageUrl?: string | null;
  title: string;
  type: string;
  statusLabel?: string | null;
  isPrivate?: boolean;
}

export interface MypageData {
  profile: MypageProfile | null;
  exhibitions: MypageExhibition[];
  artworks: MypageArtwork[];
}
