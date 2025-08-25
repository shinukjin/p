import React from 'react';
import { TransactionType } from '../../types/realestate';

interface CustomMapPinProps {
  transactionType: TransactionType;
  isSelected?: boolean;
  title: string;
  price: string;
}

export const CustomMapPin = ({
  transactionType,
  isSelected = false,
  title,
  price
}: CustomMapPinProps) => {
  // 거래 유형에 따른 색상 설정
  const getTypeColor = () => {
    switch (transactionType) {
      case TransactionType.SALE:
        return '#ef4444'; // 빨간색 - 매매
      case TransactionType.JEONSE:
        return '#3b82f6'; // 파란색 - 전세
      case TransactionType.MONTHLY_RENT:
        return '#10b981'; // 초록색 - 월세
      default:
        return '#6b7280'; // 회색 - 기본
    }
  };

  const baseColor = getTypeColor();
  const scale = isSelected ? 1.2 : 1;
  const shadowOpacity = isSelected ? 0.4 : 0.2;

  return (
    <div
      style={{
        transform: `scale(${scale})`,
        transition: 'all 0.2s ease-in-out',
        cursor: 'pointer'
      }}
    >
      {/* 핀 모양 */}
      <div
        style={{
          position: 'relative',
          width: '40px',
          height: '50px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {/* 핀 바디 */}
        <div
          style={{
            width: '32px',
            height: '32px',
            backgroundColor: baseColor,
            borderRadius: '50% 50% 50% 0',
            transform: 'rotate(-45deg)',
            border: '3px solid white',
            boxShadow: `0 4px 12px rgba(0,0,0,${shadowOpacity})`,
            position: 'absolute',
            top: '0px'
          }}
        />
        
        {/* 핀 내부 아이콘 */}
        <div
          style={{
            position: 'absolute',
            top: '6px',
            left: '50%',
            transform: 'translateX(-50%)',
            color: 'white',
            fontSize: '14px',
            fontWeight: 'bold',
            zIndex: 1
          }}
        >
          {transactionType === TransactionType.SALE ? '매' : 
           transactionType === TransactionType.JEONSE ? '전' : '월'}
        </div>

        {/* 가격 라벨 */}
        {isSelected && (
          <div
            style={{
              position: 'absolute',
              top: '45px',
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: baseColor,
              color: 'white',
              padding: '4px 8px',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: 'bold',
              whiteSpace: 'nowrap',
              boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
              zIndex: 2
            }}
          >
            {price}
          </div>
        )}
      </div>
    </div>
  );
};

// HTML 문자열로 핀 생성 (네이버 지도용)
export const createCustomPinHTML = (
  transactionType: TransactionType | string,
  isSelected: boolean = false,
  price: string = ''
): string => {
  // 문자열인 경우 enum으로 변환 시도
  let normalizedType: TransactionType;
  if (typeof transactionType === 'string') {
    normalizedType = transactionType as TransactionType;
  } else {
    normalizedType = transactionType;
  }

  const getTypeColor = () => {
    switch (normalizedType) {
      case TransactionType.SALE:
      case 'SALE':
        return '#ef4444';
      case TransactionType.JEONSE:
      case 'JEONSE':
        return '#3b82f6';
      case TransactionType.MONTHLY_RENT:
      case 'MONTHLY_RENT':
        return '#10b981';
      default:
        return '#6b7280';
    }
  };

  const getTypeText = () => {
    switch (normalizedType) {
      case TransactionType.SALE:
      case 'SALE':
        return '매';
      case TransactionType.JEONSE:
      case 'JEONSE':
        return '전';
      case TransactionType.MONTHLY_RENT:
      case 'MONTHLY_RENT':
        return '월';
      default:
        return '?';
    }
  };

  const baseColor = getTypeColor();
  const scale = isSelected ? 1.2 : 1;
  const shadowOpacity = isSelected ? 0.4 : 0.2;

  return `
    <div style="
      transform: scale(${scale});
      transition: all 0.2s ease-in-out;
      cursor: pointer;
      position: relative;
      width: 40px;
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
    ">
      <!-- 핀 바디 -->
      <div style="
        width: 32px;
        height: 32px;
        background-color: ${baseColor};
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 3px solid white;
        box-shadow: 0 4px 12px rgba(0,0,0,${shadowOpacity});
        position: absolute;
        top: 0px;
      "></div>
      
      <!-- 핀 내부 텍스트 -->
      <div style="
        position: absolute;
        top: 6px;
        left: 50%;
        transform: translateX(-50%);
        color: white;
        font-size: 14px;
        font-weight: bold;
        z-index: 1;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      ">
        ${getTypeText()}
      </div>

      ${isSelected && price ? `
      <!-- 가격 라벨 -->
      <div style="
        position: absolute;
        top: 45px;
        left: 50%;
        transform: translateX(-50%);
        background-color: ${baseColor};
        color: white;
        padding: 4px 8px;
        border-radius: 12px;
        font-size: 12px;
        font-weight: bold;
        white-space: nowrap;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        z-index: 2;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      ">
        ${price}
      </div>
      ` : ''}
    </div>
  `;
};
