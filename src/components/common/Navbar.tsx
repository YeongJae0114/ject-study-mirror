"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import ChatIcon from "@/assets/ChatIcon";
import ExhibitionIcon from "@/assets/ExhibitionIcon";
import HomeIcon from "@/assets/HomeIcon";
import MypageIcon from "@/assets/MypageIcon";

const menus = [
  {
    label: "홈",
    href: "/",
    icon: HomeIcon,
  },
  {
    label: "전시 현황",
    href: "/exhibitions/status",
    icon: ExhibitionIcon,
  },
  {
    label: "채팅",
    href: "/chat",
    icon: ChatIcon,
  },
  {
    label: "마이페이지",
    href: "/mypage",
    icon: MypageIcon,
  },
];

export default function Navbar() {
  const pathname = usePathname();

  const shouldShowNavbar =
    pathname === "/" ||
    pathname === "/exhibitions/status" ||
    pathname === "/chat" ||
    pathname === "/mypage";

  if (!shouldShowNavbar) {
    return null;
  }
  return (
    <nav className="border-border-primary bg-bg-primary fixed right-0 bottom-0 left-0 z-30 border-t pb-[env(safe-area-inset-bottom)]">
      <div className="mx-auto h-16 w-full max-w-97.5 px-3 pt-1.5 pb-2">
        <div className="flex h-full gap-1.5">
          {menus.map(menu => {
            const isActive = menu.href === "/" ? pathname === "/" : pathname.startsWith(menu.href);

            const Icon = menu.icon;

            return (
              <Link
                key={menu.href}
                href={menu.href}
                className="flex h-full flex-1 flex-col items-center justify-center gap-1"
              >
                <Icon active={isActive} />

                <span
                  className={`text-caption font-regular ${
                    isActive ? "text-text-primary" : "text-text-secondary"
                  }`}
                >
                  {menu.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
