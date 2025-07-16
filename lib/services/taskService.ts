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
import {TaskCategory, TaskPriority, TaskStatus} from "@/lib/constants/task";
import {db} from "@/lib/config/firebaseConfig";
import {FirestoreCollection} from "@/lib/constants/firestore";

export type Task = {
  id?: string;
  title: string;
  description?: string;
  category: TaskCategory;
  status: TaskStatus;
  priority: TaskPriority;
  scheduledAt: Date;
  reminderEnabled: boolean;
  createdAt?: Timestamp;
};

const getTasksCollectionRef = (userId: string) =>
  collection(db, FirestoreCollection.Users, userId, FirestoreCollection.Tasks);

const getTaskDocRef = (userId: string, taskId: string) =>
  doc(db, FirestoreCollection.Users, userId, FirestoreCollection.Tasks, taskId);

export async function addTask(userId: string, task: Task): Promise<string> {
  const ref = getTasksCollectionRef(userId);
  const docRef: DocumentReference = await addDoc(ref, {
    ...task,
    scheduledAt: Timestamp.fromDate(task.scheduledAt),
    createdAt: Timestamp.now(),
  });
  return docRef.id;
}

export async function getTask(userId: string, taskId: string): Promise<Task | null> {
  const docRef = getTaskDocRef(userId, taskId);
  const snapshot = await getDoc(docRef);

  if (!snapshot.exists()) return null;

  return {
    id: snapshot.id,
    ...(snapshot.data() as Task),
    scheduledAt: snapshot.data().scheduledAt.toDate(),
  };
}

export async function updateTask(
  userId: string,
  taskId: string,
  updates: Partial<Task>
): Promise<void> {
  const docRef = getTaskDocRef(userId, taskId);
  const formattedUpdates = {
    ...updates,
    ...(updates.scheduledAt ? { scheduledAt: Timestamp.fromDate(updates.scheduledAt) } : {}),
  };
  await updateDoc(docRef, formattedUpdates);
}

// 🔹 Delete task
export async function deleteTask(userId: string, taskId: string): Promise<void> {
  const docRef = getTaskDocRef(userId, taskId);
  await deleteDoc(docRef);
}
