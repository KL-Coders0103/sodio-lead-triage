import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function createManagedField<T>(value: T) {
  return {
    extracted: value,
    value: value,
    isOverridden: false,
  };
}