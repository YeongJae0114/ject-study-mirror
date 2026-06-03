"use client";

import { ChevronRight } from "lucide-react";
import ContentCard from "./ContentCard";
import { useRouter } from "next/navigation";
import { mockActivities, mockArtworks } from "@/app/profile/mockData";

export default function RecommendTab() {
  const router = useRouter();
  return (
    <>
      {/* 추천 작품 */}
      <section className="mt-4">
        <div className="mb-4 flex items-center justify-between px-5">
          <h2 className="text-heading-2 font-semibold">이번 주 추천 작품</h2>
          <button
            onClick={() => router.push("/recommend/art")}
            className="text-label text-text-secondary flex cursor-pointer items-center gap-0.5 font-medium"
          >
            전체보기
            <ChevronRight size={16} />
          </button>
        </div>

        <div className="flex gap-2.5 overflow-x-auto px-5 pb-4 [&::-webkit-scrollbar]:hidden">
          {mockArtworks.slice(0, 8).map(artwork => (
            <ContentCard key={artwork.id} title={artwork.title} imageUrl={artwork.imageUrl} />
          ))}
        </div>
      </section>

      {/* 추천 공간 */}
      <section className="mt-4">
        <div className="mb-4 flex items-center justify-between px-5">
          <h2 className="text-heading-2 font-semibold">이번 주 추천 공간</h2>

          <button
            onClick={() => router.push("/recommend/space")}
            className="text-label text-text-secondary flex cursor-pointer items-center gap-0.5 font-medium"
          >
            전체보기
            <ChevronRight size={16} />
          </button>
        </div>

        <div className="flex gap-2.5 overflow-x-auto px-5 pb-4 [&::-webkit-scrollbar]:hidden">
          {mockActivities.slice(0, 8).map(space => (
            <ContentCard key={space.id} title={space.title} imageUrl={space.imageUrl} />
          ))}
        </div>
      </section>
    </>
  );
}
