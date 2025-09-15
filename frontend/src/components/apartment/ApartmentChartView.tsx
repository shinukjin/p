import React from 'react';
import { motion } from 'framer-motion';
import { FiBarChart } from 'react-icons/fi';

const ApartmentChartView: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="card p-6"
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-4">가격 분포 차트</h3>
      <div className="bg-gray-100 h-96 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <FiBarChart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">차트 기능은 추후 구현 예정입니다.</p>
          <p className="text-sm text-gray-500 mt-2">Chart.js 또는 Recharts 라이브러리를 활용할 예정</p>
        </div>
      </div>
    </motion.div>
  );
};

export default ApartmentChartView;
