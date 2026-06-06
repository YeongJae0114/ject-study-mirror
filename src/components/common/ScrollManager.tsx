"use client";

import { useEffect, useMemo, useRef } from "react";

import { usePathname, useSearchParams } from "next/navigation";

interface ScrollPosition {
  x: number;
  y: number;
}

const TOP_POSITION: ScrollPosition = { x: 0, y: 0 };

function getScrollPosition(): ScrollPosition {
  return { x: window.scrollX, y: window.scrollY };
}

function scrollToPosition(position: ScrollPosition) {
  window.scrollTo({
    left: position.x,
    top: position.y,
    behavior: "auto",
  });
}

export default function ScrollManager() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const routeKey = useMemo(() => {
    const queryString = searchParams.toString();
    return queryString ? `${pathname}?${queryString}` : pathname;
  }, [pathname, searchParams]);
  const routeKeyRef = useRef(routeKey);
  const positionsRef = useRef<Record<string, ScrollPosition>>({});
  const isPopNavigationRef = useRef(false);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!("scrollRestoration" in window.history)) return;

    const previousScrollRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";

    return () => {
      window.history.scrollRestoration = previousScrollRestoration;
    };
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      isPopNavigationRef.current = true;
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    const positions = positionsRef.current;

    const handleScroll = () => {
      if (frameRef.current !== null) return;

      frameRef.current = window.requestAnimationFrame(() => {
        positions[routeKeyRef.current] = getScrollPosition();
        frameRef.current = null;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }
      positions[routeKeyRef.current] = getScrollPosition();
    };
  }, []);

  useEffect(() => {
    const previousRouteKey = routeKeyRef.current;
    if (previousRouteKey === routeKey) return;

    positionsRef.current[previousRouteKey] ??= getScrollPosition();
    routeKeyRef.current = routeKey;

    const shouldRestore = isPopNavigationRef.current;
    const nextPosition = shouldRestore
      ? (positionsRef.current[routeKey] ?? TOP_POSITION)
      : TOP_POSITION;
    isPopNavigationRef.current = false;

    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => scrollToPosition(nextPosition));
    });
  }, [routeKey]);

  return null;
}
