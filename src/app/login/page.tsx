"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { GraduationCap, Lock, Mail, Loader2, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { loginSchema, LoginFormData } from "@/lib/validation";
import { useLogin } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ThemeToggle } from "@/components/layout/theme-toggle";

export default function LoginPage() {
  const loginMutation = useLogin();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const user = await loginMutation.mutateAsync(data);
      toast.success("Signed in successfully");
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
      toast.error(err?.message || "Invalid email or password");
    }
  };

  const handleDemoFill = (email: string) => {
    setValue("email", email, { shouldValidate: true });
    setValue("password", "Password123!", { shouldValidate: true });
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      {/* Top right theme toggle */}
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md space-y-8">
        {/* Header Branding */}
        <div className="flex flex-col items-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-md mb-4">
            <GraduationCap className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Department of Computer Science
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Academic Eligibility Tracking System for Graduation Status Monitoring
          </p>
        </div>

        {/* Login Card */}
        <Card className="border shadow-lg">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl font-semibold">Sign in</CardTitle>
            <CardDescription>
              Enter your institutional credentials to check graduation eligibility
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Institutional Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="student@cs.edu.ng"
                    className="pl-9"
                    autoComplete="email"
                    disabled={loginMutation.isPending}
                    aria-invalid={errors.email ? "true" : "false"}
                    {...register("email")}
                  />
                </div>
                {errors.email && (
                  <p className="text-xs font-medium text-destructive" role="alert">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password
                  </Label>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••••••"
                    className="pl-9"
                    autoComplete="current-password"
                    disabled={loginMutation.isPending}
                    aria-invalid={errors.password ? "true" : "false"}
                    {...register("password")}
                  />
                </div>
                {errors.password && (
                  <p className="text-xs font-medium text-destructive" role="alert">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full gap-2 mt-2"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in to Portal
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>

          {/* Quick Demo Credentials Assistant */}
          <CardFooter className="flex flex-col border-t bg-muted/20 p-4 space-y-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Demo Credentials (Click to prefill)
            </span>
            <div className="grid grid-cols-3 gap-2 w-full text-xs">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-[11px] h-8 truncate"
                onClick={() => handleDemoFill("student_a_eligible@cs.edu.ng")}
              >
                Student (Eligible)
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-[11px] h-8 truncate"
                onClick={() => handleDemoFill("student_b_shortunits@cs.edu.ng")}
              >
                Student (Short)
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-[11px] h-8 truncate"
                onClick={() => handleDemoFill("adviser1@cs.edu.ng")}
              >
                Adviser
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-2 w-full text-xs">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-[11px] h-8 truncate"
                onClick={() => handleDemoFill("student_j_de_eligible@cs.edu.ng")}
              >
                Direct Entry
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-[11px] h-8 truncate"
                onClick={() => handleDemoFill("admin@cs.edu.ng")}
              >
                Exam Officer / Admin
              </Button>
            </div>
          </CardFooter>
        </Card>

        {/* Footer Note */}
        <p className="text-center text-xs text-muted-foreground">
          Academic Eligibility Tracking System • Computer Science Dept.
        </p>
      </div>
    </div>
  );
}
