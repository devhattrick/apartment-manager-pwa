import type { ApiContract, ApiGuest, ApiRoom } from '../model/api';
import type { Contract, Guest, Room } from '../model/domain';

export function mapApiRoomToDomain(input: ApiRoom): Room {
  return {
    id: input.id,
    roomNumber: input.room_no,
    floor: input.floor_no,
    building: input.building_name,
    roomType: input.room_type,
    defaultDailyPrice: input.default_daily_price,
    defaultMonthlyPrice: input.default_monthly_price,
    status: input.status_code,
  };
}

export function mapApiGuestToDomain(input: ApiGuest): Guest {
  return {
    id: input.id,
    firstName: input.first_name,
    lastName: input.last_name,
    phone: input.phone,
  };
}

export function mapApiContractToDomain(input: ApiContract): Contract {
  return {
    id: input.id,
    roomId: input.room_id,
    guestId: input.guest_id,
    stayType: input.stay_type,
    price: input.price,
    checkInDate: input.check_in_date,
    checkOutDate: input.check_out_date,
    status: input.status,
  };
}
