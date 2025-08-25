import React from 'react';
import { FiInfo, FiCheckCircle, FiAlertCircle, FiXCircle } from 'react-icons/fi';

export type NotificationType = 'info' | 'success' | 'warning' | 'error';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: NotificationType;
  title: string;
  message: string;
  showCloseButton?: boolean;
  autoClose?: boolean;
  autoCloseDelay?: number;
}

const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
  type,
  title,
  message,
  showCloseButton = true,
  autoClose = true,
  autoCloseDelay = 3000,
}) => {
  React.useEffect(() => {
    if (isOpen && autoClose) {
      const timer = setTimeout(() => {
        onClose();
      }, autoCloseDelay);

      return () => clearTimeout(timer);
    }
  }, [isOpen, autoClose, autoCloseDelay, onClose]);

  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <FiCheckCircle className="w-6 h-6 text-green-500" />;
      case 'warning':
        return <FiAlertCircle className="w-6 h-6 text-yellow-500" />;
      case 'error':
        return <FiXCircle className="w-6 h-6 text-red-500" />;
      default:
        return <FiInfo className="w-6 h-6 text-blue-500" />;
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  const getTitleColor = () => {
    switch (type) {
      case 'success':
        return 'text-green-800';
      case 'warning':
        return 'text-yellow-800';
      case 'error':
        return 'text-red-800';
      default:
        return 'text-blue-800';
    }
  };

  const getMessageColor = () => {
    switch (type) {
      case 'success':
        return 'text-green-700';
      case 'warning':
        return 'text-yellow-700';
      case 'error':
        return 'text-red-700';
      default:
        return 'text-blue-700';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 배경 오버레이 */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={showCloseButton ? onClose : undefined}
      />
      
      {/* 모달 */}
      <div className={`relative max-w-md w-full mx-4 p-6 rounded-lg shadow-xl border ${getBackgroundColor()} transition-all duration-300 ease-in-out`}>
        {/* 헤더 */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            {getIcon()}
            <h3 className={`text-lg font-semibold ${getTitleColor()}`}>
              {title}
            </h3>
          </div>
          
          {showCloseButton && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <FiXCircle className="w-5 h-5" />
            </button>
          )}
        </div>
        
        {/* 메시지 */}
        <div className={`${getMessageColor()} leading-relaxed`}>
          {message}
        </div>
        
        {/* 자동 닫힘 표시 */}
        {autoClose && (
          <div className="mt-4 text-xs text-gray-500 text-center">
            {autoCloseDelay / 1000}초 후 자동으로 닫힙니다
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationModal;
