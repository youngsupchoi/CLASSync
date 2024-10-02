// src/components/HomeIcon.tsx

import React from "react";

interface BookIconProps {
  size?: string;
  color?: string;
  hoverColor?: string;
}

export const BookIcon: React.FC<BookIconProps> = ({
  size = "w-5 h-5",
  color = "#9EA7B0",
  hoverColor = "white",
}) => {
  return (
    <div
      className={`${size} transition duration-75 group-hover:text-${hoverColor}`}
      style={{ color }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M5 19V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v13H7a2 2 0 0 0-2 2Zm0 0a2 2 0 0 0 2 2h12M9 3v14m7 0v4" />
      </svg>
    </div>
  );
};
