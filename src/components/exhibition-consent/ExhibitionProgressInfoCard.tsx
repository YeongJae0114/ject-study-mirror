import Image from "next/image";

import type { ConsentExhibitionInfo } from "@/types/exhibitionConsent";
import { normalizeImageUrl } from "@/utils/normalizeImageUrl";
import { ExhibitionDetailSpaceInfo } from "../exhibition-status/ExhibitionDetailSpaceInfo";
import { ExhibitionDetailUserInfo } from "../exhibition-status/ExhibitionDetailUserInfo";
import { ExhibitionDetailArtInfo } from "../exhibition-status/ExhibitionDetailArtInfo";

interface ExhibitionProgressInfoCardProps {
  exhibition: ConsentExhibitionInfo;
}

function formatDateRange(startDate: string, endDate: string) {
  return `${startDate.replaceAll("-", ".")} - ${endDate.replaceAll("-", ".")}`;
}

function InfoAvatar({ src, alt }: { src: string | null; alt: string }) {
  const displaySrc = normalizeImageUrl(src);

  return (
    <div className="bg-object-disabled relative h-12 w-12 shrink-0 overflow-hidden rounded-full">
      {displaySrc ? (
        <Image src={displaySrc} alt={alt} fill unoptimized className="object-cover" sizes="48px" />
      ) : null}
    </div>
  );
}

export default function ExhibitionProgressInfoCard({
  exhibition,
}: ExhibitionProgressInfoCardProps) {
  return (
    <section className="px-5 pt-6">
      <h2 className="text-heading-2 text-text-primary font-semibold">전시 진행 정보</h2>

      <div className="bg-bg-primary-darker mt-4 rounded-lg px-4 py-5">
        <dl className="flex flex-col gap-5">
          <div>
            <dt className="text-body-1 text-text-primary font-semibold">전시명</dt>
            <dd className="text-body-1 text-text-secondary mt-0.5">{exhibition.title}</dd>
          </div>

          <div>
            <dt className="text-body-1 text-text-primary font-semibold">진행 일정</dt>
            <dd className="text-body-1 text-text-secondary mt-0.5">
              {formatDateRange(exhibition.startDate, exhibition.endDate)}
            </dd>
          </div>

          <div className="flex flex-col gap-4">
            <dt className="text-body-1 text-text-primary font-semibold">공간 파트너</dt>
            <ExhibitionDetailSpaceInfo
              thumbnail={exhibition.spaceThumbnailUrl}
              name={exhibition.spaceName}
              address={exhibition.spaceAddress}
            />
            <ExhibitionDetailUserInfo
              image={exhibition.spaceOwnerProfileImageUrl}
              nickname={exhibition.spaceOwnerNickname}
            />
          </div>

          <div className="flex flex-col gap-4">
            <dt className="text-body-1 text-text-primary font-semibold">크리에이터</dt>
            <ExhibitionDetailArtInfo
              thumbnail={exhibition.artworkThumbnailUrl}
              title={exhibition.artworkTitle}
              type={exhibition.artworkType}
            />
            <ExhibitionDetailUserInfo
              image={exhibition.creatorProfileImageUrl}
              nickname={exhibition.creatorNickname}
            />
          </div>
        </dl>
      </div>
    </section>
  );
}
