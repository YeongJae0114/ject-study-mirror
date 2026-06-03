"use client";

import ContentCard from "@/components/home/ContentCard";
import { mockArtworks } from "@/app/profile/mockData";
import Header from "@/components/common/Header";

export default function RecommendSpacePage() {
  return (
    <div className="mx-auto min-h-screen w-full max-w-md bg-white pb-10">
      <Header title="추천 공간" showBack />

      <main className="px-5 pt-5">
        <div className="grid grid-cols-2 gap-x-4 gap-y-6">
          {/* 공간 데이터로 수정 */}
          {mockArtworks.map(artwork => (
            <div key={artwork.id} className="w-full">
              <ContentCard
                title={artwork.title}
                imageUrl={artwork.imageUrl}
                author={artwork.author}
                type={artwork.type}
              />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
