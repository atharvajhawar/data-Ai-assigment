'use client';

import { useState } from 'react';
import { Client, Worker, Task, parseCommaSeparated } from '../../utils/dataParser';

interface NaturalLanguageSearchProps {
  clients: Client[];
  workers: Worker[];
  tasks: Task[];
  onSearchResults: (results: { clients: Client[]; workers: Worker[]; tasks: Task[] }) => void;
}

export default function NaturalLanguageSearch({ 
  clients, 
  workers, 
  tasks, 
  onSearchResults 
}: NaturalLanguageSearchProps) {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const searchData = async () => {
    if (!query.trim()) {
      onSearchResults({ clients, workers, tasks });
      return;
    }

    setIsSearching(true);

    try {
      // Simple natural language parsing (can be enhanced with AI later)
      const lowerQuery = query.toLowerCase();
      const results = {
        clients: [] as Client[],
        workers: [] as Worker[],
        tasks: [] as Task[]
      };

      // Search clients
      results.clients = clients.filter(client => {
        const matchesName = client.ClientName.toLowerCase().includes(lowerQuery);
        const matchesGroup = client.GroupTag.toLowerCase().includes(lowerQuery);
        const matchesPriority = lowerQuery.includes('priority') && 
          (lowerQuery.includes(client.PriorityLevel.toString()) || 
           (lowerQuery.includes('high') && client.PriorityLevel >= 4) ||
           (lowerQuery.includes('low') && client.PriorityLevel <= 2));
        
        return matchesName || matchesGroup || matchesPriority;
      });

      // Search workers
      results.workers = workers.filter(worker => {
        const matchesName = worker.WorkerName.toLowerCase().includes(lowerQuery);
        const matchesSkills = worker.Skills.toLowerCase().includes(lowerQuery);
        const matchesGroup = worker.WorkerGroup.toLowerCase().includes(lowerQuery);
        const matchesQualification = lowerQuery.includes('qualification') && 
          lowerQuery.includes(worker.QualificationLevel.toString());
        
        return matchesName || matchesSkills || matchesGroup || matchesQualification;
      });

      // Search tasks
      results.tasks = tasks.filter(task => {
        const matchesName = task.TaskName.toLowerCase().includes(lowerQuery);
        const matchesCategory = task.Category.toLowerCase().includes(lowerQuery);
        const matchesSkills = task.RequiredSkills.toLowerCase().includes(lowerQuery);
        const matchesDuration = lowerQuery.includes('duration') && 
          lowerQuery.includes(task.Duration.toString());
        
        return matchesName || matchesCategory || matchesSkills || matchesDuration;
      });

      // Handle specific query patterns
      if (lowerQuery.includes('high priority') || lowerQuery.includes('priority high')) {
        results.clients = clients.filter(client => client.PriorityLevel >= 4);
      }

      if (lowerQuery.includes('skilled') || lowerQuery.includes('expert')) {
        results.workers = workers.filter(worker => worker.QualificationLevel >= 4);
      }

      if (lowerQuery.includes('long duration') || lowerQuery.includes('duration long')) {
        results.tasks = tasks.filter(task => task.Duration >= 3);
      }

      if (lowerQuery.includes('short duration') || lowerQuery.includes('duration short')) {
        results.tasks = tasks.filter(task => task.Duration <= 2);
      }

      // Handle skill-based searches
      const skillKeywords = ['coding', 'ml', 'testing', 'design', 'analysis', 'reporting', 'devops', 'ui/ux', 'data'];
      const foundSkill = skillKeywords.find(skill => lowerQuery.includes(skill));
      if (foundSkill) {
        results.workers = workers.filter(worker => 
          worker.Skills.toLowerCase().includes(foundSkill)
        );
        results.tasks = tasks.filter(task => 
          task.RequiredSkills.toLowerCase().includes(foundSkill)
        );
      }

      // Handle group-based searches
      if (lowerQuery.includes('group')) {
        const groupMatch = lowerQuery.match(/group\s*([abc])/i);
        if (groupMatch) {
          const groupLetter = groupMatch[1].toUpperCase();
          results.clients = clients.filter(client => 
            client.GroupTag.includes(`Group${groupLetter}`)
          );
          results.workers = workers.filter(worker => 
            worker.WorkerGroup.includes(`Group${groupLetter}`)
          );
        }
      }

      onSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      searchData();
    }
  };

  const clearSearch = () => {
    setQuery('');
    onSearchResults({ clients, workers, tasks });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <div className="flex items-center space-x-4">
        <div className="flex-1">
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
            Natural Language Search
          </label>
          <div className="relative">
            <input
              type="text"
              id="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="e.g., 'high priority clients', 'workers with coding skills', 'tasks with duration > 2'"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {isSearching && (
              <div className="absolute right-3 top-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={searchData}
            disabled={isSearching}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {isSearching ? 'Searching...' : 'Search'}
          </button>
          
          <button
            onClick={clearSearch}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
          >
            Clear
          </button>
        </div>
      </div>

      <div className="mt-4 text-sm text-gray-600">
        <p className="font-medium mb-2">Search Examples:</p>
        <ul className="space-y-1 text-xs">
          <li>• "high priority clients" - Find clients with priority 4-5</li>
          <li>• "workers with coding skills" - Find workers who can code</li>
          <li>• "tasks with duration &gt; 2" - Find long-duration tasks</li>
          <li>• "group A workers" - Find workers in GroupA</li>
          <li>• "expert workers" - Find workers with qualification 4-5</li>
        </ul>
      </div>
    </div>
  );
} 