"use client";

import * as React from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Lock,
  Mail,
  Loader2,
  ArrowRight,
  Eye,
  EyeOff,
  GraduationCap,
  ShieldCheck,
  AlertCircle,
} from "@/components/icons";
import { toast } from "sonner";
import { loginSchema, LoginFormData } from "@/lib/validation";
import { useLogin } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ThemeToggle } from "@/components/layout/theme-toggle";

export default function LoginPage() {
  const loginMutation = useLogin();
  const [showPassword, setShowPassword] = React.useState(false);
  const [isRedirecting, setIsRedirecting] = React.useState(false);
  const [sessionExpired, setSessionExpired] = React.useState(false);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("expired") === "true") {
        setSessionExpired(true);
        toast.error("Your session has expired. Please sign in again.");
        window.history.replaceState({}, "", window.location.pathname);
      }
    }
  }, []);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const isPending = loginMutation.isPending || isSubmitting || isRedirecting;

  const onSubmit = async (data: LoginFormData) => {
    if (isPending) return;
    try {
      const user = await loginMutation.mutateAsync(data);
      setIsRedirecting(true);
      toast.success("Signed in successfully. Redirecting to portal...");
      const target =
        user?.role === "STUDENT"
          ? "/student"
          : user?.role === "ADVISER"
          ? "/adviser"
          : user?.role === "ADMIN"
          ? "/admin"
          : "/student";
      window.location.href = target;
    } catch (err: any) {
      setIsRedirecting(false);
      toast.error(err?.message || "Invalid email or password");
    }
  };

  const handleDemoFill = (email: string) => {
    if (isPending) return;
    setValue("email", email, { shouldValidate: true });
    setValue("password", "Password123!", { shouldValidate: true });
  };

  return (
    <main className="relative flex min-h-screen w-full items-center justify-center px-4 py-12 sm:px-6">
      {/* Background: Campus Entrance Photo with JOSTUM Green Overlay */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none select-none">
        <Image
          src="/jostum-campus.jpg"
          alt="Joseph Sarwuan Tarka University Campus Entrance"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center scale-105 transition-transform duration-1000 ease-out"
          quality={85}
        />
        {/* Deep JOSTUM emerald green tint / multiply overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#02271d]/90 via-[#054635]/80 to-[#022F24]/95 mix-blend-multiply" />
        {/* Subtle radial vignette & backdrop blur */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_rgba(2,47,36,0.65)_100%)] backdrop-blur-[2px]" />
      </div>

      {/* Top right glass theme toggle */}
      <div className="absolute right-4 top-4 z-20 rounded-full bg-white/20 dark:bg-black/30 backdrop-blur-md border border-white/30 dark:border-white/10 p-1 shadow-lg transition-transform hover:scale-105">
        <ThemeToggle />
      </div>

      {/* Center Auth Card */}
      <div className="relative z-10 w-full max-w-[430px]">
        <div className="overflow-hidden rounded-3xl bg-white/95 dark:bg-card/95 backdrop-blur-xl shadow-2xl border border-white/40 dark:border-white/10">
          {/* Top accent gradient bar (JOSTUM green -> gold) */}
          <div className="h-2 w-full bg-gradient-to-r from-emerald-500 via-[#0A8760] to-[#EF960A]" />

          {/* Card Header with Crest and Branding */}
          <div className="pt-6 pb-4 px-6 sm:px-8 flex flex-col items-center text-center">
            {/* Circular Crest Badge */}
            <div className="relative mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-white p-2.5 shadow-md ring-4 ring-emerald-500/10 transition-transform hover:scale-105">
              <Image
                src="/jostum-logo.png"
                alt="Joseph Sarwuan Tarka University Logo"
                width={72}
                height={72}
                className="h-full w-full object-contain"
                priority
              />
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Portal Sign In
            </h1>
            <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Joseph Sarwuan Tarka University, Makurdi
            </p>

            {/* Department Tracker Badge */}
            <div className="mt-2.5 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 text-[11px] font-medium text-emerald-800 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/40">
              <GraduationCap className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Computer Science Eligibility Tracker</span>
            </div>
          </div>

          {/* Form Content */}
          <div className="px-6 sm:px-8 pb-6">
            {sessionExpired && (
              <div
                role="alert"
                className="mb-4 flex items-start gap-2.5 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-900 dark:text-amber-200"
              >
                <AlertCircle className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
                <div>
                  <p className="font-semibold">Session Expired</p>
                  <p className="mt-0.5 text-[11px] text-amber-800/90 dark:text-amber-200/80">
                    Your access session has timed out. Please enter your credentials to log in again.
                  </p>
                </div>
              </div>
            )}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
              {/* Institutional Email Field */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="email"
                  className="text-xs font-semibold text-slate-700 dark:text-slate-200"
                >
                  Institutional Email
                </Label>
                <div className="relative flex items-center rounded-xl bg-slate-100/90 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all">
                  <div className="pointer-events-none absolute left-3.5 flex items-center text-emerald-600 dark:text-emerald-400">
                    <Mail className="h-4 w-4" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    placeholder="student@cs.edu.ng"
                    className="h-11 w-full bg-transparent pl-10 pr-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                    autoComplete="email"
                    disabled={isPending}
                    aria-invalid={errors.email ? "true" : "false"}
                    {...register("email")}
                  />
                </div>
                {errors.email && (
                  <p className="text-xs font-medium text-destructive mt-1" role="alert">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="password"
                  className="text-xs font-semibold text-slate-700 dark:text-slate-200"
                >
                  Password
                </Label>
                <div className="relative flex items-center rounded-xl bg-slate-100/90 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all">
                  <div className="pointer-events-none absolute left-3.5 flex items-center text-emerald-600 dark:text-emerald-400">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••••••"
                    className="h-11 w-full bg-transparent pl-10 pr-10 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                    autoComplete="current-password"
                    disabled={isPending}
                    aria-invalid={errors.password ? "true" : "false"}
                    {...register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    disabled={isPending}
                    className="absolute right-3 text-muted-foreground hover:text-foreground transition-colors p-1 rounded-sm focus:outline-none disabled:opacity-50 disabled:pointer-events-none"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs font-medium text-destructive mt-1" role="alert">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Sign In CTA Button */}
              <Button
                type="submit"
                className="w-full h-11 mt-2 rounded-xl bg-[#054635] hover:bg-[#022F24] dark:bg-emerald-700 dark:hover:bg-emerald-600 text-white font-semibold shadow-md shadow-[#054635]/20 gap-2 transition-all active:scale-[0.99] group disabled:opacity-70 disabled:cursor-not-allowed"
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {isRedirecting ? "Redirecting to portal..." : "Signing in..."}
                  </>
                ) : (
                  <>
                    Sign In to Portal
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </Button>
            </form>
          </div>

          {/* Quick Demo Credentials Assistant */}
          <div className="border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-50/80 dark:bg-slate-950/40 p-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                Demo Accounts (Click to Fill)
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1.5 text-xs">
              <button
                type="button"
                onClick={() => handleDemoFill("student_a_eligible@cs.edu.ng")}
                disabled={isPending}
                className="h-8 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-2 text-[11px] font-medium text-slate-700 dark:text-slate-300 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 dark:hover:bg-emerald-950/40 dark:hover:text-emerald-300 transition-colors truncate text-center disabled:opacity-50 disabled:pointer-events-none"
                title="Student (Eligible)"
              >
                Student (Eligible)
              </button>
              <button
                type="button"
                onClick={() => handleDemoFill("student_b_shortunits@cs.edu.ng")}
                disabled={isPending}
                className="h-8 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-2 text-[11px] font-medium text-slate-700 dark:text-slate-300 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 dark:hover:bg-emerald-950/40 dark:hover:text-emerald-300 transition-colors truncate text-center disabled:opacity-50 disabled:pointer-events-none"
                title="Student (Short)"
              >
                Student (Short)
              </button>
              <button
                type="button"
                onClick={() => handleDemoFill("adviser1@cs.edu.ng")}
                disabled={isPending}
                className="h-8 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-2 text-[11px] font-medium text-slate-700 dark:text-slate-300 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 dark:hover:bg-emerald-950/40 dark:hover:text-emerald-300 transition-colors truncate text-center disabled:opacity-50 disabled:pointer-events-none"
                title="Adviser"
              >
                Adviser
              </button>
            </div>
            <div className="grid grid-cols-2 gap-1.5 text-xs">
              <button
                type="button"
                onClick={() => handleDemoFill("student_j_de_eligible@cs.edu.ng")}
                disabled={isPending}
                className="h-8 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-2 text-[11px] font-medium text-slate-700 dark:text-slate-300 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 dark:hover:bg-emerald-950/40 dark:hover:text-emerald-300 transition-colors truncate text-center disabled:opacity-50 disabled:pointer-events-none"
                title="Direct Entry"
              >
                Direct Entry
              </button>
              <button
                type="button"
                onClick={() => handleDemoFill("admin@cs.edu.ng")}
                disabled={isPending}
                className="h-8 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-2 text-[11px] font-medium text-slate-700 dark:text-slate-300 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 dark:hover:bg-emerald-950/40 dark:hover:text-emerald-300 transition-colors truncate text-center disabled:opacity-50 disabled:pointer-events-none"
                title="Exam Officer / Admin"
              >
                Exam Officer / Admin
              </button>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-5 text-center text-xs text-white/85 max-w-sm mx-auto leading-relaxed drop-shadow-sm space-y-1">
          <p className="font-semibold text-white">
            Joseph Sarwuan Tarka University, Makurdi
          </p>
          <p className="text-[11px] text-white/75">
            Department of Computer Science • Graduation Clearance Portal
          </p>
        </div>
      </div>
    </main>
  );
}
