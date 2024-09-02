export type SignIn = {
  email: string;
  password: string;
};

export type SignUp = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type ResetPassword = {
  email: string;
};
