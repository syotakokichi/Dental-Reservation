export interface Token {
  access_token: string;
  token_type: string;
}

export interface TokenData {
  email?: string;
}

export interface StaffLogin {
  email: string;
  password: string;
}

export interface StaffRegister {
  name: string;
  email: string;
  role: string;
  status: string;
  store_id: number;
  password: string;
}