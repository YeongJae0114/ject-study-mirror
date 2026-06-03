"use client";

import ContentCard from "@/components/home/ContentCard";
import { mockArtworks } from "@/app/profile/mockData";
import Header from "@/components/common/Header";

export default function RecommendArtPage() {
  return (
    <div className="mx-auto min-h-screen w-full max-w-md bg-white pb-10">
      <Header title="추천 작품" showBack showBorder={false} />

      <main className="px-5 pt-5">
        <div className="grid grid-cols-2 gap-x-3.5 gap-y-3.5">
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
