import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// The shadcn convention: every component merges its variant classes with the
// caller's, so a consumer can always override a token at the call site.
export function cn(...inputs: ClassValue[]): string {
	return twMerge(clsx(inputs));
}
