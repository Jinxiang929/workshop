/**
 * Tiny classnames helper. Inline (no clsx / tailwind-merge dependency) per
 * IMPLEMENTATION_PLAN §1 task 7: filter falsy values and join with spaces.
 */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ');
}
