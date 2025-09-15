import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FiFilter,
  FiRefreshCw,
  FiEye,
  FiDownload,
  FiAlertCircle,
  FiInfo,
  FiAlertTriangle,
  FiXCircle,
  FiCopy,
  FiCheck
} from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import * as logsApi from '../../api/logs';
import type { ApiLog, LogFilters, LogStatistics } from '../../api/logs';
import Pagination from '../../components/common/Pagination';

const AdminLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<ApiLog[]>([]);
  const [statistics, setStatistics] = useState<LogStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  
  // 복사 상태 관리
  const [copiedItems, setCopiedItems] = useState<{ [key: string]: boolean }>({});
  
  // 필터 상태
  const [filters, setFilters] = useState<LogFilters>({
    page: 0,
    size: pageSize,
    sortBy: 'createdAt',
    sortDir: 'desc'
  });
  
  // 필터 UI 상태
  const [showFilters, setShowFilters] = useState(false);
  const [filterValues, setFilterValues] = useState({
    userId: '',
    endpoint: '',
    logLevel: '' as ApiLog['logLevel'] | '',
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    loadLogs();
    loadStatistics();
  }, [filters]);

  const loadLogs = async () => {
    try {
      setLoading(true);
      console.log('🔍 로그 로드 시작:', filters);
      
      const response = await logsApi.getLogs(filters);
      console.log('✅ 로그 로드 성공:', response);
      console.log('📊 응답 구조:', {
        content: response.content,
        totalPages: response.totalPages,
        totalElements: response.totalElements,
        number: response.number
      });
      
      // 응답 데이터 구조 확인 및 안전한 처리
      if (response && response.content) {
        setLogs(response.content);
        setTotalPages(response.totalPages || 0);
        setTotalElements(response.totalElements || 0);
        setCurrentPage(response.number || 0);
        
        console.log('📊 상태 업데이트:', {
          logs: response.content.length,
          totalPages: response.totalPages,
          totalElements: response.totalElements,
          currentPage: response.number
        });
      } else {
        console.warn('⚠️ 응답 데이터 구조가 예상과 다릅니다:', response);
        setLogs([]);
        setTotalPages(0);
        setTotalElements(0);
        setCurrentPage(0);
      }
    } catch (error) {
      console.error('❌ 로그 로드 실패:', error);
      toast.error('로그를 불러오는데 실패했습니다.');
      
      // 에러 시 기본값으로 초기화
      setLogs([]);
      setTotalPages(0);
      setTotalElements(0);
      setCurrentPage(0);
    } finally {
      setLoading(false);
    }
  };

  const loadStatistics = async () => {
    try {
      console.log('📈 통계 로드 시작');
      const stats = await logsApi.getLogStatistics();
      console.log('✅ 통계 로드 성공:', stats);
      
      if (stats) {
        setStatistics(stats);
      } else {
        console.warn('⚠️ 통계 데이터가 없습니다');
        setStatistics(null);
      }
    } catch (error) {
      console.error('❌ 통계 로드 실패:', error);
      setStatistics(null);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilterValues(prev => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    const newFilters: LogFilters = {
      ...filters,
      page: 0,
      userId: filterValues.userId ? parseInt(filterValues.userId) : undefined,
      endpoint: filterValues.endpoint || undefined,
      logLevel: filterValues.logLevel || undefined,
      startDate: filterValues.startDate || undefined,
      endDate: filterValues.endDate || undefined
    };
    setFilters(newFilters);
    setShowFilters(false);
  };

  const clearFilters = () => {
    setFilterValues({
      userId: '',
      endpoint: '',
      logLevel: '',
      startDate: '',
      endDate: ''
    });
    setFilters({
      page: 0,
      size: pageSize,
      sortBy: 'createdAt',
      sortDir: 'desc'
    });
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setFilters(prev => ({ ...prev, size: newPageSize, page: 0 }));
  };

  const handleSort = (sortBy: string) => {
    setFilters(prev => ({
      ...prev,
      sortBy,
      sortDir: prev.sortBy === sortBy && prev.sortDir === 'asc' ? 'desc' : 'asc',
      page: 0
    }));
  };

  const getLogLevelIcon = (level: ApiLog['logLevel']) => {
    switch (level) {
      case 'INFO':
        return <FiInfo className="w-4 h-4 text-blue-500" />;
      case 'WARNING':
        return <FiAlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'ERROR':
        return <FiXCircle className="w-4 h-4 text-red-500" />;
      case 'DEBUG':
        return <FiAlertCircle className="w-4 h-4 text-gray-500" />;
      default:
        return <FiInfo className="w-4 h-4 text-gray-500" />;
    }
  };

  const getLogLevelColor = (level: ApiLog['logLevel']) => {
    switch (level) {
      case 'INFO':
        return 'bg-blue-100 text-blue-800';
      case 'WARNING':
        return 'bg-yellow-100 text-yellow-800';
      case 'ERROR':
        return 'bg-red-100 text-red-800';
      case 'DEBUG':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      });
    } catch (error) {
      // 날짜 파싱 실패 시 원본 문자열 반환
      return dateString;
    }
  };

  const formatExecutionTime = (time: number) => {
    if (time < 1000) {
      return `${time}ms`;
    }
    return `${(time / 1000).toFixed(2)}s`;
  };

  // 텍스트 길이 제한 함수
  const truncateText = (text: string, maxLength: number = 30) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  // 복사 기능
  const copyToClipboard = async (text: string, itemKey: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedItems(prev => ({ ...prev, [itemKey]: true }));
      toast.success('클립보드에 복사되었습니다.');
      
      // 2초 후 복사 상태 초기화
      setTimeout(() => {
        setCopiedItems(prev => ({ ...prev, [itemKey]: false }));
      }, 2000);
    } catch (error) {
      console.error('복사 실패:', error);
      toast.error('복사에 실패했습니다.');
    }
  };

  if (loading && logs.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 헤더 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">시스템 로그 관리</h1>
        <p className="text-gray-600">API 호출 로그와 시스템 상태를 모니터링하세요</p>
      </div>

      {/* 통계 카드 */}
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { title: '전체 로그', value: statistics.totalLogs, color: 'bg-blue-500' },
            { title: '오늘 로그', value: statistics.todayLogs, color: 'bg-green-500' },
            { title: '이번 주 로그', value: statistics.weekLogs, color: 'bg-purple-500' },
            { title: '에러 로그', value: statistics.errorLogs, color: 'bg-red-500' }
          ].map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-full`}>
                  <FiInfo className="w-6 h-6 text-white" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* 필터 및 검색 */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">로그 필터</h2>
          <div className="flex items-center space-x-2">
            {/* 페이지 크기 선택 */}
            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-600">페이지 크기:</label>
              <select
                value={pageSize}
                onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                className="px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value={10}>10개</option>
                <option value={20}>20개</option>
                <option value={50}>50개</option>
                <option value={100}>100개</option>
              </select>
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <FiFilter className="w-4 h-4" />
              <span>필터</span>
            </button>
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              초기화
            </button>
            <button
              onClick={loadLogs}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FiRefreshCw className="w-4 h-4" />
              <span>새로고침</span>
            </button>
          </div>
        </div>

        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">사용자 ID</label>
              <input
                type="text"
                value={filterValues.userId}
                onChange={(e) => handleFilterChange('userId', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="사용자 ID"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">엔드포인트</label>
              <input
                type="text"
                value={filterValues.endpoint}
                onChange={(e) => handleFilterChange('endpoint', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="엔드포인트"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">로그 레벨</label>
              <select
                value={filterValues.logLevel}
                onChange={(e) => handleFilterChange('logLevel', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">전체</option>
                <option value="INFO">INFO</option>
                <option value="WARNING">WARNING</option>
                <option value="ERROR">ERROR</option>
                <option value="DEBUG">DEBUG</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">시작 날짜</label>
              <input
                type="datetime-local"
                value={filterValues.startDate}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">종료 날짜</label>
              <input
                type="datetime-local"
                value={filterValues.endDate}
                onChange={(e) => handleFilterChange('endDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={applyFilters}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                필터 적용
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* 로그 테이블 */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('logLevel')}
                    className="flex items-center space-x-1 hover:text-gray-700"
                  >
                    <span>레벨</span>
                  </button>
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('createdAt')}
                    className="flex items-center space-x-1 hover:text-gray-700"
                  >
                    <span>시간</span>
                  </button>
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('username')}
                    className="flex items-center space-x-1 hover:text-gray-700"
                  >
                    <span>사용자</span>
                  </button>
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('method')}
                    className="flex items-center space-x-1 hover:text-gray-700"
                  >
                    <span>메서드</span>
                  </button>
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('endpoint')}
                    className="flex items-center space-x-1 hover:text-gray-700"
                  >
                    <span>엔드포인트</span>
                  </button>
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('responseStatus')}
                    className="flex items-center space-x-1 hover:text-gray-700"
                  >
                    <span>상태</span>
                  </button>
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('executionTime')}
                    className="flex items-center space-x-1 hover:text-gray-700"
                  >
                    <span>실행시간</span>
                  </button>
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  요청 정보 (복사 가능)
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  작업
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {logs && logs.length > 0 ? logs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {getLogLevelIcon(log.logLevel)}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLogLevelColor(log.logLevel)}`}>
                        {log.logLevel}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-900">
                    {formatDate(log.createdAt)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-xs font-medium text-gray-900">{log.username}</div>
                    {log.userId && (
                      <div className="text-xs text-gray-500">ID: {log.userId}</div>
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      log.method === 'GET' ? 'bg-green-100 text-green-800' :
                      log.method === 'POST' ? 'bg-blue-100 text-blue-800' :
                      log.method === 'PUT' ? 'bg-yellow-100 text-yellow-800' :
                      log.method === 'DELETE' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {log.method}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-xs text-gray-900 max-w-xs truncate" title={log.endpoint}>
                      {truncateText(log.endpoint, 40)}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      log.responseStatus >= 200 && log.responseStatus < 300 ? 'bg-green-100 text-green-800' :
                      log.responseStatus >= 400 && log.responseStatus < 500 ? 'bg-yellow-100 text-yellow-800' :
                      log.responseStatus >= 500 ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {log.responseStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-900">
                    {formatExecutionTime(log.executionTime)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-900">
                    <div className="max-w-xs">
                      {log.queryParameters && (
                        <div className="mb-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">쿼리:</span>
                            <button
                              onClick={() => copyToClipboard(log.queryParameters || '', `query-${log.id}`)}
                              className="text-gray-400 hover:text-gray-600 transition-colors"
                              title="쿼리 파라미터 복사"
                            >
                              {copiedItems[`query-${log.id}`] ? (
                                <FiCheck className="w-3 h-3 text-green-500" />
                              ) : (
                                <FiCopy className="w-3 h-3" />
                              )}
                            </button>
                          </div>
                          <div className="text-xs bg-gray-100 p-1 rounded truncate max-w-32" title={log.queryParameters}>
                            {truncateText(log.queryParameters, 35)}
                          </div>
                        </div>
                      )}
                      {log.requestBody && (
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">바디:</span>
                            <button
                              onClick={() => copyToClipboard(log.requestBody || '', `body-${log.id}`)}
                              className="text-gray-400 hover:text-gray-600 transition-colors"
                              title="요청 바디 복사"
                            >
                              {copiedItems[`body-${log.id}`] ? (
                                <FiCheck className="w-3 h-3 text-green-500" />
                              ) : (
                                <FiCopy className="w-3 h-3" />
                              )}
                            </button>
                          </div>
                          <div className="text-xs bg-blue-100 p-1 rounded truncate max-w-32" title={log.requestBody}>
                            {truncateText(log.requestBody, 35)}
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-xs font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          const logData = JSON.stringify(log, null, 2);
                          copyToClipboard(logData, `log-${log.id}`);
                        }}
                        className="text-purple-600 hover:text-purple-900 transition-colors"
                        title="전체 로그 정보 복사"
                      >
                        {copiedItems[`log-${log.id}`] ? (
                          <FiCheck className="w-4 h-4" />
                        ) : (
                          <FiCopy className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={() => {/* 로그 상세 보기 */}}
                        className="text-blue-600 hover:text-blue-900 transition-colors"
                        title="상세 보기"
                      >
                        <FiEye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {/* 로그 다운로드 */}}
                        className="text-green-600 hover:text-green-900 transition-colors"
                        title="다운로드"
                      >
                        <FiDownload className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-gray-500">
                    {loading ? '로딩 중...' : '로그가 없습니다.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 페이지네이션 */}
      <Pagination
        currentPage={currentPage || 0}
        totalPages={totalPages || 0}
        totalElements={totalElements || 0}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        showPageInfo={true}
      />
    </div>
  );
};

export default AdminLogsPage;
