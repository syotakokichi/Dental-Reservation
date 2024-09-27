// src/types/event.ts
export interface StaffAttribute {
  name: string;
  name_ruby: string;
  mail_address: string;
}

export interface Staff {
  id: number;
  role_id: number;
  store_id: number;
  staff_attributes: StaffAttribute;
}

export interface EventBase {
  from_at: Date;
  to_at: Date;
  note?: string;
  title: string;
}

export interface Event extends EventBase {
  id: number;
  store_id: number;
  customer_id: number;
  duration_by_minutes: number;
  status: 'active' | 'canceled';
  created_at: Date;
  updated_at: Date;
  staffs: Staff[];
  staff_ids: number[];
}