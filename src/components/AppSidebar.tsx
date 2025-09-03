"use client";

import { BarChart, Home, Scissors, Users } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavMain } from "@/components/nav-main";

import LogoutButton from "./LogoutButton";

const data = {
  navMain: [
    {
      title: "Inicio",
      url: "/panel",
      icon: Home,
      isActive: true,
    },
    {
      title: "Profesionales",
      url: "/panel/hairdressers",
      icon: Users,
      isActive: true,
    },
    {
      title: "Servicios",
      url: "/panel/services",
      icon: Scissors,
      isActive: true,
    },
    {
      title: "Estadísticas",
      url: "/panel/stats",
      icon: BarChart,
      isActive: true,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarContent className="pt-10">
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <LogoutButton />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
