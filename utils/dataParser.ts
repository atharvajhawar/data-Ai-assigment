// Data types and interfaces
export interface Client {
  ClientID: string;
  ClientName: string;
  PriorityLevel: number;
  RequestedTaskIDs: string;
  GroupTag: string;
  AttributesJSON: string;
}

export interface Worker {
  WorkerID: string;
  WorkerName: string;
  Skills: string;
  AvailableSlots: string;
  MaxLoadPerPhase: number;
  WorkerGroup: string;
  QualificationLevel: number;
}

export interface Task {
  TaskID: string;
  TaskName: string;
  Category: string;
  Duration: number;
  RequiredSkills: string;
  PreferredPhases: string;
  MaxConcurrent: number;
}

export interface ParsedData {
  clients: Client[];
  workers: Worker[];
  tasks: Task[];
}

// Parse JSON data from the sample file
export const parseSampleData = (jsonData: any): ParsedData => {
  return {
    clients: jsonData["Clients 1"] || [],
    workers: jsonData["Worker 1"] || [],
    tasks: jsonData["Tasks 1"] || []
  };
};

// Convert string arrays to actual arrays
export const parseArrayString = (arrayString: string): number[] => {
  try {
    // Handle both "[1,2,3]" and "1 - 3" formats
    if (arrayString.includes('-')) {
      const [start, end] = arrayString.split('-').map(s => parseInt(s.trim()));
      return Array.from({length: end - start + 1}, (_, i) => start + i);
    }
    return JSON.parse(arrayString);
  } catch {
    return [];
  }
};

// Parse comma-separated strings to arrays
export const parseCommaSeparated = (str: string): string[] => {
  return str.split(',').map(s => s.trim()).filter(s => s.length > 0);
};

// Validate and clean data
export const validateAndCleanData = (data: ParsedData) => {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validate clients
  data.clients.forEach((client, index) => {
    if (client.PriorityLevel < 1 || client.PriorityLevel > 5) {
      errors.push(`Client ${client.ClientID}: Invalid PriorityLevel ${client.PriorityLevel}`);
    }
    
    const requestedTasks = parseCommaSeparated(client.RequestedTaskIDs);
    const validTaskIds = data.tasks.map(t => t.TaskID);
    const invalidTasks = requestedTasks.filter(taskId => !validTaskIds.includes(taskId));
    
    if (invalidTasks.length > 0) {
      errors.push(`Client ${client.ClientID}: Invalid TaskIDs: ${invalidTasks.join(', ')}`);
    }
  });

  // Validate workers
  data.workers.forEach((worker, index) => {
    const availableSlots = parseArrayString(worker.AvailableSlots);
    if (availableSlots.length === 0) {
      errors.push(`Worker ${worker.WorkerID}: Invalid AvailableSlots format`);
    }
    
    if (worker.MaxLoadPerPhase < 1) {
      errors.push(`Worker ${worker.WorkerID}: Invalid MaxLoadPerPhase ${worker.MaxLoadPerPhase}`);
    }
  });

  // Validate tasks
  data.tasks.forEach((task, index) => {
    if (task.Duration < 1) {
      errors.push(`Task ${task.TaskID}: Invalid Duration ${task.Duration}`);
    }
    
    if (task.MaxConcurrent < 1) {
      errors.push(`Task ${task.TaskID}: Invalid MaxConcurrent ${task.MaxConcurrent}`);
    }
    
    const requiredSkills = parseCommaSeparated(task.RequiredSkills);
    const allWorkerSkills = data.workers.flatMap(w => parseCommaSeparated(w.Skills));
    const missingSkills = requiredSkills.filter(skill => !allWorkerSkills.includes(skill));
    
    if (missingSkills.length > 0) {
      warnings.push(`Task ${task.TaskID}: Skills not covered by any worker: ${missingSkills.join(', ')}`);
    }
  });

  return { errors, warnings };
}; 