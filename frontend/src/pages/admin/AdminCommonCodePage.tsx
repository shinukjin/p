import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiEdit, FiTrash2, FiSearch, FiRefreshCw } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { getCommonCodes, getCommonCodeGroups, createCommonCode, updateCommonCode, deleteCommonCode, type CommonCode, type CommonCodeGroup } from '../../api/commonCode';

const AdminCommonCodePage: React.FC = () => {
  const [codes, setCodes] = useState<CommonCode[]>([]);
  const [codeGroups, setCodeGroups] = useState<CommonCodeGroup[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCodeGroup, setSelectedCodeGroup] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCode, setSelectedCode] = useState<CommonCode | null>(null);
  const [formData, setFormData] = useState({
    codeGroup: '',
    codeValue: '',
    codeName: '',
    description: '',
    sortOrder: 0,
    isActive: true
  });

  // 초기 데이터 로드
  useEffect(() => {
    loadCodeGroups();
  }, []);

  useEffect(() => {
    if (selectedCodeGroup) {
      loadCodes(selectedCodeGroup);
    }
  }, [selectedCodeGroup]);

  const loadCodeGroups = async () => {
    try {
      const response = await getCommonCodeGroups();
      if (response.success && response.data) {
        setCodeGroups(response.data);
        if (response.data.length > 0) {
          setSelectedCodeGroup(response.data[0].codeGroup);
        }
      }
    } catch (error) {
      console.error('코드 그룹 로드 실패:', error);
      toast.error('코드 그룹을 불러오는데 실패했습니다.');
    }
  };

  const loadCodes = async (codeGroup: string) => {
    setLoading(true);
    try {
      const response = await getCommonCodes(codeGroup);
      if (response.success && response.data) {
        setCodes(response.data);
      }
    } catch (error) {
      console.error('공통코드 로드 실패:', error);
      toast.error('공통코드를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCode = async () => {
    try {
      const response = await createCommonCode(formData);
      if (response.success) {
        toast.success('공통코드가 생성되었습니다.');
        setShowCreateModal(false);
        resetForm();
        loadCodes(selectedCodeGroup);
      }
    } catch (error) {
      console.error('공통코드 생성 실패:', error);
      toast.error('공통코드 생성에 실패했습니다.');
    }
  };

  const handleUpdateCode = async () => {
    if (!selectedCode) return;
    
    try {
      const response = await updateCommonCode(selectedCode.id, formData);
      if (response.success) {
        toast.success('공통코드가 수정되었습니다.');
        setShowEditModal(false);
        resetForm();
        loadCodes(selectedCodeGroup);
      }
    } catch (error) {
      console.error('공통코드 수정 실패:', error);
      toast.error('공통코드 수정에 실패했습니다.');
    }
  };

  const handleDeleteCode = async (codeId: number) => {
    if (!confirm('정말로 이 코드를 삭제하시겠습니까?')) return;
    
    try {
      const response = await deleteCommonCode(codeId);
      if (response.success) {
        toast.success('공통코드가 삭제되었습니다.');
        loadCodes(selectedCodeGroup);
      }
    } catch (error) {
      console.error('공통코드 삭제 실패:', error);
      toast.error('공통코드 삭제에 실패했습니다.');
    }
  };

  const handleEditCode = (code: CommonCode) => {
    setSelectedCode(code);
    setFormData({
      codeGroup: code.codeGroup,
      codeValue: code.codeValue,
      codeName: code.codeName,
      description: code.description || '',
      sortOrder: code.sortOrder || 0,
      isActive: code.isActive
    });
    setShowEditModal(true);
  };

  const resetForm = () => {
    setFormData({
      codeGroup: selectedCodeGroup,
      codeValue: '',
      codeName: '',
      description: '',
      sortOrder: 0,
      isActive: true
    });
    setSelectedCode(null);
  };

  const filteredCodes = codes.filter(code =>
    code.codeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    code.codeValue.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">공통코드 관리</h1>
        <p className="text-gray-600">시스템에서 사용하는 모든 공통코드를 관리합니다.</p>
      </div>

      {/* 필터 및 검색 */}
      <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-64">
            <label className="block text-sm font-medium text-gray-700 mb-1">코드 그룹</label>
            <select
              value={selectedCodeGroup}
              onChange={(e) => setSelectedCodeGroup(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {codeGroups.map(group => (
                <option key={group.codeGroup} value={group.codeGroup}>
                  {group.description} ({group.codeGroup}) - {group.codeCount}개
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex-1 min-w-64">
            <label className="block text-sm font-medium text-gray-700 mb-1">검색</label>
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="코드명 또는 코드값으로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                resetForm();
                setShowCreateModal(true);
              }}
              className="btn-primary flex items-center gap-2"
            >
              <FiPlus className="w-4 h-4" />
              새 코드 추가
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => loadCodes(selectedCodeGroup)}
              disabled={loading}
              className="btn-secondary flex items-center gap-2"
            >
              <FiRefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              새로고침
            </motion.button>
          </div>
        </div>
      </div>

      {/* 코드 목록 */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  코드값
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  코드명
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  설명
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  정렬순서
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  상태
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  생성일
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  작업
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                    <FiRefreshCw className="w-6 h-6 animate-spin mx-auto mb-2" />
                    로딩 중...
                  </td>
                </tr>
              ) : filteredCodes.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                    {searchTerm ? '검색 결과가 없습니다.' : '코드가 없습니다.'}
                  </td>
                </tr>
              ) : (
                filteredCodes.map((code) => (
                  <tr key={code.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {code.codeValue}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {code.codeName}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                      {code.description || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {code.sortOrder || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        code.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {code.isActive ? '활성' : '비활성'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(code.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEditCode(code)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <FiEdit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteCode(code.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 생성 모달 */}
      {showCreateModal && (
        <CommonCodeModal
          title="새 코드 추가"
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleCreateCode}
          onClose={() => setShowCreateModal(false)}
          codeGroups={codeGroups}
        />
      )}

      {/* 수정 모달 */}
      {showEditModal && (
        <CommonCodeModal
          title="코드 수정"
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleUpdateCode}
          onClose={() => setShowEditModal(false)}
          codeGroups={codeGroups}
        />
      )}
    </div>
  );
};

// 공통코드 모달 컴포넌트
interface CommonCodeModalProps {
  title: string;
  formData: any;
  setFormData: (data: any) => void;
  onSubmit: () => void;
  onClose: () => void;
  codeGroups: CommonCodeGroup[];
}

const CommonCodeModal: React.FC<CommonCodeModalProps> = ({
  title,
  formData,
  setFormData,
  onSubmit,
  onClose,
  codeGroups
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">{title}</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">코드 그룹</label>
            <select
              value={formData.codeGroup}
              onChange={(e) => setFormData({ ...formData, codeGroup: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">코드 그룹 선택</option>
              {codeGroups.map(group => (
                <option key={group.codeGroup} value={group.codeGroup}>
                  {group.description} ({group.codeGroup}) - {group.codeCount}개
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">코드값</label>
            <input
              type="text"
              value={formData.codeValue}
              onChange={(e) => setFormData({ ...formData, codeValue: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="코드값 입력"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">코드명</label>
            <input
              type="text"
              value={formData.codeName}
              onChange={(e) => setFormData({ ...formData, codeName: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="코드명 입력"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">설명</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="코드 설명 입력"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">정렬순서</label>
            <input
              type="number"
              value={formData.sortOrder}
              onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0"
            />
          </div>

          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="mr-2"
              />
              <span className="text-sm font-medium text-gray-700">활성 상태</span>
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            취소
          </button>
          <button
            onClick={onSubmit}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminCommonCodePage;
