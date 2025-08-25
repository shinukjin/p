import React from 'react';
import { motion } from 'framer-motion';
import { FiHeart, FiMapPin, FiCamera, FiPackage, FiEdit3, FiTrendingUp } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';

const DashboardPage: React.FC = () => {
  return (
    <MainLayout title="대시보드">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* 환영 메시지 */}
        <div className="card p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            안녕하세요! 💒
          </h2>
          <p className="text-gray-600">
            부동산 정보를 위한 정보를 체계적으로 관리해보세요. 식장, 스드메, 부동산 정보를 한 곳에서!
          </p>
        </div>

        {/* 통계 카드들 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center">
                <FiHeart className="w-6 h-6 text-pink-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">12</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">결혼식장</h3>
            <p className="text-gray-600 text-sm">저장된 식장 정보</p>
            <div className="mt-2 text-xs text-gray-500">
              북마크: 5개
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <FiCamera className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">8</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">스드메</h3>
            <p className="text-gray-600 text-sm">스튜디오/드레스/메이크업</p>
            <div className="mt-2 text-xs text-gray-500">
              북마크: 3개
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FiMapPin className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">15</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">부동산</h3>
            <p className="text-gray-600 text-sm">관심 매물 정보</p>
            <div className="mt-2 text-xs text-gray-500">
              북마크: 7개
            </div>
          </motion.div>
        </div>

        {/* 메인 기능 카드들 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="card p-6 hover:shadow-lg transition-shadow cursor-pointer"
          >
            <Link to="/wedding-halls" className="block">
              <div className="w-16 h-16 bg-pink-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <FiHeart className="w-8 h-8 text-pink-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2 text-center">결혼식장 관리</h3>
              <p className="text-gray-600 text-sm text-center">
                결혼식장 정보를 등록하고 비교해보세요
              </p>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="card p-6 hover:shadow-lg transition-shadow cursor-pointer"
          >
            <Link to="/wedding-services" className="block">
              <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <div className="flex space-x-1">
                  <FiCamera className="w-5 h-5 text-purple-600" />
                  <FiPackage className="w-5 h-5 text-purple-600" />
                  <FiEdit3 className="w-5 h-5 text-purple-600" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2 text-center">스드메 관리</h3>
              <p className="text-gray-600 text-sm text-center">
                스튜디오, 드레스, 메이크업 정보 관리
              </p>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="card p-6 hover:shadow-lg transition-shadow cursor-pointer"
          >
            <Link to="/real-estates" className="block">
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <FiMapPin className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2 text-center">부동산 관리</h3>
              <p className="text-gray-600 text-sm text-center">
                신혼집 후보지를 지도와 함께 관리
              </p>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="card p-6 hover:shadow-lg transition-shadow cursor-pointer"
          >
            <Link to="/apartment-trades" className="block">
              <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <FiTrendingUp className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2 text-center">실거래가 조회</h3>
              <p className="text-gray-600 text-sm text-center">
                아파트 매매 실거래가 검색 및 분석
              </p>
            </Link>
          </motion.div>
        </div>
        
      </motion.div>
    </MainLayout>
  );
};

export default DashboardPage;
