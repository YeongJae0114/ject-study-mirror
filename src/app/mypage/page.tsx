"use client";

import type { ReactNode } from "react";

import { useQuery } from "@tanstack/react-query";
import type { LucideIcon } from "lucide-react";
import {
  ChevronRight,
  Home,
  Images,
  LockKeyhole,
  MessageCircle,
  SquareUserRound,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { getMe } from "@/services/authApi";
import { getNicknamePolicy } from "@/services/userApi";
import type { MypageArtwork, MypageData, MypageExhibition, MypageProfile } from "@/types/mypage";

interface BadgeProps {
  children: ReactNode;
  size?: "small" | "medium";
}

interface SectionHeaderProps {
  title: string;
  moreHref?: string;
}

interface ExhibitionItemProps {
  exhibition: MypageExhibition;
  hasDivider?: boolean;
}

interface ArtworkCardProps {
  artwork: MypageArtwork;
}

interface BottomNavigationItemProps {
  label: string;
  icon: LucideIcon;
  selected?: boolean;
}

// 현재 백엔드 명세로 연결 가능한 프로필 정보만 API에서 채우고,
// 활동 정보와 피드는 더미 데이터 없이 빈 상태로 노출합니다.
const EMPTY_MYPAGE_DATA: MypageData = {
  profile: null,
  exhibitions: [],
  artworks: [],
};

const ROLE_LABEL: Record<string, string> = {
  creator: "크리에이터",
  CREATOR: "크리에이터",
  partner: "공간 파트너",
  PARTNER: "공간 파트너",
};

const getRoleLabel = (role?: string) => {
  if (!role || role === "PENDING") return null;
  return ROLE_LABEL[role] ?? role;
};

function Badge({ children, size = "medium" }: BadgeProps) {
  return (
    <span
      className={`bg-object-primary-light text-text-primary-brand inline-flex items-center justify-center rounded px-1.5 font-medium ${
        size === "small" ? "text-caption h-5 py-0.5" : "text-caption h-6 py-1"
      }`}
    >
      {children}
    </span>
  );
}

function MypageHeader() {
  return (
    <>
      <header className="bg-bg-primary fixed top-0 right-0 left-0 z-10 flex h-14 w-full items-center justify-between px-5">
        <h1 className="text-headline-1 text-text-primary font-semibold">마이페이지</h1>
        <Link
          href="/mypage/settings"
          aria-label="설정으로 이동"
          className="text-text-primary flex size-6 items-center justify-center"
        >
          <Image src="/icon-trailing-1.svg" alt="" width={24} height={24} />
        </Link>
      </header>
      <div className="h-14" />
    </>
  );
}

function EmptyState({ message }: { message: string }) {
  return <p className="text-body-2 text-text-secondary font-regular py-2">{message}</p>;
}

function ImageFallback({ children }: { children: ReactNode }) {
  return (
    <div className="bg-bg-primary-darker text-text-disabled flex size-full items-center justify-center">
      {children}
    </div>
  );
}

function ProfileSummary({
  profile,
  isLoading,
}: {
  profile: MypageProfile | null;
  isLoading: boolean;
}) {
  return (
    <section className="flex flex-col items-center px-5 pt-8">
      <div className="flex h-39 w-full flex-col items-center gap-4">
        {profile?.profileImageUrl ? (
          <div className="relative size-20 overflow-hidden rounded-full">
            <Image
              src={profile.profileImageUrl}
              alt=""
              fill
              sizes="80px"
              className="object-cover"
            />
          </div>
        ) : (
          <Image src="/profile.svg" alt="" width={80} height={80} className="size-20" />
        )}

        <div className="flex h-15 w-full flex-col items-center justify-center gap-[5px]">
          {profile?.roleLabel && <Badge>{profile.roleLabel}</Badge>}
          {isLoading ? (
            <p className="text-body-2 text-text-secondary font-regular">
              프로필 정보를 불러오는 중입니다.
            </p>
          ) : profile?.nickname ? (
            <p className="text-heading-1 text-text-primary font-semibold">{profile.nickname}</p>
          ) : (
            <p className="text-body-2 text-text-secondary font-regular">프로필 정보가 없습니다.</p>
          )}
        </div>
      </div>
    </section>
  );
}

function SectionHeader({ title, moreHref }: SectionHeaderProps) {
  return (
    <div className="flex h-7.5 w-full items-center justify-between">
      <h2 className="text-heading-2 text-text-primary font-medium">{title}</h2>
      {moreHref && (
        <Link
          href={moreHref}
          aria-label={`${title} 전체보기`}
          className="text-label text-text-secondary flex h-7.5 items-center font-medium"
        >
          전체보기
          <ChevronRight size={16} />
        </Link>
      )}
    </div>
  );
}

function ExhibitionItem({ exhibition, hasDivider = false }: ExhibitionItemProps) {
  return (
    <div className="w-full">
      <div className="flex items-center gap-4">
        <div className="relative size-18.5 shrink-0 overflow-hidden rounded-lg">
          {exhibition.imageUrl ? (
            <Image src={exhibition.imageUrl} alt="" fill sizes="74px" className="object-cover" />
          ) : (
            <ImageFallback>
              <Images size={24} />
            </ImageFallback>
          )}
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-1 leading-[1.45] font-medium">
          <p className="text-body-1 text-text-primary truncate">{exhibition.title}</p>
          <div className="text-body-2 text-text-secondary flex flex-col gap-[3px]">
            <p>{exhibition.period}</p>
            <p>{exhibition.place}</p>
          </div>
        </div>
      </div>

      {hasDivider && <div className="border-border-primary mt-4 border-t" />}
    </div>
  );
}

function ArtworkCard({ artwork }: ArtworkCardProps) {
  return (
    <article className="flex h-55.5 min-w-0 flex-col">
      <div className="border-border-primary relative h-33.5 overflow-hidden rounded-lg border">
        {artwork.imageUrl ? (
          <Image src={artwork.imageUrl} alt="" fill sizes="168px" className="object-cover" />
        ) : (
          <ImageFallback>
            <Images size={28} />
          </ImageFallback>
        )}

        {artwork.isPrivate && (
          <>
            <div className="absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-[rgba(26,26,30,0.5)] to-transparent" />
            <LockKeyhole
              size={20}
              className="text-text-invert absolute top-3 left-3"
              strokeWidth={2.2}
            />
          </>
        )}
      </div>

      <div className="flex w-full flex-col items-start gap-1 pt-2 pr-3.5 pb-3 pl-1">
        {artwork.statusLabel && <Badge size="small">{artwork.statusLabel}</Badge>}
        <div className="flex w-full flex-col gap-0.5">
          <p className="text-body-1 text-text-primary truncate font-semibold">{artwork.title}</p>
          <p className="text-label text-text-secondary font-regular truncate">{artwork.type}</p>
        </div>
      </div>
    </article>
  );
}

function BottomNavigationItem({ label, icon: Icon, selected = false }: BottomNavigationItemProps) {
  return (
    <button
      type="button"
      className="flex h-14 min-w-17.5 flex-1 flex-col items-center gap-1 py-1.5"
    >
      <Icon
        size={24}
        className={selected ? "text-object-primary" : "text-text-secondary"}
        strokeWidth={selected ? 2.3 : 1.8}
      />
      <span
        className={`text-caption flex h-4 items-center justify-center text-center ${
          selected ? "text-text-primary font-medium" : "text-text-secondary font-regular"
        }`}
      >
        {label}
      </span>
    </button>
  );
}

function BottomNavigation() {
  return (
    <nav className="border-border-primary bg-bg-primary fixed right-0 bottom-0 left-0 z-10 flex w-full min-w-[320px] items-center justify-center gap-1.5 border-t px-3 pb-2">
      <BottomNavigationItem label="홈" icon={Home} />
      <BottomNavigationItem label="전시 현황" icon={Images} />
      <BottomNavigationItem label="채팅" icon={MessageCircle} />
      <BottomNavigationItem label="마이페이지" icon={SquareUserRound} selected />
    </nav>
  );
}

export default function MypagePage() {
  const meQuery = useQuery({
    queryKey: ["auth", "me"],
    queryFn: getMe,
  });
  const nicknamePolicyQuery = useQuery({
    queryKey: ["users", "me", "nickname-policy"],
    queryFn: getNicknamePolicy,
  });

  const profile: MypageProfile | null =
    meQuery.data || nicknamePolicyQuery.data
      ? {
          nickname: nicknamePolicyQuery.data?.nickname ?? meQuery.data?.nickname ?? "",
          introduction: meQuery.data?.bio ?? null,
          roleLabel: getRoleLabel(meQuery.data?.role),
          snsUrl: meQuery.data?.snsUrl ?? null,
        }
      : null;
  const { exhibitions, artworks } = EMPTY_MYPAGE_DATA;
  const isProfileLoading = meQuery.isLoading || nicknamePolicyQuery.isLoading;

  return (
    <main className="bg-bg-primary min-h-dvh w-full pb-24">
      <MypageHeader />

      <ProfileSummary profile={profile} isLoading={isProfileLoading} />

      <div className="bg-bg-primary-darker mt-6 h-1 w-full" />

      <div className="flex flex-col gap-11 px-5 pt-6">
        <section className="flex flex-col gap-4">
          <SectionHeader title="기본 정보" />

          <div className="flex flex-col gap-6">
            {profile?.introduction || profile?.snsUrl ? (
              <>
                {profile.introduction && (
                  <div className="text-body-2 flex flex-col gap-1 leading-[1.45]">
                    <p className="text-text-secondary font-semibold">소개 글</p>
                    <p className="text-text-primary font-regular">{profile.introduction}</p>
                  </div>
                )}

                {profile.snsUrl && (
                  <div className="text-body-2 flex flex-col gap-1 leading-[1.45]">
                    <p className="text-text-secondary font-semibold">SNS 링크</p>
                    <a
                      href={profile.snsUrl}
                      className="text-text-primary-brand font-regular break-all"
                    >
                      {profile.snsUrl}
                    </a>
                  </div>
                )}
              </>
            ) : (
              <EmptyState message="등록된 기본 정보가 없습니다." />
            )}
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <SectionHeader title="피드" moreHref="/mypage/feed" />

          {artworks.length > 0 ? (
            <div className="grid grid-cols-2 gap-x-3.5 gap-y-3.5">
              {artworks.map(artwork => (
                <ArtworkCard key={artwork.id} artwork={artwork} />
              ))}
            </div>
          ) : (
            <EmptyState message="등록된 피드가 없습니다." />
          )}
        </section>

        <section className="flex flex-col gap-2">
          <SectionHeader title="활동 정보" moreHref="/mypage/activities" />

          {exhibitions.length > 0 ? (
            <div className="flex flex-col gap-4 py-4">
              {exhibitions.map((exhibition, index) => (
                <ExhibitionItem
                  key={exhibition.id}
                  exhibition={exhibition}
                  hasDivider={index < exhibitions.length - 1}
                />
              ))}
            </div>
          ) : (
            <EmptyState message="등록된 활동 정보가 없습니다." />
          )}
        </section>
      </div>

      <BottomNavigation />
    </main>
  );
}
