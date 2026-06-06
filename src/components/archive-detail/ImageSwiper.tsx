"use client";

import { useState } from "react";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";

import { normalizeImageUrl } from "@/utils/normalizeImageUrl";

interface ImageSwiperProps {
  images: string[];
  altPrefix?: string;
  emptyLabel?: string;
}

export default function ImageSwiper({
  images,
  altPrefix = "이미지",
  emptyLabel = "이미지가 없습니다.",
}: ImageSwiperProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const displayImages = images.flatMap(image => {
    const normalized = normalizeImageUrl(image);
    return normalized ? [normalized] : [];
  });
  const hasImages = displayImages.length > 0;

  return (
    <div className="relative h-70 w-full overflow-hidden">
      {hasImages ? (
        <Swiper
          className="h-full w-full"
          spaceBetween={0}
          slidesPerView={1}
          loop={true}
          onRealIndexChange={swiper => setActiveIndex(swiper.realIndex)}
        >
          {displayImages.map((src, index) => (
            <SwiperSlide key={index} className="relative">
              <Image
                src={src}
                alt={`${altPrefix} ${index + 1}`}
                fill
                unoptimized
                className="object-cover"
                sizes="100vw"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <div className="bg-bg-primary-darker text-body-2 text-text-secondary flex h-full w-full items-center justify-center">
          {emptyLabel}
        </div>
      )}

      {/* 이미지 개수 인덱스 표시 뱃지 */}
      {hasImages && (
        <div className="bg-object-secondary text-caption text-text-invert absolute right-5 bottom-5 z-10 h-6 w-10.5 rounded-sm px-1.5 py-1 text-center font-medium">
          {activeIndex + 1}/{displayImages.length}
        </div>
      )}
    </div>
  );
}
