import { normalizeImageUrl } from "@/utils/normalizeImageUrl";
import Image from "next/image";
import ConsentStatusBadge from "../exhibition-consent/ConsentStatusBadge";

interface UserRowProps {
  image: string | null;
  nickname: string;
  action?: boolean | undefined;
}

export function ExhibitionDetailUserInfo({ image, nickname, action }: UserRowProps) {
  const displayImage = normalizeImageUrl(image);
  return (
    <div className="flex items-center gap-5">
      <div>
        {displayImage ? (
          <Image
            src={displayImage}
            className="aspect-square rounded-full"
            alt="프로필"
            width={72}
            height={72}
          />
        ) : (
          <Image src="/default-profile.svg" alt="기본 이미지" width={72} height={72} />
        )}
      </div>
      <div className="flex flex-col gap-0.5">
        <div className="text-body-1 font-medium">{nickname}</div>
        <div>{action !== undefined && <ConsentStatusBadge completed={action} />}</div>
      </div>
    </div>
  );
}
