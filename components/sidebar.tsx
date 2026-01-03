"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  GitPullRequest,
  FolderGit2,
  BarChart3,
  CreditCard,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Pull Requests",
    href: "/dashboard/reviews",
    icon: GitPullRequest,
  },
  {
    title: "Repositories",
    href: "/dashboard/repositories",
    icon: FolderGit2,
  },
  {
    title: "Analytics",
    href: "/dashboard/analytics",
    icon: BarChart3,
  },
  {
    title: "Billing",
    href: "/dashboard/billing",
    icon: CreditCard,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 w-64 border-r border-white/10 bg-black">
      <div className="flex h-full flex-col">
        {/* LOGO */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-white/10">
          <div className="h-8 w-8 rounded-full bg-blue-500" />
          <span className="text-lg font-semibold text-white">CodeHopper</span>
        </div>

        {/* NAV */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition",
                  active
                    ? "bg-white/10 text-white"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.title}
              </Link>
            );
          })}
        </nav>

        {/* FOOTER */}
        <div className="px-6 py-4 border-t border-white/10 text-xs text-gray-500">
          © {new Date().getFullYear()} CodeHopper
        </div>
      </div>
    </aside>
  );
}
