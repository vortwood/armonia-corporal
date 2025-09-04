"use client";

import { usePathname } from "next/navigation";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import { AppSidebar } from "./AppSidebar";
import { MobileNav } from "./MobileNav";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isPanelRoute = pathname.startsWith("/panel");

  if (!isPanelRoute) {
    return <>{children}</>;
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <MobileNav />
        <div className="flex flex-1 flex-col gap-4 px-4 pt-5 lg:px-6 lg:pt-10">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
