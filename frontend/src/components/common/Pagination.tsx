import React from 'react';
import { FiChevronLeft, FiChevronRight, FiChevronsLeft, FiChevronsRight } from 'react-icons/fi';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalElements: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  showPageInfo?: boolean;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalElements,
  pageSize,
  onPageChange,
  showPageInfo = true
}) => {
  // 페이지 번호 배열 생성
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // 전체 페이지가 5개 이하면 모두 표시
      for (let i = 0; i < totalPages; i++) {
        pages.push(i);
      }
    } else {
      // 현재 페이지를 중심으로 5개 페이지 표시
      let startPage = Math.max(0, currentPage - 2);
      let endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1);
      
      // 끝 페이지가 마지막 페이지에 가까우면 시작 페이지 조정
      if (endPage === totalPages - 1) {
        startPage = Math.max(0, endPage - maxVisiblePages + 1);
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  };

  const pageNumbers = getPageNumbers();
  const startElement = currentPage * pageSize + 1;
  const endElement = Math.min((currentPage + 1) * pageSize, totalElements);

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="mt-6">
      {/* 페이지 정보 */}
      {showPageInfo && (
        <div className="text-center text-sm text-gray-500 mb-4">
          총 {totalElements.toLocaleString()}개의 항목 중 {startElement} - {endElement}번째
        </div>
      )}

      {/* 페이지네이션 버튼 */}
      <div className="flex justify-center">
        <nav className="flex items-center space-x-1">
          {/* 첫 페이지로 */}
          <button
            onClick={() => onPageChange(0)}
            disabled={currentPage === 0}
            className="px-2 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="첫 페이지"
          >
            <FiChevronsLeft className="w-4 h-4" />
          </button>

          {/* 이전 페이지 */}
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 0}
            className="px-2 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="이전 페이지"
          >
            <FiChevronLeft className="w-4 h-4" />
          </button>

          {/* 페이지 번호들 */}
          {pageNumbers.map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`px-3 py-2 text-sm font-medium border transition-colors ${
                page === currentPage
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'text-gray-500 bg-white border-gray-300 hover:bg-gray-50'
              }`}
            >
              {page + 1}
            </button>
          ))}

          {/* 다음 페이지 */}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages - 1}
            className="px-2 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="다음 페이지"
          >
            <FiChevronRight className="w-4 h-4" />
          </button>

          {/* 마지막 페이지로 */}
          <button
            onClick={() => onPageChange(totalPages - 1)}
            disabled={currentPage === totalPages - 1}
            className="px-2 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="마지막 페이지"
          >
            <FiChevronsRight className="w-4 h-4" />
          </button>
        </nav>
      </div>

      {/* 페이지 정보 (하단) */}
      {showPageInfo && (
        <div className="text-center text-xs text-gray-400 mt-2">
          {currentPage + 1} / {totalPages} 페이지
        </div>
      )}
    </div>
  );
};

export default Pagination;
