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

export type AddTodo = {
  title: string;
  description: string;
  date?: string;
};

export type EditTodo = {
  id: string;
  title: string;
  description: string;
  date?: string;
};

export type GetTodo = {
  id: string;
  title: string;
  description: string;
  date?: string;
};

export type DeleteTodo = {
  id: string;
};
