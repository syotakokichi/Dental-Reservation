// src/type/staff.ts
export interface StaffBase {
  role_id: number;
  store_id: number;
}

export interface StaffCreate extends StaffBase {
  password: string;
  staff_attributes: StaffAttributeBase;
}

export interface Staff extends StaffBase {
  id: number;
  staff_attributes: StaffAttribute[];
}

export interface StaffAttributeBase {
  name: string;
  name_ruby: string;
  mail_address: string;
}

export interface StaffAttribute extends StaffAttributeBase {
  id: number;
  staff_id: number;
}