export function calculateAge(dateOfBirth: Date, asOf = new Date()): number {
  let age = asOf.getFullYear() - dateOfBirth.getFullYear();
  const monthDelta = asOf.getMonth() - dateOfBirth.getMonth();
  const birthdayNotReached =
    monthDelta < 0 || (monthDelta === 0 && asOf.getDate() < dateOfBirth.getDate());

  if (birthdayNotReached) {
    age -= 1;
  }

  return age;
}
