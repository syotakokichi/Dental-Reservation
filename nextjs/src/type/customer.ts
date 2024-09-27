// customer.ts
export interface CustomerAttributeBase {
  name: string;
  name_ruby: string;
  mail_address: string;
  phone_number: string;
  sex: 'male' | 'female' | 'unknown';
  postal_code: string;
  prefecture: string;
  street: string;
  address: string;
  building: string;
}

export interface CustomerAttribute extends CustomerAttributeBase {
  id: number;
  customer_id: number;
}

export interface CustomerBase {
  customer_attributes: CustomerAttribute[];
}

export interface CustomerCreate extends CustomerBase {}

export interface Customer extends CustomerBase {
  id: number;
  store_id: number;
  created_at: string | Date;
  updated_at: string | Date;
}