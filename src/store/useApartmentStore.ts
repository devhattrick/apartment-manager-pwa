import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { mockContracts, mockGuests, mockRooms } from '../mocks/apartmentData';
import type { Contract, Guest, Room } from '../types';

type NewGuestInput = Omit<Guest, 'id'>;
type NewContractInput = Omit<Contract, 'id'>;
type UpdateContractInput = Partial<Omit<Contract, 'id'>>;
type ActionResult = {
  success: boolean;
  message?: string;
};

type RoomOperationalStatus = 'AVAILABLE' | 'CLEANING' | 'MAINTENANCE';

function hasBlockingContract(
  contracts: Contract[],
  roomId: string,
  ignoreContractId?: string
) {
  return contracts.some(
    (contract) =>
      contract.roomId === roomId &&
      contract.id !== ignoreContractId &&
      (contract.status === 'ACTIVE' || contract.status === 'RESERVED')
  );
}

function syncRoomsWithContracts(rooms: Room[], contracts: Contract[]) {
  return rooms.map((room) => {
    const hasActive = contracts.some(
      (contract) => contract.roomId === room.id && contract.status === 'ACTIVE'
    );

    const hasReserved = contracts.some(
      (contract) => contract.roomId === room.id && contract.status === 'RESERVED'
    );

    if (hasActive) {
      return { ...room, status: 'OCCUPIED' as const };
    }

    if (hasReserved) {
      return { ...room, status: 'RESERVED' as const };
    }

    if (room.status === 'MAINTENANCE' || room.status === 'CLEANING') {
      return room;
    }

    return { ...room, status: 'AVAILABLE' as const };
  });
}

type ApartmentState = {
  rooms: Room[];
  guests: Guest[];
  contracts: Contract[];
  seedMockData: () => void;
  addGuest: (payload: NewGuestInput) => string;
  addContract: (payload: NewContractInput) => ActionResult;
  updateContract: (contractId: string, payload: UpdateContractInput) => ActionResult;
  updateContractStatus: (contractId: string, status: Contract['status']) => void;
  updateRoomStatus: (roomId: string, status: RoomOperationalStatus) => ActionResult;
};

export const useApartmentStore = create<ApartmentState>()(
  persist(
    (set, get) => ({
      rooms: [],
      guests: [],
      contracts: [],

      seedMockData: () =>
        set((state) => {
          if (
            state.rooms.length > 0 ||
            state.guests.length > 0 ||
            state.contracts.length > 0
          ) {
            return {
              rooms: syncRoomsWithContracts(state.rooms, state.contracts),
            };
          }

          return {
            rooms: syncRoomsWithContracts(mockRooms, mockContracts),
            guests: mockGuests,
            contracts: mockContracts,
          };
        }),

      addGuest: (payload) => {
        const id = `g${Date.now()}`;

        set((state) => ({
          guests: [
            ...state.guests,
            {
              id,
              ...payload,
            },
          ],
        }));

        return id;
      },

      addContract: (payload) => {
        const state = get();
        const room = state.rooms.find((item) => item.id === payload.roomId);

        if (!room) {
          return { success: false, message: 'roomNotFound' };
        }

        if (room.status !== 'AVAILABLE') {
          return { success: false, message: 'roomNotAvailable' };
        }

        if (hasBlockingContract(state.contracts, payload.roomId)) {
          return { success: false, message: 'roomHasBlockingContract' };
        }

        const nextContracts: Contract[] = [
          ...state.contracts,
          {
            id: `c${Date.now()}`,
            ...payload,
          },
        ];

        set({
          contracts: nextContracts,
          rooms: syncRoomsWithContracts(state.rooms, nextContracts),
        });

        return { success: true };
      },

      updateContract: (contractId, payload) => {
        const state = get();
        const currentContract = state.contracts.find((item) => item.id === contractId);

        if (!currentContract) {
          return { success: false, message: 'contractNotFound' };
        }

        const nextContract: Contract = {
          ...currentContract,
          ...payload,
        };

        const targetRoom = state.rooms.find((room) => room.id === nextContract.roomId);

        if (!targetRoom) {
          return { success: false, message: 'roomNotFound' };
        }

        const isBlockingStatus =
          nextContract.status === 'ACTIVE' || nextContract.status === 'RESERVED';

        if (
          isBlockingStatus &&
          hasBlockingContract(state.contracts, nextContract.roomId, currentContract.id)
        ) {
          return { success: false, message: 'roomHasBlockingContract' };
        }

        if (
          isBlockingStatus &&
          nextContract.roomId !== currentContract.roomId &&
          targetRoom.status !== 'AVAILABLE'
        ) {
          return { success: false, message: 'roomUnavailableForEdit' };
        }

        if (
          isBlockingStatus &&
          (targetRoom.status === 'MAINTENANCE' || targetRoom.status === 'CLEANING')
        ) {
          return { success: false, message: 'roomUnavailableForEdit' };
        }

        const nextContracts = state.contracts.map((contract) =>
          contract.id === contractId ? nextContract : contract
        );

        set({
          contracts: nextContracts,
          rooms: syncRoomsWithContracts(state.rooms, nextContracts),
        });

        return { success: true };
      },

      updateContractStatus: (contractId, status) => {
        const state = get();

        const nextContracts = state.contracts.map((contract) =>
          contract.id === contractId ? { ...contract, status } : contract
        );

        set({
          contracts: nextContracts,
          rooms: syncRoomsWithContracts(state.rooms, nextContracts),
        });
      },

      updateRoomStatus: (roomId, status) => {
        const state = get();
        const room = state.rooms.find((item) => item.id === roomId);

        if (!room) {
          return { success: false, message: 'roomNotFound' };
        }

        if (hasBlockingContract(state.contracts, roomId)) {
          return { success: false, message: 'cannotUpdateRoomWithActiveContract' };
        }

        const nextRooms = state.rooms.map((item) =>
          item.id === roomId ? { ...item, status } : item
        );

        set({
          rooms: syncRoomsWithContracts(nextRooms, state.contracts),
        });

        return { success: true };
      },
    }),
    {
      name: 'apartment-data-storage',
    }
  )
);