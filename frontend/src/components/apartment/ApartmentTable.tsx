import React from 'react';
import { motion } from 'framer-motion';
import { FiExternalLink, FiTrendingUp } from 'react-icons/fi';
import type { ApartmentTrade } from '../../api/apartment';
import Pagination from '../common/Pagination';

interface ApartmentTableProps {
  trades: ApartmentTrade[];
  currentPage: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onViewProperty: (trade: ApartmentTrade, type: 'A1' | 'B1') => void;
}

const ApartmentTable: React.FC<ApartmentTableProps> = ({
  trades,
  currentPage,
  itemsPerPage,
  onPageChange,
  onViewProperty
}) => {
  const formatPrice = (price: string) => {
    const numPrice = parseInt(price.replace(/[^0-9]/g, ''));
    if (numPrice >= 100000000) {
      return `${(numPrice / 100000000).toFixed(1)}억`;
    } else if (numPrice >= 10000) {
      return `${(numPrice / 10000).toFixed(0)}만`;
    }
    return price;
  };

  const totalPages = Math.ceil(trades.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedTrades = trades.slice(startIndex, endIndex);

  if (trades.length === 0) {
    return (
      <div className="card overflow-hidden">
        <div className="text-center py-12">
          <FiTrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">조회 결과가 없습니다</h3>
          <p className="text-gray-600">다른 조건으로 검색해보세요.</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="card overflow-hidden"
    >
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                아파트명
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                동/지번
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                거래금액
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                거래일자
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                면적(㎡)
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                층수
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                건축년도
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                평당가격
              </th>
              <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                매물보기
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedTrades.map((trade, index) => (
              <motion.tr
                key={index + 1}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="hover:bg-gray-50"
              >
                <td className="px-3 py-2 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {trade.apartmentName}
                  </div>
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  <div className="text-sm text-gray-600">
                    {trade.dong} {trade.jibun}
                  </div>
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  <div className="text-sm font-semibold text-blue-600">
                    {formatPrice(trade.dealAmount)}
                  </div>
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  <div className="text-sm text-gray-600">
                    {trade.dealDate}
                  </div>
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {trade.exclusiveArea}
                  </div>
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  <div className="text-sm text-gray-600">
                    {trade.floor}
                  </div>
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  <div className="text-sm text-gray-600">
                    {trade.buildYear}
                  </div>
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  <div className="text-sm font-medium text-green-600">
                    {trade.pricePerPyeong ? formatPrice(trade.pricePerPyeong) + '/평' : '-'}
                  </div>
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-center">
                  <div className="flex space-x-1 justify-center">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onViewProperty(trade, 'A1')}
                      className="inline-flex items-center px-2 py-1 bg-blue-600 text-white text-xs font-medium rounded hover:bg-blue-700 transition-colors"
                      title="네이버 부동산에서 매매 매물 보기"
                    >
                      <FiExternalLink className="w-3 h-3 mr-1" />
                      매매
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onViewProperty(trade, 'B1')}
                      className="inline-flex items-center px-2 py-1 bg-green-600 text-white text-xs font-medium rounded hover:bg-green-700 transition-colors"
                      title="네이버 부동산에서 전세 매물 보기"
                    >
                      <FiExternalLink className="w-3 h-3 mr-1" />
                      전세
                    </motion.button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* 페이지네이션 */}
      <Pagination
        currentPage={currentPage - 1} // 0-based로 변환
        totalPages={totalPages}
        totalElements={trades.length}
        pageSize={itemsPerPage}
        onPageChange={(page) => onPageChange(page + 1)} // 1-based로 변환
        showPageInfo={true}
      />
    </motion.div>
  );
};

export default ApartmentTable;
