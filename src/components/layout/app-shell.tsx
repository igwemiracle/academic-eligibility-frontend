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
  HelpCircle,
} from "@/components/icons";
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
  icon: React.ComponentType<{ className?: string; size?: number | string }>;
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

  // Shared Help & Guide link for all roles
  {
    title: "Help & Guide",
    href: "/help",
    icon: HelpCircle,
    roles: ["STUDENT", "ADVISER", "ADMIN"],
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
    <div className="flex h-[100dvh] w-full overflow-hidden bg-background text-foreground font-sans print:h-auto print:overflow-visible">
      {/* Desktop Sidebar - fixed 100dvh with internal scroll container */}
      <aside className="hidden md:flex w-64 h-[100dvh] shrink-0 flex-col border-r border-border bg-card overflow-y-auto print:hidden">
        {/* Brand Header */}
        <div className="flex h-16 items-center gap-3 border-b border-border px-5 shrink-0">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-xs">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-bold text-xs leading-tight tracking-tight text-foreground truncate">
              Computer Science
            </span>
            <span className="text-[11px] font-medium text-primary">
              Eligibility Tracker
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-1.5 p-3" aria-label="Main Navigation">
          {userNavItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== "/student" &&
                item.href !== "/adviser" &&
                item.href !== "/admin" &&
                item.href !== "/help" &&
                pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                <Icon className={cn("h-4 w-4 shrink-0", isActive ? "text-primary-foreground" : "text-muted-foreground")} />
                <span className="truncate">{item.title}</span>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer Info */}
        <div className="border-t border-border p-3 space-y-2.5 shrink-0 bg-muted/20">
          <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-2.5 shadow-xs">
            <Avatar className="h-8 w-8 rounded-lg bg-primary/10 text-primary">
              <AvatarFallback className="text-xs font-bold text-primary">{userInitials}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="truncate text-xs font-semibold text-foreground">
                {user?.fullName || "Authenticated User"}
              </span>
              <span className="truncate text-[10px] text-muted-foreground">
                {user?.matricNumber || user?.email}
              </span>
            </div>
          </div>
          <p className="text-[10px] text-muted-foreground leading-tight px-1">
            Prototype built for the Department of Computer Science, Joseph Sarwuan Tarka University, Makurdi. Not an official university system.
          </p>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col min-w-0 h-[100dvh] overflow-hidden print:h-auto print:overflow-visible">
        {/* Top Navbar */}
        <header className="shrink-0 flex h-16 items-center justify-between border-b border-border bg-card/95 px-4 sm:px-6 backdrop-blur-md z-30 print:hidden">
          <div className="flex items-center gap-3">
            {/* Mobile Sheet Trigger */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="md:hidden rounded-xl"
                  aria-label="Open mobile navigation menu"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 p-0 flex flex-col h-full">
                <SheetHeader className="border-b border-border p-5 text-left shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                      <GraduationCap className="h-5 w-5" />
                    </div>
                    <div>
                      <SheetTitle className="text-xs font-bold text-foreground">
                        Computer Science Eligibility Tracker
                      </SheetTitle>
                      <p className="text-[11px] text-muted-foreground">
                        Dept. of Computer Science
                      </p>
                    </div>
                  </div>
                </SheetHeader>
                <nav className="flex-1 space-y-1.5 p-3 overflow-y-auto">
                  {userNavItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={cn(
                          "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all",
                          isActive
                            ? "bg-primary text-primary-foreground font-semibold"
                            : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                        )}
                      >
                        <Icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    );
                  })}
                </nav>
                <div className="border-t border-border p-4 bg-muted/20 shrink-0">
                  <p className="text-[10px] text-muted-foreground leading-tight">
                    Prototype built for the Department of Computer Science, Joseph Sarwuan Tarka University, Makurdi. Not an official university system.
                  </p>
                </div>
              </SheetContent>
            </Sheet>

            {/* Department Wordmark in Header */}
            <div className="flex items-center gap-2">
              <span className="font-semibold text-xs sm:text-sm text-foreground">
                Graduation Monitoring Portal
              </span>
              <span className="text-muted-foreground text-xs">•</span>
              <span className="text-xs text-muted-foreground hidden sm:inline">Session 2023/2024</span>
            </div>
          </div>

          {/* Top Right Controls */}
          <div className="flex items-center gap-2.5">
            {/* User Role Badge */}
            {user && (
              <Badge
                variant={getRoleBadgeVariant(user.role) as any}
                className="hidden sm:inline-flex items-center gap-1.5 font-medium text-xs py-1 rounded-lg"
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
              className="gap-2 text-xs font-medium rounded-xl hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30"
              aria-label="Log out of application"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </header>

        {/* Scrollable Page Content Viewport */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto flex flex-col justify-between print:overflow-visible print:p-0 print:m-0 print:max-w-none">
          <div className="flex-1">{children}</div>

          {/* App Shell Institutional Footer */}
          <footer className="mt-12 border-t border-border/60 pt-6 pb-4 text-center text-xs text-muted-foreground no-print space-y-1">
            <p className="font-semibold text-foreground">
              Computer Science Eligibility Tracker
            </p>
            <p className="text-[11px] leading-relaxed max-w-2xl mx-auto text-muted-foreground">
              Department of Computer Science, Joseph Sarwuan Tarka University, Makurdi. Official clearance is granted solely by the University Senate and Department Examination Officer.
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
}
