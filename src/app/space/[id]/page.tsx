"use client";

import { useRouter } from "next/navigation";

import ExpandableText from "@/components/archive-detail/ExpandableText";
import SizeText from "@/components/archive-detail/SizeText";
import ImageSwiper from "@/components/archive-detail/ImageSwiper";
import NicknameCard from "@/components/archive-detail/NicknameCard";

export default function SpaceDetailPage() {
  const router = useRouter();

  // 임시 이미지 배열
  const artworkImages = [
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe",
    "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5",
    "https://images.unsplash.com/photo-1541701494587-cb58502866ab",
  ];

  // 임시 텍스트
  const texts =
    "대법원장과 대법관이 아닌 법관은 대법관회의의 동의를 얻어 대법원장이 임명한다. 재산권의 행사는 공공복리에 적합하도록 하여야 한다. 국가원로자문회의의 의장은 직전대통령이 된다. 다만, 직전대통령이 없을 때에는 대통령이 지명한다. 대한민국은 통일을 지향하며, 자유민주적 기본질서에 입각한 평화적 통일 정책을 수립하고 이를 추진한다. 국가는 농지에 관하여 경자유전의 원칙이 달성될 수 있도록 노력하여야 하며, 농지의 소작제도는 금지된다. 대법원에 대법관을 둔다. 다만, 법률이 정하는 바에 의하여 대법관이 아닌 법관을 둘 수 있다. 국가는 모성의 보호를 위하여 노력하여야 한다. 제안된 헌법개정안은 대통령이 20일 이상의 기간 이를 공고하여야 한다.";
  // 임시 지역 데이터
  const address = "주소주소주소주소";

  return (
    <div className="min-h-screen bg-white pb-32">
      {/* 헤더 */}
      <header className="fixed top-0 right-0 left-0 z-50 flex h-15 w-full min-w-[320px] px-4">
        <div className="flex items-center">
          <button
            aria-label="뒤로가기"
            onClick={() => router.back()}
            className="flex cursor-pointer items-center font-bold text-white drop-shadow-md"
          >
            ←
          </button>
        </div>
      </header>

      {/* 이미지 슬라이더 */}
      <ImageSwiper images={artworkImages} />

      {/* 위쪽 컨텐츠 */}
      <div className="text-text-primary flex flex-col gap-1.5 px-5 py-6">
        <div className="text-caption bg-object-secondary-light h-6 w-14 rounded-sm px-1.5 py-1 font-medium">
          공간 유형
        </div>
        <div className="text-title-3 font-semibold">공간 이름</div>

        {/* 주소 */}
        <div className="flex-colgap-1 flex">
          <div className="text-label font-semibold">주소</div>
          <div className="text-body-2 font-regular">{address}</div>
        </div>
        {/* 크리에이터 닉네임 영역 */}
        <NicknameCard nickname="공간 파트너 닉네임" />
      </div>

      {/* 구분선 */}
      <div className="bg-bg-primary-darker h-1" />

      {/* 아래쪽 컨텐츠 */}
      <div className="text-text-primary flex flex-col gap-8 px-5 py-6">
        {/* 제공 가능한 공간 사이즈 */}
        <SizeText title="제공 가능한 공간 사이즈" />

        {/* 공간 상세 */}
        <ExpandableText title="공간 상세" content={texts} maxLines={4} />

        {/* 주의사항 */}
        <ExpandableText title="주의사항" content={texts} maxLines={4} />
      </div>

      {/* 전시 문의하기 버튼 */}
      <div className="border-border-primary bg-bg-primary fixed right-0 bottom-0 left-0 z-50 border-t px-5 pt-3 pb-9">
        <button
          onClick={() => alert("전시 문의 프로세스 시작")}
          className="bg-object-primary text-body-1 text-text-invert flex h-12.5 w-full items-center justify-center rounded-lg font-medium"
        >
          전시 문의하기
        </button>
      </div>
    </div>
  );
}
