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
  range?: {
    start: Date;
    end: Date;
  };
};

export function getReminderTime(task: Task): Date {
  const offsetMs = (task.reminderOffset ?? 10) * 60 * 1000;

  return new Date(task.scheduledAt.getTime() - (offsetMs));
}

async function scheduleNotificationForTask(task: Task): Promise<string | undefined> {
  const triggerTime = getReminderTime(task);

  if (triggerTime.getTime() <= Date.now()) {
    return
  }

  const notificationId = await Notifications.scheduleNotificationAsync({
    content: {
      title: '🔔 Task Reminder',
      body: task.title,
      data: { taskId: task.id },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: triggerTime,
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
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [scheduleLocal, setScheduleLocal] = useState<Task[]>([]);

  const [loading, setLoading] = useState(false);

  const userId = user?.uid;

  // useEffect(() => {
  //   if (!userId) return;
  //
  //   const taskRef = getTasksCollectionRef(userId);
  //   const q = query(taskRef, orderBy('scheduledAt', 'asc'));
  //
  //   const unsubscribe = onSnapshot(q, (snapshot) => {
  //     const data: Task[] = snapshot.docs.map((doc) => ({
  //       id: doc.id,
  //       ...(doc.data() as Task),
  //       scheduledAt: doc.data().scheduledAt.toDate(),
  //       createdAt: doc.data().createdAt?.toDate(),
  //     }));
  //
  //     // setAllTasks(data);
  //     loadAllSchedule(data);
  //     initScheduledNotifications(data);
  //   });
  //
  //   return () => unsubscribe();
  // }, [userId]);

  useEffect(() => {
    if (!userId) return;

    const taskRef = getTasksCollectionRef(userId);
    const q = query(taskRef, orderBy('scheduledAt', 'asc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const all: Task[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Task),
        scheduledAt: doc.data().scheduledAt.toDate(),
        createdAt: doc.data().createdAt?.toDate(),
      }));

      setAllTasks(all); // lưu toàn bộ

      // filter local theo filters
      let filtered = [...all];
      if (filters?.status) filtered = filtered.filter(t => t.status === filters.status);
      if (filters?.category) filtered = filtered.filter(t => t.category === filters.category);
      if (filters?.priority) filtered = filtered.filter(t => t.priority === filters.priority);

      if (filters?.range) {
        const start = new Date(filters.range.start.setHours(0,0,0,0));
        const end   = new Date(filters.range.end.setHours(23,59,59,999));
        filtered = filtered.filter(t =>
          t.scheduledAt >= start && t.scheduledAt <= end
        );
      }

      setTasks(filtered); // lưu kết quả filter hiển thị
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

  const updateTask = async (taskId: string, data: Partial<Task>, sourceTasks?: Task[]): Promise<boolean> => {
    try {
      setLoading(true);

      const taskArray = sourceTasks ?? tasks;

      const oldTask = taskArray.find(t => t.id === taskId);
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


      console.log('newNotificationId: ', newNotificationId)

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

  const loadAllSchedule = async () => {
    const sourceTasks = await getTasksOnce()

    const data = await Notifications.getAllScheduledNotificationsAsync()

    if (data?.length > 0 && sourceTasks?.length > 0) {
      const listNew = sourceTasks?.filter((task) => {
        return data.find((s) => s.identifier === task.notificationId)
      })

      setScheduleLocal(listNew);
    } else {
      console.log('run setScheduleLocal []')
      setScheduleLocal([]);
    }
  }

  // const initScheduledNotifications = async () => {
  const initScheduledNotifications = async () => {
    const tasks = await getTasksOnce()

    if (!tasks.length) return

    for (const task of tasks) {
      if (task?.id) {
        await updateTask(task.id, task, tasks);
      }
    }

    await loadAllSchedule()
  }

  const cancelAllScheduledNotifications = async () => {
    await Notifications.cancelAllScheduledNotificationsAsync()
  }

  return {
    getTaskDetail,
    addTask,
    updateTask,
    deleteTask,
    loadAllSchedule,
    cancelAllScheduledNotifications,
    getTasksOnce,
    initScheduledNotifications,

    loading,
    tasks,
    scheduleLocal,
  };
}
