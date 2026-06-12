interface ArtTypeBadgeProps {
  type: string | null;
}

export default function ArtTypeBadge({ type }: ArtTypeBadgeProps) {
  return (
    <div className="text-caption bg-object-secondary-light h-6 w-fit rounded-sm px-1.5 py-1 font-medium">
      {type}
    </div>
  );
}
