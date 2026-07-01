"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import Image from "next/image";

export default function AboutStoryPage() {
  const router = useRouter();

  return (
    <>
      {/* 상단 뒤로가기 버튼 */}
      <button
        aria-label="뒤로가기"
        onClick={() => router.back()}
        className="text-text-primary flex cursor-pointer items-center px-5 py-4"
      >
        <ChevronLeft size={24} />
      </button>

      {/* 메인 콘텐츠 */}
      <main className="bg-bg-primary min-h-screen px-5 py-6">
        <h1 className="text-title-2 text-text-primary font-bold">리핏이 탄생한 이유</h1>

        <p className="text-label text-text-secondary mt-3 font-medium">2026.06.27</p>

        <Image
          src="/about/story-thumbnail.svg"
          alt="리핏이 탄생한 이유"
          width={350}
          height={200}
          className="mt-7.5 w-full rounded-xl"
        />

        <div className="text-headline-2 text-text-primary font-regular mt-9 space-y-5 leading-7">
          <p>
            리핏은 작품을 선보일 무대가 필요한 대학생 디자이너와, 공간에 새로운 분위기를 더하고 싶은
            공간 운영자의 만남을 위해 시작된 전시 매칭 서비스입니다.
          </p>
          <p>
            작품과 공간이 만나기까지의 문제를 어떻게 풀어나가고자 했는지, 지금부터 같이
            알아가보아요!
          </p>
        </div>

        {/* 서브 섹션들 */}
        <section className="mt-9 space-y-9">
          {/* 섹션 1 */}
          <article>
            <h2 className="text-heading-2 text-text-primary font-semibold">
              이런 어려움이 있었어요
            </h2>
            <div className="text-headline-2 text-text-primary font-regular mt-3 space-y-5 leading-7">
              <p>
                전시를 원하는 대학생 디자이너는 충분히 많지만,{" "}
                <span className="font-bold">
                  비용의 부담과 복잡한 계약 절차, 나에게 맞는 작품을 찾는 것의 한계
                </span>
                로 인해 전시를 진행하지 못합니다.
              </p>
              <p>
                공간 운영자 또한 자신이 가진 공간을 어떻게 더 매력적으로 구상할지 고민하지만,{" "}
                <span className="font-bold">인테리어 비용과 시간적 문제</span>로 인해 망설이고 있는
                상황입니다.
              </p>
            </div>
          </article>

          {/* 섹션 2 */}
          <article>
            <h2 className="text-heading-2 text-text-primary font-semibold">이렇게 해결했어요</h2>
            <div className="text-headline-2 text-text-primary font-regular mt-3 space-y-5 leading-7">
              <p>
                리핏은 이러한 문제를 해결하기 위해 '전시 매칭'이라는 해결책을 도출했어요.
                디자이너에게는 작품을 선보일 공간을, 공간 운영자에게는 공간 분위기를 바꿔줄 작품을
                제공해 양측이 <span className="font-bold">부담 없이 새로운 전시 기회</span>를 만들
                수 있도록 돕고자 합니다.
              </p>
              <p>
                원활한 연결을 위해, 리핏은 <span className="font-bold">간편한 등록 가이드라인</span>
                으로 작품과 공간을 쉽게 선보이고, 나에게 맞는 작품과 공간을 직접 둘러볼 수 있는
                환경을 제공합니다. 또 <span className="font-bold">쉬운 전시 계약 프로세스</span>를
                통해 복잡함을 덜어, 누구나 안전하고 간편하게 전시를 진행할 수 있도록 돕고 있답니다.
              </p>
            </div>
          </article>

          <article>
            <h2 className="text-heading-2 text-text-primary font-semibold">마무리하며</h2>
            <div className="text-headline-2 text-text-primary font-regular mt-3 mb-9 leading-7">
              <p>
                전시 기회를 연결하는 리핏, 앞으로도 사용자의 목소리에 항상 귀 기울이며 더 나은
                서비스로 발전해나갈게요!
              </p>
            </div>
          </article>
        </section>
      </main>
    </>
  );
}
