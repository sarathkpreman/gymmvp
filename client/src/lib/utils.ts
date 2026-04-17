import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

import { createAuthClient } from '@neondatabase/neon-js/auth';
export const authClient = createAuthClient(
    import.meta.env.VITE_NEON_AUTH_URL
)