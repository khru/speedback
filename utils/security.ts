/**
 * Removes HTML tags and potentially dangerous characters from input.
 * Prevents XSS when rendering user content or using it in non-React contexts.
 */
export const sanitizeInput = (input: string): string => {
  if (!input) return '';
  
  // 1. Remove HTML tags
  let clean = input.replace(/<\/?[^>]+(>|$)/g, "");
  
  // 2. Remove control characters (except newlines/tabs if needed, but for names we strip them)
  clean = clean.replace(/[\x00-\x1F\x7F]/g, "");
  
  // 3. Prevent excessive length (DoS prevention via memory)
  clean = clean.substring(0, 50);
  
  return clean.trim();
};

/**
 * Escapes strings for CSV export to prevent Formula Injection (CSV Injection).
 * If a field starts with =, +, -, or @, Excel/Sheets might execute it.
 */
export const sanitizeForCSV = (input: string): string => {
  const clean = sanitizeInput(input);
  
  // If it looks like a formula, prepend a single quote to force text mode
  if (/^[=+\-@]/.test(clean)) {
    return "'" + clean;
  }
  
  // Escape double quotes by doubling them (CSV standard)
  return clean.replace(/"/g, '""');
};