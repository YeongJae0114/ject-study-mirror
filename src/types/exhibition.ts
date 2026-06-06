export type ExhibitionStatus =
  | "CONSENT_WRITING"
  | "SCHEDULED"
  | "ONGOING"
  | "COMPLETED"
  | "CANCELED";

export type ExhibitionStatusFilter = "CONSENT_WRITING" | "CONFIRMED" | "CANCELED";

export type ExhibitionStatusFilterParam = "consent-writing" | "confirmed" | "canceled";

export interface ExhibitionListItem {
  id: number;
  title: string;
  spaceName: string;
  startDate: string;
  endDate: string;
  status: ExhibitionStatus;
  thumbnailUrl: string | null;
  canCancel: boolean;
  canWriteConsent: boolean;
  canViewConsent: boolean;
}

export interface ExhibitionListResponse {
  items: ExhibitionListItem[];
  page: number;
  size: number;
  hasNext: boolean;
}

export interface ExhibitionSpaceInfo {
  id: number;
  name: string;
  address: string;
  thumbnailUrl: string | null;
  ownerNickname: string;
  ownerProfileImageUrl: string | null;
}

export interface ExhibitionCreatorInfo {
  id: number;
  nickname: string;
  profileImageUrl: string | null;
}

export interface ExhibitionArtworkInfo {
  id: number;
  title: string;
  type: string;
  thumbnailUrl: string | null;
}

export interface ExhibitionActionInfo {
  canCancel: boolean;
  canWriteConsent: boolean;
  canViewConsent: boolean;
}

export interface ExhibitionDetail {
  id: number;
  title: string;
  startDate: string;
  endDate: string;
  status: ExhibitionStatus;
  cancelReason: string | null;
  space: ExhibitionSpaceInfo;
  creator: ExhibitionCreatorInfo;
  artwork: ExhibitionArtworkInfo;
  actions: ExhibitionActionInfo;
}

export interface CancelExhibitionBody {
  reason: string;
}

export interface CancelExhibitionResult {
  exhibitionId: number;
  status: "CANCELED";
}
