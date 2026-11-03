import { User, ScopeLevel } from '../types';
import { store } from '../api/store';

/**
 * Returns human-readable label for user's operational scope.
 * E.g. "Head Office", "Addis Ababa area", "Kirkos branch", "Adama area", "Adama Central branch"
 */
export function getScopeLabel(user: User | null): string {
  if (!user) return 'Public';
  if (user.role === 'admin' || user.role === 'finance') {
    return 'Head Office';
  }

  const scope = user.scope;
  if (!scope) {
    if (user.role === 'manager') return user.areaName ? `${user.areaName} area` : 'Regional area';
    if (user.role === 'team_lead') return user.branchName || 'Local branch';
    return user.branchName || user.areaName || 'Personal';
  }

  if (scope.level === 'all') return 'Head Office';
  if (scope.level === 'area') {
    return scope.unitName ? `${scope.unitName.replace(/ Area$/i, '')} area` : (user.areaName ? `${user.areaName} area` : 'Regional area');
  }
  if (scope.level === 'branch') {
    return scope.unitName || user.branchName || 'Local branch';
  }
  return user.branchName || 'Personal';
}

/**
 * Evaluates whether an item is within the current user's operational boundary.
 */
export function isItemInScope(
  user: User | null,
  item: {
    userId?: string;
    branchId?: string;
    areaId?: string;
    branchName?: string;
    areaName?: string;
    place?: string;
    area?: string;
  }
): boolean {
  if (!user) return false;

  // Super Admin & Finance have all-island/national visibility
  if (user.role === 'admin' || user.role === 'finance') {
    return true;
  }

  const userLevel: ScopeLevel = user.scope?.level || (
    user.role === 'manager' ? 'area' : user.role === 'team_lead' ? 'branch' : 'own'
  );

  if (userLevel === 'all') {
    return true;
  }

  if (userLevel === 'own') {
    return item.userId === user.id;
  }

  const state = store.getState();
  const orgUnits = state.orgUnits || [];

  if (userLevel === 'area') {
    const userAreaId = user.scope?.unitId || user.areaId;
    if (!userAreaId) return true;

    // Direct area match
    if (item.areaId && item.areaId === userAreaId) {
      return true;
    }

    // Branch belongs to this area
    if (item.branchId) {
      const branchUnit = orgUnits.find((u) => u.id === item.branchId);
      if (branchUnit && branchUnit.parentId === userAreaId) {
        return true;
      }
    }

    // Text fallback for demo data
    const targetArea = orgUnits.find((u) => u.id === userAreaId);
    const targetName = (targetArea?.name || '').toLowerCase();
    const itemStr = `${item.areaName || ''} ${item.area || ''} ${item.place || ''}`.toLowerCase();
    if (targetName && itemStr.includes(targetName)) {
      return true;
    }

    return false;
  }

  if (userLevel === 'branch') {
    const userBranchId = user.scope?.unitId || user.branchId;
    if (!userBranchId) return true;

    // Direct branch match
    if (item.branchId && item.branchId === userBranchId) {
      return true;
    }

    // Text fallback for demo data
    const branchUnit = orgUnits.find((u) => u.id === userBranchId);
    if (branchUnit) {
      const bName = branchUnit.name.toLowerCase();
      const placeStr = `${item.place || ''} ${item.branchName || ''}`.toLowerCase();
      if (bName.includes('kirkos') && (placeStr.includes('kirkos') || placeStr.includes('meskel'))) {
        return true;
      }
      if (bName.includes('adama central') && (placeStr.includes('adama') || placeStr.includes('youth center'))) {
        return true;
      }
      if (bName.includes('wonji') && placeStr.includes('wonji')) {
        return true;
      }
    }

    return false;
  }

  return true;
}

/**
 * Filter items according to user's scope.
 */
export function filterByScope<T extends Record<string, any>>(
  user: User | null,
  items: T[],
  getItemIds?: (item: T) => { branchId?: string; areaId?: string; userId?: string; area?: string; place?: string }
): T[] {
  if (!user || user.role === 'admin' || user.role === 'finance') {
    return items;
  }

  return items.filter((item) => {
    const meta = getItemIds ? getItemIds(item) : item;
    return isItemInScope(user, meta);
  });
}
