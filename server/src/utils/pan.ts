export const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

export function isValidPan(pan: string): boolean {
  return PAN_REGEX.test(pan.trim().toUpperCase());
}
