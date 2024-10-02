import type { CustomFlowbiteTheme } from "flowbite-react";

export const SidebarCustomTheme: CustomFlowbiteTheme = {
  sidebar: {
    root: {
      base: "h-full bg-gray-800",
      inner:
        "h-full overflow-y-auto overflow-x-hidden rounded-0 bg-[#1E202A] custom-scrollbar",
      collapsed: {
        on: "w-12",
        off: "w-60",
      },
    },
    item: {
      base: "flex items-center justify-center py-2 px-3 w-full text-base font-normal text-[#9EA7B0] hover:bg-gray-700 hover:text-white cursor-pointer",
      icon: {
        base: "size-5 flex-shrink-0 text-[#9EA7B0] transition duration-75 group-hover:text-white",
        active: "text-white",
      },
    },
    itemGroup: {
      base: "mt-4 space-y-1 border-t border-gray-700 pt-4 first:mt-0 first:border-t-0 first:pt-0",
    },
    logo: {
      base: "flex items-center px-3",
      collapsed: {
        on: "hidden",
        off: "self-center whitespace-nowrap text-xl font-semibold dark:text-white",
      },
      img: "mr-1 sm:h-5 rounded",
    },
    collapse: {
      button:
        "group px-3 py-2 flex w-full items-center rounded-lgtext-base font-normal text-[#9EA7B0] transition duration-75 hover:bg-gray-700 hover:text-white dark:text-white dark:hover:bg-gray-700",
      icon: {
        base: "h-6 w-6 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white",
        open: {
          off: "",
          on: "text-gray-900",
        },
      },
      label: {
        base: "ml-3 flex-1 whitespace-nowrap text-left",
        icon: {
          base: "size-6 transition delay-0 ease-in-out",
          open: {
            on: "rotate-180",
            off: "",
          },
        },
      },
      list: "space-y-2 py-2",
    },
    items: {
      base: "flex flex-col justify-between h-[calc(100vh-4rem)]",
    },
  },
  button: {
    color: {
      gray: "text-[#9EA7B0] bg-[#1E202A] hover:bg-gray-700 hover:text-white focus:ring-gray-700",
    },
  },
};

// 별도의 아이콘 테마 정의
export const iconTheme = {
  size: "w-6 h-6",
  color: "#9EA7B0",
  hoverColor: "white",
};
