'use client';

import { useState, useEffect } from 'react';
import { parseSampleData, validateAndCleanData, ParsedData } from '../../utils/dataParser';
import FileUploader from '../../components/FileUploader/FileUploader';
import EditableDataGrid from '../../components/DataGrid/EditableDataGrid';
import NaturalLanguageSearch from '../../components/DataGrid/NaturalLanguageSearch';
import RuleBuilder, { BusinessRule } from '../../components/RuleBuilder/RuleBuilder';
import PrioritizationControls, { PrioritizationWeights } from '../../components/Prioritization/PrioritizationControls';
import { exportAllData } from '../../utils/exportUtils';

export default function Home() {
  const [data, setData] = useState<ParsedData | null>(null);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<string[]>([]);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'clients' | 'workers' | 'tasks' | 'rules' | 'prioritization'>('clients');
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [filteredData, setFilteredData] = useState<ParsedData | null>(null);
  const [rules, setRules] = useState<BusinessRule[]>([]);
  const [weights, setWeights] = useState<PrioritizationWeights>({
    priorityLevel: 5,
    taskFulfillment: 5,
    fairness: 5,
    workloadBalance: 5,
    skillMatch: 5,
    phaseEfficiency: 5
  });

  useEffect(() => {
    // Load sample data
    const loadData = async () => {
      try {
        const response = await fetch('/sample.json');
        const jsonData = await response.json();
        const parsedData = parseSampleData(jsonData);
        
        // Validate data
        const validation = validateAndCleanData(parsedData);
        
        setData(parsedData);
        setFilteredData(parsedData);
        setErrors(validation.errors);
        setWarnings(validation.warnings);
      } catch (error) {
        console.error('Error loading data:', error);
        setErrors(['Failed to load sample data']);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleFileUpload = (uploadedData: any, fileName: string) => {
    try {
      const parsedData = parseSampleData(uploadedData);
      const validation = validateAndCleanData(parsedData);
      
      setData(parsedData);
      setFilteredData(parsedData);
      setErrors(validation.errors);
      setWarnings(validation.warnings);
      setShowFileUpload(false);
    } catch (error) {
      console.error('Error processing uploaded file:', error);
      setErrors(['Failed to process uploaded file']);
    }
  };

  const handleDataChange = (newData: any) => {
    if (!data) return;
    
    const updatedData = { ...data };
    if (activeTab === 'clients') {
      updatedData.clients = newData;
    } else if (activeTab === 'workers') {
      updatedData.workers = newData;
    } else if (activeTab === 'tasks') {
      updatedData.tasks = newData;
    }
    
    const validation = validateAndCleanData(updatedData);
    setData(updatedData);
    setFilteredData(updatedData);
    setErrors(validation.errors);
    setWarnings(validation.warnings);
  };

  const handleSearchResults = (results: ParsedData) => {
    setFilteredData(results);
  };

  const handleExport = () => {
    if (!data) return;
    
    exportAllData({
      data: data,
      rules: rules,
      weights: weights,
      exportName: 'data-alchemist-export'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Data Alchemist...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Data</h1>
          <p className="text-gray-600">Please check if sample.json exists in the public folder.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Data Alchemist</h1>
              <p className="text-gray-600">Transform your data chaos into organized insights</p>
            </div>
            <div className="flex space-x-4">
              <button 
                onClick={() => setShowFileUpload(!showFileUpload)}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
              >
                {showFileUpload ? 'Cancel Upload' : 'Upload File'}
              </button>
              <button 
                onClick={handleExport}
                disabled={!data}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                Export Data
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Validation Summary */}
      {(errors.length > 0 || warnings.length > 0) && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          {errors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
              <h3 className="text-sm font-medium text-red-800 mb-2">
                Validation Errors ({errors.length})
              </h3>
              <ul className="text-sm text-red-700 space-y-1">
                {errors.slice(0, 5).map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
                {errors.length > 5 && (
                  <li className="text-red-600">... and {errors.length - 5} more errors</li>
                )}
              </ul>
            </div>
          )}
          
          {warnings.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-4">
              <h3 className="text-sm font-medium text-yellow-800 mb-2">
                Warnings ({warnings.length})
              </h3>
              <ul className="text-sm text-yellow-700 space-y-1">
                {warnings.slice(0, 3).map((warning, index) => (
                  <li key={index}>• {warning}</li>
                ))}
                {warnings.length > 3 && (
                  <li className="text-yellow-600">... and {warnings.length - 3} more warnings</li>
                )}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* File Upload */}
        {showFileUpload && (
          <div className="mb-8">
            <FileUploader onFileUpload={handleFileUpload} />
          </div>
        )}

        {/* Natural Language Search */}
        {data && (
          <div className="mb-8">
            <NaturalLanguageSearch
              clients={data.clients}
              workers={data.workers}
              tasks={data.tasks}
              onSearchResults={handleSearchResults}
            />
          </div>
        )}

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'clients', name: 'Clients', count: data.clients.length },
              { id: 'workers', name: 'Workers', count: data.workers.length },
              { id: 'tasks', name: 'Tasks', count: data.tasks.length },
              { id: 'rules', name: 'Rules', count: rules.length },
              { id: 'prioritization', name: 'Prioritization', count: 0 }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.name} {tab.count > 0 ? `(${tab.count})` : ''}
              </button>
            ))}
          </nav>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'rules' && (
          <RuleBuilder
            clients={data.clients}
            workers={data.workers}
            tasks={data.tasks}
            rules={rules}
            onRulesChange={setRules}
          />
        )}

        {activeTab === 'prioritization' && (
          <PrioritizationControls
            weights={weights}
            onWeightsChange={setWeights}
          />
        )}

        {(activeTab === 'clients' || activeTab === 'workers' || activeTab === 'tasks') && filteredData && (
          <EditableDataGrid
            data={
              activeTab === 'clients' ? filteredData.clients :
              activeTab === 'workers' ? filteredData.workers :
              filteredData.tasks
            }
            dataType={activeTab}
            onDataChange={handleDataChange}
            errors={errors}
          />
        )}
      </main>
    </div>
  );
}
