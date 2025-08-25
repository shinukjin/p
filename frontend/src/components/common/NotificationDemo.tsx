import React, { useState } from 'react';
import NotificationModal from './NotificationModal';
import type { NotificationType } from './NotificationModal';

const NotificationDemo: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notificationType, setNotificationType] = useState<NotificationType>('info');
  const [notificationTitle, setNotificationTitle] = useState('');
  const [notificationMessage, setNotificationMessage] = useState('');

  const showNotification = (type: NotificationType, title: string, message: string) => {
    setNotificationType(type);
    setNotificationTitle(title);
    setNotificationMessage(message);
    setIsOpen(true);
  };

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">알림창 데모</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button
          onClick={() => showNotification('info', '정보', '일반적인 정보를 알려드립니다.')}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          정보 알림
        </button>
        
        <button
          onClick={() => showNotification('success', '성공', '작업이 성공적으로 완료되었습니다.')}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          성공 알림
        </button>
        
        <button
          onClick={() => showNotification('warning', '경고', '주의가 필요한 상황입니다.')}
          className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
        >
          경고 알림
        </button>
        
        <button
          onClick={() => showNotification('error', '오류', '오류가 발생했습니다.')}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          오류 알림
        </button>
      </div>

      <div className="mt-8 p-4 bg-gray-100 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">사용법:</h3>
        <pre className="text-sm text-gray-700">
{`import NotificationModal from './NotificationModal';
import type { NotificationType } from './NotificationModal';

const [isOpen, setIsOpen] = useState(false);

<NotificationModal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  type="success"
  title="성공"
  message="작업이 완료되었습니다."
  autoClose={true}
  autoCloseDelay={3000}
/>`}
        </pre>
      </div>

      <NotificationModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        type={notificationType}
        title={notificationTitle}
        message={notificationMessage}
        autoClose={true}
        autoCloseDelay={3000}
      />
    </div>
  );
};

export default NotificationDemo;
