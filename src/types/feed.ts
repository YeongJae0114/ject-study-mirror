export interface FeedPage<T> {
  items: T[];
  nextCursor: string | null;
  hasNext: boolean;
}

export interface ArtworkFeedItem {
  id: number;
  title: string;
  artworkType: string;
  thumbnailUrl: string | null;
  ownerNickname: string | null;
  createdAt: string;
}

export interface SpaceFeedItem {
  id: number;
  title: string;
  thumbnailUrl: string | null;
  ownerNickname: string | null;
  createdAt: string;
}

export interface FeedCardItem {
  id: string;
  title: string;
  imageUrl?: string | null;
  author?: string | null;
  type?: string | null;
  href: string;
}
