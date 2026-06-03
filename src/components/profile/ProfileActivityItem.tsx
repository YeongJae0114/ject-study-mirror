import { Activity } from "@/types/profile";

interface ProfileActivityItemProps {
  activity: Activity;
}

export const ProfileActivityItem = ({ activity }: ProfileActivityItemProps) => {
  return (
    <div className="border-border-primary flex items-center gap-4 border-b py-4 last:border-b-0">
      <div className="h-18.5 w-18.5 shrink-0 overflow-hidden rounded-lg">
        <img src={activity.imageUrl} alt={activity.title} className="h-full w-full object-cover" />
      </div>
      <div className="flex min-w-0 flex-col justify-center gap-1">
        <h3 className="text-body-1 text-text-primary font-medium">{activity.title}</h3>
        <p className="text-body-2 text-text-secondary font-medium">{activity.period}</p>
        <p className="text-body-2 text-text-secondary truncate font-medium">{activity.location}</p>
      </div>
    </div>
  );
};
