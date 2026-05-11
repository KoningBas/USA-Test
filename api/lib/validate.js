/**
 * Validates dagpas form fields.
 * Returns array of field names that failed validation (empty = all valid).
 */
export function validateFields({ naam, adres, email, telefoon }) {
  const errors = [];

  if (!naam || naam.trim().length < 2 || naam.trim().length > 100) {
    errors.push('naam');
  }
  if (!adres || adres.trim().length < 5 || adres.trim().length > 200) {
    errors.push('adres');
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    errors.push('email');
  }
  if (!telefoon || telefoon.trim().length < 6 || telefoon.trim().length > 20) {
    errors.push('telefoon');
  }

  return errors;
}
