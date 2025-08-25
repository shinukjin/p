import { TransactionType } from '../types/realestate';

export const formatPrice = (estate: any) => {
  const { transactionType, price, monthlyRent, deposit } = estate;
  
  if (transactionType === TransactionType.SALE) {
    return `매매 ${(price / 100000000).toFixed(1)}억`;
  } else if (transactionType === TransactionType.JEONSE) {
    return `전세 ${(price / 100000000).toFixed(1)}억`;
  } else {
    return `월세 ${(deposit / 10000).toFixed(0)}만/${(monthlyRent / 10000).toFixed(0)}만`;
  }
};

export const formatPriceDetail = (estate: any) => {
  const { transactionType, price, monthlyRent, deposit } = estate;
  
  switch (transactionType) {
    case TransactionType.SALE:
      return `매매가: ${price?.toLocaleString()}만원`;
    case TransactionType.JEONSE:
      return `전세금: ${price?.toLocaleString()}만원`;
    case TransactionType.MONTHLY_RENT:
      return `보증금: ${deposit?.toLocaleString()}만원 / 월세: ${monthlyRent?.toLocaleString()}만원`;
    default:
      return '';
  }
};
