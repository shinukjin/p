import React from 'react';
import { FiX, FiMapPin, FiHome, FiCalendar, FiUser, FiPhone, FiMail, FiHeart } from 'react-icons/fi';
import { PropertyTypeLabels, TransactionTypeLabels } from '../../constants/realEstate';
import { formatPrice, formatPriceDetail } from '../../utils/priceUtils';
import type { PropertyType, TransactionType } from '../../types/realestate';

interface RealEstateDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  estate: any;
  onBookmarkToggle: (id: number) => void;
}

const RealEstateDetailModal = ({
  isOpen,
  onClose,
  estate,
  onBookmarkToggle
}: RealEstateDetailModalProps) => {
  if (!isOpen || !estate) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">{estate.title}</h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onBookmarkToggle(estate.id)}
              className={`p-2 rounded-full transition-colors ${
                estate.isBookmarked 
                  ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <FiHeart className={`w-5 h-5 ${estate.isBookmarked ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 컨텐츠 */}
        <div className="p-6 space-y-6">
          {/* 가격 정보 */}
          <div className="bg-blue-50 rounded-xl p-4">
            <div className="text-2xl font-bold text-blue-900 mb-2">
              {formatPrice(estate)}
            </div>
            <div className="text-sm text-blue-700">
              {formatPriceDetail(estate)}
            </div>
          </div>

          {/* 기본 정보 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center text-gray-600">
                <FiHome className="w-4 h-4 mr-2" />
                <span className="text-sm">매물 유형</span>
              </div>
              <div className="text-gray-900 font-medium">
                {PropertyTypeLabels[estate.propertyType as PropertyType]}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center text-gray-600">
                <FiMapPin className="w-4 h-4 mr-2" />
                <span className="text-sm">거래 유형</span>
              </div>
              <div className="text-gray-900 font-medium">
                {TransactionTypeLabels[estate.transactionType as TransactionType]}
              </div>
            </div>
          </div>

          {/* 위치 정보 */}
          <div>
            <div className="flex items-center text-gray-600 mb-2">
              <FiMapPin className="w-4 h-4 mr-2" />
              <span className="text-sm">위치</span>
            </div>
            <div className="text-gray-900">
              <div className="font-medium">{estate.address}</div>
              {estate.detailAddress && (
                <div className="text-sm text-gray-600 mt-1">{estate.detailAddress}</div>
              )}
            </div>
          </div>

          {/* 상세 정보 */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">상세 정보</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <div className="text-xl font-bold text-gray-900">{estate.area}㎡</div>
                <div className="text-xs text-gray-600">면적</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <div className="text-xl font-bold text-gray-900">{estate.rooms}개</div>
                <div className="text-xs text-gray-600">방</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <div className="text-xl font-bold text-gray-900">{estate.bathrooms}개</div>
                <div className="text-xs text-gray-600">화장실</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <div className="text-xl font-bold text-gray-900">{estate.parking}대</div>
                <div className="text-xs text-gray-600">주차</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <div className="text-xl font-bold text-gray-900">{estate.floor}층</div>
                <div className="text-xs text-gray-600">해당 층수</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <div className="text-xl font-bold text-gray-900">{estate.totalFloors}층</div>
                <div className="text-xs text-gray-600">전체 층수</div>
              </div>
            </div>

            {estate.yearBuilt && (
              <div className="bg-gray-50 rounded-lg p-3 text-center mt-4">
                <div className="text-xl font-bold text-gray-900">{estate.yearBuilt}년</div>
                <div className="text-xs text-gray-600">준공년도</div>
              </div>
            )}
          </div>

          {/* 설명 */}
          {estate.description && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">상세 설명</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {estate.description}
                </p>
              </div>
            </div>
          )}

          {/* 연락처 정보 */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">연락처 정보</h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex items-center">
                <FiUser className="w-4 h-4 mr-3 text-gray-600" />
                <span className="text-gray-900 font-medium">{estate.contactName}</span>
              </div>
              <div className="flex items-center">
                <FiPhone className="w-4 h-4 mr-3 text-gray-600" />
                <a 
                  href={`tel:${estate.contactPhone}`}
                  className="text-blue-600 hover:text-blue-800 transition-colors"
                >
                  {estate.contactPhone}
                </a>
              </div>
              {estate.contactEmail && (
                <div className="flex items-center">
                  <FiMail className="w-4 h-4 mr-3 text-gray-600" />
                  <a 
                    href={`mailto:${estate.contactEmail}`}
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    {estate.contactEmail}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* 등록 날짜 */}
          {estate.createdAt && (
            <div className="flex items-center text-gray-600 text-sm">
              <FiCalendar className="w-4 h-4 mr-2" />
              <span>등록일: {new Date(estate.createdAt).toLocaleDateString('ko-KR')}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RealEstateDetailModal;
