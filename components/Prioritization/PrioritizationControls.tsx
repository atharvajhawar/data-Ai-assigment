'use client';

import { useState } from 'react';

export interface PrioritizationWeights {
  priorityLevel: number;
  taskFulfillment: number;
  fairness: number;
  workloadBalance: number;
  skillMatch: number;
  phaseEfficiency: number;
}

interface PrioritizationControlsProps {
  weights: PrioritizationWeights;
  onWeightsChange: (weights: PrioritizationWeights) => void;
}

export default function PrioritizationControls({ 
  weights, 
  onWeightsChange 
}: PrioritizationControlsProps) {
  const [activeTab, setActiveTab] = useState<'sliders' | 'ranking' | 'profiles'>('sliders');

  const criteria = [
    {
      key: 'priorityLevel' as keyof PrioritizationWeights,
      name: 'Priority Level',
      description: 'How much to prioritize high-priority clients',
      icon: '⭐'
    },
    {
      key: 'taskFulfillment' as keyof PrioritizationWeights,
      name: 'Task Fulfillment',
      description: 'Maximize the number of requested tasks completed',
      icon: '✅'
    },
    {
      key: 'fairness' as keyof PrioritizationWeights,
      name: 'Fairness',
      description: 'Ensure fair distribution across all clients',
      icon: '⚖️'
    },
    {
      key: 'workloadBalance' as keyof PrioritizationWeights,
      name: 'Workload Balance',
      description: 'Balance workload across workers',
      icon: '📊'
    },
    {
      key: 'skillMatch' as keyof PrioritizationWeights,
      name: 'Skill Match',
      description: 'Prioritize tasks that match worker skills',
      icon: '🎯'
    },
    {
      key: 'phaseEfficiency' as keyof PrioritizationWeights,
      name: 'Phase Efficiency',
      description: 'Optimize for efficient phase utilization',
      icon: '⏱️'
    }
  ];

  const presetProfiles = [
    {
      name: 'Maximize Fulfillment',
      description: 'Focus on completing as many tasks as possible',
      weights: {
        priorityLevel: 8,
        taskFulfillment: 10,
        fairness: 3,
        workloadBalance: 5,
        skillMatch: 7,
        phaseEfficiency: 6
      }
    },
    {
      name: 'Fair Distribution',
      description: 'Ensure equal treatment for all clients',
      weights: {
        priorityLevel: 5,
        taskFulfillment: 7,
        fairness: 10,
        workloadBalance: 8,
        skillMatch: 6,
        phaseEfficiency: 4
      }
    },
    {
      name: 'Minimize Workload',
      description: 'Reduce worker stress and burnout',
      weights: {
        priorityLevel: 6,
        taskFulfillment: 5,
        fairness: 7,
        workloadBalance: 10,
        skillMatch: 8,
        phaseEfficiency: 6
      }
    },
    {
      name: 'High Priority Focus',
      description: 'Prioritize VIP and high-priority clients',
      weights: {
        priorityLevel: 10,
        taskFulfillment: 8,
        fairness: 2,
        workloadBalance: 4,
        skillMatch: 6,
        phaseEfficiency: 5
      }
    }
  ];

  const updateWeight = (key: keyof PrioritizationWeights, value: number) => {
    onWeightsChange({ ...weights, [key]: value });
  };

  const applyProfile = (profile: typeof presetProfiles[0]) => {
    onWeightsChange(profile.weights);
  };

  const resetToDefault = () => {
    onWeightsChange({
      priorityLevel: 5,
      taskFulfillment: 5,
      fairness: 5,
      workloadBalance: 5,
      skillMatch: 5,
      phaseEfficiency: 5
    });
  };

  const getTotalWeight = () => {
    return Object.values(weights).reduce((sum, weight) => sum + weight, 0);
  };

  const getWeightPercentage = (weight: number) => {
    const total = getTotalWeight();
    return total > 0 ? Math.round((weight / total) * 100) : 0;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Prioritization & Weights</h3>
            <p className="text-sm text-gray-600">Set the importance of different allocation criteria</p>
          </div>
          <button
            onClick={resetToDefault}
            className="text-sm text-gray-600 hover:text-gray-800"
          >
            Reset to Default
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6">
          {[
            { id: 'sliders', name: 'Sliders' },
            { id: 'ranking', name: 'Ranking' },
            { id: 'profiles', name: 'Profiles' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'sliders' && (
          <div className="space-y-6">
            {criteria.map((criterion) => (
              <div key={criterion.key} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">{criterion.icon}</span>
                    <div>
                      <h4 className="font-medium text-gray-900">{criterion.name}</h4>
                      <p className="text-sm text-gray-600">{criterion.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-gray-900">
                      {weights[criterion.key]}
                    </div>
                    <div className="text-sm text-gray-500">
                      {getWeightPercentage(weights[criterion.key])}% of total
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-500 w-8">1</span>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={weights[criterion.key]}
                    onChange={(e) => updateWeight(criterion.key, parseInt(e.target.value))}
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <span className="text-sm text-gray-500 w-8">10</span>
                </div>
              </div>
            ))}

            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium text-blue-900">Total Weight:</span>
                <span className="text-lg font-semibold text-blue-900">{getTotalWeight()}</span>
              </div>
              <div className="mt-2 text-sm text-blue-700">
                Higher total weights give more importance to your preferences
              </div>
            </div>
          </div>
        )}

        {activeTab === 'ranking' && (
          <div className="space-y-4">
            <p className="text-sm text-gray-600 mb-4">
              Drag and drop to reorder criteria by importance (most important at top)
            </p>
            
            <div className="space-y-2">
              {criteria
                .sort((a, b) => weights[b.key] - weights[a.key])
                .map((criterion, index) => (
                  <div
                    key={criterion.key}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-gray-400 font-mono text-sm w-6">
                        #{index + 1}
                      </span>
                      <span className="text-xl">{criterion.icon}</span>
                      <div>
                        <div className="font-medium text-gray-900">{criterion.name}</div>
                        <div className="text-sm text-gray-600">{criterion.description}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-gray-900">
                        {weights[criterion.key]}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {activeTab === 'profiles' && (
          <div className="space-y-4">
            <p className="text-sm text-gray-600 mb-4">
              Choose a preset profile or customize the weights above
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {presetProfiles.map((profile) => (
                <div
                  key={profile.name}
                  className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 cursor-pointer transition-colors"
                  onClick={() => applyProfile(profile)}
                >
                  <h4 className="font-medium text-gray-900 mb-2">{profile.name}</h4>
                  <p className="text-sm text-gray-600 mb-3">{profile.description}</p>
                  
                  <div className="space-y-1">
                    {criteria.map((criterion) => (
                      <div key={criterion.key} className="flex justify-between text-xs">
                        <span className="text-gray-600">{criterion.name}:</span>
                        <span className="font-medium">{profile.weights[criterion.key]}</span>
                      </div>
                    ))}
                  </div>
                  
                  <button className="mt-3 w-full px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
                    Apply Profile
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 