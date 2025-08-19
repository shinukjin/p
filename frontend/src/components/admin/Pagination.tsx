import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalElements: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalElements,
  pageSize,
  onPageChange
}) => {
  const totalPages = Math.ceil(totalElements / pageSize);

  if (totalElements <= pageSize) {
    return null;
  }

  return (
    <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
      {/* 모바일 페이지네이션 */}
      <div className="flex-1 flex justify-between sm:hidden">
        <button
          onClick={() => onPageChange(Math.max(0, currentPage - 1))}
          disabled={currentPage === 0}
          className="btn-secondary disabled:opacity-50"
        >
          이전
        </button>
        <button
          onClick={() => onPageChange(Math.min(totalPages - 1, currentPage + 1))}
          disabled={currentPage === totalPages - 1}
          className="btn-secondary disabled:opacity-50"
        >
          다음
        </button>
      </div>

      {/* 데스크톱 페이지네이션 */}
      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            <span className="font-medium">{currentPage * pageSize + 1}</span> ~{' '}
            <span className="font-medium">
              {Math.min((currentPage + 1) * pageSize, totalElements)}
            </span>{' '}
            / <span className="font-medium">{totalElements}</span> 결과
          </p>
        </div>
        <div>
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
            <button
              onClick={() => onPageChange(Math.max(0, currentPage - 1))}
              disabled={currentPage === 0}
              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
            >
              이전
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const page = i;
              return (
                <button
                  key={page}
                  onClick={() => onPageChange(page)}
                  className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                    currentPage === page
                      ? 'z-10 bg-gray-50 border-gray-500 text-gray-600'
                      : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  {page + 1}
                </button>
              );
            })}
            <button
              onClick={() => onPageChange(Math.min(totalPages - 1, currentPage + 1))}
              disabled={currentPage === totalPages - 1}
              className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
            >
              다음
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
