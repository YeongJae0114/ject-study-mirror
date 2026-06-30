import { normalizeImageUrl } from "@/utils/normalizeImageUrl";
import Image from "next/image";

interface SpaceRowProps {
  thumbnail: string | null;
  name: string;
  address: string;
}

export function ExhibitionDetailSpaceInfo({ thumbnail, name, address }: SpaceRowProps) {
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
        <div className="text-body-1 text-text-primary font-medium">{name}</div>
        <div className="text-body-1 text-text-secondary font-regular">{address}</div>
      </div>
    </div>
  );
}
