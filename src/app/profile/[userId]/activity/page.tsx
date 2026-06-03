import Header from "@/components/common/Header";
import { ProfileActivityItem } from "@/components/profile/ProfileActivityItem";
import { mockActivities } from "../../mockData";

export default function ActivityInfoPage() {
  return (
    <>
      <Header title="활동 정보" showBack />
      <div className="px-5 pt-4">
        {mockActivities.map(activity => (
          <ProfileActivityItem key={activity.id} activity={activity} />
        ))}
      </div>
    </>
  );
}
