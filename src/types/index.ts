export type Priority = 'Low' | 'Medium' | 'High';
export type TaskStatus = 'Todo' | 'Progress' | 'Done';

export interface UserProfile {
  name: string;
  institution: string;
  primaryTrack: string;
  academicLevel: string;
  studyPreference: string;
  dailyXPTarget: number;
  personalHubLink: string;
  motivationStatement: string;
  xp: number;
  level: number;
  email: string;
  status: string;
  academicStream: 'Engineering' | 'Medical' | 'Commerce' | 'Humanities';
  isLocked?: boolean;
  lockMessage?: string;
}

export interface AuthUser {
  id: string;
  username?: string;
  name?: string;
  email: string;
  role: 'student' | 'parent' | 'pending';
  token?: string;
  studentCode?: string;
}

export interface AcademicTask {
  id: string;
  title: string;
  track: string;
  deadline: string;
  status: TaskStatus;
  priority: Priority;
}

export interface Skill {
  id: string;
  name: string;
  progress: number;
  category: string;
  streak: number;
  lastUpdated: string;
}

export interface Alert {
  id: string;
  taskName: string;
  date: string;
  time: string;
  contact: string;
  priority: Priority;
  enabled: boolean;
  triggered?: boolean;
}

export interface PomodoroSession {
  totalMinutes: number;
  sessionsDone: number;
  lastCompleted: string;
}

export interface PersonalMaterial {
  id: string;
  title: string;
  link: string;
  category: string;
  dateAdded: string;
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  link: string;
  type: 'Video' | 'Article' | 'Tool' | 'Repo';
}

export interface ActivityLog {
  date: string;
  intensity: number;
  count?: number;
}

export interface ActionLog {
  id?: string;
  userId: string;
  studentId?: string;
  role: string;
  actionType: string;
  description: string;
  timeSpent?: number;
  timestamp: string;
}

export interface ChildSummary {
  id: string;
  name: string;
  email: string;
  totalStudyTime: number;
  completedTasks: number;
  totalTasks: number;
  recentLogs: ActionLog[];
  milestones?: any[];
}

export interface PerformanceInsights {
  mostActive: string;
  leastActive: string;
  avgStudyTime: number;
  overallCompletionRate: number;
}

export interface Milestone {
  _id?: string;
  parentId: string;
  childId: string;
  title: string;
  description: string;
  type: 'time' | 'tasks' | 'streak';
  targetValue: number;
  rewardBadge: string;
  status: 'active' | 'completed';
  progress: number;
  completedAt?: string;
  createdAt?: string;
}

export interface AppState {
  currentUser: AuthUser | null;
  profile: UserProfile;
  tasks: AcademicTask[];
  skills: Skill[];
  alerts: Alert[];
  pomodoro: PomodoroSession;
  activityLogs: ActivityLog[];
  isDarkMode: boolean;
  isSidebarOpen: boolean;
  personalMaterials: PersonalMaterial[];
  recommendations: Recommendation[];
}
