import type { ApartmentRepository } from '../repositories/apartmentRepository';
import { useApartmentStore } from '../store/useApartmentStore';

export const mockApartmentService: ApartmentRepository = {
  async getRooms() {
    return useApartmentStore.getState().rooms;
  },

  async getGuests() {
    return useApartmentStore.getState().guests;
  },

  async getContracts() {
    return useApartmentStore.getState().contracts;
  },

  async createGuest(payload) {
    return useApartmentStore.getState().addGuest(payload);
  },

  async createContract(payload) {
    return useApartmentStore.getState().addContract(payload);
  },

  async updateContract(contractId, payload) {
    return useApartmentStore.getState().updateContract(contractId, payload);
  },

  async updateContractStatus(contractId, status) {
    useApartmentStore.getState().updateContractStatus(contractId, status);
  },

  async updateRoomStatus(roomId, status) {
    return useApartmentStore.getState().updateRoomStatus(roomId, status);
  },
};