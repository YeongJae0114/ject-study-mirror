interface ContentCardProps {
  title: string;
  imageUrl: string;
  author?: string;
  type?: string;
}

export default function ContentCard({ title, imageUrl, author, type }: ContentCardProps) {
  return (
    <div className="w-42 shrink-0">
      {/* 썸네일*/}
      <div className="aspect-4/3 overflow-hidden rounded-lg">
        <img src={imageUrl} alt={title} className="h-full w-full object-cover" />
      </div>

      {/* 제목 */}
      <p className="text-body-1 text-text-primary mt-2 truncate font-semibold">{title}</p>

      {/* 작가 */}
      {author && (
        <p className="text-label font-regular text-text-secondary mt-0.5 truncate">{author}</p>
      )}

      {/* 작품 유형 */}
      {type && (
        <div className="mt-1 mb-2">
          <span className="text-text-primary text-caption bg-object-secondary-light h-5 rounded px-1.5 py-0.5 font-medium">
            {type}
          </span>
        </div>
      )}
    </div>
  );
}
