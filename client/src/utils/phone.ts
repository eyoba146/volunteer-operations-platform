/**
 * Ethiopian Mobile Phone Number Normalization and Validation
 * Accepts:
 *  - 09XXXXXXXX, 07XXXXXXXX (10 digits)
 *  - +2519XXXXXXXX, +2517XXXXXXXX (13 chars)
 *  - 2519XXXXXXXX, 2517XXXXXXXX (12 digits)
 *  - 9XXXXXXXX, 7XXXXXXXX (9 digits)
 * Tolerates spaces, parentheses, and dashes.
 * Normalizes to: +251XXXXXXXXX
 */
export interface PhoneValidationResult {
  isValid: boolean;
  normalized: string;
  formatted: string;
  error?: string;
}

export function validateAndNormalizeEthiopianPhone(input: string): PhoneValidationResult {
  if (!input || !input.trim()) {
    return {
      isValid: false,
      normalized: '',
      formatted: '',
      error: 'Phone number is required.',
    };
  }

  // Remove spaces, hyphens, parentheses, dots
  const cleaned = input.trim().replace(/[\s\-\(\)\.]/g, '');

  let rawNineOrSeven = '';

  if (/^0[97]\d{8}$/.test(cleaned)) {
    // 0912345678 -> 912345678
    rawNineOrSeven = cleaned.slice(1);
  } else if (/^\+251[97]\d{8}$/.test(cleaned)) {
    // +251912345678 -> 912345678
    rawNineOrSeven = cleaned.slice(4);
  } else if (/^251[97]\d{8}$/.test(cleaned)) {
    // 251912345678 -> 912345678
    rawNineOrSeven = cleaned.slice(3);
  } else if (/^[97]\d{8}$/.test(cleaned)) {
    // 912345678
    rawNineOrSeven = cleaned;
  } else {
    return {
      isValid: false,
      normalized: '',
      formatted: input,
      error: 'Enter a valid Ethiopian mobile number like 0912 345 678 or 0712 345 678.',
    };
  }

  const normalized = `+251${rawNineOrSeven}`;
  // Formatted as +251 91 234 5678 for human presentation
  const formatted = `+251 ${rawNineOrSeven.slice(0, 2)} ${rawNineOrSeven.slice(2, 5)} ${rawNineOrSeven.slice(5)}`;

  return {
    isValid: true,
    normalized,
    formatted,
  };
}

