export enum FirestoreCollection {
  Users = 'users',
  Tasks = 'tasks',
}

export const getUserDocPath = (uid: string) =>
  `${FirestoreCollection.Users}/${uid}`;

export const getTaskDocPath = (uid: string, taskId: string) =>
  `${FirestoreCollection.Users}/${uid}/${FirestoreCollection.Tasks}/${taskId}`;
