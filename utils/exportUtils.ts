import { ParsedData, Client, Worker, Task } from './dataParser';
import { BusinessRule } from '../components/RuleBuilder/RuleBuilder';
import { PrioritizationWeights } from '../components/Prioritization/PrioritizationControls';

export interface ExportConfig {
  data: ParsedData;
  rules: BusinessRule[];
  weights: PrioritizationWeights;
  exportName?: string;
}

// Convert data to CSV format
export const convertToCSV = (data: any[], headers: string[]): string => {
  const csvHeaders = headers.join(',');
  const csvRows = data.map(row => 
    headers.map(header => {
      const value = row[header];
      // Escape commas and quotes in CSV
      if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    }).join(',')
  );
  
  return [csvHeaders, ...csvRows].join('\n');
};

// Export clients data as CSV
export const exportClientsCSV = (clients: Client[]): string => {
  const headers = ['ClientID', 'ClientName', 'PriorityLevel', 'RequestedTaskIDs', 'GroupTag', 'AttributesJSON'];
  return convertToCSV(clients, headers);
};

// Export workers data as CSV
export const exportWorkersCSV = (workers: Worker[]): string => {
  const headers = ['WorkerID', 'WorkerName', 'Skills', 'AvailableSlots', 'MaxLoadPerPhase', 'WorkerGroup', 'QualificationLevel'];
  return convertToCSV(workers, headers);
};

// Export tasks data as CSV
export const exportTasksCSV = (tasks: Task[]): string => {
  const headers = ['TaskID', 'TaskName', 'Category', 'Duration', 'RequiredSkills', 'PreferredPhases', 'MaxConcurrent'];
  return convertToCSV(tasks, headers);
};

// Generate rules JSON
export const generateRulesJSON = (rules: BusinessRule[], weights: PrioritizationWeights): any => {
  return {
    metadata: {
      generatedAt: new Date().toISOString(),
      version: '1.0',
      description: 'Business rules and prioritization weights for resource allocation'
    },
    prioritization: {
      weights: weights,
      totalWeight: Object.values(weights).reduce((sum, weight) => sum + weight, 0),
      criteria: {
        priorityLevel: 'How much to prioritize high-priority clients',
        taskFulfillment: 'Maximize the number of requested tasks completed',
        fairness: 'Ensure fair distribution across all clients',
        workloadBalance: 'Balance workload across workers',
        skillMatch: 'Prioritize tasks that match worker skills',
        phaseEfficiency: 'Optimize for efficient phase utilization'
      }
    },
    rules: rules.map(rule => ({
      id: rule.id,
      type: rule.type,
      name: rule.name,
      description: rule.description,
      config: rule.config,
      priority: rule.priority,
      enabled: rule.enabled
    })),
    validation: {
      ruleCount: rules.length,
      activeRules: rules.filter(r => r.enabled).length,
      ruleTypes: [...new Set(rules.map(r => r.type))]
    }
  };
};

// Download file utility
export const downloadFile = (content: string, filename: string, mimeType: string) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Export all data
export const exportAllData = (config: ExportConfig) => {
  const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
  const baseName = config.exportName || `data-alchemist-export-${timestamp}`;

  // Export CSV files
  downloadFile(
    exportClientsCSV(config.data.clients),
    `${baseName}-clients.csv`,
    'text/csv'
  );

  downloadFile(
    exportWorkersCSV(config.data.workers),
    `${baseName}-workers.csv`,
    'text/csv'
  );

  downloadFile(
    exportTasksCSV(config.data.tasks),
    `${baseName}-tasks.csv`,
    'text/csv'
  );

  // Export rules JSON
  const rulesJSON = generateRulesJSON(config.rules, config.weights);
  downloadFile(
    JSON.stringify(rulesJSON, null, 2),
    `${baseName}-rules.json`,
    'application/json'
  );

  // Export summary
  const summary = {
    exportInfo: {
      timestamp: new Date().toISOString(),
      totalRecords: {
        clients: config.data.clients.length,
        workers: config.data.workers.length,
        tasks: config.data.tasks.length
      },
      rules: {
        total: config.rules.length,
        active: config.rules.filter(r => r.enabled).length
      },
      prioritization: {
        totalWeight: Object.values(config.weights).reduce((sum, weight) => sum + weight, 0),
        criteria: Object.keys(config.weights).length
      }
    },
    dataQuality: {
      clientsWithErrors: 0, // This would be calculated from validation
      workersWithErrors: 0,
      tasksWithErrors: 0
    }
  };

  downloadFile(
    JSON.stringify(summary, null, 2),
    `${baseName}-summary.json`,
    'application/json'
  );
};

// Generate a single ZIP file with all exports (placeholder for future implementation)
export const exportAsZip = async (config: ExportConfig) => {
  // This would require a ZIP library like JSZip
  // For now, we'll export individual files
  exportAllData(config);
};

// Validate export data
export const validateExportData = (config: ExportConfig): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // Check if data exists
  if (!config.data.clients.length) errors.push('No clients data to export');
  if (!config.data.workers.length) errors.push('No workers data to export');
  if (!config.data.tasks.length) errors.push('No tasks data to export');

  // Check for required fields
  config.data.clients.forEach((client, index) => {
    if (!client.ClientID) errors.push(`Client ${index + 1}: Missing ClientID`);
    if (!client.ClientName) errors.push(`Client ${index + 1}: Missing ClientName`);
  });

  config.data.workers.forEach((worker, index) => {
    if (!worker.WorkerID) errors.push(`Worker ${index + 1}: Missing WorkerID`);
    if (!worker.WorkerName) errors.push(`Worker ${index + 1}: Missing WorkerName`);
  });

  config.data.tasks.forEach((task, index) => {
    if (!task.TaskID) errors.push(`Task ${index + 1}: Missing TaskID`);
    if (!task.TaskName) errors.push(`Task ${index + 1}: Missing TaskName`);
  });

  // Check rules
  config.rules.forEach((rule, index) => {
    if (!rule.name) errors.push(`Rule ${index + 1}: Missing name`);
    if (!rule.type) errors.push(`Rule ${index + 1}: Missing type`);
  });

  return {
    valid: errors.length === 0,
    errors
  };
}; 