"use client";

import { useState } from "react";

import { Search } from "lucide-react";
import DaumPostcode, { Address } from "react-daum-postcode";
import { Drawer } from "vaul";

interface AddressBottomSheetProps {
  value?: string;
  onChange: (address: string) => void;
}

export default function AddressBottomSheet({ value, onChange }: AddressBottomSheetProps) {
  const [open, setOpen] = useState(false);

  const handleComplete = (data: Address) => {
    let fullAddress = data.address;

    let extraAddress = "";

    if (data.bname) {
      extraAddress += data.bname;
    }

    if (data.buildingName) {
      extraAddress += extraAddress ? `, ${data.buildingName}` : data.buildingName;
    }

    if (extraAddress) {
      fullAddress += ` (${extraAddress})`;
    }

    onChange(fullAddress);
    setOpen(false);
  };

  return (
    <>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="border-border-primary flex h-12.5 w-full items-center justify-between rounded-lg border px-4 transition-colors"
      >
        <span className={`text-body-1 ${value ? "text-text-primary" : "text-text-input"}`}>
          {value || "도로명 주소 검색하기"}
        </span>
        <Search size={20} />
      </button>

      {/* BottomSheet */}
      <Drawer.Root open={open} onOpenChange={setOpen}>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 z-40 bg-black/20" />

          <Drawer.Content className="bg-bg-primary fixed right-0 bottom-0 left-0 z-50 mx-auto flex h-[60vh] w-full flex-col rounded-t-3xl outline-none">
            {/* 접근성 */}
            <Drawer.Title className="sr-only">도로명 주소 검색</Drawer.Title>

            <Drawer.Description className="sr-only">원하는 주소를 검색해주세요.</Drawer.Description>

            {/* Handle */}
            <div className="flex justify-center pt-3">
              <div className="h-1.25 w-9 rounded-full bg-black" />
            </div>

            {/* Header */}
            <div className="px-5 pt-3 pb-4">
              <h2 className="text-heading-2 text-text-primary font-semibold">도로명 주소 검색</h2>
            </div>

            {/* Postcode */}
            <div className="flex-1 overflow-hidden">
              <DaumPostcode
                onComplete={handleComplete}
                style={{
                  width: "100%",
                  height: "100%",
                }}
              />
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </>
  );
}
