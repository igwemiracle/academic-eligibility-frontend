import Link from "next/link";
import { GraduationCap, ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground mb-4">
        <GraduationCap className="h-8 w-8" />
      </div>
      <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        Page Not Found (404)
      </h1>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        The academic portal page you requested does not exist or may have been relocated.
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Button asChild className="gap-2">
          <Link href="/">
            <Home className="h-4 w-4" />
            Return to Dashboard
          </Link>
        </Button>
      </div>
    </div>
  );
}
