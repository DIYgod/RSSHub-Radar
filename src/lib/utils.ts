import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function removeFunctionFields(obj) {
  for (var key in obj) {
    if (typeof obj[key] === 'function') {
      delete obj[key];
    } else if (typeof obj[key] === 'object') {
      removeFunctionFields(obj[key]);
    }
  }
}