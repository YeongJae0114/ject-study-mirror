import { useRouter } from "next/navigation";

import { EmptyContent } from "@/components/common/EmptyContent";
import ExhibitionStatusCard from "@/components/exhibition-status/ExhibitionStatusCard";
import type { ExhibitionListItem } from "@/types/exhibition";

interface ExhibitionStatusListProps {
  exhibitions: ExhibitionListItem[];
  isLoading: boolean;
  errorMessage: string | null;
  onRetry: () => void;
}

function ExhibitionListSkeleton() {
  return (
    <div className="flex flex-col gap-3 px-5 pt-5">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="border-border-primary flex gap-4 rounded-lg border p-4">
          <div className="bg-bg-primary-darker size-22 shrink-0 rounded-lg" />
          <div className="flex flex-1 flex-col">
            <div className="bg-object-disabled h-5 w-24 rounded" />
            <div className="bg-bg-primary-darker mt-3 h-5 w-full rounded" />
            <div className="bg-bg-primary-darker mt-3 h-4 w-32 rounded" />
            <div className="bg-bg-primary-darker mt-2 h-4 w-28 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ExhibitionStatusList({
  exhibitions,
  isLoading,
  errorMessage,
  onRetry,
}: ExhibitionStatusListProps) {
  const router = useRouter();

  if (isLoading) {
    return <ExhibitionListSkeleton />;
  }

  if (errorMessage) {
    return (
      <section className="flex min-h-[calc(100dvh-180px)] flex-col items-center justify-center px-5 text-center">
        <p role="alert" className="text-body-1 text-error-default">
          {errorMessage}
        </p>
        <button
          type="button"
          onClick={onRetry}
          className="border-border-primary text-body-1 text-text-primary mt-5 h-11 rounded-lg border px-5 font-medium"
        >
          다시 불러오기
        </button>
      </section>
    );
  }

  if (exhibitions.length === 0) {
    return (
      <section className="flex min-h-[calc(100dvh-180px)] items-center justify-center px-5">
        <EmptyContent message="진행된 전시 현황이 없어요." />
      </section>
    );
  }

  return (
    <ul className="flex flex-col gap-3 px-5 pt-5 pb-24">
      {exhibitions.map(exhibition => (
        <li key={exhibition.id}>
          <ExhibitionStatusCard
            exhibition={exhibition}
            onClick={() => router.push(`/exhibitions/${exhibition.id}`)}
          />
        </li>
      ))}
    </ul>
  );
}
