
import {useEffect, useState} from 'react';
import {
  addTask as _addTask,
  updateTask as _updateTask,
  deleteTask as _deleteTask,
  Task
} from '@/lib/services/taskService';
import {useAuth} from "@/lib/context/AuthContext";
import {FirestoreCollection} from "@/lib/constants/firestore";
import {collection, onSnapshot, orderBy, Timestamp, where} from "firebase/firestore";
import {db} from "@/lib/config/firebaseConfig";
import {TaskCategory, TaskPriority, TaskStatus} from "@/lib/constants/task";
import {query} from "@firebase/database";

export type TaskFilter = {
  status?: TaskStatus;
  category?: TaskCategory;
  priority?: TaskPriority;
  scheduledAt?: Date;
};

export function useTasks(filters?: TaskFilter) {
  const { user } = useAuth();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);

  const userId = user?.uid;

  useEffect(() => {
    if (!userId) return;

    const taskRef = collection(db, FirestoreCollection.Users, userId, FirestoreCollection.Tasks);
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
      const data: Task[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Task),
        scheduledAt: doc.data().scheduledAt.toDate(),
        createdAt: doc.data().createdAt?.toDate(),
      }));
      setTasks(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId, JSON.stringify(filters)]);


  const addTask = async (task: Task): Promise<string | null> => {
    try {
      setLoading(true);
      const taskId = await _addTask(userId, task);
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
      await _updateTask(userId, taskId, data);
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
      await _deleteTask(userId, taskId);
      return true;
    } catch (error) {
      console.error('Failed to delete task', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    addTask,
    updateTask,
    deleteTask,
    loading,
    tasks
  };
}
