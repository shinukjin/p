import React from 'react';
import { motion } from 'framer-motion';
import {
  FiMapPin,
  FiHome,
  FiDollarSign,
  FiMaximize,
  FiEdit,
  FiTrash2,
  FiHeart,
  FiPhone
} from 'react-icons/fi';
import { TransactionType, TransactionTypeLabels } from '../../types/wedding';

interface RealEstateCardProps {
  estate: any;
  index?: number;
  onBookmarkToggle: (id: number) => void;
  formatPrice: (estate: any) => string;
  variant?: 'full' | 'compact';
}

const RealEstateCard: React.FC<RealEstateCardProps> = ({
  estate,
  index = 0,
  onBookmarkToggle,
  formatPrice,
  variant = 'full'
}) => {
  if (variant === 'compact') {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="card p-4 cursor-pointer hover:shadow-md transition-shadow"
      >
        <div className="flex justify-between items-start mb-2">
          <h4 className="font-medium text-gray-900">{estate.title}</h4>
          <button
            onClick={() => onBookmarkToggle(estate.id)}
            className={`p-1 rounded ${
              estate.isBookmarked ? 'text-pink-500' : 'text-gray-400'
            }`}
          >
            <FiHeart className={`w-4 h-4 ${estate.isBookmarked ? 'fill-current' : ''}`} />
          </button>
        </div>
        
        <p className="text-sm text-gray-600 mb-2">{estate.address}</p>
        <p className="text-sm font-medium text-blue-600 mb-2">{formatPrice(estate)}</p>
        
        <div className="flex justify-between text-xs text-gray-500">
          <span>{estate.area}평</span>
          <span>{estate.rooms}룸</span>
          <span>{estate.floor}층</span>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="card overflow-hidden hover:shadow-lg transition-shadow"
    >
      {/* 이미지 */}
      <div className="relative">
        <img
          src={estate.imageUrl}
          alt={estate.title}
          className="w-full h-48 object-cover"
        />
        <button
          onClick={() => onBookmarkToggle(estate.id)}
          className={`absolute top-3 right-3 p-2 rounded-full ${
            estate.isBookmarked 
              ? 'bg-pink-500 text-white' 
              : 'bg-white text-gray-400 hover:text-pink-500'
          } transition-colors`}
        >
          <FiHeart className={`w-4 h-4 ${estate.isBookmarked ? 'fill-current' : ''}`} />
        </button>
        
        {/* 거래 타입 배지 */}
        <div className="absolute top-3 left-3 px-3 py-1 bg-blue-500 text-white rounded-full text-xs font-medium">
          {estate.transactionType && TransactionTypeLabels[estate.transactionType as TransactionType]}
        </div>
      </div>

      {/* 내용 */}
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{estate.title}</h3>
        
        <div className="space-y-2 text-sm text-gray-600 mb-4">
          <div className="flex items-center">
            <FiMapPin className="w-4 h-4 mr-2" />
            {estate.address}
          </div>
          
          <div className="flex items-center">
            <FiDollarSign className="w-4 h-4 mr-2" />
            {formatPrice(estate)}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FiMaximize className="w-4 h-4 mr-2" />
              {estate.area}평
            </div>
            <div className="flex items-center">
              <FiHome className="w-4 h-4 mr-2" />
              {estate.rooms}룸 {estate.bathrooms}욕실
            </div>
          </div>

          <div className="text-xs text-gray-500">
            {estate.floor}층 / {estate.totalFloors}층, {estate.buildYear}년 건축
          </div>
        </div>

        {/* 편의시설 */}
        {estate.facilities && estate.facilities.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {estate.facilities.slice(0, 3).map((facility: string, idx: number) => (
                <span
                  key={idx}
                  className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                >
                  {facility}
                </span>
              ))}
            </div>
          </div>
        )}

        {estate.memo && (
          <div className="bg-yellow-50 p-3 rounded-lg mb-4">
            <p className="text-sm text-yellow-800">{estate.memo}</p>
          </div>
        )}

        {/* 액션 버튼들 */}
        <div className="flex space-x-2">
          <button className="flex-1 btn-secondary text-sm py-2">
            <FiEdit className="w-4 h-4 mr-1" />
            수정
          </button>
          <button className="btn-secondary text-red-600 hover:bg-red-50 p-2">
            <FiTrash2 className="w-4 h-4" />
          </button>
          {estate.contactInfo && (
            <button className="btn-secondary p-2" title="연락처">
              <FiPhone className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default RealEstateCard;
