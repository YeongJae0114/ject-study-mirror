import { mockArtworks, mockEmptyData } from "@/app/profile/mockData";
import ContentCard from "./ContentCard";
import SortDropdown from "./SortDropdown";
import { EmptyContent } from "../common/EmptyContent";
import { Artwork } from "@/types/profile";

interface SpaceTabProps {
  spaceData: Artwork[];
}

export default function SpaceTab({ spaceData }: SpaceTabProps) {
  return (
    <main className="px-5 pt-4">
      <div className="mb-4 flex items-center justify-between">
        <div className="text-heading-2 font-semibold">공간 리스트</div>
        {/* UI만 구현. 추후에 함수 추가 */}
        {spaceData.length > 0 && <SortDropdown />}
      </div>
      {spaceData.length === 0 ? (
        <div className="pt-4">
          <EmptyContent />
        </div>
      ) : (
        <div className="mx-auto grid max-w-100 grid-cols-2 gap-x-3.5 gap-y-3.5">
          {spaceData.map(artwork => (
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
      )}
    </main>
  );
}
