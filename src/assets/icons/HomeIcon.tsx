// src/components/HomeIcon.tsx

import React from "react";

interface HomeIconProps {
  size?: string;
  color?: string;
  hoverColor?: string;
}

export const HomeIcon: React.FC<HomeIconProps> = ({
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
        <path d="M12 2L2 9l1.417 1.417L4 10.25V20h16v-9.75l.583.167L22 9 12 2zm0 2.565l6 4.152V18H6V8.717l6-4.152z" />
      </svg>
    </div>
  );
};
