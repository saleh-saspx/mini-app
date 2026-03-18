export type LoginResponse = {
  token: string;
  user?: {
    username: string;
    name?: string;
    email?: string;
  };
};

export type Account = {
  username: string;
  subscription: string;
  status?: string;
  created_at?: string;
};

export type Wallet = {
  id: string | number;
  balance: number;
  type: string;
  member_id: string;
};

export type Package = {
  key: string | number;
  name: string;
  price: number;
  time?: string;
  size?: string;
};

export type ApiError = {
  message: string;
  errors?: Record<string, string[]>;
};
