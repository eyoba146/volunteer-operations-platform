import { Role, RolePermissionConfig, PermissionModule, PermissionAction, ScopeLevel } from '../types';
import { store } from './store';
import { INITIAL_ROLE_PERMISSIONS } from './seedData';

export async function getRolePermissions(): Promise<RolePermissionConfig[]> {
  const state = store.getState();
  return state.rolePermissions || INITIAL_ROLE_PERMISSIONS;
}

export async function updateRolePermission(
  role: Role,
  module: PermissionModule,
  actions: PermissionAction[],
  scopeLevel?: ScopeLevel
): Promise<RolePermissionConfig> {
  const state = store.getState();
  const currentUser = store.getCurrentUser();
  const existingIndex = state.rolePermissions.findIndex((rp) => rp.role === role);

  if (existingIndex < 0) {
    throw new Error(`Role config for ${role} not found`);
  }

  const currentConfig = state.rolePermissions[existingIndex];
  const updatedPermissions = {
    ...currentConfig.permissions,
    [module]: actions,
  };

  const updatedConfig: RolePermissionConfig = {
    ...currentConfig,
    permissions: updatedPermissions,
    scopeLevel: scopeLevel || currentConfig.scopeLevel,
  };

  const updatedList = [...state.rolePermissions];
  updatedList[existingIndex] = updatedConfig;

  const now = new Date().toISOString();

  store.setState((prev) => ({
    ...prev,
    rolePermissions: updatedList,
    activityLog: [
      {
        id: `log-${Date.now()}`,
        actorId: currentUser?.id || 'admin',
        actorName: currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'Super Admin',
        actorRole: currentUser?.role || 'admin',
        action: `Updated ${role} permissions for ${module}: [${actions.join(', ')}]`,
        subject: `Role: ${role}`,
        createdAt: now,
      },
      ...prev.activityLog,
    ],
  }));

  return updatedConfig;
}

export async function updateRoleScope(
  role: Role,
  scopeLevel: ScopeLevel
): Promise<RolePermissionConfig> {
  const state = store.getState();
  const currentUser = store.getCurrentUser();
  const existingIndex = state.rolePermissions.findIndex((rp) => rp.role === role);

  if (existingIndex < 0) {
    throw new Error(`Role config for ${role} not found`);
  }

  const currentConfig = state.rolePermissions[existingIndex];
  const updatedConfig: RolePermissionConfig = {
    ...currentConfig,
    scopeLevel,
  };

  const updatedList = [...state.rolePermissions];
  updatedList[existingIndex] = updatedConfig;

  const now = new Date().toISOString();

  store.setState((prev) => ({
    ...prev,
    rolePermissions: updatedList,
    activityLog: [
      {
        id: `log-${Date.now()}`,
        actorId: currentUser?.id || 'admin',
        actorName: currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'Super Admin',
        actorRole: currentUser?.role || 'admin',
        action: `Updated ${role} authority scope boundary to: ${scopeLevel}`,
        subject: `Role: ${role}`,
        createdAt: now,
      },
      ...prev.activityLog,
    ],
  }));

  return updatedConfig;
}

export async function resetRolePermissions(): Promise<RolePermissionConfig[]> {
  const currentUser = store.getCurrentUser();
  const now = new Date().toISOString();

  store.setState((prev) => ({
    ...prev,
    rolePermissions: INITIAL_ROLE_PERMISSIONS,
    activityLog: [
      {
        id: `log-${Date.now()}`,
        actorId: currentUser?.id || 'admin',
        actorName: currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'Super Admin',
        actorRole: currentUser?.role || 'admin',
        action: 'Reset all role permissions to standard baseline',
        subject: 'Roles & Permissions Matrix',
        createdAt: now,
      },
      ...prev.activityLog,
    ],
  }));

  return INITIAL_ROLE_PERMISSIONS;
}
