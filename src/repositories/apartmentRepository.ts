import type { Contract, Guest, Room } from '../types';

export type CreateGuestPayload = Omit<Guest, 'id'>;
export type CreateContractPayload = Omit<Contract, 'id'>;
export type UpdateContractPayload = Partial<Omit<Contract, 'id'>>;
export type ActionResult = {
  success: boolean;
  message?: string;
};

export interface ApartmentRepository {
  getRooms(): Promise<Room[]>;
  getGuests(): Promise<Guest[]>;
  getContracts(): Promise<Contract[]>;
  createGuest(payload: CreateGuestPayload): Promise<string>;
  createContract(payload: CreateContractPayload): Promise<ActionResult>;
  updateContract(contractId: string, payload: UpdateContractPayload): Promise<ActionResult>;
  updateContractStatus(contractId: string, status: Contract['status']): Promise<void>;
  updateRoomStatus(
    roomId: string,
    status: 'AVAILABLE' | 'CLEANING' | 'MAINTENANCE'
  ): Promise<ActionResult>;
}