import { useEffect, useState } from 'react';
import {
  getTask as _getTask,
  addTask as _addTask,
  updateTask as _updateTask,
  deleteTask as _deleteTask,
  Task, getTasksCollectionRef
} from '@/lib/services/taskService';
import { useAuth } from "@/lib/context/AuthContext";
import {collection, getDocs, onSnapshot, orderBy, Timestamp, where} from "firebase/firestore";
import { TaskCategory, TaskPriority, TaskStatus } from "@/lib/constants/task";
import { query } from "@firebase/firestore";
import * as Notifications from 'expo-notifications';

export type TaskFilter = {
  status?: TaskStatus;
  category?: TaskCategory | null;
  priority?: TaskPriority;
  scheduledAt?: Date;
};

function getReminderTime(task: Task): Date {
  const offsetMs = (task.reminderOffset ?? 10) * 60 * 1000;

  return new Date(task.scheduledAt.getTime() - (offsetMs));
}

async function scheduleNotificationForTask(task: Task): Promise<string> {
  const triggerTime = getReminderTime(task);

  const notificationId = await Notifications.scheduleNotificationAsync({
    content: {
      title: '🔔 Task Reminder',
      body: task.title,
      data: { taskId: task.id },
    },
    trigger: {
      // type: Notifications.SchedulableTriggerInputTypes.DATE,
      // date: triggerTime,

      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 5
    },
  });

  return notificationId;
}

async function cancelNotification(notificationId?: string) {
  if (notificationId) {
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
    } catch (e) {
      console.warn("Failed to cancel notification:", e);
    }
  }
}

export function useTasks(filters?: TaskFilter) {
  const { user } = useAuth();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);

  const userId = user?.uid;

  useEffect(() => {
    if (!userId) return;

    const taskRef = getTasksCollectionRef(userId);
    const constraints = [];

    if (filters?.status) constraints.push(where('status', '==', filters.status));
    if (filters?.category) constraints.push(where('category', '==', filters.category));
    if (filters?.priority) constraints.push(where('priority', '==', filters.priority));

    if (filters?.scheduledAt) {
      const start = Timestamp.fromDate(new Date(filters.scheduledAt.setHours(0, 0, 0, 0)));
      const end = Timestamp.fromDate(new Date(filters.scheduledAt.setHours(23, 59, 59, 999)));
      constraints.push(where('scheduledAt', '>=', start));
      constraints.push(where('scheduledAt', '<=', end));
    }

    constraints.push(orderBy('scheduledAt', 'asc'));

    const q = query(taskRef, ...constraints);

    const unsubscribe = onSnapshot(q, (snapshot) => {
      // const data: Task[] = snapshot.docs.map((doc) => ({
      //   id: doc.id,
      //   ...(doc.data() as Task),
      //   scheduledAt: doc.data().scheduledAt.toDate(),
      //   createdAt: doc.data().createdAt?.toDate(),
      // }));
      const data: Task[] = snapshot.docs.map((doc) => {
        console.log(doc.data(), 'doc.data()')
        console.log(JSON.stringify(doc.data().scheduledAt.toDate()), 'doc.data().scheduledAt.toDate()')
        return {
          id: doc.id,
          ...(doc.data() as Task),
          scheduledAt: doc.data().scheduledAt.toDate(),
          createdAt: doc.data().createdAt?.toDate(),
        }
      });
      setTasks(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId, JSON.stringify(filters)]);


  const addTask = async (task: Task): Promise<string | null> => {
    try {
      setLoading(true);
      const notificationId = await scheduleNotificationForTask(task);
      const taskId = await _addTask(userId, {
        ...task,
        notificationId,
      });
      return taskId;
    } catch (error) {
      console.error('Failed to add task', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateTask = async (taskId: string, data: Partial<Task>): Promise<boolean> => {
    try {
      setLoading(true);

      const oldTask = tasks.find(t => t.id === taskId);
      if (!oldTask) return false;

      // Hủy thông báo cũ nếu có
      await cancelNotification(oldTask.notificationId);

      // Lên lịch lại nếu có scheduledAt mới
      const mergedTask: Task = {
        ...oldTask,
        ...data,
        id: taskId,
      };

      const newNotificationId = await scheduleNotificationForTask(mergedTask);

      await _updateTask(userId, taskId, {
        ...data,
        notificationId: newNotificationId,
      });

      return true;
    } catch (error) {
      console.error('Failed to update task', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async (taskId: string): Promise<boolean> => {
    try {
      setLoading(true);
      const task = tasks.find(t => t.id === taskId);
      if (task?.notificationId) {
        await cancelNotification(task.notificationId);
      }
      await _deleteTask(userId, taskId);
      return true;
    } catch (error) {
      console.error('Failed to delete task', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getTaskDetail = async (taskId: string): Promise<Task | null> => {
    return await _getTask(userId, taskId);
  }


  const getTasksOnce = async (): Promise<Task[]> => {
    try {
      const snapshot = await getDocs(getTasksCollectionRef(userId));

      const tasks: Task[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        scheduledAt: doc.data().scheduledAt?.toDate(),
        createdAt: doc.data().createdAt?.toDate(),
      })) as Task[];

      return tasks;
    } catch (error) {
      console.error('Error getting tasks:', error);
      return [];
    }
  };

  const initScheduledNotifications = async () => {
    const tasks = await getTasksOnce()

    for (const task of tasks) {
      if (task?.id) {
        await updateTask(task.id, task);
      }
    }
  }

  const cancelAllScheduledNotifications = async () => {
    await Notifications.cancelAllScheduledNotificationsAsync()
  }

  return {
    getTaskDetail,
    addTask,
    updateTask,
    deleteTask,
    initScheduledNotifications,
    cancelAllScheduledNotifications,

    loading,
    tasks,
  };
}
