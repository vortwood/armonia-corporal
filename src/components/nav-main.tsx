"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { type LucideIcon } from "lucide-react";

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
}) {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => {
          const isActive =
            pathname === item.url || pathname.endsWith(item.url + "/");

          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                tooltip={item.title}
                asChild={!item.items}
                className={` font-normal border border-transparent rounded-xl py-5  px-3 ${isActive ? " border-black text-black" : ""}`}
              >
                <Link href={item.url}>
                  {item.icon && <item.icon className="w-10 h-10" />}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
