"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { BarChart, Home, Menu, Scissors, Users } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import LogoutButton from "./LogoutButton";

const data = [
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
];

export function MobileNav() {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);

  return (
    <div className="flex items-center justify-between rounded-xl border-b bg-white p-4 md:hidden">
      <div className="flex items-center gap-2">
        <h1 className="text-lg font-semibold">Armonía Corporal</h1>
      </div>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent
          side="right"
          className="full w-[300px] bg-white px-2 pt-16 pb-5 sm:w-[400px]"
        >
          <div className="grid-1 grid h-full gap-4 py-4">
            <div className="flex flex-col gap-2">
              {data.map((item) => {
                const Icon = item.icon;
                const isActive =
                  pathname === item.url || pathname.endsWith(item.url);

                return (
                  <Link
                    key={item.url}
                    href={item.url}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "text-muted-foreground hover:text-primary flex items-center gap-3 rounded-xl border border-transparent px-3 py-2 text-lg transition-all",
                      isActive && "border-black text-black",
                    )}
                  >
                    <Icon className="h-6 w-6" />
                    {item.title}
                  </Link>
                );
              })}
            </div>
          </div>
          <LogoutButton />
        </SheetContent>
      </Sheet>
    </div>
  );
}
