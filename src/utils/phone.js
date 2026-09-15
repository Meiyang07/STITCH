export function digitsOnly(value = '') {
  return String(value).replace(/\D/g, '').slice(0, 10);
}

export function isValidPhone(value = '') {
  return /^\d{10}$/.test(String(value));
}
