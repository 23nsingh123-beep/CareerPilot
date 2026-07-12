/**
 * Utility function to combine Tailwind CSS class names conditionally
 */
export function cn(...inputs) {
  return inputs.filter(Boolean).join(' ')
}
