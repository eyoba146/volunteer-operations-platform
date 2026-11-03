import { Project, ProjectStatus, Activity, Assignment, AllowanceRequest } from '../types';
import { store } from './store';
import { can } from '../utils/permissions';
import { filterByScope } from '../utils/scoping';

export interface ProjectDetailView extends Project {
  totalBudget: number;
  spent: number;
  reserved: number;
  remaining: number;
  assignedVolunteersCount: number;
  activities: Activity[];
  allowances: AllowanceRequest[];
}

export async function getProjects(filters?: {
  branchId?: string;
  areaId?: string;
  status?: ProjectStatus;
  search?: string;
}): Promise<Project[]> {
  const currentUser = store.getCurrentUser();
  const state = store.getState();
  let list = state.projects || [];

  // Operational scoping filter
  list = filterByScope(currentUser, list);

  if (filters?.status) {
    list = list.filter((p) => p.status === filters.status);
  }
  if (filters?.branchId) {
    list = list.filter((p) => p.branchId === filters.branchId);
  }
  if (filters?.areaId) {
    list = list.filter((p) => p.areaId === filters.areaId);
  }
  if (filters?.search) {
    const q = filters.search.toLowerCase();
    list = list.filter((p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
  }

  return list;
}

export async function getProjectById(id: string): Promise<ProjectDetailView | null> {
  const state = store.getState();
  const project = (state.projects || []).find((p) => p.id === id);
  if (!project) return null;

  const allowances = (state.allowances || []).filter((a) => a.projectId === id);
  const activities = (state.activities || []).filter((a) => a.projectId === id);
  const assignments = (state.assignments || []).filter(
    (a) => a.projectId === id && a.status !== 'declined'
  );

  const totalBudget = project.budget;
  const spent = allowances
    .filter((a) => a.status === 'paid')
    .reduce((sum, a) => sum + (a.totalAmount || 0), 0);
  const reserved = allowances
    .filter((a) => a.status === 'approved')
    .reduce((sum, a) => sum + (a.totalAmount || 0), 0);
  const remaining = Math.max(0, totalBudget - (spent + reserved));

  return {
    ...project,
    totalBudget,
    spent,
    reserved,
    remaining,
    assignedVolunteersCount: assignments.length,
    activities,
    allowances,
  };
}

export async function createProject(data: {
  name: string;
  description: string;
  branchId: string;
  branchName?: string;
  areaId?: string;
  areaName?: string;
  start: string;
  end: string;
  budget: number;
  allowancePerDay: number;
  managerId: string;
  managerName?: string;
}): Promise<Project> {
  const currentUser = store.getCurrentUser();
  if (!can(currentUser, 'projects', 'create')) {
    throw new Error('You do not have permission to create projects.');
  }

  const id = `proj-${Date.now()}`;
  const newProject: Project = {
    id,
    ...data,
    status: 'active',
    createdAt: new Date().toISOString(),
  };

  store.setState((prev) => ({
    ...prev,
    projects: [newProject, ...(prev.projects || [])],
    activityLog: [
      {
        id: `actlog-${Date.now()}`,
        actorId: currentUser?.id || 'system',
        actorName: currentUser ? `${currentUser.firstName || ''} ${currentUser.lastName || ''}`.trim() || currentUser.username : 'System',
        actorRole: currentUser?.role || 'manager',
        action: 'Created project',
        subject: `Chartered project "${newProject.name}" with budget ETB ${newProject.budget.toLocaleString()}`,
        createdAt: new Date().toISOString(),
      },
      ...prev.activityLog,
    ],
  }));

  return newProject;
}

export async function updateProject(id: string, updates: Partial<Project>): Promise<Project> {
  const currentUser = store.getCurrentUser();
  if (!can(currentUser, 'projects', 'edit')) {
    throw new Error('You do not have permission to edit projects.');
  }

  let updated: Project | null = null;
  store.setState((prev) => ({
    ...prev,
    projects: (prev.projects || []).map((p) => {
      if (p.id === id) {
        updated = { ...p, ...updates };
        return updated;
      }
      return p;
    }),
  }));

  if (!updated) {
    throw new Error('Project not found');
  }

  return updated;
}
