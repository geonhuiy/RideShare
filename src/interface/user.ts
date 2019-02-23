export interface User {
  user_id?: number;
  username: string;
  password?: string;
  email?: string;
  full_name?: string;
  date_created?: Date;
}

export interface LoginResponse {
  message: string;
  token: string;
  user: User;
}

export interface RegisteredResponse {
  message: string;
  user_id: number;
}
