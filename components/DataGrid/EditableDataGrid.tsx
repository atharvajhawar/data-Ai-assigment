'use client';

import { useState, useEffect } from 'react';
import { Client, Worker, Task } from '../../utils/dataParser';

interface EditableDataGridProps {
  data: Client[] | Worker[] | Task[];
  dataType: 'clients' | 'workers' | 'tasks';
  onDataChange: (newData: Client[] | Worker[] | Task[]) => void;
  errors?: string[];
}

export default function EditableDataGrid({ 
  data, 
  dataType, 
  onDataChange, 
  errors = [] 
}: EditableDataGridProps) {
  const [editingCell, setEditingCell] = useState<{ row: number; col: string } | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  const [localData, setLocalData] = useState(data);

  useEffect(() => {
    setLocalData(data);
  }, [data]);

  const getColumns = () => {
    switch (dataType) {
      case 'clients':
        return [
          { key: 'ClientID', label: 'Client ID', editable: false },
          { key: 'ClientName', label: 'Name', editable: true },
          { key: 'PriorityLevel', label: 'Priority', editable: true },
          { key: 'RequestedTaskIDs', label: 'Tasks', editable: true },
          { key: 'GroupTag', label: 'Group', editable: true },
          { key: 'AttributesJSON', label: 'Attributes', editable: true }
        ];
      case 'workers':
        return [
          { key: 'WorkerID', label: 'Worker ID', editable: false },
          { key: 'WorkerName', label: 'Name', editable: true },
          { key: 'Skills', label: 'Skills', editable: true },
          { key: 'AvailableSlots', label: 'Available Slots', editable: true },
          { key: 'MaxLoadPerPhase', label: 'Max Load', editable: true },
          { key: 'WorkerGroup', label: 'Group', editable: true },
          { key: 'QualificationLevel', label: 'Qualification', editable: true }
        ];
      case 'tasks':
        return [
          { key: 'TaskID', label: 'Task ID', editable: false },
          { key: 'TaskName', label: 'Name', editable: true },
          { key: 'Category', label: 'Category', editable: true },
          { key: 'Duration', label: 'Duration', editable: true },
          { key: 'RequiredSkills', label: 'Skills', editable: true },
          { key: 'PreferredPhases', label: 'Preferred Phases', editable: true },
          { key: 'MaxConcurrent', label: 'Max Concurrent', editable: true }
        ];
      default:
        return [];
    }
  };

  const handleCellClick = (rowIndex: number, columnKey: string, value: any) => {
    const column = getColumns().find(col => col.key === columnKey);
    if (column?.editable) {
      setEditingCell({ row: rowIndex, col: columnKey });
      setEditValue(String(value || ''));
    }
  };

  const handleSave = () => {
    if (!editingCell) return;

    const newData = [...localData] as typeof localData;
    const row = newData[editingCell.row] as any;
    
    // Convert value based on field type
    let convertedValue: any = editValue;
    if (editingCell.col === 'PriorityLevel' || editingCell.col === 'MaxLoadPerPhase' || 
        editingCell.col === 'Duration' || editingCell.col === 'MaxConcurrent' || 
        editingCell.col === 'QualificationLevel') {
      convertedValue = parseInt(editValue) || 0;
    }

    row[editingCell.col] = convertedValue;
    
    setLocalData(newData);
    onDataChange(newData as any);
    setEditingCell(null);
    setEditValue('');
  };

  const handleCancel = () => {
    setEditingCell(null);
    setEditValue('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const getCellValue = (row: any, columnKey: string) => {
    const value = row[columnKey];
    
    // Format special fields
    if (columnKey === 'PriorityLevel') {
      return (
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
          value <= 2 ? 'bg-red-100 text-red-800' :
          value <= 3 ? 'bg-yellow-100 text-yellow-800' :
          'bg-green-100 text-green-800'
        }`}>
          {value}
        </span>
      );
    }
    
    return String(value || '');
  };

  const isErrorRow = (rowIndex: number) => {
    const row = localData[rowIndex] as any;
    const id = row.ClientID || row.WorkerID || row.TaskID;
    return errors.some(error => error.includes(id));
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {getColumns().map((column) => (
                <th
                  key={column.key}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {localData.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={`hover:bg-gray-50 ${
                  isErrorRow(rowIndex) ? 'bg-red-50 border-l-4 border-red-400' : ''
                }`}
              >
                {getColumns().map((column) => (
                  <td
                    key={column.key}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 cursor-pointer"
                    onClick={() => handleCellClick(rowIndex, column.key, (row as any)[column.key])}
                  >
                    {editingCell?.row === rowIndex && editingCell?.col === column.key ? (
                      <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onKeyDown={handleKeyPress}
                        onBlur={handleSave}
                        className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        autoFocus
                      />
                    ) : (
                      getCellValue(row, column.key)
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {errors.length > 0 && (
        <div className="bg-red-50 border-t border-red-200 p-4">
          <h3 className="text-sm font-medium text-red-800 mb-2">
            Data Issues Found ({errors.length})
          </h3>
          <ul className="text-sm text-red-700 space-y-1 max-h-32 overflow-y-auto">
            {errors.slice(0, 5).map((error, index) => (
              <li key={index}>• {error}</li>
            ))}
            {errors.length > 5 && (
              <li className="text-red-600">... and {errors.length - 5} more issues</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
} 