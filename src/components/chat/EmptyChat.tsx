import { MessageSquareDashed } from "lucide-react";

import { CHAT_EMPTY_MESSAGE } from "@/constants/chat";

export default function EmptyChat() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-4 py-20">
      <MessageSquareDashed size={64} aria-hidden className="text-text-disabled" />
      <div className="text-body-1 font-regular text-text-secondary">{CHAT_EMPTY_MESSAGE}</div>
    </div>
  );
}
