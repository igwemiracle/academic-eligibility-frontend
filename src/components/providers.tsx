"use client";

import * as React from "react";
import { QueryClient, QueryClientProvider, QueryCache, MutationCache } from "@tanstack/react-query";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { Toaster } from "sonner";
import { handleUnauthorized } from "@/lib/api";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        queryCache: new QueryCache({
          onError: (error: any) => {
            if (error?.status === 401) {
              handleUnauthorized();
            }
          },
        }),
        mutationCache: new MutationCache({
          onError: (error: any) => {
            if (error?.status === 401) {
              handleUnauthorized();
            }
          },
        }),
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000, // 5 minutes: data is fresh, instant tab transitions
            gcTime: 15 * 60 * 1000, // 15 minutes: retain in browser memory
            refetchOnWindowFocus: false, // Don't refetch on switching browser tabs
            refetchOnReconnect: false,
            retry: (failureCount, error: any) => {
              if (error?.status === 401 || error?.status === 403 || error?.status === 404) {
                return false;
              }
              return failureCount < 2;
            },
          },
        },
      })
  );

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange
    >
      <QueryClientProvider client={queryClient}>
        {children}
        <Toaster richColors position="top-right" />
      </QueryClientProvider>
    </NextThemesProvider>
  );
}
