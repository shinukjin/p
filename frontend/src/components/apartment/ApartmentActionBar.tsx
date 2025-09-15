import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  FiMapPin,
  FiBarChart,
  FiList,
  FiFilter,
  FiRefreshCw
} from 'react-icons/fi';

interface ApartmentActionBarProps {
  viewMode: 'table' | 'chart';
  showAdvancedFilters: boolean;
  onViewModeChange: (mode: 'table' | 'chart') => void;
  onToggleAdvancedFilters: () => void;
  onClearFilters: () => void;
}

const ApartmentActionBar: React.FC<ApartmentActionBarProps> = ({
  viewMode,
  showAdvancedFilters,
  onViewModeChange,
  onToggleAdvancedFilters,
  onClearFilters
}) => {
  return (
    <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
      <div className="flex flex-wrap gap-3">
        <Link to="/real-estates">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-secondary flex items-center bg-blue-100 text-blue-700"
          >
            <FiMapPin className="w-4 h-4 mr-2" />
            부동산 관리로
          </motion.button>
        </Link>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onViewModeChange(viewMode === 'table' ? 'chart' : 'table')}
          className="btn-secondary flex items-center"
        >
          {viewMode === 'table' ? (
            <>
              <FiBarChart className="w-4 h-4 mr-2" />
              차트보기
            </>
          ) : (
            <>
              <FiList className="w-4 h-4 mr-2" />
              목록보기
            </>
          )}
        </motion.button>
      </div>

      <div className="flex flex-wrap gap-3">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onToggleAdvancedFilters}
          className={`btn-secondary flex items-center ${showAdvancedFilters ? 'bg-orange-100 text-orange-700' : ''}`}
        >
          <FiFilter className="w-4 h-4 mr-2" />
          {showAdvancedFilters ? '고급검색 숨기기' : '고급검색'}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onClearFilters}
          className="btn-secondary flex items-center bg-gray-100 text-gray-700"
        >
          <FiRefreshCw className="w-4 h-4 mr-2" />
          필터 초기화
        </motion.button>
      </div>
    </div>
  );
};

export default ApartmentActionBar;
