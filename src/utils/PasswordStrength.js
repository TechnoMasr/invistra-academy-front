export const getPasswordStrength = (password = "") => {
  let score = 0;

  if (password.length >= 6) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  return score; // 0 → 4
};

export const strengthLabel = (score) => {
  switch (score) {
    case 1:
      return "weak";
    case 2:
      return "medium";
    case 3:
      return "strong";
    case 4:
      return "very strong";
    default:
      return "";
  }
};
