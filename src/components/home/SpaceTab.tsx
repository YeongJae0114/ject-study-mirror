import { mockArtworks } from "@/app/profile/mockData";
import ContentCard from "./ContentCard";
import SortDropdown from "./SortDropdown";

export default function SpaceTab() {
  return (
    <main className="px-5 pt-4">
      <div className="mb-4 flex items-center justify-between">
        <div className="text-heading-2 font-semibold">공간 리스트</div>
        {/* UI만 구현. 추후에 함수 추가 */}
        <SortDropdown />
      </div>
      <div className="mx-auto grid max-w-100 grid-cols-2 gap-x-3.5 gap-y-3.5">
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
  );
}
