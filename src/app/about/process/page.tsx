"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import Image from "next/image";
const PROCESS_STEPS = [
  {
    image: "/about/process-1.svg",
    title: "첫 번째 단계 : 탐색",
    description:
      "홈 화면에서 갤러리에 입점한 공간 파트너가 등록한 작품과 공간을 둘러볼 수 있어요. 상세 정보를 확인하고, 원하는 조건의 작품 또는 공간을 선택해 보세요.",
  },
  {
    image: "/about/process-2.svg",
    title: "두 번째 단계 : 전시 문의",
    description:
      "나에게 적합한 조건의 작품 또는 공간을 발견했다면, 채팅을 통해 전시를 제안해 보세요. 전시를 원하는 작품 또는 공간을 선택한 뒤 전시명과 일정을 작성하여 상대에게 전시 메시지를 보낼 수 있어요.",
  },
  {
    image: "/about/process-3.svg",
    title: "세 번째 단계 : 동의서 작성",
    description:
      "상대가 전시 제안을 수락하면 동의서 작성 단계로 넘어가요. 합의된 전시 정보를 확인한 뒤 서명을 완료하면 전시 계약이 확정돼요. 원활한 전시 진행을 위해 작품 및 공간을 꼭 확인해 주세요!",
  },
  {
    image: "/about/process-4.svg",
    title: "네 번째 단계 : 계약 완료",
    description:
      "나에게 핏한 조건의 작품 또는 공간을 발견했다면, 채팅을 통해 전시를 제안해 보세요. 전시를 원하는 작품 또는 공간을 선택한 뒤 전시명과 일정을 작성하여 상대에게 제안 메시지를 보낼 수 있어요.",
  },
];

export default function AboutProcessPage() {
  const router = useRouter();

  return (
    <>
      <button
        aria-label="뒤로가기"
        onClick={() => router.back()}
        className="text-text-primary flex cursor-pointer items-center px-5 py-4"
      >
        <ChevronLeft size={24} />
      </button>
      <main className="bg-bg-primary min-h-screen px-5 py-6">
        <h1 className="text-title-2 text-text-primary font-bold">전시과정 한눈에 보기</h1>

        <p className="text-label text-text-secondary mt-3 font-medium">2026.06.27</p>

        <Image
          src="/about/process-thumbnail.svg"
          alt="전시 과정 썸네일"
          width={800}
          height={450}
          className="mt-6 w-full rounded-2xl"
        />

        <div className="text-headline-2 text-text-primary font-regular mt-9 space-y-5 leading-7">
          <p>
            리핏은 안전하고 원활한 전시 진행을 위해 전시 제안부터 계약, 전시 완료까지의 과정을
            체계적으로 운영하고 있어요.
          </p>

          <p>작품이 공간에 전시되기까지 어떤 과정을 거치는지 함께 살펴볼까요?</p>
        </div>

        <section className="mt-8 space-y-10">
          {PROCESS_STEPS.map(step => (
            <article key={step.title}>
              <Image
                src={step.image}
                alt={step.title}
                width={800}
                height={450}
                className="w-full"
              />

              <h2 className="text-heading-2 text-text-primary mt-9 font-semibold">{step.title}</h2>

              <p className="text-headline-2 text-text-primary font-regular mt-3 leading-7 whitespace-pre-line">
                {step.description}
              </p>
            </article>
          ))}
          <div className="text-headline-2 font-regular space-y-5 leading-7">
            <p>
              탐색부터 전시 계약까지, 리핏의 전시 과정을 함께 살펴봤어요. 지금 바로 작품 또는 공간을
              등록하고 나만의 전시를 시작해 보세요!
            </p>
            <p>리핏은 더 많은 전시가 이루어질 수 있도록 항상 응원할게요.</p>
          </div>
        </section>
      </main>
    </>
  );
}
