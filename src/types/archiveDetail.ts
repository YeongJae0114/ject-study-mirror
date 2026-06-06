export interface ArtworkDetail {
  id: number;
  ownerId: number;
  ownerNickname: string | null;
  ownerProfileImageUrl: string | null;
  title: string;
  artworkType: string;
  description: string | null;
  caution: string | null;
  sizeType: "STANDARD" | "CUSTOM";
  widthCm: number | null;
  heightCm: number | null;
  depthCm: number | null;
  createdDate: string | null;
  status: "DRAFT" | "PUBLISHED" | "HIDDEN" | "DELETED";
  imageIds: number[];
  imageUrls: string[];
  thumbnailIndex: number | null;
  availableRegions: string[];
  createdAt: string;
  updatedAt: string;
}

export interface SpaceDetail {
  id: number;
  ownerId: number;
  ownerNickname: string | null;
  ownerProfileImageUrl: string | null;
  title: string;
  spaceType: string | null;
  address: string | null;
  description: string | null;
  caution: string | null;
  widthCm: number | null;
  heightCm: number | null;
  depthCm: number | null;
  isPublic: boolean;
  imageIds: number[];
  imageUrls: string[];
  createdAt: string;
  updatedAt: string;
}
