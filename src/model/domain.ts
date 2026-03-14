export type RoomStatus =
  | 'AVAILABLE'
  | 'RESERVED'
  | 'OCCUPIED'
  | 'CLEANING'
  | 'MAINTENANCE';

export type StayType = 'DAILY' | 'MONTHLY';

export interface Room {
  id: string;
  roomNumber: string;
  floor: number;
  building?: string;
  roomType?: string;
  defaultDailyPrice?: number;
  defaultMonthlyPrice?: number;
  status: RoomStatus;
}

export interface Guest {
  id: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface Contract {
  id: string;
  roomId: string;
  guestId: string;
  stayType: StayType;
  price: number;
  checkInDate: string;
  checkOutDate: string;
  status: 'ACTIVE' | 'RESERVED' | 'COMPLETED' | 'CANCELLED';
}