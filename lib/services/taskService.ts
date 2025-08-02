import {
  collection,
  addDoc,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  Timestamp,
  DocumentReference,
} from 'firebase/firestore';

import { TaskCategory, TaskPriority, TaskStatus } from "@/lib/constants/task";
import { db } from "@/lib/config/firebaseConfig";
import { FirestoreCollection } from "@/lib/constants/firestore";

export type Task = {
  id?: string;
  title: string;
  description?: string;
  category?: TaskCategory;
  status?: TaskStatus;
  priority?: TaskPriority;
  scheduledAt: Date;
  reminderOffset: number;
  notificationId?: string;
  createdAt?: Date;
};

export const getTasksCollectionRef = (userId: string) =>
  collection(db, FirestoreCollection.Users, userId, FirestoreCollection.Tasks);

const getTaskDocRef = (userId: string, taskId: string) =>
  doc(db, FirestoreCollection.Users, userId, FirestoreCollection.Tasks, taskId);

// 🔹 Add new task
export async function addTask(userId: string, task: Task): Promise<string> {
  const ref = getTasksCollectionRef(userId);

  const taskData = {
    ...task,
    scheduledAt: Timestamp.fromDate(task.scheduledAt),
    createdAt: Timestamp.now(),
  };

  const docRef: DocumentReference = await addDoc(ref, taskData);
  return docRef.id;
}

// 🔹 Get one task
export async function getTask(userId: string, taskId: string): Promise<Task | null> {
  const docRef = getTaskDocRef(userId, taskId);
  const snapshot = await getDoc(docRef);

  if (!snapshot.exists()) return null;

  const data = snapshot.data();

  return {
    id: snapshot.id,
    ...data,
    scheduledAt: data.scheduledAt.toDate(),
    createdAt: data.createdAt?.toDate?.(),
  };
}

// 🔹 Update task
export async function updateTask(
  userId: string,
  taskId: string,
  updates: Partial<Task>
): Promise<void> {
  const docRef = getTaskDocRef(userId, taskId);

  // Format fields correctly for Firestore
  const formattedUpdates: Record<string, any> = { ...updates };

  if (updates.scheduledAt instanceof Date) {
    formattedUpdates.scheduledAt = Timestamp.fromDate(updates.scheduledAt);
  }

  // Avoid sending undefined fields (Firebase will throw)
  Object.keys(formattedUpdates).forEach(
    (key) => formattedUpdates[key] === undefined && delete formattedUpdates[key]
  );

  await updateDoc(docRef, formattedUpdates);
}

// 🔹 Delete task
export async function deleteTask(userId: string, taskId: string): Promise<void> {
  const docRef = getTaskDocRef(userId, taskId);
  await deleteDoc(docRef);
}
