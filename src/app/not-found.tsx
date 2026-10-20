import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Home } from "@/components/icons";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12 text-center">
      <div className="mb-4 flex items-center justify-center">
        <Image
          src="/jostum-logo.png"
          alt="JOSTUM Crest"
          width={72}
          height={76}
          className="h-16 w-auto object-contain drop-shadow-sm opacity-90"
        />
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
