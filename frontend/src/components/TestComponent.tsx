import React from 'react';

const TestComponent: React.FC = () => {
  return (
    <div className="p-4 bg-blue-100 rounded-lg">
      <h2 className="text-xl font-bold text-blue-800">테스트 컴포넌트</h2>
      <p className="text-blue-600">Tailwind CSS가 정상적으로 작동하고 있습니다!</p>
    </div>
  );
};

export default TestComponent;
