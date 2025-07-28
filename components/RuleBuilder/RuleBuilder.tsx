'use client';

import { useState } from 'react';
import { Client, Worker, Task } from '../../utils/dataParser';

export interface BusinessRule {
  id: string;
  type: 'coRun' | 'slotRestriction' | 'loadLimit' | 'phaseWindow' | 'patternMatch' | 'precedence';
  name: string;
  description: string;
  config: any;
  priority: number;
  enabled: boolean;
}

interface RuleBuilderProps {
  clients: Client[];
  workers: Worker[];
  tasks: Task[];
  rules: BusinessRule[];
  onRulesChange: (rules: BusinessRule[]) => void;
}

export default function RuleBuilder({ 
  clients, 
  workers, 
  tasks, 
  rules, 
  onRulesChange 
}: RuleBuilderProps) {
  const [showAddRule, setShowAddRule] = useState(false);
  const [selectedRuleType, setSelectedRuleType] = useState<BusinessRule['type']>('coRun');
  const [ruleName, setRuleName] = useState('');
  const [ruleDescription, setRuleDescription] = useState('');

  const ruleTypes = [
    { 
      type: 'coRun' as const, 
      name: 'Co-Run Rule', 
      description: 'Tasks that must run together',
      icon: '🔗'
    },
    { 
      type: 'slotRestriction' as const, 
      name: 'Slot Restriction', 
      description: 'Limit available time slots for groups',
      icon: '⏰'
    },
    { 
      type: 'loadLimit' as const, 
      name: 'Load Limit', 
      description: 'Maximum workload per phase for worker groups',
      icon: '⚖️'
    },
    { 
      type: 'phaseWindow' as const, 
      name: 'Phase Window', 
      description: 'Restrict tasks to specific phases',
      icon: '📅'
    },
    { 
      type: 'patternMatch' as const, 
      name: 'Pattern Match', 
      description: 'Apply rules based on task patterns',
      icon: '🔍'
    },
    { 
      type: 'precedence' as const, 
      name: 'Precedence', 
      description: 'Define task execution order',
      icon: '⬆️'
    }
  ];

  const addRule = () => {
    if (!ruleName.trim()) return;

    const newRule: BusinessRule = {
      id: `rule_${Date.now()}`,
      type: selectedRuleType,
      name: ruleName,
      description: ruleDescription,
      config: getDefaultConfig(selectedRuleType),
      priority: rules.length + 1,
      enabled: true
    };

    onRulesChange([...rules, newRule]);
    setShowAddRule(false);
    setRuleName('');
    setRuleDescription('');
  };

  const getDefaultConfig = (type: BusinessRule['type']) => {
    switch (type) {
      case 'coRun':
        return { taskIds: [] };
      case 'slotRestriction':
        return { group: '', minCommonSlots: 1 };
      case 'loadLimit':
        return { workerGroup: '', maxSlotsPerPhase: 5 };
      case 'phaseWindow':
        return { taskId: '', allowedPhases: [] };
      case 'patternMatch':
        return { pattern: '', ruleTemplate: '', parameters: {} };
      case 'precedence':
        return { beforeTask: '', afterTask: '' };
      default:
        return {};
    }
  };

  const deleteRule = (ruleId: string) => {
    onRulesChange(rules.filter(rule => rule.id !== ruleId));
  };

  const toggleRule = (ruleId: string) => {
    onRulesChange(rules.map(rule => 
      rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule
    ));
  };

  const updateRulePriority = (ruleId: string, newPriority: number) => {
    const updatedRules = rules.map(rule => ({ ...rule }));
    const ruleIndex = updatedRules.findIndex(rule => rule.id === ruleId);
    
    if (ruleIndex !== -1) {
      updatedRules[ruleIndex].priority = newPriority;
      // Reorder other rules
      updatedRules.sort((a, b) => a.priority - b.priority);
      onRulesChange(updatedRules);
    }
  };

  const getRuleConfigComponent = (rule: BusinessRule) => {
    switch (rule.type) {
      case 'coRun':
        return (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Select Tasks to Run Together:
            </label>
            <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
              {tasks.map(task => (
                <label key={task.TaskID} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={rule.config.taskIds?.includes(task.TaskID) || false}
                    onChange={(e) => {
                      const newConfig = { ...rule.config };
                      if (e.target.checked) {
                        newConfig.taskIds = [...(newConfig.taskIds || []), task.TaskID];
                      } else {
                        newConfig.taskIds = newConfig.taskIds?.filter((id: string) => id !== task.TaskID) || [];
                      }
                      onRulesChange(rules.map(r => r.id === rule.id ? { ...r, config: newConfig } : r));
                    }}
                    className="rounded"
                  />
                  <span className="text-sm">{task.TaskID} - {task.TaskName}</span>
                </label>
              ))}
            </div>
          </div>
        );

      case 'slotRestriction':
        return (
          <div className="space-y-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Group:</label>
              <select
                value={rule.config.group || ''}
                onChange={(e) => {
                  const newConfig = { ...rule.config, group: e.target.value };
                  onRulesChange(rules.map(r => r.id === rule.id ? { ...r, config: newConfig } : r));
                }}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Select Group</option>
                <option value="GroupA">Group A</option>
                <option value="GroupB">Group B</option>
                <option value="GroupC">Group C</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Minimum Common Slots:</label>
              <input
                type="number"
                min="1"
                value={rule.config.minCommonSlots || 1}
                onChange={(e) => {
                  const newConfig = { ...rule.config, minCommonSlots: parseInt(e.target.value) };
                  onRulesChange(rules.map(r => r.id === rule.id ? { ...r, config: newConfig } : r));
                }}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        );

      case 'loadLimit':
        return (
          <div className="space-y-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Worker Group:</label>
              <select
                value={rule.config.workerGroup || ''}
                onChange={(e) => {
                  const newConfig = { ...rule.config, workerGroup: e.target.value };
                  onRulesChange(rules.map(r => r.id === rule.id ? { ...r, config: newConfig } : r));
                }}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Select Worker Group</option>
                <option value="GroupA">Group A</option>
                <option value="GroupB">Group B</option>
                <option value="GroupC">Group C</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Max Slots Per Phase:</label>
              <input
                type="number"
                min="1"
                value={rule.config.maxSlotsPerPhase || 5}
                onChange={(e) => {
                  const newConfig = { ...rule.config, maxSlotsPerPhase: parseInt(e.target.value) };
                  onRulesChange(rules.map(r => r.id === rule.id ? { ...r, config: newConfig } : r));
                }}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        );

      case 'phaseWindow':
        return (
          <div className="space-y-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Task:</label>
              <select
                value={rule.config.taskId || ''}
                onChange={(e) => {
                  const newConfig = { ...rule.config, taskId: e.target.value };
                  onRulesChange(rules.map(r => r.id === rule.id ? { ...r, config: newConfig } : r));
                }}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Select Task</option>
                {tasks.map(task => (
                  <option key={task.TaskID} value={task.TaskID}>
                    {task.TaskID} - {task.TaskName}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Allowed Phases:</label>
              <div className="grid grid-cols-5 gap-2 mt-1">
                {[1, 2, 3, 4, 5].map(phase => (
                  <label key={phase} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={rule.config.allowedPhases?.includes(phase) || false}
                      onChange={(e) => {
                        const newConfig = { ...rule.config };
                        if (e.target.checked) {
                          newConfig.allowedPhases = [...(newConfig.allowedPhases || []), phase];
                        } else {
                          newConfig.allowedPhases = newConfig.allowedPhases?.filter((p: number) => p !== phase) || [];
                        }
                        onRulesChange(rules.map(r => r.id === rule.id ? { ...r, config: newConfig } : r));
                      }}
                      className="rounded"
                    />
                    <span className="text-sm">Phase {phase}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return <div className="text-sm text-gray-500">Configuration not implemented for this rule type.</div>;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Business Rules</h3>
            <p className="text-sm text-gray-600">Define constraints and relationships for resource allocation</p>
          </div>
          <button
            onClick={() => setShowAddRule(!showAddRule)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            {showAddRule ? 'Cancel' : 'Add Rule'}
          </button>
        </div>
      </div>

      {/* Add Rule Form */}
      {showAddRule && (
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Rule Type:</label>
              <div className="grid grid-cols-2 gap-3">
                {ruleTypes.map(ruleType => (
                  <button
                    key={ruleType.type}
                    onClick={() => setSelectedRuleType(ruleType.type)}
                    className={`p-3 text-left rounded-lg border-2 transition-colors ${
                      selectedRuleType === ruleType.type
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-2xl mb-1">{ruleType.icon}</div>
                    <div className="font-medium text-sm">{ruleType.name}</div>
                    <div className="text-xs text-gray-600">{ruleType.description}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Rule Name:</label>
              <input
                type="text"
                value={ruleName}
                onChange={(e) => setRuleName(e.target.value)}
                placeholder="e.g., High Priority Co-Run"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Description:</label>
              <textarea
                value={ruleDescription}
                onChange={(e) => setRuleDescription(e.target.value)}
                placeholder="Describe what this rule does..."
                rows={2}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowAddRule(false)}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={addRule}
                disabled={!ruleName.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                Add Rule
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rules List */}
      <div className="divide-y divide-gray-200">
        {rules.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No rules defined yet. Click "Add Rule" to get started.
          </div>
        ) : (
          rules.map((rule, index) => (
            <div key={rule.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-2xl">
                      {ruleTypes.find(rt => rt.type === rule.type)?.icon}
                    </span>
                    <div>
                      <h4 className="font-medium text-gray-900">{rule.name}</h4>
                      <p className="text-sm text-gray-600">{rule.description}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      rule.enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {rule.enabled ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  <div className="ml-11">
                    {getRuleConfigComponent(rule)}
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <select
                    value={rule.priority}
                    onChange={(e) => updateRulePriority(rule.id, parseInt(e.target.value))}
                    className="text-sm border border-gray-300 rounded px-2 py-1"
                  >
                    {rules.map((_, i) => (
                      <option key={i + 1} value={i + 1}>Priority {i + 1}</option>
                    ))}
                  </select>
                  
                  <button
                    onClick={() => toggleRule(rule.id)}
                    className={`px-3 py-1 text-xs rounded ${
                      rule.enabled 
                        ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' 
                        : 'bg-green-100 text-green-800 hover:bg-green-200'
                    }`}
                  >
                    {rule.enabled ? 'Disable' : 'Enable'}
                  </button>
                  
                  <button
                    onClick={() => deleteRule(rule.id)}
                    className="px-3 py-1 text-xs bg-red-100 text-red-800 rounded hover:bg-red-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
} 