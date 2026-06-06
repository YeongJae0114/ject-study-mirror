"use client";

import { useState, useRef, useLayoutEffect } from "react";

interface ExpandableTextProps {
  title: string;
  content: string;
  maxLines?: number;
}

export default function ExpandableText({ title, content, maxLines = 3 }: ExpandableTextProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);

  useLayoutEffect(() => {
    const element = textRef.current;

    if (!element) return;

    setShowButton(element.scrollHeight > element.clientHeight);
  }, [content, maxLines]);

  return (
    <div className="text-text-primary">
      <div className="text-heading-2 mb-2.5 font-medium">{title}</div>
      <div className="relative">
        <div
          ref={textRef}
          style={{
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: isExpanded ? "unset" : maxLines,
          }}
          className="text-body-2 font-regular overflow-hidden leading-relaxed whitespace-pre-wrap"
        >
          {content}
        </div>

        {!isExpanded && showButton && (
          <div className="absolute right-0 bottom-0 left-0 h-6 bg-linear-to-t from-white to-transparent" />
        )}
      </div>

      {showButton && !isExpanded && (
        <button
          onClick={() => setIsExpanded(true)}
          className="text-body-1 border-border-primary text-text-secondary mt-3.5 flex w-full cursor-pointer items-center justify-center rounded-lg border py-3 font-medium hover:bg-gray-50"
        >
          더보기
        </button>
      )}
    </div>
  );
}
