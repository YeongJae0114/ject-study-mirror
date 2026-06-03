"use client";

import Image from "next/image";
import Tabs from "@/components/common/Tab";
import { useState } from "react";
import RecommendTab from "@/components/home/RecommendTab";
import ArtTab from "@/components/home/ArtTab";
import SpaceTab from "@/components/home/SpaceTab";
import { mockArtworks, mockEmptyData } from "./profile/mockData";

const tabs = [
  { label: "추천", value: "recommend" },
  { label: "작품", value: "artwork" },
  { label: "공간", value: "space" },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState("recommend");

  return (
    <div className="pb-10">
      <div className="px-5 py-4">
        <div className="text-headline-1 text-text-primary h-14 font-semibold">홈</div>
      </div>
      {/* 배너 */}
      <section className="px-5">
        <div className="flex items-center justify-between">
          <div className="text-title-3 text-text-primary font-semibold">
            <div>지금 나에게 핏한</div>
            <div>전시 매칭</div>
          </div>
          <Image src="/home-icon.svg" alt="홈 아이콘" width={134} height={88} />
        </div>
      </section>
      {/* 탭 */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
      {activeTab === "recommend" && (
        <RecommendTab artData={mockArtworks} spaceData={mockEmptyData} />
      )}{" "}
      {activeTab === "artwork" && <ArtTab artData={mockArtworks} />}
      {activeTab === "space" && <SpaceTab spaceData={mockEmptyData} />}
    </div>
  );
}
