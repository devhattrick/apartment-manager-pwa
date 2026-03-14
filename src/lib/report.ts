import type { Contract, Room } from '../types';

export function getActiveContracts(contracts: Contract[]) {
  return contracts.filter(
    (contract) => contract.status === 'ACTIVE' || contract.status === 'RESERVED'
  );
}

export function getOccupancyRate(rooms: Room[]) {
  if (rooms.length === 0) return 0;

  const occupiedCount = rooms.filter(
    (room) => room.status === 'OCCUPIED' || room.status === 'RESERVED'
  ).length;

  return Number(((occupiedCount / rooms.length) * 100).toFixed(1));
}

export function getRoomSummary(rooms: Room[]) {
  return {
    total: rooms.length,
    available: rooms.filter((room) => room.status === 'AVAILABLE').length,
    occupied: rooms.filter((room) => room.status === 'OCCUPIED').length,
    reserved: rooms.filter((room) => room.status === 'RESERVED').length,
    maintenance: rooms.filter((room) => room.status === 'MAINTENANCE').length,
  };
}

export function getRevenueSummary(contracts: Contract[]) {
  const activeContracts = contracts.filter(
    (contract) => contract.status === 'ACTIVE' || contract.status === 'RESERVED'
  );

  const dailyRevenue = activeContracts
    .filter((contract) => contract.stayType === 'DAILY')
    .reduce((sum, contract) => sum + contract.price, 0);

  const monthlyRevenue = activeContracts
    .filter((contract) => contract.stayType === 'MONTHLY')
    .reduce((sum, contract) => sum + contract.price, 0);

  return {
    dailyRevenue,
    monthlyRevenue,
    totalRevenue: dailyRevenue + monthlyRevenue,
  };
}