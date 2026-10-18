"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  GraduationCap,
  LayoutDashboard,
  FileText,
  Settings,
  Users,
  BarChart3,
  BookOpen,
  Calendar,
  Award,
  Sliders,
  History,
  LogOut,
  Menu,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import { useCurrentUser, useLogout } from "@/hooks/use-auth";
import { Role } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: Role[];
}

const NAV_ITEMS: NavItem[] = [
  // Student links
  {
    title: "Eligibility Overview",
    href: "/student",
    icon: LayoutDashboard,
    roles: ["STUDENT"],
  },
  {
    title: "Academic Transcript",
    href: "/student/results",
    icon: FileText,
    roles: ["STUDENT"],
  },
  {
    title: "Account Settings",
    href: "/student/settings",
    icon: Settings,
    roles: ["STUDENT"],
  },

  // Adviser links
  {
    title: "Assigned Students",
    href: "/adviser",
    icon: Users,
    roles: ["ADVISER"],
  },

  // Admin links
  {
    title: "Department Stats",
    href: "/admin",
    icon: BarChart3,
    roles: ["ADMIN"],
  },
  {
    title: "User Directory",
    href: "/admin/users",
    icon: Users,
    roles: ["ADMIN"],
  },
  {
    title: "Curriculum Courses",
    href: "/admin/courses",
    icon: BookOpen,
    roles: ["ADMIN"],
  },
  {
    title: "Academic Sessions",
    href: "/admin/sessions",
    icon: Calendar,
    roles: ["ADMIN"],
  },
  {
    title: "Results & Import",
    href: "/admin/results",
    icon: Award,
    roles: ["ADMIN"],
  },
  {
    title: "Graduation Rules",
    href: "/admin/requirements",
    icon: Sliders,
    roles: ["ADMIN"],
  },
  {
    title: "Audit Trail",
    href: "/admin/audit-logs",
    icon: History,
    roles: ["ADMIN"],
  },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: user } = useCurrentUser();
  const logoutMutation = useLogout();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const role = user?.role || "STUDENT";
  const userNavItems = NAV_ITEMS.filter((item) => item.roles.includes(role));

  const getRoleBadgeVariant = (userRole: Role) => {
    switch (userRole) {
      case "ADMIN":
        return "destructive";
      case "ADVISER":
        return "info";
      default:
        return "secondary";
    }
  };

  const getRoleDisplayTitle = (userRole: Role) => {
    switch (userRole) {
      case "ADMIN":
        return "Admin / Exam Officer";
      case "ADVISER":
        return "Academic Adviser";
      default:
        return "Student";
    }
  };

  const userInitials = user?.fullName
    ? user.fullName
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "U";

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r bg-card/60 backdrop-blur-sm">
        {/* Brand Header */}
        <div className="flex h-16 items-center gap-3 border-b px-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-sm leading-tight text-foreground">
              Academic Eligibility
            </span>
            <span className="text-xs text-muted-foreground">
              Dept. of Computer Science
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-1.5 p-4" aria-label="Main Navigation">
          {userNavItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== "/student" &&
                item.href !== "/adviser" &&
                item.href !== "/admin" &&
                pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{item.title}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Card in Sidebar Bottom */}
        <div className="border-t p-4">
          <div className="flex items-center gap-3 rounded-lg border bg-muted/40 p-3">
            <Avatar className="h-9 w-9">
              <AvatarFallback>{userInitials}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="truncate text-xs font-semibold text-foreground">
                {user?.fullName || "Authenticated User"}
              </span>
              <span className="truncate text-[11px] text-muted-foreground">
                {user?.matricNumber || user?.email}
              </span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Top Navbar */}
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-background/95 px-4 sm:px-6 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            {/* Mobile Sheet Trigger */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="md:hidden"
                  aria-label="Open mobile navigation menu"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 p-0">
                <SheetHeader className="border-b p-6 text-left">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                      <GraduationCap className="h-5 w-5" />
                    </div>
                    <div>
                      <SheetTitle className="text-sm font-semibold">
                        Academic Eligibility
                      </SheetTitle>
                      <p className="text-xs text-muted-foreground">
                        Dept. of Computer Science
                      </p>
                    </div>
                  </div>
                </SheetHeader>
                <nav className="space-y-1.5 p-4">
                  {userNavItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={cn(
                          "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                          isActive
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:bg-accent hover:text-foreground"
                        )}
                      >
                        <Icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    );
                  })}
                </nav>
              </SheetContent>
            </Sheet>

            {/* Department Label */}
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-sm font-medium text-foreground">
                Graduation Monitoring Portal
              </span>
              <span className="text-muted-foreground text-xs">•</span>
              <span className="text-xs text-muted-foreground">Session 2023/2024</span>
            </div>
          </div>

          {/* Top Right Controls */}
          <div className="flex items-center gap-3">
            {/* User Role Badge */}
            {user && (
              <Badge
                variant={getRoleBadgeVariant(user.role) as any}
                className="hidden sm:inline-flex items-center gap-1.5 font-medium text-xs py-1"
              >
                {user.role === "ADMIN" && <ShieldCheck className="h-3 w-3" />}
                {user.role === "ADVISER" && <UserCheck className="h-3 w-3" />}
                {getRoleDisplayTitle(user.role)}
              </Badge>
            )}

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Logout Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => logoutMutation.mutate()}
              disabled={logoutMutation.isPending}
              className="gap-2 text-xs font-medium"
              aria-label="Log out of application"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </header>

        {/* Page Content Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
