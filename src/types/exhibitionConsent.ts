export type ConsentMode = "write" | "readonly";

export interface ConsentExhibitionInfo {
  title: string;
  startDate: string;
  endDate: string;
  spaceName: string;
  spaceAddress: string;
  spaceOwnerNickname: string;
  spaceOwnerProfileImageUrl: string | null;
  spaceThumbnailUrl: string | null;
  creatorNickname: string;
  creatorProfileImageUrl: string | null;
  artworkTitle: string;
  artworkType: string;
  artworkThumbnailUrl: string | null;
}

export interface ConsentAgreement {
  id: string;
  title: string;
  required: boolean;
  content: string;
  checked: boolean;
}

export interface ConsentSignature {
  signed: boolean;
  signedAt: string | null;
  imageUrl: string | null;
}

export interface ExhibitionConsent {
  exhibitionId: number;
  mode: "WRITE" | "READONLY";
  canSubmit: boolean;
  myConsentSubmitted: boolean;
  creatorConsentSubmitted: boolean;
  spaceOwnerConsentSubmitted: boolean;
  allConsentSubmitted: boolean;
  exhibition: ConsentExhibitionInfo;
  agreements: ConsentAgreement[];
  signature: ConsentSignature;
}

export interface SubmitExhibitionConsentBody {
  agreementIds: string[];
  signatureDataUrl: string;
}

export interface SubmitExhibitionConsentResult {
  exhibitionId: number;
  consentId: number;
  status: "COMPLETED";
  allConsentSubmitted: boolean;
  signedAt: string;
}
