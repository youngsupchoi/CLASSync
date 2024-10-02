// src/components/NoteTitleComponent.tsx

import { HiCode } from "react-icons/hi";

interface NoteTitleComponentProps {
  title: string;
}

export default function NoteTitleComponent({ title }: NoteTitleComponentProps) {
  return (
    <div className="flex w-48 items-center text-left">
      <div className="flex h-4 w-4 content-center items-center">
        <HiCode className="text-[#A1A1AA]" />
      </div>
      <h6 className="overflow-hidden text-ellipsis pl-2 font-light text-[#A1A1AA] dark:text-white">
        {title}
      </h6>
    </div>
  );
}
