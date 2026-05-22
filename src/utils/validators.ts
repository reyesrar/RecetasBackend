export const validateEmail = (email: string): boolean => {
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): {
  valid: boolean;
  message?: string;
} => {
  if (password.length < 6) {
    return {
      valid: false,
      message: 'Password must be at least 6 characters long',
    };
  }
  return { valid: true };
};

export const validateName = (name: string): {
  valid: boolean;
  message?: string;
} => {
  if (name.length < 2) {
    return {
      valid: false,
      message: 'Name must be at least 2 characters long',
    };
  }
  if (name.length > 50) {
    return {
      valid: false,
      message: 'Name cannot exceed 50 characters',
    };
  }
  return { valid: true };
};