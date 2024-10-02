// src/components/Layout.tsx

import { ReactNode } from "react";
import { SidebarComponent } from "./SidebarComponent";
import { useRecoilState } from "recoil";
import { isSidebarCollapsedAtom } from "../recoil/IsSidebarCollapesd";

interface LayoutProps {
  children: ReactNode;
}
export default function Layout({ children }: LayoutProps) {
  const [isSidebarCollapsed] = useRecoilState(isSidebarCollapsedAtom);

  return (
    <div className="custom-scrollbar ">
      <SidebarComponent />
      <div className={`flex-1 ${isSidebarCollapsed ? "pl-12" : "pl-60"} -z-10`}>
        {children}
      </div>
    </div>
  );
}
