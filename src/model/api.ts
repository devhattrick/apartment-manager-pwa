export interface ApiRoom {
  id: string;
  room_no: string;
  floor_no: number;
  building_name?: string;
  room_type?: string;
  default_daily_price?: number;
  default_monthly_price?: number;
  status_code: 'AVAILABLE' | 'RESERVED' | 'OCCUPIED' | 'CLEANING' | 'MAINTENANCE';
}

export interface ApiGuest {
  id: string;
  first_name: string;
  last_name: string;
  phone?: string;
}

export interface ApiContract {
  id: string;
  room_id: string;
  guest_id: string;
  stay_type: 'DAILY' | 'MONTHLY';
  price: number;
  check_in_date: string;
  check_out_date: string;
  status: 'ACTIVE' | 'RESERVED' | 'COMPLETED' | 'CANCELLED';
}