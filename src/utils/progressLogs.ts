import type { ProgressLog } from "../types/log";
export const addLog = (userId: string, exerciseId: string, reps: number, sets: number, weight: number) => {
  const logs = getLogs(userId, exerciseId);
  const newLog = { exerciseId, reps, sets, weight, date: new Date().toISOString() };
  logs.push(newLog);
  localStorage.setItem(`logs_${userId}_${exerciseId}`, JSON.stringify(logs));
};

export const getLogs = (userId: string, exerciseId: string): ProgressLog[] => {
  const data = localStorage.getItem(`logs_${userId}_${exerciseId}`);
  return data ? JSON.parse(data) : [];
};


