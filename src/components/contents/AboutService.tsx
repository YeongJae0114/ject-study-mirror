import { useRouter } from "next/navigation";
import Image from "next/image";

import ContentsListRow from "./ContentsListRow";

export default function AboutService() {
  const router = useRouter();

  return (
    <div className="mt-2.5 px-5">
      <h2 className="text-heading-2 text-text-primary mb-4 font-semibold">리핏이 궁금하다면?</h2>

      <div className="flex flex-col gap-3.5">
        <ContentsListRow
          icon={<Image src="/about/process-icon.svg" alt="" width={60} height={60} />}
          title="전시 과정 한눈에 보기"
          onClick={() => router.push("/about/process")}
        />

        <ContentsListRow
          icon={<Image src="/about/story-icon.svg" alt="" width={60} height={60} />}
          title="리핏이 탄생한 이유"
          onClick={() => router.push("/about/story")}
        />
      </div>
    </div>
  );
}
