"use client";

interface TabItem {
  label: string;
  value: string;
}

interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (value: string) => void;
}

export default function Tabs({ tabs, activeTab, onChange }: TabsProps) {
  return (
    <div className="border-border-primary border-b">
      <div className="flex px-5">
        {tabs.map(tab => {
          const isActive = activeTab === tab.value;

          return (
            <button
              key={tab.value}
              onClick={() => onChange(tab.value)}
              className={`text-body-1 flex-1 cursor-pointer py-4 font-medium transition-colors ${
                isActive
                  ? "text-text-primary-brand border-border-secondary border-b-2"
                  : "text-text-secondary"
              } `}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
