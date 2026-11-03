import { User, PermissionModule, PermissionAction } from '../types';
import { store } from '../api/store';

/**
 * Central permissions check for VTS.
 * Evaluates whether a user can perform an action on a module, enforcing:
 * 1. Active Role Permission Matrix from the store (configured by Super Admin).
 * 2. Separation of Duties:
 *    - Nobody can approve or verify an item they created, submitted, or prepared.
 *    - Admin access alone never grants approval of money (payments) or promotions.
 */
export function can(
  user: User | null,
  module: PermissionModule,
  action: PermissionAction,
  resource?: any
): boolean {
  if (!user) return false;

  // Separation of duties rule 1: Admin access alone NEVER grants approval of money or promotions
  if (user.role === 'admin') {
    if (module === 'payments' && (action === 'approve' || action === 'verify')) {
      return false;
    }
    if (module === 'promotions' && action === 'approve') {
      return false;
    }
  }

  // Separation of duties rule 2: Nobody can approve or verify an item they created or submitted
  if (resource && (action === 'approve' || action === 'verify')) {
    if (resource.userId && resource.userId === user.id) {
      return false;
    }
    if (resource.createdBy && resource.createdBy === user.id) {
      return false;
    }
    if (resource.leadId && resource.leadId === user.id && resource.isSelf) {
      return false;
    }
  }

  // Look up dynamic role configuration from the state store
  const state = store.getState();
  const roleConfig = state.rolePermissions?.find((rp) => rp.role === user.role);

  if (!roleConfig) {
    return false;
  }

  const moduleActions = roleConfig.permissions[module] || [];
  return moduleActions.includes(action);
}

/**
 * Returns list of permitted actions for a user on a given module.
 */
export function getPermittedActions(
  user: User | null,
  module: PermissionModule
): PermissionAction[] {
  if (!user) return [];
  const state = store.getState();
  const roleConfig = state.rolePermissions?.find((rp) => rp.role === user.role);
  if (!roleConfig) return [];
  const actions = roleConfig.permissions[module] || [];

  if (user.role === 'admin') {
    if (module === 'payments') {
      return actions.filter((a) => a !== 'approve' && a !== 'verify');
    }
    if (module === 'promotions') {
      return actions.filter((a) => a !== 'approve');
    }
  }

  return actions;
}
