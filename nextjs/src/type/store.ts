// type/store.ts
export interface StoreBase {
  name: string;
  name_ruby: string;
  postal_code: string;
  prefecture: string;
  street: string;
  address: string;
  building: string;
  phone_number: string;
}

export interface StoreCreate extends StoreBase {}

export interface Store extends StoreBase {
  id: number;
  created_at: Date;
  updated_at: Date;
}