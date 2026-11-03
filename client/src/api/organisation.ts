import { OrgUnit } from '../types';
import { store } from './store';

export async function getOrgUnits(): Promise<OrgUnit[]> {
  const state = store.getState();
  return state.orgUnits || [];
}

export async function createOrgUnit(data: Omit<OrgUnit, 'id' | 'createdAt'>): Promise<OrgUnit> {
  const state = store.getState();
  const currentUser = store.getCurrentUser();
  const id = `unit-${Date.now()}`;
  const now = new Date().toISOString();

  const newUnit: OrgUnit = {
    ...data,
    id,
    createdAt: now,
    status: data.status || 'active',
  };

  store.setState((prev) => ({
    ...prev,
    orgUnits: [...(prev.orgUnits || []), newUnit],
    activityLog: [
      {
        id: `log-${Date.now()}`,
        actorId: currentUser?.id || 'admin',
        actorName: currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'Super Admin',
        actorRole: currentUser?.role || 'admin',
        action: `Created ${newUnit.type.replace('_', ' ')} unit: ${newUnit.name}`,
        subject: `Unit #${newUnit.id}`,
        createdAt: now,
      },
      ...prev.activityLog,
    ],
  }));

  return newUnit;
}

export async function updateOrgUnit(id: string, patch: Partial<OrgUnit>): Promise<OrgUnit> {
  const state = store.getState();
  const currentUser = store.getCurrentUser();
  const existing = state.orgUnits.find((u) => u.id === id);
  if (!existing) {
    throw new Error(`Organisation unit ${id} not found`);
  }

  const updated: OrgUnit = { ...existing, ...patch };
  const now = new Date().toISOString();

  store.setState((prev) => ({
    ...prev,
    orgUnits: prev.orgUnits.map((u) => (u.id === id ? updated : u)),
    activityLog: [
      {
        id: `log-${Date.now()}`,
        actorId: currentUser?.id || 'admin',
        actorName: currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'Super Admin',
        actorRole: currentUser?.role || 'admin',
        action: `Updated organisation unit: ${updated.name}`,
        subject: `Unit #${id}`,
        createdAt: now,
      },
      ...prev.activityLog,
    ],
  }));

  return updated;
}

export async function moveOrgUnit(id: string, newParentId: string | null): Promise<OrgUnit> {
  return updateOrgUnit(id, { parentId: newParentId });
}

export async function archiveOrgUnit(id: string): Promise<OrgUnit> {
  return updateOrgUnit(id, { status: 'archived' });
}
