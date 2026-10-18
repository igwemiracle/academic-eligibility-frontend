import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCgpa(value: number | null | undefined): string {
  if (value === null || value === undefined || isNaN(value)) return "0.00";
  return Number(value).toFixed(2);
}

export function formatUnits(units: number | null | undefined): string {
  if (units === null || units === undefined || isNaN(units)) return "0";
  return `${units} ${units === 1 ? "unit" : "units"}`;
}
