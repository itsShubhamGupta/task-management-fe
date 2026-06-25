export type TaskStatus = 'PENDING' | 'COMPLETED';

export interface Task {
  id: number;
  name: string;
  description: string;
  status: TaskStatus;
  createdDate: string;
}

export interface TaskRequest {
  name: string;
  description: string;
}

export interface TaskSummary {
  totalTasks: number;
  pendingTasks: number;
  completedTasks: number;
}
