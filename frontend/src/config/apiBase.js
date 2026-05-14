/**
 * Node API origin — set only via VITE_API_BASE_URL (no default URL in source).
 */
const raw = import.meta.env.VITE_API_BASE_URL;
const trimmed = typeof raw === 'string' ? raw.trim() : '';
export const API_BASE = trimmed ? trimmed.replace(/\/$/, '') : '';

export function requireApiBase() {
  if (!API_BASE) {
    throw new Error('VITE_API_BASE_URL is not set. Add it to your .env file.');
  }
  return API_BASE;
}
