import React from 'react';
import { FiArrowUp, FiArrowDown } from 'react-icons/fi';

interface ApartmentSortControlsProps {
  sortConfig: {
    sortBy: string;
    sortOrder: string;
  };
  itemsPerPage: number;
  onSortChange: (sortBy: string) => void;
  onPageSizeChange: (pageSize: number) => void;
}

const ApartmentSortControls: React.FC<ApartmentSortControlsProps> = ({
  sortConfig,
  itemsPerPage,
  onSortChange,
  onPageSizeChange
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700">정렬:</span>
          <button
            onClick={() => onSortChange('dealDate')}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              sortConfig.sortBy === 'dealDate'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            거래일자
            {sortConfig.sortBy === 'dealDate' && (
              sortConfig.sortOrder === 'asc' ? <FiArrowUp className="inline ml-1 w-3 h-3" /> : <FiArrowDown className="inline ml-1 w-3 h-3" />
            )}
          </button>
          <button
            onClick={() => onSortChange('dealAmount')}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              sortConfig.sortBy === 'dealAmount'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            거래금액
            {sortConfig.sortBy === 'dealAmount' && (
              sortConfig.sortOrder === 'asc' ? <FiArrowUp className="inline ml-1 w-3 h-3" /> : <FiArrowDown className="inline ml-1 w-3 h-3" />
            )}
          </button>
          <button
            onClick={() => onSortChange('exclusiveArea')}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              sortConfig.sortBy === 'exclusiveArea'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            면적
            {sortConfig.sortBy === 'exclusiveArea' && (
              sortConfig.sortOrder === 'asc' ? <FiArrowUp className="inline ml-1 w-3 h-3" /> : <FiArrowDown className="inline ml-1 w-3 h-3" />
            )}
          </button>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium text-gray-700 whitespace-nowrap">페이지당:</span>
        <select
          value={itemsPerPage}
          onChange={(e) => onPageSizeChange(parseInt(e.target.value))}
          className="input text-sm w-20"
        >
          <option value={10}>10건</option>
          <option value={20}>20건</option>
          <option value={50}>50건</option>
          <option value={100}>100건</option>
        </select>
      </div>
    </div>
  );
};

export default ApartmentSortControls;
