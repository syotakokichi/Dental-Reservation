// type/booking.ts
export interface BookingBase {
  duration_by_minutes: number;
  from_at: Date;
  to_at: Date;
  note?: string;
  details?: Record<string, any>;
  status: 'active' | 'canceled';
  title: string;
}

export interface BookingCreate extends BookingBase {}

export interface BookingUpdate extends BookingBase {}

export interface Booking extends BookingBase {
  id: number;
  store_id: number;
  customer_id: number;
  created_at: Date;
  updated_at: Date;
  staff_ids: number[];
}