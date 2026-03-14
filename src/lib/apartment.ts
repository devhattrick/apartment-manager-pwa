import type { Contract, Guest, Room, RoomStatus } from '../types';

export function getStatusLabel(status: RoomStatus, lang: 'th' | 'en') {
  const map = {
    AVAILABLE: { th: 'ว่าง', en: 'Available' },
    RESERVED: { th: 'จองแล้ว', en: 'Reserved' },
    OCCUPIED: { th: 'ไม่ว่าง', en: 'Occupied' },
    CLEANING: { th: 'กำลังทำความสะอาด', en: 'Cleaning' },
    MAINTENANCE: { th: 'ซ่อมบำรุง', en: 'Maintenance' },
  };

  return map[status][lang];
}

export function getStatusClasses(status: RoomStatus) {
  switch (status) {
    case 'AVAILABLE':
      return 'bg-green-100 text-green-700 border-green-200';
    case 'RESERVED':
      return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    case 'OCCUPIED':
      return 'bg-red-100 text-red-700 border-red-200';
    case 'CLEANING':
      return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'MAINTENANCE':
      return 'bg-slate-200 text-slate-700 border-slate-300';
    default:
      return 'bg-slate-100 text-slate-700 border-slate-200';
  }
}

export function getActiveContractByRoomId(
  roomId: string,
  contracts: Contract[]
) {
  return contracts.find(
    (contract) =>
      contract.roomId === roomId &&
      (contract.status === 'ACTIVE' || contract.status === 'RESERVED')
  );
}

export function getGuestById(guestId: string | undefined, guests: Guest[]) {
  if (!guestId) return undefined;
  return guests.find((guest) => guest.id === guestId);
}

export function groupRoomsByFloor(rooms: Room[]) {
  return rooms.reduce<Record<number, Room[]>>((acc, room) => {
    if (!acc[room.floor]) {
      acc[room.floor] = [];
    }
    acc[room.floor].push(room);
    return acc;
  }, {});
}