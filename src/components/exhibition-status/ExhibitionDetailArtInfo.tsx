import { normalizeImageUrl } from "@/utils/normalizeImageUrl";
import Image from "next/image";

interface ArtworkRowProps {
  thumbnail: string | null;
  title: string;
  type: string;
}

export function ExhibitionDetailArtInfo({ thumbnail, title, type }: ArtworkRowProps) {
  const displayImage = normalizeImageUrl(thumbnail);
  return (
    <div className="flex items-center gap-5">
      <div>
        {displayImage && (
          <Image
            src={displayImage}
            className="aspect-square rounded-full"
            alt="공간 사진"
            width={72}
            height={72}
          />
        )}
      </div>
      <div className="flex flex-col gap-0.5">
        <div className="text-body-1 text-text-primary font-medium">{title}</div>
        <div className="text-body-1 text-text-secondary font-regular">{type}</div>
      </div>
    </div>
  );
}
