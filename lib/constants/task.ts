export enum TaskStatus {
  NotStarted = 'Not Started',
  InProgress = 'In Progress',
  Completed = 'Completed',
}

export enum TaskCategory {
  Personal = 'Personal',
  Work = 'Work',
  Study = 'Study',
}

export enum TaskPriority {
  Low = 'low',
  Medium = 'medium',
  High = 'high',
}

export const getTaskStatusOptions = () =>
  Object.values(TaskStatus).map((v) => ({ label: v, value: v }));

export const getTaskPriorityOptions = () =>
  Object.values(TaskPriority).map((v) => ({ label: v, value: v }));
